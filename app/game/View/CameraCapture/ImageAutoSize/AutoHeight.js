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

export default class AutoHeight extends PureComponent {
  static propTypes = {
    ...ImagePropTypes,
    width: PropTypes.number.isRequired,
    onHeightChange: PropTypes.func
  };

  static defaultProps = {
    onHeightChange: NOOP
  };

  constructor(props) {
    super(props);
    this.setInitialImageHeight();
  }

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
          {...restProps}
        />
      </ImageZoom>
    );
  }
}
