import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function TestScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 space-y-8">
        {/* Typography */}
        <View className="space-y-4">
          <Text className="text-2xl font-heading font-bold text-text-primary">Typography</Text>
          <Text className="text-5xl font-heading text-text-primary">Heading 1</Text>
          <Text className="text-4xl font-heading text-text-primary">Heading 2</Text>
          <Text className="text-3xl font-heading text-text-primary">Heading 3</Text>
          <Text className="text-2xl font-heading text-text-primary">Heading 4</Text>
          <Text className="text-xl font-heading text-text-primary">Heading 5</Text>
          <Text className="text-lg font-heading text-text-primary">Heading 6</Text>
          <Text className="text-base text-text-primary">Body Text</Text>
          <Text className="text-sm text-text-secondary">Small Text</Text>
          <Text className="text-xs text-text-light">Caption Text</Text>
        </View>

        {/* Colors */}
        <View className="space-y-4">
          <Text className="text-2xl font-heading font-bold text-text-primary">Colors</Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="w-20 h-20 bg-primary rounded-lg" />
            <View className="w-20 h-20 bg-secondary rounded-lg" />
            <View className="w-20 h-20 bg-accent rounded-lg" />
            <View className="w-20 h-20 bg-success rounded-lg" />
            <View className="w-20 h-20 bg-warning rounded-lg" />
            <View className="w-20 h-20 bg-error rounded-lg" />
            <View className="w-20 h-20 bg-info rounded-lg" />
          </View>
        </View>

        {/* Buttons */}
        <View className="space-y-4">
          <Text className="text-2xl font-heading font-bold text-text-primary">Buttons</Text>
          <View className="space-y-2">
            <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg">
              <Text className="text-white text-center font-semibold">Primary Button</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-secondary px-4 py-2 rounded-lg">
              <Text className="text-white text-center font-semibold">Secondary Button</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-accent px-4 py-2 rounded-lg">
              <Text className="text-white text-center font-semibold">Accent Button</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-surface border border-primary px-4 py-2 rounded-lg">
              <Text className="text-primary text-center font-semibold">Outlined Button</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cards */}
        <View className="space-y-4">
          <Text className="text-2xl font-heading font-bold text-text-primary">Cards</Text>
          <View className="bg-surface p-4 rounded-lg shadow-sm">
            <Text className="text-lg font-heading text-text-primary">Card Title</Text>
            <Text className="text-text-secondary mt-2">This is a sample card with some content to demonstrate the design system.</Text>
          </View>
        </View>

        {/* Spacing */}
        <View className="space-y-4">
          <Text className="text-2xl font-heading font-bold text-text-primary">Spacing</Text>
          <View className="space-y-2">
            <View className="h-4 bg-primary rounded-sm" />
            <View className="h-8 bg-primary rounded-sm" />
            <View className="h-12 bg-primary rounded-sm" />
            <View className="h-16 bg-primary rounded-sm" />
          </View>
        </View>

        {/* Border Radius */}
        <View className="space-y-4">
          <Text className="text-2xl font-heading font-bold text-text-primary">Border Radius</Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="w-20 h-20 bg-primary rounded-sm" />
            <View className="w-20 h-20 bg-primary rounded-md" />
            <View className="w-20 h-20 bg-primary rounded-lg" />
            <View className="w-20 h-20 bg-primary rounded-xl" />
            <View className="w-20 h-20 bg-primary rounded-2xl" />
            <View className="w-20 h-20 bg-primary rounded-full" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
} 