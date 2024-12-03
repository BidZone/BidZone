from rest_framework import status, generics
from rest_framework.response import Response
from .serializers import KorisnikSerializer

# Create your views here.
class RegisterView(generics.CreateAPIView):
    serializer_class = KorisnikSerializer
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            korisnik = serializer.save()
            return Response({
                "message": "Korisnik uspješno registriran.",
                "user": {
                    "id_korisnika": korisnik.id_korisnika,
                    "korisnicko_ime": korisnik.korisnicko_ime,
                    "email": korisnik.email
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTPS_400_BAD_REQUEST)
    