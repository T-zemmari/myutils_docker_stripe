from django.contrib import admin
from .models import CustomUser

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'fecha_nacimiento', 'numero_telefono', 'plan_activo', 'plan_init', 'plan_end', 'days', 'es_admin')
    list_filter = ('es_admin',)  # Puedes agregar más filtros si es necesario
    search_fields = ('username', 'email', 'numero_telefono')  # Campos de búsqueda
    fieldsets = (
        ('Información Básica', {'fields': ('username', 'email', 'password')}),
        ('Información Personal', {'fields': ('first_name', 'last_name', 'fecha_nacimiento', 'numero_telefono')}),
        ('Información del Plan', {'fields': ('plan_activo', 'plan_init', 'plan_end', 'days')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions', 'es_admin')}),
        ('Fechas Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    # Comentario la acción predeterminada de eliminación
    # actions = ['delete_selected']

admin.site.register(CustomUser, CustomUserAdmin)

