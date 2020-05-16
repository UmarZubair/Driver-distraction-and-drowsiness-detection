import React, { Component } from 'react';
import { View, Image, Text, ScrollView, NativeEventEmitter, TouchableOpacity, StyleSheet, Dimensions, BackHandler, Alert } from 'react-native';
import GeoLocation from '../components/LocationService';
import BackgroundCamera from '../components/CameraService';
import SwipeablePanel from 'rn-swipeable-panel';
import { Card } from 'react-native-elements';
import Toast from '../components/toast';
import { Header, Left } from 'native-base';
import Modal from "react-native-modal";
import io from "socket.io-client";
import * as constants from '../components/ip';
const ip = constants.address;

const { width: WIDTH } = Dimensions.get('window');
export default class RideCamera extends Component {

  constructor(props) {
    super(props);
    this.state = {
      swipeablePanelActive: false,
      Speed: 0.0,
      Time: 0,
      distance: 0.0,
      mSpeed: 0.0,
      address: '',
      motion_detected: false,
      isVisible: false,
      rateDistract: 10,
      rateDrowsy: 10,
      authorized: "AUTHORIZED",
      startTime: "",
      driver: {},
     
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

  }


  componentDidMount() {
    this.socket = io( 'http://' + ip + ":3000");
    let data = {};
    GeoLocation.startService();
    var flag = false;
    var authCount = 0;
    this._getDriver();
    const eventEmitter = new NativeEventEmitter(GeoLocation);
    eventEmitter.addListener("updateLocation", (geoData) => {
      var rdistance = Math.round(geoData.distance * 100) / 100;
      var rspeed = Math.round(geoData.current_speed * 100) / 100;
      var rmspeed = Math.round(geoData.mspeed * 100) / 100;
      this.setState({ Speed: rspeed, Time: geoData.time, startTime: geoData.StartTime, distance: rdistance, mSpeed: rmspeed, address: geoData.address });
      
      data.driverID = global.driverID;
      data.distance = this.state.distance;
      data.currLoc = this.state.address;
      data.rateDistract = this.state.rateDistract;
      data.rateDrowsy = this.state.rateDrowsy;
      data.authName = this.state.authorized;

      data.driverName = this.state.driver.firstName + ' ' + this.state.driver.lastName;
      data.driverDP = this.state.driver.profilePicture.path;

      if (flag === false) {
        this.addRide();
      }
      flag = true;
      this.socket.emit("new_ride", data);

      /* if (geoData.current_speed > 20) {
         BackgroundCamera.startService();
         this.setState({ motion_detected: true });
 
       }
       else {
         BackgroundCamera.stopService();
         this.setState({ motion_detected: false });
       }*/

    });

  const eventEmitterAuthorization = new NativeEventEmitter(BackgroundCamera);
    eventEmitterAuthorization.addListener("UpdateAuthorization", (auth) => {

      data.driverID = global.driverID;
      data.driverName = this.state.driver.firstName + ' ' + this.state.driver.lastName;
      var name = this.state.driver.firstName + ' ' + this.state.driver.lastName;
      if (auth.authorized != "") {
        if (auth.authorized == name.toLowerCase()) {
          data.authName = "AUTHORIZED";
          this.setState({ authorized: "AUTHORIZED" });
        }
        else {
          data.authName = "NOT AUTHORIZED";
          this.setState({ authorized: "NOT AUTHORIZED" });
          var detail = {};
          authCount = 1;
          detail.driverID = global.driverID;
          detail.driverName = this.state.driver.firstName + ' ' + this.state.driver.lastName;
          detail.driverDP = this.state.driver.profilePicture.path;
          detail.start_time = this.state.startTime;
          detail.subject = "UnAuthorized driver found!";
          detail.type = "Auth";
          //detail.path = auth.authPath;
          this.socket.emit("notify", detail);
          this.socket.emit("badgeNotify", 0, detail);

        }
      }
      data.driverDP = this.state.driver.profilePicture.path;
      data.rateDistract = this.state.rateDistract;
      data.rateDrowsy = this.state.rateDrowsy;
      this.socket.emit("new_ride", data);
    });
  }


  addRide() {
    var self = this;
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(months[today.getMonth()]);
    var yyyy = today.getFullYear();
    var date = mm + ' ' + dd + ', ' + yyyy;
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12;
    h = h ? h : 12;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    var time = h + ":" + m + ":" + s + ' ' + ampm;
    let data2 = {};
    let url = 'http://' + ip + ':3000/add/ride';

    data2.driverID = global.driverID;
    data2.rideID = "";
    data2.authName = self.state.authorized;
    data2.driverName = self.state.driver.firstName + " " + self.state.driver.lastName;
    data2.driverDP = self.state.driver.profilePicture.path;
    data2.rideDate = date;
    data2.startTime = self.state.startTime;
    data2.endTime = "";
    data2.duration = "";
    data2.distance = self.state.distance;
    data2.startLoc = self.state.address;
    data2.currLoc = self.state.address;
    data2.endLoc = "";
    data2.rateDistract = 10;
    data2.rateDrowsy = 10;
    data2.distTime = "";
    data2.distType = "";
    data2.distEvid = "";

    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data2), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      return response.json();
    })
      .then(async function (myJson) {
        Toast.show(JSON.stringify(myJson), Toast.SHORT);

      })
      .catch(error => (Toast.show(error.toString(), Toast.LONG)));
  };



  openPanel = () => {
    this.setState({ swipeablePanelActive: true });
  };

  closePanel = () => {
    this.setState({ swipeablePanelActive: false });

  };

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.setState({ isVisible: true });
    return true;
  }

  endRide() {
    let data = {};
    var self = this;
    let url = 'http://' + ip + ':3000/end/ride';
    
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12;
    h = h ? h : 12;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    var time = h + ":" + m + ":" + s + ' ' + ampm;

    data.driverID = global.driverID;
    data.rideID = "";
    data.authName = self.state.authorized;
    data.driverName = self.state.driver.firstName + " " + self.state.driver.lastName;
    data.driverDP = self.state.driver.profilePicture.path;
    data.startTime = self.state.startTime;
    data.endTime = time;
    data.duration = self.state.Time;
    data.distance = self.state.distance;
    data.endLoc = self.state.address;

   
    fetch(url, {
      method: 'POST', 
      body: JSON.stringify(data), 
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      return response.json();
    })
      .then(async function (myJson) {
        Toast.show(JSON.stringify(myJson), Toast.SHORT);

      })
      .catch(error => (Toast.show(error.toString(), Toast.LONG)));

    this.socket.emit("end_ride", data, data.authName , data.duration );

    this.setState({ isVisible: false });
    self.setState({ authorized: "-", rateDistract: 10, rateDrowsy: 10 });
    //this._getRating();
    GeoLocation.stopService();
    BackgroundCamera.stopService();
    this.props.navigation.navigate("ExitLoader", {startTime: self.state.startTime});
  }


  _getDriver() {
    var self = this;
    let url = 'http://' + ip +':3000/getDriverInfo';

    var driverID = global.driverID;
    var data = { driverID: driverID };
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }

    })
      .then((response) => response.json())
      .then(function (myJson) {
        self.setState({ driver: myJson });


      })
      .catch((error) => {
        console.error(error);
      });

  }
 


  alert(value) {
    Alert.alert(value);
  }


  render() {
    if (this.state.motion_detected === true) {

      return (
        <View style={styles.container}>
          <Text style={{
            margin: 5,
            fontSize: 20,
            color: '#FBF3C1',
            fontWeight: 'bold',
          }}>In Ride</Text>
          <Text style={{
            margin: 5,
            fontSize: 18,
            justifyContent: 'center',
            color: '#fff',
          }}>App has started monitoring..</Text>
          <Text style={{
            margin: 5,
            fontSize: 18,
            justifyContent: 'center',
            color: '#fff',
            paddingLeft: 10,
          }}>You can turn off your device display.</Text>
          <Text style={{
            margin: 5,
            fontSize: 18,
            justifyContent: 'center',
            color: '#fff',
            paddingLeft: 10,
          }}>Have a safe ride :-) </Text>
          <Text style={{
            margin: 5,
            fontSize: 18,
            justifyContent: 'center',
            color: '#EA261A',
            fontWeight: 'bold',
            paddingLeft: 10,
          }} >Going back will exit from ride mode.. </Text>
          <TouchableOpacity style={{
            width: WIDTH - 95,
            height: 45,
            borderRadius: 20,
            backgroundColor: '#fc4040',
            justifyContent: "center",
            marginLeft: 6,
            marginTop: 15,
          }} onPress={() => {
            BackgroundCamera.stopService();
            this.setState({ motion_detected: false });
          }}>
            <Text style={{ color: 'white', fontFamily: 'Open Sans', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Back</Text>
          </TouchableOpacity>
          <Modal isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
            <View style={styles.modal}>
              <Text style={{ fontFamily: 'Open Sans', fontSize: 18, fontWeight: 'bold', paddingLeft: 25, paddingRight: 25 }}>Are you sure you want to end your ride?</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{
                  width: WIDTH - 290,
                  height: 45,
                  borderRadius: 15,
                  backgroundColor: '#4267b2',
                  justifyContent: "center",
                  marginTop: 55,
                  marginLeft: 100,


                }} onPress={() => { this.endRide(); }}>
                  <Text style={{ color: 'white', fontFamily: 'Open Sans', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}> Yes </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  width: WIDTH - 290,
                  height: 45,
                  borderRadius: 15,
                  backgroundColor: '#4267b2',
                  justifyContent: "center",
                  marginTop: 55,
                  marginLeft: 10,


                }} onPress={() => this.setState({ isVisible: false })}>
                  <Text style={{ color: 'white', fontFamily: 'Open Sans', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}> No </Text>
                </TouchableOpacity>
              </View>

            </View>
          </Modal>
        </View>
      );
    }
    else {
      return (
        <View style={styles.menu_container}>
          <Header style={{ backgroundColor: '#4267b2' }}>
            <Text style={{ color: '#ffffff', fontSize: 20, fontFamily: 'Open Sans', left: 45, top: 15 }}>Ride Mode</Text>
            <Left>
            </Left>
          </Header>
          <ScrollView>
            <View style={styles.ins_container}>
              <Card title="Ride Details" titleStyle={{ paddingVertical: 10, paddingHorizontal: 25, fontSize: 19, fontWeight: 'bold', fontFamily: 'Open Sans', color: "#fff", backgroundColor: "#4267b2" }}>
                <Text style={{
                  margin: 5,
                  fontSize: 18,
                  color: '#16A911',
                  borderColor: '#16A911',
                  borderWidth: 1,
                  fontWeight: 'bold',
                  fontFamily: 'Open Sans',
                  paddingHorizontal: 3,


                }}>App starts monitoring your driving behaviour when it detects vehicle's speed is greater than 20 km/h.. </Text>

                <TouchableOpacity style={{
                  width: WIDTH - 75,
                  height: 45,
                  borderRadius: 20,
                  backgroundColor: '#16A911',
                  justifyContent: "center",
                  marginLeft: 6,
                  marginTop: 5,
                  marginBottom: 20,
                }} onPress={() => {
                  BackgroundCamera.startService();
                  this.setState({ motion_detected: true });
                }}>
                  <Text style={{ color: 'white', fontFamily: 'Open Sans', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Start Monitoring Anyway</Text>
                </TouchableOpacity>
                <Text style={styles.heading}>Current Speed in km/h: </Text>
                <Text style={{
                  margin: 5,
                  fontSize: 20,
                  justifyContent: 'center',
                  color: '#EA261A',
                  fontWeight: 'bold',
                  fontFamily: 'Open Sans'

                }}>
                  {this.state.Speed} km/hr </Text>
                <Text style={styles.heading}>Curent Speed in m/s: </Text>
                <Text style={{
                  margin: 5,
                  fontSize: 20,
                  justifyContent: 'center',
                  color: '#EA261A',
                  fontWeight: 'bold',
                  fontFamily: 'Open Sans'
                }} >
                  {this.state.mSpeed} m/s</Text>
                <Text style={styles.heading}>Distance Covered: </Text>
                <Text style={styles.paragraph}>
                  {this.state.distance} km/hr </Text>
                <Text style={styles.heading}>Total Time: </Text>
                <Text style={styles.paragraph}>
                  {parseInt((this.state.Time)/60)} Minutes {parseInt((this.state.Time)%60)} Seconds</Text>
                <Text style={styles.heading}>Current Location: </Text>
                <Text style={styles.paragraph}>
                  {this.state.address} </Text>
              </Card>
              <TouchableOpacity style={{
                width: WIDTH - 75,
                height: 45,
                borderRadius: 20,
                backgroundColor: '#fc4040',
                justifyContent: "center",
                marginLeft: 6,
                marginTop: 15,
              }} onPress={() => this.setState({ isVisible: true })}>
                <Text style={{ color: 'white', fontFamily: 'Open Sans', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>End Ride</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
          <Modal isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
            <View style={styles.modal}>
              <Text style={{ fontFamily: 'Open Sans', fontSize: 18, fontWeight: 'bold', paddingLeft: 25, paddingRight: 25 }}>Are you sure you want to end your ride?</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{
                  width: WIDTH - 290,
                  height: 45,
                  borderRadius: 15,
                  backgroundColor: '#4267b2',
                  justifyContent: "center",
                  marginTop: 55,
                  marginLeft: 100,


                }} onPress={() => { this.endRide(); }}>
                  <Text style={{ color: 'white', fontFamily: 'Open Sans', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}> Yes </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  width: WIDTH - 290,
                  height: 45,
                  borderRadius: 15,
                  backgroundColor: '#4267b2',
                  justifyContent: "center",
                  marginTop: 55,
                  marginLeft: 10,


                }} onPress={() => this.setState({ isVisible: false })}>
                  <Text style={{ color: 'white', fontFamily: 'Open Sans', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}> No </Text>
                </TouchableOpacity>
              </View>

            </View>
          </Modal>
        </View>
      );
    }

  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  menu_container: {
    flex: 1,
    width: undefined,
    height: undefined,
    justifyContent: 'center',

  },
  bottom:
    { flex: 1, alignItems: "center", justifyContent: "center", },
  bottomSwiper:
    { flex: 0.09, alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff" },
  ins_container: {
    flex: 1,
    width: undefined,
    height: undefined,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4267b2',
    paddingBottom: 20,
  },
  paragraph: {
    margin: 5,
    fontSize: 18,
    justifyContent: 'center',
    color: '#34495e',
    fontFamily: 'Open Sans'
  },
  heading: {
    margin: 5,
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Open Sans'
  },
  paragraphIn: {
    margin: 5,
    fontSize: 14,
    justifyContent: 'center',
    color: '#34495e',
  },
  headingIn: {
    margin: 5,
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  menuBtn: {
    right: 78,
    backgroundColor: '#4267b2',
    height: 55
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
    height: 200,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 5,
  }


});