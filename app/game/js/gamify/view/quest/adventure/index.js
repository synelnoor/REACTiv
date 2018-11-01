import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
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
  Body
} from "native-base";
import { Grid, Row } from "react-native-easy-grid";

import styles from "./styles";

class Adventure extends Component {
  static navigationOptions = {
    header: null
  };
  static propTypes = {
    name: React.PropTypes.string,
    index: React.PropTypes.number,
    list: React.PropTypes.arrayOf(React.PropTypes.string),
    openDrawer: React.PropTypes.func
  };

  // TODO : nantinya akan query ke server
  questData = [
    {route : 'BlankPage', name : 'Jelajah Indonesia Item', title : 'Jelajah Indonesia Item'},
    {route : 'BlankPage', name : 'Jelajah Indonesia Item', title : 'Jelajah Indonesia Item'},
    {route : 'BlankPage', name : 'Jelajah Indonesia Item', title : 'Jelajah Indonesia Item'}
  ]

  // TODO : nantinya akan query ke server
  quest = <Grid style={styles.mt}>
    {this.questData.map((item, i) => (
      <Row key={i}>
        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            this.props.navigation.navigate(item.route, {
              name: item.name
            })}
        >
          <Text style={styles.text}>{item.title}</Text>
        </TouchableOpacity>
      </Row>
    ))}
  </Grid>

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
            <Title>{name ? this.props.name : "Jelajah Indonesia"}</Title>
          </Body>

          <Right />
        </Header>

        <Content padder>          
            {this.props.navigation.state.params.name.item !== undefined
              ? this.quest
              : <Text>Create Something Awesome . . .</Text>}          
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

export default connect(mapStateToProps, bindAction)(Adventure);
