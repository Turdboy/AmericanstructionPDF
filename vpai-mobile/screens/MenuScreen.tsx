import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MenuScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What would you like to do?</Text>
      <View style={styles.buttonContainer}>
        <Button title="Start New Inspection" onPress={() => navigation.navigate('StartInspection')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Revisit Saved Inspections" onPress={() => navigation.navigate('RevisitInspection')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
    textAlign: 'center',
    color: '#002147',
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default MenuScreen;
