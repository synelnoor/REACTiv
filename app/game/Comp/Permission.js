/** @format */

import {Component, PermissionsAndroid} from 'react-native';
// import App from './App';


// async function requestBcnPermission() {
// 	try {
// 	  const granted = await PermissionsAndroid.requestMultiple([
// 			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// 			PermissionsAndroid.PERMISSIONS.CAMERA,
// 			PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
// 			PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
// 			PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
// 	  ])
// 	  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
// 			console.log("GRANTED")
// 	  } else {
// 			console.log("DENIED")
// 	  }
// 	} catch (err) {
// 	  console.warn(err)
// 	}
// }

// requestBcnPermission();
export const PERMISSIONS = PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            ]).then((result) => {
                console.log('result', result);
            });


