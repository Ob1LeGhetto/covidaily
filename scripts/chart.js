import Chart from 'chart.js/auto';

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(
    ctx, {
        type: 'line',
        data: {
            labels: [
                '10/04',
                '11/04',
                '12/04',
                '13/04',
                '14/04',
                '15/04',
                '16/04'
            ],
            datasets: [{
                label: 'My First dataset',
                borderColor: 'rgba(255, 99, 132, 0.1)',
                borderWidth: 1,
                data: [10000, 9000, 7500, 9500, 11000, 10500, 11300],
                backgroundColor: ['rgba(255, 99, 132, 0.1)', 'rgba(255, 99, 132, 0.1)', 'rgba(255, 99, 132, 0.1)'],
            }]
        },
        options: {
            xAxes: [{
                gridLines: {
                    drawOnChartArea: false
                }
            }],
            yAxes: [{
                gridLines: {
                    drawOnChartArea: false
                }
            }]
        },
    })
module.export()