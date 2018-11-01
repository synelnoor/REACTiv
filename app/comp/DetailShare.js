import React, { Component } from 'react';
import {
	View,
	TouchableHighlight
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Share, {ShareSheet,Button} from 'react-native-share';

export default class DetailShare extends Component {
    render(){
		let shareOptions = {
			title:this.props.data.detail_title,
			message:this.props.data.detail_sum,
			url:this.props.data.detail_url,
			subject:'Share Link'
		};

        return(
			<View style={{position:'absolute',bottom:0,left:0,right:0,height:35,backgroundColor:'#fff',flexDirection:'row',flexWrap:'wrap'}}>
				<TouchableHighlight underlayColor='#b76329' onPress={()=>{Share.shareSingle(Object.assign(shareOptions,{'social':'facebook'}));}} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',flex:1,height:35,backgroundColor:'#b76329'}}><FAIcon name='facebook' style={{fontSize:20,color:'#fff'}}/></TouchableHighlight>
				<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:35,width:1,marginBottom:3,backgroundColor:'#b76329'}}><View style={{height:20,width:1,backgroundColor:'rgba(255,225,255,0.5)'}}/></View>
				<TouchableHighlight underlayColor='#b76329' onPress={()=>{Share.shareSingle(Object.assign(shareOptions,{'social':'twitter'}));}} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',flex:1,height:35,backgroundColor:'#b76329'}}><FAIcon name='twitter' style={{fontSize:20,color:'#fff'}}/></TouchableHighlight>
				<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:35,width:1,marginBottom:3,backgroundColor:'#b76329'}}><View style={{height:20,width:1,backgroundColor:'rgba(255,225,255,0.5)'}}/></View>
				<TouchableHighlight underlayColor='#b76329' onPress={()=>{Share.shareSingle(Object.assign(shareOptions,{'social':'googleplus'}));}} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',flex:1,height:35,backgroundColor:'#b76329'}}><FAIcon name='google-plus' style={{fontSize:20,color:'#fff'}}/></TouchableHighlight>
				<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:35,width:1,marginBottom:3,backgroundColor:'#b76329'}}><View style={{height:20,width:1,backgroundColor:'rgba(255,225,255,0.5)'}}/></View>
				<TouchableHighlight underlayColor='#b76329' onPress={()=>{Share.shareSingle(Object.assign(shareOptions,{'social':'whatsapp'}));}} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',flex:1,height:35,backgroundColor:'#b76329'}}><FAIcon name='whatsapp' style={{fontSize:20,color:'#fff'}}/></TouchableHighlight>
			</View>
        );
    }
}