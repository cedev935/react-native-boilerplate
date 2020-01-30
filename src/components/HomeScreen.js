import * as React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import ImagePicker from 'react-native-image-picker';
import {Thumbnail} from 'native-base';

function DetailsScreen() {
  const [image, setImage] = React.useState();
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
        setImage(source)
      }
    });
  };

  return (
    <View style={styles.view}>
      <Text>Details!</Text>
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
