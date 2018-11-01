import React, { Component } from 'react';
import { View, TouchableHighlight, Alert, Dimensions, TextInput } from 'react-native';
import { Text, Button, Icon, Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';

import Service from '../comp/Service';
import ComAuthorize from '../comp/ComAuthorize';
import ComLocalStorage from '../comp/ComLocalStorage';
import ComReadJWTBody from '../comp/ComAuthorize/ComReadJWTBody';
import ComFetch from '../comp/ComFetch';
import { base_url, api_uri, imgThumb, } from '../comp/AppConfig';
import ArrayToQueryString from '../comp/ArrayToQueryString';
import Auth from '../game/js/gamify/auth'
import history from '../game/js/gamify/history'

let {height, width} = Dimensions.get('window');

// Import asset gambar
let login_banner_kanan = require('../resource/image/login_banner_kanan.png');
let login_banner_kiri = require('../resource/image/login_banner_kiri.png');
let login_banner_kanan_width = 253;
let login_banner_kanan_height = 125;
let login_banner_kiri_width = 167;
let login_banner_kiri_height = 103;

export default class Signin extends Component {
	email_ref = null;
	password_ref = null;
	jwt_signature = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0OTYxMjYwODksImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoid3d3LmluZG9uZXNpYWtheWEuY29tIiwibmJmIjoxNDk2MTI2MDkxLCJleHAiOjE0OTYxMjY5ODksImRhdGEiOnsidXNlck5hbWUiOiJkYW5kaUByZWRidXp6LmNvLmlkIiwidXNlcklkIjoiMzIiLCJmaXJzdF9uYW1lIjoiZGFuZGkiLCJsYXN0X25hbWUiOiJzZXRpeWF3YW4iLCJwaG9uZSI6IjEyMzQ1Njc4In19.bd8dde3f84b6a77020d1e8fff16bcc1580661e4b03e65594d1f7b11f4984ce69';

	constructor(props) {
        super(props);

        this.state = {
            email: "",
			password: "",
			loginLoading: false,
        }
    }

    async componentDidMount() {
		//const Auth = await Auth.login();
		//Actions.refresh({key:'Gikdrawer',open:value=>false});
		//Actions.refresh({key:'IKdrawer',open:value=>false});
		//this.resetLoginForm();
    }

	componentWillReceiveProps(q) {
		if (
			typeof q.email !== 'undefined' &&
			typeof q.password !== 'undefined' &&
			q.email !== '' &&
			q.password !== ''
		) {
			this.setState({
				email: q.email,
				password: q.password,
			});
		}
	}

	getIkaJikMemberDetail(userId, jwt_signature, cb) {
		let Param = {};
		Param['join'] = 'ikaMemberProfile';
		Param['where'] = 'email:' + userId;
		let resource = api_uri+'JSON/JikMember?' + ArrayToQueryString(Param);
		let IKComFetch = new ComFetch();
		IKComFetch.setHeaders({ Authorization: jwt_signature });
		IKComFetch.setRestURL(base_url);
		// Ambil data Article
		IKComFetch.setResource(resource);
		IKComFetch.sendFetch((resp) => {
			// console.log('getIkaJikMember', resp);
			if (resp.status == 200) {
				let jikMember = resp.data;
				// console.log(jikMember.data[0].ika_member_profile);
				if (jikMember.count > 0 && jikMember.data[0].ika_member_profile.count > 0) {
					cb(jikMember);
				}
				else {
					cb(false);
				}
			}
		});
	}

	login() {
		this.setState({loginLoading: true});
		let authorize = new ComAuthorize();
		authorize.setLoginData({username: this.state.email, password: this.state.password});
		// authorize.setLoginData({username: 'riko@redbuzz.co.id', password: 'redbuzz'});
		authorize.check((respData) => {
			// console.log(respData);

			this.setState({loginLoading: false});

			if (respData.status == 401) {
				Alert.alert('Peringatan','Email atau Password anda salah');
				return;
			}
			if (respData.status != 200 || typeof respData.data.error != 'undefined') {
				Alert.alert('Peringatan','Gagal menghubungkan ke server \n\nMohon periksa Internet Anda dan coba lagi');
				//this.resetLoginForm();
				return;
			}

			let user_info = ComReadJWTBody(respData.data.jwt);
			if (!user_info) {
				Alert.alert('Error','Token tidak valid,\nHarap coba kembali');
				return;
			}

			// Ambil gambar foto profil
			this.getIkaJikMemberDetail(this.state.email, this.jwt_signature, (jikMember) => {
				let default_img_path = 'https://www.indonesiakaya.com/glide/image/';
				let default_query_string_setting_pp = '?w=200&crop=354,354,284,170&dir=_images_member';
				let default_query_string_setting_cover = '?w=1920&crop=354,118,9,228&dir=_images_member';
				if (jikMember !== false) {
					let ika_data = jikMember.data[0].ika_member_profile.data;
					this.saveFotoProfil({
						profile_image: default_img_path + ika_data.profile_image + default_query_string_setting_pp,
						profile_picture: default_img_path + ika_data.profile_picture + default_query_string_setting_pp,
						profile_thumb: default_img_path + ika_data.profile_thumb + default_query_string_setting_pp,
						profile_cover: default_img_path + ika_data.profile_cover + default_query_string_setting_cover,
						profile_cover_image: default_img_path + ika_data.profile_cover_image + default_query_string_setting_pp,
					}, (e) => {
						if (e) {
							this.saveJWT(respData.data.jwt, user_info);
							// this.saveJWT(respData.data.jwt);
						}
					});
				}
				else {
					this.saveJWT(respData.data.jwt, user_info);
					// this.saveJWT(respData.data.jwt);
				}
			});
		});
	}

	saveFotoProfil(profil, cb) {
		ComLocalStorage.setItem( "foto_profil", "all", JSON.stringify(profil), (e) => {
				cb(true);
			}
		);
	}

	resetLoginForm() {
		if (this.email_ref != null && this.password_ref != null) {
			this.email_ref.value = '';
			this.password_ref.value = '';
			this.setState({email: '', password: ''});
		}
	}

	saveJWT(resource, user_info){
		ComLocalStorage.setItem('jwt', 'raw', resource, (e) => {
			if (e !== null) {
				Alert.alert('Error','Gagal menyimpan token,\nHarap coba kembali');
				return false;
			}

			let resource_parsed_stringify = JSON.stringify(user_info);

			ComLocalStorage.setItem('jwt', 'user_info', resource_parsed_stringify, (e) => {
				if (e !== null) {
					Alert.alert('Error','Gagal menyimpan token,\nHarap coba kembali');
					return false;
				}

				Alert.alert('Informasi','Selamat datang,\n\n'+user_info.data.first_name+' '+user_info.data.last_name);

				setTimeout(() => {
					Service._rebuildKegiatan();
					/* set local jik member*/
					let JIKemail = user_info.data.userName;
					this._getIkaJikMember(JIKemail);
					/* set local jik member*/
					console.log('user_ifo',user_info.data.userId)
					
					if(typeof this.props.to !== 'undefined') {
						let Post = {
							created_by:user_info.data.userId,
							related_category_id:'',
							related_id:''
						}
						history.set(Post,(res) => {
							// Actions.pop()
							Actions.game();
							
						});
						
					}else{
						Actions.pop();
					}
				},2000);
			});
		});
	}

	_getIkaJikMember(email) {
		let first_name = "";
		let mid_name = "";
		let last_name = "";
		let Param = {};
		Param['join'] = 'ikaMember,ikaMemberProfile';
		Param['where'] = 'email:' + email;
		let resource = api_uri+'JSON/JikMember?' + ArrayToQueryString(Param);
		let IKComFetch = new ComFetch();
		let thumbme = "no-profil-pict-big.jpg";

		IKComFetch.setHeaders({Authorization:this.jwt_signature});
		IKComFetch.setRestURL(base_url);
		IKComFetch.setResource(resource);
		IKComFetch.sendFetch((resp) => {
			if (resp.status == 200) {
				let jikMember = resp.data;

				if (jikMember.count > 0) {
					ComLocalStorage.setItem(
						"jik",
						"jikIkaMember",
						JSON.stringify(jikMember.data[0]), (e) => {
							if (jikMember.data[0].ika_member_profile.data !== null) {
								if (jikMember.data[0].ika_member_profile.data.profile_picture !== null) {
									thumbme = jikMember.data[0].ika_member_profile.data.profile_picture;
								}
								first_name = jikMember.data[0].ika_member_profile.data.first_name !== null && jikMember.data[0].ika_member_profile.data.first_name !== "" ? jikMember.data[0].ika_member_profile.data.first_name : "";
								mid_name = jikMember.data[0].ika_member_profile.data.mid_name !== null && jikMember.data[0].ika_member_profile.data.mid_name !== "" ? jikMember.data[0].ika_member_profile.data.mid_name : "";
								last_name = jikMember.data[0].ika_member_profile.data.last_name !== null && jikMember.data[0].ika_member_profile.data.last_name !== "" ? jikMember.data[0].ika_member_profile.data.last_name : "";
							}

							this.setState({
								jikIkaMember: {
									thumbme : imgThumb+thumbme+'?w=100&dir=_images_member',
									jikmember : jikMember.data[0].member_id,
									ikamember : jikMember.data[0].ika_member.data.member_id,
									email : jikMember.data[0].email,
									nameAll : first_name+mid_name+last_name,
									fullName : jikMember.data[0].fullname,
								},
							});
						}
					);
				}
			}
		});
	}

	_renderBtnLogin() {
		if (this.state.loginLoading) {
			return(<Spinner/>);
		}
		else {
			return(<Text style={{fontSize: 18}}>MASUK</Text>);
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
			<View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#EAEAEA' }} >
				<View style={{ alignItems: 'stretch', backgroundColor: '#8B4513', height: 7 }}></View>

				{/*<View style={{ flex: 1 }}>*/}
					<View style={{ alignItems: 'center', padding: 30 }}>
						<View style={{ backgroundColor: '#E0E0E0', flexDirection: 'row', width: '100%' }}>
							<View style={{ backgroundColor: 'white', alignItems: 'center', width: ((60/360)*width) }}>
								<Icon name="ios-mail-outline" style={{ color: '#B35E28', fontSize: ((33/360)*width), textAlign: 'center' }} />
							</View>
							<TextInput
								ref={(ref) => this.email_ref = ref}
								underlineColorAndroid='transparent'
								onChangeText={(email) => { this.setState({email}); }}
								keyboardType="email-address" value={this.state.email}
								placeholder="Email"
								placeholderTextColor='#959595'
								style={{ fontSize: 18, padding: 8, flex: 1 }}
							/>
						</View>
						<View style={{ backgroundColor: '#E0E0E0', flexDirection: 'row', marginTop: 30, width: '100%' }}>
							<View style={{ backgroundColor: 'white', alignItems: 'center', width: ((60/360)*width) }}>
								<Icon name="ios-lock-outline" style={{color: '#B35E28', fontSize: ((33/360)*width), textAlign: 'center'}} />
							</View>
							<TextInput
								ref={(ref) => this.password_ref = ref}
								secureTextEntry={ true }
								underlineColorAndroid='transparent'
								onChangeText={(password) => { this.setState({password}); }}
								value={this.state.password}
								placeholder="Password"
								placeholderTextColor='#959595'
								style={{ fontSize: 18, padding: 8, flex: 1 }}
							/>
						</View>
						<Button
							block
							style={{ marginTop:((50/592)*height), backgroundColor:(this.state.loginLoading ? '#ccc' : '#8B4513'), elevation: 0 }}
							onPress={() => this.login() }
							disabled={this.state.loginLoading}
						>
							{this._renderBtnLogin()}
						</Button>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 20 }}>
							<TouchableHighlight onPress={() => Actions.pop()}>
								<View style={{ flexDirection: 'row', height: 20, alignItems: 'center' }}>
									<Icon name="md-arrow-back" style={{ fontSize: 18, color: '#B45F28' }} />
									<Text style={{ color: '#B45F28' }}> Kembali</Text>
								</View>
							</TouchableHighlight>
							<TouchableHighlight onPress={() => Actions.Signup()}>
								<View style={{ flexDirection: 'row', height: 20, alignItems: 'center' }}>
									<Text style={{ color: '#B45F28' }}>Buat Akun</Text>
								</View>
							</TouchableHighlight>
						</View>
					</View>
					<TouchableHighlight style={{ alignItems: 'stretch', backgroundColor: '#989898', height: 50 }} onPress={() => Actions.ForgotPassword()}>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ color: 'white', fontSize: 15 }}>Lupa Password ?</Text>
						</View>
					</TouchableHighlight>
				{/*</View>*/}
			</View>
		);
	}
}
