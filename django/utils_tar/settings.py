
from pathlib import Path
import datetime
import os
from cryptography.fernet import Fernet

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = os.environ.get('DEBUG',default=0)

MY_HOST=os.environ.get('MY_HOST')
MY_DOMAIN='http://'+ MY_HOST
if DEBUG.lower() == 'false':
    MY_DOMAIN = 'https://' + MY_HOST

#ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS",default="127.0.0.1").split(" ")
ALLOWED_HOSTS = ['localhost', MY_HOST, 'myutils.com', 'www.myutils.com']

LOGIN_URL = 'account_login'
LOGOUT_URL = 'account_logout'

AUTH_USER_MODEL = 'customerUser.CustomUser'
LOGIN_REDIRECT_URL = 'home'

# Esto no viene por defecto lo he añadido para utilizar google authentication
AUTHENTICATION_BACKENDS = (
    'allauth.account.auth_backends.AuthenticationBackend',
)
# Esto no viene por defecto lo he añadido para utilizar google authentication
AUTHENTICATION_CLASSES = (
    'allauth.account.auth_backends.AuthenticationBackend',
)
# Esto no viene por defecto lo he añadido para utilizar google authentication
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['profile', 'email'],
        'APP': {
            'client_id': os.environ.get('SOCIAL_PROVIDER_CLIENT_ID'),
            'secret': os.environ.get('SOCIAL_PROVIDER_SECRET'),
        },
    },
}


# Directorio base donde se guardarán los archivos subidos por los usuarios.
MEDIA_ROOT = BASE_DIR / 'media'

# URL base para servir archivos media.
MEDIA_URL = '/media/'
CARPETA_PDFS_GENERADOS=os.path.join(MEDIA_ROOT,'carp_pdfs')
TEMP_FOLDER = os.path.join(MEDIA_ROOT, 'carp_tem')
CLAVE_KEY_SECRETA_RANDOM=os.environ.get('CLAVE_KEY_SECRETA_RANDOM')

RUNSERVER_TIMEOUT = 300  # aumenta a 5 minutos o ajusta según sea necesario

DATA_UPLOAD_MAX_NUMBER_FIELDS = 10240
# Application definition

# Duración del token de sesión en segundos (1 hora)
SESSION_COOKIE_AGE =3600
# Actualizar la fecha de caducidad de la sesión en cada solicitud
SESSION_SAVE_EVERY_REQUEST = True
# Expirar la sesión cuando se cierre el navegador
SESSION_EXPIRE_AT_BROWSER_CLOSE = True


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'customerUser',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'product',
    'util_media',
    'servicios',
    'cvs',
    #'proxy',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    # 'proxy.middleware.ProxyMiddleware',
    # 'proxy.middleware.ReverseProxyMiddleware',
]



CORS_ORIGIN_WHITELIST=(
    'http://127.0.0.1:8000',
    'http://localhost:8000',
    'http://0.0.0.0:8000',
    'http://127.0.0.1',
    'http://127.0.0.1:80',
)

ROOT_URLCONF = 'utils_tar.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'utils_tar.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DATABASE_NAME', 'util_tar_db'),
        'USER': os.environ.get('DATABASE_USER', 'util_tar_db_2023'),
        'PASSWORD': os.environ.get('DATABASE_PASSWORD', 'Ta00000000'),
        'HOST': os.environ.get('DATABASE_HOST', 'mysql'),  # Debe coincidir con el nombre del servicio de MySQL en tu docker-compose.yml
        'PORT': os.environ.get('DATABASE_PORT', '3306'),
    }
}





# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS =[BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / "staticfiles"



# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STRIPE_SECRET_KEY=os.environ.get('STRIPE_KEY')


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')


X_FRAME_OPTIONS = 'SAMEORIGIN'
