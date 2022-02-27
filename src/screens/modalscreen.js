import * as React from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import Constants from 'expo-constants';
import { Button } from 'react-native'



const colors = [
  'white',
  'black',
  'blue',
  'green',
  'pink',
  'red',
  'purple',
  'yellow',
  'gray',
  'lilac',
];

export default function ModalScreen({navigation}) {
     
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v === 9 ? 0 : v + 1));
    }, 100);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors[value] }]}>
        <Button
         title="You just found the Easter Egg                 
        ===> PRESS HERE!!!!!"
        onPress={() =>  navigation.navigate('CheckIn')}
        />
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
