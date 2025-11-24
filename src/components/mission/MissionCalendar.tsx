"use client";

import { DocumentData } from "firebase/firestore";

type MissionCalendarProps = {
  missionsByDate: { [date: string]: DocumentData[] };
  selectedDate: string;
  setSelectedDate: (date: string) => void;
};

export function MissionCalendar({ missionsByDate, selectedDate, setSelectedDate }: MissionCalendarProps) {
  const today = new Date();
  const selected = selectedDate ? new Date(selectedDate) : today;
  const year = selected.getFullYear();
  const month = selected.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) week.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  function fmt(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-[#7C5E3C] text-lg">
          {selected.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 rounded hover:bg-[#F5E8D3]"
            onClick={() => {
              const prevMonth = new Date(year, month - 1, 1);
              setSelectedDate(fmt(prevMonth.getFullYear(), prevMonth.getMonth(), 1));
            }}
            aria-label="Previous month"
          >
            &lt;
          </button>
          <button
            className="px-2 py-1 rounded hover:bg-[#F5E8D3]"
            onClick={() => {
              const nextMonth = new Date(year, month + 1, 1);
              setSelectedDate(fmt(nextMonth.getFullYear(), nextMonth.getMonth(), 1));
            }}
            aria-label="Next month"
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-[#BFA181] mb-1">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((day, idx) => {
          if (day === null) return <div key={idx} />;
          const dateStr = fmt(year, month, day);
          const hasMissions = missionsByDate[dateStr]?.length > 0;
          const isSelected = selectedDate === dateStr;
          return (
            <button
              key={idx}
              className={`aspect-square rounded-lg text-sm font-medium transition
                ${
                  isSelected
                    ? "bg-[#BFA181] text-white"
                    : "bg-[#F9F5EF] text-[#7C5E3C]"
                }
                ${hasMissions ? "border-2 border-[#BFA181]" : ""}
                hover:bg-[#BFA181]/80`}
              onClick={() => setSelectedDate(dateStr)}
            >
              {day}
              {hasMissions && (
                <span className="block w-2 h-2 mx-auto mt-1 rounded-full bg-[#BFA181]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

