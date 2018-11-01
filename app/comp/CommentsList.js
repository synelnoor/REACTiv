import React, { Component } from 'react';
import {
	View,
	Image,
	Text
} from 'react-native';

export default class CommentsList extends Component{

	constructor(props){
		super(props);
		this.ismount = false;
		this.state = {
			img:<View style={{height:50,backgroundColor:'#f0f0f0'}}/>,
		}
	}

	componentDidMount(){
		this.ismount = true;
		if(this.props.data !== null){
			var img = this.props.data.profile_thumb;
			Image.getSize(img,(w,h)=>{
				this._buildImg(img,w,h);
			},()=>{
				this._buildImg(false,0,0);
			});
		}
	}

	componentWillUnmount(){
		this.ismount = false;
	}

	_buildImg(img,w,h){
		setTimeout(()=>{
			if(this.ismount && img){
				this.setState({
					img:<Image
						style={{
						height:50,
						width:50,
					}}
						source={{uri:img}}
						resizeMode='contain'
					/>,
				});
			}
		},500);
	}

	render(){
		return(
			<View style={{flexDirection:'row',backgroundColor:'#fff',padding:15,marginBottom:15}}>
				<View style={{width:50,marginRight:15}}>
					{this.state.img}
				</View>
				<View style={{flex:1}}>
					<View style={{flexDirection:'row',alignItems:'center',borderBottomWidth:0.5,borderBottomColor:'#f0f0f0',marginBottom:5,paddingBottom:5,}}>
						<Text style={{color:'#555'}} >{this.props.data.user_name}</Text>
						<View style={{height:5,width:15}}/>
						<Text style={{color:'#999',fontSize:10}}>{this.props.data.created_at}</Text>
					</View>
					<View>
						<Text style={{color:'#777'}}>{this.props.data.comments}</Text>
					</View>
				</View>
			</View>
		);
	}

}
