from django.db import models
from django.conf import settings

# Create your models here.

class Resumo(models.Model):
    # AQUI ESTÁ A REFERÊNCIA CERTA:
    # Usamos settings.AUTH_USER_MODEL em vez de importar a classe Usuario diretamente.
    # Isso evita erros de "importação circular" e é a boa prática do Django.
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, # Se apagar o usuário, apaga os resumos dele
        related_name='resumos'
    )
    
    titulo = models.CharField(max_length=200)
    disciplina = models.CharField(max_length=100) # Ex: "História", "Física"
    
    # O conteúdo pode ser vazio no início (blank=True, null=True)
    conteudo = models.TextField(blank=True, null=True)
    
    # A cor do card (Ex: 'card-blue', 'card-green')
    cor_tag = models.CharField(max_length=50, default='card-blue')
    
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.titulo} ({self.disciplina})"