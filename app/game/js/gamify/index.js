import { AsyncStorage } from "react-native";
import * as Api from './config/server';

export { default as Auth } from "./auth";
export { default as Character } from "./character";
export { default as History } from "./history";
export { default as Product } from "./product";
export { default as Order } from "./order";
export { default as OrderItem } from "./orderItem";

const _auth = Symbol('auth');
const _user = Symbol('user');
const _questFetch = Symbol('questFetch');
const _subQuestFetch = Symbol('subQuestFetch');

class Gamify {
    async [_auth]() {        
        try {
            const user = await AsyncStorage.getItem('@Gamify:auth');
            return JSON.parse(user);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async [_user]() {       
        try {
            const user = await AsyncStorage.getItem('@Gamify:user');
            return JSON.parse(user);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async [_questFetch]() {        
        try {
            const auth = await this[_auth]();
            const user = await this[_user]();

            return fetch(Api.apiUrl + 'quests', {
                method: 'GET',
                headers: {
                    Authorization : 'Bearer ' + auth.access_token
                }
            })
            .then(response => response.json())
            .then((responseData) => {                            
                // console.log('get challenge =>', responseData);
                AsyncStorage.setItem('@Gamify:quest', JSON.stringify(responseData));
                return responseData;
            })
            .catch(error => {
                console.error('quest fetch failed', error);
                return error;
            });
        } catch (error) {
            console.log('quest failed =>', error);
            return error;
        }
    }

    async [_subQuestFetch]() {        
        try {
            const auth = await this[_auth]();
            const user = await this[_user]();

            return fetch(Api.apiUrl + 'categories?search=parent_id:4', {
                method: 'GET',
                headers: {
                    Authorization : 'Bearer ' + auth.access_token
                }
            })
            .then(response => response.json())
            .then((responseData) => {                            
                // console.log('get challenge =>', responseData);
                AsyncStorage.setItem('@Gamify:category', JSON.stringify(responseData));
                return responseData;
            })
            .catch(error => {
                console.error('category fetch failed', error);
                return error;
            });
        } catch (error) {
            console.log('category failed =>', error);
            return error;
        }
    }

    get(category) {
        // get auth
        // check character for prerequisite
        // get gamify for user login (character)

        // TODO : nantinya akan query ke server
        switch(category) {
            case 'quest':         
                return this[_subQuestFetch]();
            case 'challenge':
                return this[_questFetch]();
            default:
                return null;
        }
    }
}

export default new Gamify();