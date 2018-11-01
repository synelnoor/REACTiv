import React, { Component } from 'react';
import {
	View,
	Image,
	Dimensions,
	Text,
	TouchableHighlight,
	Animated,
	WebView,
	TextInput,
	Alert,
	ScrollView,
	Easing,
	Platform,
	UIManager,
	LayoutAnimation,
	Linking
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Spinner } from 'native-base';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import HTML from 'react-native-render-html';
import { base_url, api_uri, web_url, no_img_profil } from '../../comp/AppConfig';
import WebHtmlView from '../../comp/WebHtmlView';
import ComFetch from '../../comp/ComFetch';
//import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ListJurnal from './ListJurnal';


/**
 * aksi untuk, tambah komentar
 * like status
 * follow un follow
 */
import ActionButton from './ActionButton';

jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

export default class ItemList extends Component{

	width100 = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').height : Dimensions.get('window').width;

	dim4 = (this.width100-75)/4;
	dim5 = this.width100/5;
	dim6 = this.width100/6;
	dim7 = this.width100/7;
	dimimg = this.width100-60;

	thumb = { uri: no_img_profil };
	ActionButton = new ActionButton;
	styleSosmed = {  height:1, paddingTop:1, };

	compType = "image";
	icon = <View/>
	profil = <View/>
	uploader = <View/>
	detail = <View/>
	usercoment = <View/>
	description = <View/>
	viewtime =<View/>
	viewcomment = <View/>
	datadetail = <View/>

	detailstyle={
		wrapper:{ padding:15, paddingTop:15, paddingLeft:0, paddingRight:0, },
		title:{ marginBottom:5, },
		titletext:{ fontSize:18, color:'#767676', },
		desc:{ marginBottom:0, },
		desctext:{ fontSize:14, color:'#D4D4D4', },
	}
	wrapperalbum = { padding:0, }
	imgCoverstyle = { padding:15, }
	videostyle = { flex:1, padding:15, }

	/*
	* tambahan untuk detail
	* - album video( albumvideo )
	* - album foto( album )
	* - datail artikel( detailartikel )
	*/

	stylewrapper = {backgroundColor:'#F0F0F0',elevation:0,padding:15,margin:15,marginTop:0,}

