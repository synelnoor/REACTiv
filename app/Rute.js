import React, { Component } from 'react';
import { Platform, View, Image, Text, LayoutAnimation } from 'react-native';
import { Router, Scene,Stack, Actions } from 'react-native-router-flux';
import { setCustomText } from 'react-native-global-props';

// Import halaman IK
import IKHome from './ik/Home';
import IKVideoDetail from './ik/Video/Detail';
import IKVideoList from './ik/Video/List';
import IKVideoAlbum from './ik/Video/Album';
import IKArticleList from './ik/Article/List';
import IKArticleDetail from './ik/Article/Detail';
import IKArticleMap from './ik/Article/Map';
import IKTv from './ik/Tv';
import IKPhotoAlbum from './ik/Photo/Album';
import IKPhotoList from './ik/Photo/List';
import IKSearch from './ik/Search';
import IKKegiatan from './ik/Kegiatan';
import IKPhotoSlide from './comp/PhotoSlide';
/*start belum optimasi*/
	import IKND from './ik/NavigationDrawer';
	import Tikd from './ik/tesDrawer'
	import IKInfo from './ik/Info';
/*end belum optimasi*/

// Import halaman GIK
import GIKHome from './gik/Home';
import GIKVideoDetail from './gik/Video/Detail';
import GIKVideoList from './gik/Video/List';
import GIKVideoAlbum from './gik/Video/Album';
import GIKArticleList from './gik/Article/List';
import GIKArticleDetail from './gik/Article/Detail';
import GIKPhotoAlbum from './gik/Photo/Album';
import GIKPhotoList from './gik/Photo/List';
import GIKSearch from './gik/Search';
import GIKKegiatan from './gik/Kegiatan';
import GIKSorotan from './gik/Sorotan';
import GIKPhotoSlide from './comp/PhotoSlide';
/*start belum optimasi*/
	import GIKND from './gik/NavigationDrawer';
	import GIKStreaming from './gik/Streaming';
	import GIKAbout from './gik/About';
	import GIKContact from './gik/Contact';
	import GIKFacilities from './gik/Facilities';
/*end belum optimasi*/

// Import halaman jik
import JIKHome from './jik/Home';
import JIKTimeline from './jik/Timeline';
import JIKPesan from './jik/Pesan';
import JIKPesanDetail from './jik/Pesan/DetailMsg';
import JIKDetail from './jik/JurnalDetail';
import JIKProfil from './jik/Profil';
import JIKjurnalSaya from './jik/JurnalSaya';
import JIKaddContent from './jik/JurnalSaya/AddContentJurnal';
import JIKPhotoSlide from './comp/PhotoSlide';
import JIKFollow from './jik/Follow';
/*start belum optimasi*/
	import JIK from './jik/NavigationDrawer';
	import JIKInfo from './jik/Info';
	import JIKMsgDetail from './jik/Pesan/MsgDetail';
/*end belum optimasi*/

//Import Halaman Signin
import Signin from './sign_signup/Signin';
import Signup from './sign_signup/Signup';
import ForgotPassword from './sign_signup/ForgotPassword';
import ChangeProfile from './sign_signup/ChangeProfile';

//Import Halaman Reminder
import ReminderKegiatan from './reminder/Kegiatan';

/* reducer */
//import Test from './Test';
/* reducer */

	// const customTextProps = {
	// 	style : {
	// 		fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : 'Roboto'
	// 	}
	// };

	// setCustomText(customTextProps);

