from rest_framework import status, generics
from rest_framework.response import Response
from .serializers import KorisnikSerializer

from django.conf import settings
from django.core.mail import send_mail, EmailMultiAlternatives
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import token_generator
from .models import Korisnik
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.shortcuts import redirect
from django.contrib import messages


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
            messages.success(request, "Vaš email je potvrđen. Sada se možete prijaviti.")
            return redirect('login')
        else:
            messages.error(request, "Token je istekao ili je nevažeći.")
            return redirect('register')
    
    except (TypeError, ValueError, OverflowError, Korisnik.DoesNotExist):
        messages.error(request, "Nevažeći registracijski link.")
        return redirect('register')
