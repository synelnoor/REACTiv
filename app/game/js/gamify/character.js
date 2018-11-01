// import Auth from "./auth";
// import server from "../config/server";

import { AsyncStorage } from "react-native";

// TODO : nantinya ambil dari server
const actionPoint = {
    '1' : 10,
    '2' : 20
}

let points = 0

class Char {
    set = (id) => {
        points = points + actionPoint[id]
        let data = {
            'Action ID' : id,
            'Action Point' : actionPoint[id],
            'Total Points' : points
        }

        AsyncStorage.setItem('@Gamify:character', JSON.stringify(data));
    }

    async get(key) {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    
}

export default new Char();