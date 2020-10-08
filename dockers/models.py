from django.db import models


# Create your models here.

class SgxDocker(models.Model):
    category = models.CharField(max_length=128, verbose_name='도커카테고리')
    repository = models.CharField(max_length=128, verbose_name='레포지토리명')
    version = models.CharField(max_length=128, verbose_name='Alpine버전')
    tag = models.CharField(max_length=128, verbose_name='태그')
    sourcePath = models.CharField(max_length=128, verbose_name='소스경로')
    filePath = models.CharField(max_length=1024, verbose_name='실행파일경로')
    dockerfile = models.TextField(verbose_name='도커파일텍스트')
    imageId = models.TextField(max_length=128, verbose_name='도커이미지 ID' ,default='')
    registered_dt = models.DateTimeField(auto_now_add=True, verbose_name='등록시간')
    registered_user = models.ForeignKey('user.SgxUser', on_delete=models.CASCADE, verbose_name='등록자')

    def __str__(self):
        return self.category

    class Meta:
        db_table = 'sgx_dockers'
        verbose_name = 'SGX Docker'
        verbose_name_plural = 'SGX Docker'
