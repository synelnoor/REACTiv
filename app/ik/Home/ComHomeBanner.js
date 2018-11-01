import React, { Component } from 'react';
import {
	View,
	Image,
	Dimensions,
	TouchableHighlight,
	Linking
} from 'react-native';
import Swiper from 'react-native-swiper';

import { base_url, api_uri } from '../../comp/AppConfig';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import { Actions } from 'react-native-router-flux';

var swiperDot = {
	width:0,
	height:2,
	margin:0,
	padding:0,
}

export default class ComHomeBanner extends Component{

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);
		this.ismount = false;
		this.state = {
			swiper:<View/>,
			dimensions:Dimensions.get('window'),
		}
		/*if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	componentDidMount(){
		this.setState({
			dimensions:Dimensions.get('window'),
		},()=>{
			this.ismount = true;
			this._getBanner();
		});
	}

	componentWillUnmount(){
		this.ismount = false;
	}

	_goToUrl(url1,url2){
		Linking.canOpenURL(url1).then(supported=>{
			if(supported){
				Linking.openURL(url1);
			}
			else{
				if(url2){
					Linking.openURL(url2);
				}
				else{
					Alert.alert('Pesan','Gagal membuka : '+url1,[{text:'OK',onPress:()=>{}}]);
				}
			}
		});
	}

	_Actions(data){
		Actions.refresh({key:'IKdrawer',open:value=>false});
		if(data.apps_action === 'open_external_link' && data.apps_value !== ''){
			this._goToUrl(data.apps_value,data.apps_value);
		}
		else if(data.apps_action === 'list' && data.apps_value !== ''){
			Actions.IKArticleList(JSON.parse(data.apps_value));
		}
		else if(data.apps_action === 'detail_article' && data.data){
			Actions.IKArticleDetail(data.data);
		}
		else if(data.apps_action === 'album_photo' && data.data){
			Actions.IKPhotoAlbum(data.data);
		}
		else if(data.apps_action === 'album_video' && data.apps_value !== ''){
			Actions.IKVideoAlbum(JSON.parse(data.apps_value));
		}
		else if(data.apps_action === 'detail_video' && data.data){
			Actions.IKVideoDetail({video:data.data});
		}
		else if(data.apps_action === 'kegiatan' && data.apps_value !== ''){
			Actions.IKKegiatan({'ymd':data.apps_value});
		}
		else if(data.apps_action === 'streaming'){
			Actions.GIK();
		}
		else{
			return;
		}
	}

	_getBanner(){

		let newComFetch = new ComFetch();
		let query = {};

		query['table'] = 'tbl_home_big_rotate_banner';
		query['where[trash_status#=]'] = 'N';
		query['where[show_in#!=]'] = 'web';
		query['orderBy[order_id]'] = 'ASC';
		query['injected[tbl_home_big_rotate_banner]'] = true;
		query['injected[tbl_home_big_rotate_banner][dimensions_width]'] = this.state.dimensions.width*2;

		let resource = api_uri+'universal?'+ArrayToQueryString(query);

		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);
		newComFetch.setResource(resource);

		newComFetch.sendFetch((rsp) => {
			if(rsp.status === 200){
				let data = rsp.data;
				let dotLength = (this.state.dimensions.width/(data.length))+5
				if(
					typeof data[0] !== 'undefined' &&
					typeof data[0].banner_file !== 'undefined'
				){
					Image.getSize(data[0].image_url,(w,h)=>{
						if(this.ismount){
							//LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
							var nh = h / w * this.state.dimensions.width;
							this.setState({
								swiper:<View style={{backgroundColor:'#f9f9f9',margin:0,padding:0,paddingBottom:1,alignItems:'center'}}
								><Swiper paginationStyle={{bottom:0}} height={nh} width={this.state.dimensions.width+5} 
								style={{margin:0,padding:0}} dot={this._swiperDotInactive(dotLength)} 
								activeDot={this._swiperDotActive(dotLength)} 
								//autoplay={true} 
								autoplay={!__DEV__?true:false}
								autoplayTimeout={10}>{this._buildBanner(data,nh)}</Swiper></View>,
							});
						}
					});
				}
			}
		});
	}

	_buildBanner(data,nh){

		let rtrn = new Array();

		for(var i in data){
			if(
				typeof data[i] !== 'undefined' &&
				typeof data[i].banner_file !== 'undefined'
			){
				var uri = {uri:data[i].image_url};
				let datapass = data[i];
				rtrn.push(
					<TouchableHighlight
						underlayColor='transparent'
						onPress={()=>{this._Actions(datapass)}}
						key={i}
					>
						<Image style={{height:nh}} source={uri}/>
					</TouchableHighlight>
				);
			}
		}

		return rtrn;

	}

	_swiperDotInactive(length){
		return(
			<View style={[swiperDot,{backgroundColor:'rgba(255,255,255,0.5)',width:length}]}/>
		);
	}

	_swiperDotActive(length){
		return(
			<View style={[swiperDot,{backgroundColor:'rgba(0,0,0,0.25)',width:length}]}/>
		);
	}

	render(){
		return(
			this.state.swiper
		);
	}

}
