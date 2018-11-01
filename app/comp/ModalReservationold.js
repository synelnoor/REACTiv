import React, { Component } from 'react';
import {
	Text,
	View,
	Modal,
	TouchableHighlight,
	ScrollView,
	Picker,
	Alert
} from 'react-native';
const ItemPicker = Picker.Item;
import { Input, CheckBox, StyleProvider } from 'native-base';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import ArrayToQueryString from './ArrayToQueryString';
import ComFetch from './ComFetch';
import ComLocalStorage from './ComLocalStorage';
import WebHtmlView from './WebHtmlView';
import Service from './Service';
import getTheme from '../../native-base-theme/components';
import { base_url, api_uri } from './AppConfig';

export default class ModalReservation extends Component {

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

    constructor(props){
        super(props);
		this.device_info = JSON.stringify({
			getUniqueID:DeviceInfo.getUniqueID(),
			getManufacturer:DeviceInfo.getManufacturer(),
			getBrand:DeviceInfo.getBrand(),
			getModel:DeviceInfo.getModel(),
			getDeviceId:DeviceInfo.getDeviceId(),
			getUserAgent:DeviceInfo.getUserAgent(),
			isEmulator:DeviceInfo.isEmulator(),
			isTablet:DeviceInfo.isTablet(),
		});
        this.state = {
			login:false,
			modalActive:false,
			sendReserv:{
				user_id:0,
				calendar_id:0,
				fullname:'',
				email:null,
				phone:'',
				seat:1,
				status:'reserve',
				keep:true,
				device_info:this.device_info,
			},
			formReserv:null,
			cbReserv:null,
        }
    }

    componentWillMount(){}

    componentDidMount(){}

