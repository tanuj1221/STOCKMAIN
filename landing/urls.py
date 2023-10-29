from django.contrib import admin
from django.urls import path, include
from .views import index, stock_details, verify_phone, take_phone,get_api_data
from . import views

urlpatterns = [
    path('', index, name="index-page"),
    path('stock-details/', stock_details, name="stock-det"),
    path('verify-phone/', verify_phone, name="verify-phone"),
    path('phone/', take_phone, name="take-phone"),
   
   path('fetch_historical_data/', views.fetch_historical_data, name='fetch_historical_data'),
   path('fetch_1day_data/', views.fetch_1day_data, name='fetch_1day_data'),
    path('api/company_data/', views.get_company_data, name='company_data'),
    path('landing/fetch_stock_data/', views.fetch_stock_data, name='fetch_stock_data'),
    path('landing/stock_info/', views.stock_info, name='stock_info'),
 path('financial_ratios/<str:symbol>/', views.financial_ratios, name='financial_ratios'),
    path('earnings_revenue/<str:symbol>/', views.earnings_revenue, name='earnings_revenue'),
    path('stock_performance/<str:symbol>/', views.stock_performance, name='stock_performance'),
    path('dividend_info/<str:symbol>/', views.dividend_info, name='dividend_info'),
    path('valuation/<str:symbol>/', views.valuation, name='valuation'),
     path('api/balance_data/<str:symbol>/', views.fetch_balance_data, name='financial_data'),
     path('api/income_data/<str:symbol>/', views.fetch_income_data, name='income_data'),
     path('api/cashflow_data/<str:symbol>/', views.fetch_cash_data, name='cash_data'),
       path('get_stock_data/<str:symbol>/', views.get_stock_data, name='get_stock_data'),
         path('fetch-news/<str:symbol>/', views.fetch_news, name='fetch-news'),
   
]





