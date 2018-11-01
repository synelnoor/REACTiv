// ganti model get image biar bisa offline
import React, { Component } from 'react';
import {
	View,
	Image,
	Dimensions,
	Text,
	TouchableHighlight,
} from 'react-native';
import { web_url } from '../../comp/AppConfig';

export default class ComListChild extends Component{

	constructor(props){
		super(props);
		let dimensions = Dimensions.get('window');
		this.state = {
			dimensions:dimensions,
			item:<View style={{height:(dimensions.width/3),marginTop:5,paddingBottom:5,backgroundColor:'#eee',borderBottomColor:'#ddd',borderBottomWidth:1}}/>,
		}
	}

	componentDidMount(){
		if(this.props.type === 'popular'){
			let dimensions = Dimensions.get('window');
			this.setState({
				dimensions:dimensions,
				item:<View style={{height:(dimensions.width/3),marginTop:5,paddingBottom:5,backgroundColor:'#eee',borderBottomColor:'#ddd',borderBottomWidth:1}}/>,
			},()=>{
				this._buildItem(true);
			});
		}
	}

	componentWillReceiveProps(){
		let dimensions = Dimensions.get('window');
		this.setState({
			dimensions:dimensions,
			item:<View style={{height:(dimensions.width/3),marginTop:5,paddingBottom:5,backgroundColor:'#eee',borderBottomColor:'#ddd',borderBottomWidth:1}}/>,
		},()=>{
			this._buildItem(true);
		});
	}

	_buildItem(first){

		let data = this.props.data;
		let loop = this.props.loop;

		if(first){
			var img = 'https://img.youtube.com/vi/'+data.video_file+'/mqdefault.jpg';
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

			var nh = h / w * ((this.state.dimensions.width/3));
			var nw = (this.state.dimensions.width/3);

			let tc = {};
			let bc = 'transparent';

			if(this.props.activeVideo === data.video_file){
				tc.color = '#d06c2a';
				bc = '#d06c2a';
			}

			this.setState({
				item:
				<TouchableHighlight
					underlayColor='transparent'
					style={{
						marginTop:5,
						paddingBottom:5,
						borderBottomColor:'#ddd',
						borderBottomWidth:1,
					}}
					onPress={()=>this.props.onPress(this.props.loop,data.video_file)}
				>
					<View style={{flexDirection:'row',alignItems:'center'}}>
						<Image
						style={{
							height:nh,
							width:nw
						}}
							source={imgplace}
							resizeMode='cover'
						><View style={{position:'absolute',top:0,bottom:0,right:0,left:0,borderWidth:2,borderColor:bc}}/></Image>
						<Text style={[{
							width:(this.state.dimensions.width-(this.state.dimensions.width/3))-40,
							padding:10,
							alignSelf:'center'
						},tc]}>{data.video_title}</Text>
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
