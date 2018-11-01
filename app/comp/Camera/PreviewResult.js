import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  View,
  StatusBar,
  TouchableWithoutFeedback,
	Alert,
	ToastAndroid,
	ActivityIndicator,
	Text
} from 'react-native';
import Orientation from 'react-native-orientation';
import IconFA from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconION from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
import FBSDK from 'react-native-fbsdk';
import { autoHeightByRatio, imageGallery, copyMediaFile, p, removeMediaFile } from './helper';
import ImageAutoSize from './ImageAutoSize';
import Video from './Video';
import history from '../../game/js/gamify/history'

const HEADER_HEIGHT = 50;
const DESIRED_RATIO = '3:4';
const VIDEO_RATIO = '9:16';

class PreviewResult extends Component {

  state = {
		mediaType: 'image',
		mediaResult: null,
    ratio: null,
    ratW: 0,
    ratH: 0,
    ratLw: 0,
    ratLh: 0,
    bottomToolBarHeight: 0,
    marginTopBottomToolbar: 0,
		FBaccessToken: null,
		prepareMedia: false
  };

  timerId = 0;

  componentDidMount() {
		console.log('INI PROPS NYA CUUUY', this.props);
    Orientation.lockToPortrait();
    
    const scrHeight = Dimensions.get('window').height;
    const { width, height } = autoHeightByRatio(DESIRED_RATIO, Dimensions.get('window').width);
    const bottomToolBarHeight = scrHeight - (HEADER_HEIGHT + height);
    const marginTopBottomToolbar = (HEADER_HEIGHT + height);

		const largeRatio = autoHeightByRatio(VIDEO_RATIO, Dimensions.get('window').width);

    this.setState({
      ratW: width,
      ratH: height,
      ratLw: largeRatio.width,
      ratLh: largeRatio.height,
      bottomToolBarHeight,
			marginTopBottomToolbar,
			prepareMedia: true
		}, () => {
			setTimeout(() => {
				this.setState({
					prepareMedia: false
				});
			}, 500);
		});
	}
	
	loginFac = (cb) => {
		FBSDK.AccessToken.getCurrentAccessToken().then((data) => {
			console.log('FB',data)
			this.setState({
				FBaccessToken: data.accessToken
			})
		}).catch(error => {
			console.log(error)
		})
			
		FBSDK.LoginManager.logInWithReadPermissions(['public_profile']).then(
			function(result) {
				if (result.isCancelled) {
					console.log('Login cancelled');
				} else {
					console.log('res',result)
					console.log('Login success with permissions: '
						+result.grantedPermissions.toString());
						cb(result);
				}
			},
			function(error) {
				console.log('Login fail with error: ' + error);
			}
		);
	}
	
	sharePhotoVideoWithShareDialog = (fbType) => {
		let ct = {};
		let t = '';

		if (fbType === 'image') {
			t = 'Foto';
			ct = {
				contentType : 'photo',
				photos: [{ imageUrl: `${this.props.mediaResult}`}],
			};
		} else {
			t = 'Video';
			ct = {
				contentType: 'video',
				video: { localUrl: `${this.props.mediaResult}`},
			}
		}

		this.loginFac(r => {
			FBSDK.ShareDialog.canShow(ct).then((canShow) => {
				console.log('canShow',canShow);
				if (canShow) {
					return FBSDK.ShareDialog.show(ct);
				}
			}).then((result) => {
				if (result) {
					if (result.isCancelled) {
						try {
							ToastAndroid.show(`Anda membatalkan untuk berbagi ${t}`, ToastAndroid.SHORT);
						} catch (e) {
							console.log(e);
						}
					} else {
						//console.log('resSahre',result)
						ToastAndroid.show(`Berhasil berbagi ${t} ke facebook`, ToastAndroid.SHORT);
						if(t == 'Foto'){
							//console.warn('masukPOst')
							let Post = {
								related_category_id:11,
								related_id:3
							}
							history.set(Post, (res) => {
								// Actions.pop()
								Actions.redeem();
								
							});
						}else{
							//console.warn('masukPOst')
							let Post = {
								related_category_id:11,
								related_id:4
							}

							history.set(Post, (res) => {
								// Actions.pop()
								Actions.redeem();
								
							});
						
						}
						
						
					}
				} else {
					Alert.alert('Indonesia Kaya', `Anda tidak dapat berbagi ${t} menggunakan browser, anda harus memasang aplikasi facebook`);
				}

				return false;
			}, (error) => {
				Alert.alert('Indonesia Kaya', `Terjadi Kesalahan Aplikasi`);
			});
		}); 
	}

	removeMedia = async () => {
		let t = null;

		const ext = (this.props.mediaResult).split('.')[1];
		
		if (ext === 'mp4') {
			t = 'video';
		} else {
			t = 'foto';
		}

		await removeMediaFile(this.props.mediaResult);
		ToastAndroid.show(`File ${t} berhasil dihapus`, ToastAndroid.SHORT);
		Actions.album();
	}

