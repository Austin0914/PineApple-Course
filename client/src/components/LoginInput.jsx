function LoginInput({
  type,
  placeholder,
  name,
  value,
  onChange,
  required,
  ...props
}) {
  return (
    <div className="input-container">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
    </div>
  );
}

export default LoginInput;
