import React, { Component } from 'react';
import {
Text,
View,
Image,
TouchableHighlight
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class FooterBtm extends Component{

render(){

	return(
		
		<View style={{position:'absolute',bottom:0,left:0,right:0,flexDirection:'row',zIndex:100}}>
			<TouchableHighlight underlayColor='#502e12' style={{
				backgroundColor:'#502e12',
				flex:1,
			}} onPress={()=>Actions.GIK(console.log('tombolcobaGIK'))}>
			
				<View
					style={{
						height:50,
						flexDirection:'row',
						justifyContent:'center',
						alignItems:'center'
					}}
				>
					<Image style={{
						width:25,
						height:25,
						marginRight:3,
					}} source={require('../resource/image/footer_icon2.png')} />
					<Text style={{
						color:'#fff',
						fontSize:11
					}}>GALERI INDONESIA KAYA</Text>
				</View>
			</TouchableHighlight>
			<TouchableHighlight underlayColor='#b35e27' style={{
				backgroundColor:'#b35e27',
				flex:1,
			}} onPress={()=>Actions.JIK( console.log('tombolcobaJIk'))}>
				<View
					style={{
						height:50,
						flexDirection:'row',
						justifyContent:'center',
						alignItems:'center'
					}}
				>
					<Image style={{
						width:25,
						height:25,
						marginRight:3,
					}} source={require('../resource/image/footer_icon1.png')} />
					<Text style={{
						color:'#fff',
						fontSize:11
					}}>JURNAL INDONESIA KAYA</Text>
				</View>
			</TouchableHighlight>
		</View>
	);

	}

}
