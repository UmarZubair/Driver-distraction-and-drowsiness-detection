import {createStackNavigator, createAppContainer, createSwitchNavigator} from 'react-navigation';
import HomeScreen from './src/screens/Home';
import Tab from './src/screens/tabView';
import Drawer from './src/screens/DriverDashboard';
import SwiperTest from './src/screens/swipertest';
import RideCamera from './src/screens/RideCamera';
import ForgotPassword from './src/screens/ForgotPassword';
import RideLoader from './src/components/RideLoader';
import ExitLoader from './src/components/ExitLoader';
import PhoneManager from './src/screens/PhoneManager';
import React from "react";
import {StyleSheet} from "react-native";
import LoginScreenDriver from './src/screens/LoginAsDriver';
import Rating from "./src/screens/Rating"
import RideHistory from "./src/screens/performance";
console.disableYellowBox = true;
const MainNavigator = createStackNavigator({
 
  Drawer:{screen: Drawer},  
  Swiper: {screen: SwiperTest},
  Ride: {screen: RideCamera},
  ForgotPassword: {screen: ForgotPassword},
  RideLoader: {screen: RideLoader},
  ExitLoader: {screen: ExitLoader},
  PhoneManager: {screen:PhoneManager},
  Login: {screen: LoginScreenDriver},
  Rating: {screen: Rating},
  RideHistory: {screen: RideHistory},
},
{
  header: null,
  headerMode: 'none',
},
); 
const AuthStack = createStackNavigator(
 
  { Tab: {screen: Tab} },
  {
    header: null,
    headerMode: 'none',
  }
  );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    
  },
});
export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: HomeScreen,
    App: MainNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
