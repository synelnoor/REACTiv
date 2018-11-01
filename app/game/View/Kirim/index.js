import React, {Component} from 'react';
import {Platform, Alert,StyleSheet,TouchableOpacity, Text,
    ScrollView, 
    Dimensions,
    Animated,
    Easing,
    TextInput,
    AsyncStorage,
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
import Loading from '../../Comp/Loading'


export default class Kirim extends Component{
    constructor(props){
        super(props);
        this.state={
            data:this.props,
            product:[],
            name:'',
            alamat:'',
            telp:'',
            address:[],
            loading:false

           
        }
    }
    async componentDidMount(){
      const alamat = await this.cekAlamat();
      if(alamat != null){
          console.log('addressADA')

          this.setState({
            name:alamat.nama,
            alamat:alamat.alamat,
            telp:alamat.telp
          })
      }
      console.log('daat',this.state.data.item.id)
      this.setState({
          product:this.state.data.item
        })

      console.log('alamat',alamat)
    }

    async cekAlamat(){
        try {
            const data = await AsyncStorage.getItem('@Gamify:address');
            return JSON.parse(data);
        } catch (error) {
            console.log(error);
            return error;
        }
    }
   

    builtAdd(){
      const address= {
        nama:this.state.name,
        alamat:this.state.alamat,
        telp:this.state.telp
       };

       AsyncStorage.setItem('@Gamify:address', JSON.stringify(address));
       console.log(JSON.stringify(address))
       this.setState({
           address:JSON.stringify(address)
       })

    }


    async FecthKirim(){
        try{

            Auth.user()
            .then(user => {
            const order={
                "payment" : "Respon dari payment sistem",
                "payment_option" : "redeem",
                "shipment_option" : "JNE",
                "note" : "catatan",
            }
            let data = order;
            let  id =this.state.product.id;
            let shipment=this.state.address;
            console.log('all',shipment)
            console.log('id',id)
            data['shipment']=JSON.stringify(shipment);
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


                        // this.setState({
                        //     loading:false
                        // })
                        
                        
                        if(responseData.success){
                            // Alert.alert(
                            //     responseData.message
                            // )
                            AsyncStorage.setItem('@Gamify:point', JSON.stringify(responseData.data.order.balance));
                            //console.log('masuk')
                            Actions.sukses()
                        }else{
                            Alert.alert(
                                responseData.message
                            )
                            //console.log('masuk2')
                            Actions.tukar({text:'point'})
                        }
                       
                        

                        //return responseData;
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
        // .catch(error => {
        //   console.error('order', error);
        //   return error;
        // });

        }catch{
            return error
        }

    }
    componentWillReceiveProps(){}

    Submit(){
        // this.setState({
        //     loading:true
        // }),
        this.builtAdd()
        this.FecthKirim()
        //Actions.sukses(),
        
       

    }

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
               style={{ backgroundColor:'#fff',height:'100%',width:300}}
               >
                   <Text style={{
                        borderBottomWidth: 1,
                        borderColor: '#cccccc',
                        paddingHorizontal: 5
                        }}>
                        Masukan alamat pengiriman
                    </Text>
                   
                   <TextInput
                     style={styles.inputBox}
                     placeholder="Nama Lengkap"
                     placeholderTextColor = "#a3a375"
                     selectionColor="#000"
                     onChangeText={(text) => this.setState({name: text })} 
                     value={this.state.name}
                   />
                   <TextInput
                     style={styles.inputBox}
                     placeholder="Alamat"
                     multiline = {true}
                    numberOfLines = {4}
                     placeholderTextColor = "#a3a375"
                     selectionColor="#000"
                     onChangeText={(text) => this.setState({alamat: text })} 
                     value={this.state.alamat}
                   />
                     <TextInput
                     style={styles.inputBox}
                     placeholder="No Telepon"
                     placeholderTextColor = "#a3a375"
                     selectionColor="#000"
                     onChangeText={(text) => this.setState({telp: text })} 
                     value={this.state.telp}
                   />
               </View>
             
               
            </View>
        
        )
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
                </TouchableOpacity>
                </View>
                
            </View>
        );
    }


    render(){
        if(this.state.loading){
            return (<Loading/>);
        }else{
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