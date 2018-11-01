import Auth from "./auth";
import * as Api from "./config/server";

import { AsyncStorage } from "react-native";
import Gamify, { Character } from "app/gamify";


const _quest = Symbol('quest');

class Challenge{



    [_quest]() {
        Gamify.get('challenge')
        .then((quest) => {
        //   console.log('chalennge =>', quest);
          let challenge = [];
          quest.data.map((item, i) => (
            challenge.push({
                category_id:item.id,
                description:item.description,
                id:item.id,
                image:item.image,
                title:item.title,
                type_id:item.id
            })
          ));
          // console.log('reeChallenge',challenge)
          AsyncStorage.setItem('@Gamify:challenge', JSON.stringify(challenge));
          return challenge;
          
        })
        .catch((error) => {
          console.log(error);
        });
      }

    //   setChar(nChar){
    //     Character.set(nChar.id)
    //         Character.get('@Gamify:character')
    //              .then((score) => {
    //                 console.log('Score',JSON.stringify(score))
    //             }).catch((error) => {
    //             console.log(error)
    //             }); 
    //             //
    //   }


   async get(){
        this[_quest]();
        
    }

    async challenge() {        
      try {
          const data = await AsyncStorage.getItem('@Gamify:challenge');
          // console.log('ASyncCall',data)
          return JSON.parse(data);
      } catch (error) {
          console.log(error);
          return error;
      }
  }

}


export default new Challenge;