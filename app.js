Vue.component('chart', {
    props: ['name'],
    template: '<p>Hi {{ name }}</p>'
  });

var app = new Vue({ 
    el: '#app',
    data: {
        solarYieldList: [],
        chartData: {},
        filterYear: function (solarYield) {
            const selectedYear = moment().year();
            return moment(solarYield.month, "YYYY-MM-DD").year() === selectedYear;
        }
    },
    created() {
        axios.get('solaryield.json')
        .then(response => {
            this.solarYieldList = response.data;
            this.chartData = {
                labels: this.solarYieldList.filter(this.filterYear).map((solarYield) => solarYield.month),
                series: [this.solarYieldList.filter(this.filterYear).map((solarYield) => solarYield.kwh)]
            };
        })
        .catch(error => {
          console.log(error);
        })
    }
});
