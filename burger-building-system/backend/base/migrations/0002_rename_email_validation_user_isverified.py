# Generated by Django 4.0.5 on 2022-12-08 07:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='email_validation',
            new_name='isVerified',
        ),
    ]
