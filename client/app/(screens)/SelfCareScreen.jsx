import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  FlatList,
  Linking,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, semantic } from '../theme/colors';
import { useRouter } from 'expo-router';
import { generateResponse } from '../services/gemini';

const { width } = Dimensions.get('window');

const topicGuides = {
  'Mental Wellness': [
    {
      version: 1,
      topics: [
        {
          id: "1",
          title: "Understanding Mental Health",
          content: "• Practice daily mindfulness and meditation - Set aside 10-15 minutes each morning for quiet reflection and breathing exercises\n• Maintain a regular sleep schedule - Go to bed and wake up at the same time daily, aiming for 7-9 hours of quality sleep\n• Set realistic goals and expectations - Break large tasks into smaller, manageable steps and celebrate small victories\n• Connect with supportive friends and family - Schedule regular check-ins and share your feelings with trusted individuals\n• Take breaks when feeling overwhelmed - Step away from stressful situations for 5-10 minutes to reset and recharge"
        },
        {
          id: "2",
          title: "Stress Management",
          content: "• Practice deep breathing exercises - Use the 4-7-8 technique: inhale for 4 seconds, hold for 7, exhale for 8\n• Exercise regularly for mental clarity - Engage in 30 minutes of moderate activity daily, like walking, yoga, or swimming\n• Keep a gratitude journal - Write down 3 things you're thankful for each day to maintain perspective\n• Set boundaries in work and relationships - Learn to say 'no' when needed and communicate your limits clearly\n• Take time for hobbies you enjoy - Dedicate at least 2 hours weekly to activities that bring you joy and relaxation"
        },
        {
          id: "3",
          title: "Daily Mental Care",
          content: "• Start your day with positive affirmations - Create and repeat 3-5 personal empowering statements each morning\n• Take short breaks every 2 hours - Step away from work for 5-10 minutes to stretch and reset your mind\n• Practice mindful eating - Focus on your food without distractions, chew slowly, and savor each bite\n• Limit social media exposure - Set specific times for social media use and keep it under 1 hour daily\n• End your day with reflection - Spend 10 minutes before bed reviewing your day and planning tomorrow"
        }
      ]
    },
    {
      version: 2,
      topics: [
        {
          id: "1",
          title: "Self Defence Essentials",
          content: "• Master basic stance and movement - Practice proper foot positioning and quick directional changes daily\n• Learn effective striking techniques - Focus on palm strikes, elbow strikes, and knee strikes for self-defense\n• Develop situational awareness - Regularly scan your environment and identify potential exits\n• Practice verbal de-escalation - Learn phrases and tone of voice to defuse tense situations\n• Build physical conditioning - Include cardio and strength training 3 times weekly for readiness"
        },
        {
          id: "2",
          title: "Safety Strategies",
          content: "• Create a personal safety plan - Map out safe routes, identify safe zones, and keep emergency contacts ready\n• Learn to use defensive tools - Familiarize yourself with legal self-defense tools and their proper usage\n• Practice escape techniques - Master basic releases from common grabs and holds\n• Strengthen situational awareness - Regularly assess your surroundings and trust your instincts\n• Build a support network - Connect with local self-defense groups and share safety resources"
        },
        {
          id: "3",
          title: "Emergency Preparedness",
          content: "• Prepare emergency contacts - Create a list of important numbers and keep them easily accessible\n• Learn first aid basics - Take a certified first aid course and maintain a well-stocked first aid kit\n• Create evacuation plans - Map multiple escape routes from home, work, and frequently visited places\n• Practice emergency scenarios - Regularly run through different emergency situations mentally\n• Stay informed about local safety - Keep updated on neighborhood safety issues and alerts"
        }
      ]
    },
    {
      version: 3,
      topics: [
        {
          id: "1",
          title: "Mental Health Practices",
          content: "• Create a daily mental health checklist\n• Practice positive visualization\n• Develop healthy coping mechanisms\n• Maintain a mood tracker\n• Build emotional intelligence skills"
        },
        {
          id: "2",
          title: "Professional Support",
          content: "• Know when to seek professional help\n• Find the right mental health provider\n• Understand different therapy types\n• Learn about support groups\n• Explore counseling options"
        },
        {
          id: "3",
          title: "Crisis Management",
          content: "• Recognize early warning signs\n• Create an emergency support plan\n• Know crisis hotline numbers\n• Practice grounding techniques\n• Identify trusted support people"
        }
      ]
    },
    {
      version: 4,
      topics: [
        {
          id: "1",
          title: "Social Connections",
          content: "• Build meaningful relationships\n• Join support communities\n• Practice active listening\n• Share feelings with trusted friends\n• Participate in group activities"
        },
        {
          id: "2",
          title: "Work-Life Balance",
          content: "• Set healthy workplace boundaries\n• Take regular mental health days\n• Practice stress management at work\n• Create a supportive work environment\n• Balance career and personal life"
        },
        {
          id: "3",
          title: "Personal Growth",
          content: "• Set personal development goals\n• Learn new skills regularly\n• Practice self-reflection\n• Celebrate small victories\n• Develop new hobbies"
        }
      ]
    }
  ],
  'Self Defence': [
    {
      version: 1,
      topics: [
        {
          id: "1",
          title: "Basic Self-Defense",
          content: "• Stay aware of your surroundings\n• Trust your instincts\n• Keep emergency contacts handy\n• Learn basic striking techniques\n• Practice escape routes"
        },
        {
          id: "2",
          title: "Safety Strategies",
          content: "• Use well-lit routes at night\n• Keep your phone charged\n• Share location with trusted contacts\n• Learn to project confidence\n• Know emergency exits"
        },
        {
          id: "3",
          title: "Daily Safety Habits",
          content: "• Check your car before entering\n• Vary your routine\n• Keep emergency numbers on speed dial\n• Stay alert in public places\n• Learn basic defensive stance"
        }
      ]
    },
    {
      version: 2,
      topics: [
        {
          id: "1",
          title: "Personal Safety",
          content: "• Master basic self-defense moves\n• Create a safety plan\n• Learn to use defensive tools\n• Practice situational awareness\n• Know your legal rights"
        },
        {
          id: "2",
          title: "Emergency Response",
          content: "• Learn to identify threats\n• Practice quick response techniques\n• Know safe zones in your area\n• Use verbal de-escalation\n• Master escape techniques"
        },
        {
          id: "3",
          title: "Prevention Strategies",
          content: "• Secure your living space\n• Plan safe travel routes\n• Build a support network\n• Learn to set boundaries\n• Stay informed about local safety"
        }
      ]
    },
    {
      version: 3,
      topics: [
        {
          id: "1",
          title: "Advanced Safety",
          content: "• Learn advanced defense techniques\n• Master pressure point defense\n• Understand legal self-defense rights\n• Practice weapon awareness\n• Develop quick reflexes"
        },
        {
          id: "2",
          title: "Group Safety",
          content: "• Organize neighborhood watch\n• Create family safety plans\n• Coordinate with local authorities\n• Build community safety networks\n• Share safety resources"
        },
        {
          id: "3",
          title: "Digital Safety",
          content: "• Protect online privacy\n• Secure digital devices\n• Recognize cyber threats\n• Use safety apps effectively\n• Monitor digital footprint"
        }
      ]
    },
    {
      version: 4,
      topics: [
        {
          id: "1",
          title: "Environmental Awareness",
          content: "• Assess location security\n• Identify safe zones\n• Map emergency routes\n• Recognize potential threats\n• Plan escape strategies"
        },
        {
          id: "2",
          title: "Physical Preparedness",
          content: "• Build strength and stamina\n• Practice quick movements\n• Learn defensive stances\n• Master escape techniques\n• Improve reaction time"
        },
        {
          id: "3",
          title: "Mental Preparedness",
          content: "• Develop situational awareness\n• Stay calm under pressure\n• Make quick decisions\n• Trust your instincts\n• Maintain mental focus"
        }
      ]
    }
  ],
  "Women's Health Guide": [
    {
      version: 1,
      topics: [
        {
          id: "1",
          title: "Reproductive Health",
          content: "• Track menstrual cycle details - Use an app to monitor dates, symptoms, and patterns monthly\n• Practice breast self-examination - Perform checks on the same day each month, noting any changes\n• Maintain regular gynecological visits - Schedule annual check-ups and screenings as recommended\n• Monitor hormonal health - Keep a diary of mood changes, energy levels, and physical symptoms\n• Understand fertility signs - Learn to recognize ovulation indicators and cycle variations"
        },
        {
          id: "2",
          title: "Nutrition & Wellness",
          content: "• Ensure adequate iron intake - Include iron-rich foods like leafy greens, lean meats, and legumes daily\n• Maintain bone health - Get 1000-1200mg calcium daily through diet and supplements if needed\n• Balance hormones naturally - Include foods rich in omega-3s, fiber, and antioxidants in your diet\n• Stay properly hydrated - Drink 8-10 glasses of water daily, more during exercise or hot weather\n• Support immune health - Include vitamin C, D, and zinc-rich foods in your daily diet"
        },
        {
          id: "3",
          title: "Preventive Care",
          content: "• Schedule regular health screenings - Follow recommended guidelines for mammograms and pap smears\n• Monitor heart health - Check blood pressure monthly and maintain healthy cholesterol levels\n• Practice stress management - Incorporate daily relaxation techniques and regular exercise\n• Maintain bone density - Engage in weight-bearing exercises 3-4 times weekly\n• Track family health history - Keep detailed records of familial health conditions and risks"
        }
      ]
    },
    {
      version: 2,
      topics: [
        {
          id: "1",
          title: "Health Essentials",
          content: "• Schedule regular health check-ups\n• Track your menstrual cycle\n• Maintain breast health awareness\n• Get adequate calcium and iron\n• Practice proper hygiene"
        },
        {
          id: "2",
          title: "Wellness Tips",
          content: "• Exercise regularly\n• Maintain a balanced diet\n• Get adequate sleep\n• Manage stress levels\n• Stay hydrated"
        },
        {
          id: "3",
          title: "Health Monitoring",
          content: "• Do monthly self-examinations\n• Monitor emotional health\n• Track vital signs\n• Note unusual symptoms\n• Keep health records"
        }
      ]
    },
    {
      version: 3,
      topics: [
        {
          id: "1",
          title: "Health Integration",
          content: "• Regular check-ups\n• Balanced nutrition\n• Active lifestyle\n• Mental health care\n• Social wellness"
        },
        {
          id: "2",
          title: "Lifestyle Balance",
          content: "• Balance work and rest\n• Maintain social connections\n• Practice self-care\n• Healthy eating habits\n• Regular exercise routine"
        },
        {
          id: "3",
          title: "Age-Specific Care",
          content: "• Teenage health essentials\n• Adult women's checkups\n• Menopause management\n• Senior women's health\n• Age-appropriate exercise"
        }
      ]
    },
    {
      version: 4,
      topics: [
        {
          id: "1",
          title: "Mental & Emotional Health",
          content: "• Handle hormonal mood changes\n• Practice self-acceptance\n• Build body positivity\n• Manage anxiety and stress\n• Develop emotional resilience"
        },
        {
          id: "2",
          title: "Nutrition & Supplements",
          content: "• Essential vitamins for women\n• Iron-rich food sources\n• Calcium requirements\n• Pregnancy nutrition\n• Anti-aging nutrients"
        },
        {
          id: "3",
          title: "Sexual Health",
          content: "• Regular health screenings\n• STI prevention\n• Maintain intimate health\n• Understand contraception options\n• Practice safe intimacy"
        }
      ]
    }
  ],
  'Physical Wellness': [
    {
      version: 1,
      topics: [
        {
          id: "1",
          title: "Exercise Fundamentals",
          content: "• Plan structured workouts - Include 20 minutes cardio, 15 minutes strength training, 10 minutes flexibility\n• Master proper form - Focus on alignment, controlled movements, and breathing techniques\n• Progress gradually - Increase intensity by 10% weekly to prevent injury and build endurance\n• Track performance metrics - Monitor heart rate, repetitions, weights, and recovery time\n• Listen to body signals - Learn to differentiate between good pain and potential injury signs"
        },
        {
          id: "2",
          title: "Nutrition Essentials",
          content: "• Calculate daily caloric needs - Use your age, weight, height, and activity level\n• Balance macronutrients - Aim for 45-65% carbs, 10-35% protein, and 20-35% healthy fats\n• Time meals properly - Eat within 2 hours of waking and every 3-4 hours after\n• Plan pre/post workout nutrition - Consume carbs before and protein within 30 minutes after exercise\n• Stay hydrated throughout day - Drink half your body weight in ounces of water daily"
        },
        {
          id: "3",
          title: "Recovery & Rest",
          content: "• Optimize sleep environment - Keep room temperature 60-67°F, use blackout curtains, minimize noise\n• Practice active recovery - Include light activities like walking or yoga on rest days\n• Use proper recovery tools - Incorporate foam rolling, stretching, and massage techniques\n• Monitor sleep quality - Track sleep cycles, duration, and wake times\n• Implement stress reduction - Practice meditation or deep breathing before bed"
        }
      ]
    },
    {
      version: 2,
      topics: [
        {
          id: "1",
          title: "Fitness Goals",
          content: "• Set realistic targets\n• Track your progress\n• Mix cardio and strength\n• Include flexibility work\n• Plan rest periods"
        },
        {
          id: "2",
          title: "Healthy Habits",
          content: "• Morning stretching routine\n• Regular posture checks\n• Take walking breaks\n• Stay active throughout day\n• Practice proper breathing"
        },
        {
          id: "3",
          title: "Injury Prevention",
          content: "• Warm up properly\n• Use correct form\n• Progress gradually\n• Listen to your body\n• Regular maintenance exercises"
        }
      ]
    },
    {
      version: 3,
      topics: [
        {
          id: "1",
          title: "Strength Training",
          content: "• Basic weightlifting techniques\n• Bodyweight exercises\n• Proper form guidelines\n• Progressive overload\n• Recovery strategies"
        },
        {
          id: "2",
          title: "Cardio Fitness",
          content: "• High-intensity intervals\n• Endurance training\n• Heart rate monitoring\n• Different cardio types\n• Breathing techniques"
        },
        {
          id: "3",
          title: "Flexibility & Mobility",
          content: "• Dynamic stretching routines\n• Joint mobility exercises\n• Yoga fundamentals\n• Posture improvement\n• Range of motion work"
        }
      ]
    },
    {
      version: 4,
      topics: [
        {
          id: "1",
          title: "Sports Performance",
          content: "• Sport-specific training\n• Agility development\n• Speed enhancement\n• Balance training\n• Performance nutrition"
        },
        {
          id: "2",
          title: "Recovery Methods",
          content: "• Post-workout nutrition\n• Sleep optimization\n• Massage techniques\n• Active recovery\n• Stress management"
        },
        {
          id: "3",
          title: "Lifestyle Integration",
          content: "• Daily movement habits\n• Active commuting\n• Desk exercise breaks\n• Weekend activities\n• Family fitness time"
        }
      ]
    }
  ],
  'Meditation Guide': [
    {
      version: 1,
      topics: [
        {
          id: "1",
          title: "Getting Started with Meditation",
          content: "• Create a dedicated meditation space - Set up a quiet corner with cushions, dim lighting, and minimal distractions\n• Establish a regular practice time - Start with 5-10 minutes at the same time each day, preferably early morning\n• Master basic breathing techniques - Practice 4-count breathing: inhale for 4, hold for 4, exhale for 4\n• Use guided meditation apps - Begin with beginner-friendly apps like Headspace or Calm for structured practice\n• Build consistency gradually - Increase duration by 1-2 minutes each week as you become comfortable"
        },
        {
          id: "2",
          title: "Advanced Meditation Techniques",
          content: "• Practice body scan meditation - Spend 15-20 minutes systematically relaxing each body part from toes to head\n• Explore mindful walking - Walk slowly for 10-15 minutes, focusing on each step and breath\n• Try loving-kindness meditation - Direct positive thoughts to yourself and others for 10 minutes daily\n• Implement visualization techniques - Create detailed mental images of peaceful scenes or positive outcomes\n• Master mantra meditation - Choose a meaningful phrase and repeat it silently for 10-15 minutes"
        },
        {
          id: "3",
          title: "Integration & Benefits",
          content: "• Practice mindful eating - Take 20 minutes for meals, focusing on flavors, textures, and gratitude\n• Incorporate mini-meditations - Take 2-minute breathing breaks during busy workdays\n• Use meditation for stress relief - Practice 5-minute calming techniques during challenging situations\n• Track meditation progress - Keep a journal of practice times, experiences, and insights\n• Join meditation communities - Connect with local groups or online forums for support and guidance"
        }
      ]
    },
    {
      version: 2,
      topics: [
        {
          id: "1",
          title: "Advanced Methods",
          content: "• Visualization techniques\n• Mantra meditation\n• Sound meditation\n• Movement meditation\n• Chakra meditation"
        },
        {
          id: "2",
          title: "Stress Relief",
          content: "• Quick calming techniques\n• Anxiety reduction\n• Emotional balance\n• Mental clarity\n• Energy restoration"
        },
        {
          id: "3",
          title: "Mindful Living",
          content: "• Present moment awareness\n• Mindful eating\n• Conscious communication\n• Emotional awareness\n• Stress management"
        }
      ]
    },
    {
      version: 3,
      topics: [
        {
          id: "1",
          title: "Specialized Techniques",
          content: "• Transcendental meditation\n• Zen meditation practice\n• Kundalini meditation\n• Guided visualization\n• Chakra meditation"
        },
        {
          id: "2",
          title: "Group Meditation",
          content: "• Finding meditation groups\n• Group energy benefits\n• Shared practice tips\n• Community support\n• Leading meditation sessions"
        },
        {
          id: "3",
          title: "Meditation for Goals",
          content: "• Focus enhancement\n• Creativity boost\n• Problem-solving meditation\n• Manifestation practice\n• Goal visualization"
        }
      ]
    },
    {
      version: 4,
      topics: [
        {
          id: "1",
          title: "Digital Meditation",
          content: "• Using meditation apps\n• Online guided sessions\n• Virtual meditation rooms\n• Timer and tracking tools\n• Digital community support"
        },
        {
          id: "2",
          title: "Environmental Setup",
          content: "• Create meditation space\n• Choose proper lighting\n• Use aromatherapy\n• Select meditation music\n• Maintain sacred space"
        },
        {
          id: "3",
          title: "Integration Practices",
          content: "• Walking meditation\n• Eating meditation\n• Work meditation\n• Travel meditation\n• Nature meditation"
        }
      ]
    }
  ],
  'Lifestyle Balance': [
    {
      version: 1,
      topics: [
        {
          id: "1",
          title: "Time Management Excellence",
          content: "• Implement time blocking - Schedule your day in 30-minute blocks, including breaks and buffer time\n• Use the 2-minute rule - Complete tasks immediately if they take less than 2 minutes\n• Practice priority setting - Use the Eisenhower Matrix to categorize tasks by urgency and importance\n• Create morning/evening routines - Develop 30-minute routines to bookend your day effectively\n• Master the art of delegation - Identify tasks that can be delegated and train others appropriately"
        },
        {
          id: "2",
          title: "Work-Life Harmony",
          content: "• Set clear work boundaries - Establish specific work hours and stick to them consistently\n• Create dedicated family time - Schedule at least 2 hours of uninterrupted family time daily\n• Plan regular breaks - Take 15-minute breaks every 90 minutes during work\n• Practice digital detox - Implement tech-free periods, especially during meals and before bed\n• Maintain social connections - Schedule regular catch-ups with friends and loved ones"
        },
        {
          id: "3",
          title: "Personal Development",
          content: "• Set SMART goals - Create Specific, Measurable, Achievable, Relevant, and Time-bound objectives\n• Develop new skills quarterly - Dedicate 3-4 hours weekly to learning something new\n• Read regularly - Spend 30 minutes daily reading personal development books\n• Practice reflection - Journal for 10 minutes daily about progress and learnings\n• Build professional networks - Attend monthly networking events or online webinars"
        }
      ]
    },
    {
      version: 2,
      topics: [
        {
          id: "1",
          title: "Daily Structure",
          content: "• Morning routine\n• Regular meal times\n• Exercise schedule\n• Evening wind-down\n• Weekly planning"
        },
        {
          id: "2",
          title: "Health Integration",
          content: "• Regular check-ups\n• Balanced nutrition\n• Active lifestyle\n• Mental health care\n• Social wellness"
        },
        {
          id: "3",
          title: "Life Organization",
          content: "• Goal setting\n• Progress tracking\n• Regular reviews\n• Adjustment strategies\n• Success celebration"
        }
      ]
    },
    {
      version: 3,
      topics: [
        {
          id: "1",
          title: "Financial Wellness",
          content: "• Create budget plans\n• Set financial goals\n• Build emergency savings\n• Track expenses\n• Plan investments"
        },
        {
          id: "2",
          title: "Social Connection",
          content: "• Nurture relationships\n• Plan social activities\n• Join community groups\n• Network professionally\n• Balance social media"
        },
        {
          id: "3",
          title: "Personal Development",
          content: "• Set learning goals\n• Read regularly\n• Take online courses\n• Develop new skills\n• Track progress"
        }
      ]
    },
    {
      version: 4,
      topics: [
        {
          id: "1",
          title: "Home Organization",
          content: "• Declutter regularly\n• Create cleaning schedules\n• Organize living spaces\n• Maintain home systems\n• Practice minimalism"
        },
        {
          id: "2",
          title: "Digital Balance",
          content: "• Set screen time limits\n• Practice digital detox\n• Organize digital files\n• Manage notifications\n• Create online boundaries"
        },
        {
          id: "3",
          title: "Creative Expression",
          content: "• Start artistic hobbies\n• Write or journal\n• Practice music\n• Try DIY projects\n• Express creativity daily"
        }
      ]
    }
  ]
};

