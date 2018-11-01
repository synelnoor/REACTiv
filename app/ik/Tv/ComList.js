// ganti model get image biar bisa offline
import React, { Component } from 'react';
import {
	View,
	Image,
	Dimensions,
	Text,
	TouchableHighlight,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import { web_url } from '../../comp/AppConfig';

export default class ComGrid extends Component{

	constructor(props){
		super(props);
		this.state = {
			dimensions:Dimensions.get('window'),
			item:<View/>,
		}
	}

	componentDidMount(){
		this.setState({
			dimensions:Dimensions.get('window'),
		},()=>{
			this._componentDidMount(true);
		});
	}

	_componentDidMount(first){
		if(first){
			var img = 'https://img.youtube.com/vi/'+this.props.data.video_cover+'/mqdefault.jpg';
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
			var nh = h / w * ((this.state.dimensions.width/2)-20);
			var nw = (this.state.dimensions.width/2)-20;
			this.setState({
				item:
					<TouchableHighlight
						underlayColor='transparent'
						style={{
							height:nh+80,
							margin:7.5,
							marginTop:0,
							marginBottom:0,
							width:(this.state.dimensions.width/2)-20,
						}}
						onPress={()=>Actions.IKVideoDetail({video:this.props.data})}
					>
						<View>
							<Image
								style={{
									height:nh,
									width:nw,
								}}
								source={imgplace}
								resizeMode='cover'
							/>
							<Text style={{marginTop:5}} numberOfLines={3}>{this.props.data.video_title}</Text>
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
