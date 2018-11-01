import React, { Component } from 'react';
import {
	View,
	TouchableHighlight,
	AsyncStorage
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Share, {ShareSheet,Button} from 'react-native-share';
import NewAsyncStorage from '../Library/AsyncStorage';
import {Actions} from 'react-native-router-flux'

export default class DetailShare extends Component {
	saveImage(){
		// const { name,path } = this.state;
		console.log('async')
		let nas = new NewAsyncStorage()
		NewAsyncStorage.setItem('global', 'image', JSON.stringify({
		  "name": this.props.data.title,
		  "path": this.props.data.path,
	  }), (response) => {
		  console.log('response==>',response)
		  Actions.home();
	  })
  
	  }
  
    render(){
		let shareOptions = {
			title:this.props.data.title,
			message:this.props.data.message,
			url:this.props.data.url,
			subject:'Share Link'
		};

        return(
			<View style={{position:'absolute',bottom:0,left:0,right:0,height:80,backgroundColor:'#fff',flexDirection:'row',flexWrap:'wrap'}}>
				<TouchableHighlight underlayColor='#99314a' onPress={()=>{Share.shareSingle(Object.assign(shareOptions,{'social':'bf54e37e70ac2d0e2960cd9bf8b82561'}));}} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',flex:1,height:80,backgroundColor:'#99314a'}}><FAIcon name='facebook' style={{fontSize:40,color:'#fff'}}/></TouchableHighlight>
				<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:80,width:1,marginBottom:3,backgroundColor:'#99314a'}}><View style={{height:40,width:1,backgroundColor:'rgba(255,225,255,0.5)'}}/></View>
				<TouchableHighlight underlayColor='#99314a' onPress={()=>{Share.shareSingle(Object.assign(shareOptions,{'social':'twitter'}));}} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',flex:1,height:80,backgroundColor:'#99314a'}}><FAIcon name='twitter' style={{fontSize:40,color:'#fff'}}/></TouchableHighlight>
				<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:80,width:1,marginBottom:3,backgroundColor:'#99314a'}}><View style={{height:40,width:1,backgroundColor:'rgba(255,225,255,0.5)'}}/></View>
				<TouchableHighlight underlayColor='#99314a' onPress={()=>{Share.shareSingle(Object.assign(shareOptions,{'social':'instagram'}));}} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',flex:1,height:80,backgroundColor:'#99314a'}}><FAIcon name='instagram' style={{fontSize:40,color:'#fff'}}/></TouchableHighlight>
				<View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:80,width:1,marginBottom:3,backgroundColor:'#99314a'}}><View style={{height:40,width:1,backgroundColor:'rgba(255,225,255,0.5)'}}/></View>
				<TouchableHighlight underlayColor='#99314a' onPress={()=>{this.saveImage()}} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',flex:1,height:80,backgroundColor:'#99314a'}}><FAIcon name='save' style={{fontSize:40,color:'#fff'}}/></TouchableHighlight>
			</View>
        );
    }
}