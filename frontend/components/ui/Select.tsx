import { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${className}`}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = 'Select';
export default Select;
