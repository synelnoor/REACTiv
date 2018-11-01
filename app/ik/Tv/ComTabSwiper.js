import React, { Component } from 'react';
import {
	View,
	Image,
	Dimensions,
	TouchableHighlight,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Swiper from 'react-native-swiper';

import { base_url, api_uri } from '../../comp/AppConfig';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';

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
		this.state = {
			dimensions:Dimensions.get('window'),
			swiper:<View/>,
		}
	}

	componentDidMount(){
		this.setState({
			dimensions:Dimensions.get('window'),
		},()=>{
			this._getBanner();
		});
	}

	_getBanner(){

		let newComFetch = new ComFetch();
		let query = {};

		query['table'] = 'tbl_video';
		query['where[trash_status#=]'] = 'N';
        query['where[ik_tv#=]'] = 'Y';
		query['injected[list_video]'] = true;
		query['limit'] = 10;

		if(this.props.offset > 0){
			query['offset'] = this.props.offset;
		}
		if(this.props.sort === 'latest'){
			query['orderby[published_datetime]'] = 'DESC';
		}
		else{
			query['orderby[popular_count]'] = 'DESC';
		}

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
					typeof data[0].video_cover !== 'undefined'
				){
					let img = 'http://img.youtube.com/vi/'+data[0].video_cover+'/mqdefault.jpg';

					Image.getSize(img,(w,h)=>{
						var nh = h / w * this.state.dimensions.width;
						this.setState({
							swiper:<View style={{backgroundColor:'#f9f9f9',margin:0,padding:0,paddingBottom:1,alignItems:'center'}}><Swiper paginationStyle={{bottom:0}} height={nh} width={this.state.dimensions.width+5} style={{margin:0,padding:0}} dot={this._swiperDotInactive(dotLength)} activeDot={this._swiperDotActive(dotLength)} autoplay={true} autoplayTimeout={10}>{this._buildBanner(data,nh)}</Swiper></View>,
						});
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
				typeof data[i].video_cover !== 'undefined'
			){
				let img = 'http://img.youtube.com/vi/'+data[i].video_cover+'/mqdefault.jpg';
				let uri = {uri:img};

				rtrn.push(
					<TouchableHighlight
						key={i}
						onPress={()=>Actions.IKVideoDetail({'video':data[i]})}
					>
						<Image style={{height:nh}} source={uri} resizeMode='cover'/>
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
