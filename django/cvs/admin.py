from django.contrib import admin
from .models import Curriculum

class CurriculumAdmin(admin.ModelAdmin):
    list_display = ('id', 'fecha_creacion', 'fecha_modificacion', 'veces_modificado', 'usuario', 'url_imagen')
    search_fields = ('usuario__username',)  # Puedes ajustar esto según tus necesidades

    actions = ['delete_selected']  # Habilita la opción de eliminar seleccionados

    def delete_selected(modeladmin, request, queryset):
        for obj in queryset:
            # Elimina el archivo asociado
            if obj.url_imagen and obj.url_imagen.path:
                obj.url_imagen.delete(save=False)  # Borra la imagen asociada al curriculum
            obj.delete()

    delete_selected.short_description = "Eliminar elementos seleccionados"

admin.site.register(Curriculum, CurriculumAdmin)
