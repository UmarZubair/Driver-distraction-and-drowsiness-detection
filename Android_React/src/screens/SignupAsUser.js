import React from 'react';
import {ScrollView, Button, BackHandler, Text, ImageBackground, StyleSheet, View, Image, Dimensions, TextInput, TouchableOpacity} from 'react-native';

const {width: WIDTH} = Dimensions.get('window')

export default class LoginScreenDriver extends React.Component {
    static navigationOptions = {
      header: null,
      tabBarLabel: 'Sign Up',
     };

    constructor(props) {
        super(props);
        this.state = {
          showPass: true,
          press: false,
          showPassC: true,
          pressC: false,
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
    showPassC(){
        if(this.state.pressC == false){
          this.setState({showPassC: false, pressC: true})
        }
        else{
          this.setState({showPassC: true, pressC: false})
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
        <Text style={{color: 'white' , fontFamily: 'Open Sans', fontSize: 24, fontWeight: '600'}}>Sign Up</Text>
      </View>
      <View style={styles.row}>
      <View style = {{marginTop: 10, flex: 1}} >
          <TextInput style= {{  width: WIDTH - 200,
                                height: 45,
                                borderRadius: 25,
                                fontSize: 16,
                                fontFamily: 'Open Sans',
                                paddingLeft: 42,
                                backgroundColor: 'rgba(249,247,246,0.9)',
                                color: '#363534',
                                marginHorizontal: 10,   }} placeholder={'First Name'} placeholderTextColor={'#999992'} 
            underlineColorAndroid='transparent' />
          <Image source = {require('../../images/username.png')} style={{position: 'absolute',top: 9, left: 20, height: 25, width: 25,}} />
        </View> 
        <View style = {{marginTop: 10, flex: 1}} >
          <TextInput style= {{  width: WIDTH - 200,
                                height: 45,
                                borderRadius: 25,
                                fontSize: 16,
                                fontFamily: 'Open Sans',
                                paddingLeft: 40,
                                backgroundColor: 'rgba(249,247,246,0.9)',
                                color: '#363534',
                                   }} placeholder={'Last Name'} placeholderTextColor={'#999992'} 
            underlineColorAndroid='transparent' />
          <Image source = {require('../../images/username.png')} style={{position: 'absolute',top: 9, left: 10, height: 25, width: 25,}} />
        </View> 
        </View>
        <View style = {{marginTop: 10}} >
          <TextInput style= {styles.input} placeholder={'Email'} placeholderTextColor={'#999992'} 
            underlineColorAndroid='transparent' />
          <Image source = {require('../../images/username2.png')} style={{position: 'absolute',top: 9, left: 22, height: 27, width: 27,}} />
        </View> 
        <View style = {{marginTop: 10}} >
          <TextInput style= {styles.input} placeholder={'Phone No'} placeholderTextColor={'#999992'} 
            underlineColorAndroid='transparent' />
          <Image source = {require('../../images/phone.png')} style={{position: 'absolute',top: 9, left: 22, height: 23, width: 23,}} />
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
                             right: 7,
                             height: 25,
                             width: 25,
                             opacity: this.state.press == false ?  1 :  0.2}} /> 
        </TouchableOpacity>
        </View> 
        <View style = {{marginTop: 10}} >
          <TextInput style= {styles.input} placeholder={'Confirm Password'} secureTextEntry={this.state.showPassC} placeholderTextColor={'#999992'} 
            underlineColorAndroid='transparent' />
          <Image source = {require('../../images/password.png')} style={styles.icon} />
          <TouchableOpacity 
                  style={styles.btnEye}
                  onPress = {this.showPassC.bind(this)}>
            <Image source = {require('../../images/eye_black.png') } style={{position: 'absolute',
                             top: 5,
                             right: 7,
                             height: 25,
                             width: 25,
                             opacity: this.state.pressC == false ?  1 :  0.2}} /> 
        </TouchableOpacity>
        </View> 
        
  
        <TouchableOpacity style={styles.btnLogin}>
        <Text style={{color: 'white' , fontFamily: 'Open Sans', fontSize: 16, fontWeight: '400', textAlign: 'center'}}>Register</Text>
        </TouchableOpacity>
      
        <TouchableOpacity style= {{marginTop:10}}>
        <Text style={{color: 'white' , fontFamily: 'Open Sans' , fontSize: 14, fontWeight: '400', textAlign: 'center', marginTop: 10}}>
         Forget Password?
        </Text>
        </TouchableOpacity>
        <TouchableOpacity style= {{marginTop:10, marginBottom:20}}>
        <Text style={{color: 'white' , fontFamily: 'Open Sans' , fontSize: 14, fontWeight: '400', textAlign: 'center', marginTop: 1, marginBottom: 30}}>
         Already Registered?
        </Text>
        </TouchableOpacity>

        </ScrollView>
      </ImageBackground>
      
     
      );
    }
}
const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row"
      },
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
          width: WIDTH - 35,
          height: 45,
          borderRadius: 25,
          fontSize: 16,
          fontFamily: 'Open Sans',
          paddingLeft: 45,
          backgroundColor: 'rgba(249,247,246,0.9)',
          color: '#363534',
          marginHorizontal: 10,     
     },
    icon: {
        position: 'absolute',
        top: 9,
        left: 22,
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
      width: WIDTH - 35,
      height: 45,
      borderRadius: 25,
      backgroundColor: '#764ad1',
      justifyContent: "center",
      marginTop: 20,
      marginLeft: 10,
    }
});
