// Import dependencies
import React, { Component } from 'react';
import {	TouchableOpacity,
			Text,
			View,
			Image,
			TextInput,
			ScrollView,
			Dimensions,
			NetInfo,
			Alert,
			Platform,
			BackAndroid, } from 'react-native';
import { Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';

/* include theme */
//import getTheme from '../../../native-base-theme/components';
import { base_url, api_uri } from '../../comp/AppConfig';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ComLocalStorage from '../../comp/ComLocalStorage';
import FooterSM from '../FooterSM';

import ImagePickerCrop from 'react-native-image-crop-picker';

export default class Profil extends Component {

	width100 = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').height : Dimensions.get('window').width;

	dimx2 = this.width100*2;
	dim2 = this.width100/2;
	dim3 = this.width100/3;
	dim4 = this.width100/4;
	dim5 = this.width100/5;
	dim6 = this.width100/6;
	dim7 = this.width100/7;
	dimimg = this.width100-60;

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request


    constructor(props) {
        super(props);
        this.state = {
					ScrollView:this.refs.ScrollView,
					spinner : false,

					fullName:"",

					namaDepan: "",
					namaTengah: "",
					namaBelakang: "",
					biografi:"",
					facebook:"",
					twitter:"",
					instagram:"",
					youtube:"",
					follower:0,
					following:0,
					dataLogin : null,

					imgCover:null,
					imgCoverDefault:null,
					imgProfil:null,
					imgProfilDefault:null,

        }
    }

	componentWillMount(){
		if (this.props.drawerStatus) {
			Actions.refresh({key:'JIKdrawer',open:value=>false});
		}
		this._firstLoad();
	}

	_firstLoad(){
		let LocalStorage = new ComLocalStorage;
			LocalStorage.getMultiple(
				[
					'@jwt:user_info',
					'@jik:jikIkaMember',
					'@jik:jikProfil'
				],
				(callback)=>{
					let dataArr = {};
					let data = callback.data;
					for (var i in data) {
						if (data.hasOwnProperty(i)) {
							let keyLStorage = data[i][0];
							let valLStorage = data[i][1];
							dataArr[keyLStorage] = JSON.parse(valLStorage);
						}
					}

					let user_info = dataArr['@jwt:user_info'];
					let jikProfil = dataArr['@jik:jikProfil'];
					this.setState({
						dataLogin:user_info,
						email:user_info.data.userName
					},()=>{
						NetInfo.isConnected.fetch().then(isConnected => {
							if (jikProfil == null){
								this.getProfile(user_info.data.userName);
							}else if(isConnected){
								this.getProfile(user_info.data.userName);
							}else{
								this.setDataState(jikProfil);
							}
						});
					});
			})
	}

	setDataState(data){
		this.setState(data);
	}

	getProfile(email){
		let Param = {};

		Param['member_email'] = email;
		let resource = api_uri+'JIKProfil?'+ArrayToQueryString(Param);
		let	ComFetchNew = new ComFetch();
		ComFetchNew.setHeaders({Authorization:this.jwt_signature});
		ComFetchNew.setRestURL(base_url);
		ComFetchNew.setResource(resource);
		ComFetchNew.sendFetch((resp) => {
								if (resp.status == 200) {
									let data = resp.data.lsData;
									if(data){
										let dataSave = {
															follower : data.follower,
															following : data.following,
															fullName : data.fullName,
															namaDepan : data.namaDepan,
															namaTengah : data.namaTengah,
															namaBelakang : data.namaBelakang,
															biografi : data.biografi,
															imgProfilDefault : data.imgProfilDefault+"&w="+this.dim2 ,
															imgCoverDefault : data.imgCoverDefault+"&w="+this.dimx2 ,
															facebook : data.facebook,
															twitter : data.twitter,
															instagram : data.instagram,
															youtube : data.youtube,
														};

										ComLocalStorage.setItem(
											"jik",
											"jikProfil",
											JSON.stringify(dataSave),
											(e)=>{
												this.setDataState(dataSave);
											}
										);
									}
								}else{
									Alert.alert(
										'Warning',
										"Tidak terhubung ke server",
										[
											{text: 'OK', onPress: () => { } },
										],
										{ cancelable: false }
									);
								}

							});
	}

	componentDidMount(){
		this.setState({
			ScrollView:this.refs.ScrollView
		});

		let backAction = BackAndroid.addEventListener('hardwareBackPress', function() {
		 return true; // by dandi
		});

		if(backAction) {
			this.forceUpdate(); // by dandi
		}
	}

	componentWillReceiveProps(nextprops) {
		if(nextprops.backAction) {
			this.setState({
				ScrollView:this.refs.ScrollView,
				spinner : false,

				fullName:"",

				namaDepan: "",
				namaTengah: "",
				namaBelakang: "",
				biografi:"",
				facebook:"",
				twitter:"",
				instagram:"",
				youtube:"",
				follower:0,
				following:0,
				dataLogin : null,

				imgCover:null,
				imgCoverDefault:null,
				imgProfil:null,
				imgProfilDefault:null,
			},()=>{
				this._firstLoad(); // by dandi
			})
		}
	}

	imageCache(e){
		console.log("e => ",e.source)
		let img = e.source.uri;
		let imgComp = <View style={e.style}><Spinner/></View>;
		if(img !== null){
			Image.prefetch(img);
			imgComp = <Image
				style={e.style}
				source={e.source}
				resizeMode="cover"
			/>
		}
		return imgComp;
	}

	selectCover() {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			storageOptions: {
				skipBackup: true
			}
		};

		ImagePicker.showImagePicker(options, (response) => {
			// console.log('Response = ', response);

			if (response.didCancel) {
				// console.log('User cancelled photo picker');
			}
			else if (response.error) {
				// console.log('ImagePicker Error: ', response.error);
			}
			else if (response.customButton) {
				// console.log('User tapped custom button: ', response.customButton);
			}
			else {
				let img = "imgCover";
				let param = {};

				ImagePickerCrop.openCropper({
					path: response.uri,
					width: 1920,
					height: 640,
					cropping: true
				}).then(images => {
					// console.log("images => ",images);
					param[img] = {
						fileName : response.fileName,
						fileSize : response.fileSize,
						height : response.height,
						isVertical : response.isVertical,
						originalRotation : response.originalRotation,
						path : images.path,
						type : response.type,
						uri : images.path,
						show:true,
					};
					// console.log("data param",this)
					this.setState(param,()=>{ /* console.log(this.state.imgProfil); */ });
				});

			}
		});
	}

	selectProfil() {
		const options = {
			quality: 1.0,
			maxWidth: 500,
			maxHeight: 500,
			storageOptions: {
				skipBackup: true
			}
		};

		ImagePicker.showImagePicker(options, (response) => {
			// console.log('Response = ', response);

			if (response.didCancel) {
				// console.log('User cancelled photo picker');
			}
			else if (response.error) {
				// console.log('ImagePicker Error: ', response.error);
			}
			else if (response.customButton) {
				// console.log('User tapped custom button: ', response.customButton);
			}
			else {
				let img = "imgProfil";
				let param = {};
				ImagePickerCrop.openCropper({
					path: response.uri,
					width: 300,
					height: 300,
					cropping: true,
					compressImageQuality:1
				}).then(images => {
					// console.log("images => ",images);
					param[img] = {
						fileName : response.fileName,
						fileSize : response.fileSize,
						height : response.height,
						isVertical : response.isVertical,
						originalRotation : response.originalRotation,
						path : images.path,
						type : response.type,
						uri : images.path,
						show:true,
					};
					// console.log("data param",this)
					this.setState(param,()=>{ /* console.log(this.state.imgProfil); */ });
				});
			}
		});
	}

	sendData(){
		let ConfFetch = new ComFetch();
		let FetchSosmed = new ComFetch();
		let dataLogin = this.state.dataLogin.data;
		let email = dataLogin.userName;

		if (this.state.namaDepan == "") {
			Alert.alert(
							'Warning !!!',
							'Nama Depan Belum Diisi',
						)
		}else if (this.state.namaDepan !== "") {
			let formSosmed = new FormData();
			let form = new FormData();
			let profile_picture = this.state.imgProfilDefault;
			let profile_cover = this.state.imgCoverDefault;
			let namaDepan = this.state.namaDepan;
			let namaTengah = this.state.namaTengah;
			let namaBelakang = this.state.namaBelakang;
			let biografi = this.state.biografi;
			let facebook = this.state.facebook;
			let twitter = this.state.twitter !== null ? this.state.twitter : "";
			let instagram = this.state.instagram !== null ? this.state.instagram : "";
			let youtube = this.state.youtube !== null ? this.state.youtube : "";

			let data = null;
			let nameAction = "";

			/* Sosial Media Add */
			let dataSosmed = {
								"fb_id" : facebook,
								"tw_id" : twitter,
								"ig_username" : instagram,
								"yt_username" : youtube,
							};
			/* Sosial Media Add */

			let _dataSet = {
						"first_name" : namaDepan,
						"mid_name" : namaTengah,
						"last_name" : namaBelakang,
						"profile_description" : biografi,
					};

			for (var i in _dataSet) {
				if (_dataSet.hasOwnProperty(i)) {
					let _name = i;
					let _val = _dataSet[i] !== null ? _dataSet[i] : "";
					form.append(_name, _val);
				}
			}

			/* upload foto imgProfil*/
			if (this.state.imgProfil !== null && typeof this.state.imgProfil !== "undefined") {
				let _imagesPicture = {
					uri: this.state.imgProfil.uri,
					type: this.state.imgProfil.type,
					name: this.state.imgProfil.fileName,
				};
				form.append('profile_picture', _imagesPicture , this.state.imgProfil.fileName );
			}

			/* upload foto imgCover*/
			if (this.state.imgCover !== null && typeof this.state.imgCover !== "undefined") {
				let _imagesCover = {
					uri: this.state.imgCover.uri,
					type: this.state.imgCover.type,
					name: this.state.imgCover.fileName,
				};
				form.append('profile_cover', _imagesCover , this.state.imgCover.fileName );
			}

			/* Upload File */
			let Param = {};
			Param['folder'] = '_images_member';
			Param['where'] = 'member_email:'+email;
			let resource = api_uri+'JSON/IkaMemberProfile?'+ArrayToQueryString(Param);
			ConfFetch.setHeaders({
	            Authorization:this.jwt_signature,
		    	'Content-Type': 'multipart/form-data'
	        });
			ConfFetch.setRestURL(base_url);
			ConfFetch.setResource(resource);
			ConfFetch.setMethod('POST');
			ConfFetch.setEncodeData('FormData');
			ConfFetch.setSendData(form);
			ConfFetch.sendFetch((resp) => {
									if (resp.status == 200) {
										/* Sosial Media Add */
										Param = {};
										Param['where'] = 'member_email:'+email;
										resource = api_uri+'JSON/IkaMember?'+ArrayToQueryString(Param);
										FetchSosmed.setHeaders({
											Authorization:this.jwt_signature,
										});
										FetchSosmed.setRestURL(base_url);
										FetchSosmed.setResource(resource);
										FetchSosmed.setMethod('POST');
										FetchSosmed.setSendData(dataSosmed);
										FetchSosmed.sendFetch((respSosmed) => {
																let dataSave = {};
																if (respSosmed.status == 200) {
																	dataSave = {
																					fullName: namaDepan+" "+namaTengah+" "+namaBelakang,
																					namaDepan: namaDepan,
																					namaTengah: namaTengah,
																					namaBelakang: namaBelakang,
																					biografi: biografi,
																					imgProfilDefault : profile_picture,
																					imgCoverDefault : profile_cover,
																					facebook: facebook,
																					twitter: twitter,
																					youtube: youtube,
																				};
																	this.setState({
																		spinner:false,
																	},()=>{
																		/* simpan data foto profile ke database */
																		this._getIkaJikMember(email);
																		ComLocalStorage.setItem(
																			"jik",
																			"jikProfil",
																			JSON.stringify(dataSave),
																			(e)=>{ }
																		);
																		/* Ambil gambar foto profil */
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
																				}, (e) => { Actions.refresh('JIKdrawer') });
																			}
																		});
																	});
																}
															});
									}
								});
			/* Upload File */


		}

	}

	_getIkaJikMember(email){
		let Param = {};
		Param['join'] = 'ikaMember,ikaMemberProfile';
		Param['where'] = 'email:'+email;
		let resource = api_uri+'JSON/JikMember?'+ArrayToQueryString(Param);
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
						JSON.stringify(jikMember.data[0]),
						(e)=>{ }
					);
				}
			}
		});
	}

	getIkaJikMemberDetail(userId, jwt_signature, cb){
		let Param = {};
		Param['join'] = 'ikaMemberProfile';
		Param['where'] = 'email:'+userId;
		let resource = api_uri+'JSON/JikMember?'+ArrayToQueryString(Param);
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

	saveFotoProfil(profil, cb){
		ComLocalStorage.setItem( "foto_profil", "all", JSON.stringify(profil), (e) => {
				cb(true);
			}
		);
	}

  render() {
		let uriImage = (this.state.imgCover !== null && this.state.imgCover.show == true) ? this.state.imgCover.uri : this.state.imgCoverDefault;
		let uriProfile = (this.state.imgProfil !== null && this.state.imgProfil.show == true) ? this.state.imgProfil.uri : this.state.imgProfilDefault;
		let btnSpinner = <Spinner/>

		if (this.state.spinner) {
			btnSpinner = <Spinner/>
		}else{
			btnSpinner = <View>
							<TouchableOpacity
								onPress={
									()=> {
											this.setState({
												spinner:true,
											},()=>{ this.sendData(); });
							}}>
								<View style={{ padding:15, backgroundColor:'#e0e0e0', }}>
									<Text style={{ fontSize:16, textAlign:'center', }}>Simpan</Text>
								</View>
							</TouchableOpacity>
						</View>
		}
      	let stylePP = (Platform.OS === 'android') ? { borderRadius:this.dim6, } : {};
        return (
			<View>
				
                <ScrollView onScroll={this.props.hideBtnOnScroll} ref='ScrollView'>
					<View>
						<View>
							{/* image cover */}
							{ this.imageCache({ style:{ height:this.dim2, }, source:{ uri: uriImage } }) }
							{/* image cover */}
							<View style={{ height:this.dim6/2, paddingLeft:this.dim6 + 15, left:0, right:0, bottom:0, position:'absolute', backgroundColor:'#f0f0f0', flexDirection:'row', }}>
								<View style={{ paddingTop:7.5, paddingBottom:7.5, flex: 1, flexDirection: 'row', justifyContent: 'flex-end', paddingRight:15, }}>
									<View style={{ paddingRight:5, borderRightWidth: 1, borderColor:'#777', }}>
										<TouchableOpacity
										onPress={this.selectProfil.bind(this)}>
											<Text style={{ fontSize:14, color:'#777', }}>Ubah Profil</Text>
										</TouchableOpacity>
									</View>
									<View style={{ marginLeft:5, }}>
										<TouchableOpacity
										onPress={this.selectCover.bind(this)}>
											<Text style={{ fontSize:14, color:'#777', }}>Ubah Cover</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
							<View style={{ paddingLeft:15, zIndex:2, position:'absolute', bottom:0, left:0, justifyContent:"center", }} >
								<TouchableOpacity
								onPress={this.selectProfil.bind(this)}>
									<View style={{ height:this.dim6, width:this.dim6, borderRadius:this.dim6, overflow:"hidden", backgroundColor:'#d0d0d0', borderWidth:1, borderColor:'#f0f0f0', }}>
										{/* image Profil */}
										{ this.imageCache({ style:[{ height:this.dim6-2, width:this.dim6-2, alignSelf:'center', alignItems:'center', },stylePP], source:{ uri: uriProfile } }) }
										{/* image Profil */}
									</View>
								</TouchableOpacity>
							</View>
						</View>

						<View style={{ backgroundColor:'#f0f0f0', paddingLeft:15, paddingRight:15, }}>
							<View>
								<Text style={{ fontSize:14, color:'#777', }}>{ this.state.fullName }</Text>
							</View>
							<View style={{ flexDirection:'row' }}>
								<View style={{ paddingRight:5, borderRightWidth: 1, borderColor:'#777', }}>
									<TouchableOpacity
										onPress={()=>{ Actions.JIKFollow({ typeFollow:'follower' }) }}>
										<Text style={{ fontSize:14, color:'#777', }}>{ this.state.follower } Pengikut</Text>
									</TouchableOpacity>
								</View>
								<View style={{ marginLeft:5, }}>
									<TouchableOpacity
										onPress={()=>{ Actions.JIKFollow({ typeFollow:'following' }) }}>
										<Text style={{ fontSize:14, color:'#777', }}>{ this.state.following } Mengikuti</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>

						<View style={{ padding:15, backgroundColor:'#f0f0f0'}}>

								<View style={{ flexDirection:'row', paddingBottom:20, marginTop:15, }}>
									<View style={{  flex:1, paddingRight:7.5,}}>
										<View style={{ paddingBottom:15, }}>
											<Text>Nama Depan</Text>
										</View>
										<View style={{ borderColor:'#d0d0d0', borderWidth:1, }}>
											<TextInput
												style={{ padding:2.5, paddingLeft:5, height:30, borderWidth:0, borderColor:'#fff', flex:1, fontSize:15 }}
												underlineColorAndroid="transparent"
												onChangeText={(text) => this.setState({namaDepan : text})}
												value={this.state.namaDepan}
											/>
										</View>
									</View>
									<View style={{  flex:1, paddingLeft:7.5,}}>
										<View style={{ paddingBottom:15, }}>
											<Text>Nama Tengah</Text>
										</View>
										<View style={{ borderColor:'#d0d0d0', borderWidth:1, }}>
											<TextInput
												style={{ padding:2.5, paddingLeft:5, height:30, borderWidth:0, borderColor:'#fff', flex:1, fontSize:15 }}
												underlineColorAndroid="transparent"
												onChangeText={(text) => this.setState({namaTengah : text})}
												value={this.state.namaTengah}
											/>
										</View>
									</View>
								</View>

								<View style={{ paddingBottom:20, }}>
									<View style={{ paddingBottom:15, }}>
										<Text>Nama Belakang</Text>
									</View>
									<View style={{ borderColor:'#d0d0d0', borderWidth:1, }}>
										<TextInput
											style={{ padding:2.5, paddingLeft:5, height:30, borderWidth:0, borderColor:'#fff', flex:1, fontSize:15 }}
											underlineColorAndroid="transparent"
											onChangeText={(text) => this.setState({namaBelakang : text})}
											value={this.state.namaBelakang}
										/>
									</View>
								</View>

								<View style={{ paddingBottom:20, }}>
									<View style={{ paddingBottom:15, }}>
										<Text>Biografi</Text>
									</View>
									<View style={{ borderColor:'#d0d0d0', borderWidth:1, }}>
										<TextInput
											style={{ padding:2.5, paddingLeft:5, height:60, fontSize:15, borderWidth:0, borderColor:'#fff', flex:1, }}
											underlineColorAndroid="transparent"
											multiline={true}
											numberOfLines = {4}
											onChangeText={(text) => this.setState({biografi : text})}
											value={this.state.biografi}
										/>
									</View>
								</View>

								<View style={{ paddingBottom:20, }}>
									<View style={{ paddingBottom:15, }}>
										<Text>Facebook</Text>
									</View>
									<View style={{ borderColor:'#d0d0d0', borderWidth:1, }}>
										<TextInput
											style={{ padding:2.5, paddingLeft:5, height:30, borderWidth:0, borderColor:'#fff', flex:1, fontSize:15 }}
											underlineColorAndroid="transparent"
											onChangeText={(text) => this.setState({facebook : text})}
											value={this.state.facebook}
										/>
									</View>
								</View>

								<View style={{ paddingBottom:20, }}>
									<View style={{ paddingBottom:15, }}>
										<Text>Twitter</Text>
									</View>
									<View style={{ borderColor:'#d0d0d0', borderWidth:1, }}>
										<TextInput
											style={{ padding:2.5, paddingLeft:5, height:30, borderWidth:0, borderColor:'#fff', flex:1, fontSize:15 }}
											underlineColorAndroid="transparent"
											onChangeText={(text) => this.setState({twitter : text})}
											value={this.state.twitter}
										/>
									</View>
								</View>

								<View style={{ paddingBottom:20, }}>
									<View style={{ paddingBottom:15, }}>
										<Text>Instagram</Text>
									</View>
									<View style={{ borderColor:'#d0d0d0', borderWidth:1, }}>
										<TextInput
											style={{ padding:2.5, paddingLeft:5, height:30, borderWidth:0, borderColor:'#fff', flex:1, fontSize:15 }}
											underlineColorAndroid="transparent"
											onChangeText={(text) => this.setState({instagram : text})}
											value={this.state.instagram}
										/>
									</View>
								</View>

								<View style={{ paddingBottom:20, }}>
									<View style={{ paddingBottom:15, }}>
										<Text>Youtube</Text>
									</View>
									<View style={{ borderColor:'#d0d0d0', borderWidth:1, }}>
										<TextInput
											style={{ padding:2.5, paddingLeft:5, height:30, borderWidth:0, borderColor:'#fff', flex:1, fontSize:15 }}
											underlineColorAndroid="transparent"
											onChangeText={(text) => this.setState({youtube : text})}
											value={this.state.youtube}
										/>
									</View>
								</View>

								<View style={{ marginBottom:45, }}>
									{ btnSpinner }
								</View>
						</View>
					</View>
					<FooterSM ScrollView={this.state.ScrollView}/>
                </ScrollView>
				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

			</View>
        );
    }
}
