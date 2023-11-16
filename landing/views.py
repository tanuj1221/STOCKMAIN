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
import pandas as pd

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


def get_stock_data_hist(request):
    symbol=request.GET.get('symbol', None)
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    frequency = request.GET.get('frequency')

    api_url = 'https://www.alphavantage.co/query'
    params = {
        'function': "TIME_SERIES_" + frequency.upper(),
        'symbol': symbol,
        'interval': '1d',
        'start_date': start_date,
        'end_date': end_date,
        'apikey': 'V6KG8ZEHYWIUSXDX'
    }

    response = requests.get(api_url, params=params)

    return JsonResponse(response.json())
    
from dateutil.relativedelta import relativedelta
def get_first_date_data(request):
    url = "https://www.alphavantage.co/query"
    function = "RSI"
    symbol = request.GET.get('symbol', None)
    interval = "weekly"
    time_period = 14
    series_type = "open"
    apikey = "V6KG8ZEHYWIUSXDX"

    params = {
        "function": function,
        "symbol": symbol,
        "interval": interval,
        "time_period": time_period,
        "series_type": series_type,
        "apikey": apikey
    }

    response = requests.get(url, params=params)
    data = response.json()

    # Extract the first date and its corresponding RSI value
    first_date = list(data["Technical Analysis: RSI"].keys())[0]
    rsi_value = data["Technical Analysis: RSI"][first_date]["RSI"]

    return JsonResponse({"first_date": first_date, "rsi_value": rsi_value})


def update_date(request, symbol):
    if request.method == 'GET' and request.is_ajax():
        # Replace 'YOUR_API_KEY' with your Alpha Vantage API key
        api_key = 'V6KG8ZEHYWIUSXDX'

        # Endpoint for getting the last quote
        endpoint = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}'

        # Make the request
        response = requests.get(endpoint)

        # Parse the JSON response
        data = response.json()

        # Extract the last price
        last_price = data['Global Quote']['05. price']

        # Get the current date and time
        current_time = datetime.utcnow().strftime('%A, %d %B %Y, %H:%M:%S UTC')

        # Prepare the data to send back
        result = {
            'symbol': symbol,
            'last_price': last_price,
            'last_updated': current_time,
        }

        return JsonResponse(result)

    # If the request is not a GET or not an Ajax request, return a 404
    return JsonResponse({'error': 'Invalid request'}, status=404)

def get_last_90_days_average_volume(request):
    # Replace with your AlphaVantage API key
    api_key = "V6KG8ZEHYWIUSXDX"

    # Stock symbol/ticker
    symbol = request.GET.get('symbol', None)

    if symbol is None:
        return JsonResponse({"error": "Symbol is required."})

    # Retrieve historical volume data for the last 90 days
    response = requests.get(f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={api_key}")
    data = response.json()

    if "Time Series (Daily)" in data:
        # Extract volume data into a DataFrame
        daily_data = data["Time Series (Daily)"]
        df = pd.DataFrame(daily_data).T
        df["5. volume"] = df["5. volume"].astype(float)
        current_vol = df.iloc[0]["5. volume"]

        # Calculate the average volume for the last 90 days
        last_90_days_volume = df.iloc[:90]["5. volume"]
        average_volume = last_90_days_volume.mean()

        return JsonResponse({"average_volume": round(average_volume, 2),"volume": round(current_vol, 2)})
    else:
        return JsonResponse({"error": "Data format does not contain 'Time Series (Daily)'"})


def get_first_date_data_will(request):
    url = "https://www.alphavantage.co/query"
    function = "WILLR"
    symbol = request.GET.get('symbol', None)
    interval = "weekly"
    time_period = 10
    series_type = "open"
    apikey = "V6KG8ZEHYWIUSXDX"

    params = {
        "function": function,
        "symbol": symbol,
        "interval": interval,
        "time_period": time_period,
        "series_type": series_type,
        "apikey": apikey
    }

    response = requests.get(url, params=params)
    data = response.json()

    # Extract the first date and its corresponding RSI value
    first_date = list(data["Technical Analysis: WILLR"].keys())[0]
    rsi_value = data["Technical Analysis: WILLR"][first_date]["WILLR"]

    return JsonResponse({"first_date": first_date, "rsi_value": rsi_value})

def get_first_date_data_mas(request):
    url = "https://www.alphavantage.co/query"
    function = "SMA"
    symbol = request.GET.get('symbol', None)
    interval = "weekly"
    time_periods = [20, 50, 100, 200]
    series_type = "open"
    apikey = "V6KG8ZEHYWIUSXDX"

    data = {}
    
    for time_period in time_periods:
        params = {
            "function": function,
            "symbol": symbol,
            "interval": interval,
            "time_period": time_period,
            "series_type": series_type,
            "apikey": apikey
        }

        response = requests.get(url, params=params)
        response_data = response.json()

        # Extract the first date and its corresponding RSI value
        first_date = list(response_data["Technical Analysis: SMA"].keys())[0]
        rsi_value = response_data["Technical Analysis: SMA"][first_date]["SMA"]

        data[time_period] = {"first_date": first_date, "rsi_value": rsi_value}

    return JsonResponse(data)


def get_macd_data(request):
    url = "https://www.alphavantage.co/query"
    function = "MACD"
    symbol = request.GET.get('symbol', None)
    interval = "daily"
    series_type = "open"
    apikey = "V6KG8ZEHYWIUSXDX"

    params = {
        "function": function,
        "symbol": symbol,
        "interval": interval,
        "series_type": series_type,
        "apikey": apikey
    }

    response = requests.get(url, params=params)
    data = response.json()

    # Extract the relevant data
    meta_data = data["Meta Data"]
    technical_data = data["Technical Analysis: MACD"]

    last_refreshed = meta_data["3: Last Refreshed"]
    macd_data = technical_data[last_refreshed]

    macd = macd_data["MACD"]
    macd_signal = macd_data["MACD_Signal"]
    macd_hist = macd_data["MACD_Hist"]

    response_data = {
        "last_refreshed": last_refreshed,
        "macd": macd,
        "macd_signal": macd_signal,
        "macd_hist": macd_hist
    }

    return JsonResponse(response_data)

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
    
    url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={symbol}&apikey=V6KG8ZEHYWIUSXDX"
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