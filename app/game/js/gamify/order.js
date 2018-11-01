import Auth from "./auth";
import * as Api from "./config/server";

import { AsyncStorage } from "react-native";

class Order {
    set(order) {
        Auth.user()
        .then(user => {
            let data = order;
            data['created_by'] = user.id;

            Auth.token()
            .then(auth => {
                return fetch(Api.apiUrl + 'orders', {
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
                        console.log('order set', responseData);

                        return responseData;
                    })
                    .catch(error => {
                        console.error('order', error);
                        return error;
                    });
            })
            .catch(error => {
              console.error('order', error);
              return error;
            });
        })
        .catch(error => {
          console.error('order', error);
          return error;
        });
    }
}

export default new Order();