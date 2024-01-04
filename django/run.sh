#!/bin/bash

set -e

which python
python --version

echo "Migrating database..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Starting Gunicorn..."
gunicorn utils_tar.wsgi:application --bind 0.0.0.0:8000 -c gunicorn.conf.py





