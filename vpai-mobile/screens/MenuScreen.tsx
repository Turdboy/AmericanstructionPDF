import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MenuScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' }}>What would you like to do?</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('StartInspection')}
        style={{ backgroundColor: '#002147', padding: 20, borderRadius: 10, marginBottom: 20 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Start New Inspection</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('RevisitInspection')}
        style={{ backgroundColor: '#FF6B6B', padding: 20, borderRadius: 10 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Revisit Saved Inspections</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MenuScreen;
