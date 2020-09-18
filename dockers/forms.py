from django import forms


class DockersForm(forms.Form):
    category = forms.CharField(
        error_messages={
            'required': '카테고리를 선택해 주세요'
        }, max_length=128, label="도커카테고리" )
    repository = forms.CharField(
        error_messages={
            'required': 'Repository 명을 입력해 주세요.'
        }, max_length=128, label="레포지토리명" ,empty_value='repo1')
    version = forms.CharField(
        error_messages={
            'required': 'Alpine 버전을 선택해 주세요.'
        }, max_length=128, label="Alpine버전" ,empty_value='3.71')
    tag = forms.CharField(
        error_messages={
            'required': '태그명을 입력해 주세요.'
        }, max_length=128, label="태그" ,empty_value='latest')
    sourcePath = forms.CharField(
        error_messages={
            'required': '소스 경로를 입력해 주세요.'
        }, max_length=128, label="소스경로" ,empty_value='/src')
    filePath = forms.CharField(
        error_messages={
            'required': '실행파일 경로를 입력해 주세요.'
        }, max_length=128, label="실행파일경로" ,empty_value='/')
    dockerfile = forms.CharField(
        error_messages={
        }, widget=forms.Textarea, label="도커 텍스트")


