import * as React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import ImagePicker from 'react-native-image-picker';
import {Thumbnail, Input, Label, Item} from 'native-base';
import {RTCPeerConnection} from 'react-native-webrtc';

function DetailsScreen() {
  const [image, setImage] = React.useState();
  const [message, setMessage] = React.useState();
  const [receiveMessage, setReceiveMessage] = React.useState();

  var localConnection = null; // RTCPeerConnection for our "local" connection
  var remoteConnection = null; // RTCPeerConnection for the "remote"

  var sendChannel = null; // RTCDataChannel for the local (sender)
  var receiveChannel = null; // RTCDataChannel for the remote (receiver)

  const selectPhotoTapped = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};
        setImage(source);
      }
    });
  };

  const connectPeers = () => {
    // @ts-ignore
    localConnection = new RTCPeerConnection({});
    sendChannel = localConnection.createDataChannel('sendChannel');
    sendChannel.onopen = handleSendChannelStatusChange;
    sendChannel.onclose = handleSendChannelStatusChange;

    // Create the remote connection and its event listeners

    // @ts-ignore
    remoteConnection = new RTCPeerConnection({});
    remoteConnection.ondatachannel = receiveChannelCallback;
    // Set up the ICE candidates for the two peers

    localConnection.onicecandidate = e =>
      !e.candidate ||
      remoteConnection
        .addIceCandidate(e.candidate)
        .catch(handleAddCandidateError);

    remoteConnection.onicecandidate = e =>
      !e.candidate ||
      localConnection
        .addIceCandidate(e.candidate)
        .catch(handleAddCandidateError);

    // Now create an offer to connect; this starts the process

    localConnection
      .createOffer()
      .then(offer => localConnection.setLocalDescription(offer))
      .then(() =>
        remoteConnection.setRemoteDescription(localConnection.localDescription),
      )
      .then(() => remoteConnection.createAnswer())
      .then(answer => remoteConnection.setLocalDescription(answer))
      .then(() =>
        localConnection.setRemoteDescription(remoteConnection.localDescription),
      )
      .catch(handleCreateDescriptionError);
  };

  function handleCreateDescriptionError(error) {
    console.log('Unable to create an offer: ' + error.toString());
  }

  // Handle successful addition of the ICE candidate
  // on the "local" end of the connection.

  function handleLocalAddCandidateSuccess() {}

  // Handle successful addition of the ICE candidate
  // on the "remote" end of the connection.

  function handleRemoteAddCandidateSuccess() {}

  // Handle an error that occurs during addition of ICE candidate.

  function handleAddCandidateError() {
    console.log('Oh noes! addICECandidate failed!');
  }

  // Handles clicks on the "Send" button by transmitting
  // a message to the remote peer.

  const sendMessage = () => {
    sendChannel.send(message);
  };

  // Handle status changes on the local end of the data
  // channel; this is the end doing the sending of data
  // in this example.

  function handleSendChannelStatusChange(event) {
    if (sendChannel) {
      var state = sendChannel.readyState;
    }
  }

  // Called when the connection opens and the data
  // channel is ready to be connected to the remote.

  function receiveChannelCallback(event) {
    receiveChannel = event.channel;
    receiveChannel.onmessage = handleReceiveMessage;
    receiveChannel.onopen = handleReceiveChannelStatusChange;
    receiveChannel.onclose = handleReceiveChannelStatusChange;
  }

  // Handle onmessage events for the receiving channel.
  // These are the data messages sent by the sending channel.

  function handleReceiveMessage(event) {
    setReceiveMessage(event.data);
  }

  // Handle status changes on the receiver's channel.

  function handleReceiveChannelStatusChange(event) {
    if (receiveChannel) {
      console.log(
        "Receive channel's status has changed to " + receiveChannel.readyState,
      );
    }

    // Here you would do stuff that needs to be done
    // when the channel's status changes.
  }

  // Close the connection, including data channels if they're open.
  // Also update the UI to reflect the disconnected status.

  function disconnectPeers() {
    // Close the RTCDataChannels if they're open.

    sendChannel.close();
    receiveChannel.close();

    // Close the RTCPeerConnections

    localConnection.close();
    remoteConnection.close();

    sendChannel = null;
    receiveChannel = null;
    localConnection = null;
    remoteConnection = null;

    // Update user interface elements
  }

  return (
    <View style={styles.view}>
      <Text>{receiveMessage}</Text>
      <Button title="Connect " onPress={connectPeers} />
      <Button title="Disconnect" onPress={disconnectPeers} />
      <Item stackedLabel>
        <Label>Username</Label>
        <Input onChangeText={text => setMessage(text)} value={message} />
      </Item>
      <Button title="Send msg" onPress={sendMessage} />

      <Thumbnail square large source={image} />
      <Button title="Go " onPress={selectPhotoTapped} />
    </View>
  );
}

function HomeScreen({navigation}) {
  return (
    <View style={styles.view}>
      <Text>Home screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
