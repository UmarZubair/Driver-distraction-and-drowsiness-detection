
import React from 'react';
import {
    StyleSheet,  
    Animated,
    View,
    BackHandler,
    AsyncStorage,
    Alert, 
    Image
  } from 'react-native';

  class ImageLoader extends React.Component {
    state = {
      opacity: new Animated.Value(0),
    }
  
    onLoad = () => {
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();
    }
  
    render() {
      return (
        <Animated.Image
          onLoad={this.onLoad}
          {...this.props}
          style={[
            {
              opacity: this.state.opacity,
              transform: [
                {
                  scale: this.state.opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1],
                  })
                },
              ],
            },
            this.props.style,
          ]}
        />
      );
    }
  }

export default class Logout extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Logout',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../../images/logout.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

    constructor(props) {
        super(props);
        this.state = {}
    }
    
    componentDidMount() {
       setTimeout(() => {
        this._logout();
       // this.props.navigation.navigate( 'Tab' );
        }, 2000)  
    }


    _logout = async() => {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Login');
  
    }

    render() {
      
        return (
            
            <View style={styles.container}>
            <ImageLoader
             style={styles.image}
             source={require('../../images/AppLogo2.jpg')}
                  />
            </View>
        ) 
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: undefined,
        height: undefined,
        backgroundColor:'#4267b2',
        justifyContent: 'center',
        alignItems: 'center',
      },
      image: {
            width: 200,
            height: 200,
            borderRadius: 10,
      },
      icon: {
        position: 'absolute',
        height: 32,
        width: 32,
        top: -18
      },
      
});
