import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import {
  Content,
  Text
} from "native-base";
import { Grid, Row } from "react-native-easy-grid";

// import Gamify from "app/gamify";

import styles from "./styles";

export default class Leaderboard extends Component {
  // TODO : nantinya akan query ke server
  quickBtnData = [
    { route: 'Quest', title: 'Tugas' },
    { route: 'Item', title: 'Item' },
    { route: 'Lottre', title: 'Undian' },
    { route: 'Mail', title: 'Pesan' },
    { route: 'Profile', title: 'Profil' },
    { route: 'Ranking', title: 'Peringkat' },
    { route: 'Option', title: 'Opsi' }
  ]

  quickBtn = <Grid style={styles.mt}>
    {this.quickBtnData.map((item, i) => (
      <Row key={i}>
        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            this.props.navigation.navigate(item.route, {
              name: { item: item.title }
            })
          }
        >
          <Text style={styles.text}>{item.title}</Text>
        </TouchableOpacity>
      </Row>
    ))}
  </Grid>

  render() {
    return (
      <Content>
        <Text>LeaderBoard</Text>
        { this.quickBtn }
      </Content>
    );
  }
}
