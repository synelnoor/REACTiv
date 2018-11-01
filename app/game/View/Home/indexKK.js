/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, Alert,StyleSheet, TouchableOpacity, TouchableHighlight, Text, 
  Dimensions,
  Animated,
	Easing,
	PanResponder,View, DeviceEventEmitter, ActivityIndicator, Image, ListView} from 'react-native';
import Beacons from 'react-native-beacons-manager';
import Icon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import {PERMISSION} from '../../Comp/Permission';
import auth,{login,check,user} from '../../js/gamify/auth'
import history from '../../js/gamify/history'
import quest from'../../js/gamify/quest'
import challenge from'../../js/gamify/challenge'
//import Gamify from '../../gamify'
import RNFetchBlob from 'rn-fetch-blob'

import RNFS from 'react-native-fs'
import {DirectoryImageSave,
  p,
  dirPictures,
  tmpDir,tmpFrame,
  imageRoot,
  imageOriginal,
  imageResult,
  createStorageDir,
  chkFrameDownload} from '../CameraCapture/helper'


const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default class Home extends Component {

  constructor(props){
    super(props);
    this.state={
      uuid: 'cb10023f-a318-3394-4199-a8730c7c1aec',
      identifier: 'BeaconR',
      rangingDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
      lokasi:[],
      loading:false,
      loadvid:false
        }
    }
 
  componentWillMount(){

   
  }

  async componentDidMount() {

    //this._quest()
    this._checkDir();
    

  }

  componentWillUnMount() {
   
  }

  _checkDir(){
    RNFetchBlob.fs.exists(`${p}${dirPictures}`)
      .then((exist) => {
          console.log(`file dirIKA ${exist ? '' : 'not'} exists`)
          if(!exist){
            console.log('buat')
            createStorageDir();
            chkFrameDownload();
          }
      })
      .catch((err) => {console.log(err) })
  }
 

  async _quest(){
  
    //const AsHistory = await history.get()
    const AsQuest   = await quest.get()
    const AsChallenge = await challenge.get()
      
  }


  

  cekdata() {
    const { identifier } = this.state;
    var cnt =0;
    Beacons.detectIBeacons();
    Beacons
    .startRangingBeaconsInRegion(identifier)
    .then(() => console.log('Beacons ranging started succesfully'))
    .catch(error => console.log(`Beacons ranging not started, error: ${error}`));
    console.log('StartBeacon');
    ///
    this.setState({loading:true})
    const { rangingDataSource } = this.state;
    this.beaconsDidRange = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        console.log('Rhh', data);
          this.setState({ 
            rangingDataSource: rangingDataSource.cloneWithRows(data.beacons), 
            lokasi:data
          });
          //dapatkan data becons
          let t = this.state.lokasi.beacons
          console.log('databecone',t)
          // let cnt = 0;
          if(typeof t != "undefined" && t.length != 0){
            for(let i in t ){
              let lok = t;
             lok.map((l,i)=> {

                let dist = l.distance ? l.distance.toFixed(1) : 'NA';
                console.log('jarak', dist);
                if(dist > 5) {
                  Alert.alert('Silahkan mendekat ke boot indonesia menari');
                }else{
                  Actions.camera()
                }

               })
             
            }

            Beacons
            .stopRangingBeaconsInRegion(identifier)
            .then(() => console.log('Beacons ranging stopped succesfully'))
            .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));
            console.log('jalan')
        
             this.beaconsDidRange.remove();
            this.setState({loading:false})
          } else{
            console.log('datakosong')
           
          }
              
          cnt++;
          if(cnt >12){
            Alert.alert('Silahkan Nyalakan Bluetooth anda atau Silakan mendekati Boot');
            Beacons
            .stopRangingBeaconsInRegion(identifier)
            .then(() => console.log('Beacons ranging stopped succesfully'))
            .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));
            console.log('jalan')
        
             this.beaconsDidRange.remove();
            this.setState({loading:false})
          }
      }
    );
   
   }


   cekdataVideo() {
    const { identifier } = this.state;
    var cnt =0;
    Beacons.detectIBeacons();
    Beacons
    .startRangingBeaconsInRegion(identifier)
    .then(() => console.log('Beacons ranging started succesfully'))
    .catch(error => console.log(`Beacons ranging not started, error: ${error}`));
    console.log('StartBeacon');
    ///
    this.setState({loadvid:true})
    const { rangingDataSource } = this.state;
    this.beaconsDidRange = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        console.log('DataBeacon', data);
          this.setState({ 
            rangingDataSource: rangingDataSource.cloneWithRows(data.beacons), 
            lokasi:data
          });
          let t = this.state.lokasi.beacons
          console.log('databecone',t)
          if(typeof t != "undefined" && t.length != 0){
            for(let i in t ){
              let lok = t;
             lok.map((l,i)=> {

                let dist = l.distance ? l.distance.toFixed(1) : 'NA';
                console.log('jarak', dist);
                if(dist > 5) {
                  Alert.alert('Silahkan mendekat ke boot indonesia menari');
                }else{
                  Actions.videorec()
                }

               })
             
            }

            Beacons
            .stopRangingBeaconsInRegion(identifier)
            .then(() => console.log('Beacons ranging stopped succesfully'))
            .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));
            console.log('jalan')
        
             this.beaconsDidRange.remove();
            this.setState({loadvid:false})
          } else{
            console.log('datakosong')
            //Actions.video()
          }
          cnt++;
          if(cnt >12){
            Alert.alert('Silahkan Nyalakan Bluetooth anda atau Silakan mendekati Boot');
            Beacons
            .stopRangingBeaconsInRegion(identifier)
            .then(() => console.log('Beacons ranging stopped succesfully'))
            .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));
            console.log('jalan')
        
             this.beaconsDidRange.remove();
            this.setState({loadvid:false})
          }
       
      }
    );
   
   }

   _toCamera(){
     //Actions.()
   }
   _toVideo(){
    //Actions.videorec()
  }

  openCamera = () => {
		Actions.CameraCapture({
			mediaType: 'image'
		})
	}

	openVideo = () => {
		Actions.CameraCapture({
			mediaType: 'video'
		})
	}



  render() {
   const name='nama'
    return (
      
      <View style={styles.container}>
       
            <View style={[styles.header, { flex:1, paddingBottom: 10 }]}>
              <View style={[styles.gridItemHeader,{
               flex:1,
               paddingLeft: 10
                }]}>
                <Image source={require('../../img/ikaAsset/LOGO.png')}  
                style={{width:'100%',height:120 ,resizeMode:'contain'}}/>
              </View>
              
              <View style={[styles.gridItemHeader,{
               flex : 2,
               paddingHorizontal: 20
                }]}>
                <Text style={{color:'#339933',fontSize:17,fontWeight:'bold'}}>Update status yuk!</Text>
                <Text style={{color:'#339933',fontSize:10,textAlign:'center', paddingTop:7}}>Ambil foto dan video di venue Indonesia Menari 2018 dengan aplikasi ini.</Text>
                <Text style={{color:'#339933',fontSize:10,textAlign:'center', paddingTop:7}}>Shared di FB untuk dapatkan poin dan hadiah menarik!</Text>
              </View>

              <TouchableOpacity style={styles.back} onPress={()=>{Actions.IKdrawer() }}>
                    <Icon 
                    name="ios-arrow-round-back" 
                    size={50} 
                    color="#E80E89" />	
              </TouchableOpacity>
            </View>

            
            
            <View style={[styles.grid, { flex:2, paddingHorizontal:20, }]} >
              <View style={[styles.gridItem,{borderLeftWidth:0, borderRightWidth:0, paddingRight:10}]}>
                <TouchableOpacity onPress={()=>{this.openCamera() }} >
                        <View style={[styles.gridItemImage, {justifyContent:'center', alignItems:'center'}]}>
                            <Icon   name="ios-camera" 
                                    size={70} 
                                    
                                    color="#040404" />
                        </View>
                        <Text style={styles.gridItemText}>FOTO GREGET</Text> 
                </TouchableOpacity>
              </View>
              <View style={[styles.gridItem,{borderRightWidth:0, paddingLeft:10}]}>
                <TouchableOpacity onPress={()=>{ this.openVideo() }} >
                        <View style={[styles.gridItemImage, {justifyContent:'center', alignItems:'center'}]}>
                            <Icon name="ios-videocam"  
                                  size={70} 
                                  
                                  color="#040404"/>
                        </View>
                    <Text style={styles.gridItemText}>REKAM MOMEN</Text> 
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.grid2, { flex:2, paddingBottom:20, paddingHorizontal:20, }]} >
              <View style={[styles.gridItem,{borderWidth: 0, paddingRight:10}]}>
                <TouchableOpacity onPress={()=>{Actions.album() }} >
                        <View style={[styles.gridItemImage, {justifyContent:'center', alignItems:'center'}]}>
                            <FAIcon   name="image" 
                                    size={50} 
                                    
                                    color="#040404" />
                        </View>
                        <Text style={styles.gridItemText}>GALERI MENARI</Text> 
                </TouchableOpacity>
              </View>
              <View style={[styles.gridItem,{borderRightWidth:0, borderBottomWidth:0, borderTopWidth:0, paddingLeft:10}]}>
                <TouchableOpacity onPress={()=>{ Actions.redeem() }}>
                        <View style={[styles.gridItemImage, {justifyContent:'center', alignItems:'center',backgroundColor:'#000'}]}>
                            {/* <FAIcon name="trophy"  
                                  size={50} 
                                  onPress={()=>{ Actions.redeem() }} 
                                  color="#040404"/> */}
                              <Image source={require('../../img/ikaAsset/Skor_Icon.png')}  
                                    style={{width:'100%',height:120 ,resizeMode:'contain'}}
                                  />
                        </View>
                    <Text style={styles.gridItemText}>SKOR KAMU</Text> 
                </TouchableOpacity>
              </View>
            </View>
            
            
            {/* <View style={styles.wizard} >
            
             
                {/* <Image source={require('../../img/logo-magic.png')} style={styles.thumbnail}/> */}
                                    
              {/* <Image source={require('../../img/logo-garis.png')}  style={styles.garis}/>  
            </View> */}
       </View>
    );
  }

}


