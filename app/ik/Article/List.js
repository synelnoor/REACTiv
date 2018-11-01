// Impor dependencies
import React, { Component } from 'react';

import {
	Text,
	View,
	ScrollView,
	RefreshControl,
	TextInput,
	Dimensions,
	TouchableHighlight,
	Animated,
	Easing
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { StyleProvider, Spinner, Tab, Tabs, TabHeading } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { base_url, api_uri } from '../../comp/AppConfig';
import Styles from '../Styles';
import getTheme from '../../../native-base-theme/components';
import FooterSM from '../FooterSM';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ItemList from '../../comp/ItemList';

import Loading from '../../comp/Loading';
import Spinn from '../../comp/Spinn';


var try_request = 0;
var try_limit = 10;

export default class List extends Component{

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);
		this.loadmoreColor = new Animated.Value(0);
		this.loadmoreScale = new Animated.Value(0);
		this.state = {
			dimensions:Dimensions.get('window'),
			articleSearch:'',
			articleSearchCurrent:'',
			articleLatestComp:<Spinn/>,
			articleLatestPage:0,
			articleLatestData:[],
			ScrollView:this.refs.ScrollView,
		}
	}

	componentDidMount(){
		let param = {key:'IKdrawer',open:value=>false,active1:0,active2:0}
		if(typeof this.props.province_id !== 'undefined'){
				param.active1 = 1;
		}
		else if(typeof this.props.tbl_reference !== 'jdi_jenesia' && typeof this.props.cat_id === 'undefined'){
			param.active1 = 2;
		}
		else if(typeof this.props.cat_id !== 'undefined'){
			if(this.props.cat_id === 1){
				param.active1 = 1;
				param.active2 = 1;
			}
			else if(this.props.cat_id === 2){
				param.active1 = 1;
				param.active2 = 2;
			}
			else if(this.props.cat_id === 3){
				param.active1 = 1;
				param.active2 = 3;
			}
			else if(this.props.cat_id === 4){
				param.active1 = 1;
				param.active2 = 4;
			}
			else if(this.props.cat_id === 5){
				param.active1 = 2;
				param.active2 = 1;
			}
			else if(this.props.cat_id === 6){
				param.active1 = 2;
				param.active2 = 3;
			}
			else if(this.props.cat_id === 7){
				param.active1 = 2;
				param.active2 = 7;
			}
			else if(this.props.cat_id === 10){
				param.active1 = 2;
				param.active2 = 2;
			}
		}
		Actions.refresh(param);
		this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView},()=>{
			this._loadmoreColor();
			this._loadmoreScale();
			this._getHighlight();
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

	_getHighlight(){

		// Ambil data artikel terbaru
		// Untuk highlight home pakai cat_id 1,2,3,4,5,10

		// list untuk kolom status publish atau tidak
		let publishColList = {
			'jdi_jenesia':'status',
			'jdi_post':'post_status',
			'ika_figure':'status',
			'jdi_event':'event_status',
			'jdi_pojok_editorial':'editorial_status',
			'ika_home_highlight':'status',
		};
		let publishCol = typeof publishColList[this.props.tbl_reference] !== 'undefined' ? publishColList[this.props.tbl_reference] : '';

		// list untuk kolom status publish atau tidak
		let idColList = {
			'jdi_jenesia':'id',
			'jdi_post':'post_id',
			'ika_figure':'figure_id',
			'jdi_event':'event_id',
			'jdi_pojok_editorial':'editorial_id',
			'ika_home_highlight':'id_reference',
		};
		let idCol = typeof idColList[this.props.tbl_reference] !== 'undefined' ? idColList[this.props.tbl_reference] : '';

		// list untuk kolom status publish atau tidak
		let orderColList = {
			'jdi_jenesia':'published_date',
			'jdi_post':'published_date',
			'ika_figure':'published_datetime',
			'jdi_event':'published_date',
			'jdi_pojok_editorial':'published_date',
			'ika_home_highlight':'published_date',
		};
		let orderCol = typeof orderColList[this.props.tbl_reference] !== 'undefined' ? orderColList[this.props.tbl_reference] : '';

		var temp = [];
		var query = {};
		query['table'] = this.props.tbl_reference;
		query['where['+publishCol+'#=]'] = 'publish';
		query['orderby['+orderCol+']'] = 'DESC';
		query['where[trash_status#=]'] = 'N';
		if(this.props.tbl_reference !== 'jdi_jenesia'){
			query['orderby[sort_view]'] = 'DESC';
			query['where[tipe#=]'] = 'artikel';
		}
		if(typeof this.props.cat_id !== 'undefined'){
			query['where[cat_id#=]'] = this.props.cat_id;
		}
		if(typeof this.props.province_id !== 'undefined'){
			query['where[province_id#=]'] = this.props.province_id;
		}
		query['paginate'] = 'true';
		query['per_page'] = 10;
		query['injected[list_article]'] = true;
		query['injected[list_article][dimensions_width]'] = this.state.dimensions.width;
		if(this.state.articleSearch !== ''){
			query['injected[list_article][search]'] = this.state.articleSearch;
		}
		query['page'] = this.state.articleLatestPage+1;

		temp = this.state.articleLatestData;

		let compList = [];
		if(temp.length > 0){
			for(i in temp){
				compList.push(<ItemList
					is_cat_id={typeof this.props.cat_id !== 'undefined' ? this.props.cat_id : null}
					is_province_id={typeof this.props.province_id !== 'undefined' ? this.props.province_id : null}
				key={i} data={temp[i]} from='ik'/>);
			}
			compList.push(
				<Spinn key={temp.length++}/>
			);
			this.setState({
				articleLatestComp:compList,
			});
		}

		let resource = api_uri+'universal?'+ArrayToQueryString(query);
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);

		// Ambil data Article
		newComFetch.setResource(resource);

		newComFetch.sendFetch((rsp) => {
			console.log(resource)
			if(rsp.status === 200){

				let data = rsp.data;

				let newTemp = temp.concat(data.data)
				let compList = [];

				//current_page
				//data
				//from
				//last_page
				//next_page_url
				//per_page
				//prev_page_url
				//to
				//total

				for(i in newTemp){
					compList.push(<ItemList
						is_cat_id={typeof this.props.cat_id !== 'undefined' ? this.props.cat_id : null}
						is_province_id={typeof this.props.province_id !== 'undefined' ? this.props.province_id : null}
					key={i} data={newTemp[i]} from='ik'/>);
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
						<TouchableHighlight underlayColor='transparent' key={data.total} style={{flexDirection:'row',justifyContent:'center',margin:15,marginTop:0}} onPress={()=>{this._getHighlight()}}>
							<Animated.Text style={{transform:[{scale:loadmoreScale}],color:loadmoreColor}}><IonIcon name='ios-arrow-round-down-outline' style={{fontSize:50}}/></Animated.Text>
						</TouchableHighlight>
					);

				}

				if(newTemp.length < 1){
					compList.push(
						<Text key={1} style={{backgroundColor:'#fff',padding:10,marginLeft:15,marginRight:15,textAlign:'center',color:'#888'}}>PENCARIAN TIDAK DITEMUKAN</Text>
					);
				}

				this.setState({
					articleLatestComp:compList,
					articleLatestPage:data.current_page,
					articleLatestData:newTemp,
				});

				try_request = 0;

			}
			else{
				if(try_request <= try_limit){
					var thos = this;
					setTimeout(function(){
						try_request++;
						thos._getHighlight();
					},5000);
				}
				else{
					//alert('error');
				}
				//console.trace('error '+rsp.status);
			}

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
			articleSearch:'',
			articleSearchCurrent:'',
			articleLatestComp:<Spinn/>,
			articleLatestPage:0,
			articleLatestData:[],
		},
		()=>{
			this._getHighlight();
		});
	}

	_search(){
		if(this.state.articleSearch !== this.state.articleSearchCurrent){
			this.setState({
				articleSearchCurrent:this.state.articleSearch,
				articleLatestComp:<Spinn/>,
				articleLatestPage:0,
				articleLatestData:[],
			},
			()=>{
				this._getHighlight();
			});
		}
	}

	_pageTitle(){
		if(typeof this.props.page_name !== 'undefined'){
			let pagetitle = '';
			let page_name = this.props.page_name;
			for(i in page_name){
				pagetitle += (page_name[i]).toUpperCase()+' ';
			}
			let page_subname = <View/>;
			if(typeof this.props.page_subname !== 'undefined' && this.props.page_subname !== ''){
				page_subname = <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}><View style={{height:10,width:1,backgroundColor:'#ddd',marginLeft:10,marginRight:10}}/><Text style={{fontSize:16}}>{(this.props.page_subname).toUpperCase()}</Text></View>;
			}
			pagetitle = pagetitle.slice(0,-1);
			let cat_id = parseInt(this.props.cat_id);
			let searchBox =
			<View style={{height:1,alignSelf:'stretch',flexDirection:'row',marginTop:5}}>
				<View style={{backgroundColor:'#ddd',height:1,alignSelf:'stretch',flex:1,}}></View>
			</View>;
			if(
				cat_id === 1 ||
				cat_id === 2 ||
				cat_id === 3 ||
				cat_id === 4 ||
				cat_id === 5
			){
				searchBox =
				<View style={{flexDirection:'row',marginTop:10,backgroundColor:'#f0f0f0',borderWidth:1,borderColor:'#ddd'}}>
					<View style={{flex:1}}>
						<TextInput underlineColorAndroid='transparent' placeholder='Ketik Disini' style={{color:'#555',padding:5,paddingLeft:10,paddingRight:0,margin:0}} onChangeText={(teks)=>this.setState({articleSearch:teks})} value={this.state.articleSearch}/>
					</View>
					<View style={{alignItems:'center',flexDirection:'row'}}>
						<IonIcon style={{padding:10,paddingTop:0,paddingBottom:0,color:'#999',fontSize:33}} name='ios-arrow-round-forward-outline' onPress={()=>this._search()}/>
					</View>
				</View>
			}
			return (
				<View style={{flexDirection:'row',margin:15,marginTop:0}}>
					<View style={{flex:5}}>
						<View style={{flexDirection:'row',justifyContent:'center'}}>
							<Text style={{fontSize:16}}>
								{pagetitle}
							</Text>
							{page_subname}
						</View>
						{searchBox}
					</View>
				</View>
			);
		}
		else{
			return;
		}
	}

	render(){
		return(
			<View>

				<ScrollView onScroll={this.props.hideBtnOnScroll} style={{backgroundColor:'#eaeaea'}} refreshControl={this._refreshControl()} ref='ScrollView'>

					<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#f0f0f0',paddingTop:15}}>

						{this._pageTitle()}

						{this.state.articleLatestComp}

					</View>

					<FooterSM ScrollView={this.state.ScrollView}/>

				</ScrollView>
				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

			</View>
		);
	}

}
