import React, { Component } from 'react';

import {
	StyleSheet,
	Text,
	View,
	StatusBar ,
	TouchableOpacity,
	ActivityIndicator,
	} from 'react-native';

	
import IonIcon from 'react-native-vector-icons/Ionicons';
	

import Logo from '../../Comp/Logo';
import Form from '../../Comp/Form';

import {Actions} from 'react-native-router-flux';
import Auth,{login,check,user} from '../../js/gamify/auth'
import NewAsyncStorage from '../../Library/AsyncStorage'






export default class Login extends Component<{}> {

	constructor(props){
        super(props);
        this.state={
            loading:false
        }
    }
	

	componentDidMount(){
	
		this.checkAuth();

	}

	checkAuth(){
		// this.setState({loading:true})
		let nas = new NewAsyncStorage()
       // nas.getItemByKey('@Gamify:auth', (resp) => {
		nas.getItemByKey('@jwt:user_info', (resp) => {
		//nas.getItemByKey('@jwt:raw', (resp) => {
			console.log('temporary auth ==> ', resp)
			if(resp){
				console.log('ss')
				// this.setState({loading:false})
				Auth.login()
				Actions.home()
			}else{
				console.log('sd')
				Actions.sign_signup()
				
			}
            
        })
	}

	signup() {

		// Actions.signup()
	
		}


	render() {

				return(

				<View style={styles.container}>
				 <TouchableOpacity style={styles.back} onPress={()=>{Actions.IKdrawer() }}>
						<IonIcon 
						name="ios-arrow-round-back" 
						size={50} 
						 
						color="#E80E89" />
					
					</TouchableOpacity>
				  	<Logo />  
					  <ActivityIndicator size="large"  color="#e84393"  />
					 
					{/* {this.state.loading ? <ActivityIndicator size="large"  color="#e84393"  />: <Form type="Login"/>  } */}
					<View style={styles.signupTextCont}>
					{/* 
					<Text style={styles.signupText}>Dont have an account yet?</Text>
					<TouchableOpacity onPress={this.signup}>
						<Text style={styles.signupButton}> Signup</Text>
					</TouchableOpacity> 
					*/}
					</View>

				</View>

				)}

	}



const styles = StyleSheet.create({
		container : {
		//backgroundColor:'#455a64',
		backgroundColor:'#000',
		flex: 1,
		alignItems:'center',
		justifyContent :'center'
		},
		signupTextCont : {
		flexGrow: 1,
		alignItems:'flex-end',
		justifyContent :'center',
		paddingVertical:16,
		flexDirection:'row'
		},

		signupText: {
		//color:'rgba(255,255,255,0.6)',
		color:'#28180a',
		fontSize:16
		},
		signupButton: {
		//color:'#ffffff',
		color:'#ce925a',
		fontSize:16,
		fontWeight:'500'
		},
		back:{
			position:'absolute',
			top:0,
			left:5,
			//backgroundColor:'powderblue'
		  },

});