import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	TouchableHighlight,
	Dimensions
} from 'react-native';
import Swiper from 'react-native-swiper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ArrayToQueryString from './ArrayToQueryString';
import ComFetch from './ComFetch';
import ModalReservation from './ModalReservation';

import { base_url, api_uri } from './AppConfig';

var try_request = 0;
var try_limit = 5;

export default class SlideReservation extends Component {

	jwt_signature = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODgxODE0NTQsImp0aSI6ImExMTQwYTNkMGRmMWM4MWUyNGFlOTU0ZDkzNWU4OTI2IiwiaXNzIjoibG9jYWxob3N0IiwibmJmIjoxNDg4MTgxNDU2LCJleHAiOiJmYWxzZSIsImRhdGEiOnsidXNlcklkIjowLCJ1c2VyTmFtZSI6Ikd1ZXN0In19.63fe6b3b900457ac57f32a0ef5a4a2c2f4dddfd52aaf41b8888339ed60a84799'; //nanti di ganti dari jwt guest yang sudah di request

    constructor(props){
        super(props);
        this.state = {
			dimensions:Dimensions.get('window'),
			item:<View/>,
			currentYear:new Date().getFullYear(),
        }
    }

    componentDidMount(){
		this.setState({
			dimensions:Dimensions.get('window'),
		},()=>{
			var query = {};
			query['type'] = 'gik';
			query['remove'] = 'false';
			query['sperated'] = 'day';
			query['limit'] = 5;
			query['slidereservation'] = true;

			let resource = api_uri+'event?'+ArrayToQueryString(query);
			let newComFetch = new ComFetch();
			newComFetch.setHeaders({Authorization:this.jwt_signature});
			newComFetch.setRestURL(base_url);

			newComFetch.setResource(resource);

			newComFetch.sendFetch((rsp) => {

				if(rsp.status === 200){

					let data = rsp.data;

					let reservation = [];

					let loop = 0;
					for(var q in data){
						let w = data[q];
						for(var r in w){
							if(loop === 0){
								this.setState({currentYear:w[r].y});
							}
							reservation.push({
								'id':w[r].calendar_id,
								'title':w[r].calendar,
								'day1':w[r].d,
								'day2':w[r].dFull.ind,
								'month':w[r].m.ind,
							});
						}
						loop++;
					}

					let item = [];
					reservation.map(function(value,i){
					item.push(
						<View style={{height:120/400*this.state.dimensions.width,flexDirection:'row',alignItems:'center',justifyContent:'center'}} key={i}>
							<View style={{flexDirection:'row'}}>
								<View>
									<Text style={{color:'#c69c6e',textAlign:'right',fontWeight:'bold',fontSize:13,lineHeight:13}}>{(value.day2).toUpperCase()}</Text>
									<Text style={{color:'#c69c6e',textAlign:'right',fontWeight:'bold',fontSize:30,lineHeight:30}}>{(value.day1).toUpperCase()}</Text>
									<Text style={{color:'#c69c6e',textAlign:'right',fontWeight:'bold',fontSize:20,lineHeight:20}}>{(value.month).toUpperCase()}</Text>
								</View>
								<View style={{width:this.state.dimensions.width/2,paddingLeft:15}}>
									<View style={{position:'absolute',top:0,bottom:0,left:5.5,width:0.5,backgroundColor:'#c69c6e'}}/>
									<View style={{position:'absolute',top:0,bottom:0,left:7.5,width:0.5,backgroundColor:'#c69c6e'}}/>
									<Text style={{color:'#c69c6e',fontWeight:'bold',fontSize:18,lineHeight:22}} numberOfLines={3}>{value.title}</Text>
									<TouchableHighlight underlayColor='transparent' style={{marginTop:5}} onPress={()=>this.ModalReservation._switchModal(value)}>
										<Image resizeMode='cover' style={{height:(25/400)*this.state.dimensions.width,width:(96/682.6666666666666)*this.state.dimensions.height}} source={require('../resource/image/button-reservasi.png')}/>
									</TouchableHighlight>
								</View>
							</View>
						</View>
					)},this);

					this.setState({item:item});

					try_request = 0;

				}
				else{
					if(try_request <= try_limit){
						try_request++;
						this.componentDidMount();
					}
					else{
						//alert('error');
					}
					//console.trace('error '+rsp.status);
				}

			});
		});
    }

    render(){

        return(
            <View>
                <View>
					<ModalReservation ref={(e)=>this.ModalReservation = e}/>
                </View>
                <View style={{borderTopWidth:2,borderTopColor:'#c69c6e',backgroundColor:'#6b5850'}}>
					<View style={{padding:10,paddingTop:5,paddingBottom:5,borderBottomWidth:0.5,borderBottomColor:'#c69c6e',flexDirection:'row',alignItems:'center'}}>
						<View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
							<IonIcon style={{fontSize:20,color:'#c69c6e',marginRight:10}} name='ios-calendar-outline'/>
							<Text style={{fontSize:13,color:'#c69c6e',fontWeight:'bold'}}>KEGIATAN</Text>
						</View>
						<View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
							<Text style={{fontSize:13,color:'#c69c6e',fontWeight:'bold'}}>{this.state.currentYear}</Text>
						</View>
					</View>
					<View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>

						<Image style={{position:'absolute',height:(46/400)*this.state.dimensions.width,width:(168/682.6666666666666)*this.state.dimensions.height,bottom:0,left:0}} resizeMode='cover' source={require('../resource/image/slidereservation-left.png')}/>
						<Image style={{position:'absolute',height:(56/400)*this.state.dimensions.width,width:(74/682.6666666666666)*this.state.dimensions.height,bottom:0,right:0}} resizeMode='cover' source={require('../resource/image/slidereservation-right.png')}/>

						<Swiper
							buttonWrapperStyle={{paddingHorizontal:0,paddingVertical:0}}
							prevButton={<View style={{paddingLeft:10,paddingRight:10,flexDirection:'row',height:120/400*this.state.dimensions.width,backgroundColor:'transparent'}}><IonIcon name='ios-arrow-back-outline' style={{alignSelf:'center',padding:0,margin:0,fontSize:30,color:'#c69c6e'}}/></View>}
							nextButton={<View style={{paddingLeft:10,paddingRight:10,flexDirection:'row',height:120/400*this.state.dimensions.width,backgroundColor:'transparent'}}><IonIcon name='ios-arrow-forward-outline' style={{alignSelf:'center',padding:0,margin:0,fontSize:30,color:'#c69c6e'}}/></View>}
							showsButtons={true}
							loop={false}
							index={0}
							style={{padding:0,margin:0}}
							height={120/400*this.state.dimensions.width}
							showsPagination={false}
						>
							{this.state.item}
						</Swiper>

					</View>
                </View>
			</View>
        );
    }
}
