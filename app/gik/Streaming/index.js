// Import dependencies
import React, { Component } from 'react';
import {
	Image,
	View,
	ScrollView,
	Dimensions,
	WebView
} from 'react-native';
//import IonIcon from 'react-native-vector-icons/Ionicons';
import FooterSM from '../FooterSM';
import { web_url, base_url, api_uri } from '../../comp/AppConfig';
//import Styles from '../Styles';
import { Actions } from 'react-native-router-flux';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';

var try_request = 0;
var try_limit = 10;

export default class Detail extends Component {

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);
		this.ismount = false;
		this.state = {
			dimensions:Dimensions.get('window'),
			ScrollView:this.refs.ScrollView,
			bannerComp:<View/>,
		}
		/*if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	componentDidMount(){
		this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView},()=>{
			this.ismount = true;
			this._getBanner();
			Actions.refresh({key:'GIKdrawer',open:value=>false});
		});
	}

	componentWillUnmount(){
		this.ismount = false;
	}

	_buildBanner(first){

		if(first){
			var img = web_url+'uploads/_images_streaming/'+first;
		}
		else{
			var img = web_url+'assets/image/gik/logo-gik.png';
		}
		var imgplace = {uri:img};

		Image.getSize(img,(w,h)=>{

			setTimeout(()=>{
				if(this.ismount){
					//LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
					let nh = h / w * (this.state.dimensions.width);
					let nw = this.state.dimensions.width;
					this.setState({
						bannerComp:
							<Image
								style={{
									height:nh,
									width:nw,
								}}
								source={imgplace}
								resizeMode='cover'
							/>,
					});
				}
			},1000);

		},()=>{
			this._buildBanner(false);
		});

	}

	_getBanner(){

		var query = {};
		query['table'] = 'gik_streaming_banner';
		query['where[trash_status#=]'] = 'N';
		query['orderby[publish_date]'] = 'DESC';

		let resource = api_uri+'universal?'+ArrayToQueryString(query);
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);

		newComFetch.setResource(resource);

		newComFetch.sendFetch((rsp) => {

			if(rsp.status === 200){
				let data = rsp.data;
				if(data.length > 0){
					this._buildBanner(data[0].banner_file);
				}
				try_request = 0;
			}
			else{
				if(try_request <= try_limit){
					var thos = this;
					setTimeout(function(){
						try_request++;
						thos._getBanner();
					},5000);
				}
				else{
					//alert('error');
				}
				//console.trace('error '+rsp.status);
			}

		});

	}

	render(){
		return(
			<View>

				<ScrollView onScroll={this.props.hideBtnOnScroll} style={{backgroundColor:'#eaeaea'}} ref='ScrollView'>
					<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#f0f0f0'}}>
						{this.state.bannerComp}
						<View style={{padding:0,margin:0,height:((this.state.dimensions.width)/(16/9))}}>
							<WebView
								style={{padding:0,margin:0,height:((this.state.dimensions.width)/(16/9))}}
								source={{html:'<style>*{margin:0 !important;padding:0 !important;}</style><iframe style="height:'+(((this.state.dimensions.width)/(16/9)))+'px;width:100%;" src="https://www.youtube.com/embed/live_stream?channel=UCu4kAVdaLhX-9UZt1f9-ARg&autoplay=1" frameborder="0" allowfullscreen="true"></iframe>'}}/>
						</View>
					</View>
					<FooterSM ScrollView={this.state.ScrollView}/>
				</ScrollView>
				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

			</View>
		);
	}

}
