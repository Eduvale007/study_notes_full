from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib import messages

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        # Primeiro salva o usuário padrão do allauth
        user = super().save_user(request, sociallogin, form)

        # Dados completos enviados pelo Google
        extra_data = sociallogin.account.extra_data

        # Nome completo ou nome separado
        user.nome = (
            extra_data.get("name")
            or extra_data.get("given_name")
            or ""
        )

        # ID único do Google
        user.google_id = extra_data.get("sub")

        # Marca o provedor
        user.provedor = "google"

        # Foto
        picture = extra_data.get("picture")
        if picture:
            user.avatar_url = picture

        user.save()
        return user



    def add_message(self, request, level, message_template, message_context=None, extra_tags=''):
        # Se a mensagem for de "Sucesso" (verde)
        if level == messages.SUCCESS:
            return 
        
        # Se for Erro ou Aviso
        super().add_message(request, level, message_template, message_context, extra_tags)