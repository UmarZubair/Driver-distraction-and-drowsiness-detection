import React, { Component } from "react";
import { AsyncStorage, TextInput, StyleSheet, Text, View,Image } from "react-native";
import io from "socket.io-client";
import { Header, Left, Right, Body, Icon, Button } from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat';

export default class Messenger extends Component {
    static navigationOptions = {
        drawerLabel: 'Messenger',
        drawerIcon: ({ tintColor }) => (
          <Image
            source={require('../../images/messenger2.png')}
            style={[styles.icon, { tintColor: tintColor }]}
          />
        ),
      };
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: "",
      chatMessages: [],
      msag: [],
    };
  }

  componentDidMount() {
    this.socket = io("http://192.168.10.4:3000");

    this.socket.on("myChat", msg => {
      this.setState({ chatMessages: [...this.state.chatMessages, msg] });
    });

    this.socket.on("chat",(data, msg) => {
        console.warn(msg.message_body);
        this.setState({ msag : [...this.state.msag, (msg.message_body).toString()]});
        
    });
  }

  submitChatMessage() {
    this.socket.emit("myChat", this.state.chatMessage);
    this.setState({ chatMessage: "" });
  }
  _getDriverInfo = async () => {
    const driver = await AsyncStorage.getItem('isLoggedIn');
}

  render() {
    const chatMessages = this.state.chatMessages.map(chatMessage => (
      <Text key= {chatMessage}>
      {chatMessage}
      </Text>
    ));
    
   /*  const receivedMessages = this.state.receivedMessages.map(msg => (
        <Text key= {msg}>
        {msg}
        </Text>
      )); 
    */

    return (
        <View style={styles.container}>
        <Header style={{ backgroundColor: '#4267b2'}}>
          <Button title="Menu" onPress={() => { this.props.navigation.openDrawer(); }} style = {styles.menuBtn}>
            <Image source={require('../../images/menu.png')} 
              style={{
                  height: 60,
                  width: 60,
                  tintColor: '#ffffff'
              }} 
            />
          </Button>
          <Text style = {{color: '#ffffff', fontSize: 20,  fontFamily: 'Open Sans', top: 15}}>Messenger</Text>
          <Left>          
          </Left>
        </Header>
      <View style={styles.container}>
        <TextInput
          style={{ height: 40, borderWidth: 2 }}
          autoCorrect={false}
          value={this.state.chatMessage}
          onSubmitEditing={() => this.submitChatMessage()}
          onChangeText={chatMessage => {
            this.setState({ chatMessage });
          }}
        />
       {chatMessages}
       <Text>{this.state.msag}</Text>
      </View>
      </View>
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
      }
});