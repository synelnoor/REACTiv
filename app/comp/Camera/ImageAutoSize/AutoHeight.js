import React, { PureComponent } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import ImageZoom from 'react-native-image-pan-zoom';
import Image from './ImagePolyfill';

import { getImageSizeFitWidth, getImageSizeFitWidthFromCache } from './ImageSizeCache';

const { resizeMode, ...ImagePropTypes } = Image.propTypes;

const NOOP = () => {};
const DEFAULT_WIDTH = 0;
const DEFAULT_HEIGHT = 0;

class AutoHeight extends PureComponent {
  static propTypes = {
    ...ImagePropTypes,
    width: PropTypes.number.isRequired,
    onHeightChange: PropTypes.func,
    pinchZoom: PropTypes.bool,
  };

  static defaultProps = {
    onHeightChange: NOOP,
    pinchZoom: true
  };

  constructor(props) {
    super(props);
    this.setInitialImageHeight();
  }

  state = {
    imageIsLoaded: false
  };

  async componentDidMount() {
    this.hasMounted = true;
    await this.updateImageHeight(this.props);
  }

  async componentWillReceiveProps(nextProps) {
    await this.updateImageHeight(nextProps);
  }

  componentWillUnmount() {
    this.hasMounted = false;
  }

  setInitialImageHeight() {
    const { source, width, onHeightChange } = this.props;
    const { height = DEFAULT_HEIGHT } = getImageSizeFitWidthFromCache(
      source,
      width
    );
    this.state = { height };
    this.styles = StyleSheet.create({ image: { width, height } });
    onHeightChange(height);
  }

  async updateImageHeight(props) {
    if (
      this.state.height === DEFAULT_HEIGHT ||
      this.props.width !== props.width
    ) {
      const { source, width, onHeightChange } = props;
      try {
        const { height } = await getImageSizeFitWidth(source, width);
        this.styles = StyleSheet.create({ image: { width, height } });
        if (this.hasMounted) {
          this.setState({ height });
          onHeightChange(height);
        }
      } catch (ex) {
        if (this.props.onError) {
          this.props.onError(ex);
        }
      }
    }
  }

  render() {
    const { source, style, width, ...restProps } = this.props;

    if (this.props.pinchZoom) {
      return (
        <ImageZoom cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height}
          imageWidth={this.styles.image.width}
          imageHeight={this.styles.image.height}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image
            source={source}
            style={[this.styles.image, style]}
            onLoad={() => {
              this.setState({ imageIsLoaded: true })
            }}
            {...restProps}
          />
          <Image
            source={this.props.sourceFrame}
            style={[this.styles.image, style, { position: 'absolute' }]}
            resizeMode="stretch"
            {...restProps}
          />
        </ImageZoom>
      );
    } else {
      return (
        <Image
          source={source}
          style={[this.styles.image, style]}
          {...restProps}
        />
      );
    }
  }
}

export default AutoHeight
