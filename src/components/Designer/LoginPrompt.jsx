import { X, AlertTriangle } from "lucide-react";

export default function LoginPrompt({ onClose, closable = true }) {
  const login = () => {
    // Navigate to login page without requiring Router context
    window.location.href = "/login";
    if (onClose) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4"
      aria-hidden={false}
    >
      <div
        className="bg-white border border-gray-200 p-6 rounded-xl max-w-sm w-full shadow-lg"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
            <AlertTriangle size={18} className="text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900">
              Login required
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Please login to access this feature.
            </p>
          </div>
          {closable && (
            <button
              onClick={onClose}
              className="ml-3 p-1 text-gray-400 hover:text-gray-600 rounded"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={login}
            className="flex-1 py-2 bg-primary text-white rounded-md font-medium"
          >
            Login
          </button>
          {closable && (
            <button
              onClick={onClose}
              className="py-2 px-3 bg-white border border-gray-200 rounded-md text-sm text-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
