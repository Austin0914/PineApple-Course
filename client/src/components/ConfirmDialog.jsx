import { useState } from "react";
import "./ConfirmDialog.css";

function ConfirmDialog({
  isOpen,
  title = "確認操作",
  message,
  confirmText = "確認",
  cancelText = "取消",
  onConfirm,
  onCancel,
  type = "warning", // success, error, warning, info
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const getIconClass = () => {
    switch (type) {
      case "success":
        return "confirm-icon-success";
      case "error":
        return "confirm-icon-error";
      case "warning":
        return "confirm-icon-warning";
      case "info":
        return "confirm-icon-info";
      default:
        return "confirm-icon-warning";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "⚠";
    }
  };

  return (
    <div className="confirm-overlay" onClick={handleCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-header">
          <div className={`confirm-icon ${getIconClass()}`}>{getIcon()}</div>
          <h3 className="confirm-title">{title}</h3>
        </div>

        <div className="confirm-body">
          <p className="confirm-message">{message}</p>
        </div>

        <div className="confirm-actions">
          <button className="confirm-btn-cancel" onClick={handleCancel}>
            {cancelText}
          </button>
          <button
            className={`confirm-btn-confirm confirm-btn-${type}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({});

  const showConfirm = (options) => {
    return new Promise((resolve) => {
      setConfig({
        ...options,
        onConfirm: () => {
          setIsOpen(false);
          resolve(true);
        },
        onCancel: () => {
          setIsOpen(false);
          resolve(false);
        },
      });
      setIsOpen(true);
    });
  };

  const confirmDialog = <ConfirmDialog isOpen={isOpen} {...config} />;

  return { showConfirm, confirmDialog };
}

export { ConfirmDialog, useConfirm };
