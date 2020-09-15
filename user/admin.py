from django.contrib import admin
from .models import SgxUser


# 관리자에 쓸 클래스 정의
class SgxUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'password')


admin.site.register(SgxUser, SgxUserAdmin)
