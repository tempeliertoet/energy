Vue.component('chartist', {
    
    mounted: function () {
        this.chart = new Chartist.Bar('#chart', {
            labels: this.data.labels,
            series: this.data.series
        }, { height: this.height });
    },
    props: {
        data: { type: Object },
        height: { type: Number }
    },
    template: '#chart-template',
    watch: {
        'data': function(data) { this.chart.update(data); }
    }
});