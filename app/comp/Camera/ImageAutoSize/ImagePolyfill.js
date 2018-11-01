import React from 'react';
import { Platform, Image } from 'react-native';
// import FastImage from 'react-native-fast-image'

const isAndroid = () => Platform.OS === 'android';

export default class ImagePolyfill extends React.Component {
  static propTypes = Image.propTypes;
  static defaultProps = Image.defaultProps;

  componentWillMount() {
    if (isAndroid() && this.props.onError && this.props.source && this.props.source.uri) {
      this.verifyImage();
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.source && nextProps.source.uri &&
      (!this.props.source || this.props.source.uri !== nextProps.source.uri) &&
      isAndroid() &&
      nextProps.onError
    ) {
      this.verifyImage();
    }
  }

  verifyImage() {
    var {uri} = this.props.source;
    Image.prefetch(uri).catch(e => this.props.onError(e));
  }

  render() {
    return <Image {...this.props} />;
  }
}
