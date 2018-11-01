import React, {Component} from 'react';
import {Platform, Alert,StyleSheet,TouchableOpacity, Text,
    ScrollView, 
    Dimensions,
    AsyncStorage,
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
import NewAsyncStorage from '../../Library/AsyncStorage'


export default class Tukar extends Component{
    constructor(props){
        super(props);
        this.dsinit = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 != r2 });
        this.state={

            point:'0',
            data:this.props,
            product:[],
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
            order:[]
        }
    }
    async componentDidMount(){
        await this.getPoint()
        this.Point()
       await this.FecthNewItem();
       this.FecthItem();
      
    }
    // async componentWillReceiveProps(n){
    //     console.log('prop',n)
    //     if(n){
    //         await this.getPoint()
    //         this.Point()
    //     }
    // }
    async Point(){
        let point = await this.getPoint();
        
       console.log('poi',point)
       if(point == null) return false;
        this.setState({
            point:point
        })
       
    }
    async getPoint(){
        try {
            const data = await AsyncStorage.getItem('@Gamify:point');
            //console.log('ASyncCall',data)
            return JSON.parse(data);
        } catch (error) {
            console.log(error);
            return error;
        }

    }
   
    
    async FecthNewItem(){
        try{
            Auth.user()
        .then(user => {
                   
            // let nas = new NewAsyncStorage()
            // // nas.getItemByKey('@Gamify:auth', (resp) => {
            //  nas.getItemByKey('@jwt:user_info', (resp) => {
            //             console.log('temporary auth ==> ', resp)
                        Auth.token()
                        .then(auth => {
                            return fetch(Api.apiUrl + 'order_items?search=created_by:' + user.id, {
                                    method: 'GET',
                                    headers: {
                                        Authorization : 'Bearer ' + auth.access_token
                                    }
                                })
                                .then(response => response.json())
                                .then(responseData => {
                                    console.log('orderItem get', responseData);
                                   if(responseData){
                                    this.setState({
                                        order:responseData.data
                                    })
                                    return responseData;
                                }

                                    
                                })
                                .catch(error => {
                                    console.error('orderItem', error);
                                    return error;
                                });
                        })
                        .catch(error => {
                          console.error('orderItem', error);
                          return error;
                        });
                
                        
                    })
          
        // })
        .catch(error => {
          console.error('orderItem', error);
          return error;
        });
        }catch(err){
            return error
        }
    }

    async FecthItem(){
        try{
            Auth.user()
            .then(user => {
                Auth.token()
                .then(auth => {
                    return  fetch(Api.apiUrl + 'products?orderBy=price&sortedBy=asc', {
                            method: 'GET',
                            headers: {
                                Authorization : 'Bearer ' + auth.access_token
                            }
                        })
                        .then(response => response.json())
                        .then(responseData => {
                            console.log('product get', responseData)
                            console.log('product getdata', responseData.data)
                            this.setState({product:responseData.data})
                            return responseData;
                        })
                        .catch(error => {
                            console.error('product', error);
                            return error;
                        });
                })
                .catch(error => {
                console.error('product', error);
                return error;
                });
            })
            .catch(error => {
            console.error('product', error);
            return error;
            });

        }catch{
            return error
        }

    }
    componentWillReceiveProps(){}

    renderHeader(){
        return(
        <View style={{flexDirection:'row', justifyContent: 'center',height:130,}} >
            <TouchableOpacity style={styles.back} onPress={()=>{Actions.home() }}>
						<IonIcon 
						name="ios-arrow-round-back" 
						size={50} 
						color="#E80E89" />	
			    </TouchableOpacity>
            <View style={[styles.border,{ marginTop:40,left:10,height: 80}]}>
            <Image style={{width: 50, height: 50, marginTop:20,left:0}} 
                source={require('../../img/ikaAsset/point.png')}/>
            </View>

            <View style={[styles.border,{ marginTop:40,left:10, width: 250, height: 80 }]}>
            <Text  style={{ marginTop:20,left:5, margin:0,  color:'#ff1a8c', fontSize:15,}}>
                POIN SAYA
            </Text>
            <Text  style={{left:5, margin:0, color:'#ff1a8c', fontSize:20,fontWeight:'bold' }}>
                {this.state.point}
            </Text>
            </View>
            
        </View>)
    }


    status(item){
        
       const order =this.state.order;
        let order_id= [];
        order.map((i,k)=>{
             order_id.push(i.product_id)
        })
        if(order_id){
        if(order_id.indexOf( item.id ) == -1)
        {
            return(
                <View style={{ flexDirection: 'row',
                    flexWrap: 'wrap',  width: 300,}}>
                    <Image style={{width: 30, height: 30, marginTop:20,left:0}} 
                        source={require('../../img/ikaAsset/point.png')}/>
                    <Text style={{color:'#ff1a8c',fontSize:20,marginTop:20,marginLeft:5}}>{item.price} POIN</Text>
                    <TouchableOpacity 
                    style={{position:'absolute',width: 90, 
                    height: 30, marginTop:20,right:0,bottom:0,justifyContent:'center', alignItems:'center',
                    backgroundColor:'#ff1a8c'}}
                    onPress={()=>{Actions.konfirmasi({text:item,item:item})}}
                    >
                    <Text style={{color:'#ffff',fontSize:15}}>TUKAR</Text>
                    </TouchableOpacity>
                </View>
            )
            
        }else{
        return (
            <View style={{ flexDirection: 'row',
            flexWrap: 'wrap',  width: 300,justifyContent:'center', alignItems:'center'}}>
             <TouchableOpacity 
                    style={{width: 120, 
                    height: 30, marginTop:20,justifyContent:'center', alignItems:'center',
                    backgroundColor:'#ff1a8c'}}
                    onPress={()=>{Actions.lacak()}}
                    >
                    <Text style={{color:'#ffff',fontSize:10}}>LACAK PENGIRIMAN</Text>
                    </TouchableOpacity>
        </View>);
        }
    }
    }

    renderProduct(item){
        console.log('opo',item)
        return(
        <View  style={styles.gridItem} >
            <View style={[styles.gridItemImage, {justifyContent:'center', alignItems:'center' }]}>
            {item.image ? <Image
                             source={{ uri: item.image}} 
                             style={styles.gridImage}  /> : <Text>{item.name}</Text>}
            
            </View>

            {this.status(item)}
           
        </View>)
    }
    renderScrollView(){

        var listItems = this.dsinit.cloneWithRows(this.state.product);
        //var listItems = this.state.product
        var count = listItems.length;//        console.log('cek',listItems)
        if(count == 0){
            return(
         <View style={[styles.grid,{ justifyContent: 'center',
                         alignItems: 'center',
                         backgroundColor:'#c4c4c4'}]}>
             <Text>Tidak ada untuk ditampilkan</Text>
         </View>
         );
        }else{
     
         return (
             <ScrollView style={{backgroundColor: '#000', flex: 1, marginTop:10}} >
                 <ListView 
                     enableEmptySections={ true }
                     contentContainerStyle={[styles.grid,{ justifyContent: 'center',
                     alignItems: 'center',
                     backgroundColor:'#000'}]}
                     dataSource={listItems}
                     renderRow={(item) => this.renderProduct(item)}
                     //renderRow={(item) => this.renderGridItem(item)}
                 />
             </ScrollView>
         );
 
         }

    }
    footer(){
        return(
            <View  >
                <View style={{flexDirection:'row', justifyContent: 'center'}} >
                    
                    
                    
                    <Text  style={{ marginTop:10, margin:5, color:'#ff1a8c', fontSize:20, width: 250, height: 30 }}>
                        
                    </Text>
                </View>
                
            </View>
        );
    }


    renderItem(){

    }
    render(){
        return(
            <View style={styles.container}>
            {/* <View style={{flex:1, backgroundColor:'#000'}}>
            
            </View> */}
            
                {this.renderHeader()}
                {this.renderScrollView()}
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
        height: 200,
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