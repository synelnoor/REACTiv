import React,{Component} from 'React';
import { DeviceEventEmitter, View, Text, StyleSheet,
	TouchableNativeFeedback, Image,
	PanResponder,
    Animated,
    Dimensions } from 'react-native';
import Beacons from 'react-native-beacons-manager';
import { Actions } from 'react-native-router-flux';
// import { BleManager } from 'react-native-ble-plx';
import Auth,{login,check,user} from '../game/js/gamify/auth'
import NewAsyncStorage from '../game/Library/AsyncStorage'



var beaconID = "f794d881-964c-465d-9a54-550f7c897411";
var timeoutCekBeacons = 2000;
var cekBeaconsInterval = 6000;

export default class MenuEvent extends Component {



    state = {
        show: true
    };
    
    constructor(props) {
		super(props)
		// this.state = {
		// 	pan     : new Animated.ValueXY()   //Step 1
		// };
		// this.panResponder = PanResponder.create({    //Step 2
		// 	onStartShouldSetPanResponder : () => true,
		// 	onPanResponderMove           : Animated.event([null,{ //Step 3
		// 		dx : this.state.pan.x,
		// 		dy : this.state.pan.y
		// 	}]),
		// 	onPanResponderRelease        : (e, gesture) => {} //Step 4
		// });
    }
    
	async cekBeacons() {
		// let ble = new BleManager();
		// let cekBluetooth = await ble.state();
		// if(cekBluetooth == 'PoweredOff') {
		// 	await ble.enable();
		// 	let cekBluetoothAgain = await ble.state();
		// 	console.log('bluetooth turned on', cekBluetoothAgain);
		// 	// return false;
		// }
		// ble.startDeviceScan(null, {}, (err, dev) => {
		// 	console.log('error', err);
		// 	console.log('devices', dev);
		// });

		// setTimeout(() => ble.stopDeviceScan(), 5000);

		// Request for authorization while the app is open
		// console.log('Beacons obj', Beacons);
		
		// Tells the library to detect iBeacons
		Beacons.detectIBeacons();

		// Start detecting all iBeacons in the nearby
		try {
			await Beacons.startRangingBeaconsInRegion('REGION1')
			// console.log(`Beacons ranging started succesfully!`)
		} catch (err) {
			// alert('Bluetooth gagal di hidupkan')
			console.log(`Beacons ranging not started, error: ${error}`);
		}

		let beaconsData = await this.startScan();
		beaconsUUID = [];
		for (let i in beaconsData) {
			if (beaconsData.hasOwnProperty(i)) {

				let beacons = beaconsData[i].beacons;
				for (let o in beacons) {
					if (beacons.hasOwnProperty(o)) {
						let uuid = beacons[o].uuid;
						beaconsUUID.push(uuid);
					}
				}
				
			}
        }
        // console.log('beaconsUUID', );
        return new Promise(res => res(beaconsUUID.includes(beaconID)));
		
	}

	startScan() {

		let beaconsData = [];
		let subscription = DeviceEventEmitter.addListener(
			'beaconsDidRange',
			(data) => {
				beaconsData.push(data);
				
				// data.region - The current region
				// data.region.identifier
				// data.region.uuid
			
				// data.beacons - Array of all beacons inside a region
				//  in the following structure:
				//    .uuid
				//    .major - The major version of a beacon
				//    .minor - The minor version of a beacon
				//    .rssi - Signal strength: RSSI value (between -100 and 0)
				//    .proximity - Proximity value, can either be "unknown", "far", "near" or "immediate"
				//    .accuracy - The accuracy of a beacon
			}
		);
		return new Promise(res => {
			setTimeout(() => {
				subscription.remove(); 
				// console.log('Scan stopped');
				res(beaconsData);
			}, timeoutCekBeacons);
		});

	}

    componentDidMount() {
        // let cekBeacons = setInterval(async () => {
        //     let beaconExist = await this.cekBeacons();
        //     // this.setState({ show: beaconExist });
        //     // console.log('triggered', beaconExist)
        // }, cekBeaconsInterval)
	}
	
	renderDraggable(){
        return (
            <View style={styles.draggableContainer}>
                <Animated.View style={styles.circle}>
                    <Text style={styles.text}>Drag me!</Text>
                </Animated.View>
            </View>
        );
	}
	
	checkAuth(){
		
		let nas = new NewAsyncStorage()
    
		nas.getItemByKey('@jwt:user_info', (resp) => {
		
			console.log('temporary auth ==> ', resp)
			if(resp){
				console.log('ss')
				// this.setState({loading:false})
				Auth.login()
				Actions.game()
			}else{
				Auth.login()
				console.log('sd')
				Actions.sign_signup({to:'Game'})
				
			}
            
        })
	}

    render() {
        let { show } = this.state;
        
        return (
			
            // <TouchableNativeFeedback onPress={() => this.cekBeacons()}>
                <View style={{ 
					
                    // width: 100, 
                    // height: show ? 100 : 0, 
                    // bottom: 60, 
                    // right: 10, 
                    position: 'absolute', 
                    // backgroundColor: 'red',
                    display: show ? 'flex' : 'none' 
                }}>
                    <Image source={require('../resource/image/Indonesia-Menari_2.gif')} style={{ width: 100, height: 125 }} />
					<TouchableNativeFeedback onPress={() => this.checkAuth()}>
					<Animated.View  
						style={[ styles.circle]}>
                	</Animated.View>
					</TouchableNativeFeedback>
					
			    </View>
            //</TouchableNativeFeedback>
        );
    }

}

let CIRCLE_RADIUS = 36;
let Window = Dimensions.get('window');
let styles = StyleSheet.create({
    mainContainer: {
        flex    : 1
    },
    dropZone    : {
        height         : 100,
        backgroundColor:'#2c3e50'
    },
    text        : {
        marginTop   : 25,
        marginLeft  : 5,
        marginRight : 5,
        textAlign   : 'center',
        color       : '#fff'
    },
    draggableContainer: {
        position    : 'absolute',
        top         : Window.height/2 - CIRCLE_RADIUS,
        left        : Window.width/2 - CIRCLE_RADIUS,
    },
    circle      : {	
		//backgroundColor     : 'powderblue',
		backgroundColor		:'transparent',
		position			: 'absolute',
		top					: 8,
		left				: 13,
        width               : CIRCLE_RADIUS*2,
        height              : CIRCLE_RADIUS*2,
        borderRadius        : CIRCLE_RADIUS
    }
});