import { AsyncStorage } from "react-native";
import * as Api from "./config/server";

const _authFetch = Symbol('authFetch');
const _userFetch = Symbol('userFetch');

class Auth {
    [_authFetch](username, password) {
        const url = Api.login.url;
        const data = Api.login.data;
        
        if(Api.login.data.grant_type === 'password') {
            data['username'] = username
            data['password'] = password
        }

        return fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(responseData => {             
            AsyncStorage.setItem('@Gamify:auth', JSON.stringify(responseData));
            console.log('auth',responseData)
            return responseData;
        })
        .catch(error => {
          console.error('fetch failed', error);
          return error;
        });
    }

    async [_userFetch](username, password) {        
        try {
            const auth = await this[_authFetch](username, password);

            if(auth.error) {
                return auth;
            }

            return fetch(Api.apiUrl + 'user', {
                    method: 'GET',
                    headers: {
                        Authorization : 'Bearer ' + auth.access_token
                    }
                })
                .then((res) => res.json())
                .then((resData) => {             
                    AsyncStorage.setItem('@Gamify:user', JSON.stringify(resData));
                    return resData;
                })
                .catch(error => {
                    console.error('user fetch failed', error);
                    return null;
                });
        } catch (error) {
            console.log('user failed =>', error);
            return error;
        }
    }

    async login(username, password) {                
        try {
            if(Api.login.data.grant_type === 'password') {
                const user = await this[_userFetch](username, password);
                console.log('usr',user)
                return user;
            }
            if(Api.login.data.grant_type === 'client_credentials') {
                const auth = await this[_authFetch]();
                console.log('auth',auth)
                return auth;
            }
        } catch (error) {
            console.log('Auth comp user =>', error);
            return error;
        }
    }

    register() {

    }
    
    logout() {

    }
    
    forgot() {

    }

    async token() {        
        try {
            let data = await AsyncStorage.getItem('@Gamify:auth');
            return JSON.parse(data);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async user() {        
        try {
            // get user from ik sso server
            const data = await AsyncStorage.getItem('@jwt:user_info');
            const userInfo = JSON.parse(data);

            //console.log('user',userInfo)

            return {id : userInfo.data.userId}
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

export default new Auth();