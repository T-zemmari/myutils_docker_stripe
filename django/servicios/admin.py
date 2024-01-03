from django.contrib import admin
from .models import ProyectoModel,CapturaModel


class ProyectoAdmin(admin.ModelAdmin):
    list_display = ('nombre','referencia_proyecto','fecha_creacion', 'fecha_modificacion','usuario','media','activo')
    # Otros campos que desees mostrar en la lista

admin.site.register(ProyectoModel, ProyectoAdmin)


class CapturasAdmin(admin.ModelAdmin):
    list_display = ('url_captura','nombre_captura','fecha_creacion', 'archivo','fecha_modificacion','activo','tiempo')
    # Otros campos que desees mostrar en la lista

admin.site.register(CapturaModel, CapturasAdmin)