// Kelas utama
export default class Rutes extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: '',
			reduce: {},			
			isActionButtonVisible: true,
		}

	}
	
	// start hideBtnOnScroll
		_listViewOffset = 0;
	
		_hideBtnOnScroll = (event) => {
			// Simple fade-in / fade-out animation
			const CustomLayoutLinear = {
			  duration: 100,
			  create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
			  update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
			  delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
			}
			// Check if the user is scrolling up or down by confronting the new scroll position with your own one
			const currentOffset = event.nativeEvent.contentOffset.y
			const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
			  ? 'down'
			  : 'up'

			// start commented by dandi : for now still not used
				// If the user is scrolling down (and the action-button is still visible) hide it
				const isActionButtonVisible = direction === 'up'
				if (isActionButtonVisible !== this.state.isActionButtonVisible) {

					console.log('visible ==>',this.state.isActionButtonVisible)
				LayoutAnimation.configureNext(CustomLayoutLinear)
				this.setState({ isActionButtonVisible })
				}
				// Update your scroll position
				this._listViewOffset = currentOffset
			// end commented by dandi

			// if(direction === 'up') {
			// 		if(this.iknd) {
			// 			this.iknd.showNav();
			// 		}
			// 		if(this.giknd) {						
			// 			this.giknd.showNav();
			// 		}
			// 		if(this.jiknd) {
			// 			this.jiknd.showNav();
			// 		}
			// 	} else {
			// 		if(this.iknd) {
			// 			this.iknd.hideNav();
			// 		}
			// 		if(this.giknd) {
			// 			this.giknd.hideNav();
			// 		}
			// 		if(this.jiknd) {
			// 			this.jiknd.hideNav();
			// 		}
			// 	}
		  }
	// end hideBtnOnScroll

	logo(logo, from, text) {
		if(logo === 'text') {
			return (
				<View style={{height:55,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
					<Text style={{fontSize:13,color:'#999'}}>{text}</Text>
				</View>
			);
		}
		else if(logo && this.state.title !== '') {
			return (
				<View style={{height:55,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
					<Text style={{fontSize:13,color:'#999'}}>{(this.state.title).toUpperCase()}</Text>
				</View>
			);
		}
		else if(!logo){
			if(from === 'ik') {
				return (
					<View style={{height:55,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
						<Image style={{height:40,width:175}} source={require('./resource/image/logo-ik.png')}/>
					</View>
				);
			}
			else if(from === 'gik'){
				return (
					<View style={{height:55,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
						<Image style={{height:40,width:161}} source={require('./resource/image/logo-gik.png')}/>
					</View>
				);
			}
			else if(from === 'jik') {
				return (
					<View style={{height:55,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
						<Image style={{height:40,width:133}} source={require('./resource/image/logo-jik.png')}/>
					</View>
				);
			}
		}
	}

	_changeRenderTitle(e) {
		if(!e) {
			e = '';
		}
		this.setState({
			title: e,
		});
	}

	setStore(params) {
		// this.props["UPDATE"]({ key:params.key, data:params.data })
		//this.props.update

		this.setState({
			reduce : this.props
		}, () => {
			alert(JSON.stringify(this.state.reduce))
		})
	}

    render() {
        return (

			<Router>
				<Stack name='root' key='IK' type="replace" hideNavBar={true} >
				{/* <Stack name='IK' key='IK' type="replace" hideNavBar={true}> */}
				{/* <Scene key="IKdrawer" contentComponent={IKND} type="replace"> */}
				{/* <Router name='IK' key='IK' type='replace'>	 */}
						<Scene key='IKdrawer' contentComponent={IKND} open={false} type='replace' onRef={ref => (this.iknd = ref)}>
							<Scene key='IKHome' component={IKHome} hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
							<Scene key='IKArticleMap' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKArticleMap} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
							<Scene key='IKArticleList' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKArticleList} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
							<Scene key='IKVideoList' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKVideoList} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
							<Scene key='IKTv' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKTv} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
							<Scene key='IKPhotoList' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKPhotoList} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
							<Scene key='IKSearch' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKSearch} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
							<Scene key='IKKegiatan' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKKegiatan} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
							<Scene key='IKInfo' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKInfo} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
						</Scene>
						<Scene key='IKVideoDetail' component={IKVideoDetail} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}} renderTitle={()=>{return this.logo(false,'ik',false)}} style={{paddingTop:50}} leftButtonIconStyle={{tintColor:'#b76329'}}/>
							<Scene key='IKVideoAlbum' component={IKVideoAlbum} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}} renderTitle={()=>{return this.logo(false,'ik',false)}} style={{paddingTop:50}} leftButtonIconStyle={{tintColor:'#b76329'}}/>
							<Scene key='IKPhotoAlbum' component={IKPhotoAlbum} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}} renderTitle={()=>{return this.logo(false,'ik',false)}} style={{paddingTop:50}} leftButtonIconStyle={{tintColor:'#b76329'}}/>
							<Scene key='IKArticleDetail' component={IKArticleDetail} hideNavBar={true} />
							<Scene key='IKPhotoSlide' component={IKPhotoSlide} hideNavBar={true}/>	
				{/* </Router> */}
				</Stack>
			</Router>

            // <Router>
				// <Router name='IK' key='IK' type='replace'>	
				// <Stack key='root'>
				// {console.log('cek',this.state.title)}				
				// 	<Scene key='IKdrawer' component={IKND} open={false} type='replace' onRef={ref => (this.iknd = ref)}>
				// 		<Scene key='IKHome' component={IKHome} hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
				// 		<Scene key='IKArticleMap' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKArticleMap} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
				// 		<Scene key='IKArticleList' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKArticleList} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
				// 		<Scene key='IKVideoList' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKVideoList} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
				// 		<Scene key='IKTv' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKTv} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
				// 		<Scene key='IKPhotoList' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKPhotoList} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
				// 		<Scene key='IKSearch' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKSearch} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
				// 		<Scene key='IKKegiatan' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKKegiatan} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
				// 		<Scene key='IKInfo' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKInfo} navigationBarStyle={{backgroundColor:'#fff'}} renderTitle={()=>{return this.logo(false,'ik',false)}}/>
				// 	</Scene>
				// 	<Scene key='IKVideoDetail' component={IKVideoDetail} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}} renderTitle={()=>{return this.logo(false,'ik',false)}} style={{paddingTop:50}} leftButtonIconStyle={{tintColor:'#b76329'}}/>
				// 	<Scene key='IKVideoAlbum' component={IKVideoAlbum} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}} renderTitle={()=>{return this.logo(false,'ik',false)}} style={{paddingTop:50}} leftButtonIconStyle={{tintColor:'#b76329'}}/>
				// 	<Scene key='IKPhotoAlbum' component={IKPhotoAlbum} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}} renderTitle={()=>{return this.logo(false,'ik',false)}} style={{paddingTop:50}} leftButtonIconStyle={{tintColor:'#b76329'}}/>
				// 	<Scene key='IKArticleDetail' component={IKArticleDetail} hideNavBar={true} />
				// 	<Scene key='IKPhotoSlide' component={IKPhotoSlide} hideNavBar={true}/>
				// 	</Stack>
				// </Router>

            // </Router>
        );
    }

}
