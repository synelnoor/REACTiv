// ganti model get image biar bisa offline
import React, { Component } from 'react';
import {
	View,
	Image,
	Dimensions,
	TouchableHighlight,
	Animated,
	Easing
} from 'react-native';

import { web_url } from '../../comp/AppConfig';

export default class ComList extends Component{

	constructor(props){
		super(props);
		this.bgValue = new Animated.Value(0);
		this.state = {
			hw:(Dimensions.get('window').width/3)-15,
			item:<View/>,
		}
	}

	componentDidMount(){
		this._bG();
		const bg = this.bgValue.interpolate({
			inputRange:[0,1,2,3,4],
			outputRange:[
				'rgb(210,210,210)',
				'rgb(220,220,220)',
				'rgb(230,230,230)',
				'rgb(220,230,220)',
				'rgb(210,210,210)',
			]
		});
		let hw = (Dimensions.get('window').width/3)-15;
		this.setState({
			hw:hw,
			item:<Animated.View style={{height:hw,width:hw,margin:5,marginBottom:10,marginTop:0,backgroundColor:bg}}/>
		},()=>{
			this._componentDidMount(true);
		});
	}

	_bG(){
		this.bgValue.setValue(0);
		Animated.timing(
			this.bgValue,{
				toValue:4,
				duration:2000,
				easing:Easing.linear
			}
		).start(()=>this._bG());
	}

	_componentDidMount(first){

		if(first){
			var img = this.props.data.thumb_media_file_url;
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
				let hw = this.state.hw;
				let nw = hw;
				let nh = 0;
				if(first){
					nh = hw;
				}
				else{
					nh = h / w * nw;
				}
				this.setState({
					item:
						<TouchableHighlight underlayColor='transparent'
							style={{height:hw,width:hw,margin:5,marginBottom:10,marginTop:0}}
							onPress={()=>{this.props.showModal(this.props.data.media_file_url,this.props.data.media_title)}}
						>
							<Image
								style={{height:nh,width:nw}}
								source={imgplace}
								resizeMode='cover'
							/>
						</TouchableHighlight>,
				});
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
