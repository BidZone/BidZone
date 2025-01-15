from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Korisnik

class CustJWTAuthentication(JWTAuthentication):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.user_model = Korisnik