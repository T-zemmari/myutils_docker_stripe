# util_media/tasks.py

import os
from celery import shared_task
from django.conf import settings
from .models import UtilMediaModel

@shared_task
def delete_old_pdfs():
    if not settings.CELERY_DELETE_PDFS_ENABLED:
        # Si la tarea está deshabilitada, simplemente regresa sin hacer nada
        return
    
    # Ruta a la carpeta donde se almacenan los archivos PDF
    pdf_folder = os.path.join(settings.MEDIA_ROOT, 'carp_pdfs')
    
    # Eliminar archivos PDF más antiguos de la carpeta
    for filename in os.listdir(pdf_folder):
        if filename.endswith('.pdf'):
            file_path = os.path.join(pdf_folder, filename)
            try:
                os.remove(file_path)
            except Exception as e:
                # Maneja cualquier excepción que pueda ocurrir al eliminar el archivo
                print(f"No se pudo eliminar {file_path}: {str(e)}")

    # Eliminar registros de la base de datos correspondientes a los archivos PDF
    UtilMediaModel.objects.filter(file_type='pdf').delete()
