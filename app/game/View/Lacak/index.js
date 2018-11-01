import React, {Component} from 'react';
import {Platform, Alert,StyleSheet,TouchableOpacity, Text,
    ScrollView, 
    Dimensions,
    Animated,
    Easing,
    AsyncStorage,
	PanResponder,View, DeviceEventEmitter, ActivityIndicator, Image, ListView} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons'
import IonIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import {PERMISSION} from '../../Comp/Permission';
import Auth,{login,check,user} from '../../js/gamify/auth'
import history from '../../js/gamify/history'
import  * as Api from '../../js/gamify/config/server'

export default class Lacak extends Component{
    constructor(props){
        super(props);
        
        this.state={

            point:'000',
            data:this.props,
            product:[],
            order:[],
            name:'',
            alamet:'',
            telp:''
        }
    }
    async componentDidMount(){
        const alamat = await this.cekAlamat();
        console.log('ala',alamat)
        this.setState({
            name:alamat.nama,
            alamat:alamat.alamat,
            telp:alamat.telp
          })
      
      
    }
    async cekAlamat(){
        try {
            const data = await AsyncStorage.getItem('@Gamify:address');
            console.log(data)
            return JSON.parse(data);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    renderHeader(){
        return(
        <View style={{flexDirection:'row',flexWrap: 'wrap', justifyContent: 'center',
        alignItems:'center',height:100,
        //backgroundColor:'powderblue'
        }} >
            <TouchableOpacity style={styles.back} onPress={()=>{Actions.home() }}>
						<IonIcon 
						name="ios-arrow-round-back" 
						size={50} 
						color="#E80E89" />	
			    </TouchableOpacity>
           
            <View style={[{ marginTop:40,left:10, width: 250, height: 80, 
                justifyContent: 'center',alignItems:'center' }]}>
            <Text  style={{ marginTop:20,left:5, margin:0,  color:'#ff1a8c', fontSize:20,}}>
                RINCIAN PENGIRIMAN
            </Text>
            
            </View>
            
        </View>)
    }

    content(){
        return(
            <View>
            <View style={[styles.gridItem,{
                backgroundColor:'#000'
                 }]}>
                <View 
                style={{ backgroundColor:'#fff',height:'100%',width:300, flexDirection: 'row',
                flexWrap: 'wrap',}}
                >
                
                <IonIcon
                    name="ios-paper"
                    size={80}
                    color='#ff1a8c'
                    style={{left:10,bottom:35,position:'absolute'}}
                    />
                    <View style={{width:200,height:'100%',
                    // justifyContent:'center',alignItems:'center',
                    position:'absolute',right:0}}>
           
                        <Text style={{color:'#ff1a8c', fontSize:15, marginTop:5}}>Hadiah Kamu sedang dikirim.</Text>
                        <Text style={{color:'#ff1a8c', fontSize:15,}}>Terima Kasih sudah berpartisipasi dan menukarkan point kamu pada tanggal</Text>
                        <Text style={{color:'#ff1a8c', fontSize:15,fontWeight:'bold'}}>11-11-2018</Text>

                    </View>
        
                </View>
            </View>
              <View style={[styles.gridItem,{
                 backgroundColor:'#000'
                  }]}>
                 <View 
                 style={{ backgroundColor:'#fff',height:'100%',width:300, flexDirection: 'row',
                 flexWrap: 'wrap',}}
                 >
                    <IonIcon
                    name="ios-pin"
                    size={80}
                    color='#ff1a8c'
                    style={{left:20,bottom:35,position:'absolute'}}
                    />
                     <View style={{width:200,height:'100%'
                     ,justifyContent:'center',alignItems:'center',position:'absolute',right:0}}>
                    <Text style={{color:'#ff1a8c', fontSize:20, fontWeight:'bold'}}>Alamat Pengiriman</Text>
                    <Text style={{color:'#ff1a8c', fontSize:15, marginTop:5}}>{this.state.name}</Text>
                    <Text style={{color:'#ff1a8c', fontSize:15,}}>{this.state.alamat}</Text>
                    <Text style={{color:'#ff1a8c', fontSize:15,fontWeight:'bold'}}>{this.state.telp}</Text>
                     </View>
                 </View>
             </View>
             <View style={[styles.gridItem,{
                 backgroundColor:'#000'
                  }]}>
                 <View 
                 style={{ backgroundColor:'#fff',height:'100%',width:300, flexDirection: 'row',
                 flexWrap: 'wrap',}}
                 >
                    <Image source={require('../../img/ikaAsset/line1.png')}  
                style={{width:80,height:80 ,resizeMode:'contain',position:'absolute',left:0,bottom:30}}/>

                   <View style={{width:200,height:'100%'
                   ,justifyContent:'center',alignItems:'center',position:'absolute',right:0}}>
                   <Text style={{color:'#ff1a8c', fontSize:20, fontWeight:'bold'}}>Status Pengiriman</Text>
                   </View>
                </View>
             </View> 
            </View>)
           
    }

    footer(){
        return(
            <View  >
                <View style={{flexDirection:'row', justifyContent: 'center',height:90}} >
                {/* <TouchableOpacity 
                style={{position:'absolute',width: 100, 
                height: 30, marginTop:20,left:30,bottom:30,justifyContent:'center', alignItems:'center',
                backgroundColor:'#ff1a8c'}}
                onPress={()=>{
                    this.Submit()
                    //Actions.sukses()
                }}
                >
                <Text style={{color:'#ffff',fontSize:15}}>Ya</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={{position:'absolute',width: 100, 
                height: 30, marginTop:20,right:30,bottom:30,justifyContent:'center', alignItems:'center',
                backgroundColor:'#ff1a8c'}}
                onPress={()=>{Actions.tukar()}}
                >
                <Text style={{color:'#ffff',fontSize:15}}>Tidak</Text>
                </TouchableOpacity> */}
                </View>
                
            </View>
        );
    }
    render(){
        return(
            <View
            style={styles.container}
            >
                {this.renderHeader()}
                {this.content()}
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
        //width: Dimensions.get('window').width / 1.1,
        width:'100%',
        height: 150,
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