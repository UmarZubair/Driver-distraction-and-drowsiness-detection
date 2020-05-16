
import React from 'react';
import {
    StyleSheet,  
    Animated,
    View,
    BackHandler,
    AsyncStorage,
    Alert
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

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {}
    }
    
    componentDidMount() {
       setTimeout(() => {
            this._loadData()
        }, 2000)  
    }
     _loadData = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
     
      const item = JSON.parse(isLoggedIn);
      if(!item){
        this.props.navigation.navigate( 'Login' );
      }else{
      let path = item.profilePicture.path;
      //Alert.alert(path);
      let name = item.firstName + " " + item.lastName;
      this.props.navigation.navigate( 'Drawer' , {Path: path, Name: name, showGuide : false});
  
      }
      //Alert.alert(name);
     
    }; 

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
      
});
