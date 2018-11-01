import React, { Component } from 'react';
import {
	View,
	Image,
	Dimensions,
	Text,
	TouchableHighlight
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Spinner } from 'native-base';
import IonIcon from 'react-native-vector-icons/Ionicons';

//import { web_url } from './AppConfig';

export default class ItemList extends Component{

	constructor(props){
		super(props);
		this.ismount = false;
		this.state = {
			item:<View/>,
			dimensions:Dimensions.get('window'),
		}
		/*if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	_Actions(goto,data){
		if(typeof this.props.from !== 'undefined' && this.props.from === 'ik'){
			if(goto === 'articledetail' && typeof this.props.data.article_detail !== 'undefined' && this.props.data.article_detail){
				this.props.data.from = this.props.from;
				return ()=>Actions.IKArticleDetail(this.props.data);
			}
			else if(goto === 'articlelist'){
				return ()=>Actions.IKArticleList(data);
			}
			else if(goto === 'photoalbum'){
				return ()=> Actions.IKPhotoAlbum({data:this.props.data});
			}
			else if(goto === 'videodetail'){
				return ()=>Actions.IKVideoDetail(this.props.data);
			}
			else if(goto === 'reservation' && typeof this.props.showModal !== 'undefined'){
				let calendar = this.props.data.calendar;
				return ()=>this.props.showModal({
					'id':calendar.calendar_id,
					'title':calendar.calendar,
					'day':calendar.d,
					'month':calendar.m.ind,
				});
			}
			else{
				return ()=>{};
			}
		}
		else{
			if(goto === 'articledetail' && typeof this.props.data.article_detail !== 'undefined' && this.props.data.article_detail){
				this.props.data.from = this.props.from;
				return ()=>Actions.GIKArticleDetail(this.props.data);
			}
			else if(goto === 'articlelist'){
				return ()=>Actions.GIKArticleList(data);
			}
			else if(goto === 'photoalbum'){
				return ()=> Actions.GIKPhotoAlbum({data:this.props.data});
			}
			else if(goto === 'videodetail'){
				return ()=>Actions.GIKVideoDetail(this.props.data);
			}
			else if(goto === 'reservation' && typeof this.props.showModal !== 'undefined'){
				let calendar = this.props.data.calendar;
				return ()=>this.props.showModal({
					'id':calendar.calendar_id,
					'title':calendar.calendar,
					'day':calendar.d,
					'month':calendar.m.ind,
				});
			}
			else{
				return ()=>{};
			}
		}
	}

	componentDidMount(){
		let dimensions = Dimensions.get('window');
		this.setState({
			item:<View style={{height:(dimensions.width-60),margin:15,marginTop:0,backgroundColor:'#ddd'}}/>,
			dimensions:dimensions,
		},()=>{

			this.ismount = true;

			if(this.props.data !== null){
				var img = this.props.data.cover_url;
				Image.getSize(img,(w,h)=>{
					this._buildComponent(img,w,h);
				},()=>{
					this._buildComponent(false,0,0);
				});
			}

		});
	}

	componentWillUnmount(){
		this.ismount = false;
	}

	_buildComponent(img,w,h){
		setTimeout(()=>{
			if(this.ismount){
				//LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
				let imgComp = <View style={{height:this.state.dimensions.width/2,flexDirection:'column',alignItems:'center',justifyContent:'center'}}><Spinner/></View>;
				if(img){
					Image.prefetch(img);
					let nh = h / w * (this.state.dimensions.width-60);
					let nw = this.state.dimensions.width-60;
					imgComp = <Image
						style={{
							height:nh,
							width:nw,
						}}
						source={{uri:img}}
						resizeMode='cover'
					/>
				}
				if(typeof this.props.from !== 'undefined' && this.props.from === 'ik'){
					let breadcrumb = this._getBreadcrumb();
					let photo = this._getPhoto();
					let video = this._getVideo();
					this.setState({
						item:
							<View style={{backgroundColor:'#fff',padding:15,margin:15,marginTop:0,}}>
								<TouchableHighlight
									underlayColor='transparent'
									onPress={this._Actions('articledetail')}
									style={{marginBottom:25,}}
								>
									<View>
										<View style={{marginBottom:15,}}>
											<Text style={{textAlign:'center',fontSize:16,color:'#555'}}>
												{this.props.data.title}
											</Text>
										</View>
										<View style={{backgroundColor:'#fafafa',flexDirection:'row',justifyContent:'center'}}>
											{imgComp}
											<View style={{position:'absolute',top:0,bottom:0,left:0,right:0,borderWidth:1,borderColor:'#f0f0f0'}}/>
										</View>
									</View>
								</TouchableHighlight>
								{breadcrumb}
								<View style={{flexDirection:'row',backgroundColor:'#eee'}}>
									<TouchableHighlight
										underlayColor='#b76329'
										onPress={this._Actions('articledetail')}
										style={{flexDirection:'row',flex:1,height:this.state.dimensions.width/10,backgroundColor:'#b76329',}}
									>
										<IonIcon style={{alignSelf:'center',flex:1,textAlign:'center',color:'#fff',fontSize:25}} name='ios-paper-outline'/>
									</TouchableHighlight>
									<TouchableHighlight
										underlayColor={photo.bc}
										onPress={photo.action}
										style={{flexDirection:'row',flex:1,height:this.state.dimensions.width/10,backgroundColor:photo.bc,}}
									>
										<IonIcon style={{alignSelf:'center',flex:1,textAlign:'center',color:'#fff',fontSize:25}} name='ios-image-outline'/>
									</TouchableHighlight>
									<TouchableHighlight
										underlayColor={video.bc}
										onPress={video.action}
										style={{flexDirection:'row',flex:1,height:this.state.dimensions.width/10,backgroundColor:video.bc,}}
									>
										<IonIcon style={{alignSelf:'center',flex:1,textAlign:'center',color:'#fff',fontSize:25}} name='ios-videocam-outline'/>
									</TouchableHighlight>
								</View>
							</View>,
					});
				}
				else{
					let reservation = this._getReservation();
					this.setState({
						item:
							<View style={{backgroundColor:'#fff',padding:15,margin:15,marginTop:0,}}>
								<TouchableHighlight
									underlayColor='transparent'
									onPress={this._Actions('articledetail')}
								>
									<View>
										<View style={{marginBottom:15}}>
											<Text style={{textAlign:'center',fontSize:18,color:'#555'}}>
												{this.props.data.title}
											</Text>
										</View>
										<View>
											{imgComp}
											<View style={{position:'absolute',top:0,bottom:0,left:0,right:0,borderWidth:1,borderColor:'#f0f0f0'}}/>
										</View>
									</View>
								</TouchableHighlight>
								<View style={{flexDirection:'row',backgroundColor:'#eee',marginTop:15}}>
									<TouchableHighlight
										underlayColor='#b76329'
										onPress={this._Actions('articledetail')}
										style={{flexDirection:'row',flex:1,height:this.state.dimensions.width/10,backgroundColor:'#b76329',}}
									>
										<IonIcon style={{alignSelf:'center',flex:1,textAlign:'center',color:'#fff',fontSize:25}} name='ios-paper-outline'/>
									</TouchableHighlight>
									<TouchableHighlight
										underlayColor={reservation.bc}
										onPress={reservation.action}
										style={{flexDirection:'row',flex:1,height:this.state.dimensions.width/10,backgroundColor:reservation.bc,}}
									>
										<IonIcon style={{alignSelf:'center',flex:1,textAlign:'center',color:'#fff',fontSize:25}} name='ios-calendar-outline'/>
									</TouchableHighlight>
								</View>
							</View>,
					});
				}
			}
		},500);
	}

	_getBreadcrumb(){

		var is_cat_id = typeof this.props.is_cat_id !== 'undefined' && this.props.is_cat_id !== null ? this.props.is_cat_id : null;
		var is_province_id = typeof this.props.is_province_id !== 'undefined' && this.props.is_province_id !== null ? this.props.is_province_id : null;
		var category = this.props.data.category;
		var province = this.props.data.province;

		let page_name_category = {};
		let page_name_province = {};
		let page_subname = '';

		if(category !== null){
			if(category.cat_id < 5){

				page_name_category['n1'] = 'Jelajah';
				if(typeof category !== 'undefined' && typeof category.cat_name !== 'undefined'){
					page_name_category['n2'] = category.cat_name;
				}
				page_name_category['n3'] = 'Indonesia';

				page_name_province['n1'] = 'Jelajah';
				if(typeof province !== 'undefined' && typeof province.province_name !== 'undefined'){
					page_name_province['n2'] = province.province_name;
				}

			}
			else{
				page_name_category['n1'] = 'Jendela Indonesia';
				if(typeof category !== 'undefined' && typeof category.cat_name !== 'undefined'){
					page_subname = category.cat_name;
				}
			}
		}

		if(
			is_cat_id === null &&
			is_province_id === null &&
			category !== null &&
			province !== null
		){
			let arrCat = {cat_id:category.cat_id,tbl_reference:'ika_home_highlight',page_name:page_name_category,page_subname:page_subname};
			let arrProv = {province_id:province.province_id,tbl_reference:'ika_home_highlight',page_name:page_name_province,page_subname:page_subname};
			return(
				<View style={{marginRight:5,marginBottom:25,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
					<TouchableHighlight underlayColor='#fff' style={{backgroundColor:'#fff'}} onPress={this._Actions('articlelist',arrCat)}>
						<Text style={{fontWeight:'bold',color:'#999'}}>
							{category.cat_name}
						</Text>
					</TouchableHighlight>
					<View style={{height:10,width:1,backgroundColor:'#ddd',marginLeft:10,marginRight:10}}/>
					<TouchableHighlight underlayColor='#fff' style={{backgroundColor:'#fff'}} onPress={this._Actions('articlelist',arrProv)}>
						<Text style={{fontWeight:'bold',color:'#999'}}>
							{province.province_name}
						</Text>
					</TouchableHighlight>
				</View>
			);
		}
		else if(
			is_cat_id !== null &&
			category !== null &&
			province !== null &&
			parseInt(category.cat_id) === parseInt(is_cat_id)
		){
			let arrProv = {province_id:province.province_id,tbl_reference:'ika_home_highlight',page_name:page_name_province,page_subname:page_subname};
			return(
				<View style={{marginRight:5,marginBottom:25,flexDirection:'row',justifyContent:'center'}}>
					<TouchableHighlight underlayColor='#fff' style={{backgroundColor:'#fff'}} onPress={this._Actions('articlelist',arrProv)}>
						<Text style={{fontWeight:'bold',color:'#999'}}>
							{province.province_name}
						</Text>
					</TouchableHighlight>
				</View>
			);
		}
		else if(
			is_province_id !== null &&
			category !== null &&
			province !== null &&
			parseInt(province.province_id) === parseInt(is_province_id)
		){
			let arrCat = {cat_id:category.cat_id,tbl_reference:'ika_home_highlight',page_name:page_name_category,page_subname:page_subname};
			return(
				<View style={{marginRight:5,marginBottom:25,flexDirection:'row',justifyContent:'center'}}>
					<TouchableHighlight underlayColor='#fff' style={{backgroundColor:'#fff'}} onPress={this._Actions('articlelist',arrCat)}>
						<Text style={{fontWeight:'bold',color:'#999'}}>
							{category.cat_name}
						</Text>
					</TouchableHighlight>
				</View>
			);
		}
		else if(category !== null && province === null && parseInt(category.cat_id) !== parseInt(is_cat_id)){
			let arrCat = {cat_id:category.cat_id,tbl_reference:'ika_home_highlight',page_name:page_name_category,page_subname:page_subname};
			return(
				<View style={{marginRight:5,marginBottom:25,flexDirection:'row',justifyContent:'center'}}>
					<TouchableHighlight underlayColor='#fff' style={{backgroundColor:'#fff'}} onPress={this._Actions('articlelist',arrCat)}>
						<Text style={{fontWeight:'bold',color:'#999'}}>
							{category.cat_name}
						</Text>
					</TouchableHighlight>
				</View>
			);
		}
		else if(category === null && province !== null && parseInt(province.province_id) !== parseInt(is_province_id)){
			let arrProv = {province_id:province.province_id,tbl_reference:'ika_home_highlight',page_name:page_name_province,page_subname:page_subname};
			return(
				<View style={{marginRight:5,marginBottom:25,flexDirection:'row',justifyContent:'center'}}>
					<TouchableHighlight underlayColor='#fff' style={{backgroundColor:'#fff'}} onPress={this._Actions('articlelist',arrProv)}>
						<Text style={{fontWeight:'bold',color:'#999'}}>
							{province.province_name}
						</Text>
					</TouchableHighlight>
				</View>
			);
		}
		else{
			return(<View style={{marginBottom:-10}}/>);
		}

	}

	_getPhoto(){
		var rtn = {
			count:this.props.data.foto !== null ? ' '+this.props.data.foto.count_photo : '',
			action:this._Actions('photoalbum'),
			bc:'#a34828',
		}
		if(this.props.data.foto == null){
			rtn.action = ()=>{};
			rtn.bc = '#aaa';
		}
		return rtn;
	}

	_getVideo(){
		var rtn = {
			action:this._Actions('videodetail'),
			bc:'#8c3a20',
		}
		if(this.props.data.video == null){
			rtn.action = ()=>{};
			rtn.bc = '#bbb';
		}
		return rtn;
	}

	_getReservation(){
		var rtn = {
			action:this._Actions('reservation'),
			bc:'#a34828',
		}
		if(this.props.data.calendar == null){
			rtn.action = ()=>{};
			rtn.bc = '#bbb';
		}
		return rtn;
	}

	render(){
		return(
			this.state.item
		);
	}

}
