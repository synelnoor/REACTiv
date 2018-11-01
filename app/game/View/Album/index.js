import React, { Component } from 'react';
import {
  AsyncStorage,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  ListView
  
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { RNCamera } from 'react-native-camera';
import NewAsyncStorage from '../../Library/AsyncStorage'
import RNFetchBlob from 'rn-fetch-blob'
import { Actions } from 'react-native-router-flux';
import RNFS from 'react-native-fs'
import Video from 'react-native-video'
import GridList from 'react-native-grid-list';

import FBSDK, { LoginButton, AccessToken,LoginManager,
  SharePhotoContent, ShareApi,ShareDialog,GraphRequest,GraphRequestManager } from 'react-native-fbsdk';

import {p, imageResult} from '../../../comp/Camera/helper';






export default class Album extends Component {
    constructor(props) {
        super(props);
        this.dsinit = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 != r2 });
        this.state = {
          photo:[],
          rendima:[],
          dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
        };
    }

     componentDidMount(){
         this.readPhotoIK();
       
    }
    componentWillMount(){}
    componentWillReceiveProps(n){}
   
    readPhotoIK(){
            const{dataSource} =this.state;
           // let pathh= `${p}${tmpDir}`
            let pathh = `${p}${imageResult}`
            //RNFetchBlob.fs.readFile(pathh, 'base64')
            RNFetchBlob.fs.ls(pathh)
                        .then((data) => {
                        
                        let list=[];
                        data.map((i,v)=>{
                            
                            let Alphoto={
                                name :`indonesiaMenari-${v+1}`,
                                filename : `${i}`,
                               // path : `${p}${tmpDir}/${i}`
                               path:`${p}${imageResult}/${i}`
                            }
                            list.push(Alphoto)
                        })

                        this.setState({ photo:list.reverse(),
                        
                        })
                        console.log('GAMBAEEEEE', list)
                        return list;

                        }).catch((err)=>{console.log('erro',err)})
        }

   
    renderPhotoGallery(item){
    // console.log('Galery Item ===>',item)
       
        return (
            
            this.cekTypeFile(item)
                
        );      
    }


    cekTypeFile(v){
        // console.log('CekType',v.filename)
         
         reg = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(v.filename);
         console.log('reg',reg)

        if(reg){
        let type='image';
        // return (
        //     <TouchableOpacity style={styles.gridTouch} onPress={()=>{Actions.detalbum({text:type,item:v})}}>
        //             <Image style={styles.gridImage} source={{ uri: v.path}}/>
        //     </TouchableOpacity>)
           return (
            <TouchableOpacity style={styles.gridTouch} onPress={()=>{Actions.PreviewResult({mediaResult:v.path})}}>
                    <Image style={styles.gridImage} source={{ uri: v.path}}/>
            </TouchableOpacity>)
        }else{
            let type='type';
           return (
            <TouchableOpacity style={styles.gridTouch} onPress={()=>{Actions.PreviewResult({mediaResult:v.path})}}>
                    <Image style={styles.gridImage} source={{ uri: v.path}}/>
                    <FAIcon name='play-circle-o' size={80} 
                              color='rgb(203, 203, 180)'
                              //color='rgb(255, 26, 140)'
                              style={{position: 'absolute',top:20, left: 20,opacity:0.5 }}/>
            </TouchableOpacity>)
        }

    }

        
    

    renderVideoGallery(){
        return (
            <View >
                <Text>video</Text>
            </View>
        );
    }

    

   


    renderCategories(){

       // var listItems = this.dsinit.cloneWithRows(this.state.photo);
       var count = this.state.photo.length
       if(count == 0){
           return(
        <View style={[styles.grid,{ justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor:'#c4c4c4'}]}>
            <Text>Tidak ada untuk ditampilkan</Text>
        </View>
        );
       }else{

        return (


                <GridList
                    showSeparator={true}
                    // showAnimation={true}
                    // animationDuration={500}
                    separatorBorderWidth={3}
                    separatorBorderColor='#E80E89'
                    data={this.state.photo}
                    numColumns={3}
                    //style={{margin:2}}
                    renderItem={({item}) => this.renderPhotoGallery(item)}
                    />
        )
    
        // return (
        //     <ScrollView style={{backgroundColor: '#ccc', flex: 1}} >
        //         <ListView 
        //             enableEmptySections={ true }
        //             contentContainerStyle={styles.grid}
        //             dataSource={listItems}
        //             renderRow={(item) => this.renderPhotoGallery(item)}
        //             //renderRow={(item) => this.renderGridItem(item)}
        //         />
        //     </ScrollView>
        // );

        }
    }



    header(){
        return(
            <View  >
                <View style={{ 
                    //flex:1,
                     justifyContent: 'center',
                     alignItems:'center',
                     height:100,
                    //backgroundColor:'powderblue',
                    }} >
                    {/* <Image style={{width: 100, height: 90, marginTop:20,left:20}} 
                        source={require('../../img/logo-edited.png')}/> */}

                        
                    <View style={{
                            
                            //backgroundColor:'#ffff',
                            flexDirection:'row',
                            justifyContent: 'center',alignItems:'center',
                            width: 300, height: 90
                     }}>
                     <View
                     style={{
                         //backgroundColor:'chocolate',
                         width: 270, 
                         height: 90,
                         flexDirection:'row'
                     }}
                     >
                            <View 
                            style={{
                                width: 60, 
                                height: 90,
                                //backgroundColor:'powderblue'
                            }}
                            >
                            <Image style={{
                                width: '100%', 
                                height: '100%', 
                                resizeMode:'contain'
                            
                                }} 
                                source={require('../../img/ikaAsset/LOGO.png')}/>
                            </View>
                            {/* <Image style={{
                                width: 100, 
                                height: 90, 
                                //  marginTop:20,
                                //  left:20
                                }} 
                                source={require('../../img/ikaAsset/LOGO.png')}/>
                            */}
                                <Text  style={{  
                                marginTop:30,

                                color:'#339933', 
                                fontSize:25,
                    
                                }}>
                                    GALLERY MENARI
                                </Text>
                        </View>
                    </View>
                    
                </View>
                
            </View>
        );
    }

    footer(){
        return(
            <View  >
                <View style={{flexDirection:'row', justifyContent: 'center'}} >
                    
                        {/* <Icon name="ios-share"  
                              size={25} 
                              onPress={()=>{ Actions.redeem() }} 
                              color="#ff1a8c"
                              style={{ marginTop:10, margin:5,position: 'absolute', right: 25 }}
                               /> */}
                        {/*}
                        <Icon name="ios-trash"  
                              size={25} 
                              onPress={()=>{ Actions.home() }} 
                              color="#ff1a8c"
                              style={{ marginTop:10, margin:5,position: 'absolute', right: 25 }}
                               />
                            */}
                    <Text  style={{ marginTop:10, margin:5, color:'#ff1a8c', fontSize:20, width: 250, height: 30 }}>
                        
                    </Text>
                </View>
                
            </View>
        );
    }



    

    render(){
        const Header = this.header() ; 
        //const Footer=this.footer();
        return(
         <View style={styles.container}>
          <TouchableOpacity 
          style={styles.back} 
          onPress={()=>{Actions.home() }}>
						<Icon 
						name="ios-arrow-round-back" 
						size={45} 
						color="#E80E89" />
					
			</TouchableOpacity>
            {Header}
        
            {this.renderCategories()}
            
            {/*Footer*/}    
        </View>

        );
    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        
        backgroundColor: '#000',
     
      },
      header:{
          flex:1,
        // justifyContent: 'center',
        // flexDirection: 'row',
        // flexWrap: 'wrap',
      },
      footer:{

      },
      grid: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    gridItem: {
        margin:2,
        //position:'absolute',
        width: Dimensions.get('window').width / 3.3,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor:'#c4c4c4'
       backgroundColor: '#ff1a8c'
    },
    gridItemImage: {
        width: 100,
        height: 100,
        borderWidth: 1.5, 
        borderColor: 'white',
        borderRadius: 50,
    },
    gridTouch:{
        width: '100%',
        height: '100%',
        backgroundColor:'powderblue'
    },
    gridImage:{
        width: '100%', 
        height: '100%',
        //backgroundColor:'powderblue'
    },
    gridItemText: {
        marginTop: 5,
        textAlign:'center',
    },
    back:{
        position:'absolute',
        top:25,
        left:15,
        //backgroundColor:'powderblue'
      },

    })