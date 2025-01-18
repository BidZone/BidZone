from django.urls import path
from .views import AukcijaCreateView, RegisterView, LoginView, WithdrawMoneyView, DepositMoneyView, BalanceView
from . import views

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('auctions/create/', AukcijaCreateView.as_view(), name='create_auction'),
    path('auctions/', views.get_auctions, name='get_auctions'),
    path('verify-email/<uidb64>/<token>/', views.verify_email, name='verify_email'),
    path('withdraw/', WithdrawMoneyView.as_view(), name='withdraw_money'),
    path('deposit/', DepositMoneyView.as_view(), name='deposit_money'),
    path('balance/', BalanceView.as_view(), name='get_balance'),
    path('bidanje/<int:id_aukcije>/', views.bidanje, name='bidanje'),
    path('aukcija/<int:id_aukcije>/', views.detalji_aukcije, name='detalji_aukcije'),
    path('buy_now/<int:id_aukcije>/', views.buy_now, name='buy_now'),
]