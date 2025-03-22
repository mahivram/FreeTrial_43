import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, shadows, semantic, components } from '../theme/colors';
import axios from 'axios';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmergencyScreen = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadinglocation, setLoadinglocation] = useState(false);
  const [parentContacts, setParentContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', number: '' });

  // Load parent contacts on component mount
  React.useEffect(() => {
    loadParentContacts();
  }, []);

  const loadParentContacts = async () => {
    try {
      const contacts = await AsyncStorage.getItem('parentContacts');
      if (contacts) {
        setParentContacts(JSON.parse(contacts));
      }
    } catch (error) {
      console.error('Error loading parent contacts:', error);
    }
  };

  const saveParentContact = async () => {
    if (!newContact.name.trim() || !newContact.number.trim()) {
      Alert.alert('Error', 'Please enter both name and number');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!phoneRegex.test(newContact.number.replace(/[\s-]/g, ''))) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      const updatedContacts = [...parentContacts, { 
        id: Date.now().toString(),
        ...newContact,
        icon: 'account-heart' 
      }];
      await AsyncStorage.setItem('parentContacts', JSON.stringify(updatedContacts));
      setParentContacts(updatedContacts);
      setModalVisible(false);
      setNewContact({ name: '', number: '' });
      Alert.alert('Success', 'Emergency contact added successfully');
    } catch (error) {
      console.error('Error saving parent contact:', error);
      Alert.alert('Error', 'Failed to save contact');
    }
  };

  const deleteParentContact = async (contactId) => {
    try {
      const updatedContacts = parentContacts.filter(contact => contact.id !== contactId);
      await AsyncStorage.setItem('parentContacts', JSON.stringify(updatedContacts));
      setParentContacts(updatedContacts);
      Alert.alert('Success', 'Contact removed successfully');
    } catch (error) {
      console.error('Error deleting parent contact:', error);
      Alert.alert('Error', 'Failed to remove contact');
    }
  };

  const emergencyContacts = [
    { id: '1', name: 'Police', number: '+919638453973', icon: 'police-badge' },
    { id: '2', name: 'Ambulance', number: '102', icon: 'ambulance' },
    { id: '3', name: 'Fire', number: '101', icon: 'fire-truck' },
    { id: '4', name: 'National Emergency', number: '112', icon: 'alert-circle' },
    { id: '5', name: 'Child Helpline', number: '1098', icon: 'human-baby-changing-table' },
  ];

  const womensHelplines = [
    { id: '1', name: 'Women Helpline (National)', number: '1091', icon: 'human-female' },
    { id: '2', name: 'Domestic Violence Helpline', number: '181', icon: 'home-alert' },
    { id: '3', name: 'Childline (For girls under 18)', number: '1098', icon: 'human-female-girl' },
    { id: '4', name: 'Mental Health Helpline', number: '1860-266-2345', icon: 'brain' },
    { id: '5', name: 'Mental Health WhatsApp', number: '+91 9999 666 555', icon: 'whatsapp' },
    { id: '6', name: 'Arogyavani Health Helpline', number: '104', icon: 'medical-bag' },
    { id: '7', name: 'Cyber Crime Helpline', number: '1930', icon: 'shield-lock' },
    { id: '8', name: 'Legal Aid Helpline (NALSA)', number: '15100', icon: 'scale-balance' },
  ];

  const quickActions = [
    {
      id: '1',
      title: 'Share Location',
      icon: 'map-marker-radius',
      color: '#4F46E5',
      action: () => handleShareLocation(),
    },
    {
      id: '2',
      title: 'Record Audio',
      icon: 'record-circle',
      color: '#EF4444',
      action: () => handleRecordAudio(),
    },
    {
      id: '3',
      title: 'Emergency SMS',
      icon: 'message-alert',
      color: '#F59E0B',
      action: () => handleEmergencySMS(),
    },
    {
      id: '4',
      title: 'Emergency Contacts',
      icon: 'contacts',
      color: '#10B981',
      action: () => setExpandedSection('contacts'),
    },
  ];

  const safetyTips = [
    {
      id: '1',
      title: 'Stay Calm',
      description: 'Take deep breaths and try to remain calm in emergency situations.',
      icon: 'heart-pulse',
    },
    {
      id: '2',
      title: 'Seek Safe Location',
      description: 'Move to a safe place if you feel threatened or unsafe.',
      icon: 'shield-home',
    },
    {
      id: '3',
      title: 'Alert Authorities',
      description: 'Contact emergency services immediately if needed.',
      icon: 'phone-alert',
    },
    {
      id: '4',
      title: 'Share Location',
      description: 'Share your location with trusted contacts.',
      icon: 'map-marker-alert',
    },
  ];

  const handleCall = (number) => {
    const phoneNumber = Platform.select({ ios: `telprompt:${number}`, android: `tel:${number}` });
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

// Share Location
const handleShareLocation = async () => {
  

  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow location access to send SOS.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Get all emergency numbers to notify
    const numbersToNotify = [
      ...parentContacts.map(contact => contact.number),
      emergencyContacts[0].number // Police number as backup
    ];

    try {
      // Send location  to all numbers
      const promises = numbersToNotify.map(phoneNumber =>
        axios.post("http://192.168.182.63:3000/send-location", {
          phoneNumber,
          latitude,
          longitude,
        })
      );

      await Promise.all(promises);
      Alert.alert("✅ Location Sent", "Emergency alerts sent to all emergency contacts");

    } catch (networkError) {
      console.error('Network Error:', networkError);
      Alert.alert(
        "Unable to Send SOS",
        "Server is unreachable. Would you like to:",
        [
          {
            text: "Call Emergency Contact",
            onPress: () => {
              if (parentContacts.length > 0) {
                handleCall(parentContacts[0].number);
              } else {
                handleCall(emergencyContacts[0].number);
              }
            },
            style: "default"
          },
          {
            text: "Share Location",
            onPress: () => {
              const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
              Linking.openURL(mapsUrl);
            }
          },
          { text: "Cancel", style: "cancel" }
        ]
      );
    }

  } catch (error) {
    console.error('Location Error:', error);
    Alert.alert(
      "❌ Error",
      "Could not get your location. Please try calling emergency services directly.",
      [
        {
          text: "Call Emergency",
          onPress: () => {
            if (parentContacts.length > 0) {
              handleCall(parentContacts[0].number);
            } else {
              handleCall(emergencyContacts[0].number);
            }
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  } finally {
    
  }
};

 const sendSos = async () => {
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access to send SOS.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Get all emergency numbers to notify
      const numbersToNotify = [
        ...parentContacts.map(contact => contact.number),
        emergencyContacts[0].number // Police number as backup
      ];

      try {
        // Send SOS Alert to all numbers
        const promises = numbersToNotify.map(phoneNumber =>
          axios.post("http://192.168.182.63:3000/send-sos", {
            phoneNumber,
            latitude,
            longitude,
          })
        );

        await Promise.all(promises);
        Alert.alert("✅ SOS Sent", "Emergency alerts sent to all emergency contacts");

      } catch (networkError) {
        console.error('Network Error:', networkError);
        Alert.alert(
          "Unable to Send SOS",
          "Server is unreachable. Would you like to:",
          [
            {
              text: "Call Emergency Contact",
              onPress: () => {
                if (parentContacts.length > 0) {
                  handleCall(parentContacts[0].number);
                } else {
                  handleCall(emergencyContacts[0].number);
                }
              },
              style: "default"
            },
            {
              text: "Share Location",
              onPress: () => {
                const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                Linking.openURL(mapsUrl);
              }
            },
            { text: "Cancel", style: "cancel" }
          ]
        );
      }

    } catch (error) {
      console.error('Location Error:', error);
      Alert.alert(
        "❌ Error",
        "Could not get your location. Please try calling emergency services directly.",
        [
          {
            text: "Call Emergency",
            onPress: () => {
              if (parentContacts.length > 0) {
                handleCall(parentContacts[0].number);
              } else {
                handleCall(emergencyContacts[0].number);
              }
            }
          },
          { text: "Cancel", style: "cancel" }
        ]
      );
    } finally {
      setLoading(false);
    }
  };


  const handleRecordAudio = () => {
    Alert.alert(
      'Record Audio',
      'This will start recording audio for emergency purposes',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Recording', onPress: () => console.log('Start recording') },
      ]
    );
  };

  const handleEmergencySMS = () => {
    Alert.alert(
      'Emergency SMS',
      'This will send an emergency SMS to your contacts',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send', onPress: () => console.log('Send emergency SMS') },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar
        backgroundColor={semantic.background.paper}
        barStyle="dark-content"
      />
      
      {/* Add Contact Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Emergency Contact</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Contact Name"
              value={newContact.name}
              onChangeText={(text) => setNewContact(prev => ({ ...prev, name: text }))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone Number (with country code)"
              value={newContact.number}
              onChangeText={(text) => setNewContact(prev => ({ ...prev, number: text }))}
              keyboardType="phone-pad"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveParentContact}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency Assistance</Text>
        <Text style={styles.headerSubtitle}>Get immediate help in emergency situations</Text>
      </View>

      {/* SOS Button */}
      <TouchableOpacity
        style={styles.sosButton}
        onPress={sendSos}
        disabled={loading}>
        <View style={styles.sosInner}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <>
              <Icon name="phone-alert" size={40} color="#FFFFFF" />
              <Text style={styles.sosText}>SOS</Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {/* Parent Emergency Contacts Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Parent Emergency Contacts</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="plus" size={24} color={colors.primary.main} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contactsContainer}>
          {parentContacts.length === 0 ? (
            <Text style={styles.noContactsText}>
              No parent contacts added. Add contacts to notify in case of emergency.
            </Text>
          ) : (
            parentContacts.map((contact) => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.contactIcon}>
                  <Icon name="account-heart" size={24} color="#4F46E5" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleCall(contact.number)}
                  style={styles.callButton}
                >
                  <Icon name="phone" size={20} color="#4F46E5" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Remove Contact',
                      `Are you sure you want to remove ${contact.name}?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Remove', onPress: () => deleteParentContact(contact.id), style: 'destructive' }
                      ]
                    );
                  }}
                  style={styles.deleteButton}
                >
                  <Icon name="delete" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionButton, { backgroundColor: action.color }]}
              onPress={action.action}>
              <Icon name={action.icon} size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <View style={styles.contactsContainer}>
          {emergencyContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactCard}
              onPress={() => handleCall(contact.number)}>
              <View style={styles.contactIcon}>
                <Icon name={contact.icon} size={24} color="#4F46E5" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </View>
              <Icon name="phone" size={20} color="#4F46E5" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Women's Helplines */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Women's Helplines</Text>
        <View style={styles.contactsContainer}>
          {womensHelplines.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={[styles.contactCard, styles.womensHelplineCard]}
              onPress={() => handleCall(contact.number)}>
              <View style={[styles.contactIcon, styles.womensHelplineIcon]}>
                <Icon name={contact.icon} size={24} color="#D946EF" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </View>
              <Icon name="phone" size={20} color="#D946EF" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Safety Tips */}
      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionTitle}>Safety Tips</Text>
        <View style={styles.tipsContainer}>
          {safetyTips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Icon name={tip.icon} size={24} color="#4F46E5" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background.default,
  },
  header: {
    padding: 20,
    backgroundColor: semantic.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: semantic.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: semantic.text.secondary,
  },
  sosButton: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  sosInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.status.error,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
    shadowColor: colors.common.white,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
  },
  sosText: {
    color: semantic.text.inverse,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  section: {
    padding: 20,
    backgroundColor: semantic.background.paper,
    marginBottom: 12,
  },
  lastSection: {
    marginBottom: 100, // Extra padding for bottom navigation
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semantic.text.primary,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -6,
  },
  actionButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    ...shadows.sm,
  },
  actionText: {
    color: semantic.text.inverse,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  contactsContainer: {
    marginTop: 8,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: semantic.background.paper,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: semantic.border.light,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: semantic.text.primary,
  },
  contactNumber: {
    fontSize: 14,
    color: semantic.text.secondary,
    marginTop: 2,
  },
  tipsContainer: {
    marginTop: 8,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: semantic.background.paper,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: semantic.border.light,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semantic.text.primary,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: semantic.text.secondary,
    lineHeight: 20,
  },
  womensHelplineCard: {
    borderColor: '#D946EF20',
    borderWidth: 1,
    backgroundColor: '#FCF5FF',
  },
  womensHelplineIcon: {
    backgroundColor: '#F5D0FE',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.primary.light,
  },
  noContactsText: {
    textAlign: 'center',
    color: semantic.text.secondary,
    fontSize: 14,
    paddingVertical: 16,
  },
  callButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    ...shadows.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: semantic.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: semantic.border.light,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: semantic.background.paper,
    borderWidth: 1,
    borderColor: semantic.border.light,
  },
  saveButton: {
    backgroundColor: colors.primary.main,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmergencyScreen; 