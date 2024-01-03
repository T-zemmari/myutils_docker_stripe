from django.contrib import admin
from .models import UtilMediaModel
import os

class UtilMediaModelAdmin(admin.ModelAdmin):
    list_display = ('url', 'file_name', 'file_type', 'user', 'date_created', 'date_modified')
    search_fields = ('url', 'file_name', 'file_type', 'user__username')  # Puedes ajustar esto según tus necesidades

    actions = ['delete_selected']  # Habilita la opción de eliminar seleccionados

    def delete_selected(modeladmin, request, queryset):
        for obj in queryset:
            # Elimina el archivo asociado
            if os.path.exists(obj.url):  # Verifica si el archivo existe antes de intentar eliminarlo
                os.remove(obj.url)
            obj.delete()

    delete_selected.short_description = "Eliminar elementos seleccionados"

admin.site.register(UtilMediaModel, UtilMediaModelAdmin)
