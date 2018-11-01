import React, { Component } from 'react';

import {

    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    AsyncStorage,
    ActivityIndicator,
   

} from 'react-native';

import {Actions} from 'react-native-router-flux';

//import auth,{login,check,user} from '../gamify/auth'
import Auth from '../js/gamify/auth'





export default class Form extends Component {
    constructor(props){
        super(props);
        this.state={
            username :'',
            password:'',
            loading:false
        }
    }

componentDidMount(){
   
    
}


async _login(){
    this.setState({loading:true})
   
        let dt = await Auth.login(this.state.username,this.state.password)
   
    console.log('rr',dt)
    if(dt.error){
        
        Alert.alert(
            'Message',dt.message
        )
        this.setState({loading:false})
    }else{

        let ck  = await Auth.token();
        let usr = await Auth.user();
        console.log('ck',ck)
        console.log('usr',usr)
        this.setState({loading:false})
        Actions.home()
    
    }
   

}

    

render(){
if(this.state.loading){return(<ActivityIndicator size="large"  color="#ff1a8c"  />)}
return(

<View style={styles.container}>

        <TextInput style={styles.inputBox}
        underlineColorAndroid='rgba(0,0,0,0)'
        //underlineColorAndroid='#cccccc'
        placeholder="Username"
        placeholderTextColor = "#a3a375"
        selectionColor="#fff"
        //keyboardType="Username"
        onSubmitEditing={()=> this.username.focus()}
        onChangeText={(text) => this.setState({username: text })}   />

        <TextInput style={styles.inputBox}
        underlineColorAndroid='rgba(0,0,0,0)'
        //underlineColorAndroid='#cccccc'
        placeholder="Password"
        secureTextEntry={true}
        placeholderTextColor = "#a3a375"
        ref={(input) => this.password = input}
        onChangeText={(text) => this.setState({password: text })}  />

        <TouchableOpacity 
        style={styles.button}
        onPress={ () =>
        this._login()
        }>
        <Text style={styles.buttonText}>{this.props.type}</Text>

        </TouchableOpacity>
        

    </View>)

        }

}



const styles = StyleSheet.create({

    container : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center'
    },



    inputBox: {
    width:300,
    //backgroundColor:'rgba(255, 255,255,0.2)',
    backgroundColor:'rgb(214, 211, 209)',
    borderRadius: 25,
    paddingHorizontal:16,
    fontSize:16,
    //color:'#ffffff',
    //color:'#ce925a',
    color:'#4f4844',
    marginVertical: 10
    },

    button: {
    width:300,
    //backgroundColor:'#1c313a',
    backgroundColor:'#e84393',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
    },

    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
        //color:'#ce925a',
        textAlign:'center'

    }



});
