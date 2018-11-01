import React, { Component } from 'react';
import {
	View,
	Image,
	Text,
	Dimensions,
	TouchableHighlight,
	//ScrollView,
	//Platform,
	//UIManager,
	//LayoutAnimation,
	//AsyncStorage
} from 'react-native';
import Swiper from 'react-native-swiper';
import {Actions} from 'react-native-router-flux';

import ComLocalStorage from './ComLocalStorage';

var swiperDot = {
	width:5,
	height:5,
	margin:5,
	marginTop:0,
	marginBottom:0,
	padding:0,
	borderRadius:5,
}

export default class IntroPage extends Component{

	constructor(props){
		super(props);
		//ComLocalStorage.removeItem('intropage','ik_intro',()=>{});
		//ComLocalStorage.removeItem('intropage','gik_intro',()=>{});
		//ComLocalStorage.removeItem('intropage','jik_intro',()=>{});
		this.state = {
			dimensions:Dimensions.get('window'),
			from:this.props.from,
			comp:<View style={{position:'absolute',top:0,bottom:0,left:0,right:0,zIndex:600,backgroundColor:'#fff'}}/>,
		}
		/*if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	componentDidMount(){

		let dimensions = Dimensions.get('window');
		this.setState({
			dimensions:dimensions,
		},()=>{

			let comp = this.state.comp;

			let LocalStorage = new ComLocalStorage();

			LocalStorage.getItemByKey('@intropage:'+this.state.from+'_intro',(e)=>{

				if(e === null){
					let note = <View/>;
					if(this.state.from === 'ik'){
						note = <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
							<Image style={{height:(73/400)*this.state.dimensions.width,width:(320/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/logo-ik.png')}/>
							<Swiper
								paginationStyle={{bottom:0}}
								height={(360/400)*this.state.dimensions.width}
								width={this.state.dimensions.width}
								style={{margin:0,padding:0}}
								dot={this._swiperDotInactive()}
								activeDot={this._swiperDotActive()}
								loop={false}
							>
								<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',height:(330/400)*this.state.dimensions.width,width:this.state.dimensions.width}}>
									<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Selamat Datang di Indonesia Kaya</Text>
									<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-line.png')}/>
									<View style={{paddingLeft:20,paddingRight:20}}>
										<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Indonesia Kaya merupakan informasi tentang kebudayaan yang terdapat di Indonesia yang bertujuan memperkenalkan :</Text>
										<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Kesenian, Tradisi, Pariwisata, Kuliner {'\n'} secara rinci yang dimiliki Indonesia dalam bentuk {'\n'} artikel, foto dan video</Text>
									</View>
								</View>
								<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',height:(330/400)*this.state.dimensions.width,width:this.state.dimensions.width}}>
									<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Jelajah Indonesia</Text>
									<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-line.png')}/>
									<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
										<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Disini kamu dapat informasi tentang Kesenian, Tradisi, Pariwisata, Kuliner yang ada diseluruh Indonesia</Text>
									</View>
									<Image style={{height:(140/400)*this.state.dimensions.width,width:(347/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-content-1.png')}/>
								</View>
								<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',height:(330/400)*this.state.dimensions.width,width:this.state.dimensions.width}}>
									<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Jendela Indonesia</Text>
									<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-line.png')}/>
									<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
										<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Pada halaman ini akan memuat cerita dari para tokoh Inspiratif, Pojok Editorial, Agenda Budaya dan Liputan Budaya</Text>
									</View>
									<Image style={{height:(140/400)*this.state.dimensions.width,width:(244/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-content-2.png')}/>
								</View>
								<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',height:(330/400)*this.state.dimensions.width,width:this.state.dimensions.width}}>
									<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Kegiatan</Text>
									<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-line.png')}/>
									<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
										<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Pilih tanggal acara yang ingin kamu saksikan pada kalendar kegiatan Indonesia Kaya</Text>
									</View>
									<Image style={{height:(140/400)*this.state.dimensions.width,width:(273/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-content-3.png')}/>
								</View>
							</Swiper>
							<TouchableHighlight
								underlayColor='transparent'
								style={{marginTop:10}}
								onPress={()=>{
									this._setIntro('ik_intro');
									Actions.IKdrawer({type: 'replace'});
								}}
							>
								<Text style={{textAlign:'center',marginTop:20,padding:20,paddingBottom:0,fontSize:15,color:'#aaa'}}>SELESAI</Text>
							</TouchableHighlight>
						</View>
						;
					}
					else if(this.state.from === 'gik'){
						note = <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
							<Image style={{height:(79/400)*this.state.dimensions.width,width:(320/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/logo-gik.png')}/>
							<Swiper
								paginationStyle={{bottom:0}}
								height={(360/400)*this.state.dimensions.width}
								width={this.state.dimensions.width}
								style={{margin:0,padding:0}}
								dot={this._swiperDotInactive()}
								activeDot={this._swiperDotActive()}
								loop={false}
							>
								<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',height:(330/400)*this.state.dimensions.width,width:this.state.dimensions.width}}>
									<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Selamat Datang di Galeri Indonesia Kaya</Text>
									<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-line.png')}/>
									<View style={{paddingLeft:20,paddingRight:20}}>
										<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Galeri Indonesia Kaya merupakan sebuah ruang edutainment budaya berbasis teknologi digital yang menampilkan ragam kebudayaan nusantara</Text>
										<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Dan menjadi ruang untuk menyalurkan kreatifitas generasi muda dalam lingkup budaya</Text>
									</View>
								</View>
								<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',height:(330/400)*this.state.dimensions.width,width:this.state.dimensions.width}}>
									<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Live Streaming</Text>
									<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-line.png')}/>
									<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
										<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Kamu dapat menyaksikan pertunjukan secara langsung</Text>
									</View>
									<Image style={{height:(140/400)*this.state.dimensions.width,width:(286/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-content-4.png')}/>
								</View>
								<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',height:(330/400)*this.state.dimensions.width,width:this.state.dimensions.width}}>
									<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Reservasi</Text>
									<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-line.png')}/>
									<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
										<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Pilih tanggal acara yang ingin kamu saksikan pada kalender acara</Text>
									</View>
									<Image style={{height:(140/400)*this.state.dimensions.width,width:(244/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-content-3.png')}/>
								</View>
								<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',height:(330/400)*this.state.dimensions.width,width:this.state.dimensions.width}}>
									<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Berita, Foto & video</Text>
									<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-line.png')}/>
									<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
										<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Disini kamu dapat menemukan informasi tentang pertunjukan yang ada di Galeri Indonesia Kaya</Text>
									</View>
									<Image style={{height:(140/400)*this.state.dimensions.width,width:(304/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-content-5.png')}/>
								</View>
							</Swiper>
							<TouchableHighlight
								underlayColor='transparent'
								style={{marginTop:10}}
								onPress={()=>{
									this._setIntro('gik_intro');
									Actions.GIKdrawer({type: 'replace'});
								}}
							>
								<Text style={{textAlign:'center',marginTop:20,padding:20,paddingBottom:0,fontSize:15,color:'#aaa'}}>SELESAI</Text>
							</TouchableHighlight>
						</View>
						;
					}
					else{
						note = <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
							<Image style={{height:(97/400)*this.state.dimensions.width,width:(320/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/logo-jik.png')}/>
							<Swiper
								paginationStyle={{bottom:0}}
								height={(360/400)*this.state.dimensions.width}
								width={this.state.dimensions.width}
								style={{margin:0,padding:0}}
								dot={this._swiperDotInactive()}
								activeDot={this._swiperDotActive()}
								loop={false}
							>
								<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',height:(330/400)*this.state.dimensions.width,width:this.state.dimensions.width}}>
									<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Selamat Datang di Jurnal Indonesia Kaya</Text>
									<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-line.png')}/>
									<View style={{paddingLeft:20,paddingRight:20}}>
										<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Jurnal Indonesia Kaya adalah yang memuat para traveling untuk menuliskan cerita-cerita perjalanan dan berbagi pengalaman-pengalaman seru</Text>
									</View>
								</View>
								<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',height:(330/400)*this.state.dimensions.width,width:this.state.dimensions.width}}>
									<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Beranda</Text>
									<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-line.png')}/>
									<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
										<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Disini kamu dapat melihat cerita dari seluruh member dan kamu dapat berteman sesama member</Text>
									</View>
									<Image style={{height:(140/400)*this.state.dimensions.width,width:(285/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-content-6.png')}/>
								</View>
								<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',height:(330/400)*this.state.dimensions.width,width:this.state.dimensions.width}}>
									<Text style={{marginBottom:20,fontSize:16,color:'#502e12'}}>Jurnal Saya</Text>
									<Image style={{marginBottom:20,height:(15/400)*this.state.dimensions.width,width:(113/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-line.png')}/>
									<View style={{marginBottom:20,paddingLeft:20,paddingRight:20}}>
										<Text style={{textAlign:'center',fontSize:13,lineHeight:25,color:'#502e12'}}>Kamu dapat membuat jurnal berupa artikel, foto & video dan juga bisa melihat jurnal yang berteman dengan kamu</Text>
									</View>
									<Image style={{height:(140/400)*this.state.dimensions.width,width:(251/682.6666666666666)*this.state.dimensions.height}} resizeMode='contain' source={require('../resource/image/init-content-7.png')}/>
								</View>
							</Swiper>
							<TouchableHighlight
								underlayColor='transparent'
								style={{marginTop:10}}
								onPress={()=>{
									this._setIntro('jik_intro');
									Actions.JIKdrawer({type: 'replace'});
								}}
							>
								<Text style={{textAlign:'center',marginTop:20,padding:20,paddingBottom:0,fontSize:15,color:'#aaa'}}>SELESAI</Text>
							</TouchableHighlight>
						</View>
						;
					}
					//LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
					comp = <View style={{position:'absolute',top:0,bottom:0,left:0,right:0,zIndex:600,backgroundColor:'rgba(255,255,255,0.975)'}}>
						<Image style={{position:'absolute',height:this.state.dimensions.height,width:this.state.dimensions.width,top:0,bottom:0,left:0,right:0}} resizeMode='contain' source={require('../resource/image/init-dot.png')}/>
						<Image style={{position:'absolute',height:(53/400)*this.state.dimensions.width,width:(210/682.6666666666666)*this.state.dimensions.height,top:0,left:0}} resizeMode='contain' source={require('../resource/image/init-top-left.png')}/>
						<Image style={{position:'absolute',height:(30/400)*this.state.dimensions.width,width:(73/682.6666666666666)*this.state.dimensions.height,top:0,right:0}} resizeMode='contain' source={require('../resource/image/init-top-right.png')}/>
						<Image style={{position:'absolute',height:(34/400)*this.state.dimensions.width,width:(70/682.6666666666666)*this.state.dimensions.height,bottom:0,left:0}} resizeMode='contain' source={require('../resource/image/init-bottom-left.png')}/>
						<Image style={{position:'absolute',height:(72/400)*this.state.dimensions.width,width:(100/682.6666666666666)*this.state.dimensions.height,bottom:0,right:0}} resizeMode='contain' source={require('../resource/image/init-bottom-right.png')}/>
						<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',position:'absolute',top:30,bottom:30,left:0,right:0}}>
							{note}
						</View>
					</View>
					;
				}
				else{
					comp = <View/>;
				}

				this.setState({
					comp:comp,
				});

			});

		});

	}

	_swiperDotInactive(){
		return(
			<View style={[swiperDot,{backgroundColor:'#818181'}]}/>
		);
	}

	_swiperDotActive(){
		return(
			<View style={[swiperDot,{backgroundColor:'#c26526'}]}/>
		);
	}

	_setIntro(from){
		let dimensions = this.state.dimensions;
		ComLocalStorage.setItem('intropage',from,'1',()=>{
			//LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
			// this.setState({
			// 	comp:<View/>,
			// });
		});
	}

	render(){
		return(this.state.comp);
	}

}
