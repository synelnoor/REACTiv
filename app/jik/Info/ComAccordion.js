// Import dependencies
import React, { Component } from 'react';
import {
	View,
	Animated,
	TouchableHighlight
} from 'react-native';

/**
 * Komponen untuk membuat Accordion, ada 7 properties, yaitu:
 * @param containerStyle Object Style untuk container
 * @param headerStyle Object Style untuk header
 * @param contentStyle Object Style untuk content
 * @param header Mixed Untuk konten header Accordion
 * @param content Mixed Untuk isi Accordion
 * @param openCloseIcon Array Untuk konten openCloseIcon Accordion [0: buka, 1: tutup]
 * @param duration Integer Untuk durasi animasi
 * @param isExpanded Callback Callback jika component di panggil
 *
 * @return JSX Component
 *
 * @author Riko Logwirno
 */
export default class ComAccordion extends Component{

	constructor(props){
		super(props);

		this.state = {
			isExpanded:0, // 1 dan 0 untuk sekarang
			contentHeight:0,
			initContentHeight:true,
			heightAnim: undefined,
		};

		if (this.props.open_tab) {
			this.state = {
				isExpanded:1,
				contentHeight:0,
				initContentHeight:true,
				heightAnim:undefined,
			};
		}
	}

	setIsExpanded(){
		let isExpanded = this.state.isExpanded == 0 ? 1 : 0;
		this.setState({isExpanded: isExpanded}, () => {
			if (typeof this.props.isExpanded == 'function') {
				this.props.isExpanded(isExpanded);
			}
		});
	}

	accordionClick(){
	let duration = typeof this.props.duration == "undefined" ? 500 : this.props.duration
	if (this.state.isExpanded == 0) {
			Animated.timing(
				this.state.heightAnim,
				{
					toValue: this.state.contentHeight,
					duration: duration
				}
			).start(() => this.setIsExpanded());
		}
	else {
			Animated.timing(
			this.state.heightAnim,
				{
					toValue: 0,
					duration: duration
				}
			).start(() => this.setIsExpanded());
		}
	}

	setMaxHeight(e){
		let default_val = 0;
		let max_height = e.nativeEvent.layout.height;
		if (this.props.open_tab) {
			default_val = max_height;
		}
		if (this.state.initContentHeight) {
			this.setState(
			{ contentHeight: max_height, initContentHeight: false },
			() => this.setState(
				{heightAnim: new Animated.Value(default_val)}
				)
			);
		}
	}

	render(){
	let containerStyle = typeof this.props.containerStyle == 'undefined' ? {} : this.props.containerStyle;
	let headerStyle = typeof this.props.headerStyle == 'undefined' ? {} : this.props.headerStyle;
	let contentStyle = typeof this.props.contentStyle == 'undefined' ? {} : this.props.contentStyle;
	let openCloseIcon = <View></View>;
	let openCloseIconExists = false;
	if (typeof this.props.openCloseIcon != "undefined" && this.props.openCloseIcon.length == 2)
	{
		openCloseIconExists = true;
		openCloseIcon = this.props.openCloseIcon[ this.state.isExpanded ];
	}

	return(
		<View style={containerStyle}>
			<TouchableHighlight underlayColor='#e9e9e9' onPress={() => this.accordionClick()}>
				<View style={[headerStyle,{flexDirection:'column',alignItems:'center'}]}>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<View style={{ flex: 5 }}>
							{typeof this.props.header == "undefined" ? <View></View> : this.props.header}
						</View>
						<View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 10 }}>
							{openCloseIconExists ? openCloseIcon : <View></View>}
						</View>
					</View>
				</View>
			</TouchableHighlight>
			<Animated.View style={{height: this.state.heightAnim}} onLayout={this.setMaxHeight.bind(this)}>
				<View style={contentStyle}>
					{typeof this.props.content == "undefined" ? '' : this.props.content}
				</View>
			</Animated.View>
		</View>
	);
}

}
