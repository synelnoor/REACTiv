import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  PermissionsAndroid,
  
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RNCamera } from 'react-native-camera';
import RNFetchBlob from 'rn-fetch-blob'
import Video from 'react-native-video'
import { Actions } from 'react-native-router-flux';
import RNFS from 'react-native-fs'
import FBSDK, { LoginButton, AccessToken,LoginManager,
  SharePhotoContent, ShareApi,ShareDialog } from 'react-native-fbsdk';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import qs from 'qs';
import NewAsyncStorage from '../../Library/AsyncStorage'




const window = Dimensions.get('window');


export default class VideoRec extends Component {
    constructor(props) {
        super(props);
        this.state = {
		      	ready:false,
            loading:false,
            recording:false,
            path:null,
            loadFrame:false,
		  };
    }

    async componentDidMount(){

        //serverRenderFrame
        //let authFrame = await this._authFrame();

    }
    
  

    async startRecording() {
        this.setState({ recording: true });
        // default to mp4 for android as codec is not set
        const { uri, codec = "mp4" } = await this.camera.recordAsync();
        console.log('path',uri)
        // let vd = await  RNFetchBlob.fs.readFile(uri, 'base64')
        // .then((dt) => {
        //   console.log('dt',dt)
        //   return dt;
        // }).catch((err) => {
        //   console.log(err.message, err.code);
        //   });

        this._UploadTake();
        
        this.setState({ recording: false, processing: true ,path:uri });
    }
    
    stopRecording() {
       
        this.camera.stopRecording();
      
        //this.setState({ recording: false });
    }


    //video
    static navigationOptions = ({ navigation }) => {
      const { state } = navigation
      // Setup the header and tabBarVisible status
      const header = state.params && (state.params.fullscreen ? undefined : null)
      const tabBarVisible = state.params ? state.params.fullscreen : true
      return {
        // For stack navigators, you can hide the header bar like so
        header,
        // For the tab navigators, you can hide the tab bar like so
        tabBarVisible,
      }
    }
  
    onFullScreen(status) {
      // Set the params to pass in fullscreen status to navigationOptions
      this.props.navigation.setParams({
        fullscreen: !status
      })
    }
    ///
    async _authFrame(){
      // let server = 'http://192.168.1.85:3000/';
      // let server = 'http://192.168.100.20:3000/';
      //ipbangPanji
      let server = 'http://122.248.32.182:3000/';
       let data  = {
             url: server + 'oauth/token',
             data : { 
                 client_id: 'indonesiakaya-media',
                 client_secret: '0IvASfFt5LpueneWnwNQQFPqSHVGoEV0',
                 grant_type : 'client_credentials',
                 scope : 'client_id,client_secret'
             }
         }

           fetch(data.url, {
             method: 'POST',
             headers: {
                 Accept: 'application/json',
                 'Content-Type': 'application/x-www-form-urlencoded',
                
             },
             body: qs.stringify(data.data)
         })
         .then(response => response.json())
         .then(responseData => {             
             AsyncStorage.setItem('@Gamify:authframe', JSON.stringify(responseData));
             console.log('ress',responseData)
             return responseData;
         })
         .catch(error => {
           console.error('fetch failed', error);
           return error;
         });
     }
   
