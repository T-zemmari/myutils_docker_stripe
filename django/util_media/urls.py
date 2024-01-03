# util_media/urls.py

from django.urls import path
from . import views

urlpatterns = [
    # Otras URL de tu aplicación...
    path('toggle_delete_pdfs/', views.toggle_delete_pdfs, name='toggle_delete_pdfs'),
]


# POST /toggle_delete_pdfs/?state=enable para habilitar la tarea.
# POST /toggle_delete_pdfs/?state=disable para deshabilitar la tarea.