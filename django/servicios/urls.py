from django.urls import path,re_path
from .views import *
from django.conf.urls.static import static

urlpatterns = [
    path('',vista_servicios,name="vista_servicios"),
    path('documentos/curriculums/',vista_servicios_curriculumns,name="vista_servicios_curriculumns"),
    path('documentos/facturas/',vista_servicios_facturas,name="vista_servicios_facturas"),
    path('documentos/albaranes/',vista_servicios_albaranes,name="vista_servicios_albaranes"),
    path('documentos/carpetas/',vista_servicios_carpetas,name="vista_servicios_carpetas"),
    path('documentos/informacion_personal/',vista_servicios_informacion_personal,name="vista_servicios_informacion_personal"),
    path('documentos/historico/',vista_servicios_historico,name="vista_servicios_historico"),

    path('documentos/unir_pdf/',vista_servicios_unir_pdf,name="vista_servicios_documentos_unir_pdf"),
    #path('documentos/firmar_pdf/',vista_servicios_firmar_pdf,name="vista_servicios_documentos_firmar_pdf"),
    path('documentos/firmar_pdf/', firma_view, name='firma_view'),
    path('documentos/convertir_a_pdf/',vista_servicios_convertir_pdf,name="vista_servicios_documentos_convertir_pdf"),
    path('documentos/convertir_documentos_a_pdf/',convertir_documento_a_pdf,name="convertir_documentos_a_pdf"),
    path('documentos/cargar_firma/',vista_servicios_cargar_firma,name="vista_servicios_cargar_firma"),
  
    path('imagenes/eliminar/',eliminar_archivo_documento,name="eliminar_archivo_documento"),
   
    path('imagenes/modificar_res/',vista_servicios_modificar_res,name="vista_servicios_modi_resolucion"),
    path('imagenes/eliminar_fondo/',vista_servicios_eliminar_fondo,name="vista_servicios_eliminar_fondo"),
    path('imagenes/eliminar_fondo/rmv/',eliminar_fondo_de_imagenes,name="eliminar_fondo_de_imagenes"),
    path('superponer_pdf_firma/',superponer_pdf_firma,name="guardar_archivos_temporales"),
    path('videos/descargar_yt/',vista_servicios_descargar_yt,name="servicios_descargar_vid_yt"),
    path('imagenes/img_to_pdf/',vista_servicios_img_to_pdf,name="vista_servicios_documentos_img_to_pdf"),
    path('imagenes/convertir_img_to_pdf/',convertir_imagenes_a_pdf,name="convertir_imagenes_a_pdf"),


    path('videos/unir_videos/',vista_unir_videos,name="vista_servicios_unir_videos"),   
    path('videos/accion_unir_videos/',unir_videos,name="servicio_unir_videos"),
    path('videos/eliminar_video_unificado/<str:file_name>/',eliminar_video_unificado,name="eliminar_video_unificado"),
    
    #re_path(r'^videos/editor/(?P<proyecto_ref>[\w-]+)/$', vista_servicios_editor_videos, name="vista_servicios_editor_videos"),
    path('videos/editor/proyecto/obtener_archivos/', obtener_archivos_del_proyecto, name="obtener_archivos_del_proyecto"),
    path('videos/editor/crear_capturas/', crear_capturas_de_un_video, name="crear_capturas_de_un_video"),
    path('videos/editor/proyecto/eliminar_archivo/', eliminar_archivo_de_un_proyecto, name="eliminar_archivo_de_un_proyecto"),
    path('videos/editor/subir_archivos/', subir_archivos_editor, name="subir_archivos_editor"),
    
    path('videos/editor/crear_nuevo_proyecto/',crear_un_nuevo_proyecto_de_edicion,name="crear_un_nuevo_proyecto_de_edicion"),
    path('videos/editor/eliminar_proyecto/<str:referencia_proyecto>/',eliminar_proyecto_de_edicion,name="eliminar_proyecto_de_edicion"),
    path('videos/editor/', vista_servicios_editor_videos, name="vista_servicios_editor_videos"),
    

    path('video/download-yt/', download_youtube, name='download_youtube'),
    path('video/download-yt/get-resolutions/', get_resolutions, name='obtener_resoluciones'),
    path('video/download-yt/delete-file/', delete_video_file, name='eliminar_archivo_yt'),


    path('imagen/modificar_resolucion/', modificar_resolucion_imagen, name='modificar_resolucion'),
    path('imagen/delete-file/', delete_img_file, name='eliminar_archivo_img'),

    path('videos/editor/<str:proyecto_ref>/', vista_servicios_editor_videos, name="vista_servicios_editor_videos_with_ref"),
    path('imagenes/convertir_img_to_pdf/<str:filename>/',descargar_pdf_imagenes_yt,name="descargar_pdf_imagenes_yt"),
    path('videos/accion_unir_videos/<str:filename>/',descargar_video_unificado,name="servicio_descargar_video_unificado"),
    path('imagenes/eliminar_fondo/rmv/<str:filename>/',descargar_img_sin_fondo,name="descargar_img_sin_fondo"),
    path('imagen/modificar_resolucion/<str:filename>/', descargar_archivo_final_resolucion_modificada, name='descargar_archivo_img_modificado'),
    path('video/download-yt/files/<str:filename>/', descargar_video_yt, name='descargar_yt_vid'),
    path('videos/accion_unir_videos/<str:filename>/',descargar_video_unificado,name="servicio_descargar_video_unificado"),
    path('documentos/convertir_documentos_a_pdf/<str:filename>/',descargar_pdf_documento_convertido,name="descargar_pdf_documento_convertido"),


    


   
]


#urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS)

