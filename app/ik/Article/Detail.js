// ganti model get image biar bisa offline
// Import dependencies
import React, { Component } from 'react';
import {
	Text,
	View,
	ScrollView,
	RefreshControl,
	Dimensions,
	Image,
	TouchableHighlight,
	WebView
} from 'react-native';
import { Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import HTML from 'react-native-render-html';
import FooterSM from '../FooterSM';
//import WebHtmlView from '../../comp/WebHtmlView';
import ComPhoto from './ComPhoto';
import Styles from '../Styles';
import DetailComments from '../../comp/DetailComments';
import DetailShare from '../../comp/DetailShare';
import { web_url } from '../../comp/AppConfig';

import Loading from '../../comp/Loading';
import Spinn from '../../comp/Spinn';


export default class Detail extends Component {

	constructor(props){
		super(props);
		this.state = {
			ready:false,
			dimensions:Dimensions.get('window'),
			data:this.props,
			top_content:<View/>,
			videoComp:<View><View style={{transform:[{rotate:'45deg'}],position:'absolute',top:0,bottom:0,left:10,width:1,backgroundColor:'#fff'}}/><IonIcon style={{color:'#fff',fontSize:25}} name='ios-videocam-outline'/></View>,
			ScrollView:this.refs.ScrollView,
		}
		/*if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	_refreshControl(ScrollView){
		return(
			<RefreshControl
				title=' '
				titleColor={Styles.ScrollView.titleColor}
				tintColor={Styles.ScrollView.tintColor}
				colors={Styles.ScrollView.colors}
				progressBackgroundColor={Styles.ScrollView.progressBackgroundColor}
				refreshing={false}
				onRefresh={this._onRefresh.bind(this)}
			/>
		);
	}

	_onRefresh(){
		this.setState({
			data:this.state.data,
		});
	}

	componentDidMount(){
		this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView},()=>{
			if(this.state.data.article_detail){
				this._topContent(true);
				this._videoComp(true);
				setTimeout(()=>{
					//LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
					this.setState({ready:true},()=>{
						this.setState({ScrollView:this.refs.ScrollView});
					});
				},2000);
			}
		});
	}

	_topContent(first){
		if(this.state.data.tbl_reference === 'ika_figure'){
			if(this.state.data.article_detail.detail_video !== ''){
				let src = 'https://www.youtube.com/embed/'+this.state.data.article_detail.detail_video;
				this.setState({
					top_content:
						<View style={{padding:0,margin:0,height:((this.state.dimensions.width)/(16/9))}}>
							<WebView
								style={{padding:0,margin:0,height:((this.state.dimensions.width)/(16/9))}}
								source={{html:'<style>*{margin:0 !important;padding:0 !important;}</style><iframe style="height:'+(((this.state.dimensions.width)/(16/9)))+'px;width:100%;" src="'+src+'" frameborder="0" allowfullscreen="true"></iframe>'}}/>
						</View>
					,
				});
			}
			else if(this.state.data.article_detail.detail_cover_url !== ''){
				if(first){
					var img = this.state.data.article_detail.detail_cover_url;
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
						top_content:
							<Image
								style={{
									height:nh,
									width:nw,
									//margin:first ? 0 : 10,
									marginBottom:0,
								}}
								source={imgplace}
								resizeMode='cover'
							>
							</Image>,
					});
				},()=>{
					this._topContent(false);
				});
			}
		}
		else{

			if(this.state.data.article_detail.detail_cover_url !== ''){

				if(first){
					var img = this.state.data.article_detail.detail_cover_url;
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
					var nh = h / w * (this.state.dimensions.width - (first ? 0 : 20));
					var nw = (this.state.dimensions.width - (first ? 0 : 20));
					this.setState({
						top_content:
							<Image
								style={{
									height:nh,
									width:nw,
									margin:first ? 0 : 10,
									marginBottom:0,
								}}
								source={imgplace}
								resizeMode='cover'
							>
							</Image>,
					});
				},()=>{
					this._topContent(false);
				});
			}
		}
	}

	_Actions(goto,data){
		if(typeof this.state.data.from !== 'undefined' && this.state.data.from === 'ik'){
			if(goto === 'articledetail'){
				return ()=>{};
				//return ()=>Actions.IKArticleDetail(this.state.data);
			}
			else if(goto === 'articlelist'){
				return ()=>{};
				//return ()=>Actions.IKArticleList(data);
			}
			else if(goto === 'photoalbum'){
				return ()=>{};
			}
			else if(goto === 'videodetail'){
				return ()=>{};
				//return ()=>Actions.IKVideoDetail(this.state.data);
			}
		}
		else{

		}
	}

	_breadcrumb_content(){

		var category = this.state.data.category;
		var province = this.state.data.province;

		if(category !== null && province !== null){
			let arrCat = {cat_id:category.cat_id,tbl_reference:'ika_home_highlight'};
			let arrProv = {province_id:province.province_id,tbl_reference:'ika_home_highlight'};
			return(
				<View style={{margin:15,marginTop:0,marginBottom:0,flexDirection:'row',justifyContent:'center'}}>
					<TouchableHighlight underlayColor='#6a5750' style={{flexDirection:'column',justifyContent:'center',width:this.state.dimensions.width/3,padding:5,backgroundColor:'#6a5750'}} onPress={this._Actions('articlelist',arrCat)}>
						<Text style={{textAlign:'center',color:'#fff'}}>
							{category.cat_name}
						</Text>
					</TouchableHighlight>
					<TouchableHighlight underlayColor='#d06c2a' style={{flexDirection:'column',justifyContent:'center',width:this.state.dimensions.width/3,padding:5,backgroundColor:'#d06c2a'}} onPress={this._Actions('articlelist',arrProv)}>
						<Text style={{textAlign:'center',color:'#fff'}}>
							{province.province_name}
						</Text>
					</TouchableHighlight>
				</View>
			);
		}

		else if(category !== null && province === null){
			let arr = {cat_id:category.cat_id,tbl_reference:'ika_home_highlight'};
			return(
				<View style={{margin:15,marginTop:0,marginBottom:0,flexDirection:'row',justifyContent:'center'}}>
					<TouchableHighlight underlayColor='#6a5750' style={{flexDirection:'column',justifyContent:'center',width:this.state.dimensions.width/3,padding:10,backgroundColor:'#6a5750'}} onPress={this._Actions('articlelist',arr)}>
						<Text style={{textAlign:'center',color:'#fff'}}>
							{category.cat_name}
						</Text>
					</TouchableHighlight>
				</View>
			);
		}
		else if(category === null && province !== null){
		let arr = {province_id:province.province_id,tbl_reference:'ika_home_highlight'};
		return(
			<View style={{margin:15,marginTop:0,marginBottom:0}}>
				<View style={{margin:15,marginBottom:0,flexDirection:'row',justifyContent:'center'}}>
					<TouchableHighlight underlayColor='#d06c2a' style={{flexDirection:'column',justifyContent:'center',width:this.state.dimensions.width/3,padding:10,backgroundColor:'#d06c2a'}} onPress={this._Actions('articlelist',arr)}>
						<Text style={{textAlign:'center',color:'#fff'}}>
							{province.province_name}
						</Text>
					</TouchableHighlight>
				</View>
			</View>
		);
		}
		else{
			return(<View/>);
		}

	}

	_main_content(){
		return(
			<View style={{margin:15,marginBottom:0,}}>
				<HTML html={this.state.data.article_detail.detail_content} tagsStyles={{ p: { marginBottom:5, paddingBottom:0 }, img:{ maxWidth:'100%' } }} imagesMaxWidth={Dimensions.get('window').width} />
			</View>
		);
	}

	_title_content(){
		if(this.state.data.article_detail.detail_title){
			return(
				<Text style={{
					margin:10,
					marginBottom:0,
					padding:10,
					fontSize:20,
					textAlign:'center',
					color:'#555',
				}}>{this.state.data.article_detail.detail_title}</Text>
			)
		}
		else{
			return;
		}
	}

	_videoComp(first){

		if(this.state.data.video){

			if(first){
				var img = 'http://img.youtube.com/vi/'+this.state.data.video.video_file+'/mqdefault.jpg';
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
					videoComp:
						<TouchableHighlight
							underlayColor='transparent'
							style={{
								height:this.state.dimensions.width/5.5,
								width:this.state.dimensions.width/5.5,
								backgroundColor:'#000'
							}}
							onPress={()=>Actions.IKVideoDetail({video:this.state.data.video})}
						>
							<ImageBackground
								style={{
									height:this.state.dimensions.width/5.5,
									width:this.state.dimensions.width/5.5,
								}}
								source={imgplace}
								resizeMode='cover'
							>
								<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:'rgba(0,0,0,0.5)'}}>
									<IonIcon style={{color:'#fff',fontSize:25}} name='ios-videocam-outline'/>
								</View>
							</ImageBackground>
						</TouchableHighlight>,
				});
			},()=>{
				//this._componentDidMount(false);
			});

		}

	}

	render(){
		if(this.state.ready){
			let title = '';
			let cat_id = parseInt(this.props.cat_id);
			if(
				cat_id === 1 ||
				cat_id === 2 ||
				cat_id === 3 ||
				cat_id === 4
			){
				title = 'JELAJAH INDONESIA';
			}
			else{
				title = 'JENDELA INDONESIA';
			}
			let top_list = <View/>;
			if(this.state.data.video || this.state.data.foto){
				top_list = <View style={{flexDirection:'row'}}>
					<View style={{height:this.state.dimensions.width/5.5,width:this.state.dimensions.width/5.5,marginTop:1,marginRight:1,backgroundColor:'#999',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
						{this.state.videoComp}
					</View>
					<View>
						<ComPhoto data={this.state.data.foto}/>
					</View>
				</View>
			}
			let commentsComp = <View/>;
			if(
				typeof this.props.cat_id !== 'undefined' &&
				typeof this.props.article_detail !== 'undefined' &&
				typeof this.props.article_detail.detail_id !== 'undefined' &&
				parseInt(this.props.cat_id) === 10
			){
				commentsComp = <DetailComments detail_id={this.props.article_detail.detail_id}/>;
			}
			return(
				<View style={{flex:1,paddingBottom:35}}>
					<View style={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}}>
						<View style={{height:53,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
							<TouchableHighlight
								underlayColor='transparent'
								onPress={()=>{Actions.pop()}}
								style={{position:'absolute',top:0,bottom:0,left:0,alignItems:'center',justifyContent:'center',flexDirection:'row',paddingLeft:10}}
							>
								<IonIcon name='ios-arrow-back-outline' style={{fontSize:34,color:'#b76329'}}/>
							</TouchableHighlight>
							<Text style={{fontSize:15,color:'#999'}}>{title}</Text>
						</View>
					</View>
					<ScrollView style={{backgroundColor:'#eaeaea'}} refreshControl={this._refreshControl()} ref='ScrollView'>
						<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#fafafa'}}>
							{this.state.top_content}
							{top_list}
							{this._title_content()}
							{this._breadcrumb_content()}
							{this._main_content()}
						</View>
						{commentsComp}
						<FooterSM ScrollView={this.state.ScrollView}/>
					</ScrollView>
					<DetailShare data={this.state.data.article_detail}/>
				</View>
			);
		}
		else{
			return(
				<View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
					<Spinn/>
				</View>
			);
		}
	}

}
