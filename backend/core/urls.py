from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('auth_app.urls')),
    path('api/form/', include('form_app.urls')),
    path('api/products/', include('products_app.urls')),
    path('api/chat/', include('chat_app.urls')),  
]

# Serve media files in development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)