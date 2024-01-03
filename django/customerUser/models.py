from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext as _

class CustomUser(AbstractUser):
    fecha_nacimiento = models.DateField(null=True, blank=False)
    numero_telefono = models.CharField(max_length=15, null=True,blank=True)
    plan_activo = models.ForeignKey('product.ProductModel', on_delete=models.SET_NULL, null=True, blank=True)
    plan_init = models.DateTimeField(null=True, blank=True) 
    plan_end = models.DateTimeField(null=True, blank=True)
    days = models.PositiveIntegerField(_("Days"), default=0)
    activar_plan_temporalmente = models.BooleanField(default=False)
    es_admin=models.BooleanField(default=0)


