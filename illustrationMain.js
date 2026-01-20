google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

let chart, data, options;

function drawChart() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

  const categoryTotals = {};

  transactions.forEach(t => {
    const amount = Math.abs(parseFloat(t.amount)) || 0;

    const category = t.category || t.type || 'Uncategorized';

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }
    categoryTotals[category] += amount;
  });

  const dataArray = [
    ['Category', 'Amount', { role: 'tooltip', type: 'string' }]
  ];

  for (const category in categoryTotals) {
    dataArray.push([
      category,
      categoryTotals[category],
      category 
    ]);
  }

  if (dataArray.length === 1) {
    dataArray.push(['No Data', 1, 'No Data']);
  }

  data = google.visualization.arrayToDataTable(dataArray);

  options = {
    title: 'Expense Distribution: Track which category you spend the most!',
    legend: {
      position: 'bottom',
      textStyle: { fontSize: 14 }
    },
    chartArea: {
      width: '85%',
      height: '70%'
    },
    pieHole: 0.3,
    pieSliceText: 'percentage',
    backgroundColor: 'transparent'
  };

  chart = new google.visualization.PieChart(
    document.getElementById('piechart')
  );
  chart.draw(data, options);
}

window.addEventListener('resize', () => {
  if (chart && data && options) {
    chart.draw(data, options);
  }
});