   async  _UploadTake(img){
     this.setState({  loadFrame:true,              });

       const Blob = RNFetchBlob.polyfill.Blob;
       const fs = RNFetchBlob.fs;
       window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
       window.Blob = Blob;
       
       let nas = new NewAsyncStorage()
        nas.getItemByKey('@Gamify:authframe', (resp) => {
           console.log('temporary authframe ==> ',JSON.parse(resp) )
           let dt = JSON.parse(resp)
           

           //ipbangPanji
             RNFetchBlob.fetch('POST', 'http://122.248.32.182:3000/api/video', {
            // Accept: 'application/json,/',
             Authorization :  'Bearer '+dt.accessToken,
             'Content-Type' : 'multipart/form-data',
           }, [{
               name: 'video',filename : this.state.path, data: RNFetchBlob.wrap(this.state.path)
             }]).then((resp) => {
             console.log('r',resp.data)
           let img = JSON.parse(resp.data)
           let uri = img.docs.urlVideo;
           let pathh= `${RNFetchBlob.fs.dirs.MovieDir}/IndonesiaMenari/`
           let name = img.docs.fileName
           let shareLinkContent = {
             contentType: 'link',
             //contentUrl: 'https://www.facebook.com/',
             contentUrl:uri,
             contentDescription: 'Facebook sharing is easy!'
           };
           // let sharePhotoContent={
           //   contentType = 'photo',
           //   //photos: [{ imageUrl: uri }],
           // }
           RNFetchBlob.fs.exists(pathh)
           .then((exist) => {
               console.log(`file ${exist ? '' : 'not'} exists`)
               if(!exist){
                 RNFetchBlob.fs.mkdir(pathh)
                   .then((res) => { console.log(res)  })
                   .catch((err) => { console.log(err) })
               }
               
           })
           .catch((err) => { console.log(err)})


           this.setState({shareLinkContent:shareLinkContent, 
                        // sharePhotoContent:sharePhotoContent
                       })
               //Download
              
                   RNFetchBlob
                   .config({
                     fileCache : true,
                     appendExt : 'mp4',
                     path:pathh+name
                   })
                   .fetch('GET', uri, {
                     Authorization : 'Bearer '+dt.accessToken,
                     // more headers  ..
                   })
                   .then((res) => {

                     console.log('The file saved to ', res.path())
                     this.setState({ path:'file://'+ res.path(),
                                     tpath:res.path(),
                                     loadFrame:false,
                                   });

                       
                     let status = res.info().status;
                     //Copy fIle
                     // let dirs=RNFetchBlob.fs.dirs;
                     // let sr ='file://'+res.path();
                     // let dest= `${dirs.DownloadDir}/`;
                     // RNFetchBlob.fs.cp(sr, dest)
                     // .then((res) => { console.log(res) })
                     // .catch((err) => { console.log(err) })
                     
                     // if(status == 200) {
                     //   // the conversion is done in native code
                     //   let base64Str = res.base64()
                     //   // the following conversions are done in js, it's SYNC
                     //   let text = res.text()
                     //   let json = res.json()
                     // } else {
                     //   // handle other status codes
                     // }
                   })
                   .catch((errorMessage, statusCode) => {
                     console.error(errorMessage)
                   })

           }).catch((err) => {
             console.log('ee',err)
           })



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
     //this._shareDialog();

   }

   _shareFac(){
     
     console.log('sahare')
     // const photoUri = this.state.path
     // const FBSDK.sharePhotoContent = {
     //   contentType = 'photo',
     //   photos: [{ imageUrl: photoUri }],
     // }

     // FBSDK.ShareDialog.show(tmp.state.sharePhotoContent);
     // Build up a shareable link.
     //
   }


   shareDialog() {
     
     console.log('sharelink',this.state.shareLinkContent)
     var tmp = this;
     FBSDK.ShareDialog.setMode("web");
       FBSDK.ShareDialog.canShow(this.state.shareLinkContent).then(
       function(canShow) {
         if (canShow) {
           return FBSDK.ShareDialog.show(tmp.state.shareLinkContent);
         }
       }
     ).then(
       function(result) {
         console.log('ddddd',result)
         if (result.isCancelled) {
           console.log('Share cancelled');
         } else {
           console.log('Share success with postId: '
             + result.postId);
         }
       },
       function(error) {
         console.log('Share fail with error: ' + error);
       }
     );
   }

   sharePhotoWithShareDialog() {
      
         var tmp = this;
         FBSDK.ShareDialog.canShow(this.state.sharePhotoContent).then(
         function (canShow) {
             if (canShow) {
             return FBSDK.ShareDialog.show(tmp.state.sharePhotoContent);
             }
             }
         ).then(
           function (result) {
           if (result.isCancelled) {
           alert('Share operation was cancelled');
         } else {
             alert('Share was successful with postId: '
             + result.postId);
             }
         },
           function (error) {
           alert('Share failed with error: ' + error.message);
           }
         );
     }





     saveImage(){
       const { name,path } = this.state;
       console.log('dddd')
       let nas = new NewAsyncStorage()
       NewAsyncStorage.setItem('global', 'image', JSON.stringify({
         "name": 'IKapp',
         "path": path,
     }), (response) => {})

      //Copy fIle
       let dirs=RNFetchBlob.fs.dirs;
       let sr = this.state.path;
     
       console.log('sr',sr)
       //let dest= `file://${RNFS.ExternalStorageDirectoryPath}/`;
       let dest=`file://${dirs.DownloadDir}/sksk.jpg`
       console.log('det',dest)
       RNFetchBlob.fs.cp(sr, dest)
       .then((res) => { console.log(res) })
       .catch((err) => { console.log(err) })
       // RNFS.copyFile(sr, dest).then((res) => { console.log(res) })
       // .catch((err) => { console.log(err) })
     
 
     }


    //


    renderVideo(){
      let button = (
        <TouchableOpacity
          onPress={this.startRecording.bind(this)}
          style={styles.iconhp}
        >
        <Icon name="ios-play"  size={80} 
        //style={styles.iconhp}
        />
          {/* <Text style={{ fontSize: 14 }} style={styles.garis}> RECORD </Text> */}
        </TouchableOpacity>
      );
      return(
        <View style={{marginTop:10}}>
              
            <Video
              autoPlay={true}
              logo={'logo'}
              placeholder={'logo'}
              url={this.state.path}
              onFullScreen={status => this.onFullScreen(status)}
               fullScreenOnly
              //style={styles.preview}
            />
            <Text
              style={styles.cancel }
              onPress={() => this.setState({ path: null })}
            >Cancel
            </Text>
            <View style={styles.footer}>
              
                {button}
                
            </View>
         </View>
      )
    }

    renderCamera(){
      const { recording, processing } = this.state;

          let button = (
            <TouchableOpacity
              onPress={this.startRecording.bind(this)}
              style={styles.iconhp}
            >
            <Icon name="ios-play"  size={80} 
            //style={styles.iconhp}
            />
              {/* <Text style={{ fontSize: 14 }} style={styles.garis}> RECORD </Text> */}
            </TouchableOpacity>
          );

          if (recording) {
            button = (
              <TouchableOpacity
                onPress={this.stopRecording.bind(this)}
                style={styles.iconhp}
              >
                <Icon name="ios-square"  size={80}
                // style={styles.iconhp}
                  />
                {/* <Text style={{ fontSize: 14 }} style={styles.garis}> STOP </Text> */}
              </TouchableOpacity>
            );
          }

          if (processing) {
            button = (
              <View style={styles.iconhp}>
                <ActivityIndicator animating size={18} />
              </View>
            );
          }
          return(
            <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style = {styles.preview}
            type={RNCamera.Constants.Type.back}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}   
            // captureTarget={RNCamera.constants.CaptureTarget.disk}
            // captureMode = {RNCamera.constants.CaptureMode.video}
            // type= {RNCamera.constants.Type.front}
            //   aspect={RNCamera.constants.Aspect.fill}>  
            >
       
            <View style={styles.footer}>
              
                {button}
                
                </View>
            </RNCamera>
          )

      
    }

  render() {
   
    return (
      <View style={styles.container}>
             {this.state.path ? this.renderVideo() : this.renderCamera()}
      </View>
    );
  }

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  },
  //nec
  foto: {
    position:'relative',
    flex: 5,
    width: '100%',
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9a057',
  },
  fotoasli: {
    zIndex:-1,
    position:'absolute',
    width: '100%',
    height: '100%',

  },
  fotobiground: {
    zIndex:1,
    position:'absolute',
    width: '100%',
    height: '100%',
    bottom: 80,    

  },
  textfoto: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'#ffffff',
    zIndex:2,
    position:'absolute',
    bottom: 90,    
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  footer: {
    width: Dimensions.get('window').width, 
    height: 80, 
    backgroundColor: '#f9a057',
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,    
  },
  garis: {
    width: '30%',
    height: '10%',
  },
  iconhp: {
    marginTop: -10,
    color:'#040404',
    height: '90%',
  },
  cancel: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'transparent',
    color: '#FFF',
    fontWeight: '600',
    fontSize: 17,
  },
});
