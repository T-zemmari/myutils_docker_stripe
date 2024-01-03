import os
import mimetypes
import uuid
import json
import math
import shutil
import textwrap
import base64
import cv2
import numpy as np
import imageio
import subprocess
import io



from uuid import UUID
from django.conf import settings
from PIL import Image as PILImage
from io import BytesIO
from django.shortcuts import render,redirect,get_object_or_404,reverse
from django.http import HttpResponse, JsonResponse,FileResponse,HttpResponseNotFound,HttpResponseBadRequest,HttpResponseRedirect
from io import BytesIO
from reportlab.lib.pagesizes import letter,landscape, A4
from reportlab.platypus import SimpleDocTemplate,Spacer,Image as ReportImage
from django.core.files.storage import default_storage
from reportlab.pdfgen import canvas
from moviepy.editor import VideoFileClip, concatenate_videoclips,VideoClip

from pytube import YouTube
from .models import ProyectoModel, UtilMediaModel,CapturaModel

from django.contrib.auth.models import AnonymousUser
from django.db import transaction
from django.core.files.storage import default_storage
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

from PyPDF2 import PdfReader, PdfWriter


from .forms import FirmaForm
import fitz 
from .models import Firma

MY_DOMAIN=settings.MY_DOMAIN




###################################################################################
########################### FUNCIONES SOLO VISTAS #################################
###################################################################################


def vista_servicios(request):

    return render(request,'servicios.html',{'MY_DOMAIN':MY_DOMAIN})

def vista_servicios_unir_pdf(request):

    return render(request,'unir_pdfs.html',{'MY_DOMAIN':MY_DOMAIN})

def vista_servicios_convertir_pdf(request):

    return render(request,'convertir_a_pdf.html',{'MY_DOMAIN':MY_DOMAIN})

def vista_servicios_img_to_pdf(request):

    return render(request,'img_to_pdf.html',{'MY_DOMAIN':MY_DOMAIN})

def vista_servicios_descargar_yt(request):

    return render(request,'descargar_yt.html',{'MY_DOMAIN':MY_DOMAIN})

def vista_servicios_modificar_res(request):

    return render(request,'modificar_resolucion.html',{'MY_DOMAIN':MY_DOMAIN})

def vista_servicios_eliminar_fondo(request):

    return render(request,'eliminar_fondo.html',{'MY_DOMAIN':MY_DOMAIN})

def vista_servicios_cargar_firma(request):

    return render(request,'cargar_firma.html',{'MY_DOMAIN':MY_DOMAIN})

def vista_servicios_firmar_pdf(request):
    return render(request,'firmar_pdf.html',{'MY_DOMAIN':MY_DOMAIN})

def superponer_pdf_firma(request):
    pass

def vista_servicios_curriculumns(request):

    return render(request,'curriculums.html',{'MY_DOMAIN':MY_DOMAIN})

def vista_servicios_facturas(request):

    return render(request,'facturas.html',{'MY_DOMAIN':MY_DOMAIN})

def vista_servicios_albaranes(request):

    return render(request,'albaranes.html',{'MY_DOMAIN':MY_DOMAIN})

def vista_servicios_informacion_personal(request):

    return render(request,'informacion_personal.html',{'MY_DOMAIN':MY_DOMAIN})

def vista_servicios_historico(request):

    return render(request,'historico.html',{'MY_DOMAIN':MY_DOMAIN})

def vista_unir_videos(request):
    return render(request,'unir_videos.html',{'MY_DOMAIN':MY_DOMAIN})





def firma_view(request):
    if request.method == 'POST':
        form = FirmaForm(request.POST, request.FILES)
        if form.is_valid():
            # Procesa y guarda la firma
            firma = form.save()
            # Agrega lógica para redimensionar y posicionar la firma en el PDF si es necesario
            return redirect('firma_preview', firma_id=firma.id)
    else:
        form = FirmaForm()

    return render(request, 'firmar_pdf_2.html', {'form': form,'MY_DOMAIN':MY_DOMAIN})



##########################################################################
################## OBTENER ARCHIVOS DE UN PROYECTO #######################
##########################################################################

def obtener_archivos_del_proyecto(request):
    try:
        if request.method == 'POST':
            usuario = request.user
            referencia_proyecto = request.POST.get('referencia_proyecto')

            proyecto = ProyectoModel.objects.get(referencia_proyecto=referencia_proyecto, usuario=usuario)

            archivos = []
            for media in proyecto.media.all():
                archivo_info = {
                    'id': media.id,
                    'url': media.url,
                    'file_name': media.file_name,
                    'file_type': media.file_type,
                    'proyecto_ref': proyecto.referencia_proyecto
                }

                # Obtener las capturas asociadas a este archivo
                capturas = CapturaModel.objects.filter(archivo=media)
                capturas_info = [{'url_captura': captura.url_captura, 'nombre_captura': captura.nombre_captura} for captura in capturas]

                archivo_info['capturas'] = capturas_info
                archivos.append(archivo_info)

            return JsonResponse({'status': 'success', 'archivos': archivos})
    except ProyectoModel.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Error al obtener archivos: Proyecto no encontrado'}, status=404)
    except Exception as e:
        print(f"Error: {str(e)}")
        return JsonResponse({'status': 'error', 'message': 'Error al obtener archivos'}, status=500)




