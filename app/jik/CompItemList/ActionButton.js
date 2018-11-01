/**
 * aksi untuk, tambah komentar
 * like status
 * follow un follow
 */
import React from 'react';
// import { NetInfo } from 'react-native';
import moment from 'moment';
import { base_url, api_uri, imgThumb, no_img_profil } from '../../comp/AppConfig';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ComLocalStorage from '../../comp/ComLocalStorage';
import Share, {ShareSheet, Button} from 'react-native-share';
import Service from '../../comp/Service';
class ActionButton {

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgyNTY0MzksImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoiMTcyLjE2LjMwLjQ2IiwibmJmIjoxNDg4MjU2NDQxLCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.aeaac658a0c54bef2ecc5b52c69a6af1b5a6ed14b496d33bd214947731c8835e';

	getIkaJikMember(email,callback){
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
										callback({
													jikmember : jikMember.data[0].member_id,
													ikamember : jikMember.data[0].ika_member.data.member_id,
													email : jikMember.data[0].email,
													profile : imgThumb+jikMember.data[0].ika_member_profile.data.profile_thumb+"?w=100&dir=_images_member",
													fullName :jikMember.data[0].ika_member_profile.data.first_name+" "+jikMember.data[0].ika_member_profile.data.mid_name+" "+jikMember.data[0].ika_member_profile.data.last_name,
												});
									}
								}else{
									callback(resp);
								}
							});
	}

	/**
	 * [getInfo => JIKmember, IKAmember, Email, ]
	 * @return {[type : JSON]} [info login]
	 */
	getInfo(callback){
		let LocalStorage = new ComLocalStorage();
		LocalStorage.getItem((e) => {
			if (typeof e.data.jikIkaMember !== 'undefined') {
				jikIkaMember = JSON.parse(e.data.jikIkaMember);
				callback({
							jikmember : jikIkaMember.member_id,
							ikamember : jikIkaMember.ika_member.data.member_id,
							email : jikIkaMember.email,
						});
			}
		});
	}

	/**
	* Add coment Button
	* @param    Callback    Data balikan dari server setelah input
	*/
	addcoment(e, callback) {
		let data = null;
		let resource = api_uri+'JSON/JurnalComment';
		let newComFetch = new ComFetch();
		let dateNow = moment().format('YYYY-MM-DD hh:mm:ss');
		if (e.data.textComent !== "" && typeof e.data.textComent !== 'undefined' && e.data.textComent !== false && e.data.textComent !== null) {
			data = {
						content: e.data.textComent,
						jurnal_post_id: e.data.jurnalpost,
						flag: "unread",
						created_at: dateNow,
						created_by: e.data.jikikamember.jikmember,
					}
			newComFetch.setHeaders({Authorization:this.jwt_signature});
			newComFetch.setRestURL(base_url);
			newComFetch.setMethod('POST');
			newComFetch.setResource(resource);
			newComFetch.setSendData(data);
			newComFetch.sendFetch((resp) => {
				if(resp.status == 200){
					/* save data comment */
						let JurnalArr = null;
						let LScomment = new ComLocalStorage;
						LScomment.getMultiple(
						[
							'@jik:JurnalSaya',
							'@jik:jikIkaMember',
						],
							(callbackGet)=>{
								let dataArr = {};
								let JurnallistArr = [];
								let data = callbackGet.data;
								for (var i in data) {
									if (data.hasOwnProperty(i)) {
										let keyLStorage = data[i][0];
										let valLStorage = data[i][1];
										dataArr[keyLStorage] = JSON.parse(valLStorage);
									}
								}
								let dataComment = null;
								let respIdJurnal = resp.data.jurnal_post_id;
									respIdJurnal = typeof respIdJurnal !== "number" ? respIdJurnal : respIdJurnal.toString();
								let jikIkaMember = dataArr['@jik:jikIkaMember'];
								let JurnalSaya = dataArr['@jik:JurnalSaya'];
								let Jurnallist = JurnalSaya.list;
								let JLIdJJurnal = null;
								let comment = 0;
								let thumbme = no_img_profil;
								for(var kJurnal in Jurnallist){
									JLIdJJurnal = Jurnallist[kJurnal].jurnalpost;
									JLIdJJurnal = typeof JLIdJJurnal !== "number" ? JLIdJJurnal : JLIdJJurnal.toString();
									if(respIdJurnal == JLIdJJurnal){
										if (jikIkaMember.ika_member_profile.data.profile_picture !== null) {
											thumbme = imgThumb+jikIkaMember.ika_member_profile.data.profile_picture+'?w=100&dir=_images_member';
										}
										let stateJurnal = null;
										// dataComment = {
										// 				comentnm:jikIkaMember.fullname,
										// 				comment:resp.data.content,
										// 				created_at:"2017-06-20 11:03:09",
										// 				thumb:thumbme,
										// 			};
										dataComment = {
														comentnm:jikIkaMember.fullname,
														comment:resp.data.content,
														thumb:thumbme,
													};
										let jpcomment = Jurnallist[kJurnal].jpcomment;
											jpcomment.push(dataComment);
											stateJurnal = {
																	coverFile:Jurnallist[kJurnal].coverFile,
																	fileurl:Jurnallist[kJurnal].fileurl,
																	fileurlori:Jurnallist[kJurnal].fileurlori,
																	jikdir:Jurnallist[kJurnal].jikdir,
																	jpcomment:jpcomment,
																	jpcreated_at:Jurnallist[kJurnal].jpcreated_at,
																	jpdetail:Jurnallist[kJurnal].jpdetail,
																	jpicon:Jurnallist[kJurnal].jpicon,
																	jplike:Jurnallist[kJurnal].jplike,
																	jpshare:Jurnallist[kJurnal].jpshare,
																	jpsummary:Jurnallist[kJurnal].jpsummary,
																	jptitle:Jurnallist[kJurnal].jptitle,
																	jtitle:Jurnallist[kJurnal].jtitle,
																	jurnal_id:Jurnallist[kJurnal].jurnal_id,
																	jurnalpost:Jurnallist[kJurnal].jurnalpost,
																	nama:Jurnallist[kJurnal].nama,
																	thumb:Jurnallist[kJurnal].thumb,
																	type:Jurnallist[kJurnal].type,
																}
											Jurnallist[kJurnal] = stateJurnal;
										/* callback set state */
										resp['dataComment'] = stateJurnal;
										resp['keyJurnal'] = kJurnal;
										resp['jpcomment'] = jpcomment;
										resp['myComent'] = dataComment;
										/* callback set state */
									}
								}

								/* save LSJurnal comment */
									LScomment.setMultiple(
										[
											[ '@jik:JurnalSaya',JSON.stringify({
												dataoffset:JurnalSaya.dataoffset,
												limitList:JurnalSaya.limitList,
												list:Jurnallist,
												search:JurnalSaya.search,
												total:JurnalSaya.total,
												update:JurnalSaya.update,
											}) ],
										],
										(callbackSet)=>{
											/* socket comment */
											if(dataComment !== null){
												Service._wsSend(
													JSON.stringify({
														jik:{
															apps_jik_add_comment:{
																data: dataComment,
															},
														},
													})
												);
												callback(resp);
											}
											/* socket comment */
									});
								/* save LSJurnal comment */
						});
					/* save data comment */
				}else{
					callback(resp);
				}
			});
		}
	}

	/**
	* Add like Button
	* @param    Callback    Data balikan dari server setelah input
	*/
	addlike(e, callback){
		alert(JSON.stringify(e))
		let data = null;
		let resource = api_uri+'JSON/JurnalLike';
		let newComFetch = new ComFetch();
		let dateNow = moment().format('YYYY-MM-DD hh:mm:ss');
		if (e.data.jikikamember !== "" && typeof e.data.jikikamember !== 'undefined' && e.data.jikikamember !== false && e.data.jikikamember !== null) {
			data = {
						jurnal_post_id: e.data.idpost,
						flag: "unread",
						created_at: dateNow,
						member_id: e.data.jikikamember.jikmember,
					}
			newComFetch.setHeaders({Authorization:this.jwt_signature});
			newComFetch.setRestURL(base_url);
			newComFetch.setMethod('POST');
			newComFetch.setResource(resource);
			newComFetch.setSendData(data);
			newComFetch.sendFetch((resp) => {
				if(resp.status == 200){
					/* save data like */
						let LSlike = new ComLocalStorage;
						LSlike.getMultiple(
						[
							'@jik:JurnalSaya',
						],
							(callbackGet)=>{
								let dataArr = {};
								let data = callbackGet.data;
								for (var i in data) {
									if (data.hasOwnProperty(i)) {
										let keyLStorage = data[i][0];
										let valLStorage = data[i][1];
										dataArr[keyLStorage] = JSON.parse(valLStorage);
									}
								}
								/* socket like */
								let dataLike = null;
								/* socket like */
								let respIdJurnal = resp.data.jurnal_post_id;
									respIdJurnal = typeof respIdJurnal !== "number" ? respIdJurnal : respIdJurnal.toString();
								let JurnalSaya = dataArr['@jik:JurnalSaya'];
								// console.log("resp data => ",resp.data)
								// console.log("addlike e => ",e.data)
								// console.log("addlike => ",JurnalSaya)
								// let Jurnallist = JurnalSaya.list;
								// let JLIdJJurnal = null;
								// let like = 0;
								// for(var kJurnal in Jurnallist){
								// 	JLIdJJurnal = Jurnallist[kJurnal].jurnalpost;
								// 	JLIdJJurnal = typeof JLIdJJurnal !== "number" ? JLIdJJurnal : JLIdJJurnal.toString();
								// 	if(respIdJurnal == JLIdJJurnal){
								// 		Jurnallist[kJurnal].jplike++
								// 		dataArr = Jurnallist[kJurnal];
								// 	}
								// }


								// LSlike.setMultiple(
								// 	[
								// 		[ '@jik:JurnalSaya',JSON.stringify({
								// 			list:Jurnallist
								// 		}) ],
								// 	],
								// 	(callbackSet)=>{
								// 		/* socket like add */
								// 		if(dataLike !== null){
								// 			Service._wsSend(
								// 				JSON.stringify({
								// 					jik:{
								// 						apps_jik_add_like:{
								// 							data: dataLike,
								// 						},
								// 					},
								// 				})
								// 			);
								// 			callback(resp);
								// 		}
								// 		/* socket like add */
								// });
						});
						callback(resp);
					/* save data like */
				}else{ callback(resp); }
			});
		}else{
			callback({status:'silahkan login terlebih dahulu ', goto:'login'});
		}
	}

	/**
	* Share JurnalSaya
	* @param    Callback    Data balikan dari server setelah input
	*/
	addshare(e, callback){
	 Share.shareSingle(
		Object.assign(
			 e.data,
			 {
	           "social": e.share
	         }
		 )
	 );
	 let data = { count:1, }
	 callback(data);
	}

	/**
	 * remove masuk => List Pesan masuk
	 * @param    Callback    Data balikan dari server setelah input
	 */
	removeMsg(e, callback){
		if (e.status == "masuk" || e.status == "terkirim") {
			let newComFetch = new ComFetch();
			let data = {};
			let resource = api_uri+'JSON/';
			if (e.status == "masuk") {
				data = {
						"pmto_deleted": 1,
						}
				resource = api_uri+'JSON/PrivmsgsTo/'+e.id;
			}else if (e.status == "terkirim") {
				data = {
						"privmsg_deleted": 1,
						}
				resource = api_uri+'JSON/Privmsgs/'+e.id;
			}
			newComFetch.setHeaders({Authorization:this.jwt_signature});
			newComFetch.setRestURL(base_url);
			newComFetch.setMethod('POST');
			newComFetch.setResource(resource);
			newComFetch.setSendData(data);
			newComFetch.sendFetch((resp) => { callback(resp); });
		 }
	}

	/**
	 * [removeMsg description]
	 * @param  {[type]}   e        [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	restoreMsg(e, callback){
		if (e.status == "sampah") {
			let newComFetch = new ComFetch();
			let data = {};
			let resource = api_uri+'JSON/';
			if (e.status == "sampah") {
				data = {
						"pmto_deleted": "NULL",
						}
				resource = api_uri+'JSON/PrivmsgsTo/'+e.id;
			}

			newComFetch.setHeaders({Authorization:this.jwt_signature});
			newComFetch.setRestURL(base_url);
			newComFetch.setMethod('POST');
			newComFetch.setResource(resource);
			newComFetch.setSendData(data);
			newComFetch.sendFetch((resp) => { callback(resp); });
		 }
	}

	/**
	 * sendreply masuk => List Pesan masuk, buat pesan
	 * @param    Callback    Data balikan dari server setelah input
	 */
	submitData(e, callbackData){
			let data = {};
			let resource = api_uri+'JSON/Privmsgs';
			let dateNow = moment().format('YYYY-MM-DD hh:mm:ss');
			let author = "";
			let title = "";
			let desc = "";
			let penerima = "";
			let loginInfo = false;


			if (e.data.status == "newmessage") {
				this.getIkaJikMember(
					e.penerima,
					(callback)=>{
						author = e.jikmember;
						title = e.title;
						desc = e.desc;
						penerima = callback.jikmember;
						// perivate message
						data = {
							"privmsg_author": author,
							"privmsg_date": dateNow,
							"privmsg_subject": title,
							"privmsg_body": desc,
							"privmsg_notify": 1,
						}
						this.sendData(
							resource,
							data,
							(callback)=>{
								if (callback.status == 200) {
									// perivate message
									let resourcesTo = api_uri+'JSON/PrivmsgsTo';
									let dataTo = {
													"pmto_message": callback.data.privmsg_id,
													"pmto_recipient": penerima,
													"pmto_allownotify": "1"
												}
									this.sendData( resourcesTo, dataTo, (callbackTo)=>{
										callbackData(callbackTo);
									} );
								}

							}
						);
					});
			}else{
				author = e.data.data.author;
				title = e.title;
				desc = e.desc;
				penerima = e.data.data.user;
				// perivate message
				data = {
					"privmsg_author": author,
					"privmsg_date": dateNow,
					"privmsg_subject": title,
					"privmsg_body": desc,
					"privmsg_notify": 1,
				}
				this.sendData(
					resource,
					data,
					(callback)=>{
						if (callback.status == 200) {
							// perivate message
							let resourcesTo = api_uri+'JSON/PrivmsgsTo';
							let dataTo = {
											"pmto_message": callback.data.privmsg_id,
											"pmto_recipient": penerima,
											"pmto_allownotify": "1"
										}
							this.sendData( resourcesTo, dataTo, (callbackTo)=>{
								callbackData(callbackTo);

							} );
						}

					}
				);
			}

	}

	sendData(resource, data, callback){
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);
		newComFetch.setMethod('POST');
		newComFetch.setResource(resource);
		newComFetch.setSendData(data);
		newComFetch.sendFetch((resp) => {
			callback(resp);
		});
	}

	/**
	* config Date JurnalSaya
	* @param    Callback    Data balikan dari server setelah input
	*/
	formatDate(e,callback){
		let data = {};

		/* 06 mei 2016*/
		if (typeof e.dmy !== "undefined") {
			data['dmy'] = moment(e.dmy).format('DD MMM YYYY');
		}

		/* 10:10:21*/
		if (typeof e.hmms !== "undefined") {
			data['hmms'] = moment(e.hmms).format('h:mm:s');
		}

		/* 10:10 WIB*/
		if (typeof e.hmm !== "undefined") {
			data['hmm'] = moment(e.hmm).format('h:mm');
		}

		/* 10:10:20 WIB*/
		if (typeof e.hhmmss !== "undefined") {
			data['hhmmss'] = moment(e.hhmmss).format('hh:mm:ss');
		}

		callback({data:data});

	}

	/**
	 * [addJurnal description]
	 * @param {[type]}   e        [description]
	 * @param {Function} callback [data add jurnal(id, title, description)]
	 */
	addJurnal(e,callback){
		let jurnalAdd = new ComFetch();
		let resource = api_uri+'JSON/Jurnal';
		let data = e.data;
		jurnalAdd.setHeaders({Authorization:this.jwt_signature});
		jurnalAdd.setRestURL(base_url);
		jurnalAdd.setMethod('POST');
		jurnalAdd.setResource(resource);
		jurnalAdd.setSendData(data);
		jurnalAdd.sendFetch((resp) => { callback(resp); });
	}

	/**
	 * [getJurnal description]
	 * @param  {[type]}   e        [description]
	 * @param  {Function} callback [description]
	 */
	getJurnal(e,callback){
		let getJurnal = new ComFetch();
		let resource = api_uri+'JSON/Jurnal?'+e.data;
		getJurnal.setHeaders({Authorization:this.jwt_signature});
		getJurnal.setRestURL(base_url);
		getJurnal.setResource(resource);
		getJurnal.sendFetch((resp) => { callback(resp); });
	}

	/**
	 * [addJurnalPost description]
	 * @param {[type]}   e        [description]
	 * @param {Function} callback [description]
	 */
	addJurnalPost(e,callback){
		let jurnalPostFetch = new ComFetch();
		let data = e.data;
		let resource = api_uri+'JSON/JurnalPost?'+e.url;
		jurnalPostFetch.setHeaders({
            Authorization: this.jwt_signature,
	    	'Content-Type': 'multipart/form-data'
        });
		jurnalPostFetch.setRestURL(base_url);
		jurnalPostFetch.setMethod('POST');
		jurnalPostFetch.setEncodeData('FormData');
		jurnalPostFetch.setResource(resource);
		jurnalPostFetch.setSendData(data);
		jurnalPostFetch.sendFetch((resp) => { callback(resp); });
	}

	/**
	 * [addAlbumJurnalPost description]
	 * @param {[type]}   e        [description]
	 * @param {Function} callback [description]
	 */
	addAlbumJurnalPost(e,callback){
		let addAlbumJurnalPost = new ComFetch();
		let data = e.data;
		let resource = api_uri+'JSON/JurnalAlbum?'+e.url;
		addAlbumJurnalPost.setHeaders({
			Authorization: this.jwt_signature,
			'Content-Type': 'multipart/form-data'
		});
		addAlbumJurnalPost.setRestURL(base_url);
		addAlbumJurnalPost.setMethod('POST');
		addAlbumJurnalPost.setEncodeData('FormData');
		addAlbumJurnalPost.setResource(resource);
		addAlbumJurnalPost.setSendData(data);
		addAlbumJurnalPost.sendFetch((resp) => { callback(resp); });
	}

	/**
	 * [editJurnalPost description]
	 * @param {[type]}   e        [description]
	 * @param {Function} callback [description]
	 */
	editJurnalPost(e,callback){
		let editJurnalPost = new ComFetch();
		let data = e.data;
		let resource = api_uri+'JSON/JurnalPost/'+e.idpost+'?'+e.url;
		editJurnalPost.setHeaders({
            Authorization: this.jwt_signature,
	    	'Content-Type': 'multipart/form-data'
        });
		editJurnalPost.setRestURL(base_url);
		editJurnalPost.setMethod('POST');
		editJurnalPost.setEncodeData('FormData');
		editJurnalPost.setResource(resource);
		editJurnalPost.setSendData(data);
		editJurnalPost.sendFetch((resp) => { callback(resp); });
	}

	/**
	 * [getAlbumJurnalPost description]
	 * @param {[type]}   e        [description]
	 * @param {Function} callback [description]
	 */
	getAlbumJurnalPost(e,callback){
		let getAlbumJurnalPost = new ComFetch();
		let resource = api_uri+'JSON/JurnalAlbum?where=jurnal_post_id:'+e.url;
		getAlbumJurnalPost.setHeaders({
			Authorization: this.jwt_signature,
		});
		getAlbumJurnalPost.setRestURL(base_url);
		getAlbumJurnalPost.setMethod('GET');
		getAlbumJurnalPost.setResource(resource);
		getAlbumJurnalPost.sendFetch((resp) => { callback(resp); });
	}

	/**
	 * [removeArticle description]
	 * @param  {[type]}   e        [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	removeArticle(e,callback){
		let removeArticle = new ComFetch();
		let data = {};
			data['deleted_at'] =  moment().format('YYYY-MM-DD hh:mm:ss');
		let resource = api_uri+'JSON/JurnalPost/'+e.idpost;
		removeArticle.setHeaders({
			Authorization: this.jwt_signature,
		});
		removeArticle.setRestURL(base_url);
		removeArticle.setMethod('POST');
		removeArticle.setResource(resource);
		removeArticle.setSendData(data);
		removeArticle.sendFetch((resp) => { callback(resp); });
	}

	/**
	 * [removeAlbumJurnalPost description]
	 * @param {[type]}   e        [description]
	 * @param {Function} callback [description]
	 */
	removeAlbumJurnalPost(e,callback){
		let removeAlbumJurnalPost = new ComFetch();
		let data = {};
			data['deleted_at'] =  moment().format('YYYY-MM-DD hh:mm:ss');
		let resource = api_uri+'JSON/JurnalAlbum?whereIn=id:'+e.idpost;
		removeAlbumJurnalPost.setHeaders({
			Authorization: this.jwt_signature,
		});
		removeAlbumJurnalPost.setRestURL(base_url);
		removeAlbumJurnalPost.setMethod('POST');
		removeAlbumJurnalPost.setResource(resource);
		removeAlbumJurnalPost.setSendData(data);
		removeAlbumJurnalPost.sendFetch((resp) => { callback(resp); });
	}

	/**
	 * [addLocalStorage description]
	 * @param {[type]}   e        [description]
	 * @param {Function} callback [description]
	 */
	addLocalStorage(e,callback){
		let key = e.key;
		let table = e.table;
		let data = e.data;
		ComLocalStorage.setItem(
			key,
			table,
			JSON.stringify(data),
			(cbLStorage)=>{
				callback(cbLStorage);
			}
		);
	}

	/**
	 * [countInbox description]
	 * @param  {[type]}   e        [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	countInbox(CIcallback){
		let LCMessage = new ComLocalStorage;
			LCMessage.getMultiple(
				[
					'@jik:jikIkaMember',
					'@jik:jikMessagemasuk',
					'@jik:jikMessageInbox',
				],
				(callbackGet)=>{
					let dataArr = {};
					let data = callbackGet.data;
					for (var i in data) {
						if (data.hasOwnProperty(i)) {
							let keyLStorage = data[i][0];
							let valLStorage = data[i][1];
							dataArr[keyLStorage] = JSON.parse(valLStorage);
						}
					}

					let jikMessagemasuk = dataArr['@jik:jikMessagemasuk'];
					let jikIkaMember = dataArr['@jik:jikIkaMember'];
					if (jikIkaMember !== null) {
						/* ==> get Inbox Message */
						let inboxCount = dataArr['@jik:jikMessageInbox'];
							if (inboxCount == null) {
								/* get count inbox */
								let newComFetch = new ComFetch();
								let countInbox = 0;
								let Param = {};
								let jikMember = jikIkaMember.member_id;
								let resource = "";
								Param['join'] = 'JikMember,privmsgs';
								Param['where'] = 'pmto_deleted:null,pmto_read:null,pmto_recipient:'+jikMember;
								Param['orderBy'] = 'pmto_id:desc';
								resource = api_uri+'JSON/PrivmsgsTo?'+ArrayToQueryString(Param);
								newComFetch.setHeaders({Authorization:this.jwt_signature});
								newComFetch.setRestURL(base_url);
								newComFetch.setResource(resource);
								newComFetch.sendFetch((resp) => {
														if (resp.status == 200) {
															if (typeof resp.data.count !== 'undefined') {
																countInbox = resp.data.count;
															}
															let LCMessage = new ComLocalStorage;
															LCMessage.setMultiple(
																[
																	['@jik:jikMessageInbox',
																	JSON.stringify({
																						countInbox: countInbox,
																					}) ],
																],
																(callbackSet)=>{
																	CIcallback({ countInbox:countInbox });
															});
														}
													});
								/* ==> get Inbox Message */
							}else{
								CIcallback({ countInbox:inboxCount.countInbox });
							}
					}
			});
	}

	/**
	 * [readMsg description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	readMsg(e,callback){
		let dateNow = moment().format('YYYY-MM-DD hh:mm:ss');
		let LCMessage = new ComLocalStorage;
			LCMessage.getMultiple(
				[
					'@jik:jikIkaMember',
					'@jik:jikMessagemasuk',
					'@jik:jikMessageInbox',
				],
				(callbackGet)=>{
					let dataArr = {};
					let data = callbackGet.data;
					for (var i in data) {
						if (data.hasOwnProperty(i)) {
							let keyLStorage = data[i][0];
							let valLStorage = data[i][1];
							dataArr[keyLStorage] = JSON.parse(valLStorage);
						}
					}

					let jikMessagemasuk = dataArr['@jik:jikMessagemasuk'];
					let jikIkaMember = dataArr['@jik:jikIkaMember'];
					let dataInbox = dataArr['@jik:jikMessageInbox'];
					let countInbox = dataInbox.countInbox;
					let dataInboxRead = dataInbox.dataInboxRead;

					let dataKey = e.dataKey;
					if (jikMessagemasuk.list[dataKey].data.pmto_read == null) {
						if (typeof dataInboxRead == 'undefined') {
							dataInboxRead = [];
						}
						jikMessagemasuk.list[dataKey].data.pmto_read = jikMessagemasuk.list[dataKey].data.pmto_read == null ? 1 : 1;
						countInbox = countInbox - 1;
						dataInboxRead.push(jikMessagemasuk.list[dataKey].data);
						/* jika data tidak terkirim maka simpan di database local dan nanti akan di sesuakan lagi kembali datanya */
						let newComFetch = new ComFetch();
						let dataSend = {};
						let resource = api_uri+'JSON/';
							dataSend = {
									"pmto_read": 1,
									"pmto_rdate" : dateNow,
									}
							resource = api_uri+'JSON/PrivmsgsTo/'+e.data.id;
						newComFetch.setHeaders({Authorization:this.jwt_signature});
						newComFetch.setRestURL(base_url);
						newComFetch.setMethod('POST');
						newComFetch.setResource(resource);
						newComFetch.setSendData(dataSend);
						newComFetch.sendFetch((resp) => {
							if (resp.status == 200) {
								let LCMessage = new ComLocalStorage;
								LCMessage.setMultiple(
									[
										['@jik:jikMessagemasuk', JSON.stringify( jikMessagemasuk ) ],
										['@jik:jikMessageInbox', JSON.stringify({
																					countInbox: countInbox,
																				 }) ],
									],
									(callbackSet)=>{
										callback({ countInbox:countInbox });
								});
							}else{
								LCMessage.setMultiple(
									[
										['@jik:jikMessagemasuk', JSON.stringify( jikMessagemasuk ) ],
										['@jik:jikMessageInbox', JSON.stringify({
																					countInbox: countInbox,
																					dataInboxRead : dataInboxRead,
																				 }) ],
									],
									(callbackSet)=>{
										callback({ countInbox:countInbox });
								});
							}
						});
					}else{
						callback({ countInbox: countInbox });
					}


			});
	}

	/**
	 * [removeMsgInbox description]
	 * @param  {[type]}   e        [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	removeMsgInbox(callback){
		let LCMessage = new ComLocalStorage;
			LCMessage.removeMultiple(
			[
				'@jik:jikMessagemasuk',
				'@jik:jikMessageInbox',
				'@jik:jikMessagemasuk',
			],
			(callbackGet)=>{
				callback({ reload:true, });
			});
	}

	/**
	 * [removeMsgSend description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	removeMsgSend(callback){
		let LCMessage = new ComLocalStorage;
			LCMessage.removeMultiple(
			[
				'@jik:jikMessagemasuk',
				'@jik:jikMessageInbox',
				'@jik:jikMessageterkirim',
			],
			(callbackGet)=>{
				callback({ reload:true, });
			});
	}

	/**
	 * [newMsgLC description]
	 * @param  {[type]}   e        [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	newMsgLC(e,callback){
		/* terkirim */
		if (e.refresh) {
			let LCMessageSend = new ComLocalStorage;
				LCMessageSend.removeMultiple(
				[
					'@jik:jikMessageterkirim',
				],
				(callbackGet)=>{
					callback({ reload:true, });
				});
		}
	}


	/** msg new */
		/**
	 * [readInbox description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	readInbox(e,callback){
		let dateNow = moment().format('YYYY-MM-DD hh:mm:ss');
		let LCMessage = new ComLocalStorage;
			LCMessage.getMultiple(
				[
					'@jik:jikIkaMember',
					'@jik:jikMessagemasuk',
					'@jik:jikMessageInbox',
				],
				(callbackGet)=>{
					let dataArr = {};
					let data = callbackGet.data;
					for (var i in data) {
						if (data.hasOwnProperty(i)) {
							let keyLStorage = data[i][0];
							let valLStorage = data[i][1];
							dataArr[keyLStorage] = JSON.parse(valLStorage);
						}
					}

					let jikMessagemasuk = dataArr['@jik:jikMessagemasuk'];
					let jikIkaMember = dataArr['@jik:jikIkaMember'];
					let dataInbox = dataArr['@jik:jikMessageInbox'];

					let dataKey = e.dataKey;

					if (jikMessagemasuk.data[dataKey].toRead == null) {

						let newComFetch = new ComFetch();
						let dataSend = {
									"type": "read",
									"toid" : e.data.toIdsMsg,
									"member" : e.dataEmail
									};

						let resource = api_uri+'JIKMsg/read';
						newComFetch.setHeaders({Authorization:this.jwt_signature});
						newComFetch.setRestURL(base_url);
						newComFetch.setMethod('POST');
						newComFetch.setResource(resource);
						newComFetch.setSendData(dataSend);
						newComFetch.sendFetch((resp) => {
							if (resp.status == 200) {
								let dataResp = resp.data;
								if(dataResp.status){

									jikMessagemasuk.data[dataKey].toRead = dataResp.data.toRead;
									let LCMessage = new ComLocalStorage;
									LCMessage.setMultiple(
										[
											['@jik:jikMessagemasuk', JSON.stringify( jikMessagemasuk ) ],
											['@jik:jikMessageInbox', JSON.stringify({
																						countInbox: dataResp.data.countInbox,
																					 }) ],
										],
										(callbackSet)=>{
											callback({ countInbox:dataResp.data.countInbox, jikMessagemasuk:jikMessagemasuk.data[dataKey] });
											console.log("dataResp.data.countInbox => ",dataResp.data.countInbox)
									});

								}
							}
						});
					}

			});
	}

	sendMsg(e,callback){
		console.log('e sendMsg => ',e);
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);
		newComFetch.setMethod('POST');
		newComFetch.setResource(e.resource);
		newComFetch.setSendData({
			member:e.data.toEmail,
			recive:e.data.senderEmail,
			senderBody:e.data.desc,
			senderSubj:e.data.title,
			type:'rsmsg'
		});
		newComFetch.sendFetch((resp) => { callback(resp); });
	}

	countMsgInbox(CIcallback){
		let LCMessage = new ComLocalStorage;
			LCMessage.getMultiple(
				[
					'@jik:jikIkaMember',
					'@jik:jikMessagemasuk',
					'@jik:jikMessageInbox',
				],
				(callbackGet)=>{
					let dataArr = {};
					let data = callbackGet.data;
					for (var i in data) {
						if (data.hasOwnProperty(i)) {
							let keyLStorage = data[i][0];
							let valLStorage = data[i][1];
							dataArr[keyLStorage] = JSON.parse(valLStorage);
						}
					}

					let jikMessagemasuk = dataArr['@jik:jikMessagemasuk'];
					let jikIkaMember = dataArr['@jik:jikIkaMember'];
					if (jikIkaMember !== null) {
						/* ==> get Inbox Message */
						let inboxCount = dataArr['@jik:jikMessageInbox'];
						let newComFetch = new ComFetch();
						let countInbox = 0;
						let Param = {};
						Param['member'] = jikIkaMember.email;
						resource = api_uri+'JIKMsg/count?'+ArrayToQueryString(Param);
						newComFetch.setHeaders({Authorization:this.jwt_signature});
						newComFetch.setRestURL(base_url);
						newComFetch.setResource(resource);
						newComFetch.sendFetch((resp) => {
												if (resp.status == 200) {
													if (typeof resp.data.data.count !== 'undefined') {
														countInbox = resp.data.data.count;
													}
													let LCMessage = new ComLocalStorage;
													LCMessage.setMultiple(
														[
															['@jik:jikMessageInbox',
															JSON.stringify({
																				countInbox: countInbox,
																			}) ],
														],
														(callbackSet)=>{
															CIcallback({ countInbox:countInbox });
													});
												}else{
													CIcallback({ countInbox:inboxCount });
												}
											});
						/* ==> get Inbox Message */
					}
			});
	}
	/** msg new */


}

export default ActionButton;
