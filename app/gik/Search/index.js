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
import { base_url, api_uri } from '../../comp/AppConfig';
import Styles from '../Styles';
import FooterSM from '../FooterSM';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ItemList from './ItemList';
import { Actions } from 'react-native-router-flux';

var try_request = 0;
var try_limit = 10;

export default class Search extends Component{

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);
		this.loadmoreColor = new Animated.Value(0);
		this.loadmoreScale = new Animated.Value(0);
		this.state = {
			dimensions:Dimensions.get('window'),
			data:{
				category:this.props.searchCategory,
				kanal:this.props.searchKanal,
				province:this.props.searchProvince,
				text:this.props.searchText,
				type:this.props.searchType,
			},
			searchComp:<Spinner/>,
			searchPage:0,
			searchData:[],
			ScrollView:this.refs.ScrollView,
		}
	}

	componentDidMount(){
		Actions.refresh({key:'IKdrawer',open:value=>false});
		this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView},()=>{
			this._loadmoreColor();
			this._loadmoreScale();
			this._getHighlight('search');
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

	_getHighlight(type){

		// Ambil data artikel terbaru
		// Untuk highlight home pakai cat_id 1,2,3,4,5,10

		var temp = [];
		var query = {};
		query['table'] = 'ika_home_highlight';
		query['where[trash_status#=]'] = 'N';
		query['where[status#=]'] = 'publish';
		//query['where[tipe#=]'] = 'artikel';
		//query['whereIn[cat_id]'] = '1,2,3,4,5,10';
		//query['where[tbl_reference#=]'] = 'gik_news';
		query['where[kanal#=]'] = 'galeri-indonesia-kaya';
		query['paginate'] = 'true';
		query['per_page'] = 10;
		query['injected[list_search]'] = true;
		query['injected[list_search][dimensions_width]'] = this.state.dimensions.width;

		if(typeof this.state.data.category !== 'undefined' && this.state.data.category){
			query['injected[list_search][category]'] = JSON.stringify(this.state.data.category);
		}

		if(typeof this.state.data.kanal !== 'undefined' && this.state.data.kanal){
			query['injected[list_search][kanal]'] = this.state.data.kanal;
		}

		if(typeof this.state.data.province !== 'undefined' && this.state.data.province){
			query['injected[list_search][province]'] = JSON.stringify(this.state.data.province);
		}

		if(typeof this.state.data.text !== 'undefined' && this.state.data.text){
			query['injected[list_search][text]'] = this.state.data.text;
		}

		if(typeof this.state.data.type !== 'undefined' && this.state.data.type){
			query['injected[list_search][type]'] = JSON.stringify(this.state.data.type);
		}

		query['page'] = this.state.searchPage+1;
		query['orderby[sort_view]'] = 'DESC';
		query['orderby[published_date]'] = 'DESC';
		temp = this.state.searchData;

		let compList = [];
		if(temp.length > 0){
			for(i in temp){
				compList.push(<ItemList key={i} data={temp[i]} from='gik'/>);
			}
			compList.push(
				<Spinner key={temp.length++}/>
			);
			this.setState({
				searchComp:compList,
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
					compList.push(<ItemList key={i} data={newTemp[i]} from='gik'/>);
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
						<TouchableHighlight underlayColor='transparent' key={data.total} style={{flexDirection:'row',justifyContent:'center',margin:15,marginTop:0}} onPress={()=>{this._getHighlight(type)}}>
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
					searchComp:compList,
					searchPage:data.current_page,
					searchData:newTemp,
				});

				try_request = 0;

			}
			else{
				if(try_request <= try_limit){
					var thos = this;
					setTimeout(function(){
						try_request++;
						thos._getHighlight(type);
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
			data:this.state.data,
			searchComp:<Spinner/>,
			searchPage:0,
			searchData:[],
		},
		()=>{
			this._getHighlight();
		});
	}

	render(){
		return(
			<View>

				<ScrollView onScroll={this.props.hideBtnOnScroll} style={{backgroundColor:'#eaeaea'}} refreshControl={this._refreshControl()} ref='ScrollView'>

					{/* start article */}

					<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#f0f0f0',paddingTop:15}}>
						{this.state.searchComp}
					</View>

					{/* end article */}

					<FooterSM ScrollView={this.state.ScrollView}/>

				</ScrollView>
				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

			</View>
		);
	}

}
