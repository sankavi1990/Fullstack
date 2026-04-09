from django.urls import path
from .views import SendMessageView, ChatHistoryView, ClearHistoryView

urlpatterns = [
    path('send/', SendMessageView.as_view(), name='send-message'),
    path('history/', ChatHistoryView.as_view(), name='chat-history'),
    path('clear/', ClearHistoryView.as_view(), name='clear-history'),
]