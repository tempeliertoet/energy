var app = new Vue({ 
    el: '#app',
    data: {
        fileContent: null,
        apiKey: null,
        sha: null
    },
    computed: {
        solarYieldChartData: function(){
            return this.getChartData('solarYield');
        }
    },
    methods: {
        getApiKey(){
            return localStorage.getItem('apikey');
        },
        getAuthentication(){
            return {
                auth: {
                    username: 'tempeliertoet',
                    password: this.getApiKey()
                }
            };
        },
        async getFileInfo() {
            try {
                const response = await axios.get('https://api.github.com/repos/tempeliertoet/energy/contents/energy.json', this.getAuthentication());
                return response.data;
            }
            catch (error) {
                console.error(error);
            }
        },
        async updateFile() {
            try {
                var data = {
                    message: 'testcommit',
                    content: btoa(this.fileContent),
                    sha: this.sha
                };
                const response = await axios.put('https://api.github.com/repos/tempeliertoet/energy/contents/energy.json', data, this.getAuthentication());
                this.sha = response.data.content.sha;
            }
            catch (error) {
                console.error(error);
            }
        }
    },
    async created() {
        var apiKey = this.getApiKey();
        if(!apiKey){
            apiKey = window.prompt("ApiKey");
            localStorage.setItem('apikey', apiKey);
        }
        this.apiKey = apiKey;

        var fileInfo = await this.getFileInfo();
        this.fileContent = atob(fileInfo.content);
        this.sha = fileInfo.sha;
    }
});