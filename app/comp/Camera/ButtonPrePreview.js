import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import FastImage from 'react-native-fast-image'
import { getLastImageOriginal, videoOriginal } from './helper';

class ButtonPrePreview extends Component {

  state = {
    preview: null,
    realPath: null,
    mediaType: null
  }

  async componentDidMount() {
    const last = await getLastImageOriginal();
    let mediaType = 'image';
    let videoFile = null;

    if (last.path) {
      // Find if video
      if (last.path.indexOf('video') > -1) {
        mediaType = 'video';
        const n = last.path.substring(last.path.lastIndexOf("/") + 1, last.path.length);
        const splitVideoName = n.split('.')[0];
        videoFile = `file://${videoOriginal}/${splitVideoName}.mp4`;
      }

      this.setState({
        preview: `file://${last.path}`,
        realPath: videoFile === null ? `file://${last.path}` : videoFile,
        mediaType: mediaType
      });
    }
  }

  goToPreview = () => {
    Actions.album();
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.goToPreview.bind(this)}>
        <View style={styles.container}>
          {this.props.preview !== null && (
            <FastImage
              style={styles.image}
              source={{ 
                uri: this.props.preview, 
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}

          {(this.props.preview === null && this.state.preview !== null) && (
            <FastImage
              style={styles.image}
              source={{ 
                uri: this.state.preview, 
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

ButtonPrePreview.propTypes = {
  preview: PropTypes.string,
  realPath: PropTypes.string,
  mediaType: PropTypes.string,
  videoThumb: PropTypes.string,
};

ButtonPrePreview.defaultProps = {
  preview: null,
  realPath: null,
  mediaType: null,
  videoThumb: null
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    borderRadius: 35,
    width: 49,
    height: 49
  }
});

export default ButtonPrePreview;
