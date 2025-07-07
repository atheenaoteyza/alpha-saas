import { SquareIcon } from "lucide-react";
import getAllDaysInCurrentYear from "@/utils/getAllDaysInCurrentYear";

export default function Calendar({ dates: filledDates = [] }) {
  const weeks = getAllDaysInCurrentYear(); // Array of weeks, each with 7 days (Sunday–Saturday)

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getMonthLabel = (date) =>
    date ? monthNames[new Date(date).getMonth()] : "";

  let lastRenderedMonth = "";

  return (
    <div>
      {/* Month labels row */}
      <div className="flex ml-8 mb-1 text-xs text-white">
        <div className="w-4" /> {/* Spacer for weekday labels */}
        {weeks.map((week, index) => {
          const firstDay = week.find(
            (d) =>
              typeof d === "string" &&
              /^\d{4}-\d{2}-\d{2}$/.test(d) &&
              new Date(d).getFullYear() === new Date().getFullYear()
          );
          const month = getMonthLabel(firstDay);
          const shouldRender = month && month !== lastRenderedMonth;

          if (shouldRender) lastRenderedMonth = month;

          return (
            <div key={index} className="w-4 text-center">
              {shouldRender ? month : ""}
            </div>
          );
        })}
      </div>

      <div className="flex">
        {/* Weekday labels */}
        <div className="flex flex-col text-xs text-white mr-1 h-full justify-between">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
            <div key={idx} className="h-4 leading-4 text-center">
              {idx % 2 === 0 ? day : ""}
            </div>
          ))}
        </div>

        {/* Grid: Weeks as columns, days as rows */}
        <div className="flex gap-[2px]">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-[2px]">
              {week.map((day, dayIdx) => {
                const isFilled = day && filledDates.includes(day);
                return (
                  <SquareIcon
                    key={dayIdx}
                    className={`w-4 h-4 stroke-none ${
                      isFilled ? "fill-blue-500" : "fill-gray-300"
                    }`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
