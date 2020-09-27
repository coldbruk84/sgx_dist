from django.db import models


# Create your models here.

class SgxLkl(models.Model):
    imageName = models.CharField(max_length=128, verbose_name='이미지 파일 명')
    dockerId = models.ForeignKey('dockers.SgxDocker', on_delete=models.CASCADE, verbose_name='도커 ID')
    imageSize = models.CharField(max_length=128, verbose_name='이미지 파일 크기')
    imagePath = models.CharField(max_length=128, verbose_name='이미지 저장 경로')
    imageRun = models.CharField(max_length=128, verbose_name='이미지 실행 여부')
    registeredDt = models.DateTimeField(auto_now_add=True, verbose_name='등록시간')
    registeredUser = models.ForeignKey('user.SgxUser', on_delete=models.CASCADE, verbose_name='등록자')

    def __str__(self):
        return self.imageName

    class Meta:
        db_table = 'sgx_lkl'
        verbose_name = 'SGX LKL'
        verbose_name_plural = 'SGX LKL'