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
import { getAllFrame, uniqArray, p, tmpFrame, getImageSize, combineImageCached } from './helper';
import ImageAutoSize from './ImageAutoSize';

class ImagePreview extends Component {
  state = {
    frameList: [],
    width: 0,
    height: 0,
    orientation: 'portrait',
    result: '',
    isFrameSelected: 0,
    isLoading: false
  }
  async componentDidMount() {
    const allFrame = await getAllFrame();
    const { width, height } = await getImageSize(this.props.imageSource);
    let or = this.state.orientation;

    if (width > height) {
      or = 'landscape';
    }

    let dt = [];

    for (let img in allFrame) {
      let nm = allFrame[img].name.split('-')

      dt.push(nm[2]);
    }
    
    dt = uniqArray(dt);
    dt.unshift('blank');

    this.setState({
      frameList: dt,
      w: width,
      h: height,
      orientation: or
    });
  }

  combineFrame = async (frameName, sourceImage, index) => {
    this.setState({
      isFrameSelected: -1,
      isLoading: true
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
      isLoading: false
    });
  }

  markingSelected(item) {
    return (
      <View style={styles.containerMark}>
        <Image
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
        <TouchableWithoutFeedback onPress={() => { this.setState({ result: '', isFrameSelected: index }) }}>
          <View style={styles.blank}>
            {this.state.isFrameSelected === index ? this.markingSelected(item) : (
              <Text style={{ color: '#fff' }}>blank</Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={() => this.combineFrame(`fr-${this.state.orientation}-${item}`, this.props.imageSource, index)}>
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
    console.log('cek ',this.state.result)
    return (
      <View style={styles.container}>
        <ImageAutoSize
          source={{ uri: this.state.result === '' ? this.props.imageSource : this.state.result }}
          width={Dimensions.get('window').width}
        />
        <FlatList
          horizontal
          data={this.state.frameList}
          style={styles.lists}
          ItemSeparatorComponent={() => <View style={styles.separator}/>}
          renderItem={({item, index}) => this.renderItems(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.back}>
          <TouchableWithoutFeedback
            style={{width: 30, height: 30}}
            onPress={() => Actions.pop()}
          >
            <Icon name="arrow-back" color="#e84393" size={30} />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.go}>
          <TouchableHighlight
            style={{width: 30, height: 30}}
            onPress={() => Actions.detPreview({path:this.state.result})}
          >
         
            {/* <Icon name="save" color="#e84393" size={30} /> */}
            <Image source={require('../../img/ikaAsset/FrameGaleriIcon.png')}  
                                style={{width:'100%',height:30 ,resizeMode:'contain'}}
                               />
          </TouchableHighlight>
        </View>

        {this.state.isLoading && (
          <ActivityIndicator size="large" color="#e84393" style={{ position: 'absolute' }} />
        )}
      </View>
    );
  }
}

ImagePreview.propTypes = {
  imageSource: PropTypes.string
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
  }
});

export default ImagePreview;
