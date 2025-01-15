
from .models import Aukcija, Korisnik
from .serializers import AukcijaSerializer, KorisnikSerializer, LoginSerializer, PaymentSerializer, WithdrawalSerializer
from .tokens import token_generator

from datetime import datetime, timedelta

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.core.mail import send_mail, EmailMultiAlternatives
from django.http import HttpResponse
from django.shortcuts import redirect
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils import timezone

from rest_framework import status, generics, permissions, serializers
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes

from .authentication import CustJWTAuthentication

import jwt

class RegisterView(generics.CreateAPIView):
    serializer_class = KorisnikSerializer
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            korisnik = serializer.save()

            # Pošalji e-mail za verifikaciju
            send_verification_email(korisnik, request)

            return Response({
                "message": "Korisnik uspješno registriran. Provjerite email za verifikaciju.",
                "user": {
                    "id_korisnika": korisnik.id_korisnika,
                    "korisnicko_ime": korisnik.korisnicko_ime,
                    "email": korisnik.email
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    serializer_class = LoginSerializer
    permission_classes = []

    def post(self, request, *args, **kwargs):
        identifier = request.data.get('identifier')
        password = request.data.get('password')

        if not identifier or not password:
            return Response(
                {"error": "Molimo unesite korisničko ime ili email i lozinku."},
                status=status.HTTP_400_BAD_REQUEST,
            )
    
        korisnik = Korisnik.objects.filter(
            email=identifier
        ).first() or Korisnik.objects.filter(
            korisnicko_ime=identifier
        ).first()

        if not korisnik:
            return Response(
                {"error": "Korisnik s navedenim podatcima ne postoji."},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        if not check_password(password, korisnik.lozinka):
            return Response(
                {"error": "Pogrešna lozinka"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        
        if not korisnik.potvrden:
            return Response(
                {"error": "Korisnički račun nije potvrđen."},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        payload = {
            'id_korisnika': korisnik.id_korisnika,
            # 'jti': str(uuid.uuid4()),
            'token_type': 'access',
            'ime': korisnik.ime,
            'exp': timezone.now() + timedelta(days=1), # token traje 1 dan
            'iat': timezone.now()
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        return Response({
            "message": "Prijava uspješna.",
            "token": token,
            "user": {
                "id_korisnika": korisnik.id_korisnika,
                "korisnicko_ime": korisnik.korisnicko_ime,
                "email": korisnik.email,
            }
        }, status=status.HTTP_200_OK)
        
class AukcijaCreateView(generics.CreateAPIView):
    authentication_classes = [CustJWTAuthentication]
    serializer_class = AukcijaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = AukcijaSerializer(data=request.data)

        if serializer.is_valid():
            korisnik = request.user
            serializer.save(kreirao=korisnik)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_auctions(request):
    auctions = Aukcija.objects.filter(aktivna=True).order_by("-datum")
    serializer = AukcijaSerializer(auctions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def deposit_money(request):
    authentication_classes = [CustJWTAuthentication]
    serializer = PaymentSerializer(data=request.data)
    permission_classes = [permissions.IsAuthenticated]

    if serializer.is_valid():
        amount = serializer.validated_data['amount']
        korisnik = request.user
        
        korisnik.balans += amount
        korisnik.save()

        return Response({
            "message": "Uplata je uspješno izvršena.",
            "new_balance": korisnik.balans
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def withdraw_money(request):
    authentication_classes = [CustJWTAuthentication]
    serializer = WithdrawalSerializer(data=request.data)
    permission_classes = [permissions.IsAuthenticated]

    if serializer.is_valid():
        amount = serializer.validated_data['amount']
        korisnik = request.user

        korisnik.balans -= amount
        korisnik.save()

        return Response({
            "message": "Isplata je uspješno izvršena.",
            "new_balance": korisnik.balans
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def send_verification_email(user, request):
    # Generiraj token i uid
    token = token_generator.make_token(user)
    uid = urlsafe_base64_encode(str(user.id_korisnika).encode())
    
    # Generiraj verifikacijski link
    domain = request.get_host()  # Dohvaća host iz zahtjeva
    verification_link = reverse('verify_email', kwargs={'uidb64': uid, 'token': token})
    full_link = f"http://{domain}{verification_link}"

    # Pripremi email
    subject = "Potvrdite svoj email"
    
    # Renderiraj HTML šablon
    html_content = render_to_string('email/verification_email.html', {
        'user': user,
        'verification_link': full_link,
    })
    
    # Dodaj plain text verziju za fallback
    text_content = f"""
    Pozdrav {user.korisnicko_ime},

    Hvala što ste se registrirali na BidZone! Kliknite na link u nastavku da biste potvrdili svoj email i završili registraciju:

    {full_link}

    Ukoliko se niste Vi registrirali, možete zanemariti ovaj mail.
    """

    # Kreiraj email poruku
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,  # Plain text sadržaj
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    
    # Dodaj HTML sadržaj
    email.attach_alternative(html_content, "text/html")
    
    # Pošalji email
    email.send()


def verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = Korisnik.objects.get(id_korisnika=uid)

        if token_generator.check_token(user, token):
            user.potvrden = True
            user.save()

            # Postavi poruku uspješne verifikacije
            messages.success(request, "Vaš email je potvrđen. Sada se možete prijaviti.")

            # Redirekt na glavnu stranicu ili stranicu za potvrdu
            frontend_website = getattr(settings, "FRONTEND_WEBSITE")
            return redirect(f"{frontend_website}/email-verified")  # Ovdje /email-verified može biti putanja za poruku
        else:
            messages.error(request, "Token je istekao ili je nevažeći.")
            return redirect('register')
    
    except (TypeError, ValueError, OverflowError, ObjectDoesNotExist):
        messages.error(request, "Nevažeći registracijski link.")
        return redirect('register')