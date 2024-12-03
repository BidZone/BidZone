from django.contrib import admin
from .models import Korisnik, Aukcija, Ponuda, Slika

# Register your models here.
admin.site.register(Korisnik)
admin.site.register(Aukcija)
admin.site.register(Ponuda)
admin.site.register(Slika)