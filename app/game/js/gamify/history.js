import Auth from "./auth";
import * as Api from "./config/server";

import { AsyncStorage } from "react-native";

class History {
    // TODO: nantinya kan return reward yg diterima, beserta status game metrics yg terupdate (character)
    set(activity, cb) {
        Auth.user()
        .then(user => {


            let data = activity;
            data['created_by'] = user.id;
            console.log('data',data)

            Auth.token()
            .then(auth => {
                return fetch(Api.apiUrl + 'histories', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization : 'Bearer ' + auth.access_token
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => response.json())
                    .then(responseData => {
                        console.log('history set', responseData);
                        var last= responseData.data.characters[0].value;
                        console.log('lastPoint',last);
                        AsyncStorage.setItem('@Gamify:point', JSON.stringify(last));
                        cb(responseData);
                        return responseData;
                    })
                    .catch(error => {
                        console.error('history', error);
                        return error;
                    });
            })
            .catch(error => {
              console.error('history', error);
              return error;
            });
        })
        .catch(error => {
          console.error('history', error);
          return error;
        });
    }

    get() {        
        Auth.user()
        .then(user => {
            Auth.token()
            .then(auth => {
                return fetch(Api.apiUrl + 'histories?search=created_by:' + user.id, {
                        method: 'GET',
                        headers: {
                            Authorization : 'Bearer ' + auth.access_token
                        }
                    })
                    .then(response => response.json())
                    .then(responseData => {
                        console.log('history get', responseData);
                       
                        return responseData;
                    })
                    .catch(error => {
                        console.error('history', error);
                        return error;
                    });
            })
            .catch(error => {
              console.error('history', error);
              return error;
            });
        })
        .catch(error => {
          console.error('history', error);
          return error;
        });
    } 
    
    async getPoint(){
        try {
            const data = await AsyncStorage.getItem('@Gamify:point');
            //console.log('ASyncCall',data)
            return JSON.parse(data);
        } catch (error) {
            console.log(error);
            return error;
        }

    }

}

export default new History();