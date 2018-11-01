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
  
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { RNCamera } from 'react-native-camera';
import NewAsyncStorage from '../../Library/AsyncStorage'
//import Share from '../../Comp/Share'
import qs from 'qs';
import Share, {ShareSheet, Button} from 'react-native-share';
import DetailShare from '../../Comp/DetailShare'
import Loading from '../../Comp/Loading'
import {TWITTER_ICON,
        FACEBOOK_ICON,
        WHATSAPP_ICON, 
        GOOGLE_PLUS_ICON,
        EMAIL_ICON,
        PINTEREST_ICON, 
        CLIPBOARD_ICON,
        MORE_ICON,
        REACT_ICON} from '../../Comp/ShareIcon'
import RNFetchBlob from 'rn-fetch-blob'
import { Actions } from 'react-native-router-flux';
import RNFS from 'react-native-fs'
import FBSDK, { LoginButton, AccessToken,LoginManager,
  SharePhotoContent, ShareApi,ShareDialog,GraphRequest,GraphRequestManager } from 'react-native-fbsdk';



const window = Dimensions.get('window');


export default class Camera extends Component {
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
          sharePhotoContent:[]
        };        
    
      }

     async componentDidMount(){
       

        let nas = new NewAsyncStorage()
        nas.getItemByKey('@global:image', (resp) => {
            console.log('temporary Image ==> ', resp)
            
        })
        //serverRenderFrame
        let authFrame = await this._authFrame();

        // FBSDK.AccessToken.getCurrentAccessToken()
        // .then((data) => {
        //   console.log('fbtoken',data)
        //   this.setState({
        //     accessToken: data.accessToken
        //   })
        // })
        // .catch(error => {
        //   console.log(error)
        // })
      

       
      
      }

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
      this.setState({ 
                     loadFrame:true,
                                    });

        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
        
        let nas = new NewAsyncStorage()
         nas.getItemByKey('@Gamify:authframe', (resp) => {
            console.log('temporary authframe ==> ',JSON.parse(resp) )
            let dt = JSON.parse(resp)
            

            // RNFetchBlob.fetch('POST', 'http://192.168.100.20:3000/api/photo', {
            //ipbangPanji
              RNFetchBlob.fetch('POST', 'http://122.248.32.182:3000/api/photo', {
             // Accept: 'application/json,/',
              Authorization :  'Bearer '+dt.accessToken,
              'Content-Type' : 'multipart/form-data',
            }, [{
                name: 'image',filename : this.state.path, data: RNFetchBlob.wrap(this.state.path)
              }]).then((resp) => {
              console.log('r',resp.data)
            let img = JSON.parse(resp.data)
            let uri = img.docs.urlImage;
            let pathh= `${RNFetchBlob.fs.dirs.PictureDir}/IndonesiaMenari/`
            let name = img.docs.fileName
            let shareLinkContent = {
              contentType: 'link',
              //contentUrl: 'https://www.facebook.com/',
              contentUrl:uri,
              contentDescription: 'Facebook sharing is easy!'
            };
           
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
                          
                        })
                //Download
               
                    RNFetchBlob
                    .config({
                      fileCache : true,
                      appendExt : 'jpg',
                      path:pathh+name
                    })
                    .fetch('GET', uri, {
                      Authorization : 'Bearer '+dt.accessToken,
                      // more headers  ..
                    })
                    .then((res) => {

                      console.log('The file saved to ', res.path())

                      let sharePhotoContent={
                        contentType : 'photo',
                        photos: [{ imageUrl: `file://${res.path()}` }],
                      }
                      this.setState({ path:'file://'+ res.path(),
                                      tpath:res.path(),
                                      loadFrame:false,
                                      sharePhotoContent:sharePhotoContent
                                    });
                    })
                    .catch((errorMessage, statusCode) => {
                      console.error(errorMessage)
                    })

            }).catch((err) => {
              console.log('ee',err)
            })



        })

      }
   
      takePicture = async () => {
        this.setState({ loading:true });
        try {
          const data = await this.camera.takePictureAsync();
          console.log('ima',data.uri)
         
          let img = await  RNFetchBlob.fs.readFile(data.uri, 'base64')
            .then((da) => {
              return da;
            }).catch((err) => {
              console.log(err.message, err.code);
              });
              //serverRenderFrame
              await this._UploadTake();

            let share={
            "title":'IkaAPP',
            "message":'IkaAPP',
            "url":img,
            "path":data.uri
        
            }
            
          this.setState({ 
            path: data.uri,
            loading:false,
            share:share,
            data:share });
         
          
        } catch (err) {
          console.log('err: ', err);
        }
      };
    

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

    renderCamera() {
        return (
          <View>
            <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style = {styles.preview}
            type={RNCamera.Constants.Type.back}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
            fixOrientation={true} 
            
        >
        <View style={styles.wrapp}>
        <Image style={styles.borderImage} source={require("../../img/frame-portrait.png")} />
        </View>
        
       </RNCamera>
         <View style={styles.footer}>

          {this.state.loading ? <ActivityIndicator size="large"  color="#040404"  />:
            <TouchableOpacity
            onPress={this.takePicture.bind(this)} 
            >
                <Icon name="ios-camera"  size={80} style={styles.iconhp} />
                <Image source={require('../../img/logo-garis.png')}  style={styles.garis}/>
            </TouchableOpacity>}
        
        </View>
        </View>

        )
      }
    ///
    renderImage() {
      console.log('sher',this.state.share)
      let shareOptions = {
        title:this.state.share.title,
        message:this.state.share.message,
        url:this.state.path,
        subject:'Share Link'
      };
  
        return (
          <View>
            
             <Image
             source={{ uri: this.state.path,
                       scale: 1 }}
            
              style={styles.preview}
           />
           
            <Text
              style={styles.cancel}
              onPress={() => this.setState({ path: null })}
            >Cancel
            </Text>


            <View style={{position:'absolute',bottom:0,left:0,right:0,height:80,backgroundColor:'#fff',flexDirection:'row',flexWrap:'wrap'}}>
            <TouchableHighlight underlayColor='#99314a' onPress={()=>{ 
                                                                    //this._loginFac(),
                                                                    //this.shareDialog()
                                                                    this.sharePhotoWithShareDialog()
                                                                    }} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',flex:1,height:80,backgroundColor:'#99314a'}}><FAIcon name='facebook' style={{fontSize:40,color:'#fff'}}/></TouchableHighlight>
            {/* <TouchableHighlight underlayColor='#99314a' onPress={()=>{Share.shareSingle(Object.assign(shareOptions,{'social':'facebook'}));}} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',flex:1,height:80,backgroundColor:'#99314a'}}><FAIcon name='facebook' style={{fontSize:40,color:'#fff'}}/></TouchableHighlight> */}
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:80,width:1,marginBottom:3,backgroundColor:'#99314a'}}><View style={{height:40,width:1,backgroundColor:'rgba(255,225,255,0.5)'}}/></View>
            <TouchableHighlight underlayColor='#99314a' onPress={()=>{this.saveImage()}} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',flex:1,height:80,backgroundColor:'#99314a'}}><FAIcon name='save' style={{fontSize:40,color:'#fff'}}/></TouchableHighlight>
          </View>

            {/* <View style={styles.footer}>
            
             <TouchableOpacity
            onPress={() => {Actions.redeem()}}
            style={{alignItems : 'center'}}
            >
                <Icon name="ios-share"  size={40} style={{alignItems : 'center'}} />
                <Text style={{fontSize:18}}>SHARE</Text>
              
            </TouchableOpacity>  
            
        </View> */}
          </View>
        );
      }
   
    //




   
  render() {

    return (
      
      <View style={styles.container}>
      
     
           {this.state.path ? this.renderImage() : this.renderCamera()} 
      
    
      </View>
    );
  }

  
}

const styles = StyleSheet.create({

container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
   //backgroundColor:'red'
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
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
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
  //nec
  foto: {
    position:'relative',
    flex: 5,
    width: '100%',
    //justifyContent: 'center',
    backgroundColor:'#99314a',
    alignItems: 'center',
    //backgroundColor: '#f9a057',
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
    width: '100%', 
    height: 80, 
    //backgroundColor: '#972325',
    //backgroundColor: '#99314a',
    backgroundColor:'#000',
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
    color:'#ffffff',
    height: '90%',
  },
  containerShare: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    marginTop: 20,
    marginBottom: 20,
  },
  borderImage:{
   flex: 1,
    //height:'100%',
    // height:'100%',
    // width:'100%',

    height:window.height,
    width:window.width,

    resizeMode:'cover',
   
    //marginTop:-40,
    //marginBottom:100
  },
  wrapp:{
    flex:1,
    position: 'absolute',
    top: 0,
    left: 0,
    //backgroundColor:'#fff',
    resizeMode:'contain',
    
    width: '100%',
    height: '100%',
    //  height:1080,
    //  width:700
  }
});
