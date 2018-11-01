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
//const Item = Picker.Item;

import { StyleProvider, Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { base_url, api_uri } from '../../comp/AppConfig';
import Styles from '../Styles';
import FooterSM from '../FooterSM';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ComAlbum from './ComAlbum';
import ComPhoto from './ComPhoto';
import getTheme from '../../../native-base-theme/components';

var try_request_1 = 0;
var try_limit_1 = 10;

var try_request_2 = 0;
var try_limit_2 = 10;

export default class List extends Component{

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);
		this.loadmoreColor = new Animated.Value(0);
		this.loadmoreScale = new Animated.Value(0);
		this.state = {
			dimensions:Dimensions.get('window'),
			category_id:'11',
			pageView:'album',
			albumComp:<Spinner style={{flex:1}}/>,
			albumPage:0,
			albumData:[],
			photoComp:<Spinner style={{flex:1}}/>,
			photoPage:0,
			photoData:[],
			ScrollView:this.refs.ScrollView,
		}
	}

	componentDidMount(){
		Actions.refresh({key:'GIKdrawer',open:value=>false});
		this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView},()=>{
			this._loadmoreColor();
			this._loadmoreScale();
			this._getAlbum();
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
				data:this.state.photoData,
				imgSource:img,
				imgTitle:title,
				imgActive:i,
				count_photo:this.state.photoData.length,
			};
			Actions.GIKPhotoSlide(data);
		}
	}

	_getAlbum(){

		var temp = [];
		var query = {};

		query['table'] = 'tbl_galleries';
		query['where[trash_status#=]'] = 'N';
		query['orderby[create_datetime]'] = 'DESC';
		query['paginate'] = 'true';
		query['per_page'] = 10;
		query['injected[list_photo_album]'] = true;
		query['injected[list_photo_album][width]'] = this.state.dimensions.width;
		if(this.state.category_id !== 'false'){
			query['injected[list_photo_album][cat_id_in]'] = this.state.category_id;
		}
		query['page'] = this.state.albumPage+1;

		temp = this.state.albumData;

		let compAlbum = [];
		if(temp.length > 0){

			for(i in temp){
				compAlbum.push(<ComAlbum key={i} data={temp[i]} from={'ik'}/>);
			}

			compAlbum.push(
				<Spinner style={{height:40,marginTop:15,marginBottom:15,width:this.state.dimensions.width-20}} key={temp.length++}/>
			);

			this.setState({
				albumComp:compAlbum,
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

				let compAlbum = [];

				for(i in newTemp){
					compAlbum.push(<ComAlbum key={i} data={newTemp[i]} from={'ik'}/>);
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

					compAlbum.push(
						<View key={data.total} style={{flex:1,margin:15}}>
							<TouchableHighlight underlayColor='transparent' style={{flexDirection:'row',justifyContent:'center'}} onPress={()=>{this._getAlbum()}}>
								<Animated.Text style={{transform:[{scale:loadmoreScale}],color:loadmoreColor}}><IonIcon name='ios-arrow-round-down-outline' style={{fontSize:50}}/></Animated.Text>
							</TouchableHighlight>
						</View>
					);

				}
				else{
					compAlbum.push(
						<View key={data.total} style={{height:15,width:this.state.dimensions.width-10,backgroundColor:'#fff'}}/>
					);
				}

				this.setState({
					albumComp:compAlbum,
					albumPage:data.current_page,
					albumData:newTemp,
				});

				try_request_1 = 0;

			}
			else{
				if(try_request_1 <= try_limit_1){
					var thos = this;
					setTimeout(function(){
						try_request_1++;
						thos._getAlbum();
					},5000);
				}
				else{
					//alert('error');
				}
				//console.trace('error '+rsp.status);
			}

		});

	}

	_getPhoto(){

		var temp = [];
		var query = {};

		query['table'] = 'tbl_media';
		query['where[trash_status#=]'] = 'N';
		query['where[media_type#=]'] = 'photo';
		query['orderby[create_date]'] = 'DESC';
		query['paginate'] = 'true';
		query['per_page'] = 12;
		query['injected[list_photo_grid]'] = true;
		query['injected[list_photo_grid][dimensions_width]'] = this.state.dimensions.width+300;
		if(this.state.category_id !== 'false'){
			query['injected[list_photo_grid][cat_id_in]'] = this.state.category_id;
		}
		query['page'] = this.state.photoPage+1;

		temp = this.state.photoData;

		let compPhoto = [];
		if(temp.length > 0){

			let loop = 0;

			for(i in temp){

				let a = i;

				let loop_row = loop % 6;
				let loop_hrow = ((loop-1)/2);

				compPhoto.push(<ComPhoto key={i} loop={loop} loop_row={loop_row} loop_hrow={loop_hrow} data={temp[i]} from={'ik'} showModal={(img,title)=>{this._showModal(img,title,a)}}/>);

				loop++;

			}

			compPhoto.push(
				<Spinner style={{height:40,marginTop:15,marginBottom:15,width:this.state.dimensions.width-20}} key={temp.length++}/>
			);

			this.setState({
				photoComp:compPhoto,
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

				let compPhoto = [];

				let loop = 0;

				for(i in newTemp){
					let a = i;

					let loop_row = loop % 6;
					let loop_hrow = ((loop-1)/2);

					compPhoto.push(<ComPhoto key={i} loop={loop} loop_row={loop_row} loop_hrow={loop_hrow} data={newTemp[i]} from={'ik'} showModal={(img,title)=>{this._showModal(img,title,a)}}/>);

					loop++;

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

					compPhoto.push(
						<View key={data.total} style={{flex:1,margin:5,marginTop:15,marginBottom:15}}>
							<TouchableHighlight underlayColor='transparent' style={{flexDirection:'row',justifyContent:'center'}} onPress={()=>{this._getPhoto()}}>
								<Animated.Text style={{transform:[{scale:loadmoreScale}],color:loadmoreColor}}><IonIcon name='ios-arrow-round-down-outline' style={{fontSize:50}}/></Animated.Text>
							</TouchableHighlight>
						</View>
					);

				}
				else{
					compPhoto.push(
						<View key={data.total} style={{height:15,width:this.state.dimensions.width-20,backgroundColor:'#fff'}}/>
					);
				}

				this.setState({
					photoComp:compPhoto,
					photoPage:data.current_page,
					photoData:newTemp,
				});

				try_request_2 = 0;

			}
			else{
				if(try_request_2 <= try_limit_2){
					var thos = this;
					setTimeout(function(){
						try_request_2++;
						thos._getPhoto();
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
			pageView:'album',
			albumComp:<Spinner style={{flex:1}}/>,
			photoComp:<Spinner style={{flex:1}}/>,
			photoPage:0,
			photoData:[],
		},
		()=>{
			this._getAlbum();
			this._getPhoto();
		});
	}

	_changeTab(type){
		this.setState({
			pageView:type,
		},()=>{
			if(this.state.photoPage < 1){
				this._getPhoto();
			}
		});
	}

	/*
	_changeCategoryId(category_id){
		this.setState({
			category_id:category_id,
			albumComp:<Spinner style={{flex:1}}/>,
			albumPage:0,
			albumData:[],
			photoComp:<Spinner style={{flex:1}}/>,
			photoPage:0,
			photoData:[],
		},()=>{
			this._getAlbum();
			this._getPhoto();
		});
	}
	*/

	render(){

		let styleContentBox = {
			flexDirection:'row',
			flexWrap:'wrap',
			paddingLeft:10,
			paddingRight:10,
		};

		let styleBtnAlbum = {touch:{},ico:{fontSize:35,color:'#999',textAlign:'center',}};
		if(this.state.pageView == 'album'){styleBtnAlbum.ico.color = '#b35e27';}

		let styleBtnPhoto = {touch:{},ico:{fontSize:25,color:'#999',textAlign:'center',}};
		if(this.state.pageView == 'photo'){styleBtnPhoto.ico.color = '#b35e27';}

		let content = <View/>
		if(this.state.pageView === 'album'){
			content = this.state.albumComp;
		}
		else{
			content = this.state.photoComp;
		}

		return(
			<View>

				<ScrollView onScroll={this.props.hideBtnOnScroll} style={{backgroundColor:'#eaeaea'}} refreshControl={this._refreshControl()} ref='ScrollView'>

					<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#f0f0f0'}}>

						<View style={{flexDirection:'row',margin:15}}>
							<View style={{flex:3}}>
								<View style={{flexDirection:'row'}}>
									<Text style={{fontSize:16}}>
										<Text style={{fontSize:16}}>{this.state.pageView === 'album' ? 'Album' : 'Foto'}</Text>
									</Text>
								</View>
								<View style={{height:1,alignSelf:'stretch',flexDirection:'row',marginTop:5}}>
									<View style={{backgroundColor:'#ddd',height:1,alignSelf:'stretch',flex:1,}}></View>
								</View>
							</View>
							<View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
								<TouchableHighlight underlayColor='transparent' style={styleBtnAlbum.touch} onPress={()=>{this._changeTab('album')}}>
									<IonIcon style={styleBtnAlbum.ico} name='ios-list-outline'/>
								</TouchableHighlight>
								<View style={{height:25,width:1,marginLeft:15,marginRight:15,backgroundColor:'#ddd'}}/>
								<TouchableHighlight underlayColor='transparent' style={styleBtnPhoto.touch} onPress={()=>{this._changeTab('photo')}}>
									<IonIcon style={styleBtnPhoto.ico} name='ios-apps-outline'/>
								</TouchableHighlight>
							</View>
						</View>

						{/*
						<View style={{backgroundColor:'#fff',margin:15,padding:0,marginTop:0}}>
							<Picker
								style={{margin:0,padding:0,color:'#767676'}}
								mode='dropdown'
								selectedValue={this.state.category_id}
								onValueChange={(category_id)=>this._changeCategoryId(category_id)}
							>
								<Item color='#767676' style={{margin:0,padding:0}} label='Semua Album' value='false'/>
								<Item color='#767676' style={{margin:0,padding:0}} label='Jelajah Indonesia' value='1,2,3,4'/>
								<Item color='#767676' style={{margin:0,padding:0}} label='Galeri Indonesia Kaya' value='11'/>
								<Item color='#767676' style={{margin:0,padding:0}} label='Galeri Budaya' value='6,7'/>
							</Picker>
						</View>
						*/}

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
