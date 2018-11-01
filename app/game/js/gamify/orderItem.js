import Auth from "./auth";
import * as Api from "./config/server";

import { AsyncStorage } from "react-native";

class OrderItem {
    get() {        
        Auth.user()
        .then(user => {
            Auth.token()
            .then(auth => {
                return fetch(Api.apiUrl + 'order_items?search=created_by:' + user.id, {
                        method: 'GET',
                        headers: {
                            Authorization : 'Bearer ' + auth.access_token
                        }
                    })
                    .then(response => response.json())
                    .then(responseData => {
                        console.log('orderItem get', responseData);
                        return responseData;
                    })
                    .catch(error => {
                        console.error('orderItem', error);
                        return error;
                    });
            })
            .catch(error => {
              console.error('orderItem', error);
              return error;
            });
        })
        .catch(error => {
          console.error('orderItem', error);
          return error;
        });
    }  
}

export default new OrderItem();