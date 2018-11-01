import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	TextInput,
	Dimensions,
	Platform,
	UIManager,
	LayoutAnimation,
	ScrollView,
	RefreshControl,
	TouchableHighlight,
	Animated
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { StyleProvider, Spinner, Icon } from 'native-base';
//import ImagePicker from 'react-native-image-picker';
import he from 'he';

/* include theme */
import getTheme from '../../../native-base-theme/components';
import { base_url, api_uri, imgThumb, youtubeUri, youtubeImg, noCover } from '../../comp/AppConfig';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ComLocalStorage from '../../comp/ComLocalStorage';
import ComFetch from '../../comp/ComFetch';
import Styles from '../../comp/Styles';
import Service from '../../comp/Service';
import ActionButton from '../CompItemList/ActionButton';
import ListJurnal from '../CompItemList/ListJurnal';
import ItemList from '../CompItemList/ItemList';

export default class JurnalSaya extends Component {

	dataTotal = 0;
	width100 = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').height : Dimensions.get('window').width;
	dimx2 = this.width100 * 2;
	dim2 = this.width100/2;
	dim3 = this.width100/3;
	dim4 = this.width100/4;
	dim5 = this.width100/5;
	dim6 = this.width100/6;
	dim7 = this.width100/7;
	dimimg = this.width100-60;

	ActionButton = new ActionButton();

	styleIco = {
		add:{ color:'#a0a0a0', },
		wrappAdd :{ height:2, padding:0, },
		list:{ color:'#a0a0a0', },
		wrappList :{ height:2, padding:0, },
	}

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

