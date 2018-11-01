import React, { Component } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableHighlight,
	Alert,
	Dimensions,
	Image
} from 'react-native';
import { ListItem } from 'native-base';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';

import ComLocalStorage from '../comp/ComLocalStorage';
import Styles from './Styles';

// Import komponen buatan sendiri
//import ComReadJWTBody from '../comp/ComAuthorize/ComReadJWTBody';

const multiPressDelay1 = 1000;
const multiPressDelay2 = 500;
const multiPressDelay3 = 500;

export default class SideMenu extends Component {

	constructor(props) {
		super(props);

		this.state = {
			dimensions: Dimensions.get('window'),
			dropdown_jelajah: false,
			dropdown_jendela: false,
			data_login: false,
			active1: 0,
			active2: 0,
			foto_profil: null,
		}

		/*if(Platform.OS === 'android') {
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	componentDidMount() {
		this.setState({
			dimensions: Dimensions.get('window'),
		});
	}

	_setActive(a1,a2) {
		let x1 = typeof a1 === 'undefined' ? 0 : a1;
		let x2 = typeof a2 === 'undefined' ? 0 : a2;

		if(
			this.state.active1 !== x1 ||
			this.state.active2 !== x2
		) {
			this.setState({
				active1: x1,
				active2: x2,
			});
		}
	}

	_closeDrawer() {
		const now1 = new Date().getTime();

		if(this.timePress1 && (now1-this.timePress1) < multiPressDelay1) {
			delete this.timePress1;
		}
		else {	
			// Actions.refresh({key: 'IKdrawer', open: value => false});
			Actions.drawerClose();
			this.timePress1 = now1;
		}
	}

	getLoginData() {
		let LocalStorage = new ComLocalStorage();
		LocalStorage.getItemByKey('@jwt:user_info', (e) => {
			if(
				e !== null &&
				JSON.stringify(this.state.data_login) !== e
			) {
				let user_info_parsed = JSON.parse(e);

				if(typeof user_info_parsed.data.userId === 'string') {
					this.setState({data_login:user_info_parsed});
				}
			}
		});
	}

	getFotoProfil() {
		let LocalStorage = new ComLocalStorage();

		LocalStorage.getItemByKey('@foto_profil:all', (e) => {
			if(
				e !== null &&
				JSON.stringify(this.state.foto_profil) !== e
			) {
				let foto_profil_parsed = JSON.parse(e);
				if(typeof foto_profil_parsed.profile_thumb === 'string') {
					this.setState({foto_profil:foto_profil_parsed});
				}
			}
		});
	}

	cekUdahLogin() {
		return this.state.data_login !== false;
	}

	logout() {
		Alert.alert(
			'Konfirmasi',
			'Apakah anda yakin untuk keluar ?',
			[
				{
					text: 'Setuju', onPress: () => {
						ComLocalStorage.removeItem('jwt', 'raw', (e) => {
							ComLocalStorage.removeItem('jwt', 'user_info', (e) => {
								ComLocalStorage.removeItem('temp', 'kegiatan', () => {
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
										], (callbackGet) => { this.setState({data_login:false}) }
									);

									//Actions.refresh({key:'IKdrawer',open:value=>false});
								});
							});
						});
					}
				},
				{text: 'Batal', onPress: () => {}}
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
		else{
			return(
				<TouchableHighlight underlayColor='transparent' onPress={()=>{Actions.refresh({key:'IKdrawer',open:value=>false});setTimeout(()=>{Actions.sign_signup()},10);}} style={{flex:1}}>
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

	_renderButtonAfterLogin(){
		if(this.cekUdahLogin()){
			return(
				<View>
					<ListItem style={Styles.nbSideMenu.listitem} onPress={()=>Actions.Reminder()}>
						<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nbSideMenu.ico} name='ios-alarm-outline'/></View>
						<Text style={{color:'#502e12'}}>PENGINGAT</Text>
					</ListItem>
					<View style={{height:20}}/>
					<ListItem style={Styles.nbSideMenu.listitem} onPress={()=>{this.logout();}}>
						<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nbSideMenu.ico} name='ios-power-outline'/></View>
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

	_chevron(action,type){
		if(type === 'dropdown_jelajah'){
			const now2 = new Date().getTime();
			if(this.timePress2 && (now2-this.timePress2) < multiPressDelay2){
				delete this.timePress2;
			}
			else{
				if(action === 'up'){
					//LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
				}
				else{
					//LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
				}
				this.setState({
					dropdown_jelajah:!this.state.dropdown_jelajah
				});
				this.timePress2 = now2;
			}
		}
		else{
			const now3 = new Date().getTime();
			if(this.timePress3 && (now3-this.timePress3) < multiPressDelay3){
				delete this.timePress3;
			}
			else{
				if(action === 'up'){
					//LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
				}
				else{
					//LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
				}
				this.setState({
					dropdown_jendela:!this.state.dropdown_jendela
				});
				this.timePress3 = now3;
			}
		}
	}

	_dropdown_jelajah(a){
		if(this.state.dropdown_jelajah){
			if(a === 'menu'){
				return(
				<View>
					<View style={{height:10}}/>
					<ListItem style={Styles.nbSideMenu.subListItem} onPress={()=>{Actions.IKArticleList({cat_id:1,tbl_reference:'ika_home_highlight',page_name:{n1:'Jelajah',n2:'Kesenian',n3:'Indonesia'}})}}>
						<Text style={this.state.active1 === 1 && this.state.active2 === 1 ? {fontWeight:'bold'} : {}}>Kesenian</Text>
					</ListItem>
					<View style={{height:10}}/>
					<ListItem style={Styles.nbSideMenu.subListItem} onPress={()=>{Actions.IKArticleList({cat_id:2,tbl_reference:'ika_home_highlight',page_name:{n1:'Jelajah',n2:'Tradisi',n3:'Indonesia'}})}}>
						<Text style={this.state.active1 === 1 && this.state.active2 === 2 ? {fontWeight:'bold'} : {}}>Tradisi</Text>
					</ListItem>
					<View style={{height:10}}/>
					<ListItem style={Styles.nbSideMenu.subListItem} onPress={()=>{Actions.IKArticleList({cat_id:3,tbl_reference:'ika_home_highlight',page_name:{n1:'Jelajah',n2:'Pariwisata',n3:'Indonesia'}})}}>
						<Text style={this.state.active1 === 1 && this.state.active2 === 3 ? {fontWeight:'bold'} : {}}>Pariwisata</Text>
					</ListItem>
					<View style={{height:10}}/>
					<ListItem style={Styles.nbSideMenu.subListItem} onPress={()=>{Actions.IKArticleList({cat_id:4,tbl_reference:'ika_home_highlight',page_name:{n1:'Jelajah',n2:'Kuliner',n3:'Indonesia'}})}}>
						<Text style={this.state.active1 === 1 && this.state.active2 === 4 ? {fontWeight:'bold'} : {}}>Kuliner</Text>
					</ListItem>
					<View style={{height:10}}/>
					<ListItem style={Styles.nbSideMenu.subListItem} onPress={()=>{Actions.IKArticleMap({page_name:{n1:'Jelajah',n2:'Indonesia'}})}}>
						<Text style={this.state.active1 === 1 && this.state.active2 === 5 ? {fontWeight:'bold'} : {}}>Provinsi</Text>
					</ListItem>
				</View>
				);
			}
			else if(a === 'ico'){
				return(<TouchableHighlight underlayColor='#fff' style={Styles.nbSideMenu.icoDropdown} onPress={()=>{this._chevron('up','dropdown_jelajah')}}><IonIcon style={{color:'#aaa',fontSize:20}} name='ios-arrow-up-outline'/></TouchableHighlight>);
			}
		}
		else if(!this.state.dropdown_jelajah && a === 'ico'){
			return(<TouchableHighlight underlayColor='#fff' style={Styles.nbSideMenu.icoDropdown} onPress={()=>{this._chevron('down','dropdown_jelajah')}}><IonIcon style={{color:'#aaa',fontSize:20}} name='ios-arrow-down-outline'/></TouchableHighlight>);
		}
	}

	_dropdown_jendela(a){
		if(this.state.dropdown_jendela){
			if(a === 'menu'){
				return(
				<View>
					<View style={{height:10}}/>
					<ListItem style={Styles.nbSideMenu.subListItem} onPress={()=>{Actions.IKArticleList({cat_id:5,tbl_reference:'ika_home_highlight',page_name:{n1:'Jendela Indonesia'},page_subname:'Tokoh'})}}>
						<Text style={this.state.active1 === 2 && this.state.active2 === 1 ? {fontWeight:'bold'} : {}}>Tokoh</Text>
					</ListItem>
					<View style={{height:10}}/>
					<ListItem style={Styles.nbSideMenu.subListItem} onPress={()=>{Actions.IKArticleList({cat_id:10,tbl_reference:'ika_home_highlight',page_name:{n1:'Jendela Indonesia'},page_subname:'Pojok Editorial'})}}>
						<Text style={this.state.active1 === 2 && this.state.active2 === 2 ? {fontWeight:'bold'} : {}}>Pojok Editorial</Text>
					</ListItem>
					<View style={{height:10}}/>
					<ListItem style={Styles.nbSideMenu.subListItem} onPress={()=>{Actions.IKArticleList({cat_id:6,tbl_reference:'ika_home_highlight',page_name:{n1:'Jendela Indonesia'},page_subname:'Agenda Budaya'})}}>
						<Text style={this.state.active1 === 2 && this.state.active2 === 3 ? {fontWeight:'bold'} : {}}>Agenda Budaya</Text>
					</ListItem>
					<View style={{height:10}}/>
					<ListItem style={Styles.nbSideMenu.subListItem} onPress={()=>{Actions.IKArticleList({cat_id:7,tbl_reference:'ika_home_highlight',page_name:{n1:'Jendela Indonesia'},page_subname:'Liputan Budaya'})}}>
						<Text style={this.state.active1 === 2 && this.state.active2 === 4 ? {fontWeight:'bold'} : {}}>Liputan Budaya</Text>
					</ListItem>
				</View>
				);
			}
			else if(a === 'ico'){
				return(<TouchableHighlight underlayColor='#fff' style={Styles.nbSideMenu.icoDropdown} onPress={()=>{this._chevron('up','dropdown_jendela')}}><IonIcon style={{color:'#aaa',fontSize:20}} name='ios-arrow-up-outline'/></TouchableHighlight>);
			}
		}
		else if(!this.state.dropdown_jendela && a === 'ico'){
			return(<TouchableHighlight underlayColor='#fff' style={Styles.nbSideMenu.icoDropdown} onPress={()=>{this._chevron('down','dropdown_jendela')}}><IonIcon style={{color:'#aaa',fontSize:20}} name='ios-arrow-down-outline'/></TouchableHighlight>);
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
						<IonIcon onPress={()=>this._closeDrawer()} style={Styles.rnSideMenu.icoClose} name='ios-close-outline'/>
					</View>
				</View>
				<View style={[Styles.rnSideMenu.viewBody,{flex:1}]}>
					<ScrollView style={{flex:1}}>
						<View style={{height:20}}/>
						<ListItem style={Styles.nbSideMenu.listitem} onPress={()=>{Actions.IKArticleMap({page_name:{n1:'Jelajah',n2:'Indonesia'}})}}>
							<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nbSideMenu.ico} name='ios-pin-outline'/></View>
							<Text style={[{color:'#502e12'},this.state.active1 === 1 ? {fontWeight:'bold'} : {}]}>JELAJAH INDONESIA</Text>
							{this._dropdown_jelajah('ico')}
						</ListItem>
						{this._dropdown_jelajah('menu')}
						<View style={{height:20}}/>
						<ListItem style={Styles.nbSideMenu.listitem} onPress={()=>{Actions.IKArticleList({tbl_reference:'jdi_jenesia',page_name:{n1:'Jendela Indonesia'}})}}>
							<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nbSideMenu.ico} name='ios-browsers-outline'/></View>
							<Text style={[{color:'#502e12'},this.state.active1 === 2 ? {fontWeight:'bold'} : {}]}>JENDELA INDONESIA</Text>
							{this._dropdown_jendela('ico')}
						</ListItem>
						{this._dropdown_jendela('menu')}
						<View style={{height:20}}/>
						<ListItem style={Styles.nbSideMenu.listitem} onPress={()=>{Actions.IKTv()}}>
							<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nbSideMenu.ico} name='ios-play-outline'/></View>
							<Text style={[{color:'#502e12'},this.state.active1 === 3 ? {fontWeight:'bold'} : {}]}>INDONESIA KAYA TV</Text>
						</ListItem>
						<View style={{height:20}}/>
						<ListItem style={Styles.nbSideMenu.listitem} onPress={()=>{Actions.IKVideoList()}}>
							<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nbSideMenu.ico} name='ios-videocam-outline'/></View>
							<Text style={[{color:'#502e12'},this.state.active1 === 4 ? {fontWeight:'bold'} : {}]}>VIDEO</Text>
						</ListItem>
						<View style={{height:20}}/>
						<ListItem style={Styles.nbSideMenu.listitem} onPress={()=>{Actions.IKPhotoList()}}>
							<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nbSideMenu.ico} name='ios-camera-outline'/></View>
							<Text style={[{color:'#502e12'},this.state.active1 === 5 ? {fontWeight:'bold'} : {}]}>FOTO</Text>
						</ListItem>
						<View style={{height:20}}/>
						<ListItem style={Styles.nbSideMenu.listitem} onPress={()=>{Actions.IKKegiatan()}}>
							<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nbSideMenu.ico} name='ios-list-box-outline'/></View>
							<Text style={[{color:'#502e12'},this.state.active1 === 6 ? {fontWeight:'bold'} : {}]}>KEGIATAN</Text>
						</ListItem>
						<View style={{height:20}}/>
						<ListItem style={Styles.nbSideMenu.listitem} onPress={()=>{Actions.IKInfo({open_tab:{'TENTANG KAMI':true}})}}>
							<View style={{width:50,alignItems:'center'}}><IonIcon style={Styles.nbSideMenu.ico} name='ios-information-circle-outline'/></View>
							<Text style={[{color:'#502e12'},this.state.active1 === 7 ? {fontWeight:'bold'} : {}]}>INFO</Text>
						</ListItem>
						<View style={{height:20}}/>
						{this._renderButtonAfterLogin()}
					</ScrollView>
				</View>
			</View>
		);
	}
}
