import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import Login from '../Component/Login'
import Historique from '../Component/Historique'
import Rechargement from '../Component/Rechargement'
import {createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation'


const Appli = createBottomTabNavigator(
  {
    Historique: {
      screen: Historique,

    },
    Rechargement: {
      screen: Rechargement,
      }

  },
  {
    tabBarOptions: {
      activeBackgroundColor: '#DDDDDD', // Couleur d'arrière-plan de l'onglet sélectionné
      inactiveBackgroundColor: '#FFFFFF', // Couleur d'arrière-plan des onglets non sélectionnés
      showLabel: false, // On masque les titres
      showIcon: true // On informe le TabNavigator qu'on souhaite afficher les icônes définis
    }
  }
)

export default createAppContainer(Appli)
