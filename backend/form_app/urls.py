from django.urls import path
from .views import FormSuggestionView

urlpatterns = [
    path('submit/', FormSuggestionView.as_view(), name='form-submit'),
]