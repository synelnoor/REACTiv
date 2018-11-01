import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  View,
  Image,
  Text,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconION from 'react-native-vector-icons/Ionicons';
import { getImageSizeFitWidth } from './ImageAutoSize/ImageSizeCache';
import { autoHeightByRatio, p, tmpFrame, overlay2Image, overlay2Video } from './helper';
import ImageAutoSize from './ImageAutoSize';
import FrameList from './FrameList';
import Video from './Video';

const HEADER_HEIGHT = 50;
const DESIRED_RATIO = '3:4';
const VIDEO_RATIO = '9:16';

class MediaPreviewRedux extends Component {
  state = {
    frameList: [],
    width: 0,
    height: 0,
    orientation: 'portrait',
    result: '',
    isFrameSelected: 0,
    frameNameSelected: null,
    isLoading: false,
    onProcFramed: false,
    mediaType: null,
    manipWidth: 0,
    manipHeight: 0,
    mediaType: 'image',
    mediaSource: null,
    videoThumb: null,
    frame: null,
    indexFrame: -1,
    imageResult: null,
    ratW: 0,
    ratH: 0,
    ratLw: 0,
    ratLh: 0,
    videoWidth: 0,
    videoHeight: 0,
    frameList: [],
    orientationModel: {},
    isProcess: false
  }

  componentWillMount() {
    this.setState({
      isLoading: true
    });
  }

  componentDidMount() {
    const scrHeight = Dimensions.get('window').height;
    const { width, height } = autoHeightByRatio(DESIRED_RATIO, Dimensions.get('window').width);
    const largeRatio = autoHeightByRatio(VIDEO_RATIO, Dimensions.get('window').width);
    
    this.setState({
      ratW: width,
      ratH: height,
      ratLw: largeRatio.width,
      ratLh: largeRatio.height,
    });
  }

  async componentWillReceiveProps(nextProps) {
    if(nextProps.mediaSource !== this.props.mediaSource && nextProps.mediaType === 'image'){

      const o = nextProps.orientation;
      const dl = nextProps.frameList;
      const hfr = [];

      for (let fr in dl) {
        let s = dl[fr].split('-')[1];
        
        if (s === o.orientation) {
          hfr.push(dl[fr]);
        }
      }

      const frameDefault = `${p}${tmpFrame}/${hfr[0]}`;

      this.setState({
        mediaSource: nextProps.mediaSource,
        frame: frameDefault,
        videoThumb: nextProps.videoThumb,
        mediaType: nextProps.mediaType,
        indexFrame: nextProps.indexFrame,
        isLoading: false,
        orientationModel: nextProps.orientation,
        frameList: hfr,
        typeFace: nextProps.typeFace
      });
    }

    else if(nextProps.mediaSource !== this.props.mediaSource && nextProps.mediaType === 'video'){
      const o = nextProps.orientation;
      const dl = nextProps.frameList;
      const hfr = [];

      for (let fr in dl) {
        let s = dl[fr].split('-')[1];
        
        if (s === o.orientation) {
          hfr.push(dl[fr]);
        }
      }

      if (o.orientation === 'landscape') {
        const largeRatio = autoHeightByRatio('16:9', Dimensions.get('window').width);
        this.setState({
          ratLw: largeRatio.width,
          ratLh: largeRatio.height,
        });
      }

      const frameDefault = `${p}${tmpFrame}/${hfr[0]}`;
      const mainpulateWidthHeight = await getImageSizeFitWidth({ uri: nextProps.videoThumb }, Dimensions.get('window').width);
      
      this.setState({
        mediaSource: nextProps.mediaSource,
        frame: frameDefault,
        videoThumb: nextProps.videoThumb,
        mediaType: nextProps.mediaType,
        indexFrame: nextProps.indexFrame,
        isLoading: false,
        orientation: nextProps.orientation,
        orientationModel: nextProps.orientation,
        frameList: hfr,
        manipWidth: mainpulateWidthHeight.width,
        manipHeight: mainpulateWidthHeight.height,
        typeFace: nextProps.typeFace
      });
    }
  }

