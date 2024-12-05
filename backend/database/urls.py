from django.urls import path
from .views import RegisterView
from . import views

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/<uidb64>/<token>/', views.verify_email, name='verify_email')
]