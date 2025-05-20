import { TouchableOpacityProps } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'disabled';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  className?: string;
} 