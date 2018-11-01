import React, { Component } from 'react';
import {
  AsyncStorage,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IoIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { RNCamera } from 'react-native-camera';
import NewAsyncStorage from '../../Library/AsyncStorage'
//import Share from '../../Comp/Share'
import qs from 'qs';
import Share, {ShareSheet, Button} from 'react-native-share';
import DetailShare from '../../Comp/DetailShare'
import RNFetchBlob from 'rn-fetch-blob'
import { Actions } from 'react-native-router-flux';
import RNFS from 'react-native-fs'
import FBSDK, { LoginButton, AccessToken,LoginManager,
  SharePhotoContent, ShareApi,ShareDialog,GraphRequest,GraphRequestManager } from 'react-native-fbsdk';

import { DirectoryImageSave,
  dirPictures,
  tmpDir,
  imageRoot,
  imageOriginal,
  imageResult,getAllFrame, uniqArray, p, tmpFrame, getImageSize, combineImageCached } from '../CameraCapture/helper';
import ImageAutoSize from '../CameraCapture/ImageAutoSize';

import Video from 'react-native-video'

import VideoPlayer from './VideoPlayer'
import history from '../../js/gamify/history'
import quest from'../../js/gamify/quest'
import challenge from'../../js/gamify/challenge'
import Gamify from '../../js/gamify'




const window = Dimensions.get('window');

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
          path: null,
          tpath:null,
          loading:false,
          name:null,
          visible: false,
          data:this.props,
          loadFrame:false,
          FBaccessToken: null,
          share:[],
          shareLinkContent:[],
          sharePhotoContent:[],
          shareVideoContent:[],
          type:null
        };        
        const ima = this.state.data;
    
      }

      componentDidMount(){
        const data = this.state.data
        const ima = this.state.data.item;
        const type = this.state.data.text
        console.log('type',ima)
        console.log('data',data)

        if(type == 'image'){
            let sharePhotoContent={
              contentType : 'photo',
              photos: [{ imageUrl: `${ima.path}` }],
            }
              this.setState({
                  type:type,
                  path:ima.path,
                  sharePhotoContent:sharePhotoContent
              })
        }else{
          let shareVideoContent={
            contentType :'video',
            video: { localUrl: `${ima.path}` },
          }
            this.setState({
                type:type,
                path:ima.path,
                shareVideoContent:shareVideoContent
            })
        }
       
        
      }

      componentWillReceiveProps(itm){
          console.log('detailshare',itm)
          
      }


      _loginFac(){

        FBSDK.AccessToken.getCurrentAccessToken()
        .then((data) => {
          console.log('FB',data)
          this.setState({
            FBaccessToken: data.accessToken
          })
        })
        .catch(error => {
          console.log(error)
        })
          
        FBSDK.LoginManager.logInWithReadPermissions(['public_profile']).then(
          function(result) {
            if (result.isCancelled) {
              console.log('Login cancelled');
            } else {
              console.log('res',result)
              console.log('Login success with permissions: '
                +result.grantedPermissions.toString());
            }
          },
          function(error) {
            console.log('Login fail with error: ' + error);
          }
        );
        //this._shareDialog();
  
      }
  

      sharePhotoWithShareDialog() {
        console.log('dialog',this.state.sharePhotoContent)
       
    
        if(this.state.FBaccessToken == null){
          console.log('cek')
          this._loginFac()
        }else{
          var tmp = this;
          FBSDK.ShareDialog.canShow(this.state.sharePhotoContent).then(
          function (canShow) {
            console.log('canShow',canShow);
              if (canShow) {
              return FBSDK.ShareDialog.show(tmp.state.sharePhotoContent);
              }
              }
          ).then(
            function (result) {
            if (result.isCancelled) {
            alert('Share operation was cancelled');
          } else {
            console.log('resSahre',result)
              // alert('Share was successful with postId: '
              // + result.postId);
              let Post = {
                related_category_id:11,
                related_id:3
              }
              history.set(Post);
              Actions.home()
              }
          },
            function (error) {
            alert('Share failed with error: ' + error.message);
            }
          );
        }
    
         
      }

    shareVideoWithShareDialog() {
      console.log('dialog',this.state.shareVideoContent)
      //
      FBSDK.AccessToken.getCurrentAccessToken()
           .then((data) => {
             console.log('FBToken',data)
     
             if(data==''){
               this._loginFac()
             }
             this.setState({
               FBaccessToken: data.accessToken
             })
             
           })
           .catch(error => {
             console.log(error)
           })
       //
       var tmp = this;
       ShareDialog.canShow(this.state.shareVideoContent).then(
       function (canShow) {
           if (canShow) {
             console.log('she',ShareDialog.show(tmp.state.shareVideoContent))
           return ShareDialog.show(tmp.state.shareVideoContent);
           }
           }
       ).then(
         function (result) {
         if (result.isCancelled) {
         alert('Share operation was cancelled');
       } else {
         console.log('resSahre',result)
           alert('Share was successful with postId: '
           + result.postId);
           }
       },
         function (error) {
         alert('Share failed with error: ' + error.message);
         }
       );
   }

      renderImage() {
            return (
          <View style={styles.container}>
            
              <ImageAutoSize
                source={{ uri: this.state.path}}
                width={Dimensions.get('window').width}
              />
            {this.Header()}
            {this.Footer()}
          </View>
          
            );
        }

      renderVideo() {
          return (
         
         <View></View>
              
          );
      }
     
      //
      swicth(){
        if(this.state.type == 'image'){
         return this.renderImage()
        }else{
         return this.renderVideo()
        }
      }

      Header(){
        return(
          <View style={styles.back}>
              <TouchableHighlight
                style={{width: 30, height: 30}}
                onPress={() => Actions.album()}
              >
                <Icon name="arrow-back" color="#e84393" size={30} />
              </TouchableHighlight>
          </View>
        );
      }

      Footer(){
        return(
  
          <View style={styles.grid}>
            <View style={[styles.facebook, {justifyContent:'center', alignItems:'center'}]}>
                <TouchableHighlight 
                underlayColor='#99314a' 
                onPress={()=>{ this.sharePhotoWithShareDialog()}} 
                style={[styles.gridItemImage, {justifyContent:'center', alignItems:'center'}]}>
                <FAIcon name='facebook' style={{fontSize:30,color:'#000'}}/>
                </TouchableHighlight>
            </View>
            <View style={[styles.down, {justifyContent:'center', alignItems:'center'}]}>
                <TouchableHighlight 
                underlayColor='#99314a' 
                onPress={()=>{ null}} 
                style={[{justifyContent:'center', alignItems:'center'}]}>
                <FAIcon name='download' style={{fontSize:30,color:'#E80E89'}}/>
                </TouchableHighlight>
            </View>
            
            <View style={[styles.print, {justifyContent:'center', alignItems:'center'}]}>
                <TouchableHighlight 
                underlayColor='#99314a' 
                onPress={()=>{ null}} 
                style={[styles.gridItemImage, {justifyContent:'center', alignItems:'center'}]}>
                <Icon name='print' style={{fontSize:30,color:'#000'}}/>
                </TouchableHighlight>
            </View>
          </View> 
        );
      }
  
      render(){
          const Prev = this.swicth();
            return(
              Prev  
            );
      }
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000'
  },  
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: Dimensions.get('window').width,
    height: 80,
    backgroundColor: 'red'
  },
  back: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  go: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  facebook: {
    position: 'absolute',
    left: 20,
    bottom: 20,
  },
  print: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  down:{
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
  },
  separator: {
    height: 100,
    width: 10
  },
  lists: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#000'
  },
  blank: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#fff',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageResult: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#fff',
    marginTop: 10,
    marginBottom: 10
  },
  containerMark: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageFrameMarkingSelected: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#e84393'
  },
  iconMarkSelected: {
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 35,
    position: 'absolute'
  },
  grid:{
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
    height:80,
    backgroundColor:'#000',
    flexDirection:'row',
    flexWrap:'wrap'
  },
  itemGrid:{
    //flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    height:80,
    //backgroundColor:'#000'
  },
  gridItem: {
    margin:0,
    width: Dimensions.get('window').width / 2.2,
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#000',
   borderWidth: 2,
    borderColor:'#E80E89'
  },
  gridItemImage: {
    width: 50,
    height: 50,
    //borderWidth: 0.5, 
    borderColor: '#e84393',
    borderRadius: 35,
    //backgroundColor:'#e84393'
    backgroundColor:'#E80E89',
    marginTop:10,

  },

  backgroundVideo: {
    position: 'absolute',
    backgroundColor:'#ffff',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
    })    