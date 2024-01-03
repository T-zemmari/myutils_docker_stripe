from django import forms
from .models import Firma
class DocumentForm(forms.Form):
    title = forms.CharField(max_length=255)
    file = forms.FileField()


class FirmaForm(forms.ModelForm):
    class Meta:
        model = Firma
        fields = ['pdf', 'imagen_firma']
        widgets = {
            'pdf': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'imagen_firma': forms.ClearableFileInput(attrs={'class': 'form-control'}),
        }

