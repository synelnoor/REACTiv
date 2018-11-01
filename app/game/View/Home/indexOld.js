/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, Alert,StyleSheet,TouchableOpacity, Text, View, DeviceEventEmitter, ActivityIndicator, Image, ListView} from 'react-native';
import Beacons from 'react-native-beacons-manager';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
import {PERMISSION} from '../../Comp/Permission';
import auth,{login,check,user} from '../../js/gamify/auth'
import history from '../../js/gamify/history'
import quest from'../../js/gamify/quest'
import challenge from'../../js/gamify/challenge'
import Gamify from '../../gamify'




export default class Home extends Component {
  state = {
    uuid: 'cb10023f-a318-3394-4199-a8730c7c1aec',
    identifier: 'BeaconR',
    rangingDataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
    lokasi:[],
    loading:false,
    loadvid:false
  };
  
  componentWillMount(){

   
  }

  async componentDidMount() {

    console.log('perm',PERMISSION)
    let AsHistory = await history.get()
    let AsQuest   = await quest.get()
    let AsChallenge = await challenge.get()
    console.log({AsHistory,AsQuest,AsChallenge})

   
      //
  }

  componentWillUnMount() {
   
  }

  _quest(){
  
      
      
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
     Actions.camera()
   }
   _toVideo(){
    Actions.videorec()
  }



  render() {
   
    return (
      
      <View style={styles.container}>
            <View style={styles.header}>
              <Image source={require('../../img/ikaAsset/headerika.png')}  
              style={{width:'100%',height:175 ,resizeMode:'contain'}}/>
            </View>
            <View style={styles.foto} >
            
            {this.state.loading ? <ActivityIndicator size="large"  color="#040404"  />:
                                  <Icon name="ios-camera"  size={100} onPress={()=>{ //this.cekdata();  
                                                                                    this._toCamera() }} color="#040404" style={styles.IconBiground}/>  }
                      
              <Text style={styles.ImageFooter} >#FotoSeruIndonesiaMenari</Text>

                {/* <View style={{bottom:0,left:0,right:0,height:'100%',backgroundColor:'#fff',flexDirection:'row',flexWrap:'wrap'}}>
                <TouchableOpacity underlayColor='#99314a' onPress={()=>{null}} 
                style={{flexDirection:'row',justifyContent:'center',alignItems:'center',flex:1,height:80,backgroundColor:'#99314a'}}>
                <Image source={require('../../img/ikaAsset/photoik.png')}  
                        style={{width:'100%',height:90 ,resizeMode:'contain'}}/>
                </TouchableOpacity>
                </View> */}
            </View>
            
            <View style={styles.video} >

            {this.state.loadvid ? <ActivityIndicator size="large"  color="#040404"  /> : 
                                  <Icon name="ios-videocam"  size={100} onPress={()=>{ //this.cekdataVideo(); 
                                                                                      this._toVideo() }} color="#040404" style={styles.IconBiground}/>  }
             
              <Text style={styles.ImageFooter} >#VideoSeruIndonesiaMenari</Text>
            </View>
            <View style={styles.wizard} >
            
              <Icon name="ios-albums"  size={100} onPress={()=>{ Actions.album()  }} color="#ffffff" style={styles.IconBiground}/> 
                {/* <Image source={require('../../img/logo-magic.png')} style={styles.thumbnail}/> */}
                                    
              {/* <Image source={require('../../img/logo-garis.png')}  style={styles.garis}/> */}
            </View>
       </View>
    );
  }

}


const styles = StyleSheet.create({
  container: {
        flex: 1,
        flexDirection: 'column',
        
  },
  header: {
    flex: 1,
   // width: '100%',
    backgroundColor: '#000',
    //alignItems : 'center',
    paddingVertical: 10,
    resizeMode:'cover',
   
    //position: 'absolute',
    top: 0,
    left: 0,
  },
  foto: {
    flex: 1,
    width: '100%',
    backgroundColor: '#99314a',
    alignItems : 'center',
    paddingVertical: 20,
    marginBottom : 2,
    justifyContent: 'center',
  },
  video: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f9a057',
    alignItems : 'center',
    paddingVertical: 20,
    justifyContent: 'center',
  },
  wizard: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
    alignItems : 'center'
  },
  thumbnail: {
    width: 100, 
    height: 100,
   // paddingVertical: 30,
    
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
});
