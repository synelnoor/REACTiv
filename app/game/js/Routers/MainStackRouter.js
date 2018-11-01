// import React, { Component } from "react";
import Login from "../components/login/";
import Home from "../components/home/";
import BlankPage from "../components/blankPage";
import Quest from "../gamify/view/quest";
import Challenge from "../gamify/view/quest/challenge";
import Adventure from "../gamify/view/quest/adventure";
import Daily from "../gamify/view/quest/daily";
import HomeDrawerRouter from "./HomeDrawerRouter";
import { StackNavigator } from "react-navigation";
// import { Header, Left, Button, Icon, Body, Title, Right } from "native-base";
HomeDrawerRouter.navigationOptions = ({ navigation }) => ({
  header: null
});
export default (StackNav = StackNavigator({
  Login: { screen: Login },
  Home: { screen: Home },
  Quest: { screen: Quest },
    Challenge: { screen: Challenge },
    Adventure: { screen: Adventure },
    Daily: { screen: Daily },
  // Item: { screen: Item },
  // Lottre: { screen: Lottre },
  // Mail: { screen: Mail },
  // Ranking: { screen: Ranking },
  // Profile: { screen: Profile },
  // Option: { screen: Option },
  BlankPage: { screen: BlankPage }
}));
