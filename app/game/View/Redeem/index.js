/**
 * Example usage of react-native-modal
 * @format
 */
import React, {Component} from 'react';
import {Platform,StyleSheet, TouchableOpacity, Text, View, TextInput, Image} from 'react-native';
import Modal from "react-native-modal";

export default class Redeem extends Component{
  state = {
    visibleModal: null,
    text_fb: 'https://www.facebook.com/',
    text_ig: 'https://www.inatagram.com/',
    text_tweet: 'https://www.tweeter.com/',
    text_youtube: 'https://www.youtube.com/'
  };

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Text style={styles.textStrong}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderModalContent(n) {
    return (
        <View style={styles.modalContent}>
        {( n =='1')?
           <TextInput
           onChangeText={(text_fb) => this.setState({text_fb})}
           value={
               this.state.text_fb
           }
       /> :( n =='2')? <TextInput
                onChangeText={(text_ig) => this.setState({text_ig})}
                value={
                    this.state.text_ig
                }
            />:( n =='3')? <TextInput
            onChangeText={(text_tweet) => this.setState({text_tweet})}
            value={
                this.state.text_tweet
            }
        />:<TextInput
        onChangeText={(text_youtube) => this.setState({text_youtube})}
        value={
            this.state.text_youtube
        }
    />
        }
       
        {this.renderButton("Close", () => this.setState({ visibleModal: null }))}
        </View>
    );
    }
    
  handleOnScroll = event => {
    this.setState({
      scrollOffset: event.nativeEvent.contentOffset.y
    });
  };

  render() {
        return(
            <View style={styles.container}>
                <Text style={styles.textFoter} >YOUR URL</Text>
                <View style={styles.isi}>
                    {/* <TouchableOpacity onPress={ this.setState({ visibleModal: 1 })}>
                        <Text style={styles.textStrong} >Facebook Post</Text>
                    </TouchableOpacity> */}
                    {this.renderButton("Facebook Post", () =>
                        this.setState({ visibleModal: 1 })
                    )}
                    <Modal isVisible={this.state.visibleModal === 1}>
                        {this.renderModalContent('1')}
                    </Modal>
                    <Image source={require('../../img/logo-garis.png')}  style={styles.garisatas}/>
                    {/* <Text style={styles.textStrong} >Instagram Post</Text> */}
                    {this.renderButton("Instagram Post", () =>
                        this.setState({ visibleModal: 2 })
                    )}
                    <Modal isVisible={this.state.visibleModal === 2}>
                        {this.renderModalContent('2')}
                    </Modal>
                    <Image source={require('../../img/logo-garis.png')}  style={styles.garisatas}/>
                    {/* <Text style={styles.textStrong} >Twitter Post</Text> */}
                    {this.renderButton("Twitter Post", () =>
                        this.setState({ visibleModal: 3 })
                    )}
                    <Modal isVisible={this.state.visibleModal === 3}>
                        {this.renderModalContent('3')}
                    </Modal>
                    <Image source={require('../../img/logo-garis.png')}  style={styles.garisatas}/>
                    {/* <Text style={styles.textStrong} >Youtube Post</Text> */}
                    {this.renderButton("Youtube Post", () =>
                        this.setState({ visibleModal: 4 })
                    )}
                    <Modal isVisible={this.state.visibleModal === 4}>
                        {this.renderModalContent('4')}
                    </Modal>
                    <Image source={require('../../img/logo-garis.png')}  style={styles.garisatas}/>
                    <Text style={styles.nilai} >00</Text>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.textStrongbottom} >Total Points</Text>
                    <Image source={require('../../img/logo-garis.png')}  style={styles.garis}/>
                </View>
            </View>
        )
    }
//******************* */
//   render() {
//     return (
//       <View style={styles.container}>
//         {this.renderButton("Default modal", () =>
//           this.setState({ visibleModal: 1 })
//         )}
       
//         <Modal isVisible={this.state.visibleModal === 1}>
//           {this.renderModalContent()}
//         </Modal>
       
//       </View>
//     );
//   }
}


// import React, {Component} from 'react';
// import {Platform,StyleSheet, Text, View, TextInput, Image} from 'react-native';

// export default class Redeem extends Component{

//     render() {
//         return(
//             <View style={styles.container}>
//                 <Text style={styles.textFoter} >YOUR URL</Text>
//                 <View style={styles.isi}>
//                     <Text style={styles.textStrong} >Facebook Post</Text>
//                     <Image source={require('../../img/logo-garis.png')}  style={styles.garisatas}/>
//                     <Text style={styles.textStrong} >Instagram Post</Text>
//                     <Image source={require('../../img/logo-garis.png')}  style={styles.garisatas}/>
//                     <Text style={styles.textStrong} >Twitter Post</Text>
//                     <Image source={require('../../img/logo-garis.png')}  style={styles.garisatas}/>
//                     <Text style={styles.textStrong} >Youtube Post</Text>
//                     <Image source={require('../../img/logo-garis.png')}  style={styles.garisatas}/>
//                     <Text style={styles.nilai} >00</Text>
//                 </View>
//                 <View style={styles.footer}>
//                     <Text style={styles.textStrongbottom} >Total Points</Text>
//                     <Image source={require('../../img/logo-garis.png')}  style={styles.garis}/>
//                 </View>
//             </View>
//         )
//     }
// }
// ***********************


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        //justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    button: {
        backgroundColor: "lightblue",
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
      },
     
    isi: {
        flex: 4,
        width: '100%',
        alignItems: 'center',
       // backgroundColor: 'steelblue',
        flexDirection: 'column',
    },
    
    textFoter: {
        fontSize: 30,
        fontWeight: 'bold',
        color:'#040404',
    },
    
    textStrong: {
        fontSize: 20,
        color:'#040404',
        marginTop: 40, 
       marginBottom: 10,
    },

    textStrongbottom: {
        fontSize: 20,
        color:'#040404',
        height: '90%',
        marginBottom: 10, 
        bottom: 0,
    },
    nilai: {
        fontSize: 100,
        color:'#040404', 
        position: 'absolute',
        bottom: -20, 
    },
    
    garis: {
      width: '30%',
      height: '10%',
      bottom: 0, 
      paddingBottom: 20, 
      position: 'absolute',
    },
    garisatas: {
        width: '80%',
        height: 5,
      },
    footer: {
        width: '100%', 
        height: 50, 
        //backgroundColor: 'powderblue',
        alignItems: 'center',
        bottom: 0,    
      },
  });
  
  