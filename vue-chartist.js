Vue.component('chartist', {
    
    mounted: function () {
        this.chart = new Chartist.Bar('#chart', {
            labels: this.data.labels,
            series: this.data.series
        });
    },
    props: {
        data: { type: Object }
    },
    template: '#chart-template',
    watch: {
        'data': function(data) { this.chart.update(data); }
    }
});