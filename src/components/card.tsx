import React from 'react';
import {View, Text, Pressable} from '@/components/ui';

interface CardProps {
  title: string;
  description?: string;
  color?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const Card = ({
  title,
  description,
  color = '#8B5CF6',
  onPress,
  children,
  className = '',
}: CardProps) => {
  const CardContent = (
    <View
      className={`rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 ${className}`}
      style={{borderTopWidth: 4, borderTopColor: color}}>
      {/* Header with gradient */}
      <View className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 p-4">
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </Text>
        {description && (
          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </Text>
        )}
      </View>

      {/* Content */}
      {children && (
        <View className="bg-white dark:bg-gray-800 p-4">{children}</View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} className="active:opacity-80">
        {CardContent}
      </Pressable>
    );
  }

  return CardContent;
};
