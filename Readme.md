# MyUtils App with Docker + Nginx + Stripe

## Descripción
Esta aplicación utiliza Docker para contenerizar la aplicación, Nginx como servidor web y Stripe para procesar pagos.

## Responsabilidad sobre el Uso Comercial

Este proyecto se proporciona exclusivamente con fines educativos y de aprendizaje. No me responsabilizo del uso que se le pueda dar con fines comerciales o en entornos de producción. Se recomienda encarecidamente realizar una revisión exhaustiva y una configuración adecuada antes de implementar este proyecto en un entorno de producción. Cualquier uso comercial o implementación en producción debe ser llevado a cabo bajo la responsabilidad y supervisión del usuario, garantizando el cumplimiento de los estándares de seguridad y rendimiento necesarios.

## Estado de Desarrollo
Por favor, ten en cuenta que la función de edición de videos (vista 'edito') aún está en desarrollo y no está completamente implementada. En futuras versiones del proyecto, se retomará este desarrollo para permitir la edición, corte y unión de videos.

## Requisitos
Asegúrate de tener instalado lo siguiente:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Configuración

### Configuración de Stripe
1. Crea una cuenta en [Stripe](https://stripe.com/).
2. Obtén tus claves de API de Stripe.
3. Actualiza las variables de entorno en el archivo `.env` con tus claves de Stripe.
4. Después de crear el superusuario admin y loguearte con admin, accede al panel de administración en 127.0.0.1/admin.

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

### Construir y Ejecutar
````bash
Despues de que la aplicacion arranque sin errores.
utiliza este comando para entrar al contenedor web:
docker-compose exec web bash
ó
docker-compose exec web sh

En la consola ejecuta el siguiente comando :
python manage.py createsuperuser
sigue las intrucciones para crear un superusuario.
cuando este creado podras acceder al panel administrador desde 127.0.0.1/admin

tambien te puedes logear con las nuevas credenciales

Despues puedes crear tus propios productos (o planes) desde el menu avatar productos

Si no creas los planes , no podras acceder a la seccion servicios .
Solo el superuser podra acceder .
Tambien puedes dar permisos a cualquier usuario sin plan para que pueda entrar desde menu usuarios

````




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
¡Contribuciones son bienvenidas! Si encuentras un problema o tienes una sugerencia, por favor [crea un issue](https://github.com/t-zemmari/myutils_docker_stripe/issues).


## Licencia
Este proyecto está bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.


