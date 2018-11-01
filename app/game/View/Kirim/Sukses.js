import React, {Component} from 'react';
import {Platform, Alert,StyleSheet,TouchableOpacity, Text,
    ScrollView, 
    Dimensions,
    Animated,
    Easing,
    TextInput,
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


export default class Sukses extends Component{
    constructor(props){
        super(props);
        this.state={
            data:this.props,
            product:[],
            name:'',
            alamat:'',
            telp:''

           
        }
    }
    componentDidMount(){
      
    }
   

    async FecthKirim(){
        try{
           

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
    renderLogo(){
        return(
            <View style={styles.grid} >
                 <View style={[styles.gridItemHeader,{
               //backgroundColor:'#99314a'
                }]}>
                <Image source={require('../../img/ikaAsset/LOGO.png')}  
                style={{width:'100%',height:180 ,resizeMode:'contain'}}/>
              </View>
            </View>
        )
       
    }

    form(){
        return(
           
            <View style={[styles.gridItem,{
               backgroundColor:'#000'
                }]}>
               <View 
               style={{ backgroundColor:'#E80E89',height:'100%',width:300,
               justifyContent: 'center',
               alignItems:'center'
            }}
               >
                   <Text  
                   style={{color:'#fff',fontSize:20,fontWeight:'bold'}}
                   >Pengiriman Kamu</Text>
                   <Text
                   style={{color:'#fff',fontSize:20,fontWeight:'bold'}}
                   >Sedang diproses</Text>
                   <Text
                   style={{color:'#fff',fontSize:20,fontWeight:'bold'}}
                   >Terima Kasih</Text>
               </View>
             
               
            </View>
        
        )
    }


    footer(){
        return(
            <View  >
                <View style={{flexDirection:'row', justifyContent: 'center',height:90}} >
            
                </View>
                
            </View>
        );
    }


    render(){
        return(
            <View style={styles.container}>
            
                {this.renderHeader()}
                {this.renderLogo()}
                {this.form()}
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
        width:'100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        
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
        width: '100%',
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
      },
      inputBox: {
        width:300,
        backgroundColor:'#ffff',
        //backgroundColor:'rgb(214, 211, 209)',
        //borderRadius: 25,
        paddingHorizontal:16,
        fontSize:12,
        color:'#4f4844',
        borderBottomWidth: 1,
       borderColor: '#cccccc',
        marginVertical: 5
        },
})