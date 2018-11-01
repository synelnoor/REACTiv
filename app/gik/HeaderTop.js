import React, { Component } from 'react';
import {
	Platform,
	View,
	Image,
	Text,
	Dimensions,
	TextInput,
	ScrollView,
	TouchableHighlight
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { StyleProvider, Icon, Radio, CheckBox } from 'native-base';
import Styles from '../comp/Styles';
import getTheme from '../../native-base-theme/components';
const multiPressDelay1 = 750;
const multiPressDelay2 = 1000;
export default class HeaderTop extends Component{

	constructor(props){
		super(props);
		this.state = {
			dimensions:Dimensions.get('window'),
			searchText:'',
			searchTextCurrent:'',
			searchKanal:'semua',
			searchCategory:{},
			searchType:{},
			searchProvince:{},
			formOpen:false,
			color:'#999',
			height:0,
		};
		/*if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	_toggle(){
		const now1 = new Date().getTime();
		if(this.timePress1 && (now1-this.timePress1) < multiPressDelay1){
			delete this.timePress1;
		}
		else{
			let dw = Dimensions.get('window');
			let wh = dw.height;
			if(dw.height < dw.width){
				wh = dw.width;
			}
			this.timePress1 = now1;
			let formOpen = this.state.formOpen;
			//LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
			this.setState({
				formOpen:!formOpen,
				color:!formOpen ? '#b35e27' : '#999',
				height:!formOpen ? (wh-((Platform.OS === 'ios') ? 105 : 125)) : 0,
			});
		}
	}

	_close(close,callback){
		this.setState({
			formOpen:false,
			color:'#999',
			height:0,
		},()=>{
			if(close){
				Actions.refresh({key:'IKdrawer',open:value=>false});
			}
			if(callback){
				callback();
			}
		});
	}

	cekData(arr,val){
		if(typeof arr[val] !== 'undefined'){
			return true;
		}
		else{
			return false;
		}
	}

	setCatTipe(catName){
		let searchCategory = this.state.searchCategory;
		if(typeof searchCategory[catName] != 'undefined'){
			delete searchCategory[catName];
		}
		else{
			searchCategory[catName] = catName;
		}
		this.setState({
			searchCategory:searchCategory,
		});
	}

	setProvinsi(provName){
		let searchProvince = this.state.searchProvince;
		if(typeof searchProvince[provName] != 'undefined'){
			delete searchProvince[provName];
		}
		else{
			searchProvince[provName] = provName;
		}
		this.setState({
			searchProvince:searchProvince,
		});
	}

	changeKanal(kanal){
		if(this.state.searchKanal == 'semua' || this.state.searchKanal == 'jelajah-indonesia'){
			this.setState({searchKanal:kanal});
		}
		else{
			let catTipe = this.state.searchCategory;
			let searchCategoryMod = {};
			for(var i in catTipe){
				if(
					catTipe[i] === 'foto' ||
					catTipe[i] === 'artikel' ||
					catTipe[i] === 'video'
				){
					searchCategoryMod[catTipe[i]] = catTipe[i];
				}
			}
			this.setState({
				searchKanal:kanal,
				searchCategory:searchCategoryMod,
				searchProvince:{},
			});
		}
	}

	startSearch(){
		this.setState({
			searchTextCurrent:this.state.searchText,
		},()=>{
			let tipe = {};
			let cat_id = {};
			for(var i in this.state.searchCategory){
				if(
					i == 'foto' ||
					i == 'video' ||
					i == 'artikel'
				){
					tipe[this.state.searchCategory[i]] = this.state.searchCategory[i];
				}
				else if(
					i == '1' ||
					i == '2' ||
					i == '3' ||
					i == '4'
				){
					cat_id[this.state.searchCategory[i]] = this.state.searchCategory[i];
				}
			}

			this._close(true,
				()=>{

					Actions.refresh({
						from:'gik',
						searchText:this.state.searchText,
						searchKanal:this.state.searchKanal,
						searchCategory:cat_id,
						searchType:tipe,
						searchProvince:this.state.searchProvince
					});

					Actions.GIKSearch({
						from:'gik',
						searchText:this.state.searchText,
						searchKanal:this.state.searchKanal,
						searchCategory:cat_id,
						searchType:tipe,
						searchProvince:this.state.searchProvince
					});

				}
			);
		});
	}

	pressStartSearch(){
		if(this.state.searchText !== this.state.searchTextCurrent){
			this.setState({
				searchTextCurrent:this.state.searchText,
			},()=>{
				let tipe = {};
				let cat_id = {};
				for(var i in this.state.searchCategory){
					if(
						i == 'foto' ||
						i == 'video' ||
						i == 'artikel'
					){
						tipe[this.state.searchCategory[i]] = this.state.searchCategory[i];
					}
					else if(
						i == '1' ||
						i == '2' ||
						i == '3' ||
						i == '4'
					){
						cat_id[this.state.searchCategory[i]] = this.state.searchCategory[i];
					}
				}

				this._close(true,
					()=>{

						Actions.refresh({
							from:'gik',
							searchText:this.state.searchText,
							searchKanal:this.state.searchKanal,
							searchCategory:cat_id,
							searchType:tipe,
							searchProvince:this.state.searchProvince
						});

						Actions.GIKSearch({
							from:'gik',
							searchText:this.state.searchText,
							searchKanal:this.state.searchKanal,
							searchCategory:cat_id,
							searchType:tipe,
							searchProvince:this.state.searchProvince
						});

					}
				);
			});
		}
	}

	_radio(nama,checked,onPress){
		return(
			<TouchableHighlight underlayColor='transparent' onPress={onPress}>
				<View style={{flexDirection:'row',marginBottom:20}}>
					<View style={{padding:0,margin:0,marginRight:10,marginLeft:10}}>
						<Radio style={{margin:0,padding:0}} selected={checked} onPress={onPress}/>
					</View>
					<Text style={{color:'#555',fontSize:12}}>{nama}</Text>
				</View>
			</TouchableHighlight>
		);
	}

	_checkbox(nama,checked,onPress){
		return(
			<TouchableHighlight underlayColor='transparent' onPress={onPress}>
				<View style={{flexDirection:'row',marginBottom:20}}>
					<View style={{padding:0,margin:0,marginRight:20}}>
						<CheckBox style={{margin:0,padding:0}} checked={checked} onPress={onPress}/>
					</View>
					<Text style={{color:'#555',fontSize:12}}>{nama}</Text>
				</View>
			</TouchableHighlight>
		);
	}

	_openDrawer(){
		const now2 = new Date().getTime();
		if(this.timePress2 && (now2-this.timePress2) < multiPressDelay2){
			delete this.timePress2;
		}
		else{
			this.timePress2 = now2;
			// this.setState({
			// 	formOpen:false,
			// 	color:'#999',
			// 	height:0,
			// },()=>{
			// 	Actions.refresh({key:'GIKdrawer',open:true});
			// });
			Actions.drawerOpen();

		}
	}

	render(){

		let searchCategory =
			<View style={{borderBottomWidth:1,borderBottomColor:'#eee',flexDirection:'row',margin:10}}>
				<View style={{flex:1}}>
					{this._checkbox('Foto',this.cekData(this.state.searchCategory,'foto'),()=>this.setCatTipe('foto'))}
				</View>
				<View style={{flex:1}}>
					{this._checkbox('Artikel',this.cekData(this.state.searchCategory,'artikel'),()=>this.setCatTipe('artikel'))}
				</View>
				<View style={{flex:1}}>
					{this._checkbox('Video',this.cekData(this.state.searchCategory,'video'),()=>this.setCatTipe('video'))}
				</View>
			</View>;

		let searchProvince = <View/>;

		let form =
		<View style={{backgroundColor:'#fff',height:this.state.height, display: this.state.formOpen ? 'flex' : 'none'}}>
			<View style={{position:'absolute',top:0,left:0,right:0,height:1,backgroundColor:'#eee'}}/>
			<ScrollView>
				<View style={{flexDirection:'row',margin:10,backgroundColor:'#f0f0f0',alignItems:'center'}}>
					{/*<View style={{flex:1}}>*/}
						<TextInput underlineColorAndroid='transparent' placeholder='Ketik Disini' style={{width:'90%',color:'#555',padding:5,paddingLeft:10,paddingRight:0,margin:0}} onChangeText={(teks)=>this.setState({searchText:teks})} value={this.state.searchText}/>
					{/*</View>*/}
					{/*<View style={{alignItems:'center',flexDirection:'row'}}>*/}
						<Icon style={{width:'10%',padding:10,paddingTop:0,paddingBottom:0,color:'#999',fontSize:33}} name='ios-arrow-round-forward-outline' onPress={()=>this.pressStartSearch()}/>
					{/*</View>*/}
				</View>
				<View style={{borderBottomWidth:1,borderBottomColor:'#eee',flexDirection:'row',margin:10}}>
					<View style={{flex:1}}>
						{this._radio('Semua',(this.state.searchKanal == 'semua' ? true : false),()=>this.changeKanal('semua'))}
					</View>
					<View style={{flex:1}}>
						{this._radio('Idenesia',(this.state.searchKanal == 'idenesia' ? true : false),()=>this.changeKanal('idenesia'))}
					</View>
					<View style={{flex:1}}>
						{this._radio('Ruang Kreatif',(this.state.searchKanal == 'ruang-kreatif' ? true : false),()=>this.changeKanal('ruang-kreatif'))}
					</View>
				</View>
				{searchCategory}
				{searchProvince}
			</ScrollView>
			<View style={{margin:10,marginBottom:15}}>
				<TouchableHighlight
					underlayColor='#999'
					style={{padding:10,borderRadius:0,backgroundColor:this.state.color,borderWidth:1,borderColor:'#eee'}}
					onPress={()=>this.startSearch()}
				>
					<Text style={{fontSize:15,color:'#fff',textAlign:'center'}}>Cari</Text>
				</TouchableHighlight>
			</View>
			<View style={{position:'absolute',bottom:0,left:0,right:0,height:1,backgroundColor:'#eee'}}/>
		</View>;

		return(
			// <StyleProvider style={getTheme()}>
				<View>
					<View style={Styles.nbheader.mainView}>
						<TouchableHighlight underlayColor='transparent' style={{flexDirection:'row',alignItems:'center',justifyContent:'center',height:55,width:55,padding:0,borderRadius:0}} onPress={()=>this._openDrawer()}>
							<Icon style={{color:'#999',fontSize:33,alignSelf:'center',textAlign:'center',flex:1}} name='ios-menu-outline'/>
						</TouchableHighlight>
						<View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',paddingTop:5}}>
							<TouchableHighlight underlayColor='transparent' onPress={()=>{this.props.logoPress('goGIKHome')}}>
								<Image style={Styles.rnheader.logoGIK} source={require('../resource/image/logo-gik.png')}/>
							</TouchableHighlight>
						</View>
						<TouchableHighlight underlayColor='transparent' style={{flexDirection:'row',alignItems:'center',justifyContent:'center',height:55,width:55,padding:0,borderRadius:0,}} onPress={()=>this._toggle()}>
							<Icon style={{color:this.state.color,fontSize:33,alignSelf:'center',textAlign:'center',flex:1}} name='ios-search-outline'/>
						</TouchableHighlight>
					</View>
					{form}
				</View>
			// </StyleProvider>
		);
	}

}
