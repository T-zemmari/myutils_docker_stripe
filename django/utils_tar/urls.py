
from django.contrib import admin
from django.urls import path,include
from product.views import (
    CreateCheckoutSessionView,
)


from .view_custom import *
from django.conf.urls.static import static
from django.conf import settings



urlpatterns = [
    path('', home,name="home"),
    path('logout/', logout_view,name="logout"),
    path('admin/', admin.site.urls),
    path('users/', include('customerUser.urls')),
    path('accounts/', include('allauth.urls')),
    path('accounts/', include('allauth.socialaccount.urls')),
    path('create-checkout-session/<pk>/',CreateCheckoutSessionView.as_view(),name="checkout"),
    path('products/',include('product.urls')),
    path('success/',ir_a_success,name="success"),
    path('cancel/',ir_a_cancel,name="canceled"),
    path('unir-pdf/',combinar_pdfs,name="unir_pdf"),
    path('descargar-pdf/<str:filename>/', descargar_pdf_combinado, name='descargar_pdf_combinado'),
    path('servicios/', include('servicios.urls')),
    path('acerca-de/', vista_acerca_de,name="vista_acerca_de"),
    path('contacto/', vista_contacto,name="vista_contacto"),
    path('contacto/enviar_email/', enviar_correo_desde_formulario,name="enviar_info_contacto"),
    path('cvs/', include('cvs.urls')),
    path('media/carp_pdfs/<str:file_name>/', serve_pdf, name='serve_pdf'),
    path('media/carp_vids/yt/<str:file_name>/', serve_vids, name='serve_vids'),
    path('media/carp_imgs/<str:file_name>/', serve_imgs, name='serve_imgs'),
    path('media/eliminar_archivo/<int:pk>/', eliminar_archivo_media, name='eliminar_archivo_media'),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(r'^uploads/(?P<path>.*)$', document_root=settings.MEDIA_ROOT)



