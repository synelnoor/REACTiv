import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  View,
  FlatList,
  Image,
  Text,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image'
import FrameList from './FrameList';
import { getImageSizeFitWidth } from './ImageAutoSize/ImageSizeCache';
import { getAllFrame, uniqArray, p, tmpFrame, getImageSize, combineImageCached } from './helper';
import ImageAutoSize from './ImageAutoSize';
import Video from './Video';


class MediaPreview extends Component {
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
    mediaSource: null,
    mediaType: null,
    manipWidth: 0,
    manipHeight: 0,
    prepareMedia: false
  }
  async componentDidMount() {
    let mSource = null;
    
    const allFrame = await getAllFrame();

    if (this.props.mediaType === 'video') {
      mSource = this.props.videoThumb;
    } else {
      mSource = this.props.mediaSource;
    }

    const { width, height } = await getImageSize(mSource);
    let or = this.state.orientation;

    if (width > height) {
      or = 'landscape';
    }

    let dt = [];

    for (let img in allFrame) {
      let nm = allFrame[img].name.split('-');
      dt.push(nm[2]);
    }
    
    dt = uniqArray(dt);
    dt.unshift('blank');

    const mainpulateWidthHeight = await getImageSizeFitWidth({ uri: mSource }, Dimensions.get('window').width);

    this.setState({
      frameList: dt,
      w: width,
      h: height,
      orientation: or,
      manipWidth: mainpulateWidthHeight.width,
      manipHeight: mainpulateWidthHeight.height,
      prepareMedia: true
    }, () => {
      console.log(this.state, Dimensions.get('window').width, Dimensions.get('window').height);
      setTimeout(() => {
        prepareMedia: false
      }, 1000);
    });

  }

  combineFrame = async (frameName, sourceImage, index) => {
    this.setState({
      isFrameSelected: -1,
      isLoading: true,
      onProcFramed: true
    }, () => {
      this.setState({
        isFrameSelected: index
      });
    });

    console.log('index', index);
  
    let n = sourceImage.lastIndexOf('/');
    const resultSourceImage = sourceImage.substring(n + 1);
    const cachedFileName = `cached-${frameName}-${resultSourceImage}`;
    const overlayImage = await combineImageCached(sourceImage, frameName, cachedFileName);

    this.setState({
      result: overlayImage,
      isLoading: false,
      onProcFramed: false
    });
  }

  tmpCombineFrameVideo = (frameName, index) => {
    this.setState({
      isFrameSelected: -1,
      frameNameSelected: `${p}${tmpFrame}/${frameName}`
    }, () => {
      this.setState({
        isFrameSelected: index
      });
    });
    
    console.log('RRRRR', frameName, index);
  }

  markingSelected(item) {
    return (
      <View style={styles.containerMark}>
        <FastImage
          style={styles.imageFrameMarkingSelected}
          source={{uri: `${p}${tmpFrame}/fr-portrait-${item}`}}
        />
        <View style={styles.iconMarkSelected}>
          <Icon name="done" color="#e84393" size={30} />
        </View>
      </View>
    );
  }

  renderItems(item, index) {
    if (item === 'blank') {
      return (
        <TouchableWithoutFeedback onPress={() => { this.setState({ frameNameSelected: null, result: '', isFrameSelected: index }) }}>
          <View style={styles.blank}>
            {this.state.isFrameSelected === index ? this.markingSelected(item) : (
              <Text style={{ color: '#fff' }}>blank</Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={() => {
        if (this.props.mediaType === 'image') {
          this.combineFrame(`fr-${this.state.orientation}-${item}`, this.props.mediaSource, index);
        } else {
          this.tmpCombineFrameVideo(`fr-${this.state.orientation}-${item}`, index);
        }
        
      }}>
        {this.state.isFrameSelected === index ? this.markingSelected(item) : (
          <Image
            style={styles.imageResult}
            source={{uri: `${p}${tmpFrame}/fr-portrait-${item}`}}
          />
        )}
      </TouchableWithoutFeedback>
    );
  }

  render() {
    console.log('FR', this.state.frameNameSelected, this.state.manipHeight);
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#e84393"
          barStyle="light-content"
          hidden
        />
        
        {this.props.mediaType === 'image' ? (
          <ImageAutoSize
            source={{ uri: this.state.result === '' ? this.props.mediaSource : this.state.result }}
            width={Dimensions.get('window').width}
          />
        ) : (
          <Video videoSource={this.props.mediaSource}>
            {(this.props.mediaType === 'video' && this.state.frameNameSelected !== null) && (
              <Image
                style={{flex:1, position: 'absolute', resizeMode: 'stretch', width: '100%', height: this.state.manipHeight}}
                source={{ uri: this.state.frameNameSelected }}
              />
            )}
          </Video>
        )}
        
        <View style={styles.lists}>
          <FrameList
            onSelected={(frame, index) => this.setState({ frame, indexFrame: index })}
            withBlank={false}
            selectedFrame={this.state.indexFrame}
            />
        </View>

        <View style={styles.headerContainer} />
        <View style={styles.back}>
          <TouchableWithoutFeedback
            style={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => this.state.onProcFramed ? false : Actions.pop()}
          >
            <Icon name="arrow-back" color="#e84393" size={30} />
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.gallery}>
          <TouchableWithoutFeedback
            style={{width: 30, height: 30}}
          >
            <Icon name="image" color="#e84393" size={30} />
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.saved}>
          <TouchableWithoutFeedback
            style={{width: 30, height: 30}}
          >
            <Icon name="done" color="#e84393" size={30} />
          </TouchableWithoutFeedback>
        </View>
      
        {this.state.isLoading && (
          <ActivityIndicator size="large" color="#e84393" style={{ position: 'absolute' }} />
        )}
        
      </View>
    );
  }
}

MediaPreview.propTypes = {
  mediaSource: PropTypes.string,
  mediaType: PropTypes.string,
  videoThumb: PropTypes.string
};

MediaPreview.defaultProps = {
  mediaSource: null,
  mediaType: null,
  videoThumb: null
};

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
    left: 0,
    width: Dimensions.get('window').width,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  back: {
    position: 'absolute',
    left: 10,
    top: 10,
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
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

export default MediaPreview;
