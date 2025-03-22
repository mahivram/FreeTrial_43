import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Platform,
  Keyboard,
  Modal,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Link } from 'expo-router';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors, semantic } from '../theme/colors';
import { generateResponse } from '../services/gemini';

const SaheliAi = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [chatList, setChatList] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isChatsModalVisible, setIsChatsModalVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    loadChatList();
  }, []);

  useEffect(() => {
    if (activeChatId) {
      loadChatHistory(activeChatId);
    }
  }, [activeChatId]);

  const loadChatList = async () => {
    try {
      const savedChatList = await AsyncStorage.getItem('chatList');
      if (savedChatList) {
        const chats = JSON.parse(savedChatList);
        setChatList(chats);
        if (chats.length > 0 && !activeChatId) {
          setActiveChatId(chats[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading chat list:', error);
    }
  };

  const createNewChat = async () => {
    const newChat = {
      id: Date.now().toString(),
      name: `Chat ${chatList.length + 1}`,
      timestamp: new Date().toISOString(),
    };
    
    const updatedChatList = [...chatList, newChat];
    try {
      await AsyncStorage.setItem('chatList', JSON.stringify(updatedChatList));
      setChatList(updatedChatList);
      setActiveChatId(newChat.id);
      setMessages([]);
      setIsChatsModalVisible(false);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const loadChatHistory = async (chatId) => {
    try {
      const savedMessages = await AsyncStorage.getItem(`chat_${chatId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
        scrollToBottom();
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async (newMessages) => {
    if (!activeChatId) return;
    try {
      await AsyncStorage.setItem(`chat_${activeChatId}`, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const updatedChatList = chatList.filter(chat => chat.id !== chatId);
      await AsyncStorage.setItem('chatList', JSON.stringify(updatedChatList));
      await AsyncStorage.removeItem(`chat_${chatId}`);
      setChatList(updatedChatList);
      
      if (chatId === activeChatId) {
        if (updatedChatList.length > 0) {
          setActiveChatId(updatedChatList[0].id);
        } else {
          setActiveChatId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading || !activeChatId) return;

    const userMessage = inputText.trim();
    setInputText('');
    const newMessages = [...messages, { text: userMessage, isUser: true, timestamp: new Date().toISOString() }];
    setMessages(newMessages);
    await saveChatHistory(newMessages);
    setIsLoading(true);

    try {
      const response = await generateResponse(userMessage);
      const updatedMessages = [...newMessages, { 
        text: response, 
        isUser: false, 
        timestamp: new Date().toISOString() 
      }];
      setMessages(updatedMessages);
      await saveChatHistory(updatedMessages);
      scrollToBottom();
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessages = [...newMessages, { 
        text: `I apologize, but I encountered an error: ${error.message}. Please try again.`, 
        isUser: false,
        isError: true,
        timestamp: new Date().toISOString()
      }];
      setMessages(errorMessages);
      await saveChatHistory(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        activeChatId === item.id && styles.activeChatItem
      ]}
      onPress={() => {
        setActiveChatId(item.id);
        setIsChatsModalVisible(false);
      }}>
      <Text style={styles.chatItemText}>{item.name}</Text>
      <TouchableOpacity
        style={styles.deleteChatButton}
        onPress={() => deleteChat(item.id)}>
        <Icon name="delete-outline" size={20} color={semantic.text.secondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={semantic.text.primary} />
          </TouchableOpacity>
        </Link>
        <TouchableOpacity 
          style={styles.chatSelector}
          onPress={() => setIsChatsModalVisible(true)}>
          <Text style={styles.headerTitle}>
            {chatList.find(chat => chat.id === activeChatId)?.name || 'Saheli AI'}
          </Text>
          <Icon name="chevron-down" size={24} color={semantic.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={createNewChat} style={styles.newChatButton}>
          <Icon name="plus" size={24} color={semantic.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Chat List Modal */}
      <Modal
        visible={isChatsModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsChatsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Chats</Text>
              <TouchableOpacity
                onPress={() => setIsChatsModalVisible(false)}
                style={styles.modalCloseButton}>
                <Icon name="close" size={24} color={semantic.text.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={chatList}
              renderItem={renderChatItem}
              keyExtractor={item => item.id}
              style={styles.chatList}
            />
            <TouchableOpacity
              style={styles.newChatButtonLarge}
              onPress={createNewChat}>
              <Icon name="plus" size={24} color={colors.primary.main} />
              <Text style={styles.newChatButtonText}>New Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Chat Messages */}
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled">
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageWrapper,
              message.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper,
            ]}>
            <View
              style={[
                styles.message,
                message.isUser ? styles.userMessage : styles.aiMessage,
                message.isError && styles.errorMessage,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  message.isUser ? styles.userMessageText : styles.aiMessageText,
                  message.isError && styles.errorMessageText,
                ]}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary.main} />
          </View>
        )}
      </KeyboardAwareScrollView>

      {/* Input Section */}
      <View style={[styles.inputContainer, { marginBottom: Platform.OS === 'ios' ? keyboardHeight : 0 }]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor={semantic.text.secondary}
          multiline
          maxLength={500}
          returnKeyType="send"
          blurOnSubmit={false}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}>
          <Icon
            name="send"
            size={24}
            color={inputText.trim() ? colors.primary.main : semantic.text.disabled}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: semantic.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: semantic.text.primary,
  },
  headerRight: {
    width: 40,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageWrapper: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: colors.primary.main,
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: semantic.background.paper,
    borderBottomLeftRadius: 4,
  },
  errorMessage: {
    backgroundColor: '#FEE2E2',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: semantic.text.primary,
  },
  errorMessageText: {
    color: '#DC2626',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: semantic.background.paper,
    borderTopWidth: 1,
    borderTopColor: semantic.border.light,
  },
  input: {
    flex: 1,
    marginRight: 12,
    padding: 12,
    backgroundColor: semantic.background.default,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: semantic.border.light,
    color: semantic.text.primary,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  clearButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: semantic.background.paper,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: semantic.text.primary,
  },
  modalCloseButton: {
    padding: 8,
  },
  chatList: {
    maxHeight: '70%',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: semantic.background.default,
  },
  activeChatItem: {
    backgroundColor: `${colors.primary.main}20`,
  },
  chatItemText: {
    flex: 1,
    fontSize: 16,
    color: semantic.text.primary,
  },
  deleteChatButton: {
    padding: 8,
  },
  chatSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  newChatButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChatButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: `${colors.primary.main}10`,
    borderRadius: 8,
    marginTop: 16,
  },
  newChatButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.main,
  },
});

export default SaheliAi;