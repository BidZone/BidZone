from django.urls import path
from .views import AukcijaCreateView, RegisterView, LoginView
from . import views

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('auctions/create/', AukcijaCreateView.as_view(), name='create_auction'),
    path('auctions/', views.get_auctions, name='get_auctions'),
    path('verify-email/<uidb64>/<token>/', views.verify_email, name='verify_email')
]