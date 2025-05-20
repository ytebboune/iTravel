import { TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  error?: boolean;
  className?: string;
}

export const Input = ({ error, className = '', ...props }: InputProps) => {
  const baseStyles = "w-full px-3 py-3 rounded-lg text-base bg-background border";
  const errorStyles = error ? "border-red-500" : "border-gray-300";

  return (
    <TextInput
      className={`${baseStyles} ${errorStyles} ${className}`}
      placeholderTextColor="#666"
      {...props}
    />
  );
}; 