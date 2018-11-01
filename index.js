/** @format */

import {AppRegistry,PermissionsAndroid} from 'react-native';
import 'es6-symbol/implement';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
