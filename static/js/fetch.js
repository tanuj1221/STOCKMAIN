const dropdownButton = document.getElementById("selected-option");
const dropdownOptions = document.querySelectorAll(".dropdown-option");

dropdownOptions.forEach(option => {
  option.addEventListener("click", () => {
    const selectedValue = option.getAttribute("data-value");
    dropdownButton.textContent = selectedValue;
  });
});

$(document).ready(function() {
    $('#searchButton').click(function() {
      var symbol = $('#searchInput').val();
      if (symbol) {
       
        fetchHistoricalData('1year',symbol);
        fetchDataAndUpdate(symbol);
        getFinancialRatiosData(symbol);
        getEarningsRevenueData(symbol);
        getStockPerformanceData(symbol);
        getDividendInfoData(symbol);
        getValuationData(symbol);
        getDividendInfoData1(symbol)
        // balanceData(symbol);
        // incomeData(symbol);
        // cashFlowData(symbol);
        getStockData(symbol);
        fetchNews(symbol);
        getFirstDateData(symbol)
        getFirstDateData1(symbol)
        getMACDData(symbol)
        getFirstDateData2(symbol)
        getAverageVolume(symbol)
        getDate(symbol)
        fetchAndPlotStockDailyData(symbol)
        fetchAndPlotStockMonthlyData(symbol)
        fetchAndPlotStockWeeklyData(symbol) 
        fetchAndPlotStockHourlyData(symbol)

        var eleElement = document.getElementById('ele');
        eleElement.appendChild(chartElement);
    }})
});


$(document).ready(function() {
    var symbol = $('#searchInput').val();
    if (symbol) {
       
        fetchHistoricalData('1year',symbol);
        fetchDataAndUpdate(symbol);
        getFinancialRatiosData(symbol);
        getEarningsRevenueData(symbol);
        getStockPerformanceData(symbol);
        getDividendInfoData(symbol);
        getValuationData(symbol);
        getDividendInfoData1(symbol)
        // balanceData(symbol);
        // incomeData(symbol);
        // cashFlowData(symbol);
        getStockData(symbol);
        fetchNews(symbol);
        getFirstDateData(symbol)
        getFirstDateData1(symbol)
        getMACDData(symbol)
        getFirstDateData2(symbol)
        getAverageVolume(symbol)
        getDate(symbol)
        fetchAndPlotStockDailyData(symbol)
        fetchAndPlotStockMonthlyData(symbol)
        fetchAndPlotStockWeeklyData(symbol)
        fetchAndPlotStockHourlyData(symbol)

        var eleElement = document.getElementById('ele');
        eleElement.appendChild(chartElement);
       
    }
})

function getFirstDateData(symbol) {
    $.ajax({
        url: '/landing/get_first_date_data/',
        type: 'GET',
        data: { symbol: symbol },
        success: function(response) {
            // Handle the response
            var firstDate = response.first_date;
            var rsiValue = response.rsi_value;
            $('#rsi').text(rsiValue)
            console.log(rsiValue)

            // Do something with the data
           
        },
        error: function(xhr, errmsg, err) {
            // Handle error
            console.log(errmsg);
        }
    });
}

function getAverageVolume(symbol) {
   
    $.ajax({
        url: "/landing/get_last_90_days_average_volume/",  // Adjust the URL as needed
        data: { symbol: symbol },
        success: function(data) {
            if (data.error) {
                alert(data.error);
            } else {
                $("#vol90").text(data.average_volume);
                $("#vol").text(data.volume);
            }
        }
    });
}

function getFirstDateData2(symbol) {
    $.ajax({
        url: '/landing/get_first_date_data_will/',
        type: 'GET',
        data: { symbol: symbol },
        success: function(response) {
            // Handle the response
            var firstDate = response.first_date;
            var rsiValue = response.rsi_value;
            $('#will').text(rsiValue)
            console.log(rsiValue)

            // Do something with the data
           
        },
        error: function(xhr, errmsg, err) {
            // Handle error
            console.log(errmsg);
        }
    });
}

function getFirstDateData1(symbol) {
    var timePeriods = [20, 50, 100, 200];

    // Define separate variables for each time period
    var timePeriod20, timePeriod50, timePeriod100, timePeriod200;

    // Make separate AJAX requests for each time period
    $.ajax({
        url: '/landing/get_first_date_data_mas/',
        type: 'GET',
        data: { symbol: symbol },
        success: function(response) {
            // Extract the data for each time period
            timePeriod20 = response['20'];
            timePeriod50 = response['50'];
            timePeriod100 = response['100'];
            timePeriod200 = response['200'];

            // Do something with the data for each time period
            $('#msa20').text(response['20']['rsi_value'])
            $('#msa50').text(response['50']['rsi_value'])
            $('#msa100').text(response['100']['rsi_value'])
            $('#msa200').text(response['200']['rsi_value'])
       
        },
        error: function(xhr, errmsg, err) {
            // Handle error
            console.log(errmsg);
        }
    });
}

