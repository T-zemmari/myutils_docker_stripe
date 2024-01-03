from django.db import models
from customerUser.models import CustomUser
from util_media.models import UtilMediaModel
import uuid
class ProyectoModel(models.Model):
    nombre = models.CharField(max_length=255, blank=False, null=False)
    referencia_proyecto = models.UUIDField(default=uuid.uuid4, blank=False, null=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    usuario = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    media = models.ManyToManyField(UtilMediaModel, blank=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre
    

class CapturaModel(models.Model):
    url_captura = models.CharField(max_length=255, blank=False, null=False)
    nombre_captura = models.CharField(max_length=255, blank=False, null=False)
    archivo = models.ForeignKey(UtilMediaModel, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)
    tiempo = models.FloatField(default=0.0)

    def __str__(self):
        return self.nombre_captura



class Firma(models.Model):
    pdf = models.FileField(upload_to='pdfs/')
    imagen_firma = models.ImageField(upload_to='firmas/', blank=True, null=True)
    usuario = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)

