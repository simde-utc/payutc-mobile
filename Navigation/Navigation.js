import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import Login from '../Component/Login'
import Historique from '../Component/Historique'
import Rechargement from '../Component/Rechargement'
import NavAppli from './NavAppli'

import {createBottomTabNavigator, createAppContainer, createStackNavigator, createSwitchNavigator} from 'react-navigation'

//
// const StackNavigator = createStackNavigator({
//   Login: {
//     screen: Login,
//   },
//   NavAppli: {
//     screen: NavAppli
//   }
// })

const MySwitch = createSwitchNavigator({
  Login: {
    screen: Login
  },
  NavAppli: {
    screen : NavAppli
  }
})

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30
  }
})

export default createAppContainer(MySwitch)