def eliminar_archivo_de_un_proyecto(request):
    if request.method == 'POST':
        try:
            archivo_id = request.POST.get('archivo_id')

            # Buscar el archivo por su ID en lugar de a través de la relación media
            archivo = get_object_or_404(UtilMediaModel, id=archivo_id)
            
            # Buscar el proyecto que contiene el archivo
            proyecto = ProyectoModel.objects.get(media=archivo)

            # Obtener la ruta del archivo utilizando os.path.join y os.path.normpath
            ruta_archivo = os.path.normpath(os.path.join(settings.MEDIA_ROOT, archivo.url))
            print('ruta_archivo', ruta_archivo)

            # Eliminar la carpeta de capturas
            carpeta_capturas = os.path.join(settings.MEDIA_ROOT, 'carp_editor', 'capturas', f'capturas_{archivo_id}_{proyecto.referencia_proyecto}')
            print("carpeta_capturas", carpeta_capturas)
            if os.path.exists(carpeta_capturas):
                shutil.rmtree(carpeta_capturas)

            # Eliminar las capturas asociadas al archivo
            CapturaModel.objects.filter(archivo=archivo).delete()

            # Eliminar archivo asociado a cada medio
            os.remove(ruta_archivo)         

            # Eliminar el archivo del proyecto y guardarlo
            proyecto.media.remove(archivo)
            proyecto.save()

            # Finalmente, eliminar el archivo
            archivo.delete()

            mensaje = 'Archivo eliminado exitosamente'
            return JsonResponse({'mensaje': mensaje, 'archivo_id': archivo_id, 'status': 'success'})
        except Exception as e:
            mensaje = 'Error al eliminar el archivo'
            return JsonResponse({'mensaje': mensaje, 'status': 'error'})



###################################################################################
################## FUNCION SUBIR ARCHIVOS MEDIA DE DROPZONE #######################
###################################################################################

def subir_archivos_editor(request):
    try:
        if request.method == 'POST':
            archivos = request.FILES.getlist('archivos')
            referencia_proyecto = request.POST.get('referencia_proyecto')
            usuario = request.user  # Obtener el usuario actual

            # Rutas para almacenar los archivos según el tipo
            paths = {
                'video': os.path.join('uploads', 'media_dr_zone', 'temp_vids'),
                'audio': os.path.join('uploads', 'media_dr_zone', 'temp_aud'),
                'imagen': os.path.join('uploads', 'media_dr_zone', 'temp_img'),
            }

            # Validadores para los tipos de archivos permitidos
            video_validator = FileExtensionValidator(allowed_extensions=['mp4'])
            audio_validator = FileExtensionValidator(allowed_extensions=['mp3', 'wav', 'mp4'])
            imagen_validator = FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp'])

            for archivo in archivos:
                # Validar el tipo de archivo
                if archivo.content_type.startswith('video/'):
                    video_validator(archivo)
                    tipo = 'video'
                elif archivo.content_type.startswith('audio/'):
                    audio_validator(archivo)
                    tipo = 'audio'
                elif archivo.content_type.startswith('image/'):
                    imagen_validator(archivo)
                    tipo = 'imagen'
                else:
                    raise ValidationError('Tipo de archivo no permitido.')

                # Generar un nombre único para el archivo usando UUID
                nombre_archivo = f"{uuid.uuid4()}.{archivo.name.split('.')[-1]}"

                # Guardar el archivo en la ruta correspondiente
                path = paths[tipo]
                with default_storage.open(os.path.join(path, nombre_archivo), 'wb+') as destination:
                    for chunk in archivo.chunks():
                        destination.write(chunk)

                # Construir la URL relativa desde el directorio /media/
                url = os.path.relpath(os.path.join(settings.MEDIA_ROOT, path, nombre_archivo), settings.MEDIA_ROOT)

                # Reemplazar las barras invertidas por barras inclinadas en la URL
                url = url.replace(os.sep, '/')

                # Guardar datos en la base de datos
                media = UtilMediaModel.objects.create(
                    url=url,
                    file_name=nombre_archivo,
                    file_type=tipo,
                    user=usuario,  # Asociar el usuario
                )

                # Asociar el medio al proyecto
                proyecto = ProyectoModel.objects.get(referencia_proyecto=referencia_proyecto)
                proyecto.media.add(media)

            return JsonResponse({'message': 'Archivos subidos exitosamente', 'status': 'success', 'referencia_proyecto': referencia_proyecto})
    except Exception as e:
        print(f"Error: {str(e)}")
        return JsonResponse({'message': 'Error al subir archivos'}, status=500)




###########################################################
##################### VISTA EDITOR ########################
###########################################################

def vista_servicios_editor_videos(request, proyecto_ref=None):
    proyectos = []
    proyecto_seleccionado = None
    archivos_de_mi_proyecto = None

    if request.user.is_authenticated:
        # Obtener todos los proyectos del usuario
        proyectos = ProyectoModel.objects.filter(usuario=request.user).order_by('-fecha_creacion')

        # Verificar si existe un proyecto con la referencia proporcionada
        if proyecto_ref:
            try:
                referencia_proyecto = UUID(proyecto_ref)
                proyecto_seleccionado = ProyectoModel.objects.get(referencia_proyecto=referencia_proyecto, usuario=request.user)

                # Corregir la consulta para filtrar los archivos del proyecto
                archivos_de_mi_proyecto = proyecto_seleccionado.media.all()

            except (ValueError, ProyectoModel.DoesNotExist):
                # Si proyecto_ref no es un UUID válido o el proyecto no existe, redirigir a la vista_servicios_editor_videos sin error 404
                return redirect('vista_servicios_editor_videos')

    proyecto_ref_str = str(proyecto_seleccionado.referencia_proyecto) if proyecto_seleccionado else None

    context = {
        'proyecto_ref': proyecto_ref_str,
        'proyectos': proyectos,
        'proyecto_seleccionado': proyecto_seleccionado,
        'archivos_de_mi_proyecto': archivos_de_mi_proyecto,
        'MY_DOMAIN':MY_DOMAIN
    }
    return render(request, 'editor.html', context)


