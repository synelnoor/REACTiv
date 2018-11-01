/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    Alert,StyleSheet, TouchableOpacity,
    Text, 
    Dimensions,
    View,
    DeviceEventEmitter,  
    Image, 
    ListView} from 'react-native';
import Beacons from 'react-native-beacons-manager';
import Icon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import quest from'../../js/gamify/quest'
import challenge from'../../js/gamify/challenge'

import RNFetchBlob from 'rn-fetch-blob'


import {
  p,
  dirPictures,
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


    Header(){
        return(
            <View style={[styles.header, { 
              flex:1,
              //backgroundColor:'powderblue',
              justifyContent:'center',
              alignItems:'center' 
              //paddingBottom: 10 
              
              }]}>
              <View
                style={{
                  marginTop:30,
                  //backgroundColor:'#ffff',
                  width:300,
                  height:120,
                  flexDirection:'row'
                }}
                >
                  <View
                  style={{
                   // backgroundColor:'brown',
                    width:'30%'
                  }}
                  >
                     <Image source={require('../../img/ikaAsset/LOGO.png')}  
                        style={{width:'100%',height:120 ,resizeMode:'contain'}}/>
                  </View>
                  <View
                    style={{
                      //backgroundColor:'#000',
                      justifyContent:'center',
                      alignItems:'center',
                      width:'70%'
                    }}
                  >
                      <Text 
                        style={{color:'#339933',fontSize:17,fontWeight:'bold'}}>
                          Update status yuk!
                      </Text>
                      <Text style={{color:'#339933',fontSize:10,textAlign:'center', paddingTop:7}}>
                        Ambil foto dan video di venue Indonesia Menari 2018 dengan aplikasi ini.
                      </Text>
                      <Text style={{color:'#339933',fontSize:10,textAlign:'center', paddingTop:7}}>
                        Berbagi di FB untuk dapatkan poin dan hadiah menarik!
                      </Text>

                  </View>

                  
                            

              </View>

               
            </View>
        )
    }

    Navigation(){
        return(
          <View
            style={{
              justifyContent:'center', 
              alignItems:'center'
            }}
          >
            <View style={{
             backgroundColor:'#ffff',
             width:320,
             height:195,
             flexDirection:'row'
              }} >
            <View style={[
              styles.gridItem,
              {borderLeftWidth:0, borderRightWidth:0, paddingRight:10}]}>
              <TouchableOpacity onPress={()=>{this.openCamera() }} >
                      <View style={[styles.gridItemImage, {justifyContent:'center', alignItems:'center'}]}>
                          <Icon   name="ios-camera" 
                                  size={70} 
                                  
                                  color="#040404" />
                      </View>
                      <Text style={styles.gridItemText}>FOTO GREGET</Text> 
              </TouchableOpacity>
            </View>
            <View style={[
              styles.gridItem,
              {borderRightWidth:0, paddingLeft:10}]}>
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


          <View style={{
             backgroundColor:'#ffff',
             width:320,
             height:195,
             flexDirection:'row'
          }}
          >
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
                          
                            <Image source={require('../../img/ikaAsset/Skor_Icon.png')}  
                                  style={{width:'100%',height:120 ,resizeMode:'contain'}}
                                />
                      </View>
                  <Text style={styles.gridItemText}>SKOR KAMU</Text> 
              </TouchableOpacity>
            </View>

          </View>
         
        </View>);
    }


  render() {
  
    return (
      
      <View style={styles.container}>
        {this.Header()}
        <View
          style={{
            flex:3,
            backgroundColor:'#000'
          
          }}>
            {this.Navigation()}
        </View>
      
            
          
        <TouchableOpacity style={styles.back} onPress={()=>{Actions.IKdrawer() }}>
                    <Icon 
                    name="ios-arrow-round-back" 
                    size={45} 
                    color="#E80E89" />	
        </TouchableOpacity>   
            
       </View>
    );
  }

}


let CIRCLE_RADIUS=46;




const styles = StyleSheet.create({
  container: {
        flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:'#000',
    height:150
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
    flex:1,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor:'#000'

},
grid2: {
  justifyContent: 'center',
  flexDirection: 'row',
  flexWrap: 'wrap',
  backgroundColor:'#000'
},
gridItemHeader: {
  margin:0,
  // width: Dimensions.get('window').width / 2.2,
  height: 150,
  justifyContent: 'center',
  alignItems: 'center',
},
gridItem: {
    padding:5,
    height:'100%',
    //width: Dimensions.get('window').width / 2.2,
    width:'50%',
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#000',
    borderWidth: 2,
    borderColor:'#E80E89'
},
gridItemImage: {
    width: 100,
    height: 100,
    borderWidth: 1.5, 
    borderColor: '#e84393',
    borderRadius: 50,
    backgroundColor:'#E80E89'
},
gridItemText: {
    marginTop: 5,
    textAlign:'center',
    color:'#339933'
},
circle:{
backgroundColor     : '#1abc9c',
 width               : CIRCLE_RADIUS*2,
 height              : CIRCLE_RADIUS*2,
 borderRadius        : CIRCLE_RADIUS
},
back:{
  position:'absolute',
  top:0,
  left:10,
  //backgroundColor:'white'
  
},

});
