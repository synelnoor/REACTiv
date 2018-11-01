import React, { Component } from 'react';
import {
	Text,
	View,
	ScrollView,
	RefreshControl,
	Dimensions,
	TouchableHighlight,
	Animated,
	Easing,
	PanResponder,
	StyleSheet
    
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { StyleProvider, Spinner, Tab, Tabs, TabHeading } from 'native-base';

import SideMenu from 'react-native-side-menu';

import { base_url, api_uri } from '../../comp/AppConfig';
import Styles from '../../comp/Styles';
import getTheme from '../../../native-base-theme/components';
import FooterSM from '../FooterSM';
import FooterBtm from '../FooterBtm';
import ComHomeBanner from './ComHomeBanner';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ItemList from '../../comp/ItemList';
import ComLocalStorage from '../../comp/ComLocalStorage';

import Loading from '../../comp/Loading';
import Spinn from '../../comp/Spinn';
import MenuEvent from '../../comp/MenuEvent';

// import SideMenu from '../SideMenu';

let perPage = 10;
let try_request = 0;
let try_limit = 5;
let contentOffset0 = 0;
let contentOffset1 = 0;

export default class Home extends Component{
	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);

		this.ismount = false;
		this.loadmoreColor = new Animated.Value(0);
		this.loadmoreScale = new Animated.Value(0);
		let dimensions = Dimensions.get('window');
		this.state = {
			dimensions:dimensions,
			articleLatestComp:<Spinn/>,
			articleLatestPage:0,
			articleLatestData:[],
			articleLatestNPU:null,
			articlePopularComp:<Spinn/>,
			articlePopularPage:0,
			articlePopularData:[],
			articlePopularNPU:null,
			currentTab:0,
			x:null,
			y:null,
			ScrollView:this.refs.ScrollView,
			pan     : new Animated.ValueXY(), 
		}
		this.panResponder = PanResponder.create({    //Step 2
			onStartShouldSetPanResponder : () => true,
			onPanResponderMove           : Animated.event([null,{ //Step 3
				dx : this.state.pan.x,
				dy : this.state.pan.y
			}]),
			onPanResponderRelease        : (e, gesture) => {
				// console.log('cek',e)
				// console.log('cekGesture',gesture)
				// x = Number.parseInt(gesture.moveX, 10)
				// y = Number.parseInt(gesture.moveY, 10)
				// // x = Number.parseInt(gesture.x0, 10)
				// // y = Number.parseInt(gesture.y0, 10)
				// console.log('x',x)
				// console.log('y',y)
				// this.setState({
				// 	x:gesture.moveX - CIRCLE_RADIUS,
				// 	y:gesture.moveY - CIRCLE_RADIUS
				// })
			} //Step 4
		});
	}

	componentDidMount(){

		let Window = Dimensions.get('window');
		//  var top  = Window.height/1.5 - CIRCLE_RADIUS;
		//  var left =  Window.width/1.3 - CIRCLE_RADIUS;
		
		this.setState({
			// x:left,
			// y:top,
			dimensions:Dimensions.get('window'),
			ScrollView:this.refs.ScrollView
		},()=>{
			Actions.refresh({key:'IKdrawer',open:value=>false,active1:0,active2:0});
			this.ismount = true;
			//this._loadmoreColor();
			//this._loadmoreScale();
			this._getHighlight('articleLatest');
            this._getHighlight('articlePopular');
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

	_getHighlight(type){
		let LocalStorage = new ComLocalStorage();

		LocalStorage.getItemByKey('@ik_home:'+type,(e)=>{
			let stateCurrentPage = 0;
			let localCurrentPage = 0;

			let eNew = null;
			if(e !== null){
				eNew = JSON.parse(e);
			}

			if(type === 'articleLatest'){
				stateCurrentPage = this.state.articleLatestPage;
				localCurrentPage = eNew !== null ? eNew.articleLatestPage : 0;
			}
			else{
				stateCurrentPage = this.state.articlePopularPage;
				localCurrentPage = eNew !== null ? eNew.articlePopularPage : 0;
			}

			if(localCurrentPage > 0 && localCurrentPage > stateCurrentPage){
				this._buildHighlight(type,e);
			}
			else{
				let temp = [];
				let query = {};

				query['table'] = 'ika_home_highlight';
				query['where[trash_status#=]'] = 'N';
				query['where[status#=]'] = 'publish';
				query['where[tipe#=]'] = 'artikel';
				query['whereIn[cat_id]'] = '1,2,3,4,5,10';
				query['paginate'] = 'true';
				query['per_page'] = perPage;
				query['injected[list_article]'] = true;
				query['injected[list_article][dimensions_width]'] = this.state.dimensions.width;

				if(type === 'articleLatest'){
					query['page'] = this.state.articleLatestPage+1;
					query['orderby[sort_view]'] = 'DESC';
					query['orderby[published_date]'] = 'DESC';
					temp = this.state.articleLatestData;
				}
				else{
					query['page'] = this.state.articlePopularPage+1;
					query['orderby[popular_count]'] = 'DESC';
					temp = this.state.articlePopularData;
				}

				let compList = [];
				if(temp.length > 0){
					for(let i in temp){
						compList.push(<ItemList key={i} data={temp[i]} from='ik'/>);
					}
					compList.push(
						<Spinn key={temp.length++}/>
					);
					if(type === 'articleLatest'){
						this.setState({
							articleLatestComp:compList,
						});
					}
					else{
						this.setState({
							articlePopularComp:compList,
						});
					}
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
							if(type === 'articleLatest'){
								LocalStorage.getItemByKey('@ik_home:'+type,(e)=>{
									let eNew = null;
									if(e !== null){
										eNew = JSON.parse(e);
									}
									let dataStore = {
										articleLatestPage:data.current_page,
										articleLatestData:newTemp,
										articleLatestNPU:data.next_page_url,
									};
									if(eNew === null || eNew !== null && eNew.articleLatestPage <= this.state.articleLatestPage){
										ComLocalStorage.setItem('ik_home',type,JSON.stringify(dataStore),()=>{
											this.setState(dataStore,()=>{
												this._buildHighlight('articleLatest',false);
											});
										});
									}
									else{
										this.setState(dataStore,()=>{
											this._buildHighlight('articleLatest',false);
										});
									}
								});
							}
							else{
								LocalStorage.getItemByKey('@ik_home:'+type,(e)=>{
									let eNew = null;
									if(e !== null){
										eNew = JSON.parse(e);
									}
									let dataStore = {
										articlePopularPage:data.current_page,
										articlePopularData:newTemp,
										articlePopularNPU:data.next_page_url,
									};
									if(eNew === null || eNew !== null && eNew.articlePopularPage <= this.state.articlePopularPage){
										ComLocalStorage.setItem('ik_home',type,JSON.stringify(dataStore),()=>{
											this.setState(dataStore,()=>{
												this._buildHighlight('articlePopular',false);
											});
										});
									}
									else{
										this.setState(dataStore,()=>{
											this._buildHighlight('articlePopular',false);
										});
									}
								});
							}
							try_request = 0;
						}
					}
					else{
						if(try_request <= try_limit){
							try_request++;
							this._getHighlight(type);
						}
						else{
							this._buildHighlight(type,true);
							//alert('error');
						}
						//console.trace('error '+rsp.status);
					}
				});
			}
		});
	}

	_buildHighlight(type,storage){
		if(storage){
			if(typeof storage === 'boolean'){
				let LocalStorage = new ComLocalStorage();
				LocalStorage.getItemByKey('@ik_home:'+type,(e)=>{
					this._generateStorage(type,e);
				});
			}
			else{
				this._generateStorage(type,storage);
			}
		}
		else{
			let temp = [];
			let npu = null;
			if(type === 'articleLatest'){
				temp = this.state.articleLatestData;
				npu = this.state.articleLatestNPU;
			}
			else{
				temp = this.state.articlePopularData;
				npu = this.state.articlePopularNPU;
			}
			this._generateHighlight(type,temp,npu);
		}
	}

	_generateHighlight(type,temp,npu){
		let compList = [];
		for(let i in temp){
			compList.push(<ItemList key={i} data={temp[i]} from='ik'/>);
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
				<TouchableHighlight underlayColor='transparent' key={temp.length} style={{flexDirection:'row',justifyContent:'center',margin:15,marginTop:0}} onPress={()=>{this._getHighlight(type)}}>
					<Animated.Text style={{transform:[{scale:loadmoreScale}],color:loadmoreColor}}><IonIcon name='ios-arrow-round-down-outline' style={{fontSize:50}}/></Animated.Text>
				</TouchableHighlight>
			);
		}

		if(this.ismount){
			//let ScrollView = this.refs.ScrollView;
			if(type === 'articleLatest'){
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
			else{
				this.setState({
					articlePopularComp:compList,
				},()=>{
					/*setTimeout(()=>{
						if(typeof ScrollView !== 'undefined' && ScrollView !== '' && contentOffset1 > 0){
							ScrollView.scrollTo({x:0,y:contentOffset1,animated:true});
						}
					},1000);*/
				});
			}
		}
	}

	_generateStorage(type,e){
		if(e !== null){
			let temp = [];
			let tempNew = [];
			let npu = null;
			let eParse = JSON.parse(e);

			if(type === 'articleLatest'){
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
					this._generateHighlight(type,temp,npu);
				});
			}
			else{
				let articlePopularPage = this.state.articlePopularPage+1;
				tempNew = eParse.articlePopularData;
				npu = eParse.articlePopularNPU;
				for(let i in tempNew){
					if(temp.length < articlePopularPage*perPage && tempNew[i] !== null){
						temp.push(tempNew[i]);
					}
				}
				this.setState({
					articlePopularPage:articlePopularPage,
					articlePopularData:temp,
					articlePopularNPU:npu,
				},()=>{
					this._generateHighlight(type,temp,npu);
				});
			}
		}
		else{
			let setState = {};
			if(type === 'articleLatest'){
				setState = {
					articleLatestComp:<Text key={1} style={{backgroundColor:'#fff',padding:10,marginLeft:15,marginRight:15,textAlign:'center',color:'#888'}}>DATA OFFLINE TIDAK TERSEDIA, HARAP SEGARKAN HALAMAN</Text>
				};
			}
			else{
				setState = {
					articlePopularComp:<Text key={1} style={{backgroundColor:'#fff',padding:10,marginLeft:15,marginRight:15,textAlign:'center',color:'#888'}}>DATA OFFLINE TIDAK TERSEDIA, HARAP SEGARKAN HALAMAN</Text>
				};
			}
			this.setState(setState);
		}
	}

	_onScroll(e){
		console.log('eve',e)
		if(e === 0 || e === 1){
			let currentTab = this.state.currentTab;
			if(currentTab !== 0 && e === 0){
				this.setState({
					currentTab:0,
					articleLatestComp:<Spinn/>,
					articlePopularComp:<Spinn/>,
				},()=>{
					if(this.state.articleLatestPage === 0){
						this._getHighlight('articleLatest');
					}
					else{
						this._buildHighlight('articleLatest',false);
					}
				});
			}
			else if(currentTab !== 1 && e === 1){
				this.setState({
					currentTab:1,
					articleLatestComp:<Spinn/>,
					articlePopularComp:<Spinn/>,
				},()=>{
					if(this.state.articlePopularPage === 0){
						this._getHighlight('articlePopular');
					}
					else{
						this._buildHighlight('articlePopular',false);
					}
				});
			}
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
		contentOffset0 = 0;
		contentOffset1 = 0;
		ComLocalStorage.removeItem('ik_home','articleLatest',()=>{
			ComLocalStorage.removeItem('ik_home','articlePopular',()=>{
				this.setState({
					articleLatestComp:<Spinn/>,
					articleLatestPage:0,
					articleLatestData:[],
					articleLatestNPU:null,
					articlePopular:<Spinn/>,
					articlePopularPage:0,
					articlePopularData:[],
					articlePopularNPU:null,
				},
				()=>{
					this._getHighlight('articleLatest');
					this._getHighlight('articlePopular');
				});
			});
		});
	}

	_onScrollviewScroll(e){
		//onScroll={(e)=>this._onScrollviewScroll(e)}
		console.log('onscroll',e)
		let ne = e.nativeEvent;
		let y = ne.contentOffset.y;
		if(this.state.currentTab === 0){
			contentOffset0 = y;
		}
		else{
			contentOffset1 = y;
		}
	}

	tabRefresh() {
		this.setState({
			articleLatestComp:<Spinn/>,
			articleLatestPage:0,
			articleLatestData:[],
			articleLatestNPU:null,
			articlePopular:<Spinn/>,
			articlePopularPage:0,
			articlePopularData:[],
			articlePopularNPU:null,
		}, ()=>{
			ComLocalStorage.removeItem('ik_home','articleLatest',()=>{
				this._getHighlight('articleLatest');
			});
			ComLocalStorage.removeItem('ik_home','articlePopular',()=>{
				this._getHighlight('articlePopular');
			});
		});
	}

	renderDraggable(){
		//{bottom:this.state.y, right:this.state.x}
		//{top:this.state.y, left:this.state.x}
        return (
            <View style={[styles.draggableContainer]}>
				<Animated.View 
				{...this.panResponder.panHandlers}  
				style={[ styles.circle,this.state.pan.getLayout()]}>
                   <MenuEvent />
                </Animated.View>
            </View>
        );
    }

	render(){
		return(
			<View>
				<ScrollView 
				//onScroll={this.props.hideBtnOnScroll} 
				style={{backgroundColor:'#eaeaea'}} refreshControl={this._refreshControl()} ref='ScrollView'>
				{/*<ScrollView style={{backgroundColor:'#eaeaea'}} refreshControl={this._refreshControl()} ref='ScrollView'>*/}
					{/* start article */}
					<View style={{minHeight:this.state.dimensions.height/1.5,backgroundColor:'#f0f0f0'}}>
						<ComHomeBanner/>

						<View>
							<Tabs onChangeTab={this.tabRefresh.bind(this)} style={{backgroundColor:'#f0f0f0'}} onScroll={(e)=>this._onScroll(e)}>
								<Tab style={{marginTop:15,backgroundColor:'#f0f0f0'}} heading={<TabHeading style={{backgroundColor:'#fff'}}><Text>TERKINI</Text></TabHeading>}>
									<View>
										{this.state.articleLatestComp}
									</View>
								</Tab>
								<Tab style={{marginTop:15,backgroundColor:'#f0f0f0'}} heading={<TabHeading style={{backgroundColor:'#fff'}}><Text>TERPOPULER</Text></TabHeading>}>
									<View>
										{this.state.articlePopularComp}
									</View>
								</Tab>
							</Tabs>
						</View>
					</View>
					{/* end article */}

					<FooterSM ScrollView={this.state.ScrollView}/>
				</ScrollView>
				{/* <MenuEvent /> */}
				{this.renderDraggable()}

				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}
			</View>
		);
	}
}


//let CIRCLE_RADIUS = 76;
let CIRCLE_RADIUS=56;
let Window = Dimensions.get('window');
let styles = StyleSheet.create({
    mainContainer: {
        flex    : 1
    },
    dropZone    : {
        height         : 100,
        backgroundColor:'#2c3e50'
    },
    text        : {
        marginTop   : 25,
        marginLeft  : 5,
        marginRight : 5,
        textAlign   : 'center',
        color       : '#fff'
    },
    draggableContainer: {
		position    : 'absolute',
        top         : Window.height/1.5 - CIRCLE_RADIUS,
		left        : Window.width/1.3 - CIRCLE_RADIUS,
		// bottom: 80, 
		// right: 10, 
		// bottom: Window.height/2 - CIRCLE_RADIUS, 
		// right:  Window.width/2 - CIRCLE_RADIUS, 
		
    },
    circle      : {
		justifyContent:'center',
		alignItems:'center',
	  	//backgroundColor     : '#1abc9c',
	    backgroundColor		:'transparent',
        width               : CIRCLE_RADIUS*2,
        height              : CIRCLE_RADIUS*2,
        borderRadius        : CIRCLE_RADIUS
    }
});