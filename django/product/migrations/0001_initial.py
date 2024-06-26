# Generated by Django 4.2.5 on 2024-01-04 07:39

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ProductModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=100)),
                ('description', models.TextField(blank=True, max_length=1000)),
                ('price', models.DecimalField(decimal_places=2, max_digits=5, verbose_name='Price')),
                ('price_id', models.CharField(blank=True, max_length=100, null=True, verbose_name='Price_ID_En_Strip')),
                ('date_created', models.DateTimeField(auto_now_add=True, verbose_name='Date Created')),
                ('date_modified', models.DateTimeField(auto_now=True, verbose_name='Date Modified')),
                ('days', models.PositiveIntegerField(default=0, verbose_name='Days')),
                ('is_suscription', models.PositiveIntegerField(default=0, verbose_name='Is_suscription')),
            ],
        ),
    ]
