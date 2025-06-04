import { CheckIcon } from "lucide-react";
export default function DoneButton({ handleComplete }) {
  return (
    <>
      <button
        className="p-4 border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)]"
        onClick={handleComplete}
      >
        <CheckIcon />
      </button>
    </>
  );
}
