import React, { Component } from 'react';
import {
	View,
	Image,
	Dimensions,
	ScrollView,
	TouchableHighlight,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class ComPhoto extends Component{

	constructor(props){
		super(props);
	}

	_scrollToX(nh,i){
		let ScrollView = this.refs.ScrollView;
		if(typeof ScrollView !== 'undefined' && ScrollView !== ''){
			ScrollView.scrollTo({x:(nh*i),y:0,animated:true});
		}
	}

	_showModal(img,title,i,nh){
		this._scrollToX(nh,i);
		let data = this.props.data;
		data.imgSource = img;
		data.imgTitle = title;
		data.imgActive = i;
		Actions.IKPhotoSlide(data);
	}

	_setPhoto(){
		let data = this.props.data;
		if(data !== null && data.count_photo > 0){
			data = data.data;
			let nh = Dimensions.get('window').width/5.5;
			return(
				<View>
					<View style={{marginTop:1}}>
						{this._scrollView(data,nh)}
					</View>
				</View>
			);
		}
		else{
			return <View/>;
		}
	}

	_scrollView(data,nh){
		let ds = Dimensions.get('window').width;
		let de = ds/5.5;
		return(
			<View style={{height:nh,backgroundColor:'#fff'}}>
				<ScrollView horizontal={true} style={{height:nh,width:ds-de}} ref='ScrollView'>
					{this._buildPhoto(data,nh)}
				</ScrollView>
			</View>
		);
	}

	_buildPhoto(data,nh){

		let rtrn = new Array();

		for(var i in data){
			let a = i;
			if(
				typeof data[i] !== 'undefined' &&
				typeof data[i].thumb_media_file_url !== 'undefined'
			){
				let uri = {uri:data[i].thumb_media_file_url};
				let image_file = data[i].media_file_url;
				let title = data[i].media_title;
				let action = ()=>this._showModal(image_file,title,a,nh);
				rtrn.push(
					<TouchableHighlight key={i} style={{height:nh,width:nh,marginRight:1}} onPress={action}>
						<View>
							<Image style={{height:nh,width:nh}} source={uri} resizeMode='cover'/>
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
