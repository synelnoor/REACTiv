// Impor dependencies
import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	ScrollView,
	Dimensions,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import FooterSM from '../FooterSM';

export default class About extends Component {

constructor(props) {
	super(props);
	this.state = {
		dimensions:Dimensions.get('window'),
		ScrollView:this.refs.ScrollView,
	}
}

componentDidMount(){
	this.setState({dimensions:Dimensions.get('window'),ScrollView:this.refs.ScrollView},()=>{
		Actions.refresh({key:'GIKdrawer',open:value=>false});
	});
}

render() {
	let imgUri = 'https://www.indonesiakaya.com/assets/img/tentang-pic.jpg ';
	Image.prefetch(imgUri);
	return (
		<View>

			<ScrollView onScroll={this.props.hideBtnOnScroll} style={{backgroundColor:'#eaeaea'}} ref='ScrollView'>
				<View style={{minHeight:this.state.dimensions.height/2,backgroundColor:'#fafafa'}}>

					<View style={{flexDirection:'row',margin:15}}>
						<View style={{flex:5}}>
							<View style={{flexDirection:'row'}}>
								<Text style={{fontSize:16}}>
									Tentang Kami
								</Text>
							</View>
							<View style={{height:1,alignSelf:'stretch',flexDirection:'row',marginTop:5}}>
								<View style={{backgroundColor:'#ddd',height:1,alignSelf:'stretch',flex:1,}}></View>
							</View>
						</View>
					</View>

					<View style={{ margin:0, padding:15, paddingTop:0, }}>

						<Image
							resizeMode='center'
							style= {{
								marginBottom:15,
								width: '100%',
								height: '30%'
							}}
							// style={{
							// 	marginBottom:15,
							// 	height:(165 / 247) * (this.state.dimensions.width-30),
							// 	width:this.state.dimensions.width-30
							// }}
							source={require('../../resource/image/about2.png')}
							//source={{ uri: imgUri }}
						/>


						<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>Galeri Indonesia Kaya merupakan ruang edutainment budaya persembahan Bakti Budaya Djarum Foundation yang berbasis teknologi digital dari Indonesia untuk Indonesia yang menyuguhkan informasi kekayaan budaya nusantara. Mulai dari alat musik tradisional, mainan tradisional, baju adat, sampai informasi tentang kuliner, pariwisata, tradisi dan kesenian dikemas secara digital dan interaktif di tempat ini. </Text>
						<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>Terletak di Grand Indonesia, Galeri Indonesia Kaya menawarkan alternatif dalam mempelajari tradisi budaya Indonesia dengan cara yang lebih modern, menyenangkan, mudah dan gratis. </Text>
						<Text style={{marginBottom:15,color:'#999',fontSize:13,lineHeight:22}}>Galeri Indonesia Kaya dilengkapi dengan auditorium berkapasitas 150 yang menyuguhkan tontonan budaya, mulai dari seni panggung, musik, pemutaran film, diskusi budaya, seminar dan workshop secara gratis. Para seniman yang ingin memakai auditorium dapat menggunakannya tanpa dipungut biaya. </Text>
						<Text style={{marginBottom:0,color:'#999',fontSize:13,lineHeight:22}}>Galeri Indonesia Kaya juga menyuguhkan berbagai macam pertunjukan budaya dari seniman-seniman Indonesia, baik mereka yang baru berkiprah atau mereka yang telah lama berkecimpung dalam dunia seni, tiap akhir pekan.</Text>

					</View>
				</View>
				<FooterSM ScrollView={this.state.ScrollView}/>
			</ScrollView>
			{typeof this.props.renderFooter != 'undefined' ? this.props.renderFooter : null}
			
		</View>
	);

	}
}
