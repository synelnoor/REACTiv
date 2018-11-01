import React, { Component } from 'react';
import { ScrollView, View, TouchableHighlight, Alert, Dimensions } from 'react-native';
import { Input, Text, Button, Icon, Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { base_url, api_uri, sso_url_web } from '../comp/AppConfig';
import ComFetch from '../comp/ComFetch';
import ComLocalStorage from '../comp/ComLocalStorage';

let {height, width} = Dimensions.get('window');

// Import asset gambar
let login_banner_kanan = require('../resource/image/login_banner_kanan.png');
let login_banner_kiri = require('../resource/image/login_banner_kiri.png');
let login_banner_kanan_width = 253;
let login_banner_kanan_height = 125;
let login_banner_kiri_width = 167;
let login_banner_kiri_height = 103;

export default class ChangeProfile extends Component {
	first_name_ref = '';
	last_name_ref = '';
	phone_ref = '';

	constructor(props) {
		super(props);

		this.state = {
			first_name: "",
			last_name: "",
			phone: "",
			old: "",
			new: "",
			new_confirm: "",
			loadingSubmit: false,
			edited: false,
		};
	}

	getJWTData(cb) {
		let LocalStorage = new ComLocalStorage();
		LocalStorage.getItemByKey('@jwt:raw', (e) => {
			cb(e);
		});
	}

	getLoginData(cb) {
		let LocalStorage = new ComLocalStorage();
		LocalStorage.getItemByKey('@jwt:user_info', (e) => {
			if(e !== null) {
				let user_info_parsed = JSON.parse(e);
				if(typeof user_info_parsed.data.userId === 'string') {
					cb(user_info_parsed);
				}
			}
		});
	}

	updateUserInfoLocalStorage(user_info, cb) {
		ComLocalStorage.setItem('jwt', 'user_info', user_info, (e) => {
			if(e !== null) {
				cb({success: false, message: 'Gagal mengupdate database lokal,\nHarap coba logout kemudian login kembali'});
			}
			cb({success: true, message: 'Success'});
		});
	}

	updateJWTRawLocalStorage(jwt, cb) {
		ComLocalStorage.setItem('jwt', 'raw', jwt, (e) => {
			if(e !== null) {
				cb({success: false, message: 'Gagal mengupdate database lokal,\nHarap coba logout kemudian login kembali'});
			}
			cb({success: true, message: 'Success'});
		});
	}

	renewHashJWT(jwt, cb) {
		let url = base_url + api_uri;
		let renewJWT = new ComFetch();
		renewJWT.setRestURL(url);
		renewJWT.setResource('login/renew');
		renewJWT.setMethod('GET');
		renewJWT.setAuthorization('Bearer ' + jwt);
		renewJWT.sendFetch((resp) => {
			if(resp.status != 200) {
				cb(false);
			}
			if(resp.data.success != 'true') {
				cb(false);
			}
			cb(resp.data.jwt);
		});
	}

	submit() {
		this.setState({loadingSubmit: true});

		this.getJWTData((jwt) => {
			if(jwt !== null) {
				//console.log('current jwt', jwt);

				let postData = new ComFetch();
				postData.setRestURL(sso_url_web);
				postData.setResource('change_profile?request=json');
				postData.setMethod('POST');
				postData.setHeadersContentType('application/x-www-form-urlencoded');
				postData.setAuthorization('Bearer ' + jwt);
				postData.setEncodeData("queryString");
				postData.setSendData({
					"first_name": this.state.first_name,
					"last_name": this.state.last_name,
					"phone": this.state.phone,
					"old": this.state.old,
					"new": this.state.new,
					"new_confirm": this.state.new_confirm,
				});
				postData.sendFetch((resp) => {
					this.setState({loadingSubmit: false});

					// console.log(resp);

					if(resp.status != 200) {
						if(resp.data.message !== null) {
							this.notifSSORegister('Peringatan', resp.data.message);
							return;
						}

						this.notifSSORegister('Peringatan', 'Gagal menyambungkan ke Server,\nHarap coba kembali');
						return;
					}

					if(resp.status == 200 || resp.data.message !== null) {
						if(typeof resp.data.pass_change != 'undefined' && resp.data.pass_change == 'false') {
							this.notifSSORegister('Peringatan', 'Password Anda gagal di rubah');
							return;
						}

						this.renewHashJWT(jwt, (new_jwt) => {
							//console.log('new jwt', new_jwt);

							if(new_jwt != false) {
								this.getLoginData((currentUserInfo) => {
									let updateUserInfo = currentUserInfo;
									updateUserInfo.data.first_name = this.state.first_name;
									updateUserInfo.data.last_name = this.state.last_name;
									updateUserInfo.data.phone = this.state.phone;
									this.updateJWTRawLocalStorage(JSON.stringify(new_jwt), (e) => {
										if(!e.success) {
											this.notifSSORegister('Peringatan', e.message);
											return;
										}

										this.updateUserInfoLocalStorage(JSON.stringify(updateUserInfo), (e) => {
											// this.getLoginData((c) => {console.log('Hasil Update UserInfo', c);});
											if(!e.success) {
												this.notifSSORegister('Peringatan', e.message);
											}
										});
									});
								});

								this.notifSSORegister('Peringatan', this.formatSSOMessageRegister(resp.data.message));
								return;
							}
							else {
								this.notifSSORegister('Peringatan', 'Tidak dapat terhubung ke Server mohon logout dan login kembali');
								return;
							}
						});
					}
					else{
						this.notifSSORegister('Peringatan', 'Tidak dapat terhubung ke Server');
						return;
					}
				});
			}
			else {
				this.notifSSORegister('Peringatan', 'Mohon login terlebih dahulu');
				this.setState({loadingSubmit: false});
			}
		});
	}

	componentDidMount(){
		//
	}

	formatSSOMessageRegister(teks) {
		if (typeof teks == 'string') {
			return teks.replace(/\<p\>|\<\/p\>/g, '');
		}
		return false;
	}

	notifSSORegister(title, isi) {
		Alert.alert(title, isi);
	}

	_renderBtnSubmit() {
		if(this.state.loadingSubmit) {
			return(<Spinner/>);
		}
		else {
			return(<Text style={{fontSize: 18}}>GANTI PROFIL</Text>);
		}
	}

	render() {
        let cont_text_field_style = { flex: 1, width: width-60, backgroundColor: '#E0E0E0', marginTop: 10, padding: 10 };
        let text_field_style = { padding: ((3/360)*width), flex: 1 };
        let text_field_placeholder_color = '#959595';
		let currentUserInfo = {first_name: this.state.first_name, last_name: this.state.last_name, phone: this.state.phone};

		if(!this.state.edited) {
			this.getLoginData((currentUserInfo) => {
				this.setState({
					first_name: currentUserInfo.data.first_name,
					last_name: currentUserInfo.data.last_name,
					phone: currentUserInfo.data.phone,
					edited: true,
				});
			});
		}

		{/*<Item style={{ alignItems:'center', borderBottomWidth:0,  }}>
		 	<TouchableOpacity style={{ padding:15, flexDirection: 'row' }} onPress={() => this.setState({reg_syarat: !this.state.syarat})}>
		 		<View style={{flexDirection: 'column', alignSelf: 'center'}}>
		 			<CheckBox style={{alignItems: 'center', marginLeft: -10, marginRight: 10}} checked={this.state.syarat} />
		 		</View>
		 		<View style={{flex: 10}}>
		 			<Text style={{ textAlign:'center', }}>Dengan mendaftar berarti Anda menyetujui Syarat & Ketentuan Kami</Text>
		 		</View>
		 	</TouchableOpacity>
		</Item>*/}

		{/*<View style={{ flex: 1, flexDirection: 'row', position: 'absolute', zIndex: 0 }}>
			<View style={{ flex: 1, alignItems: 'flex-start' }}>
				<Image source={login_banner_kiri} style={{ width: ((width)/2.8), height: ((login_banner_kiri_height / login_banner_kiri_width) * (width)/2.8) }} resizeMode='contain' />
			</View>
			<View style={{ flex: 1, alignItems: 'flex-end' }}>
				<Image source={login_banner_kanan} style={{ width: (width/2), height: ((login_banner_kiri_height / login_banner_kiri_width) * (width)/2.5) }} resizeMode='contain' />
			</View>
		</View>*/}

		return (
			<View style={{ flex:1, alignItems:'center', justifyContent: 'center', backgroundColor: '#EAEAEA' }}>
				<View style={{ width: width, backgroundColor: '#8B4513', position: 'absolute', height: 7, top: 0 }}></View>

				<View style={{ alignSelf: 'stretch', flex: 1, marginTop: 20 }}>
					<ScrollView>
						<View style={{ height: height-((100/592)*height), justifyContent: 'center', alignItems: 'center', padding: 30, marginTop: 30, flexDirection: 'column' }}>
							<View style={ cont_text_field_style }>
								<Input
									ref={(ref) => this.first_name_ref = ref}
									onChangeText={ (teks) => this.setState({ first_name: teks }) }
									placeholder="Nama Depan*"
									placeholderTextColor={text_field_placeholder_color}
									style={text_field_style}
									value={currentUserInfo.first_name}
								/>
							</View>
							<View style={ cont_text_field_style }>
								<Input
									ref={(ref) => this.last_name_ref = ref}
									onChangeText={ (teks) => this.setState({ last_name: teks }) }
									placeholder="Nama Belakang*"
									placeholderTextColor={text_field_placeholder_color}
									style={text_field_style}
									value={currentUserInfo.last_name}
								/>
							</View>
							<View style={ cont_text_field_style }>
								<Input
									ref={(ref) => this.phone_ref = ref}
									keyboardType="phone-pad"
									onChangeText={ (teks) => this.setState({ phone: teks }) }
									placeholder="Telepon*"
									placeholderTextColor={text_field_placeholder_color}
									style={text_field_style}
									value={currentUserInfo.phone}
								/>
							</View>
							<View style={ cont_text_field_style }>
								<Input
									secureTextEntry={ true }
									onChangeText={ (teks) => this.setState({ old: teks }) }
									placeholder="Password Lama*"
									placeholderTextColor={text_field_placeholder_color}
									style={text_field_style}
								/>
							</View>
							<View style={ cont_text_field_style }>
								<Input
									secureTextEntry={ true }
									onChangeText={ (teks) => this.setState({ new: teks }) }
									placeholder="Password Baru*"
									placeholderTextColor={text_field_placeholder_color}
									style={text_field_style} />
							</View>
							<View style={ cont_text_field_style }>
								<Input
									secureTextEntry={ true }
									onChangeText={ (teks) => this.setState({ new_confirm: teks }) }
									placeholder="Ulangi Password*"
									placeholderTextColor={text_field_placeholder_color}
									style={text_field_style}
								/>
							</View>
							<Button
								block
								style={{ elevation: 0, marginTop:15, backgroundColor:(this.state.loadingSubmit ? '#ccc' : '#8B4513') }}
								onPress={() => { this.submit(); }}
								disabled={this.state.loadingSubmit}
							>
								{this._renderBtnSubmit()}
							</Button>
							<TouchableHighlight style={ [cont_text_field_style, { backgroundColor: 'transparent', paddingLeft: 3, marginLeft: 0 }] } onPress={() => Actions.pop()}>
								{/*<TouchableHighlight onPress={() => Actions.pop()}>*/}
									<View style={{ flex: 1, alignItems: 'flex-start', paddingLeft: 0, flexDirection: 'row' }}>
										<Icon name="md-arrow-back" style={{ fontSize: 18, color: '#B45F28' }} />
										<Text style={{color: '#B45F28'}}> Kembali</Text>
									</View>
								{/*</TouchableHighlight>*/}
							</TouchableHighlight>
						</View>
					</ScrollView>
				</View>
			</View>
		);
	}
}
