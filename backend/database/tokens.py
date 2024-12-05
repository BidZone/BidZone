from django.contrib.auth.tokens import PasswordResetTokenGenerator

class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return str(user.id_korisnika) + str(timestamp) + str(user.potvrden)
    
token_generator = EmailVerificationTokenGenerator()