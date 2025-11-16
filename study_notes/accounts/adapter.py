from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

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

        # Foto, se quiser usar
        picture = extra_data.get("picture")
        if picture:
            user.avatar_url = picture

        user.save()
        return user
