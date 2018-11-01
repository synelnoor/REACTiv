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
import { Actions } from 'react-native-router-flux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Spinner } from 'native-base';

import { base_url, api_uri } from '../../comp/AppConfig';
import Styles from '../../comp/Styles';
import ComHomeBanner from './ComHomeBanner';
import FooterSM from '../FooterSM';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ItemList from '../../comp/ItemList';
import SlideReservation from '../../comp/SlideReservation';
import ModalReservation from '../../comp/ModalReservation';
import SlideSorotan from '../../comp/SlideSorotan';
import ComLocalStorage from '../../comp/ComLocalStorage';

import Loading from '../../comp/Loading';
import Spinn from '../../comp/Spinn';


let perPage = 10;
let try_request = 0;
let try_limit = 5;

export default class Home extends Component{
	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);

		this.ismount = false;
		this.loadmoreColor = new Animated.Value(0);
		this.loadmoreScale = new Animated.Value(0);
		this.state = {
			dimensions:Dimensions.get('window'),
			articleLatestComp:<Spinn/>,
			articleLatestPage:0,
			articleLatestData:[],
			articleLatestNPU:null,
			ScrollView:this.refs.ScrollView,
		}
	}

	componentDidMount(){
		this.setState({
			dimensions:Dimensions.get('window'),
			ScrollView:this.refs.ScrollView
		},()=>{
			Actions.refresh({key:'GIKdrawer',open:value=>false});
			this.ismount = true;
			this._loadmoreColor();
			this._loadmoreScale();
			this._getHighlight();
		});
	}

	componentWillUnmount(){
		this.ismount = false;
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
		
		let LocalStorage = new ComLocalStorage();
		LocalStorage.getItemByKey('@gik_news:articleLatest',(e)=>{
			this.setState({loading:true})
			let stateCurrentPage = 0;
			let localCurrentPage = 0;

			let eNew = null;
			if(e !== null){
				eNew = JSON.parse(e);
			}

			stateCurrentPage = this.state.articleLatestPage;
			localCurrentPage = eNew !== null ? eNew.articleLatestPage : 0;

			if(localCurrentPage > 0 && localCurrentPage > stateCurrentPage){
				this._buildHighlight(e);
			}
			else{
				let temp = [];
				let query = {};
				query['table'] = 'ika_home_highlight';
				query['where[trash_status#=]'] = 'N';
				query['where[status#=]'] = 'publish';
				query['where[tipe#=]'] = 'artikel';
				//query['whereIn[cat_id]'] = '1,2,3,4,5,10';
				query['where[tbl_reference#=]'] = 'gik_news';
				query['paginate'] = 'true';
				query['per_page'] = perPage;
				query['injected[list_article]'] = true;
				query['injected[list_article][dimensions_width]'] = this.state.dimensions.width;
				query['injected[list_article][gik]'] = true;

				query['page'] = this.state.articleLatestPage+1;
				query['orderby[sort_view]'] = 'DESC';
				query['orderby[published_date]'] = 'DESC';
				temp = this.state.articleLatestData;

				let compList = [];
				if(temp.length > 0){
					for(let i in temp){
						compList.push(<ItemList key={i} data={temp[i]} showModal={(e)=>{this._showModal(e)}} from='gik'/>);
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

				newComFetch.setResource(resource);
				newComFetch.sendFetch((rsp) => {
					if(rsp.status === 200){
						let data = rsp.data;
						let newTemp = temp.concat(data.data);

						if(this.ismount){
							let LocalStorage = new ComLocalStorage();
							LocalStorage.getItemByKey('@gik_news:articleLatest',(e)=>{
								let eNew = null;
								if(e !== null){
									//eNew = JSON.parse(e); // commented by dandi
								}
								let dataStore = {
									articleLatestPage:data.current_page,
									articleLatestData:newTemp,
									articleLatestNPU:data.next_page_url,
								};
								if(eNew === null || eNew !== null && eNew.articleLatestPage <= this.state.articleLatestPage){
									ComLocalStorage.setItem('gik_news','articleLatest',JSON.stringify(dataStore),()=>{
										this.setState(dataStore,()=>{
											this._buildHighlight(false);
										});
									});
								}
								else{
									this.setState(dataStore,()=>{
										this._buildHighlight(false);
									});
								}
							});
							try_request = 0;
						}
					}
					else{
						if(try_request <= try_limit){
							try_request++;
							this._getHighlight();
						}
						else{
							this._buildHighlight(true);
							//alert('error');
						}
						//console.trace('error '+rsp.status);
					}
				});
			}
		});
	}

	_buildHighlight(storage){
		if(storage){
			if(typeof storage === 'boolean'){
				let LocalStorage = new ComLocalStorage();
				LocalStorage.getItemByKey('@gik_news:articleLatest',(e)=>{
					this._generateStorage(e);
				});
			}
			else{
				this._generateStorage(storage);
			}
		}
		else{
			let temp = [];
			let npu = null;
			temp = this.state.articleLatestData;
			npu = this.state.articleLatestNPU;
			this._generateHighlight(temp,npu);
		}
	}

	_generateHighlight(temp,npu){
		let compList = [];
		for(let i in temp){
			compList.push(<ItemList key={i} data={temp[i]} showModal={(e)=>{this._showModal(e)}} from='gik'/>);
		}
		if(npu !== null){
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
				<TouchableHighlight underlayColor='transparent' key={temp.length} style={{flexDirection:'row',justifyContent:'center',margin:15,marginTop:0}} onPress={()=>{this._getHighlight()}}>
					<Animated.Text style={{transform:[{scale:loadmoreScale}],color:loadmoreColor}}><IonIcon name='ios-arrow-round-down-outline' style={{fontSize:50}}/></Animated.Text>
				</TouchableHighlight>
			);
		}

		if(this.ismount){
			//let ScrollView = this.refs.ScrollView;
			this.setState({
				articleLatestComp:compList,
			},()=>{
				/*setTimeout(()=>{
					if(typeof ScrollView !== 'undefined' && ScrollView !== '' && contentOffset0 > 0){
						ScrollView.scrollTo({x:0,y:contentOffset0,animated:true});
					}
				},1000);*/
			});
		}
	}

	_generateStorage(e){
		if(e !== null){
			let temp = [];
			let tempNew = [];
			let npu = null;
			let eParse = JSON.parse(e);

			let articleLatestPage = this.state.articleLatestPage+1;
			tempNew = eParse.articleLatestData;
			npu = eParse.articleLatestNPU;
			for(let i in tempNew){
				if(temp.length < articleLatestPage*perPage && tempNew[i] !== null){
					temp.push(tempNew[i]);
				}
			}
			this.setState({
				articleLatestPage:articleLatestPage,
				articleLatestData:temp,
				articleLatestNPU:npu,
			},()=>{
				this._generateHighlight(temp,npu);
			});
		}
		else{
			this.setState({
				articleLatestComp:<Text key={1} style={{backgroundColor:'#fff',padding:10,marginLeft:15,marginRight:15,textAlign:'center',color:'#888'}}>DATA OFFLINE TIDAK TERSEDIA, HARAP SEGARKAN HALAMAN</Text>
			});
		}
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

				<ScrollView style={{backgroundColor:'#eaeaea'}} refreshControl={this._refreshControl()} ref='ScrollView'>
					<View>
						<ModalReservation ref={(e)=>this.ModalReservation = e}/>
					</View>

					{/* start article */}
					<View style={{minHeight:this.state.dimensions.height/1.5,backgroundColor:'#f0f0f0'}}>
						<ComHomeBanner/>

						<View style={{marginTop:-1}}>
							<SlideReservation/>
						</View>

						<View style={{marginTop:15}}>
							{this.state.articleLatestComp}
						</View>
					</View>

					<SlideSorotan/>
					{/* end article */}

					<FooterSM ScrollView={this.state.ScrollView}/>
				</ScrollView>
				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

			</View>
		);
	}
}