###################################################################################
##################### CREAR UN NUEVO PROYECTO DE EDICION ##########################
###################################################################################

def crear_un_nuevo_proyecto_de_edicion(request):
    try:
        with transaction.atomic():
            if request.method == 'POST':
                if request.user.is_authenticated:
                    nombre_proyecto = request.POST.get('nombre_proyecto', None)
                    usuario_conectado = request.user

                    # Verificar si ya existe un proyecto con el mismo nombre para este usuario
                    proyectos_existentes = ProyectoModel.objects.filter(
                        usuario=usuario_conectado,
                        nombre=nombre_proyecto
                    )

                    if proyectos_existentes.exists():
                        # Si ya existe, agregar un sufijo para hacerlo único
                        sufijo = 1
                        while ProyectoModel.objects.filter(
                            usuario=usuario_conectado,
                            nombre=f"{nombre_proyecto}_{sufijo}"
                        ).exists():
                            sufijo += 1

                        nombre_proyecto = f"{nombre_proyecto}_{sufijo}"

                    # Crear el nuevo proyecto
                    nuevo_proyecto = ProyectoModel(nombre=nombre_proyecto, usuario=usuario_conectado)
                    nuevo_proyecto.save()

                    # Incluir información del proyecto en la respuesta
                    response_data = {
                        'mensaje': 'Proyecto creado correctamente',
                        'proyecto': {
                            'id': nuevo_proyecto.id,
                            'nombre': nuevo_proyecto.nombre,
                            'referencia_proyecto': str(nuevo_proyecto.referencia_proyecto),
                            'fecha_creacion': nuevo_proyecto.fecha_creacion,
                            'fecha_modificacion': nuevo_proyecto.fecha_modificacion,
                            'usuario': nuevo_proyecto.usuario.username if nuevo_proyecto.usuario else None,
                            'media_id': nuevo_proyecto.media.first().id if nuevo_proyecto.media.first() else None,
                            'activo': nuevo_proyecto.activo,
                        }
                    }
                    # print('Proyecto creado')
                    # return HttpResponseRedirect(reverse('vista_servicios_editor_videos_with_ref', args=[str(nuevo_proyecto.referencia_proyecto)]))
                else:
                    response_data = {'mensaje': 'Debes estar autenticado para crear un nuevo proyecto'}
            else:
                response_data = {'mensaje': 'Método no permitido para esta vista'}
    except Exception as e:
        response_data = {'mensaje': f'Ocurrió un error: {str(e)}'}

    return JsonResponse(response_data)


###########################################################################
##################### CREAR CAPTURAS DE UN VIDEO ##########################
###########################################################################
import traceback

from django.core.files.uploadedfile import InMemoryUploadedFile
from moviepy.editor import VideoFileClip

def crear_capturas_de_un_video(request):
    if request.method == 'POST':
        try:
            referencia_proyecto = request.POST.get('referencia_proyecto')
            archivo_id = request.POST.get('id_archivo')  # Ajuste en el nombre del campo
            print('referencia_proyecto', referencia_proyecto)
            print('archivo_id', archivo_id)

            # Obtener el nombre del archivo desde la base de datos
            proyecto = get_object_or_404(ProyectoModel, referencia_proyecto=referencia_proyecto)
            archivo = get_object_or_404(UtilMediaModel, id=archivo_id)
            nombre_archivo = archivo.file_name  # Usar el campo file_name para obtener el nombre del archivo

            # Construir el nombre de la carpeta para las capturas
            carpeta_capturas = os.path.join(settings.MEDIA_ROOT, 'carp_editor', 'capturas', f'capturas_{archivo_id}_{referencia_proyecto}')

            # Verificar si la carpeta de capturas existe
            if not os.path.exists(carpeta_capturas):
                # Si no existe, crear la carpeta
                os.makedirs(carpeta_capturas)
            else:
                # Si existe, devolver las capturas existentes
                capturas_existentes = CapturaModel.objects.filter(archivo=archivo)
                rutas_capturas = [{'ruta': captura.url_captura, 'tiempo': captura.tiempo} for captura in capturas_existentes]

                # Crear el objeto con los datos de las capturas existentes
                objeto_capturas = {
                    'archivo_id': archivo_id,
                    'proyecto_ref': referencia_proyecto,
                    'capturas': rutas_capturas
                }

                return JsonResponse({'status': 'success', 'objeto_capturas': objeto_capturas})

            # Eliminar las capturas existentes en la base de datos
            CapturaModel.objects.filter(archivo=archivo).delete()

            # Obtener el nombre completo del archivo de video en el sistema de archivos
            file_path = os.path.join(settings.MEDIA_ROOT, 'uploads', 'media_dr_zone', 'temp_vids', nombre_archivo)
            print("file_path", file_path)

            # Verificar si el archivo de video existe
            if not os.path.exists(file_path):
                raise Exception('El archivo de video no existe en el sistema')

            # Obtener la duración del video y la tasa de fotogramas (fps)
            cap = cv2.VideoCapture(file_path)
            fps = cap.get(cv2.CAP_PROP_FPS)
            duracion_video = cap.get(cv2.CAP_PROP_FRAME_COUNT) / fps  # Obtener la duración en segundos
            cap.release()

            # Calcular el número de capturas en función de la duración y el número deseado (en este caso, 15)
            numero_capturas = 15

            cap = cv2.VideoCapture(file_path)
            rutas_capturas = []

            for img_index in range(numero_capturas):
                ret, frame = cap.read()

                if not ret:
                    break

                # Guardar la captura en la base de datos
                nombre_captura = f'capt{img_index}.jpg'
                url_captura = os.path.join(carpeta_capturas, nombre_captura)

                # Obtener la ruta relativa
                relativa_url_captura = os.path.relpath(url_captura, settings.MEDIA_ROOT)
                relativa_url_captura = os.path.normpath(relativa_url_captura)

                # Agregar /media/ al inicio de la ruta relativa
                relativa_url_captura = f'/media/{relativa_url_captura}'
                relativa_url_captura = relativa_url_captura.replace("\\", "/")

                # Calcular el tiempo para cada píxel
                tiempo_captura = img_index * (duracion_video / numero_capturas)

                CapturaModel.objects.create(url_captura=relativa_url_captura, nombre_captura=nombre_captura, archivo=archivo, tiempo=tiempo_captura)
                rutas_capturas.append({'ruta': relativa_url_captura, 'tiempo': tiempo_captura})

                # Guardar el frame en el sistema de archivos
                cv2.imwrite(url_captura, frame)

            cap.release()
            cv2.destroyAllWindows()

            # Crear el objeto con los datos
            objeto_capturas = {
                'archivo_id': archivo_id,
                'proyecto_ref': referencia_proyecto,
                'capturas': rutas_capturas
            }

            return JsonResponse({'status': 'success', 'objeto_capturas': objeto_capturas})
        except Exception as e:
            print(f'Error: {e}')
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)




    
###################################################################################
###################### ELIMINAR UN PROYECTO DE EDICION  ###########################
###################################################################################

