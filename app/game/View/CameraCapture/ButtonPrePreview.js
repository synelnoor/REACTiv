import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { getLastImageOriginal } from './helper';

class ButtonPrePreview extends Component {

  state = {
    preview: null
  }

  async componentDidMount() {
    const last = await getLastImageOriginal();

    if (last.path) {
      this.setState({
        preview: `file://${last.path}`
      });
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Actions.ImagePreview({ imageSource: this.props.preview !== null ? this.props.preview : this.state.preview })}>
        <View style={styles.container}>
          {(this.state.preview !== null || this.props.preview !== null) && (
            <Image
              style={styles.image}
              source={{ uri: this.props.preview !== null ? this.props.preview : this.state.preview }}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

ButtonPrePreview.propTypes = {
  preview: PropTypes.string,
};

ButtonPrePreview.defaultProps = {
  preview: null
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
    position: 'absolute',
    bottom: 60,
    left: 50
  },
  image: {
    flex: 1,
    borderRadius: 35,
    width: 49,
    height: 49
  }
});

export default ButtonPrePreview;
