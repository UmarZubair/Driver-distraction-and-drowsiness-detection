import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet,ScrollView, Alert } from 'react-native';
import { Header, Left } from 'native-base';
import DialogProgress from 'react-native-dialog-progress'
import { Dimensions } from "react-native";
import * as constants from '../components/ip';
const ip = constants.address;
import Toast from '../components/toast';
const options = {
    title: "Loading...",
    message: "Loading Rides",
    isCancelable: false
}


const screenWidth = Dimensions.get("window").width;


export default class RideHistory extends Component {

    constructor(props) {

        super(props);
        this.state = {
            names: [
                {
                    id: 0,
                    name: 'Ben',
                },
                {
                    id: 1,
                    name: 'Susan',
                },
                {
                    id: 2,
                    name: 'Robert',
                },
                {
                    id: 3,
                    name: 'Mary',
                }
            ],
            rides: [],

        }


    }

    componentDidMount() {
        var flags = [];

        this._getRides();


    }

    alertItemName = (item) => {
        alert(item._id)
    }

    _getRides() {
        var self = this;
        let url = 'http://' + ip + ':3000/getRides';

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
                self.setState({ rides: myJson });

                DialogProgress.hide();
            })
            .catch((error) => {
                console.error(error);
            });

    }


    render() {
        DialogProgress.show(options);
        return (

            <View style={styles.container}>
                <Header style={{ backgroundColor: '#4267b2' }}>
                    <Text style={{ color: '#ffffff', fontSize: 20, fontFamily: 'Open Sans', top: 15, marginLeft: 76 }}>Ride History</Text>
                    <Left>
                    </Left>
                </Header>
                <ScrollView>
                <View style={{ flex: 1 }}>
                    {
                        this.state.rides.map((item, index) => (
                            <View>
                                <TouchableOpacity
                                    key={item._id}
                                    style={styles.listItems}
                                    onPress={() => { this.props.navigation.navigate('Rating', { ride: item });
                                }}>
                                    <Text style={{ fontSize: 16, marginLeft: 10 }}>{item.ride_date}</Text>
                                    <Text style={styles.text}>{item.start_time} to {item.end_time}</Text>
                                    <Image source={require('../../images/lines.jpg')} style={{
                                        position: 'absolute',
                                        top: 26,
                                        right: 30,
                                        height: 20,
                                        width: 20,
                                    }} />
                                    <Image source={require('../../images/arrow2.jpg')} style={{
                                        position: 'absolute',
                                        top: 26,
                                        right: 26,
                                        height: 22,
                                        width: 22,
                                    }} />
                                <Text style={{fontSize: 15, marginLeft: 10, marginTop: 5, borderTopColor: "#f5f5f5", borderTopWidth: 1}}>Performance: <Text style = {((((parseFloat(item.rate_distraction) + parseFloat(item.rate_drowsy))/2).toFixed(2)) > 4.8) ? styles.green : styles.red }>{((parseFloat(item.rate_distraction) + parseFloat(item.rate_drowsy))/2).toFixed(2)}</Text></Text>
                                
                                </TouchableOpacity>
                            </View>
                        ))
                    }
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
        backgroundColor: "#c7c7c7"
    },
    text: {
        color: '#4f603c',
        marginLeft: 10
    },
    listItems: {
        backgroundColor: "#ffffff",
        borderColor: "#ccc",
        borderWidth: 1,
        borderBottomColor: "#ccc",
        borderBottomWidth: 3,
        padding: 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 5

    },
    green: {
        color: '#1F8E27',
        fontWeight: "bold", 
        fontSize: 15
      },
      red: {
        color: '#ff0000',
        fontWeight: "bold",
        fontSize: 15
      }

});