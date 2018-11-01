import React, { Component } from 'react';
import {
	Text,
	View,
	TouchableHighlight,
	Linking,
	Alert
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';

export default class FooterSM extends Component{

	constructor(props){
		super(props);
		this._scrollToTop = this._scrollToTop.bind(this);
	}

	_goToUrl(url1,url2){
		Linking.canOpenURL(url1).then(supported=>{
			if(supported){
				Linking.openURL(url1);
			}
			else{
				if(url2){
					Linking.openURL(url2);
				}
				else{
					Alert.alert('Pesan','Gagal membuka : '+url1,[{text:'OK',onPress:()=>{}}]);
				}
			}
		});
	}

	_scrollToTop(ScrollView){
		if(typeof ScrollView !== 'undefined' && ScrollView !== ''){
			ScrollView.scrollTo({x:0,y:0,animated:true});
		}
	}

	render(){

		return(

			<View style={{backgroundColor:'#eaeaea',paddingBottom:50}}>

				<View style={{flexDirection:'row',justifyContent:'center',marginTop:25}}>
					<TouchableHighlight underlayColor='transparent' onPress={()=>Actions.IKInfo({open_tab:{'TENTANG KAMI':true}})}>
						<Text style={{fontSize:11}}>TENTANG KAMI</Text>
					</TouchableHighlight>
					<Text style={{fontSize:11,paddingLeft:8,paddingRight:8}}>|</Text>
					<TouchableHighlight underlayColor='transparent' onPress={()=>Actions.IKInfo({open_tab:{'HUBUNGI KAMI':true}})}>
						<Text style={{fontSize:11}}>HUBUNGI KAMI</Text>
					</TouchableHighlight>
					<Text style={{fontSize:11,paddingLeft:8,paddingRight:8}}>|</Text>
					<TouchableHighlight underlayColor='transparent' onPress={()=>Actions.IKInfo({open_tab:{'SYARAT DAN KETENTUAN':true}})}>
						<Text style={{fontSize:11}}>SYARAT &amp; KETENTUAN</Text>
					</TouchableHighlight>
				</View>

				{/* <View style={{flex:1,alignItems:'center',marginTop:25}}>
					<Text style={{fontSize:11,marginBottom:15}}>IKUTI KAMI :</Text>
					<View style={{flex:1,flexDirection:'row'}}>
						<TouchableHighlight underlayColor='transparent' style={{width:75}} onPress={()=>{this._goToUrl('fb://page/167374663314043','https://www.facebook.com/IndonesiaKaya')}}>
							<FAIcon style={{fontSize:18,textAlign:'center'}} name="facebook"/>
						</TouchableHighlight>
						<TouchableHighlight underlayColor='transparent' style={{width:75}} onPress={()=>{this._goToUrl('intent://instagram.com/_u/indonesia_kaya/#Intent;package=com.instagram.android;scheme=https;end','https://www.instagram.com/indonesia_kaya')}}>
							<FAIcon style={{fontSize:18,textAlign:'center'}} name="instagram"/>
						</TouchableHighlight>
						<TouchableHighlight underlayColor='transparent' style={{width:75}} onPress={()=>{this._goToUrl('twitter://user?screen_name=IndonesiaKaya','https://twitter.com/IndonesiaKaya')}}>
							<FAIcon style={{fontSize:18,textAlign:'center'}} name="twitter"/>
						</TouchableHighlight>
						<TouchableHighlight underlayColor='transparent' style={{width:75}} onPress={()=>{this._goToUrl('vnd.youtube://user/IndonesiaKaya','https://www.youtube.com/user/IndonesiaKaya')}}>
							<FAIcon style={{fontSize:18,textAlign:'center'}} name="youtube-play"/>
						</TouchableHighlight>
					</View>
				</View> */}

				<View style={{marginTop:25,padding:5,paddingTop:0,paddingBottom:0}}>
					<Text style={{textAlign:'center',fontSize:10}}>COPYRIGHT &copy; INDONESIAKAYA.COM ALL RIGHTS RESERVED</Text>
				</View>

				<View style={{marginTop:20,marginBottom:20}}>
					<IonIcon style={{fontSize:35,textAlign:'center'}} onPress={()=>{this._scrollToTop(this.props.ScrollView)}} name='ios-arrow-dropup-outline'/>
				</View>

			</View>

		);

	}

}