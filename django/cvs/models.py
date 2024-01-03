from django.db import models
from customerUser.models import CustomUser

class Curriculum(models.Model):
    id = models.AutoField(primary_key=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    veces_modificado = models.IntegerField(default=0)
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  
    url_imagen = models.ImageField(upload_to='cv_images/', null=True, blank=True)

    def __str__(self):
        return f"Curriculum {self.id} - Usuario: {self.usuario.username}"

class InformacionUsuario(models.Model):
    curriculum = models.OneToOneField(Curriculum, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(max_length=255, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=255, null=True, blank=True)
    img_cv = models.ImageField(upload_to='user_images/', null=True, blank=True)

class DatosAcademicos(models.Model):
    curriculum = models.ForeignKey(Curriculum, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=255, null=True, blank=True)
    inicio = models.DateTimeField(null=False, blank=False)
    fin = models.DateTimeField(null=False, blank=False)
    escuela = models.CharField(max_length=255, null=False, blank=False)

class ExperienciaLaboral(models.Model):
    curriculum = models.ForeignKey(Curriculum, on_delete=models.CASCADE)
    puesto = models.CharField(max_length=255, null=True, blank=True)
    inicio = models.DateTimeField(null=False, blank=False)
    fin = models.DateTimeField(null=False, blank=False)
    empresa = models.CharField(max_length=255, null=False, blank=False)
    trabajo_realizado = models.TextField(max_length=500, null=False, blank=False)

class Idiomas(models.Model):
    curriculum = models.ForeignKey(Curriculum, on_delete=models.CASCADE)
    idioma = models.CharField(max_length=255, null=True, blank=True)
    nivel = models.CharField(max_length=255, null=True, blank=True)

class Skills(models.Model):
    curriculum = models.ForeignKey(Curriculum, on_delete=models.CASCADE)    
    skill = models.CharField(max_length=255, null=True, blank=True)    
    url_skill = models.CharField(max_length=255, null=True, blank=True)
