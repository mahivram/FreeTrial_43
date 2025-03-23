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
import { Link, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors, semantic } from '../theme/colors';
import { generateResponse } from '../services/gemini';

const SaheliAi = () => {
  const { budgetData } = useLocalSearchParams();
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

  useEffect(() => {
    if (budgetData) {
      handleBudgetDataReceived();
    }
  }, [budgetData]);

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

  const createInitialMessage = (data) => {
    const { income, expenses, totalExpenses, financialGoals } = data;
    const monthlyBalance = income.totalIncome - totalExpenses;
    
    return `Please analyze my financial situation and provide suggestions, keeping in mind women's empowerment, safety, health, and home management:
    
Monthly Income: ₹${income.totalIncome.toLocaleString()}
Total Expenses: ₹${totalExpenses.toLocaleString()}
Monthly Balance: ₹${monthlyBalance.toLocaleString()}

Expense Breakdown:
- Essential: ${expenses.essential.map(e => `${e.category}: ₹${e.amount}`).join(', ')}
- Non-Essential: ${expenses.nonEssential.map(e => `${e.category}: ₹${e.amount}`).join(', ')}
- Savings: ${expenses.savings.map(e => `${e.category}: ₹${e.amount}`).join(', ')}
- Debts: ${expenses.debts.map(e => `${e.category}: ₹${e.amount} (${e.interest_rate}% interest)`).join(', ')}

Financial Goals:
${financialGoals.map(g => `- ${g.title}: ₹${g.current.toLocaleString()} / ₹${g.target.toLocaleString()}`).join('\n')}

Please provide detailed suggestions for:
1. Budget optimization and household expense management
2. Debt management strategy
3. Savings recommendations for women's financial independence
4. Investment opportunities suitable for women
5. Steps to achieve financial goals
6. Home-based income opportunities and skill development
7. Tips for balancing household management with financial growth
8. Resources for women's financial education and empowerment
9. Women's health and wellness recommendations
10. Self-defense tips and safety measures
11. Emergency preparedness and response
12. Mental health and stress management
13. Work-life balance strategies
14. Community support and networking opportunities`;
  };

  const cleanAndFormatResponse = (response) => {
    // First clean any existing bold tags and asterisks
    let cleanedResponse = response
      .replace(/<bold>|<\/bold>/g, '') // Remove any existing bold tags
      .replace(/\*+/g, ''); // Remove asterisks
    
    // Add a context reminder if the response seems off-topic
    if (!cleanedResponse.toLowerCase().includes('financ') && 
        !cleanedResponse.toLowerCase().includes('budget') && 
        !cleanedResponse.toLowerCase().includes('money') &&
        !cleanedResponse.toLowerCase().includes('saving') &&
        !cleanedResponse.toLowerCase().includes('household') &&
        !cleanedResponse.toLowerCase().includes('skill') &&
        !cleanedResponse.toLowerCase().includes('health') &&
        !cleanedResponse.toLowerCase().includes('safety')) {
      cleanedResponse = "Let me focus on your overall wellbeing and development:\n\n" + cleanedResponse;
    }
    
    // Add women-specific context if missing
    if (!cleanedResponse.toLowerCase().includes('women') &&
        !cleanedResponse.toLowerCase().includes('home') &&
        !cleanedResponse.toLowerCase().includes('household')) {
      cleanedResponse += "\n\nImportant tips for women's wellbeing:\n" +
        "• Consider home-based business opportunities\n" +
        "• Explore skill development programs\n" +
        "• Join women's support communities\n" +
        "• Learn self-defense techniques\n" +
        "• Maintain emergency contacts and safety measures\n" +
        "• Focus on physical and mental health\n" +
        "• Balance personal and professional growth";
    }

    // Apply formatting with proper escaping
    const formattedResponse = cleanedResponse
      // Format headings and labels
      .replace(/([A-Z][A-Za-z\s]+:)/g, '<bold>$1</bold>')
      // Format currency amounts
      .replace(/(₹[\d,]+)/g, '<bold>$1</bold>')
      // Format percentages
      .replace(/(\d+%)/g, '<bold>$1</bold>')
      // Format bullet points with labels
      .replace(/(•[\s]*[^:\n]+:)/g, '<bold>$1</bold>')
      // Format common section headers
      .replace(/((?:Recommendation|Key takeaway|Action item|Important|Note|Summary|Strategy|Skills|Home Management|Empowerment|Safety Tips|Health|Emergency|Self-Defense|Mental Health|Wellness)s?:)/g, '<bold>$1</bold>');

    // Clean up any double-wrapped bold tags
    return formattedResponse
      .replace(/<bold><bold>/g, '<bold>')
      .replace(/<\/bold><\/bold>/g, '</bold>')
      .replace(/<bold>\s*<\/bold>/g, ''); // Remove empty bold tags
  };

  const handleInitialBudgetAnalysis = async (message) => {
    const newMessages = [{ text: message, isUser: true, timestamp: new Date().toISOString() }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      let response = await generateResponse(message);
      response = cleanAndFormatResponse(response);

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
        text: `<bold>Error:</bold> I apologize, but I encountered an error: ${error.message}. Please try again.`, 
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

  const handleBudgetDataReceived = async () => {
    const newChat = {
      id: Date.now().toString(),
      name: 'Budget Analysis',
      timestamp: new Date().toISOString(),
    };
    
    try {
      const updatedChatList = [...chatList, newChat];
      await AsyncStorage.setItem('chatList', JSON.stringify(updatedChatList));
      setChatList(updatedChatList);
      setActiveChatId(newChat.id);
      
      const thinkingMessage = {
        text: "🤔 Analyzing your overall wellbeing...\n\n" +
              "• Calculating budget ratios\n" +
              "• Evaluating expense patterns\n" +
              "• Assessing debt obligations\n" +
              "• Reviewing savings goals\n" +
              "• Analyzing household expenses\n" +
              "• Identifying skill development opportunities\n" +
              "• Finding women-focused financial solutions\n" +
              "• Checking health and wellness aspects\n" +
              "• Reviewing safety measures\n" +
              "• Assessing emergency preparedness\n" +
              "• Evaluating work-life balance\n" +
              "• Preparing personalized recommendations",
        isUser: false,
        isThinking: true,
        timestamp: new Date().toISOString()
      };
      setMessages([thinkingMessage]);
      
      const parsedData = JSON.parse(budgetData);
      const initialMessage = createInitialMessage(parsedData);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      handleInitialBudgetAnalysis(initialMessage);
    } catch (error) {
      console.error('Error handling budget data:', error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading || !activeChatId) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    const contextMessages = messages.slice(-4);
    const conversationContext = contextMessages.map(msg => 
      `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`
    ).join('\n');
    
    const messageWithContext = `Previous conversation:\n${conversationContext}\n\n` +
      `User: ${userMessage}\n\n` +
      `Please provide a relevant response based on this context, focusing on:\n` +
      `1. Financial advice and planning\n` +
      `2. Women's empowerment and independence\n` +
      `3. Home management and skill development\n` +
      `4. Health and wellness guidance\n` +
      `5. Safety and self-defense tips\n` +
      `6. Emergency preparedness\n` +
      `7. Mental health and stress management\n` +
      `8. Practical, actionable suggestions`;

    const newMessages = [...messages, { text: userMessage, isUser: true, timestamp: new Date().toISOString() }];
    setMessages(newMessages);
    await saveChatHistory(newMessages);
    setIsLoading(true);

    try {
      let response = await generateResponse(messageWithContext);
      response = cleanAndFormatResponse(response);

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
        text: `<bold>Error:</bold> I apologize, but I encountered an error: ${error.message}. Please try again.`, 
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

  const renderMessage = (text, isThinking = false) => {
    if (isThinking) {
      return (
        <View style={styles.thinkingContainer}>
          <ActivityIndicator color={colors.primary.main} style={styles.thinkingIndicator} />
          {text.split('\n').map((line, index) => (
            <Text
              key={index}
              style={[
                styles.messageText,
                styles.thinkingText,
                line.startsWith('•') && styles.bulletPoint
              ]}>
              {line}
            </Text>
          ))}
        </View>
      );
    }

    // Split by bold tags and handle empty parts
    const parts = text.split(/(<bold>.*?<\/bold>)/g).filter(part => part.trim());
    return parts.map((part, index) => {
      if (part.startsWith('<bold>') && part.endsWith('</bold>')) {
        // Extract content between bold tags
        const content = part.slice(6, -7).trim();
        return content ? (
          <Text key={index} style={[styles.messageText, styles.boldText]}>
            {content}
          </Text>
        ) : null;
      }
      return part.trim() ? <Text key={index} style={styles.messageText}>{part}</Text> : null;
    });
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
                message.isThinking && styles.thinkingMessage,
              ]}>
              <View
                style={[
                  styles.messageTextContainer,
                  message.isUser ? styles.userMessageText : styles.aiMessageText,
                  message.isError && styles.errorMessageText,
                ]}>
                {renderMessage(message.text, message.isThinking)}
              </View>
            </View>
          </View>
        ))}
        {isLoading && !messages.some(m => m.isThinking) && (
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
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: "#E6E6FA",
    borderBottomRightRadius: 8,
  },
  aiMessage: {
    backgroundColor: '#F8F9FA',
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  errorMessage: {
    backgroundColor: '#FEE2E2',
  },
  messageTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2D3748',
  },
  userMessageText: {
    color: '#1A202C',
  },
  aiMessageText: {
    color: '#2D3748',
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
  boldText: {
    fontWeight: '700',
    color: '#1A202C',
  },
  thinkingContainer: {
    alignItems: 'flex-start',
  },
  thinkingIndicator: {
    marginBottom: 8,
  },
  thinkingMessage: {
    backgroundColor: `${colors.primary.main}10`,
  },
  thinkingText: {
    color: semantic.text.primary,
    marginVertical: 2,
  },
  bulletPoint: {
    marginLeft: 8,
  },
});

export default SaheliAi;