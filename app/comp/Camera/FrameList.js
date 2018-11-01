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
import FastImage from 'react-native-fast-image';
import { getImageSizeFitWidth } from './ImageAutoSize/ImageSizeCache';
import { getAllFrame, uniqArray, p, tmpFrame, getImageSize, combineImageCached } from './helper';
import ImageAutoSize from './ImageAutoSize';
import Video from './Video';

class FrameList extends Component {
  state = {
    frameList: [],
    width: 0,
    height: 0,
    orientation: 'portrait',
    result: '',
    isFrameSelected: -1,
    frameNameSelected: null,
    isLoading: false,
    onProcFramed: false,
    mediaSource: null,
    mediaType: null,
    manipWidth: 0,
    manipHeight: 0
  }
  componentDidMount() {
    console.log('DARI FRAME', this.props.dataList);
    this.setState({
      frameList: this.props.dataList,
      isFrameSelected: 0
    });
  }

  // loadFrameList = async () => {
  //   this.setState({
  //     frameList: this.props.dataList
  //   });
  // }

  componentWillReceiveProps(nextProps) {
    // if(nextProps.selectedFrame === -1) {
    //   this.setState({
    //     isFrameSelected: 0
    //   }, async () => {
    //     this.props.onSelected(`${p}${tmpFrame}/${this.state.frameList[0]}`, 0);
    //     // this.overlayFrame(this.state.frameList[0], 0);
    //   });
    // }

    if (nextProps.selectedFrame !== this.state.isFrameSelected) {
      this.setState({
        isFrameSelected: (nextProps.selectedFrame)
      });
    }
  }

  overlayFrame = (frameName, index) => {
		const self = this;
    this.setState({
      isFrameSelected: -1,
    }, () => {
      self.setState({
        isFrameSelected: index
      }, () => {
        console.log('HIHIIIWWWW', frameName, index);
				self.props.onSelected(`${p}${tmpFrame}/${frameName}`, index);
			});
    });
  }

  markingSelected(item) {
    return (
      <View style={styles.containerMark}>
        <Image
          style={styles.imageFrameMarkingSelected}
          source={{uri: `${p}${tmpFrame}/${item}`}}
          resizeMode="contain"
        />
        <View style={styles.iconMarkSelected}>
          <Icon name="done" color="#e84393" size={30} />
        </View>
      </View>
    );
  };

  renderItems(item, index) {
    if (item === 'blank') {
      return (
        <TouchableWithoutFeedback onPress={() => { 
					this.overlayFrame(null, index);
				}}>
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
        this.overlayFrame(`${item}`, index);
      }}>
        {this.state.isFrameSelected === index ? this.markingSelected(item) : (
          <Image
            style={styles.imageResult}
            source={{uri: `${p}${tmpFrame}/${item}`}}
            resizeMode="contain"
          />
        )}
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          horizontal
          data={this.state.frameList}
          style={styles.lists}
          ItemSeparatorComponent={() => <View style={styles.separator}/>}
          renderItem={({item, index}) => this.renderItems(item, index)}
          keyExtractor={(item, index) => index.toString()}
        /> 
      </View>
    );
  }
}

FrameList.propTypes = {
  onSelected: PropTypes.func,
  withBlank: PropTypes.bool,
  selectedFrame: PropTypes.number,
  dataList: PropTypes.array
};

FrameList.defaultProps = {
  onSelected: null,
  withBlank: true,
  selectedFrame: 0,
  dataList: []
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
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

export default FrameList;
