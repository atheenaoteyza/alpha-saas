import { SquareIcon } from "lucide-react";
import getAllDaysInCurrentYear from "@/utils/getAllDaysInCurrentYear";

export default function Calendar() {
  const dates = getAllDaysInCurrentYear();

  return (
    <>
      <div class="flex flex-wrap">
        {dates.map((day) => {
          console.log("KEY (day):", day);
          return <SquareIcon key={day} className="fill-blue-500 rounded" />;
        })}
      </div>
    </>
  );
}
