import React from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import "./Toast.css";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  let icon;
  switch (type) {
    case "success":
      icon = <AiOutlineCheckCircle className="toast-icon" />;
      break;
    case "error":
      icon = <AiOutlineCloseCircle className="toast-icon" />;
      break;
    default:
      icon = null;
  }

  return (
    <div className={`toast ${type}`}>
      {icon}
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default Toast;
