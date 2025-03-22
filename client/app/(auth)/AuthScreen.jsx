import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SkillsScreen from '../(screens)/SkillsScreen';
import { colors, shadows, semantic, components } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with default config

const api = axios.create({
  baseURL: 'https://myapp.loca.lt/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const AuthScreen = () => {
  const { signIn } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [showSkillsScreen, setShowSkillsScreen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [registrationResponse, setRegistrationResponse] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!isLogin) {
      // Handle registration
      if (
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.name
      ) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      setIsLoading(true);
      try {
        // Make registration request
        const registrationData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
        };

        console.log('Registering with data:', registrationData);

        const response = await api.post('/user/createUser', registrationData);

       

        if (response.data && response.data.jsonToken) {
          await AsyncStorage.setItem('authToken', response.data.jsonToken);
          // Store the registration response and show skills screen
          setRegistrationResponse(response.data);
          setShowSkillsScreen(true);
        } else {
          throw new Error('Invalid response from server: No token received');
        }
      } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        let errorMessage = 'Failed to register';
        
        if (error.response) {
          switch (error.response.status) {
            case 400:
              errorMessage = error.response.data?.message || 'Invalid registration data';
              break;
            case 409:
              errorMessage = 'Email already exists';
              break;
            case 500:
              errorMessage = 'Server error, please try again later';
              break;
            default:
              errorMessage = error.response.data?.message || 'An error occurred during registration';
          }
        } else if (error.request) {
          errorMessage = 'No response from server. Please check your internet connection.';
        }
        
        Alert.alert('Error', errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle login
      if (!formData.email || !formData.password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      
      setIsLoading(true);
      try {
        // Make login request
        const response = await api.post('/user/loginUser', {
          email: formData.email.trim(),
          password: formData.password.trim()
        });

        // Check if we have a successful response with token
        if (response?.data?.jsonToken) {
          console.log('Login successful:', response.data);
          // Store the token
          await AsyncStorage.setItem('authToken', response.data.jsonToken);
          // Sign in with the received auth data
          await signIn({
            jsonToken: response.data.jsonToken,
            user_email: response.data.email || formData.email,
            user_name: response.data.name || formData.name,
            ...response.data
          });
        } else {
          console.error('Invalid server response:', response);
          throw new Error('Invalid response from server: No token received');
        }
      } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Failed to sign in';
        
        if (error.response) {
          console.error('Server error response:', error.response.data);
          switch (error.response.status) {
            case 401:
              errorMessage = 'Invalid email or password';
              break;
            case 404:
              errorMessage = 'User not found';
              break;
            case 500:
              errorMessage = 'Server error, please try again later';
              break;
            default:
              errorMessage = error.response.data?.message || 'An error occurred during sign in';
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
          errorMessage = 'No response from server. Please check your internet connection.';
        } else {
          console.error('Error details:', error);
          errorMessage = error.message || 'An unexpected error occurred';
        }
        
        Alert.alert('Error', errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSkillsComplete = async (skills) => {
    try {
      // Use the stored registration response
      if (registrationResponse && registrationResponse.jsonToken) {
        await signIn({
          jsonToken: registrationResponse.jsonToken,
          user_email: registrationResponse.email || formData.email,
          user_name: registrationResponse.name || formData.name,
          skills: skills,
          ...registrationResponse
        });
      } else {
        throw new Error('Registration data not found');
      }
    } catch (error) {
      console.error('Skills completion error:', error);
      Alert.alert(
        'Error',
        'Failed to complete registration with skills. Please try again.'
      );
    }
  };

  const handleSkillsSkip = async () => {
    try {
      // Use the stored registration response
      if (registrationResponse && registrationResponse.jsonToken) {
        await signIn({
          jsonToken: registrationResponse.jsonToken,
          user_email: registrationResponse.email || formData.email,
          user_name: registrationResponse.name || formData.name,
          skills: [],
          ...registrationResponse
        });
      } else {
        throw new Error('Registration data not found');
      }
    } catch (error) {
      console.error('Skills skip error:', error);
      Alert.alert(
        'Error',
        'Failed to complete registration. Please try again.'
      );
    }
  };

  if (showSkillsScreen) {
    return <SkillsScreen onComplete={handleSkillsComplete} onSkip={handleSkillsSkip} />;
  }

  const renderInput = (
    placeholder,
    value,
    onChangeText,
    icon,
    isPassword = false,
    showPasswordState = false,
    setShowPasswordState = null,
    keyboardType = 'default',
  ) => (
    <View style={styles.inputContainer}>
      <Icon name={icon} size={20} color={semantic.text.secondary} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !showPasswordState}
        autoCapitalize={placeholder === 'Full Name' ? 'words' : 'none'}
        keyboardType={keyboardType}
        returnKeyType={placeholder === 'Confirm Password' || placeholder === 'Password' && isLogin ? 'done' : 'next'}
        blurOnSubmit={placeholder === 'Confirm Password' || placeholder === 'Password' && isLogin}
        onSubmitEditing={() => {
          if (placeholder === 'Confirm Password' || (placeholder === 'Password' && isLogin)) {
            handleSubmit();
          }
        }}
      />
      {isPassword && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPasswordState(!showPasswordState)}>
          <Icon
            name={showPasswordState ? 'eye-off' : 'eye'}
            size={20}
            color={semantic.text.secondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
        <StatusBar
          backgroundColor={semantic.background.paper}
          barStyle="dark-content"
        />
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <Icon
              name={isLogin ? 'login-variant' : 'account-plus'}
              size={80}
              color={colors.primary.main}
              style={styles.headerIcon}
            />
            <Text style={styles.title}>
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Sign in to continue'
                : 'Sign up to start your journey'}
            </Text>

            {!isLogin && (
              renderInput(
                'Full Name',
                formData.name,
                (text) => setFormData({ ...formData, name: text }),
                'account',
              )
            )}

            {renderInput(
              'Email',
              formData.email,
              (text) => setFormData({ ...formData, email: text }),
              'email',
              false,
              false,
              null,
              'email-address'
            )}

            {renderInput(
              'Password',
              formData.password,
              (text) => setFormData({ ...formData, password: text }),
              'lock',
              true,
              showPassword,
              setShowPassword,
            )}

            {!isLogin &&
              renderInput(
                'Confirm Password',
                formData.confirmPassword,
                (text) => setFormData({ ...formData, confirmPassword: text }),
                'lock-check',
                true,
                showConfirmPassword,
                setShowConfirmPassword,
              )}

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: components.button.primary.background },
                isLoading && styles.buttonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color={components.button.primary.text} />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => {
                setIsLogin(!isLogin);
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  name: '',
                });
              }}>
              <Text style={[styles.switchText, { color: colors.primary.main }]}>
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background.paper,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  formContainer: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    alignSelf: 'center',
    marginBottom: 20,
    color: colors.primary.main,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: semantic.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: semantic.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: components.input.background,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: semantic.border.light,
  },
  inputIcon: {
    marginRight: 10,
    color: semantic.text.secondary,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: semantic.text.primary,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: components.button.primary.background,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    ...shadows.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: components.button.primary.text,
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: colors.primary.main,
    fontSize: 16,
  },
});

export default AuthScreen; 