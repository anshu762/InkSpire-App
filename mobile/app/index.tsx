import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-bold text-primary">Welcome to InkSpire</Text>
      <Text className="text-base text-textLight mt-2">Peer Support Platform for Writers</Text>
    </View>
  );
}
