import { StyleSheet } from 'react-native';

class Styles {

    //
    // Style untuk Header
    //
    nbheader = {
        mainView: {
            backgroundColor:'#fff',
            borderBottomColor:'#000',
            borderBottomWidth:StyleSheet.hairlineWidth,
			padding:0,
        },
        btnNav:{
            backgroundColor:'#fff',
            bordered:0,
        },
        btnNavIco:{
            color:'#999',
            fontSize:33,
        }
    }

    rnheader = StyleSheet.create({
        logo: {
            height: 45,
            width: 194,
            marginTop: 5,
            marginBottom: 5
        }
    });

	//
	// Style untuk Footer
	//
	nbfooter = {
		mainView:{
			backgroundColor:'#fff',
		},
		btnNavJIK:{
			backgroundColor:'#B35E27',
			flex:1,
			flexDirection:'row',
			borderRadius:0,
		},
		btnNavGIK:{
			backgroundColor:'#502E12',
			flex:1,
			flexDirection:'row',
			borderRadius:0,
		}
	}

    rnfooter = StyleSheet.create({
        menuju: {
            fontSize: 10,
            color: '#fff'
        },
        menujuTitle: {
            color: '#fff',
            fontSize: 12
        },
        menujuIco: {
            width: 30,
            height: 30
        }
    });

    //
    // Style untuk Side menu
    //
    nbSideMenu = {
        cont: {
			backgroundColor:'#fff',
        },
        listitem: {
            borderBottomWidth:0,
			margin:0,
			padding:0,
			paddingTop:10,
			paddingBottom:10,
			backgroundColor:'transparent',
        },
        subListItem: {
            borderBottomWidth:0,
			margin:0,
			padding:0,
			paddingTop:10,
			paddingBottom:10,
			paddingLeft:50,
			backgroundColor:'transparent',
        },
        btnText: {
            color:'#000'
        },
        ico: {
            fontSize:25,
            color:'#502e12'
        },
        icoDropdown: {
			position:'absolute',
			right:0,
			top:0,
			bottom:0,
			width:50,
			flexDirection:'row',
			justifyContent:'center',
			alignItems:'center',
			backgroundColor:'#fff',

        }
    }
    rnSideMenu = StyleSheet.create({
        viewHeader: {
            flexDirection:'row',
            backgroundColor:'#502e12',
            height:50
        },
        wrapIcoClose: {
            backgroundColor:'#b35e27',
			width:50,
			height:50,
			alignItems:'center',
        },
        icoClose: {
            fontSize:40,
            paddingTop:5,
			color:'#fff',
        },
        wrapLogin: {
            flex:1,
            flexDirection:'row',
        },
        wrapLoginText: {
            justifyContent:'center',
        },
        loginText:{
            color:'#fff',
            textAlign:'right',
        },
        wrapLoginIco:{
            justifyContent:'center',
			alignItems:'center',
			width:50,
        },
        loginIco:{
            color:'#fff',
            fontSize:30,
        },
        viewBody:{
            //height:463
        }
    });

    //
    // Style untuk Halaman
    //
	pageHome = {
		mainSwiperCont:{
			backgroundColor:'#fff'
		},
		tabText:{
			color:'#999',
			fontSize:20
		},
		tabCont:{
			flex:1,
			flexDirection:'column',
		}
	};

    pageVideo = {
        main: {
            backgroundColor: '#000'
        },
        videoListCont: {
            marginTop: 30,
            backgroundColor: '#000'
        },
        mainSwiperCont: {
             backgroundColor: '#000'
        },
        tabText: {
            color: '#d06c2a',
            fontSize: 20,
            textAlign: 'center'
        },
        tabTextActive: {
            color: '#d06c2a',
            fontSize: 20,
            textAlign: 'center'
        },
        tabCont: {
            flex: 1,
            flexDirection: 'column',
        },
        videsoDescCont: {
            padding: 10,
        },
        textVideoTitle: {
            color: '#fff',
        },
        textVideoDesc: {
            color: '#BBB',
        },
        videoTabListCont: {
            backgroundColor: '#000',
            flex: 1,
            flexDirection: 'row',
        },
        videoTabList: {
            flex: 1,
            borderBottomWidth: 3,
            borderBottomColor: "#000",
        },
        videoTabListActive: {
            flex: 1,
            borderBottomWidth: 4,
            // borderBottomColor: "#B35E27",
            borderBottomColor: "#fff",
        },
    };

    pageHome = StyleSheet.create(this.pageHome);
    pageVideo = StyleSheet.create(this.pageVideo);

    //
    // Style loading untuk ScrollView
    //
    ScrollView = {
        tintColor: "#ff0000",
        titleColor: "#00ff00",
        colors: ['#fff', '#fff', '#fff'],
        progressBackgroundColor: "#B35E27"
    }

    calStyle = {
        calendarContainer:{
            backgroundColor:'#EEEEEE',
        },
        calendarHeading: {
          borderBottomWidth:0,
          borderTopWidth:0,
          backgroundColor: '#B86831',
        },
        dayHeading: {
          color: '#EEEEEE',
          margin:0,
        },
        weekendHeading: {
            color: '#EEEEEE',
            margin:0,
        },
        currentDayCircle: {
          backgroundColor: 'powderblue',
        },
        currentDayText: {
          color: '#FFF',
          backgroundColor: '#4E2F18',
          paddingTop:3.5,
          paddingBottom:3.5,
          paddingLeft:5,
          paddingRight:5,
          borderRadius:25,
          fontWeight:'bold',
        },
        selectedDayCircle: {
          backgroundColor: '#E5D5C9',
        },
        selectedDayText: {
          color: '#4E2F18',
        },
        weekendDayText: {
          color: '#333333',
        },
        calendarControls: {
          height: 0,
        },
    }

}

export default new Styles();
