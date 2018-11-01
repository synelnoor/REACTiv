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
	Alert,
	Easing
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { StyleProvider, Spinner, Tab, Tabs, TabHeading, Icon } from 'native-base';
import getTheme from '../../../native-base-theme/components';
import { base_url, api_uri, imgThumb } from '../../comp/AppConfig';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ComLocalStorage from '../../comp/ComLocalStorage';
import ComFetch from '../../comp/ComFetch';
import Service from '../../comp/Service';
import Styles from '../../comp/Styles';
import ActionButton from '../CompItemList/ActionButton';
import ItemList from '../CompItemList/ListPesan';
import FooterSM from '../FooterSM';
//import he from 'he';

export default class Home extends Component{

	width100 = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').height : Dimensions.get('window').width;

	dimx2 = this.width100*2;
	dim2 = this.width100/2;
	dim3 = this.width100/3;
	dim4 = this.width100/4;
	dim5 = this.width100/5;
	dim6 = this.width100/6;
	dim7 = this.width100/7;
	dimimg = this.width100-60;

	ActionButton = new ActionButton();
	btnLoadmore = <Spinner/>
	dataTotal = 0;

	masuk = { icon:{ color: '#b76329', }, text:{ color: '#b76329' } }
	buat = { icon:{ color: '#C0C0C0',  }, text:{ color: '#C0C0C0' } }
	terkirim = { icon:{ color: '#C0C0C0',  }, text:{ color: '#C0C0C0' } }
	sampah = { icon:{ color: '#C0C0C0',  }, text:{ color: '#C0C0C0' } }

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);
		this.loadmoreColor = new Animated.Value(0);
		this.loadmoreScale = new Animated.Value(0);
		this.state = {
			ScrollView:this.refs.ScrollView,
			more:false,
			masuk:{
				list: null,
				limitList:10,
				offset:0,
				total:0,
				update:0,
			},
			terkirim:{
				list: null,
				limitList:10,
				offset:0,
				total:0,
				update:0,
			},
			sampah:{
				list: null,
				limitList:10,
				offset:0,
				total:0,
				update:0,
			},
			articleView:'masuk',
			countInbox:false,
			data_login: false,
			jikIkaMember: false,
			ikaprofil : false,

		}
	}

	componentDidMount(){
		Actions.refresh({key:'JIKdrawer',open:value=>false});
		this._loadmoreColor();
		this._loadmoreScale();
		this.setState({ScrollView:this.refs.ScrollView});
		/* LocalStorage Checker */
		this.lcStorageCheck();
		/* update list message */
		Service._wsOnmessage((e)=>{
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
		});
	}

	componentWillReceiveProps(nextProps){
		/* actions pop */
		// console.log(nextProps);
	}

	componentWillMount(){
		this.ActionButton.countInbox(
			(callback)=>{
				let countInbox = false;
				if (callback.countInbox > 0) {
					this.setState({
						countInbox : callback.countInbox,
					})
				}
		})
	}

	countInbox(){
		let data = <View/>
		if (this.state.countInbox) {
			data = <View style={{ position:"absolute", top:-10, right:-10, width:18, height:18, borderRadius:18, backgroundColor:"#b76329", alignItems:'center', justifyContent:'center', alignSelf:'center', }}>
				<Text style={{ textAlign:'center', fontSize:10, color:'#fff', }}>{ this.state.countInbox }</Text>
			</View>
		}
		return data;
	}

	countMsgInbox(e){
		let dataState = {};
		/* countInbox */
		if (typeof e.countInbox !== 'undefined') {
			let countInbox = e.countInbox;
			if (e.countInbox < 0) {
				countInbox = false;
			}
			dataState['countInbox'] = countInbox;
			this.setState(dataState)
		}
		/* Remove Item (refresh list) */
		if (typeof e.removeMsgInbox !== 'undefined') {
			if (e.status == 'masuk') {
				this.ActionButton.countInbox(
					(callback)=>{
						let countInbox = false;
						if (callback.countInbox > 0) {
							countInbox = callback.countInbox;
						}
						this.setState({
							countInbox : countInbox,
						})
						let LCMessage = new ComLocalStorage;
						LCMessage.removeMultiple(
						[
							'@jik:jikMessagesampah',
						],
						(callbackGet)=>{ });
				})
			}
			this._onRefresh();
		}

	}

	lcStorageCheck(more){
		/* Local Storage Checker */
		let update = 0;
		let articleView = this.state.articleView;
		let LCMessage = new ComLocalStorage;
			LCMessage.getMultiple(
				[
					'@jwt:user_info',
					'@jik:jikIkaMember',
					'@jik:jikMessage'+articleView
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
					let jikIkaMember = dataArr['@jik:jikIkaMember'];
					let jikMessage = dataArr['@jik:jikMessage'+articleView];
					// console.log("jikMessage => ",jikMessage)
					let list = false;
					let setData = {};
						jikIkaMember = {
										thumbme : imgThumb+jikIkaMember.ika_member_profile.data.profile_picture+'?w='+this.dim4+'&dir=_images_member',
										jikmember : jikIkaMember.member_id,
										ikamember : jikIkaMember.ika_member.data.member_id,
										email : jikIkaMember.email,
									}
						this.setState({
							data_login: user_info,
							jikIkaMember: jikIkaMember,
						},()=>{
							let firstLoad = 0;
							let lastLoad = 0;
							/* checking update data */
							if (jikMessage !== null) {
								update = jikMessage.update;
							}

							/* Loadmore */
							if (typeof more != 'undefined') {
								if (jikMessage.list.length < jikMessage.total) {
									this.ActionButton.countInbox(
										(callback)=>{
											let countInbox = false;
											if (callback.countInbox > 0) {
												countInbox = callback.countInbox;
											}
											this.setState({
												countInbox : callback.countInbox,
											})
											this._getMessage(more);
									})
								}else{
									let offset = more.offset + 10;
									let listMore = jikMessage.list.length - offset;
										listMore = listMore < 0 ? 0 : listMore;
									list = jikMessage.list.slice(offset, jikMessage.list.length);
									setData[articleView] = {
																list: jikMessage.list,
																limitList:10,
																offset:more.offset,
																total: jikMessage.total,
																update: update,
															};
									setData['more'] = false;
									// console.log(setData)
									this.setState(setData);
								}
							}else{
								if (jikMessage == null) {
									this._getMessage(more);
								}else{
									list = jikMessage.list;
									if (jikMessage.list.length > 10) {
										firstLoad = 0;
										lastLoad = 10;
										list = jikMessage.list.slice(firstLoad, lastLoad);
									}
									setData[articleView] = {
																list: list,
																limitList:10,
																offset:0,
																total: jikMessage.total,
																update: update,
															};
									setData['more'] = false;
									// console.log(setData)
									this.setState(setData);
								}
							}

							/* Not Loadmore */
						});
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

	_viewData(){
		let active = this.state.articleView;
		let data = this.state[active];
		if (active == "buat") {
			let dataView = {
							newmsg:{
									jikIkaMember:this.state.jikIkaMember,
								},
						};
			return <ItemList key={i} data={dataView} />;
		}else if(data.list == null) {
			return <Spinner/>;
		}else{
			let viewList = [];
			let dataEach = data.list;
			for (var i in dataEach) {
				if (dataEach.hasOwnProperty(i)) {
					let msg = null;
					let all = null;
					let detailmsg = "";
					if (active == "masuk") {
						msg = dataEach[i].data;
						all = dataEach[i].all;
						detailmsg = dataEach[i].data.privmsg_body;
					}else if (active == "sampah") {
						msg = dataEach[i].data;
						all = dataEach[i].all;
						detailmsg = dataEach[i].data.privmsg_body;
					}else if (active=="terkirim") {
						let reciveMsg = dataEach[i].penerima;
						let user = "";
						for (var rm in reciveMsg) {
							if (reciveMsg.hasOwnProperty(rm)) {
								user +=reciveMsg[rm].jik_member.email;
								user += rm > 0 ? ", ":"";
							}
						}
						msg = {
							id : dataEach[i].id,
							subject : dataEach[i].subject,
							privmsg_body : dataEach[i].privmsg_body,
							date : dataEach[i].date,
							typeData : dataEach[i].typeData,
							user : user,
						}
						all = dataEach[i].all;
					}
					let dataView = {
									msg:msg,
									all:all,
									active:{
											tab:active,
											data:dataEach[i].all,
										},
									dataKey:i,
									data:data
								};
					viewList.push(<ItemList key={i} data={dataView} dataCb={(e)=>{ this.countMsgInbox(e); }} />);
				}
			}
			// cek page terakhir
			let dataOffset = data.offset + 10;
			let update = data.update;

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
									// this._getMessage({ offset:dataOffset })
									this.lcStorageCheck({ offset:dataOffset, update:update });
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

	_getMessage(more){
		let update = 0;
		let articleView = this.state.articleView;
		let jikMember = this.state.jikIkaMember.jikmember;
		let list = null;
		let limitList = 10;
		let offset = 0;
		let setOffset = 0;

		// console.log("more",more);
		if (typeof more != 'undefined') {
			if (typeof more.offset != 'undefined') {
				offset = more.offset;
				setOffset = offset;
				if (typeof more.update != 'undefined') {
					update = more.update;
					setOffset = offset + update;
					// setOffset = offset;
				}
			}
			// console.log("setOffset",setOffset);
		}

        var Param = {};
		let resource = "";
			// console.log("articleView => ",articleView)

		if (articleView == "terkirim") {
			Param['limit'] = limitList;
			Param['offset'] = setOffset;
			Param['join'] = 'JikMember,privmsgsTo';
			Param['where'] = 'privmsg_deleted:null,privmsg_author:'+jikMember;
			Param['orderBy'] = 'privmsg_date:desc';
			resource = api_uri+'JSON/Privmsgs?'+ArrayToQueryString(Param);
		}else if (articleView == "masuk") {
			Param['limit'] = limitList;
			Param['offset'] = setOffset;
			Param['join'] = 'JikMember,privmsgs';
			Param['where'] = 'pmto_deleted:null,pmto_recipient:'+jikMember;
			Param['orderBy'] = 'pmto_id:desc';
			resource = api_uri+'JSON/PrivmsgsTo?'+ArrayToQueryString(Param);
		}else if (articleView == "sampah") {
			Param['limit'] = limitList;
			Param['offset'] = setOffset;
			Param['join'] = 'JikMember,privmsgs';
			Param['where'] = 'pmto_deleted:notnull,pmto_recipient:'+jikMember;
			Param['orderBy'] = 'pmto_id:desc';
			resource = api_uri+'JSON/PrivmsgsTo?'+ArrayToQueryString(Param);
		}

		let dataList = {};
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);
		newComFetch.setResource(resource);
		newComFetch.sendFetch((resp) => {
                                if (resp.status == 200) {
									let dataView = this.state[articleView];
									let total = resp.data.count;
									let dataList = resp.data.data;
									let saveMsg = [];
									for (var i in dataList) {
										if (dataList.hasOwnProperty(i)) {
											if (articleView == "terkirim") {
												saveMsg.push({
																id : dataList[i].privmsg_id,
																penerima:dataList[i].privmsgs_to.data,
																pengirim:dataList[i].jik_member.email,
																user:dataList[i].privmsgs_to.data,
																subject : dataList[i].privmsg_subject,
																privmsg_body : dataList[i].privmsg_body,
																to : "",
																typeData :"Untuk",
																date:dataList[i].privmsg_date,
															});
											}else if (articleView == "masuk") {
												saveMsg.push({
																data:{
																	id : dataList[i].pmto_id,
																	penerima:dataList[i].jik_member.data.email,
																	pengirim:dataList[i].privmsgs.data.jik_member.email,
																	user:dataList[i].privmsgs.data.jik_member.member_id,
																	author: jikMember,
																	subject : dataList[i].privmsgs.data.privmsg_subject,
																	privmsg_body : dataList[i].privmsgs.data.privmsg_body,
																	to : "",
																	typeData :"Dari",
																	pmto_read:dataList[i].pmto_read,
																	date:dataList[i].privmsgs.data.privmsg_date,
																},
															});
											}else if (articleView == "sampah") {
												saveMsg.push({
																data:{
																	id : dataList[i].pmto_id,
																	penerima:dataList[i].jik_member.data.email,
																	pengirim:dataList[i].privmsgs.data.jik_member.email,
																	user:dataList[i].privmsgs.data.jik_member.member_id,
																	author: jikMember,
																	subject : dataList[i].privmsgs.data.privmsg_subject,
																	privmsg_body : dataList[i].privmsgs.data.privmsg_body,
																	to : "",
																	typeData :"Dari",
																	pmto_read:dataList[i].pmto_read,
																	date:dataList[i].privmsgs.data.privmsg_date,
																},
																all:dataList,
															});
											}

										}
									}

									if (more == true) {
										more == false;
										if (articleView == "masuk") {
											let stateCountInbox = this.state.countInbox;
											let countInbox = false;
											if (stateCountInbox > 0) {
												if (callback.countInbox > 0) {
													countInbox = stateCountInbox + callback.countInbox;
												}else{
													countInbox = stateCountInbox;
												}
											}
											this.setState({
												countInbox : countInbox,
											})
										}
									}
                                    // Set list artikel, jika ini halaman selanjutnya concat halaman sebelumnya
                                    if (dataView['list'] != null ) {
										dataView = dataView['list'].concat( saveMsg );
                                    }else{
										dataView = saveMsg;
									}
									let setData = [];
										setData[articleView] = {
																	list: dataView,
																	limitList:10,
																	offset:offset,
																	total: total,
																	update: update,
																};
										setData['more'] = false;
										let LCMessage = new ComLocalStorage;
											LCMessage.setMultiple(
												[
													['@jik:jikMessage'+articleView,
													JSON.stringify({
																		list: dataView,
																		limitList:10,
																		offset:offset,
																		total: total,
																		update: update,
																	}) ],
												],
												(callback)=>{
													this.setState(setData);
											});
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

	_onChangeTab(e){
		let articleView = false;
		this.masuk = {
						icon:{ color: '#C0C0C0' },
						text:{ color: '#C0C0C0' }
					}
		this.buat = {
						icon:{ color: '#C0C0C0' },
						text:{ color: '#C0C0C0' }
					}
		this.terkirim = {
						icon:{ color: '#C0C0C0' },
						text:{ color: '#C0C0C0' }
					}
		this.sampah = {
						icon:{ color: '#C0C0C0' },
						text:{ color: '#C0C0C0' }
					}
		switch(e.i) {
		    case 0:
				articleView ='masuk';
				this.masuk = {
								icon:{ color: '#b76329' },
								text:{ color: '#b76329' }
							}
		        break;
		    case 1:
				articleView ='buat';
				this.buat = {
								icon:{ color: '#b76329' },
								text:{ color: '#b76329' }
							}
		        break;
			case 2:
				articleView ='terkirim';
				this.terkirim = {
								icon:{ color: '#b76329' },
								text:{ color: '#b76329' }
							}
				break;
			case 3:
				articleView ='sampah';
				this.sampah = {
								icon:{ color: '#b76329' },
								text:{ color: '#b76329' }
							}
				break;
		    default:
				this.masuk = {
								icon:{ color: '#b76329' },
								text:{ color: '#b76329' }
							}
				articleView ='masuk';
		}
		this.setState({
						articleView:articleView,
						masuk:{
							list: null,
							limitList:10,
							offset:0,
							total:0,
						},
						terkirim:{
							list: null,
							limitList:10,
							offset:0,
							total:0,
						},
						sampah:{
							list: null,
							limitList:10,
							offset:0,
							total:0,
						},
					},
			()=>{
				if (articleView !== 'buat') {
					if (this.state[articleView].list == null) {
						this.lcStorageCheck();
					}
				}
		});
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
		let active = this.state.articleView;
		let data = {};
			data[active] = {
								list: null,
								limitList:10,
								offset:0,
								total:0,
								update:0,
							}
		this.setState(data,
		()=>{
			this.lcStorageCheck();
		});
	}

	render(){
		return(
			<View>

				<ScrollView onScroll={this.props.hideBtnOnScroll} refreshControl={this._refreshControl()} ref='ScrollView' style={{ backgroundColor:'#f0f0f0', }}>

					{/* start article */}

					<View style={{minHeight:Dimensions.get('window').height/2,backgroundColor:'#f0f0f0'}}>

						<View>
							<Tabs style={{backgroundColor:'#f0f0f0'}} onChangeTab={(e)=>this._onChangeTab(e)}>
								<Tab
									style={{marginTop:15,backgroundColor:'#f0f0f0'}}
									heading={
										<TabHeading style={{ paddingBottom:15, backgroundColor:"#FFF", }}
										activeTextStyle={{borderBottomWidth:5,borderBottomColor:'#000',fontWeight:'bold', }}>
											<View style={{ flexDirection:'column',  paddingTop:15,  }}>
												<View style={{ flex:1, alignItems:'center', alignSelf:'center', flexDirection:'row',paddingBottom:10, }}>
													<Icon style={ this.masuk.icon } name="ios-mail-outline"/>
													{ this.countInbox() }
												</View>
											</View>
										</TabHeading>}>
									{/*<View style={{ padding:15, marginBottom:15, paddingTop:0, paddingBottom:0, }}>
										<View style={{ flexDirection:'row', borderWidth:1, flex:1, borderColor:'#e0e0e0', padding:5, paddingRight:10, paddingLeft:5, }}>
											<TextInput
												style={{ flex:1, paddingBottom:0, paddingTop:0, color:'#c0c0c0', }}
												placeholder="cari"
												underlineColorAndroid="transparent"
											/>
											<TouchableHighlight>
												<View style={{ alignItems: 'flex-end', borderRadius:0, }}>
													<Icon style={{ fontSize:30, color:'#c0c0c0', }} name='ios-arrow-round-forward-outline' />
												</View>
											</TouchableHighlight>
										</View>
									</View>*/}
									{ this._viewData() }
								</Tab>
								<Tab
									style={{marginTop:15,backgroundColor:'#f0f0f0'}}
									heading={
										<TabHeading style={{ paddingBottom:15, backgroundColor:"#FFF", }}
										activeTextStyle={{borderBottomWidth:5,borderBottomColor:'#000',fontWeight:'bold', }}>
											<View style={{ flexDirection:'column',  paddingTop:15,  }}>
												<View style={{ flex:1, alignItems:'center', alignSelf:'center', flexDirection:'row',paddingBottom:10, }}>
													<Icon style={ this.buat.icon } name="ios-create-outline"/>
												</View>
											</View>
										</TabHeading>}>
									{ this._viewData() }
								</Tab>
								<Tab
									style={{marginTop:15,backgroundColor:'#f0f0f0'}}
									heading={
										<TabHeading style={{ paddingBottom:15, backgroundColor:"#FFF", }}
										activeTextStyle={{borderBottomWidth:5,borderBottomColor:'#000',fontWeight:'bold', }}>
											<View style={{ flexDirection:'column',  paddingTop:15,  }}>
												<View style={{ flex:1, alignItems:'center', alignSelf:'center', flexDirection:'row',paddingBottom:10, }}>
													<Icon style={ this.terkirim.icon } name="ios-paper-plane-outline"/>
												</View>
											</View>
										</TabHeading>}>
										{/*<View style={{ padding:15, marginBottom:15, paddingTop:0, paddingBottom:0, }}>
											<View style={{ flexDirection:'row', borderWidth:1, flex:1, borderColor:'#e0e0e0', padding:5, paddingRight:10, paddingLeft:5, }}>
												<TextInput
													style={{ flex:1, paddingBottom:0, paddingTop:0, color:'#c0c0c0', }}
													placeholder="cari"
													underlineColorAndroid="transparent"
												/>
												<TouchableHighlight>
													<View style={{ alignItems: 'flex-end', borderRadius:0, }}>
														<Icon style={{ fontSize:30, color:'#c0c0c0', }} name='ios-arrow-round-forward-outline' />
													</View>
												</TouchableHighlight>
											</View>
										</View>*/}
									{ this._viewData() }
								</Tab>
								<Tab
									style={{marginTop:15,backgroundColor:'#f0f0f0'}}
									heading={
										<TabHeading style={{ paddingBottom:15, backgroundColor:"#FFF", }}
										activeTextStyle={{borderBottomWidth:5,borderBottomColor:'#000',fontWeight:'bold', }}>
											<View style={{ flexDirection:'column',  paddingTop:15,  }}>
												<View style={{ flex:1, alignItems:'center', alignSelf:'center', flexDirection:'row',paddingBottom:10, }}>
													<Icon style={ this.sampah.icon } name="ios-trash-outline"/>
												</View>
											</View>
										</TabHeading>}>
										{/*<View style={{ padding:15, marginBottom:15, paddingTop:0, paddingBottom:0, }}>
											<View style={{ flexDirection:'row', borderWidth:1, flex:1, borderColor:'#e0e0e0', padding:5, paddingRight:10, paddingLeft:5, }}>
												<TextInput
													style={{ flex:1, paddingBottom:0, paddingTop:0, color:'#c0c0c0', }}
													placeholder="cari"
													underlineColorAndroid="transparent"
												/>
												<TouchableHighlight>
													<View style={{ alignItems: 'flex-end', borderRadius:0, }}>
														<Icon style={{ fontSize:30, color:'#c0c0c0', }} name='ios-arrow-round-forward-outline' />
													</View>
												</TouchableHighlight>
											</View>
										</View>
										<View style={{ padding:15, marginBottom:15, paddingTop:0, paddingBottom:0, flexDirection:'row', }}>
											<View style={{ flexDirection:'row', flex:1, }}>
												<View style={{ flexDirection:'row' }}>
													<View>
														<Icon name="ios-radio-button-off-outline" style={{ fontSize:30, padding:2.5, }}/>
													</View>
													<View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
														<Text>Semua</Text>
													</View>
												</View>
											</View>
											<View style={{ flexDirection:'row', alignSelf:'flex-end', }}>
												<View>
													<Icon name="ios-refresh-outline" style={{ fontSize:30, padding:2.5, }}/>
												</View>
											</View>
										</View>*/}
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
