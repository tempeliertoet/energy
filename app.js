var app = new Vue({ 
    el: '#app',
    data: {
        energyData: null,
        years: [],
        selectedYear: null
    },
    computed: {
        solarYieldChartData: function(){
            return this.getChartData('solarYield');
        },
        electricityChartData: function(){
            return this.getChartData('electricity');
        },
        gasChartData: function(){
            return this.getChartData('gas');
        },
        waterChartData: function(){
            return this.getChartData('water');
        }
    },
    methods: {
        getMonthName: function(month){
            return moment(month, 'YYYY-MM-DD').format('MMM');
        },
        getYear: function(month){
            return moment(month, 'YYYY-MM-DD').year();
        },
        filterYear: function (element) {
            return this.getYear(element.month) === this.selectedYear;
        },
        fillYears: function(){
            const me = this;
            if(!this.energyData) return;
            this.addYears(this, this.energyData.solarYield);
            this.addYears(this, this.energyData.electricity);
            this.addYears(this, this.energyData.gas);
            this.addYears(this, this.energyData.water);
            this.selectedYear = Math.max.apply(null, this.years);
        },
        addYears: function (me, arr){
            arr.forEach(function(element) {
                const year = me.getYear(element.month);
                me.years.indexOf(year) === -1 ? me.years.push(year) : null;
              });
        },
        calculateElectricityMonthlyTotals: function(){
            this.calculateMonthlyTotals('electricity');
            var electricity = this.energyData.electricity;
            var solarYield = this.energyData.solarYield;
            var output = electricity.map(function(item, index, electricity){ 
                var currentElement = electricity[index];
                var solarYieldMonth = solarYield.filter(function(yield){ return yield.month === currentElement.month; })[0];
                var total = currentElement.total + (solarYieldMonth ? solarYieldMonth.total : 0);
                return { month: currentElement.month, total: total };
            });
            this.energyData.electricity = output;
        },
       calculateMonthlyTotals: function(type){
            var data = this.energyData[type];
            var output = data.map(function(item, index){ 
                var currentElement = data[index];
                var nextElement = data[index+1];
                if(!nextElement) return null;
                var newElement = {};
                newElement.month = nextElement.month;
                if(nextElement.total){
                    newElement.total = nextElement.total - currentElement.total;
                }
                else{
                    var currentElementTotal = currentElement.dayin + currentElement.nightin ?? 0 - currentElement.dayout ?? 0 - currentElement.nightout ?? 0;
                    var nextElementTotal = nextElement.dayin + nextElement.nightin ?? 0 - nextElement.dayout ?? 0 - nextElement.nightout ?? 0;
                    newElement.total = nextElementTotal - currentElementTotal;
                }
                return newElement;
            });
            output.splice(-1,1);
            this.energyData[type] = output;
        },
        getChartData: function (type){
            if(!this.energyData) return null;
            var filteredData = this.energyData[type].filter(this.filterYear);
            filteredData = this.fillGaps(filteredData);
            return {
                labels: filteredData.map((element) => this.getMonthName(element.month)),
                series: [filteredData.map((element) => element.total)]
            };
        },
        fillGaps: function (data){
            var month = 1;
            while (month <= 12) {
                var currentMonth = moment(this.selectedYear + '-' + month + '-01', 'YYYY-MM-DD');
                var monthData = data.filter(function(element){ return element.month === currentMonth.format('YYYY-MM-DD'); })[0];
                if(!monthData){
                    data.splice(month-1, 0, { month: currentMonth.format('YYYY-MM-DD'), total: 0 });
                }
                month++;
            }
            return data;
        }
    },
    created() {
        axios.get('energy.json')
        .then(response => {
            this.energyData = response.data;
            this.fillYears();
            this.calculateElectricityMonthlyTotals();
            this.calculateMonthlyTotals('gas');
            this.calculateMonthlyTotals('water');
        })
        .catch(error => {
          console.log(error);
        })
    }
});
