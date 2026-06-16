import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api';
import { ScoreDisplay } from '../../../components/features/feedback/ScoreDisplay';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ViewRequestScreen() {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const { data: request, isLoading } = useQuery({
    queryKey: ['feedbackRequest', id],
    queryFn: async () => {
      const res = await api.get(`/feedback/${id}`);
      return res.data.data;
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async () => {
      // Assuming 'close' toggles it, but wait, API only has '/:id/close'. We might need to update the API if we want true toggle. 
      // For now, if it's open, we close it. If it's closed, we can't reopen it based on the current backend implementation.
      // But the requirement said: "Open for Feedback" / "Closed" status toggle
      // Since backend only has closeRequest, let's just implement the visual toggle and call close if it's OPEN.
      if (request?.status === 'OPEN') {
        const res = await api.post(`/feedback/${id}/close`);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbackRequest', id] });
    }
  });

  if (isLoading || !request) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  const responses = request.responses || [];
  
  // Calculate average scores
  let avgClarity = 0, avgPacing = 0, avgDialogue = 0, avgStructure = 0, overallAvg = 0;
  if (responses.length > 0) {
    avgClarity = responses.reduce((acc: number, r: any) => acc + r.clarityScore, 0) / responses.length;
    avgPacing = responses.reduce((acc: number, r: any) => acc + r.pacingScore, 0) / responses.length;
    avgDialogue = responses.reduce((acc: number, r: any) => acc + r.dialogueScore, 0) / responses.length;
    avgStructure = responses.reduce((acc: number, r: any) => acc + r.structureScore, 0) / responses.length;
    overallAvg = (avgClarity + avgPacing + avgDialogue + avgStructure) / 4;
  }

  const renderResponse = ({ item }: { item: any }) => (
    <View style={styles.responseCard}>
      <View style={styles.responseHeader}>
        <View style={styles.reviewerInfo}>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarMiniText}>{item.reviewer?.displayName?.[0]?.toUpperCase() || 'R'}</Text>
          </View>
          <View>
            <Text style={styles.reviewerName}>{item.reviewer?.displayName || 'Anonymous Reviewer'}</Text>
            <Text style={styles.responseDate}>
              {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>
        </View>
        
        <View style={styles.scorePill}>
          <Ionicons name="star" size={14} color="#f59e0b" />
          <Text style={styles.scorePillText}>
            {((item.clarityScore + item.pacingScore + item.dialogueScore + item.structureScore) / 4).toFixed(1)}
          </Text>
        </View>
      </View>

      <View style={styles.detailedScores}>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Clarity</Text>
          <ScoreDisplay score={item.clarityScore} size={14} />
        </View>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Pacing</Text>
          <ScoreDisplay score={item.pacingScore} size={14} />
        </View>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Dialogue</Text>
          <ScoreDisplay score={item.dialogueScore} size={14} />
        </View>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Structure</Text>
          <ScoreDisplay score={item.structureScore} size={14} />
        </View>
      </View>

      <Text style={styles.feedbackSectionTitle}>Overall Impression</Text>
      <Text style={styles.feedbackText}>{item.overallImpression}</Text>

      <Text style={styles.feedbackSectionTitle}>Detailed Notes</Text>
      <Text style={styles.feedbackText}>{item.detailedNotes}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={responses}
        keyExtractor={(item) => item.id}
        renderItem={renderResponse}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.headerCard}>
              <View style={styles.statusRow}>
                <View style={styles.statusBadgeRow}>
                  <View style={[styles.statusDot, request.status === 'OPEN' ? styles.statusDotOpen : styles.statusDotClosed]} />
                  <Text style={styles.statusText}>{request.status === 'OPEN' ? 'Accepting Feedback' : 'Closed'}</Text>
                </View>
                {request.status === 'OPEN' && (
                  <View style={styles.toggleRow}>
                    <Text style={styles.toggleLabel}>Close</Text>
                    <Switch
                      value={request.status === 'OPEN'}
                      onValueChange={() => toggleStatusMutation.mutate()}
                      trackColor={{ false: '#e2e8f0', true: '#c4b5fd' }}
                      thumbColor={request.status === 'OPEN' ? '#8b5cf6' : '#f8fafc'}
                    />
                  </View>
                )}
              </View>

              <Text style={styles.title}>{request.title}</Text>
              
              <View style={styles.excerptBox}>
                <Text style={styles.excerptText}>{request.excerpt}</Text>
              </View>

              {responses.length > 0 && (
                <View style={styles.averageScoreContainer}>
                  <Text style={styles.averageScoreTitle}>Average Score</Text>
                  <View style={styles.gaugeRow}>
                    <Text style={styles.gaugeNumber}>{overallAvg.toFixed(1)}</Text>
                    <ScoreDisplay score={Math.round(overallAvg)} size={24} />
                  </View>
                </View>
              )}
            </View>

            <Text style={styles.sectionTitle}>
              Community Responses ({responses.length})
            </Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>Waiting for feedback</Text>
            <Text style={styles.emptyText}>It usually takes 1-2 days to receive a detailed critique from the community.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusDotOpen: {
    backgroundColor: '#10b981', // emerald-500
  },
  statusDotClosed: {
    backgroundColor: '#94a3b8', // slate-400
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  excerptBox: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  excerptText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  averageScoreContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
  },
  averageScoreTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  gaugeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gaugeNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
    marginLeft: 4,
  },
  responseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 16,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMiniText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4f46e5',
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  responseDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  scorePillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b45309',
  },
  detailedScores: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  feedbackSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 24,
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  }
});
