// ganti model get image biar bisa offline
import React, { Component } from 'react';
import {
	View,
	Image,
	Text,
	TouchableHighlight,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { web_url } from './AppConfig';

export default class SlideSorotanChild extends Component{

	constructor(props){
		super(props);
		let dimensions = this.props.dimensions;
		this.state = {
			dimensions:dimensions,
			item:<View style={{height:dimensions.height,backgroundColor:'#ccc'}}/>,
		}
	}

	componentDidMount(){
		let dimensions = this.props.dimensions;
		this.setState({
			dimensions:dimensions,
			item:<View style={{height:266/400*dimensions.width,backgroundColor:'#ccc'}}/>,
		},()=>{
			this._buildItem(true);
		});
	}

	_buildItem(first){

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

			var nh = h / w * this.state.dimensions.width;
			var nw = this.state.dimensions.width;

			this.setState({
				item:
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
						<Image
						style={{
							height:nh,
							width:nw,
						}}
							source={imgplace}
							resizeMode='cover'
						/>
						<View style={{position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:'rgba(0,0,0,0.5)',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
							<Text style={{color:'#fff'}}>{data.sorotan_title}</Text>
							<View style={{height:0.5,width:30,backgroundColor:'#fff',marginTop:5,marginBottom:5}}/>
							<Text style={{color:'#fff'}}>{data.sorotan_by}</Text>
						</View>
					</View>
				</TouchableHighlight>,
			});

		},()=>{
			this._buildItem(false);
		});

	}

	render(){
		return this.state.item;
	}

}
