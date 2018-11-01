import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNFS from 'react-native-fs';
import Orientation from 'react-native-orientation';
import { getAccelerometer, saveAndRotate, overlay2Image } from './helper';
import ButtonTakePicture from './ButtonTakePicture';
import ButtonFaceCamera from './ButtonFaceCamera';
import ButtonPrePreview from './ButtonPrePreview';
import ImagePreview from './ImagePreview';

class VideoCapture extends Component {
  constructor(props) {
    super(props);
    this.camera = this.camera;
  }
  state = {
    tmpCapture: null,
    viewRef: null, 
    path: null,
    x: 0,
    orientation: 'portrait',
    flicker: {
      opacity: 0
    },
    type: 'front',
    mirrorImage: true
  }

  async componentWillMount() {
    const acc = await getAccelerometer();
    acc.subscribe(({ x }) => this.setState({ x }));
  }

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  takePicture = async () => {
    const x = parseInt(this.state.x);
    this.flickerEffect();

    const options = {
      forceUpOrientation: false,
      fixOrientation: true,
      quality: 0.8,
      width: 1920,
      mirrorImage: this.state.mirrorImage
    };

    const data = await this.camera.takePictureAsync(options);
    const saved = await saveAndRotate(x, data);

    this.setState({
      orientation: saved.orientation,
      path: saved.uri
    });

    return false;
  };

  flickerEffect = () => {
    this.setState({
      flicker: {
        opacity: 1,
      }
    }, () => {
      setTimeout(() => {
        this.setState({
          flicker: {
            opacity: 0,
          }
        });
      }, 100);
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

  renderCamera() {
    return (
      <RNCamera
        ref={(cam) => {
          this.camera = cam;
        }}
        type={this.state.type}
        style={styles.preview}
        playSoundOnCapture={true}
        flashMode={RNCamera.Constants.FlashMode.off}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}
        orientation="auto"
        mirrorImage={this.state.mirrorImage}
      >
        <View style={styles.bottomToolbar}>
          <ButtonPrePreview preview={this.state.path} />
          <ButtonTakePicture onPress={this.takePicture.bind(this)} />
          <ButtonFaceCamera facing={this.toggleFacing.bind(this)} />
        </View>
        <View style={[styles.flicker, this.state.flicker]} />
      </RNCamera>
    );
  }

  renderImage() {
    return (
      <ImagePreview imageSource={this.state.path} onBack={() => this.setState({ path: null })} />
    );
  }
  // render() {
  //   return (
  //     <View style={styles.container} onLayout={(ev) => console.log(ev.nativeEvent.layout)}>
  //       {this.state.path ? this.renderImage() : this.renderCamera()}
  //     </View>
  //   );
  // }

  render() {
    return (
      <View style={styles.container} onLayout={(ev) => console.log(ev.nativeEvent.layout)}>
        {this.renderCamera()}
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
  },
  bottomToolbar: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    bottom: 0,
    paddingTop: 50,
    position: 'absolute',
    zIndex: 10,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
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
  }
});

export default VideoCapture;