let CIRCLE_RADIUS=46;
let Window = Dimensions.get('window');



const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        
  },
  header: {
    flex: 0.6,
    // backgroundColor: '#000',
    // paddingVertical: 10,
    // resizeMode:'cover',
    // top: 0,
    // left: 0,
    //
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor:'#000',
    height:100
  },
 
  wizard: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
    alignItems : 'center'
  },
  
  ImageFooter: {
      fontSize: 20,
      fontWeight: 'bold',
      color:'#ffffff',
      bottom: 10,
      position:'absolute',   
    },
  garis: {
      width: '30%',
      height: '10%',
      position:'absolute', 
      bottom:0,
    },
  IconBiground: {
      marginBottom:20,
    },
  smallText: {
    fontSize: 11,
  },


  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // flex: 0.7,
    backgroundColor:'#000'
    //backgroundColor:'#e84393'
},
grid2: {
  justifyContent: 'center',
  flexDirection: 'row',
  flexWrap: 'wrap',
  // flex: 1,
  backgroundColor:'#000'
  //backgroundColor:'#ffff'
},
gridItemHeader: {
  margin:0,
  // width: Dimensions.get('window').width / 2.2,
  height: 150,
  justifyContent: 'center',
  alignItems: 'center',
},
gridItem: {
    margin:0,
    width: Dimensions.get('window').width / 2.2,
    // height: 190,
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#000',
   // borderColor: '#e84393',
    //borderRadius: 8,
   // borderColor: '#e84393',
   borderWidth: 2,
    borderColor:'#E80E89'
},
gridItemImage: {
    width: 100,
    height: 100,
    borderWidth: 1.5, 
    borderColor: '#e84393',
    borderRadius: 50,
    //backgroundColor:'#e84393'
    backgroundColor:'#E80E89'
},
gridItemText: {
    marginTop: 5,
    textAlign:'center',
    //color:'#47d147'
    color:'#339933'
},
circle:{
backgroundColor     : '#1abc9c',
//backgroundColor		:'transparent',
 width               : CIRCLE_RADIUS*2,
 height              : CIRCLE_RADIUS*2,
 borderRadius        : CIRCLE_RADIUS
},
back:{
  position:'absolute',
  top:0,
  left:10,
  //backgroundColor:'powderblue'
},

});
