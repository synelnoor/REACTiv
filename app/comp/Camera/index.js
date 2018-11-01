import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Text,
  Animated,
  TouchableOpacity
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Orientation from 'react-native-orientation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconION from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
import FastImage from 'react-native-fast-image';
import { getAccelerometer, orientationCheck, getAllFrame, getImageFromVideo, autoHeightByRatio, saveVideo, sleep, p, tmpFrame, rotateImage } from './helper';
import ButtonFaceCamera from './ButtonFaceCamera';
import ButtonPrePreview from './ButtonPrePreview';
import ButtonTakePicture from './ButtonTakePicture';
import moment from 'moment';

const HEADER_HEIGHT = 50;

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const flashModeOrderVideo = {
  off: 'torch',
  torch: 'off',
};

const DESIRED_RATIO = '3:4';
const VIDEO_RATIO = '9:16';

class CameraCapture extends Component {
  constructor(props) {
    super(props);
    this.camera = this.camera;
    this.acc = null;
  }

  state = {
    isCamera: true,
    path: null,
    realPath: null,
    videoThumb: null,
    x: 0,
    flash: 'off',
    orientation: 'portrait',
    flicker: {
      opacity: 0
    },
    frameList: [],
    type: 'front',
    mirrorImage: true,
    isRecording: false,
    timeRecording: '00:00',
    mediaType: 'image',
    visible: false,
    frameSlideValue: new Animated.Value(100),
    bottomToolBarSlideValue: new Animated.Value(600),
    ratio: null,
    ratW: 0,
    ratH: 0,
    ratLw: 0,
    ratLh: 0,
    bottomToolBarHeight: 0,
    marginTopBottomToolbar: 0,
    isSlideHidden: true,
    frame: null,
    indexFrame: 0,
    errorMount: false,
    startCamera: true,
  };

  timerId = 0;