	constructor(props){
		super(props);
		this.bgValue = new Animated.Value(0);
		this.ismount = false;
		this.state = {
			item:<View/>,
			viewcomment:<View/>,
			textComent : "",
			formshare:{
				status:false,
				style : {  height:1, paddingTop:1, },
			},
			usercoment:false,
			album:{
					status:false,
					data:<View/>
					},
			reloadJurnal:false,
			formEdit:false,
			dtcomment:null
		}
		if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}
	}

	_configView(nextProps){

		// console.log(this.props)

		// setting icon
		if (this.props.data.icon !== false && typeof this.props.data.icon !== "undefined" && this.props.data.icon !== "") {
			this.bgValue = new Animated.Value(0);
			this.icon = <View style={{ position:'absolute', bottom:0, right:0, paddingTop:7, paddingBottom:7, paddingLeft:12, paddingRight:12, backgroundColor:"rgba(192,192,192,0.8)", }}>
							<IonIcon name={this.props.data.icon} style={{ fontSize:20, color:'#fff', }}/>
						</View>
		}


		// setting profile
		if (this.props.data.profil !== false && typeof this.props.data.profil !== "undefined") {
			let propfileThumb = { uri: this.props.data.profil.thumb };
			let from = null;
			let compType = null;

			/* cari berdaskan halaman */
			if(this.props.from == "home")
			{
				from = "home";
				compType = this.props.data.compType;
			}

			this.stylewrapper={ backgroundColor:'#FAFAFA',elevation:0,padding:0,margin:15,marginTop:0, }

			follow = <View/>
			if(this.props.data.profil.follow){
				follow = <TouchableHighlight
						onPress={()=>{this._Actions('follow', this.props.data)}}
							style={{ flex:1, flexDirection:'row', }}
						underlayColor="transparent">
							<View style={{ flex:1, flexDirection:'row', }}>
								<View style={{ padding:2, paddingLeft:10, paddingRight:10, borderWidth:1, borderColor:'#B35E27', borderRadius:100 }}><Text style={{ fontSize:15, }}>{ this.props.data.profil.follow }</Text></View>
							</View>
						</TouchableHighlight>
			}

            let styleProfil = (Platform.OS === 'android') ? { borderRadius:this.dim6, } : {};
			this.profil = <View>
							<View style={{ padding:15, paddingTop:0, paddingBottom:30, }}>
								<TouchableHighlight
									underlayColor={'transparent'}
									onPress={()=>{this._Actions('articledetail')}}>
									<View>
										<View>
											<Text style={{ fontSize:20, }}>{this.props.data.profil.jptitle}</Text>
										</View>
										<View>
											<Text style={{ fontSize:14, color:'#CBCBCB', }}>{this.props.data.profil.jpsummary}</Text>
										</View>
									</View>
								</TouchableHighlight>
							</View>
							<View style={{ flexDirection:'row', borderTopWidth:1, borderColor:'#EDEDED',padding:15, }}>
								<View style={{ flex:1, }}>
									<View style={{ flexDirection:'row',flex:1, }}>
										<TouchableHighlight
											onPress={()=>{this._Actions('timeline', this.props.data)}}
											style={{borderRadius:this.dim7, width:this.dim7, height:this.dim7, overflow:'hidden'}}
											underlayColor="transparent">
											<Image source={ propfileThumb } style={[{ width:this.dim7, height:this.dim7, },styleProfil]}/>
										</TouchableHighlight>
										<View style={{ height:this.dim7, flex:1, paddingLeft:15, }}>
											<TouchableHighlight
												onPress={()=>{this._Actions('timeline', this.props.data)}}
												style={{flex:1 }}
												underlayColor="transparent">
												<View style={{ flex:1 }}><Text style={{ fontSize:20, }}>{this.props.data.profil.nama}</Text></View>
											</TouchableHighlight>
											<View style={{ flex:1, flexDirection:'row', }}>
													{ follow }
											</View>
										</View>
									</View>
								</View>
								<View style={{ alignItems:'flex-end', alignSelf:'flex-end', justifyContent: 'flex-end', }}>
									<TouchableHighlight
										onPress={()=>{
												this.ActionButton.addlike(
													{ data:this.props.data.profil.userlike, compType:compType  },
													(e)=>{
														if (e.status == 200) {

															Alert.alert(
																'Pesan',
																"Anda telah menyukai artikel tersebut",
																[
																	{text: 'OK', onPress: () => {  } },
																],
																{ cancelable: false }
															);
														}else if(e.goto == 'login'){
															Alert.alert(
																'Pesan',
																"Tidak terhubung ke server",
																[
																	{text: 'OK', onPress: () => { Actions.sign_signup() } },
																],
																{ cancelable: false }
															);
														}else{
															Alert.alert(
																'Pesan',
																"Kesalahan : "+e.status,
																[
																	{text: 'OK', onPress: () => {  } },
																],
																{ cancelable: false }
															);
														}
													}
												)
												}}
									>
										<View style={{ height:this.dim7, flexDirection: 'row', justifyContent:'center',alignItems:'center', borderLeftWidth:1, borderColor:'#EDEDED', paddingLeft:15, paddingRight:0, }}>
											<IonIcon name="ios-heart-outline" style={{ fontSize:18, }}/>
											<Text style={{ marginLeft:5, fontSize:20, lineHeight:25, }} >{this.props.data.profil.jplike}</Text>
										</View>
									</TouchableHighlight>
								</View>
							</View>
						</View>
		}

		//setting user uploader
		if (this.props.data.uploader !== false && typeof this.props.data.uploader !== "undefined") {
			this.ActionButton.formatDate(
				{
					dmy:this.props.data.uploader.date,
					hmms:this.props.data.uploader.date
				},
				(callback)=>{
					this.viewtime = <View style={{ flexDirection:'row', paddingBottom:10, }}>
										<View style={{ flex:1, flexDirection:'row', }}>
											<IonIcon style={{ fontSize:14, marginRight:5, marginTop:2, }} name="ios-calendar-outline"/>
											<Text style={{ fontSize:14, }}>{ callback.data.dmy }</Text>
										</View>
										<View style={{ alignItems:'flex-end', alignSelf:'flex-end', flexDirection:'row', }}>
											<IonIcon style={{ fontSize:14, marginRight:5, }} name="ios-time-outline"/>
											<Text style={{ fontSize:14, }}>{ callback.data.hmms }</Text>
										</View>

									</View>

					// this.viewtime = <View style={{ flexDirection:'row', paddingBottom:10, }}>
					// 					<View style={{ flex:1, flexDirection:'row', }}>
					// 						<IonIcon style={{ fontSize:14, marginRight:5, marginTop:2, }} name="ios-calendar-outline"/>
					// 						<Text style={{ fontSize:14, }}>{ callback.data.dmy }</Text>
					// 					</View>
					// 				</View>
				}
			);
			let propfileThumb = { uri: this.props.data.uploader.thumb };
			this.stylewrapper={ margin:0, padding:0, borderWidth:0, paddingBottom:0,  }

			let confJurnalSaya = <View/>
			if (typeof this.props.data.uploader.confJurnalSaya !== "undefined") {
				let dataJurnalSaya = this.props.data.uploader.confJurnalSaya;
				confJurnalSaya = <View style={{ flexDirection:'row', alignSelf:'center', alignItems:'center', }}>
										<View>
											<TouchableHighlight
												underlayColor={'transparent'}
												onPress={()=>{this._Actions('editArtikel')}}>
												<View style={{ borderRightWidth:1, padding:10, paddingTop:0, paddingBottom:0, borderColor:'#d0d0d0', }}>
													<IonIcon style={{ fontSize: 25, color:'#C5C5C5', }} name={'ios-create-outline'}/>
												</View>
											</TouchableHighlight>
										</View>
										<View>
											<TouchableHighlight
												underlayColor={'transparent'}
												onPress={()=>{ this._Actions("removeArticle",{ data:dataJurnalSaya }) }}>
												<View style={{ padding:10, paddingTop:0, paddingBottom:0, paddingRight:0,}}>
													<IonIcon style={{ fontSize: 25, color:'#C5C5C5', }} name={'ios-trash-outline'}/>
												</View>
											</TouchableHighlight>
										</View>
									</View>
				this.stylewrapper= this.props.data.uploader.confJurnalSaya.stylewrapper;
			}
            let styleUploader = (Platform.OS === 'android') ? { borderRadius:this.dim7, } : {};
			this.uploader = <View style={{ borderBottomWidth:0, backgroundColor:'#fff', }}>
								<View style={{ flex:1, flexDirection:'row', padding:15, borderBottomWidth:1, borderColor:'#e0e0e0', }}>
									<View style={{ borderRadius:this.dim7, width:this.dim7, height:this.dim7, overflow:'hidden' }}>
										<Image source={ propfileThumb } style={[{ width:this.dim7, height:this.dim7, },styleUploader]}/>
									</View>
									<View style={{ height:this.dim7, marginLeft:15, flex:1, }}>
										<View>
											<Text style={{ fontSize:18, color:'#757575', }}>{this.props.data.uploader.nama}</Text>
										</View>
										<View style={{ flexDirection:'row', }}>
											<Text style={{ fontSize:14, color:'#9D9D9D', }}>{this.props.data.uploader.type}</Text>
											<Text style={{ fontSize:14, color:'#9D9D9D', }}>{this.props.data.uploader.jptitle}</Text>
										</View>
									</View>
									{ confJurnalSaya }
								</View>
						</View>
			this.wrapperalbum={ padding:15, backgroundColor:'#fff', borderColor:'#EDEDED', borderWidth:0, marginBottom:0, }
			this.imgCoverstyle={ padding:0, borderWidth:0, }
		}

		//setting sosmed
		if(this.props.data.sosmed !== false && typeof this.props.data.sosmed !== 'undefined'){
			this.stylewrapper = {backgroundColor:'#F0F0F0',elevation:0, borderColor:'#EDEDED', borderWidth:0, borderBottomWidth:0, padding:0,margin:15,marginTop:0, marginBottom:0, paddingTop:0, }
			let lastLoad = 5;
			let update = 0;
			let lenghComent = this.props.data.sosmed.lcoment;
			let dtcommentSet = this.props.data.sosmed.comment;
			let dtcomment = dtcommentSet.length > 0 ? dtcommentSet : [];
			let	more = dtcommentSet.length >= lastLoad ? true : false;
			this.setState({
				dtcomment:{
					data:dtcommentSet,
					update:update,
					lastLoad:lastLoad,
					more:more,
				}
			});
		}

		//title dan detail Artikel
		if(this.props.data.detail !== false && typeof this.props.data.detail !== "undefined"){
			this.detail = <View style={ this.detailstyle.wrapper }>
							<View style={ this.detailstyle.title }>
								<Text style={ this.detailstyle.titletext }>{ this.props.data.detail.title }</Text>
							</View>
							<View style={ this.detailstyle.desc }>
								<Text style={ this.detailstyle.desctext }>{ this.props.data.detail.desc }</Text>
							</View>
						</View>
		}

		/* tambahan untuk detail */
		if ((this.props.data.album !== false && typeof this.props.data.album !== 'undefined') || typeof nextProps !== 'undefined') {
			let albumData = false;
			if(nextProps.data.album !== false && typeof nextProps.data.album !== 'undefined'){
				albumData = nextProps.data.album ;
			}else if (this.props.data.album !== false && typeof this.props.data.album !== 'undefined') {
				albumData = this.props.data.album;
			}
			if (this.state.album.status !== true && albumData !== false) {
				let dataPush = [];
				let data = albumData.data;
				for (var i in data) {
					if (data.hasOwnProperty(i)) {
						let propfileThumb = { uri: data[i].media_file_url };
						let dataPhoto = { };
							dataPhoto["imgActive"] = i;
							dataPhoto["data"] = albumData.data;
							dataPhoto["imgTitle"] = "";
							dataPhoto["count_photo"] = albumData.count_photo;
						dataPush.push(
							<TouchableHighlight underlayColor={'transparent'} key={ i } onPress={()=>{ Actions.JIKPhotoSlide(dataPhoto); } }>
								<Image source={ propfileThumb } style={{ width:this.dim4, height:this.dim4, marginRight:5, }}/>
							</TouchableHighlight>
						)
					}
				}
				let dataView = <ScrollView horizontal={ true } style={{ flexDirection:'row', marginTop:5, }}>{ dataPush }</ScrollView>;
				this.setState({
					album:{
							status:true,
							data:dataView
						}
				})
			}
		}

		/* style wrapper untuk detail */
		if (this.props.data.wrappstyle !== false && typeof this.props.data.wrappstyle !== 'undefined') {
			let windDim = this.width100;
			let wrappstyle = this.props.data.wrappstyle;

			if (typeof wrappstyle.padding !== 'undefined') {
				windDim = windDim - (wrappstyle.padding * 2)
			}

			if (typeof wrappstyle.margin !== 'undefined') {
				windDim = windDim - (wrappstyle.margin * 2)
			}

			if (typeof wrappstyle.borderWidth !== 'undefined') {
				windDim = windDim - (wrappstyle.borderWidth * 2)
			}

			this.dimimg = windDim;
			this.stylewrapper = this.props.data.wrappstyle;
		}

		/* description detail */
		if(this.props.data.description !== false && typeof this.props.data.description !== "undefined"){
			this.description = <View style={{ marginTop:10, marginBottom:5, flex:1, }}>
									<HTML html={this.props.data.description} tagsStyles={{ div: { color:'#d0d0d0' }, img:{ maxWidth:'100%' } }} imagesMaxWidth={Dimensions.get('window').width} />
								</View>
		}

		//data detail header
		if (this.props.data.datadetail !== false && typeof this.props.data.datadetail !== "undefined" && this.props.data.datadetail !== "") {
			this.dataDetail = <View style={{ flexDirection:'row', }}>
								<View style={{ flex:1, padding:15, paddingLeft:0, paddingTop:0, }}>
									<View style={{ marginBottom:5, }}>
										<Text style={{ fontSize:18, color:'#767676', }}>{ this.props.data.datadetail.title }</Text>
									</View>
									<View style={{ marginBottom:0, }}>
										<Text style={{ fontSize:14, color:'#D4D4D4', }}>{ this.props.data.datadetail.summary }</Text>
									</View>
								</View>
								<View>
									<IonIcon style={{ fontSize: 25, color:'#C5C5C5', }} name={ this.props.data.datadetail.dticon }/>
								</View>
							</View>
			this.wrapperalbum={ padding:15, borderWidth:0, backgroundColor:'#fff', borderColor:'#EDEDED', marginBottom:0, }
			this.imgCoverstyle={ padding:0, borderWidth:0, }
			this.stylewrapper={ margin:0, padding:15, borderWidth:0, paddingBottom:0,  }

		}

		/* data video */
		if (this.props.comp.data == "video" && this.props.comp.video == true) {
			this.wrapperalbum={ padding:0, borderWidth:0, backgroundColor:'#fff', borderColor:'#EDEDED', marginBottom:0, }
			this.imgCoverstyle={ padding:0, borderWidth:0, }
			this.stylewrapper={ margin:0, padding:15, borderWidth:0, paddingBottom:0,  }
		}

	}

	_viewComent(){
		if(this.state.dtcomment !== null){
			let dtcomment = this.state.dtcomment.data;
			let firstLoad = 0;
			let lastLoad = this.state.dtcomment.lastLoad;
			let update = this.state.dtcomment.update;
			let more = this.state.dtcomment.more;
			let totalList = dtcomment.length;
			if(dtcomment.length > 0){
				lastLoad = lastLoad + update;
				lastLoad = totalList >= lastLoad ? lastLoad : totalList;
				dtcomment = dtcomment.slice(firstLoad, lastLoad);

				/* loop data coment */
                let styleComent = (Platform.OS === 'android') ? { borderRadius:this.dim7, } : {};
                let commentOther = <View style={{ backgroundColor:'#FFF', borderColor:'#F0F0F0', borderBottomWidth:1, padding:2.5, paddingRight:10, }}>
									<TouchableHighlight
										onPress={()=>{
														this.updateComment();
													}}
										underlayColor="transparent">
										<Text style={{ textAlign: 'right' }}>Lihat komentar berikutnya</Text>
									</TouchableHighlight>
								</View>
					commentOther = more ? commentOther : <View/>;
				let viewcomment = [];
				let no = 0;
				let last = 0;
					last = dtcomment.length;
				for (var dc in dtcomment) {
					let propfileThumb = { uri: dtcomment[dc].thumb };
					let comentnm = dtcomment[dc].comentnm;
					let created_at = dtcomment[dc].created_at;
					let commentdt = dtcomment[dc].comment;
					let stylecoment = { flex:1, flexDirection:'row', backgroundColor:'#fff', padding:15, borderColor:'#F0F0F0', borderBottomWidth:1, };

					if (dtcomment.hasOwnProperty(dc)) {
						no++;
						if (last <= no) {
							stylecoment = { flex:1, flexDirection:'row', backgroundColor:'#fff', padding:15, borderColor:'#F0F0F0', borderBottomWidth:0, };
						}

						this.ActionButton.formatDate(
							{
								dmy:created_at,
								hmm:created_at
							},
							(callback)=>{
								viewcomment.push(
									<View key={ dc }>
										<View style={ stylecoment }>
											<View style={{ borderRadius:this.dim7, width:this.dim7, height:this.dim7, }}>
												<Image source={ propfileThumb } style={[{ width:this.dim7, height:this.dim7, },styleComent]}/>
											</View>
											<View style={{ height:this.dim7, paddingLeft:15, }}>
												<View style={{ flexDirection:'row', }}>
													<Text style={{ fontSize:18, color:'#767676', }}>{comentnm}</Text>
												</View>
												<View>
													<Text style={{ fontSize:14, color:'#959595', }}>{commentdt}</Text>
												</View>
												<View>
													<Text style={{ fontSize:14, color:'#C76629', }}>{ callback.data.dmy }  |  { callback.data.hmm } WIB</Text>
												</View>
											</View>
										</View>
									</View>
								)
							}
						);
					}
				}

				return(
					<View style={{ borderColor:'#F0F0F0', borderTopWidth:1, padding:15, borderBottomWidth:1, paddingTop:0, }}>
						{ viewcomment }
						{ commentOther }
					</View>
				)
			}
		}else{
			return(	<View/>	)
		}

	}

	shareSosmed(){
		//setting sosmed
		if(this.props.data.sosmed !== false && typeof this.props.data.sosmed !== 'undefined'){
			return(
					<View style={{ padding:15, paddingTop:0, backgroundColor:'#F0F0F0',  }}>
						<View style={{ flexDirection:'row', paddingBottom:15, paddingTop:15, borderWidth:0, borderTopWidth:0, borderColor:'#EDEDED', backgroundColor:'#d8d8d8', }}>
							<View style={{ flex:1, alignItems:'center', alignSelf:'center', borderRightWidth:1, borderColor:'#c0c0c0', }}>
								<TouchableHighlight
								onPress={()=>{
											this.ActionButton.addlike(
												{ data:this.props.data.sosmed.userlike },
												(e)=>{
													if (e.status == 200) {

														Alert.alert(
															'Pesan',
															"Sukses : Komentar",
															[
																{text: 'OK', onPress: () => {  } },
															],
															{ cancelable: false }
														);
													}else if(e.goto == 'login'){
														Alert.alert(
															'Pesan',
															"Kesalahan : "+e.status,
															[
																{text: 'OK', onPress: () => { Actions.sign_signup() } },
															],
															{ cancelable: false }
														);
													}else{
														Alert.alert(
															'Pesan',
															"Kesalahan : "+e.status,
															[
																{text: 'OK', onPress: () => {  } },
															],
															{ cancelable: false }
														);
													}
												}
											)
											}}
								underlayColor="transparent">
									<View style={{ flexDirection:'row', marginRight:15, alignItems:'center', alignSelf:'center', }}>
										<IonIcon name="ios-heart-outline" style={{ fontSize:18, marginTop:2, }}/>
										<Text style={{ marginLeft:5, fontSize:18, lineHeight:25, }} >{ this.props.data.sosmed.like }</Text>
									</View>
								</TouchableHighlight>
							</View>
							<View style={{ flex:1, borderRightWidth:1, borderColor:'#c0c0c0', }}>
								<View style={{ flexDirection:'row', alignItems:'center', alignSelf:'center', marginRight:15, }}>
									<IonIcon name="ios-text-outline" style={{ fontSize:18, marginTop:2, }}/>
									<Text style={{ marginLeft:5, fontSize:18, lineHeight:25, }} >{ this.props.data.sosmed.lcoment }</Text>
								</View>
							</View>
							<View style={{ flex:1, borderRightWidth:0, borderColor:'#c0c0c0', }}>
								<TouchableHighlight
										underlayColor="transparent"
										onPress={()=>{
														this._formShare()
												}}>
										<View style={{ flexDirection:'row', marginRight:15, alignItems:'center', alignSelf:'center', }}>
											<IonIcon name="ios-redo-outline" style={{ fontSize:18, marginTop:2, }}/>
											<Text style={{ marginLeft:5, fontSize:18, lineHeight:25, }} >{ this.props.data.sosmed.share }</Text>
										</View>
								</TouchableHighlight>
							</View>
						</View>
						<View>
							<View style={[{ flexDirection:'row', marginBottom:0, backgroundColor:'#b76329', }, this.state.formshare.style ]}>
								<View style={{ flex:1, borderRightWidth:1, borderColor:'#c0c0c0', alignSelf:'center', alignItems:'center', }}>
									<TouchableHighlight
									onPress={
										()=>{
											this._Actions('sharejurnal',
											{
												data:{ title: "React Native", message: "Hola mundo", url: "http://facebook.github.io/react-native/", subject: "Share Link" },
												share:'facebook'
											})
										}
									}>
										<FaIcon style={{ fontSize:18, color:'#fff', }} name="facebook" />
									</TouchableHighlight>
								</View>
								<View style={{ flex:1, alignSelf:'center', alignItems:'center', }}>
									<TouchableHighlight
									onPress={
										()=>{this._Actions('sharejurnal',
											{
												data:{ title: "React Native", message: "Hola mundo", url: "http://facebook.github.io/react-native/", subject: "Share Link" },
												share:'twitter'
											})
										}
									}>
										<FaIcon style={{ fontSize:18, color:'#fff', }} name="twitter" />
									</TouchableHighlight>
								</View>
							</View>
						</View>
					</View>
			)
		}else{
			return <View/>
		}
	}

	_formShare(){
		let formshare = this.state.formshare;
		let style = null;
		if (formshare.status) {
			style = {  height:1, paddingTop:1, };
			formshare = {
				status : false,
				style:style,
			}
		}else{
			style = {  paddingTop:10, paddingBottom:10, };
			formshare = {
				status : true,
				style:style,
			}
		}
		this.setState({
			formshare:formshare,
		},()=>{
			LayoutAnimation.configureNext(LayoutAnimation.Presets.sLayopring);
		});
	}

	_Actions(goto,data){
		let sendData = "";
		switch(goto) {
			case 'addkomentar':
				if (data.data.textComent !== "" && typeof data.data.textComent !== "undefined") {
					this.setState({
						usercoment:true,
					}, ()=>{
							this.ActionButton.addcoment(
								data,
								(e)=>{
									if (e.status == 200) {
										Alert.alert(
											'Informasi',
											"Sukses : Komentar",
											[
												{text: 'OK', onPress: () => {
													this.setState({
														usercoment:false,
													},()=>{
														/* update comment */
														this.updateComment(e);
													}) }
												},
											],
											{ cancelable: false }
										);
									}else{
										Alert.alert(
											'Peringatan !',
											"Kesalahan : "+e.status,
											[
												{text: 'OK', onPress: () => {
													this.setState({
														usercoment:false,
													}) }
												},
											],
											{ cancelable: false }
										);
									}
								}
							)
						}
					);

				}
				break;
			case 'sharejurnal':

				this.ActionButton.addshare(data,
					(callback)=>{
					}
				);
				break;
		    case 'timeline':
				sendData = typeof this.props.data.ikaprofile !== 'undefined' ? this.props.data.ikaprofile : false;
				Actions.JIKTimeline({ data:sendData })
		        break;
		    case 'articledetail':
				sendData = typeof this.props.data.jurnaldetail !== 'undefined' ? this.props.data.jurnaldetail : false;
				if (sendData !== false) {
					Actions.JIKDetail({ data:sendData })
				}
		        break;
			case 'removeArticle':
					this.ActionButton.removeArticle(
						{ idpost:data.data.idpost, },
						(callback)=>{
							if (callback.status==200) {
								this.setState({
									reloadJurnal:true,
								},()=>{
									Alert.alert(
										'Informasi',
										"Apakah anda yakin akan menghapus ?",
										[
											{text: 'Ya', onPress: () => { this.props.reload(this.state.reloadJurnal); } },
											{text: 'Tidak', onPress: () => { } },
										],
										{ cancelable: false }
									);
								})
							}
					});
				break;
			case 'editArtikel':
				let dataFormEdit = true;
				if (this.state.formEdit) {
					dataFormEdit = false;
				}
				this.setState({
					formEdit:dataFormEdit,
				},()=>{
					LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
				})
				break;
			case 'detailVideo':
				Linking.canOpenURL(data.urlA).then(supported=>{
					if(supported){
						Linking.openURL(data.urlA);
					}
					else{
						if(data.urlB){
							Linking.openURL(data.urlB);
						}
						else{
							Alert.alert('Pesan','Gagal membuka : '+data.urlA,[{text:'OK',onPress:()=>{}}]);
						}
					}
				});
			case 'follow':
				let Param = {};
				let resource = "";
				let IKComFetch = new ComFetch();
				let listFollow = this.state.listFollow;

				let member = data.jurnaldetail.usercoment.jikikamember.jikmember;
				let follow = data.ikaprofile.jikmember;

				Param = {};
				Param['type'] = 'follower';
				Param['member'] = member;
				Param['follow'] = follow;
				resource = api_uri+'JIKFollow/followChange';
				let dataFollow = {};
					dataFollow = {
						type: Param['type'],
						member: Param['member'],
						follow: Param['follow'],
					}
				IKComFetch.setHeaders({Authorization:this.jwt_signature});
				IKComFetch.setRestURL(base_url);
				IKComFetch.setMethod('POST');
				IKComFetch.setResource(resource);
				IKComFetch.setSendData(dataFollow);
				IKComFetch.sendFetch((resp) => {
					console.log("pengikut2 => ",dataFollow);
					console.log("pengikut1 => ",data);
					console.log("pengikut => ",resp);
					if(resp.status == 200){
						this.props.itemCB({ refresh:true, });
					}
				});
				break;
			default:
		        return ()=>{ };
		}
	}

	updateComment(e){
		let more = this.state.dtcomment.more;
		let firstLoad = 0;
		let lastLoad = this.state.dtcomment.lastLoad;
		let update = this.state.dtcomment.update;
		let dtcommentView = null;
		let dtcomment = this.state.dtcomment.data;
		let totalList = dtcomment.length;
			dtcomment = totalList > 0 ? dtcomment : [];
			if(typeof e !== 'undefined'){
				if(typeof e.myComent !== 'undefined'){
					dtcomment.push(e.myComent);
					update++;
					dtcommentView = dtcomment;
				}
			}else{
				/* load more */
				lastLoad = lastLoad + update + 5;
				more = totalList >= lastLoad ? true : false;
				lastLoad = totalList >= lastLoad ? lastLoad : totalList;
				dtcommentView = dtcomment.slice(firstLoad, lastLoad);
			}

			this.setState({
				dtcomment:{
					data:dtcomment,
					update:update,
					lastLoad:lastLoad,
					more:more,
				}
			},()=>{
				if(typeof e !== 'undefined'){
					if(typeof e.myComent !== 'undefined'){
						this.props.itemCB(e);
					}
				}
			});

	}

	componentWillReceiveProps(nextProps){
		/* cek data album */
		if (nextProps.data.album !== false && typeof nextProps.data.album !== 'undefined') {
			this._configView(nextProps);
			this._bG();
			const bg = this.bgValue.interpolate({
				inputRange:[0,1,2,3,4],
				outputRange:[
					'rgb(230,230,230)',
					'rgb(240,240,240)',
					'rgb(250,250,250)',
					'rgb(240,240,240)',
					'rgb(230,230,230)',
				]
			});

			this.setState({
				item:<View style={{height:(this.width100-60),elevation:0,margin:15,marginTop:0,backgroundColor:bg[1]}}/>
			},()=>{
				this._componentDidMount();
			});
		}
	}

	componentDidMount(){
		this._configView();
		this._bG();
		const bg = this.bgValue.interpolate({
			inputRange:[0,1,2,3,4],
			outputRange:[
				'rgb(230,230,230)',
				'rgb(240,240,240)',
				'rgb(250,250,250)',
				'rgb(240,240,240)',
				'rgb(230,230,230)',
			]
		});

		this.setState({
			item:<View style={{height:(this.width100-60),elevation:0,margin:15,marginTop:0,backgroundColor:bg[1]}}/>,
			viewcomment:<View/>,
		},()=>{
			this.ismount = true;
			this._componentDidMount();
		});
	}

	componentWillUnmount(){
		this.ismount = false;
	}

	_bG(){
		this.bgValue.setValue(0);
		Animated.timing(
			this.bgValue,{
				toValue:4,
				duration:2000,
				easing:Easing.linear
			}
		).start(()=>this._bG());
	}

	_usercoment(){
		//user coment
		if (this.props.data.usercoment !== false && typeof this.props.data.usercoment !== 'undefined') {
			let _usercoment = this.props.data.usercoment;
			let jikikamember = _usercoment.jikikamember;
			if (jikikamember !== false && typeof jikikamember !== 'undefined') {
				let propfileThumb = { uri: jikikamember.thumbme };
				let idpost = this.props.data.usercoment.idpost;


				let btnUsercoment = <View>
										<TouchableHighlight
											onPress={
														()=> {
																this._Actions('addkomentar',
																	{
																		data:{ textComent: this.state.textComent, jurnalpost: idpost, jikikamember:jikikamember, }
																	}
																);
															}
													}
										underlayColor={"transparent"}>
											<View style={{ flex:1, backgroundColor:'#d8d8d8', padding:15, }}>
												<Text style={{ textAlign:'center', fontSize:18, color:'#909090', }}>Kirim</Text>
											</View>
										</TouchableHighlight>
									</View>

				if (this.state.usercoment) {
					btnUsercoment = <View>
										<Spinner/>
									</View>
				}

				let styleUserComent = (Platform.OS === 'ios') ? { height:60, fontSize:15 } : {}
				this.usercoment = <View style={{ borderColor:'#F0F0F0', borderWidth:1, backgroundColor:'#FFF', marginBottom:15, }}>
										<View style={{ padding:15, }}>
											<TextInput
												style={ styleUserComent }
												multiline = {true}
												numberOfLines = {3}
												onChangeText={(text) => this.setState({textComent:text})}
												underlineColorAndroid={'transparent'}
												placeholder="Tulis Komentar"
											/>
										</View>
										<View>
											{ btnUsercoment }
										</View>
									</View>

			}
			return this.usercoment;
		}
	}

	_componentDidMount(first)
	{
		let img = this.props.data.cover_url;
		if(first){
			img = web_url+'glide/image/no-image.jpg?w=400';
		}

		if (this.props.comp.data !== "video" || this.props.comp.video == false) {
			Image.getSize(img,(w,h)=>{
				this._buildComponent(img,w,h);
			},()=>{
				this._componentDidMount(true);
			});
		}else if (this.props.comp.data == "video" && this.props.comp.video == true) {
			this._buildComponent(img,0,0);
		}
	}

	_buildComponent(img,w,h){

		if (this.props.comp.data !== "video" || this.props.comp.video == false) {

				if (this.ismount) {
					let imgComp = <View style={{height:this.dimimg/2,flexDirection:'column',alignItems:'center',justifyContent:'center'}}><Spinner/></View>;
						if(img){
							Image.prefetch(img);
							let nh = h / w * this.dimimg;
							let nw = this.dimimg + 0;
							imgComp = <Image
								style={{
									height:nh,
									width:nw,
								}}
								source={{uri:img}}
								resizeMode='cover'
							/>
						}
						this.setState({
							item:
							<View>
								<TouchableHighlight
									onPress={()=>{this._Actions('articledetail')}}
									underlayColor={'transparent'}
								>
									<View style={ this.wrapperalbum }>
										<View style={ this.imgCoverstyle }>
											<View>
												{ this.dataDetail }
											</View>
											<View>
												{ this.viewtime }
											</View>
											<View>
												{ imgComp }
												{ this.icon }
											</View>
										</View>
										<View>
											{ this.state.album.data }
										</View>
										<View>
											{ this.detail }
										</View>
										<View>
											{ this.description }
										</View>
									</View>
								</TouchableHighlight>
								<View>
									{ this.profil }
								</View>
							</View>,
						});
				}

		}else if (this.props.comp.data == "video" && this.props.comp.video == true) {
			if (this.ismount) {
				let _height = (((this.width100)-60)/(16/9));
				let _width = (this.width100)-60;
				this.setState({
					item:
						<View>
							<View style={ this.wrapperalbum }>
								<View style={ this.videostyle }>
									<View>
										{ this.dataDetail }
									</View>
									<View>
										{ this.viewtime }
									</View>
									<View style={{padding:0,margin:0,height:_height}}>
										<WebView
											style={{padding:0,margin:0,height:_height}}
											source={{html:'<style>*{margin:0 !important;padding:0 !important;}</style><iframe style="height:'+(_height)+'px;width:'+(_width)+'px;" src="'+img+'" frameborder="0" allowfullscreen="true"></iframe>'}}/>
									</View>
									<View style={{ flexDirection:'row', marginTop:15, borderBottomWidth:1, borderColor:'#F0F0F0', paddingBottom:5, }}>
										<View style={{ flex:1, }}>
											<Text style={{ fontSize:18, color:'#b76329', }}>Detail Video</Text>
										</View>
										<View>
											<TouchableHighlight
											underlayColor="transparent"
											onPress={()=>{this._Actions('detailVideo',{ urlA: 'https://youtu.be/'+this.props.data.file, urlB:'https://www.youtube.com/embed/'+this.props.data.file })}}>
												<IonIcon style={{ fontSize:18, color:'#b76329', }} name="ios-expand-outline"/>
											</TouchableHighlight>
										</View>
									</View>
								</View>
								<TouchableHighlight
									onPress={()=>{this._Actions('articledetail')}}
								>
									<View>
										{ this.detail }
									</View>
								</TouchableHighlight>
								<View>
									{ this.description }
								</View>
							</View>
							<View>
								{ this.profil }
							</View>
						</View>,
				});
			}
		}
	}

	_reload(e){
		if (e) {
			this.setState({
				reloadJurnal:e,
			},()=>{
				this.props.reload(this.state.reloadJurnal)
			});

		}
	}

	formEdit(){
		let dataView = <View/>
		let data = null;
		let formStatus = null;
		let styleEditForm = { height:0, }
		if (this.props.data.jurnalEdit !== false && typeof this.props.data.jurnalEdit !== "undefined") {

			if (this.props.data.compType == "video") {
				formStatus = "video";
			}else if (this.props.data.compType == "article") {
				formStatus = "artikel";
			}else if (this.props.data.compType == "photo") {
				formStatus = "foto";
			}
			if (this.state.formEdit) {
				styleEditForm = { }
			}
			data = this.props.data.jurnalEdit;
			dataView = <View style={styleEditForm}>
							<ListJurnal
								reload={(e)=>{this._reload(e)}}
								data={
										{
											content:{ data:this.props.data, headList:false, },
											jurnal_id : data.jurnal_id,
											loginData:data.loginData,
											cover : data.cover,
											formStatus:formStatus,
											formEdit:true,
										}
									}/>
						</View>
		}
		return dataView;
	}

	render(){
		return(
			<View>
				<View style={this.stylewrapper}>
					<View>
						{ this.uploader }
					</View>
					<View>
						{ this.formEdit() }
					</View>
					<View>
						{ this.state.item }
					</View>
				</View>
				<View>
					{ this.shareSosmed() }
				</View>
				<View style={{ backgroundColor:'#F0F0F0', paddingLeft:15, paddingRight:15, }}>
					{ this._usercoment() }
				</View>
				<View>
					{ this._viewComent() }
				</View>
			</View>
		);
	}

}
