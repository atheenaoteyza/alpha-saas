import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import SpinningRing from "@/assets/SpinningRing";
export default function DoneButton({ handleComplete, isLoading }) {
  return (
    <>
      <button
        className="p-4 border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)]"
        onClick={handleComplete}
      >
        {isLoading ? <SpinningRing /> : <CheckIcon />}
      </button>
    </>
  );
}
