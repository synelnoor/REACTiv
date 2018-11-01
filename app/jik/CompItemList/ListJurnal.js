import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	TouchableHighlight,
	Dimensions,
	TextInput,
	Alert,
	Platform,
	UIManager,
	LayoutAnimation,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Spinner,  } from 'native-base';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
//import ComFetch from '../../comp/ComFetch';
import ComLocalStorage from '../../comp/ComLocalStorage';
//import ArrayToQueryString from '../../comp/ArrayToQueryString';
import { base_url, api_uri, youtubeImg, imgThumb, noCover } from '../../comp/AppConfig';
import he from 'he';
/**
 * aksi untuk, tambah komentar
 * like status
 * follow un follow
 */
import ActionButton from './ActionButton';

export default class ListJurnal extends Component{

	width100 = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').height : Dimensions.get('window').width;

	dimAlbum = (this.width100-90)/3;

	iconListJurnal = {
		artikel:{ color:'#a0a0a0', },
		foto:{ color:'#a0a0a0', },
		video:{ color:'#a0a0a0', },
	}

	dim8 = this.width100/8;
	dim6 = this.width100/6;
	dim4 = this.width100/4;
	dim3 = this.width100/3;
	dim2 = this.width100/2;
	imgDefault = this.width100;
	imgX2 = this.width100*2;

	ActionButton = new ActionButton;

	headList = <View/>

