import React, { Component } from 'react';
import {
	View,
	Image,
	Dimensions,
	ScrollView,
	CameraRoll,
	TouchableHighlight,
	Text,
	Platform,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import PhotoView from 'react-native-photo-view';
import Swiper from 'react-native-swiper';
import RNFS from 'react-native-fs';
import { Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';

const multiPressDelay = 750;

export default class PhotoSlide extends Component{

	constructor(props){
		super(props);
		this.state = {
			nh:Dimensions.get('window').width/5.5,
			imgActive:parseInt(this.props.imgActive),
			imgTitle:this.props.imgTitle,
			imgCount:this.props.count_photo,
			downloadRun:false,
			downloadStatus:'loading',
		}
	}

	componentDidMount(){
		this.setState({nh:Dimensions.get('window').width/5.5},()=>{
			setTimeout(()=>{
				this._scrollToX(this.state.imgActive);
			},10);
		});
	}

	_scrollToX(i){
		let ScrollView = this.refs.ScrollView;
		if(typeof ScrollView !== 'undefined' && ScrollView !== ''){
			ScrollView.scrollTo({x:(this.state.nh*i),y:0,animated:true});
		}
	}

	_changeModal(i){
		i = parseInt(i);
		let imgActive = parseInt(this.state.imgActive);
		let a = imgActive - i;
		if(imgActive > i){
			a = -Math.abs(a);
		}
		else{
			a = Math.abs(a);
		}
		this.refs.Swiper.scrollBy(a);
	}

	_onMomentumScrollEnd(e){
		if(typeof e !== 'undefined' && typeof e.index !== 'undefined'){
			let i = e.index;
			let data = this.props.data[i];
			let imgTitle = this.state.imgTitle;
			if(data.media_title){
				imgTitle = data.media_title;
			}
			this.setState({
				imgActive:i,
				imgTitle:imgTitle,
			},()=>{
				this._scrollToX(i);
			});
		}
	}

	_downloadPress(){

		const now = new Date().getTime();
		if(this.timePress && (now-this.timePress) < multiPressDelay){
			delete this.timePress;
		}
		else{

			this.timePress = now;

			if(!this.state.downloadRun){

				this.setState({downloadRun:true,downloadStatus:'loading'},()=>{

					let folderName = 'Indonesiakaya';
					RNFS.mkdir(RNFS.ExternalStorageDirectoryPath+'/'+folderName);

					let fnm = (this.props.data[this.state.imgActive].media_file).toLowerCase();
					let ext = fnm.substr(fnm.lastIndexOf('.')+1);

					let fromUrl = this.props.data[this.state.imgActive].media_file_url;
					let toFile = RNFS.ExternalStorageDirectoryPath+'/'+folderName+'/'+this.state.imgTitle+' - '+this.state.imgActive+'.'+ext;

					const RNFSdownloadFile = RNFS.downloadFile({fromUrl:fromUrl,toFile:toFile});

					RNFSdownloadFile.promise.then((r)=>{
						if(r.statusCode === 200){
							this.setState({downloadStatus:'success'});
						}
						else{
							this.setState({downloadStatus:'failed'});
						}
					});

				});

			}

		}

	}

	_downloadDone(){
		this.setState({downloadRun:false,downloadStatus:'loading'});
	}

	_setPhoto(){
		let data = this.props;
		if(data !== null && data.count_photo > 0){

			let loop = data.data;
			let swiper = [];
			for(var i in loop){
				if(
					typeof loop[i] !== 'undefined' &&
					typeof loop[i].thumb_media_file_url !== 'undefined'
				){
					swiper.push(
						(Platform.OS === 'ios') ?
						<Image
							style={{height:'100%',width:'100%'}}
							source={{uri:loop[i].media_file_url}}
							key={i}
							resizeMode='cover'
						/> :
						<PhotoView
							source={{uri:loop[i].media_file_url}}
							minimumZoomScale={1}
							maximumZoomScale={5}
							androidScaleType='fitCenter'
							scale={1}
							style={{flex:1}}
							key={i}
						/>
					);
				}
			}

			let download = <View/>;
			if(typeof this.props.download !== 'undefined' && this.props.download){
				download = <TouchableHighlight underlayColor='transparent' style={{position:'absolute',height:50,width:50,flexDirection:'row',right:0,top:0,zIndex:10}} onPress={()=>this._downloadPress()}>
						<IonIcon style={{alignSelf:'center',flex:1,textAlign:'center',color:'#fff',fontSize:25}} name='ios-download-outline'/>
					</TouchableHighlight>
			}

			let loader = <View/>;
			let downloadStatus = <View/>;
			if(this.state.downloadStatus === 'success'){
				downloadStatus =
				<TouchableHighlight underlayColor='transparent' onPress={()=>this._downloadDone()}>
					<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
						<IonIcon style={{color:'#b76329',fontSize:60}} name='ios-checkmark-circle-outline'/>
						<Text style={{textAlign:'center',color:'#fff',marginTop:20}}>Proses unduh berhasil</Text>
					</View>
				</TouchableHighlight>
			}
			else if(this.state.downloadStatus === 'failed'){
				downloadStatus =
				<TouchableHighlight underlayColor='transparent' onPress={()=>this._downloadDone()}>
					<View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
						<IonIcon style={{color:'#f00',fontSize:60}} name='ios-close-circle-outline'/>
						<Text style={{textAlign:'center',color:'#fff',marginTop:20}}>Proses unduh gagal</Text>
					</View>
				</TouchableHighlight>
				;
			}
			else{
				downloadStatus =
				<View>
					<Spinner/>
					<Text style={{textAlign:'center',color:'#fff'}}>Proses unduh dimulai</Text>
				</View>
				;
			}
			if(this.state.downloadRun){
				loader = <View style={{position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:'rgba(0,0,0,0.9)',flexDirection:'row',justifyContent:'center',alignItems:'center',zIndex:11}}>{downloadStatus}</View>;
			}

			return(
				<View style={{flex:1,backgroundColor:'#000'}}>
					<TouchableHighlight underlayColor='transparent' style={{position:'absolute',height:50,width:50,flexDirection:'row',left:0,top:0,zIndex:10}} onPress={()=>Actions.pop()}>
						<IonIcon style={{alignSelf:'center',flex:1,textAlign:'center',color:'#fff',fontSize:40}} name='ios-close-outline'/>
					</TouchableHighlight>
					{download}
					<Text style={{position:'absolute',top:50,left:0,right:0,textAlign:'center',padding:15,color:'#fff',zIndex:9}}>{this.state.imgTitle}</Text>
					<View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
						<Swiper
							ref='Swiper'
							showsPagination={false}
							loop={false}
							autoplay={false}
							dot={<View/>}
							activeDot={<View/>}
							style={{flex:1}}
							index={this.state.imgActive}
							onMomentumScrollEnd={(q,w)=>{this._onMomentumScrollEnd(w);}}
						>
							{swiper}
						</Swiper>
					</View>
					<View>
						{this._scrollView(loop)}
					</View>
					{loader}
				</View>
			);

		}
		else{
			Actions.pop();
		}
	}

	_scrollView(data){
		return(
			<View style={{height:this.state.nh,backgroundColor:'#000'}}>
				<ScrollView horizontal={true} style={{height:this.state.nh}} ref='ScrollView'>
					{this._buildPhoto(data)}
				</ScrollView>
			</View>
		);
	}

	_buildPhoto(data){

		let rtrn = new Array();

		for(var i in data){
			let a = i;
			if(
				typeof data[i] !== 'undefined' &&
				typeof data[i].thumb_media_file_url !== 'undefined'
			){
				let img = data[i].thumb_media_file_url;
				Image.prefetch(img);
				let uri = {uri:img};
				let action = ()=>this._changeModal(a);
				let border = {};
				if(parseInt(i) === parseInt(this.state.imgActive)){
					border.borderWidth = 1;
					border.borderColor = '#d06c2a';
				}
				rtrn.push(
					<TouchableHighlight underlayColor='transparent' key={i} style={{height:this.state.nh,width:this.state.nh,marginRight:1}} onPress={action}>
						<View>
							<Image style={{height:this.state.nh,width:this.state.nh}} source={uri} resizeMode='cover'/>
							<View style={[{position:'absolute',top:0,bottom:0,left:0,right:0},border]}/>
						</View>
					</TouchableHighlight>
				);
			}
		}

		return rtrn;

	}

	render(){
		return(
			this._setPhoto()
		);
	}

}
