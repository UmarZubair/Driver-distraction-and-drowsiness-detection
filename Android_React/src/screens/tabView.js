import React, {Component} from 'react';
import { Image, Alert, StyleSheet} from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer, createMaterialTopTabNavigator} from 'react-navigation';
import LoginScreenDriver from './LoginAsDriver';
import LoginScreenUser from './LoginAsUser';
import SignupScreenUser from './SignupAsUser';

const UserTab = createMaterialTopTabNavigator(
  {
    SignIn: {screen: LoginScreenUser,},
    SignUp: {screen: SignupScreenUser,  },
  },
  {
    
    headerMode: 'screen',
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#FFFFFF',
      inactiveTintColor: '#F8F8F8',
      style: {
        backgroundColor: '#764ad1',
      },
      upperCaseLabel : false,
      
      labelStyle: {
        textAlign: 'center',
        fontFamily: 'Open Sans',
        fontSize: 16,
      },
      indicatorStyle: {
        borderBottomColor: '#FFFFFF',
        borderBottomWidth: 3,
      },
      keyboardHidesTabBar: true,
    }
      
  }
);

const MainApp = createBottomTabNavigator(
  {
    DriverLogin: {screen: LoginScreenDriver},
    UserLogin: UserTab 
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      header: null,
      title: navigation.state.routeName === 'DriverLogin'? 'Driver Mode': 'User Mode',
      tabBarIcon: ({tintColor, focused}) => {
        const { routeName } = navigation.state;
        
        if (routeName === 'DriverLogin') {
        const blur = focused
        ? 1 : 0.2;
          return (
            <Image
              source={ require('../../images/driver_new.png') }
              style={[styles.icon, { tintColor: tintColor }]}
             
              
               />
          );
        } else {
        const blur = focused
        ? 1 : 0.2;
          return (
            <Image
              source={ require('../../images/user2.png') }
              style={[styles.icon, { tintColor: tintColor }]} />
          );
        }
      }
      
    }),
    animationEnabled: true,
    tabBarOptions: {
       activeTintColor: '#4267b2',
      //  activeBackgroundColor: '#764ad1',
      // inactiveTintColor: '#263238',
      // inactiveBackgroundColor: '#E4E2E4',
      
      style: {
        height: 60,
      },
      labelStyle: {
        textAlign: 'center',
        fontFamily: 'Open Sans',
        fontSize: 14,
        fontWeight: '900'
      },
      keyboardHidesTabBar: true,
      
    },
  }
);
const styles = StyleSheet.create({
 
  icon: {
    height: 30,
    width: 30,
   
  }
});

export default createAppContainer(MainApp);