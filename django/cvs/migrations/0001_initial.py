# Generated by Django 4.2.5 on 2024-01-04 07:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Curriculum',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('fecha_modificacion', models.DateTimeField(auto_now=True)),
                ('veces_modificado', models.IntegerField(default=0)),
                ('url_imagen', models.ImageField(blank=True, null=True, upload_to='cv_images/')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Skills',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('skill', models.CharField(blank=True, max_length=255, null=True)),
                ('url_skill', models.CharField(blank=True, max_length=255, null=True)),
                ('curriculum', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cvs.curriculum')),
            ],
        ),
        migrations.CreateModel(
            name='InformacionUsuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(blank=True, max_length=255, null=True)),
                ('last_name', models.CharField(blank=True, max_length=255, null=True)),
                ('email', models.EmailField(blank=True, max_length=255, null=True)),
                ('address', models.CharField(blank=True, max_length=255, null=True)),
                ('phone', models.CharField(blank=True, max_length=255, null=True)),
                ('img_cv', models.ImageField(blank=True, null=True, upload_to='user_images/')),
                ('curriculum', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='cvs.curriculum')),
            ],
        ),
        migrations.CreateModel(
            name='Idiomas',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('idioma', models.CharField(blank=True, max_length=255, null=True)),
                ('nivel', models.CharField(blank=True, max_length=255, null=True)),
                ('curriculum', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cvs.curriculum')),
            ],
        ),
        migrations.CreateModel(
            name='ExperienciaLaboral',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('puesto', models.CharField(blank=True, max_length=255, null=True)),
                ('inicio', models.DateTimeField()),
                ('fin', models.DateTimeField()),
                ('empresa', models.CharField(max_length=255)),
                ('trabajo_realizado', models.TextField(max_length=500)),
                ('curriculum', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cvs.curriculum')),
            ],
        ),
        migrations.CreateModel(
            name='DatosAcademicos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(blank=True, max_length=255, null=True)),
                ('inicio', models.DateTimeField()),
                ('fin', models.DateTimeField()),
                ('escuela', models.CharField(max_length=255)),
                ('curriculum', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cvs.curriculum')),
            ],
        ),
    ]
