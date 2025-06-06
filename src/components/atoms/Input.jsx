const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '', 
  ...props 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-700 border-0 rounded-lg focus:ring-2 focus:ring-primary text-surface-900 dark:text-white placeholder-surface-500 ${className}`}
      {...props}
    />
  )
}

export default Input