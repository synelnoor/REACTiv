import { StyleSheet } from 'react-native';

class Styles {
	//header
	nbheader = {
		mainView:{
			backgroundColor:'#fff',
			borderBottomColor:'#eee',
			borderBottomWidth:StyleSheet.hairlineWidth,
			padding:0,
			flexDirection:'row',
		},
		btnNav:{
			backgroundColor:'#fff',
			bordered:0,
		},
		btnNavIco:{
			color:'#999',
			fontSize:33,
		}
	};

	rnheader = StyleSheet.create({
		logoIK:{
			height:40,
			width:175,
		},
		logoGIK:{
			height:40,
			width:161,
		},
		logoJIK:{
			height:40,
			width:133,
		},
	});

	//home
	ScrollView = {
		tintColor:'#f00',
		titleColor:'#0f0',
		colors:['#fff','#fff','#fff'],
		progressBackgroundColor:'#b35e27'
	};

	//footer
	nbfooter = {
		mainView:{
			backgroundColor:'#fff',
		},
		btnNavJIK:{
			backgroundColor:'#b35e27',
			flex:1,
			flexDirection:'row',
			borderRadius:0,
		},
		btnNavGIK:{
			backgroundColor:'#502e12',
			flex:1,
			flexDirection:'row',
			borderRadius:0,
		}
	};

	rnfooter = StyleSheet.create({
		menuju:{
			fontSize:10,
			color:'#fff'
		},
		menujuTitle:{
			color:'#fff',
			fontSize:11
		},
		menujuIco:{
			width:25,
			height:25
		}
	});

	//calendar
	calStyle = {
		controlButton:{
			backgroundColor:'blue',
			height:30,
			width:30,
			zIndex:10,
		},
		controlButtonText:{
			color:'red',
		},
		calendarContainer:{
			backgroundColor:'#eee',
		},
		calendarHeading:{
			borderBottomWidth:0,
			borderTopWidth:0,
			backgroundColor:'#b86831',
		},
		dayHeading:{
			color:'#fff',
			margin:0,
		},
		weekendHeading:{
			color:'#fff',
			margin:0,
		},
		currentDayCircle:{
			borderRadius:0,
			backgroundColor:'#aaa',
		},
		currentDayText:{
			color:'#b86831',
		},
		selectedDayCircle:{
			borderRadius:0,
			backgroundColor:'#aaa',
		},
		selectedDayText:{
			color:'#fff',
		},
		day:{
			color:'#999',
		},
		weekendDayText:{
			color:'#999',
		},
		calendarControls:{
			height:0,
		},
		hasEventCircle:{
			borderRadius:0,
			backgroundColor:'#b86831',
		},
		hasEventText:{
			color:'#fff',
		},
		hasEventDaySelectedCircle:{
			borderRadius:0,
			backgroundColor:'#502e12',
		},
		hasEventDaySelectedText:{
			color:'#fff',
		},
	}
}

export default new Styles();
