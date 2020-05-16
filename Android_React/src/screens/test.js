import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { AsyncStorage, TextInput, StyleSheet, Text, View, Image, Alert } from "react-native";
import io from "socket.io-client";
import { Header, Left, Right, Body, Button } from 'native-base';
import { Badge, Icon, withBadge } from 'react-native-elements';
import Toast from '../components/toast';
import DialogProgress from 'react-native-dialog-progress'
import * as constants from '../components/ip';
const ip = constants.address;
const options = {
    title:"Loading...",
    message:"Loading chat",
    isCancelable:false
}


export default class Example extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            chatMessage: "",
            sender: {},
            driver: {},
            pic: '',

        };
    }

    static navigationOptions = {

        drawerLabel: 'Messenger',
        drawerIcon: ({ tintColor }) => (

            <View>
                <Image
                    source={require('../../images/messenger2.png')}
                    style={[styles.icon, { tintColor: tintColor }]}
                />
            </View>

        ),
    };



    componentDidMount = async () => {
        this.socket = io(ip +":3000");
        //this.socket = io("http://192.168.43.227:3000");
        //this.socket = io("http://10.128.41.159:3000");
        //DialogProgress.show(options);
        this._getChat();
        
        this._getSender();
        let data = await this.updateMsgStatus();

        const item = await AsyncStorage.getItem('isLoggedIn');
        var driver1 = JSON.parse(item);
        this.setState({ driver: driver1 });

        this.socket.on("chat", (data, msg) => {
            if (data.driverId === this.state.driver._id) {
                var message = {
                    _id: (data.chat[data.chat.length - 1])._id,
                    text: msg.message_body.toString(),
                    createdAt: new Date(),
                    user: {
                        _id: msg.senderId,
                        name: msg.senderName.toString(),
                        avatar: 'https://cdn3.iconfinder.com/data/icons/ringtone-music-instruments/512/letter-m-key-keyboard-3-512.png',
                    },
                };
                this.setState({ messages: [message, ...this.state.messages] })
            }
        });


        //this._getPic(); 
    }
    _getDriver = async () => {
        var self = this;
        const item = await AsyncStorage.getItem('isLoggedIn');
        driver1 = JSON.parse(item);
        Alert.alert(driver1._id);
        self.setState({ driver: driver1 });
    }

   updateMsgStatus = async () => {
        var status= "not done";
        let url = ip +':3000/setReadStatus';
        //let url = 'http://192.168.43.227:3000/setReadStatus';
        //let url = 'http://10.128.41.159:3000/setReadStatus';
    
        const item = await AsyncStorage.getItem('isLoggedIn');
        const driver = JSON.parse(item);
        fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(driver),
            headers: {
                'Content-Type': 'application/json'
    
            }
    
        }).then( async (response) => {
            return await response.json();
        })
            .then(async (myJson) =>  {
               if( myJson.status === "done"){
                 status= "done";
                 Toast.show(status,Toast.LONG);
               }
                
            })
            .catch(error => (Toast.show(error.toString(), Toast.LONG)));


          
      
    
    }

    onSend = async (messages = []) => {
        var msg = this.state.chatMessage;
        var recipient = this.state.sender;
        const item = await AsyncStorage.getItem('isLoggedIn');
        const driver = JSON.parse(item);
        this.socket.emit("myChat", msg, driver, recipient);
        this.socket.emit("badge", 0, msg, driver);
        this.setState({ chatMessage: "" });
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),

        }))
    }

    _getSender = async () => {
        var self = this;
        let url = ip+ ':3000/getManagerInfo';
        //let url = 'http://192.168.43.227:3000/getManagerInfo';
       // let url = 'http://10.128.41.159:3000/getManagerInfo';
        const item = await AsyncStorage.getItem('isLoggedIn');
        const driver = JSON.parse(item);
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(driver),
            headers: {
                'Content-Type': 'application/json'
            }

        })
            .then((response) => response.json())
            .then(function (myJson) {
                self.setState({ sender: myJson });

            })
            .catch((error) => {
                console.error(error);
            });

    }

 


    _getChat = async () => {
        var self = this;
       let url = ip + ':3000/getChat';
        //let url = 'http://192.168.43.227:3000/getChat';
        //let url = 'http://10.128.41.159:3000/getChat';
        const item = await AsyncStorage.getItem('isLoggedIn');
        const driver = JSON.parse(item);
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(driver),
            headers: {
                'Content-Type': 'application/json'
            }

        })
            .then((response) => response.json())
            .then(function (myJson) {
                if (myJson.message === "Empty Chat") {
                    Toast.show("Start Chat",Toast.LONG);    
                }
                else {
                    DialogProgress.show(options);
                    myJson.chat.reverse().forEach(chat => {
                        self.setState({
                            messages: [...self.state.messages,
                            {
                                _id: chat._id,
                                text: chat.message_body,
                                createdAt: chat.message_date,
                                user: {
                                    _id: chat.senderId,
                                    name: chat.senderName.toString(),
                                    avatar: 'https://cdn3.iconfinder.com/data/icons/ringtone-music-instruments/512/letter-m-key-keyboard-3-512.png',
                                },
                            },
                            ],
                        });
                    });
                    DialogProgress.hide();
                }

                //Alert.alert(myJson.driverName);
            })
            .catch((error) => {
                console.error(error);
            });
            
    }

    _getPic = () => {
        var self = this;
        Alert.alert(self.state.driver.profilePicture.path.toString());
        self.setState({ pic: self.state.driver.profilePicture.path.toString() });
    }


    render() {
        return (
            <View style={styles.container}>
                <Header style={{ backgroundColor: '#4267b2' }}>
                    <Button title="Menu" onPress={() => { this.props.navigation.openDrawer(); }} style={styles.menuBtn}>
                        <Image source={require('../../images/menu.png')}
                            style={{
                                height: 60,
                                width: 60,
                                tintColor: '#ffffff',
                                left: 10,
                                
                            }}
                        />
                    
                    </Button>
                    


                    <Text style={{ color: '#ffffff', fontSize: 20, fontFamily: 'Open Sans', top: 15, left:-6 }}>Messenger</Text>
                    <Left>
                    </Left>
                </Header>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.driver._id,
                        name: this.state.driver.firstName,
                    }}

                    renderUsernameOnMessage={true}
                    inverted={true}
                    onInputTextChanged={chatMessage => {
                        this.setState({ chatMessage });
                    }}
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
        justifyContent: 'center'
    },
    icon: {
        position: 'absolute',
        height: 28,
        width: 28,
        top: -14,
        left: -12,
        

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

});
