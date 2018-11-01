import React, {Component} from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ComFetch from './Comp/ComFetch';
import { Linking, View, Text, TouchableHighlight, Alert, Image } from 'react-native';
import { Button, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { base_url, api_uri } from '../comp/AppConfig';

export default class FooterSM extends Component {

	constructor(props){
		super(props);
		this.state = {
			txtSubsc:'',
		}
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

	_Subsc(){
	if(this.state.txtSubsc !== ''){
	let jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request
	let ConfFetch = {
	Authorization:jwt_signature,
	resoureRBaner:api_uri+'subscribe',
	sendMethod:'POST',
	sendData:{
	email:this.state.txtSubsc,
	},
	sendFetch:(resp)=>{
	if(resp.status === 200){
	if(resp.data){
	this.setState({txtSubsc:''},()=>{
	Alert.alert('Pesan','Terima Kasih telah mengikuti kami',[{text:'OK',onPress:()=>{}}]);
	});
	}
	else{
	Alert.alert('Pesan','Alamat email sudah terdaftar',[{text:'OK',onPress:()=>{}}]);
	}
	}
	else{
	Alert.alert('Pesan','Terjadi kesalahan pada server kami, harap mencoba kembali',[{text:'OK',onPress:()=>{}}]);
	}
	}
	}
	this.ConfFetch(ConfFetch);
	}
	else{
	Alert.alert('Pesan','Harap mengisikan alamat email pada kolom yang telah disediakan',[{text:'OK',onPress:()=>{}}]);
	}
	}

	ConfFetch(ConfFetch){
	ComFetch.setHeaders({
	Authorization: ConfFetch.Authorization
	});
	ComFetch.setRestURL(base_url);

	if (typeof ConfFetch.sendMethod != 'undefined')
	{
	ComFetch.setMethod(ConfFetch.sendMethod)
	}


	// Kirim data ke API
	if (typeof ConfFetch.sendData != 'undefined'){
	ComFetch.setSendData(ConfFetch.sendData)
	}

	// Ambil data Response Data API
	ComFetch.setResource(ConfFetch.resoureRBaner);
	ComFetch.sendFetch(ConfFetch.sendFetch);

	}

	render(){

		return(

			<View style={{backgroundColor:'#eaeaea',paddingBottom:50}}>

				<View style={{flexDirection:'row',justifyContent:'center',marginTop:25}}>
					<TouchableHighlight underlayColor='transparent' onPress={()=>{Actions.GIKAbout();}}>
						<Text style={{color:'#555',fontSize:11}}>TENTANG KAMI</Text>
					</TouchableHighlight>
					<Text style={{fontSize:11,paddingLeft:8,paddingRight:8}}>|</Text>
					<TouchableHighlight underlayColor='transparent' onPress={()=>{Actions.GIKContact();}}>
						<Text style={{color:'#555',fontSize:11}}>HUBUNGI KAMI</Text>
					</TouchableHighlight>
				</View>

				<View style={{flexDirection:'row',justifyContent:'center',marginTop:25}}>
					<TouchableHighlight underlayColor='transparent' onPress={()=>{this._goToUrl('https://www.tripadvisor.co.id/Attraction_Review-g294228-d7126267-Reviews-Galeri_Indonesia_Kaya_GIK-Java.html','https://www.tripadvisor.co.id/Attraction_Review-g294228-d7126267-Reviews-Galeri_Indonesia_Kaya_GIK-Java.html')}}>
						<Image resizeMode='contain' style={{width:130,height:20}} source={require('../resource/image/logo-tripadvisor.png')}/>
					</TouchableHighlight>
				</View>

				<View style={{
					margin:20,
					marginTop:25,
					marginBottom:0,
					flexDirection:'row',
					backgroundColor:'#b35e27',
				}}>
					<Input value={this.state.txtSubsc} placeholder='Email' onChangeText={(txtSubsc)=>{this.setState({txtSubsc});}}
						style={{
							flex:1,
							height:40,
							padding:5,
							margin:0,
							fontSize:12,
							paddingLeft:10,
							paddingRight:10,
							borderWidth:1,
							borderColor:'#b35e27',
							borderRadius:0,
							backgroundColor:'#fff',
						}}
					/>
					<Button onPress={()=>{this._Subsc()}}
						style={{
							height:40,
							padding:0,
							margin:0,
							paddingLeft:10,
							paddingRight:10,
							borderWidth:0,
							borderRadius:0,
							backgroundColor:'#b35e27',
						}}
					>
						<Text style={{fontWeight:'bold',color:'#fff',fontSize:12}}>SUBSCRIBE</Text>
					</Button>
				</View>

				<View style={{flex:1,alignItems:'center',marginTop:25}}>
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
				</View>

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
