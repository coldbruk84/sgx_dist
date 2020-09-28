from django.core.exceptions import ObjectDoesNotExist

from django import forms
from .models import SgxDocker


class DockersForm(forms.Form):
    category = forms.CharField(
        error_messages={
            'required': '카테고리를 선택해 주세요'
        }, max_length=128, label="도커카테고리" )
    repository = forms.CharField(
        error_messages={
            'required': 'Repository 명을 입력해 주세요.'
        }, max_length=128, label="레포지토리명" ,empty_value='alpine-flask')
    version = forms.CharField(
        error_messages={
            'required': 'Alpine 버전을 선택해 주세요.'
        }, max_length=128, label="Alpine버전" ,empty_value='3.12')
    tag = forms.CharField(
        error_messages={
            'required': '태그명을 입력해 주세요.'
        }, max_length=128, label="태그" ,empty_value='latest')
    sourcePath = forms.CharField(
        error_messages={
            'required': '소스 경로를 입력해 주세요.'
        }, max_length=128, label="소스경로" ,empty_value='/usr/src/app')
    filePath = forms.FileField(
        error_messages={
            'required': '실행파일을 업로드해 주세요.'
        }, label="실행파일경로", required = False)
    dockerfile = forms.CharField(
        error_messages={
        }, widget=forms.Textarea, label="도커 텍스트")
    directories = forms.CharField(
        error_messages={
            'required': '실행파일을 업로드해 주세요.'
        })

    def clean(self):
        cleaned_data = super().clean()
        category = cleaned_data.get('category')
        repository = cleaned_data.get('repository')
        directories = cleaned_data.get('directories')
        insertFlag = 0

        if category and repository:
            try:
                instance = SgxDocker.objects.get(category=category, repository=repository)
            except SgxDocker.DoesNotExist:
                insertFlag = 1
                pass
            except SgxDocker.MultipleObjectsReturned:
                self.add_error('repository', repository + '와 동일한 레포지토리 명이 존재합니다.')
                return

            if insertFlag == 1:
                pass
            else:
                if instance:
                    self.add_error('repository', repository + '와 동일한 레포지토리 명이 존재합니다.')
                    return



