import React from 'react';
import { AsyncStorage, ScrollView, Alert, Button, BackHandler, Text, ImageBackground, StyleSheet, View, Image, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import Toast from '../components/toast';
import * as constants from '../components/ip';
const ip = constants.address;

const { width: WIDTH } = Dimensions.get('window')
global.showGuide = false;

export default class LoginScreenDriver extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      email: '',
      password: '',
      isVisible: false,
      resetEmail: '',

    }

  }

  showPass() {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true })
    }
    else {
      this.setState({ showPass: true, press: false })
    }
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  updateValue(text, field) {
    if (field == 'email') {
      this.setState({ email: text, })

    } else if (field == 'password') {
      this.setState({ password: text, })
    } else if (field == 'reset') {
      this.setState({ resetEmail: text, })
    }

  }

  validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(text) === false)
    {
    Toast.show("Email is invalid!", Toast.SHORT);
    this.setState({email:text})
    return false;
      }
    else {
      this.setState({email:text})
      return true;
    }
    }
  _submit = async () => {
    const { navigate } = this.props.navigation;
    let data = {};
    var result= this.validate(this.state.email);
     let url ='http://'+ ip + ':3000/auth/driverLogin';
    //let url = 'http://192.168.43.227:3000/auth/driverLogin';
   /// let url = 'http://10.128.41.159:3000/auth/driverLogin';
    if((!this.state.email == "" )&& (!this.state.password == "" ) ){
      if(result === true ){
    data.email = this.state.email,
      data.password = this.state.password
    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      return response.json();
    })
      .then(async function (myJson) {
        console.warn(JSON.stringify(myJson));
        await AsyncStorage.setItem('isLoggedIn', JSON.stringify(myJson));
        let path = myJson.profilePicture.path;
        let name = myJson.firstName + " " + myJson.lastName;
        global.showGuide = true;
        global.driverID = myJson._id;
        navigate('Drawer', { Path: path, Name:name,});
      })
      .catch(error => ( Toast.show(error.toString(), Toast.LONG)));
    }else{
      Toast.show("Invalid Email", Toast.LONG);
    }
    }

    else{
      Toast.show("Required fields must be filled.", Toast.LONG);

    }

  };

  _forgetPassword = () => {
    let data = {};
    let url = 'http://'+ip + ':3000/auth/reset-password';
   // let url = 'http://192.168.43.227:3000/auth/reset-password';
  // let url = 'http://10.128.41.159:3000/auth/reset-password';

  var result = this.validate(this.state.resetEmail);
    if(!this.state.resetEmail == '' ){
      if(result === true){
      this.setState({ isVisible: false });
      data.email = this.state.resetEmail;
   
    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      return response.json();
    })
      .then(async function (myJson) {
        Toast.show("Password reset email has been sent successfully.", Toast.LONG);
        //Alert.alert("Password reset email has been sent successfully.");
       
      })
      .catch(error => console.error('Error:', error));
    
    }else{
      Toast.show('Invalid email', Toast.SHORT);
    }}
    else{
      Toast.show('Please provide your email.', Toast.SHORT);

    }

  };

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
    const { navigate } = this.props.navigation;
    return (

      <ImageBackground
        style={{
          backgroundColor: '#4267b2',
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
            <Image source={require('../../images/logo.png')} style={styles.logo}></Image>
            <Text style={{ color: 'white', fontFamily: 'Open Sans', fontSize: 24, fontWeight: '600' }}>Sign In</Text>
            <Text style={styles.logotext}>Using Company's provided credentials</Text>
          </View>

          <View style={{ marginTop: 10 }} >
            <TextInput style={styles.input} placeholder={'Email'} placeholderTextColor={'#999992'}
              underlineColorAndroid='transparent' onChangeText={(text) =>this.updateValue(text, 'email')} />
            <Image source={require('../../images/username2.png')} style={{ position: 'absolute', top: 9, left: 36, height: 27, width: 27, }} />
          </View>

          <View style={{ marginTop: 10 }} >
            <TextInput style={styles.input} placeholder={'Password'} secureTextEntry={this.state.showPass} placeholderTextColor={'#999992'}
              underlineColorAndroid='transparent' onChangeText={(text) => this.updateValue(text, 'password')} />
            <Image source={require('../../images/password.png')} style={styles.icon} />
            <TouchableOpacity
              style={styles.btnEye}
              onPress={this.showPass.bind(this)}>
              <Image source={require('../../images/eye_black.png')} style={{
                position: 'absolute',
                top: 5,
                right: 16,
                height: 25,
                width: 25,
                opacity: this.state.press == false ? 1 : 0.2
              }} />
            </TouchableOpacity>
          </View>


          <TouchableOpacity style={styles.btnLogin} onPress={() => this._submit()}>
            <Text style={{ color: 'white', fontFamily: 'Open Sans', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}> Login </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ isVisible: true })}>
            <Text style={{ color: 'white', fontFamily: 'Open Sans', fontSize: 14, fontWeight: '400', textAlign: 'center', marginTop: 10 }}>
              Forget Password?
        </Text>
          </TouchableOpacity>
        </ScrollView>
        <Modal isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
          <View style={styles.modal}>
            <Text style={{fontFamily: 'Open Sans', fontSize: 18, fontWeight: 'bold', paddingLeft: 25, paddingRight: 25}}>Enter your email. We'll email instructions on how to reset your password.</Text>
            <TextInput style={{
              width: WIDTH - 80,
              height: 45,
              borderRadius: 15,
              fontSize: 16,
              fontFamily: 'Open Sans',
              paddingLeft: 45,
              backgroundColor: 'rgba(217,217,218,0.8)',
              color: '#363534',
              marginTop: 30
            }} placeholder={'Write your email'} placeholderTextColor={'#999992'}
              underlineColorAndroid='transparent' onChangeText={(text) => this.updateValue(text, 'reset')} />
            <Image source={require('../../images/username2.png')} style={{ position: 'absolute', top: 148, left: 30, height: 27, width: 27, }} />
            <TouchableOpacity style={{
              width: WIDTH - 80,
              height: 45,
              borderRadius: 15,
              backgroundColor: '#4879F3',
              justifyContent: "center",
              marginTop:8,
            
            }} onPress={() => this._forgetPassword()}>
              <Text style={{ color: 'white', fontFamily: 'Open Sans', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}> Send Recovery Email </Text>
            </TouchableOpacity>

          </View>
        </Modal>
      

      </ImageBackground>


    );
  }
}
const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 120,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  logotext: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Open Sans',
    fontWeight: '500',
    marginTop: 10,

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
  btnEye: {
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
    backgroundColor: '#4879F3',
    justifyContent: "center",
    marginTop: 20,
    marginLeft: 25,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
    height: 280,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 5,
  }

});
