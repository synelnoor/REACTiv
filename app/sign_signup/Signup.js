import React, { Component } from 'react';
import { ScrollView, View, TouchableHighlight, Alert, Dimensions } from 'react-native';
import { Input, Text, Button, Icon, Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';

import ComFetch from '../comp/ComFetch';
import { sso_url_web } from '../comp/AppConfig';

let {height, width} = Dimensions.get('window');

// Import asset gambar
let login_banner_kanan = require('../resource/image/login_banner_kanan.png');
let login_banner_kiri = require('../resource/image/login_banner_kiri.png');
let login_banner_kanan_width = 253;
let login_banner_kanan_height = 125;
let login_banner_kiri_width = 167;
let login_banner_kiri_height = 103;

export default class Signup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reg_email: "",
			reg_telepon: "",
			reg_namaDepan: "",
			reg_namaBelakang: "",
			reg_password: "",
			reg_ulangiPassword: "",
			// reg_syarat: false,
			reg_Loading: false,
		};
	}

	register() {
		// if (!this.state.reg_syarat) {
		// 	Alert.alert('Peringatan', 'Mohon setujui "Syarat & Ketentuan"');
		// 	return;
		// }

		this.setState({reg_Loading: true});

		let postData = new ComFetch();

		postData.setRestURL(sso_url_web);
		postData.setResource('signup?request=json');
		postData.setMethod('POST');
		postData.setHeadersContentType('application/x-www-form-urlencoded');
		postData.setEncodeData("queryString");
		postData.setSendData({
			"client_last_url": "",
			"first_name": this.state.reg_namaDepan,
			"last_name": this.state.reg_namaBelakang,
			"identity": "email",
			"email": this.state.reg_email,
			"phone": this.state.reg_telepon,
			"password": this.state.reg_password,
			"password_confirm": this.state.reg_ulangiPassword,
		});
		postData.sendFetch((resp) => {
			this.setState({reg_Loading: false});

			// console.log(resp);
			if (resp.status != 200) {
				this.notifSSORegister('Peringatan', 'Gagal menyambungkan ke Server,\nHarap coba kembali');
				return;
			}
			if (resp.status == 200 || resp.data.message !== null) {
				if (typeof resp.data.title == 'undefined' || typeof resp.data.identity_column == 'undefined') {
					//this.notifSSORegister('Informasi', this.formatSSOMessageRegister(resp.data.message));
					let email = this.state.reg_email;
					let password = this.state.reg_password;

					this.setState({
						reg_email: '',
						reg_telepon: '',
						reg_namaDepan: '',
						reg_namaBelakang: '',
						reg_password: '',
						reg_ulangiPassword: '',
						//reg_syarat: false,
						reg_Loading: false,
					}, () => {
						Actions.pop({refresh: {
							'email': email,
							'password': password,
						}});
					});
				}
				else {
					this.notifSSORegister('Peringatan', this.formatSSOMessageRegister(resp.data.message));
				}
			}
			else{
				this.notifSSORegister('Peringatan', 'Tidak dapat terhubung ke Server');
			}

		});
	}

	_renderBtnRegister() {
		if (this.state.reg_Loading) {
			return(<Spinner/>);
		}
		else {
			return(<Text>Daftar</Text>);
		}
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

	_renderBtnLogin() {
		if (this.state.reg_Loading) {
			return(<Spinner/>);
		}
		else {
			return(<Text style={{fontSize: 18}}>DAFTAR</Text>);
		}
	}

	render() {
		let cont_text_field_style = { flex: 1, width: width-60, backgroundColor: '#E0E0E0', marginTop: 10, padding: 10 };
		let text_field_style = { padding: ((3/360)*width), flex: 1 };
		let text_field_placeholder_color = '#959595';

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
								<Input keyboardType="email-address" onChangeText={ (teks) => this.setState({ reg_email: teks }) } placeholder="Email*" placeholderTextColor={text_field_placeholder_color} style={text_field_style} />
							</View>
							<View style={ cont_text_field_style }>
								<Input keyboardType="phone-pad" onChangeText={ (teks) => this.setState({ reg_telepon: teks }) } placeholder="Telepon*" placeholderTextColor={text_field_placeholder_color} style={text_field_style} />
							</View>
							<View style={ cont_text_field_style }>
								<Input onChangeText={ (teks) => this.setState({ reg_namaDepan: teks }) } placeholder="Nama Depan*" placeholderTextColor={text_field_placeholder_color} style={text_field_style} />
							</View>
							<View style={ cont_text_field_style }>
								<Input onChangeText={ (teks) => this.setState({ reg_namaBelakang: teks }) } placeholder="Nama Belakang*" placeholderTextColor={text_field_placeholder_color} style={text_field_style} />
							</View>
							<View style={ cont_text_field_style }>
								<Input secureTextEntry={ true } onChangeText={ (teks) => this.setState({ reg_password: teks }) } placeholder="Password*" placeholderTextColor={text_field_placeholder_color} style={text_field_style} />
							</View>
							<View style={ cont_text_field_style }>
								<Input secureTextEntry={ true } onChangeText={ (teks) => this.setState({ reg_ulangiPassword: teks }) } placeholder="Ulangi Password*" placeholderTextColor={text_field_placeholder_color} style={text_field_style} />
							</View>
							<Button block style={{ elevation: 0, marginTop:15, backgroundColor:(this.state.reg_Loading ? '#ccc' : '#8B4513') }} onPress={() => { this.register(); }} disabled={this.state.reg_Loading}>
								{this._renderBtnLogin()}
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
