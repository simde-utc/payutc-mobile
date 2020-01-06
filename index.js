import { AppRegistry, Platform, UIManager } from 'react-native';
import App from './App';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

AppRegistry.registerComponent('PayUTC', () => App);
