import React from 'react';

interface Props {
  title: string;
  image: string; // Emoji for now
  category: string;
}

const WorkoutCard: React.FC<Props> = ({ title, image, category }) => {
  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-pink-100 flex flex-col items-center justify-between h-40">
      {/* Icon Area */}
      <div className="text-4xl mb-2">{image}</div>
      
      {/* Text Area */}
      <div className="text-center">
        <h3 className="font-bold text-brand-dark text-sm leading-tight mb-1">{title}</h3>
        <p className="text-xs text-gray-400">{category}</p>
      </div>

      {/* Button */}
      <button className="mt-2 text-[10px] font-bold text-brand-pink border border-pink-200 rounded-full px-4 py-1 hover:bg-pink-50 transition-colors">
        Learn more
      </button>
    </div>
  );
};

export default WorkoutCard;