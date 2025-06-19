import { useState } from "react";

function ChineseInput({
  placeholder,
  name,
  value,
  onChange,
  required,
  ...props
}) {
  const [isComposing, setIsComposing] = useState(false);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e) => {
    setIsComposing(false);
    // 在composition結束後立即更新狀態
    if (onChange) {
      onChange(e);
    }
  };

  const handleChange = (e) => {
    // 如果不是在組合輸入中，正常更新狀態
    // 如果是在組合輸入中，也要更新狀態以顯示輸入內容
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="input-container">
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        required={required}
        autoComplete="off"
        spellCheck="false"
        lang="zh-TW"
        inputMode="text"
        {...props}
      />
    </div>
  );
}
export default ChineseInput;
