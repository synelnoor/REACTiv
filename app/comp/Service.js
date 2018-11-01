import React, { Component } from 'react';
import {
	Alert,
	View,
	Text,
	TouchableHighlight
} from 'react-native';
import ComLocalStorage from './ComLocalStorage';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import IonIcon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import ComFetch from './ComFetch';
import ArrayToQueryString from './ArrayToQueryString';
import { base_url, api_uri } from './AppConfig';
import Geolocation from './Geolocation';

let ymdhis = moment().format('YYYY-MM-DD h:mm:ss');
let jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

/* start websocket */
	const WebSocket = require('reconnecting-websocket');
	let serverPath = 'wss://indonesiakaya.com';
	let connect = false;
	const ws = new WebSocket(serverPath);
/* start websocket */

/* start kegiatan */
	let ms = 60000;
	let loop = false;
	let running = false;
	let try_request = 0;
	let try_limit = 10;
	let notifTime = '09:00:00';
/* end kegiatan */

/* USE
	import Service from '../../comp/Service';

	componentDidMount(){
		Service._wsOnmessage((e)=>{
			//console.log(e);
		});

		setTimeout(()=>{
			Service._wsSend('123');
		},2000);
	}
*/

export default class Service extends Component{
	constructor(props){
		super(props);

		/*
		ComLocalStorage.removeItem('temp','kegiatan',()=>{
			ComLocalStorage.removeItem('temp','kegiatan_status',()=>{
				alert('kegiatan telah dibersihkan');
			});
		});
		return false;
		*/

		this.ismount = false;
		this.state = {
			connect:connect,
			hide:false,
		};

		PushNotification.configure({
			onNotification:function(e){
				if(typeof e.message !== 'undefined'){
					if(typeof e.data !== 'undefined' && typeof e.data.actions !== 'undefined'){
						if(
							e.data.actions === 'message' &&
							typeof e.data.message !== 'undefined'
						){
							Alert.alert(
								'Pesan',
								e.data.message,
								[
									{text:'Selesai',onPress:()=>{}}
								]
							)
						}
						else if(
							e.data.actions === 'kegiatan' &&
							typeof e.data.title !== 'undefined' &&
							typeof e.data.ymd !== 'undefined'
						){
							Alert.alert(
								'Pesan',
								'Anda terdaftar di acara / kegiatan "'+e.data.title+' pada '+e.data.ymd,
								[
									{text:'Selesai',onPress:()=>{}}
								]
							)
						}
						else if(
							e.data.actions === 'notif' &&
							typeof e.data.message !== 'undefined'
						){
							Alert.alert(
								'Notifikasi',
								e.data.message,
								[
									{
										text:'Tutup',
										onPress:()=>{}
									}
								]
							)
						}
						else{
							Alert.alert(
								'Pesan',
								e.message,
								[
									{text:'Selesai',onPress:()=>{}}
								]
							)
						}
					}
					else{
						Alert.alert(
							'Pesan',
							e.message,
							[
								{text:'Selesai',onPress:()=>{}}
							]
						)
					}
				}
			}
		});
		this._startWebSocket();
		//this._watchGeo();
		/*if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	componentDidMount(){
		this.ismount = true;
	}

	componentWillUnmount(){
		this.ismount = false;
		// this.constructor._wsSend({
		// 	"apps_ik_home_articlelatest": "2017-10-27 10:41:45",
		// 	"apps_ik_home_articlepopular": "2017-10-27 10:41:45",
		// 	"apps_gik_news_articlelatest": "2017-10-27 10:41:45"
		// }, false);

		this._getNotifTime();
	}

	static sleep(time){
		return new Promise(resolve=>setTimeout(resolve,time));
	}

	/* start websocket */
	_startWebSocket(){
		ws.onopen = (e) => {
			connect = true;
			if(this.ismount){
				this.setState({
					connect:connect,
					hide:false,
				},()=>{
					this._updateKegiatanOffline();
					this.constructor._rebuildKegiatan();
				});
			}
			this.constructor._getGeo();
		};

		ws.onclose = (e) => {
			connect = false;
			if(this.ismount){
				this.setState({
					connect:connect,
				});
			}
		};

		ws.onerror = (e) => {
			connect = false;
			if(this.ismount){
				//LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
				this.setState({
					connect:connect,
				});
			}
		};

		this.constructor._wsOnmessage(()=>{});
	}

	static _wsOnmessage(callback){
		ws.onmessage = (e) => {
			let data = JSON.parse(e.data);

			//console.log(data);

			if(typeof data !== 'undefined'){
				// notification by dandi
				if(data.msg) {
					let msg = data.msg;
					if(msg.data.type == 'blast') {
                        let datanotif = {
                            message:msg.data.content,
                            actions:'notif',
                        };

						//let LocalStorage = new ComLocalStorage();
						ComLocalStorage.setItem('notif','msg',JSON.stringify(datanotif),(e)=>{
							console.log('temp notif setted => ', e)
						});
					}
				}

				if(typeof data.temp !== 'undefined'){
					if(typeof data.temp.apps_ik_home_articlelatest !== 'undefined'){
						let LocalStorage = new ComLocalStorage();
						LocalStorage.getItemByKey('@temp:apps_ik_home_articlelatest',(q)=>{
							if(q === null){
								ComLocalStorage.setItem('temp','apps_ik_home_articlelatest',data.temp.apps_ik_home_articlelatest,()=>{
									//
								});
							}
							else if(q !== null && q !== data.temp.apps_ik_home_articlelatest){
								ComLocalStorage.setItem('temp','apps_ik_home_articlelatest',data.temp.apps_ik_home_articlelatest,()=>{
									ComLocalStorage.removeItem('ik_home','articleLatest',()=>{});
								});
							}
						});
					}
					if(typeof data.temp.apps_ik_home_articlepopular !== 'undefined'){
						let LocalStorage = new ComLocalStorage();
						LocalStorage.getItemByKey('@temp:apps_ik_home_articlepopular',(q)=>{
							if(q === null){
								ComLocalStorage.setItem('temp','apps_ik_home_articlepopular',data.temp.apps_ik_home_articlepopular,()=>{
									//
								});
							}
							else if(q !== null && q !== data.temp.apps_ik_home_articlepopular){
								ComLocalStorage.setItem('temp','apps_ik_home_articlepopular',data.temp.apps_ik_home_articlepopular,()=>{
									ComLocalStorage.removeItem('ik_home','articlePopular',()=>{});
								});
							}
						});
					}
					if(typeof data.temp.apps_gik_news_articlelatest !== 'undefined'){
						let LocalStorage = new ComLocalStorage();
						LocalStorage.getItemByKey('@temp:apps_gik_news_articlelatest',(q)=>{
							if(q === null){
								ComLocalStorage.setItem('temp','apps_gik_news_articlelatest',data.temp.apps_gik_news_articlelatest,()=>{
									//
								});
							}
							else if(q !== null && q !== data.temp.apps_gik_news_articlelatest){
								ComLocalStorage.setItem('temp','apps_gik_news_articlelatest',data.temp.apps_gik_news_articlelatest,()=>{
									ComLocalStorage.removeItem('gik_news','articleLatest',()=>{});
								});
							}
						});
					}
				}

				/* start jik temporary */
				if(typeof data.jik !== 'undefined') {
					/* socket inbox - new */
					if(typeof data.jik.apps_jik_message_msginbox !== 'undefined'){
						let JikMsgInbox = data.jik.apps_jik_message_msginbox.data;
						let LCMessage = new ComLocalStorage;
							LCMessage.getMultiple(
								[
									'@jik:jikIkaMember',
									'@jik:jikMessagemasuk',
									'@jik:jikMessageInbox',
								], (callbackGet)=>{
									let dataArr = {};
									let dataGet = callbackGet.data;

									for (let i in dataGet) {
										if (dataGet.hasOwnProperty(i)) {
											let keyLStorage = dataGet[i][0];
											let valLStorage = dataGet[i][1];
											dataArr[keyLStorage] = JSON.parse(valLStorage);
										}
									}

									let jikMessagemasuk = dataArr['@jik:jikMessagemasuk'];
									let jikIkaMember = dataArr['@jik:jikIkaMember'];
									let jikMessageInbox = dataArr['@jik:jikMessageInbox'];

									if (jikIkaMember !== null) {
										/* member local */
										let lsJikMember = jikIkaMember.member_id;
											if (typeof lsJikMember === 'number') {
												lsJikMember = lsJikMember.toString();
											}

										/* member server */
										let srvJikMember = JikMsgInbox.author;
											if (typeof srvJikMember === 'number') {
												srvJikMember = srvJikMember.toString();
											}

										if (lsJikMember == srvJikMember) {
											/* update inbox LS */
											jikMessageInbox.countInbox = jikMessageInbox.countInbox + 1;
											let countjikMessageInbox = JSON.stringify(jikMessageInbox);
											let limitList = jikMessagemasuk.offset;
											let list = jikMessagemasuk.list;
											let offset = jikMessagemasuk.offset;
											let total = jikMessagemasuk.total + 1;
											let update = jikMessagemasuk.update + 1;
												list.unshift({ data:JikMsgInbox });
											let inboxUpdate = JSON.stringify({
												limitList : limitList,
												list: list,
												offset: offset,
												total: total,
												update: update,
											});

											/* standard */
											let LCInboxUpdate = new ComLocalStorage;
												LCInboxUpdate.setMultiple(
												[
													['@jik:jikMessagemasuk', inboxUpdate],
													['@jik:jikMessageInbox', countjikMessageInbox],
												],
												(callbackUpdate)=>{
													callback({
														type:'JikMsgInbox',
														JikMsgInbox: JikMsgInbox,
														update: update,
														jikMessageInbox : jikMessageInbox,
													});
												});
											/* update inbox LS */
										}
									}
								});
					}

					/* socket inbox */
					if(typeof data.jik.apps_jik_message_inbox !== 'undefined'){
						let JikMsgInbox = data.jik.apps_jik_message_inbox.data;
						let LCMessage = new ComLocalStorage;
							LCMessage.getMultiple(
								[
									'@jik:jikIkaMember',
									'@jik:jikMessagemasuk',
									'@jik:jikMessageInbox',
								], (callbackGet)=>{
									let dataArr = {};
									let dataGet = callbackGet.data;

									for (let i in dataGet) {
										if (dataGet.hasOwnProperty(i)) {
											let keyLStorage = dataGet[i][0];
											let valLStorage = dataGet[i][1];
											dataArr[keyLStorage] = JSON.parse(valLStorage);
										}
									}

									let jikMessagemasuk = dataArr['@jik:jikMessagemasuk'];
									let jikIkaMember = dataArr['@jik:jikIkaMember'];
									let jikMessageInbox = dataArr['@jik:jikMessageInbox'];

									if (jikIkaMember !== null) {
										/* member local */
										let lsJikMember = jikIkaMember.member_id;
											if (typeof lsJikMember === 'number') {
												lsJikMember = lsJikMember.toString();
											}

										/* member server */
										let srvJikMember = JikMsgInbox.author;
											if (typeof srvJikMember === 'number') {
												srvJikMember = srvJikMember.toString();
											}

										if (lsJikMember == srvJikMember) {
											/* update inbox LS */
											jikMessageInbox.countInbox = jikMessageInbox.countInbox + 1;
											let countjikMessageInbox = JSON.stringify(jikMessageInbox);
											let limitList = jikMessagemasuk.offset;
											let list = jikMessagemasuk.list;
											let offset = jikMessagemasuk.offset;
											let total = jikMessagemasuk.total + 1;
											let update = jikMessagemasuk.update + 1;
												list.unshift({ data:JikMsgInbox });
											let inboxUpdate = JSON.stringify({
												limitList : limitList,
												list: list,
												offset: offset,
												total: total,
												update: update,
											});

											/* standard */
											let LCInboxUpdate = new ComLocalStorage;
												LCInboxUpdate.setMultiple(
												[
													['@jik:jikMessagemasuk', inboxUpdate],
													['@jik:jikMessageInbox', countjikMessageInbox],
												],
												(callbackUpdate)=>{
													callback({
														type:'JikMsgInbox',
														JikMsgInbox: JikMsgInbox,
														update: update,
														jikMessageInbox : jikMessageInbox,
													});
												});
											/* update inbox LS */
										}
									}
								});
					}

					/* socket like */
					if(typeof data.jik.apps_jik_add_like !== 'undefined'){
						let LCLike = new ComLocalStorage;
							LCLike.getMultiple(
								[
									'@jik:jikIkaMember',
									'@jik:JurnalSaya',
								],
								(callbackGet)=>{
									let dataArr = {};
									let dataGet = callbackGet.data;

									for (let i in dataGet) {
										if (dataGet.hasOwnProperty(i)) {
											let keyLStorage = dataGet[i][0];
											let valLStorage = dataGet[i][1];
											dataArr[keyLStorage] = JSON.parse(valLStorage);
										}
									}

									let JurnalSaya = dataArr['@jik:JurnalSaya'];
									let jikIkaMember = dataArr['@jik:jikIkaMember'];

									if (jikIkaMember !== null) {
										/* member local */
										let lsJikMember = jikIkaMember.member_id;
											if (typeof lsJikMember === 'number') {
												lsJikMember = lsJikMember.toString();
											}

										/* member server */
										let srvJikMember = JikMsgInbox.author;
											if (typeof srvJikMember === 'number') {
												srvJikMember = srvJikMember.toString();
											}

										//console.log("lsJikMember => ",lsJikMember);
										//console.log("JurnalSaya => ",JurnalSaya);
									}
								});
					}

					/* socket comment */
					if(typeof data.jik.apps_jik_add_comment !== 'undefined'){
						let JikJurnalComment = data.jik.apps_jik_message_inbox.data;

						callback({
							type:'JikJurnalComment',
							JikJurnalComment: JikJurnalComment,
						});
					}
				}
				/* end jik temporary */

				if(typeof data.apps_cmd_rebuild_kegiatan !== 'undefined'){
					this._rebuildKegiatan(data.apps_cmd_rebuild_kegiatan);
				}

				if(typeof data.message !== 'undefined'){
					let datanotif = {
						message:data.message,
						actions:'message',
					};
					PushNotification.localNotification({
						largeIcon:'ic_launcher',
						smallIcon:'ic_notification',
						data:JSON.stringify(datanotif),
						message:data.message,
					});
				}

				if(typeof data.get !== 'undefined' && typeof data.get.location !== 'undefined' && data.get.location){
					this._getGeo();
				}
			}

			if(callback){
				callback(data);
			}
			else{
				alert('websocket onmessage without callback \r\n'+JSON.stringify(data));
			}
		}
	}

	static _wsSend(data,alert){
		if(connect){
			ws.send(data);
		}
		else if(alert){
			//alert('GAGAL TERHUBUNG KE SERVER'); // commented by dandi
		}
	}
	/* end websocket */

	/* start geolocation */
	_watchGeo(){
		Geolocation.watch_location(
			(data)=>{
				this.constructor._wsSend(data,false);
			}
		);
	}

	static _getGeo(){
		Geolocation.get_location(
			(data)=>{
				this._wsSend(data,false);
			}
		);
	}
	/* end geolocation */

	// by dandi
	_getNotifTime(){
		let resource = api_uri+'get-notif-time';
		let newComFetch = new ComFetch();
		newComFetch.setMethod('GET');
		newComFetch.setRestURL(base_url);
		newComFetch.setResource(resource);
		newComFetch.sendFetch((rsp) => {
			if(rsp.status === 200){
				notifTime = rsp.data.notifTime;
			}
		});
	}

	/* start kegiatan */
	static _startKegiatan(){
		running = true;
		let LocalStorage = new ComLocalStorage();

		LocalStorage.getItemByKey('@temp:kegiatan',(e)=>{
			if(e !== null){
				let LocalStorage = new ComLocalStorage();
				LocalStorage.getItemByKey('@temp:kegiatan_status',(z)=>{
					let kegiatan_status = {};
					if(z !== null){
						kegiatan_status = JSON.parse(z);
					}
					ymdhis = moment().format('YYYY-MM-DD h:mm:ss');
					let kegiatan = JSON.parse(e);
					for(let i in kegiatan){
						let kegiatanloop = kegiatan[i];
						let kegiatanstatusloop = kegiatan_status[i];
						if(
							!loop &&
							ymdhis > kegiatanloop.ymd+' ' + notifTime &&
							kegiatanloop.expired === 'N' &&
							(
								kegiatanloop.notification === 'Y' ||
								typeof kegiatanstatusloop === 'undefined' ||
								(
									typeof kegiatanstatusloop !== 'undefined' &&
									kegiatanstatusloop === 'Y'
								)
							)
						){
							loop = true;
							kegiatan[i] = {
								calendar_id:kegiatanloop.calendar_id,
								title:kegiatanloop.title,
								notification:'N',
								expired:'Y',
								ymd:kegiatanloop.ymd,
								ymdconvert:kegiatanloop.ymdconvert,
								time1:kegiatanloop.time1,
								time2:kegiatanloop.time2,
								actions:'kegiatan',
							};
							kegiatan_status[i] = 'N';
							let datanotif = kegiatan[i];
							ComLocalStorage.setItem('temp','kegiatan',JSON.stringify(kegiatan),()=>{
								ComLocalStorage.setItem('temp','kegiatan_status',JSON.stringify(kegiatan_status),()=>{
									loop = false;
									PushNotification.localNotification({
										largeIcon:'ic_launcher',
										smallIcon:'ic_notification',
										data:JSON.stringify(datanotif),
										message:'Hadiri "'+kegiatanloop.title+'"',
									});
									this._updateKegiatan(kegiatanloop.calendar_id);
								});
							});
						}
						else{
							this._loopKegiatan();
						}
					}
				});
			}
			else{
				this._loopKegiatan();
			}
		});

		// notification by dandi
		LocalStorage.getItemByKey('@notif:msg',(e)=>{
			if(e){
				let notifMsg = JSON.parse(e);
				console.log('temp notif => ', e);

                ComLocalStorage.removeItem('notif','msg',(e)=>{
                    console.log('temp notif removed after alert => ', e)
                });

				PushNotification.localNotification({
					largeIcon:'ic_launcher',
					smallIcon:'ic_notification',
					data:e,
					message:notifMsg.message,
				});
			}
		});
	}

	static async _loopKegiatan(){
		running = false;
		await this.sleep(ms);
		if(!running){
			this._startKegiatan();
		}
	}

	static _updateKegiatan(id){
		let LocalStorage = new ComLocalStorage();
		LocalStorage.getItemByKey('@jwt:user_info',(e)=>{
			if(typeof e !== null){
				let user_data = JSON.parse(e).data;
				let user_id = parseInt(user_data.userId);
				let resource = api_uri+'update-notification';
				let newComFetch = new ComFetch();
				newComFetch.setMethod('POST');
				newComFetch.setHeaders({Authorization:jwt_signature});
				newComFetch.setRestURL(base_url);
				newComFetch.setSendData({
					user_id:user_id,
					data:id,
					device_id:DeviceInfo.getUniqueID(),
				});
				newComFetch.setResource(resource);
				newComFetch.sendFetch((rsp) => {
					if(rsp.status === 200){
						//do domething
					}
					else{
						//console.trace('error '+rsp.status);
						let LocalStorage = new ComLocalStorage();
						LocalStorage.getItemByKey('@offline_update:kegiatan_status',(z)=>{
							let kegiatan_status = {};
							if(z !== null){
								kegiatan_status = JSON.parse(z);
							}
							kegiatan_status['i'+id] = id;
							ComLocalStorage.setItem('offline_update','kegiatan_status',JSON.stringify(kegiatan_status),()=>{});
						});
					}
				});
			}
		});
	}

	_updateKegiatanOffline(){
		let LocalStorage = new ComLocalStorage();
		LocalStorage.getItemByKey('@jwt:user_info',(e)=>{
			if(typeof e !== null){
				let LocalStorage = new ComLocalStorage();
				LocalStorage.getItemByKey('@offline_update:kegiatan_status',(z)=>{
					if(z !== null){
						let user_data = JSON.parse(e).data;
						let user_id = parseInt(user_data.userId);
						let resource = api_uri+'update-notification';
						let newComFetch = new ComFetch();
						newComFetch.setMethod('POST');
						newComFetch.setHeaders({Authorization:jwt_signature});
						newComFetch.setRestURL(base_url);
						newComFetch.setSendData({
							user_id:user_id,
							data:z,
							device_id:DeviceInfo.getUniqueID(),
						});
						newComFetch.setResource(resource);
						newComFetch.sendFetch((rsp) => {
							if(rsp.status === 200){
								ComLocalStorage.removeItem('offline_update','kegiatan_status',()=>{
									//do something
								});
							}
							else{
								//console.trace('error '+rsp.status);
							}
						});
					}
				});
			}
		});
	}

	static _rebuildKegiatan(id){
		let change_id = 0;
		if(typeof id !== 'undefined'){
			change_id = parseInt(id);
		}
		let LocalStorage = new ComLocalStorage();
		LocalStorage.getItemByKey('@jwt:user_info',(e)=>{
			if(typeof e !== null){
				let user_data = JSON.parse(e).data;
				let user_id = parseInt(user_data.userId);
				let email = user_data.userName;
				if(user_id === change_id || change_id === 0){
					let query = {};
					query['table'] = 'jdi_reservation';
					query['injected[apps_reservation]'] = true;
					query['injected[apps_reservation][user_id]'] = user_id;
					query['injected[apps_reservation][email]'] = email;
					query['injected[apps_reservation][device_id]'] = DeviceInfo.getUniqueID();
					let resource = api_uri+'universal?'+ArrayToQueryString(query);
					let newComFetch = new ComFetch();
					newComFetch.setHeaders({Authorization:jwt_signature});
					newComFetch.setRestURL(base_url);

					newComFetch.setResource(resource);
					newComFetch.sendFetch((rsp) => {
						if(rsp.status === 200){
							let data = rsp.data;
							ComLocalStorage.setItem('temp','kegiatan',JSON.stringify(data),()=>{});
						}
						else{
							if(try_request <= try_limit){
								var thos = this;
								setTimeout(function(){
									try_request++;
									thos._rebuildKegiatan();
								},5000);
							}
							else{
								//alert('error');
							}
							//console.trace('error '+rsp.status);
						}
					});
				}
			}
		});
	}
	/* end kegiatan */

	/* start JIK pesan */
	updateInboxLS(data){
		// console.log(data);
		// let LCMessage = new ComLocalStorage;
		// LCMessage.setMultiple(
		//	[
		//		['@jik:jikIkaMember', $value],
		//		['@jik:jikMessagemasuk', $value],
		//		['@jik:jikMessageInbox', $value],
		//	],
		//	(callbackGet)=>{
		//
		//	});
	}
	/* end JIK pesan */

	render(){
		let viewStyle = {zIndex:500,position:'absolute',left:0,right:0,top:55,borderBottomWidth:0.5,borderBottomColor:'#eee',backgroundColor:'rgba(255,255,255,0.95)'};

		if(this.state.connect || this.state.hide){
			viewStyle.height = 0;
		}

		let comp =
		<View style={viewStyle}>
			{/*<Text style={{padding:5,textAlign:'center',color:'#999',fontSize:10}}>GAGAL TERHUBUNG KE SERVER</Text>*/}{/*commented by dandi*/}
			<TouchableHighlight
				underlayColor='transparent'
				onPress={()=>{this.setState({hide:true})}}
				style={{position:'absolute',top:0,bottom:0,right:0,padding:10,paddingTop:0,paddingBottom:0,flexDirection:'row',justifyContent:'center',alignItems:'center'}}
			>
				<IonIcon style={{fontSize:10}} name='ios-close-outline'/>
			</TouchableHighlight>
		</View>;

		return(comp);
	}
}
