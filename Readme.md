# MyUtils App with Docker + Nginx + Stripe

## Descripción
Esta aplicación utiliza Docker para contenerizar la aplicación, Nginx como servidor web y Stripe para procesar pagos.

## Requisitos
Asegúrate de tener instalado lo siguiente:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Configuración

### Configuración de Stripe
1. Crea una cuenta en [Stripe](https://stripe.com/).
2. Obtén tus claves de API de Stripe.
3. Actualiza las variables de entorno en el archivo `.env` con tus claves de Stripe.

### Configuración de la Aplicación
1. Clona este repositorio: `git clone https://github.com/tu_usuario/myutils_docker_stripe.git`
2. Navega al directorio del proyecto: `cd myutils_docker_stripe`

## Uso


### Construir y Ejecutar
```bash
docker-compose up --build


### Ejecutar
docker-compose up 

### Terminar
docker-compose down
```

## Iniciar Sesión con Google
Esta aplicación permite la autenticación a través de Google. Para habilitar esta funcionalidad, asegúrate de seguir estos pasos:

1. Asegúrate de tener las credenciales de autenticación de Google configuradas.
2. Si el servidor con las credenciales de Google está activo, los usuarios podrán iniciar sesión con sus cuentas de Google.
3. En caso de no tener un servidor de autenticación activo o si necesitas configurar nuevas credenciales, sigue las instrucciones de Google para [configurar la autenticación OAuth 2.0](https://developers.google.com/identity/sign-in/web/sign-in).

## Personalización
- Puedes personalizar la configuración del servidor Nginx en `nginx/nginx.conf`.
- Ajusta la configuración de la aplicación Django en `django/settings.py`.

## Problemas Conocidos
- En caso de problemas, revisa los logs de Docker con `docker-compose logs`.

## Contribuciones
¡Contribuciones son bienvenidas! Si encuentras un problema o tienes una sugerencia, por favor [crea un issue](https://github.com/tu_usuario/myutils_docker_stripe/issues).


## Licencia
Este proyecto está bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.


