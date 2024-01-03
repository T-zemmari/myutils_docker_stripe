from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import get_user_model



class RegistrationForm(UserCreationForm):
    first_name = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-input','placeholder':'Escribe tu nombre'}),
        label='Nombre' 
    )
    last_name = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-input','placeholder':'Escribe tus apellidos'}),
        label='Apellidos' 
    )
    email = forms.EmailField(
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-input','placeholder':'Email'}),
        label='email' 
    )
    password1 = forms.CharField(
        label='Contraseña',
        widget=forms.PasswordInput(attrs={'class': 'form-input','placeholder':'Contraseña'}),
    )
    password2 = forms.CharField(
        label='Confirmar Contraseña',
        widget=forms.PasswordInput(attrs={'class': 'form-input','placeholder':'Confirmar contraseña'}),
    )
    fecha_nacimiento = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date', 'class': 'form-input','placeholder':'Fecha de nacimiento'}),
        required=False,
        label='Fecha de Nacimiento' 
    )
    numero_telefono = forms.CharField(
        max_length=15,
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-input','placeholder':'Teléfono','autocomplete':'off'}),
        label='Número de Teléfono' 
    )

    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'email', 'password1', 'password2', 'fecha_nacimiento', 'numero_telefono')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        User = get_user_model()
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError('Este correo electrónico ya está en uso. Por favor, utiliza otro.')
        return email    




class LoginForm(AuthenticationForm):
    username = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Correo Electrónico'}),
        label='Correo Electrónico'
    )
    password = forms.CharField(
        label='Contraseña',
        widget=forms.PasswordInput(attrs={'class': 'form-input', 'placeholder': 'Contraseña'}),
    )

    class Meta:
        model = CustomUser
        fields = ('username','email', 'password')   