def eliminar_proyecto_de_edicion(request, referencia_proyecto):
    if request.user.is_authenticated:
        try:
            # Buscar el proyecto
            proyecto = ProyectoModel.objects.get(referencia_proyecto=referencia_proyecto, usuario=request.user)

            # Eliminar medios asociados al proyecto
            medios_asociados = UtilMediaModel.objects.filter(proyectomodel=proyecto)
            for medio in medios_asociados:

                # Construir la ruta completa del archivo
                ruta_archivo = os.path.join(settings.MEDIA_ROOT, medio.url).replace(os.sep, '/')
                print('ruta_archivo', ruta_archivo)

                # Eliminar archivo asociado a cada medio
                os.remove(ruta_archivo)

                # Eliminar el medio
                medio.delete()

            # Eliminar el proyecto
            proyecto.delete()

            return JsonResponse({
                'status': 'success',
                'mensaje': f'El proyecto con la referencia {referencia_proyecto} ha sido eliminado correctamente'
            })
        except ProyectoModel.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'mensaje': f'No se encontró un proyecto con la referencia {referencia_proyecto}'
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'mensaje': f'Ocurrió un error: {str(e)}'})
    else:
        return JsonResponse({'status': 'error', 'mensaje': 'Debes estar autenticado para eliminar un proyecto'})



###################################################################################
############################## DESCARGAR DESDE YOUTUBE ############################
###################################################################################

def download_youtube(request):
    MI_DOMINIO = settings.MY_DOMAIN

    if request.method == 'POST':
        youtube_url = request.POST.get('youtube_url')
        download_format = request.POST.get('download_format')
        print("download_format", download_format)
        selected_resolution = request.POST.get('resolution')  # Obtener la resolución seleccionada
        print("selected_resolution", selected_resolution)

        # Ruta completa donde se guardarán los archivos descargados
        base_dir = settings.BASE_DIR
        download_folder = os.path.join(base_dir, 'media', 'carp_vids', 'yt')

        try:
            yt = YouTube(youtube_url)

            if download_format == 'mp4':
                # Filtra las corrientes de video y audio con la resolución y el formato seleccionados
                stream = yt.streams.filter(file_extension='mp4', resolution=selected_resolution, progressive=True).first()

                # Si no se encontró la resolución seleccionada, descarga la mejor resolución disponible
                if not stream:
                    stream = yt.streams.filter(file_extension='mp4', progressive=True).order_by('resolution').last()

            elif download_format == 'mp3':
                # Filtra las corrientes de audio
                stream = yt.streams.filter(only_audio=True, file_extension='mp4').first()

            if stream:
                # Creamos la carpeta de descarga si no existe
                os.makedirs(download_folder, exist_ok=True)

                # Genera un nombre de archivo único
                unique_filename = f'{uuid.uuid4()}.{download_format}'

                # Descarga el archivo en la carpeta especificada con el nombre único
                file_path = os.path.join(download_folder, unique_filename)
                file_url = os.path.join(settings.MEDIA_URL, 'carp_vids', 'yt', unique_filename)
                file_url = file_url.replace("\\", "/")

                stream.download(output_path=download_folder, filename=unique_filename)

                # Verificamos si el archivo existe en la carpeta
                if os.path.exists(file_path):
                    # Guardamos la información en la tabla UtilMediaModel
                    util_media = UtilMediaModel(
                        url=file_url,
                        file_name=unique_filename,
                        file_type='video',
                        user=request.user,
                    )
                    util_media.save()

                    response_data = {'success': True, 'message': 'Descarga exitosa y guardada en la base de datos.', 'unique_filename': unique_filename}
                else:
                    response_data = {'success': False, 'message': 'El archivo no se descargó correctamente.'}
            else:
                response_data = {'success': False, 'message': 'Formato no válido.'}
        except Exception as e:
            response_data = {'success': False, 'message': str(e)}

        return JsonResponse(response_data)

    return JsonResponse({'success': False, 'message': 'Método no válido'})


