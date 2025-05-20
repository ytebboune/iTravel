import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { ButtonProps } from './button.types';

export function Button({ 
  children, 
  variant = 'primary',
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold text-lg";
  const variantStyles = {
    primary: "bg-primary text-white",
    secondary: "bg-transparent border border-primary text-primary",
    disabled: "bg-gray-300 text-gray-600 opacity-50"
  };

  return (
    <TouchableOpacity 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={variant === 'disabled'}
      {...props}
    >
      <Text className={variant === 'secondary' ? 'text-primary' : 'text-white'}>
        {children}
      </Text>
    </TouchableOpacity>
  );
} 