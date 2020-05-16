import Toast from '../components/toast';
import { AsyncStorage } from "react-native";
import * as constants from './ip';
const ip = constants.address;
export default updateStatus = async () => {
  
  let url = 'http://' + ip + ':3000/getUnreadCount';
  //let url = 'http://10.128.41.159:3000/getUnreadCount';
  //let url = 'http://192.168.43.227:3000/getUnreadCount';
  
  const item = await AsyncStorage.getItem('isLoggedIn');
  const driver = JSON.parse(item);
  const response = await fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(driver),
    headers: {
      'Content-Type': 'application/json'

    }

  });
  const json = await response.json();
  return json.status;
}

