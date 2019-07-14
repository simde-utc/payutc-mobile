import React from 'react'
import {Text, View, StyleSheet, ActivityIndicator, Button, TextInput, StatusBar} from 'react-native'
import {connect} from 'react-redux'


class Rechargement extends React.Component {

  render() {
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop : 40}}>

        <View style={{flexDirection: 'row', marginLeft: 10, marginRight: 10, paddingTop: 10}}>
          <Text style={styles.text}> Rechargement de : {this.props.login} </Text>
          <Text style={styles.text}> MDP : {this.props.mdp} </Text>
        </View>

      </View>
    )
  }
}


const mapStateToProps = (state) => {
  return {login: state.login, mdp: state.mdp}
}

export default connect(mapStateToProps)(Rechargement)

const styles = StyleSheet.create({
  text: {
    flex: 2,
  },
  textInput: {
    flex: 3,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5
  }
})
