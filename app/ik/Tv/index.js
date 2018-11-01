// Import dependencies
import React, { Component } from 'react';

import {
	Text,
	View,
	ScrollView,
	RefreshControl,
	Dimensions,
	Picker,
	WebView,
	TouchableHighlight,
	Animated,
	Easing
} from 'react-native';
const Item = Picker.Item;
import IonIcon from 'react-native-vector-icons/Ionicons';
import { StyleProvider, Spinner, Button, Tab, Tabs, TabHeading } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { base_url, api_uri } from '../../comp/AppConfig';
import Styles from '../Styles';
import FooterSM from '../FooterSM';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ComList from './ComList';
import ComTabSwiper from './ComTabSwiper';
import getTheme from '../../../native-base-theme/components';

var try_request_1 = 0;
var try_limit_1 = 10;

var try_request_2 = 0;
var try_limit_2 = 10;

var try_request_3 = 0;
var try_limit_3 = 10;

export default class Tv extends Component{

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);
		this.loadmoreColor = new Animated.Value(0);
		this.loadmoreScale = new Animated.Value(0);
		this.state = {
			dimensions:Dimensions.get('window'),
			latestComp:<Spinner/>,
			popularComp:<Spinner/>,
			popularOpen:false,
			videoListComp:<Spinner style={{flex:1}}/>,
			videoListPage:0,
			videoListData:[],
			videoLatestFirstComp:<Spinner/>,
			videoLatestFirstTitle:'',
			videoLatestFirstDescription:'',
			videoLatestFirstNol:true,
			category_id:'',
			ScrollView:this.refs.ScrollView,
			opsional:[],
		}
		/*if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	componentDidMount(){
		Actions.refresh({key:'IKdrawer',open:value=>false,active1:3,active2:0});
		this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView},()=>{
			this._loadmoreColor();
			this._loadmoreScale();
			this._videoLatestFirst();
			this._getOpsional();
		});
	}

	_loadmoreColor(){
		this.loadmoreColor.setValue(0);
		Animated.timing(
			this.loadmoreColor,{
				toValue:4,
				duration:2000,
				easing:Easing.linear
			}
		).start(()=>this._loadmoreColor());
	}

	_loadmoreScale(){
		this.loadmoreScale.setValue(0);
		Animated.timing(
			this.loadmoreScale,{
				toValue:4,
				duration:2000,
				easing:Easing.linear
			}
		).start(()=>this._loadmoreScale());
	}

	_videoLatestFirst(){

		var temp = [];
		var query = {};
		query['table'] = 'tbl_video';
		query['where[trash_status#=]'] = 'N';
        query['where[ik_tv#=]'] = 'Y';
		query['limit'] = 1;
		query['orderby[published_datetime]'] = 'DESC';
		query['injected[list_video]'] = true;

		let resource = api_uri+'universal?'+ArrayToQueryString(query);
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);

		// Ambil data Article
		newComFetch.setResource(resource);

		newComFetch.sendFetch((rsp) => {
			if(rsp.status === 200){

				let data = rsp.data;

				if(data.length > 0){

					data = data[0];

					let src = 'https://www.youtube.com/embed/'+data.video_file;

					this.setState({
						latestComp:<ComTabSwiper sort={'latest'} offset={1}/>,
						videoLatestFirstTitle:data.video_title,
						videoLatestFirstDescription:data.video_desc,
						videoLatestFirstComp:
							<View>

								<View style={{padding:0,margin:0,height:((this.state.dimensions.width)/(16/9))}}>
									<WebView
										style={{padding:0,margin:0,height:((this.state.dimensions.width)/(16/9))}}
										source={{html:'<style>*{margin:0 !important;padding:0 !important;}</style><iframe style="height:'+(((this.state.dimensions.width)/(16/9)))+'px;width:100%;" src="'+src+'" frameborder="0" allowfullscreen="true"></iframe>'}}/>
								</View>
							</View>
					});

				}

				try_request_1 = 0;

			}
			else{
				if(try_request_1 <= try_limit_1){
					var thos = this;
					setTimeout(function(){
						try_request_1++;
						thos._videoLatestFirst();
					},5000);
				}
				//console.trace('error '+rsp.status);
			}
		});

	}

	_getList(category_id,change){

		let state = {};

		if(change){
			state = {
				videoListComp:<Spinner style={{flex:1}}/>,
				videoListPage:0,
				videoListData:[],
			}
		}
		if(category_id !== this.state.category_id){
			state.category_id = category_id;
		}

		this.setState(state,()=>{

			var temp = [];
			var query = {};
			query['table'] = 'tbl_video';
			query['where[trash_status#=]'] = 'N';
			query['where[ik_tv#=]'] = 'Y';
			query['orderby[published_datetime]'] = 'DESC';
			query['paginate'] = 'true';
			query['per_page'] = 10;
			query['injected[list_video]'] = true;
			query['injected[list_video][ci_in]'] = category_id;

			query['page'] = this.state.videoListPage+1;
			temp = this.state.videoListData;

			let compList = [];
			if(temp.length > 0){
				for(i in temp){
					compList.push(<ComList key={i} data={temp[i]} from='ik'/>);
				}
				compList.push(
					<Spinner style={{width:this.state.dimensions.width-10}} key={temp.length++}/>
				);
				this.setState({
					videoListComp:compList,
				});
			}

			let resource = api_uri+'universal?'+ArrayToQueryString(query);
			let newComFetch = new ComFetch();
			newComFetch.setHeaders({Authorization:this.jwt_signature});
			newComFetch.setRestURL(base_url);

			newComFetch.setResource(resource);
			newComFetch.sendFetch((rsp) => {

				if(rsp.status === 200){

					let data = rsp.data;
					let newTemp = temp.concat(data.data)
					let compList = [];

					for(i in newTemp){
						compList.push(<ComList key={i} data={newTemp[i]} from='ik'/>);
					}
					if(data.next_page_url !== null){

						const loadmoreColor = this.loadmoreColor.interpolate({
							inputRange:[0,1,2,3,4],
							outputRange:[
								'rgba(208,114,47,0)',
								'rgba(208,114,47,0.5)',
								'rgba(208,114,47,1)',
								'rgba(208,114,47,0.5)',
								'rgba(208,114,47,0)',
							]
						});

						const loadmoreScale = this.loadmoreScale.interpolate({
							inputRange:[0,1,2,3,4],
							outputRange:[
								0.75,
								0.85,
								1,
								0.85,
								0.75,
							]
						});

						compList.push(
							<View key={data.total} style={{width:this.state.dimensions.width-40,margin:10,marginTop:0,marginBottom:15}}>
								<TouchableHighlight underlayColor='transparent' style={{flexDirection:'row',justifyContent:'center'}} onPress={()=>{this._getList(category_id,false)}}>
									<Animated.Text style={{transform:[{scale:loadmoreScale}],color:loadmoreColor}}><IonIcon name='ios-arrow-round-down-outline' style={{fontSize:50}}/></Animated.Text>
								</TouchableHighlight>
							</View>
						);

					}

					this.setState({
						category_id:category_id,
						videoListComp:compList,
						videoListPage:data.current_page,
						videoListData:newTemp,
					});

					try_request_2 = 0;

				}
				else{
					if(try_request_2 <= try_limit_2){
						var thos = this;
						setTimeout(function(){
							try_request_2++;
							thos._getList(category_id,false);
						},5000);
					}
					else{
						//alert('error');
					}
					//console.trace('error '+rsp.status);
				}

			});

		});

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
			videoLatestFirstComp:<Spinner/>,
		},
		()=>{
			this._videoLatestFirst();
		});
	}

	_onChangeTab(e){
		if(e.i === 0){

		}
		else{
			if(!this.state.popularOpen){
				this.setState({
					popularComp:<ComTabSwiper sort={'popular'} offset={0}/>,
				});
			}
		}
	}

	_getOpsional(){
		var temp = [];
		var query = {};
		query['table'] = 'tbl_video_categories';
		query['where[status#=]'] = 'show';
        query['where[tv_show#=]'] = 'Y';
		query['orderby[order]'] = 'DESC';
		query['injected[options_iktv]'] = true;
		let resource = api_uri+'universal?'+ArrayToQueryString(query);
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);

		// Ambil data Article
		newComFetch.setResource(resource);

		newComFetch.sendFetch((rsp) => {
			if(rsp.status === 200){

				let category_id = '';
				let opsional = [];
				let data = rsp.data;

				for(i in data){
					if(category_id === ''){
						category_id = data[i].ci2;
					}
					opsional.push(
						<Item key={i} color='#767676' style={{margin:0,padding:0}} label={data[i].name} value={data[i].ci2}/>
					);
				}
				this.setState({
					opsional:opsional,
				},()=>{
					this._getList(category_id,false);
				});

				try_request_3 = 0;

			}
			else{
				if(try_request_3 <= try_limit_3){
					var thos = this;
					setTimeout(function(){
						try_request_3++;
						thos._videoLatestFirst();
					},5000);
				}
				//console.trace('error '+rsp.status);
			}
		});
	}

	render(){
		let videoLatestFirstTitleDescComp = <View/>;
		let ico = <IonIcon style={{color:'#aaa',fontSize:20}} name='ios-arrow-up-outline'/>;
		if(this.state.videoLatestFirstNol){
			ico = <IonIcon style={{color:'#aaa',fontSize:20}} name='ios-arrow-down-outline'/>
		}
		if(this.state.videoLatestFirstTitle || this.state.videoLatestFirstDescription){
			videoLatestFirstTitleDescComp = <TouchableHighlight underlayColor='transparent' onPress={()=>{/*LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);*/this.setState({videoLatestFirstNol:!this.state.videoLatestFirstNol})}}>
				<View style={{padding:15}}>
					<Text style={{color:'#555',fontSize:13,fontWeight:'bold'}}>{this.state.videoLatestFirstTitle}</Text>
					<Text style={{color:'#999',fontSize:13,lineHeight:22}} numberOfLines={(this.state.videoLatestFirstNol ? 3 : 0)}>{ this.state.videoLatestFirstDescription }</Text>
					<View style={{marginTop:15,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>{ico}</View>
				</View>
			</TouchableHighlight>;
		}

		return(
			<View>
				
				<ScrollView onScroll={this.props.hideBtnOnScroll} style={{backgroundColor:'#eaeaea'}} refreshControl={this._refreshControl()} ref='ScrollView'>

					<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#f0f0f0'}}>

						{this.state.videoLatestFirstComp}
						{videoLatestFirstTitleDescComp}

						<View style={{backgroundColor:'#f0f0f0',marginBottom:15}}>
							<Tabs locked={true} style={{backgroundColor:'#f0f0f0'}} onChangeTab={(e)=>this._onChangeTab(e)}>
								<Tab style={{backgroundColor:'#f0f0f0'}} heading={<TabHeading style={{backgroundColor:'#fff'}}><Text>TERKINI</Text></TabHeading>}>
									{this.state.latestComp}
								</Tab>
								<Tab style={{backgroundColor:'#f0f0f0'}} heading={<TabHeading style={{backgroundColor:'#fff'}}><Text>TERPOPULER</Text></TabHeading>}>
									{this.state.popularComp}
								</Tab>
							</Tabs>
						</View>

						<View style={{backgroundColor:'#fff',margin:15,padding:0,marginTop:0}}>
							<Picker
								style={{margin:0,padding:0,color:'#767676'}}
								mode='dropdown'
								selectedValue={this.state.category_id}
								onValueChange={(category_id)=>{this._getList(category_id,true)}}
							>
								{ this.state.opsional }
							</Picker>
						</View>

						<View style={{flexDirection:'row',flexWrap:'wrap',paddingLeft:5,paddingRight:5}}>
							{this.state.videoListComp}
						</View>

					</View>

					<FooterSM ScrollView={this.state.ScrollView}/>

				</ScrollView>
				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

			</View>
		);

	}

}
