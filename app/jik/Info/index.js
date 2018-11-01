// Import dependencies
import React, { Component } from 'react';
import {
	Text,
	View,
	Picker,
	ScrollView,
	Dimensions,
	Alert
} from 'react-native';
const ItemPicker = Picker.Item;
/*import {
	Spinner,
	Item,
	Input,
	Label,
} from 'native-base';*/
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';

// Import konfigurasi
import { base_url, api_uri } from '../../comp/AppConfig';

// Import Style
/*import Styles from '../Styles';
import getTheme from '../../../native-base-theme/components';*/

// Import komponen buatan
import FooterSM from '../FooterSM';
import ComFetch from '../../comp/ComFetch';
//import ComAccordion from './ComAccordion';

export default class Info extends Component{

constructor(props){
super(props);

this.state = {
dimensions:Dimensions.get('window'),
isLoadingSubmit:false,
nama_lengkap:'',
email:'',
telepon:'',
tentang:'Jelajah Indonesia',
pesan:'',
errorMsg:'',
ScrollView:this.refs.ScrollView,
};

}

componentDidMount(){
Actions.refresh({key:'IKdrawer',open:value=>false});
this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView});
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
tentang:'Jelajah Indonesia',
pesan:'',
});
}

_tabHeading(txt){
	return(
	<View style={{paddingRight: 5, paddingLeft: 5, paddingTop: 8, paddingBottom: 8 }} >
		<Text>
		{txt}
		</Text>
	</View>
	);
}

	render(){

	let openCloseIcon = new Array();
	openCloseIcon.push(<IonIcon name='ios-arrow-up-outline'/>);
	openCloseIcon.push(<IonIcon name='ios-arrow-down-outline'/>);

	let accordionStyle = {
		header:{backgroundColor:'#e9e9e9'},
		containerStyle:{backgroundColor:'#fff'},
		content:{padding:15},
	}


	let syarat = <View>

		<Text style={{marginBottom:15,color:'#555',fontSize:13,fontWeight:'bold',textAlign:'center'}}>Selamat datang di Jurnal Indonesia Kaya.</Text>
		<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>Untuk kenyamanan dan keamanan bersama saat menjelajah situs ini, pastikan Anda memahami syarat dan ketentuan di Jurnal Indonesia Kaya sebagai berikut:</Text>

		<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>1. Jurnal Indonesia Kaya merupakan situs yang dapat Anda gunakan untuk berbagi tentang Pariwisata, Kesenian, Tradisi dan Kuliner Indonesia.</Text>
		<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>2. Di sini Anda dapat memposting sendiri tulisan yang dimiliki dan bisa dilengkapi dengan foto dan video.</Text>
		<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>3 Informasi yang ditampilkan oleh user tidak menjadi tanggung jawab pihak Indonesia Kaya.</Text>
		<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>4. Indonesia Kaya tidak bertanggung jawab atas kerugian yang terjadi akibat informasi yang dibagikan oleh pihak ketiga.</Text>
		<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>5. Anda bertanggung jawab penuh terhadap konten yang dibagikan baik berupa artikel, foto ataupun video.</Text>
		<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>6. Indonesia Kaya tidak bertanggung jawab terhadap adanya tuntutan akibat informasi palsu ataupun pelanggaran hak cipta yang diakibatkan oleh tindakan user.</Text>
		<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>7. Dilarang menampilkan pornografi, intimidasi dan kekerasan, pencemaran nama baik, pemberian informasi palsu serta hal-hal negatif yang menyinggung Suku, Agama, Ras, dan Adat Istiadat.</Text>

	</View>;

	return(
		<View>

			<ScrollView onScroll={this.props.hideBtnOnScroll} style={{backgroundColor:'#eaeaea'}} ref='ScrollView'>
				<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#f0f0f0'}}>

					<View style={{padding:15,paddingTop:0}}>
						<View style={{marginTop:15}}>
							{/* <ComAccordion
								containerStyle={accordionStyle.containerStyle}
								header={this._tabHeading("Syarat & Ketentuan")}
								headerStyle={accordionStyle.header}
								openCloseIcon={openCloseIcon}
								content={syarat}
								contentStyle={accordionStyle.content}
								open_tab={typeof this.props.open_tab != 'undefined' && typeof this.props.open_tab['SYARAT DAN KETENTUAN'] != 'undefined'}
							/> */}
							{ syarat }

						</View>
					</View>

					<FooterSM ScrollView={this.state.ScrollView}/>

				</View>
			</ScrollView>
			{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

		</View>
	);
	}

}
