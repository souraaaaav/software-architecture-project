# Generated by Django 4.0.5 on 2023-01-13 13:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_pieinfo'),
    ]

    operations = [
        migrations.CreateModel(
            name='Burger',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('salad', models.IntegerField(blank=True, null=True)),
                ('meat', models.IntegerField(blank=True, null=True)),
                ('bacon', models.IntegerField(blank=True, null=True)),
                ('cheese', models.IntegerField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_price', models.IntegerField(blank=True, null=True)),
                ('order_id', models.CharField(max_length=20)),
                ('order_time', models.DateTimeField(auto_now_add=True)),
                ('burger', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='base.burger')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.DeleteModel(
            name='PieInfo',
        ),
    ]
