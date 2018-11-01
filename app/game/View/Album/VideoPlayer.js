import React, {
    Component
  } from 'react';
  
  import {
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    Image,

  } from 'react-native';
  
  import Video from 'react-native-video';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import IoIcon from 'react-native-vector-icons/Ionicons';
  import FAIcon from 'react-native-vector-icons/FontAwesome';
  import RNFetchBlob from 'rn-fetch-blob'
  import { Actions } from 'react-native-router-flux';
  import RNFS from 'react-native-fs'
  import FBSDK, { LoginButton, AccessToken,LoginManager,
    SharePhotoContent, ShareApi,ShareDialog,
    GraphRequest,GraphRequestManager ,ShareVideoContent} from 'react-native-fbsdk';

  import { DirectoryImageSave,
    dirPictures,
    tmpDir,
    imageRoot,
    imageOriginal,
    imageResult,getAllFrame, uniqArray, p, tmpFrame, getImageSize, combineImageCached } from '../CameraCapture/helper';
  import ImageAutoSize from '../CameraCapture/ImageAutoSize';

  
  export default class VideoPlayer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        rate: 1,
        volume: 1,
        muted: false,
        resizeMode: 'contain',
        duration: 0.0,
        currentTime: 0.0,
        paused: true,
        path:null,
        data:this.props,
        ShareVideoContent:[],
        FBaccessToken:null
      };
     
    }
  
   
    video: Video;

    componentDidMount(){

      const path = this.state.data.item.path;
      let SharePhoto =  { imageUrl: 'file:///storage/emulated/0/IndonesiaKaya/images/results/20181023024934.JPEG' };
      let ShareVideo = {localUrl:`${path}`};

      let ShareVideoContent={
        contentType: 'video',
        video: {localUrl:`${path}`},
      //  previewPhoto: SharePhoto,
      
      }
      this.setState({
        path:path,
        ShareVideoContent:ShareVideoContent
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


    shareVideoWithShareDialog() {
      console.log('dialog',this.state.ShareVideoContent)
      
      if(this.state.FBaccessToken == null){
        console.log('cek')
        this._loginFac()
      }else{
    
       var tmp = this;
       
       FBSDK.ShareDialog.canShow(this.state.ShareVideoContent).then(
        
       function (canShow) {
        console.log('canShow',canShow); 
           if (canShow) {
           return FBSDK.ShareDialog.show(tmp.state.ShareVideoContent);
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
    }

    ShareVideo(){
      console.log('dialog',this.state.ShareVideoContent)
      var shareContent=this.state.ShareVideoContent;

      if(this.state.FBaccessToken == null){
        console.log('cek')
        this._loginFac()
      }else{
        ShareApi.canShare(shareContent).then(
          function(canShare) {
            console.warn("canShare: " + canShare);
            if (canShare) {
              return ShareDialog.show(shareContent);
            }
          }
        ).then(
          function(result) {
            console.warn(result);
          },
          function(error) {
            console.warn(error);
          }
        );
      }
      
    }
    
  
    onLoad = (data) => {
      //console.log('onload',data)
      this.setState({ duration: data.duration });
    };
  
    onProgress = (data) => {
      //console.log('onProgress',data)
      this.setState({ currentTime: data.currentTime });
    };
  
    onEnd = () => {
      //console.log('onEnd',data)
      this.setState({ paused: true })
      this.video.seek(0)
    };
  
    onAudioBecomingNoisy = () => {
      this.setState({ paused: true })
    };
  
    onAudioFocusChanged = (event: { hasAudioFocus: boolean }) => {
      this.setState({ paused: !event.hasAudioFocus })
    };
  
    getCurrentTimePercentage() {
      if (this.state.currentTime > 0) {
        return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
      }
      return 0;
    };
  
    renderRateControl(rate) {
      const isSelected = (this.state.rate === rate);
  
      return (
        <TouchableOpacity onPress={() => { this.setState({ rate }) }}>
          <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
            {rate}x
          </Text>
        </TouchableOpacity>
      );
    }
  
    renderResizeModeControl(resizeMode) {
      const isSelected = (this.state.resizeMode === resizeMode);
  
      return (
        <TouchableOpacity onPress={() => { this.setState({ resizeMode }) }}>
          <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
            {resizeMode}
          </Text>
        </TouchableOpacity>
      )
    }
  
    renderVolumeControl(volume) {
      const isSelected = (this.state.volume === volume);
  
      return (
        <TouchableOpacity onPress={() => { this.setState({ volume }) }}>
          <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
            {volume * 100}%
          </Text>
        </TouchableOpacity>
      )
    }


    Header(){
      return(
        <View style={styles.back}>
            <TouchableHighlight
              style={{width: 30, height: 30}}
              onPress={() =>{ 
                this.setState({path:'',video:null})
                Actions.album()}}
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
              onPress={()=>{ this.shareVideoWithShareDialog()}} 
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
  
    render() {
      const flexCompleted = this.getCurrentTimePercentage() * 100;
      const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
  
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.fullScreen}
            onPress={() => this.setState({ paused: !this.state.paused })}
          >
            <Video
              ref={(ref: Video) => { this.video = ref }}
              /* For ExoPlayer */
              source={{uri: ''+this.state.path+''}}
              style={styles.fullScreen}
              rate={this.state.rate}
              paused={this.state.paused}
              volume={this.state.volume}
              muted={this.state.muted}
              resizeMode={this.state.resizeMode}
              //onLoad={this.onLoad}
              onProgress={this.onProgress}
              onEnd={this.onEnd}
              onAudioBecomingNoisy={this.onAudioBecomingNoisy}
              onAudioFocusChanged={this.onAudioFocusChanged}
              repeat={false}
            />
            <View style={[{left:100,top:150},!this.state.paused && {display: 'none' }]}>
            <FAIcon name='play-circle-o' size={150} 
                              color='rgb(203, 203, 180)'
                              //color='rgb(255, 26, 140)'
                              style={{position: 'absolute',top:20, left: 20,opacity:0.5 }}/>
        
            </View>
                   
          </TouchableOpacity>
          {this.Header()}
          {this.Footer()}
  
          <View style={styles.controls}>
            <View style={styles.generalControls}>
              <View style={styles.rateControl}>
                {this.renderRateControl(0.25)}
                {this.renderRateControl(0.5)}
                {this.renderRateControl(1.0)}
                {this.renderRateControl(1.5)}
                {this.renderRateControl(2.0)}
              </View>
  
              <View style={styles.volumeControl}>
                {this.renderVolumeControl(0.5)}
                {this.renderVolumeControl(1)}
                {this.renderVolumeControl(1.5)}
              </View>
  
              <View style={styles.resizeModeControl}>
                {this.renderResizeModeControl('cover')}
                {this.renderResizeModeControl('contain')}
                {this.renderResizeModeControl('stretch')}
              </View>
            </View>
  
            <View style={styles.trackingControls}>
              <View style={styles.progress}>
                <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
                <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
              </View>
            </View>
          </View>
        </View>
      );
    }
  }
  
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    },
    fullScreen: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    controls: {
      backgroundColor: 'transparent',
      borderRadius: 5,
      position: 'absolute',
      bottom: 80,
      left: 20,
      right: 20,
    },
    progress: {
      flex: 1,
      flexDirection: 'row',
      borderRadius: 3,
      overflow: 'hidden',
    },
    innerProgressCompleted: {
      height: 20,
      backgroundColor: '#cccccc',
    },
    innerProgressRemaining: {
      height: 20,
      backgroundColor: '#2C2C2C',
    },
    generalControls: {
      flex: 1,
      flexDirection: 'row',
      borderRadius: 4,
      overflow: 'hidden',
      paddingBottom: 10,
    },
    rateControl: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    volumeControl: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    resizeModeControl: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    controlOption: {
      alignSelf: 'center',
      fontSize: 11,
      color: 'white',
      paddingLeft: 2,
      paddingRight: 2,
      lineHeight: 12,
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