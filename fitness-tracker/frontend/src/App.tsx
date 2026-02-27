import React, { useEffect, useState } from 'react';
import CalendarStrip from './components/CalendarStrip';
import WorkoutCard from './components/WorkoutCard';

interface Workout {
  id: number;
  title: string;
  category: string;
  image_url: string;
  duration_min: number;
}

function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [activeTab, setActiveTab] = useState('workout');
  const [nutritionGoal, setNutritionGoal] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/todays-plan')
      .then(res => res.json())
      .then(data => setWorkouts(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-brand-bg relative pb-28 shadow-2xl overflow-y-auto">
      
      {/* Header */}
      <header className="pt-12 px-6 pb-2">
        <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">
          Kigehi’s Fitness <br />
          Tracker App
        </h1>
      </header>

      {/* =========================================
          WORKOUT TAB (Home)
      ========================================= */}
      {activeTab === 'workout' && (
        <div className="animate-fade-in">
          <CalendarStrip />

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

          <div className="px-6 mt-8 mb-4">
            <button className="w-full bg-[#C2185B] text-white font-bold text-lg py-4 rounded-full shadow-xl hover:bg-[#AD1457] transition-transform transform hover:scale-105">
              Start Workout
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          NUTRITION TAB
      ========================================= */}
      {activeTab === 'nutrition' && (
        <div className="px-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-brand-dark mb-6 mt-4">Nutrition Plan</h2>

          {nutritionGoal === null ? (
            <div className="flex flex-col gap-4">
              <p className="text-gray-600 mb-2">What is your primary fitness goal?</p>
              
              <button 
                onClick={() => setNutritionGoal('lose')}
                className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 hover:border-brand-pink transition-colors text-left flex items-center"
              >
                <span className="text-4xl mr-4">📉</span>
                <div>
                  <h3 className="font-bold text-brand-dark text-lg">Lose Weight</h3>
                  <p className="text-sm text-gray-500">Calorie deficit & high protein</p>
                </div>
              </button>

              <button 
                onClick={() => setNutritionGoal('gain')}
                className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 hover:border-brand-pink transition-colors text-left flex items-center"
              >
                <span className="text-4xl mr-4">📈</span>
                <div>
                  <h3 className="font-bold text-brand-dark text-lg">Gain Weight</h3>
                  <p className="text-sm text-gray-500">Calorie surplus & muscle building</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100">
              {/* Back Button for Nutrition Goal */}
              <button 
                onClick={() => setNutritionGoal(null)}
                className="text-sm text-gray-500 hover:text-brand-pink font-bold flex items-center mb-6"
              >
                ← Back to Goals
              </button>

              <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="font-bold text-brand-dark text-xl">
                  {nutritionGoal === 'lose' ? '🔥 Weight Loss Plan' : '💪 Muscle Gain Plan'}
                </h3>
              </div>

              {nutritionGoal === 'lose' ? (
                <ul className="space-y-4 text-sm text-gray-700">
                  <li><strong className="text-brand-dark">🍳 Breakfast:</strong> Oatmeal with mixed berries (300 kcal)</li>
                  <li><strong className="text-brand-dark">🥗 Lunch:</strong> Grilled chicken salad with light vinaigrette (400 kcal)</li>
                  <li><strong className="text-brand-dark">🍎 Snack:</strong> Greek yogurt with almonds (150 kcal)</li>
                  <li><strong className="text-brand-dark">🐟 Dinner:</strong> Baked salmon with steamed asparagus (450 kcal)</li>
                  <li className="pt-4 text-center font-bold text-brand-pink text-lg border-t border-gray-50 mt-4">Total: ~1,300 kcal</li>
                </ul>
              ) : (
                <ul className="space-y-4 text-sm text-gray-700">
                  <li><strong className="text-brand-dark">🍳 Breakfast:</strong> 3 Scrambled eggs, whole wheat toast, avocado (600 kcal)</li>
                  <li><strong className="text-brand-dark">🍗 Lunch:</strong> Chicken breast, brown rice, and black beans (750 kcal)</li>
                  <li><strong className="text-brand-dark">🍌 Snack:</strong> Peanut butter & banana protein smoothie (400 kcal)</li>
                  <li><strong className="text-brand-dark">🥩 Dinner:</strong> Steak, sweet potato, and broccoli (800 kcal)</li>
                  <li className="pt-4 text-center font-bold text-brand-pink text-lg border-t border-gray-50 mt-4">Total: ~2,550 kcal</li>
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================
          PROGRESS TAB
      ========================================= */}
      {activeTab === 'progress' && (
        <div className="px-6 animate-fade-in">
          {/* Back Button */}
          <button 
            onClick={() => setActiveTab('workout')}
            className="text-sm text-gray-500 hover:text-brand-pink font-bold flex items-center mb-4 mt-4"
          >
            ← Back to Home
          </button>
          
          <h2 className="text-2xl font-bold text-brand-dark mb-6">Your Progress</h2>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 mb-4">
             <h3 className="font-bold text-gray-600 mb-2">Weight Journey</h3>
             <p className="text-3xl font-black text-brand-pink mb-1">🎉 -2.5 kg</p>
             <p className="text-sm text-gray-500">Amazing! You have lost 2.5 kg this month. Keep up the great work!</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100">
            <h3 className="font-bold text-gray-600 mb-4">Activity (This Week)</h3>
            <div className="flex justify-between items-end h-32 gap-2 border-b border-gray-100 pb-2">
              {/* Mock Bar Chart using CSS */}
              <div className="w-1/6 bg-pink-100 rounded-t-md h-1/2"></div>
              <div className="w-1/6 bg-brand-pink rounded-t-md h-full"></div>
              <div className="w-1/6 bg-pink-100 rounded-t-md h-3/4"></div>
              <div className="w-1/6 bg-pink-200 rounded-t-md h-2/3"></div>
              <div className="w-1/6 bg-brand-pink rounded-t-md h-5/6"></div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
               <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          SETTINGS TAB
      ========================================= */}
      {activeTab === 'settings' && (
        <div className="px-6 animate-fade-in">
          {/* Back Button */}
          <button 
            onClick={() => setActiveTab('workout')}
            className="text-sm text-gray-500 hover:text-brand-pink font-bold flex items-center mb-4 mt-4"
          >
            ← Back to Home
          </button>

          <h2 className="text-2xl font-bold text-brand-dark mb-6">Settings</h2>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 flex flex-col gap-6">
            
            {/* Theme Toggle */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-brand-dark">Dark Mode</h3>
                <p className="text-xs text-gray-500">Switch app theme</p>
              </div>
              {/* Fake Toggle Switch (Off) */}
              <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
              </div>
            </div>
            
            <hr className="border-gray-50" />
            
            {/* Music Toggle */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-brand-dark">Workout Music</h3>
                <p className="text-xs text-gray-500">Play background tracks</p>
              </div>
              {/* Fake Toggle Switch (On) */}
              <div className="w-12 h-6 bg-brand-pink rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
              </div>
            </div>
            
            <hr className="border-gray-50" />
            
            {/* Notifications Toggle */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-brand-dark">Notifications</h3>
                <p className="text-xs text-gray-500">Daily workout reminders</p>
              </div>
              {/* Fake Toggle Switch (On) */}
              <div className="w-12 h-6 bg-brand-pink rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================
          BOTTOM NAV
      ========================================= */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white h-20 border-t border-gray-100 flex justify-around items-center pb-2 text-xs font-bold z-50">
        <div onClick={() => setActiveTab('workout')} className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'workout' ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-pink'}`}>
          <span className="text-xl mb-1">🏋️‍♀️</span><span>Workout</span>
        </div>
        <div onClick={() => setActiveTab('nutrition')} className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'nutrition' ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-pink'}`}>
          <span className="text-xl mb-1">🍎</span><span>Nutrition</span>
        </div>
        <div onClick={() => setActiveTab('progress')} className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'progress' ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-pink'}`}>
          <span className="text-xl mb-1">📊</span><span>Progress</span>
        </div>
        <div onClick={() => setActiveTab('settings')} className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'settings' ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-pink'}`}>
          <span className="text-xl mb-1">⚙️</span><span>Settings</span>
        </div>
      </nav>

    </div>
  );
}

export default App;