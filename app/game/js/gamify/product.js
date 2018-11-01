import Auth from "./auth";
import * as Api from "./config/server";

import { AsyncStorage } from "react-native";

class Product {
    get() {        
        Auth.user()
        .then(user => {
            Auth.token()
            .then(auth => {
                return fetch(Api.apiUrl + 'products', {
                        method: 'GET',
                        headers: {
                            Authorization : 'Bearer ' + auth.access_token
                        }
                    })
                    .then(response => response.json())
                    .then(responseData => {
                        console.log('product get', responseData);
                        return responseData;
                    })
                    .catch(error => {
                        console.error('product', error);
                        return error;
                    });
            })
            .catch(error => {
              console.error('product', error);
              return error;
            });
        })
        .catch(error => {
          console.error('product', error);
          return error;
        });
    }  
}

export default new Product();