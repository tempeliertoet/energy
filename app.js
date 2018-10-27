var app = new Vue({ 
    el: '#app',
    data: {
        solarYieldList: [],

        years: [],
        selectedYear: null
    },
    computed: {
        chartData: function(){
            return {
                labels: this.solarYieldList.filter(this.filterYear).map((solarYield) => this.getMonthName(solarYield.month)),
                series: [this.solarYieldList.filter(this.filterYear).map((solarYield) => solarYield.kwh)]
            };
        }
    },
    methods: {
        getMonthName: function(month){
            return moment(month, "YYYY-MM-DD").format('MMMM');
        },
        getYear: function(month){
            return moment(month, "YYYY-MM-DD").year();
        },
        filterYear: function (solarYield) {
            return this.getYear(solarYield.month) === this.selectedYear;
        },
        fillYears: function(){
            const me = this;
            if(!this.solarYieldList) return;
            this.solarYieldList.forEach(function(element) {
                const year = me.getYear(element.month);
                me.years.indexOf(year) === -1 ? me.years.push(year) : null;
              });
            this.selectedYear = Math.max.apply(null, this.years);
        }
    },
    created() {
        axios.get('solaryield.json')
        .then(response => {
            this.solarYieldList = response.data;
            this.fillYears();
        })
        .catch(error => {
          console.log(error);
        })
    }
});
