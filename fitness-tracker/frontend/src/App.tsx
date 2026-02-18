import React, { useEffect, useState } from 'react';
import CalendarStrip from './components/CalendarStrip';
import WorkoutCard from './components/WorkoutCard';

// Define the shape of our data
interface Workout {
  id: number;
  title: string;
  category: string;
  image_url: string;
  duration_min: number;
}

function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // Fetch data from backend
  useEffect(() => {
    fetch('http://localhost:8000/todays-plan')
      .then(res => res.json())
      .then(data => setWorkouts(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-brand-bg relative pb-24 shadow-2xl overflow-hidden">
      
      {/* Header */}
      <header className="pt-12 px-6 pb-2">
        <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">
          Kigehi’s Fitness <br />
          Tracker App
        </h1>
      </header>

      {/* Calendar */}
      <CalendarStrip />

      {/* Activity Stats (Hardcoded for UI demo) */}
      <div className="px-6 mb-6 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-pink-100">
          <h3 className="text-sm font-bold text-gray-600 mb-2">Steps</h3>
          <div className="relative w-16 h-16 border-4 border-brand-pink rounded-full flex items-center justify-center mx-auto">
             <span className="font-bold text-brand-dark text-xs">8,540</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-pink-100 flex flex-col justify-center items-center">
          <h3 className="text-sm font-bold text-gray-600 mb-1">Calories</h3>
          <span className="text-2xl font-black text-brand-dark">1,250</span>
          <span className="text-xs text-gray-400">kcal</span>
        </div>
      </div>

      {/* Today's Plan Grid */}
      <div className="px-6">
        <h2 className="text-xl font-bold text-brand-dark mb-4">Today's Plan</h2>
        <div className="grid grid-cols-2 gap-4">
          {workouts.map((workout) => (
            <WorkoutCard 
              key={workout.id}
              title={workout.title}
              image={workout.image_url}
              category={workout.category}
            />
          ))}
        </div>
      </div>

      {/* Floating Start Button */}
      <div className="fixed bottom-20 left-0 right-0 px-8 flex justify-center max-w-md mx-auto">
        <button className="w-full bg-[#C2185B] text-white font-bold text-lg py-4 rounded-full shadow-xl hover:bg-[#AD1457] transition-transform transform hover:scale-105">
          Start Workout
        </button>
      </div>

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 w-full bg-white h-20 border-t border-gray-100 flex justify-around items-center pb-2 text-gray-400 text-xs font-bold">
        <div className="flex flex-col items-center text-brand-pink">
          <span className="text-xl mb-1">🏋️‍♀️</span>
          <span>Workout</span>
        </div>
        <div className="flex flex-col items-center hover:text-brand-pink">
          <span className="text-xl mb-1">🍎</span>
          <span>Nutrition</span>
        </div>
        <div className="flex flex-col items-center hover:text-brand-pink">
          <span className="text-xl mb-1">📊</span>
          <span>Progress</span>
        </div>
        <div className="flex flex-col items-center hover:text-brand-pink">
          <span className="text-xl mb-1">⚙️</span>
          <span>Settings</span>
        </div>
      </nav>

    </div>
  );
}

export default App;