const SelfCareScreen = () => {
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [expandedSubtopic, setExpandedSubtopic] = useState(null);
  const [healthTopics, setHealthTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topicLoadingStates, setTopicLoadingStates] = useState({});
  const router = useRouter();

  useEffect(() => {
    loadTopicContent();
  }, []);

  const createTopicPrompt = (topic) => {
    return `Create a guide about ${topic} with 3 sections. Format the response EXACTLY as follows, with bullet points for content:

{
  "topics": [
    {
      "id": "1",
      "title": "Key Information",
      "content": "• First key point about ${topic}\n• Second important point\n• Third essential point"
    },
    {
      "id": "2",
      "title": "Practical Tips",
      "content": "• First practical tip\n• Second useful tip\n• Third helpful tip"
    },
    {
      "id": "3",
      "title": "Daily Practices",
      "content": "• First daily practice\n• Second daily practice\n• Third daily practice"
    }
  ]
}`;
  };

  const parseGeminiResponse = (response) => {
    try {
      // First try direct JSON parse
      try {
        const directParse = JSON.parse(response);
        if (isValidTopicStructure(directParse)) {
          return directParse;
        }
      } catch (e) {
        // Continue to more aggressive parsing if direct parse fails
      }

      // Find JSON-like structure
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON structure found');
      }

      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);

      if (!isValidTopicStructure(parsed)) {
        throw new Error('Invalid topic structure');
      }

      return parsed;
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return createFallbackTopic(error.message);
    }
  };

  const isValidTopicStructure = (data) => {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.title === 'string' &&
      typeof data.description === 'string' &&
      typeof data.icon === 'string' &&
      typeof data.color === 'string' &&
      Array.isArray(data.topics) &&
      data.topics.every(topic =>
        topic &&
        typeof topic.id === 'string' &&
        typeof topic.title === 'string' &&
        typeof topic.content === 'string'
      )
    );
  };

  const createFallbackTopic = (errorMessage) => {
    return {
      title: "Topic Information",
      description: "Temporary content while we load the actual information",
      icon: "information",
      color: "#6B7280",
      topics: [
        {
          id: "1",
          title: "Getting Started",
          content: "• Basic information about this topic\n• Key concepts to understand\n• Fundamental principles"
        },
        {
          id: "2",
          title: "Common Practices",
          content: "• Best practices for beginners\n• Intermediate techniques\n• Advanced strategies"
        },
        {
          id: "3",
          title: "Additional Resources",
          content: "• Helpful tips and tricks\n• Recommended reading\n• Practice exercises"
        }
      ]
    };
  };

  const loadTopicContent = async () => {
    setIsLoading(true);
    try {
      const topics = [
        {
          name: 'Mental Wellness',
          icon: 'brain',
          color: '#4F46E5',
          description: 'Understand and improve your mental health'
        },
        {
          name: 'Self Defence',
          icon: 'shield-account',
          color: '#DC2626',
          description: 'Learn essential self-defense techniques'
        },
        {
          name: "Women's Health Guide",
          icon: 'human-female',
          color: '#DB2777',
          description: 'Comprehensive women\'s health information'
        },
        {
          name: 'Physical Wellness',
          icon: 'heart-pulse',
          color: '#059669',
          description: 'Maintain your physical well-being'
        },
        {
          name: 'Meditation Guide',
          icon: 'meditation',
          color: '#7C3AED',
          description: 'Learn meditation and mindfulness'
        },
        {
          name: 'Lifestyle Balance',
          icon: 'scale-balance',
          color: '#2563EB',
          description: 'Achieve work-life balance'
        }
      ];

      const initialTopics = topics.map((topic, index) => {
        const guides = topicGuides[topic.name];
        const initialGuide = guides[0]; // Start with first version

        return {
          id: String(index + 1),
          title: topic.name,
          description: topic.description,
          icon: topic.icon,
          color: topic.color,
          currentVersion: 0,
          topics: initialGuide.topics
        };
      });

      setHealthTopics(initialTopics);
    } catch (error) {
      console.error('Error loading topic content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshContent = async (topicId) => {
    const topic = healthTopics.find(t => t.id === topicId);
    if (!topic) return;

    const guides = topicGuides[topic.title];
    if (!guides) return;

    // Get next version index (cycle through available versions)
    const nextVersion = (topic.currentVersion + 1) % guides.length;
    const nextGuide = guides[nextVersion];

    setHealthTopics(prev => prev.map(t => 
      t.id === topicId ? {
        ...t,
        currentVersion: nextVersion,
        topics: nextGuide.topics
      } : t
    ));
  };

  const toggleTopic = (topicId) => {
    if (expandedTopic === topicId) {
      setExpandedTopic(null);
      setExpandedSubtopic(null);
    } else {
      setExpandedTopic(topicId);
      setExpandedSubtopic(null);
    }
  };

  const toggleSubtopic = (subtopicId) => {
    setExpandedSubtopic(expandedSubtopic === subtopicId ? null : subtopicId);
  };

  const renderSubtopics = (topics, topicId) => {
    if (topicLoadingStates[topicId]) {
      return (
        <View style={styles.loadingTopicContainer}>
          <ActivityIndicator size="small" color={colors.primary.main} />
          <Text style={styles.loadingTopicText}>Loading content...</Text>
        </View>
      );
    }

    return topics.map((topic) => (
      <View key={topic.id} style={styles.subtopicContainer}>
        <TouchableOpacity 
          style={styles.subtopicHeader}
          onPress={() => toggleSubtopic(topic.id)}>
          <Text style={styles.subtopicTitle}>{topic.title}</Text>
          <Icon 
            name={expandedSubtopic === topic.id ? "chevron-up" : "chevron-down"} 
            size={24} 
            color={semantic.text.secondary} 
          />
        </TouchableOpacity>
        {expandedSubtopic === topic.id && (
          <View style={styles.subtopicContent}>
            {topic.content.split('\n').map((line, index) => (
              <Text key={index} style={styles.subtopicText}>
                {line.trim()}{'\n'}
              </Text>
            ))}
          </View>
        )}
      </View>
    ));
  };

  const renderHeader = () => (
      <View style={styles.headerWrapper}>
        <StatusBar
          backgroundColor="#FFFFFF"
          barStyle="dark-content"
          translucent={false}
        />
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}>
              <Icon name="arrow-left" size={20} color={colors.primary.main} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>Self Care</Text>
            </View>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={() => expandedTopic && refreshContent(expandedTopic)}>
            <Icon name="refresh" size={20} color={colors.primary.main} />
          </TouchableOpacity>
        </View>
      </View>
      </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {renderHeader()}
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text style={styles.loadingText}>Loading wellness resources...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderHeader()}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wellness Resources</Text>
            <Text style={styles.sectionDescription}>
              Access comprehensive guides and resources for your overall well-being
            </Text>
            {healthTopics.map((topic) => (
              <View key={topic.id}>
                <TouchableOpacity 
                  style={styles.topicCard}
                  onPress={() => toggleTopic(topic.id)}>
                  <View style={styles.topicHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: `${topic.color}15` }]}>
                      <Icon name={topic.icon} size={24} color={topic.color} />
                    </View>
                    <View style={styles.titleContainer}>
                      <Text style={styles.topicTitle}>{topic.title}</Text>
                      <Text style={styles.topicDescription}>{topic.description}</Text>
                    </View>
                    <Icon 
                      name={expandedTopic === topic.id ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color={topic.color} 
                    />
                  </View>
                </TouchableOpacity>
                
                {expandedTopic === topic.id && renderSubtopics(topic.topics, topic.id)}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPlaceholder: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  topicCard: {
    backgroundColor: semantic.background.paper,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semantic.text.primary,
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 14,
    color: semantic.text.secondary,
    lineHeight: 20,
  },
  subtopicContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  subtopicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  subtopicTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: semantic.text.primary,
    flex: 1,
  },
  subtopicContent: {
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  subtopicText: {
    fontSize: 14,
    lineHeight: 22,
    color: semantic.text.secondary,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: semantic.text.secondary,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTopicContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTopicText: {
    marginLeft: 12,
    fontSize: 14,
    color: semantic.text.secondary,
    fontWeight: '500',
  },
});

// Fallback static content in case API fails
const staticHealthTopics = [
  // ... your existing healthTopics array as fallback ...
];

export default SelfCareScreen; 