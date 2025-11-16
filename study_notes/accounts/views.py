from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password, check_password # <-- IMPORT ADICIONADO
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json

from .models import Usuario
import requests

# Create your views here.


def pagina_login(request):
    return render(request, 'accounts/index.html')


def registrar_usuario(request):
    if request.method == 'POST':
        nome = request.POST.get('nome')
        email = request.POST.get('email')
        senha = request.POST.get('senha')

        if Usuario.objects.filter(email=email).exists():
            messages.error(request, "Email já está em uso.")
            return redirect('registrar') # CUIDADO: a rota é 'registrar' ou 'login'?

        usuario = Usuario(
            nome=nome,
            email=email,
            senha_hash=make_password(senha),
            provedor="local"
        )
        usuario.save()

        messages.success(request, "Conta criada com sucesso! Faça login.")
        return redirect('login')

    # A view 'registrar_usuario' deve renderizar o template de login.html também
    # (Já que seu formulário é dinâmico)
    return render(request, 'accounts/index.html')


# ===================================
# FUNÇÃO CORRIGIDA
# ===================================
def login_usuario(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('senha')

        try:
            # 1. Tenta encontrar o usuário pelo email
            user = Usuario.objects.get(email=email)

            # 2. Checa se o usuário é "local" e se a senha bate
            #    A sua view 'registrar_usuario' salva a senha em 'senha_hash'
            if user.provedor == 'local' and check_password(senha, user.senha_hash):
                
                # 3. Se tudo deu certo, faz o login
                # (Importante: precisamos logar o usuário com o backend 'ModelBackend'
                #  já que não usamos authenticate)
                user.backend = 'django.contrib.auth.backends.ModelBackend' # Linha necessária
                login(request, user)
                
                # CUIDADO: O 'redirect' deve ser para o NOME da sua rota do painel
                # Se for o app principal, o nome da rota é 'index' ou 'home'?
                # Vou manter 'dashboard' como placeholder.
                return redirect('/') 
            else:
                # Senha incorreta ou usuário do Google tentando logar localmente
                messages.error(request, "Email ou senha incorretos.")
                return redirect('login')

        except Usuario.DoesNotExist:
            # Usuário não encontrado
            messages.error(request, "Email ou senha incorretos.")
            return redirect('login')

    return render(request, 'accounts/index.html')
# ===================================
# FIM DA CORREÇÃO
# ===================================




def logout_usuario(request):
    logout(request)
    return redirect('login')


def atualizar_perfil(request):
    if not request.user.is_authenticated:
        return redirect('login')

    if request.method == 'POST':
        user = request.user

        user.nome = request.POST.get('nome')
        user.avatar_url = request.POST.get('avatar_url')

        # Só atualiza senha se for usuário local
        nova_senha = request.POST.get('nova_senha')
        if user.provedor == "local" and nova_senha:
            user.senha_hash = make_password(nova_senha)

        user.save()
        messages.success(request, "Perfil atualizado!")
        return redirect('perfil')

    return render(request, 'accounts/perfil.html')


# accounts/views.py

# (NOVO) VIEW DA API PARA ATUALIZAR O AVATAR
@login_required # Garante que só usuários logados possam chamar
def update_avatar(request):
    
    # 1. Garante que é um POST (segurança)
    if request.method == 'POST':
        try:
            # 2. Lê os dados JSON enviados pelo JavaScript
            data = json.loads(request.body)
            avatar_url = data.get('avatar_url')
            
            if not avatar_url:
                return JsonResponse({'success': False, 'error': 'Nenhuma URL de avatar enviada.'}, status=400)

            # 3. Atualiza o usuário logado
            user = request.user
            user.avatar_url = avatar_url
            user.save()
            
            # 4. Retorna uma resposta de sucesso
            return JsonResponse({'success': True, 'avatar_url': avatar_url})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    
    return JsonResponse({'success': False, 'error': 'Método GET não permitido.'}, status=405)