	_switchModal(value){
		if(!this.state.modalActive){

			let LocalStorage = new ComLocalStorage();
			LocalStorage.getItemByKey('@jwt:user_info',(e)=>{

				let login = false;
				let user_id = 0;
				let fullname = '';
				let email = '';
				let phone = '';
				let keep = false;

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
					fullname = fullnameJoin;
					user_id = user_data.userId;
					email = user_data.userName;
					phone = user_data.phone;
					login = true;
					keep = true;
				}

				this.setState({
					login:login,
					calendar_id:value.id,
					sendReserv:{
						user_id:user_id,
						calendar_id:value.id,
						fullname:fullname,
						email:email,
						phone:phone,
						seat:1,
						status:'reserve',
						keep:keep,
						device_info:this.device_info,
					},
					cbReserv:null,
				},()=>{

					var query = {};
					query['calendar_id'] = value.id;

					let resource = api_uri+'event?'+ArrayToQueryString(query);
					let newComFetch = new ComFetch();
					newComFetch.setMethod('POST');
					newComFetch.setHeaders({Authorization:this.jwt_signature});
					newComFetch.setRestURL(base_url);

					newComFetch.setResource(resource);

					newComFetch.sendFetch((rsp) => {
						if(rsp.status === 200){
							this.setState({formReserv:rsp.data,modalActive:!this.state.modalActive});
						}
						else{
							alert('error');
							//console.trace('error '+rsp.status);
						}
					});
				});

			});
		}
		else{
			this.setState({modalActive:!this.state.modalActive});
		}
	}

	_modal(){
		if(this.state.formReserv !== null){
			console.log(this.state.formReserv);

			let formReserv = this.state.formReserv;
			let note = <View/>
			let content = <View/>
			if(typeof formReserv.message !== 'undefined' && typeof formReserv.message.string !== 'undefined' && formReserv.message.string !== ''){
				if(formReserv.status === 'waitinglist'){
					note = <View>
						<WebHtmlView source={{html:'<style>*{margin:0 !important;padding:0 !important;color:#555 !important;font-size:13px;font-weight:normal;}strong{font-weight:bold !important;}</style>'+formReserv.message.string}}/>
					</View>
				} 
				// added by dandi 20180824
				else if(formReserv.status === 'open' && formReserv.remaining_quota == 0) {
					note = <View>
						<WebHtmlView source={{html:'<style>*{margin:0 !important;padding:0 !important;color:#555 !important;font-size:13px;font-weight:normal;}strong{font-weight:bold !important;}</style>'+formReserv.message.string}}/>
					</View>
				}
				else if(formReserv.status === 'tutup'){
					if(formReserv.row.type === 'gik'){
						note = <View>
							<WebHtmlView source={{html:'<style>*{margin:0 !important;padding:0 !important;color:#555 !important;font-size:13px;font-weight:normal;}strong{font-weight:bold !important;}</style>'+formReserv.message.string}}/>
						</View>;
					}
					else{
						content = <View>
						<Text style={{textAlign:'center',marginBottom:5,fontWeight:'bold',textAlign:'center'}}>{formReserv.row.title}</Text>
							<Text style={{textAlign:'center'}}>Tanggal : {formReserv.row.date}</Text>
							<Text style={{textAlign:'center'}}>Pukul: {formReserv.row.time}</Text>
						</View>;
					}
				} 
				else{
					note = <Text style={{textAlign:'center',marginBottom:5}}>Reservasi Tiket Pementasan Teater</Text>;

					content = <View>
					<Text style={{textAlign:'center',marginBottom:5,fontWeight:'bold',textAlign:'center'}}>{formReserv.row.title}</Text>
						<Text style={{textAlign:'center'}}>Tanggal : {formReserv.row.date}</Text>
						<Text style={{textAlign:'center'}}>Pukul: {formReserv.row.time}</Text>
					</View>
				}
			}
				else{
					note = <Text style={{textAlign:'center',marginBottom:5}}>Isi data Lengkap anda untuk Reservasi Tiket Pementasan Teater</Text>;

					content = <View>
					<Text style={{textAlign:'center',marginBottom:5,fontWeight:'bold',textAlign:'center'}}>{formReserv.row.title}</Text>
						<Text style={{textAlign:'center'}}>Tanggal : {formReserv.row.date}</Text>
						<Text style={{textAlign:'center'}}>Pukul: {formReserv.row.time}</Text>
					</View>
				}

			let text_type = 'Reservasi Galeri Indonesia Kaya';
			if(formReserv.row.type !== 'gik'){
				text_type = 'Agenda Budaya';
			}

			return(
				<Modal
					transparent={true}
					visible={this.state.modalActive}
					onRequestClose={()=>{}}
				>
					<View style={{backgroundColor:'rgba(0,0,0,0.5)',flex:1,paddingLeft:10,paddingRight:10,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
						<ScrollView>
							<View style={{backgroundColor:'#fff',alignItems:'stretch'}} onPress={()=>{this._switchModal()}}>

								<View style={{padding:10,flexDirection:'row',backgroundColor:'#d26c2a'}}>
									<Text style={{flex:1,color:'#fff'}}>{text_type}</Text>
									<TouchableHighlight underlayColor='#d26c2a' style={{flexDirection:'row',position:'absolute',right:10,top:0,bottom:0,alignItems:'center'}} onPress={()=>{this.setState({modalActive:!this.state.modalActive})}}>
										<IonIcon name='ios-close-outline' style={{flex:1,fontSize:25,color:'#fff'}}/>
									</TouchableHighlight>
								</View>

								<View>
									<View style={{padding:10}}>
										{note}
										{content}
									</View>
									{formReserv.status !== 'tutup' ? this._formView(formReserv) : <View/>}
								</View>

							</View>
						</ScrollView>
					</View>
				</Modal>
			);

		}
	}

	_formView(fmReserv){

		let fullname = <View style={{flexDirection:'row',marginBottom:10}}>
			<View style={{flexDirection:'row',alignItems:'center',flex:1}}>
				<Text>Nama Lengkap</Text>
			</View>
			<View style={{flex:2,borderWidth:1,borderColor:'#eee',backgroundColor:'#fff'}}>
				<Input style={{padding:2.5,margin:0}} value={this.state.sendReserv.fullname} onChangeText={(text)=>{this._inputData('fullname',text);}}/>
			</View>
		</View>;

		let email = <View style={{flexDirection:'row',marginBottom:10}}>
			<View style={{flexDirection:'row',alignItems:'center',flex:1}}>
				<Text>Alamat Email</Text>
			</View>
			<View style={{flex:2,borderWidth:1,borderColor:'#eee',backgroundColor:'#fff'}}>
				<Input style={{padding:2.5,margin:0}} value={this.state.sendReserv.email} onChangeText={(text)=>{this._inputData('email',text);}}/>
			</View>
		</View>;

		let phone = <View style={{flexDirection:'row',marginBottom:10}}>
			<View style={{flexDirection:'row',alignItems:'center',flex:1}}>
				<Text>No. Telepon</Text>
			</View>
			<View style={{flex:2,borderWidth:1,borderColor:'#eee',backgroundColor:'#fff'}}>
				<Input style={{padding:2.5,margin:0}} value={this.state.sendReserv.phone} onChangeText={(text)=>{this._inputData('phone',text);}}/>
			</View>
		</View>;

		let keep = <View style={{justifyContent:'center',alignItems:'center',marginBottom:15}}>
			<Text style={{textAlign:'center'}}>Login terlebih dahulu untuk mengaktifkan fitur pengingat</Text>
		</View>;

		let picker = <View style={{padding:0,margin:0,marginBottom:15}}>
			<View style={{marginBottom:5}}>
				<Text>Jumlah Kursi :</Text>
			</View>
			<View style={{borderColor:'#eee',borderWidth:1}}>
				<Picker
					style={{margin:0,padding:0,color:'#767676'}}
					mode='dropdown'
					selectedValue={this.state.sendReserv.seat}
					onValueChange={(text)=>{this._inputData('seat',text);}}
				>
					<ItemPicker color='#767676' style={{margin:0,padding:0}} label='1' value='1'/>
					<ItemPicker color='#767676' style={{margin:0,padding:0}} label='2' value='2'/>
				</Picker>
			</View>
		</View>;

		if(this.state.login){

			fullname = <View style={{flexDirection:'row',marginBottom:15}}>
				<View style={{flexDirection:'row',alignItems:'center',flex:1}}>
					<Text>Nama Lengkap</Text>
				</View>
				<View style={{flex:2}}>
					<Text>{this.state.sendReserv.fullname}</Text>
				</View>
			</View>;

			email = <View style={{flexDirection:'row',marginBottom:15}}>
				<View style={{flexDirection:'row',alignItems:'center',flex:1}}>
					<Text>Alamat Email</Text>
				</View>
				<View style={{flex:2}}>
					<Text>{this.state.sendReserv.email}</Text>
				</View>
			</View>;

			phone = <View style={{flexDirection:'row',marginBottom:15}}>
				<View style={{flexDirection:'row',alignItems:'center',flex:1}}>
					<Text>No. Telepon</Text>
				</View>
				<View style={{flex:2}}>
					<Text>{this.state.sendReserv.phone}</Text>
				</View>
			</View>;

			keep = <View style={{flexDirection:'row',marginBottom:10}}>
				<View style={{marginLeft:-10}}><CheckBox checked={this.state.sendReserv.keep} onPress={()=>{this._inputData('keep',!this.state.sendReserv.keep);}}/></View>
				<Text style={{marginLeft:20}}>Ingatkan saya</Text>
			</View>;

		}

		if(fmReserv.status === 'open' || fmReserv.status === 'waitinglist'){

			if(fmReserv.row.gik_type === 'workshop'){
				picker = <View style={{flexDirection:'row',marginBottom:15}}>
					<View style={{flexDirection:'row',alignItems:'center',flex:1}}>
						<Text>Jumlah Kursi</Text>
					</View>
					<View style={{flex:2}}>
						<Text>1</Text>
					</View>
				</View>;
			}

			return(
				<View style={{borderTopWidth:1,borderColor:'#eee',padding:10}}>

					<View>

						{fullname}

						{this._formValidate('name')}

						{email}

						{this._formValidate('email')}

						{phone}

						{this._formValidate('phone')}

						{picker}

					</View>

					{this._formValidate('seat')}

					{keep}

					<View style={{justifyContent:'center',alignItems:'center',marginBottom:15}}>
						<Text style={{textAlign:'center'}}>Informasi Lebih Lanjut Hubungi :</Text>
						<Text style={{textAlign:'center',fontWeight:'bold'}}>(021) 235 80 701</Text>
					</View>

					<View>
						<TouchableHighlight
							underlayColor='#999'
							style={{padding:10,borderRadius:0,backgroundColor:'#999'}}
							onPress={()=>this._sendData()}
						>
							<Text style={{fontSize:15,color:'#fff',textAlign:'center',paddingLeft:10,paddingRight:10}}>Kirim</Text>
						</TouchableHighlight>
					</View>

				</View>
			);
		}
		else if(typeof fmReserv.message !== 'undefined' && typeof fmReserv.message.string !== 'undefined' && fmReserv.message.string !== ''){
			return(
				<View style={{borderTopWidth:1,borderColor:'#eee',padding:15}}>
					<WebHtmlView source={{html:'<style>*{margin:0 !important;padding:0 !important;color:#555 !important;font-size:13px;font-weight:normal;}strong{font-weight:bold !important;}</style>'+fmReserv.message.string}}/>
				</View>
			);
		}
		else{
			return;
		}

	}

	_sendData(){

		let resource = api_uri+'reservation';
		let newComFetch = new ComFetch();
		newComFetch.setMethod('POST');
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);
		newComFetch.setSendData({
			user_id:this.state.sendReserv.user_id,
			calendar_id:this.state.sendReserv.calendar_id,
			name:this.state.sendReserv.fullname,
			email:this.state.sendReserv.email,
			phone:this.state.sendReserv.phone,
			seat:this.state.sendReserv.seat,
			status:this.state.formReserv.status,
			keep:this.state.sendReserv.keep,
			device_info:this.device_info,
		});

		newComFetch.setResource(resource);

		newComFetch.sendFetch((rsp) => {
			if(rsp.status === 200){
				let data = rsp.data;
				this.setState({
					cbReserv:data
				},()=>{
					if(data.success){
						let LocalStorage = new ComLocalStorage();
						LocalStorage.getItemByKey('@temp:kegiatan',(e)=>{
							let LocalStorage = new ComLocalStorage();
							LocalStorage.getItemByKey('@temp:kegiatan_status',(x)=>{

								let store1 = {};
								let store2 = {};

								if(e !== null && e !== ''  && e !== '[]'){
									//store1 = JSON.parse(e);
								}

								if(x !== null && x !== '' && x !== '[]'){
									store2 = JSON.parse(x);
								}

								if(this.state.login){

									store1['i'+this.state.sendReserv.calendar_id] = {
										calendar_id:this.state.sendReserv.calendar_id,
										title:this.state.formReserv.row.title,
										notification:this.state.sendReserv.keep ? 'Y' : 'N',
										expired:'N',
										ymd:this.state.formReserv.row.date,
										ymdconvert:this.state.formReserv.row.ymdconvert,
										time1:this.state.formReserv.row.time1,
										time2:this.state.formReserv.row.time2,
										actions:'kegiatan',
									};

									ComLocalStorage.setItem('temp','kegiatan',JSON.stringify(store1),()=>{
										ComLocalStorage.setItem('temp','kegiatan_status',JSON.stringify(store2),()=>{
											let user_id = this.state.sendReserv.user_id;
											this.setState({
												modalActive:false,
											},()=>{
												Alert.alert('Pesan','Data berhasil disimpan');
												Service._wsSend(JSON.stringify({
													'apps_cmd_rebuild_kegiatan':user_id
												}),false);
											});
										});
									});

								}
								else{
									this.setState({
										modalActive:false,
									},()=>{
										Alert.alert('Pesan','Data berhasil disimpan');
									});
								}
							});
						});
					}
					else{
						if(typeof data.message.string !== 'undefined'){
							Alert.alert('Pesan',data.message.string);
						}
					}
				});
			}
			else{
				alert('error');
				//console.trace('error '+rsp.status);
			}
		});

	}

	_inputData(objValue,value){
		let _fullname = objValue === 'fullname' ? value : this.state.sendReserv.fullname;
		let _email = objValue === 'email' ? value : this.state.sendReserv.email;
		let _phone = objValue === 'phone' ? value : this.state.sendReserv.phone;
		let _seat = objValue === 'seat' ? value : this.state.sendReserv.seat;
		let _keep = objValue === 'keep' ? value : this.state.sendReserv.keep;
		this.setState({
			sendReserv:{
				user_id:this.state.sendReserv.user_id,
				calendar_id:this.state.sendReserv.calendar_id,
				fullname:_fullname,
				email:_email,
				phone:_phone,
				seat:_seat,
				status:this.state.sendReserv.status,
				keep:_keep,
				device_info:this.device_info,
			}
		});
	}

	_formValidate(value){
		if(this.state.cbReserv !== null){
			let _callback = this.state.cbReserv;
			let message = _callback.message;
			let messageView = [];
			let _dataMessage = message[value];
			let _message = '';
			for(var i in _dataMessage){
				_message = _dataMessage[i];
				messageView.push(
					<View key={i} style={{height:20,marginBottom:5}}>
						<WebHtmlView source={{html:'<style>*{margin:0 !important;padding:0 !important;color:#f00 !important;font-size:12px !important;}</style><div>'+_message+'</div>'}}/>
					</View>
				);
			}
			return(messageView);
		}
	}

    render(){
        return(
			<StyleProvider style={getTheme()}>
				<View>
					{this._modal()}
				</View>
			</StyleProvider>
        );
    }

}