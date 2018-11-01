import React, { Component } from 'react';
import {
	View,
	Text,
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
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import Service from '../../comp/Service';
import { base_url, api_uri, } from '../../comp/AppConfig';

/**
 * aksi untuk, tambah komentar
 * like status
 * follow un follow
 */
import ActionButton from './ActionButton';

export default class ItemList extends Component{

	width100 = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').height : Dimensions.get('window').width;
	dim8 = this.width100/8;

	ActionButton = new ActionButton;
	newmsg = <View/>
	msg = <View/>
	msgfooter = <View/>
	stylewrapper = {backgroundColor:'#fff',paddingLeft:15, paddingRight:15, marginLeft:15, marginRight:15, }
	_styleDesc = {
					masuk:{ height: 1, },
				}
	_styleReply = {
					masuk:{ height: 1, },
				}

	constructor(props){
		super(props);
		this.ismount = false;
		this.state = {
			msgfooter:<View/>,
			remove:false,
			styleReply:false,
			styleBtnReply : false,
			styleDesc:false,
			tojikmember:false,
			txtemail:"",
			txtreply:"",
			txttitle:"",
			countInbox:0,
			qauto:false,
		}
		if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}
	}

	_Actions(goto,data){
		let sendData = "";
		switch(goto) {
			case 'detailmsg':
				if (data.status == "masuk") {
					let styleDesc = true;
					if (this.state.styleDesc) {
						styleDesc = false;
					}else{
						/* read Message */
						this.props.data.msg.pmto_read = 1;
						this.ActionButton.readMsg(
							{ dataKey:this.props.data.dataKey, data:this.props.data.msg },
							(callback)=>{
								this.setState({
									countInbox:callback.countInbox,
								},()=>{
									this.props.dataCb({
										countInbox:callback.countInbox,
									});
								});
						});
						/* read Message */
					}
					this.setState({
						styleDesc:styleDesc,
					},()=>{
						LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
					});
				}else if (data.status == "terkirim") {
					Actions.JIKPesanDetail({ data:data.data });
				}else if(data.status == "sampah"){
					Actions.JIKPesanDetail({ data:{ msg:data.data, active:{ tab:data.status } } });
				}

				break;
		    case 'replymsg':
				if (data.status == "masuk") {
					let styleReply = true;
					if (this.state.styleReply) {
						styleReply = false;
					}
					this.setState({
						styleReply:styleReply,
					},()=>{
						LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
					});
				}
		        break;
		    case 'removesampah':
				let _remove = true;
				if (this.state.remove) {
					_remove = false;
				}
				this.setState({
					remove:_remove,
				})
		        break;
			case 'sendreply':
				if (data.status == "masuk") {
					this.ActionButton.submitData({data: data, desc:this.state.txtreply, title:this.state.txttitle},
						(callback)=>{
							let description = "Mohon maaf koneksi internet mengalami gangguan";
							if (callback.status == 200) {
								description = "Sukses balas pesan";
								Service._wsSend(JSON.stringify({
										jik:{
											apps_jik_message_inbox:{
												data: {
													author : data.data.user,
													date : "2017-06-07 09:33:58",
													id : callback.data.id,
													penerima : data.data.pengirim,
													pengirim : data.data.penerima,
													pmto_read : null,
													privmsg_body : this.state.txtreply,
													subject : this.state.txttitle,
													to : "",
													typeData : "Dari",
													user : data.data.author,
												},
											},
										},
								}));
							}
							Alert.alert(
								'Informasi',
								description,
								[
									{text: 'OK', onPress: () => {
											this.setState({
												styleReply:false,
												styleBtnReply:false,
												txttitle:"",
												txtreply:"",
											},()=>{
												LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
											});
										}
									},
								],
							);
						});
				}else if (data.status == "newmessage") {
					this._Actions({data:this.state.txtemail})
					this.ActionButton.getInfo((e)=>{
						this.ActionButton.submitData(
						{
							data: data,
							penerima : this.state.txtemail,
							jikmember:e.jikmember,
							tojikmember:this.state.tojikmember.jikmember,
							desc:this.state.txtreply,
							title:this.state.txttitle
						},
						(callback)=>{
							let description = "Mohon maaf koneksi internet mengalami gangguan";
							if (callback.status == 200) {
								description = "Sukses mengirim pesan";
								this.ActionButton.newMsgLC({
									refresh:true
								},(callbackNew)=>{
									/* send message to user */
									Service._wsSend(JSON.stringify({
											jik:{
												apps_jik_message_inbox:{
													data: {
														author : callback.data.pmto_recipient,
														date : "2017-06-07 09:33:58",
														id : callback.data.id,
														penerima : this.state.txtemail,
														pengirim : e.email,
														pmto_read : null,
														privmsg_body : this.state.txtreply,
														subject : this.state.txttitle,
														to : "",
														typeData : "Dari",
														user : e.jikmember,
													},
													new:true,
												},
											},
									}));
									Alert.alert(
										'Informasi',
										description,
										[
											{text: 'OK', onPress: () => {
													this.setState({
														styleReply:false,
														styleBtnReply:false,
														txtemail : "",
														txtreply : "",
														txttitle : "",
													},()=>{
														LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
													});
												}
											},
										],
									);
								});
							}else{
								Alert.alert(
									'Informasi',
									description,
									[
										{text: 'OK', onPress: () => {
												this.setState({
													styleReply:false,
													styleBtnReply:false,
													txtemail : "",
													txtreply : "",
													txttitle : "",
												},()=>{
													LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
												});
											}
										},
									],
								);
							}
						});
					});
				}
				break;
			case 'btnreply':
				if (data.status == "masuk") {
					let styleBtnReply = true;
					if (this.state.styleBtnReply) {
						styleBtnReply = false;
					}
					if(this.state.txtreply !== ""){
						this.setState({
							styleBtnReply:styleBtnReply,
						},()=>{
							this._Actions('sendreply',data);
							LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
						});
					}
				}else if (data.status == "newmessage") {
					let styleBtnReply = true;
					if (this.state.styleBtnReply) {
						styleBtnReply = false;
					}
					if(this.state.txtreply !== "" && this.state.txtemail !== "" && this.state.txttitle !== ""){
						this.setState({
							styleBtnReply:styleBtnReply,
						},()=>{
							this._Actions('sendreply',data);
							LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
						});
					}
				}
				break;
			case 'remove':
				Alert.alert(
					'Informasi',
					"Apakah anda yakin akan menghapus pesan "+data.status+" tersebut ?",
					[
						{text: 'OK', onPress: () => {
								this.ActionButton.removeMsg(
									{status : data.status, id:data.id},
									(e)=>{
										/* inbox message */
										if (data.status == 'masuk') {
											if (e.data > 0) {
												this.ActionButton.removeMsgInbox(
													(x)=>{
														this.props.dataCb({
															removeMsgInbox:true,
															status:data.status,
														});
													}
												)
											}
										}
										/* inbox message */
										if (data.status == 'terkirim') {
											this.ActionButton.removeMsgSend(
												(x)=>{
													this.props.dataCb({
														removeMsgInbox:true,
														status:data.status,
													});
												}
											)
										}
								})
							}
						},
						{
							text: 'Cancel', onPress: () => {
							}
						},
					],
				);
				break;
			case 'getjikmember':
				let Param = {};
				Param['join'] = 'ikaMember,ikaMemberProfile';
				Param['where'] = 'email:'+data.email;
				let resource = api_uri+'JSON/JikMember?'+ArrayToQueryString(Param);
				let IKComFetch = new ComFetch();
				IKComFetch.setHeaders({Authorization:this.jwt_signature});
				IKComFetch.setRestURL(base_url);
				// Ambil data Article
				IKComFetch.setResource(resource);
				IKComFetch.sendFetch((resp) => {
										if (resp.status == 200) {
											let jikMember = resp.data;
											if (jikMember.count > 0) {
												let jikikamember = {
																		thumbme : imgThumb+jikMember.data[0].ika_member_profile.data.profile_picture+'?w=100&dir=_images_member',
																		jikmember : jikMember.data[0].member_id,
																		ikamember : jikMember.data[0].ika_member.data.member_id,
																		email : jikMember.data[0].email,
																	}
												this.setState({
													tojikmember:jikikamember,
												})

											}
										}
									});
				break;
			case 'restore':
				Alert.alert(
					'Informasi',
					"Apakah anda yakin akan mengembalikan pesan tersebut ?",
					[
						{text: 'OK', onPress: () => {
								this.ActionButton.restoreMsg(
									{status : data.status, id:data.id},
									(e)=>{
								})
							}
						},
						{
							text: 'Cancel', onPress: () => {
							}
						},
					],
				);
				break;
			default:
		        return ()=>{ };
		}
	}

	autocomplete(e){
		this.setState({txtemail:e},()=>{
			if(e.length >= 3){
				let Param = {};
					Param['limit'] = '5';
					Param['where'] = 'email:like:'+e;
					let resource = api_uri+'JSON/JikMember?'+ArrayToQueryString(Param);
					let IKComFetch = new ComFetch();
					IKComFetch.setHeaders({Authorization:this.jwt_signature});
					IKComFetch.setRestURL(base_url);
					// Ambil data Article
					IKComFetch.setResource(resource);
					IKComFetch.sendFetch((resp) => {
						if(resp.status == 200){
							this.setState({
								qauto:resp.data.data,
							})
						}
					});
			}else{
				this.setState({ qauto:false, });
			}
		})
	}

	autocompleteView(){
		let list = new Array();
		let qauto = this.state.qauto;

		if(qauto){
			list = new Array();
			if(qauto.length){
				for (var i in qauto) {
					if (qauto.hasOwnProperty(i)) {
						let element = qauto[i];
						let elemenStyle = i > 0 ? { borderTopWidth:1, borderColor:'#d0d0d0' } : {  };
						list.push(
							<View key={ i }>
								<TouchableHighlight
								onPress={()=>{ this.setState({ txtemail:element.email, qauto:false, }) }}>
									<View style={[ elemenStyle ,{ paddingTop: 5, paddingBottom:5, }] }><Text>{element.email}</Text></View>
								</TouchableHighlight>
							</View>
						)
					}
				}
			}else{
				list.push(
					<View key={ 1 }>
						<Text>Data tidak ditemukan</Text>
					</View>
				)
			}

			return(
				<View style={{ position: 'absolute', left: 0, top:0, right:0, backgroundColor:'#fff', borderWidth:1, borderColor:'#d0d0d0', zIndex: 100, padding:10 }}>
					{ list }
				</View>
			)
		}else{
			return <View/>
		}
	}

	ListNew(){
		// new message
		if (this.props.data.newmsg !== false && typeof this.props.data.newmsg !== "undefined") {

			let submitbtn = <View style={{ paddingLeft:15, paddingRight:15, }}>
								<TouchableHighlight
								onPress={()=>{ this._Actions("btnreply",{ status:'newmessage', }); }}>
									<View style={{ backgroundColor: '#e0e0e0', padding:10, flex:1, }}>
										<Text style={{ textAlign:'center', color:'#c0c0c0', fontSize:18, }}>KIRIM</Text>
									</View>
								</TouchableHighlight>
							</View>

			let viewSubmit = submitbtn;
			if (this.state.styleBtnReply) {
				viewSubmit = <View><Spinner/></View>
			}

			this.newmsg = <View>
							<View style={[ this.stylewrapper,{ paddingBottom:15, paddingTop:15, } ]}>
								<View>
									<View style={{ flexDirection:'row', paddingBottom:15, borderBottomWidth:1, borderColor:'#f0f0f0', }}>
										<View style={{ alignSelf:'center', justifyContent:'center' }}>
											<Text style={{ paddingLeft:5, paddingRight:5, marginLeft:0, marginRight:0, color:'#d0d0d0', }}>Untuk :</Text>
										</View>
										<View style={{ flex:1, alignSelf:'center', justifyContent:'center', }}>
											<TextInput
												style={{ padding:0, height:20, fontSize:15 }}
												underlineColorAndroid='transparent'
												onChangeText={(text) => this.autocomplete(text)}
												value={this.state.txtemail}
											placeholder="contoh@ika.com"/>
										</View>
									</View>
								</View>
								<View style={{ zIndex:100 }}>{ this.autocompleteView() }</View>								
								<View style={{ zIndex:1, flexDirection:'row', paddingBottom:15, borderBottomWidth:1, borderColor:'#f0f0f0', marginTop:10, }}>
									<View style={{ alignSelf:'center', justifyContent:'center' }}>
										<Text style={{ paddingLeft:5, paddingRight:5, marginLeft:0, marginRight:0, color:'#d0d0d0', }}>Judul : </Text>
									</View>
									<View style={{ flex:1, alignSelf:'center', justifyContent:'center', }}>
										<TextInput
											underlineColorAndroid='transparent'
											style={{ padding:0, margin:0, flex:1, height:20, fontSize:15 }}
											onChangeText={(text) => this.setState({txttitle:text})}
										placeholder="Liburan"/>
									</View>
								</View>
								<View style={{ zIndex:1, marginTop:10, }}>
									<View>
										<Text style={{ paddingLeft:5, paddingRight:5, marginLeft:0, marginRight:0, color:'#d0d0d0', }}>Tulis Pesan</Text>
									</View>
									<View style={{ flexDirection:'row', paddingBottom:15, borderWidth:1, borderColor:'#f0f0f0', marginTop:10, }}>
										<TextInput
											underlineColorAndroid="transparent"
											placeholderTextColor={'#d0d0d0'}
											numberOfLines = {6}
											multiline={ true }
											onChangeText={(text) => this.setState({txtreply:text})}
											style={{ padding:0, margin:0, flex:1, paddingLeft:15, height:60 }}
										/>
									</View>
								</View>
							</View>
							<View>
								{ viewSubmit }
							</View>
						</View>
			return this.newmsg;
		}

		//pesan saya
		if (this.props.data.msg !== false && typeof this.props.data.msg !== "undefined" && this.props.data.msg !== "") {
			let dateTime = <View/>
			let msg = this.props.data.msg;
			//pesan saya masuk
			if (this.props.data.active !== false && typeof this.props.data.active !== "undefined" && this.props.data.active !== "") {
				let msgfooter = <View/>
				if (this.props.data.active.tab == "masuk") {
					let dateTime = <View/>
					this._styleDesc['masuk'] = { height:1, }
					this._styleReply['masuk'] = { height:1, }
					if (this.state.styleDesc) {
						this._styleDesc['masuk'] = { padding:15, }
					}

					if (this.state.styleReply) {
						this._styleReply['masuk'] = { padding:15, }
					}

					this.ActionButton.formatDate(
						{
							dmy:msg.date,
							hhmmss:msg.date
						},
						(callback)=>{
							dateTime = <View style={{ flexDirection:'row', paddingBottom:10, }}>
												<View style={{ flexDirection:'row', }}>
													<IonIcon style={{ fontSize:14, marginRight:5, marginTop:2, color:'#b76329', }} name="ios-calendar-outline"/>
													<Text style={{ fontSize:14, color:'#b76329', }}>{ callback.data.dmy }</Text>
												</View>
												<View style={{ marginRight:7.5, marginLeft:7.5, }}>
													<Text style={{ fontSize:14, color:'#b76329', }}>|</Text>
												</View>
												<View>
													<Text style={{ fontSize:14, color:'#b76329', }}>{ callback.data.hhmmss }</Text>
												</View>

											</View>
						}
					);

					let btnStyle = { backgroundColor:'#dcdcdc',};
					if(this.state.txtreply !== ""){
						btnStyle = { backgroundColor:'#acacac',};
					}

					let submitbtn = <View>
										<TouchableHighlight
										onPress={()=>{ this._Actions("btnreply",{ status:this.props.data.active.tab, data:msg }); }}>
											<View style={[ btnStyle ,{ padding:10, }]}>
												<Text style={{ textAlign:'center' }}>Kirim Pesan</Text>
											</View>
										</TouchableHighlight>
									</View>

					let viewSubmit = submitbtn;
					if (this.state.styleBtnReply) {
						viewSubmit = <View><Spinner/></View>
					}

					let mark = <View/>
					if (this.props.data.msg.pmto_read == null) {
						mark = <View style={{ position:'absolute', backgroundColor:'#999', width:15, height:15, borderRadius:15, margin:15, right:15, }}/>
					}

					return (
							<View>
								<View style={{ padding:15, paddingTop:0, paddingBottom:0, backgroundColor:'#F0F0F0', }}>
									<TouchableHighlight
									onPress={()=>this._Actions('detailmsg',{status:this.props.data.active.tab})}>
										<View style={{ padding:15, backgroundColor:'#fff'}}>
											<View style={{ padding:2.5, }}>
												<Text style={{ fontSize:20, }}>{ msg.subject }</Text>
											</View>
											<View style={{ padding:2.5, }}>
												{ dateTime }
											</View>
											{ mark }
										</View>
									</TouchableHighlight>
								</View>
								<View style={{ marginBottom:15, paddingLeft:0, paddingRight:0, }}>
									<View style={ this.stylewrapper }>
										<View style={{ flexDirection:'row', borderTopWidth:1, borderColor:'#F5F5F5', marginTop:15, paddingTop:15, paddingBottom:15, }}>
											<View style={{ flex:1, flexDirection:'row', alignItems: 'center' }}>
												<Text style={{ fontSize:14, }}>{ msg.typeData+" : "+msg.pengirim }</Text>
											</View>
											<View style={{ flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end', }}>
												<View style={{ borderColor:'#F5F5F5', borderRightWidth:1, }}>
													<TouchableHighlight
													onPress={()=>this._Actions('replymsg',{status:this.props.data.active.tab})}
													>
														<View style={{ padding:2.5, width:this.dim8, height:this.dim8, borderRadius:this.dim8, flexDirection: 'row', justifyContent:'center',alignItems:'center', backgroundColor:'#fff', }}>
															<IonIcon name="ios-undo-outline" style={{ fontSize:20, color:'#C0C0C0', }}/>
														</View>
													</TouchableHighlight>
												</View>
												<View style={{ }}>
													<TouchableHighlight
													onPress={()=>{
														this._Actions('remove',{status:this.props.data.active.tab, id:this.props.data.msg.id, });
													}}>
														<View style={{ padding:2.5, width:this.dim8, height:this.dim8, borderRadius:this.dim8, flexDirection: 'row', justifyContent:'center',alignItems:'center', backgroundColor:'#fff', }}>
															<IonIcon name="ios-trash-outline" style={{ fontSize:20, color:'#C0C0C0', }}/>
														</View>
													</TouchableHighlight>
												</View>
											</View>
										</View>
									</View>
									<View style={[this.stylewrapper,{ backgroundColor:'#e7e7e7', paddingBottom:1,  }, this._styleDesc.masuk ]}>
										<View style={{ borderBottomWidth:1, borderColor:'#c0c0c0', paddingBottom:15, }}>
											<Text>{ msg.privmsg_body }</Text>
										</View>
									</View>
									<View style={[this.stylewrapper,{ backgroundColor:'#e7e7e7', paddingTop:1, }, this._styleReply.masuk ]}>
										<View style={{ borderTopWidth:1, borderColor:'#c0c0c0', paddingBottom:0, paddingTop:15, }}>
											<View style={{ borderBottomWidth:1, borderColor:'#c0c0c0', paddingBottom:5, marginBottom:15, }}>
												<Text style={{ fontSize:14, }}>{ "Untuk : "+msg.pengirim }</Text>
											</View>
											<View style={{ borderBottomWidth:1, borderColor:'#c0c0c0', paddingBottom:5, marginBottom:15, }}>
												<TextInput
													placeholder="Judul"
													underlineColorAndroid="transparent"
													style={{ padding:0, margin:0, height:20, fontSize:15 }}
													onChangeText={(text) => this.setState({txttitle:text})}
												/>
											</View>
											<View>
												<TextInput
													placeholder="Tulis Pesan"
													underlineColorAndroid="transparent"
													numberOfLines = {4}
													multiline={ true }
													style={{ padding:0, margin:0, height:60, fontSize:15 }}
													onChangeText={(text) => this.setState({txtreply:text})}
												/>
											</View>
											<View>
												{ viewSubmit }
											</View>
										</View>
									</View>
								</View>
							</View>
						);

				}else if(this.props.data.active.tab == "terkirim") {
					this.ActionButton.formatDate(
						{
							dmy:msg.date,
							hhmmss:msg.date
						},
						(callback)=>{
							dateTime = <View>
											<View style={{ flexDirection:'row', borderBottomWidth:1, borderColor:'#F5F5F5', paddingTop:15, paddingBottom:15, }}>
												<View style={{ flex:1, flexDirection:'row', alignItems: 'center' }}>
													<Text style={{ fontSize:14, }}>{ msg.user }</Text>
												</View>
												<View style={{ flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end', }}>
													<View>
														<View style={{ padding:2.5, flex:1, flexDirection: 'row', justifyContent:'center',alignItems:'center', }}>
															<Text style={{ fontSize:14, color:'#b76329', }}>{ callback.data.dmy }</Text>
														</View>
													</View>
													<View>
														<View style={{ padding:2.5, paddingRight:0, paddingLeft:10, flexDirection: 'row', justifyContent:'center',alignItems:'center', }}>
															<IonIcon name="ios-arrow-forward-outline" style={{ fontSize:20, color:'#C0C0C0', }}/>
														</View>
													</View>
												</View>
											</View>
										</View>
						}
					);
					return (<View style={[ this.stylewrapper,{ marginBottom:15, } ]}>
								<View>
									<TouchableHighlight
									onPress={()=>this._Actions('detailmsg',{status:this.props.data.active.tab, data:this.props.data })}>
										<View>
											<View>
													{ dateTime }
											</View>
											<View style={{ paddingTop:15, paddingBottom:30, }}>
												<Text style={{ fontSize:20, }}>{ msg.subject }</Text>
											</View>
										</View>
									</TouchableHighlight>
								</View>
								<View style={{ alignSelf:'flex-end', }}>
									<View>
										<TouchableHighlight
										onPress={()=>{
											this._Actions('remove',{status:this.props.data.active.tab, id:this.props.data.msg.id,});
										}}>
											<View style={{ padding:15, paddingRight:0, }}>
												<IonIcon name="ios-trash-outline" style={{ fontSize:20, color:'#C0C0C0', }}/>
											</View>
										</TouchableHighlight>
									</View>
								</View>
							</View>);

				}else if(this.props.data.active.tab == "sampah") {
					this.ActionButton.formatDate(
						{
							dmy:msg.date,
							hhmmss:msg.date
						},
						(callback)=>{
							dateTime = <View>
											<View style={{ flexDirection:'row', borderBottomWidth:1, borderColor:'#F5F5F5', paddingTop:15, paddingBottom:15, }}>
												<View style={{ flex:1, flexDirection:'row', alignItems: 'center' }}>
													<Text style={{ fontSize:14, }}>{ msg.pengirim }</Text>
												</View>
												<View style={{ flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end', }}>
													<View>
														<View style={{ padding:2.5, flex:1, flexDirection: 'row', justifyContent:'center',alignItems:'center', }}>
															<Text style={{ fontSize:14, color:'#b76329', }}>{ callback.data.dmy }</Text>
														</View>
													</View>
													<View>
														<View style={{ padding:2.5, paddingRight:0, paddingLeft:10, flexDirection: 'row', justifyContent:'center',alignItems:'center', }}>
															<IonIcon name="ios-arrow-forward-outline" style={{ fontSize:20, color:'#C0C0C0', }}/>
														</View>
													</View>
												</View>
											</View>
										</View>
						}
					);
					let _remove = "ios-radio-button-off-outline";
					if (this.state.remove) {
						_remove = "ios-radio-button-on-outline";
					}

					return (<View style={[ this.stylewrapper,{ marginBottom:15, flexDirection:'row', } ]}>
								{/*<View style={{ flexDirection: 'row', justifyContent:'center',alignItems:'center', paddingRight:10,}}>
									<TouchableHighlight
									onPress={()=>{
										this._Actions('removesampah');
									}}>
										<View>
											<IonIcon name={ _remove } style={{ fontSize:20, padding:2.5, }}/>
										</View>
									</TouchableHighlight>
								</View>*/}
								<View style={{ flex:1, }}>
									<View>
										<TouchableHighlight
										onPress={()=>this._Actions('detailmsg',{status:this.props.data.active.tab, data:msg })}>
											<View>
												<View>
													{ dateTime }
												</View>
												<View style={{ paddingTop:15, paddingBottom:30, }}>
													<Text style={{ fontSize:20, }}>{ msg.subject }</Text>
												</View>
											</View>
										</TouchableHighlight>
									</View>
									<View style={{ flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end', borderTopWidth:1, borderColor:'#F5F5F5', marginTop:15, paddingTop:15, paddingBottom:15, }}>
										{/* {<View>
											<TouchableHighlight
											onPress={()=>this._Actions('restore',{status:this.props.data.active.tab, id:this.props.data.msg.id, })}
											>
												<View style={{ padding:2.5, width:this.dim8, height:this.dim8, borderRadius:this.dim8, flexDirection: 'row', justifyContent:'center',alignItems:'center', backgroundColor:'#fff', }}>
													<IonIcon name="ios-undo-outline" style={{ fontSize:20, color:'#C0C0C0', }}/>
												</View>
											</TouchableHighlight>
										</View>} */}
										{/*<View style={{ }}>
											<TouchableHighlight
											onPress={()=>{
												this._Actions('remove',{status:this.props.data.active.tab});
											}}>
												<View style={{ padding:2.5, width:this.dim8, height:this.dim8, borderRadius:this.dim8, flexDirection: 'row', justifyContent:'center',alignItems:'center', backgroundColor:'#fff', }}>
													<IonIcon name="ios-trash-outline" style={{ fontSize:20, color:'#C0C0C0', }}/>
												</View>
											</TouchableHighlight>
										</View>*/}
									</View>
								</View>
							</View>);
				}

			}
		}

	}

	render(){
		return(
			<View>
				{ this.ListNew() }
			</View>
		);
	}

}
