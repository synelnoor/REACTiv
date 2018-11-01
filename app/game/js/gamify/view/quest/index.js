import React, { Component } from "react";
import { TouchableOpacity,Text, } from "react-native";
import { connect } from "react-redux";
// import {
//   Container,
//   Header,
//   Title,
//   Content,
//   Text,
//   Button,
//   Icon,
//   Left,
//   Right,
//   Body
// } from "native-base";
import { Grid, Row } from "react-native-easy-grid";

import Gamify, { Character } from "app/gamify";

import styles from "./styles";

const _quest = Symbol('quest');

class Quest extends Component {
  static navigationOptions = {
    header: null
  };
  static propTypes = {
    name: React.PropTypes.string,
    index: React.PropTypes.number,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    openDrawer: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {quests: []};
  }

  componentDidMount() {
    this[_quest]();
  }

  [_quest]() {
    Gamify.get('quest')
    .then((quest) => {
      let subQuest = [];
  
      quest.data.map((item, i) => {
        subQuest.push({ route: 'Challenge', name: item.name, title: item.name });
      });
  
      console.log('subQuest =>', subQuest);
      return subQuest;

      // let el = <Grid style={styles.mt}>
      //   {subQuest.map((item, i) => (
      //     <Row key={i}>
      //       <TouchableOpacity
      //         style={styles.row}
      //         onPress={() => {            
      //           // Character.set()
      //           this.props.navigation.navigate(item.route, {
      //             name: item.name
      //           })
      //         }}
      //       >
      //         <Text style={styles.text}>{item.title}</Text>
      //       </TouchableOpacity>
      //     </Row>
      //   ))}
      // </Grid>;
      
      // this.setState({
      //   quests : el
      // });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  // render() {
  //   const { props: { name, index, list } } = this;
  //   console.log(this.props.navigation, "000000000");
  //   return (
  //     // <Container style={styles.container}>
  //     //   <Header>
  //     //     <Left>
  //     //       <Button transparent onPress={() => this.props.navigation.goBack()}>
  //     //         <Icon name="ios-arrow-back" />
  //     //       </Button>
  //     //     </Left>

  //     //     <Body>
  //     //       <Title>{name ? this.props.name : "Tugas"}</Title>
  //     //     </Body>

  //     //     <Right />
  //     //   </Header>

  //     //   <Content padder>
          
  //     //     {this.props.navigation.state.params.name.item !== undefined
  //     //       ? this.state.quests
  //     //       : <Text>Create Something Awesome . . .</Text>}
          
  //     //   </Content>
  //     // </Container>
  //   );
  // }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer())
  };
}

const mapStateToProps = state => ({
  name: state.user.name,
  index: state.list.selectedIndex,
  list: state.list.list
});

export default connect(mapStateToProps, bindAction)(Quest);
