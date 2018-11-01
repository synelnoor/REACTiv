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

import { web_url } from '../../comp/AppConfig';

export default class ItemList extends Component{

	constructor(props){
		super(props);
		this.ismount = false;
		this.state = {
			item:<View/>,
			dimensions:Dimensions.get('window'),
		}
		/*if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	componentDidMount(){
		let dimensions = Dimensions.get('window');
		this.setState({
			item:<View style={{height:(dimensions.width-60),margin:15,marginTop:0,backgroundColor:'#ddd'}}/>,
			dimensions:dimensions,
		},()=>{
			this.ismount = true;
			this._componentDidMount(true);
		});
	}

	componentWillUnmount(){
		this.ismount = false;
	}

	_componentDidMount(first){

		let data = this.props.data;

		if(first){
			var img = data.sorotan_cover;
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
			setTimeout(()=>{
				if(this.ismount){
					Image.prefetch(img);
					//LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
					let nh = h / w * (this.state.dimensions.width-60);
					let nw = this.state.dimensions.width-60;

					let reservation = {};
					this.setState({
						item:
							<View style={{backgroundColor:'#fff',padding:15,margin:15,marginTop:0,}}>
								<TouchableHighlight
									underlayColor='transparent'
									onPress={()=>{
										let imgTitle = [];
										if(data.sorotan_title){
											imgTitle.push(data.sorotan_title);
										}
										if(data.sorotan_by){
											imgTitle.push(data.sorotan_by);
										}
										if(data.date.M){
											imgTitle.push(data.date.M);
										}
										if(data.date.Y){
											imgTitle.push(data.date.Y);
										}
										let newImgTitle = imgTitle.join(' - ');
										Actions.GIKPhotoSlide({
											data:data.data,
											imgSource:data.data[0].photo,
											imgTitle:newImgTitle,
											imgActive:0,
											count_photo:data.data.length,
											download:true,
										});
									}}
								>
									<View>
										<View style={{flexDirection:'row',marginBottom:5}}>
											<Text style={{fontSize:16,color:'#555',flex:1,marginRight:10}}>
												{data.sorotan_title}
											</Text>
											<IonIcon style={{color:'#999',fontSize:20}} name='ios-image-outline'/>
										</View>
										<Text style={{marginBottom:10,fontSize:13,color:'#999'}}>
											{data.date.M} {data.date.Y}
										</Text>
										<View>
											<Image
												style={{
													height:nh,
													width:nw,
												}}
												source={imgplace}
												resizeMode='cover'
											/>
											<View style={{position:'absolute',top:0,bottom:0,left:0,right:0,borderWidth:1,borderColor:'#f0f0f0'}}/>
										</View>
										<Text style={{marginTop:10,fontSize:13,color:'#999'}}>
											{data.sorotan_by}
										</Text>
									</View>
								</TouchableHighlight>
							</View>,
					});


				}
			},1);

		},()=>{
			this._componentDidMount(false);
		});

	}

	render(){
		return(
			this.state.item
		);
	}

}
