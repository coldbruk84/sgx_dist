from django.contrib import admin
from .models import SgxDocker


# Register your models here.
class DockersAdmin(admin.ModelAdmin):
    list_display = ('category', 'repository', 'version', 'tag', 'sourcePath', 'filePath', 'dockerfile',)


admin.site.register(SgxDocker, DockersAdmin)