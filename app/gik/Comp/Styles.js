import {
  StyleSheet,
} from 'react-native';

class Styles{

    nbheader = {
        mainView: {
            backgroundColor: '#fff',
            borderBottomColor: '#000',
            borderBottomWidth: StyleSheet.hairlineWidth,
            paddingTop: 3,
            paddingBottom: 3
        },
        btnNav:{
            backgroundColor: '#fff',
            bordered: 0
        },
        btnNavIco:{
            color: '#999',
            fontSize: 33
        }
    }

	pageHome = {
		main: {
			backgroundColor: '#FAFAFA'
		},
		mainSwiperCont: {
			 backgroundColor: '#fff'
		},
		tabText: {
			color: '#999999',
			fontSize: 20
		},
		tabCont: {
			flex: 1,
			flexDirection: 'column',
		}
	};

    rnheader = StyleSheet.create({
        logo: {
            height: 45,
            width: 194,
            marginTop: 5,
            marginBottom: 5
        }
    });

    rnSideMenu = StyleSheet.create({
        viewHeader: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: '#B35E27',
            paddingBottom: 1,
            height: 50
        },
        wrapIcoClose: {
            backgroundColor: '#fff',
			width:49,
			height:49,
			alignItems:'center',
        },
        icoClose: {
            fontSize: 30,
            padding: 10
        },
        wrapLogin: {
			paddingLeft:10,
			paddingRight:10,
            flex: 1,
            flexDirection: 'row'
        },
        wrapLoginText: {
            justifyContent: 'center',
            width: 120
        },
        loginText: {
            color: '#fff',
            textAlign: 'right'
        },
        wrapLoginIco: {
            justifyContent: 'center'
        },
        loginIco: {
            color: '#fff',
            fontSize: 30,
            marginRight: 25,
            marginLeft: 10
        },
        viewBody: {
            //height: 463
        }
    });

    nBase = {
        cWhite:{
             color:'#fff',
         },
        NBalg:{
            alignItems:'center'
        },
        NpadTop:{
            padding:10,
            backgroundColor:'#EEEEEE',
        },

        hMain:{
            backgroundColor: '#B35E27',
            padding:0,
            height:50,
            borderBottomColor:'#B35E27',
            borderBottomWidth:2,
         },
        hMBoxWrap:{
             width: 50,
         },
        hMBoxL:{
             backgroundColor: '#fff',
             justifyContent: 'center',
             alignItems: 'center',
             alignSelf: 'stretch',
             width: 50,
             height: 50,
         },
        hMBoxLIco:{
            fontSize:30,
         },
        hMBoxR:{
            alignItems: 'center',
            alignSelf: 'stretch',
            height: 50,
        },
        hMBoxRIco:{
            fontSize:20,
            color:'#fff',
        },
        hMC:{
            borderBottomWidth:0,
			margin:0,
			padding:0,
			paddingTop:10,
			paddingBottom:10,
			backgroundColor:'transparent',
        },
        hMCBoxWrap:{
            width: 50,
			backgroundColor:'blue'
        },
        hMCBox:{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
            width: 50,
            height: 50,
        },
        hMCIco:{
            fontSize:25,
            color:'#502e12'
        },

        HFmSearch:{
            padding:20,
        },
        HFmSBox:{
            borderWidth:0,
        },
        HFmSInp:{
            borderBottomWidth:1,
            borderColor:'#BFBFBF',
        },
        HFmSIco:{
            fontSize:30,
            padding:10,
        },
        HFmRBox:{
            borderBottomWidth:1,
            borderColor:'#B15F27',
            paddingTop:15,
            paddingBottom:15,
        },
        HFmRBoxLast:{
            paddingTop:15,
            paddingBottom:15,
        },
        HFmRList:{
            borderBottomWidth:0,
            borderColor:'#fff',
            elevation:0,
            margin:0,
            padding:0,
            marginTop:5,
            marginBottom:5,
        },
        HFmBSWBox:{
            backgroundColor:'#fff',
            alignItems:'center',
            alignSelf:'stretch',
            paddingBottom:50,
            shadowColor: "#fff",
            elevation : 0,
            marginBottom:0,
            borderWidth:0,
        },
        HFmBSBox:{
            borderBottomWidth: 1,
            borderTopWidth: 1,
            paddingBottom:30,
            paddingTop:15,
            borderWidth:0,
        },
        HFmButton:{
            borderRadius:10,
            backgroundColor:'#B35E27',
        },
        HFmBSText:{
            fontWeight:'bold',
            color:'#FFF',
            fontSize:13,
            padding:10,
            paddingLeft:20,
            paddingRight:20,
        },

        wrapTabs:{
            paddingTop:10,
            marginBottom:10,
            backgroundColor:'rgb(242, 242, 242)',
        },

        fBGlobL:{
            backgroundColor:'#B35E27',
            flex: 1,
            flexDirection: 'row'
        },
        fBGlobR:{
            backgroundColor:'#502E12',
            flex: 1,
            flexDirection: 'row'
        },

        FHSubscribeWrapp:{
            padding:0,
            margin:0,
            marginTop:10,
            marginBottom:10,
            borderTopWidth:1,
            borderBottomWidth:1,
            borderRightWidth:1,
            borderLeftWidth:1,
            borderColor:'#B35E27',
            borderRadius:5,
        },
        FHSubscribeInput:{
			height:40,
			padding:5,
			margin:0,
			borderWidth:0,
			fontSize:13,
			paddingLeft:15,
			borderColor:'#B35E27',
			borderRadius:5,
			borderTopRightRadius:0,
			borderBottomRightRadius:0,
			backgroundColor:'#fff',
        },
        FHSubscribeButton:{
            backgroundColor:'#B35E27',
            height:40,
            margin:0,
            padding:0,
            paddingLeft:10,
            paddingRight:10,
            borderRadius:5,
			borderTopLeftRadius:0,
			borderBottomLeftRadius:0,
        },

        FHiconWrapp: {
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf:'stretch'
        },
        FHicon: {
            width:30,
            margin:10,
        },
        FHsosmed:{
            fontSize:30,
        },

        CardList:{
            padding:0,
            margin:0,
            backgroundColor:'#fff',
			marginBottom:15,
        },
        CLWRhistory:{
            padding:0,
            margin:0,
        },
        CLhistory:{
            paddingLeft:15,
            paddingTop:5,
            paddingBottom:5,
            fontSize:13,
        },
        CLImage:{
            flex: 1,
            height:150,
            marginTop:10,
        },
        CLContent:{
            margin:15,
            padding:0,
            paddingBottom:15,
            borderBottomWidth:1,
            marginBottom:10,
            borderColor:'#CFCFCF',
        },
        CLCTitle:{
            fontSize:15,
            fontWeight:'bold',
        },
        CLCDesc:{
            fontSize:13,
        },

        Slide:{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'stretch',
        },
        SnDDefault:{
            backgroundColor:'rgba(255,255,255,.5)',
            width: 7.5,
            height: 7.5,
            borderRadius: 7.5,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 0,
        },
        SnDActive:{
            backgroundColor: '#fff',
            width: 7.5,
            height: 7.5,
            borderRadius: 7.5,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 0,
        },
        SnImage:{
            height: 120,
            alignSelf: "stretch",
        },
        SrNext:{
            fontSize:40,
            color:'rgba(255,255,255,.5)',
        },
        SrPrev:{
            fontSize:40,
            color:'rgba(255,255,255,.5)',
        },

        SrWrap:{
            flexDirection: 'row', flex:1, marginTop:10,  backgroundColor:'#B35E27',  paddingTop:5, paddingBottom:5,
        },
        SrCalendar:{
                flex:20,  flexDirection:'row', alignItems:'center', justifyContent:'center',
        },
        SrCalIco:{
            fontSize:20, color:'#512E12',
        },
        SrCalText:{
            fontSize:20, color:'#fff', fontWeight:'bold',
        },
        SrSlide:{
            flexDirection: 'row',  flex:80, margin:0, padding:0,
        },
        SrSlideSwipe:{
            flexDirection: 'row',  paddingLeft:15, paddingRight:15, margin:0, alignItems:'center',
        },
        SrSSDate:{
            flex:10, marginRight:5, marginLeft:10, alignItems:'center', justifyContent:'center',
        },
        SrSSDateMonth:{
            fontSize: 15, fontWeight:'bold', color:'#fff'
        },
        SrSSContent:{
            flex:40, alignItems:'center', justifyContent:'center', height:60,
        },
        SrSSCText:{
            fontSize: 12, fontWeight:'bold', color:'#fff'
        },
        SrSSIcon:{
            flex:28
        },
        SrSSIconImg:{
            width:60,height:22
        },
        SrNext:{
            fontSize:40, color:'rgba(255,255,255,.5)',
        },
        SrPrev:{
            fontSize:40, color:'rgba(255,255,255,.5)',
        },


    }

    sFooter = StyleSheet.create({
        FHMe:{
            marginTop:15, marginBottom:15,
        },
    });

    rN = StyleSheet.create({
        RNalg:{
            alignItems:'center',
        },
        fBTitle:{
            color:'#fff',
            textAlign:'left',
            fontSize:9,
            paddingLeft:5,
        },
        fBCaption:{
            color:'#fff',
            textAlign:'left',
            fontSize:11,
            fontWeight:'bold',
            paddingLeft:5,
        },
        fBImg:{
            width:20,
            height:20,
        },
        FHdesc:{
            fontSize:12,
            textAlign:'center',
            color:'#B35E27',
            paddingBottom:10,
        },
        FHbt:{
            fontSize:12,
            textAlign:'center',
            paddingBottom:10,
        },
        FHSubscribeBtnText:{
            fontWeight:'bold',
            color:'#fff',
            fontSize:13,
        },

        FHMe:{
            marginTop:5,
            marginBottom:15,
            backgroundColor:'#000',
        },
    });

    modal = StyleSheet.create({
        header:{
            marginTop:15, marginBottom:15,
        },
    });

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
