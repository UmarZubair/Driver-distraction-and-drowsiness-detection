
import React from 'react';
import DialogProgress from 'react-native-dialog-progress'
const options = {
    title:"Loading",
    message:"Starting Ride Mode..",
    isCancelable:false
}
import { Header, Left, Right, Body, Icon, Button } from 'native-base';

import {
    StyleSheet,  
    Animated,
    View,
    BackHandler,
    AsyncStorage,
    Text, 
    Image
  } from 'react-native';
  
import Toast from '../components/toast';

  

export default class RideLoader extends React.Component {

    constructor(props) {
        super(props);
        
    }
    componentDidMount(){
      setTimeout(() => {
        this._loadData()
    }, 2000)  
     
    }

    _loadData = async () => {
      DialogProgress.hide();
      this.props.navigation.navigate( 'Ride');
}


    render(){
      DialogProgress.show(options);
      return(
        <View style={styles.menu_container}>
          <Header style={{ backgroundColor: '#4267b2' }}>
            <Text style={{ color: '#ffffff', fontSize: 20, fontFamily: 'Open Sans', left: 45, top: 15 }}>Ride Mode</Text>
            <Left>
            </Left>
          </Header>
          </View>
      );
    }
    
  }

  const styles = StyleSheet.create({
    menu_container: {
      flex: 1,
      width: undefined,
      height: undefined,
      
  
    },
  })