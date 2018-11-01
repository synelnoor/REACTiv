import React, { Component } from 'react';
import {
	Text,
	View,
	ScrollView,
	Dimensions,
	Image,
	TouchableHighlight
} from 'react-native';
import { Spinner } from 'native-base';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
import Calendar from 'react-native-calendar';
import moment from 'moment';
import { base_url, api_uri } from '../../comp/AppConfig';
import ComFetch from '../../comp/ComFetch';
import ArrayToQueryString from '../../comp/ArrayToQueryString';
import Styles from '../../comp/Styles';
import FooterSM from '../FooterSM';
import ModalReservation from '../../comp/ModalReservation';
const customDayName = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const customMonthName = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
const IdMonthName = {
	'January':'Januari',
	'February':'Februari',
	'March':'Maret',
	'April':'April',
	'May':'Mei',
	'June':'Juni',
	'July':'Juli',
	'August':'Agustus',
	'September':'September',
	'October':'Oktober',
	'November':'November',
	'December':'Desember',
};

var try_request = 0;
var try_limit = 10;

export default class Kegiatan extends Component {

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

	constructor(props){
		super(props);
		let date = moment();
		let currentDay = date.format('DD');
		let currentMonth = date.format('MM');
		let currentYear = date.format('YYYY');
		if(typeof this.props.ymd !== 'undefined'){
			let propsymd = this.props.ymd.split('-');
			currentDay = propsymd[2];
			currentMonth = propsymd[1];
			currentYear = propsymd[0];
		}
		this.state = {
			dimensions:Dimensions.get('window'),
			ScrollView:this.refs.ScrollView,
			currentDay:currentDay,
			currentMonth:currentMonth,
			currentYear:currentYear,
			currentMonthName:IdMonthName[date.format('MMMM')],
			currentMonthLast:date.endOf('month').format('DD'),
			eventDates:[],
			listComp:<Spinner/>,
			listData:[],
			contentOffset:0,
			contentEachH:{},
		};
		/*if(Platform.OS === 'android'){
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}*/
	}

