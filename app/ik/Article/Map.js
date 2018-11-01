// Impor dependencies
import React, { Component } from 'react';
import {
	View,
	ScrollView,
	WebView,
	Dimensions,
	Text,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import FooterSM from '../FooterSM';
import { web_url } from '../../comp/AppConfig';

export default class Map extends Component {

	constructor(props){
		super(props);
		this.state = {
			dimensions:Dimensions.get('window'),
			ScrollView:this.refs.ScrollView,
		}
	}

	componentDidMount(){
		Actions.refresh({key:'IKdrawer',open:value=>false});
		this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView});
	}

	onMessage(e){
		let data = JSON.parse(e.nativeEvent.data);
		let page_name = {
			'n1':'Jelajah',
			'n2':data.province,
		};
		Actions.IKArticleList({tbl_reference:'ika_home_highlight',province_id:data.id,page_name:page_name});
	}

	render(){
		return(
			<View>
				
				<ScrollView onScroll={this.props.hideBtnOnScroll} style={{backgroundColor:'#eaeaea'}} ref='ScrollView'>
					<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#f0f0f0'}}>
						<View style={{flexDirection:'row',margin:15}}>
							<View style={{flex:5}}>
								<View style={{flexDirection:'row'}}>
									<Text style={{fontSize:16}}>
										Jelajah Indonesia
									</Text>
								</View>
								<View style={{height:1,alignSelf:'stretch',flexDirection:'row',marginTop:5}}>
									<View style={{backgroundColor:'#ddd',height:1,alignSelf:'stretch',flex:1,}}></View>
								</View>
							</View>
						</View>
						<WebView
							style={{
								backgroundColor:'#f0f0f0',
								minHeight:this.state.dimensions.height/2,
								width:this.state.dimensions.width,
							}}
							source={{uri:web_url+'appmap.html',}}
							injectedJavaScript={`
								function setsize(){$("#id-map").css({"width":"'+(this.state.dimensions.width)+'"});}
								setsize();
								setTimeout(function(){init();},1000);
							`}
							javaScriptEnabled={true}
							ref={(webView)=>this.webView = webView}
							onMessage={this.onMessage}
						/>
						<View style={{padding:15}}>
							<Text style={{color:'#999',fontSize:13,lineHeight:22,textAlign:'center'}}>Tap provinsi untuk melihat informasi detail.</Text>
						</View>
					</View>
					<FooterSM ScrollView={this.state.ScrollView}/>

				</ScrollView>
				{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}

			</View>
			
		);
	}
}
