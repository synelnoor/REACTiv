import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class ButtonFaceCamera extends Component {

  state = {
    type: 'front',
    animateSpin: new Animated.Value(0)
  }

  spinRight = () => {
    Animated.timing(this.state.animateSpin, {
      toValue: 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  }

  spinLeft = () => {
    Animated.timing(this.state.animateSpin, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  }

  toggleFacing() {
    if (this.state.type === 'front') {
      this.spinRight();
    } else {
      this.spinLeft();
    }
    
    setTimeout(() => {
      this.setState({
        type: this.state.type === 'back' ? 'front' : 'back',
      }, () => {
        this.props.facing(this.state.type);
      });
    }, 310);
  }

  doSpin = () => {
    const spin = this.state.animateSpin.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    return spin;
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.toggleFacing.bind(this)}>
        <Animated.View style={[styles.container, { transform: [{rotate: this.doSpin()}] }]}>
          <Icon name="loop" color="#E80E89" size={30} />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

ButtonFaceCamera.propTypes = {
  facing: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ButtonFaceCamera;
