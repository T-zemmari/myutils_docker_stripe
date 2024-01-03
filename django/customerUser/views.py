import datetime
from django.contrib.auth import login, get_user_model,authenticate
from django.shortcuts import render, redirect,get_object_or_404
from .form import RegistrationForm
from .form import LoginForm
from product.models import ProductModel
from .models import CustomUser


def register_user(request):
    # Verificar si el usuario ya está autenticado
    if request.user.is_authenticated:
        return redirect('home')

    # Manejar el formulario cuando se envía mediante POST
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            # Crear una instancia de CustomUser usando create_user
            user = get_user_model().objects.create_user(
                username=form.cleaned_data['email'],
                first_name=form.cleaned_data['first_name'],
                last_name=form.cleaned_data['last_name'],
                email=form.cleaned_data['email'],
                password=form.cleaned_data['password1'],
                numero_telefono=form.cleaned_data['numero_telefono'],
            )

            # Establecer fechas y detalles del plan
            fecha_inicio = datetime.datetime.now()
            fecha_fin = fecha_inicio + datetime.timedelta(days=1)
            keyword = "Gratuito"
            instancia_de_producto = get_object_or_404(ProductModel, name__icontains=keyword)

            # Actualizar los campos del usuario
            # user.plan_init = fecha_inicio
            # user.plan_activo = instancia_de_producto
            # user.plan_end = fecha_fin
            # user.activar_plan_temporalmente = False
            # user.days = 1
            # user.save()

            # Iniciar sesión y redirigir al usuario a la página de inicio
            login(request, user)
            return redirect('home')
        else:
            # Manejar errores en el formulario
            print('Error en el registro')
            print(form.errors)
    else:
        # Mostrar el formulario para registro cuando el método no es POST
        form = RegistrationForm()

    return render(request, 'register.html', {'form': form})


def login_user(request):
    error_credenciales = False

    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        form = LoginForm(request, request.POST)
        print(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
            else:
                print('Error login')
                print(form.errors)
                error_credenciales = True
        else:
            error_credenciales = True  # Set to True if the form is not valid

    else:
        form = LoginForm()
    
    return render(request, 'login.html', {'form': form, 'error_credenciales': error_credenciales})



def ver_mi_perfil(request):
    info_user=request.user
    print('info_user',info_user)
    context={
        'user':info_user
    }
    return render(request,'perfil.html',context)


def listado_de_usuarios(request):
    if request.user.is_authenticated:
        users = CustomUser.objects.all()
        return render(request, 'lista_usuarios.html', {'users': users})
    else:
        # Manejar el caso en que el usuario no esté autenticado
        return render(request, 'error.html')


def desactivar_plan_manualmente(request, user_id):
    user = CustomUser.objects.get(pk=user_id)
    user.activar_plan_temporalmente = True
    user.save()
    return redirect('customerUser:usuarios_listado')

def activar_plan_manualmente(request, user_id):
    user = CustomUser.objects.get(pk=user_id)
    user.activar_plan_temporalmente = False 
    user.save()
    return redirect('customerUser:usuarios_listado')

