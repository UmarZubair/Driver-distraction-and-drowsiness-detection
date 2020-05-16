import React from 'react';
import {createDrawerNavigator,DrawerItems, createAppContainer} from 'react-navigation';
import { View, Image, Alert, ImageBackground , Text, SafeAreaView, ScrollView} from 'react-native';
import Logout from './Logout';
import ProfileSettings from './ProfileSettings';
import Dashboard from './Dashboard';
import Messenger from './messenger';
import Example from './test';
import GeoLocationComponent from './geolocation';
import * as constants from '../components/ip';
const ip = constants.address;
const CustomDrawerComponent= (props) => (
  
  <SafeAreaView style= {{flex:1}}>
    <View style = {{height:180, alignItems:'center', justifyContent: 'center'}}>
      <ImageBackground  style={{
          backgroundColor: '#4267b2',
          shadowOpacity: 0.5,
          flex: 1,
          resizeMode: 'cover',
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image style= {{width: 140, height:140, borderRadius:80 , top: 20, borderColor: '#ffffff', borderWidth: 2}} source = {{uri: 'http://' + ip + ':3000/' + props.navigation.getParam('Path', '')}}/>
        <Text style = {{fontSize: 18, color: '#ffffff' , fontFamily: 'Open Sans', marginTop: 20, marginBottom: 20}}>{props.navigation.getParam('Name', '')}</Text>
      </ImageBackground>
    </View>
    <ScrollView>
      <DrawerItems {...props} activeTintColor={"#4267b2"}
        /*  onItemPress = {
          ( route, focused ) =>       

          
          {    
            Alert.alert(route.route.routeName);
            if(route.route.routeName === 'settings'){
              
            }
          }
          } */

      />
    </ScrollView>
  </SafeAreaView>
)

 const Drawer =  createDrawerNavigator (
  {  
      dashboard: {screen: Dashboard},
      settings: {screen: ProfileSettings},
      Example:  {screen: Example},
      logout: {screen: Logout},
  },
  {
    contentComponent : CustomDrawerComponent
  }
); 
 
const drawerApp = createAppContainer(Drawer);
export default drawerApp;

  
   