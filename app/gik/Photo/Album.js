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
import { Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { base_url, api_uri } from '../../comp/AppConfig';
import Styles from '../Styles';
import FooterSM from '../FooterSM';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import ComList from './ComList';
import IonIcon from 'react-native-vector-icons/Ionicons';

var try_request = 0;
var try_limit = 10;

export default class Album extends Component{

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);
		this.loadmoreColor = new Animated.Value(0);
		this.loadmoreScale = new Animated.Value(0);
		this.state = {
			dimensions:Dimensions.get('window'),
			gridComp:<Spinner style={{flex:1}}/>,
			gridPage:0,
			gridData:[],
			ScrollView:this.refs.ScrollView,
		}
	}

	componentDidMount(){
		this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView},()=>{
			this._loadmoreColor();
			this._loadmoreScale();
			this._getGrid();
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

	_showModal(img,title,i){
		if(img){
			let data = {
				data:this.state.gridData,
				imgSource:img,
				imgTitle:title,
				imgActive:i,
				count_photo:this.state.gridData.length,
			};
			Actions.GIKPhotoSlide(data);
		}
	}

	_getGrid(){

		var temp = [];
		var query = {};

		query['table'] = 'tbl_media';
		query['where[trash_status#=]'] = 'N';
		query['injected[album_photo]'] = true;
		query['injected[album_photo][dimensions_width]'] = this.state.dimensions.width;
		query['paginate'] = 'true';
		query['per_page'] = 12;
		if(
			typeof this.props.data.foto !== 'undefined' &&
			typeof this.props.data.foto.gallery_id !== 'undefined'
		){
			query['where[gallery_id#=]'] = this.props.data.foto.gallery_id;
		}
		query['page'] = this.state.gridPage+1;

		temp = this.state.gridData;

		let compList = [];
		if(temp.length > 0){
			for(i in temp){
				compList.push(<ComList key={i} data={temp[i]} from={'gik'} showModal={(img,title)=>{this._showModal(img,title)}}/>);
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

				let oldTemp = new Array();

				let data = rsp.data;

				for(i in temp){
					oldTemp.push(temp[i]);
				}

				let newTemp = oldTemp.concat(data.data)

				let compList = [];

				for(i in newTemp){
					let a = i;
					compList.push(<ComList key={i} data={newTemp[i]} from={'gik'} showModal={(img,title)=>{this._showModal(img,title,a)}}/>);
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
						<View key={data.total} style={{flex:1,margin:7.5,marginTop:5,marginBottom:15}}>
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

				try_request = 0;

			}
			else{
				if(try_request <= try_limit){
					var thos = this;
					setTimeout(function(){
						try_request++;
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
			gridComp:<Spinner style={{flex:1}}/>,
			gridPage:0,
			gridData:[],
		},
		()=>{
			this._getGrid();
		});
	}

	_gotoArticle(){
		if(
			typeof this.props.data.article_detail !== 'undefined' &&
			typeof this.props.data.tbl_reference !== 'undefined' &&
			this.props.data.tbl_reference !== 'gik' &&
			this.props.data.article_detail
		){
			return(
				<TouchableHighlight
					underlayColor='transparent'
					style={{margin:15,marginTop:0}}
					onPress={()=>Actions.GIKArticleDetail(this.props.data)}
				>
					<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
						<IonIcon name='ios-paper-outline' style={{fontSize:20,marginRight:10,color:'#b76329'}}/><Text style={{color:'#b76329'}}>Baca Artikel</Text>
					</View>
				</TouchableHighlight>
			);
		}
		else{
			return;
		}
	}

	render(){

		return(
			<ScrollView style={{backgroundColor:'#eaeaea'}} refreshControl={this._refreshControl()} ref='ScrollView'>

				<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#f0f0f0'}}>

					<View style={{flexDirection:'row',margin:15}}>
						<View style={{flex:5}}>
							<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
								<Text style={{fontSize:16,textAlign:'center'}}>
									{ typeof this.props.data.foto !== 'undefined' && typeof this.props.data.foto.gallery_title !== 'undefined' ? this.props.data.foto.gallery_title : 'Foto Album'}
								</Text>
							</View>
							<View style={{height:1,alignSelf:'stretch',flexDirection:'row',marginTop:15}}>
								<View style={{backgroundColor:'#ddd',height:1,alignSelf:'stretch',flex:1,}}></View>
							</View>
						</View>
					</View>

					{this._gotoArticle()}

					<View style={{
						padding:7.5,
						paddingTop:0,
						paddingBottom:0,
						flexDirection:'row',
						flexWrap:'wrap',
					}}>
						{this.state.gridComp}
					</View>

				</View>

				<FooterSM ScrollView={this.state.ScrollView}/>

			</ScrollView>
		);
	}

}