	componentDidMount(){
		Actions.refresh({key:'IKdrawer',open:value=>false,active1:6,active2:0});
		this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView},()=>{
			this._getEvent();
		});
	}

	_getEvent(){

		var temp = [];
		var query = {};
        //query['type'] = 'gik';
        query['remove'] = true;
        query['separated'] = 'day';
        query['date[from]'] = this.state.currentYear+'-'+this.state.currentMonth+'-01';
        query['date[to]'] = this.state.currentYear+'-'+this.state.currentMonth+'-'+this.state.currentMonthLast;

		let resource = api_uri+'event?'+ArrayToQueryString(query);
		let newComFetch = new ComFetch();
		newComFetch.setHeaders({Authorization:this.jwt_signature});
		newComFetch.setRestURL(base_url);

		this.setState({
			listComp:<Spinner/>
		},()=>{

			newComFetch.setResource(resource);

			newComFetch.sendFetch((rsp) => {

				if(rsp.status === 200){

					let data = rsp.data;

					let eventDates = [];
					let listData = [];

					for(var q in data){
						let w = data[q];
						for(var r in w){
							listData.push(w[r]);
							eventDates.push(w[r].date);
						}
					}

					this.setState({
						eventDates:eventDates,
						listData:listData
					},()=>{
						this._buildEvent(false,0);
					});

					try_request = 0;

				}
				else{
					if(try_request <= try_limit){
						var thos = this;
						setTimeout(function(){
							try_request++;
							thos._getEvent();
						},5000);
					}
					else{
						//alert('error');
					}
					//console.trace('error '+rsp.status);
				}

			});

		});

	}

	_buildEvent(press,offset){
		//LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
		let listData = this.state.listData;
		let listComp = [];
		let dateNow = '0000-00-00';
		if(press){
			dateNow = this.state.currentYear+'-'+this.state.currentMonth+'-'+this.state.currentDay;
		}
		listData.map(function(value,i){
			let viewStyle = {margin:10,marginTop:0,paddingBottom:10,borderColor:'#eee',borderBottomWidth:2};
			let icoStyle = {paddingLeft:10,paddingRight:10}

			if(value.date === dateNow){
				if(i > 0){
					viewStyle.marginTop = -11;
				}
				viewStyle.backgroundColor = '#eee';
				viewStyle.padding = 10;
				viewStyle.borderBottomWidth = 0;
				icoStyle.paddingRight = 0;
			}
			let ico = <View/>;
			let param = {
				'id':value.calendar_id,
			};
			if(value.listData !== 'close'){
				ico = <View style={[{flexDirection:'row',justifyContent:'center',alignItems:'center'},icoStyle]}><IonIcon style={{color:value.apps_bgcolor,fontSize:25}} name='ios-information-circle-outline'/></View>
			}
			listComp.push(
				<TouchableHighlight
				underlayColor={typeof viewStyle.backgroundColor !== 'undefined' ? viewStyle.backgroundColor : 'transparent'}
				onPress={()=>this.ModalReservation._switchModal(param)}
				style={viewStyle}
				key={i}
				>
					<View style={{flexDirection:'row'}}>
						<View style={{flex:1}}>
						<Text style={{color:value.apps_bgcolor,fontWeight:'bold',marginBottom:5}}>{value.dFull.ind}, {value.d} {value.mFull.ind} {value.y}</Text>
						<Text style={{color:value.apps_bgcolor}}>{value.calendar}</Text>
					</View>
						{ico}
					</View>
				</TouchableHighlight>
			)
		},this);
		this.setState({
			listComp:listComp
		},()=>{
			if(
				press &&
				offset > 0 &&
				typeof this.state.contentEachH[offset] !== 'undefined'
			){
				let y = this.state.contentEachH[offset] + this.state.contentOffset - 5;
				this.refs.ScrollView.scrollTo({x:0,y:y,animated:true});
			}
		});
	}

	_onDateSelect(param){
		let date = moment(param);
		let currentDay = moment(param).format('DD');
		this.setState({
			currentDay:currentDay,
			//currentMonth:date.format('MM'),
			//currentYear:date.format('YYYY'),
			//currentMonthName:IdMonthName[date.format('MMMM')],
			//currentMonthLast:date.endOf('month').format('DD'),
		},()=>{this._buildEvent(true,currentDay)});
	}

	_onSwipe(param){
		let date = moment(param);
		this.setState({
			listComp:<Spinner/>,
			currentDay:'01',
			currentMonth:date.format('MM'),
			currentYear:date.format('YYYY'),
			currentMonthName:IdMonthName[date.format('MMMM')],
			currentMonthLast:date.endOf('month').format('DD'),
			eventDates:[],
		},()=>{
			this._getEvent();
		});
	}

	onLayout(e){
		let nel = e.nativeEvent.layout;
		let eachH = 0;
		let contentEachH = {};
		let listData = this.state.listData;
		if(listData.length > 0){
			eachH = nel.height / listData.length;
		}
		listData.map(function(value,i){
			if(typeof contentEachH[value.d] !== 'indefined'){
				contentEachH[value.d] = eachH*i;
			}
		},this);
		this.setState({
			contentOffset:nel.y,
			contentEachH:contentEachH,
		});
	}

	render(){

		let paddingTop = 0;
		if(this.state.listData.length > 0){
			paddingTop = 10;
		}

		return(
			<View>

				<ScrollView onScroll={this.props.hideBtnOnScroll} style={{backgroundColor:'#eaeaea'}} ref='ScrollView'>
					<View>
						<ModalReservation ref={(e)=>this.ModalReservation = e}/>
					</View>
					<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#f0f0f0'}}>

						<View>

							<View style={{flexDirection:'row',margin:15}}>
								<View style={{flex:5}}>
									<View style={{flexDirection:'row'}}>
										<Text style={{fontSize:16}}>
											Kegiatan
										</Text>
									</View>
									<View style={{height:1,alignSelf:'stretch',flexDirection:'row',marginTop:5}}>
										<View style={{backgroundColor:'#ddd',height:1,alignSelf:'stretch',flex:1,}}></View>
									</View>
								</View>
							</View>

							<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#4e2f18',borderTopWidth:2,borderTopColor:'#c69c6e'}}>
								<Image style={{position:'absolute',height:(41/400)*this.state.dimensions.width,width:(150/682.6666666666666)*this.state.dimensions.height,bottom:0,left:0}} resizeMode='cover' source={require('../../resource/image/calendar-left.png')}/>
								<Image style={{position:'absolute',height:(51/400)*this.state.dimensions.width,width:(67/682.6666666666666)*this.state.dimensions.height,bottom:0,right:0}} resizeMode='cover' source={require('../../resource/image/calendar-right.png')}/>
								<View style={{flexDirection:'row'}}>
									<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
										<Text style={{fontSize:75,color:'#c69c6e',fontWeight:'bold'}}>{this.state.currentDay}</Text>
									</View>
									<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
										<View style={{height:55,width:0.5,marginLeft:10,marginRight:10,backgroundColor:'#c69c6e'}}/>
									</View>
									<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
										<View>
											<Text style={{padding:0,lineHeight:20,fontSize:20,color:'#c69c6e',fontWeight:'bold'}}>{(this.state.currentMonthName).toUpperCase()}</Text>
											<Text style={{padding:0,lineHeight:40,fontSize:40,color:'#c69c6e',fontWeight:'bold'}}>{this.state.currentYear}</Text>
										</View>
									</View>
								</View>
								<TouchableHighlight onPress={()=>{this.refs.calendar.onPrev()}} underlayColor='transparent' style={{position:'absolute',width:50,top:0,bottom:0,left:0,flexDirection:'column',alignItems:'center',justifyContent:'center',backgroundColor:'transparent'}}><IonIcon name='ios-arrow-back-outline' style={{alignSelf:'center',padding:0,margin:0,fontSize:30,color:'#c69c6e'}}/></TouchableHighlight>
								<TouchableHighlight onPress={()=>{this.refs.calendar.onNext()}} underlayColor='transparent' style={{position:'absolute',width:50,top:0,bottom:0,right:0,flexDirection:'column',alignItems:'center',justifyContent:'center',backgroundColor:'transparent'}}><IonIcon name='ios-arrow-forward-outline' style={{alignSelf:'center',padding:0,margin:0,fontSize:30,color:'#c69c6e'}}/></TouchableHighlight>
							</View>

							<Calendar
								ref='calendar'
								scrollEnabled
								showControls={false}
								titleFormat={'MMMM YYYY'}
								prevButtonText={'Prev'}
								nextButtonText={'Next'}
								customStyle={Styles.calStyle}
								dayHeadings={customDayName}
								monthNames={customMonthName}
								onTouchPrev={(e)=>{this._onSwipe(e)}}
								onTouchNext={(e)=>{this._onSwipe(e)}}
								onSwipePrev={(e)=>this._onSwipe(e)}
								onSwipeNext={(e) => this._onSwipe(e)}
								onDateSelect={(param)=>this._onDateSelect(param)}
								eventDates={this.state.eventDates}
							/>

						</View>

						<View onLayout={(e)=>this.onLayout(e)} style={{backgroundColor:'#fff',paddingTop:paddingTop}}>{this.state.listComp}</View>

					</View>
					<FooterSM ScrollView={this.state.ScrollView}/>
				</ScrollView>
				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

			</View>
		);
	}

}