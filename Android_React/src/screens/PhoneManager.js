import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AppRegistry,
} from 'react-native';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';

export default class PhoneManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recognized: '',
      started: '',
      results: [],
    };

    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Tts.setDefaultLanguage('en-IE');
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => console.log('finish', event));
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));
  }
componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }
onSpeechStart(e) {
    this.setState({
      started: '√',
    });
  };
onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  };
onSpeechResults(e) {
    this.setState({
      results: e.value,
    });
  }
async _startRecognition(e) {
    this.setState({
      recognized: '',
      started: '',
      results: [],
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

   _onPressSpeech = () => {
    Tts.stop();
    Tts.speak('Hello, world!');
}
render () {
    return (
      <View>
      
        <Button 
        onPress={this._startRecognition.bind(this)}
        title="Start"></Button>
          <Text>
            Transcript
        </Text>
        {this.state.results.map((result, index) => <Text > {this.state.results}</Text>)}
        <Button 
        onPress={this._onPressSpeech.bind(this)}
        title="Speak"></Button>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  transcript: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
    top: '400%',
  },
});