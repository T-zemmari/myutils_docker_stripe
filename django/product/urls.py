from django.urls import path

from .views import *

app_name='product'

urlpatterns = [
     path('',products_view,name="productos"),
     path('nuevo_producto/',nuevo_producto,name="nuevo_producto"),
]
