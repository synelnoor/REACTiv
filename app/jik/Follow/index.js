// Import dependencies
import React, { Component } from 'react';

import {
	Text,
	View,
	TouchableHighlight,
	Dimensions,
	ScrollView,
	Animated,
	Easing,
	Image
} from 'react-native';

import { StyleProvider, Spinner, Input, Icon } from 'native-base';
import { base_url, api_uri, imgThumb, youtubeUri, noCover } from '../../comp/AppConfig';
//import Styles from '../../comp/Styles';
import getTheme from '../../../native-base-theme/components';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ComLocalStorage from '../../comp/ComLocalStorage';
//import ItemList from '../CompItemList/ItemList';
import FooterBtm from '../FooterBtm';
import FooterSM from '../FooterSM';

export default class JurnalDetail extends Component{

	btnLoadmore = <Spinner/>
	dataTotal = 0;

	/* dimmension */
	width100 = Dimensions.get('window').width > Dimensions.get('window').height ? Dimensions.get('window').height : Dimensions.get('window').width;
	dimx2 = this.width100 * 2;
	dim2 = this.width100/2;
	dim4 = (this.width100-75)/4;
	dim5 = this.width100/5;
	dim6 = this.width100/6;
	dim7 = this.width100/7;
	dimimg = this.width100-60;

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);
		this.loadmoreColor = new Animated.Value(0);
		this.loadmoreScale = new Animated.Value(0);
		this.state = {
			ScrollView:this.refs.ScrollView,
			album:null,
			data_login: false,
			jikIkaMember: false,
			ikaprofil : false,
			net :false,
			sosmed:null,
			typeFollow:false,
			more:false,
			listFollow:null
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
		let typeFollow = this.props.typeFollow;
		this.setState({
			typeFollow:typeFollow,
		},()=>{
			this._loadmoreColor();
			this._loadmoreScale();
			this._Actions("getProfile");
		})

	}

	_Actions(goto,data){
		let sendData = "";
		let Param = {};
		let resource = "";
		let IKComFetch = new ComFetch();
		let listFollow = this.state.listFollow;
		switch(goto) {
			case 'follow':
				Param = {};
				Param['type'] = this.state.typeFollow;
				Param['member'] = this.state.jikIkaMember.jikmember ;
				Param['follow'] = this.props.typeFollow == "following" ? data.data.mengikuti : data.data.diikuti;
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
					// console.log("pengikut2 => ",dataFollow);
					// console.log("pengikut1 => ",data);
					// console.log("pengikut => ",resp);
					if(resp.status == 200){
						this.setState({
							listFollow:null,
						},()=>{
							this._Actions("listFollow");
						});
					}
				});


				break;
			case 'listFollow':
				Param = {};
				Param['type'] = this.state.typeFollow;
				Param['jikmember'] = this.state.jikIkaMember.jikmember;
				Param['size_profile'] = this.dim2;
				resource = api_uri+'JIKFollow/follower?'+ArrayToQueryString(Param);
				IKComFetch = new ComFetch();
				IKComFetch.setHeaders({Authorization:this.jwt_signature});
				IKComFetch.setRestURL(base_url);
				if(typeof data !== "undefined"){
					if(typeof data.more !== "undefined"){
						resource = listFollow.next_page_url+"&"+ArrayToQueryString(Param);
						IKComFetch.setRestURL("");
					}
				}
				IKComFetch.setResource(resource);
				IKComFetch.sendFetch((resp) => {
					if(resp.status == 200){
						let listFollow = resp.data.lsData;
						if(typeof data !== "undefined"){
							if(typeof data.more !== "undefined"){
								listFollow['data'] = listFollow['data'].concat( this.state.listFollow.data );
							}
						}
						this.setState({
							listFollow:resp.data.lsData,
							more:false,
						});
					}
				});
				break;
			case 'getProfile':
				let LStorageWr = new ComLocalStorage();
					LStorageWr.getMultiple(
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

							let list 			= false;
							let jikIkaMember 	= dataArr['@jik:jikIkaMember'];
							if(jikIkaMember !== null && typeof jikIkaMember !== 'undefinded'){
								let profile_cover 	=  noCover+"?w="+this.dimx2;
									if(jikIkaMember.ika_member_profile.data !== null){
										profile_cover 	= jikIkaMember.ika_member_profile.data.profile_cover == "no-cover-member.jpg" ? noCover+"?w="+this.dimx2 : imgThumb+jikIkaMember.ika_member_profile.data.profile_cover+"?w="+this.dimx2+"&dir=_images_member"
									}

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
								jikIkaMember:jikIkaMember,
							},()=>{
								this._Actions("listFollow");
							});
					});

				break;
			default:
		        return ()=>{ };
		}
	}

	//load data dari props
	componentWillMount(){

	}

	follow(){
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
		let data = { following:true }
		let Status = this.props.typeFollow == "follower" ? "Ikuti" : "Berhenti Mengikuti";
		let description = "tidak ada yang mengikuti"
		let fullName = null;
		let dataView = <View/>
		let listFollow = this.state.listFollow;
		let dataList = null;
			if(listFollow == null){
				dataView = <Spinner/>
			}else if(listFollow.total == 0){
				dataView = <View>
						<Text>{ description }</Text>
					</View>
			}else{
				dataList = listFollow.data;
				dataView = [];
				for (var i in dataList) {
					if (dataList.hasOwnProperty(i)) {
						Status = this.props.typeFollow == "follower" ? dataList[i].desc_follow : Status;

						let imgComp = <Spinner/>;
						let img = dataList[i].img_profile+"&w="+this.dim2;
						let dList = dataList[i];
						if(img){
							Image.prefetch(img);
							imgComp = <Image
									style={{ height:this.dim7, width:this.dim7, borderRadius:this.dim7, }}
									source={{uri:img}}
									resizeMode='cover'
								/>
						}
						fullName = dataList[i].f_name;
						description = dataList[i].desc_profile;
						wrFollow = i > 0 ? { paddingTop: 7.5, marginTop: 7.5, borderTopWidth:1, borderColor:'#777', } : { };
						dataView.push(<View style={[{ flexDirection:'row' },wrFollow]} key={ i }>
									<View style={{ height:this.dim7, width:this.dim7, borderRadius:this.dim7, }}>
										{ imgComp }
									</View>
									<View style={{ alignItems:'center', alignSelf:'center', flexDirection:'row', flex:1, paddingLeft:15, }}>
										<View>
											<Text style={{ textAlign:'left', }}>{ fullName }</Text>
										</View>
									</View>
									<View style={{ justifyContent:'center', alignItems:'center', alignSelf:'center', flexDirection:'row', }}>
										<TouchableHighlight
											underlayColor={"transparent"}
										onPress={()=>{ this._Actions("follow",{ data:dList })}}>
											<View style={{ borderRadius: 10, borderWidth:1, borderColor:'#d0d0d0', paddingLeft:5, paddingRight:5, }}>
												<Text style={{ fontSize:14, }}>{ Status }</Text>
											</View>
										</TouchableHighlight>
									</View>
								</View>)

					}
				}

				let dtTotal = listFollow.total + 1;

				if (this.state.more == true) {
					dataView.push(<Spinner key={ dtTotal } />);
				}else if(listFollow.next_page_url !== null){
					dataView.push(
						<TouchableHighlight underlayColor='transparent'
							key={ dtTotal }
							style={{flexDirection:'row',justifyContent:'center',margin:15,marginTop:0}}
							onPress={()=>{
								this.setState({
									more:true
								}, ()=>{
									 this._Actions("listFollow",{ more:true })
								})
						}}>
							<Animated.Text style={{transform:[{scale:loadmoreScale}],color:loadmoreColor}}><Icon name='ios-arrow-round-down-outline' style={{fontSize:50, color:'#b76329', }}/></Animated.Text>
						</TouchableHighlight>
					);
				}
			}

		return dataView;
	}

	render(){
		return(
			<StyleProvider style={getTheme()}>
			<View style={{ flex:1, }}>
				<ScrollView ref='ScrollView' style={{  backgroundColor:'#f0f0f0' }}>
					<View style={{minHeight: this.dim2, backgroundColor:'#f0f0f0', padding:15, }}>

							{ this.follow() }

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
