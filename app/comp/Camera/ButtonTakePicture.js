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
    animatePress: new Animated.Value(1),
    crcToSquare: new Animated.Value(35),
    isRecording: false
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

  circleToSquere = () => {
    Animated.timing(this.state.animatePress, {
      toValue: 0.5,
      duration: 200,
    }).start();
    
    Animated.timing(this.state.crcToSquare, {
      toValue: 10,
      duration: 200,
    }).start();
  }

  squareToCircle = () => {
    Animated.timing(this.state.animatePress, {
      toValue: 1,
      duration: 200,
    }).start();
    
    Animated.timing(this.state.crcToSquare, {
      toValue: 35,
      duration: 200,
    }).start();
  }

  recAnimate = () => {
    if (this.state.isRecording) {
      this.circleToSquere();
    } else {
      this.squareToCircle();
    }
  }

  recordPress = () => {
    this.setState({
      isRecording: !this.state.isRecording
    }, () => {
      this.recAnimate();
      this.props.onPressRecord(this.state.isRecording);
    })
  }

  render() {
    if (this.props.camType === 'camera') {
      return (
        <TouchableWithoutFeedback
          onPressIn={() => this.btnPicAnimatedIn()}
          onPressOut={() => this.btnPicAnimatedOut()}
          {...this.props}
        >
          <View style={[styles.capture, { borderColor: this.props.btnColor }]}>
            <Animated.View
              style={[
                styles.captureInside,
                {
                  transform: [{
                    scale: this.state.animatePress
                  }]
                },
                { 
                  backgroundColor: this.props.btnColor,
                }
              ]}
            /> 
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableWithoutFeedback
          onPress={() => this.recordPress()}
          {...this.props}
        >
          <View style={[styles.capture, { borderColor: this.props.btnColor }]}>
            <Animated.View
              style={[
                styles.captureInside,
                {
                  transform: [{
                    scale: this.state.animatePress
                  }]
                },
                { 
                  backgroundColor: this.props.btnColor,
                  borderRadius: this.state.crcToSquare
                }
              ]}
            /> 
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }
}

ButtonTakePicture.propTypes = {
  onPress: PropTypes.func,
  btnColor: PropTypes.string,
  camType: PropTypes.string
};


const styles = StyleSheet.create({
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#e84393',
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
