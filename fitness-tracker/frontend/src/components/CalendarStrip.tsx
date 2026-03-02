import React, { useState, useEffect } from 'react';

interface DayData {
  day: string;
  date: number;
  active: boolean;
}

const CalendarStrip = () => {
  const [days, setDays] = useState<DayData[]>([]);

  useEffect(() => {
    // Function to generate the current week dynamically
    const generateDays = () => {
      const generatedDays = [];
      const today = new Date();

      // We want 5 days: 2 days ago, yesterday, TODAY, tomorrow, 2 days from now
      for (let i = -2; i <= 2; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);

        generatedDays.push({
          day: targetDate.toLocaleDateString('en-US', { weekday: 'short' }), // e.g., "Mon", "Tue"
          date: targetDate.getDate(), // e.g., 1, 2, 3
          active: i === 0, // i === 0 is exactly "today"
        });
      }
      return generatedDays;
    };

    setDays(generateDays());
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-6">
      {days.map((item, index) => (
        <div 
          key={index} 
          className={`flex flex-col items-center justify-center rounded-3xl shadow-sm transition-all ${
            item.active 
              ? 'bg-[#C2185B] w-14 h-[90px] shadow-md transform scale-105' 
              : 'bg-white w-[52px] h-[75px]'           
          }`}
        >
          {/* Day Text (Wed, Thu, etc.) */}
          <span className={`text-xs font-semibold mb-1 ${
            item.active ? 'text-pink-100' : 'text-slate-400'
          }`}>
            {item.day}
          </span>
          
          {/* Number Text (1, 2, 3, etc.) */}
          <span className={`text-2xl font-black ${
            item.active ? 'text-white' : 'text-[#1A1A1A]'
          }`}>
            {item.date}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CalendarStrip;