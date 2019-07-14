import React from 'react'
import {Text, View, StyleSheet, ActivityIndicator, Button, TextInput, StatusBar} from 'react-native'
import {connect} from 'react-redux'
// import CASAuth from '../API/CASAuth'
//import {AsyncStorage} from 'react-native'
class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      login: "",
      mdp: ""
    }

  }


  stringifyData = async data => {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.log('error : ', error);
      throw 'Impossible de convertir les données en string.';
    }
  };

  parseData = async data => {
		try {
			return JSON.parse(data);
		} catch (error) {
			throw 'Impossible de parser les données récupérées.';
		}
};


  setData = async (key, value) => {
		if (!key) throw 'Clé non définie !';
		if (!value) throw 'Valeur non définie !';

		const data = await this.stringifyData(value);
		return AsyncStorage.setItem(key, data);
};

  getData = async key => {
    if (!key) throw 'Clé non définie !';

    try {
      const data = await AsyncStorage.getItem(key);
      //console.log(data)
      return this.parseData(data);
    } catch (err) {
      throw 'Impossible de récupérer les données';
    }
  };




  _submit() {

      this.setData('login', this.state.login);

       console.log("Résultat storage : ")
       const a = this.getData('login')




      this.props.navigation.navigate('NavAppli')
  }

  componentDidUpdate() {
      const actionLogin = {type: "NEW_LOGIN", value: this.state.login}
      this.props.dispatch(actionLogin)
      const actionMdp = {type: "NEW_MDP", value: this.state.mdp}
      this.props.dispatch(actionMdp)
      // console.log(this.props)

 }



  render() {
    return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop : 40}}>

      <View style={{flexDirection: 'row', marginLeft: 10, marginRight: 10}}>
        <Text style={styles.text}>Login :</Text>
        <TextInput style={styles.textInput}
        onChangeText={
          (text) => this.setState({login: text})}
          autofocus={true}/>
      </View>

      <View style={{flexDirection: 'row', marginLeft: 10, marginRight: 10, paddingTop: 10}}>
        <Text style={styles.text}>Mot de passe : </Text>
        <TextInput style={styles.textInput}
          secureTextEntry={true}
          onChangeText={
            (text) => this.setState({mdp: text})}
            onSubmitEditing={() => this._submit()}/>
      </View>

      <View style={{flex: 1, paddingTop : 10}}>
        <Button onPress={() => this._submit()} title="Connexion"/>
      </View>

    </View>
  )
  }
}

const mapStateToProps = (state) => {
  return {login: state.login, mdp: state.mdp}
}

export default connect(mapStateToProps)(Login)

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
