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

import { StyleProvider, Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { base_url, api_uri } from '../../comp/AppConfig';
import Styles from '../Styles';
import FooterSM from '../FooterSM';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ComList from './ComList';
import ComGrid from './ComGrid';
import getTheme from '../../../native-base-theme/components';

var try_request_1 = 0;
var try_limit_1 = 10;

var try_request_2 = 0;
var try_limit_2 = 10;

var	contentHeight = {};
var toolHeight = 0;

export default class List extends Component{

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);
		this.loadmoreColor = new Animated.Value(0);
		this.loadmoreScale = new Animated.Value(0);
		this.state = {
			dimensions:Dimensions.get('window'),
			pageView:'list',
			listComp:<Spinner/>,
			gridComp:<Spinner style={{flex:1}}/>,
			gridPage:0,
			gridData:[],
			ScrollView:this.refs.ScrollView,
		}
	}

	componentDidMount(){
		Actions.refresh({key:'IKdrawer',open:value=>false,active1:4,active2:0});
		this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView},()=>{
			this._loadmoreColor();
			this._loadmoreScale();
			this._getList();
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

	_getList(){

		var temp = [];
		var query = {};

		query['table'] = 'tbl_video_categories';
		query['where[status#=]'] = 'show';
		query['orderby[order]'] = 'ASC';
		query['injected[gallery_video]'] = true;

		let resource = api_uri+'universal?'+ArrayToQueryString(query);
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);

		newComFetch.setResource(resource);
		newComFetch.sendFetch((rsp) => {
			if(rsp.status === 200){

				let data = rsp.data;
				let compList = [];

				for(i in data){
					compList.push(<ComList key={i} data={data[i]} from={'ik'} gotoContent={(loop)=>(this._gotoContent(loop))} setHeight={(loop,height)=>(this._setHeight(loop,height))}/>);
				}

				this.setState({
					listComp:compList,
				});

				try_request_1 = 0;

			}
			else{
				if(try_request_1 <= try_limit_1){
					var thos = this;
					setTimeout(function(){
						try_request_1++;
						thos._getList();
					},5000);
				}
				else{
					//alert('error');
				}
				//console.trace('error '+rsp.status);
			}

		});

	}

	_getGrid(){

		var temp = [];
		var query = {};

		query['table'] = 'tbl_video';
		query['where[trash_status#=]'] = 'N';
		query['orderby[published_datetime]'] = 'DESC';
		query['paginate'] = 'true';
		query['per_page'] = 10;
		query['injected[list_video]'] = true;
		query['page'] = this.state.gridPage+1;

		temp = this.state.gridData;

		let compList = [];
		if(temp.length > 0){
			for(i in temp){
				compList.push(<ComGrid key={i} data={temp[i]} from={'ik'}/>);
			}
			compList.push(
				<Spinner style={{height:40,marginBottom:15,width:this.state.dimensions.width-20}} key={temp.length++}/>
			);
			this.setState({
				gridComp:compList,
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
					compList.push(<ComGrid key={i} data={newTemp[i]} from={'ik'}/>);
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
						<View key={data.total} style={{width:this.state.dimensions.width-40,margin:10,marginBottom:15}}>
							<TouchableHighlight underlayColor='transparent' style={{flexDirection:'row',justifyContent:'center'}} onPress={()=>{this._getGrid()}}>
								<Animated.Text style={{transform:[{scale:loadmoreScale}],color:loadmoreColor}}><IonIcon name='ios-arrow-round-down-outline' style={{fontSize:50}}/></Animated.Text>
							</TouchableHighlight>
						</View>
					);

				}

				this.setState({
					gridComp:compList,
					gridPage:data.current_page,
					gridData:newTemp,
				});

				try_request_2 = 0;

			}
			else{
				if(try_request_2 <= try_limit_2){
					var thos = this;
					setTimeout(function(){
						try_request_2++;
						thos._getGrid();
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
			listComp:<Spinner/>,
			gridComp:<Spinner style={{flex:1}}/>,
			gridPage:0,
			gridData:[],
		},
		()=>{
			this._getList();
			this._getGrid();
		});
	}

	_changeTab(type){
		this.setState({
			pageView:type,
		},()=>{
			if(this.state.gridPage < 1){
				this._getGrid();
			}
		});
	}

	_setHeight(loop,height){
		contentHeight[loop] = height;
	}

	_setToolHeight(e){
		toolHeight = e.nativeEvent.layout.height;
	}

	_gotoContent(loop){

		let height = toolHeight;

		if(parseInt(loop) > 0){
			for(var i = 0;i < loop;i++){
				height += contentHeight[i]+20;
			}
		}

		this.refs.ScrollView.scrollTo({x:0,y:height,animated:true});

	}

	render(){

		let styleContentBox = {};
		if(this.state.pageView == 'grid'){
			styleContentBox.flexDirection = 'row';
			styleContentBox.flexWrap = 'wrap';
			styleContentBox.paddingLeft = 5;
			styleContentBox.paddingRight = 5;
		}

		let styleBtnList = {touch:{},ico:{fontSize:35,color:'#999',textAlign:'center',}};
		if(this.state.pageView == 'list'){styleBtnList.ico.color = '#b35e27';}

		let styleBtnGrid = {touch:{},ico:{fontSize:25,color:'#999',textAlign:'center',}};
		if(this.state.pageView == 'grid'){styleBtnGrid.ico.color = '#b35e27';}

		let content = <View/>
		if(this.state.pageView === 'list'){
			content = this.state.listComp;
		}
		else{
			content = this.state.gridComp;
		}

		return(
			<View>
				
				<ScrollView onScroll={this.props.hideBtnOnScroll} style={{backgroundColor:'#eaeaea'}} refreshControl={this._refreshControl()} ref='ScrollView'>

					<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#f0f0f0'}}>

						<View style={{flexDirection:'row',margin:15}} onLayout={(e)=>this._setToolHeight(e)}>
							<View style={{flex:3}}>
								<View style={{flexDirection:'row'}}>
									<Text style={{fontSize:16}}>
										<Text style={{fontSize:16}}>Galeri Video</Text>
									</Text>
								</View>
								<View style={{height:1,alignSelf:'stretch',flexDirection:'row',marginTop:5}}>
									<View style={{backgroundColor:'#ddd',height:1,alignSelf:'stretch',flex:1,}}></View>
								</View>
							</View>
							<View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
								<TouchableHighlight underlayColor='transparent' style={styleBtnList.touch} onPress={()=>{this._changeTab('list')}}>
									<IonIcon style={styleBtnList.ico} name='ios-list-outline'/>
								</TouchableHighlight>
								<View style={{height:25,width:1,marginLeft:15,marginRight:15,backgroundColor:'#ddd'}}/>
								<TouchableHighlight underlayColor='transparent' style={styleBtnGrid.touch} onPress={()=>{this._changeTab('grid')}}>
									<IonIcon style={styleBtnGrid.ico} name='ios-apps-outline'/>
								</TouchableHighlight>
							</View>
						</View>
						<View style={styleContentBox}>
							{content}
						</View>
					</View>

					<FooterSM ScrollView={this.state.ScrollView}/>

				</ScrollView>
				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

			</View>
		);
	}

}
