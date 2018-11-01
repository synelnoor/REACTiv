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
			if(goto === 'artikel' && typeof this.props.data.article_detail !== 'undefined' && this.props.data.article_detail){
				this.props.data.from = this.props.from;
				return ()=>Actions.IKArticleDetail(this.props.data);
			}
			else if(goto === 'foto' && typeof this.props.data.foto !== 'undefined' && this.props.data.foto){
				return ()=> Actions.IKPhotoAlbum({data:this.props.data});
			}
			else if(goto === 'video'){
				let data = {
					video_file:this.props.data.cover,
					video_title:this.props.data.title,
					video_desc:'',
				}
				return ()=>Actions.IKVideoDetail({video:data});
			}
			else{
				return ()=>{};
			}
		}
		else{
			if(goto === 'artikel' && typeof this.props.data.article_detail !== 'undefined' && this.props.data.article_detail){
				this.props.data.from = this.props.from;
				return ()=>Actions.GIKArticleDetail(this.props.data);
			}
			else if(goto === 'foto' && typeof this.props.data.foto !== 'undefined' && this.props.data.foto){
				return ()=> Actions.GIKPhotoAlbum({data:this.props.data});
			}
			else if(goto === 'video'){
				let data = {
					video_file:this.props.data.cover,
					video_title:this.props.data.title,
					video_desc:'',
				}
				return ()=>Actions.GIKVideoDetail({video:data});
			}
			else{
				return ()=>{};
			}
		}
	}

	componentDidMount(){
		let dimensions = Dimensions.get('window');
		this.setState({
			dimensions:dimensions,
			item:<View style={{height:(dimensions.width/4),margin:15,marginTop:0,backgroundColor:'#ddd'}}/>
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
			//LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
			let nh = h / w * (this.state.dimensions.width/4);
			let nw = this.state.dimensions.width/4;
			let icon = <View/>
			if(this.props.data.tipe === 'foto'){
				icon = <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',position:'absolute',top:0,right:0,backgroundColor:'#e0e0e0',width:20,height:20}}><IonIcon style={{color:'#999',fontSize:15}} name='ios-image-outline'/></View>;
			}
			else if(this.props.data.tipe === 'video'){
				icon = <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',position:'absolute',top:0,right:0,backgroundColor:'#e0e0e0',width:20,height:20}}><IonIcon style={{color:'#999',fontSize:15}} name='ios-videocam-outline'/></View>;
			}
			let breadcrumb = <View/>;
			// if(
			// 	typeof this.props.data.category.cat_name !== 'undefined' &&
			// 	typeof this.props.data.province.province_name !== 'undefined'
			// ){
			// 	breadcrumb = <View style={{flexDirection:'row'}}><Text style={{fontSize:10}}>{this.props.data.category.cat_name}</Text><Text style={{padding:5,paddingTop:0,paddingBottom:0,fontSize:10}}>|</Text><Text style={{fontSize:10}}>{this.props.data.province.province_name}</Text></View>;
			// }
			// else if(
			// 	typeof this.props.data.category.cat_name !== 'undefined' &&
			// 	typeof this.props.data.province.province_name === 'undefined'
			// ){
			// 	breadcrumb = <Text style={{fontSize:10}}>{this.props.data.category.cat_name}</Text>;
			// }
			// else if(
			// 	typeof this.props.data.category.cat_name === 'undefined' &&
			// 	typeof this.props.data.province.province_name !== 'undefined'
			// ){
			// 	breadcrumb = <Text style={{fontSize:10}}>{this.props.data.province.province_name}</Text>;
			// }
			let cat = this.props.data.category;
			let prov = this.props.data.province;
			if(cat && prov) {
				breadcrumb = <View style={{flexDirection:'row'}}><Text style={{fontSize:10}}>{cat.cat_name}</Text><Text style={{padding:5,paddingTop:0,paddingBottom:0,fontSize:10}}>|</Text><Text style={{fontSize:10}}>{prov.province_name}</Text></View>;
			} else if(cat) {
				breadcrumb = <Text style={{fontSize:10}}>{cat.cat_name}</Text>;
			} else if(prov) {
				breadcrumb = <Text style={{fontSize:10}}>{prov.province_name}</Text>;
			}
			this.setState({
				item:
					<View style={{backgroundColor:'#fff',padding:15,margin:15,marginTop:0,}}>
						<TouchableHighlight
							underlayColor='transparent'
							onPress={this._Actions(this.props.data.tipe)}
						>
							<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
								<Image
									style={{
										height:nh,
										width:nw,
									}}
									source={imgplace}
									resizeMode='cover'
								/>
								<View style={{flex:1,marginLeft:10}}>
									{breadcrumb}
									<Text numberOfLines={3} style={{fontSize:13,color:'#333',}}>
										{this.props.data.title}
									</Text>
								</View>
							</View>
						</TouchableHighlight>
						{icon}
					</View>,
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
