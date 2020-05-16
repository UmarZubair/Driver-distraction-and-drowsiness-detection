import React, {Component} from 'react';  
import {Platform, StyleSheet, Text, View, Button, Modal} from 'react-native';  
  
export default class ForgotPassword extends Component {  
  state = {  
    isVisible: true, //state of modal default false  
  }  

  
  render() {  
    const {navigate} = this.props.navigation;
    return (  
      <View style = {styles.container}>  
        <Modal            
          animationType = {"fade"}  
          transparent = {true}  
          visible = {this.state.isVisible}  
          onRequestClose = {() =>{ console.log("Modal has been closed.") } }>  
          {/*All views of Modal*/}  
              <View style = {styles.modal}>  
              <Text style = {styles.text}>Modal is open!</Text>  
              <Button title="Click To Close Modal" onPress = {() => {  
                  this.setState({ isVisible:!this.state.isVisible});
                  navigate('Tab');
                }}
                  />  
          </View>  
        </Modal>  
      </View>  
    );  
  }  
}  
  
const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    alignItems: 'center',  
    justifyContent: 'center',  
    backgroundColor: '#ecf0f1',  
  },  
  modal: {  
  justifyContent: 'center',  
  alignItems: 'center',   
  backgroundColor : "#00BCD4",   
  height: 300 ,  
  width: '80%',  
  borderRadius:10,  
  borderWidth: 1,  
  borderColor: '#fff',    
  marginTop: 80,  
  marginLeft: 40,  
   
   },  
   text: {  
      color: '#3f2949',  
      marginTop: 10  
   }  
});  