/*
 * @author: Artha Prihardana 
 * @Date: 2017-11-15 13:57:10 
 * @Last Modified by: Artha Prihardana
 * @Last Modified time: 2018-08-30 17:22:06
 */
import React, { Component } from 'react'
import {
    Dimensions,
    StyleSheet,
    // Text,
    TouchableHighlight,
    TouchableOpacity,
    TouchableNativeFeedback,
    View,
    Platform,
    BackHandler,
    StatusBar,
    Slider
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { RNCamera } from 'react-native-camera'
import Ionicons from 'react-native-vector-icons/Ionicons'
//import RNFS from 'react-native-fs'
// import Loading from '../../Components/Loading';
// import Button from '../../Components/Button'
// import Text from '../../Components/Text'

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // cameraType: Camera.constants.Type.back,
            // flashMode: Camera.constants.FlashMode.auto,
            cameraType: RNCamera.Constants.Type.back,
            flashMode: RNCamera.Constants.FlashMode.auto,
            flashStatus: "Auto",
            loading: false,
            zoom: 0
        }
    }

    takePicture = async function() {
        const { updateSo } = this.props;
        this.setState({
            loading: true
        });
        if(this.camera) {
            let data = await this.camera.takePictureAsync({width: 100, quality: 0.3});
            // console.log('data ==>', data)
            this.setState({ loading: false });
            Actions.PreviewPhoto({ foto: data.uri, updateSo: updateSo == true ? updateSo : false });
        } else {
            alert('Gagal menampilkan kamera');
        }
    };

    switchType = () => {
        let newType;
        // const { back, front } = Camera.constants.Type;
        const { back, front } = RNCamera.Constants.Type;
    
        if (this.state.cameraType === back) {
            newType = front;
        } else if (this.state.cameraType === front) {
            newType = back;
        }
    
        this.setState({
            cameraType: newType
        });
    }

    switchFlash = () => {
        let newFlashMode, flashStatus;
        // const { auto, on, off } = Camera.constants.FlashMode;
        const { auto, on, off } = RNCamera.Constants.FlashMode;
    
        if (this.state.flashMode === auto) {
            // console.log('on')
            newFlashMode = on;
            flashStatus = "On"
        } else if (this.state.flashMode === on) {
            // console.log('off')
            newFlashMode = off;
            flashStatus = "Off"
        } else if (this.state.flashMode === off) {
            newFlashMode = auto;
            flashStatus = "Auto"
            // console.log('auto')
        }
        // console.log('switch')
        this.setState({
            flashMode: newFlashMode,
            flashStatus: flashStatus
        });
    }

    render() {
        // if(this.camera != null) {
        //     this.camera.getSupportedRatiosAsync().then( val => console.log('val ==> ', val));
        // }
        console.log('this.props update so ==>', this.props.updateSo )
        let ren =
            <View style={styles.container}>
                <StatusBar 
                    barStyle = "light-content" 
                    hidden = {false}
                    translucent = {false}
                    networkActivityIndicatorVisible = {true}
                    />
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style = {styles.preview}
                    type={this.state.cameraType}
                    flashMode={this.state.flashMode}
                    zoom={this.state.zoom}
                    ratio="16:9"
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                    >
                    <View style={{ position: 'absolute', paddingTop: Platform.OS == "ios" ? 12 : 0, top: 0, left: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: Platform.OS == "ios" ? 62 : 56, backgroundColor: '#000000' }}>
                        <View>
                            <Button onPress={() => Actions.pop() }>
                                <View style={{height:56,width:40,justifyContent:'center',alignItems:'center'}}>
                                    <Ionicons name={(Platform.OS == 'ios') ? 'ios-arrow-round-back-outline' : 'md-arrow-back'} style={{color:'#fff',fontSize: (Platform.OS == 'ios') ? 34 : 22}}/>
                                </View>
                            </Button>
                        </View>
                        <View>
                            <Button onPress={ this.switchFlash }>
                                <View style={{height:56,width:60,justifyContent:'center',alignItems:'center', flexDirection: 'row'}}>
                                    <Ionicons name="ios-flash-outline" size={30} style={{ color: '#FFFFFF' }} />
                                    <Text small style={{ color: '#FFFFFF', marginLeft: 5 }}>{this.state.flashStatus}</Text>
                                </View>
                            </Button>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
                        <Button 
                            onPress={() => {
                                this.setState({
                                    zoom: this.state.zoom - 0.25 >= 0 ? this.state.zoom - 0.25 : 0
                                })
                            }}
                            style={{justifyContent: 'center' }}>
                            <Ionicons name={Platform.OS == "ios" ? "ios-remove-outline" : "md-remove"} size={20} color={'#FFF'} />
                        </Button>

                        <View style={{width: '80%', alignItems: 'stretch', justifyContent: 'center'}}>
                            <Slider
                                thumbTintColor={'#FFF'}
                                minimumTrackTintColor={'#FFF'}
                                value={this.state.zoom}
                                onValueChange={(value) => {
                                    console.log('zoom ==>', value);
                                    this.setState({zoom: value})
                                }} />
                        </View>

                        <Button 
                            onPress={() => {
                                this.setState({
                                    zoom: this.state.zoom + 0.25
                                })
                            }}
                            style={{ justifyContent: 'center' }}>
                            <Ionicons name={Platform.OS == "ios" ? "ios-add-outline" : "md-add"} size={20} color={'#FFF'} />
                        </Button>
                    </View>
                    
                    <View style={{ width: '100%', height: 100, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
                        <Button onPress={this.switchType} style={{
                                position: 'absolute',
                                left: 20,
                                bottom: 32
                            }}>
                            <View style={{ 
                                width: 30,
                                height: 30
                            }}>
                                <Ionicons name="md-reverse-camera" size={30} style={{ color: '#FFFFFF'}} />
                            </View>
                        </Button>

                        <Button onPress={this.takePicture.bind(this)}>
                            <View style={styles.capture}>
                                <View style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 35,
                                    backgroundColor: '#CFD8DC'
                                }} />
                            </View>
                        </Button>
                    </View>
                </RNCamera>
                {/* </Camera> */}
                {(this.state.loading) ? <Loading loadingName='Mohon Tunggu' loadingDescription='Sedang mengambil gambar' /> : <View />}
            </View>
        return ren;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        flex: 0,
        backgroundColor: '#FFFFFF',
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: 40,
        // margin: 40,
        // paddingTop: 20,
        // paddingBottom: 20,
        // paddingLeft: 22,
        // paddingRight: 22,
        elevation: 3
    }
});