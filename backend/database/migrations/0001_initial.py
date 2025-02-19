# Generated by Django 5.1.2 on 2024-12-03 18:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Aukcija',
            fields=[
                ('id_aukcije', models.AutoField(primary_key=True, serialize=False)),
                ('aktivna', models.BooleanField(default=True)),
                ('naziv', models.CharField(max_length=100)),
                ('pocetna_cijena', models.DecimalField(decimal_places=2, max_digits=10)),
                ('buy_now_cijena', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('trajanje', models.DurationField()),
                ('informacije', models.TextField()),
                ('datum', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Korisnik',
            fields=[
                ('id_korisnika', models.AutoField(primary_key=True, serialize=False)),
                ('ime', models.CharField(max_length=50)),
                ('prezime', models.CharField(max_length=50)),
                ('oib', models.CharField(max_length=11, unique=True)),
                ('adresa', models.TextField()),
                ('balans', models.FloatField(default=0.0)),
                ('korisnicko_ime', models.CharField(max_length=50, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('lozinka', models.CharField(max_length=255)),
                ('potvrden', models.BooleanField(default=False)),
                ('ocjena', models.FloatField(blank=True, null=True)),
                ('datum_kreiranja', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Ponuda',
            fields=[
                ('id_ponude', models.AutoField(primary_key=True, serialize=False)),
                ('iznos', models.DecimalField(decimal_places=2, max_digits=10)),
                ('vrijeme', models.DateTimeField(auto_now_add=True)),
                ('id_aukcije', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ponude', to='database.aukcija')),
                ('id_korisnika', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ponude', to='database.korisnik')),
            ],
        ),
        migrations.CreateModel(
            name='Slika',
            fields=[
                ('id_slike', models.AutoField(primary_key=True, serialize=False)),
                ('link', models.URLField()),
                ('id_aukcije', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='slike', to='database.aukcija')),
            ],
        ),
    ]