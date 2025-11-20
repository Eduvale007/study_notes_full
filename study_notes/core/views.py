from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Resumo
from django.http import JsonResponse
import json

# Create your views here.
def home(request):
    resumos = []
    disciplinas = [] # Lista vazia por padrão
    
    if request.user.is_authenticated:
        # 1. Busca os resumos
        resumos = Resumo.objects.filter(usuario=request.user).order_by('-criado_em')
        
        # 2. (NOVO) Busca as disciplinas únicas (DISTINCT) deste usuário
        # O 'values_list' pega só o texto da coluna 'disciplina'
        # O 'flat=True' transforma em uma lista simples de strings ['História', 'Cálculo'...]
        lista_disciplinas_bruta = Resumo.objects.filter(usuario=request.user).values_list('disciplina', flat=True).distinct().order_by('disciplina')

        # 3. (OPCIONAL) Lógica para colocar ícones (igual ao seu JS)
        # Vamos criar uma lista de dicionários para o HTML usar
        icon_map = {
            'Artes': 'ph-paint-brush', 'Biologia': 'ph-dna', 'Filosofia': 'ph-scroll',
            'Física': 'ph-lightbulb', 'Geografia': 'ph-globe-stand', 'História': 'ph-books',
            'Idiomas': 'ph-translate', 'Literatura': 'ph-book-open', 'Matemática': 'ph-calculator', 
            'Cálculo': 'ph-function', 'Português': 'ph-text-aa', 'Química': 'ph-flask',
            'Sociologia': 'ph-users'
        }
        
        for nome in lista_disciplinas_bruta:
            # Pega o ícone do mapa ou usa um padrão
            icone = icon_map.get(nome, 'ph-file-text') 
            disciplinas.append({'nome': nome, 'icone': icone})

    return render(request, 'core/index.html', {
        'resumos': resumos, 
        'disciplinas': disciplinas # Mandamos a lista nova para o HTML
    })


# (NOVO) API PARA CRIAR RESUMO
@login_required
def create_summary(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            titulo = data.get('titulo')
            disciplina = data.get('disciplina')
            conteudo = data.get('conteudo')
            cor_tag = data.get('cor_tag')
            
            # Cria o resumo no banco ligado ao usuário
            novo_resumo = Resumo.objects.create(
                usuario=request.user,
                titulo=titulo,
                disciplina=disciplina,
                conteudo=conteudo,
                cor_tag=cor_tag
            )
            
            return JsonResponse({'success': True, 'id': novo_resumo.id})
            
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
            
    return JsonResponse({'success': False, 'error': 'Método não permitido'}, status=405)


# (NOVO) API PARA ATUALIZAR RESUMO
@login_required
def update_summary(request, pk):
    if request.method == 'POST':
        try:
            # Pega o resumo (só se pertencer ao usuário logado)
            resumo = get_object_or_404(Resumo, pk=pk, usuario=request.user)
            
            data = json.loads(request.body)
            
            resumo.titulo = data.get('titulo')
            resumo.disciplina = data.get('disciplina')
            resumo.conteudo = data.get('conteudo')
            resumo.cor_tag = data.get('cor_tag')
            
            resumo.save()
            
            return JsonResponse({'success': True})
            
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'error': 'Método não permitido'}, status=405)


@login_required
def delete_summary(request, pk):
    if request.method == 'DELETE':
        try:
            # Busca o resumo pelo ID (pk) e garante que pertence ao usuário logado
            resumo = get_object_or_404(Resumo, pk=pk, usuario=request.user)
            
            resumo.delete() # Apaga do banco
            
            return JsonResponse({'success': True})
            
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'error': 'Método não permitido'}, status=405)