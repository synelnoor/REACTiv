// Import dependencies
import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	ScrollView,
	Dimensions,
	TouchableHighlight
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import FooterSM from '../FooterSM';
import IonIcon from 'react-native-vector-icons/Ionicons';

export default class Facilities extends Component {

	constructor(props){
		super(props);
		this.state = {
			dimensions:Dimensions.get('window'),
			ScrollView:this.refs.ScrollView,
			auditorium:false,
			ctFasilitas:[
				{
					title:'Sapa Indonesia',
					content:'Layar multimedia menampilkan pemuda-pemudi Indonesia berbaju adat dari berbagai daerah di nusantara yang menyapa pengunjung.',
					req:require('../../resource/image/fasilitas1.jpg'),
				},
				{
					title:'Video Mapping',
					content:'Video mapping dengan bentuk wayang kulit, menceritakan penggalan-penggalan Mahabarata tentang kiprah Pandawa melawan Kurawa. ',
					req:require('../../resource/image/fasilitas2.jpg'),
				},
				{
					title:'Kaca Pintar Indonesia',
					content:'Merupakan kumpulan objek budaya di seluruh nusantara mulai dari pariwisata, kuliner, kesenian dan tradisi. Dengan tampilan yang menarik diatas layar touch screen. ',
					req:require('../../resource/image/fasilitas3.jpg'),
				},
				{
					title:'Jelajah Indonesia',
					content:'Layar sentuh multimedia yang membahas seluk beluk budaya Indonesia dari banyak sisi, seperti dari sisi geografis, kebiasaan dan asal usul.',
					req:require('../../resource/image/fasilitas4.jpg'),
				},
				{
					title:'Selaras Pakaian Adat',
					content:' Pengunjung dapat berfoto dengan pakaian adat digital dari seluruh nusantara. Aplikasi ini terhubung dengan social media sehingga pengunjung dapat mengunggah fotonya. ',
					req:require('../../resource/image/fasilitas5.jpg'),
				},
				{
					title:' Melodi Alunan Daerah ',
					content:'Berbagai macam alat musik Nusantara telah dihadirkan secara digital dengan bentuk touch screen. Pengunjung dapat bermain dan mengaransemen musiknya sendiri.',
					req:require('../../resource/image/fasilitas6.jpg'),
				},
				{
					title:'Selasar Santai',
					content:'Selasar santai merupakan ruangan dimana pengunjung dapat bersantai menikmati Galeri Indonesia Kaya. Di dalam selasar santai terdapat 10 tablet yang bebas dipakai. ',
					req:require('../../resource/image/fasilitas7.jpg'),
				},
				{
					title:'Ceria Anak Indonesia',
					content:'Pengunjung dapat mencoba bermain permainan tradisional, congklak secara virtual yang diciptakan mirip dengan permainan aslinya. ',
					req:require('../../resource/image/fasilitas8.jpg'),
				},
				{
					title:'Layar Telaah Budaya',
					content:'Berteknologi Microsoft Surface, Layar Telaah Budaya menampilkan informasi budaya secara Interaktif cukup dengan meletakkan kartu dengan obyek budaya yang diinginkan.',
					req:require('../../resource/image/fasilitas9.jpg'),
				},
				{
					title:'Arungi Indonesia',
					content:'Arungi Indonesia menawarkan sensasi terbang diatas Indonesia. Lewati beberapa obyek-obyek penting dan ternama di Indonesia untuk mendapatkan pengetahuan tentang obyek tersebut.',
					req:require('../../resource/image/fasilitas10.jpg'),
				},
				{
					title:'Area Peraga',
					content:'Area peraga merupakan area untuk para pengrajin. Disini, pengrajin dapat memperagakan proses pembuatan berbagai kerajinan khas Indonesia. ',
					req:require('../../resource/image/fasilitas11.jpg'),
				},
				{
					title:'Area Cinderamata',
					content:'Melalui area cinderamata, para pemilik industri yang mengolah hasil budaya Indonesia menjadi produk modern dapat menunjukkan karyanya kepada masyarakat. Para pemilik industri dapat menitipkan produk mereka dengan gratis. ',
					req:require('../../resource/image/fasilitas12.jpg'),
				},
			],
		}
		/*if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	_buildContent(value,index){
		return(
			<TouchableHighlight key={index} underlayColor='#eaeaea' style={{backgroundColor:'#eaeaea',marginBottom:15}}>
				<View>
					<Image
						style={{
							width:this.state.dimensions.width-30,
							height:(600/600)*(this.state.dimensions.width-30),
						}}
						source={value.req}
						resizeMode='cover'
					/>
					<View style={{padding:15,paddingBottom:30}}>
						<Image style={{position:'absolute',height:(51/400)*this.state.dimensions.width,width:(199/682.6666666666666)*this.state.dimensions.height,bottom:0,left:0}} resizeMode='cover' source={require('../../resource/image/facility-left.png')}/>
						<Image style={{position:'absolute',height:(56/400)*this.state.dimensions.width,width:(87/682.6666666666666)*this.state.dimensions.height,bottom:0,right:0}} resizeMode='cover' source={require('../../resource/image/facility-right.png')}/>
						<View style={{position:'absolute',bottom:0,left:0,right:0,height:2,backgroundColor:'#c59d6c'}}/>
						<View style={{flexDirection:'row'}}>
							<View>
								<Text style={{color:'#c29c6d',fontSize:13,fontWeight:'bold'}}>{value.title}</Text>
								<View style={{flexDirection:'row'}}>
									<View style={{marginTop:5,backgroundColor:'#999',height:0.5,flex:1}}/>
									<View style={{marginTop:5,backgroundColor:'transparent',height:0.5,flex:1}}/>
								</View>
							</View>
						</View>
						<Text style={{color:'#898989',fontSize:13,lineHeight:22}}>{value.content}</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
	}

    componentDidMount(){
		this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView},()=>{
			Actions.refresh({key:'GIKdrawer',open:value=>false});
		});
    }

	_auditorium(){
		this.setState({auditorium:!this.state.auditorium});
	}

	render(){
		let ico = <IonIcon style={{color:'#aaa',fontSize:20}} name='ios-arrow-down-outline'/>;
		if(this.state.auditorium){
			ico = <IonIcon style={{color:'#aaa',fontSize:20}} name='ios-arrow-up-outline'/>
		}
		return(
			<View>

				<ScrollView onScroll={this.props.hideBtnOnScroll} style={{backgroundColor:'#eaeaea'}} ref='ScrollView'>
					<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#fafafa'}}>

						<View style={{flexDirection:'row',margin:15}}>
							<View style={{flex:5}}>
								<View style={{flexDirection:'row'}}>
									<Text style={{fontSize:16}}>
										Fasilitas
									</Text>
								</View>
								<View style={{height:1,alignSelf:'stretch',flexDirection:'row',marginTop:5}}>
									<View style={{backgroundColor:'#ddd',height:1,alignSelf:'stretch',flex:1,}}></View>
								</View>
							</View>
						</View>

						<Image
							style={{
								width:this.state.dimensions.width,
								height:(542/1290)*this.state.dimensions.width,
							}}
							source={require('../../resource/image/fasilitas0.jpg')}
							resizeMode='cover'
						/>

						<TouchableHighlight underlayColor='#4e2f18' onPress={()=>{/*LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);*/this._auditorium()}}>
							<View style={{backgroundColor:'#4e2f18',padding:15}}>
								<View style={{flexDirection:'row'}}>
									<View>
										<Text style={{color:'#fff',fontSize:13,fontWeight:'bold'}}>Auditorium</Text>
										<View style={{flexDirection:'row'}}>
											<View style={{marginTop:5,backgroundColor:'#cb6d2b',height:1,flex:1}}/>
											<View style={{marginTop:5,backgroundColor:'transparent',height:1,flex:1}}/>
										</View>
									</View>
								</View>
								<Text style={{color:'#fff',fontSize:13,lineHeight:22}} numberOfLines={this.state.auditorium ? 0 : 3}>Galeri Indonesia Kaya dilengkapi dengan auditorium berkapasitas 150 orang, lengkap dengan panggung sebesar 13x3m dengan tiga buah screen dilengkapi projector utama 10.000 lumens dan projector pendukung 7.000 lumens, sound system dengan audio power mencapai 5000watt, disertai dengan empat buah moving LED diatas panggung dan tata lampu LED berjumlah 36 buah yang menghasilkan efek dramatis. Saat tidak ada pertunjukan yang berlangsung, pengunjung masih dapat menikmati menari tarian daerah dengan Fantasi Tari Indonesia. Beberapa tarian khas nusantara yang dikemas virtual membuat pengunjung dapat seakan-akan menari bersama dengan mereka.</Text>
								<View style={{marginTop:15,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>{ico}</View>
							</View>
						</TouchableHighlight>

						<View style={{padding:15,paddingBottom:0}}>
							{this.state.ctFasilitas.map(
								(v,i)=>(
									this._buildContent(v,i)
								)
							)}
						</View>

					</View>
					<FooterSM ScrollView={this.state.ScrollView}/>
				</ScrollView>
				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

			</View>
		);
	}

}
