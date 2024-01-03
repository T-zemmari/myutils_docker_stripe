# celery.py

from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Establece la variable de entorno DJANGO_SETTINGS_MODULE para que Celery conozca la configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'utils_tar.settings')

# Crea una instancia de la aplicación Celery
app = Celery('utils_tar')

# Carga las configuraciones de Celery desde el archivo settings.py
app.config_from_object('django.conf:settings', namespace='CELERY')

# Configuración del broker Redis
app.conf.broker_url = 'redis://localhost:6379/0'  # Cambia esta URL según tu configuración de Redis


# Busca las tareas en todos los archivos llamados tasks.py en las aplicaciones de Django
app.autodiscover_tasks()
