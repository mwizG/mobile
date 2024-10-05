"""
Django settings for careann_backend project.

Generated by 'django-admin startproject' using Django 5.0.2.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-p167p4pa36ytc^zpp41b%sc$d6309&vnkk0386mxt18h*41$b='

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


import stripe

STRIPE_SECRET_KEY = "your-secret-key"
STRIPE_PUBLISHABLE_KEY = "your-publishable-key"

stripe.api_key = STRIPE_SECRET_KEY

CHECKR_API_KEY = "your-checkr-api-key"
CHECKR_BASE_URL = "https://api.checkr.com/v1"
# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'channels',  # Make sure 'channels' is installed and listed
    'accounts',  # Custom apps need to be listed after 'django.contrib' apps
    'jobs',
    'payments',
    'messaging',
    'admin_panel',
    'background_checks',
    'emergency_services',
    'pharmacy',
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

CORS_ALLOW_ALL_ORIGINS = True 
CORS_ALLOW_CREDENTIALS = True  # Allows cookies and authorization headers
CORS_ALLOW_HEADERS = [
    '*',
]

CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
]
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://192.168.251.86:8081"
#         # Allow your React app's origin
# ]


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),  # Set your preferred access token expiration
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),      # Set your preferred refresh token expiration
    'ROTATE_REFRESH_TOKENS': True,                    # Optional: Rotate refresh tokens
    'BLACKLIST_AFTER_ROTATION': True,                 # Optional: Blacklist old refresh tokens
}

AUTH_USER_MODEL = 'accounts.CustomUser'

ROOT_URLCONF = 'careann_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'careann_backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/5.0/topics/i18n/

# Set the timezone to Africa/Lusaka, which is Zambian time
TIME_ZONE = 'Africa/Lusaka'

USE_TZ = True  # Enable timezone-aware datetimes

# Optional: Make sure to adjust the localization and language settings if needed
LANGUAGE_CODE = 'en-us'
USE_L10N = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'  # Ensure that BASE_DIR is defined properly in settings


# Add the ASGI application
ASGI_APPLICATION = 'careann_backend.asgi.application'

# Add channel layers configuration (using Redis as the backend)
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],  # Ensure Redis is running on your system
        },
    },
}