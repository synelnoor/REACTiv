import React, { Component } from 'react';
import { View, Alert, Dimensions, TouchableHighlight, TextInput } from 'react-native';
import { Text, Button, Icon, Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';

// Import komponen buatan
import ComFetch from '../comp/ComFetch';

// Import konfigurasi
import { sso_url_web } from '../comp/AppConfig';

let {height, width} = Dimensions.get('window');

// Import asset gambar
let login_banner_kanan = require('../resource/image/login_banner_kanan.png');
let login_banner_kiri = require('../resource/image/login_banner_kiri.png');
let login_banner_kanan_width = 253;
let login_banner_kanan_height = 125;
let login_banner_kiri_width = 167;
let login_banner_kiri_height = 103;

export default class ForgotPassword extends Component {
	email_ref = null;

	constructor(props) {
        super(props);

        this.state = {
            email: "",
			submitLoading: false,
        }
    }

    componentDidMount() {
		//Actions.refresh({key:'Gikdrawer',open:value=>false});
		//Actions.refresh({key:'IKdrawer',open:value=>false});
		//this.resetLoginForm();
    }

	forgotPassword() {
		this.setState({submitLoading: true});

		let submit = new ComFetch();
		submit.setRestURL(sso_url_web);
		submit.setResource('forgot_password?request=json');
		submit.setMethod('POST');
		submit.setHeadersContentType('application/x-www-form-urlencoded');
		submit.setEncodeData("queryString");
		submit.setSendData({ 'identity': this.state.email });
		// submit.setSendData({username: 'riko@redbuzz.co.id'});
		submit.sendFetch((respData) => {
			console.log(respData);

			this.setState({submitLoading: false});

			if (respData.status != 200) {
				this.notifSSOSubmit('Peringatan','Gagal menyambungkan ke Server,\nHarap coba kembali');
				this.resetLoginForm();
				return;
			}

			if (respData.status == 200 && respData.data.error != '') {
				this.notifSSOSubmit('Peringatan',this.formatSSOMessageRegister(respData.data.error));
				this.resetLoginForm();
				return;
			}

			this.notifSSOSubmit('Informasi',this.formatSSOMessageRegister(respData.data.message));
		});
	}

	formatSSOMessageRegister(teks) {
		if (typeof teks == 'string') {
			return teks.replace(/\<p\>|\<\/p\>/g, '');
		}
		return false;
	}

	notifSSOSubmit(title, isi) {
		Alert.alert(title, isi);
	}

	resetLoginForm() {
		if (this.email_ref != null && this.password_ref != null) {
			this.email_ref.value = '';
			this.setState({email: ''});
		}
	}

	_renderBtnLogin() {
		if (this.state.submitLoading) {
			return(<Spinner/>);
		}
		else {
			return(<Text style={{fontSize: 18}}>SUBMIT</Text>);
		}
	}

	render() {
		{/*<View style={{ flex: 1, flexDirection: 'row', position: 'absolute', zIndex: 100 }}>
			<View style={{ flex: 1, alignItems: 'flex-start' }}>
				<Image source={login_banner_kiri} style={{ width: ((width)/2.8), height: ((login_banner_kiri_height / login_banner_kiri_width) * (width)/2.8) }} resizeMode='contain' />
			</View>
			<View style={{ flex: 1, alignItems: 'flex-end' }}>
				<Image source={login_banner_kanan} style={{ width: (width/2), height: ((login_banner_kiri_height / login_banner_kiri_width) * (width)/2.5) }} resizeMode='contain' />
			</View>
		</View>*/}

		return (
			<View style={{ flex: 1, backgroundColor:'#EAEAEA', justifyContent: 'center' }}>
				<View style={{ backgroundColor: '#8B4513', height: 7, position: 'absolute', top: 0, width: width }}></View>

				{/*<View style={{ alignItems: 'center' }}>*/}
					<View style={{ alignItems: 'stretch', padding: 30 }}>
						<View style={{ marginTop:0, backgroundColor: '#E0E0E0', flexDirection: 'row'}}>
							<View style={{ backgroundColor: 'white', alignItems: 'center', width: ((60/360)*width) }}>
								<Icon name="ios-mail-outline" style={{color: '#B35E28', fontSize: ((33/360)*width),textAlign: 'center'}} />
							</View>
							<TextInput
								ref={(ref) => this.email_ref = ref}
								underlineColorAndroid='transparent'
								onChangeText={(email) => { this.setState({email}); }}
								keyboardType="email-address"
								placeholder="Email"
								placeholderTextColor='#959595'
								style={{flex: 1, fontSize: 18, padding: 8}}
							/>
						</View>
						<Button
							block
							style={{ marginTop:((50/592)*height), backgroundColor:(this.state.submitLoading ? '#ccc' : '#8B4513'), elevation: 0 }}
							onPress={() => this.forgotPassword()}
							disabled={this.state.submitLoading}
						>
							{this._renderBtnLogin()}
						</Button>
						<TouchableHighlight style={{ flexDirection: 'row', marginTop: ((40/592)*height) }} onPress={() => Actions.pop()}>
                            {/*<TouchableHighlight onPress={() => Actions.pop()} style={{ flex: 1 }}>*/}
								<View style={{ alignItems: 'flex-start', paddingLeft: 5, flexDirection: 'row' }}>
									<Icon name="md-arrow-back" style={{ fontSize: 18, color: '#B45F28' }} />
									<Text style={{color: '#B45F28'}}> Kembali</Text>
								</View>
							{/*</TouchableHighlight>*/}
						</TouchableHighlight>
					</View>
				{/*</View>*/}
			</View>
		);
	}
}
