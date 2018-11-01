import React, {Component} from 'react';
import {Platform, Alert,StyleSheet,TouchableOpacity, Text,
    ScrollView, 
    Dimensions,
    Animated,
	Easing,
	PanResponder,View, DeviceEventEmitter, ActivityIndicator, Image, ListView} from 'react-native';
import Beacons from 'react-native-beacons-manager';
import Icon from 'react-native-vector-icons/MaterialIcons'
import IonIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import {PERMISSION} from '../../Comp/Permission';
import Auth,{login,check,user} from '../../js/gamify/auth'
import history from '../../js/gamify/history'
import  * as Api from '../../js/gamify/config/server'


export default class Konfirmasi extends Component{
    constructor(props){
        super(props);
        this.dsinit = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 != r2 });
        this.state={

            point:'000',
            data:this.props,
            product:[],
        }
    }
    componentDidMount(){
      console.log('daat',this.state.data.item.id)
      this.setState({
          product:this.state.data.item
        })
      
    }
   

    async FecthTukar(){
        try{
            Auth.user()
        .then(user => {

             

            const order={
                "payment" : "Respon dari payment sistem",
                "payment_option" : "redeem",
                "shipment" : "Respon dari kurir",
                "shipment_option" : "JNE",
                "note" : "catatan",
                
                //"created_by":user.id
            }
            let data = order;
            let  id =this.state.product.id
            console.log('id',id)
            data['items']={};
            data['items'][id] =  '1';
            data['created_by'] = user.id;
            console.log('dd',data)

            Auth.token()
            .then(auth => {
                return fetch(Api.apiUrl + 'orders', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization : 'Bearer ' + auth.access_token
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => response.json())
                    .then(responseData => {
                        console.log('order set', responseData);

                        return responseData;
                    })
                    .catch(error => {
                        console.error('order', error);
                        return error;
                    });
            })
            .catch(error => {
              console.error('order', error);
              return error;
            });
        })
        .catch(error => {
          console.error('order', error);
          return error;
        });

        }catch{
            return error
        }

    }
    componentWillReceiveProps(){}

    renderHeader(){
        return(
        <View style={{flexDirection:'row', justifyContent: 'center',height:80,}} >
            <TouchableOpacity style={styles.back} onPress={()=>{Actions.tukar() }}>
						<IonIcon 
						name="ios-arrow-round-back" 
						size={50} 
						color="#E80E89" />	
			    </TouchableOpacity>
            
        </View>)
    }




    
    
    image(){
        return(
        <View style={[styles.grid,{ justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor:'#000'
                       }]}>
             <View  style={[styles.gridItem, {backgroundColor:'#c4c4c4'}]} >
             {this.state.product.image ? <Image
                             source={{ uri: this.state.product.image}} 
                             style={styles.gridImage}/>:
                             <Text>    gambar {this.state.product.name}</Text>
                             }
             </View>
           
        </View>)
    }
    footer(){
        return(
            <View  >
                <View style={{flexDirection:'row', justifyContent: 'center',height:90}} >
                <TouchableOpacity 
                style={{position:'absolute',width: 100, 
                height: 30, marginTop:20,left:30,bottom:30,justifyContent:'center', alignItems:'center',
                backgroundColor:'#ff1a8c'}}
                onPress={()=>{
                    //this.FecthTukar()
                    Actions.kirim({item:this.state.product})
                }}
                >
                <Text style={{color:'#ffff',fontSize:15}}>KONFIRMASI</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={{position:'absolute',width: 100, 
                height: 30, marginTop:20,right:30,bottom:30,justifyContent:'center', alignItems:'center',
                backgroundColor:'#ff1a8c'}}
                onPress={()=>{Actions.tukar()}}
                >
                <Text style={{color:'#ffff',fontSize:15}}>BATAL</Text>
                </TouchableOpacity>
                </View>
                
            </View>
        );
    }


    renderItem(){

    }
    render(){
        return(
            <View style={styles.container}>
            
                {this.renderHeader()}
                {this.image()}
                {this.footer()}
                
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#000'
    },
    back:{
        position:'absolute',
        top:0,
        left:10,
        //backgroundColor:'powderblue'
      },
      header: {
        flex: 0.6,
        //justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor:'#000',
        height:100,
        borderColor:'#E80E89',
        borderLeftWidth:0,
        borderRightWidth:0,
        borderTopWidth:0
      },
      gridItemHeader: {
        margin:0,
        width: Dimensions.get('window').width / 2.2,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor:'#E80E89',
        borderLeftWidth:0,
        borderRightWidth:0,
        borderTopWidth:0
      },
      grid: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    gridItem: {
        margin:2,
        //position:'absolute',
        width: Dimensions.get('window').width / 1.1,
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor:'#c4c4c4'
       backgroundColor: '#fff'
    },
    gridItemImage: {
        top:0,
        width: 300,
        height: 120,
        backgroundColor:'powderblue',
        //borderWidth: 1.5, 
        //borderColor: '#c4c4c4',
        //borderRadius: 50,
    },
    gridTouch:{
        position:'absolute',
        width: '100%', 
        height: '100%',
        resizeMode:'cover',
        backgroundColor:'powderblue'
    },
    gridImage:{
        position:'absolute',
        width: '100%', 
        height: '100%',
        resizeMode:'cover',
        //backgroundColor:'powderblue'
    },
    gridItemText: {
        marginTop: 5,
        textAlign:'center',
    },
      border:{
        borderWidth: 2,
        borderColor:'#E80E89',
        borderLeftWidth:0,
        borderRightWidth:0,
        borderTopWidth:0
      }
})