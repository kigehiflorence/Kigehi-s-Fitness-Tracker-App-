import React, { useState, useEffect } from 'react';

interface DayData {
  day: string;
  date: number;
  active: boolean;
}

const CalendarStrip = () => {
  const [days, setDays] = useState<DayData[]>([]);

  useEffect(() => {
    const generateDays = () => {
      const generatedDays = [];
      const today = new Date();
      for (let i = -2; i <= 2; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        generatedDays.push({
          day: targetDate.toLocaleDateString('en-US', { weekday: 'short' }), 
          date: targetDate.getDate(), 
          active: i === 0, 
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
          className={`flex flex-col items-center justify-center rounded-3xl shadow-sm transition-all duration-300 ${
            item.active 
              ? 'bg-[#C2185B] w-14 h-[90px] shadow-md transform scale-105' 
              : 'bg-white dark:bg-gray-800 w-[52px] h-[75px]'           
          }`}
        >
          <span className={`text-xs font-semibold mb-1 ${
            item.active ? 'text-pink-100' : 'text-slate-400 dark:text-gray-400'
          }`}>
            {item.day}
          </span>
          <span className={`text-2xl font-black ${
            item.active ? 'text-white' : 'text-[#1A1A1A] dark:text-white'
          }`}>
            {item.date}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CalendarStrip;