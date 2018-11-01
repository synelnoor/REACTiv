import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Animated
} from 'react-native';

class ButtonTakePicture extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    animatePress: new Animated.Value(1)
  }
  
  btnPicAnimatedIn = () => {
    Animated.timing(this.state.animatePress, {
      toValue: 0.8,
      duration: 50,
    }).start();
  }

  btnPicAnimatedOut = () => {
    Animated.timing(this.state.animatePress, {
      toValue: 1,
      duration: 50,
    }).start();
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPressIn={() => this.btnPicAnimatedIn()}
        onPressOut={() => this.btnPicAnimatedOut()}
        {...this.props}
      >
        <View style={styles.capture}>
          <Animated.View
            style={[
              styles.captureInside,
              {
                transform: [{
                  scale: this.state.animatePress
                }]
              }
            ]}
          /> 
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

ButtonTakePicture.propTypes = {
  onPress: PropTypes.func,
};


const styles = StyleSheet.create({
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#e84393',
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInside: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: '#e84393'
  }
});

export default ButtonTakePicture;
