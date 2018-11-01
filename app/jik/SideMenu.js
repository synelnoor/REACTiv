import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableHighlight,
	Alert,
	Dimensions,
	Image,
	Platform,
	UIManager,
	//LayoutAnimation
} from 'react-native';
import { ListItem } from 'native-base';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';

// Import style
import Styles from './Styles';

// Import komponen buatan sendiri
import ComLocalStorage from '../comp/ComLocalStorage';
//import ComReadJWTBody from '../comp/ComAuthorize/ComReadJWTBody';
import ActionButton from './CompItemList/ActionButton';
const multiPressDelay1 = 1000;

export default class SideMenu extends Component{
	ActionButton = new ActionButton();

	constructor(props){
		super(props);

		this.state = {
			dimensions:Dimensions.get('window'),
			dropdown_jelajah:false,
			dropdown_jendela:false,
			data_login:false,
			countInbox:false,
			foto_profil: null,
		};

		if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}
	}

	componentDidMount(){
		this.setState({
			dimensions:Dimensions.get('window'),
		});
	}

	componentWillMount(){
		this.setCountInbox();
	}

	setCountInbox(){
		this.ActionButton.countInbox(
			(callback)=>{
				let countInbox = false;
				if (callback.countInbox > 0) {
					countInbox = callback.countInbox;
				}
				this.setState({
					countInbox : countInbox,
				});
		})
	}

	_Actions(goto,data){
		let sendData = "";
		switch(goto) {
			case 'jurnalsaya':
				Actions.JIKjurnalSaya()
				break;
			case 'pesan':
				Actions.JIKPesan()
				break;
			case 'profil':
				Actions.JIKProfil()
				break;
			case 'logout':
				Alert.alert(
					'Konfirmasi',
					'Apakah anda yakin untuk keluar ?',
					[
						{
							text:'Setuju',onPress:()=>{
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
									(callbackGet)=>{
										this.setState({data_login:false},()=>{ Actions.JIKHome(); });
									});
							}
						},
						{text:'Batal',onPress:()=>{}}
					]
				)
				break;
			default:
		        return ()=>{ };
		}
	}

	_closeDrawer(){
		const now1 = new Date().getTime();
		if(this.timePress1 && (now1-this.timePress1) < multiPressDelay1){
			delete this.timePress1;
		}
		else{
			this.timePress1 = now1;
			// Actions.refresh({key:'IKdrawer',open:value=>false});
			Actions.drawerClose();
		}
	}

	getLoginData(){
		let LocalStorage = new ComLocalStorage();
		LocalStorage.getItemByKey('@jwt:user_info',(e)=>{
			if(
				e !== null &&
				JSON.stringify(this.state.data_login) !== e
			){
				let user_info_parsed = JSON.parse(e);
				if(typeof user_info_parsed.data.userId === 'string'){
					this.setState({data_login:user_info_parsed});
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
								this.setState({data_login:false});
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
			let stylePP = (Platform.OS === 'android') ? { borderRadius: 40, } : {};
			pp = <View style={{ width: 40, height: 40, borderRadius: 40, overflow:"hidden" }}> 
				<Image source={{ uri: this.state.foto_profil.profile_picture }} style={[{ width: 40, height: 40, },stylePP]} />
				</View>
		}
		return pp;
	}

	countInbox(){
		let data = <View/>
		if (this.state.countInbox) {
				data = <View style={{ position:"absolute", top:0, bottom:0, right:0, left:0, paddingRight:25, alignItems:'flex-end', justifyContent:'center', alignSelf:'center', }}>
						<View style={{ width:18, zIndex:-1, height:18, borderRadius:18, overflow:"hidden", backgroundColor:"#b76329", justifyContent:'center', }}>
							<Text style={{ textAlign:'center', fontSize:10, color:'#fff', }}>{ this.state.countInbox }</Text>
						</View>
					</View>
			}else{
				 data = <View></View>
			}
			return data;
	}

	_renderLogin(){
		if (this.cekUdahLogin()) {
			return(
				<TouchableHighlight underlayColor='transparent' style={{flex:1}}>
					<View style={Styles.rnSideMenu.wrapLogin}>
						<View style={Styles.rnSideMenu.wrapLoginIco}>
							{this._renderFotoProfil()}
						</View>
						<View style={Styles.rnSideMenu.wrapLoginText}>
							<Text style={Styles.rnSideMenu.loginText}>{(this.state.data_login.data.first_name +' '+ this.state.data_login.data.last_name).toUpperCase()}</Text>
						</View>
					</View>
				</TouchableHighlight>
			);
		}
		else {
			return(
				<TouchableHighlight underlayColor='transparent' onPress={()=>{Actions.refresh({key:'JIKdrawer',open:value=>false});setTimeout(()=>{Actions.sign_signup()},10);}} style={{flex:1}}>
					<View style={Styles.rnSideMenu.wrapLogin}>
						<View style={Styles.rnSideMenu.wrapLoginIco}>
							<IonIcon style={Styles.rnSideMenu.loginIco} name='md-person'/>
						</View>
						<View style={Styles.rnSideMenu.wrapLoginText}>
							<Text style={Styles.rnSideMenu.loginText}>MASUK / DAFTAR</Text>
						</View>
					</View>
				</TouchableHighlight>
			);
		}
	}

	_renderLogoutMenu(){
		if (this.cekUdahLogin()) {

			if (this.props.refreshData) {
				this.setCountInbox();
			}

			return(
				<View>
					<View style={{height:20}}/>
					<ListItem iconLeft style={Styles.nbSideMenu.listitem} onPress={ ()=>{ this._Actions("jurnalsaya"); }}>
						<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nbSideMenu.ico} name='ios-compass-outline'/></View>
						<Text style={{color:'#502e12'}}>JURNAL SAYA</Text>
					</ListItem>
					<View style={{height:20}}/>
					<ListItem iconLeft style={Styles.nbSideMenu.listitem} onPress={ ()=>{ this._Actions("pesan"); }}>
						<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nbSideMenu.ico} name='ios-mail-outline'/></View>
						<View>
							<Text style={{color:'#502e12'}}>PESAN PRIBADI</Text>
						</View>
						{ this.countInbox() }
					</ListItem>
					<View style={{height:20}}/>
					<ListItem iconLeft style={Styles.nbSideMenu.listitem} onPress={ ()=>{ this._Actions("profil"); }}>
						<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nbSideMenu.ico} name='ios-person-outline'/></View>
						<Text style={{color:'#502e12'}}>PROFIL</Text>
					</ListItem>
					<View style={{height:20}}/>
					<ListItem iconLeft style={Styles.nbSideMenu.listitem} onPress={ ()=>{ this._Actions("logout"); }}>
						<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nbSideMenu.ico} name='ios-power-outline'/></View>
						<Text style={{color:'#502e12'}}>KELUAR</Text>
					</ListItem>
				</View>
			);
		}
		else {
			return;
		}
	}

	render(){
		this.getLoginData();
		this.getFotoProfil();

		return(
			<View style={{backgroundColor:'#fff',position:'absolute',top:0,left:0,right:0,bottom:0,}}>
				<View style={Styles.rnSideMenu.viewHeader}>
					{this._renderLogin()}
					<View style={Styles.rnSideMenu.wrapIcoClose}>
						<IonIcon onPress={()=>Actions.drawerClose()} style={Styles.rnSideMenu.icoClose} name='ios-close-outline'/>
					</View>
				</View>
				<View style={Styles.rnSideMenu.viewBody}>
					<ScrollView style={{height:Dimensions.get('window').height-75}}>
						{this._renderLogoutMenu()}
					</ScrollView>
				</View>
			</View>
		);
	}
}
