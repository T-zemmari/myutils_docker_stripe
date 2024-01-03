import stripe
import datetime
import json
import base64
from django.conf import settings
from django.shortcuts import render,redirect
from django.views import View
from .models import ProductModel
from django.urls import reverse
from django.utils.http import urlencode
from cryptography.fernet import Fernet


def products_view(request):
    productos=ProductModel.objects.all()

    context={
        'products':productos,
        'stripe_key':settings.STRIPE_SECRET_KEY
    }
    return render(request,'productos.html',context)

def nuevo_producto(request):
        
        stripe.api_key = settings.STRIPE_SECRET_KEY
        if(request.method=='POST'):  
            name = request.POST['product_name']
            price = float(request.POST['product_price'])  # Convierte el precio a decimal
            days = request.POST['product_days']
            description = request.POST['product_description']  
            is_suscription = request.POST['product_is_suscription']  

            product = ProductModel.objects.create(name=name, price=price,days=days,description=description,is_suscription=is_suscription)
    
            # Crea el precio en Stripe
            price_create = stripe.Price.create(
                unit_amount=int(price * 100),  # Convierte el precio a centavos
                currency='usd', 
                product_data={
                    'name': name, 
                },
            )
    
            # Asigna el ID del precio de Stripe al producto en tu base de datos
            product.price_id = price_create.id
            product.save()

            return redirect('product:productos')
        return render(request,'nuevo_producto.html')



class CreateCheckoutSessionView(View):
    def post(self, request, *args, **kwargs):

        
        user=request.user
        if not user.is_authenticated:
            return redirect('customerUser:login')
        
        user_email=user.email

        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            Mi_DOMINIO = settings.MY_DOMAIN
            id_producto = kwargs['pk']
            producto_escogido = ProductModel.objects.get(pk=id_producto)

            producto_name=producto_escogido.name
            producto_dias=producto_escogido.days
            print("producto_dias", producto_dias)

            fecha_inicio=datetime.datetime.now()
            fecha_fin=fecha_inicio + datetime.timedelta(days=producto_dias)
         
            info_data={
                'id_producto':id_producto,
                'producto_name':producto_name,
                'dias':producto_dias,
                'user_id':user.id,
                'fecha_inicio':fecha_inicio.strftime('%Y-%m-%d %H:%M:%S'),  # Convierte a cadena
                'fecha_fin':fecha_fin.strftime('%Y-%m-%d %H:%M:%S'),  # Convierte a cadena
            }
            info_data_json = json.dumps(info_data)

            # Generamos una clave de cifrado (debemos guardar esta clave de forma segura)

            key = settings.CLAVE_KEY_SECRETA_RANDOM
            cipher_suite = Fernet(key)
            print(key)

            # Ciframos los datos
            encrypted_data = cipher_suite.encrypt(info_data_json.encode())

            # Conviertimos los datos cifrados a una cadena base64 segura
            encrypted_data_base64 = base64.urlsafe_b64encode(encrypted_data).decode()

            # Agregamos los datos cifrados a la URL de éxito como parámetro
            success_url = reverse('success') 
            success_url += '?' + urlencode({'data': encrypted_data_base64})

    
            # Creamos la session
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                customer_email=user_email,
                submit_type='donate',
                billing_address_collection='auto',
                shipping_address_collection={
                    'allowed_countries': ['US', 'CA', 'ES'],
                },
                line_items=[
                    {
                        'price': producto_escogido.price_id,
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=Mi_DOMINIO + success_url, 
                cancel_url=Mi_DOMINIO + '/cancel', 
            )
        
        except Exception as e:
           return str(e)

        return redirect(checkout_session.url, code=303)




