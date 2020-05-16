import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { Header, Left } from 'native-base';
import {
  PieChart,
} from 'react-native-chart-kit'
import { Dimensions } from "react-native";
import Pie from 'react-native-pie';
import { Card } from 'react-native-elements';
import Toast from '../components/toast';

const screenWidth = Dimensions.get("window").width;


export default class Rating extends Component {

  constructor(props) {

    super(props);
    this.state = {
        ride: props.navigation.getParam('ride', ''),
        drowsyPercent1:0,
        drowsyPercent2: 0,
        distractPercent1: 0,
        distractPercent2 : 0,
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

  }

  componentDidMount() {
    var a = (((this.state.ride.rate_drowsy)/10)*100).toFixed(2);
    var b = (((10 - (this.state.ride.rate_drowsy))/10)*100).toFixed(2);
    this.setState({drowsyPercent1: a, drowsyPercent2: b});
    var c = (((this.state.ride.rate_distraction)/10)*100).toFixed(2);
    var d = (((10 - (this.state.ride.rate_distraction))/10)*100).toFixed(2);
    this.setState({distractPercent1: c, distractPercent2: d});
  }
  
  handleBackButtonClick() {
    this.props.navigation.navigate('Drawer');
  }


  render() {
    return (
      <View style={styles.container}>
        <Header style={{ backgroundColor: '#4267b2' }}>
          <Text style={{ color: '#ffffff', fontSize: 20, fontFamily: 'Open Sans', top: 15, marginLeft: 76 }}>Rating</Text>
          <Left>
          </Left>
        </Header>
        <ScrollView>
        <View style={{ flex: 1 }}>
          <Text style={styles.sumHead}>Ride Summary: </Text>
          <Card containerStyle={{ backgroundColor: '#f9f9f9', padding: 6 }}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 110 }} >
                <Text style={styles.paragraph}><Text style={{ fontWeight: 'bold' }}>Ride Duration:</Text> </Text>
              </View>
              <View style={{ width: 215 }} >
                <Text style={styles.paragraph}>{Math.round(this.state.ride.ride_duration/60)} Minutes</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 110 }} >
                <Text style={styles.paragraph}><Text style={{ fontWeight: 'bold' }}>Distance:</Text> </Text>
              </View>
              <View style={{ width: 215 }} >
                <Text style={styles.paragraph}>{this.state.ride.distance_covered} km</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 110 }} >
                <Text style={styles.paragraph}><Text style={{ fontWeight: 'bold' }}>From:</Text> </Text>
              </View>
              <View style={{ width: 215 }} >
                <Text style={styles.paragraph}>{this.state.ride.start_location}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 110 }} >
                <Text style={styles.paragraph}><Text style={{ fontWeight: 'bold' }}>Destination:</Text> </Text>
              </View>
              <View style={{ width: 215 }} >
                <Text style={styles.paragraph}>{this.state.ride.end_location}</Text>
              </View>
            </View>
          </Card>
          <Text style={styles.sumHead}>Performance: </Text>
          
          <View style={{ flexDirection: "row", padding: 15 }}>
              <View style={{ flex: 1, alignItems: 'center', paddingTop: 10 }} >
                <Pie
                  radius={72}
                  innerRadius={58}
                  series={[this.state.drowsyPercent1]}
                  colors={['#76DA43']}
                  backgroundColor="#f00"
                />
                <View style={styles.gauge}>
                  <Text style={styles.gaugeText}>{this.state.drowsyPercent1}%</Text>
                </View>
                <Text style={styles.paragraph}><Text style={{ fontWeight: 'bold' }}>Drowsiness</Text> </Text>
                <Text style={styles.paragraph}><Text style={{ color: '#B3B2B2', fontSize: 12 }}>{this.state.drowsyPercent2}% Drowsiness detected</Text> </Text>
              </View>

              <View style={{ flex: 1, borderLeftColor: '#ccc', borderLeftWidth: 1, alignItems: 'center', paddingTop: 10 }} >
                <Pie
                  radius={72}
                  innerRadius={58}
                  series={[this.state.distractPercent1]}
                  colors={['#76DA43']}
                  backgroundColor="#f00"
                />
                <View style={styles.gauge}>
                  <Text style={styles.gaugeText}>{this.state.distractPercent1}%</Text>
                </View>
                <Text style={styles.paragraph}><Text style={{ fontWeight: 'bold' }}>Distraction</Text> </Text>
                <Text style={styles.paragraph}><Text style={{ color: '#B3B2B2', fontSize: 12 }}>{this.state.distractPercent2}% Distraction detected</Text> </Text>
              </View>
              
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.SquareShapeView} />
              <Text style={styles.paragraph}>Safe Driving</Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: -8 }}>
              <View style={styles.SquareShapeView2} />
              <Text style={styles.paragraph}>Drowsy / Distracted Driving</Text>
            </View>
            <TouchableOpacity style={{
            width: screenWidth - 120,
            height: 45,
            borderRadius: 10,
            backgroundColor: '#4267b2',
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 70,
            marginBottom: 20,
            marginTop: 25,
          }} onPress={() => {
            this.props.navigation.navigate('Drawer');
          }}>
            <Text style={{ color: 'white', fontFamily: 'Open Sans', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Back to Dashboard</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
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
  sumHead: {
    fontSize: 20,
    color: '#4267b2',
    marginLeft: 16,
    marginTop: 6,
    marginBottom: -10,
    fontFamily: 'Open Sans',
    fontWeight: 'bold'
  },
  gauge: {
    position: 'absolute',
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 24,
    top: 10
  },
  SquareShapeView: {
    width: 18,
    height: 18,
    top: 6,
    marginLeft: 15,
    backgroundColor: '#76DA43'
  },
  SquareShapeView2: {
    width: 18,
    height: 18,
    top: 6,
    marginLeft: 15,
    backgroundColor: '#f00'
  },
  paragraph: {
    margin: 5,
    fontSize: 15,
    justifyContent: 'center',
    color: '#34495e',
    fontFamily: 'Open Sans'
  },

});