###################################################################################
########## DESCARGAR VIDEO DEDE SU UBICACION EN NUESTRA APLICACION ################
###################################################################################

def descargar_video_yt(request, filename):
    file_path = os.path.join(settings.MEDIA_ROOT, 'carp_vids/yt', filename)

    # Verificar si el archivo existe
    if not os.path.isfile(file_path):
        return HttpResponseNotFound('El archivo no existe.')

    # Obtener el tipo MIME del archivo
    content_type, _ = mimetypes.guess_type(file_path)
    content_type = content_type or 'application/octet-stream'

    # Obtener el nombre de archivo del path
    file_name = os.path.basename(file_path)

    # Configurar la respuesta de descarga con el nombre de archivo correcto
    response = FileResponse(open(file_path, 'rb'), content_type=content_type)
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'

    return response


###################################################################################
########### OBTENER RESOLUCIONES DISPONIBLES CON LA URL DE YOUTUBE ################
###################################################################################

def get_resolutions(request):
    if request.method == 'POST':
        youtube_url = request.POST.get('youtube_url')
        try:
            yt = YouTube(youtube_url)
            resolutions = [stream.resolution for stream in yt.streams.filter(file_extension='mp4')]
            return JsonResponse({'success': True, 'resolutions': resolutions})
        except Exception as e:
            return JsonResponse({'success': False, 'error_message': str(e)})

    return JsonResponse({'success': False, 'error_message': 'Método no válido'})


###################################################################################
########################### ELIMINAR EL ARCHIVO  ##################################
###################################################################################

def delete_video_file(request):
    if request.method == 'POST':
        filename = request.POST.get('filename')
        base_dir = settings.BASE_DIR
        file_path = os.path.join(base_dir, 'media', 'carp_vids', 'yt', filename)

        try:
            # Intenta eliminar el archivo
            os.remove(file_path)
            response_data = {'success': True, 'message': 'Archivo eliminado con éxito.'}
        except Exception as e:
            response_data = {'success': False, 'message': str(e)}

        return JsonResponse(response_data)
    else:
        return JsonResponse({'success': False, 'message': 'Método no válido'})

###################################################################################
############################ UNIR VARIOS VIDEOS  ##################################
###################################################################################

def unir_videos(request):
    if request.method == 'POST':
        videos = request.FILES.getlist('videos[]')

        if not videos:
            return JsonResponse({'message': 'No se han recibido videos en la solicitud.'}, status=400)

        # Directorio temporal para almacenar los archivos de video
        temp_dir = 'temp'
        os.makedirs(temp_dir, exist_ok=True)

        video_clips = []

        try:
            for index, video in enumerate(videos):
                video_path = os.path.join(temp_dir, f'video_{index}.webm')

                # Guardar el archivo temporalmente
                with open(video_path, 'wb') as destination:
                    for chunk in video.chunks():
                        destination.write(chunk)

                # Crear el clip de video
                clip = VideoFileClip(video_path)
                video_clips.append(clip)

            # Unir los clips de video
            final_clip = concatenate_videoclips(video_clips, method="compose")

            # Nombre único para el archivo resultante
            unique_filename = str(uuid.uuid4())
            final_path = os.path.join('media/carp_vids','yt', f'{unique_filename}.mp4')

            # Guardar el archivo resultante
            final_clip.write_videofile(final_path, codec="libx264", audio_codec="aac")

            # Limpieza de archivos temporales
            for video_clip in video_clips:
                video_clip.close()

            # Eliminar todos los archivos temporales en el directorio 'temp'
            for temp_file in os.listdir(temp_dir):
                temp_file_path = os.path.join(temp_dir, temp_file)
                os.remove(temp_file_path)

            return JsonResponse({'message': 'Videos unidos exitosamente.', 'video_path': final_path,'video_name':f'{unique_filename}.mp4'})
        except Exception as e:
            return JsonResponse({'message': f'Error al unir los videos: {str(e)}'}, status=500)
    else:
        return JsonResponse({'message': 'Método no permitido.'}, status=405)

###################################################################################
####################### DESCARGAR EL VIDEO UNIFICADO  #############################
###################################################################################

def descargar_video_unificado(request, filename):
    file_path = os.path.join(settings.MEDIA_ROOT, 'carp_vids/','yt', filename)

    # Verificar si el archivo existe
    if not os.path.isfile(file_path):
        return HttpResponseNotFound('El archivo no existe.')

    # Obtener el tipo MIME del archivo
    content_type, _ = mimetypes.guess_type(file_path)
    content_type = content_type or 'application/octet-stream'

    # Obtener el nombre de archivo del path
    file_name = os.path.basename(file_path)

    # Configurar la respuesta de descarga con el nombre de archivo correcto
    response = FileResponse(open(file_path, 'rb'), content_type=content_type)
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'

    return response

def eliminar_video_unificado(request,file_name):
    file_path = os.path.join(settings.MEDIA_ROOT, 'carp_vids/','yt', file_name)
    try:
        os.remove(file_path)
        return JsonResponse({'message': 'Videos eliminado exitosamente.'})
    except Exception as e:
        return JsonResponse({'message': 'No ha sido posible eliminar el video unificado.'})

