// Import dependencies
import React, { Component } from 'react';
import { TouchableHighlight, Text, View, ScrollView, RefreshControl, Dimensions, WebView, Linking } from 'react-native';
import { Spinner, } from 'native-base';
//import { Actions } from 'react-native-router-flux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FooterSM from '../FooterSM';
//import { base_url, api_uri } from '../../comp/AppConfig';
import Styles from '../Styles';

export default class Detail extends Component {

	constructor(props){
		super(props);
		this.state = {
			dimensions:Dimensions.get('window'),
			data:this.props.video,
			ScrollView:this.refs.ScrollView,
		}
	}

	componentDidMount(){
		this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView});
	}

	_refreshControl(ScrollView){
		return(
			<RefreshControl
				title=' '
				titleColor={Styles.ScrollView.titleColor}
				tintColor={Styles.ScrollView.tintColor}
				colors={Styles.ScrollView.colors}
				progressBackgroundColor={Styles.ScrollView.progressBackgroundColor}
				refreshing={false}
				onRefresh={this._onRefresh.bind(this)}
			/>
		);
	}

	_onRefresh(){
		this.setState({
			data:this.state.data,
		});
	}

	_goToUrl(url1,url2){
		Linking.canOpenURL(url1).then(supported=>{
			if(supported){
				Linking.openURL(url1);
			}
			else{
				if(url2){
					Linking.openURL(url2);
				}
				else{
					Alert.alert('Pesan','Gagal membuka : '+url1,[{text:'OK',onPress:()=>{}}]);
				}
			}
		});
	}

	_render(){
		if(this.state.data !== null){
			let src = 'https://www.youtube.com/embed/'+this.state.data.video_file;
			let title = 'Detail Video';
			let description = <View/>
			if(
				this.state.data.video_desc !== '' ||
				this.state.data.video_title !== ''
			){
				let echo = '';
				if(
					this.state.data.video_title !== '' &&
					this.state.data.video_desc !== '' &&
					this.state.data.video_title !== this.state.data.video_desc
				){
					title = this.state.data.video_title;
				}
				if(
					this.state.data.video_title !== '' &&
					this.state.data.video_desc !== '' &&
					this.state.data.video_title === this.state.data.video_desc
				){
					echo = this.state.data.video_desc;
				}
				else if(
					this.state.data.video_title !== '' &&
					this.state.data.video_desc === ''
				){
					echo = this.state.data.video_title;
				}
				else{
					echo = this.state.data.video_desc;
				}
				description = <View style={{padding:15,paddingTop:0}}><Text style={{fontSize:13,lineHeight:22}}>{echo}</Text></View>;
			}
			return(

				<View>

					<View style={{padding:0,margin:0,height:((this.state.dimensions.width)/(16/9))}}>
						<WebView
							style={{padding:0,margin:0,height:((this.state.dimensions.width)/(16/9))}}
							source={{html:'<style>*{margin:0 !important;padding:0 !important;}</style><iframe style="height:'+(((this.state.dimensions.width)/(16/9)))+'px;width:100%;" src="'+src+'" frameborder="0" allowfullscreen="true"></iframe>'}}/>
					</View>

					<View style={{flexDirection:'row',margin:15}}>
						<View style={{flex:3}}>
							<View style={{flexDirection:'row'}}>
								<Text style={{fontSize:16}}>
									<Text style={{fontSize:16}}>{title}</Text>
								</Text>
							</View>
							<View style={{height:1,alignSelf:'stretch',flexDirection:'row',marginTop:5}}>
								<View style={{backgroundColor:'#ddd',height:1,alignSelf:'stretch',flex:1,}}></View>
							</View>
						</View>
						<View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
							<TouchableHighlight underlayColor='transparent' onPress={()=>{
								//Actions.GIKFullYoutube({id:this.state.data.video_file})
								this._goToUrl('https://youtu.be/'+this.state.data.video_file,'https://www.youtube.com/embed/'+this.state.data.video_file)
							}}>
								<IonIcon style={{fontSize:30,color:'#b76329'}} name='ios-expand-outline'/>
							</TouchableHighlight>
						</View>
					</View>

					{description}

				</View>
			);
		}
		else{
			return(<Spinner/>);
		}
	}

	render(){
		return(
			<ScrollView style={{backgroundColor:'#eaeaea'}} refreshControl={this._refreshControl()} ref='ScrollView'>
				<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#f0f0f0'}}>
					{ this._render() }
				</View>
				<FooterSM ScrollView={this.state.ScrollView}/>
			</ScrollView>
		);
	}

}
