
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator
} from 'react-native';

const Loading = props => {
  const {
    loading,
    ...attributes
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      
     
      onRequestClose={() => {console.log('close modal')}}>
      <View style={styles.modalBackground}>
      
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color="#ff1a8c"
             />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    //backgroundColor: 'white',
    // height: 100,
    // width: 100,
    // borderRadius: 10,
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'space-around'
  }
});

export default Loading;