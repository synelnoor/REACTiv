import React, { Component } from 'react';
import { Image, View, Text, ScrollView, TouchableHighlight, Alert, Dimensions } from 'react-native';
import { ListItem } from 'native-base';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';

import ComLocalStorage from '../comp/ComLocalStorage';
import Styles from './Comp/Styles';
import Styles2 from './Styles';

// Import komponen buatan sendiri
//import ComReadJWTBody from '../comp/ComAuthorize/ComReadJWTBody';

const multiPressDelay1 = 1000;

export default class SideMenu extends Component {
	constructor(props){
		super(props);

		this.state = {
			dimensions:Dimensions.get('window'),
			data_login:false,
			active1:0,
			foto_profil: null,
		}
	}

	componentDidMount(){
		this.setState({
			dimensions:Dimensions.get('window'),
		});
	}

	_setActive(e){
		this.setState({
			active1:0,
		},()=>{
			if(e === 'goGIKHome'){
				Actions.GIKHome();
			}
		});
	}

	_closeDrawer(){
		const now1 = new Date().getTime();
		if(this.timePress1 && (now1-this.timePress1) < multiPressDelay1){
			delete this.timePress1;
		}
		else{
			// Actions.refresh({key:'GIKdrawer',open:value=>false});
			Actions.drawerClose();
			this.timePress1 = now1;
		}
	}

	getLoginData(){
		let LocalStorage = new ComLocalStorage();
		LocalStorage.getItem((e) => {
			if(
				typeof e.data === 'object' &&
				typeof e.data.user_info === 'string' &&
				JSON.stringify(this.state.data_login) != e.data.user_info
			){
				let user_info_parsed = JSON.parse(e.data.user_info);
				if(typeof user_info_parsed.data.userId === 'string'){
					this.setState({data_login: user_info_parsed});
				}
			}

		});
	}

	getFotoProfil(){
		let LocalStorage = new ComLocalStorage();
		LocalStorage.getItemByKey('@foto_profil:all',(e)=>{
			if(
				e !== null &&
				JSON.stringify(this.state.foto_profil) !== e
			){
				let foto_profil_parsed = JSON.parse(e);
				console.log(foto_profil_parsed);
				if(typeof foto_profil_parsed.profile_thumb === 'string'){
					this.setState({foto_profil: foto_profil_parsed});
				}
			}
		});
	}

	cekUdahLogin(){
		return this.state.data_login !== false;
	}

	logout(){
		Alert.alert(
			'Konfirmasi',
			'Apakah anda yakin untuk keluar ?',
			[
				{
					text:'Setuju',onPress:()=>{
						ComLocalStorage.removeItem('jwt','raw',(e)=>{
							ComLocalStorage.removeItem('jwt','user_info',(e)=>{
								ComLocalStorage.removeItem('temp','kegiatan',()=>{
									let LCMessage = new ComLocalStorage;
									LCMessage.removeMultiple(
									[
										'@jwt:raw',
										'@jwt:user_info',
										'@jik:jikIkaMember',
										'@jik:jikProfil',
										'@jik:jikMessageInbox',
										'@jik:jikMessagemasuk',
										'@jik:jikMessageterkirim',
										'@jik:jikMessagesampah',
										'@jik:JurnalSaya',
										'@jik:catJurnalsaya',
									],
									(callbackGet)=>{ this.setState({data_login:false}); });
									//Actions.refresh({key:'GIKdrawer',open:value=>false});
								});
							});
						});
					}
				},
				{text:'Batal',onPress:()=>{}}
			]
		)
	}

	_renderFotoProfil(){
		let pp = <IonIcon style={Styles.rnSideMenu.loginIco} name='md-person'/>;
		if (this.state.foto_profil !== null) {
			pp = <Image source={{ uri: this.state.foto_profil.profile_picture }} style={{ width: 40, height: 40, borderRadius: 40 }} />
		}
		return pp;
	}