  saveAndBuildImageVideo = async () => {
    console.log('MEDIA TIPE', this.state.mediaType)
    if (this.state.mediaType === 'image') {
      this.setState({
        isProcess: true
      }, async () => {
        const ovrImage = await overlay2Image(this.state.mediaSource, this.state.frame, this.state.typeFace)
        this.setState({
          isProcess: false
        }, () => {
          Actions.pop();
          Actions.PreviewResult({
            mediaResult: ovrImage
          });
        })
      });
      const overlay = await overlay2Image(this.state.mediaSource, this.state.frame)
      return overlay;
    } else {
      this.setState({
        isProcess: true
      }, async () => {
        if (this.state.videoWidth !== 0 && this.state.videoHeight !== 0) {
          if (this.state.orientationModel.orientation === 'landscape') {
            vidFinish = await overlay2Video(this.state.mediaSource, this.state.frame, this.state.videoHeight, this.state.videoWidth);
          } else {
            vidFinish = await overlay2Video(this.state.mediaSource, this.state.frame, this.state.videoWidth, this.state.videoHeight);
          }
        }
        this.setState({
          isProcess: false
        }, () => {
          Actions.pop();
          Actions.PreviewResult({
            mediaResult: vidFinish
          });
        });
      })
    }
  }

  renderResultPreview() {
    if (this.state.mediaSource !== null && this.state.frame !== null) {
      return this.state.mediaType === 'image' ? (
        <View 
          style={{
            position: 'absolute',
            top: HEADER_HEIGHT,
            width: this.state.ratW,
            height: this.state.ratH,
            backgroundColor: '#000'
          }}
        >
          <ImageAutoSize
            source={{ uri: this.state.mediaSource }}
            sourceFrame={{ uri: this.state.frame }}
            width={Dimensions.get('window').width}
          />
        </View>
      ) : (
        <View
          style={{
            position: 'absolute',
            top: HEADER_HEIGHT,
            width: this.state.ratW,
            height: this.state.ratH,
            backgroundColor: '#000',
          }}
        >
          <Video
            videoSource={this.state.mediaSource}
            resizeMode={this.state.orientationModel.orientation === 'landscape' ? 'none' : 'cover'}
            onLoadEnd={(res) => {
              this.setState({
                videoWidth: res.naturalSize.height,
                videoHeight: res.naturalSize.width
              });
            }}
          >
            {(this.state.mediaType === 'video' && this.state.frame !== null) && (
              <Image
                style={this.state.orientationModel.orientation === 'landscape' ? {
                  width: '100%',
                  height: this.state.manipHeight
                } : {
                  width: this.state.ratW,
                  height: this.state.ratH,
                }}
                resizeMode="stretch"
                source={{ uri: this.state.frame }}
              />
            )}
          </Video>
        </View>
      )
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#e84393"
          barStyle="light-content"
          hidden
        />
        
        {this.renderResultPreview()}
        
        <View style={styles.lists}>
          {this.state.frameList.length > 0 && (
            <FrameList
              dataList={this.state.frameList}
              onSelected={(frame, index) => { 
                this.setState({ frame, indexFrame: index })
              }}
              selectedFrame={this.state.indexFrame === -1 ? 0 : this.state.indexFrame}
            />
          )}
        </View>
        <View style={styles.headerContainer} />
        <View style={styles.back}>
          <TouchableWithoutFeedback
            style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => this.state.onProcFramed ? false : Actions.pop()}
          >
            <IconION name="ios-arrow-round-back" color="#E80E89" size={50} />
          </TouchableWithoutFeedback>
        </View>
        
        {/*
        <View style={styles.gallery}>
          <TouchableWithoutFeedback
            style={{width: 30, height: 30}}
            onPress={() => Actions.album()}
          >
            <Icon name="image" color="#E80E89" size={30} />
          </TouchableWithoutFeedback>
        </View>
        */}

        <View style={styles.saved}>
          <TouchableWithoutFeedback
            style={{width: 30, height: 30}}
            onPress={() => this.saveAndBuildImageVideo()}
          >
            <Icon name="done" color="#E80E89" size={30} />
          </TouchableWithoutFeedback>
        </View>
      
        {this.state.isLoading && (
          <ActivityIndicator size="large" color="#e84393" style={{ position: 'absolute' }} />
        )}

        {this.state.isProcess && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <ActivityIndicator size="large" color="#e84393" style={{ position: 'absolute' }} />
            <Text style={{ color: '#fff', marginTop: 50 }}>Sedang Memproses</Text>
          </View>
        )}
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000'
  },  
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: 50,
    backgroundColor: '#000'// 'rgba(0, 0, 0, 0.5)'
  },
  back: {
    position: 'absolute',
    left: 10,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gallery: {
    position: 'absolute',
    right: 50,
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saved: {
    position: 'absolute',
    right: 10,
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 100,
    width: 10
  },
  lists: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  blank: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#fff',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageResult: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#fff',
    marginTop: 10,
    marginBottom: 10
  },
  containerMark: {
    width: 80,
    height: 80,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageFrameMarkingSelected: {
    width: 80,
    height: 80,
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
  }
});

// export default ImagePreview;
export default MediaPreviewRedux;
