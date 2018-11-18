function startApp(){
    var apiKey = getApiKey();
    if(!apiKey){
        apiKey = window.prompt("ApiKey");
        localStorage.setItem('apikey', apiKey);
    }
    
    start(apiKey);
}

function getApiKey(){
    return localStorage.getItem('apikey');
}

function getAuthentication(){
    return {
        auth: {
            username: 'tempeliertoet',
            password: getApiKey()
        }
    };
}

async function start(){
    var fileInfo = await getFileInfo();
    var filecontentElement = document.getElementById('filecontent');
    filecontentElement.value = atob(fileInfo.content);
    var shaElement = document.getElementById('filesha');
    shaElement.value = fileInfo.sha;
}

async function getFileInfo() {
    try {
        const response = await axios.get('https://api.github.com/repos/tempeliertoet/energy/contents/energy.json', getAuthentication());
        var data = response.data;
        console.log(data);
        return data;
    }
    catch (error) {
        console.error(error);
    }
}

async function updateFile() {
    var content = document.getElementById('filecontent').value;
    var sha = document.getElementById('filesha').value;
    try {
        var data = {
            message: 'testcommit',
            content: btoa(content),
            sha: sha
        };
        await axios.put('https://api.github.com/repos/tempeliertoet/energy/contents/testfile.txt', data, getAuthentication());
    }
    catch (error) {
        console.error(error);
    }
}

startApp();