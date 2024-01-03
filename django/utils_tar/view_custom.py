import os
import base64
import json
import datetime
import mimetypes
import uuid


from django.conf import settings
from django.contrib.auth import get_user_model
from product.models import ProductModel
from util_media.models import UtilMediaModel
from django.http import JsonResponse,HttpResponseNotFound
from PyPDF2 import PdfMerger

from django.contrib.auth.views import LogoutView
from django.shortcuts import render,redirect
from django.http import HttpResponse,FileResponse
from cryptography.fernet import Fernet

from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail, BadHeaderError
from django.shortcuts import get_object_or_404





# def serve_pdf(request, file_id):
#     pdf = get_object_or_404(UtilMediaModel, pk=file_id)
#     file_path = os.path.join(settings.MEDIA_ROOT, pdf.file_name)
#     response = FileResponse(open(file_path, 'rb'), content_type='application/pdf')
#     return response

def serve_pdf(request, file_name):
    file_path = os.path.join(settings.MEDIA_ROOT, 'carp_pdfs', file_name)
    print("file_path", file_path)
    response = FileResponse(open(file_path, 'rb'), content_type='application/pdf')
    return response


def serve_vids(request, file_name):
    file_path = os.path.join(settings.MEDIA_ROOT, 'carp_vids', 'yt', file_name)
    
    try:
        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type='video/mp4')  # Ajusta el tipo MIME según el formato de tus videos
            response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
            return response
    except FileNotFoundError:
        return HttpResponseNotFound('El archivo no se encontró')

def serve_imgs(request, file_name):
    file_path = os.path.join(settings.MEDIA_ROOT, 'carp_imgs', file_name)

    try:
        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type='image/jpeg')  # Ajusta el tipo MIME según el formato de tus imágenes
            response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
            return response
    except FileNotFoundError:
        return HttpResponseNotFound('El archivo no se encontró')


def eliminar_archivo_media(request, pk):
    try:
        archivo = UtilMediaModel.objects.get(pk=pk)
        print("archivo", archivo)

        # Usa barras inclinadas '/' para construir la ruta del archivo
        ruta_archivo = f"{settings.BASE_DIR}/{archivo.url}"
        try:
            # Elimina el archivo y la instancia del modelo
            os.remove(ruta_archivo)
            archivo.delete()

            return JsonResponse({'mensaje': 'Archivo eliminado correctamente', 'ruta_archivo': ruta_archivo,'status':'success'})
        except Exception as e:
            print('Error', e)
            return JsonResponse({'error': str(e)}, status=500)

    except UtilMediaModel.DoesNotExist as e1:
        print("DoesNotExist:", e1)
        return JsonResponse({'error': 'El archivo no existe'}, status=404)

    except Exception as e:
        print("Exception:", e)
        return JsonResponse({'error': str(e)}, status=500)



def logout_view(request):
    return LogoutView.as_view(next_page='home')(request)

def home(request):
    return render(request,'home.html')

def ir_a_success(request):
    encrypted_data_base64 = request.GET.get('data', '')
    user = request.user
    try:
        key = settings.CLAVE_KEY_SECRETA_RANDOM
        cipher_suite = Fernet(key)
        print(key)
        
        encrypted_data = base64.urlsafe_b64decode(encrypted_data_base64.encode())
        decrypted_data = cipher_suite.decrypt(encrypted_data).decode()
        info_data = json.loads(decrypted_data)

        fecha_inicio=datetime.datetime.now()
        fecha_fin=fecha_inicio+ datetime.timedelta(days=info_data['dias'])

        instancia_de_producto=ProductModel.objects.get(pk=info_data['id_producto'])

        # Actualizamos los campos del usuario
        user.plan_init = fecha_inicio
        user.plan_activo = instancia_de_producto
        user.plan_end = fecha_fin
        user.days = info_data['dias']
        user.save()
       

        # Restauramos la sesión del usuario
        get_user_model().objects.get(id=user.id)
        return redirect('vista_servicios')
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return HttpResponse("Error en los datos cifrados")

    return render(request,'success.html')




from django.core.files import File

def combinar_pdfs(request):
    if request.method == 'POST':
        merger = PdfMerger()
        pdf_files = request.FILES.getlist('pdfFiles')

        # Generar un nombre único para el archivo combinado
        unique_filename = f'combined_{uuid.uuid4()}.pdf'

        carpeta_pdfs = os.path.join(settings.MEDIA_ROOT, 'carp_pdfs')

        if not os.path.exists(carpeta_pdfs):
            os.makedirs(carpeta_pdfs)

        output_path = os.path.join(carpeta_pdfs, unique_filename)

        url_en_tabla='/media/carp_pdfs/'+unique_filename

        for pdf_file in pdf_files:
            merger.append(pdf_file)

        with open(output_path, 'wb') as output:
            merger.write(output)

        # Guardar en la base de datos
        user = request.user  # Asume que el usuario está autenticado
        media_instance = UtilMediaModel(url=url_en_tabla, file_type='pdf', user=user,file_name=unique_filename)
        media_instance.save()

        response_data = {'success': True, 'message': 'PDFs combinados con éxito', 'pdf_url': output_path,'unique_file_name':unique_filename}
        return JsonResponse(response_data)

    return JsonResponse({'success': False, 'message': 'Petición no válida'})





def descargar_pdf_combinado(request, filename):
    file_path = os.path.join(settings.MEDIA_ROOT, 'carp_pdfs', filename)

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



def ir_a_cancel(request):
    return render(request,'cancel.html')




def vista_acerca_de(request):

    productos=ProductModel.objects.all()
    context={
        'products':productos,
        'stripe_key':settings.STRIPE_SECRET_KEY
    }

    return render(request,'acerca_de.html',context)

def vista_contacto(request):

    status = request.session.get('status', '')
    message = request.session.get('message', '')


    if 'status' in request.session:
        del request.session['status']
    if 'message' in request.session:
        del request.session['message']
        
    context = {
        'status': status,
        'message': message
    } 
    return render(request,'contacto.html',context)





@csrf_exempt
def enviar_correo_desde_formulario(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre', '')
        email = request.POST.get('email', '')
        mensaje = request.POST.get('mensaje', '')
        asunto = request.POST.get('asunto', '')

        mensaje = f'Nombre: {nombre}\nCorreo Electrónico: {email}\nMensaje: {mensaje}'
        remitente = email
        destinatario = settings.EMAIL_HOST_USER  

        try:
            send_mail(asunto, mensaje, remitente, [destinatario], fail_silently=False)
            request.session['status'] = 'success'
            request.session['message'] = 'Mensaje enviado correctamente'
        except BadHeaderError as e:
            print(f"Error al enviar correo: {str(e)}")
            return HttpResponse('Error al enviar correo')
     
        return redirect('vista_contacto') 
    return HttpResponse('Método no permitido', status=405)
  