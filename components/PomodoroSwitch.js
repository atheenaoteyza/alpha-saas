import { TimerIcon } from "lucide-react";

export default function PomodoroSwitch({ setIsOn, isOn }) {
  return (
    <div className="flex items-center gap-4">
      <TimerIcon className={`h-4 w-4 ${isOn ? "text-green-300" : ""}`} />
      <div
        onClick={() => setIsOn(!isOn)}
        className={`w-12 h-6 flex items-center bg-gray-400 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
          isOn ? "bg-green-500" : "bg-gray-400"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            isOn ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
}
