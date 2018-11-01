import React, { Component } from "react";
import { Alert } from "react-native";
import { connect } from "react-redux";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Tab, Tabs, ScrollableTab
} from "native-base";

import Gamify, { Character } from "app/gamify";

import styles from "./styles";

const _quest = Symbol('quest');

class Challenge extends Component {
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
    Gamify.get('challenge')
    .then((quest) => {
      console.log('quest =>', quest);

      let el = quest.data.map((item, i) => (
        <Text  key={i} onPress={() => {
          Character.set(item.id)
          Character.get('@Gamify:character').then((score) => {
            Alert.alert(JSON.stringify(score))
          }).catch((error) => {
            console.log(error)
          });          
        }}>
          {item.title}
        </Text>
      ));
      
      this.setState({
        quests : el
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    const { props: { name, index, list } } = this;
    console.log(this.props.navigation, "000000000");
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>

          <Body>
            {/* TODO : nantinya akan query ke server */}
            <Title>{name ? this.props.name : "Tantangan"}</Title>
          </Body>

          <Right />
        </Header>

        <Content>
          {/* <Header hasTabs/> */}
          {this.state.quests}
        </Content>
      </Container>
    );
  }
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

export default connect(mapStateToProps, bindAction)(Challenge);
