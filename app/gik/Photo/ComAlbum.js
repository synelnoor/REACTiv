// ganti model get image biar bisa offline
import React, { Component } from 'react';
import {
	View,
	Image,
	Dimensions,
	TouchableHighlight,
	Text,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { web_url } from '../../comp/AppConfig';

export default class ComAlbum extends Component{

	constructor(props){
		super(props);
		this.state = {
			hw:((Dimensions.get('window').width/2)-20),
			item:<View/>,
		}
	}

	componentDidMount(){
		this.setState({
			hw:((Dimensions.get('window').width/2)-20),
		},()=>{
			this._componentDidMount(true);
		});
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

			let hw = this.state.hw;

			let nh = 0;
			if(first){
				nh = hw;
			}
			else{
				nh = h / w * (hw);
			}

			this.setState({
				item:
					<TouchableHighlight
						underlayColor='transparent'
						style={{
							margin:5,
							marginTop:0,
							marginBottom:15,
							width:hw,
							height:hw+100,
							backgroundColor:'#fff'
						}}
						onPress={()=>{Actions.GIKPhotoAlbum(this.props)}}
					>
						<View>
							<Image
								style={{
									height:nh,
									width:hw,
								}}
								source={imgplace}
								resizeMode='cover'
							>
								<View style={{position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:'rgba(0,0,0,0.25)',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
									<IonIcon name='ios-albums-outline' style={{color:'#fff',fontSize:23,marginRight:10}}/>
									<Text style={{color:'#fff'}}>{this.props.data.foto.count_photo}</Text>
								</View>
							</Image>
							<View
								style={{
									padding:10,
								}}
							>
								<Text numberOfLines={4}>
									 {this.props.data.gallery_title}
								</Text>
							</View>
						</View>
					</TouchableHighlight>,
			});

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
