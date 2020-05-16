import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Header, Left, Right, Body, Button } from 'native-base';


export default class ProfileSettings extends Component {
  static navigationOptions = {
    drawerLabel: 'Profile Settings',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../../images/settings.png')}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    ),
  };
  constructor(props) {

    super(props);
    this.state = {
     

    }
  }

  componentDidMount = async () => {
 



  }
  render() {
    return (
      <View style={styles.container}>
        <Header style={{ backgroundColor: '#4267b2' }}>
        <Button title="Menu" onPress={() => { this.props.navigation.openDrawer(); }} style={styles.menuBtn}>
      <Image source={require('../../images/menu.png')}
        style={{
          height: 60,
          width: 60,
          tintColor: '#ffffff',
          left: 22,

        }}
      />

    </Button>
          <Text style={{ color: '#ffffff', fontSize: 20, fontFamily: 'Open Sans', top: 15, left: -6 }}>Profile Settings</Text>
          <Left>
          </Left>
        </Header>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => { this.props.navigation.openDrawer(); }}>
            <Text>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    justifyContent: 'center'
  },
  icon: {
    position: 'absolute',
    height: 35,
    width: 35,
    top: -18
  },
  menuBtn: {
    right: 78,
    backgroundColor: '#4267b2',
    height: 55
  },
  
});