import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const SavedInspectionScreen = () => {
  const [inspections, setInspections] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchInspections = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, 'inspections'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInspections(data);
    };

    fetchInspections();
  }, []);

  const handleResume = (inspection) => {
    navigation.navigate('StartInspection', { data: inspection });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Saved Inspections</Text>
      <FlatList
        data={inspections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleResume(item)}
            style={{ backgroundColor: '#eee', padding: 20, borderRadius: 10, marginBottom: 10 }}
          >
            <Text>{item.propertyName || 'Unnamed Property'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SavedInspectionScreen;
