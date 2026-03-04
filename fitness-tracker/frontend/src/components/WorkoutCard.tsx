import React from 'react';

interface Props {
  title: string;
  image: string; 
  category: string;
}

const WorkoutCard: React.FC<Props> = ({ title, image, category }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-pink-100 dark:border-gray-700 flex flex-col items-center justify-between h-40 transition-colors duration-300">
      <div className="text-4xl mb-2">{image}</div>
      <div className="text-center">
        <h3 className="font-bold text-brand-dark dark:text-white text-sm leading-tight mb-1">{title}</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500">{category}</p>
      </div>
      <button className="mt-2 text-[10px] font-bold text-brand-pink border border-pink-200 dark:border-gray-600 rounded-full px-4 py-1 hover:bg-pink-50 dark:hover:bg-gray-700 transition-colors">
        Learn more
      </button>
    </div>
  );
};

export default WorkoutCard;