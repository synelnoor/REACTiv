// Import dependencies
import React, { Component } from 'react';

import {
	Text,
	View,
	ScrollView,
	RefreshControl,
	Picker,
	Dimensions,
	TouchableHighlight,
	Animated,
	Easing
} from 'react-native';
const ItemPicker = Picker.Item;
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Spinner } from 'native-base';
//import { Actions } from 'react-native-router-flux';
import { base_url, api_uri } from '../../comp/AppConfig';
import Styles from '../Styles';
import FooterSM from '../FooterSM';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ItemList from './ItemList';

var try_request1 = 0;
var try_limit1 = 10;

var try_request2 = 0;
var try_limit2 = 10;

export default class Sorotan extends Component{

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);
		this.loadmoreColor = new Animated.Value(0);
		this.loadmoreScale = new Animated.Value(0);
		this.state = {
			year:'semua',
			yearComp:<ItemPicker color='#767676' style={{margin:0,padding:0}} label='Semua' value='semua'/>,
			dimensions:Dimensions.get('window'),
			sorotanComp:<Spinner/>,
			sorotanPage:0,
			sorotanData:[],
			ScrollView:this.refs.ScrollView,
		}
	}

	componentDidMount(){
		this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView},()=>{
			this._loadmoreColor();
			this._loadmoreScale();
			this._getSorotan();
			this._getSorotanYear();
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

	_getSorotan(){

		var temp = [];
		var query = {};

		query['table'] = 'gik_sorotan';
		query['where[trash_status#=]'] = 'N';
		query['orderby[create_datetime]'] = 'DESC';
		query['paginate'] = 'true';
		query['per_page'] = 10;
		query['injected[gik_sorotan]'] = true;
		query['injected[gik_sorotan][dimensions_width]'] = this.state.dimensions.width;
		query['page'] = this.state.sorotanPage+1;
		if(this.state.year !== 'semua'){
			query['injected[gik_sorotan][year]'] = this.state.year;
		}

		temp = this.state.sorotanData;
		let compList = [];
		if(temp.length > 0){
			for(q in temp){
				compList.push(<ItemList key={q} data={temp[q]} from='gik'/>);
			}
			compList.push(
				<Spinner key={temp.length++}/>
			);
			this.setState({
				sorotanComp:compList,
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

				for(q in newTemp){
					compList.push(<ItemList key={q} data={newTemp[q]} from='gik'/>);
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
						<TouchableHighlight underlayColor='transparent' key={data.total} style={{flexDirection:'row',justifyContent:'center',margin:15,marginTop:0}} onPress={()=>{this._getSorotan()}}>
							<Animated.Text style={{transform:[{scale:loadmoreScale}],color:loadmoreColor}}><IonIcon name='ios-arrow-round-down-outline' style={{fontSize:50}}/></Animated.Text>
						</TouchableHighlight>
					);

				}

				this.setState({
					sorotanComp:compList,
					sorotanPage:data.current_page,
					sorotanData:newTemp,
				});

				try_request1 = 0;

			}
			else{
				if(try_request1 <= try_limit1){
					var thos = this;
					setTimeout(function(){
						try_request1++;
						thos._getSorotan();
					},5000);
				}
				else{
					//alert('error');
				}
				//console.trace('error '+rsp.status);
			}

		});

	}

	_getSorotanYear(){

		var query = {};
		query['table'] = 'gik_sorotan';
		query['where[trash_status#=]'] = 'N';
		query['injected[gik_sorotan]'] = true;
		query['injected[gik_sorotan][group_year]'] = true;
		let resource = api_uri+'universal?'+ArrayToQueryString(query);
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);

		// Ambil data Article
		newComFetch.setResource(resource);

		newComFetch.sendFetch((rsp) => {

			if(rsp.status === 200){

				let data = rsp.data;
				let yearComp = [];
				yearComp.push(<ItemPicker key={0} color='#767676' style={{margin:0,padding:0}} label='Semua' value='semua'/>);
				for(q in data){
					let year = data[q].year;
					yearComp.push(<ItemPicker key={year} color='#767676' style={{margin:0,padding:0}} label={year} value={year}/>);
				}
				this.setState({
					yearComp:yearComp,
				});

				try_request2 = 0;

			}
			else{
				if(try_request2 <= try_limit2){
					var thos = this;
					setTimeout(function(){
						try_request2++;
						thos._getSorotanYear();
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
			sorotanComp:<Spinner/>,
			sorotanPage:0,
			sorotanData:[],
		},
		()=>{
			this._getSorotan();
		});
	}

	_onValueChange(year){
		if(typeof year !== 'undefined' && year){
			this.setState({
				year:year,
				sorotanComp:<Spinner/>,
				sorotanPage:0,
				sorotanData:[],
			},()=>{
				this._getSorotan();
			});
		}
	}

	_pageTitle(){
		return (
			<View style={{flexDirection:'row',margin:15,marginTop:0}}>
				<View style={{flex:5}}>
					<View style={{flexDirection:'row',justifyContent:'center'}}>
						<Text style={{fontSize:16}}>
							SOROTAN GALERI INDONESIA KAYA
						</Text>
					</View>
					<View style={{marginTop:10,backgroundColor:'#f0f0f0',borderWidth:1,borderColor:'#ddd'}}>
						<Picker
							style={{margin:0,padding:0,color:'#767676'}}
							mode='dropdown'
							selectedValue={this.state.year}
							onValueChange={(year)=>this._onValueChange(year)}
						>
							{this.state.yearComp}
						</Picker>
					</View>
				</View>
			</View>
		);
	}

	render(){
		return(
			<ScrollView style={{backgroundColor:'#eaeaea'}} refreshControl={this._refreshControl()} ref='ScrollView'>

				<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#f0f0f0',paddingTop:15}}>

					{this._pageTitle()}

					{this.state.sorotanComp}

				</View>

				<FooterSM ScrollView={this.state.ScrollView}/>

			</ScrollView>
		);
	}

}
