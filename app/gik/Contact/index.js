// Import dependencies
import React, { Component } from 'react';
import {
	Image,
	Text,
	View,
	ScrollView,
	Dimensions,
	TouchableHighlight,
	TextInput,
	Alert,
	Picker
} from 'react-native';
const ItemPicker = Picker.Item;
import {
	Spinner,
	Item,
	Input,
	Label,
} from 'native-base';
import { base_url, api_uri } from '../../comp/AppConfig';
import ComFetch from '../../comp/ComFetch';
import { Actions } from 'react-native-router-flux';
import FooterSM from '../FooterSM';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Communications from 'react-native-communications';

export default class Facilities extends Component {

	constructor(props){
		super(props);
		this.state = {
			active:1,
			dimensions:Dimensions.get('window'),
			ScrollView:this.refs.ScrollView,
			isLoadingSubmit:false,
			nama_lengkap:'',
			email:'',
			telepon:'',
			tentang:'Web Galeri Indonesia Kaya',
			pesan:'',
			errorMsg:'',
		}
		/*if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

serverRequest(resource,method,data,callback){
// Set data yang akan di kirim ke server
let resourceUrl = api_uri+resource;

// Instance ComFetch
let fetchData = new ComFetch();

// Set header dan resturl untuk fetching artikel
// fetchData.setHeaders({ Authorization: this.jwt_signature });
fetchData.setRestURL(base_url);

// Set post data
if(method !== 'GET' && typeof data !== 'undefined' && Object.keys(data).length > 0)
{
let header = {};
// header['Content-Type'] = 'application/x-www-form-urlencoded';
fetchData.setHeaders(header);
fetchData.setSendData(data);
fetchData.setMethod(method);
}

// Ambil data MainVideo
fetchData.setResource(resourceUrl);
	fetchData.sendFetch((resp) => {
		callback(resp);
	});
}

submitContact(){
let nama_lengkap = this.state.nama_lengkap;
let email = this.state.email;
let telepon = this.state.telepon;
let tentang = this.state.tentang;
let pesan = this.state.pesan;

let dataSend = {};
dataSend.table = 'gik_contact';
dataSend['column[contact_name]'] = nama_lengkap;
dataSend['column[contact_email]'] = email;
dataSend['column[contact_phone]'] = telepon;
dataSend['column[contact_about]'] = tentang;
dataSend['column[contact_message]'] = pesan;

this.setState({isLoadingSubmit: true});
	this.serverRequest('all_insert?', 'POST', dataSend, (dataCB) => this.hasilContact(dataCB));
}

hasilContact(data){
	this.setState({isLoadingSubmit:false});
	if(data.status === 200){
		let textJSX = '';
		if(typeof data.data !== 'undefined' && Object.keys(data.data.message).length > 0){
			for(var i in data.data.message){
				if(i === 'string'){
					textJSX += data.data.message[i]+'\n';
				}
				else{
					if(data.data.message.hasOwnProperty(i)){
						for(var o in data.data.message[i]){
							if(data.data.message[i].hasOwnProperty(o)){
								textJSX += data.data.message[i][o]+'\n';
							}
						}
					}
				}
			}
		}
		if(!data.data.success){
			if(textJSX){
				Alert.alert('Pesan',textJSX);
			}
			else{
				Alert.alert('Pesan','Maaf koneksi dengan server bermasalah');
			}
		}
		else{
			this.resetForm();
				Alert.alert('Pesan',textJSX);
		}
	}
	else{
		Alert.alert('Pesan','Maaf koneksi dengan server bermasalah : '+data.status);
	}
}

resetForm(){
	this.setState({
		nama_lengkap:'',
		email:'',
		telepon:'',
		tentang:'Web Galeri Indonesia Kaya',
		pesan:'',
	});
}

    componentDidMount(){
		this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView},()=>{
			Actions.refresh({key:'GIKdrawer',open:value=>false});
		});
    }

	_changeTab(id){
		//LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
		this.setState({
			active:id
		});
	}

	render(){

		let textStyle1 = {};
		let textStyle2 = {};
		let showComp = <View/>;

		let btnSend = <TouchableHighlight
				underlayColor='#999'
				style={{padding:10,borderRadius:0,backgroundColor:'#999',borderWidth:1,borderColor:'#eee'}}
				onPress={()=>this.submitContact()}
			>
				<Text style={{fontSize:15,color:'#fff',textAlign:'center'}}>Kirim</Text>
			</TouchableHighlight>;

		if(this.state.isLoadingSubmit){
			btnSend = <Spinner/>
		}

		if(this.state.active === 1){
			textStyle1.color = '#b35e27';
			showComp = <View style={{padding:15,backgroundColor:'fff',alignItems:'center'}}>
				<TouchableHighlight style={{backgroundColor:'#f9f9f9',flexDirection:'row',justifyContent:'center',alignItems:'center',height:150,width:150,borderRadius:150,borderWidth:1,borderColor:'#85c743',marginBottom:20}} underlayColor='transparent' onPress={()=>{Communications.phonecall('022123580701',true)}}>
					<IonIcon style={{color:'#85c743',fontSize:90}} name='ios-call-outline'/>
				</TouchableHighlight>
				<Text style={{fontSize:30,color:'#d5d5d5',marginBottom:20}}>(021) 23580701</Text>
				<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
					<Text style={{flex:1,textAlign:'center',fontSize:11}}>09:00-15:00 (Senin-Jumat)</Text>
					<View style={{height:10,width:1,backgroundColor:'#b35e27',margin:10,marginTop:5,marginBottom:5}}/>
					<Text style={{flex:1,textAlign:'center',fontSize:11}}>09:00-13:00 (Sabtu-Minggu)</Text>
				</View>
			</View>;
		}
		else{
			textStyle2.color = '#b35e27';
			showComp = <View style={{padding:15}}>
				<Item floatingLabel style={{padding:0,margin:0,marginBottom:15,borderBottomColor:'#eee'}}>
					<Label style={{fontSize:12,color:'#999'}}>NAMA LENGKAP</Label>
					<Input ref='nama' onChangeText={(teks)=>this.setState({nama_lengkap:teks})} value={this.state.nama_lengkap}/>
				</Item>
				<Item floatingLabel style={{padding:0,margin:0,marginBottom:15,borderBottomColor:'#eee'}}>
					<Label style={{fontSize:12,color:'#999'}}>EMAIL</Label>
					<Input ref='email' onChangeText={(teks)=>this.setState({email:teks})} value={this.state.email}/>
				</Item>
				<Item floatingLabel style={{padding:0,margin:0,marginBottom:15,borderBottomColor:'#eee'}}>
					<Label style={{fontSize:12,color:'#999'}}>TELEPON</Label>
					<Input ref='telepon' onChangeText={(teks)=>this.setState({telepon:teks})} value={this.state.telepon}/>
				</Item>
				<View style={{padding:0,margin:0,marginBottom:15}}>
					<View style={{marginBottom:5}}>
						<Text style={{fontSize:12,color:'#999'}}>TENTANG</Text>
					</View>
					<View style={{borderColor:'#eee',borderWidth:1}}>
						<Picker
							style={{margin:0,padding:0,color:'#767676'}}
							mode='dropdown'
							selectedValue={this.state.tentang}
							onValueChange={(tentang)=>this.setState({tentang:tentang})}
						>
							<ItemPicker color='#767676' style={{margin:0,padding:0}} label='Web Galeri Indonesia Kaya' value='Web Galeri Indonesia Kaya'/>
							<ItemPicker color='#767676' style={{margin:0,padding:0}} label='Fasilitas Galeri Indonesia Kaya' value='Fasilitas Galeri Indonesia Kaya'/>
							<ItemPicker color='#767676' style={{margin:0,padding:0}} label='Reservasi' value='Reservasi'/>
						</Picker>
					</View>
				</View>
				<View>
					<View style={{marginBottom:5}}>
						<Text style={{fontSize:12,color:'#999'}}>PESAN</Text>
					</View>
					<View style={{marginBottom:15,borderWidth:1,borderColor:'#eee',height:200}}>
						<TextInput underlineColorAndroid='transparent' ref='pesan' style={{flex:1,height:200,padding:10}} onChangeText={(teks)=>this.setState({pesan:teks})} value={this.state.pesan}/>
					</View>
				</View>
				{btnSend}
			</View>;
		}

		return(
			<View>

				<ScrollView onScroll={this.props.hideBtnOnScroll} style={{backgroundColor:'#eaeaea'}} ref='ScrollView'>
					<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#fafafa'}}>

					<View style={{backgroundColor:'#b35e27',padding:15,paddingBottom:40}}>
						<Image style={{position:'absolute',height:(35/400)*this.state.dimensions.width,width:(133/682.6666666666666)*this.state.dimensions.height,top:0,right:0}} resizeMode='cover' source={require('../../resource/image/gik-contact-top.png')}/>
						<Image style={{position:'absolute',height:(80/400)*this.state.dimensions.width,width:(124/682.6666666666666)*this.state.dimensions.height,bottom:0,left:0}} resizeMode='cover' source={require('../../resource/image/gik-contact-bottom.png')}/>
						<View style={{flexDirection:'row'}}>
							<View>
								<Text style={{color:'#fff',fontSize:13,fontWeight:'bold'}}>Hubungi Kami</Text>
								<View style={{margin:5,marginLeft:0,marginRight:0,backgroundColor:'#fff',height:1,flex:1}}></View>
							</View>
						</View>
						<Text style={{color:'#fff',fontSize:13,lineHeight:22}}>Saran, Komentar atau Pertanyaan terkait fasilitas</Text>
						<Text style={{color:'#fff',fontSize:13,lineHeight:22}}>Galeri Indonesia Kaya, Reservasi atau sekedar Web</Text>
						<Text style={{color:'#fff',fontSize:13,lineHeight:22}}>Galeri Indonesia Kaya dapat ditujukan ke :</Text>
					</View>

					<View style={{borderColor:'#e9e9e9',borderWidth:1,margin:15,marginTop:-30}}>

						<View style={{backgroundColor:'#f0f0f0',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
							<TouchableHighlight style={{flex:1}} underlayColor='transparent' onPress={()=>{this._changeTab(1)}}>
								<Text style={[{textAlign:'center'},textStyle1]}>Telepon</Text>
							</TouchableHighlight>
							<View style={{height:25,width:1,backgroundColor:'#d1d1d1',marginTop:7.5,marginBottom:7.5}}/>
							<TouchableHighlight style={{flex:1}} underlayColor='transparent' onPress={()=>{this._changeTab(2)}}>
								<Text style={[{textAlign:'center'},textStyle2]}>Email</Text>
							</TouchableHighlight>
						</View>

						{showComp}

					</View>

					</View>
					<FooterSM ScrollView={this.state.ScrollView}/>
				</ScrollView>
				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

			</View>
		);
	}

}
