import React, { Component } from 'react';
import {
	View,
	Dimensions,
	Text,
	TouchableHighlight,
	WebView,
} from 'react-native';
import { Tabs, TabHeading, Tab, Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ComListChild from './ComListChild';

var contentHeight = 0;

export default class ComList extends Component{

	constructor(props){
		super(props);
		this.state = {
			dimensions:Dimensions.get('window'),
			data:this.props.data,
			activeVideo:this.props.data.latest[0].video_file,
			latestComp:<Spinner/>,
			popularComp:<Spinner/>,
		}
	}

	componentDidMount(){
		this.setState({
			dimensions:Dimensions.get('window'),
		},()=>{
			this._getLatest();
			this._getPopular();
		});
	}

	_getLatest(){
		let data = this.state.data.latest;
		let loop = this.state.data.loop;
		let temp = [];
		for(i in data){
			temp.push(<ComListChild type='latest' from='ik' key={i} loop={loop} data={data[i]} activeVideo={this.state.activeVideo} onPress={(q,w)=>{this._onPress(q,w)}}/>);
		}
		this.setState({
			latestComp:temp,
		});
	}

	_getPopular(){
		let data = this.state.data.popular;
		let loop = this.state.data.loop;
		let temp = [];
		for(i in data){
			temp.push(<ComListChild type='popular' from='ik' key={i} loop={loop} data={data[i]} activeVideo={this.state.activeVideo} onPress={(q,w)=>{this._onPress(q,w)}}/>);
		}
		this.setState({
			popularComp:temp,
		});
	}

	_onPress(loop,video_file){
		this.setState({activeVideo:video_file},()=>{
			this.props.gotoContent(loop);
			this._getLatest();
			this._getPopular();
		});
	}

	_setHeight(e,loop){
		contentHeight = e.nativeEvent.layout.height;
		this.props.setHeight(loop,contentHeight);
	}

	render(){
		let src = 'https://www.youtube.com/embed/'+this.state.activeVideo;
		return(
			<View style={{margin:15,marginTop:0,borderBottomWidth:1,borderBottomColor:'#ddd',paddingBottom:5}} onLayout={(e)=>this._setHeight(e,this.state.data.loop)}>
				<View style={{marginBottom:10}}>
					<TouchableHighlight underlayColor='transparent' onPress={()=>{Actions.IKVideoAlbum({'name':this.state.data.name,'vidcat_id':this.state.data.vidcat_id});}}>
						<View style={{flexDirection:'row'}}>
							<Text style={{flex:2,}} >{this.state.data.name}</Text>
							<View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
								<IonIcon name='ios-albums-outline' style={{marginRight:10}}/>
								<Text>{this.state.data.count}</Text>
							</View>
						</View>
					</TouchableHighlight>
				</View>
				<View style={{padding:0,margin:0,height:((this.state.dimensions.width)/(16/9))-30}}>
					<WebView
						style={{padding:0,margin:0,height:((this.state.dimensions.width)/(16/9))-30}}
						source={{html:'<style>*{margin:0 !important;padding:0 !important;}</style><iframe style="height:'+(((this.state.dimensions.width)/(16/9))-30)+'px;width:100%;" src="'+src+'" frameborder="0" allowfullscreen="true"></iframe>'}}/>
				</View>
				<Tabs>
					<Tab style={{marginTop:10,backgroundColor:'#f0f0f0'}} heading={<TabHeading style={{backgroundColor:'#fff'}}><Text>TERKINI</Text></TabHeading>}>
						{this.state.latestComp}
					</Tab>
					<Tab style={{marginTop:10,backgroundColor:'#f0f0f0'}} heading={<TabHeading style={{backgroundColor:'#fff'}}><Text>TERPOPULER</Text></TabHeading>}>
						{this.state.popularComp}
					</Tab>
				</Tabs>
			</View>
		);
	}

}
