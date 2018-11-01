import React, { Component } from 'react';
import {
	Alert,
	Text,
	View,
	Image,
	TextInput,
	TouchableHighlight,
	Dimensions,
	Animated,
	Easing
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';

import { Spinner } from 'native-base';
import ComLocalStorage from './ComLocalStorage';
import ComFetch from './ComFetch';
import CommentsList from './CommentsList';
import ArrayToQueryString from './ArrayToQueryString';
import { base_url, api_uri } from './AppConfig';

var perPage = 5;
var try_request = 0;
var try_limit = 5;

const multiPressDelay1 = 1000;
const multiPressDelay2 = 1000;

export default class DetailComments extends Component {
	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);
		this.ismount = false;
		this.loadmoreColor = new Animated.Value(0);
		this.loadmoreScale = new Animated.Value(0);
		this.state = {
			takut:0,
			sedih:0,
			keren:0,
			terhibur:0,
			senang:0,
			marah:0,
			terganggu:0,
			terinspirasi:0,
			bosan:0,
			login:false,
			userid:0,
			username:'',
			email:'',
			message:'',
			commentsComp:<Spinner/>,
			commentsPage:0,
			commentsData:[],
			commentsNPU:null,
			dimensions:Dimensions.get('window'),
			usernameStyle:{},
			emailStyle:{},
			messageStyle:{},
			sendLoading:false,
		}
	}

	componentDidMount(){
		let LocalStorage = new ComLocalStorage();

		LocalStorage.getItemByKey('@jwt:user_info',(e)=>{
			let login = false;
			let userid = 0;
			let username = '';
			let email = '';

			if(e !== null){
				let user_data = JSON.parse(e).data;
				let fullnameArray = [];
				if(user_data.first_name){
					fullnameArray.push(user_data.first_name);
				}
				if(user_data.last_name){
					fullnameArray.push(user_data.last_name);
				}
				let fullnameJoin = fullnameArray.join(' ');
				username = fullnameJoin;
				userid = user_data.userId;
				email = user_data.userName;
				login = true;
			}

			this.setState({
				username:username,
				userid:userid,
				email:email,
				login:login,
				dimensions:Dimensions.get('window')
			},()=>{
				this.ismount = true;
				this._loadmoreColor();
				this._loadmoreScale();
				this._getComments();
			});
		});
	}

	componentWillUnmount(){
		this.ismount = false;
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

	_getComments(){
		var temp = [];
		var query = {};
		query['table'] = 'jdi_pojok_editorial_comments';
		query['where[post_id#=]'] = this.props.detail_id;
		query['paginate'] = 'true';
		query['per_page'] = perPage;
		query['injected[jdi_pojok_editorial_comments]'] = true;
		query['injected[jdi_pojok_editorial_comments][detail_id]'] = this.props.detail_id;
		query['page'] = this.state.commentsPage+1;
		query['orderby[comment_id]'] = 'DESC';
		temp = this.state.commentsData;
		let compList = [];
		if(temp.length > 0){
			for(i in temp){
				compList.push(<CommentsList key={i} data={temp[i]}/>);
			}
			compList.push(
				<Spinner key={temp.length++}/>
			);
			this.setState({
				commentsComp:compList,
			});
		}
		let resource = api_uri+'universal?'+ArrayToQueryString(query);
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);
		newComFetch.setResource(resource);
		newComFetch.sendFetch((rsp) => {
			if(rsp.status === 200){
				let data = rsp.data;
				let newTemp = temp.concat(data.data);
				if(this.ismount){
					let dataStore = {
						bosan:data.emoticons.bosan,
						keren:data.emoticons.keren,
						marah:data.emoticons.marah,
						sedih:data.emoticons.sedih,
						senang:data.emoticons.senang,
						takut:data.emoticons.takut,
						terganggu:data.emoticons.terganggu,
						terhibur:data.emoticons.terhibur,
						terinspirasi:data.emoticons.terinspirasi,
						commentsPage:data.current_page,
						commentsData:newTemp,
						commentsNPU:data.next_page_url,
					};
					this.setState(dataStore,()=>{
						this._generateComments();
					});
					try_request = 0;
				}
			}
			else{
				if(try_request <= try_limit){
					try_request++;
					this._getComments();
				}
				else{
					//commented by dandi
					/*this.setState({
						commentsComp:<Text style={{textAlign:'center'}}>GAGAL TERHUBUNG KE SERVER</Text>,
					});*/
				}
				//console.trace('error '+rsp.status);
			}
		});
	}

	_generateComments(){
		let temp = this.state.commentsData;
		let npu = this.state.commentsNPU;

		let compList = [];
		for(i in temp){
			compList.push(<CommentsList key={i} data={temp[i]}/>);
		}

		if(npu !== null){

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

			compList.push(
				<TouchableHighlight underlayColor='transparent' key={temp.length} style={{flexDirection:'row',justifyContent:'center',margin:15,marginTop:0}} onPress={()=>{this._getComments()}}>
					<Animated.Text style={{transform:[{scale:loadmoreScale}],color:loadmoreColor}}><IonIcon name='ios-arrow-round-down-outline' style={{fontSize:50}}/></Animated.Text>
				</TouchableHighlight>
			);
		}

		this.setState({
			commentsComp:compList,
		});
	}

	_emoticonPress(feel){
		const now1 = new Date().getTime();
		if(this.timePress1 && (now1-this.timePress1) < multiPressDelay1){
			delete this.timePress1;
		}
		else{
			let data = {
				'table':'jdi_pojok_editorial_emoticon',
				'column[post_id]':this.props.detail_id,
				'column[emoticon]':feel,
				'column[user_id]':this.state.userid,
				'column[user_agent]':DeviceInfo.getUserAgent(),
			};
			let newComFetch = new ComFetch();
			newComFetch.setRestURL(base_url);
			let header = {};
			// header['Content-Type'] = 'application/x-www-form-urlencoded';
			newComFetch.setHeaders(header);
			newComFetch.setSendData(data);
			newComFetch.setMethod('POST');
			newComFetch.setResource(api_uri+'all_insert');
			newComFetch.sendFetch((resp)=>{
				if(resp.status === 200){
					let count = this.state[feel] + 1;
					let state = {};
					state[feel] = count;
					this.setState(state);
				}
				else{
					Alert.alert('Pesan','Maaf koneksi dengan server bermasalah');
				}
			});
			this.timePress1 = now1;
		}
	}

	_sendMessage(){
		const now2 = new Date().getTime();
		if(this.timePress2 && (now2-this.timePress2) < multiPressDelay2){
			delete this.timePress2;
		}
		else{
			if(
				this.state.username !== '' &&
				this.state.email !== '' &&
				this.state.message !== ''
			){
				this.setState({
					usernameStyle:{},
					emailStyle:{},
					messageStyle:{},
					sendLoading:true,
				},()=>{
					let data = {
						'table':'jdi_pojok_editorial_comments',
						'column[post_id]':this.props.detail_id,
						'column[user_id]':this.state.userid,
						'column[user_agent]':DeviceInfo.getUserAgent(),
						'column[user_name]':this.state.username,
						'column[user_email]':this.state.email,
						'column[comments]':this.state.message,
					};
					let newComFetch = new ComFetch();
					newComFetch.setRestURL(base_url);
					let header = {};
					// header['Content-Type'] = 'application/x-www-form-urlencoded';
					newComFetch.setHeaders(header);
					newComFetch.setSendData(data);
					newComFetch.setMethod('POST');
					newComFetch.setResource(api_uri+'all_insert');
					newComFetch.sendFetch((resp)=>{
						if(resp.status === 200){

							/*let commentsData = this.state.commentsData;
							commentsData.unshift(
								{
									"user_name":this.state.username,
									"comments":this.state.message,
									"created_at":"06/06/2017 16:44",
									"profile_thumb":"https://www.indonesiakaya.com/glide/image/no-profil-pict-big.jpg?w=100&dir=_images_member"
								}
							);*/

							let state = {
								//commentsData:commentsData,
								//username:'',
								//email:'',
								message:'',
								sendLoading:false,
								commentsComp:<Spinner/>,
								commentsPage:0,
								commentsData:[],
								commentsNPU:null,
							};

							this.setState(state,()=>{
								this._getComments();
							});
						}
						else{
							this.setState({
								sendLoading:false,
							},()=>{
								Alert.alert('Pesan','Maaf koneksi dengan server bermasalah');
							});
						}
					});
				});
			}
			else{
				let state = {};
				if(this.state.username === ''){
					state['usernameStyle'] = {borderColor:'#b76329',borderWidth:1};
				}
				if(this.state.email === ''){
					state['emailStyle'] = {borderColor:'#b76329',borderWidth:1};
				}
				if(this.state.message === ''){
					state['messageStyle'] = {borderColor:'#b76329',borderWidth:1};
				}
				this.setState(state);
			}
			this.timePress2 = now2;
		}
	}

    render(){
		let emoticonHw = (this.state.dimensions.width-10)/9;
		let emoticonStyle = {
			height:emoticonHw-10,
			width:emoticonHw-10,
		};

		let inputCommentsComp = <View/>;
		if(!this.state.login){
			inputCommentsComp = <View>
				<View style={this.state.usernameStyle}>
					<TextInput editable={!this.state.sendLoading} underlineColorAndroid='transparent' placeholder='Nama Lengkap' style={{flex:1,height:50,padding:10}} onChangeText={(teks)=>this.setState({username:teks})} value={this.state.username}/>
				</View>
				<View style={{height:5,backgroundColor:'#f0f0f0'}}></View>
				<View style={this.state.emailStyle}>
					<TextInput editable={!this.state.sendLoading} underlineColorAndroid='transparent' placeholder='Alamat Email' style={{flex:1,height:50,padding:10}} onChangeText={(teks)=>this.setState({email:teks})} value={this.state.email}/>
				</View>
				<View style={{height:5,backgroundColor:'#f0f0f0'}}></View>
			</View>;
		}

		let sendButton = <Spinner/>;
		if(!this.state.sendLoading){
			sendButton = <TouchableHighlight
				underlayColor='#999'
				style={{padding:10,borderRadius:0,backgroundColor:'#999'}}
				onPress={()=>this._sendMessage()}
			>
				<Text style={{fontSize:15,color:'#fff',textAlign:'center'}}>Kirim</Text>
			</TouchableHighlight>;
		}

        return(
			<View style={{backgroundColor:'#fafafa'}}>
				<View style={{flexDirection:'row',padding:5,borderWidth:1,borderColor:'#eaeaea',borderLeftWidth:0,borderLeftWidth:0}}>
					<TouchableHighlight underlayColor='transparent' style={{flex:1,padding:5}} onPress={()=>{this._emoticonPress('takut')}}>
						<View>
							<Image style={emoticonStyle} source={require('../resource/image/emoticon-takut.png')} resizeMode='contain'/>
							<Text style={{textAlign:'center',}}>{this.state.takut}</Text>
							<Text style={{textAlign:'center',fontSize:6}}>Takut</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight underlayColor='transparent' style={{flex:1,padding:5}} onPress={()=>{this._emoticonPress('sedih')}}>
						<View>
							<Image style={emoticonStyle} source={require('../resource/image/emoticon-sedih.png')} resizeMode='contain'/>
							<Text style={{textAlign:'center',}}>{this.state.sedih}</Text>
							<Text style={{textAlign:'center',fontSize:6}}>Sedih</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight underlayColor='transparent' style={{flex:1,padding:5}} onPress={()=>{this._emoticonPress('keren')}}>
						<View>
							<Image style={emoticonStyle} source={require('../resource/image/emoticon-keren.png')} resizeMode='contain'/>
							<Text style={{textAlign:'center',}}>{this.state.keren}</Text>
							<Text style={{textAlign:'center',fontSize:6}}>Keren</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight underlayColor='transparent' style={{flex:1,padding:5}} onPress={()=>{this._emoticonPress('terhibur')}}>
						<View>
							<Image style={emoticonStyle} source={require('../resource/image/emoticon-terhibur.png')} resizeMode='contain'/>
							<Text style={{textAlign:'center',}}>{this.state.terhibur}</Text>
							<Text style={{textAlign:'center',fontSize:6}}>Terhibur</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight underlayColor='transparent' style={{flex:1,padding:5}} onPress={()=>{this._emoticonPress('senang')}}>
						<View>
							<Image style={emoticonStyle} source={require('../resource/image/emoticon-senang.png')} resizeMode='contain'/>
							<Text style={{textAlign:'center',}}>{this.state.senang}</Text>
							<Text style={{textAlign:'center',fontSize:6}}>Senang</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight underlayColor='transparent' style={{flex:1,padding:5}} onPress={()=>{this._emoticonPress('marah')}}>
						<View>
							<Image style={emoticonStyle} source={require('../resource/image/emoticon-marah.png')} resizeMode='contain'/>
							<Text style={{textAlign:'center',}}>{this.state.marah}</Text>
							<Text style={{textAlign:'center',fontSize:6}}>Marah</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight underlayColor='transparent' style={{flex:1,padding:5}} onPress={()=>{this._emoticonPress('terganggu')}}>
						<View>
							<Image style={emoticonStyle} source={require('../resource/image/emoticon-terganggu.png')} resizeMode='contain'/>
							<Text style={{textAlign:'center',}}>{this.state.terganggu}</Text>
							<Text style={{textAlign:'center',fontSize:6}}>Terganggu</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight underlayColor='transparent' style={{flex:1,padding:5}} onPress={()=>{this._emoticonPress('terinspirasi')}}>
						<View>
							<Image style={emoticonStyle} source={require('../resource/image/emoticon-terinspirasi.png')} resizeMode='contain'/>
							<Text style={{textAlign:'center',}}>{this.state.terinspirasi}</Text>
							<Text style={{textAlign:'center',fontSize:6}}>Terinspirasi</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight underlayColor='transparent' style={{flex:1,padding:5}} onPress={()=>{this._emoticonPress('bosan')}}>
						<View>
							<Image style={emoticonStyle} source={require('../resource/image/emoticon-bosan.png')} resizeMode='contain'/>
							<Text style={{textAlign:'center',}}>{this.state.bosan}</Text>
							<Text style={{textAlign:'center',fontSize:6}}>Bosan</Text>
						</View>
					</TouchableHighlight>
				</View>
				<View style={{padding:15,backgroundColor:'#f0f0f0',borderWidth:1,borderColor:'#eaeaea',borderLeftWidth:0,borderLeftWidth:0,borderTopWidth:0}}>
					<View style={{backgroundColor:'#fff'}}>
						{inputCommentsComp}
						<View style={this.state.messageStyle}>
							<TextInput editable={!this.state.sendLoading} underlineColorAndroid='transparent' placeholder='Tulis Komentar' style={{flex:1,height:150,padding:10}} onChangeText={(teks)=>this.setState({message:teks})} value={this.state.message}/>
						</View>
					</View>
					<View style={{height:5,backgroundColor:'#f0f0f0'}}></View>
					<View>
						{sendButton}
					</View>
				</View>
				<View style={{padding:15,paddingBottom:0,backgroundColor:'#f0f0f0',borderWidth:1,borderColor:'#eaeaea',borderLeftWidth:0,borderLeftWidth:0,borderTopWidth:0}}>
					{this.state.commentsComp}
				</View>
			</View>
        );
    }
}