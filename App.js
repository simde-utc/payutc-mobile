import React from 'react';
import Navigation from './Navigation/Navigation'
import {Provider} from 'react-redux'
import Store from './Store/configureStore'
import { StyleSheet, Text, View, StatusBar } from 'react-native';

export default class App extends React.Component  {

  constructor(props)
  {
    super(props)
    this.state = {
      signedIn: false
    }
  }

  render(){
    return (
      <Provider store={Store}>
        <View style={{flex: 1}}>
          <Navigation/>
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
