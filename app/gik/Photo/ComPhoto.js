// ganti model get image biar bisa offline
import React, { Component } from 'react';
import {
	View,
	Image,
	Dimensions,
	TouchableHighlight
} from 'react-native';

import { web_url } from '../../comp/AppConfig';

export default class ComPhoto extends Component{

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

			let bt = ((this.state.dimensions.width-20)/3);
			let style1 = {
				padding:1,
				height:bt,
				width:bt,
			}
			let style2 = {
				height:bt-2,
				width:bt-2,
			}
			if(parseInt(this.props.loop_row) === 3){
				bt = bt*2;
				style1.height = bt;
				style1.width = bt;
				style2.height = bt-2;
				style2.width = bt-2;
			}
			if(parseInt(this.props.loop_row) === 5){
				style1.position = 'absolute';
				style1.right = 10;
				style1.top = (bt*this.props.loop_hrow);
			}

			this.setState({
				item:
					<TouchableHighlight
						underlayColor='transparent'
						style={style1}
						onPress={()=>{this.props.showModal(this.props.data.media_file_url,this.props.data.media_title)}}
					>
						<Image
							style={style2}
							source={imgplace}
							resizeMode='cover'
						/>
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
