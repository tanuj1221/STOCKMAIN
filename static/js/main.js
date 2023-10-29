let search;
const lastUpdated = new Date().toLocaleString();
const FMP_KEY = settings.FMP_API_KEY

$(document).ready(function() {
  search = "AMID";
  getStockInfo();
  getIndices();
  getStockChart();

  $(".lastUpdated").text(`Last updated: ${lastUpdated}`);

  $("#search").on("click", function() {
    $(".searchbar").toggleClass("hidden");
  });

  $("#viewChart").on("click", function() {
    $("#stockChart").toggleClass("hidden");
  });

  $(".searchbar").keypress(function(e) {
    if(e.which == 13) {
      search = $(".searchbar").val();
      getStockInfo();
      getStockChart();
    }
  });
})

function getStockInfo() {
  data = $.ajax({
    	type: "GET",
    	url: `https://api.iextrading.com/1.0/stock/${search}/quote`,
    	dataType: "json",
    	success: function(data){
        let name = data.symbol;
        let price = rounder(data.latestPrice, 2);
        let change = data.changePercent;
        let closeTime = new Date(data.closeTime).toLocaleString();

        $(".header .name").text(name);
        $(".price").text(price);
        $(".change").text((rounder(change, 4) * 100).toFixed(2) + "%");
        $(".closeTime").text(`Trading Window Closes: ${closeTime}`);

        if(change >= 0) {
          $(".change").css("color", "green");
          $(".change").prepend("&#x25B2;");
        } else {
          $(".change").css("color", "red");
          $(".change").prepend("&#x25BC;");
        }
      }
  });
}

function getIndices() {
  data = $.ajax({
    	type: "GET",
    	url: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^DJI&apikey=D82RGKW7PC6AAW7D",
    	dataType: "json",
    	success: function(data){
        let lastRefreshed = data['Meta Data']['3. Last Refreshed'];
        let price = rounder(data["Time Series (Daily)"][lastRefreshed]["1. open"], 2);
        let yPrice = data["Time Series (Daily)"][getYesterdayDate()]["1. open"];
        let change = (rounder(((price - yPrice) / Math.abs(price)), 4) * 100).toFixed(2) + "%";

        $(".price").text(price);
        $(".change").text(change);
     

        if(change >= 0) {
          $(".change").css("color", "green");
          $(".change").prepend("&#x25B2;");
        } else {
          $(".change").css("color", "red");
          $(".change").prepend("&#x25BC;");
        }
      }
  });

  data = $.ajax({
    	type: "GET",
    	url: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^GSPC&apikey=D82RGKW7PC6AAW7D",
    	dataType: "json",
    	success: function(data){
        let lastRefreshed = data['Meta Data']['3. Last Refreshed'];
        let price = rounder(data["Time Series (Daily)"][lastRefreshed]["1. open"], 2);
        let yPrice = rounder(data["Time Series (Daily)"][getYesterdayDate()]["1. open"], 2);
        let change = (rounder(((price - yPrice) / Math.abs(price)), 4) * 100).toFixed(2) + "%";

        $(".price").text(price);
        $(".change").text(change);

        if(change >= 0) {
          $(".change").css("color", "green");
          $(".change").prepend("&#x25B2;");
        } else {
          $(".change").css("color", "red");
          $(".change").prepend("&#x25BC;");
        }
      }
  });

  data = $.ajax({
    	type: "GET",
    	url: "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^IXIC&apikey=D82RGKW7PC6AAW7D",
    	dataType: "json",
    	success: function(data){
        let lastRefreshed = data['Meta Data']['3. Last Refreshed'];
        let price = rounder(data["Time Series (Daily)"][lastRefreshed]["1. open"], 2);
        let yPrice = rounder(data["Time Series (Daily)"][getYesterdayDate()]["1. open"], 2);
        let change = (rounder(((price - yPrice) / Math.abs(price)), 4) * 100).toFixed(2) + "%";

        $(".price").text(price);
        $(".change").text(change);

        if(change >= 0) {
          $(".change").css("color", "green");
          $(".change").prepend("&#x25B2;");
        } else {
          $(".change").css("color", "red");
          $(".change").prepend("&#x25BC;");
        }
      }
  });
}

function getStockChart(){
  new TradingView.MediumWidget({
  "container_id": "tv-medium-widget-5e6f9",
  "symbols": [
    [
      "Google",
      search
    ]
  ],
  "greyText": "Quotes by",
  "gridLineColor": "#e9e9ea",
  "fontColor": "#83888D",
  "underLineColor": "#dbeffb",
  "trendLineColor": "#4bafe9",
  "width": "100%",
  "height": "400px",
  "locale": "en",
  "colorTheme":"dark",
  "dateRanges": [
    "1d|1",
    "5d|5",
    "1m|30",
    "3m|60",
    "12m|1D",
    "60m|1W",
    "all|1M"
  ]
  });
}

