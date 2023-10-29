function fetchHistoricalData(interval, symbol) {
    var eleElement = document.getElementById('ele');
    eleElement.innerHTML = '';
    var chartElement = document.createElement('div');
    chartElement.classList.add('chart-container');

    var chart = LightweightCharts.createChart(chartElement, {
        width: 400,
        height: 400,
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
        height: 400,
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

