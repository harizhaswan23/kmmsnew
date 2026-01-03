import { useToast } from "./use-toast";

export function Toaster() {
  const { currentToast } = useToast();

  if (!currentToast) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border shadow-lg rounded-lg p-4 max-w-sm">
      <p className="font-semibold">{currentToast.title}</p>
      <p className="text-sm text-gray-600">
        {currentToast.description}
      </p>
    </div>
  );
}
