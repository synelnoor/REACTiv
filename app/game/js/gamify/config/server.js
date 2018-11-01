const server = 'http://202.158.39.170/gamify/public/'

const apiUrl = server + 'api/'

const login = {
    url: server + 'oauth/token',
    data : { 
        client_id: '1',
        client_secret: 'ik-gamify-app-redtech-m61',
        grant_type : 'client_credentials',
        scope : ''
    }
}

export {
    server,
    apiUrl,
    login
}