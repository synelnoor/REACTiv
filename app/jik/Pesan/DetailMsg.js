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
	ScrollView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FooterBtm from '../FooterBtm';

/**
 * aksi untuk, tambah komentar
 * like status
 * follow un follow
 */
import ActionButton from '../CompItemList/ActionButton';

export default class DetailMsg extends Component{

	width100 = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').height : Dimensions.get('window').width;
	dim8 = this.width100/8;

	ActionButton = new ActionButton;
	newmsg = <View/>
	msg = <View/>
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
			remove:false,
			styleReply:false,
			styleDesc:false
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
					}
					this.setState({
						styleDesc:styleDesc,
					},()=>{
						LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
					});
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
			case 'remove':
				Alert.alert(
					'Informasi',
					"Apakah anda yakin akan menghapus pesan "+data.status+" tersebut ?",
					[
						{text: 'OK', onPress: () => {
								this.ActionButton.removeMsg(
									{status : data.status, id:data.id},
									(e)=>{
										if (data.status == 'terkirim') {
											this.ActionButton.removeMsgSend(
												(x)=>{
													Actions.pop( {refresh: {variable: "test"} })
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
		    default:
		        return ()=>{ };
		}
	}

	componentWillMount(){
		console.log("Data => data ",this.props)
	}

	ListNew(){
		//pesan saya
		if (this.props.data.msg !== false && typeof this.props.data.msg !== "undefined" && this.props.data.msg !== "") {
			let dateTime = <View/>
			let msg = this.props.data.msg;

			//pesan saya masuk
			if (this.props.data.active !== false && typeof this.props.data.active !== "undefined" && this.props.data.active !== "") {
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
										</View>
									</TouchableHighlight>
								</View>
								<View style={{ marginBottom:15, paddingLeft:0, paddingRight:0, }}>
									<View style={ this.stylewrapper }>
										<View style={{ flexDirection:'row', borderTopWidth:1, borderColor:'#F5F5F5', marginTop:15, paddingTop:15, paddingBottom:15, }}>
											<View style={{ flex:1, flexDirection:'row', alignItems: 'center' }}>
												<Text style={{ fontSize:14, }}>{ msg.typeData+" : "+msg.user }</Text>
											</View>
											<View style={{ flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end', }}>
												<View style={{ borderColor:'#F5F5F5', borderRightWidth:1, }}>
													<TouchableHighlight
													onPress={()=>this._Actions('replymsg',{status:this.props.data.active.tab})}
													>
														<View style={{ padding:2.5, width:this.dim8, height:this.dim8, borderRadius:this.dim8, flexDirection: 'row', justifyContent:'center',alignItems:'center', backgroundColor:'#fff', }}>
															<IonIcon name="ios-undo-outline" style={{ fontSize:20, }}/>
														</View>
													</TouchableHighlight>
												</View>
												<View style={{ }}>
													<TouchableHighlight
													onPress={()=>{

													}}>
														<View style={{ padding:2.5, width:this.dim8, height:this.dim8, borderRadius:this.dim8, flexDirection: 'row', justifyContent:'center',alignItems:'center', backgroundColor:'#fff', }}>
															<IonIcon name="ios-trash-outline" style={{ fontSize:20, }}/>
														</View>
													</TouchableHighlight>
												</View>
											</View>
										</View>
									</View>
									<View style={[this.stylewrapper,{ backgroundColor:'#e7e7e7', paddingBottom:1,  }, this._styleDesc.masuk ]}>
										<View style={{ borderBottomWidth:1, borderColor:'#c0c0c0', paddingBottom:15, }}>
											<Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
										</View>
									</View>
									<View style={[this.stylewrapper,{ backgroundColor:'#e7e7e7', paddingTop:1, }, this._styleReply.masuk ]}>
										<View style={{ borderTopWidth:1, borderColor:'#c0c0c0', paddingBottom:0, paddingTop:15, }}>
											<View style={{ borderBottomWidth:1, borderColor:'#c0c0c0', paddingBottom:5, marginBottom:15, }}>
												<Text style={{ fontSize:14, }}>{ "Untuk : "+msg.user }</Text>
											</View>
											<View>
												<TextInput
													placeholder="Tulis Pesan"
													underlineColorAndroid="transparent"
													numberOfLines = {4}
													multiline={ true }
													style={{ padding:0, margin:0, }}
												/>
											</View>
											<View>
												<TouchableHighlight>
													<View style={{ backgroundColor:'#acacac', padding:10, }}>
														<Text style={{ textAlign:'center' }}>Kirim Pesan</Text>
													</View>
												</TouchableHighlight>
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
					return (<View>
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
										</View>
									</TouchableHighlight>
								</View>
								<View style={{ marginBottom:15, paddingLeft:0, paddingRight:0, }}>
									<View style={ this.stylewrapper }>
										<View style={{ flexDirection:'row', borderTopWidth:1, borderColor:'#F5F5F5', marginTop:15, paddingTop:15, paddingBottom:15, }}>
											<View style={{ flex:1, flexDirection:'row', alignItems: 'center' }}>
												<Text style={{ fontSize:14, }}>{ msg.typeData+" : "+msg.user }</Text>
											</View>
											<View style={{ flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end', }}>
												<View style={{ }}>
													<TouchableHighlight
													onPress={()=>{
														this._Actions('remove',{status:this.props.data.active.tab, id:this.props.data.msg.id,});
													}}>
														<View style={{ padding:2.5, width:this.dim8, height:this.dim8, borderRadius:this.dim8, flexDirection: 'row', justifyContent:'center',alignItems:'center', backgroundColor:'#fff', }}>
															<IonIcon name="ios-trash-outline" style={{ fontSize:20, }}/>
														</View>
													</TouchableHighlight>
												</View>
											</View>
										</View>
									</View>
									<View style={[this.stylewrapper,{ backgroundColor:'#e7e7e7', paddingBottom:1,  }, ]}>
										<View style={{ paddingBottom:15, paddingTop:15, }}>
											<Text style={{ lineHeight:25, }}>{msg.privmsg_body}</Text>
										</View>
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
					return (<View>
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
										</View>
									</TouchableHighlight>
								</View>
								<View style={{ marginBottom:15, paddingLeft:0, paddingRight:0, }}>
									<View style={ this.stylewrapper }>
										<View style={{ flexDirection:'row', borderTopWidth:1, borderColor:'#F5F5F5', marginTop:15, paddingTop:15, paddingBottom:15, }}>
											<View style={{ flex:1, flexDirection:'row', alignItems: 'center' }}>
												<Text style={{ fontSize:14, }}>{ msg.typeData+" : "+msg.pengirim }</Text>
											</View>
										</View>
									</View>
									<View style={[this.stylewrapper,{ backgroundColor:'#e7e7e7', paddingBottom:1,  }, ]}>
										<View style={{ paddingBottom:15, paddingTop:15, }}>
											<Text style={{ lineHeight:25, }}>{msg.privmsg_body}</Text>
										</View>
									</View>
								</View>
							</View>);
				}

			}

		}

	}

	render(){
		return(
			<View style={{ flex:1, }}>
				<ScrollView style={{backgroundColor:'#F0F0F0'}} ref='ScrollView'>


					{/* start timeline */}

					<View style={{minHeight:Dimensions.get('window').height/2,backgroundColor:'#F0F0F0'}}>

						<View style={{ paddingTop:15, backgroundColor:'#F0F0F0', }}>

							{ this.ListNew() }

						</View>

					</View>

					{/* end timeline */}

				</ScrollView>
				<FooterBtm/>
			</View>
		);
	}

}
