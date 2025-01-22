interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
  loadingText?: string;
}

const variants = {
  primary:
    'bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 disabled:cursor-not-allowed',
  outline:
    'border border-gray-300 text-gray-700 hover:bg-gray-50',
  ghost:
    'border border-gray-200 text-gray-600 hover:bg-gray-50',
};

export default function Button({
  variant = 'primary',
  isLoading,
  loadingText,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`font-medium py-2.5 rounded-lg transition-colors text-sm ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}
