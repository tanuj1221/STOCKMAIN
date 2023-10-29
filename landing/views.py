from django.shortcuts import render, redirect
from allauth.account.views import SignupView
from .forms import MySignUp
from django.conf import settings
import requests
import os
from twilio.rest import Client
import plotly.graph_objects as go
import json
from django.http import JsonResponse
import requests
from datetime import datetime, timedelta

from django.http import JsonResponse
import requests
from datetime import datetime, timedelta

verified_number = 0
account_sid = "ACbe2433c197d4e2387b7952226cb26462"
auth_token = "782ac6726ea38498896e546b0b13baf5"
verify_sid = "VA46007a5785d2af6e899831b39e4c25dc"
client = Client(account_sid, auth_token)

FMP_KEY = settings.FMP_API_KEY

# Create your views here.
def index(request):
    return render(request, 'landing/index.html')



# views.py



import requests
from django.http import JsonResponse


def get_api_data(request):
 if request.user.is_authenticated:
    if request.method == 'GET':
        symbol = request.GET.get('symbol', '')
        if symbol:
            # Replace 'YOUR_API_KEY' with your actual API key from financialmodelingprep.com
            api_url = f"https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={FMP_KEY}"

            try:
                response = requests.get(api_url)
                if response.status_code == 200:
                    data = response.json()
                    return JsonResponse(data, safe=False)
                else:
                    return JsonResponse({}, safe=False)
            except requests.RequestException as e:
                return JsonResponse({}, safe=False)

    return JsonResponse({}, safe=False)

    
from dateutil.relativedelta import relativedelta

def fetch_historical_data(request):
    symbol = request.GET.get('symbol', None)
    interval = request.GET.get('interval', None)

    def calculate_date_range(interval):
        current_date = datetime.now().date()
        if interval == '6months':
            past_date = current_date - relativedelta(months=6)
        elif interval == '1year':
            past_date = current_date - relativedelta(years=1)
        elif interval == '5years':
            past_date = current_date - relativedelta(years=5)
        else:
            past_date = None

        return past_date.isoformat() if past_date else None, current_date.isoformat()

    from_date, to_date = calculate_date_range(interval)

    api_url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&outputsize=full&apikey=V6KG8ZEHYWIUSXDX"
    if from_date:
        api_url += f"&from={from_date}"

    response = requests.get(api_url)
    data = response.json()
  

    time_series = data["Time Series (Daily)"]

    chart_data = []
    for date, values in time_series.items():
        chart_data.append({
            'time':date,  # Convert to milliseconds
            'value': float(values["4. close"])
        })

    return JsonResponse(chart_data, safe=False)

