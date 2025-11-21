from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout , update_session_auth_hash
from django.contrib.auth.hashers import make_password, check_password # <-- IMPORT ADICIONADO
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.cache import cache
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

        #Verifica se o checkbox veio marcado
        termos_aceitos = request.POST.get('termos') # Retorna 'on' se marcado, None se não

        # Validação dos Termos
        if not termos_aceitos:
            messages.error(request, "Você precisa aceitar os Termos de Uso para criar uma conta.")
            return redirect('registrar')

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

       
        return redirect('login')

    # A view 'registrar_usuario' deve renderizar o template de login.html também
    # (Já que seu formulário é dinâmico)
    return render(request, 'accounts/index.html')



def login_usuario(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('senha')

        # --- CONFIGURAÇÕES DE SEGURANÇA ---
        MAX_TENTATIVAS = 5
        TEMPO_BLOQUEIO = 60 * 60  # 1 hora em segundos (3600)
        
        # Cria uma chave única para identificar as tentativas deste e-mail
        cache_key = f"login_attempts_{email}"
        
        # 1. Verifica se o usuário já está bloqueado
        tentativas_atuais = cache.get(cache_key, 0)
        
        if tentativas_atuais >= MAX_TENTATIVAS:
            messages.error(request, "Muitas tentativas falhas. Sua conta foi temporariamente bloqueada por 1 hora.")
            return render(request, 'accounts/index.html')

        try:
            user = Usuario.objects.get(email=email)

            # 2. Verifica a senha
            if user.provedor == 'local' and check_password(senha, user.senha_hash):
                
                # SUCESSO: Limpa o histórico de erros (zera o contador)
                cache.delete(cache_key)
                
                user.backend = 'django.contrib.auth.backends.ModelBackend'
                login(request, user)
                return redirect('home') 
            else:
                # SENHA ERRADA
                raise ValueError("Senha incorreta") # Força ir para o except abaixo

        except (Usuario.DoesNotExist, ValueError):
            # FALHA (Usuário não existe OU Senha errada)
            
            # Incrementa o contador de erros no cache
            novas_tentativas = tentativas_atuais + 1
            
            # Salva no cache com o tempo de expiração de 1 hora
            cache.set(cache_key, novas_tentativas, TEMPO_BLOQUEIO)
            
            tentativas_restantes = MAX_TENTATIVAS - novas_tentativas
            
            if tentativas_restantes > 0:
                messages.error(request, f"Email ou senha incorretos.")
            else:
                messages.error(request, "Muitas tentativas. Conta bloqueada por 1 hora.")
            
            return redirect('login')

    return render(request, 'accounts/index.html')





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

#  VIEW DA API PARA ATUALIZAR O AVATAR
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


@login_required
def configuracoes(request):
    user = request.user

    if request.method == 'POST':
        # 1. Atualizar Nome
        novo_nome = request.POST.get('nome')
        if novo_nome:
            user.nome = novo_nome
        
        # 2. Atualizar Senha
        nova_senha = request.POST.get('senha')
        confirmar_senha = request.POST.get('confirmar_senha')
        
        if nova_senha:
            if user.provedor == 'google':
                messages.error(request, "Contas do Google não podem alterar senha aqui.")
            elif nova_senha != confirmar_senha:
                messages.error(request, "As senhas não conferem.")
            else:
                user.set_password(nova_senha)
                update_session_auth_hash(request, user)
                messages.success(request, "Senha alterada com sucesso!")

        user.save()
        messages.success(request, "Perfil atualizado!")
        return redirect('home')

    return render(request, 'accounts/settings.html')


def termos_view(request):
  
    return render(request, 'accounts/termos.html')