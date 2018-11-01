
import React, {Component} from 'react';
import {Platform, Alert,StyleSheet,TouchableOpacity, Text, 
    Dimensions,
    Animated,
    AsyncStorage,
	Easing,
	PanResponder,View, DeviceEventEmitter, ActivityIndicator, Image, ListView} from 'react-native';
import Beacons from 'react-native-beacons-manager';
import Icon from 'react-native-vector-icons/MaterialIcons'
import IonIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import {PERMISSION} from '../../Comp/Permission';
import Auth,{login,check,user} from '../../js/gamify/auth'
import history from '../../js/gamify/history'
import quest from'../../js/gamify/quest'
import challenge from'../../js/gamify/challenge'
import char from '../../js/gamify/character'


export default class Skor extends Component{
    constructor(props){
        super(props);
        this.state={
            skor :'0',
            data : this.props,
        }
    }

    async componentDidMount(){
        // this.Point()
        await this.getPoint()
            await this.Point()
       
        
    }
    componentWillMount(){
      /// this.Point();
    }
    // async componentWillReceiveProps(n){
    //     console.log('prop',n)
    //     if(n){
    //         await this.getPoint()
    //         this.Point()
    //     }
    // }

    async Point(){
        let point = await this.getPoint();
        console.log('dd',point)
        if(point == null) return false;

        console.log('KESININIIII', point);
       
            this.setState({
                skor:point
            })
        
    }

    async getPoint(){
        try {
            const data = await AsyncStorage.getItem('@Gamify:point');
            //console.log('ASyncCall',data)
            return JSON.parse(data);
        } catch (error) {
            console.log(error);
            return error;
        }

    }


    Header(){
        return(
            <View style={[styles.header, { 
              flex:1,
              //backgroundColor:'powderblue',
              justifyContent:'center',
              alignItems:'center' ,
              height:100
              //paddingBottom: 10 
              
              }]}>
              <View
                style={{
                  marginTop:10,
                  //backgroundColor:'#ffff',
                  width:300,
                  height:120,
                  flexDirection:'row',
                  borderWidth: 2,
                  borderColor:'#E80E89',
                  borderLeftWidth:0,
                  borderRightWidth:0,
                  borderTopWidth:0
                }}
                >
                  <View
                  style={{
                   // backgroundColor:'brown',
                    width:'30%'
                  }}
                  >
                     <Image source={require('../../img/ikaAsset/LOGO.png')}  
                        style={{width:'100%',height:120 ,resizeMode:'contain'}}/>
                  </View>
                  <View
                    style={{
                      //backgroundColor:'#000',
                      justifyContent:'center',
                      alignItems:'center',
                      width:'70%'
                    }}
                  >
                       <Text style={{color:'#339933',fontSize:10,textAlign:'center'}}>
                        Kamu langsung dapat poin begitu kamu share foto atau video di FB.
                        </Text>
                    
                  </View>

                  
                            

              </View>

               
            </View>
        )
    }

    render(){
        return(
            <View style={styles.container}>
            {this.Header()}
            
                {/* <View style={styles.header}>
                
                    <View style={[styles.gridItemHeader,{
                   // backgroundColor:'#99314a'
                        }]}>
                        <Image source={require('../../img/ikaAsset/LOGO_IM.png')}  
                        style={{width:'100%',height:120 ,resizeMode:'contain'}}/>
                    </View>
                    
                    <View style={[styles.gridItemHeader,{
                     //backgroundColor:'powderblue'
                        }]}>
                       
                        <Text style={{color:'#339933',fontSize:10,textAlign:'center'}}>
                        Kamu langsung dapat poin begitu kamu share foto atau video di FB.
                        </Text>
                       
                    </View>
                </View> */}
                <View style={styles.middle}>
                        <Image source={require('../../img/ikaAsset/Skor_Kamu.png')}  
                                style={{width:'100%',height:60 ,resizeMode:'contain'}}/>

                        <View style={styles.bottom}>
                            <Image source={require('../../img/ikaAsset/KotakSkor.png')}  
                                            style={{width:'100%',height:100 ,resizeMode:'contain', alignItems: 'center', justifyContent: 'center'}}/>
                                            {this.state.skor && (
                                                <Text style={styles.skor}>
                                                    {this.state.skor}
                                                </Text>
                                            )}
                            
                        </View>
                </View>
                
                
                <View style={styles.cTukar}>
                <TouchableOpacity style={styles.tukar} onPress={()=>Actions.tukar({text:this.state.skor})}>
                <Image source={require('../../img/ikaAsset/tukar.png')}  
                                style={{width:100,height:100 ,resizeMode:'contain'}}/>
            </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.back} onPress={()=>{Actions.home() }}>
						<IonIcon 
						name="ios-arrow-round-back" 
						size={50} 
						color="#E80E89" />	
			    </TouchableOpacity>

            </View>
        );
    }
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        //flexDirection: 'column',
        
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    backgroundColor:'#000',
    height:100
  },
  gridItemHeader: {
    margin:0,
    width: Dimensions.get('window').width / 2.2,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor:'#E80E89',
    borderLeftWidth:0,
    borderRightWidth:0,
    borderTopWidth:0
  },
  middle:{
      flex:2,
      backgroundColor:'#000'
      //backgroundColor:'aqua'
  },
  bottom:{
    flex:1,
    backgroundColor:'#000',
      alignItems: 'center',
    
  },
  skor:{
    marginTop: 15,
    textAlign:'center',
    //color:'#47d147'
    color:'#339933',
    fontSize:50,
    position:'absolute',
    //resizeMode:'contain'
  },

  back:{
    position:'absolute',
    top:0,
    left:10,
    //backgroundColor:'powderblue'
  },
  cTukar: {
      position: 'absolute',
      bottom: 60,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center'
  }
})