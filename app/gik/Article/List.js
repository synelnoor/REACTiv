// Import dependencies
import React, { Component } from 'react';

import {
	Text,
	View,
	ScrollView,
	RefreshControl,
	Dimensions,
	TouchableHighlight,
	Animated,
	Easing
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { base_url, api_uri } from '../../comp/AppConfig';
import Styles from '../Styles';
import FooterSM from '../FooterSM';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ItemList from '../../comp/ItemList';
import ItemListFirst from '../../comp/ItemListFirst';
import SlideReservation from '../../comp/SlideReservation';
import ModalReservation from '../../comp/ModalReservation';

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
			articleLatestComp:<Spinn/>,
			articleLatestPage:0,
			articleLatestData:[],
			articleLatestFirstComp:<Spinn/>,
			articleLatestFirstCount:0,
			ScrollView:this.refs.ScrollView,
		}
	}

	componentDidMount(){
		Actions.refresh({key:'GIKdrawer',open:value=>false});
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

 	_showModal(e){
		this.ModalReservation._switchModal(e);
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

		query['where[tipe#=]'] = 'artikel';
		query['where[tbl_reference#=]'] = 'gik_news';

		query['paginate'] = 'true';
		query['per_page'] = 10;
		query['injected[list_article]'] = true;
		query['injected[list_article][dimensions_width]'] = this.state.dimensions.width;
		query['injected[list_article][gik]'] = true;
		query['page'] = this.state.articleLatestPage+1;

		temp = this.state.articleLatestData;

		let compList = [];
		if(temp.length > 0){
			for(i in temp){
				if(i > 1){
					compList.push(<ItemList key={i} data={temp[i]} showModal={(e)=>{this._showModal(e)}} from='gik'/>);
				}
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
					if(i < 1){
						if(this.state.articleLatestFirstCount < 1){
							this.setState({
								articleLatestFirstComp:<ItemListFirst key={i} data={newTemp[i]} showModal={(e)=>{this._showModal(e)}} from='gik'/>,
								articleLatestFirstCount:1,
							});
						}
					}
					else{
						compList.push(<ItemList key={i} data={newTemp[i]} showModal={(e)=>{this._showModal(e)}} from='gik'/>);
					}
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
			articleLatestComp:<Spinn/>,
			articleLatestPage:0,
			articleLatestData:[],
		},
		()=>{
			this._getHighlight();
		});
	}

	render(){
		return(
			<View>

				<ScrollView onScroll={this.props.hideBtnOnScroll} style={{backgroundColor:'#eaeaea'}} refreshControl={this._refreshControl()} ref='ScrollView'>

					<View>
						<ModalReservation ref={(e)=>this.ModalReservation = e}/>
					</View>

					<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#f0f0f0'}}>

						<View style={{flexDirection:'row',margin:15,marginBottom:0}}>
							<View style={{flex:5}}>
								<View style={{flexDirection:'row'}}>
									<Text style={{fontSize:16}}>
										Berita
									</Text>
								</View>
								<View style={{height:1,alignSelf:'stretch',flexDirection:'row',marginTop:5}}>
									<View style={{backgroundColor:'#ddd',height:1,alignSelf:'stretch',flex:1,}}></View>
								</View>
							</View>
						</View>

						{this.state.articleLatestFirstComp}

						<SlideReservation/>

						<View style={{marginTop:15}}>
							{this.state.articleLatestComp}
						</View>

					</View>

					<FooterSM ScrollView={this.state.ScrollView}/>

				</ScrollView>
				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

			</View>
		);
	}

}
