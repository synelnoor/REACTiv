import React, { Component } from 'react';
import {
	View,
	Image,
	//Dimensions
} from 'react-native';
import { StyleProvider, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';

import Styles from '../comp/Styles';
import getTheme from '../../native-base-theme/components';

//let { height, width } = Dimensions.get('window');

export default class HeaderTop extends Component{

    render(){
        return(
			// <StyleProvider style={getTheme()}>
				<View>
					<View style={Styles.nbheader.mainView}>
						<Button
							transparent
							style={{height:55,width:55,padding:0,borderRadius:0}}
							onPress={()=>Actions.drawerOpen()}>
							<Icon style={{color:'#999',fontSize:33,alignSelf:'center',textAlign:'center',flex:1, }} name='ios-menu-outline'/>
						</Button>
						<View style={{flex:1,flexDirection:'row',justifyContent:'center',paddingRight:55,paddingTop:5}}>
							<Button transparent onPress={()=>{Actions.JIKHome()}}>
								<Image style={Styles.rnheader.logoJIK} resizeMode='contain' source={require('../resource/image/logo-jik.png')}/>
							</Button>
						</View>
					</View>
				</View>
			// </StyleProvider>
		);
    }
}
