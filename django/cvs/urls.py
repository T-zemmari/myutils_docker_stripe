from django.urls import path 
from .views import *

app_name='cvs'

urlpatterns = [
    path('guardar_info_cv/<kw>',guardar_info_cv,name="guardar_info_cv"),
    path('obtener_info_cv/<kw>/', obtener_info_cv, name='obtener_info_cv'),
]