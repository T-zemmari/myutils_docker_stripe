from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

@csrf_exempt
def toggle_delete_pdfs(request):
    if request.method == 'POST':
        # Cambia el estado de la tarea Celery según lo que se haya enviado en la solicitud POST
        new_state = request.POST.get('state', '').lower()
        if new_state == 'enable':
            settings.CELERY_DELETE_PDFS_ENABLED = True
        elif new_state == 'disable':
            settings.CELERY_DELETE_PDFS_ENABLED = False
        else:
            return JsonResponse({'error': 'Estado no válido'}, status=400)

    return JsonResponse({'status': 'success', 'enabled': settings.CELERY_DELETE_PDFS_ENABLED})

