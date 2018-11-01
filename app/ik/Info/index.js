import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	Picker,
	TextInput,
	ScrollView,
	TouchableHighlight,
	Dimensions,
	Alert
} from 'react-native';
import {
	Spinner,
	Item,
	Input,
	Label,
} from 'native-base';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';

// Import Style
//import Styles from '../Styles';
//import getTheme from '../../../native-base-theme/components';

// Import komponen buatan
import { base_url, api_uri } from '../../comp/AppConfig';
import FooterSM from '../FooterSM';
import ComFetch from '../../comp/ComFetch';
import ComAccordion from './ComAccordion';

const ItemPicker = Picker.Item;

export default class Info extends Component {
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
		Actions.refresh({key:'IKdrawer',open:value=>false,active1:7,active2:0});
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
				for(let i in data.data.message){
					if(i === 'string'){
						textJSX += data.data.message[i]+'\n';
					}
					else{
						if(data.data.message.hasOwnProperty(i)){
							for(let o in data.data.message[i]){
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
		// openCloseIcon.push(<IonIcon name='ios-arrow-up-outline'/>);
		// openCloseIcon.push(<IonIcon name='ios-arrow-down-outline'/>);
		openCloseIcon.push(<IonIcon name='ios-arrow-down-outline'/>);
		openCloseIcon.push(<IonIcon name='ios-arrow-up-outline'/>);

		let accordionStyle = {
			header:{backgroundColor:'#e9e9e9'},
			containerStyle:{backgroundColor:'#fff'},
			content:{padding:15},
		};

		let tentangIK =
		<View style={{overflow:'hidden'}}>
			<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
				<Image source={require('../../resource/image/about-ik.png')} resizeMode='contain'/>
			</View>
			<Text style={{marginTop:15,color:'#999',fontSize:13,lineHeight:22}}>Indonesia Kaya merupakan portal informasi budaya Indonesia yang didukung oleh Bakti Budaya Djarum Foundation. Portal ini bertujuan memperkenalkan dan memberikan kekayaan kebudayaan yang dimiliki Indonesia. Dalam portal ini, masyarakat bisa mendapatkan informasi tentang kekayaan yang dimiliki Indonesia dalam bentuk artikel, foto dan video melalui kanal-kanal yang ada di Indonesia Kaya.</Text>
			<Text style={{marginTop:15,color:'#999',fontSize:13,lineHeight:22}}>Kanal-kanal tersebut dibagi menjadi empat kanal, yaitu pariwisata yang mengulas informasi keindahan obyek wisata yang ada di Indonesia, kesenian yang membahas seni budaya Indonesia, mulai dari seni pertunjukan sampai kerajinan tangan. Dalam kanal tradisi budaya, kita dapat melihat berbagai jenis ritual, perayaan dan adat istiadat di daerah-daerah Indonesia. Yang terakhir adalah kanal kuliner yang memuat kekayaan makanan tradisional Indonesia.</Text>
			<Text style={{marginTop:15,color:'#999',fontSize:13,lineHeight:22}}>Selain itu, Indonesia Kaya memiliki beberapa halaman lain, seperti halaman Tokoh yang memuat cerita-cerita dari para tokoh inspiratif Indonesia. Ada juga halaman Jurnal Indonesia Kaya yang memuat para pencinta traveling untuk menuliskan cerita-cerita perjalanan mereka. Halaman Galeri Indonesia Kaya merupakan halaman khusus yang memuat informasi mengenai kegiatan-kegiatan yang ada di Galeri Indonesia Kaya, baik yang sudah berlalu ataupun yang akan datang.</Text>
			<Text style={{marginTop:15,color:'#999',fontSize:13,lineHeight:22}}>Indonesia Kaya memiliki tiga sosial media, yaitu Facebook Indonesia Kaya, Twitter @IndonesiaKaya dan Instagram @indonesia_kaya yang memuat informasi-informasi budaya, informasi kegiatan di Galeri Indonesia Kaya dan kegiatan seni lainnya, dan juga kuis-kuis berhadiah menarik.</Text>
		</View>;

		let btnSend =
			<TouchableHighlight
				underlayColor='#999'
				style={{padding:10,borderRadius:0,backgroundColor:'#999',borderWidth:1,borderColor:'#eee'}}
				onPress={()=>this.submitContact()}
			>
				<Text style={{fontSize:15,color:'#fff',textAlign:'center'}}>Kirim</Text>
			</TouchableHighlight>;

		if(this.state.isLoadingSubmit){
			btnSend = <View style={{backgroundColor:'transparent'}}><Spinner/></View>
		}

		// let errorMsg = <View></View>;
		// if(this.state.errorMsg.length > 0){
		// errorMsg = <View stlye={{borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5}}>{this.state.errorMsg}</View>;
		// }

		let hubungi =
		<View style={{overflow:'hidden'}}>
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
						<ItemPicker color='#767676' style={{margin:0,padding:0}} label='Jelajah Indonesia' value='Jelajah Indonesia'/>
						<ItemPicker color='#767676' style={{margin:0,padding:0}} label='Jendela Indonesia' value='Jendela Indonesia'/>
						<ItemPicker color='#767676' style={{margin:0,padding:0}} label='Jurnal Indonesia Kaya' value="Jurnal Indonesia Kaya'/>
						<ItemPicker color='#767676' style={{margin:0,padding:0}} label='Indonesia Kaya TV' value='Indonesia Kaya TV"/>
						<ItemPicker color='#767676' style={{margin:0,padding:0}} label='Lainnya' value='Lainnya'/>
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

		let syarat =
		<View style={{overflow:'hidden'}}>
			<Text style={{marginBottom:15,color:'#555',fontSize:13,fontWeight:'bold',textAlign:'center'}}>Selamat datang di portal budaya, Indonesia Kaya</Text>
			<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>Terima kasih atas kunjungan Anda ke portal budaya Indonesia Kaya. Untuk kenyamanan dan keamanan bersama saat menjelajah situs ini, pastikan Anda memahami syarat dan ketentuan Indonesia Kaya sebagai berikut:</Text>

			<Text style={{color:'#555',fontSize:13,fontWeight:'bold'}}>TUJUAN</Text>
			<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>Indonesia Kaya merupakan portal informasi budaya Indonesia yang bertujuan memperkenalkan dan memberikan informasi kepada masyarakat umum terhadap budaya tiap daerah di Indonesia. Konten berupa artikel, foto dan video yang tersedia di kanal Jelajah Indonesia dan Jendela Indonesia dibuat oleh kontributor yang turun langsung ke lapangan. Pembaca diberikan kesempatan untuk bisa berinteraksi dan membagikan pengetahuan Anda tentang budaya, referensi pariwisata, tradisi, ataupun kesenian dalam bentuk artikel, foto dan video.</Text>

			<Text style={{color:'#555',fontSize:13,fontWeight:'bold'}}>PENGGUNAAN</Text>
			<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>
			Di situsi ini, semua pengunjung situs dapat saling berbagi informasi tentang budaya Indonesia dengan cara membagi informasi yang disediakan Indonesia Kaya di sosial media, maupun dengan menuliskan informasi dan pengetahuan milik pribadi di kanal Jurnal Indonesia Kaya. Beberapa hal yang harus diingat ketika saling berbagi informasi di portal Indonesia Kaya:
			1. Tidak diizinkan post berupa tulisan, foto ataupun video untuk mempromosikan sesuatu hal yang bertujuan untuk kepentingan pribadi/kelompok.
			2. Informasi yang ditampilkan tiap user/pengunjung tidak menjadi tanggung jawab pihak Indonesia Kaya.
			3. Indonesia Kaya tidak bertanggung jawab atas kerugian yang terjadi akibat informasi yang dibagikan oleh pihak ketiga.
			Untuk pertanyaan lebih lanjut mengenai informasi yang ditulis oleh pihak Indonesia Kaya, mohon langsung hubungi kami.
			</Text>

			<Text style={{color:'#555',fontSize:13,fontWeight:'bold'}}>PEMBLOKIRAN</Text>
			<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>Indonesia Kaya berhak memblokir ataupun menghapus akun user yang dinilai melanggar syarat dan ketentuan kami. Tidak terkecuali untuk user yang menampilkan pornografi, intimidasi dan kekerasan, pencemaran nama baik, pemberian informasi palsu serta hal-hal menyinggung Suku, Agama, Ras dan Adat Istiadat.</Text>

			<Text style={{color:'#555',fontSize:13,fontWeight:'bold'}}>TANGGUNG JAWAB PRIBADI TERHADAP PEMAKAIAN KONTEN</Text>
			<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>Pengunjung situs bertanggungjawab penuh terhadap konten yang dibagikan baik berupa artikel, foto ataupun video dan wajib memastikan bahwa seluruh hak cipta yang dibagikan kepada masyarakat melalui portal Indonesia Kaya adalah sepenuhnya milik Anda. Indonesia Kaya tidak bertanggungjawab terhadap adanya tuntutan akibat informasi palsu ataupun pelanggaran hak cipta yang diakibatkan oleh tindakan user.</Text>

			<Text style={{color:'#555',fontSize:13,fontWeight:'bold'}}>PENYALAHGUNAAN KONTEN PADA PORTAL INDONESIA KAYA</Text>
			<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>Apabila Anda mengambil, menyalin ataupun mengutip artikel, foto dan video dari sumber lain, tanggung jawab atas penyiaran konten tersebut sepenuhnya berada di tangan user. Indonesia Kaya tidak menjamin adanya tuntutan akibat penyalahgunaan konten oleh user.</Text>

			<Text style={{color:'#555',fontSize:13,fontWeight:'bold'}}>HAK PENGGUNAAN KONTEN OLEH PORTAL INDONESIA KAYA</Text>
			<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>Dengan turut berpartisipasi pada Portal Indonesia Kaya, anda menyetujui sepenuhnya bahwa Indonesia Kaya memiliki hak sepenuhnya untuk mempergunakan artikel, foto dan video yang anda upload/posting untuk keperluan promosi dan publikasi Portal Indonesia Kaya dan/atau untuk keperluan-keperluan lainnya dalam jangka waktu yang tidak terbatas. Anda sebagai user melepaskan hak untuk menuntut, meminta ganti rugi kepada Indonesia Kaya sehubungan dengan penggunaan artikel, foto dan video yang anda upload/posting tersebut.</Text>
		</View>;

		let panduan =
		<View style={{overflow:'hidden'}}>
			<View style={{alignItems:'center'}}>
				<Image style={{marginBottom:10,height:(73/400)*this.state.dimensions.width,width:(320/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/logo-ik.png')}/>

				<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Jelajah Indonesia</Text>
				<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-line.png')}/>
				<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
					<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Disini kamu dapat informasi tentang Kesenian, Tradisi, Pariwisata, Kuliner yang ada diseluruh Indonesia</Text>
				</View>
				<Image style={{height:(140/400)*this.state.dimensions.width,width:(347/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-content-1.png')}/>

				<View style={{height:50}}/>

				<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Jendela Indonesia</Text>
				<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-line.png')}/>
				<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
					<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Pada halaman ini akan memuat cerita dari para tokoh Inspiratif, Pojok Editorial, Agenda Budaya dan Liputan Budaya</Text>
				</View>
				<Image style={{height:(140/400)*this.state.dimensions.width,width:(244/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-content-2.png')}/>

				<View style={{height:50}}/>

				<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Kegiatan</Text>
				<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-line.png')}/>
				<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
					<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Pilih tanggal acara yang ingin kamu saksikan pada kalendar kegiatan Indonesia Kaya</Text>
				</View>
				<Image style={{height:(140/400)*this.state.dimensions.width,width:(273/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-content-3.png')}/>
			</View>

			<View style={{height:15,backgroundColor:'#fff',borderWidth:0.5,borderLeftWidth:0,borderRightWidth:0,borderColor:'#c46625',marginTop:20,marginBottom:20}}/>

			<View style={{alignItems:'center'}}>
				<Image style={{marginBottom:10,height:(79/400)*this.state.dimensions.width,width:(320/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/logo-gik.png')}/>

				<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Live Streaming</Text>
				<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-line.png')}/>
				<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
					<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Kamu dapat menyaksikan pertunjukan secara langsung</Text>
				</View>
				<Image style={{height:(140/400)*this.state.dimensions.width,width:(286/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-content-4.png')}/>

				<View style={{height:50}}/>

				<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Reservasi</Text>
				<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-line.png')}/>
				<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
					<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Pilih tanggal acara yang ingin kamu saksikan pada kalender acara</Text>
				</View>
				<Image style={{height:(140/400)*this.state.dimensions.width,width:(244/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-content-3.png')}/>

				<View style={{height:50}}/>

				<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Berita, Foto & video</Text>
				<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-line.png')}/>
				<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
					<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Disini kamu dapat menemukan informasi tentang pertunjukan yang ada di Galeri Indonesia Kaya</Text>
				</View>
				<Image style={{height:(140/400)*this.state.dimensions.width,width:(304/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-content-5.png')}/>
			</View>

			<View style={{height:15,backgroundColor:'#fff',borderWidth:0.5,borderLeftWidth:0,borderRightWidth:0,borderColor:'#c46625',marginTop:20,marginBottom:20}}/>

			<View style={{alignItems:'center'}}>
				<Image style={{height:(97/400)*this.state.dimensions.width,width:(320/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/logo-jik.png')}/>

				<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Selamat Datang di Jurnal Indonesia Kaya</Text>
				<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-line.png')}/>
				<View style={{paddingLeft:20,paddingRight:20}}>
					<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Jurnal Indonesia Kaya adalah yang memuat para traveling untuk menuliskan cerita-cerita perjalanan dan berbagi pengalaman-pengalaman seru</Text>
				</View>

				<View style={{height:50}}/>

				<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Beranda</Text>
				<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-line.png')}/>
				<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
					<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Disini kamu dapat melihat cerita dari seluruh member dan kamu dapat berteman sesama member</Text>
				</View>
				<Image style={{height:(140/400)*this.state.dimensions.width,width:(285/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-content-6.png')}/>

				<View style={{height:50}}/>

				<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Jurnal Saya</Text>
				<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-line.png')}/>
				<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
					<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Kamu dapat membuat jurnal berupa artikel, foto & video dan juga bisa melihat jurnal yang berteman dengan kamu</Text>
				</View>
				<Image style={{height:(140/400)*this.state.dimensions.width,width:(251/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../../resource/image/init-content-7.png')}/>
			</View>
		</View>;

		return(
			<View>

				<ScrollView onScroll={this.props.hideBtnOnScroll} style={{backgroundColor:'#eaeaea'}} ref='ScrollView'>
					<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#f0f0f0'}}>
						<View style={{padding:15,paddingTop:0}}>
							<View style={{marginTop:15}}>
								<ComAccordion
									containerStyle={accordionStyle.containerStyle}
									header={this._tabHeading("Tentang IndonesiaKaya.com")}
									headerStyle={accordionStyle.header}
									openCloseIcon={openCloseIcon}
									content={tentangIK}
									contentStyle={accordionStyle.content}
									open_tab={typeof this.props.open_tab != 'undefined' && typeof this.props.open_tab['TENTANG KAMI'] != 'undefined'}
								/>
							</View>
							<View style={{marginTop:15}}>
								<ComAccordion
									containerStyle={accordionStyle.containerStyle}
									header={this._tabHeading("Hubungi Kami")}
									headerStyle={accordionStyle.header}
									openCloseIcon={openCloseIcon}
									content={hubungi}
									contentStyle={accordionStyle.content}
									open_tab={typeof this.props.open_tab != 'undefined' && typeof this.props.open_tab['HUBUNGI KAMI'] != 'undefined'}
								/>
							</View>
							<View style={{marginTop:15}}>
								<ComAccordion
									containerStyle={accordionStyle.containerStyle}
									header={this._tabHeading("Syarat & Ketentuan")}
									headerStyle={accordionStyle.header}
									openCloseIcon={openCloseIcon}
									content={syarat}
									contentStyle={accordionStyle.content}
									open_tab={typeof this.props.open_tab != 'undefined' && typeof this.props.open_tab['SYARAT DAN KETENTUAN'] != 'undefined'}
								/>
							</View>

							<View style={{marginTop:15}}>
								<ComAccordion
									containerStyle={accordionStyle.containerStyle}
									header={this._tabHeading("Panduan")}
									headerStyle={accordionStyle.header}
									openCloseIcon={openCloseIcon}
									content={panduan}
									contentStyle={accordionStyle.content}
									open_tab={typeof this.props.open_tab != 'undefined' && typeof this.props.open_tab['PANDUAN'] != 'undefined'}
								/>
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
