import Auth from "./auth";
import * as Api from "./config/server";

import { AsyncStorage } from "react-native";
import Gamify, { Character } from "app/gamify";


const _quest = Symbol('quest');

class Quest{

    [_quest]() {
    Gamify.get('quest')
    .then((quest) => {
      let subQuest = [];
        console.log('quest',quest)
    //   quest.data.map((item, i) => {
    //     subQuest.push({ route: 'Challenge', name: item.name, title: item.name });
    //   });
  
      console.log('subQuest =>', subQuest);
      return quest;
        })
        .catch((error) => {
        console.log(error);
        });
      //
    }


   async get(){
        console.log('tes')

        Gamify.get('quest')
        .then((quest) => {
          let subQuest = [];
            console.log('quest',quest)
          quest.data.map((item, i) => {
            subQuest.push({ route: 'Challenge', name: item.name, title: item.name });
          });
      
          console.log('subQuest =>', subQuest);
          return quest;
            })
        .catch((error) => {
        console.log(error);
        });
        //
        
    }

}


export default new Quest;