def fetch_1day_data(request):
    symbol = request.GET.get('symbol', None)

    # Assuming you have already defined FMP_KEY

    api_url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=1min&outputsize=full&apikey=V6KG8ZEHYWIUSXDX'

    response = requests.get(api_url)
    data = response.json()

    # Extract the time series data from the response
    time_series = data["Time Series (1min)"]

    # Convert the time series data to a list of dictionaries
    chart_data = []
    for timestamp, values in time_series.items():
        chart_data.append({
            'time': int(datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S").timestamp()),
            'value': float(values["4. close"])
        })

    return JsonResponse(chart_data, safe=False)

from django.http import JsonResponse
import requests
import json

def get_company_data(request):
    symbol = request.GET.get('symbol', 'AAPL')  # default to 'AAPL' if no symbol is provided
     # replace with your actual API key

    url = f'https://www.alphavantage.co/query?function=OVERVIEW&symbol={symbol}&apikey=V6KG8ZEHYWIUSXDX'
    response = requests.get(url)
    data = response.json()

    return JsonResponse(data)

from django.shortcuts import render
from django.http import JsonResponse
import requests

import requests
from django.http import JsonResponse
def fetch_stock_data1(symbol):
    api_url = f"https://www.alphavantage.co/query?function=OVERVIEW&symbol={symbol}&apikey=V6KG8ZEHYWIUSXDX"

    try:
        response = requests.get(api_url)
        response.raise_for_status()
        data = response.json()

        return data

    except requests.exceptions.RequestException as e:
        return {'error': str(e)}


def fetch_stock_data(request):
    symbol = request.GET.get('symbol', None)
    api_url = f"https://www.alphavantage.co/query?function=OVERVIEW&symbol={symbol}&apikey=V6KG8ZEHYWIUSXDX"

    try:
        response = requests.get(api_url)
        response.raise_for_status()
        data = response.json()

        profile_info = {
            "Symbol": data.get("Symbol", ""),
            "Name": data.get("Name", ""),
            "Description": data.get("Description", ""),
            "Sector": data.get("Sector", ""),
            "Industry": data.get("Industry", ""),
            "Market Cap ($M USD)": int(data.get("MarketCapitalization", 0)) / 1e6,
            "Short % of Float": "Not Available",
            "Employees": "Not Available",
            "Sales ($M)": int(data.get("RevenueTTM", 0)) / 1e6,
            "Shares Outstanding": int(data.get("SharesOutstanding", 0)),
            "IPO Date": "Not Available",
            "Ex-Dividend Date": data.get("ExDividendDate", ""),
            "Last Reported Qtr.": data.get("LatestQuarter", ""),
            "Next Quarter Report Date": "Not Available",
            "Headquarters": data.get("Address", ""),
              # Replace this with actual data if available
        }

        return JsonResponse(profile_info)

    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': str(e)})
from django.http import JsonResponse
from django.views.decorators.http import require_GET

@require_GET
def financial_ratios(request, symbol):
    data = fetch_stock_data1(symbol)
    ratios = {
        "PERatio": data.get("PERatio", ""),
        "PEGRatio": data.get("PEGRatio", ""),
        "DividendYield": data.get("DividendYield", ""),
        "ProfitMargin": data.get("ProfitMargin", ""),
        "OperatingMarginTTM": data.get("OperatingMarginTTM", ""),
        "ReturnOnAssetsTTM": data.get("ReturnOnAssetsTTM", ""),
        "ReturnOnEquityTTM": data.get("ReturnOnEquityTTM", ""),
    }
    return JsonResponse(ratios)

@require_GET
def earnings_revenue(request, symbol):
    data = fetch_stock_data1(symbol)
    earnings = {
        "EBITDA": data.get("EBITDA", ""),
        "EPS": data.get("EPS", ""),
        "RevenuePerShareTTM": data.get("RevenuePerShareTTM", ""),
        "RevenueTTM": data.get("RevenueTTM", ""),
        "GrossProfitTTM": data.get("GrossProfitTTM", ""),
        "DilutedEPSTTM": data.get("DilutedEPSTTM", ""),
    }
    return JsonResponse(earnings)

@require_GET
def stock_performance(request, symbol):
    data = fetch_stock_data1(symbol)
    performance = {
        "52WeekHigh": data.get("52WeekHigh", ""),
        "52WeekLow": data.get("52WeekLow", ""),
        "50DayMovingAverage": data.get("50DayMovingAverage", ""),
        "200DayMovingAverage": data.get("200DayMovingAverage", ""),
        "Beta": data.get("Beta", ""),
        "AnalystTargetPrice": data.get("AnalystTargetPrice", ""),
    }
    return JsonResponse(performance)

@require_GET
def dividend_info(request, symbol):
    data = fetch_stock_data1(symbol)
    dividend = {
        "DividendPerShare": data.get("DividendPerShare", ""),
        "DividendYield": data.get("DividendYield", ""),
        "DividendDate": data.get("DividendDate", ""),
        "ExDividendDate": data.get("ExDividendDate", ""),
    }
    return JsonResponse(dividend)

@require_GET
def valuation(request, symbol):
    data = fetch_stock_data1(symbol)
    valuation = {
        "PriceToSalesRatioTTM": data.get("PriceToSalesRatioTTM", ""),
        "PriceToBookRatio": data.get("PriceToBookRatio", ""),
        "EVToRevenue": data.get("EVToRevenue", ""),
        "EVToEBITDA": data.get("EVToEBITDA", ""),
        "ForwardPE": data.get("ForwardPE", ""),
        "TrailingPE": data.get("TrailingPE", ""),
    }
    return JsonResponse(valuation)

# views.py
from django.http import JsonResponse
import requests

def fetch_balance_data(request, symbol):
    url = f'https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol={symbol}&apikey=V6KG8ZEHYWIUSXDX'
    response = requests.get(url)
    data = response.json()
    annual_report = data.get('annualReports')[0]  # Get first annual report
    return JsonResponse(annual_report)

def fetch_income_data(request, symbol):
    url = f'https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol={symbol}&apikey=V6KG8ZEHYWIUSXDX'
    response = requests.get(url)
    data = response.json()
    annual_report = data.get('annualReports')[0]  # Get first annual report
    return JsonResponse(annual_report)

def fetch_cash_data(request, symbol):
    url = f'https://www.alphavantage.co/query?function=CASH_FLOW&symbol={symbol}&apikey=V6KG8ZEHYWIUSXDX'
    response = requests.get(url)
    data = response.json()
    annual_report = data.get('annualReports')[0]  # Get first annual report
    return JsonResponse(annual_report)


def get_stock_data(request, symbol):
    api_url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey=V6KG8ZEHYWIUSXDX"
    response = requests.get(api_url)
    data = response.json()
    return JsonResponse(data)



def fetch_news(request,symbol):
    
    url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={symbol}&apikey=demo"
    response = requests.get(url)
    data = response.json()
    return JsonResponse(data)


def stock_info(request):
    return render(request, 'stock_info.html')


def stock_details(request):
    if request.user.is_authenticated:
        
            
        
            return render(request, 'landing/stock-det.html')
    return redirect("/accounts/login")



def take_phone(request):
    if request.method == 'GET':
        return render(request, 'landing/take_phone.html')
    
    if request.method == 'POST':
        global verified_number
        verified_number = "+91"+request.POST.get('p_number')

        verification = client.verify.v2.services(verify_sid) \
            .verifications \
                .create(to=verified_number, channel="sms")
        print(verification.status)

        if(verification.status == "pending"):
            context = {
                "message":"pending"
            }
            return render(request, 'landing/phone_validation.html', context)
        else:
            context = {
                "message":"something went wrong"
            }
            return render(request, 'landing/take_phone.html', context)

    return render(request, 'landing/take_phone.html')

def verify_phone(request):
    if request.method == 'POST':
        global verified_number
        otp_code = request.POST.get('otp')

        print("verified_number is : ")
        print(verified_number)

        verification_check = client.verify.v2.services(verify_sid) \
            .verification_checks \
                .create(to=verified_number, code=otp_code)
        print(verification_check.status)

        if verification_check.status == "approved":
            return redirect("http://65.2.161.78:8000/accounts/signup/")
    
    return render(request, 'landing/take_phone.html')

class CustomSignUp(SignupView):
    form_class = MySignUp



'''
This is for testing git dont give a shit
'''