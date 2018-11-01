// ganti model get image biar bisa offline
import React, { Component } from 'react';
import {
	View,
	Image,
	Dimensions,
	Text,
	TouchableHighlight
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import IonIcon from 'react-native-vector-icons/Ionicons';

import { web_url } from './AppConfig';

export default class ItemListFirst extends Component{

	constructor(props){
		super(props);
		this.ismount = false;
		this.state = {
			dimensions:Dimensions.get('window'),
			item:<View/>,
		}
		/*if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	_Actions(goto,data){
		if(typeof this.props.from !== 'undefined' && this.props.from === 'ik'){
			if(goto === 'articledetail' && typeof this.props.data.article_detail !== 'undefined' && this.props.data.article_detail){
				this.props.data.from = this.props.from;
				return ()=>Actions.IKArticleDetail(this.props.data);
			}
			else if(goto === 'articlelist'){
				return ()=>Actions.IKArticleList(data);
			}
			else if(goto === 'photoalbum'){
				return ()=> Actions.IKPhotoAlbum({data:this.props.data});
			}
			else if(goto === 'videodetail'){
				return ()=>Actions.IKVideoDetail(this.props.data);
			}
			else if(goto === 'reservation' && typeof this.props.showModal !== 'undefined'){
				let calendar = this.props.data.calendar;
				return ()=>this.props.showModal({
					'id':calendar.calendar_id,
					'title':calendar.calendar,
					'day':calendar.d,
					'month':calendar.m.ind,
				});
			}
			else{
				return ()=>{};
			}
		}
		else{
			if(goto === 'articledetail' && typeof this.props.data.article_detail !== 'undefined' && this.props.data.article_detail){
				this.props.data.from = this.props.from;
				return ()=>Actions.GIKArticleDetail(this.props.data);
			}
			else if(goto === 'articlelist'){
				return ()=>Actions.GIKArticleList(data);
			}
			else if(goto === 'photoalbum'){
				return ()=> Actions.GIKPhotoAlbum({data:this.props.data});
			}
			else if(goto === 'videodetail'){
				return ()=>Actions.GIKVideoDetail(this.props.data);
			}
			else if(goto === 'reservation' && typeof this.props.showModal !== 'undefined'){
				let calendar = this.props.data.calendar;
				return ()=>this.props.showModal({
					'id':calendar.calendar_id,
					'title':calendar.calendar,
					'day':calendar.d,
					'month':calendar.m.ind,
				});
			}
			else{
				return ()=>{};
			}
		}
	}

	componentDidMount(){
		this.setState({
			dimensions:Dimensions.get('window'),
		},()=>{
			this.ismount = true;
			this._componentDidMount(true);
		});
	}

	componentWillUnmount(){
		this.ismount = false;
	}

	_componentDidMount(first){

		if(first){
			var img = this.props.data.cover_url;
			var imgplace = {uri:img};
		}
		else{
			var img = web_url;
			if(typeof this.props.from !== 'undefined' && this.props.from === 'ik'){
				img += 'assets/image/logo-ik.png';
			}
			else{
				img += 'assets/image/gik/logo-gik.png';
			}
			var imgplace = {uri:img};
		}
		Image.getSize(img,(w,h)=>{
			if(this.ismount){
				Image.prefetch(img);
				//LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
				let nh = h / w * (this.state.dimensions.width-30);
				let nw = this.state.dimensions.width-30;
				let reservation = this._getReservation();
				this.setState({
					item:
						<View style={{backgroundColor:'#fff',margin:15}}>
							<TouchableHighlight
								underlayColor='transparent'
								onPress={this._Actions('articledetail')}
							>
								<View style={{flexDirection:'row'}}>
									<Image
										style={{
											flex:1,
											height:nh,
											width:nw,
										}}
										source={imgplace}
										resizeMode='cover'
									/>
								</View>
							</TouchableHighlight>
							<TouchableHighlight
								underlayColor='transparent'
								onPress={this._Actions('articledetail')}
							>
								<View style={{padding:15}}>
									<Image style={{position:'absolute',height:(51/400)*this.state.dimensions.width,width:(199/682.6666666666666)*this.state.dimensions.height,bottom:0,left:0}} resizeMode='cover' source={require('../resource/image/facility-left.png')}/>
									<Image style={{position:'absolute',height:(56/400)*this.state.dimensions.width,width:(87/682.6666666666666)*this.state.dimensions.height,bottom:0,right:0}} resizeMode='cover' source={require('../resource/image/facility-right.png')}/>
									<View style={{flexDirection:'row'}}>
										<View>
											<Text style={{color:'#c29c6d',fontSize:13,fontWeight:'bold'}}>{this.props.data.title}</Text>
											<View style={{flexDirection:'row'}}>
												<View style={{marginTop:5,backgroundColor:'#999',height:0.5,flex:1}}/>
												<View style={{marginTop:5,backgroundColor:'transparent',height:0.5,flex:1}}/>
											</View>
										</View>
									</View>
									<Text style={{color:'#898989',fontSize:13,lineHeight:22}}>{this.props.data.summary}</Text>
								</View>
							</TouchableHighlight>
							<View style={{flexDirection:'row'}}>
								<TouchableHighlight
									underlayColor='#b76329'
									onPress={this._Actions('articledetail')}
									style={{flexDirection:'row',flex:1,height:this.state.dimensions.width/10,backgroundColor:'#b76329',}}
								>
									<IonIcon style={{alignSelf:'center',flex:1,textAlign:'center',color:'#fff',fontSize:25}} name='md-paper'/>
								</TouchableHighlight>
								<TouchableHighlight
									underlayColor={reservation.bc}
									onPress={reservation.action}
									style={{flexDirection:'row',flex:1,height:this.state.dimensions.width/10,backgroundColor:reservation.bc,}}
								>
									<IonIcon style={{alignSelf:'center',flex:1,textAlign:'center',color:'#fff',fontSize:25}} name='md-calendar'/>
								</TouchableHighlight>
							</View>

						</View>,
				});
			}
		},()=>{
			this._componentDidMount(false);
		});

	}

	_getReservation(){
		var rtn = {
			action:this._Actions('reservation'),
			bc:'#a34828',
		}
		if(this.props.data.calendar == null){
			rtn.action = ()=>{};
			rtn.bc = '#bbb';
		}
		return rtn;
	}

	render(){
		return(
			this.state.item
		);
	}

}
