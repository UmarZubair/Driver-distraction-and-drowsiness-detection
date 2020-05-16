import React, { Component } from 'react';
import { Text, View, Image, AsyncStorage, Dimensions, StyleSheet, ImageBackground, SafeAreaView } from 'react-native';
import { Header, Left, Right, Body, Button } from 'native-base';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import contact from '../../images/contact1.jpg';
import bg from '../../images/menu-bg1.jpg';
import performance from '../../images/performance1.png';
import drivemode from '../../images/driving.png';
import { Badge, Icon, withBadge } from 'react-native-elements';
import updateStatus from '../components/MsgBadge';
import Toast from '../components/toast';
import io from "socket.io-client";
import * as constants from '../components/ip';
const ip = constants.address;

const { width: WIDTH } = Dimensions.get('window')

export default class ProfileSettings extends Component {
    static navigationOptions = {
        drawerLabel: 'Dashboard',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('../../images/dashboard.png')}
                style={[styles.icon, { tintColor: tintColor }]}
            />
        ),
    };

    constructor(props) {

        super(props);
        this.state = {
            carouselItems: [
                {
                    title: "Ride Mode",
                    description: 'Get the safe and sound driving experience',
                    btnText: 'Start Ride',
                    color: '#fff',
                    image: drivemode,
                    navigateTo: '',
                    bgColor: '#000000'

                },
                {
                    title: "Ride History",
                    description: 'Check your previous rides performance',
                    btnText: 'View',
                    color: '#fff',
                    image: performance,
                    navigateTo: '',
                    bgColor: '#000000'
                },
                {
                    title: "Contact Manager",
                    description: 'Contact your respective company manager for any queries',
                    btnText: 'Open Messanger',
                    color: '#fff',
                    image: contact,
                    navigateTo: '',
                    bgColor: '#000000',
                },

            ],
            activeIndex: 0,
            foo: false,
            badge_status: "unread",
            showGuide: props.showGuide,
            driver: {},
            Path: props.navigation.getParam('Path', ''),
            Name: props.navigation.getParam("Name", ""),
       


        }
    }
    componentDidMount = async () => {
        this.socket = io('http://' + ip + ":3000");
        const item = await AsyncStorage.getItem('isLoggedIn');
        const driver = JSON.parse(item);
        global.driverID = driver._id;
        this.setState({ driver: driver })
        updateStatus()
        .then((data) => {
            this.setState({
                badge_status: data,
            })
        });
        if (global.showGuide === true) {
            setTimeout(() => {
               
                this.socket.on("read", () => {

                    this.setState({
                        badge_status: "read",
                    })

                });
                this.socket.on("chat", (data, msg) => {
                    if (data.driverId === this.state.driver._id) {
                        updateStatus()
                            .then((data) => {
                                this.setState({
                                    badge_status: data,
                                })
                            });

                    }
                });
                global.showGuide = false;
                if(this.state.activeIndex === 0){
                this.props.navigation.navigate('Swiper');
                }


            }, 2500);
        }
        else {
            this.socket.on("read", () => {

                this.setState({
                    badge_status: "read",
                })

            });
            this.socket.on("chat", (data, msg) => {
                if (data.driverId === this.state.driver._id) {
                    updateStatus()
                        .then((data) => {
                            this.setState({
                                badge_status: data,
                            })
                        });

                }
            });

        }





    }

    _renderItem({ item, index }) {

        return (
            <View style={{ flex: 1, top: -40, paddingLeft:0,borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flex: .85, width: 340,  borderRadius: 20, backgroundColor: 'transparent', alignItems: 'stretch', justifyContent: 'center' }} >
                    <View style={{ flex: 0.6, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: item.bgColor, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={item.image}
                            style={{
                                height: 357,
                                width: 340,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                opacity: 0.8
                            }} />

                    </View>
                    <View style={{ flex: 0.18, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, justifyContent: 'center', backgroundColor: item.color }}>
                        <Text style={{ color: '#000000', top: -25, fontSize: 22, left: 10, marginTop: 10, fontWeight: 'bold', fontFamily: 'Open Sans' }} >{item.title}</Text>
                        <Text style={{ color: '#000000', top: -20, fontSize: 16, left: 10, marginRight: 10, fontFamily: 'Open Sans' }} >{item.description}</Text>
                       
                    </View>
                </View>

            </View>
        )
    }

    textSelection() {
        if (this.state.activeIndex == 0)
            return 'Start Ride';
        else if (this.state.activeIndex == 1)
            return 'Ride History';
        else if (this.state.activeIndex == 2)
            return 'Open Messenger';
    }
    pressSelection() {
        if (this.state.activeIndex == 0)
            return 'RideLoader';
        else if (this.state.activeIndex == 1)
            return 'RideHistory';
        else if (this.state.activeIndex == 2)
            return 'Example';
    }

    handleOnNavigateBack = (foo) => {
        this.setState({
            foo
        })
    }

    
  


    render() {
        const read = <Button title="Menu" onPress={() => { this.props.navigation.openDrawer(); }} style={styles.menuBtn}>
            <Image source={require('../../images/menu.png')}
                style={{
                    height: 60,
                    width: 60,
                    tintColor: '#ffffff',
                    left: 10,

                }}
            />

        </Button>;
        const unread = <Button title="Menu" onPress={() => { this.props.navigation.openDrawer(); }} style={styles.menuBtn}>
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
                containerStyle={{ left: -13, top: -9 }}
            />
        </Button>;
        return (
            <View style={styles.container}>
                <Header style={{ backgroundColor: '#4267b2' }}>
                    {this.state.badge_status === "read" ? read : unread}
                    <Text style={{ color: '#ffffff', fontSize: 20, fontFamily: 'Open Sans', top: 15, left: -6 }}>Dashboard</Text>
                    <Left>
                    </Left>
                </Header>
                <ImageBackground source={bg}
                    style={{
                        backgroundColor: '#ffffff',
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}

                >

                    <SafeAreaView style={styles.innerContainer}>
                        <View style={{ flex: 1, right: 20, height: 700 }}>
                            <Carousel
                                ref={ref => this.carousel = ref}
                                data={this.state.carouselItems}
                                sliderWidth={400}
                                itemWidth={400}
                                renderItem={this._renderItem}
                                onSnapToItem={index => this.setState({ activeIndex: index })}
                                firstItem={0}
                            />
                        </View>
                        <Button onPress={() => { this.props.navigation.navigate(this.pressSelection()) }} style={styles.btnOptions} >
                            <Text style={{ fontWeight: 'bold', fontFamily: 'Open Sans', fontSize: 16, color: '#ffffff' }}>{this.textSelection()}</Text>
                        </Button>
                        <Pagination
                            containerStyle={{ backgroundColor: 'transparent', top: 250, right: 130 , marginTop: 40}}
                            dotStyle={styles.ww}
                            dotsLength={3}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                            activeDotIndex={this.state.activeIndex}
                        />

                    </SafeAreaView>
                </ImageBackground>
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
    badge: {
        borderRadius: 9,
        height: 14,
        minWidth: 0,
        width: 14,
        backgroundColor: "#EA261A"
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ww: {
        width: 15,
        height: 15,
        marginLeft: -10,
        borderRadius: 8,
        marginHorizontal: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.92)'
    },
    btnOptions: {
        width: WIDTH - 180,
        height: 50,
        borderWidth: 2,
        borderColor: '#ffffff',
        backgroundColor: '#48A3CF',
        justifyContent: "center",
        marginTop: 450,
        left: 12,
        borderRadius: 10,

    }


});