	_renderLogin(){
		if(this.cekUdahLogin()){
			return(
				<TouchableHighlight underlayColor='transparent' style={{flex:1}} onPress={()=>{Actions.refresh({key:'IKdrawer',open:value=>false});setTimeout(()=>{Actions.ChangeProfileRoute()},10);}}>
					<View style={Styles2.rnSideMenu.wrapLogin}>
						<View style={Styles2.rnSideMenu.wrapLoginIco}>
							{this._renderFotoProfil()}
						</View>
						<View style={Styles2.rnSideMenu.wrapLoginText}>
							<Text style={Styles2.rnSideMenu.loginText}>{(this.state.data_login.data.first_name +' '+ this.state.data_login.data.last_name).toUpperCase()}</Text>
						</View>
					</View>
				</TouchableHighlight>
			);
		}
		else{
			return(
				<TouchableHighlight underlayColor='transparent' onPress={()=>{Actions.refresh({key:'GIKdrawer',open:value=>false});setTimeout(()=>{Actions.sign_signup()},10);}} style={{flex:1}}>
					<View style={Styles2.rnSideMenu.wrapLogin}>
						<View style={Styles2.rnSideMenu.wrapLoginIco}>
							<IonIcon style={Styles2.rnSideMenu.loginIco} name='md-person'/>
						</View>
						<View style={Styles2.rnSideMenu.wrapLoginText}>
							<Text style={Styles2.rnSideMenu.loginText}>MASUK / DAFTAR</Text>
						</View>
					</View>
				</TouchableHighlight>
			);
		}
	}

