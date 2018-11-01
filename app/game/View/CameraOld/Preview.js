/*
 * @author: Artha Prihardana 
 * @Date: 2017-11-15 14:55:49 
 * @Last Modified by: Artha Prihardana
 * @Last Modified time: 2018-03-28 15:12:20
 */
import React, { Component } from 'react'
import {
    View,
    BackHandler,
    Platform,
    TextInput,
    Image as DefaultImage,
    TouchableOpacity,
    Keyboard
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Text from '../../Components/Text'
import Image from '../../Components/Image'
import Button from '../../Components/Button'

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: true,
            base64Img: '',
            foto: '',
            deskripsi: '',
            camera: undefined
        }
    }

    componentWillUnmount() {
        Actions.refresh({
            camera: this.state.camera,
            address: undefined
        });
    }
    
    render() {
        // const { foto } = this.props;
        const { updateSo } = this.props;
        const { ready } = this.state;
        let view = <View />
        if(ready) {
            view =
            <View style={{flex:1, backgroundColor: '#212121'}}>
                <View style={{
                    flexDirection: 'row',
                    width: "100%",
                    height: 100,
                    position: 'absolute',
                    bottom: 0,
                    zIndex: 99999,
                    }}>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'center', width: "100%"}}>
                        <View style={{ width: '100%', backgroundColor: 'rgba(0,0,0,.5)' }}>
                            <TextInput
                                style={{
                                    width: "100%",
                                    borderColor: '#616161',
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    color: '#E0E0E0',
                                    height: 50
                                }}
                                placeholder={'Tulis deskripsi ...'}
                                placeholderTextColor={'rgba(255,255,255,.5)'}
                                value={this.state.deskripsi}
                                onChangeText={(text) => {
                                    // console.log('text ==> ', text)
                                    this.setState({
                                        deskripsi: text
                                    })
                                }}
                                />
                        </View>
                    </View>
                    <Button onPress={() => {
                            this.setState({
                                ready: false
                            }, () => {
                                Keyboard.dismiss();
                                if( updateSo == true ) {
                                    this.setState({
                                        camera: {
                                            photo: this.props.foto,
                                            caption: this.state.deskripsi,
                                            // FileBase64: this.state.base64Img,
                                            Caption: this.state.deskripsi
                                        }
                                    }, () => Actions.popTo("UpdateSO"));
                                } else {
                                    this.setState({
                                        camera: {
                                            photo: this.props.foto,
                                            caption: this.state.deskripsi,
                                            // FileBase64: this.state.base64Img,
                                            Caption: this.state.deskripsi
                                        }
                                    }, () => Actions.popTo("DataPelanggan"));
                                }
                            })
                        }} style={{ 
                            position: 'absolute',
                            bottom: 23,
                            right: 20 
                            }}>
                        <View style={{
                            
                            width: 50,
                            height: 50,
                            backgroundColor: '#3399ff',
                            borderRadius: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                            elevation: 3,
                            zIndex: 999999
                        }}>
                            <Ionicons
                                name={(Platform.OS == "ios") ? 'ios-send-outline' : 'md-send'}
                                style={{
                                    color: '#FFFFFF',
                                    fontSize: (Platform.OS == "ios") ? 28 : 24,
                                    paddingLeft: (Platform.OS == "ios") ? 0 : 5
                                }} />
                        </View>
                    </Button>
                </View>

                <View style={{
                    height:Platform.OS == "ios" ? 62 : 56,
                    backgroundColor:'rgba(0,0,0,.5)',
                    flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',
                    elevation: 3 }}>
                    <View style={{position:'absolute',paddingTop: Platform.OS == "ios" ? 12 : 0, top:0,left:5}}>
                        <Button onPress={()=> {
                            Keyboard.dismiss();
                            // Actions.DataPelanggan()
                            Actions.popTo("DataPelanggan")
                        }} >
                            <View style={{height:56,width:40,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Ionicons name={(Platform.OS == 'ios') ? 'ios-arrow-round-back-outline' : 'md-arrow-back'} style={{color:'#fff',fontSize: (Platform.OS == 'ios') ? 34 : 24}}/>
                            </View>
                        </Button>
                    </View>
                </View>

                <View style={{ width: "100%", height: "100%", paddingLeft: 15, paddingRight: 15 }}>
                    <Image
                        resizeMode={"contain"}
                        style={{ width: "100%", height: "80%" }}
                        // source={{ uri: `data:image/jpeg;base64,${this.state.base64Img}` }}
                        source={{uri: this.props.foto}}
                    />
                </View>

            </View>
        }
        return view;
    }
}