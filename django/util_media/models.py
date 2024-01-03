from django.db import models
from django.utils.translation import gettext as _
from customerUser.models import CustomUser

class UtilMediaModel(models.Model):
    url = models.CharField(max_length=100, blank=True, null=False)
    file_name = models.CharField(max_length=100, blank=True, null=False)
    file_type = models.CharField(max_length=100, blank=True, null=False)
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    date_created = models.DateTimeField(_("Date Created"), auto_now_add=True)
    date_modified = models.DateTimeField(_("Date Modified"), auto_now=True)

    def __str__(self):
        return self.url
