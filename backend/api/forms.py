from django import forms
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError

class ShortcutForm(forms.Form):
    full_url = forms.CharField(validators=[URLValidator()])

    def clean_full_url(self):
        full_url = self.cleaned_data['full_url']
        validator = URLValidator()
        try:
            validator(full_url)
        except ValidationError as e:
            raise forms.ValidationError("Invalid URL.")
        return full_url