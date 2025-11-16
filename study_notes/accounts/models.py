from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Create your models here.
# ===================================
# (CORRIGIDO) O "Manager" 
# ===================================
class UsuarioManager(BaseUserManager):
    """
    Manager customizado para o modelo Usuario, onde o email é o identificador.
    """
    
    # (CORRIGIDO) A função agora aceita 'nome' diretamente
    def create_user(self, email, nome, password=None, **extra_fields):
        """
        Cria e salva um usuário normal com email e senha.
        """
        if not email:
            raise ValueError('O email é obrigatório')
        if not nome:
            raise ValueError('O nome é obrigatório')

        email = self.normalize_email(email)
        
        # Passa 'nome' diretamente para o modelo
        user = self.model(email=email, nome=nome, **extra_fields)
        user.set_password(password) # Criptografa a senha
        user.save(using=self._db)
        return user

    # (CORRIGIDO) A função agora aceita 'nome' diretamente
    def create_superuser(self, email, nome, password=None, **extra_fields):
        """
        Cria e salva um Superusuário. É esta função que o 'createsuperuser' vai chamar.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superusuário deve ter is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superusuário deve ter is_superuser=True.')

        # Reutiliza o create_user (e passa 'nome' adiante)
        return self.create_user(email, nome, password, **extra_fields)

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
    REQUIRED_FIELDS = ['nome']

    objects = UsuarioManager() #

    def __str__(self):
        return self.email