import React, { Component } from 'react';

import AutoHeightImage from './AutoHeight';

export default class ImagePreviewAuto extends Component {
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
