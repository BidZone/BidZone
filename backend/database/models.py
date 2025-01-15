from django.db import models
from cloudinary.models import CloudinaryField

# Create your models here.
class Korisnik(models.Model):
    id_korisnika = models.AutoField(primary_key=True)
    ime = models.CharField(max_length=50)
    prezime = models.CharField(max_length=50)
    oib = models.CharField(max_length=11, unique=True)
    adresa = models.TextField()
    balans = models.FloatField(default=0.0)
    zamrznuti_balans = models.FloatField(default=0.0) 
    korisnicko_ime = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    lozinka = models.CharField(max_length=255)
    potvrden = models.BooleanField(default=False)
    ocjena = models.FloatField(null=True, blank=True)
    datum_kreiranja = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_authenticated = models.BooleanField(default=True)
    def __str__(self):
        return f"{self.ime} {self.prezime}"
    
class Aukcija(models.Model):
    id_aukcije = models.AutoField(primary_key=True)
    aktivna = models.BooleanField(default=True)
    naziv = models.CharField(max_length=100)
    pocetna_cijena = models.DecimalField(max_digits=10, decimal_places=2)
    buy_now_cijena = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    trajanje = models.DurationField()
    informacije = models.TextField()
    datum = models.DateTimeField(auto_now_add=True)
    kreirao = models.ForeignKey('Korisnik', on_delete=models.CASCADE, null=True, blank=True)
    slika = CloudinaryField('image', null=True, blank=True)

    def __str__(self):
        return self.naziv

class Ponuda(models.Model):
    id_ponude = models.AutoField(primary_key=True)
    id_korisnika = models.ForeignKey('Korisnik', on_delete=models.CASCADE, related_name='ponude')
    id_aukcije = models.ForeignKey('Aukcija', on_delete=models.CASCADE, related_name='ponude')
    iznos = models.DecimalField(max_digits=10, decimal_places=2)
    vrijeme = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ponuda {self.id_ponude} - Iznos: {self.iznos}"
