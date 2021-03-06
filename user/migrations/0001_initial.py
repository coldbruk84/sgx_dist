# Generated by Django 3.1.1 on 2020-09-14 02:22

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Sgxuser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=64, verbose_name='사용자명')),
                ('password', models.CharField(max_length=64, verbose_name='비밀번호')),
                ('registered_dt', models.DateField(auto_now_add=True, verbose_name='등록시간')),
            ],
            options={
                'db_table': 'sgx_user',
            },
        ),
    ]
