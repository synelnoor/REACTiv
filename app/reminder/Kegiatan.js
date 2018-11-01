import React, { Component } from 'react';
import {
	Text,
	View,
	ScrollView,
	TouchableHighlight,
	Switch
} from 'react-native';
import { Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
import IonIcon from 'react-native-vector-icons/Ionicons';

import ComLocalStorage from '../comp/ComLocalStorage';

export default class Kegiatan extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: null,
		}
		/*if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	componentDidMount() {
		setTimeout(() => {
			this._getList();
		}, 1000);
	}

	_getList() {
		let LocalStorage = new ComLocalStorage();
		LocalStorage.getItemByKey('@temp:kegiatan', (e) => {
			//LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
			if(e !== null) {
				this.setState({
					data:JSON.parse(e),
				});
			}
			else {
				this.setState({
					data:null,
				});
			}
		});
	};

	_buildList() {
		let nd = new Date();
		let dis = nd.toISOString().split('T')[0];
		let kegiatan = this.state.data;
		let emptycomp = <Text key={1} style={{fontSize:15,color:'#999',textAlign:'center'}}>Daftar Pengingat Kosong</Text>;

		if(kegiatan !== null) {
			let compList = [];
			for(let i in kegiatan) {
				let kegiatanloop = kegiatan[i];
				if(kegiatanloop.ymd >= dis) {
					let switchChange = (value) => {this._onPress(kegiatanloop,value)};
					let switchValue = kegiatanloop.notification === 'Y' ? true : false;
					let switchDisabled = false;
					let backgroundColor = '#fff';
					let textStyle = {};

					if(kegiatanloop.notification === 'N' || kegiatanloop.expired === 'Y') {
						backgroundColor = '#fafafa';
						textStyle.color = '#bbb';
					}

					if(kegiatanloop.expired === 'Y') {
						switchChange = ()=>{};
						switchValue = false;
						switchDisabled = true;
					}

					let switchcomp = <Switch disabled={switchDisabled} onValueChange={switchChange} value={switchValue} onTintColor='#27eb24' tintColor='#eee' thumbTintColor='#fafafa'/>;

					compList.push(
						<View key={i} style={{borderWidth:1,borderColor:'#eee',borderTopWidth:0,backgroundColor:backgroundColor,marginBottom:10}}>
							<View style={{backgroundColor:'#b76329',height:2,flex:1}}/>
							<View style={{padding:10,paddingTop:20,paddingBottom:20,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
								<View style={{flex:2}}>
									<Text style={[{fontSize:15},textStyle]}>{kegiatanloop.title}</Text>
								</View>
								<View style={{flex:1}}>
									{switchcomp}
								</View>
							</View>
							<View style={{borderTopWidth:1,borderTopColor:'#eee',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
								<View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:10,paddingLeft:5,paddingRight:5}}>
									<IonIcon name='ios-calendar-outline' style={[{fontSize:20,marginRight:10},textStyle]}/>
									<Text style={textStyle}>{kegiatanloop.ymdconvert}</Text>
								</View>
								<View style={{alignSelf:'stretch',width:1,backgroundColor:'#eee'}}/>
								<View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',padding:10,paddingLeft:5,paddingRight:5}}>
									<IonIcon name='ios-time-outline' style={[{fontSize:20,marginRight:10},textStyle]}/>
									<Text style={textStyle}>{kegiatanloop.time1} - {kegiatanloop.time2}</Text>
								</View>
							</View>
						</View>
					);
				}
			}

			if (compList.length < 1) {
				compList.push(emptycomp);
			}

			return(compList);
		}
		else {
			return(<Spinner/>);
		}
	}

	_onPress(data,value) {
		let LocalStorage = new ComLocalStorage();

		LocalStorage.getItemByKey('@temp:kegiatan', (e) => {
			if (e !== null) {
				let temp = JSON.parse(e);

				if (
					typeof data.calendar_id !== 'undefined' &&
					typeof temp['i'+data.calendar_id] !== 'undefined'
				) {
					temp['i'+data.calendar_id].notification = value ? 'Y' : 'N';

					ComLocalStorage.setItem('temp', 'kegiatan', JSON.stringify(temp), () => {
						this.setState({
							data:temp,
						});
					});
				}
			}
		});
	}

	render(){
		return(
			<View style={{flex:1,backgroundColor:'#fafafa'}}>
				<View style={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}}>
					<View style={{height:53,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
						<TouchableHighlight
							underlayColor='transparent'
							onPress={()=>{Actions.pop()}}
							style={{position:'absolute',top:0,bottom:0,left:0,alignItems:'center',justifyContent:'center',flexDirection:'row',paddingLeft:10}}
						>
							<IonIcon name='ios-arrow-back-outline' style={{fontSize:34,color:'#b76329'}}/>
						</TouchableHighlight>
						<Text style={{fontSize:13,color:'#999'}}>PENGINGAT ACARA / KEGIATAN</Text>
					</View>
				</View>
				<View style={{flex:1}}>
					<ScrollView>
						<View style={{padding:10,paddingBottom:0}}>
							{this._buildList()}
						</View>
					</ScrollView>
				</View>
			</View>
		);
	}
}
