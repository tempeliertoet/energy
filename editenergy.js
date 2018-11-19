var app = new Vue({ 
    el: '#app',
    data: {
        fileContent: null,
        apiKey: null,
        sha: null
    },
    computed: {
        authentication: function(){
            return {
                auth: {
                    username: 'tempeliertoet',
                    password: this.apiKey
                }
            };
        }
    },
    methods: {
        async getFileInfo() {
            try {
                const response = await axios.get('https://api.github.com/repos/tempeliertoet/energy/contents/energy.json', this.authentication);
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
                const response = await axios.put('https://api.github.com/repos/tempeliertoet/energy/contents/energy.json', data, this.authentication);
                this.sha = response.data.content.sha;
            }
            catch (error) {
                console.error(error);
            }
        }
    },
    async created() {
        var apiKey = localStorage.getItem('apikey');;
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