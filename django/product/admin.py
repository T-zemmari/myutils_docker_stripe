from django.contrib import admin
from .models import ProductModel

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name','description', 'price','price_id','date_created','date_modified','days')
    # Otros campos que desees mostrar en la lista

admin.site.register(ProductModel, ProductAdmin)