function getMACDData(symbol) {
    $.ajax({
        url: '/landing/get_macd_data/',
        type: 'GET',
        data: { symbol: symbol },
        success: function(response) {
            // Handle the response
            var lastRefreshed = response.last_refreshed;
            var macd = response.macd;
            var macdSignal = response.macd_signal;
            var macdHist = response.macd_hist;

            // Do something with the data
            $('#macd').text(macd)
            // console.log("Last Refreshed:", lastRefreshed);
            // console.log("MACD:", macd);
            // console.log("MACD Signal:", macdSignal);
            // console.log("MACD Histogram:", macdHist);
        },
        error: function(xhr, errmsg, err) {
            // Handle error
            console.log(errmsg);
        }
    });
}
// Function to fetch historical data
$(document).ready(function(){
    $("#apply-button").click(function(){
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();
        var frequency = $("#frequency").val();
        var symbol = $('#searchInput').val();
        
        $.ajax({
            url: '/landing/get_stock_data_hist/', // Use the relative URL
            type: 'get',
            data: {
                symbol:symbol,
                start_date: startDate,
                end_date: endDate,
                frequency: frequency
            },
            success: function(data) {
                var timeSeries = data['Time Series (Daily)']; // adjust this key based on the frequency
                var html = '';
                for (var date in timeSeries) {
                    var row = timeSeries[date];
                    html += '<tr>' +
                        '<td>' + date + '</td>' +
                        '<td>' + row['1. open'] + '</td>' +
                        '<td>' + row['2. high'] + '</td>' +
                        '<td>' + row['3. low'] + '</td>' +
                        '<td>' + row['4. close'] + '</td>' +
                        '<td>' + row['5. volume'] + '</td>' +
                        '</tr>';
                }
                $(".stock-table tbody").html(html);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });
});


function fetchHistoricalData(interval, symbol) {
    var eleElement = document.getElementById('ele');
    eleElement.innerHTML = '';
    var chartElement = document.createElement('div');
    chartElement.classList.add('chart-container');

    var chart = LightweightCharts.createChart(chartElement, {
        width: 500,
        height: 270,
        rightPriceScale: {
            borderVisible: false,
        },
        timeScale: {
            borderVisible: false,
        },
    });

    eleElement.appendChild(chartElement);

    var areaSeries = chart.addAreaSeries({
        topColor: 'rgba(32, 226, 47, 0.56)',
        bottomColor: 'rgba(32, 226, 47, 0.04)',
        lineColor: 'rgba(32, 226, 47, 1)',
        lineWidth: 2,
    });

    var darkTheme = {
        chart: {
            layout: {
                background: {
                    type: 'solid',
                    color: '#1B222D',
                },
                lineColor: '#2B2B43',
                textColor: '#D9D9D9',
            },
            watermark: {
                color: 'rgba(0, 0, 0, 0)',
            },
            crosshair: {
                color: '#758696',
            },
            grid: {
                vertLines: {
                    color: '#1B222D',
                },
                horzLines: {
                    color: '#1B222D',
                },
            },
        },
        series: {
            topColor: '#7B35C0',
            bottomColor: 'rgba(32, 226, 47, 0.04)',
            lineColor: '#7B35C0',
        },
    };

    $.ajax({
        url: '/landing/fetch_historical_data/',
        method: 'GET',
        data: {
            'symbol': symbol,
            'interval': interval
        },
        success: function(data) {
            const chartData = data.map(item => {
                // Convert the date string to a Date object, then to a UNIX timestamp in seconds
                const timeInSeconds = Math.floor(new Date(item.time).getTime() / 1000);
                return {
                    time: timeInSeconds,
                    value: parseFloat(item.value), // ensure the value is a number
                };
            });
        
            chartData.sort((a, b) => a.time - b.time); // Ensure data is sorted by time
        
            areaSeries.setData(chartData);
            chart.applyOptions(darkTheme.chart);
            areaSeries.applyOptions(darkTheme.series);
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
}

function fetch1DayData(symbol) {
    var eleElement = document.getElementById('ele');
    eleElement.innerHTML = '';
    var chartElement = document.createElement('div');
    chartElement.classList.add('chart-container');

    var chart = LightweightCharts.createChart(chartElement, {
        width: 500,
        height: 270,
        rightPriceScale: {
            borderVisible: false,
        },
        timeScale: {
            borderVisible: false,
            timeVisible: true, // Display time on the x-axis
        },
    });

    eleElement.appendChild(chartElement);

    var areaSeries = chart.addAreaSeries({
        topColor: 'rgba(32, 226, 47, 0.56)',
        bottomColor: 'rgba(32, 226, 47, 0.04)',
        lineColor: 'rgba(32, 226, 47, 1)',
        lineWidth: 2,
    });

    var darkTheme = {
        chart: {
            layout: {
                background: {
                    type: 'solid',
                    color: '#1B222D',
                },
                lineColor: '#2B2B43',
                textColor: '#D9D9D9',
            },
            watermark: {
                color: 'rgba(0, 0, 0, 0)',
            },
            crosshair: {
                color: '#758696',
            },
            grid: {
                vertLines: {
                    color: '#1B222D',
                },
                horzLines: {
                    color: '#1B222D',
                },
            },
        },
        series: {
            topColor: '#7B35C0',
            bottomColor: 'rgba(32, 226, 47, 0.04)',
            lineColor: '#7B35C0',
        },
    };

    $.ajax({
        url: '/landing/fetch_1day_data/',
        method: 'GET',
        data: {
            'symbol': symbol
        },
        success: function(data) {
            // Get the latest date
            const firstData = data[0];
            const latestDate = new Date(firstData.time * 1000).toLocaleDateString();

            // Filter the data for the latest date
            const chartData = data.filter(item => {
                const itemDate = new Date(item.time * 1000).toLocaleDateString();
                return itemDate === latestDate;
            });

            // Sort the data by time in ascending order
            chartData.sort((a, b) => a.time - b.time);

            areaSeries.setData(chartData);
            chart.applyOptions(darkTheme.chart);
            areaSeries.applyOptions(darkTheme.series);
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
}

// <<<<<<<<<<<<<<<<<<<<Forecasting Graphs function>>>>>>>>>>>>>>>>>>>>>>>>>
function fetchAndPlotStockDailyData(symbol) {
    var eleElement = document.getElementById('stockChart');
    eleElement.innerHTML = '';
    var chartElement = document.createElement('div');
    chartElement.classList.add('chart-container');

    var chart = LightweightCharts.createChart(chartElement, {
        width: 600,
        height: 300,
        layout: {
            background: {
                type: 'solid',
                color: '#1B222D',
            },
            lineColor: '#1B222D',
            textColor: '#D9D9D9',
        },
        crosshair: {
            color: '#758696',
        },
        rightPriceScale: {
            borderVisible: false,
        },
        timeScale: {
            borderVisible: false,
        },
        grid: {
            vertLines: {
                color: '#1B222D',
            },
            horzLines: {
                color: '#1B222D',
            },
        }
    });

    eleElement.appendChild(chartElement);

    var actualSeries = chart.addAreaSeries({
        topColor: 'rgba(32, 226, 47, 0.56)',
        bottomColor: 'rgba(32, 226, 47, 0.04)',
        lineColor: 'rgba(32, 226, 47, 1)',
        lineWidth: 2,
    });

    var predictedSeries = chart.addLineSeries({
        color: 'rgba(99, 132, 255, 1)',
        lineWidth: 2,
    });

    $.ajax({
        url: `/landing/train_model_daily/${symbol}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log("Response:", response); // Log the full response
    
            // Process and log actual data
            var actualData = [];
            for (var date in response.last_60_values.value) {
                actualData.push({
                    time: Math.floor(new Date(date).getTime() / 1000),
                    value: response.last_60_values.value[date]
                });
            }
            console.log("Actual Data:", actualData);
    
            // Process and log predicted data
            var predictedData = [];
            for (var date in response.predictions.Predicted) {
                predictedData.push({
                    time: Math.floor(new Date(date).getTime() / 1000),
                    value: response.predictions.Predicted[date]
                });
            }
            console.log("Predicted Data:", predictedData);
    
            actualData.sort((a, b) => a.time - b.time);
            predictedData.sort((a, b) => a.time - b.time);
    
            // Ensure series are correctly initialized before setting data
            if(actualSeries && predictedSeries) {
                actualSeries.setData(actualData);
                predictedSeries.setData(predictedData);
            } else {
                console.error("Series not initialized");
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', xhr, status, error);
        }
    });
    
}    

function fetchAndPlotStockMonthlyData(symbol) {
    var eleElement = document.getElementById('stockChart1');
    eleElement.innerHTML = '';
    var chartElement = document.createElement('div');
    chartElement.classList.add('chart-container');

    var chart = LightweightCharts.createChart(chartElement, {
        width: 600,
        height: 300,
        layout: {
            background: {
                type: 'solid',
                color: '#1B222D',
            },
            lineColor: '#2B2B43',
            textColor: '#D9D9D9',
        },
        crosshair: {
            color: '#758696',
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        rightPriceScale: {
            borderVisible: false,
        },
        timeScale: {
            borderVisible: false,
        },
        grid: {
            vertLines: {
                color: '#1B222D',
            },
            horzLines: {
                color: '#1B222D',
            },
        }
    });

    eleElement.appendChild(chartElement);

    var actualSeries = chart.addAreaSeries({
        topColor: 'rgba(32, 226, 47, 0.56)', // Matched to the actual series in daily data function
        bottomColor: 'rgba(32, 226, 47, 0.04)',
        lineColor: 'rgba(32, 226, 47, 1)',
        lineWidth: 2,
    });

    var predictedSeries = chart.addLineSeries({
        color: 'rgba(99, 132, 255, 1)', // Same as predicted series in daily data function
        lineWidth: 2,
    });

    $.ajax({
        url: `/landing/train_model_monthly/${symbol}`,
        method: 'GET',
        dataType: 'json', // Expecting JSON response
        success: function(response) {
            // Process actual stock prices
            var actualData = [];
            for (var date in response.last_60_values.value) {
                actualData.push({
                    time: Math.floor(new Date(date).getTime() / 1000),
                    value: response.last_60_values.value[date]
                });
            }

            // Process predicted stock prices
            var predictedData = [];
            for (var date in response.predictions.Predicted) {
                predictedData.push({
                    time: Math.floor(new Date(date).getTime() / 1000),
                    value: response.predictions.Predicted[date]
                });
            }

            // Ensure data is sorted by time
            actualData.sort((a, b) => a.time - b.time);
            predictedData.sort((a, b) => a.time - b.time);

            // Set data for the chart series
            actualSeries.setData(actualData);
            predictedSeries.setData(predictedData);
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
}

function fetchAndPlotStockWeeklyData(symbol) {
    var eleElement = document.getElementById('stockChart2');
    eleElement.innerHTML = '';
    var chartElement = document.createElement('div');
    chartElement.classList.add('chart-container');

    var chart = LightweightCharts.createChart(chartElement, {
        width: 600,
        height: 300,
        layout: {
            background: {
                type: 'solid',
                color: '#1B222D',
            },
            lineColor: '#2B2B43',
            textColor: '#D9D9D9',
        },
        crosshair: {
            color: '#758696',
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        rightPriceScale: {
            borderVisible: false,
        },
        timeScale: {
            borderVisible: false,
        },
        grid: {
            vertLines: {
                color: '#1B222D',
            },
            horzLines: {
                color: '#1B222D',
            },
        }
    });

    eleElement.appendChild(chartElement);

    var actualSeries = chart.addAreaSeries({
        topColor: 'rgba(255, 0, 0, 0.56)', // Red gradient top color
        bottomColor: 'rgba(255, 0, 0, 0.04)', // Red gradient bottom color
        lineColor: 'rgba(255, 0, 0, 1)', // Red line color
        lineWidth: 2,
    });

    var predictedSeries = chart.addLineSeries({
        color: 'rgba(99, 132, 255, 1)', // Predicted series color
        lineWidth: 2,
    });

    $.ajax({
        url: `/landing/train_model_weekly/${symbol}`,
        method: 'GET',
        dataType: 'json', // Expecting JSON response
        success: function(response) {
            // Process actual stock prices
            var actualData = [];
            for (var date in response.last_60_values.value) {
                actualData.push({
                    time: Math.floor(new Date(date).getTime() / 1000),
                    value: response.last_60_values.value[date]
                });
            }

            // Process predicted stock prices
            var predictedData = [];
            for (var date in response.predictions.Predicted) {
                predictedData.push({
                    time: Math.floor(new Date(date).getTime() / 1000),
                    value: response.predictions.Predicted[date]
                });
            }

            // Ensure data is sorted by time
            actualData.sort((a, b) => a.time - b.time);
            predictedData.sort((a, b) => a.time - b.time);

            // Set data for the chart series
            actualSeries.setData(actualData);
            predictedSeries.setData(predictedData);
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
}

function fetchAndPlotStockHourlyData(symbol) {
    var eleElement = document.getElementById('stockChart3');
    eleElement.innerHTML = '';
    var chartElement = document.createElement('div');
    chartElement.classList.add('chart-container');

    var chart = LightweightCharts.createChart(chartElement, {
        width: 600,
        height: 300,
        layout: {
            background: {
                type: 'solid',
                color: '#1B222D',
            },
            lineColor: '#2B2B43',
            textColor: '#D9D9D9',
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        priceScale: {
            borderColor: 'rgba(197, 203, 206, 0.8)',
        },
        rightPriceScale: {
            borderVisible: false,
        },
        timeScale: {
            borderVisible: false,
        },
        grid: {
            vertLines: {
                color: '#1B222D',
            },
            horzLines: {
                color: '#1B222D',
            },
        }
    });

    eleElement.appendChild(chartElement);

    var actualSeries = chart.addAreaSeries({
        topColor: 'rgba(255, 0, 0, 0.56)', // Red gradient top color
        bottomColor: 'rgba(255, 0, 0, 0.04)', // Red gradient bottom color
        lineColor: 'rgba(255, 99, 132, 1)', // Red line color to match the gradient
        lineWidth: 2,
    });

    var predictedSeries = chart.addLineSeries({
        color: 'rgba(99, 132, 255, 1)', // Predicted series color
        lineWidth: 2,
    });

    $.ajax({
        url: `/landing/train_model_hourly/${symbol}`,
        method: 'GET',
        dataType: 'json', // Expecting JSON response
        success: function(response) {
            // Process actual stock prices
            var actualData = [];
            for (var date in response.last_60_values.value) {
                actualData.push({
                    time: Math.floor(new Date(date).getTime() / 1000),
                    value: response.last_60_values.value[date]
                });
            }

            // Process predicted stock prices
            var predictedData = [];
            for (var date in response.predictions.Predicted) {
                predictedData.push({
                    time: Math.floor(new Date(date).getTime() / 1000),
                    value: response.predictions.Predicted[date]
                });
            }

            // Ensure data is sorted by time
            actualData.sort((a, b) => a.time - b.time);
            predictedData.sort((a, b) => a.time - b.time);

            // Set data for the chart series
            actualSeries.setData(actualData);
            predictedSeries.setData(predictedData);
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
}
// <<<<<<<<<<<<<<<<<<<<Forecasting Graphs function end>>>>>>>>>>>>>>>>>>>>>>>>>

function fetchDataAndUpdate(symbol) {
    $.ajax({
        url: `/landing/landing/fetch_stock_data/?symbol=${symbol}`,
        type: 'GET',
        success: function (data) {
            if (data.error) {
                console.error('Error fetching data:', data.error);
            } else {
                // Update image element
                if (data.image) {
                    $('#imageElement').attr('src', data.image);
                } else {
                    console.log('Image URL not found in API response.');
                }

                // Update other div elements with data properties
                $('#ticker-name').text(data['Name']);
                $('#sector').text(data['Sector']);
                $('#industry').text(data['Industry']);
                $('#market_cap1').text(data['Market Cap ($M USD)']);
                $('#short_percent').text(data['Short % of Float']);
                $('#employees').text(data['Employees']);
                $('#sales').text(data['Sales ($M)']);
                $('#shares_outstanding').text(data['Shares Outstanding']);
                $('#ipo_date').text(data['IPO Date']);
                $('#ex_dividend_date').text(data['Ex‑Dividend Date']);
                $('#last_reported_qtr').text(data['Last Reported Qtr.']);
                $('#next_quarter_report').text(data['Next Quarter Report Date']);
                $('#headquarters').text(data['Headquarters']);
                $('#des').text(data['Description']);
            }
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}

function getFinancialRatiosData(symbol) {
    $.ajax({
        url: `/landing/financial_ratios/${symbol}/`,
        type: 'GET',
        success: function (data) {
            updateData(data, ['PERatio', 'PEGRatio', 'DividendYield', 'ProfitMargin', 'OperatingMarginTTM', 'ReturnOnAssetsTTM', 'ReturnOnEquityTTM']);
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}

function getEarningsRevenueData(symbol) {
    $.ajax({
        url: `/landing/earnings_revenue/${symbol}/`,
        type: 'GET',
        success: function (data) {
            updateData(data, ['EBITDA', 'EPS', 'RevenuePerShareTTM', 'RevenueTTM', 'GrossProfitTTM', 'DilutedEPSTTM']);
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}

function getStockPerformanceData(symbol) {
    $.ajax({
        url: `/landing/stock_performance/${symbol}/`,
        type: 'GET',
        success: function (data) {
            updateData(data, ['52WeekHigh', '52WeekLow', '50DayMovingAverage', '200DayMovingAverage', 'Beta', 'AnalystTargetPrice']);
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}

function getDividendInfoData(symbol) {
    $.ajax({
        url: `/landing/dividend_info/${symbol}/`,
        type: 'GET',
        success: function (data) {
            updateData(data, ['DividendPerShare', 'DividendYield', 'DividendDate', 'ExDividendDate']);
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}


function getDividendInfoData1(symbol){
    $.ajax({
        url: `/landing/financial_ratios/${symbol}/`,
        type: 'GET',
        success: function (data) {
          // Handle the successful response here
          console.log('Success:', data);
      
          // Update the HTML element with the received data
         
          $('#DividinYe').text(data.DividendYield);
          $('#asset1').text(data.ReturnOnAssetsTTM);
          $('#asset3').text(data.ReturnOnAssetsTTM);
          $('#asset2').text(data.ReturnOnEquityTTM); // Replace with your specific element selector
         
        },
        error: function (xhr, status, error) {
          // Handle the error here
          console.error('Error:', status, error);
        }
      });
      
}

function getValuationData(symbol) {
    $.ajax({
        url: `/landing/valuation/${symbol}/`,
        type: 'GET',
        success: function (data) {
            updateData(data, ['PriceToSalesRatioTTM', 'PriceToBookRatio', 'EVToRevenue', 'EVToEBITDA', 'ForwardPE', 'TrailingPE']);
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}

// A utility function to update the data
function updateData(data, fields) {
    if (data.error) {
        console.error('Error fetching data:', data.error);
    } else {
        fields.forEach(function (field) {
            $('#' + field).text(data[field]);
        });
    }
}

// financial_data.js

// function balanceData(symbol) {
//     $.ajax({
//         url: '/landing/api/balance_data/' + symbol + '/',
//         type: 'get',
//         dataType: 'json',
//         success: function(data) {
//             var table = $("#financial-data-table");

//             // Clear the table for new data
//             table.html('');

//             // Create the caption element
//             var caption = $('<caption></caption>');
//             table.append(caption);

//             // Create the tbody element
//             var tbody = $('<tbody></tbody>');

//             $.each(data, function(key, value) {
//                 var row = $('<tr></tr>');
//                 var keyCell = $('<td class="key"></td>').text(key);
//                 var valueCell = $('<td class="value" id="' + key + '"></td>').text(value);
//                 row.append(keyCell);
//                 row.append(valueCell);
//                 tbody.append(row);
//             });

//             // Append the tbody to the table
//             table.append(tbody);
//         }
//     });
// }


// function incomeData(symbol) {
//     $.ajax({
//         url: '/landing/api/income_data/' + symbol + '/',
//         type: 'get',
//         dataType: 'json',
//         success: function(data) {
//             var table = $("#income-data-table");

//             // Clear the table for new data
//             table.html('');

//             // Create the caption element
//             var caption = $('<caption></caption>');
//             table.append(caption);

//             // Create the tbody element
//             var tbody = $('<tbody></tbody>');

//             $.each(data, function(key, value) {
//                 var row = $('<tr></tr>');
//                 var keyCell = $('<td class="key"></td>').text(key);
//                 var valueCell = $('<td class="value" id="' + key + '"></td>').text(value);
//                 row.append(keyCell);
//                 row.append(valueCell);
//                 tbody.append(row);
//             });

//             // Append the tbody to the table
//             table.append(tbody);
//         }
//     });
// }


// function cashFlowData(symbol) {
//     $.ajax({
//         url: '/landing/api/cashflow_data/' + symbol + '/',
//         type: 'get',
//         dataType: 'json',
//         success: function(data) {
//             var table = $("#cash-data-table");

//             // Clear the table for new data
//             table.html('');

//             // Create the caption element
//             var caption = $('<caption></caption>');
//             table.append(caption);

//             // Create the tbody element
//             var tbody = $('<tbody></tbody>');

//             $.each(data, function(key, value) {
//                 var row = $('<tr></tr>');
//                 var keyCell = $('<td class="key"></td>').text(key);
//                 var valueCell = $('<td class="value" id="' + key + '"></td>').text(value);
//                 row.append(keyCell);
//                 row.append(valueCell);
//                 tbody.append(row);
//             });

//             // Append the tbody to the table
//             table.append(tbody);
//         }
//     });
// }



function getStockData(symbol) {
    $.ajax({
        url: `/landing/get_stock_data/${symbol}/`,
        success: function (response) {
            var stockData = response['Global Quote'];

            $('#symbol-data').text(stockData['01. symbol']);
            $('#symbol1').text(stockData['01. symbol'] + " Stock Report");
            $('#open-data').text(stockData['02. open']);
            $('#high-data').text(stockData['03. high']);
            $('#low-data').text(stockData['04. low']);
            $('#price-data').text(stockData['05. price']);
            $('#price-data1').text(stockData['05. price']);
            $('#volume-data').text(stockData['06. volume']);
            $('#latest-day-data').text(stockData['07. latest trading day']);
            $('#previous-close-data').text(stockData['08. previous close']);

            var change = parseFloat(stockData['09. change']);
            var changePercent = parseFloat(stockData['10. change percent'].replace('%', ''));

            // Set class and color for #change-data
            var changeDataElement = $('#price-change');
            changeDataElement.text(stockData['09. change']);

            if (change > 0) {
                changeDataElement.addClass('positive-change').removeClass('negative-change');
            } else if (change < 0) {
                changeDataElement.addClass('negative-change').removeClass('positive-change');
            } else {
                changeDataElement.removeClass('positive-change negative-change');
            }

    

            // Create a span with the class 'price-change' and append it
            var spanContent = `${stockData['09. change']} ${stockData['10. change percent']}`;
     

            $('#price-change').text(spanContent)
           
    }});
}


function getDate(symbol) {
    $.ajax({
        type: 'GET',
        url: '/landing/update_date/' + symbol + '/',
        dataType: 'json',
        success: function(data) {
            $('#stock-price').text('Last Price: ' + data.last_price);
            $('#last-updated').text('Last Updated: ' + data.last_updated);
        },
        error: function(error) {
            console.log(error);
        }
    });
}


function fetchNews(symbol) {
    $.ajax({
        url: '/landing/fetch-news/' + symbol + '/',
        type: 'get',
        dataType: 'json',
        success: function(data) {

            var table = $("#news-table");
            // Clear the table for new data
            table.html('');
            $.each(data['feed'], function(index, item) {
                // Row for the image
                var imageRow = $('<tr></tr>');
                var imageCell = $('<td></td>').addClass('imgtd').html('<img src="' + item.banner_image + '">');
                
           ;

                // Row for the other information
                var infoRow = $('<tr></tr>');
                var infoCell = $('<td></td>').addClass('dettd');
                infoCell.append('<h1>' + item.title + '</h1>');
                infoCell.append('<p> Source: ' + item.source + '</p>');
                infoCell.append('<a href="' + item.url + '">Read More</a>');
                infoCell.append('<p>Sentiment Score: ' + item.overall_sentiment_score + '</p>');
                infoCell.append('<p> Sentiment Label' + item.overall_sentiment_label + '</p>');
                var date = new Date(item.time_published);
                var formattedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                infoCell.append('<p>' + formattedDate + '</p>');
                infoRow.append(imageCell)
                infoRow.append(infoCell);
                table.append(infoRow);
            });
        }
    });
}
// Example usage
$('#1daysButton').click(function() {
    var symbol = $('#searchInput').val();
    fetch1DayData(symbol);
    var eleElement = document.getElementById('ele');
    eleElement.appendChild(chartElement);
});

$('#1monthButton').click(function() {
    var symbol = $('#searchInput').val();
    fetchHistoricalData('1month',symbol);
       
    var eleElement = document.getElementById('ele');
    eleElement.appendChild(chartElement);
});

$('#6monthButton').click(function() {
    var symbol = $('#searchInput').val();
    fetchHistoricalData('6months',symbol);
       
    var eleElement = document.getElementById('ele');
    eleElement.appendChild(chartElement);
});

$('#1Year').click(function() {
    var symbol = $('#searchInput').val();
    fetchHistoricalData('1year',symbol);
       
    var eleElement = document.getElementById('ele');
    eleElement.appendChild(chartElement);
});

$('#5Year').click(function() {
    var symbol = $('#searchInput').val();
    fetchHistoricalData('5years',symbol);
       
    var eleElement = document.getElementById('ele');
    eleElement.appendChild(chartElement);
});




  // Replace with your AlphaVantage API key
  const apiKey = 'V6KG8ZEHYWIUSXDX';

  $(document).ready(function () {
    $('#searchInput').on('input', function () {
        const stockSymbol = $('#searchInput').val();

        // Check if the input is not empty
        if (stockSymbol !== '') {
            const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockSymbol}&apikey=${apiKey}`;

            $.ajax({
                type: 'GET',
                url: url,
                success: function (data) {
                    // Handle the data returned by AlphaVantage here
                    const suggestions = data.bestMatches.map(match => match['1. symbol']);
                    updateSuggestions(suggestions);
                },
                error: function (error) {
                    console.error('Error:', error);
                }
            });
        } else {
            // Clear the suggestions if the input is empty
            updateSuggestions([]);
        }
    });

    function updateSuggestions(suggestions) {
        const suggestionsContainer = $('#suggestionsContainer');

        // Clear previous suggestions
        suggestionsContainer.empty();

        // Add new suggestions
        suggestions.forEach(symbol => {
            const suggestionItem = $('<div class="suggestion">').text(symbol);
            suggestionsContainer.append(suggestionItem);
            
            // Add a click event to fill the input field with the suggestion
            suggestionItem.on('click', function() {
                $('#searchInput').val(symbol);
                suggestionsContainer.hide();
            });
        });

        // Show the suggestions container
        suggestionsContainer.show();
    }

    // Hide suggestions when clicking outside the search box or suggestions
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.search_bar').length && !$(e.target).is('.suggestion')) {
            $('#suggestionsContainer').hide();
        }
    });
});


$(document).ready(function () {
    $('#offCanvasSearchInput').on('input', function () {
        const stockSymbol = $('#offCanvasSearchInput').val();

        // Check if the input is not empty
        if (stockSymbol !== '') {
            const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockSymbol}&apikey=${apiKey}`;

            $.ajax({
                type: 'GET',
                url: url,
                success: function (data) {
                    // Handle the data returned by AlphaVantage here
                    const suggestions = data.bestMatches.map(match => match['1. symbol']);
                    updateSuggestions(suggestions);
                },
                error: function (error) {
                    console.error('Error:', error);
                }
            });
        } else {
            // Clear the suggestions if the input is empty
            updateSuggestions([]);
        }
    });

    function updateSuggestions(suggestions) {
        const suggestionsContainer = $('#offCanvassuggestionsContainer');

        // Clear previous suggestions
        suggestionsContainer.empty();

        // Add new suggestions
        suggestions.forEach(symbol => {
            const suggestionItem = $('<div class="suggestion">').text(symbol);
            suggestionsContainer.append(suggestionItem);
            
            // Add a click event to fill the input field with the suggestion
            suggestionItem.on('click', function() {
                $('#offCanvasSearchInput').val(symbol);
                suggestionsContainer.hide();
            });
        });

        // Show the suggestions container
        suggestionsContainer.show();
    }

    // Hide suggestions when clicking outside the search box or suggestions
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.search_bar').length && !$(e.target).is('.suggestion')) {
            $('#offCanvassuggestionsContainer').hide();
        }
    });
});

$('#searchButton').click(function() {
    var symbol = $('#searchInput').val();
    if (symbol) {
       
        fetchHistoricalData('1year',symbol);
        fetchDataAndUpdate(symbol);
        getFinancialRatiosData(symbol);
        getEarningsRevenueData(symbol);
        getStockPerformanceData(symbol);
        getDividendInfoData(symbol);
        getValuationData(symbol);
        // balanceData(symbol);
        // incomeData(symbol);
        // cashFlowData(symbol);
        getStockData(symbol);
        getDividendInfoData1(symbol)
        fetchNews(symbol);
        getFirstDateData(symbol)
        getFirstDateData1(symbol)
        getMACDData(symbol)
        getFirstDateData2(symbol)
        getAverageVolume(symbol)
        getDate(symbol)
        fetchStockData(symbol);
        fetchAndPlotStockDailyData(symbol)
        fetchAndPlotStockMonthlyData(symbol)
        fetchAndPlotStockWeeklyData(symbol) 
        fetchAndPlotStockHourlyData(symbol)

        var eleElement = document.getElementById('ele');
        eleElement.appendChild(chartElement);
 
    }
});

$(document).ready(function() {
    // Hide accordion content when button is clicked
    $("#hideAccordion").click(function() {
      $(".accordion-content").slideUp();
    });
    
    // Toggle accordion content when header is clicked
    $(".accordion-header").click(function() {
      $(this).next(".accordion-content").slideToggle();
    });
  });