# settings.py

from pathlib import Path
from datetime import timedelta
import os
import environ

# settings.py

# Enable timezone support
USE_TZ = True

# Set the default time zone for your project (Asia/Manila for Philippines)
TIME_ZONE = 'Asia/Manila'

# If you want to use the timezone for logging and other functionalities
LANGUAGE_CODE = 'en-us'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# If you want to have the timezone-aware date-time fields
TIME_ZONE = 'Asia/Manila'  # Adjust to your timezone


BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env()
environ.Env.read_env(str(BASE_DIR / '.env'))

SECRET_KEY = env("SECRET_KEY")

DEBUG = True
ALLOWED_HOSTS = ['*']


INSTALLED_APPS = [
    'channels',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'aerolamp_api',
    'users',
    'AppControl',
    'rest_framework',
    'corsheaders',
    'knox',
    'django_rest_passwordreset',
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
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
]
CORS_ALLOW_ALL_ORIGINS = True

AUTH_USER_MODEL = "users.Customuser"
ROOT_URLCONF = 'backend.urls'


AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",  # Keep this as fallback
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR/"templates"],
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

WSGI_APPLICATION = 'backend.wsgi.application'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'knox.auth.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': env("DB_NAME"), 
        'USER': env("DB_USER"),
        'PASSWORD': env("DB_PASSWORD"),
        'HOST': env("DB_HOST"),
        'PORT': env("DB_PORT"),
    }
}

# Email settings (you can keep them as you have them)

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "igopako3212@gmail.com"
EMAIL_HOST_PASSWORD = "ygbt ghxq gmes estk"

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER


# Static files and other Django settings
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

ASGI_APPLICATION = 'backend.asgi.application'

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    },
}
