import React from 'react';
import {ScrollView, Button, BackHandler, Text, ImageBackground, StyleSheet, View, Image, Dimensions, TextInput, TouchableOpacity} from 'react-native';

const {width: WIDTH} = Dimensions.get('window')

export default class LoginScreenDriver extends React.Component {
    static navigationOptions = {
      header: null,
      tabBarLabel: 'Sign In',
    };

    constructor(props) {
        super(props);
        this.state = {
          showPass: true,
          press: false,
        }
    }
    showPass(){
      if(this.state.press == false){
        this.setState({showPass: false, press: true})
      }
      else{
        this.setState({showPass: true, press: false})
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
      const {navigate} = this.props.navigation;
      return (
    
    <ImageBackground source={require('../../images/index.jpg')}
        style={{
          backgroundColor: '#ccc',
          shadowOpacity: 0.5,
          flex: 1,
          resizeMode: 'cover',
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
       >
         <ScrollView>
      <View style={styles.logoContainer}>
        <Text style={{color: 'white' , fontFamily: 'Open Sans', fontSize: 24, fontWeight: '600'}}>Sign In</Text>
      </View>

        <View style = {{marginTop: 10}} >
          <TextInput style= {styles.input} placeholder={'Email'} placeholderTextColor={'#999992'} 
            underlineColorAndroid='transparent' />
          <Image source = {require('../../images/username2.png')} style={{position: 'absolute',top: 9, left: 36, height: 27, width: 27,}} />
        </View> 

        <View style = {{marginTop: 10}} >
          <TextInput style= {styles.input} placeholder={'Password'} secureTextEntry={this.state.showPass} placeholderTextColor={'#999992'} 
            underlineColorAndroid='transparent' />
          <Image source = {require('../../images/password.png')} style={styles.icon} />
          <TouchableOpacity 
                  style={styles.btnEye}
                  onPress = {this.showPass.bind(this)}>
            <Image source = {require('../../images/eye_black.png') } style={{position: 'absolute',
                             top: 5,
                             right: 16,
                             height: 25,
                             width: 25,
                             opacity: this.state.press == false ?  1 :  0.2}} /> 
        </TouchableOpacity>
        </View> 
        
  
        <TouchableOpacity style={styles.btnLogin}>
        <Text style={{color: 'white' , fontFamily: 'Open Sans', fontSize: 16, fontWeight: '400', textAlign: 'center'}}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity>
        <Text style={{color: 'white' , fontFamily: 'Open Sans' , fontSize: 14, fontWeight: '400', textAlign: 'center', marginTop: 10}}>
         Forget Password?
        </Text>
        </TouchableOpacity>
        <TouchableOpacity>
        <Text style={{color: 'white' , fontFamily: 'Open Sans' , fontSize: 14, fontWeight: '400', textAlign: 'center', marginTop: 10}}>
         Don't have an account?
        </Text>
        </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
      
     
      );
    }
}
const styles = StyleSheet.create({
  logoContainer: {
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 50,
    },
    logo: {
          width: 120,
          height: 120,
          marginBottom: 20,
     },
     input: {
          width: WIDTH - 55,
          height: 45,
          borderRadius: 25,
          fontSize: 16,
          fontFamily: 'Open Sans',
          paddingLeft: 50,
          backgroundColor: 'rgba(249,247,246,0.9)',
          color: '#363534',
          marginHorizontal: 25,
          
          
     },
    icon: {
        position: 'absolute',
        top: 9,
        left: 37,
        height: 25,
        width: 25,
      },
    btnEye:{
      position: 'absolute',
      top: 5,
      right: 16,
      height: 35,
      width: 35,
    },
    btnLogin: {
      width: WIDTH - 55,
      height: 45,
      borderRadius: 25,
      backgroundColor: '#764ad1',
      justifyContent: "center",
      marginTop: 20,
      marginLeft: 25,
    }
});
