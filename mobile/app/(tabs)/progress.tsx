import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { ProgressDashboard } from '../../components/features/progress/ProgressDashboard';
import { WeeklyChart } from '../../components/features/progress/WeeklyChart';
import { StreakCard } from '../../components/features/progress/StreakCard';
import { Leaderboard } from '../../components/features/progress/Leaderboard';
import { LogWordsModal } from '../../components/features/progress/LogWordsModal';
import * as Haptics from 'expo-haptics';

export default function ProgressScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['progressStats'],
    queryFn: async () => {
      const res = await api.get('/progress/stats');
      return res.data.data;
    }
  });

  const { data: history, refetch: refetchHistory } = useQuery({
    queryKey: ['progressHistory'],
    queryFn: async () => {
      const res = await api.get('/progress/history?days=7');
      return res.data.data;
    }
  });

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchStats(),
      refetchHistory(),
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
    ]);
    setIsRefreshing(false);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = history?.find((log: any) => log.date.startsWith(todayStr));
  const todayWordCount = todayLog ? todayLog.wordCount : 0;
  const dailyGoal = stats?.dailyGoal || 500;

  const logModalRef = React.useRef<any>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress Tracker</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <ProgressDashboard 
          todayWordCount={todayWordCount} 
          dailyGoal={dailyGoal}
          onLogPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            logModalRef.current?.present();
          }}
        />

        {stats && <StreakCard currentStreak={stats.currentStreak} longestStreak={stats.longestStreak} />}
        
        {history && stats && <WeeklyChart history={history} dailyGoal={dailyGoal} />}

        <Leaderboard />
        
        <View style={{ height: 40 }} />
      </ScrollView>

      <LogWordsModal 
        ref={logModalRef}
        onClose={() => {}} 
        initialWordCount={todayWordCount}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  scrollContent: {
    padding: 16,
    gap: 20,
  }
});
