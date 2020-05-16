import React from 'react';
import { StyleSheet, Text, BackHandler, View, ImageBackground, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import Toast from '../components/toast';

export default class SwiperTest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            path: props.navigation.getParam('Path', ''),
            Name: props.navigation.getParam("Name", ""),
        }
    }
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
    }

    handleBackPress = () => {
        BackHandler.exitApp(); // works best when the goBack is async
        return true;
    };

    render() {
        return (
            <Swiper style={styles.wrapper} showsPagination={false} loop={false} showsButtons={true} nextButton={<Text style={styles.nextBtn}>NEXT</Text>} prevButton={<Text style={styles.prevBtn}>PREV</Text>} 
                onIndexChanged={(index) => this.setState({ activeIndex: index })}>
                <View style={styles.slide1}>
                    <ImageBackground source={require('../../images/menu-guide.png')}
                        style={{
                            backgroundColor: '#4267b2',
                            flex: 1,
                            resizeMode: 'cover',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text onPress={() => { this.props.navigation.navigate('Drawer') }} style={styles.skipBtn}>SKIP</Text>


                    </ImageBackground>

                </View>
                <View style={styles.slide2}>
                    <ImageBackground source={require('../../images/notification-guide.png')}
                        style={{
                            backgroundColor: '#4267b2',
                            flex: 1,
                            resizeMode: 'cover',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text onPress={() => { this.props.navigation.navigate('Drawer') }} style={styles.skipBtn}>SKIP</Text>


                    </ImageBackground>

                </View>
                <View style={styles.slide3}>
                    <ImageBackground source={require('../../images/start-ride-guide.png')}
                        style={{
                            backgroundColor: '#4267b2',
                            flex: 1,
                            resizeMode: 'cover',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text onPress={() => { this.props.navigation.navigate('Drawer') }} style={{
                            color: "#16A911",
                            fontSize: 20,
                            marginTop: 300,
                            marginRight: -150,
                            fontWeight: 'bold',
                        }}>OK, GOT IT!</Text>

                    </ImageBackground>
                </View>
            </Swiper>

        );
    }
}

const styles = StyleSheet.create({
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    nextBtn: {
        color: "#16A911",
        fontSize: 20,
        marginTop: 300,
        marginRight: 30,
        fontWeight: 'bold',
    },
    prevBtn: {
        color: "#16A911",
        fontSize: 20,
        marginTop: 300,
        marginLeft: 120,
        fontWeight: 'bold',
    },
    skipBtn: {
        color: "#16A911",
        fontSize: 20,
        marginTop: 300,
        marginLeft: 85,
        fontWeight: 'bold',
    },

});
