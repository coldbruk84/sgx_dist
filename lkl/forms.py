from django.core.exceptions import ObjectDoesNotExist

from django import forms
from .models import SgxLkl


class LklForm(forms.Form):
    imageName = forms.CharField(
        error_messages={
            'required': '카테고리를 선택해 주세요'
        }, max_length=128, label="이미지명" )
    imageSize = forms.CharField(
        error_messages={
            'required': 'Repository 명을 입력해 주세요.'
        }, max_length=128, label="이미지크기" ,empty_value='alpine-flask')
    imagePath = forms.CharField(
        error_messages={
            'required': 'Alpine 버전을 선택해 주세요.'
        }, max_length=128, label="이미지 경로" ,empty_value='3.12')
    imageRun = forms.CharField(max_length=128, label="이미지 실행 여부" ,empty_value='latest')