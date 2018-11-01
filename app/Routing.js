import React, { Component } from 'react';
import { DeviceEventEmitter, Platform, View, Image, Text, LayoutAnimation, AsyncStorage, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import { Router, Scene,Stack, Actions } from 'react-native-router-flux';
import { setCustomText } from 'react-native-global-props';
import { connect } from 'react-redux';
// import SideMenu from 'react-native-side-menu';

import Spinn from './comp/Spinn';

import IntroPage from './comp/IntroPage';
import Service from './comp/Service';

import HeaderIK from './ik/HeaderTop';
import FooterBtmIK from './ik/FooterBtm';

import HeaderGIK from './gik/HeaderTop';
import FooterBtmGIK from './gik/FooterBtm';

import HeaderJIK from './jik/HeaderTop';
import FooterBtmJIK from './jik/FooterBtm';

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
	import IKInfo from './ik/Info';
	import TDRW from './ik/tesDrawer'
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

import SideMenuIK from './ik/SideMenu';
import SideMenuGIK from './gik/SideMenu';
import SideMenuJIK from './jik/SideMenu';


//import halaman Game
import Home from './game/View/Home'
import Redeem from './game/View/Redeem'
import Skor from './game/View/Skor'
import Camera from './game/View/CameraCapture'
import ImagePreview from './game/View/CameraCapture/ImagePreview'
import VideoRec from './game/View/VideoRec'
import GameLogin from './game/View/Login';
import Album from './game/View/Album';
import detAlbum from './game/View/Album/detail'
import detAlbumVideo from './game/View/Album/VideoPlayer'
import detPreview from './game/View/CameraCapture/detailPreview'
import Tukar from './game/View/Tukar'
import Konfirmasi from './game/View/Konfirmasi'
import Kirim from './game/View/Kirim'
import Sukses from './game/View/Kirim/Sukses'
import Lacak from './game/View/Lacak'
import CameraCapture from './comp/Camera'
import MediaPreviewRedux from './comp/Camera/MediaPreviewRedux';
import PreviewResult from './comp/Camera/PreviewResult';


import MenuEvent from './comp/MenuEvent';

//import Game from './game/router'

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
class Routing extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: '',
			reduce: {},			
			isActionButtonVisible: true,
			loading: true,
			splashIK: false,
			splashGIK: false,
			splashJIK: false
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
					// this.setState({ isActionButtonVisible }) // Bikin balik lagi kehalaman home
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
					<View>
						<View>
							<HeaderIK />
						</View>
					</View>
					// <View style={{height:55,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
					// 	<Image style={{height:40,width:175}} source={require('./resource/image/logo-ik.png')}/>
					// </View>
				);
			}
			else if(from === 'gik'){
				return (
					<View>
						<View>
							<HeaderGIK />
						</View>
					</View>
					// <View style={{height:55,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
					// 	<Image style={{height:40,width:161}} source={require('./resource/image/logo-gik.png')}/>
					// </View>
				);
			}
			else if(from === 'jik') {
				return (
					<View>
						<View>
							<HeaderJIK />
						</View>
					</View>
					// <View style={{height:55,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
					// 	<Image style={{height:40,width:133}} source={require('./resource/image/logo-jik.png')}/>
					// </View>
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

	async componentDidMount() {
		
		let splashs = await AsyncStorage.multiGet(['@intropage:ik_intro', '@intropage:gik_intro', '@intropage:jik_intro']);

		let splashIK = splashs[0][1] === null ? false : true;
		let splashGIK = splashs[1][1] === null ? false : true;
		let splashJIK = splashs[2][1] === null ? false : true;

		this.setState({loading: false, splashIK, splashGIK, splashJIK});

	}
	

    render() {
		// let menu = <Menu navigator={navigator}/>;
		let { splashIK, splashGIK, splashJIK, loading } = this.state;

		if(loading) 
		return( 
			<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
				<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
					<View style={{ alignSelf: 'center' }}>
						<Spinn />
						<Text style={{ marginBottom: 20 }}>Loading</Text>
					</View>
				</View> 
			</View>
		)

        return (
			<Router>
				<Scene key='root'  hideNavBar={true}>
					<Stack name='IK' key='IK' type='replace' hideNavBar={true}>
						<Scene key='IKSplash' component={IntroPage} from='ik' initial={!splashIK} />
						{/* <Scene key='IKdrawer' component={IKND} open={false} type='replace' onRef={ref => (this.iknd = ref)}> */}
						{/* <Scene key='tdrw' component={TDRW} open={false} type='replace' onRef={ref => (this.tdrw = ref)}>	 */}
						<Scene key='IKdrawer' contentComponent={SideMenuIK} drawer type='replace' onRef={ref => (this.iknd = ref)} navBar={()=>{return this.logo(false,'ik',false)}} initial={splashIK}>
						{/* <Scene key='IKdrawer' contentComponent={SideMenuIK} drawer type='replace' onRef={ref => (this.tdrw = ref)} component={tesParent}> */}
							<Scene key='IKHome' component={IKHome} hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterIK />}/>
							<Scene key='IKArticleMap' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKArticleMap} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterIK />}/>
							<Scene key='IKArticleList' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKArticleList} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterIK />}/>
							<Scene key='IKVideoList' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKVideoList} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterIK />}/>
							<Scene key='IKTv' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKTv} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterIK />}/>
							<Scene key='IKPhotoList' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKPhotoList} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterIK />}/>
							<Scene key='IKSearch' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKSearch} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterIK />}/>
							<Scene key='IKKegiatan' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKKegiatan} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterIK />}/>
							<Scene key='IKInfo' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={IKInfo} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterIK />}/>
						</Scene>
						<Scene key='IKVideoDetail' component={IKVideoDetail} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}} renderTitle={()=>{return this.logo(false,'ik',false)}} style={{paddingTop:50}} leftButtonIconStyle={{tintColor:'#b76329'}}/>
						<Scene key='IKVideoAlbum' component={IKVideoAlbum} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}} renderTitle={()=>{return this.logo(false,'ik',false)}} style={{paddingTop:50}} leftButtonIconStyle={{tintColor:'#b76329'}}/>
						<Scene key='IKPhotoAlbum' component={IKPhotoAlbum} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}} renderTitle={()=>{return this.logo(false,'ik',false)}} style={{paddingTop:50}} leftButtonIconStyle={{tintColor:'#b76329'}}/>
						<Scene key='IKArticleDetail' component={IKArticleDetail} hideNavBar={true} />
						<Scene key='IKPhotoSlide' component={IKPhotoSlide} hideNavBar={true}/>
					</Stack>

					<Stack name='GIK' key='GIK' type='replace' hideNavBar={true}>
						<Scene key='GIKSplash' component={IntroPage} from='gik' initial={!splashGIK} />
						{/* <Scene key='GIKdrawer' component={GIKND} open={false} type='replace' onRef={ref => (this.giknd = ref)}> */}
						<Scene key='GIKdrawer' contentComponent={SideMenuGIK} drawer type='replace' onRef={ref => (this.giknd = ref)} navBar={()=>{return this.logo(false,'gik',false)}} initial={splashGIK}>
							<Scene key='GIKHome' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} dataReduce={this.state.reduce} setReduce={(data)=>{this.setStore(data)}} component={GIKHome} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterGIK />} />
							<Scene key='GIKArticleList' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={GIKArticleList} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterGIK />} />
							<Scene key='GIKVideoList' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={GIKVideoList} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterGIK />} />
							<Scene key='GIKPhotoList' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={GIKPhotoList} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterGIK />} />
							<Scene key='GIKSearch' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={GIKSearch} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterGIK />} />
							<Scene key='GIKStreaming' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={GIKStreaming} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterGIK />} />
							<Scene key='GIKAbout' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={GIKAbout} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterGIK />} />
							<Scene key='GIKContact' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={GIKContact} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterGIK />} />
							<Scene key='GIKFacilities' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={GIKFacilities} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterGIK />} />
							<Scene key='GIKKegiatan' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={GIKKegiatan} navigationBarStyle={{backgroundColor:'#fff'}} renderFooter={<FooterGIK />} />
						</Scene>
						<Scene key='GIKVideoDetail' component={GIKVideoDetail} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}} renderTitle={()=>{return this.logo(false,'gik',false)}} style={{paddingTop:50}} leftButtonIconStyle={{tintColor:'#b76329'}}/>
						<Scene key='GIKVideoAlbum' component={GIKVideoAlbum} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}} renderTitle={()=>{return this.logo(false,'gik',false)}} style={{paddingTop:50}} leftButtonIconStyle={{tintColor:'#b76329'}}/>
						<Scene key='GIKPhotoAlbum' component={GIKPhotoAlbum} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}} renderTitle={()=>{return this.logo(false,'gik',false)}} style={{paddingTop:50}} leftButtonIconStyle={{tintColor:'#b76329'}}/>
						<Scene key='GIKSorotan' component={GIKSorotan} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}} renderTitle={()=>{return this.logo(false,'gik',false)}} style={{paddingTop:50}} leftButtonIconStyle={{tintColor:'#b76329'}}/>
						<Scene key='GIKArticleDetail' component={GIKArticleDetail} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}} renderTitle={()=>{return this.logo(false,'gik','Berita')}} style={{paddingTop:50}} leftButtonIconStyle={{tintColor:'#b76329'}}/>
						<Scene key='GIKPhotoSlide' component={GIKPhotoSlide} hideNavBar={true}/>
					</Stack>

					<Stack name="JIK" key="JIK" type="replace" hideNavBar={true}>
						<Scene key='JIKSplash' component={IntroPage} from='jik' initial={!splashJIK} />
						{/* <Scene key="JIKdrawer" component={JIK} open={false} type="replace" onRef={ref => (this.jiknd = ref)}> */}
						<Scene key='JIKdrawer' contentComponent={SideMenuJIK} drawer type='replace' onRef={ref => (this.jiknd = ref)} navBar={()=>{return this.logo(false,'jik',false)}} initial={splashJIK}>
							<Scene key='JIKHome' component={JIKHome} hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} navigationBarStyle={{backgroundColor:'#fff'}} style={{paddingTop:50,backgroundColor:'#fff'}} tabs={true} renderFooter={<FooterJIK />}/>
							<Scene key='JIKjurnalSaya' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={JIKjurnalSaya} navigationBarStyle={{backgroundColor:'#fff'}} style={{paddingTop:50,backgroundColor:'#fff'}} tabs={true} renderFooter={<FooterJIK />}/>
							<Scene key='JIKaddContent' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={JIKaddContent} navigationBarStyle={{backgroundColor:'#fff'}} style={{paddingTop:50,backgroundColor:'#fff'}} tabs={true} renderFooter={<FooterJIK />}/>
							<Scene key='JIKProfil' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={JIKProfil} navigationBarStyle={{backgroundColor:'#fff'}} style={{paddingTop:50,backgroundColor:'#fff'}} tabs={true} renderFooter={<FooterJIK />}/>
							<Scene key='JIKPesan' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={JIKPesan} navigationBarStyle={{backgroundColor:'#fff'}} style={{paddingTop:50,backgroundColor:'#fff'}} tabs={true} renderFooter={<FooterJIK />}/>
							<Scene key='JIKInfo' hideBtnOnScroll={this._hideBtnOnScroll.bind(this)} component={JIKInfo} navigationBarStyle={{backgroundColor:'#fff'}} style={{paddingTop:50,backgroundColor:'#fff'}} tabs={true} renderFooter={<FooterJIK />}/>
						</Scene>
						<Scene key='JIKTimeline' component={JIKTimeline}  navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}}  renderTitle={()=>{return this.logo(false,'jik',false)}} style={{paddingTop:50,backgroundColor:'#fff'}} tabs={true} leftButtonIconStyle={{tintColor:'#b76329'}}/>
						<Scene key='JIKDetail' component={JIKDetail}  navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}}  renderTitle={()=>{return this.logo(false,'jik',false)}} style={{paddingTop:50,backgroundColor:'#fff'}} tabs={true} leftButtonIconStyle={{tintColor:'#b76329'}}/>
						<Scene key='JIKPesanDetail' component={JIKPesanDetail}  navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}}  renderTitle={()=>{return this.logo(false,'jik',false)}} style={{paddingTop:50,backgroundColor:'#fff'}} tabs={true} leftButtonIconStyle={{tintColor:'#b76329'}}/>
						<Scene key='JIKFollow' component={JIKFollow} navigationBarStyle={{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#eee'}}  renderTitle={()=>{return this.logo(false,'jik',false)}} style={{paddingTop:50,backgroundColor:'#fff'}} tabs={true} leftButtonIconStyle={{tintColor:'#b76329'}} onBack={() => { Actions.pop(); setTimeout(()=>{ Actions.refresh({key:'JIKProfil',backAction:true}); },0)  } }/>
						<Scene key='JIKPhotoSlide' component={JIKPhotoSlide} hideNavBar={true}/>
						<Scene key='JIKMsgDetail' component={JIKMsgDetail} navigationBarStyle={{backgroundColor:'#fff'}}  renderTitle={()=>{return this.logo(false,'jik',false)}} style={{paddingTop:50,backgroundColor:'#fff'}} tabs={true}/>
					</Stack>

					{/* GameRoute */}
					<Stack   name='game' key='game' type='replace' hideNavBar={true}>
					  {/* <Scene  key = "login" component = {GameLogin} title = "Login"  /> */}
			          <Scene initial key = "home" component = {Home} title = "Home" />
			          <Scene  key = "redeem" component = {Skor} title = "Skor" />
			          <Scene key = "camera" component = {Camera} title = "Camera" />
			          <Scene key = "videorec" component = {VideoRec} title = "VideoRec" />
			          <Scene  key = "album" component = {Album} title = "Album" />
			          <Scene key = "detalbum" component = {detAlbum} title = "detAlbum" />
					  <Scene key = "detAlbumVideo" component = { detAlbumVideo} title = " detAlbumVideo"/>
			          <Scene key = "ImagePreview" component = {ImagePreview} title = "ImagePreview"/>
			          <Scene key = "detPreview" component = {detPreview} title = "detPreview"/>
					  <Scene  key = "tukar" component={Tukar} title='tukar'/>
					  <Scene key = 'konfirmasi' component ={Konfirmasi} title='Konfirmasi' />
					  <Scene  key = 'kirim' component ={Kirim} title='Kirim' />
					  <Scene  key = 'sukses' component ={Sukses} title='Sukses' />
					  <Scene  key = 'lacak' component ={Lacak} title='Lacak' />
					  <Scene  key = 'CameraCapture' component ={CameraCapture} title='CameraCapture' />
					  
					<Scene key="MediaPreviewRedux" component={MediaPreviewRedux} />
					<Scene key="PreviewResult" component={PreviewResult} />
					</Stack>
					

					<Stack name="sign_signup" key="sign_signup" type="push">
						<Scene key='Signin' component={Signin} hideNavBar={true}/>
						<Scene key='Signup' component={Signup} hideNavBar={true}/>
						<Scene key='ForgotPassword' component={ForgotPassword} hideNavBar={true}/>
					</Stack>

					<Stack name="ChangeProfileRoute" key="ChangeProfileRoute" type="push">
						<Scene key='ChangeProfile' component={ChangeProfile} hideNavBar={true}/>
					</Stack>

					<Stack name="Reminder" key="Reminder" type="push">
						<Scene key='ReminderKegiatan' component={ReminderKegiatan} hideNavBar={true}/>
					</Stack>


				</Scene>
			</Router>
        );
	}

}

// class SideMenuIK extends Component {

// 	render() {
// 		return {

// 		}
// 	}

// }

export default connect()(Routing);

class FooterIK extends Component {

	state = {
		showNav: true
	}

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>

				{(this.state.showNav) ? <FooterBtmIK /> : null}
				<Service/>
				
			</View>
		)
	}

}

class FooterGIK extends Component {

	state = {
		showNav: true
	}

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>

				{(this.state.showNav) ? <FooterBtmGIK /> : null}
				<Service/>
				
			</View>
		)
	}

}

class FooterJIK extends Component {

	state = {
		showNav: true
	}

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>

				{(this.state.showNav) ? <FooterBtmJIK /> : null}
				<Service/>
				
			</View>
		)
	}

}