    constructor(props) {
        super(props);
		this.loadmoreColor = new Animated.Value(0);
		this.loadmoreScale = new Animated.Value(0);
        this.state = {
			ScrollView:this.refs.ScrollView,
			list:false,
			add:false,
			listSpinner:true,
			txtTitleJurnal : "",
			listJurnal:null,
			info:false,
			jikIkaMember:null,
			more:false,
			all:{
				list: null,
				limitList:10,
				dataoffset:0,
				total:0,
				search:"",
			},
			sendJurnal:true,
        }
		if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}
    }

	componentWillMount(){
		Actions.refresh({key:'JIKdrawer',open:value=>false});
	}

	componentDidMount(){
		/* LocalStorage Checker */
		this.userCover();
		/* socket */
		Service._wsOnmessage((e)=>{
			/* like */
			if (e.type == "JikMsgInbox") {
				let limitListInbox = this.state.masuk.limitList;
				let offsetInbox = this.state.masuk.offset;
				let totalInbox = this.state.masuk.total;
				let listInbox = this.state.masuk.list;
				let countInbox = e.jikMessageInbox.countInbox;
				let update = e.update;
					listInbox.unshift({ data:e.JikMsgInbox, });
				this.setState({
					countInbox:countInbox,
					masuk:{
						list: listInbox,
						limitList:limitListInbox,
						offset:offsetInbox,
						total:totalInbox,
						update:update,
					},
				});
			}
			/* like */
		});
		/* socket */
	}

	_itemCB(e){
		let JurnalSaya = this.state.all
		if(typeof e.dataComment !== 'undefined'){
			let jurnalList = JurnalSaya.list;
				jurnalList[e.keyJurnal] = e.dataComment;
			this.setState({
				all:{
					limitList:JurnalSaya.limitList,
					list:jurnalList,
					offset:JurnalSaya.offset,
					search:JurnalSaya.search,
					total:JurnalSaya.total,
					update:JurnalSaya.update,
				}
			})
		}
	}

	userCover(){
		/* Local Storage Checker */
		let LStorage = new ComLocalStorage();
			LStorage.getMultiple(
				[
					'@jik:jikIkaMember',
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

					let jikIkaMember 	= dataArr['@jik:jikIkaMember'];
					let list 			= false;
					let profile_cover 	= jikIkaMember.ika_member_profile.data.profile_cover == "no-cover-member.jpg" ? noCover+"?w="+this.dimx2 : imgThumb+jikIkaMember.ika_member_profile.data.profile_cover+"?w="+this.dimx2+"&dir=_images_member"
						jikIkaMember 	= {
											dir:jikIkaMember.dir,
											thumbme : profile_cover,
											jikmember : jikIkaMember.member_id,
											ikamember : jikIkaMember.ika_member.data.member_id,
											email : jikIkaMember.email,
										}
						this.setState({
							info:jikIkaMember,
							jikIkaMember:jikIkaMember,
						},()=>{
							this._getJurnal();
							LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
						});
				}
			)
	}


	lcStorageCheck(more){
		/* Local Storage Checker */
		let LStorage = new ComLocalStorage();
			LStorage.getMultiple(
				[
					'@jik:JurnalSaya',
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

					let JurnalSaya 		= dataArr['@jik:JurnalSaya'];
					let list 			= false;
					let articleView		= 'all';
					let firstLoad = 0;
					let lastLoad = 0;
					/* first load data */
					if (JurnalSaya == null) {
						Alert.alert(
								'Warning',
								"Tidak terhubung ke server",
								[
									{text: 'OK', onPress: () => { } },
								],
								{ cancelable: false }
							);
					}else{
						let setData = {};
							list 	= JurnalSaya.list;
						if (JurnalSaya.list.length > 10) {
							firstLoad = 0;
							lastLoad = 10;
							list = JurnalSaya.list.slice(firstLoad, lastLoad);
						}
						setData[articleView] = {
													list: list,
													total: JurnalSaya.total,
													search: JurnalSaya.search,
													limitList:10,
													offset:0,
												};
						setData['more'] = false;
						this.setState(setData);
					}
				})
	}

	_Actions(goto,data){
		let sendData = "";
		switch(goto) {
			case 'resetStyle':
				this.styleIco.wrappList = { height:2, padding:0, }
				this.styleIco.wrappAdd = { height:2, padding:0, }
				this.styleIco.add = { color:'#a0a0a0', }
				this.styleIco.list = { color:'#a0a0a0', }
				break;
			case 'getJurnal':
				let Param = {};
					Param['where'] = 'created_by:'+this.state.info.jikmember; /* jika NULL belum bisa di gunakan */
						// Param['where'] = 'created_by:'+info.jikmember+',deleted_at:NULL';
					this.ActionButton.getJurnal(
						{data:ArrayToQueryString(Param)},
						(callback)=>{
							if (callback.status == 200) {
								/* concate state */
								if (callback.data.data.length > 0) {
									this.setState({
										listJurnal:callback.data.data,
									},()=>{
										LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
										/* add LocalStorage */
										let addLS = new ComLocalStorage();
											addLS.setMultiple(
												[
													['@jik:catJurnalsaya', JSON.stringify({ data:callback.data.data })],
												],
												(callback)=>{

												}
											);
									});
								}else{
									this.setState({
										listSpinner : false,
									},()=>{
										LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
									});
								}
								/* concate state */
							}else{
								/* tidak terhubung ke server */
								let getLS = new ComLocalStorage();
									getLS.getMultiple(
										[
											'@jik:catJurnalsaya',
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
											let catJurnalsaya = dataArr['@jik:catJurnalsaya'];
											this.setState({
												listJurnal:catJurnalsaya,
											},()=>{
												LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
											});
										}
									)
							}
						});
				break;
			case 'jurnalList':
				let dataList = false;
					this._Actions("resetStyle");
					if (this.state.list == false) {
						dataList = true;
						this.styleIco.wrappList = {  }
						this.styleIco.list = { color:'#b76329', }
					}

					this.setState({
						list:dataList,
						add:false,
					},()=>{
						if (this.state.listJurnal == null) {
							this._Actions("getJurnal");
						}
						LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
					});
				break;
			case 'jurnalAdd':
				let dataAdd = false;
				this._Actions("resetStyle");
				if (this.state.add == false) {
					dataAdd = true;
					this.styleIco.wrappAdd = {  }
					this.styleIco.add = { color:'#b76329', }
				}

				this.setState({
					add:dataAdd,
					list:false,
				},()=>{
					LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
				});

				break;
			case 'sendJurnal':
				this.setState({
					sendJurnal:false,
				},()=>{
					if (this.state.txtTitleJurnal !== "") {
						sendData = {
							'created_by' : this.state.info.jikmember,
							'title' : this.state.txtTitleJurnal,
							'description' : this.state.txtTitleJurnal,
						}
						this.ActionButton.addJurnal(
							{data:sendData},
							(callback)=>{
								let listJurnal = [];
								if (callback.status == 200) {
									/* concate state */
									if (this.state.listJurnal == null) {
										this._Actions('setstate',{
											listSpinner : true,
											sendJurnal:true,
											listJurnal:callback.data.data,
										});
										listJurnal = callback.data.data;
									}else{
										listJurnal = this.state.listJurnal;
										listJurnal.push({
											created_at : callback.data.created_at,
											created_by : this.state.info.jikmember,
											deleted_at : null,
											description : this.state.txtTitleJurnal,
											id : callback.data.id,
											title : this.state.txtTitleJurnal,
											updated_at : callback.data.updated_at,
										})
									}
									/* add LocalStorage */
									let addJurnalLS = new ComLocalStorage();
										addJurnalLS.setMultiple(
											[
												['@jik:catJurnalsaya', JSON.stringify({ data:listJurnal })],
											],
											(callbackLS)=>{
												this._Actions('setstate',{ sendJurnal:true, listJurnal:listJurnal, });
												let _dataJikAdd = callback.data;
													_dataJikAdd['deleted_at'] = null;
												Actions.JIKaddContent({ data:_dataJikAdd, dataAll:[], loginData:this.state.info, });

											}
										);
									/* concate state */
								}else{
									Alert.alert(
										'Informasi',
										"Tidak terhubung ke server",
										[
											{text: 'OK', onPress: () => { this._Actions('setstate',{ sendJurnal:true, }); } },
										],
										{ cancelable: false }
									);
								}
							});
					}else{
						this._Actions('setstate',{ sendJurnal:true, });
					}
				});

				break;
			case 'setstate':
				this.setState(data);
				break;
			case 'getListJurnal':
				this._getJurnal();
				break;
		    default:
		        return ()=>{ };
		}
	}

	imageCache(e){
		let img = e.source.uri;
		let imgComp = <View style={e.style}><Spinner/></View>;
		if(img !== null && typeof img !== "undefined"){
			Image.prefetch(img);
			imgComp = <Image
				style={e.style}
				source={e.source}
			/>
		}
		return imgComp;
	}

	_getJurnal(more){
		let update = 0;
		let articleView = "all";
		let list = null;
		let limitList = 10;
		let offset = 0;

		if (typeof more != 'undefined') {
			if (typeof more.offset != 'undefined') {
				offset = more.offset;
			}
		}

		var Param = {};

		let searchData = "";
		let typeData = "";

		Param['limit'] = limitList;
		Param['offset'] = offset;
		Param['join'] = 'jikMember,jurnal,IkaMemberProfile,like,share,comment;join:jikMember:ikaMember:ikaMemberProfile';
		Param['orderBy'] = 'id:desc';
		// Param['where'] = 'member_email:'+this.state.info.email+',deleted_at:null';/* null belum di perbaiki*/
		Param['where'] = 'member_email:'+this.state.info.email;

		let resource = api_uri+'JSON/JurnalPost?'+ArrayToQueryString(Param);
		let dataList = {};
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);
		newComFetch.setResource(resource);
		newComFetch.sendFetch((resp) => {
			// console.log(resp)
								if (resp.status == 200) {
									let dataSave = new Array();
									let dataView = this.state[articleView];
									let searchList = dataView.search;
									let _data = resp.data.data;
									let total = resp.data.count;

									let img = 'no-profil-pict-big.jpg?w=100&dir=_images_member';
									for (i in _data) {
										if (_data.hasOwnProperty(i)) {
											let jurnal_id = _data[i].jurnal_id;
											let jurnalpost = _data[i].id;
											let fileurl = "";
											let jpicon = "";
											let _type = _data[i].type ;
											let thumb = imgThumb+_data[i].ika_member_profile.data.profile_picture+'?w=100&dir=_images_member' ;
											let nama = _data[i].ika_member_profile.data.first_name+' '+_data[i].ika_member_profile.data.last_name;
											let jpsummary = _data[i].summary ;
											let jptitle = _data[i].title ;
											let jpdetail = _data[i].detail ;
											if (_data[i].detail !== "" && _data[i].detail !== null) {
												jpdetail = he.decode(_data[i].detail);
											}
											let jplike = _data[i].like.data.length;
											let jpshare = _data[i].share.data.length;
											let jpcomment = _data[i].comment.data;
											let jtitle = _data[i].jurnal.data.title;
											let jikdir = _data[i].jik_member.data.dir;
											let jpcreated_at = _data[i].created_at;
											let coverFile = null;

											let saveComent = [];
											if (jpcomment.length > 1) {
												for (var dc in jpcomment) {
													let jikMember = jpcomment[dc].jik_member;
													let thumbComment = "";
													if (typeof jikMember !== 'undefined' && jikMember !== null && jikMember !== false ) {
														thumbComment = imgThumb+jikMember.ika_member_profile.profile_picture+'?w=100&dir=_images_member' ;
														let comentnm = jikMember.ika_member_profile.first_name+' '+jikMember.ika_member_profile.last_name;
														if (jpcomment.hasOwnProperty(dc)) {
															saveComent.push({
																			thumb:thumbComment,
																			comment:jpcomment[dc].content,
																			created_at : jpcomment[dc].created_at,
																			comentnm : comentnm,
																		});
														}
													}

												}
											}

											if (_type == 'video') {
												fileurl = youtubeImg+_data[i].file+"/0.jpg"; // image youtube
												jpicon = "ios-videocam-outline";
												fileurlori = youtubeUri+_data[i].file ; // video youtube
												coverFile = _data[i].file;
												_type = "Video";
											}else if (_type == 'article') {
												fileurl = imgThumb+_data[i].file+'?w=400&dir='+jikdir+'&type=artikel' ;
												fileurlori = fileurl;
												jpicon = "ios-document-outline";
												coverFile = _data[i].file;
												_type = "Artikel";
											}else if(_type == 'photo' ){
												fileurl = imgThumb+_data[i].file+'?w=400&dir='+jikdir+'&type=photos' ;
												fileurlori = fileurl;
												jpicon = "ios-camera-outline";
												coverFile = _data[i].file;
												_type = "Foto";
											}


											console.log({
												jurnal_id:jurnal_id,
												coverFile:coverFile,
												jikdir:jikdir,
												jurnalpost:jurnalpost,
												fileurl : fileurl,
												fileurlori : fileurlori,
												type : _type,
												jpicon:jpicon,
												thumb : thumb,
												nama : nama,
												jtitle:jtitle,
												jpsummary : jpsummary,
												jptitle : jptitle,
												jpdetail : jpdetail,
												jplike : jplike,
												jpshare : jpshare,
												jpcomment : saveComent,
												jpcreated_at: jpcreated_at,
											})

											dataSave.push({
												jurnal_id:jurnal_id,
												coverFile:coverFile,
												jikdir:jikdir,
												jurnalpost:jurnalpost,
												fileurl : fileurl,
												fileurlori : fileurlori,
												type : _type,
												jpicon:jpicon,
												thumb : thumb,
												nama : nama,
												jtitle:jtitle,
												jpsummary : jpsummary,
												jptitle : jptitle,
												jpdetail : jpdetail,
												jplike : jplike,
												jpshare : jpshare,
												jpcomment : saveComent,
												jpcreated_at: jpcreated_at,
											})
										}
									}

									if (more == true) {
										more == false;
									}
									// Set list artikel, jika ini halaman selanjutnya concat halaman sebelumnya
									if (dataView['list'] != null ) {
										dataView = dataView['list'].concat( dataSave );
									}else{
										dataView = dataSave;
									}

									let setData = {};
										setData[articleView] = {
																	list: dataView,
																	limitList:10,
																	total: total,
																	search: searchList,
																	dataoffset: offset,
																};
										setData['more'] = false;
										let LCMessage = new ComLocalStorage;
											LCMessage.setMultiple(
												[
													['@jik:JurnalSaya',
													JSON.stringify({
																		list: dataView,
																		limitList:10,
																		total: total,
																		search: searchList,
																		dataoffset: offset,
																		update: update,
																	}) ],
												],
												(callback)=>{
													this.setState(setData);

                                                });


									if (searchData !== "") {
										let desc = "";
										if (_data.count > 0) {
											desc = "Sukses Data Ditemukan";
										}else{
											desc = "Data Tidak Ditemukan";
										}
										Alert.alert(
											'Notification',
											desc,
											[
												{text: 'OK', onPress: () => { } },
											],
											{ cancelable: false }
										);
									}

								}else{
									this.lcStorageCheck(more);
								}
								this._Actions("getJurnal");
							})
	}

	_reload(e){
		if (e) {
			this.setState({
				all:{
					list: null,
					limitList:10,
					dataoffset:0,
					total:0,
					search:"",
				},
			},()=>{
				this._getJurnal();
			});

		}
	}

	_onRefresh(){
		this.setState({
			all:{
				list: null,
				limitList:10,
				dataoffset:0,
				total:0,
				search:"",
			},
		},()=>{
			this._getJurnal();
		});
	}

	_viewData(){
		let active = 'all';
		let data = this.state[active];
		if (data.list == null) {
			return(
				<View style={{ paddingTop: 15, backgroundColor:'#f0f0f0', }}>
					<Spinner/>
				</View>
			);
		}else{
			let viewList = [];
			let dataEach = data.list;
			for (var i in dataEach) {
				if (dataEach.hasOwnProperty(i)) {
					let type = dataEach[i].type;

					let dataView = {
						cover_url :dataEach[i].fileurl ,
						compType:dataEach[i].type,
						uploader:{
									thumb:dataEach[i].thumb,
									nama:dataEach[i].nama,
									type:type+" di ",
									jptitle:dataEach[i].jtitle,
									date:dataEach[i].jpcreated_at,
									confJurnalSaya:{
										idpost : dataEach[i].jurnalpost,
									},
								},
						sosmed:{
							like:dataEach[i].jplike,
							share:dataEach[i].jpshare,
							lcoment:dataEach[i].jpcomment.length,
							comment:dataEach[i].jpcomment,
							userlike:{
								idpost:dataEach[i].jurnalpost,
								jikikamember:this.state.jikIkaMember,
							}
						},
						usercoment:{
										idpost:dataEach[i].jurnalpost,
										jikikamember:this.state.jikIkaMember,
									},
						detail:{
							title : dataEach[i].jptitle,
							desc : dataEach[i].jpsummary,
						},
						jurnaldetail:{
							jikdir:dataEach[i].jikdir,
							idpost:dataEach[i].jurnalpost,
							title: dataEach[i].jptitle,
							summary: dataEach[i].jtitle,
							desc: 'desc',
							jpdetail:dataEach[i].jpdetail,
							fileurlori : dataEach[i].fileurlori,
							cover_url : dataEach[i].cover_url,
							compType : dataEach[i].type,
							sosmed:{
								like:dataEach[i].jplike,
								share:dataEach[i].jpshare,
								lcoment:dataEach[i].jpcomment.length,
								comment:dataEach[i].jpcomment,
								userlike:{
									idpost:dataEach[i].jurnalpost,
									jikikamember:this.state.jikIkaMember,
								}
							},
							usercoment:{
											idpost:dataEach[i].jurnalpost,
											jikikamember:this.state.jikIkaMember,
										},
						},
						jurnalEdit:{
							content:dataEach[i],
							loginData:this.state.info,
							jurnal_id:dataEach[i].jurnal_id,
							cover:{
								uri:dataEach[i].fileurl,
								fileName : dataEach[i].coverFile,
							},
							stylewrapper:{ backgroundColor:'#F0F0F0',elevation:0,padding:15,margin:15,marginTop:0, paddingBottom:0, }
						}
					}
					viewList.push(<ItemList
						dataCount={i}
						key={i} data={dataView}
						reload={(e)=>{this._reload(e)}}
						comp={{ data:dataEach[i].type, video:false, }}
						itemCB={(e) => { this._itemCB(e); }}/>);
				}
			}
			// cek page terakhir
			let dataOffset = data.offset + 10;
			if (data.total > dataOffset) {

				const loadmoreColor = this.loadmoreColor.interpolate({
					inputRange:[0,1,2,3,4],
					outputRange:[
						'rgba(208,114,47,0)',
						'rgba(208,114,47,0.5)',
						'rgba(208,114,47,1)',
						'rgba(208,114,47,0.5)',
						'rgba(208,114,47,0)',
					]
				});

				const loadmoreScale = this.loadmoreScale.interpolate({
					inputRange:[0,1,2,3,4],
					outputRange:[
						0.75,
						0.85,
						1,
						0.85,
						0.75,
					]
				});

				if (this.dataTotal <= 0) {
					this.dataTotal = data.total;
				}
				if (this.state.more == true) {
					viewList.push(<Spinner key={this.dataTotal} />);
				}else{
					viewList.push(
						<TouchableHighlight underlayColor='transparent' key={this.dataTotal}
							style={{flexDirection:'row',justifyContent:'center',margin:15,marginTop:0}}
							onPress={()=>{
								this.setState({
									more:true
								}, ()=>{
									this._getJurnal({ offset:dataOffset })
								})
						}}>
							<Animated.Text style={{transform:[{scale:loadmoreScale}],color:loadmoreColor}}><Icon name='ios-arrow-round-down-outline' style={{fontSize:50, color:'#b76329', }}/></Animated.Text>
						</TouchableHighlight>
					);
				}
			}
			return (
				<View>
					{ viewList }
				</View>
			);
		}
	}

	addListJurnal(){
		let active = 'all';
		let dataViewAll = this.state[active];

		let dataViewList = [];
		let dataView = <View/>;
		let dataListView = <View/>;
		let listSpinnerView = <View/>
		let spinner = <View style={[{ padding:15, backgroundColor:'#e0e0e0', }, this.styleIco.wrappList]}>
						<View style={{ borderWidth:1, borderColor:'#d0d0d0', padding:15, flexDirection:'row', flex:1, alignItems:'center', alignSelf:'center', }}>
							<View style={{ flex:1, }}>
								<Spinner/>
							</View>
						</View>
					</View>

		let dataEmpty = <View style={[{ padding:15, backgroundColor:'#e0e0e0', }, this.styleIco.wrappList]}>
						<View style={{ borderWidth:1, borderColor:'#d0d0d0', padding:15, flexDirection:'row', flex:1, alignItems:'center', alignSelf:'center', }}>
							<View style={{ flex:1, }}>
								<Text>Jurnal Masih Kosong</Text>
							</View>
						</View>
					</View>
		let dataAdd = <View/>
		if (this.state.sendJurnal) {
			dataAdd = <View style={[{ padding:15, backgroundColor:'#e0e0e0', }, this.styleIco.wrappAdd]}>
						<View style={{ borderWidth:1, borderColor:'#d0d0d0', padding:15, flexDirection:'row', flex:1, alignItems:'center', alignSelf:'center', }}>
							<View style={{ flex:1, }}>
								<TextInput
									placeholder="Nama Jurnal"
									underlineColorAndroid="transparent"
									onChangeText={(text) => this.setState({txtTitleJurnal:text})}
									style={{ padding:0, margin:0, flex:1 }}
								/>
							</View>
							<View>
								<TouchableHighlight underlayColor='transparent' onPress={()=>{ this._Actions("sendJurnal") }}>
									<View style={{ flexDirection:'row', }}>
										<View style={{ padding:5, paddingTop:0, paddingBottom:0, borderLeftWidth:1, borderColor:'#d0d0d0', }} >
											<Icon style={{ textAlign:'center', color:'#a0a0a0', fontSize:20, }} name="ios-add-outline"/>
										</View>
										<View style={{ padding:5, paddingTop:0, paddingBottom:0, borderColor:'#d0d0d0', }} >
											<Text>Simpan Jurnal</Text>
										</View>
									</View>
								</TouchableHighlight>
							</View>
						</View>
					</View>
			}else{
				dataAdd = <View style={[{ padding:15, backgroundColor:'#e0e0e0', }, this.styleIco.wrappAdd]}>
							<View style={{ borderWidth:1, borderColor:'#d0d0d0', padding:15, flexDirection:'row', flex:1, alignItems:'center', alignSelf:'center', }}>
								<View style={{ flex:1, }}>
									<Spinner/>
								</View>
							</View>
						</View>;
			}

			listSpinnerView = this.state.listSpinner ? spinner : dataEmpty;

		/* data listJurnal */
		let dataListJurnal = this.state.listJurnal;
		for (var i in dataListJurnal) {
			if (dataListJurnal.hasOwnProperty(i)) {
				let styleWrapper = { marginTop:0, }
				if (i > 0) {
					styleWrapper = { marginTop:15, }
				}
				dataViewList.push(
					<ListJurnal
						key={i}
						data={{
							headList:dataListJurnal[i],
							dataStyle:styleWrapper,
							dataAll:this.state.listJurnal,
							loginData:this.state.info
						}}
					/>
				);
			}
		}

		let dataList = <View style={[{ padding:15, backgroundColor:'#e0e0e0', flex:1 }, this.styleIco.wrappList]}>
						{ dataViewList }
					</View>

		dataListView = this.state.listJurnal == null ? listSpinnerView : dataList;

		dataView = this.state.list == false ? dataAdd : dataListView;

		let dataListFirst =	<View style={{ marginBottom:15, }}>
						<View>
							<Text style={{ textAlign:'center' }}>Selamat datang di Jurnal Indonesia Kaya</Text>
						</View>
						<View style={{ flexDirection:'row', flexWrap:'wrap', alignItems:'center', alignSelf:'center', marginTop:10, }}>
							<View>
								<Text>Yuk mulai buat </Text>
							</View>
							<View>
								<TouchableHighlight underlayColor='transparent' onPress={()=>{ this._Actions("jurnalAdd")}}>
									<View>
										<Text style={{ textDecorationLine : "underline" }}>buat jurnal</Text>
									</View>
								</TouchableHighlight>
							</View>
							<Text style={{ textAlign:'center' }}> kamu, atau </Text>
							<Text style={{ textAlign:'center', fontWeight:'bold', }}>follow</Text>
						</View>
						<View>
							<Text style={{ textAlign:'center' }}> member yang diinginkan.</Text>
						</View>
					</View>
		let _firstApp = dataViewList.length == 0 ? dataListFirst : <View/>;

		return(
				<View style={{ flex:1 }}>
					<View>
						{ _firstApp }
					</View>
					<View style={{ flex:1 }}>
						<View style={{ flexDirection:'row', flex:1, alignItems:'center', alignSelf:'center', backgroundColor:'#fff', borderColor:'#d0d0d0', }}>
							<View style={{ flex:1, padding:15, }}>
								<Text>Tambah Jurnal Baru</Text>
							</View>
							<View style={{ flexDirection:'row', paddingTop:15, paddingBottom:15, }}>
								<TouchableHighlight underlayColor='transparent' onPress={()=>{ this._Actions("jurnalList")}}>
									<View style={{ padding:15, borderRightWidth:1, paddingTop:0, paddingBottom:0, borderColor:'#d0d0d0', }}>
										<Icon style={this.styleIco.list} name="ios-list-outline"/>
									</View>
								</TouchableHighlight>
								<TouchableHighlight underlayColor='transparent' onPress={()=>{ this._Actions("jurnalAdd")}}>
									<View style={{ padding:15, paddingTop:0, paddingBottom:0, }}>
										<Icon style={this.styleIco.add} name="ios-add-outline"/>
									</View>
								</TouchableHighlight>
							</View>
						</View>
						{ dataView }
					</View>
				</View>
		)
	}

	_refreshControl(ScrollView){
		return(
			<RefreshControl
				title=' '
				titleColor={Styles.ScrollView.titleColor}
				tintColor={Styles.ScrollView.tintColor}
				colors={Styles.ScrollView.colors}
				progressBackgroundColor={Styles.ScrollView.progressBackgroundColor}
				refreshing={false}
				onRefresh={this._onRefresh.bind(this)}
			/>
		);
	}

    render() {
		/* let uriImage = "https://i.ytimg.com/vi/feoRIr5MNHM/maxresdefault.jpg"; */
		let uriImage = this.state.info.thumbme;
        return (
			<View>
				
				<View style={{ flex:1, marginBottom:45, backgroundColor:'#F0F0F0', }}>
					<ScrollView onScroll={this.props.hideBtnOnScroll} refreshControl={this._refreshControl()} ref='ScrollView'>

						<View>
							<View>
								{/* image cover */}
								{ this.imageCache({ style:{ height:this.dim2, }, source:{ uri: uriImage } }) }
								{/* image cover */}
							</View>

							<View style={{ padding:15, paddingBottom:0, }}>
								{ this.addListJurnal() }
							</View>

							<View style={{ flex:1 }}>
							{/* List Jurnal */}
								{ this._viewData() }
							{/* List Jurnal */}
							</View>
						</View>

					</ScrollView>
				</View>
				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

			</View>
        );
    }

}
