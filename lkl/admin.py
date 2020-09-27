from django.contrib import admin
from .models import SgxLkl


# Register your models here.
class DockersAdmin(admin.ModelAdmin):
    list_display = ('imageName', 'dockerId', 'imageSize', 'imagePath', 'imageRun',)

admin.site.register(SgxLkl, DockersAdmin)