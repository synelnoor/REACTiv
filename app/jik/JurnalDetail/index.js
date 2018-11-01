// Import dependencies
import React, { Component } from 'react';

import {
	Text,
	View,
	Dimensions,
	ScrollView,
	NetInfo,
	Alert,
    Platform
} from 'react-native';

import { StyleProvider, Spinner } from 'native-base';
import { base_url, api_uri, imgThumb, youtubeUri } from '../../comp/AppConfig';
//import Styles from '../../comp/Styles';
import getTheme from '../../../native-base-theme/components';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
//import ComLocalStorage from '../../comp/ComLocalStorage';
import ItemList from '../CompItemList/ItemList';
import FooterBtm from '../FooterBtm';
import FooterSM from '../FooterSM';

export default class JurnalDetail extends Component{

	btnLoadmore = <Spinner/>
	dataTotal = 0;

	/* dimmension */
	dim2 = Dimensions.get('window').height/2;
	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);
		this.state = {
			ScrollView:this.refs.ScrollView,
			album:null,
			data_login: false,
			jikIkaMember: false,
			ikaprofil : false,
			net :false,
			sosmed:null,
		}
	}

	componentDidMount(){
		this.setState({ ScrollView:this.refs.ScrollView });
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

	//load data dari props
	componentWillMount(){
		this._getJurnalOne();
	}

	_viewData(){
		let album = false;
		let data = this.props.data;
		let dataalbum = this.state.album;
		let dticon = "";
		let contentData = <View/>
		let headData = <View>
							<View style={{ flexDirection:'row', flexWrap:'wrap', marginTop:15, }}>
								<View style={{ backgroundColor:'#000000', padding:10, paddingTop:5, paddingBottom:5, marginLeft:15, }}>
									<Text style={{ color:'#fff' }}>{ data.compType }</Text>
								</View>
								<View style={{ backgroundColor:'#6A5750', padding:10, paddingTop:5, paddingBottom:5, marginLeft:15, }}>
									<Text style={{ color:'#fff' }}>{ data.summary }</Text>
								</View>
							</View>
							<View style={{ padding:10, paddingTop:5, paddingBottom:5, marginLeft:15, }}>
								<Text style={{ fontSize:18, }}>{ data.title }</Text>
							</View>
						</View>


		/* album photo */
		if (data.compType == 'video') {
			dticon = "ios-videocam-outline";
		}else if (data.compType == 'article') {
			dticon = "ios-document-outline";
		}else if (data.compType == 'photo') {
			if (this.state.album !== null) {
				album = this.state.album;
			}
			dticon = "ios-camera-outline";
		}

		let sosmed = data.sosmed;
		if(this.state.sosmed !== null){
			sosmed = this.state.sosmed;
		}

		let dataView = {
			file : data.file ,
			fileurlori : data.cover_url ,
			cover_url : data.fileurlori,
			compType:data.compType,
			sosmed:sosmed,
			usercoment:data.usercoment,
			description:data.jpdetail,
			album:album,
			wrappstyle:{
				padding:15,margin:15,marginTop:0, borderWidth:0,
			},
			datadetail:{
				compType : data.compType,
				summary : data.summary,
				title : data.title,
				dticon:dticon,
			}
		}

		contentData = <ItemList data={dataView} comp={{ data:data.compType, video:true, }} />;

		let viewData = <View>
							{ contentData }
						</View>
		return viewData;
	}

	/**
	 * get jurnal 1
	 * akan request data ke server jika ada koneksi, hanya mengambil data komentar + like saja
	 */
	_getJurnalOne(){
		let id = this.props.data.idpost;
		let type = this.props.data.compType;
		let _dir = this.props.data.jikdir;
		let Param = {};
			Param['where'] = 'id:'+id;
			Param['join'] = 'like,share,comment;join:jikMember:ikaMember:ikaMemberProfile';
        let resource = api_uri+'JSON/JurnalPost?'+ArrayToQueryString(Param);
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);
		newComFetch.setResource(resource);
		newComFetch.sendFetch((resp) => {
                                if (resp.status == 200) {
	
									let _data = resp.data.data;
									let total = resp.data.count;
									let sosmed  = null;
									let img = 'no-profil-pict-big.jpg?w=100&dir=_images_member';

									for (i in _data) {
										if (_data.hasOwnProperty(i)) {

											let jpcomment = _data[i].comment.data;


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

											sosmed = {
														like:_data[i].like.count,
														share:_data[i].share.count,
														lcoment:saveComent.length,
														comment:saveComent,
														userlike:{
															idpost:_data[i].id,
															jikikamember:this.props.data.sosmed.userlike.jikIkaMember,
														}
													}
										}
										this.setState({
											sosmed:sosmed,
										},()=>{
											this._getJurnal();
										})
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

	_getJurnal(){
		let id = this.props.data.idpost;
		let type = this.props.data.compType;
		let _dir = this.props.data.jikdir;
		let Param = {};
			Param['where'] = 'jurnal_post_id:'+id;

        let resource = api_uri+'JSON/JurnalAlbum?'+ArrayToQueryString(Param);
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);

		// Ambil data Article
		newComFetch.setResource(resource);
		newComFetch.sendFetch((resp) => {
                                if (resp.status == 200) {
									let listAlbum = resp.data;
									let PhotoSlide = [];
										if (listAlbum.count > 0) {
											listData = listAlbum.data
											PhotoSlide = [];
											for (var i in listData) {
												if (listData.hasOwnProperty(i)) {
													let _imgAlbum =  imgThumb+listData[i].file+'?w=150&dir='+_dir+'&type=photos';
													PhotoSlide.push(
														{
																media_file : listData[i].title,
																media_file_url : imgThumb+listData[i].file+'?w=900&dir='+_dir+'&type=photos',
																media_title : listData[i].title,
																thumb_media_file_url : imgThumb+listData[i].file+'?w=160&dir='+_dir+'&type=photos'
														}
													)
												}
											}
											this.setState({
												album:{
													data:PhotoSlide,
													count_photo : PhotoSlide.length,
													imgTitle : "",
												},
											});
										}

                                }else{
									// Alert.alert(
									// 	'Warning',
									// 	"Error : "+resp.status,
									// 	[
									// 		{text: 'OK', onPress: () => { } },
									// 	],
									// 	{ cancelable: false }
									// );
								}

                            })
    }

	render(){
		return(
			<StyleProvider style={getTheme()}>
			<View style={{ flex:1, }}>
				<ScrollView ref='ScrollView' style={{  backgroundColor:'#f0f0f0' }}>
					<View style={{minHeight: this.dim2, backgroundColor:'#f0f0f0'}}>
						{/* start article */}

							{ this._viewData() }

						{/* end article */}
					</View>
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
