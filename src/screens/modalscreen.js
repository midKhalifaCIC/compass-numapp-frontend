import * as React from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import Constants from 'expo-constants';
import { Button } from 'react-native'



const colors = [
  '#ec7785',
  '#353E55',
  '#DFD8C8',
  '#CABFAB',
  '#E97A7A',
  '#8B4F80',
  '#8B4F80',
  '#B9C0D5',
  '#7393A7',
  '#516091',
];

export default function ModalScreen({navigation}) {
     
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v === 9 ? 0 : v + 1));
    }, 250);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors[value] }]}>
      onload
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
