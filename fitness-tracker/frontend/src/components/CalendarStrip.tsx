import React from 'react';

const CalendarStrip = () => {
  const days = [
    { day: "Wed", date: 1, active: false },
    { day: "Thu", date: 1, active: false },
    { day: "Thu", date: 2, active: true }, // Active day
    { day: "Fri", date: 3, active: false },
    { day: "Sat", date: 4, active: false },
  ];

  return (
    <div className="flex justify-between items-center px-4 py-6">
      {days.map((item, index) => (
        <div key={index} 
             className={`flex flex-col items-center justify-center w-14 h-20 rounded-2xl shadow-sm transition-all
             ${item.active 
               ? 'bg-brand-pink text-white transform scale-110 shadow-md' 
               : 'bg-white text-gray-400'}`}>
          <span className="text-xs font-medium mb-1">{item.day}</span>
          <span className={`text-xl font-bold ${item.active ? 'text-white' : 'text-brand-dark'}`}>
            {item.date}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CalendarStrip;