import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${className}`}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
export default Input;