###################################################################################
###################### CONVERTIR UN DOCUMENTO A PDF  ##############################
###################################################################################

def convertir_documento_a_pdf(request):
    if request.method == 'POST' and request.FILES.get('documento'):
        documento = request.FILES['documento']

        # Verificar si es un archivo de texto
        mime_type, encoding = mimetypes.guess_type(documento.name)
        if mime_type and 'text' in mime_type:
            # Generar un nombre único para el archivo PDF
            unique_filename = str(uuid.uuid4())
            pdf_filename = f"{os.path.splitext(documento.name)[0]}_{unique_filename}.pdf"

            # Ruta para almacenar el archivo PDF en la carpeta 'utils_tar/media/carp_pdfs/'
            pdf_path = os.path.join(settings.MEDIA_ROOT, 'carp_pdfs', pdf_filename)

            # Crear el archivo PDF
            with default_storage.open(pdf_path, 'wb') as pdf_file:
                # Configurar el lienzo PDF con dimensiones de página A4
                p = canvas.Canvas(pdf_file, pagesize=letter)

                # Leer el contenido del archivo de texto línea por línea
                lineas = documento.read().decode('utf-8').splitlines()

                # Ajustar el tamaño de la fuente según sea necesario
                p.setFont("Helvetica", 12)

                # Definir las dimensiones de la página
                ancho_pagina, alto_pagina = letter

                # Definir la posición inicial en la página
                y_position = alto_pagina - 20

                # Iterar sobre las líneas y agregarlas al PDF
                for linea in lineas:
                    # Si la línea se desborda a la siguiente página, crear una nueva página
                    if y_position < 20:
                        p.showPage()
                        y_position = alto_pagina - 20

                    p.drawString(10, y_position, linea)
                    y_position -= 15  # Ajustar según sea necesario

                # Guardar el PDF
                p.save()

            # Obtener la URL completa del archivo PDF
            pdf_url = default_storage.url(os.path.join('carp_pdfs', pdf_filename))
            url_pdf=f'/media/carp_pdfs/{pdf_filename}'
            # Crear una instancia de UtilMediaModel y guardarla en la base de datos
            util_media_instance = UtilMediaModel(
                url=url_pdf,
                file_name=pdf_filename,
                file_type='pdf',
                user=request.user,
            )
            util_media_instance.save()

            # Retornar la respuesta con el nombre y la URL del archivo PDF
            return JsonResponse({'file_name': pdf_filename, 'file_url': pdf_url})
        else:
            return JsonResponse({'error': 'El archivo no es de tipo texto (txt).'})
    else:
        return JsonResponse({'error': 'La solicitud debe ser de tipo POST y contener un archivo.'})

###################################################################################
############## CONVERTIR UNA O VARIAS IMAGENES A PDF  #############################
###################################################################################

def convertir_imagenes_a_pdf(request):
    if request.method == 'POST' and request.FILES.getlist('images'):
        # Obtener la lista de imágenes del formulario
        images = request.FILES.getlist('images')

        # Crear un objeto BytesIO para guardar el PDF generado
        pdf_buffer = BytesIO()

        # Crear un objeto PDF con un tamaño mínimo de letter (8.5 x 11 pulgadas)
        pdf_doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)

        temp_image_paths = []  # Almacenar las rutas temporales de las imágenes

        elements = []

        # Espaciado entre las imágenes en puntos
        image_spacing = 20  # Espacio entre imágenes en puntos

        for image in images:
            img = PILImage.open(image)

            # if img.mode == 'RGBA':
            #     img = img.convert('RGB')  # Convertir a modo RGB si es RGBA

            # Redimensionar la imagen si es necesario
            max_width = 500  # Define el ancho máximo deseado
            max_height = 700  # Define la altura máxima deseada

            img.thumbnail((max_width, max_height), PILImage.ANTIALIAS)

            # Crear una ruta temporal única para la imagen
            img_format = img.format.lower() if img.format else 'png'
            temp_image_path = os.path.join(settings.MEDIA_ROOT, 'temp_images', f'temp_image_{uuid.uuid4()}.{img_format}')

            # Guardar la imagen temporalmente
            img.save(temp_image_path)
            print("Ruta de imagen temporal:", temp_image_path)

            img_width, img_height = img.size

            # Agregar la imagen al PDF con sus dimensiones originales
            elements.append(ReportImage(temp_image_path, width=img_width, height=img_height))
            elements.append(Spacer(1, image_spacing))  # Agregar espacio entre imágenes

            temp_image_paths.append(temp_image_path)

        # Crear el PDF con los elementos
        pdf_doc.build(elements)

        # Crear un objeto File para el archivo PDF
        pdf_file = pdf_buffer.getvalue()

        # Generar un nombre de archivo único con UUID
        unique_filename = f'combined_images_{uuid.uuid4()}.pdf'
        pdf_path = os.path.join(settings.MEDIA_ROOT, 'carp_pdfs', unique_filename)


        # Obtener la URL completa del archivo PDF
        pdf_url = default_storage.url(os.path.join('carp_pdfs', unique_filename))
        url_pdf=f'/media/carp_pdfs/{unique_filename}'
        # Crear una instancia de UtilMediaModel y guardarla en la base de datos
        util_media_instance = UtilMediaModel(
            url=url_pdf,
            file_name=unique_filename,
            file_type='pdf',
            user=request.user,
        )
        util_media_instance.save()

        # Guardar el PDF en el servidor
        with open(pdf_path, 'wb') as pdf_output:
            pdf_output.write(pdf_file)
            print("PDF guardado en:", pdf_path)

        # Configurar la respuesta HTTP con el PDF generado
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{unique_filename}"'
        print("Nombre de archivo PDF:", unique_filename)

        # Limpiar las imágenes temporales
        for temp_image_path in temp_image_paths:
            os.remove(temp_image_path)
            print("Imagen temporal eliminada:", temp_image_path)

        response_data = {'pdf_url': unique_filename}
        return JsonResponse(response_data)

    return HttpResponse('Petición no válida', status=400)

