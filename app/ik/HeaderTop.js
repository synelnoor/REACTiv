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

export default class HeaderTop extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dimensions: Dimensions.get('window'),
			searchText: '',
			searchTextCurrent: '',
			searchKanal: 'semua',
			searchCategory: {},
			searchType: {},
			searchProvince: {},
			formOpen: false,
			color: '#999',
			height: 0,
		};
		/*if (Platform.OS === 'android') {
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	_toggle(x = undefined) {
		const now1 = new Date().getTime();

		if (this.timePress1 && (now1-this.timePress1) < multiPressDelay1) {
			delete this.timePress1;
		}
		else {
			let dw = Dimensions.get('window');
			let wh = dw.height;

			if (dw.height < dw.width) {
				wh = dw.width;
			}

			this.timePress1 = now1;

			let formOpen = this.state.formOpen;
			let changeFormStatus = typeof x == 'boolean' ? x : !formOpen; // Kalo ada parameter x maka pakai parameter x, kalo ga state yang sebelumnya di toggle saja
			//LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);

			this.setState({
				formOpen: changeFormStatus,
				color: changeFormStatus ? '#b35e27' : '#999',
				height: changeFormStatus ? (wh-((Platform.OS === 'ios') ? 105 : 125)) : 0,
			});
		}
	}

	_close(close,callback) {
		this.setState({
			formOpen: false,
			color: '#999',
			height: 0,
		}, () => {
			if (close) {
				Actions.refresh({key: 'IKdrawer', open: value => false});
			}

			if (callback) {
				callback();
			}
		});
	}

	cekData(arr,val) {
		if (typeof arr[val] !== 'undefined') {
			return true;
		}
		else {
			return false;
		}
	}

	setCatTipe(catName) {
		let searchCategory = this.state.searchCategory;

		if (typeof searchCategory[catName] != 'undefined') {
			delete searchCategory[catName];
		}
		else {
			searchCategory[catName] = catName;
		}

		this.setState({
			searchCategory: searchCategory,
		});
	}

	setProvinsi(provName) {
		let searchProvince = this.state.searchProvince;

		if (typeof searchProvince[provName] != 'undefined') {
			delete searchProvince[provName];
		}
		else {
			searchProvince[provName] = provName;
		}

		this.setState({
			searchProvince: searchProvince,
		});
	}

	changeKanal(kanal) {
		if (this.state.searchKanal == 'semua' || this.state.searchKanal == 'jelajah-indonesia') {
			this.setState({searchKanal: kanal});
		}
		else{
			let catTipe = this.state.searchCategory;
			let searchCategoryMod = {};

			for (let i in catTipe) {
				if(
					catTipe[i] === 'foto' ||
					catTipe[i] === 'artikel' ||
					catTipe[i] === 'video'
				){
					searchCategoryMod[catTipe[i]] = catTipe[i];
				}
			}

			this.setState({
				searchKanal: kanal,
				searchCategory: searchCategoryMod,
				searchProvince: {},
			});
		}
	}

	startSearch(){
		this.setState({
			searchTextCurrent: this.state.searchText,
		}, () => {
			let tipe = {};
			let cat_id = {};

			for (let i in this.state.searchCategory) {
				if (
					i == 'foto' ||
					i == 'video' ||
					i == 'artikel'
				) {
					tipe[this.state.searchCategory[i]] = this.state.searchCategory[i];
				}
				else if (
					i == '1' ||
					i == '2' ||
					i == '3' ||
					i == '4'
				) {
					cat_id[this.state.searchCategory[i]] = this.state.searchCategory[i];
				}
			}

			this._close(true, () => {
					Actions.refresh({
						from: 'ik',
						searchText: this.state.searchText,
						searchKanal: this.state.searchKanal,
						searchCategory: cat_id,
						searchType: tipe,
						searchProvince: this.state.searchProvince
					});

					Actions.IKSearch({
						from: 'ik',
						searchText: this.state.searchText,
						searchKanal: this.state.searchKanal,
						searchCategory: cat_id,
						searchType: tipe,
						searchProvince: this.state.searchProvince
					});
				}
			);
		});
	}

	pressStartSearch() {
		if (this.state.searchText !== this.state.searchTextCurrent) {
			this.setState({
				searchTextCurrent: this.state.searchText,
			}, () => {
				let tipe = {};
				let cat_id = {};

				for (let i in this.state.searchCategory) {
					if (
						i == 'foto' ||
						i == 'video' ||
						i == 'artikel'
					) {
						tipe[this.state.searchCategory[i]] = this.state.searchCategory[i];
					}
					else if (
						i == '1' ||
						i == '2' ||
						i == '3' ||
						i == '4'
					) {
						cat_id[this.state.searchCategory[i]] = this.state.searchCategory[i];
					}
				}

				this._close(true, () => {
						Actions.refresh({
							from: 'ik',
							searchText: this.state.searchText,
							searchTextCurrent: this.state.searchText,
							searchKanal: this.state.searchKanal,
							searchCategory: cat_id,
							searchType: tipe,
							searchProvince: this.state.searchProvince
						});

						Actions.IKSearch({
							from: 'ik',
							searchText: this.state.searchText,
							searchTextCurrent: this.state.searchText,
							searchKanal: this.state.searchKanal,
							searchCategory: cat_id,
							searchType: tipe,
							searchProvince: this.state.searchProvince
						});
					}
				);
			});
		}
	}

	_radio(nama, checked, onPress) {
		return (
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

	_checkbox(nama, checked, onPress) {
		return (
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

	_openDrawer() {
		const now2 = new Date().getTime();

		if (this.timePress2 && (now2-this.timePress2) < multiPressDelay2) {
			delete this.timePress2;
		}
		else {
			this.timePress2 = now2;
			// this.setState({
			// 	formOpen: false,
			// 	color: '#999',
			// 	height: 0,
			// }, () => {
			// 	Actions.refresh({key: 'IKdrawer', open: true});
			// });
			Actions.drawerOpen();

		}
	}

	render() {
		let searchCategory = <View/>;
		let searchProvince = <View/>;

		if (this.state.searchKanal === 'semua' || this.state.searchKanal === 'jelajah-indonesia') {
			searchCategory =
			<View style={{borderBottomWidth:1,borderBottomColor:'#eee',flexDirection:'row',margin:10}}>
				<View style={{flex:1}}>
					{this._checkbox('Tradisi',this.cekData(this.state.searchCategory,'2'),()=>this.setCatTipe('2'))}
					{this._checkbox('Pariwisata',this.cekData(this.state.searchCategory,'3'),()=>this.setCatTipe('3'))}
					{this._checkbox('Foto',this.cekData(this.state.searchCategory,'foto'),()=>this.setCatTipe('foto'))}
					{this._checkbox('Artikel',this.cekData(this.state.searchCategory,'artikel'),()=>this.setCatTipe('artikel'))}
				</View>
				<View style={{flex:1}}>
					{this._checkbox('Kesenian',this.cekData(this.state.searchCategory,'1'),()=>this.setCatTipe('1'))}
					{this._checkbox('Kuliner',this.cekData(this.state.searchCategory,'4'),()=>this.setCatTipe('4'))}
					{this._checkbox('Video',this.cekData(this.state.searchCategory,'video'),()=>this.setCatTipe('video'))}
				</View>
			</View>;

			searchProvince =
			<View style={{borderBottomWidth:1,borderBottomColor:'#eee',flexDirection:'row',margin:10}}>
				<View style={{flex:1}}>
					{this._checkbox('Bali',this.cekData(this.state.searchProvince,'20000'),()=>this.setProvinsi('20000'))}
					{this._checkbox('Banten',this.cekData(this.state.searchProvince,'20002'),()=>this.setProvinsi('20002'))}
					{this._checkbox('Gorontalo',this.cekData(this.state.searchProvince,'20004'),()=>this.setProvinsi('20004'))}
					{this._checkbox('Jambi',this.cekData(this.state.searchProvince,'20007'),()=>this.setProvinsi('20007'))}
					{this._checkbox('Jawa Tengah',this.cekData(this.state.searchProvince,'20009'),()=>this.setProvinsi('20009'))}
					{this._checkbox('Kalimantan Barat',this.cekData(this.state.searchProvince,'20011'),()=>this.setProvinsi('20011'))}
					{this._checkbox('Kalimantan Tengah',this.cekData(this.state.searchProvince,'20013'),()=>this.setProvinsi('20013'))}
					{this._checkbox('Kalimantan Utara',this.cekData(this.state.searchProvince,'20033'),()=>this.setProvinsi('20033'))}
					{this._checkbox('Lampung',this.cekData(this.state.searchProvince,'20016'),()=>this.setProvinsi('20016'))}
					{this._checkbox('Maluku Utara',this.cekData(this.state.searchProvince,'20018'),()=>this.setProvinsi('20018'))}
					{this._checkbox('Nusa Tenggara Barat',this.cekData(this.state.searchProvince,'20020'),()=>this.setProvinsi('20020'))}
					{this._checkbox('Papua',this.cekData(this.state.searchProvince,'20022'),()=>this.setProvinsi('20022'))}
					{this._checkbox('Riau',this.cekData(this.state.searchProvince,'20023'),()=>this.setProvinsi('20023'))}
					{this._checkbox('Sulawesi Selatan',this.cekData(this.state.searchProvince,'20025'),()=>this.setProvinsi('20025'))}
					{this._checkbox('Sulawesi Tenggara',this.cekData(this.state.searchProvince,'20027'),()=>this.setProvinsi('20027'))}
					{this._checkbox('Sumatera Barat',this.cekData(this.state.searchProvince,'20029'),()=>this.setProvinsi('20029'))}
					{this._checkbox('Sumatera Utara',this.cekData(this.state.searchProvince,'20031'),()=>this.setProvinsi('20031'))}
				</View>
				<View style={{flex:1}}>
					{this._checkbox('Bangka Belitung',this.cekData(this.state.searchProvince,'20001'),()=>this.setProvinsi('20001'))}
					{this._checkbox('Bengkulu',this.cekData(this.state.searchProvince,'20003'),()=>this.setProvinsi('20003'))}
					{this._checkbox('Jakarta',this.cekData(this.state.searchProvince,'20006'),()=>this.setProvinsi('20006'))}
					{this._checkbox('Jawa Barat',this.cekData(this.state.searchProvince,'20008'),()=>this.setProvinsi('20008'))}
					{this._checkbox('Jawa Timur',this.cekData(this.state.searchProvince,'20010'),()=>this.setProvinsi('20010'))}
					{this._checkbox('Kalimantan Selatan',this.cekData(this.state.searchProvince,'20012'),()=>this.setProvinsi('20012'))}
					{this._checkbox('Kalimantan Timur',this.cekData(this.state.searchProvince,'20014'),()=>this.setProvinsi('20014'))}
					{this._checkbox('Kepulauan Riau',this.cekData(this.state.searchProvince,'20015'),()=>this.setProvinsi('20015'))}
					{this._checkbox('Maluku',this.cekData(this.state.searchProvince,'20017'),()=>this.setProvinsi('20017'))}
					{this._checkbox('Nangroe Aceh Darussalam',this.cekData(this.state.searchProvince,'20019'),()=>this.setProvinsi('20019'))}
					{this._checkbox('Nusa Tenggara Timur',this.cekData(this.state.searchProvince,'20021'),()=>this.setProvinsi('20021'))}
					{this._checkbox('Papua Barat',this.cekData(this.state.searchProvince,'20005'),()=>this.setProvinsi('20005'))}
					{this._checkbox('Sulawesi Barat',this.cekData(this.state.searchProvince,'20024'),()=>this.setProvinsi('20024'))}
					{this._checkbox('Sulawesi Tengah',this.cekData(this.state.searchProvince,'20026'),()=>this.setProvinsi('20026'))}
					{this._checkbox('Sulawesi Utara',this.cekData(this.state.searchProvince,'20028'),()=>this.setProvinsi('20028'))}
					{this._checkbox('Sumatera Selatan',this.cekData(this.state.searchProvince,'20030'),()=>this.setProvinsi('20030'))}
					{this._checkbox('Yogyakarta',this.cekData(this.state.searchProvince,'20032'),()=>this.setProvinsi('20032'))}
				</View>
			</View>;

		}
		else {
			searchCategory =
			<View style={{borderBottomWidth:1,borderBottomColor:'#eee',flexDirection:'row',margin:10}}>
				<View style={{flex:1}}>
					{this._checkbox('Foto',this.cekData(this.state.searchCategory,'foto'),()=>this.setCatTipe('foto'))}
					{this._checkbox('Artikel',this.cekData(this.state.searchCategory,'artikel'),()=>this.setCatTipe('artikel'))}
				</View>
				<View style={{flex:1}}>
					{this._checkbox('Video',this.cekData(this.state.searchCategory,'video'),()=>this.setCatTipe('video'))}
				</View>
			</View>;
		}

		let form =
		<View style={{backgroundColor:'#fff', height:this.state.height, display: this.state.formOpen ? 'flex' : 'none'}}>
			<View style={{position:'absolute',top:0,left:0,right:0,height:1,backgroundColor:'#eee'}}/>
			<ScrollView>
				<View style={{flexDirection:'row',backgroundColor:'#f0f0f0',margin:10,alignItems:'center'}}>
					{/*<View style={{width:100}}>*/}
						<TextInput underlineColorAndroid='transparent' placeholder='Ketik Disini' style={{width:'90%',color:'#555',padding:5,paddingLeft:10,paddingRight:0,margin:0}} onChangeText={(teks)=>this.setState({searchText:teks})} value={this.state.searchText}/>
					{/*</View>*/}
					{/*<View style={{width:30}}>*/}
						<Icon style={{width:'10%',padding:10,paddingTop:0,paddingBottom:0,color:'#999',fontSize:33}} name='ios-arrow-round-forward-outline' onPress={()=>this.pressStartSearch()}/>
					{/*</View>*/}
				</View>
				<View style={{borderBottomWidth:1,borderBottomColor:'#eee',flexDirection:'row',margin:10}}>
					<View style={{flex:1}}>
						{this._radio('Semua',(this.state.searchKanal == 'semua' ? true : false),()=>this.changeKanal('semua'))}
						{this._radio('Galeri Budaya',(this.state.searchKanal == 'jendela-budaya' ? true : false),()=>this.changeKanal('jendela-budaya'))}
					</View>
					<View style={{flex:1}}>
						{this._radio('Jelajah Indonesia',(this.state.searchKanal == 'jelajah-indonesia' ? true : false),()=>this.changeKanal('jelajah-indonesia'))}
						{this._radio('Galeri Indonesia Kaya',(this.state.searchKanal == 'galeri-indonesia-kaya' ? true : false),()=>this.changeKanal('galeri-indonesia-kaya'))}
					</View>
				</View>
				{searchCategory}
				{searchProvince}
			</ScrollView>
			<View style={{margin:10,marginBottom:15}}>
				<TouchableHighlight
					underlayColor={'#999'}
					style={{padding:10,borderRadius:0,backgroundColor:this.state.color,borderWidth:1,borderColor:'#eee'}}
					onPress={()=>this.startSearch()}
				>
					<Text style={{fontSize:15,color:'#fff',textAlign:'center'}}>Cari</Text>
				</TouchableHighlight>
			</View>
			<View style={{position:'absolute',bottom:0,left:0,right:0,height:1,backgroundColor:'#eee'}}/>
		</View>;

		return (
			// <StyleProvider style={getTheme()}>
				<View>
					<View style={Styles.nbheader.mainView}>
						<TouchableHighlight underlayColor='transparent' style={{flexDirection:'row',alignItems:'center',justifyContent:'center',height:55,width:55,padding:0,borderRadius:0}} onPress={()=>{this._openDrawer(); this._toggle(false)}}>
							<Icon style={{color:'#999',fontSize:33,alignSelf:'center',textAlign:'center',flex:1}} name='ios-menu-outline'/>
						</TouchableHighlight>
						<View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',paddingTop:5}}>
							<TouchableHighlight underlayColor='transparent' onPress={()=>{Actions.IKHome()}}>
								<Image style={Styles.rnheader.logoIK} source={require('../resource/image/logo-ik.png')}/>
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
