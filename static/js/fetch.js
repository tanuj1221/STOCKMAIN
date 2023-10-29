const dropdownButton = document.getElementById("selected-option");
const dropdownOptions = document.querySelectorAll(".dropdown-option");

dropdownOptions.forEach(option => {
  option.addEventListener("click", () => {
    const selectedValue = option.getAttribute("data-value");
    dropdownButton.textContent = selectedValue;
  });
});


// $(document).ready(function() {
//     let symbol = "AAPL";
//     fetchDataAndUpdate(symbol);
//     upgrade(symbol);
//     getStockData(symbol);
//     companyBasic(symbol);
  
//     getNews(symbol);
//     getpress(symbol);
//     updateSpansWithData(symbol);
//     fetchHistoricalData('1year',symbol);
//     graphprice(symbol);
//     var eleElement = document.getElementById('ele');
//     eleElement.appendChild(chartElement);
// })


// Function to fetch historical data
function fetchHistoricalData(interval, symbol) {
    var eleElement = document.getElementById('ele');
    eleElement.innerHTML = '';
    var chartElement = document.createElement('div');
    chartElement.classList.add('chart-container');

    var chart = LightweightCharts.createChart(chartElement, {
        width: 400,
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
                    color: '#fff',
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
                    color: '#fff',
                },
                horzLines: {
                    color: '#fff',
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
        width: 400,
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
                    color: '#fff',
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
                    color: '#fff',
                },
                horzLines: {
                    color: '#fff',
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
                $('#market_cap').text(data['Market Cap ($M USD)']);
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

function balanceData(symbol) {
    $.ajax({
        url: '/landing/api/balance_data/' + symbol + '/',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            var table = $("#financial-data-table");

            // Clear the table for new data
            table.html('');

            // Create the caption element
            var caption = $('<caption></caption>');
            table.append(caption);

            // Create the tbody element
            var tbody = $('<tbody></tbody>');

            $.each(data, function(key, value) {
                var row = $('<tr></tr>');
                var keyCell = $('<td class="key"></td>').text(key);
                var valueCell = $('<td class="value" id="' + key + '"></td>').text(value);
                row.append(keyCell);
                row.append(valueCell);
                tbody.append(row);
            });

            // Append the tbody to the table
            table.append(tbody);
        }
    });
}


function incomeData(symbol) {
    $.ajax({
        url: '/landing/api/income_data/' + symbol + '/',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            var table = $("#income-data-table");

            // Clear the table for new data
            table.html('');

            // Create the caption element
            var caption = $('<caption></caption>');
            table.append(caption);

            // Create the tbody element
            var tbody = $('<tbody></tbody>');

            $.each(data, function(key, value) {
                var row = $('<tr></tr>');
                var keyCell = $('<td class="key"></td>').text(key);
                var valueCell = $('<td class="value" id="' + key + '"></td>').text(value);
                row.append(keyCell);
                row.append(valueCell);
                tbody.append(row);
            });

            // Append the tbody to the table
            table.append(tbody);
        }
    });
}


function cashFlowData(symbol) {
    $.ajax({
        url: '/landing/api/cashflow_data/' + symbol + '/',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            var table = $("#cash-data-table");

            // Clear the table for new data
            table.html('');

            // Create the caption element
            var caption = $('<caption></caption>');
            table.append(caption);

            // Create the tbody element
            var tbody = $('<tbody></tbody>');

            $.each(data, function(key, value) {
                var row = $('<tr></tr>');
                var keyCell = $('<td class="key"></td>').text(key);
                var valueCell = $('<td class="value" id="' + key + '"></td>').text(value);
                row.append(keyCell);
                row.append(valueCell);
                tbody.append(row);
            });

            // Append the tbody to the table
            table.append(tbody);
        }
    });
}





function getStockData(symbol) {
    $.ajax({
        url: `/landing/get_stock_data/${symbol}/`,
        success: function (response) {
            var stockData = response['Global Quote'];

            $('#symbol-data').text(stockData['01. symbol']);
            $('#open-data').text(stockData['02. open']);
            $('#high-data').text(stockData['03. high']);
            $('#low-data').text(stockData['04. low']);
            $('#price-data').text(stockData['05. price']);
            $('#volume-data').text(stockData['06. volume']);
            $('#latest-day-data').text(stockData['07. latest trading day']);
            $('#previous-close-data').text(stockData['08. previous close']);
            $('#change-data').text(stockData['09. change']);
            $('#change-percent-data').text(stockData['10. change percent']);

            
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
        balanceData(symbol);
        incomeData(symbol);
        cashFlowData(symbol);
        getStockData(symbol);
        fetchNews(symbol);
        var eleElement = document.getElementById('ele');
        eleElement.appendChild(chartElement);
    }
});


fetchHistoricalData('1year',symbol);
fetchDataAndUpdate(symbol);
getFinancialRatiosData(symbol);



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