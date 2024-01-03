from django.db import models
from django.utils.translation import gettext as _

class ProductModel(models.Model):
    name = models.CharField(max_length=100, blank=True, null=False)
    description = models.TextField(max_length=1000, blank=True, null=False)
    price = models.DecimalField(_("Price"), max_digits=5, decimal_places=2)
    price_id = models.CharField(_("Price_ID_En_Strip"), max_length=100, blank=True, null=True)
    date_created = models.DateTimeField(_("Date Created"), auto_now_add=True)
    date_modified = models.DateTimeField(_("Date Modified"), auto_now=True)
    days = models.PositiveIntegerField(_("Days"), default=0)
    is_suscription = models.PositiveIntegerField(_("Is_suscription"), default=0)
    
    def __str__(self):
        return self.name

