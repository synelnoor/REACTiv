
import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import IonIcon from 'react-native-vector-icons/Ionicons';

export default class Logo extends Component<{}> {

render(){

return(

<View style={styles.container}>
 

  <Image  style={{ width: 100, height: 100,}}
      source={require('../img/logo-edited.png')}/> 

    <Text style={styles.logoText}>Welcome to  GameApp.</Text>

</View>

      )

    }

}



const styles = StyleSheet.create({

container : {
  flexGrow: 1,
  justifyContent:'flex-end',
  alignItems: 'center'
},
back:{
  position:'absolute',
  top:0,
  left:2
},

logoText : {
  marginVertical: 15,
  fontSize:18,
  //color:'rgba(255, 255, 255, 0.7)'
  //color:'#ce925a'
  color:'#47d147'

}
});