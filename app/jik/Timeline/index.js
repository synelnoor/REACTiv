// Import dependencies
import React, { Component } from 'react';

import {
	Text,
	View,
	ScrollView,
	RefreshControl,
	Dimensions,
	TouchableHighlight,
	Animated,
	NetInfo,
	Platform,
	Easing
} from 'react-native';

import { StyleProvider, Spinner, Icon, } from 'native-base';
import { base_url, api_uri, imgThumb, youtubeUri, youtubeImg } from '../../comp/AppConfig';
import Styles from '../../comp/Styles';
import getTheme from '../../../native-base-theme/components';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ComLocalStorage from '../../comp/ComLocalStorage';
import ItemList from '../CompItemList/ItemList';
import FooterBtm from '../FooterBtm';
import FooterSM from '../FooterSM';
import he from 'he';

export default class Timeline extends Component{

	btnLoadmore = <Spinner/>
	dataTotal = 0;
	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
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
			},

			articleView:'all',
			search:"",

			data_login: false,
			jikIkaMember: false,
			ikaprofil : false,

			net:{
					status:false,
					data:{ left:0, right:0 }
				},
		}
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
		this.setState({
			ScrollView:this.refs.ScrollView},
			()=>{
				this._loadmoreColor();
				this._loadmoreScale();
		});
		
		NetInfo.isConnected.fetch().then(isConnected => {
            let net = {
                ios: isConnected ? { top:0, left:0, right:0, } : { left:0, right:0 },
                android: !isConnected ? { top:0, left:0, right:0, } : { left:0, right:0 }
            };
            let status = {
                ios: isConnected,
                android: isConnected
            };
			this.setState({
				net : {
					status:isConnected,
					data:(Platform.OS === 'ios') ? net.ios : net.android
				},
			})
		});
	}

	componentWillMount(){
		if(this.props.data !== false && typeof this.props.data !== "undefined")
		{

			let LocalStorage = new ComLocalStorage();
			LocalStorage.getItem((e) => {
				let jikIkaMember = false;
				let user_info_parsed = false;
				if (
					typeof e.data == 'object' &&
					typeof e.data.user_info == 'string' &&
					JSON.stringify(this.state.data_login) != e.data.user_info
				) {
					user_info_parsed = JSON.parse(e.data.user_info);
					if (typeof e.data.jikIkaMember !== 'undefined') {
						jikIkaMember = JSON.parse(e.data.jikIkaMember);
						jikIkaMember = {
										thumbme : imgThumb+jikIkaMember.ika_member_profile.data.profile_picture+'?w=100&dir=_images_member',
										jikmember : jikIkaMember.member_id,
										ikamember : jikIkaMember.ika_member.data.member_id,
										email : jikIkaMember.email,
									}
					}
				}
				this.setState({
					data_login: user_info_parsed,
					jikIkaMember: jikIkaMember,
					ikaprofil : this.props.data,
				},()=>{
					this._getJurnal();
				});

			});

		}
	}

	_viewData(){
		let active = this.state.articleView;
		let data = this.state[active];
		if (data.list == null) {
			return <Spinner/>;
		}else{
			let viewList = new Array();
			let dataEach = data.list;
			for (var i in dataEach) {
				if (dataEach.hasOwnProperty(i)) {
					let type = dataEach[i].type;
						videoView = dataEach[i].type !== "video" ? false : true;
					let dataView = {
						cover_url :dataEach[i].fileurl ,
						compType:dataEach[i].type,
						uploader:{
									thumb:dataEach[i].thumb,
									nama:dataEach[i].nama,
									type:type+" di ",
									jptitle:dataEach[i].jtitle,
									date:dataEach[i].jpcreated_at,
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
					}

					viewList.push(<ItemList key={i} data={dataView} comp={{ data:dataEach[i].type, video:false, }} from='timeline' />);

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

			return viewList;
		}
	}

	_getJurnal(more){
		let articleView = this.state.articleView;
		let list = null;
		let limitList = 10;
		let offset = 0;

		if (typeof more != 'undefined') {
			offset = more.offset;
		}

        var Param = {};

		let searchData = "";
		let typeData = "";

		Param['limit'] = limitList;
        Param['offset'] = offset;
        Param['join'] = 'jikMember,jurnal,IkaMemberProfile,like,share,comment;join:jikMember:ikaMember:ikaMemberProfile';
		Param['orderBy'] = 'id:desc';


		if (typeof this.state.ikaprofil.emailmember !== "undefined" && this.state.ikaprofil.emailmember !== false) {
			let search = this.state.ikaprofil.emailmember;
			Param['where'] = 'member_email:'+search;
		}


        let resource = api_uri+'JSON/JurnalPost?'+ArrayToQueryString(Param);
		let dataList = {};
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);

		// Ambil data Article
		newComFetch.setResource(resource);
		newComFetch.sendFetch((resp) => {
                                if (resp.status == 200) {
									let dataSave = new Array();
									let dataView = this.state[articleView];
									let _data = resp.data.data;
									let total = resp.data.count;

									let img = 'no-profil-pict-big.jpg?w=100&dir=_images_member';

									for (i in _data) {
										if (_data.hasOwnProperty(i)) {
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
											}else if (_type == 'article') {
												fileurl = imgThumb+_data[i].file+'?w=400&dir='+jikdir+'&type=artikel' ;
												fileurlori = fileurl;
												jpicon = "ios-document-outline";
											}else if(_type == 'photo' ){
												fileurl = imgThumb+_data[i].file+'?w=400&dir='+jikdir+'&type=photos' ;
												fileurlori = fileurl;
												jpicon = "ios-camera-outline";
											}


											dataSave.push({
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

									let setData = [];
										setData[articleView] = {
																	list: dataView,
																	limitList:10,
																	offset:offset,
																	total: total,
																};
										setData['more'] = false;
									this.setState( setData,
										()=>{
											// alert(JSON.stringify(setData))
										}
									 );

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
									Alert.alert(
										'Warning',
										"Error : "+resp.status,
										[
											{text: 'OK', onPress: () => { } },
										],
										{ cancelable: false }
									);
								}

                            })
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
				loadMore: false,
				limitList:10,
				offset:0,
			},

			articleView:'all',
			search:"",
		},
		()=>{
			this._getJurnal();
		});
	}

	render(){
		return(
			<StyleProvider style={getTheme()}>
				<View style={{ flex:1, }}>
					<ScrollView style={{backgroundColor:'#000'}} refreshControl={this._refreshControl()} ref='ScrollView'>


						{/* start timeline */}

						<View style={{minHeight:Dimensions.get('window').height/2,backgroundColor:'#F0F0F0'}}>

							<View style={{ paddingTop:15, backgroundColor:'#F0F0F0', }}>

								{ this._viewData() }

							</View>

						</View>

						{/* end timeline */}
						<FooterSM ScrollView={this.state.ScrollView}/>

					</ScrollView>
					<FooterBtm/>
					<View style={[{ position:'absolute', backgroundColor:'#fff', bottom:0, justifyContent:'center', alignItems:'center', alignSelf:'center', flexDirection:'row', },this.state.net.data ]}>
						<View style={{ alignItems:'center', alignSelf:'center', }}>
							<Text style={{ textAlign:'center' }}>Koneksi Terputus</Text>
						</View>
					</View>					
				</View>
			</StyleProvider>
		);
	}

}
