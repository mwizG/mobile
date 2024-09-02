import { AppRegistry } from 'react-native';
import App from '../App'; // Ensure this is the correct path to your App component
import { name as appName } from '../app.json'; // Import the name from app.json

AppRegistry.registerComponent(appName, () => App);