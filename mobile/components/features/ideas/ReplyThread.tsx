import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { ActionModal } from '../../ui/ActionModal';

interface ReplyThreadProps {
  ideaId: string;
  matchId: string;
  replies: any[];
}

export default function ReplyThread({ ideaId, matchId, replies = [] }: ReplyThreadProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();

  const handleSend = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    // Optimistic Update
    const tempId = `temp-${Date.now()}`;
    const optimisticReply = {
      id: tempId,
      ideaId,
      authorId: user?.id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      author: { displayName: user?.displayName || 'You' }
    };

    queryClient.setQueriesData({ queryKey: ['ideas', matchId] }, (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((idea: any) => {
            if (idea.id === ideaId) {
              return {
                ...idea,
                replies: [optimisticReply, ...(idea.replies || [])],
                _count: { replies: (idea._count?.replies || 0) + 1 }
              };
            }
            return idea;
          })
        })),
      };
    });

    try {
      await api.post(`/matches/${matchId}/ideas/${ideaId}/replies`, {
        content: content.trim()
      });
      setContent('');
    } catch (e) {
      console.error('Failed to reply', e);
      queryClient.invalidateQueries({ queryKey: ['ideas', matchId] });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    const replyId = showDeleteConfirm;
    setShowDeleteConfirm(null);

    // Optimistic Update
    queryClient.setQueriesData({ queryKey: ['ideas', matchId] }, (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((idea: any) => {
            if (idea.id === ideaId) {
              return {
                ...idea,
                replies: (idea.replies || []).filter((r: any) => r.id !== replyId),
                _count: { replies: Math.max(0, (idea._count?.replies || 0) - 1) }
              };
            }
            return idea;
          })
        })),
      };
    });

    try {
      await api.delete(`/matches/${matchId}/ideas/${ideaId}/replies/${replyId}`);
    } catch (e) {
      console.error(e);
      queryClient.invalidateQueries({ queryKey: ['ideas', matchId] });
    }
  };

  return (
    <View style={styles.container}>
      {replies.map((reply) => {
        const isOwn = reply.authorId === user?.id;
        return (
          <View key={reply.id} style={styles.replyItem}>
            <View style={styles.header}>
              <Text style={styles.author}>{isOwn ? 'You' : reply.author?.displayName}</Text>
              <View style={styles.rightHeader}>
                <Text style={styles.time}>
                  {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {isOwn && (
                  <TouchableOpacity onPress={() => setShowDeleteConfirm(reply.id)} hitSlop={10}>
                    <Ionicons name="trash-outline" size={14} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Text style={styles.content}>{reply.content}</Text>
          </View>
        );
      })}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a reply..."
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !content.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!content.trim() || isSubmitting}
        >
          <Ionicons name="send" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ActionModal
        visible={!!showDeleteConfirm}
        title="Delete this reply?"
        onClose={() => setShowDeleteConfirm(null)}
        options={[
          { label: 'Delete', icon: 'trash-outline', destructive: true, onPress: handleDelete }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  replyItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 11,
    color: '#9ca3af',
  },
  content: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 80,
    minHeight: 36,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
});
