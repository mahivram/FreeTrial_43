import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  StatusBar,
  Alert,
  Modal as RNModal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, shadows, semantic, components } from '../theme/colors';
import { storeAuthToken, isAuthenticated } from '../services/auth';
import {io} from 'socket.io-client';
import {
  createCommunityPost,
  getCommunityPosts,
  getPostsByHeading,
  addComment,
  likePost,
  deletePost,
} from '../services/community';

const SOCKET_URL = "https://myapp.loca.lt";
const socket = io(SOCKET_URL);


const CommunityScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newPost, setNewPost] = useState({
    heading: '',
    heading_name: '',
    description: '',
    labels: [],
  });

  // Add timeout ref
  const timeoutRef = React.useRef(null);

  // Clear timeout on unmount
  useEffect(() => {
    socket.connect(); // Connect when the component mounts

    socket.on("message", (data) => {
      console.log(data);
    });

    return () => {
      socket.disconnect(); // Cleanup on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const resetCreatePostState = () => {
    setIsLoading(false);
    setNewPost({
      heading: '',
      heading_name: '',
      description: '',
      labels: [],
    });
  };

  const handleModalClose = () => {
    if (isLoading) {
      Alert.alert(
        'Warning',
        'Are you sure you want to cancel the post creation?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
            style: 'destructive',
            onPress: () => {
              resetCreatePostState();
              setShowNewPostModal(false);
            },
          },
        ]
      );
    } else {
      resetCreatePostState();
      setShowNewPostModal(false);
    }
  };

  // Store JWT token and check authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Store the token
        // await storeAuthToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiam9obmRvZUBleGFtcGxlIiwibW9fdXNlciI6IjA5ODc2NTQzMjEiLCJfaWQiOiI2N2QzMTQxOTY3YjAzODFkODQwMDQ5NjAifSwiaWF0IjoxNzQyNjIzNjQyLCJleHAiOjE3NDI3MTAwNDJ9.uFDWveaUojPFCtyp3fLs2ZDteDS-PT-0jEiYf5mTpMw');
        
        // Verify authentication
        const isAuth = await isAuthenticated();
        if (!isAuth) {
          Alert.alert('Error', 'Authentication failed');
          navigation.navigate('Login'); // Navigate to login if not authenticated
          return;
        }

        // If authenticated, fetch posts
        fetchPosts();
      } catch (error) {
        console.error('Authentication error:', error);
        Alert.alert('Error', 'Failed to initialize authentication');
      }
    };

    initializeAuth();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      let response;
      if (activeTab === 'all') {
        response = await getCommunityPosts();
      } else {
        response = await getPostsByHeading(activeTab);
      }
      
      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }
      
      setPosts(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.heading_name.trim() || !newPost.description.trim() || !newPost.heading) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);

      // Set a timeout to prevent infinite loading
      timeoutRef.current = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          Alert.alert(
            'Error',
            'Request timed out. Please try again.'
          );
        }
      }, 15000); // 15 seconds timeout

      const response = await createCommunityPost(newPost);
      
      // Clear timeout as request completed
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }

      setShowNewPostModal(false);
      resetCreatePostState();
      fetchPosts(); // Refresh posts
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Create post error:', error);
      Alert.alert(
        'Error',
        'Failed to create post. Please check your connection and try again.'
      );
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await likePost(postId);
      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }
      fetchPosts(); // Refresh posts to update likes
    } catch (error) {
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleDeletePost = async (postId) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deletePost(postId);
              if (response.error) {
                Alert.alert('Error', response.error);
                return;
              }
              fetchPosts(); // Refresh posts
              Alert.alert('Success', 'Post deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ]
    );
  };

  // Mock data for categories
  const categories = [
    { id: '1', name: 'All', icon: 'view-grid' },
    { id: '2', name: 'Success Stories', icon: 'trophy' },
    { id: '3', name: 'Career', icon: 'briefcase' },
    { id: '4', name: 'Mental Health', icon: 'brain' },
    { id: '5', name: 'Relationships', icon: 'heart' },
    { id: '6', name: 'Safety', icon: 'shield-check' },
  ];

  const renderPost = ({ item }) => (
    <TouchableOpacity 
      style={styles.postCard}
      onPress={() => navigation.navigate('PostDetail', { post: item })}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <Image 
            source={{ uri: item.createdBy?.profilePic || 'https://picsum.photos/200' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.authorName}>{item.createdBy?.name || 'Anonymous'}</Text>
            <Text style={styles.timeAgo}>
              
              {new Date(item.createdAt).toLocaleDateString("en-GB")}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.categoryBadge}>
          <Icon 
            name={categories.find(c => c.name === item.heading)?.icon || 'tag'} 
            size={14} 
            color={colors.primary.main} 
            style={styles.categoryIcon}
          />
          <Text style={styles.categoryText}>{item.heading}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.postTitle}>{item.heading_name}</Text>
      <Text style={styles.postContent} numberOfLines={3}>
        {item.description}
      </Text>

      <View style={styles.tagsContainer}>
        {Array.isArray(item.labels) && item.labels.length > 0 ? (
          item.labels.map((label, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{label}</Text>
            </View>
          ))
        ) : null}
      </View>

      <View style={styles.postFooter}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => handleLikePost(item._id)}>
          <Icon 
            name={item.isLiked ? "heart" : "heart-outline"} 
            size={22} 
            color={item.isLiked ? colors.error.main : colors.primary.main} 
          />
          <Text style={styles.footerButtonText}>{item.likes?.length || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('PostDetail', { post: item })}>
          <Icon name="comment-outline" size={22} color={colors.primary.main} />
          <Text style={styles.footerButtonText}>{item.comments?.length || 0}</Text>
        </TouchableOpacity>
        {item.isAuthor && (
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={() => handleDeletePost(item._id)}>
            <Icon name="delete-outline" size={22} color={colors.error.main} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity 
          style={styles.newPostButton}
          onPress={() => setShowNewPostModal(true)}>
          <Icon name="plus" size={20} color={semantic.text.inverse} />
          <Text style={styles.newPostButtonText}>Share Story</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                activeTab === category.name.toLowerCase() && styles.activeCategoryChip,
              ]}>
              <Icon 
                name={category.icon} 
                size={20} 
                color={activeTab === category.name.toLowerCase() ? semantic.text.inverse : colors.primary.main} 
              />
              <Text
                style={[
                  styles.categoryChipText,
                  activeTab === category.name.toLowerCase() && styles.activeCategoryChipText,
                ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Stories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllButton}>See All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // New Post Modal
  const renderNewPostModal = () => (
    <RNModal
      visible={showNewPostModal}
      animationType="slide"
      transparent
      onRequestClose={handleModalClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Post</Text>
            <TouchableOpacity
              onPress={handleModalClose}
              style={styles.modalCloseButton}>
              <Icon name="close" size={24} color={semantic.text.primary} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Post Title"
            value={newPost.heading_name}
            onChangeText={(text) => setNewPost(prev => ({ ...prev, heading_name: text }))}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your story..."
            value={newPost.description}
            onChangeText={(text) => setNewPost(prev => ({ ...prev, description: text }))}
            multiline
            numberOfLines={4}
          />

          <View style={styles.categorySelector}>
            {categories.slice(1).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  newPost.heading === category.name && styles.activeCategoryChip,
                ]}
                onPress={() => setNewPost(prev => ({ ...prev, heading: category.name }))}>
                <Icon 
                  name={category.icon} 
                  size={20} 
                  color={newPost.heading === category.name ? semantic.text.inverse : colors.primary.main} 
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    newPost.heading === category.name && styles.activeCategoryChipText,
                  ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.createButton,
              (!newPost.heading_name || !newPost.description || !newPost.heading) && styles.createButtonDisabled
            ]}
            disabled={!newPost.heading_name || !newPost.description || !newPost.heading || isLoading}
            onPress={handleCreatePost}>
            <Text style={styles.createButtonText}>
              {isLoading ? 'Creating...' : 'Create Post'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={semantic.background.paper}
        barStyle="dark-content"
      />
      
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsList}
        ListHeaderComponent={renderHeader}
        refreshing={isLoading}
        onRefresh={fetchPosts}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowNewPostModal(true)}>
        <Icon name="plus" size={24} color={semantic.text.inverse} />
      </TouchableOpacity>

      {renderNewPostModal()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: semantic.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: semantic.text.primary,
    letterSpacing: 0.5,
  },
  newPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    
  },
  newPostButtonText: {
    color: semantic.text.inverse,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  categoriesWrapper: {
    backgroundColor: semantic.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border.light,
    ...shadows.sm,
  },
  categoriesContainer: {
    backgroundColor: semantic.background.paper,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    
  },
  activeCategoryChip: {
    backgroundColor: colors.primary.main,
  },
  categoryChipText: {
    color: colors.primary.main,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  activeCategoryChipText: {
    color: semantic.text.inverse,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semantic.text.primary,
    letterSpacing: 0.5,
  },
  seeAllButton: {
    color: colors.primary.main,
    fontSize: 14,
    fontWeight: '600',
  },
  postsList: {
    paddingBottom: 90,
  },
  postCard: {
    backgroundColor: semantic.background.paper,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: semantic.text.primary,
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: semantic.text.secondary,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryText: {
    color: colors.primary.main,
    fontSize: 12,
    fontWeight: '600',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semantic.text.primary,
    marginBottom: 8,
    lineHeight: 24,
  },
  postContent: {
    fontSize: 14,
    color: semantic.text.secondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: semantic.background.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: semantic.text.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: semantic.border.light,
    paddingTop: 12,
    marginTop: 4,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  footerButtonText: {
    marginLeft: 6,
    color: semantic.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: semantic.background.paper,
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  input: {
    backgroundColor: semantic.background.default,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: semantic.border.light,
    color: semantic.text.primary,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: colors.primary.main,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: semantic.background.disabled,
  },
  createButtonText: {
    color: semantic.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semantic.text.primary,
  },
  modalCloseButton: {
    padding: 8,
  },
});

export default CommunityScreen; 