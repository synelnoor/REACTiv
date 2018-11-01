import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AutoHeightImage from './AutoHeight';

class ImagePreviewAuto extends Component {
  static propTypes = {
    ...AutoHeightImage.propTypes,
    fallbackSource: AutoHeightImage.propTypes.source
  };

  state = { error: false };

  render() {
    const { source, fallbackSource, onError, ...restProps } = this.props;

    const shouldUseFallbackSource = this.state.error && fallbackSource;
    return (
      <AutoHeightImage
        source={shouldUseFallbackSource ? fallbackSource : source}
        pinchZoom={this.props.pinchZoom}
        sourceFrame={this.props.sourceFrame}
        onError={(error) => {
          if (!this.state.error) {
            this.setState({ error: true });
          }
          if (onError) {
            onError(error);
          }
        }}
        {...restProps}
      />
    );
  }
}

ImagePreviewAuto.propTypes = {
  pinchZoom: PropTypes.bool
};

ImagePreviewAuto.defaultProps = {
  pinchZoom: true,
  sourceFrame: null
};

export default ImagePreviewAuto;
