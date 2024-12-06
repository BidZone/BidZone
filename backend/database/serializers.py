from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from .models import Aukcija, Korisnik
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url

class KorisnikSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Korisnik
        fields = ['ime', 'prezime', 'oib', 'adresa', 'korisnicko_ime', 'email', 'password']
    
    def validate(self, attrs):
        password = attrs.get('password')
        if len(password) < 8:
            raise serializers.ValidationError({'password': 'Lozinka mora imati najmanje 8 znakova!'})
        return attrs
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        korisnik = Korisnik(**validated_data)
        korisnik.lozinka = make_password(password)
        korisnik.save()
        return korisnik

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only = True)

    class Meta:
        model = Korisnik
        fields = ['identifier', 'password']

    def validate(self, attrs):
        identifier = attrs.get('identifier')
        password = attrs.get('password')

        korisnik = Korisnik.objects.filter(email=identifier).first() or Korisnik.objects.filter(korisnicko_ime=identifier).first()

        if not korisnik:
            raise serializers.ValidationError({'identifier': "Korisnik s tim korisničkim imenom ili emailom ne postoji"})
        
        if not check_password(password, korisnik.lozinka):
            raise serializers.ValidationError({'password': 'Pogrešna lozinka.'})
        
        if not korisnik.potvrden:
            raise serializers.ValidationError({'identifier': 'Korisnik nije potvrdio svoj email.'})
        
        attrs['korisnik'] = korisnik
        return attrs

class AukcijaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aukcija
        fields = ['id_aukcije', 'aktivna', 'naziv', 'pocetna_cijena', 'buy_now_cijena', 'trajanje', 'informacije', 'datum', 'kreirao', 'slika']

    def create(self, validated_data):
        slika = validated_data.pop('slika', None)
        aukcija = Aukcija.objects.create(**validated_data)

        if slika:
            cloudinary_response = upload(slika)
            aukcija.slika = cloudinary_response.get('url')
            aukcija.save()

        return aukcija