	_renderButtonAfterLogin(){
		if(this.cekUdahLogin()){
			/*
			return(
				<View>
					<View style={{height:20}}/>
					<ListItem style={Styles.nbSideMenu.listitem} onPress={()=>{this.logout();}}>
						<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nbSideMenu.ico} name='ios-power-outline'/></View>
						<Text style={{color:'#502e12'}}>KELUAR</Text>
					</ListItem>
					<View style={{height:20}}/>
				</View>
			);
			*/
			return(
				<View>
					<ListItem style={Styles.nBase.hMC} onPress={()=>{Actions.Reminder()}}>
						<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nBase.hMCIco} name='ios-alarm-outline'/></View>
						<Text style={{color:'#502e12'}}>PENGINGAT</Text>
					</ListItem>
					<View style={{height:20}}/>
					<ListItem style={Styles.nBase.hMC} onPress={()=>{this.logout();}}>
						<View style={{width:50,alignItems:'center'}}>
							<IonIcon name='ios-power-outline' style={Styles.nBase.hMCIco}/>
						</View>
						<Text style={{color:'#502e12'}}>KELUAR</Text>
					</ListItem>
					<View style={{height:20}}/>
				</View>
			);
		}
		else{
			return;
		}
	}

	render(){
		this.getLoginData();
		this.getFotoProfil();
		return(
			<View style={{backgroundColor:'#fff',position:'absolute',top:0,left:0,right:0,bottom:0,}}>
				<View style={Styles2.rnSideMenu.viewHeader}>
					{this._renderLogin()}
					<View style={Styles2.rnSideMenu.wrapIcoClose}>
						<IonIcon onPress={()=>this._closeDrawer()} style={Styles2.rnSideMenu.icoClose} name='ios-close-outline'/>
					</View>
				</View>
				<View style={[Styles.rnSideMenu.viewBody,{flex:1}]}>
					<ScrollView style={{flex:1}}>
						<View style={{height:20}}/>
						<ListItem style={Styles.nBase.hMC} onPress={()=>{this.setState({active1:1},()=>{Actions.GIKStreaming()})}}>
							<View style={{width:50,alignItems:'center'}}>
								<IonIcon name='ios-desktop-outline' style={Styles.nBase.hMCIco}/>
							</View>
							<Text style={[{color:'#502e12'},this.state.active1 === 1 ? {fontWeight:'bold'} : {}]}>LIVE STREAMING</Text>
						</ListItem>
						<View style={{height:20}}/>
						<ListItem style={Styles.nBase.hMC} onPress={()=>{this.setState({active1:2},()=>{Actions.GIKAbout()})}}>
							<View style={{width:50,alignItems:'center'}}>
								<IonIcon name='ios-text-outline' style={Styles.nBase.hMCIco}/>
							</View>
							<Text style={[{color:'#502e12'},this.state.active1 === 2 ? {fontWeight:'bold'} : {}]}>TENTANG KAMI</Text>
						</ListItem>
						<View style={{height:20}}/>
						<ListItem style={Styles.nBase.hMC} onPress={()=>{this.setState({active1:3},()=>{Actions.GIKFacilities()})}}>
							<View style={{width:50,alignItems:'center'}}>
								<IonIcon name='ios-star-outline' style={Styles.nBase.hMCIco}/>
							</View>
							<Text style={[{color:'#502e12'},this.state.active1 === 3 ? {fontWeight:'bold'} : {}]}>FASILITAS</Text>
						</ListItem>
						<View style={{height:20}}/>
						<ListItem style={Styles.nBase.hMC} onPress={()=>{this.setState({active1:4},()=>{Actions.GIKKegiatan()})}}>
							<View style={{width:50,alignItems:'center'}}>
								<IonIcon name='ios-calendar-outline' style={Styles.nBase.hMCIco}/>
							</View>
							<Text style={[{color:'#502e12'},this.state.active1 === 4 ? {fontWeight:'bold'} : {}]}>RESERVASI</Text>
						</ListItem>
						<View style={{height:20}}/>
						<ListItem style={Styles.nBase.hMC} onPress={()=>{this.setState({active1:5},()=>{Actions.GIKArticleList({tbl_reference:'ika_home_highlight'})})}}>
							<View style={{width:50,alignItems:'center'}}>
								<IonIcon name='ios-paper-outline' style={Styles.nBase.hMCIco}/>
							</View>
							<Text style={[{color:'#502e12'},this.state.active1 === 5 ? {fontWeight:'bold'} : {}]}>BERITA</Text>
						</ListItem>
						<View style={{height:20}}/>
						<ListItem style={Styles.nBase.hMC} onPress={()=>{this.setState({active1:6},()=>{Actions.GIKVideoList()})}}>
							<View style={{width:50,alignItems:'center'}}>
								<IonIcon name='ios-videocam-outline' style={Styles.nBase.hMCIco}/>
							</View>
							<Text style={[{color:'#502e12'},this.state.active1 === 6 ? {fontWeight:'bold'} : {}]}>VIDEO</Text>
						</ListItem>
						<View style={{height:20}}/>
						<ListItem style={Styles.nBase.hMC} onPress={()=>{this.setState({active1:7},()=>{Actions.GIKPhotoList()})}}>
							<View style={{width:50,alignItems:'center'}}>
								<IonIcon name='ios-camera-outline' style={Styles.nBase.hMCIco}/>
							</View>
							<Text style={[{color:'#502e12'},this.state.active1 === 7 ? {fontWeight:'bold'} : {}]}>FOTO</Text>
						</ListItem>
						<View style={{height:20}}/>
						<ListItem style={Styles.nBase.hMC} onPress={()=>{this.setState({active1:8},()=>{Actions.GIKContact()})}}>
							<View style={{width:50,alignItems:'center'}}>
								<IonIcon name='ios-call-outline' style={Styles.nBase.hMCIco}/>
							</View>
							<Text style={[{color:'#502e12'},this.state.active1 === 8 ? {fontWeight:'bold'} : {}]}>HUBUNGI KAMI</Text>
						</ListItem>
						<View style={{height:20}}/>
						{this._renderButtonAfterLogin()}
					</ScrollView>
				</View>
			</View>
		);
	}

}
