#!/bin/bash

python manage.py migrate
python manage.py collectstatic --no-input
gunicorn utils_tar.wsgi:application --bind 0.0.0.0:8000 -c gunicorn.conf.py



