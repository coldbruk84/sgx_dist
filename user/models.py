from django.db import models


# Create your models here.

class SgxUser(models.Model):
    username = models.CharField(max_length=128, verbose_name='사용자명')
    useremail = models.EmailField(max_length=128, verbose_name='사용자이메일')
    password = models.CharField(max_length=128, verbose_name='비밀번호')
    auth = models.CharField(max_length=128, verbose_name='권한', default='user')
    use_state = models.CharField(max_length=128, verbose_name='등록상태', default='wait')
    registered_dt = models.DateField(auto_now_add=True, verbose_name='등록시간')

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'sgx_user'
        verbose_name = 'SGX 사용자'
        verbose_name_plural = 'SGX 사용자'
