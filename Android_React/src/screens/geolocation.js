import React, { Component } from 'react';
import { NativeEventEmitter, NativeModules, Text, View, Image, TouchableOpacity,Alert, StyleSheet } from 'react-native';
import { Header, Left, Right, Body, Button } from 'native-base';
import GeoLocation from '../components/LocationService';
import { Badge, Icon, withBadge } from 'react-native-elements';
export default class GeoLocationComponent extends Component {
    static navigationOptions = {
        drawerLabel: 'My Location',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('../../images/ic_gps_icon.png')}
                style={[styles.icon, { tintColor: tintColor }]}
            />
        ),
    };
    constructor(props) {
        super(props);
        this.state = {
         Speed: '',
         Distance: '',
         Time: '',
         mSpeed: '',
         address: '',
         
        }
    
      }
    componentDidMount(){
        const {navigate} = this.props.navigation;
        const eventEmitter = new NativeEventEmitter(GeoLocation);
        eventEmitter.addListener("updateLocation", (geoData) => {
            this.setState({Speed: geoData.current_speed  + " km/hr" , Distance: geoData.distance + + " Km's.", Time: geoData.time + " minutes", mSpeed: geoData.mspeed + " m/s", address: geoData.address})
          });


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
                                left: 10,
                                
                            }}
                        />
                        <Badge
                        badgeStyle={styles.badge}
                        containerStyle={{ left: -13, top: -9}}
                    />
                    </Button>
                    <Text style={{ color: '#ffffff', fontSize: 20, fontFamily: 'Open Sans', top: 15 , left:-6 }}>My Location</Text>
                    <Left>
                    </Left>
                </Header>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                
                <Text onPress={() => {
                        GeoLocation.startService()}}  style = {{fontWeight: 'bold'}}>
                Start Location Service</Text>
                
                <Text>Speed: {this.state.Speed} </Text>
                <Text>Distance: {this.state.Distance} </Text>
                <Text>Time: {this.state.Time} </Text>
                <Text>Speed in m/s: {this.state.mSpeed} </Text>
                <Text>Address : {this.state.address} </Text>
                <Text onPress={() => {
                        GeoLocation.stopService()}}  style = {{fontWeight: 'bold'}}>
                Stop Location Service</Text>
                
            </View>
      </View >
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
    badge: {
        borderRadius: 9,
        height: 14,
        minWidth: 0,
        width: 14,
        backgroundColor: "#EA261A"
      },

});