  async componentWillMount() {
    this.acc = await getAccelerometer();
    this.acc.subscribe(({ x }) => this.setState({ x }));

    const permit = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ]);  

    console.log('result', permit);
  }

  componentWillUnmount() {
    this.acc.stop();
    // this.camera = null;
  }

  componentDidMount() {
    Orientation.lockToPortrait();
    this.setState({ key: Math.random() });
    
    if (this.props.mediaType === 'image') {
      this.setState({
        isCamera: true
      }, () => {
        this.setState({
          flash: 'off'
        });
      });
    } else {
      this.setState({
        isCamera: false
      }, () => {
        this.setState({
          flash: 'off'
        });
      });
    }
    this.loadFrameList();
    const scrHeight = Dimensions.get('window').height;
    const { width, height } = autoHeightByRatio(DESIRED_RATIO, Dimensions.get('window').width);
    const bottomToolBarHeight = scrHeight - (HEADER_HEIGHT + height);
    const marginTopBottomToolbar = (HEADER_HEIGHT + height);

    const largeRatio = autoHeightByRatio(VIDEO_RATIO, Dimensions.get('window').width);
    
    this.setState({
      ratW: width,
      ratH: height,
      ratLw: largeRatio.width,
      ratLh: largeRatio.height,
      bottomToolBarHeight,
      marginTopBottomToolbar
    });
  }

  loadFrameList = async () => {
    const allFrame = await getAllFrame();
		let dt = [];
    for (let img in allFrame) {
      let nm = allFrame[img].name;
      dt.push(nm);
    }
    if (this.props.withBlank) {
      dt.unshift('blank');
      this.setState({
        isFrameSelected: 0
      })
    }

    console.log('OYEAAAAH', dt);
    this.setState({
      frameList: dt
    });
  }

  // prepareRatio = async () => {
  //   if (Platform.OS === 'android' && this.camera) {
  //     const ratios = await this.camera.getSupportedRatiosAsync();
  //     const ratio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];
      
  //     this.setState({ ratio });
  //   }
  // }

  tapToStartCamera = () => {
    this.setState({
      startCamera: true
    });
  }

  _toggleSubview() {    
    let toValue = 100;

    if(this.state.isSlideHidden) {
      toValue = 0;
    }

    Animated.timing(this.state.frameSlideValue, {
      toValue: toValue,
      duration: 100,
      useNativeDriver: true
    }).start();

    this.setState({
      isSlideHidden: !this.state.isSlideHidden
    });
  }

  recordingTime = () => {
    const self = this;
    const startTimestamp = moment().startOf("day");
    this.timerId = setInterval(function() {
      startTimestamp.add(1, 'second');
      self.setState({
        timeRecording: startTimestamp.format('mm:ss')
      })
    }, 1000);
  };

  clearTimeRecording = () => {
    clearInterval(this.timerId);
  }

  takePicture = async () => {
    const x = parseInt(this.state.x);
    this.flickerEffect();
    const orient = orientationCheck(x);
    console.log('TYPE RRRRR', this.state.type);

    console.log("KKKKKKK", orient);

    const options = {
      forceUpOrientation: false,
      fixOrientation: true,
      mirrorImage: this.state.mirrorImage
    };

    Actions.MediaPreviewRedux({
      frameList: this.state.frameList
    });

    const data = await this.camera.takePictureAsync(options);
    let newOriginalImageName = await rotateImage(orient, data);

    this.setState({
      path: newOriginalImageName,
      orientation: x,
      realPath: newOriginalImageName,
      mediaType: 'image',
      videoThumb: null,
      startCamera: false
    }, () => { 
      Actions.refresh({
        nn: Math.random(),
        mediaSource: newOriginalImageName,
        mediaType: 'image',
        videoThumb: null,
        indexFrame: 0,
        frame: null,
        orientation: orient,
        typeFace: this.state.type
      });
    });
    
    // setTimeout(() => {
    //   Actions.MediaPreviewRedux({
    //     frameList: this.state.frameList
    //   });
    // }, 100);

    return false;
  };

  takeVideo = async (rec) => {
    const x = parseInt(this.state.x);
    const orient = orientationCheck(x);

    if (rec === true) {

      await sleep(200);

      this.setState({
        isRecording: true
      }, () => {
        this.recordingTime();
      });

      const promise = await this.camera.recordAsync({
        forceUpOrientation: false,
        fixOrientation: true,
        captureAudio: true,
        quality: RNCamera.Constants.VideoQuality['4:3']
      });

      const data = await promise;

      const frameDefault = `${p}${tmpFrame}/${this.state.frameList[0]}`;
      const imageVideo = await getImageFromVideo(orient, data.uri);
      const { width, height } = autoHeightByRatio(DESIRED_RATIO, imageVideo.width);
      
      const actCroped = imageVideo.height - height;

      Actions.MediaPreviewRedux({
        frameList: this.state.frameList,
      });

      this.setState({
        path: imageVideo.uri,
      }, async () => {
        setTimeout(() => {
          saveVideo(x, data.uri, imageVideo.name, actCroped, imageVideo.width, imageVideo.height).then(rotate => {
            this.setState({
              realPath: rotate.uri,
              orientation: rotate.orientation,
              mediaType: 'video',
              videoThumb: imageVideo.uri,
              startCamera: false
            },() => {
              Actions.refresh({
                mediaSource: rotate.uri,
                mediaType: 'video',
                videoThumb: imageVideo.uri,
                indexFrame: 0,
                frame: null,
                orientation: orient,
                typeFace: this.state.type
              });
            });
          });
        }, 150);
      });
      // setTimeout(() => {
      //   Actions.MediaPreviewRedux({
      //     frameList: this.state.frameList,
      //   });
      // }, 100);
    } else {
      await sleep(200);
      this.clearTimeRecording();
      this.camera.stopRecording();
      this.setState({
        isRecording: false
      });
    }
  }

  toggleFlash = () => {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  }

  toggleTorchVideo = () => {
    this.setState({
      flash: flashModeOrderVideo[this.state.flash],
    });
  }

  flickerEffect = () => {
    this.setState({
      flicker: {
        opacity: 1,
      }
    }, async () => {
      await sleep(100);
      this.setState({
        flicker: {
          opacity: 0,
        }
      });
    });
  }

  toggleFacing(face) {
    if (face === 'front') {
      this.setState({ 
        type: face,
        mirrorImage: true
      }) 
    } else {
      this.setState({ 
        type: face,
        mirrorImage: false
      }) 
    }
  }

  toggleCamera() {
    this.setState({
      isCamera: !this.state.isCamera
    }, () => {
      if (this.state.isCamera === false) {
        if (this.state.flash === 'on' || this.state.flash === 'auto') {
          this.setState({
            flash: 'off'
          });
        }
      }
    });
  }

  flashChooseView() {
    if (this.state.flash === 'off') {
      return <Icon name="flash-off" color="#E80E89" size={30} />;
    } 
    else if (this.state.flash === 'on') {
      return <Icon name="flash-on" color="#e84393" size={30} />;
    }
    else if (this.state.flash === 'auto') {
      return <Icon name="flash-auto" color="#e84393" size={30} />;
    }
    else if (this.state.flash === 'torch') {
      return <Icon name="flare" color="#e84393" size={30} />;
    }
  }

  bottomToolBar() {
    return (
      <View style={[styles.bottomToolbar, { height: this.state.bottomToolBarHeight }]}>
        <View style={styles.preprev}>
          <ButtonPrePreview
            preview={this.state.path}
            realPath={this.state.realPath}
            mediaType={this.state.mediaType}
            videoThumb={this.state.videoThumb}
          />
          </View>
        {this.state.isCamera ? (
          <ButtonTakePicture
            camType="camera"
            onPress={this.takePicture.bind(this)}
            btnColor="#fff"
          />
        ) : (
          <ButtonTakePicture
            camType="video"
            btnColor="#E80E89"
            onPressRecord={this.takeVideo.bind(this)}
          />
        )}
        {/* <ButtonFaceCamera facing={this.toggleFacing.bind(this)} /> */}
        <View style={styles.camvid}>
          <ButtonFaceCamera facing={this.toggleFacing.bind(this)} />
        </View>
      </View>
    );
  }

  topToolBar() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.back}>
          <TouchableWithoutFeedback
            style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => this.state.onProcFramed ? false : Actions.pop()}
          >
            <IconION name="ios-arrow-round-back" color="#E80E89" size={50} />
          </TouchableWithoutFeedback>
        </View>
        {this.state.isCamera ? (
          <View style={styles.flash}>
            <TouchableWithoutFeedback
              onPress={() => this.toggleFlash()}
              style={{width: 30, height: 30}}
            >
              {this.flashChooseView()}
            </TouchableWithoutFeedback>
          </View>
        ) : (
          <View style={styles.flash}>
            <TouchableWithoutFeedback
              onPress={() => this.toggleTorchVideo()}
              style={{width: 30, height: 30}}
            >
              <Icon name="flare" color={this.state.flash === 'off' ? '#E80E89' : '#e84393'} size={30} />
            </TouchableWithoutFeedback>
          </View>
        )}
        
        <View style={styles.camTime}>
          {this.state.isCamera ? (
            <Text style={{ color: 'cyan' }}>CAMERA</Text>
          ) : this.state.isRecording ? (
            <Text style={{ color: 'red' }}>{this.state.timeRecording}</Text>
          ) : (
            <Text style={{ color: 'red' }}>VIDEO</Text>
          )}
        </View>
      </View>
    );
  }

  renderCamera() {
    if (this.state.startCamera) {
      return (
        <RNCamera
          key={this.state.key}
          ref={(cam) => {
            this.camera = cam;
          }}
          type={this.state.type}
          style={styles.preview}
          playSoundOnCapture={true}
          captureAudio={true}
          ratio="4:3"
          flashMode={this.state.flash}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          orientation="auto"
          onMountError={(e) => {
            console.log('Error camera niiih');
            this.camera = null;
            Actions.pop();
          }}
        >
          <View style={[styles.flicker, this.state.flicker]} />
        </RNCamera>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => this.setState({ startCamera: true })} >
          <Text style={{ color: '#fff' }}>Buka Kamera</Text>
        </TouchableOpacity>
      )
    }
  }

  render() {
    let d = {};
    if (this.state.startCamera === false) {
      d = {
        justifyContent: 'center',
        alignItems: 'center'
      };
    } else {
      d = {};
    }
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#e84393"
          barStyle="light-content"
          hidden
        />
        {this.topToolBar()}
        {this.state.width !== 0 && this.state.height !== 0 && (
          <View
            style={
              this.props.mediaType === 'image' ? {
                position: 'absolute',
                top: HEADER_HEIGHT,
                width: this.state.ratW,
                height: this.state.ratH,
                backgroundColor: '#000',
                ...d
              } : {
                position: 'absolute',
                top: HEADER_HEIGHT,
                width: this.state.ratW,
                height: this.state.ratH,
                backgroundColor: '#000',
                ...d
              }
            }
          >
            {this.renderCamera()}
            {this.state.frame !== null && (
            
              <FastImage
                style={{ 
                  position: 'absolute',
                  width: this.state.ratW,
                  height: this.state.ratH,
                }}
                resizeMode={FastImage.resizeMode.stretch}
                source={{uri: this.state.frame}}
              />
            )}
            
          </View>
        )}
        {this.state.bottomToolBarHeight > 0 && (
          <View style={{
            position: 'absolute',
            bottom: 0,
            width: Dimensions.get('window').width,
            height: this.state.bottomToolBarHeight,
            backgroundColor: '#000'
          }}>
            {this.bottomToolBar()}
          </View>
        )}
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  subView: {
    width: Dimensions.get('window').width,
    height: 100,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: Dimensions.get('window').width,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  preview: {
    flex: 1
  },
  back: {
    position: 'absolute',
    left: 10,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomToolbar: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flicker: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor:'#000',
    position: 'absolute',
    zIndex: 5
  },
  absolute: {
    position: "absolute",
    top: 0, left: 0, bottom: 0, right: 0,
  },
  flash: {
    position: 'absolute',
    right: 10,
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camvid: {
    borderRadius: 35,
    position: 'absolute',
    alignSelf: 'center',
    right: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },

  preprev: {
    borderRadius: 35,
    position: 'absolute',
    alignSelf: 'center',
    left: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },

  camTime: {
    position: 'absolute',
    alignSelf: 'center',
    top: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeFrame: {
    position: 'absolute',
    alignSelf: 'center',
    right: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CameraCapture;