###################################################################################
############### DESCARGAR IMAGENES CONVERTIDAS A PDF  #############################
###################################################################################

def descargar_pdf_imagenes_yt(request, filename):
    file_path = os.path.join(settings.MEDIA_ROOT, 'carp_pdfs', filename)

    # Verificar si el archivo existe
    if not os.path.isfile(file_path):
        return HttpResponseNotFound('El archivo no existe.')

    # Obtener el tipo MIME del archivo
    content_type, _ = mimetypes.guess_type(file_path)
    content_type = content_type or 'application/octet-stream'

    # Obtener el nombre de archivo del path
    file_name = os.path.basename(file_path)

    # Configurar la respuesta de descarga con el nombre de archivo correcto y el tipo de contenido
    response = FileResponse(open(file_path, 'rb'), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'

    return response

###################################################################################
################## DESCARGAR DOCUMENTO CONVERTIDO A PDF ###########################
###################################################################################

def descargar_pdf_documento_convertido(request, filename):
    file_path = os.path.join(settings.MEDIA_ROOT, 'carp_pdfs', filename)

    # Verificar si el archivo existe
    if not os.path.isfile(file_path):
        return HttpResponseNotFound('El archivo no existe.')

    # Obtener el tipo MIME del archivo
    content_type, _ = mimetypes.guess_type(file_path)
    content_type = content_type or 'application/octet-stream'

    # Obtener el nombre de archivo del path
    file_name = os.path.basename(file_path)

    # Configurar la respuesta de descarga con el nombre de archivo correcto y el tipo de contenido
    response = FileResponse(open(file_path, 'rb'), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'

    return response

###################################################################################
##################### ELIMINAR ARCHIVO DOCUMENTO (PDF...ETC)  #####################
###################################################################################

def eliminar_archivo_documento(request):
    if request.method == 'POST':
        filename = request.POST.get('filename')
        base_dir = settings.BASE_DIR
        file_path = os.path.join(base_dir, 'media', 'carp_pdfs', filename)

        try:
            # Intenta eliminar el archivo
            os.remove(file_path)
            response_data = {'success': True, 'message': 'Archivo eliminado con éxito.'}
        except Exception as e:
            response_data = {'success': False, 'message': str(e)}

        return JsonResponse(response_data)
    else:
        return JsonResponse({'success': False, 'message': 'Método no válido'})

###################################################################################
######################### FUNCION REMOVE BACKGROUND ###############################
###################################################################################

def remove_background(image_path, save_path):
    # Cargar la imagen
    img = cv2.imread(image_path)

    # Convertir la imagen a escala de grises
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Aplicar umbralización para separar el fondo del primer plano
    _, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)

    # Encontrar contornos en la imagen umbralizada
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Crear una máscara negra del mismo tamaño que la imagen original
    mask = np.zeros_like(img)

    # Dibujar los contornos en la máscara
    cv2.drawContours(mask, contours, -1, (255, 255, 255), thickness=cv2.FILLED)

    # Aplicar la máscara a la imagen original
    result = cv2.bitwise_and(img, mask)

    # Generar un nombre de archivo único con UUID
    filename = f'img_sin_fondo_{uuid.uuid4()}.png'

    # Crear la ruta completa del archivo en el directorio 'media/carp_img'
    result_path = os.path.join(settings.MEDIA_ROOT, 'carp_imgs', filename)

    # Guardar la imagen en el directorio especificado
    cv2.imwrite(result_path, result)

    # Convertir la imagen resultante a formato PIL para su visualización
    result_pil = PILImage.fromarray(cv2.cvtColor(result, cv2.COLOR_BGR2RGB))

    # Convertir la imagen a base64 para su fácil visualización en HTML
    buffered = BytesIO()
    result_pil.save(buffered, format="PNG")
    img_str = "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode()

    return img_str, result_path


###################################################################################
##################### ELIMINAR EL FONDO DE UNA IMAGEN #############################
###################################################################################

def eliminar_fondo_de_imagenes(request):
    if request.method == 'POST' and request.FILES.get('imagen'):
        imagen = request.FILES['imagen']
        temp_image_path = f'media/temp_images/temp_image_{uuid.uuid4()}.png'

        with open(temp_image_path, 'wb') as img_file:
            img_file.write(imagen.read())

        # Llamar a la función para eliminar el fondo
        img_str, result_path = remove_background(temp_image_path, 'C:\\Users\\User\\Desktop\\ej\\utils_tar\\utils_tar\\media\\carp_imgs')

        # Obtener la URL completa del archivo PDF
        url_pdf=f'/media/carp_imgs/{os.path.basename(result_path)}'
        # Crear una instancia de UtilMediaModel y guardarla en la base de datos
        util_media_instance = UtilMediaModel(
            url=url_pdf,
            file_name=os.path.basename(result_path),
            file_type='image',
            user=request.user,
        )
        util_media_instance.save()

        return JsonResponse({'imagen_url': img_str, 'file_name': os.path.basename(result_path)})

    return JsonResponse({'error': 'Petición no válida'}, status=400)

###################################################################################
####################### DESCARGAR IMAGEN SIN FONDO ################################
###################################################################################

def descargar_img_sin_fondo(request, filename):
    file_path = os.path.join(settings.MEDIA_ROOT, 'carp_imgs', filename)

    # Verificar si el archivo existe
    if not os.path.isfile(file_path):
        return HttpResponseNotFound('El archivo no existe.')

    # Obtener el tipo MIME del archivo
    content_type, _ = mimetypes.guess_type(file_path)
    content_type = content_type or 'application/octet-stream'

    # Obtener el nombre de archivo del path
    file_name = os.path.basename(file_path)

    # Configurar la respuesta de descarga con el nombre de archivo correcto y el tipo de contenido
    response = FileResponse(open(file_path, 'rb'), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'

    return response


###################################################################################
############### VISTA CARPETAS CON LA INFO DEL USUARIO CONECTADO ##################
###################################################################################

def vista_servicios_carpetas(request):
    # Obtén el usuario actual
    user = request.user

    # Filtra los archivos por tipo y usuario
    archivos_imgs = UtilMediaModel.objects.filter(user=user, file_type='image')
    archivos_vids = UtilMediaModel.objects.filter(user=user, file_type='video')
    archivos_pdfs = UtilMediaModel.objects.filter(user=user, file_type='pdf')

    # Limita el nombre de los archivos PDF a 50 caracteres
    for archivo_pdf in archivos_pdfs:
        archivo_pdf.file_name_short = archivo_pdf.file_name[:30]

    return render(request, 'carpetas.html', {
        'user': user,
        'archivos_imgs': archivos_imgs,
        'archivos_vids': archivos_vids,
        'archivos_pdfs': archivos_pdfs,
    })


###################################################################################
############# MODIFICAR LA RESOLUCION Y EL FORMATO DE UNA IMAGEN ##################
###################################################################################

from PIL import Image
def modificar_resolucion_imagen(request):
    if request.method == 'POST':
        resolucion = request.POST.get('resolution')
        formato = request.POST.get('format')
        imagen = request.FILES.get('imagen')

        if resolucion and formato and imagen:
            resolucion = tuple(map(int, resolucion.split('x')))
            #original_image = Image.open(imagen).convert('RGB')  # Convertir la imagen al modo RGB
            original_image = Image.open(imagen)

            # Asegúrate de que el directorio de destino exista
            unique_filename = f'imagen_{uuid.uuid4()}.{formato.lower()}'
            ruta_destino = os.path.join('media', 'carp_imgs', unique_filename)
            os.makedirs(os.path.dirname(ruta_destino), exist_ok=True)

            # Redimensiona la imagen usando el filtro LANCZOS para un reescalado de alta calidad
            original_image = original_image.resize(resolucion, Image.LANCZOS)

            url_a_guardar = '/media/carp_imgs/' + unique_filename

            # Guarda la imagen modificada con el formato deseado en la ruta de destino
            if formato.lower() == 'webp':
                original_image.save(ruta_destino, format='webp')
            else:
                original_image.save(ruta_destino, format=formato)

            # Crea una instancia de UtilMediaModel y guárdala en la base de datos
            user = request.user  # Esto debería ser el usuario autenticado
            if not isinstance(user, AnonymousUser):  # Verifica si el usuario no es anónimo
                media = UtilMediaModel(url=url_a_guardar, file_type='image', user=user,file_name=unique_filename)
                media.save()
            else:
                return JsonResponse({'error': 'Usuario no autenticado.'})

            return JsonResponse({'success': True, 'modified_image': url_a_guardar})
        else:
            return JsonResponse({'error': 'Falta información necesaria.'})

    return JsonResponse({'error': 'Método no permitido'})

###################################################################################
############### DESCARGAR EL ARCHIVO FINAL DE LA IMAGEN MODIFICADA ################
###################################################################################

def descargar_archivo_final_resolucion_modificada(request, filename):

    file_path = os.path.join(settings.MEDIA_ROOT, 'carp_imgs/', filename)

    # Verificar si el archivo existe
    if not os.path.isfile(file_path):
        return HttpResponseNotFound('El archivo no existe.')

    # Obtener el tipo MIME del archivo
    content_type, _ = mimetypes.guess_type(file_path)
    content_type = content_type or 'application/octet-stream'

    # Obtener el nombre de archivo del path
    file_name = os.path.basename(file_path)

    # Configurar la respuesta de descarga con el nombre de archivo correcto
    response = FileResponse(open(file_path, 'rb'), content_type=content_type)
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'

    return response

###################################################################################
####################### ELIMINAR EL ARCHIVO DE LA IMAGEN  #########################
###################################################################################

def delete_img_file(request):
    if request.method == 'POST':
        filename = request.POST.get('filename')
        base_dir = settings.BASE_DIR
        file_path = os.path.join(base_dir, 'media', 'carp_imgs', 'yt', filename)

        try:
            # Intenta eliminar el archivo
            os.remove(file_path)
            response_data = {'success': True, 'message': 'Archivo eliminado con éxito.'}
        except Exception as e:
            response_data = {'success': False, 'message': str(e)}

        return JsonResponse(response_data)
    else:
        return JsonResponse({'success': False, 'message': 'Método no válido'})
