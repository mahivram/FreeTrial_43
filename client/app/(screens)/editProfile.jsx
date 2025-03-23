import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, semantic } from '../theme/colors';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mo_user: '',
    profilePic: null
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mo_user: ''
  });

  useEffect(() => {
    fetchUserProfile();
    requestMediaLibraryPermission();
  }, []);

  const requestMediaLibraryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to upload images.');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        setProfilePic({
          uri: selectedAsset.uri,
          type: 'image/jpeg',
          name: 'profile-picture.jpg'
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      
      const response = await axios.get('https://07ab-14-139-122-82.ngrok-free.app/api/user/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          mo_user: response.data.mo_user || '',
          profilePic: response.data.profilePic || null
        });
        if (response.data.profilePic) {
          setProfilePic({ uri: response.data.profilePic });
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      mo_user: ''
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    // Mobile number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.mo_user.trim()) {
      newErrors.mo_user = 'Mobile number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.mo_user)) {
      newErrors.mo_user = 'Invalid mobile number (10 digits required)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('authToken');
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mo_user', formData.mo_user);

      if (profilePic && profilePic.uri !== formData.profilePic) {
        formDataToSend.append('profilePic', {
          uri: profilePic.uri,
          type: profilePic.type || 'image/jpeg',
          name: profilePic.name || 'profile-picture.jpg'
        });
      }

      const response = await axios.put(
        'https://07ab-14-139-122-82.ngrok-free.app/api/user/update',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data) {
        Alert.alert('Success', 'Profile updated successfully');
        router.back();
      }
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <Icon name="arrow-left" size={24} color={semantic.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <View style={styles.profilePicSection}>
          <TouchableOpacity onPress={pickImage} style={styles.profilePicContainer}>
            {profilePic ? (
              <Image source={{ uri: profilePic.uri }} style={styles.profilePic} />
            ) : (
              <View style={styles.profilePicPlaceholder}>
                <Icon name="account" size={40} color="#9CA3AF" />
              </View>
            )}
            <View style={styles.editIconContainer}>
              <Icon name="camera" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, name: text }));
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, email: text }));
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          {/* Mobile Number Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={[styles.input, errors.mo_user && styles.inputError]}
              value={formData.mo_user}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, mo_user: text }));
                if (errors.mo_user) setErrors(prev => ({ ...prev, mo_user: '' }));
              }}
              placeholder="Enter your mobile number"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={10}
            />
            {errors.mo_user ? <Text style={styles.errorText}>{errors.mo_user}</Text> : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: semantic.text.primary,
  },
  saveButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: semantic.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: semantic.text.primary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 4,
  },
  profilePicSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profilePicContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'relative',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profilePicPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary.main,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  changePhotoText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.primary.main,
    fontWeight: '600',
  }
});

export default EditProfileScreen; 