import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableHighlight,
  View,
  FlatList,
  Image,
  Text,
  ActivityIndicator
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DirectoryImageSave,
  p,
  dirPictures,
  tmpDir,tmpFrame,
  imageRoot,
  imageOriginal,
  imageResult,getAllFrame, uniqArray, getImageSize, combineImageCached } from './helper';
import ImageAutoSize from './ImageAutoSize';

import moment from 'moment';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import IoIcon from'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import history from '../../js/gamify/history'
import quest from'../../js/gamify/quest'
import challenge from'../../js/gamify/challenge'
import Gamify from '../../js/gamify'


import FBSDK, { LoginButton, AccessToken,LoginManager,
  SharePhotoContent, ShareApi,ShareDialog,GraphRequest,GraphRequestManager } from 'react-native-fbsdk';


class detailPreview extends Component {
  state = {
    frameList: [],
    width: 0,
    height: 0,
    orientation: 'portrait',
    result: '',
    isFrameSelected: 0,
    isLoading: false,
    data:this.props,
    FBaccessToken: null,
    share:[],
    shareLinkContent:[],
    sharePhotoContent:[]
  }

  async componentDidMount() {

    let chall =await challenge.challenge();
    //console.log('chs',chall)
   
     const ima = this.state.data
     let sharePhotoContent={
      contentType : 'photo',
      photos: [{ imageUrl: `${ima.path}` }],
    }
     this.setState({result:ima.path, 
                    sharePhotoContent:sharePhotoContent
                  })
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
          console.log('Login success with permissions: '
            +result.grantedPermissions.toString());
        }
      },
      function(error) {
        console.log('Login fail with error: ' + error);
      }
    );
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

 async saveImage(){

    path =  this.state.result;
    console.log('path',path)
    const Name = `${moment().format('YYYYMMDDhhmmss')}.JPEG`;
    dest =  `${p}${imageResult}/${Name}`
    const moved = await RNFS.copyFile(path, dest);
    
    Actions.home();
    return moved;
  

}

  

  render() {
    return (
      <View style={styles.container}>
         <ImageAutoSize
          source={{ uri: this.state.result === '' ? null : this.state.result }}
          width={Dimensions.get('window').width}
        />
      
        <View style={styles.back}>
          <TouchableWithoutFeedback
            style={{width: 30, height: 30}}
            onPress={() => Actions.pop()}
          >
            <Icon name="arrow-back" color="#e84393" size={30} />
          </TouchableWithoutFeedback>
        </View>
       

        {this.state.isLoading && (
          <ActivityIndicator size="large" color="#e84393" style={{ position: 'absolute' }} />
        )}

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
              onPress={()=>{ this.saveImage()}} 
              style={[{justifyContent:'center', alignItems:'center'}]}>
              <FAIcon name='download' style={{fontSize:30,color:'#E80E89'}}/>
              {/* <Image source={require('../../img/ikaAsset/SaveIcon.png')}  
                                style={{width:'100%',height:30 ,resizeMode:'contain'}}
                               /> */}

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
      </View>
    );
  }
}

// ImagePreview.propTypes = {
//   imageSource: PropTypes.string
// };


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
});

export default detailPreview;
