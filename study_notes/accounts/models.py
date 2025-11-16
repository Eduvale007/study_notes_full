from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Usuario(AbstractUser):

    username = None  

    nome = models.CharField(max_length=100)
    
    email = models.CharField(max_length=100, unique=True)

    # Senha local (quando o usuário cria conta com email/senha)
    senha_hash = models.CharField(max_length=255, null=True, blank=True)

    #  Google OAuth
    google_id = models.CharField(max_length=100, unique=True, null=True, blank=True)


    # De onde vem o login
    provedor = models.CharField(
        max_length=10,
        choices=[
            ('local', 'Local'),
            ('google', 'Google')
        ],
        default='local'
    )


    avatar_url = models.CharField(max_length=255, null=True, blank=True )

    criado_em = models.DateField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email