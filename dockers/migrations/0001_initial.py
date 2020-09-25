# Generated by Django 3.1.1 on 2020-09-16 08:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user', '0005_sgxuser_useremail'),
    ]

    operations = [
        migrations.CreateModel(
            name='SgxDocker',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(max_length=128, verbose_name='도커카테고리')),
                ('repository', models.CharField(max_length=128, verbose_name='레포지토리명')),
                ('version', models.CharField(max_length=128, verbose_name='Alpine버전')),
                ('tag', models.CharField(max_length=128, verbose_name='태그')),
                ('filePath', models.CharField(max_length=128, verbose_name='실행파일경로')),
                ('dockerfile', models.TextField(verbose_name='도커파일텍스트')),
                ('registered_dt', models.DateTimeField(auto_now_add=True, verbose_name='등록시간')),
                ('registered_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.sgxuser', verbose_name='등록자')),
            ],
            options={
                'verbose_name': 'SGX Docker',
                'verbose_name_plural': 'SGX Docker',
                'db_table': 'sgx_dockers',
            },
        ),
    ]
