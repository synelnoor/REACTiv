/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';


import BackgroundJob from 'react-native-background-job';
import { Provider } from 'react-redux';


import ComLocalStorage from './app/comp/ComLocalStorage';
import Routing from './app/Routing.js';
//import Rutes from './app/Rute.js';
import Service from './app/comp/Service.js';
import * as actions from  './app/comp/redux/Action.js';
import store from './app/comp/redux/Store.js';

import { Router, Scene, Actions,Stack } from 'react-native-router-flux';

import autobind from 'autobind-decorator';

import { createStorageDir, chkFrameDownload } from './app/comp/Camera/helper';


///http://202.158.39.170/gamify/public/api/tracking?id=2 tracking
Service._startKegiatan();

BackgroundJob.register({
    jobKey: 'all',
    job: () => {
        new Service;
    }
});

BackgroundJob.schedule({
    jobKey:'all',
    timeout:1800000,
    period:5000,
});









export default class App extends Component {
  componentDidMount() {
    setTimeout(async () => {
      await createStorageDir();
      await chkFrameDownload();
    }, 500);
  }
  render() {
    return (
      // @autobind
      <Provider store={store}>
     
         <Routing  />
       
      </Provider>
    );
  }
}


