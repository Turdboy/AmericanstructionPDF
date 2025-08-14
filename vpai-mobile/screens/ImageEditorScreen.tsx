// vpai-mobile/screens/ImageEditorScreen.tsx

import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ImageEditorScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { imageUri } = route.params;

  const [annotations, setAnnotations] = useState([]);
  const [selectedTool, setSelectedTool] = useState('square');
  const [color, setColor] = useState('#FF0000');
  const [textInput, setTextInput] = useState('');

  const addAnnotation = () => {
    const newAnnotation = {
      type: selectedTool,
      x: 0.2,
      y: 0.2,
      width: 0.2,
      height: 0.2,
      color: color,
      text: selectedTool === 'text' ? textInput : '',
    };
    setAnnotations([...annotations, newAnnotation]);
  };

  const saveAndReturn = () => {
    // You could capture the canvas and create a new base64 here if you want
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      
      {/* Tools */}
      <View style={styles.tools}>
        <TouchableOpacity onPress={() => setSelectedTool('square')} style={styles.toolButton}>
          <Text>▭</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTool('circle')} style={styles.toolButton}>
          <Text>◯</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTool('arrow')} style={styles.toolButton}>
          <Text>➔</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTool('text')} style={styles.toolButton}>
          <Text>T</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addAnnotation} style={[styles.toolButton, { backgroundColor: '#002147' }]}>
          <Text style={{ color: 'white' }}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Save */}
      <TouchableOpacity style={styles.saveButton} onPress={saveAndReturn}>
        <Text style={{ color: 'white' }}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: width,
    height: width,
    backgroundColor: '#eee',
  },
  tools: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-around',
  },
  toolButton: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  saveButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#002147',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