	constructor(props){
		super(props);
		this.state = {
			reloadJurnal:true,
			submitSpinner:false,
			imgPickActive : "",
			formstatus:"",
			artikelJudul:"",
			artikelSumm:"",
			artikelDesc:"",
			fotoJudul:"",
			fotoSumm:"",
			videoJudul:"",
			videoSumm:"",
			videoAlbum:null,
			txtVideo:"",
			albumFoto:null,
			coverFoto:null,
			albumFotoSrv:null,
			delAlbumFotoSrv:null,
			coverArtikel:null,
			txttitle:"",

			all:false,
			info:false,
			more:false,
		}
		if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}
	}

	componentWillMount(){
		if (typeof this.props.data.formStatus !== "undefined" && this.props.data.formStatus !== false) {
			this.setState({
				formstatus:this.props.data.formStatus,
			},()=>{
				this._Actions('getJurnal');
			})
		}
	}

	componentDidMount(){
	}

	albumFoto() {
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
				this._Actions("saveImg",{ status:'albumFoto', data: response, });
			}
		});
	}

	coverFoto() {
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
				this._Actions("saveImg",{ status:'coverFoto', data: response, });
			}
		});
	}

	coverArtikel() {
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
				this._Actions("saveImg",{ status:'coverArtikel', data: response, });
			}
		});
	}

	_Actions(goto,data){
		let sendData = "";
		switch(goto) {
			case 'JurnalDetail':
				Actions.JIKaddContent(data);
				break;
			case 'saveImg':
				let saveImageParam = {};
				let saveImgState = this.state[data.status];
				let response = data.data;
				let param = {
								fileName : response.fileName,
								fileSize : response.fileSize,
								height : response.height,
								isVertical : response.isVertical,
								originalRotation : response.originalRotation,
								path : response.path,
								type : response.type,
								uri : response.uri,
							};

				if(data.status == "albumFoto"){
					if(saveImgState == null){
						saveImageParam[data.status] = [param]
						this.setState(saveImageParam);
					}else{
						saveImgState.push(param);
						this.setState(saveImgState);
					}
				}else if(data.status == "coverFoto"){
					saveImageParam[data.status] = param
					this.setState(saveImageParam);
				}else if(data.status == "coverArtikel"){
					saveImageParam[data.status] = param
					this.setState(saveImageParam);
				}

				break;
			case "changeJurnal":
				this.iconListJurnal = {
									artikel:{ color:'#a0a0a0', },
									foto:{ color:'#a0a0a0', },
									video:{ color:'#a0a0a0', },
								}
				let changeJurnal = "";
				if(this.state.formstatus !== data.status){
					this.iconListJurnal[data.status] = { color:'#b76329', };
					changeJurnal = data.status;
				}
				this.setState({
					formstatus:changeJurnal,
				},()=>{
					LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
				});
				break;
			case 'addVideoAlbum':
				let saveVideoState = this.state[data.status];
				let paramVideo = {
								uri : this.state.txtVideo,
							};
				if(data.status == "videoAlbum"){
					if(saveVideoState == null){
						let saveVideoeParam = {};
							saveVideoeParam[data.status] = [paramVideo]
						this.setState(saveVideoeParam);
					}else{
						saveVideoState.push(paramVideo);
						this.setState(saveVideoState);
					}
				}
				break;
			case 'insertData':
				this.setState({
					submitSpinner:true,
				},()=>{

					let JurnalDataInfo = this.props.data.content.data;
					let JurnalloginData = this.props.data.loginData;
					let ikaMember = JurnalloginData.ikamember;
					let email = JurnalloginData.email;
					let jikMember = JurnalloginData.jikmember;

					if (this.state.formstatus == "artikel") {
						let artikelForm = new FormData();
						if (this.state.artikelJudul !== "" && this.state.artikelSumm !== "" && this.state.artikelDesc !== "") {
							let dirUrlArtikel = "folder=jurnal-dir/"+JurnalloginData.dir+"/artikel";
							let judulArtikel = this.state.artikelJudul;
							let deskripsiArtikel = this.state.artikelDesc;
							let artikelJurnalId = JurnalDataInfo.id;
							let artikelJurnalType = "article";
							let artikelJurnalDesc = "";

							let param = deskripsiArtikel.split("\n");
							for (var i in param) {
								if (param.hasOwnProperty(i)) {
									artikelJurnalDesc += "<p>"+param[i]+"</p>";
								}
							}

							artikelJurnalDesc = he.encode(artikelJurnalDesc);
							let slug = judulArtikel.replace("/[ ]/g", "-");
							sendData = {
								"title": this.state.artikelJudul,
								"slug": slug,
								"summary": this.state.artikelSumm,
								"detail": artikelJurnalDesc,
								"type": artikelJurnalType,
								"jurnal_id": artikelJurnalId,
								"ika_member_id": ikaMember,
								"member_email": email,
								"created_by": jikMember,
							}

							for (var i in sendData) {
								if (sendData.hasOwnProperty(i)) {
									let _name = i;
									let _val = sendData[i];
									artikelForm.append(_name, _val);
								}
							}

							if (this.state.coverArtikel !== null) {
								if (typeof this.state.coverArtikel.type !== "undefined") {
									artikelForm.append('file', {
										uri: this.state.coverArtikel.uri,
										type: this.state.coverArtikel.type,
										name: this.state.coverArtikel.fileName,
									} , this.state.coverArtikel.fileName );
								}else{
									artikelForm.append('file', this.state.coverArtikel.fileName );
								}
							}

							if (this.props.data.formEdit) {
								/* set send data */
								let editForm = new FormData();
								for (var i in sendData) {
									if (sendData.hasOwnProperty(i)) {
										let _name = i;
										let _val = sendData[i];
										if(_val !== null){
											editForm.append(_name, _val);
										}
									}
								}
								/* set send data */

								/* Action untuk Edit*/
								let editFormArtikel = this.props.data.content.data.jurnaldetail;
								editForm.append('jurnal_id',this.props.data.jurnal_id );
								this.ActionButton.editJurnalPost(
								{ data:editForm, url:dirUrlArtikel, idpost:editFormArtikel.idpost },
								(callback)=>{
									if (callback.status ==  200) {
										this.props.reload(this.state.reloadJurnal);
										this._Actions(
											'setstate',
											{
												data:{submitSpinner:false,}
											});

									}else{
										Alert.alert(
											'Informasi',
											"Tidak terhubung ke server",
											[
												{text: 'OK', onPress: () => { this._Actions('setstate',{ data:{submitSpinner:false,} }); } },
											],
											{ cancelable: false }
										);
									}
								});
							}else{
								this.ActionButton.addJurnalPost(
									{ data:artikelForm, url:dirUrlArtikel, },
									(callback)=>{
										if (callback.status == 200) {
											this._Actions(
												'setstate',
												{
													data:{
														submitSpinner:false,
														artikelJudul : "",
														artikelSumm : "",
														artikelDesc : "",
														coverArtikel:null,
													},
													saveLS:{
														data:artikelForm,
														callback:callback.data,
														coverArtikel:this.state.coverArtikel,
														jurnalTitle:data.jtitle
													}
												});
										}else{
											Alert.alert(
												'Informasi',
												"Tidak terhubung ke server",
												[
													{text: 'OK', onPress: () => { this._Actions('setstate',{ data:{submitSpinner:false,} }); } },
												],
												{ cancelable: false }
											);
										}
									}
								);
							}
						}else{
							this._Actions('setstate',{ submitSpinner:false, })
						}
					}else if (this.state.formstatus == "foto") {
						let fotoForm = new FormData();
						let albumForm = new FormData();
						if (this.state.fotoJudul !== "" && this.state.fotoSumm !== "") {
							let dirUrlFoto = "folder=jurnal-dir/"+JurnalloginData.dir+"/photos";
							let judulFoto = this.state.fotoJudul;
							let fotoJurnalId = JurnalDataInfo.id;
							let fotoJurnalType = "photo";

							let slug = judulFoto.replace("/[ ]/g", "-");
							sendData = {
								"title": this.state.fotoJudul,
								"slug": slug,
								"summary": this.state.fotoSumm,
								"detail": "",
								"type": fotoJurnalType,
								"jurnal_id": fotoJurnalId,
								"ika_member_id": ikaMember,
								"member_email": email,
								"created_by": jikMember,
							}

							for (var i in sendData) {
								if (sendData.hasOwnProperty(i)) {
									let _name = i;
									let _val = sendData[i];
									fotoForm.append(_name, _val);
								}
							}

							/* upload cover foto */
							if (this.state.coverFoto !== null) {
								if (typeof this.state.coverFoto.type !== "undefined") {
									fotoForm.append('file', {
										uri: this.state.coverFoto.uri,
										type: this.state.coverFoto.type,
										name: this.state.coverFoto.fileName,
									} , this.state.coverFoto.fileName );
								}else{
									fotoForm.append('file', this.state.coverFoto.fileName );
								}
							}

							if (this.state.albumFoto !== null) {

								let dataAlbumFoto = this.state.albumFoto;
								if (dataAlbumFoto.length > 0) {
									for (var i in dataAlbumFoto) {
										if (dataAlbumFoto.hasOwnProperty(i)) {
											let _valUpload = dataAlbumFoto[i];
											let _images = {
												uri: _valUpload.uri,
												type: _valUpload.type,
												name: _valUpload.fileName,
											};
											if (typeof _valUpload.type !== "undefined") {
												albumForm.append('file[]', _images , _valUpload.fileName );
											}else{
												albumForm.append('file[]', _valUpload.fileName );
											}
										}
									}

									sendData = {
										"title": this.state.fotoJudul,
										"created_by": jikMember,
									}

									for (var i in sendData) {
										if (sendData.hasOwnProperty(i)) {
											let _name = i;
											let _val = sendData[i];
											albumForm.append(_name, _val);
										}
									}
								}
							}

							if (this.props.data.formEdit) {

								/* rubah data array ke => where = JurnalAlbum?orWhere=id:"1383,1382" */
								let DAFSsend = this.state.delAlbumFotoSrv;
								let DAFSlink = "";
								if (DAFSsend !== null) {
									for (var i in DAFSsend) {
										if (DAFSsend.hasOwnProperty(i)) {
											DAFSlink += DAFSsend[i].albumId+",";
										}
									}
								}

								/* Action untuk Edit */
								let editJurnalFoto = this.props.data.content.data.jurnaldetail;
								fotoForm.append('jurnal_id',this.props.data.jurnal_id );
								this.ActionButton.editJurnalPost(
								{ data:fotoForm, url:dirUrlFoto, idpost:editJurnalFoto.idpost },
								(callback)=>{
									if (callback.status ==  200) {
										/* add album Video */
										this.ActionButton.removeAlbumJurnalPost(
											{ idpost:DAFSlink, },
											(callbackAlbum)=>{
												if (callbackAlbum.status ==  200) {
													/* insert Ulang */
													if (albumForm._parts.length > 0) {
														albumForm.append("jurnal_post_id", editJurnalFoto.idpost);
														this.ActionButton.addAlbumJurnalPost(
															{ data:albumForm, url:dirUrlFoto, },
															(callbackAlbum)=>{
																if (callbackAlbum.status ==  200) {
																	this.props.reload(this.state.reloadJurnal);
																}
															}
														)
													}else{
														this.props.reload(this.state.reloadJurnal);
													}
												}else{
													Alert.alert(
														'Informasi',
														"Tidak terhubung ke server",
														[
															{text: 'OK', onPress: () => { this._Actions('setstate',{ data:{submitSpinner:false,} }); } },
														],
														{ cancelable: false }
													);
												}
											}
										)
									}
								});
							}else{
								this.ActionButton.addJurnalPost(
									{ data:fotoForm, url:dirUrlFoto, },
									(callback)=>{
										if (callback.status ==  200) {
											let fotoJurnalPostId = callback.data.id;
											albumForm.append("jurnal_post_id", fotoJurnalPostId);
											/* add album foto */
											this.ActionButton.addAlbumJurnalPost(
												{ data:albumForm, url:dirUrlFoto, },
												(callbackAlbum)=>{
													if (callbackAlbum.status ==  200) {
														this._Actions(
															'setstate',
															{
																data:{
																	submitSpinner:false,
																	fotoJudul:"",
																	fotoSumm:"",
																	coverFoto:null,
																	albumFoto:null,
																},
														});
													}else{
														Alert.alert(
															'Informasi',
															"Tidak terhubung ke server",
															[
																{text: 'OK', onPress: () => { this._Actions('setstate',{ data:{submitSpinner:false,} }); } },
															],
															{ cancelable: false }
														);
													}
												}
											)
										}
									}
								)
							}
						}else{
							this._Actions('setstate',{ submitSpinner:false, })
						}
					}else if (this.state.formstatus == "video") {
						let videoForm = new FormData();
						let albumVideoForm = new FormData();
						if (this.state.videoJudul !== "" && this.state.videoSumm !== "") {
							let dirUrlVideo = "folder=jurnal-dir/"+JurnalloginData.dir+"/video";
							let judulVideo = this.state.videoJudul;
							let videoJurnalId = JurnalDataInfo.id;
							let videoJurnalType = "video";

							let slug = judulVideo.replace("/[ ]/g", "-");
							sendData = {
								"title": this.state.videoJudul,
								"slug": slug,
								"summary": this.state.videoSumm,
								"detail": "",
								"type": videoJurnalType,
								"jurnal_id": videoJurnalId,
								"ika_member_id": ikaMember,
								"member_email": email,
								"created_by": jikMember,
							}

							for (var i in sendData) {
								if (sendData.hasOwnProperty(i)) {
									let _name = i;
									let _val = sendData[i];
									videoForm.append(_name, _val);
								}
							}


							if (this.state.videoAlbum !== null) {

								let dataAlbumVideo = this.state.videoAlbum;
								if (dataAlbumVideo.length > 0) {
									videoForm.append('file',dataAlbumVideo[0].uri );
									for (var i in dataAlbumVideo) {
										if (dataAlbumVideo.hasOwnProperty(i)) {
											let _valUpload = dataAlbumVideo[i];
											albumVideoForm.append('file[]', _valUpload.uri );
										}
									}

									sendData = {
										"title": this.state.videoJudul,
										"created_by": jikMember,
									}

									for (var i in sendData) {
										if (sendData.hasOwnProperty(i)) {
											let _name = i;
											let _val = sendData[i];
											albumVideoForm.append(_name, _val);
										}
									}
								}
							}
							if (this.props.data.formEdit) {
								/* Action untuk Edit*/
								let editJurnalDetail = this.props.data.content.data.jurnaldetail;
								videoForm.append('jurnal_id',this.props.data.jurnal_id );
								this.ActionButton.editJurnalPost(
								{ data:videoForm, url:dirUrlVideo, idpost:editJurnalDetail.idpost },
								(callback)=>{
									if (callback.status ==  200) {
										/* add album Video */
										this.ActionButton.removeAlbumJurnalPost(
											{ idpost:editJurnalDetail.idpost, },
											(callbackAlbum)=>{
												if (callbackAlbum.status ==  200) {
													/* insert Ulang */
													albumVideoForm.append("jurnal_post_id", editJurnalDetail.idpost);
													this.ActionButton.addAlbumJurnalPost(
														{ data:albumVideoForm, url:dirUrlVideo, },
														(callbackAlbum)=>{
															if (callbackAlbum.status ==  200) {
																this._Actions(
																	'setstate',
																	{
																		data:{
																			submitSpinner:false,
																		},
																});
															}else{
																Alert.alert(
																	'Informasi',
																	"Tidak terhubung ke server",
																	[
																		{text: 'OK', onPress: () => { this._Actions('setstate',{ data:{submitSpinner:false,} }); } },
																	],
																	{ cancelable: false }
																);
															}
														}
													)
												}
											}
										)
									}
								});
							}else{
								this.ActionButton.addJurnalPost(
								{ data:videoForm, url:dirUrlVideo, },
								(callback)=>{
									if (callback.status ==  200) {
										let fotoJurnalPostId = callback.data.id;
										albumVideoForm.append("jurnal_post_id", fotoJurnalPostId);
										/* add album Video */
										this.ActionButton.addAlbumJurnalPost(
											{ data:albumVideoForm, url:dirUrlVideo, },
											(callbackAlbum)=>{
												if (callbackAlbum.status ==  200) {
													/* console.log("callbackAlbum",callbackAlbum); */
													this._Actions(
														'setstate',
														{
															data:{
																submitSpinner:false,
																videoJudul:"",
																videoSumm:"",
																txtVideo:"",
																videoAlbum:null,
															},
													});
												}else{
													Alert.alert(
														'Informasi',
														"Tidak terhubung ke server",
														[
															{text: 'OK', onPress: () => { this._Actions('setstate',{ data:{submitSpinner:false,} }); } },
														],
														{ cancelable: false }
													);
												}
											}
										)
									}
									/* console.log(callback); */
								});
							}
						}
					}

					this.forceUpdate(); // by dandi

				});

				break;
			case 'removeAlbum':
				let FormActive = this.state.formstatus;
				let dataForm = FormActive+'Album';

				if (FormActive == "foto") {
					dataForm = 'albumFoto';
				}

				let dataAlbum = this.state[dataForm];
				let saveAlbum = {};

				if (dataAlbum.length > 1) {
					dataAlbum.splice(data.id,1);
					saveAlbum[dataForm] = dataAlbum;
				}else{
					saveAlbum[dataForm] = null;
				}
					this.setState(saveAlbum,
						()=>{
						// console.log(this.state[dataForm]);
					});
				break;
			case 'removeAlbumSrv':
				let FormActiveSrv = this.state.formstatus;
				let dataFormSrv = FormActiveSrv+'AlbumSrv';

				if (FormActiveSrv == "foto") {
					dataFormSrv = 'albumFotoSrv';
				}

				let dataAlbumSrv = this.state[dataFormSrv];
				let saveAlbumSrv = {};

					/* data yang akan di hapus */
					let RAdata = dataAlbumSrv[data.id];
					let RAstate = this.state.delAlbumFotoSrv;
					if(RAstate == null){
						RAstate = [RAdata]
					}else{
						RAstate.push(RAdata);
					}
					saveAlbumSrv['delAlbumFotoSrv'] = RAstate;
					/* data yang akan di hapus */

					if (dataAlbumSrv.length > 1) {
						dataAlbumSrv.splice(data.id,1);
						saveAlbumSrv[dataFormSrv] = dataAlbumSrv;
					}else{
						saveAlbumSrv[dataFormSrv] = null;
					}

					this.setState(saveAlbumSrv,
						()=>{
						/* console.log(this.state['delAlbumFotoSrv']); */
					});
				break;
			case 'getJurnal':
				let getJurnaldetail = this.props.data.content.data.jurnaldetail;
				let compType = this.props.data.content.data.compType;
				let title = this.props.data.content.data.detail.title;
				let summary = this.props.data.content.data.detail.desc;
				let getLogin = this.props.data.loginData;
				let coverFoto = this.props.data.cover;
				let setDataJurnal = {};
				if (compType == "video") {
					setDataJurnal = {
						videoJudul:title,
						videoSumm:summary,
						txtVideo:"",
					}
					this.ActionButton.getAlbumJurnalPost(
						{url:getJurnaldetail.idpost},
						(callback)=>{
							setDataJurnal['videoAlbum'] = null;
							if (callback.status == 200) {
								let getJurnalvideoAlbum = this.state.getJurnalvideoAlbum;
								let getJurnalData = callback.data.data;
								let saveVideoeParam = null;
								for (var i in getJurnalData) {
									if (getJurnalData.hasOwnProperty(i)) {
										let paramVideoJurnal = {};
										paramVideoJurnal = {
														uri : getJurnalData[i].file,
													};
										if(saveVideoeParam == null){
											saveVideoeParam = {};
											saveVideoeParam = [paramVideoJurnal]
										}else{
											saveVideoeParam.push(paramVideoJurnal);
										}
									}
								}
								setDataJurnal['videoAlbum'] = saveVideoeParam;
								this.setState(setDataJurnal);
							}
						});
				}else if (compType == "photo") {
					setDataJurnal = {
						fotoJudul:title,
						fotoSumm:summary,
						coverFoto:coverFoto,
					}
					this.ActionButton.getAlbumJurnalPost(
						{url:getJurnaldetail.idpost},
						(callback)=>{
							setDataJurnal['albumFotoSrv'] = null;
							if (callback.status == 200) {
								let getJurnalfotoAlbum = this.state.getJurnalfotoAlbum;
								let getJurnalData = callback.data.data;
								let saveFotoParam = null;
								for (var i in getJurnalData) {
									if (getJurnalData.hasOwnProperty(i)) {
										let paramVideoJurnal = {};
										paramVideoJurnal = {
														albumId : getJurnalData[i].id,
														fileName : getJurnalData[i].file,
														uri : imgThumb+getJurnalData[i].file+'?w='+this.imgDefault+'&dir='+getLogin.dir+'&type=photos',
													};
										if(saveFotoParam == null){
											saveFotoParam = {};
											saveFotoParam = [paramVideoJurnal]
										}else{
											saveFotoParam.push(paramVideoJurnal);
										}
									}
								}
								setDataJurnal['albumFotoSrv'] = saveFotoParam;
								this.setState(setDataJurnal);
							}
						});
				}else if (compType == "article") {
					let txtArtikelDesc = "";
					if (getJurnaldetail.jpdetail !== "" && typeof getJurnaldetail.jpdetail !== "undefined") {
						txtArtikelDesc = getJurnaldetail.jpdetail.replace(/<p>/g, '');
						txtArtikelDesc = txtArtikelDesc.replace(/<\/p>/g, '\n');
					}
					setDataJurnal = {
						artikelJudul:title,
						artikelSumm:summary,
						artikelDesc:txtArtikelDesc,
						coverArtikel:coverFoto,
					}
					this.setState(setDataJurnal);
				}
				break;
			case 'saveLS':
				/* add in LocalStorage */
				let jtitle = data.jurnalTitle;
				let LStorage = new ComLocalStorage();
					LStorage.getMultiple(
						[
							'@jik:jikIkaMember',
							'@jik:JurnalSaya',
						],
						(callback)=>{
							let dataArr = {};
							let dataLS = callback.data;
							for (var i in dataLS) {
								if (dataLS.hasOwnProperty(i)) {
									let keyLStorage = dataLS[i][0];
									let valLStorage = dataLS[i][1];
									dataArr[keyLStorage] = JSON.parse(valLStorage);
								}
							}

							let jikIkaMember 	= dataArr['@jik:jikIkaMember'];
							let JurnalSaya 		= dataArr['@jik:JurnalSaya'];
							let articleView		= 'all';

							let profile_cover 	= jikIkaMember.ika_member_profile.data.profile_cover == "no-cover-member.jpg" ? noCover+"?w="+this.dimx2 : imgThumb+jikIkaMember.ika_member_profile.data.profile_cover+"?w="+this.dimx2+"&dir=_images_member"
								jikmember 	= {
													dir:jikIkaMember.dir,
													thumbme : profile_cover,
													jikmember : jikIkaMember.member_id,
													ikamember : jikIkaMember.ika_member.data.member_id,
													email : jikIkaMember.email,
												}
								this.setState({
									info:jikmember,
								},()=>{
									let dataCB = data.callback;
									/* filter icon jurnal post */
									let jpiconCB = null;
									let fileurl = null;
									let fileurlori = null;
									if (dataCB.type == "article") {
										jpiconCB = "ios-document-outline";
										fileurl = imgThumb+'null'+'?w=400&dir='+jikIkaMember.dir+'&type=artikel' ;
										if (data.coverArtikel !== null) {
											fileurl = imgThumb+data.coverArtikel.fileName+'?w='+this.dimx2+'&dir='+jikIkaMember.dir+'&type=artikel' ;
										}
										fileurlori = fileurl;
									}
									/* conver html entity */
									let jpdetailCB = he.decode(dataCB.detail);
									let thumbCB = imgThumb+jikIkaMember.ika_member_profile.data.profile_picture+'?w='+this.dim6+'&dir=_images_member';

									let dataInsert = {
										coverFile : null,
										fileurl : fileurl,
										fileurlori : fileurlori,
										jikdir : jikIkaMember.dir,
										jpcomment : [],
										jpcreated_at : dataCB.created_at,
										jpdetail : jpdetailCB,
										jpicon : jpiconCB,
										jplike : 0,
										jpshare : 0,
										jpsummary : dataCB.summary,
										jptitle : dataCB.title,
										jtitle : jtitle,
										jurnal_id : dataCB.jurnal_id,
										jurnalpost : dataCB.id,
										nama : jikIkaMember.fullname,
										type : dataCB.type,
										thumb: thumbCB
									}

									let dataJurnalSaya = {};
									let listJuralSaya = [];
									let dataoffset 		= JurnalSaya.dataoffset;
									let datalimitList	= 10;
									let datatotal		= JurnalSaya.total;
									let dataupdate		= JurnalSaya.update;

									/* first insert data */
									if (JurnalSaya == null) {
										listJuralSaya.unshift(dataInsert);
										++datatotal;
										++dataupdate;
										dataJurnalSaya = {
												dataoffset : dataoffset,
												limitList : datalimitList,
												list : listJuralSaya,
												search : "",
												total : datatotal,
												update : dataupdate,
											};
									}else{
									/* second insert data */
										++datatotal;
										++dataupdate;
										listJuralSaya = JurnalSaya.list;
										listJuralSaya.unshift(dataInsert);
										dataJurnalSaya = {
												dataoffset : dataoffset,
												limitList : datalimitList,
												list : listJuralSaya,
												search : "",
												total : datatotal,
												update : dataupdate,
											};
									}
									/* add LocalStorage */
									let addJurnalLS = new ComLocalStorage();
										addJurnalLS.setMultiple(
											[
												['@jik:JurnalSaya', JSON.stringify(dataJurnalSaya)],
											],
											(callback)=>{
												this.props.dataCB({
																	dataInsert:dataInsert,
																	all:{
																		dataoffset : dataoffset,
																		limitList : datalimitList,
																		list : listJuralSaya,
																		search : "",
																		total : datatotal,
																		update : dataupdate,
																	}
																});
											}
										);
								});
						}
					)
				break;
			case 'setstate':
				this.setState(
					data.data,
					()=>{
						this.props.dataCB({ refreshData:true })
						// if (typeof data.saveLS !== 'undefined') {
						// 	this._Actions('saveLS',data.saveLS);
						// }
				});
				break;
			default:
		        return ()=>{ };
		}
	}

	configView(){
		let dataView = [];
			dataView.push(<View key={1}/>);

		/* head list jurnal */
		if (this.props.data.headList !== false && typeof this.props.data.headList !== "undefined") {
			let dataheadList = this.props.data.headList;
			let dataAll = this.props.data.dataAll;
			let styleWrapper = this.props.data.dataStyle;
			let loginData = this.props.data.loginData;
			dataView.push(
							<TouchableHighlight underlayColor={"transparent"} key={2} onPress={()=>{ this._Actions("JurnalDetail",{ data:dataheadList, dataAll:dataAll, loginData:loginData, })}}>
								<View style={[{ borderWidth:1, borderColor:'#d0d0d0', padding:15, flexDirection:'row', flex:1, alignItems:'center', alignSelf:'center',  }, styleWrapper ]}>
									<View style={{ flex:1, }}>
										<Text>{ dataheadList.title }</Text>
									</View>
									<View style={{ flexDirection:'row', }}>
										<View style={{ padding:15, paddingTop:0, paddingBottom:0, borderRightWidth:1, borderColor:'#d0d0d0', }} >
											<IonIcon style={{ textAlign:'center', color:'#a0a0a0', fontSize:20, }} name="ios-document-outline"/>
										</View>
										<View style={{ padding:15, paddingTop:0, paddingBottom:0, borderRightWidth:1, borderColor:'#d0d0d0', }} >
											<IonIcon style={{ textAlign:'center', color:'#a0a0a0', fontSize:20, }} name="ios-camera-outline"/>
										</View>
										<View style={{ padding:10, paddingTop:0, paddingBottom:0, paddingRight:0, }} >
											<IonIcon style={{ textAlign:'center', color:'#a0a0a0', fontSize:20, }} name="ios-videocam-outline"/>
										</View>
									</View>
								</View>
							</TouchableHighlight>);
		}

		/* content list jurnal */
		if(this.props.data.content !== false && typeof this.props.data.content !== "undefined"){
			let thumbme = this.props.data.loginData.thumbme;
			let uriImage = {
							artikel:noCover,
							fotoCover:noCover,
							fotoAlbum:noCover,
							video:noCover,
						};
			let content = this.props.data.content;
			let dataContent = <View/>
			let contentHead = <View/>
			let submitSpinner = <View/>
			if (this.state.submitSpinner) {
				submitSpinner = <View style={{ marginBottom:15, flex:1 }}>
					<Spinner/>
				</View>
			}else{
				submitSpinner = <View style={{ marginBottom:15, flex:1 }}>
					<TouchableHighlight underlayColor={"transparent"}
					onPress={()=>{
						this._Actions("insertData",{ jtitle: this.props.data.content.data.title });
					}}>
						<View style={{ padding:15, backgroundColor:'#e0e0e0', }}>
							<Text style={{ textAlign:'center', color:'#a0a0a0', }}>Submit</Text>
						</View>
					</TouchableHighlight>
				</View>
			}

			if (typeof this.props.data.content.headList == "undefined") {

				contentHead = <View style={{ padding:15, paddingRight:0, paddingLeft:0, flexDirection:'row', flex:1, backgroundColor:'#e0e0e0', }}>
								<View style={{ flex:1, }} >
								<TouchableHighlight underlayColor={"transparent"} onPress={()=>{ this._Actions("changeJurnal",{status:'artikel',}); }}>
									<View style={{ flex:1, borderRightWidth:1, borderColor:'#d0d0d0', }} >
										<IonIcon style={[{ textAlign:'center', color:'#a0a0a0', fontSize:30, },this.iconListJurnal.artikel]} name="ios-document-outline"/>
									</View>
								</TouchableHighlight>
								</View>
								<View style={{ flex:1, }} >
								<TouchableHighlight underlayColor={"transparent"} onPress={()=>{ this._Actions("changeJurnal",{status:'foto',}); }}>
									<View style={{ flex:1, borderRightWidth:1, borderColor:'#d0d0d0', }} >
										<IonIcon style={[{ textAlign:'center', color:'#a0a0a0', fontSize:30, },this.iconListJurnal.foto]} name="ios-camera-outline"/>
									</View>
								</TouchableHighlight>
								</View>
								<View style={{ flex:1, }} >
								<TouchableHighlight underlayColor={"transparent"} onPress={()=>{ this._Actions("changeJurnal",{status:'video',}); }}>
									<View style={{ flex:1, paddingRight:0, }} >
										<IonIcon style={[{ textAlign:'center', color:'#a0a0a0', fontSize:30, },this.iconListJurnal.video]} name="ios-videocam-outline"/>
									</View>
								</TouchableHighlight>
								</View>
							</View>
			}

			if(this.state.formstatus == "artikel"){

				uriImage['artikel'] = this.state.coverArtikel !== null ? this.state.coverArtikel.uri : uriImage['artikel'];

				dataContent = <View style={{ flex:1 }}>
								<View style={{ backgroundColor:'#fff', padding:15, marginTop:15, }}>
									<View style={{ flex:1 }}>
										<View>
											<Text>Judul</Text>
										</View>
										<View style={{ borderColor:'#e0e0e0', borderWidth:1, marginTop:10, padding:10, }}>
											<TextInput
											style={{ padding:0, margin:0, height:15, fontSize:15 }}
											value={this.state.artikelJudul}
											onChangeText={(text) => this.setState({artikelJudul:text})}
											underlineColorAndroid="transparent"/>
										</View>
									</View>
									<View style={{ marginTop:15, }}>
										<View>
											<Text>Ringkasan</Text>
										</View>
										<View style={{ borderColor:'#e0e0e0', borderWidth:1, marginTop:10, padding:10, }}>
											<TextInput
											numberOfLines = {4}
											multiline={ true }
											style={{ padding:0, margin:0, height:60, fontSize:15 }}
											value={this.state.artikelSumm}
											onChangeText={(text) => this.setState({artikelSumm:text})}
											underlineColorAndroid="transparent"/>
										</View>
									</View>
									<View style={{ marginTop:15, }}>
										<View>
											<Text>Deskripsi</Text>
										</View>
										<View style={{ borderColor:'#e0e0e0', borderWidth:1, marginTop:10, padding:10, }}>
											<TextInput
											style={{ padding:0, margin:0, height:60, fontSize:15 }}
											numberOfLines = {4}
											multiline={ true }
											value={this.state.artikelDesc}
											onChangeText={(text) => this.setState({artikelDesc:text})}
											underlineColorAndroid="transparent"/>
										</View>
									</View>
									<View style={{ marginTop:15, }}>
										<View>
											<Text>Foto Sampul</Text>
										</View>
										<View style={{ marginTop:10, }}>
											<TouchableHighlight underlayColor={"transparent"}
											onPress={this.coverArtikel.bind(this)}>
												<View>
													<Image
													style={{ height:this.dim3, }}
													source={{ uri: uriImage.artikel }}/>
													<View style={{ backgroundColor:'rgba(0,0,0,0.5)', position:'absolute', top:0, bottom:0, left:0, right:0, alignItems:'center', alignSelf:'center', justifyContent:'center', }}>
														<View>
															<View>
																<Text style={{ color:'#fff', }}>Foto Sampul</Text>
															</View>
														</View>
													</View>
												</View>
											</TouchableHighlight>
										</View>
									</View>
								</View>
								{ submitSpinner }
							</View>
			}else if(this.state.formstatus == "foto"){

				uriImage['fotoCover'] = this.state.coverFoto !== null ? this.state.coverFoto.uri : uriImage['fotoCover'];

				dataContent = <View/>
				/* album foto */
				let albumFoto = this.state.albumFoto;
				let albumFotoSrv = this.state.albumFotoSrv;
				let albumFotoView = [];
				let no = 1;

				if(albumFotoSrv !== null){
					let styleFormAlbum = {
						normal : {},
						plusThree : {},
					};
					for (var iSrv in albumFotoSrv) {
						if (albumFotoSrv.hasOwnProperty(iSrv)) {
							var element = albumFotoSrv[iSrv];
							no++;
							no = no > 3 ? 1 : no;
							if(no == 1){
								styleFormAlbum.normal = { marginLeft:0, };
							}else if(no == 2){
								styleFormAlbum.normal = { marginLeft:15, marginRight:15, };
							}else if(no==3){
								styleFormAlbum.normal = { marginRight:0, };
							}

							albumFotoView.push(
									<View key={ i } style={[{ height:this.dimAlbum, width:this.dimAlbum, marginTop:15, flex:1 },styleFormAlbum.normal]}>
										<TouchableHighlight underlayColor={"transparent"}
										onPress={()=>{ this._Actions("removeAlbumSrv",{ id:iSrv, })}}>
											<View>
												<Image
												style={{ height:this.dimAlbum, width:this.dimAlbum, }}
												source={{ uri: albumFotoSrv[iSrv].uri }}/>
													<View style={{ backgroundColor:'rgba(0,0,0,0.5)', position:'absolute', top:0, bottom:0, left:0, right:0, alignItems:'center', alignSelf:'center', justifyContent:'center', }}>
														<IonIcon name="ios-trash-outline" style={{ fontSize:30, color:'#fff', }}/>
													</View>
											</View>
										</TouchableHighlight>
									</View>
							)
						}
					}
				}

				if(albumFoto !== null){
					let styleFormAlbum = {
						normal : {},
						plusThree : {},
					};
					for (var i in albumFoto) {
						if (albumFoto.hasOwnProperty(i)) {
							var element = albumFoto[i];
							no++;
							no = no > 3 ? 1 : no;
							if(no == 1){
								styleFormAlbum.normal = { marginLeft:0, };
							}else if(no == 2){
								styleFormAlbum.normal = { marginLeft:15, marginRight:15, };
							}else if(no==3){
								styleFormAlbum.normal = { marginRight:0, };
							}

							albumFotoView.push(
									<View key={ i } style={[{ height:this.dimAlbum, width:this.dimAlbum, marginTop:15, },styleFormAlbum.normal]}>
										<TouchableHighlight underlayColor={"transparent"}
										onPress={()=>{ this._Actions("removeAlbum",{ id:i, })}}>
											<View>
												<Image
												style={{ height:this.dimAlbum, width:this.dimAlbum, }}
												source={{ uri: albumFoto[i].uri }}/>
													<View style={{ backgroundColor:'rgba(0,0,0,0.5)', position:'absolute', top:0, bottom:0, left:0, right:0, alignItems:'center', alignSelf:'center', justifyContent:'center', }}>
														<IonIcon name="ios-trash-outline" style={{ fontSize:30, color:'#fff', }}/>
													</View>
											</View>
										</TouchableHighlight>
									</View>
							)
						}
					}
				}

				let btnContent =<View style={{ marginBottom:15, }}>
									<TouchableHighlight underlayColor={"transparent"}
									onPress={()=>{
										this._Actions("insertData");
									}}>
										<View style={{ padding:15, backgroundColor:'#e0e0e0', }}>
											<Text style={{ textAlign:'center', color:'#a0a0a0', }}>submit</Text>
										</View>
									</TouchableHighlight>
								</View>
				if(this.state.submitSpinner){
					btnContent = <Spinner/>
				}
				dataContent = <View>
								<View style={{ backgroundColor:'#fff', padding:15, marginTop:15, }}>
									<View>
										<View>
											<Text>Judul</Text>
										</View>
										<View style={{ borderColor:'#e0e0e0', borderWidth:1, marginTop:10, padding:10, }}>
											<TextInput
											style={{ padding:0, margin:0, height:15, fontSize:15 }}
											value={this.state.fotoJudul}
											onChangeText={(text) => this.setState({fotoJudul:text})}
											underlineColorAndroid="transparent"/>
										</View>
									</View>
									<View style={{ marginTop:15, }}>
										<View>
											<Text>Ringkasan</Text>
										</View>
										<View style={{ borderColor:'#e0e0e0', borderWidth:1, marginTop:10, padding:5, }}>
											<TextInput
											numberOfLines = {4}
											multiline={ true }
											style={{ padding:0, margin:0, height:60, fontSize:15 }}
											value={this.state.fotoSumm}
											onChangeText={(text) => this.setState({fotoSumm:text})}
											underlineColorAndroid="transparent"/>
										</View>
									</View>
									<View style={{ marginTop:15, }}>
										<View>
											<Text>Foto Sampul</Text>
										</View>
										<View style={{ marginTop:10, }}>
											<TouchableHighlight underlayColor={"transparent"}
											onPress={this.coverFoto.bind(this)}>
												<View>
													<Image
														style={{ height:this.dim3, }}
													source={{ uri: uriImage.fotoCover }}/>
													<View style={{ backgroundColor:'rgba(0,0,0,0.5)', position:'absolute', top:0, bottom:0, left:0, right:0, alignItems:'center', alignSelf:'center', justifyContent:'center', }}>
														<View>
															<View>
																<Text style={{ color:'#fff', }}>Foto Sampul</Text>
															</View>
														</View>
													</View>
												</View>
											</TouchableHighlight>
										</View>
									</View>

									<View style={{ marginTop:15, }}>
										<Text>Album Foto</Text>
									</View>
									<View style={{ flexWrap:'wrap', flexDirection:'row', paddingBottom:15, }}>

										<View style={{ height:this.dimAlbum, width:this.dimAlbum, marginTop:15, }}>
											<TouchableHighlight underlayColor={"transparent"}
											onPress={this.albumFoto.bind(this)}>
												<View>
													<Image
													style={{ height:this.dimAlbum, width:this.dimAlbum, }}
													source={{ uri: uriImage.fotoAlbum }}/>
														<View style={{ backgroundColor:'rgba(0,0,0,0.5)', position:'absolute', top:0, bottom:0, left:0, right:0, alignItems:'center', alignSelf:'center', justifyContent:'center', }}>
															<View style={{ flexDirection:'row', padding:5, alignItems:'center', alignSelf:'center', justifyContent:'center', }}>
																<View>
																	<View>
																		<Text style={{ color:'#fff', textAlign:'right', }}>Foto</Text>
																	</View>
																	<View>
																		<Text style={{ color:'#fff', textAlign:'right', }}>Album</Text>
																	</View>
																</View>
																<View style={{ marginLeft:5, borderLeftWidth:1, borderColor:'#fff', paddingLeft:5, }}>
																	<IonIcon name="ios-add-outline" style={{ fontSize:30, color:'#fff', }}/>
																</View>
															</View>
														</View>
												</View>
											</TouchableHighlight>
										</View>
										{ albumFotoView }
									</View>

								</View>
								<View>{ btnContent }</View>			
							</View>
			}else if(this.state.formstatus == "video"){
				/* album Video */
				let videoAlbum = this.state.videoAlbum;
				let albumVideoView = [];
				let no = 0;
				if(videoAlbum !== null){
					let styleAlbumVideo = {
						normal : {},
						plusThree : {},
					};
					for (var i in videoAlbum) {
						if (videoAlbum.hasOwnProperty(i)) {
							var element = videoAlbum[i];
							let uriYTube = youtubeImg+videoAlbum[i].uri+"/0.jpg";

							no++;
							no = no > 3 ? 1 : no;
							if(no == 1){
								styleAlbumVideo.normal = { marginLeft:0, };
							}else if(no == 2){
								styleAlbumVideo.normal = { marginLeft:15, marginRight:15, };
							}else if(no==3){
								styleAlbumVideo.normal = { marginRight:0, };
							}

							albumVideoView.push(
									<View key={ i } style={[{ height:this.dimAlbum, width:this.dimAlbum, marginTop:15, },styleAlbumVideo.normal]}>
										<TouchableHighlight underlayColor={"transparent"}
										onPress={()=>{ this._Actions("removeAlbum",{ id:i, })}}>
											<View>
												<Image
												style={{ height:this.dimAlbum, width:this.dimAlbum, }}
												source={{ uri: uriYTube }}/>
													<View style={{ backgroundColor:'rgba(0,0,0,0.5)', position:'absolute', top:0, bottom:0, left:0, right:0, alignItems:'center', alignSelf:'center', justifyContent:'center', }}>
														<IonIcon name="ios-trash-outline" style={{ fontSize:30, color:'#fff', }}/>
													</View>
											</View>
										</TouchableHighlight>
									</View>
							)
						}
					}
				}


				let btnContent = <View style={{ marginBottom:15, }}>
									<TouchableHighlight underlayColor={"transparent"}
									onPress={()=>{
										this._Actions("insertData");
									}}>
										<View style={{ padding:15, backgroundColor:'#e0e0e0', }}>
											<Text style={{ textAlign:'center', color:'#a0a0a0', }}>submit</Text>
										</View>
									</TouchableHighlight>
								</View>
				
				if(this.state.submitSpinner){
					btnContent = <Spinner/>
				}

				dataContent = <View>
								<View style={{ backgroundColor:'#fff', padding:15, marginTop:15, }}>
									<View>
										<View>
											<Text>Judul</Text>
										</View>
										<View style={{ borderColor:'#e0e0e0', borderWidth:1, marginTop:10, padding:10, }}>
											<TextInput
											style={{ padding:0, margin:0, height:15, fontSize:15 }}
											value={this.state.videoJudul}
											onChangeText={(text) => this.setState({videoJudul:text})}
											underlineColorAndroid="transparent"/>
										</View>
									</View>
									<View style={{ marginTop:15, }}>
										<View>
											<Text>Ringkasan</Text>
										</View>
										<View style={{ borderColor:'#e0e0e0', borderWidth:1, marginTop:10, padding:10, }}>
											<TextInput
											numberOfLines = {4}
											multiline={ true }
											style={{ padding:0, margin:0, height:60, fontSize:15 }}
											value={this.state.videoSumm}
											onChangeText={(text) => this.setState({videoSumm:text})}
											underlineColorAndroid="transparent"/>
										</View>
									</View>
									<View>
										<View style={{ marginTop:15, }}>
											<Text>Tambah Video</Text>
										</View>
										<View style={{ borderColor:'#e0e0e0', borderWidth:1, marginTop:10, flexDirection:'row', }}>
											<View style={{ flex:1, flexDirection:'row', justifyContent:'center', paddingLeft:10, }}>
												<TextInput
													style={{ padding:0, margin:0, height:15, flex:1, }}
													onChangeText={(text) => this.setState({txtVideo:text})}
													placeholder={"youtube video code"}
													value={this.state.txtVideo}
													underlineColorAndroid="transparent"/>
											</View>
											<View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', alignSelf:'center',}}>
												<TouchableHighlight underlayColor={"transparent"}
													onPress={()=>{
														this._Actions("addVideoAlbum",{status:"videoAlbum"});
													}}>
													<View style={{ padding:10, paddingTop:5, paddingBottom:5, }}>
														<IonIcon name="ios-add-outline" style={{ fontSize:30, color:'#a0a0a0', }}/>
													</View>
												</TouchableHighlight>
											</View>
										</View>
									</View>

									<View style={{ flexWrap:'wrap', flexDirection:'row', paddingBottom:15, }}>
										{ albumVideoView }
									</View>

								</View>

								<View>{ btnContent }</View>
							</View>
			}

			dataView.push(
				<View key={ 3 }>
					{ contentHead }
					{ dataContent }
				</View>
			)
		}

		return dataView;

	}

	render(){
		return(
			<View style={{ flex:1 }}>
				{ this.configView() }
			</View>
		);
	}

}
