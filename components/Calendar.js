import { SquareIcon } from "lucide-react";
import getAllDaysInCurrentYear from "@/utils/getAllDaysInCurrentYear";
import { useEffect, useRef, useState } from "react";
import CalendarIcon from "@/assets/CalendarIcon";

export default function Calendar({ dates: filledDates = [] }) {
  const weeks = getAllDaysInCurrentYear();
  const [modal, setModal] = useState(false);

  const modalRef = useRef(null);
  const iconRef = useRef(null); // ref for the icon trigger

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        modal &&
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modal]);

  return (
    <div>
      {/* Trigger */}
      <div
        ref={iconRef}
        onClick={() => setModal((prev) => !prev)}
        className="p-3 cursor-pointer border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.7)] hover:bg-[rgba(20,20,20,1)]"
      >
        <div className="flex items-center">
          <CalendarIcon className="h-8 w-8" />
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <section
          ref={modalRef}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 hover:border border-gray-600 rounded-2xl bg-[rgba(20,20,20,0.9)] hover:bg-[rgba(20,20,20,1)] "
        >
          <div className="overflow-x-auto max-w-[90vw]">
            {/* Month labels row */}
            <div className="flex ml-8 mb-1 text-xs text-white ">
              <div className="w-4 shrink-0" />{" "}
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
                  <div key={index} className="w-4 text-center shrink-0">
                    {shouldRender ? month : ""}
                  </div>
                );
              })}
            </div>

            <div className="flex">
              <div className="flex flex-col text-xs text-white mr-1 h-full justify-between">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                  <div key={idx} className="h-4 leading-4 text-center">
                    {idx % 2 === 0 ? day : ""}
                  </div>
                ))}
              </div>

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
        </section>
      )}
    </div>
  );
}
