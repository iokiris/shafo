# Generated by Django 5.0.2 on 2024-03-01 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eauth', '0002_alter_emailconfirmtoken_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userwithemail',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
    ]
