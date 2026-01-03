import * as React from "react";

const ToastContext = React.createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = React.useState(null);

  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return {
    toast: ({ title, description, variant }) => {
      context.setToast({ title, description, variant });
      setTimeout(() => context.setToast(null), 3000);
    },
    currentToast: context.toast,
  };
}
