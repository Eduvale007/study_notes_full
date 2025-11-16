from django.urls import path
from . import views

urlpatterns = [
    path('pagina_login/', views.pagina_login, name='pagina_login'),
    path("registrar/", views.registrar_usuario, name="registrar"),
    path("login/", views.login_usuario, name="login"),
    path("google-login/", views.google_login, name="google_login"),
    path("logout/", views.logout_usuario, name="logout"),
    path("perfil/", views.atualizar_perfil, name="perfil"),
    path("api/update_avatar/", views.update_avatar, name="update_avatar"),
]