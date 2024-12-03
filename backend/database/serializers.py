from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Korisnik

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
    