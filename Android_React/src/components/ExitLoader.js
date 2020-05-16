
import React from 'react';
import DialogProgress from 'react-native-dialog-progress'
const options = {
  title: "Exiting",
  message: "Exit from Ride Mode..",
  isCancelable: false
}
import * as constants from './ip';
const ip = constants.address;

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



export default class ExitLoader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      startTime: "",
      ride: {},

    }

  }
  componentDidMount() {
    setTimeout(() => {
      this._getRating();
      //this._loadData();
   }, 2000)

  }

  _loadData = async () => {
   
   
  }

  _getRating = async () => {
    var self = this;
    let url ='http://' + ip + ':3000/getRideRating';

    var driverID = global.driverID;
    var sTime = self.props.navigation.getParam('startTime', '');

    var data = { driverID: driverID, startTime: sTime };
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }

    })
      .then((response) => response.json())
      .then(function (myJson) {
        self.setState({ ride: myJson });
        DialogProgress.hide();
        self.props.navigation.navigate('Rating', { ride: self.state.ride });


      })
      .catch((error) => {
        console.error(error);
      });

  }


  render() {
    DialogProgress.show(options);
    return (
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