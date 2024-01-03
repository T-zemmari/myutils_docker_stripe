from django.urls import path 
from .views import *
from django.contrib.auth.views import LoginView

app_name='customerUser'

urlpatterns = [
    path('registro/',register_user,name="registro"),
    path('login/', login_user, name='login'),
    path('perfil/', ver_mi_perfil, name='mi-perfil'),
    path('listado/', listado_de_usuarios, name='usuarios_listado'),
    path('desactivar_plan/<int:user_id>/', desactivar_plan_manualmente, name='desactivar_plan_manualmente'),
    path('activar_plan/<int:user_id>/', activar_plan_manualmente, name='activar_plan_manualmente'),

]