	bottomToolBar() {
		const ext = (this.props.mediaResult).split('.')[1];
		let mediaType = null;
		
		if (ext === 'mp4') {
			mediaType = 'video';
		} else {
			mediaType = 'image';
		}
		
    return (
      <View style={[styles.bottomToolbar, { height: this.state.bottomToolBarHeight }]}>
				<View style={styles.sharefb}>
					<TouchableWithoutFeedback
						style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}
						onPress={() => this.sharePhotoVideoWithShareDialog(mediaType)}
					>
						<IconFA name="facebook" color="#000" size={30} />
					</TouchableWithoutFeedback>
				</View>

				{mediaType === 'video' ? (
					<View style={[styles.saveimage, { right: 50 }]}>
						<TouchableWithoutFeedback
							style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}
							onPress={async () => {
								const sp = (this.props.mediaResult).split('/');
								const sl = sp.slice(-1)[0];

								await copyMediaFile(this.props.mediaResult, `${p}${imageGallery}/${sl}`);
								ToastAndroid.show('Gambar anda berhasil disimpan ke dalam galeri', ToastAndroid.SHORT);
								//Actions.pop();
								//setTimeout(() => {
									Actions.home();
								//}, 100);
							}}
						>
							<IconFA name="download" color="#E80E89" size={50} />
						</TouchableWithoutFeedback>
					</View>
				) : (
					<View style={styles.saveimage}>
						<TouchableWithoutFeedback
							style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}
							onPress={async () => {
								const sp = (this.props.mediaResult).split('/');
								const sl = sp.slice(-1)[0];

								await copyMediaFile(this.props.mediaResult, `${p}${imageGallery}/${sl}`);
								ToastAndroid.show('Gambar anda berhasil disimpan ke dalam galeri', ToastAndroid.SHORT);
								//Actions.pop();
								//setTimeout(() => {
									Actions.home();
								//}, 100);
							}}
						>
							<IconFA name="download" color="#E80E89" size={50} />
						</TouchableWithoutFeedback>
					</View>
				)}

				{mediaType === 'image' && (
					<View style={styles.print}>
						<TouchableWithoutFeedback
							style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}
						>
							<Icon name="print" color="#000" size={30} />
						</TouchableWithoutFeedback>
					</View>
				)}
      </View>
    );
  }

  topToolBar() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.back}>
          <TouchableWithoutFeedback
            style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => this.state.onProcFramed ? false : Actions.pop()}
          >
					<IconION name="ios-arrow-round-back" color="#E80E89" size={50} />
          </TouchableWithoutFeedback>
				</View>
				
				<View style={styles.trash}>
          <TouchableWithoutFeedback
            style={{width: 30, height: 30}}
            onPress={() => this.removeMedia()}
          >
            <Icon name="delete" color="#E80E89" size={30} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
	}

  renderPreview() {
		const ext = (this.props.mediaResult).split('.')[1];
		let mediaType = null;
		
		if (ext === 'mp4') {
			mediaType = 'video';
		} else {
			mediaType = 'image';
		}

		if (mediaType === 'image' && this.props.mediaResult !== null) {
			return (
				<ImageAutoSize
					source={{ uri: this.props.mediaResult }}
					width={Dimensions.get('window').width}
				/>
			);
		} else if (mediaType === 'video' && this.props.mediaResult !== null) {
			return (
				<Video
					videoSource={this.props.mediaResult}
				/>
			);
		}
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#e84393"
          barStyle="light-content"
          hidden
        />
        {this.topToolBar()}
        {this.state.width !== 0 && this.state.height !== 0 && (
          <View
            style={{
							position: 'absolute',
							top: HEADER_HEIGHT,
							width: this.state.ratW,
							height: this.state.ratH,
							backgroundColor: '#000'
						}}
					>
						{this.state.prepareMedia ? (
							<View
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundColor: 'rgba(0,0,0,0.7)',
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<ActivityIndicator size="large" color="#e84393" style={{ position: 'absolute' }} />
								<Text style={{ color: '#fff', marginTop: 50 }}>Menyiapkan Media</Text>
							</View>
						) : this.renderPreview()}
          </View>
        )}
        {this.state.bottomToolBarHeight > 0 && (
          <View style={{
            position: 'absolute',
            bottom: 0,
            width: Dimensions.get('window').width,
            height: this.state.bottomToolBarHeight,
            backgroundColor: '#000'
          }}>
            {this.bottomToolBar()}
          </View>
        )}
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  subView: {
    width: Dimensions.get('window').width,
    height: 100,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: Dimensions.get('window').width,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  preview: {
    flex: 1
  },
  back: {
    position: 'absolute',
    left: 10,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomToolbar: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  print: {
    borderRadius: 35,
    position: 'absolute',
    alignSelf: 'center',
    right: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E80E89'
	},

	saveimage: {
    position: 'absolute',
    alignSelf: 'center',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
	},
	
	sharefb: {
    borderRadius: 35,
    position: 'absolute',
    alignSelf: 'center',
    left: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E80E89'
	},
	trash: {
    position: 'absolute',
    right: 10,
    top: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default PreviewResult;
