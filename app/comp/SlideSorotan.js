import React, { Component } from 'react';
import {
	Text,
	View,
	TouchableHighlight,
	Dimensions
} from 'react-native';
import Swiper from 'react-native-swiper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ArrayToQueryString from './ArrayToQueryString';
import ComFetch from './ComFetch';
import SlideSorotanChild from './SlideSorotanChild';
import { Actions } from 'react-native-router-flux';

import { base_url, api_uri } from './AppConfig';

var try_request = 0;
var try_limit = 5;

var height = 266;
var width = 400;

export default class SlideSorotan extends Component {

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
			query['table'] = 'gik_sorotan';
			query['where[trash_status#=]'] = 'N';
			query['orderby[create_datetime]'] = 'DESC';
			query['paginate'] = 'true';
			query['per_page'] = 5;
			query['injected[gik_sorotan]'] = true;
			query['injected[gik_sorotan][dimensions_width]'] = this.state.dimensions.width;
			query['page'] = 1;

			let resource = api_uri+'universal?'+ArrayToQueryString(query);
			let newComFetch = new ComFetch();
			newComFetch.setHeaders({Authorization:this.jwt_signature});
			newComFetch.setRestURL(base_url);

			// Ambil data Article
			newComFetch.setResource(resource);

			newComFetch.sendFetch((rsp) => {

				if(rsp.status === 200){

					let data = rsp.data;

					let newTemp = data.data;
					let compItem = [];

					for(i in newTemp){
						compItem.push(<SlideSorotanChild key={i} data={newTemp[i]} dimensions={{height:height,width:width}} from='gik'/>);
					}

					this.setState({
						item:compItem,
					});

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
                <View style={{backgroundColor:'#ddd'}}>

					<View style={{flexDirection:'row'}}>
						<View style={{flex:1,flexDirection:'row',alignItems:'center',padding:10,paddingTop:5,paddingBottom:5}}>
							<IonIcon style={{fontSize:20,color:'#999',marginRight:10}} name='ios-image-outline'/>
							<Text style={{fontSize:13,color:'#999',fontWeight:'bold'}}>SOROTAN GALERI INDONESIA KAYA</Text>
						</View>
						<TouchableHighlight underlayColor='#888' style={{flexDirection:'row',alignItems:'center',padding:10,paddingTop:5,paddingBottom:5,backgroundColor:'#888'}} onPress={()=>Actions.GIKSorotan()}>
							<Text style={{fontSize:9,color:'#fff'}}>LIHAT SEMUA</Text>
						</TouchableHighlight>
					</View>

					<View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
						<Swiper
							buttonWrapperStyle={{paddingHorizontal:0,paddingVertical:0}}
							prevButton={<View style={{paddingLeft:10,paddingRight:10,flexDirection:'row',height:height/width*this.state.dimensions.width}}><IonIcon name='ios-arrow-back-outline' style={{alignSelf:'center',padding:0,margin:0,fontSize:30,color:'#fff'}}/></View>}
							nextButton={<View style={{paddingLeft:10,paddingRight:10,flexDirection:'row',height:height/width*this.state.dimensions.width}}><IonIcon name='ios-arrow-forward-outline' style={{alignSelf:'center',padding:0,margin:0,fontSize:30,color:'#fff'}}/></View>}
							showsButtons={true}
							index={0}
							loop={false}
							style={{padding:0,margin:0}}
							height={height/width*this.state.dimensions.width}
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