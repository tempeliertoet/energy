Vue.component('chartist', {
    
    mounted: function () {
        this.$nextTick(function () {
            this.chart = new Chartist.Bar('#' + this.id, this.data, { height: this.height });
        });
    },
    props: {
        data: { type: Object },
        height: { type: Number },
        id: { type: String },
    },
    template: '#chart-template',
    watch: {
        'data': function(data) { this.chart.update(data); }
    }
});