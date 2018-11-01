import React, { Component } from 'react';
import {
	Text,
	View,
	ScrollView,
	RefreshControl,
	Dimensions,
	TouchableHighlight,
	Animated,
	Alert,
	NetInfo,
	Easing
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import he from 'he';

import { StyleProvider, Button, Spinner, Tab, Tabs, TabHeading, Input, Icon } from 'native-base';
import { base_url, api_uri, imgThumb, youtubeUri, youtubeImg, noCover } from '../../comp/AppConfig';
import Styles from '../../comp/Styles';
import getTheme from '../../../native-base-theme/components';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ComLocalStorage from '../../comp/ComLocalStorage';
import ItemList from '../CompItemList/ItemList';
import FooterSM from '../FooterSM';

import Loading from '../../comp/Loading';
import Spinn from '../../comp/Spinn';


export default class Home extends Component {
	btnLoadmore = <Spinn/>;
	dataTotal = 0;

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props) {
		super(props);

		this.loadmoreColor = new Animated.Value(0);
		this.loadmoreScale = new Animated.Value(0);

		this.state = {
			ScrollView:this.refs.ScrollView,
			more:false,
			all:{
				list: null,
				limitList:10,
				offset:0,
				total:0,
				search:"",
				update: 0,
			},
			photo:{
				list: null,
				limitList:10,
				offset:0,
				total:0,
				search:"",
				update: 0,
			},
			video:{
				list: null,
				limitList:10,
				offset:0,
				total:0,
				search:"",
				update: 0,
			},
			article:{
				list: null,
				limitList:10,
				offset:0,
				total:0,
				search:"",
				update: 0,
			},
			articleView:'all',
			search:"",
			data_login: false,
			jikIkaMember: false,
			follow:{
				first:false,
				more:false
			}
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
						(e)=>{
							if (jikMember.data[0].ika_member_profile.data.profile_picture !== null) {
								thumbme = jikMember.data[0].ika_member_profile.data.profile_picture;
							}
							this.setState({
								jikIkaMember:{
									thumbme : imgThumb+thumbme+'?w=100&dir=_images_member',
									jikmember : jikMember.data[0].member_id,
									ikamember : jikMember.data[0].ika_member.data.member_id,
									email : jikMember.data[0].email,
								},
							})
						}
					);
				}
			}
		});
	}

	_loadmoreColor(){
		this.loadmoreColor.setValue(0);
		Animated.timing(
			this.loadmoreColor,{
				toValue:4,
				duration:2000,
				easing:Easing.linear
			}
		).start(()=>this._loadmoreColor());
	}

	_loadmoreScale(){
		this.loadmoreScale.setValue(0);
		Animated.timing(
			this.loadmoreScale,{
				toValue:4,
				duration:2000,
				easing:Easing.linear
			}
		).start(()=>this._loadmoreScale());
	}

	componentDidMount(){
		/* LocalStorage Checker */
		this.lcStorageCheck();
		this.setState({
			ScrollView:this.refs.ScrollView
		},()=>{
			this._loadmoreColor();
			this._loadmoreScale();
		});

	}

	componentWillMount(){
		if (this.props.drawerStatus) {
			Actions.refresh({key:'JIKdrawer',open:value=>false});
		}
	}

	_dataCallbak(e){
		if(e.refresh){
			this._onRefresh();
		}
	}

	_viewData(){
		let active = this.state.articleView;
		let data = this.state[active];
		let notFound = <View><Text>Data Tidak ditemukan</Text></View>
		if (data.list == null || !this.state.follow.first) {
			return <Spinn />;
		}
		else{
			let viewList = new Array();
			let dataEach = data.list;
			for (let i in dataEach) {
				if (dataEach.hasOwnProperty(i)) {
					let dataView = {
						cover_url :dataEach[i].fileurl ,
						compType:dataEach[i].type,
						icon:dataEach[i].jpicon,
						profil:{
							follow:dataEach[i].follow,
							thumb:dataEach[i].thumb,
							nama:dataEach[i].nama,
							jptitle:dataEach[i].jptitle,
							jpsummary:dataEach[i].jpsummary,
							jplike:dataEach[i].jplike,
							userlike:{
								idpost:dataEach[i].jurnalpost,
								jikikamember:this.state.jikIkaMember,
							},
						},
						ikaprofile:dataEach[i].ikaprofile,
						jurnaldetail:{
							jikdir:dataEach[i].jikdir,
							idpost:dataEach[i].jurnalpost,
							title: dataEach[i].jptitle,
							summary: dataEach[i].jtitle,
							desc: 'desc',
							jpdetail:dataEach[i].jpdetail,
							cover_url :dataEach[i].fileurl ,
							fileurlori : dataEach[i].fileurlori,
							compType:dataEach[i].type,
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
						}
					};

					viewList.push(<ItemList key={i} data={dataView} comp={{ data:dataEach[i].type, video:false, }} from={'home'} itemCB={(e)=>{ this._dataCallbak(e); }}/>);
				}
			}

			// cek page terakhir
			let dataOffset = data.offset + 10

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
					viewList.push(<Spinn key={this.dataTotal} />);
				}
				else{
					viewList.push(
						<TouchableHighlight underlayColor='transparent'
							key={this.dataTotal}
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

			viewList = dataEach.length > 0 ? viewList : <View><Text style={{ textAlign:'center' }}>Data Tidak ditemukan</Text></View>;


			return viewList;
		}
	}

	_getJurnal(more){
		let update = 0;
		let lsView = "@jik:"+this.state.articleView+"Home";
		let articleView = this.state.articleView;
		let list = null;
		let limitList = 10;
		let offset = 0;

		if (typeof more != 'undefined') {
			if (typeof more.offset != 'undefined') {
				offset = more.offset;
			}
			if (typeof more.search != 'undefined') {
				this.setState(more.search);
			}
		}

        let Param = {};
		let searchData = "";
		let typeData = "";

		Param['limit'] = limitList;
        Param['offset'] = offset;
        Param['join'] = 'jikMember,jurnal,IkaMemberProfile,like,share,comment;join:jikMember:ikaMember:ikaMemberProfile';
		Param['orderBy'] = 'id:desc';

		if (this.state.search !== "") {
			let search = this.state.search;
			searchData = 'title:like:'+search;
		}

		if (articleView !== "" && articleView !== "all") {
			let search = articleView;
			typeData = 'type:'+search;
		}

		if (searchData !== "" && typeData !== "") {
			Param['where'] = typeData+','+searchData;
		}else{
			if (typeData !== "") {
				Param['where'] = typeData;
			}else if (searchData !== ""){
				Param['where'] = searchData;
			}
		}

        let resource = api_uri+'JSON/JurnalPost?'+ArrayToQueryString(Param);
		let dataList = {};
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);
		newComFetch.setResource(resource);
		newComFetch.sendFetch((resp) => {
			// alert(JSON.stringify(resp))
			if (resp.status == 200) {
				let dataSave = new Array();
				let dataView = this.state[articleView];
				let searchList = dataView.search;
				let _data = resp.data.data;
				let total = resp.data.count;

				let img = 'no-profil-pict-big.jpg?w=100&dir=_images_member';

				for (let i in _data) {
					if (_data.hasOwnProperty(i)) {
						if (_data[i].jik_member.data !== null && _data[i].jik_member.data.dir !== "undefined") {
							let jurnalpost = _data[i].id;
							let fileurl = "";
							let fileurlori = "";
							let jpicon = "";
							let _type = _data[i].type ;
							let _file = "";
							let thumb = imgThumb+'no-profil-pict-big.jpg?w=100&dir=_images_member';
							let fname = "";
							let mname = "";
							let lname = "";
							if (_data[i].ika_member_profile.data !== null) {
								thumb = imgThumb+_data[i].ika_member_profile.data.profile_picture+'?w=100&dir=_images_member' ;
								fname = _data[i].ika_member_profile.data.first_name;
								/* mname = _data[i].ika_member_profile.data.first_name; */
								lname = _data[i].ika_member_profile.data.last_name;
							}
							let nama = fname+" "+mname+" "+lname;
							let jpsummary = _data[i].summary ;
							let jptitle = _data[i].title ;
							let jpdetail = _data[i].detail ;
							if (_data[i].detail !== "" && _data[i].detail !== null) {
								jpdetail = he.decode(_data[i].detail);
							}
							let jplike = _data[i].like.data.length;
							let jpshare = _data[i].share.data.length;
							let jpcomment = _data[i].comment.data;
							let jtitle = _data[i].jurnal.data !== null ? _data[i].jurnal.data.title : "";
							let jikdir = _data[i].jik_member.data.dir;

							let saveComent = [];
							if (jpcomment.length > 1) {
								for (var dc in jpcomment) {
									let jikMember = jpcomment[dc].jik_member;
									let thumbComment = "";
									if (typeof jikMember !== 'undefined' && jikMember !== null && jikMember !== false ) {
										let thumbme = "no-profil-pict-big.jpg";
										if (jikMember.ika_member_profile.profile_picture !== null) {
											thumbme = jikMember.ika_member_profile.profile_picture;
										}
										thumbComment = imgThumb+thumbme+'?w=100&dir=_images_member' ;
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

							let ikaprofile = {
								ikamember:_data[i].ika_member_id,
								jikmember:_data[i].created_by,
								emailmember:_data[i].member_email
							};

							if (_type == 'video') {
								fileurl = youtubeImg+_data[i].file+"/0.jpg"; // image youtube
								jpicon = "ios-videocam-outline";
								fileurlori = youtubeUri+_data[i].file ; // video youtube
								_file = _data[i].file;
							}else if (_type == 'article') {
								fileurl = imgThumb+_data[i].file+'?w=400&dir='+jikdir+'&type=artikel' ;
								fileurlori = fileurl;
								jpicon = "ios-document-outline";
								_file = _data[i].file;
							}else if(_type == 'photo' ){
								fileurl = imgThumb+_data[i].file+'?w=400&dir='+jikdir+'&type=photos' ;
								fileurlori = fileurl;
								jpicon = "ios-camera-outline";
								_file = _data[i].file;
							}
							dataSave.push({
								follow: false,
								jikdir:jikdir,
								jurnalpost:jurnalpost,
								ikaprofile: ikaprofile,
								file : _file,
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
							})
						}
					}
				}

				// Set list artikel, jika ini halaman selanjutnya concat halaman sebelumnya
				if (dataView['list'] != null ) {
					dataView = dataView['list'].concat( dataSave );
				}else{
					dataView = dataSave;
				}

				let setData = [];
					setData[articleView] = {
						list: dataView,
						limitList:10,
						offset:offset,
						total: total,
						search: searchList,
						update: update,
					};

				let LCMessage = new ComLocalStorage;
					LCMessage.setMultiple(
						[
							[
								lsView,
								JSON.stringify({
									list: dataView,
									limitList:10,
									total: total,
									search: searchList,
									offset: offset,
									update: update,
								})
							],
						],
						(callback)=>{
							if(this.state.jikIkaMember){
								this.follow(setData[articleView])
							}else{
								setData['more'] = false;
								setData['follow'] = {
									first:true,
									more:false
								};
								this.setState(setData)
							}

					});

				if (searchData !== "") {
					let desc = "";
					if (_data.length > 0) {
						desc = "Sukses Data Ditemukan";
					}else{
						desc = "Data Tidak Ditemukan";
					}
					// Alert.alert(
					// 	'Notification',
					// 	desc,
					// 	[
					// 		{text: 'OK', onPress: () => { } },
					// 	],
					// 	{ cancelable: false }
					// );
				}

			}else{
				/* Local Storage Checker */
				let LStorageWr = new ComLocalStorage();
					LStorageWr.getMultiple(
						[
							'@jik:jikIkaMember',
							lsView,
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

							let list 			= false;
							let jikIkaMember 	= dataArr['@jik:jikIkaMember'];
							let JurnalSaya 		= dataArr[lsView];
							let articleView		= this.state.articleView;
							if(jikIkaMember !== null && typeof jikIkaMember !== 'undefinded'){
								let profile_cover 	= jikIkaMember.ika_member_profile.data.profile_cover == "no-cover-member.jpg" ? noCover+"?w="+this.dimx2 : imgThumb+jikIkaMember.ika_member_profile.data.profile_cover+"?w="+this.dimx2+"&dir=_images_member"
									jikIkaMember 	= {
														dir:jikIkaMember.dir,
														thumbme : profile_cover,
														jikmember : jikIkaMember.member_id,
														ikamember : jikIkaMember.ika_member.data.member_id,
														email : jikIkaMember.email,
													}
							}else{
								jikIkaMember = false;
							}


							this.setState({
								info:jikIkaMember,
								jikIkaMember:jikIkaMember,
							},()=>{
								let firstLoad = 0;
								let lastLoad = 0;
								let setData = {};
								/* first load data */
								if (JurnalSaya == null || typeof JurnalSaya == 'undefined') {
									// this._getJurnal();
								}else{
									if(typeof more == 'undefined'){
										list 	= JurnalSaya.list;
										if(list.length < 1){

										}else{
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
																		update:0,
																	};
											setData['more'] = false;
											setData['follow'] = {
													first:true,
													more:false
												};
											this.setState(setData);
										}
									}else{
										/* loadmore */
										if(more.offset !== 'undefined'){
											lastLoad = 10 + more.offset;
											if (JurnalSaya.list.length >= lastLoad) {
												firstLoad = 0;
												list = JurnalSaya.list.slice(firstLoad, lastLoad);

												setData[articleView] = {
																			list: list,
																			total: JurnalSaya.total,
																			search: JurnalSaya.search,
																			limitList:10,
																			offset:more.offset,
																			update:0,
																		};
												setData['more'] = false;
												setData['follow'] = {
													first:true,
													more:false
												};
												this.setState(setData);

											}else{
												// this._getJurnal();
											}
										}
									}
								}
							});
						}
					)
				// Alert.alert(
				// 	'Informasi',
				// 	"Tidak terhubung ke server",
				// 	[
				// 		{text: 'OK', onPress: () => { } },
				// 	],
				// 	{ cancelable: false }
				// );
			}
		})
    }

	follow(e){
		let following_id = "";
		let follow = {};
		let dataList = e.list;
		for (let i in dataList) {
			if (dataList.hasOwnProperty(i)) {
				let element = dataList[i];
				following_id += element.ikaprofile.jikmember+";";
			}
		}

		if(this.state.jikIkaMember){
			// https://www.indonesiakaya.com/4p1App5/public/api/JSON/JurnalFollow?where=member_id:22&whereIn=following_id:4;1192;
			let resource = api_uri+'JSON/JurnalFollow?where=member_id:'+this.state.jikIkaMember.jikmember+'&whereIn=following_id:'+following_id;
			let newComFetch = new ComFetch();
			newComFetch.setHeaders({Authorization:this.jwt_signature});
			newComFetch.setRestURL(base_url);
			newComFetch.setResource(resource);
			newComFetch.sendFetch((resp) => {
				if(resp.status = 200){
					if(resp.data.count){
						let dFollow = resp.data.data;

						for (let i in dFollow) {
							if (dFollow.hasOwnProperty(i)) {
								let eFollow = dFollow[i];
								follow[eFollow.following_id] = dFollow[i];
							}
						}
					}

					for (let iR in dataList) {
						if (dataList.hasOwnProperty(iR)) {
							let rFolow = dataList[iR];
							let jikMember = rFolow.ikaprofile.jikmember;
							let memberCheck = follow[jikMember];
							let descFollow = false;
							if(typeof memberCheck !== "undefined" && jikMember !== this.state.jikIkaMember.jikmember){
								descFollow = "Berhenti Mengikuti";
							}else if( this.state.jikIkaMember.jikmember !== jikMember){
								descFollow = "Mengikuti";
							}
							descFollow = resp.data.count ? descFollow : "Mengikuti";
							let keys = iR;
								// console.log(jikMember+" <= JikMember | descFollow => "+iR+" "+memberCheck,descFollow)
							dataList[keys].follow = descFollow;
						}
					}

					let xyz = e;
						xyz.list = dataList;
					let articleView = this.state.articleView;
					let setData = [];
						setData[articleView] = xyz;
						setData['more'] = false;
						setData['follow'] = {
							first:true,
							more:false
						};

					this.setState(setData,()=>{
						// console.log("setData => ",setData);
					});
				}
			});
		}
	}

	lcStorageCheck(more){
		let lsView = "@jik:"+this.state.articleView+"Home";
		let articleView = this.state.articleView;
		/* Local Storage Checker */
		let LStorage = new ComLocalStorage();
		LStorage.getMultiple(
			[
				'@jik:jikIkaMember',
				lsView,
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

				let list 			= false;
				let jikIkaMember 	= dataArr['@jik:jikIkaMember'];
				let JurnalSaya 		= dataArr[lsView];
				let articleView		= this.state.articleView;
				if(jikIkaMember !== null && typeof jikIkaMember !== 'undefinded'){
					let profile_cover 	= noCover+"?w="+this.dimx2;
					if(jikIkaMember.ika_member_profile.data !== null){
						profile_cover 	= jikIkaMember.ika_member_profile.data.profile_cover == "no-cover-member.jpg" ? noCover+"?w="+this.dimx2 : imgThumb+jikIkaMember.ika_member_profile.data.profile_cover+"?w="+this.dimx2+"&dir=_images_member"
					}
					jikIkaMember = {
						dir:jikIkaMember.dir,
						thumbme : profile_cover,
						jikmember : jikIkaMember.member_id,
						ikamember : jikIkaMember.ika_member.data.member_id,
						email : jikIkaMember.email,
					}
				}else{
					jikIkaMember = false;
				}

				this.setState({
					info:jikIkaMember,
					jikIkaMember:jikIkaMember,
				},()=>{
					NetInfo.isConnected.fetch().then(isConnected => {
						if(isConnected){
							this._getJurnal();
						}else{
							let firstLoad = 0;
							let lastLoad = 0;
							let setData = {};
							/* first load data */
							if (JurnalSaya == null || typeof JurnalSaya == 'undefined') {
								this._getJurnal();
							}else{
								if(typeof more == 'undefined'){
									list 	= JurnalSaya.list;
									if(list.length < 1){
										this._getJurnal();
									}else{
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
											update:0,
										};
										setData['more'] = false;
										this.setState(setData);
									}
								}else{
									/* loadmore */
									if(more.offset !== 'undefined'){
										lastLoad = 10 + more.offset;
										if (JurnalSaya.list.length >= lastLoad) {
											firstLoad = 0;
											list = JurnalSaya.list.slice(firstLoad, lastLoad);

											setData[articleView] = {
												list: list,
												total: JurnalSaya.total,
												search: JurnalSaya.search,
												limitList:10,
												offset:more.offset,
												update:0,
											};
											setData['more'] = false;
											setData['follow'] = {
												first:true,
												more:false
											};
											this.setState(setData);
										}else{
											this._getJurnal(more);
										}
									}
								}
							}
						}
					});
				});
			}
		)
	}

	_onChangeTab(e){
		let articleView = false;
		switch(e.i) {
		    case 0:
				articleView ='all';
		        break;
		    case 1:
				articleView ='article';
		        break;
			case 2:
				articleView ='photo';
				break;
			case 3:
				articleView ='video';
				break;
		    default:
				articleView ='all';
		}
		let setData = { articleView:articleView };

		let nowSearch = this.state.search !== this.state[articleView].search ? false : true;

		this.setState(
			setData,
			() => {
				if (nowSearch == false) {
					let dataList = [];
					dataList[articleView] = {
						list: null,
						limitList:10,
						offset:0,
						total:0,
						search:this.state.search,
					};
					this._getJurnal({ search:dataList });
				}
				if (this.state[articleView].list == null) {
					this._getJurnal();
				}
			}
		);
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

	_onRefresh(){
		this.setState({
			all:{
				list: null,
				limitList:10,
				offset:0,
				total:0,
				search:"",
				update: 0,
			},
			photo:{
				list: null,
				limitList:10,
				offset:0,
				total:0,
				search:"",
				update: 0,
			},
			video:{
				list: null,
				limitList:10,
				offset:0,
				total:0,
				search:"",
				update: 0,
			},
			article:{
				list: null,
				limitList:10,
				offset:0,
				total:0,
				search:"",
				update: 0,
			},
			search:"",
			jurnalList:{
				"all": {
					text : 'All',
					status : 'active',
					value : '',
				},
				"Foto": {
					text : 'Foto',
					status : 'inactive',
					value : 'photo',
				},
				"Video": {
					text : 'Video',
					status : 'inactive',
					value : 'video',
				},
				"Artikel": {
					text : 'Artikel',
					status : 'inactive',
					value : 'article',
				},
			}
		}, () => {
			this._getJurnal();
		});
	}

	_search(){
		// console.log("_search connected");
		NetInfo.isConnected.fetch().then(isConnected => {
			// alert(isConnected ? 'online' : 'offline')
			// if(isConnected){
				// console.log("connected");
				let articleView = this.state.articleView;
				let search = this.state.search;
				let dataList = [];
				dataList[articleView] = {
					list: null,
					limitList:10,
					offset:0,
					total:0,
					search:"",
				};
				this.setState(dataList,()=>{ this._getJurnal() });
			// }
			// else{
			// 	// console.log("not connected")
			// 	Alert.alert(
			// 		'Informasi',
			// 		"Koneksi anda terpututs",
			// 		[
			// 			{text: 'OK', onPress: () => { } },
			// 		],
			// 		{ cancelable: false }
			// 	);
			// }
		});
	}

	render(){
		return(
			<View>
				
				{/*<ScrollView onScroll={this.props.hideBtnOnScroll} refreshControl={this._refreshControl()} ref='ScrollView'>*/}
				<ScrollView  refreshControl={this._refreshControl()} ref='ScrollView'>

					<View style={{ padding:15, backgroundColor:'#f0f0f0', }}>
						<View style={{ flex:1, flexDirection:'row', borderColor:'#e0e0e0', borderWidth:1, marginBottom:15, }}>
							<Input
								style={{ flex:1, paddingLeft:15, paddingBottom:0, paddingTop:0, color:'#777777', }}
								placeholderTextColor={"#c0c0c0"}
								caretHidden={false}
								placeholder="Cari" onChangeText={(text) => this.setState({ search: text, })} value={ this.state.search }
							/>
							<Button transparent style={{ alignItems: 'flex-end', borderRadius:0, }} onPress={()=>{ this._search() }}>
								<Icon style={{ fontSize:30, color:'#c0c0c0', }} name='ios-arrow-round-forward-outline' />
							</Button>
						</View>
					</View>

					{/* start article */}

					<View style={{minHeight:Dimensions.get('window').height/2,backgroundColor:'#f0f0f0'}}>
						<View>
							<Tabs style={{backgroundColor:'#f0f0f0'}} onChangeTab={(e)=>this._onChangeTab(e)}>
								<Tab style={{marginTop:15,backgroundColor:'#f0f0f0'}} heading={<TabHeading style={{backgroundColor:'#fff', }} activeTextStyle={{borderBottomWidth:5,borderBottomColor:'#000',fontWeight:'bold'}}><Text>All</Text></TabHeading>}>
									{ this._viewData() }
								</Tab>
								<Tab style={{marginTop:15,backgroundColor:'#f0f0f0'}} heading={<TabHeading style={{backgroundColor:'#fff', }} activeTextStyle={{borderBottomWidth:5,borderBottomColor:'#000',fontWeight:'bold'}}><Text>Artikel</Text></TabHeading>}>
									{ this._viewData() }
								</Tab>
								<Tab style={{marginTop:15,backgroundColor:'#f0f0f0'}} heading={<TabHeading style={{backgroundColor:'#fff', }} activeTextStyle={{borderBottomWidth:5,borderBottomColor:'#000',fontWeight:'bold'}}><Text>Foto</Text></TabHeading>}>
									{ this._viewData() }
								</Tab>
								<Tab style={{marginTop:15,backgroundColor:'#f0f0f0'}} heading={<TabHeading style={{backgroundColor:'#fff', }} activeTextStyle={{borderBottomWidth:5,borderBottomColor:'#000',fontWeight:'bold'}}><Text>Video</Text></TabHeading>}>
									{ this._viewData() }
								</Tab>
							</Tabs>
						</View>
					</View>

					{/* end article */}
					<FooterSM ScrollView={this.state.ScrollView}/>
				</ScrollView>
				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

			</View>
		);
	}
}
