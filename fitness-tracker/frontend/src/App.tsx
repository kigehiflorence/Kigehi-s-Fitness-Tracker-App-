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

  // Workout Flow States
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [workoutStep, setWorkoutStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  // NEW: Live Timer States
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetch('http://localhost:8000/todays-plan')
      .then(res => res.json())
      .then(data => setWorkouts(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // NEW: Timer Countdown Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false); // Stop when it hits 0
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Helper to format time (e.g., 45 -> "00:45", 65 -> "01:05")
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Helper to trigger the timer
  const handleStartTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  };
  // NEW: Function to send data to Python
  const handleCompleteWorkout = async () => {
    // 1. Figure out what workout they just did
    const workoutName = `${selectedGoal === 'lose' ? 'Fat Burn' : 'Strength'}: ${selectedTarget === 'upper' ? 'Upper Body' : 'Lower Body'}`;
    const estimatedCalories = selectedGoal === 'lose' ? 350 : 200;

    // 2. Send it to the backend
    try {
      await fetch('http://localhost:8000/log-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout_type: workoutName,
          duration: 30, // assuming a 30 min workout
          calories: estimatedCalories
        })
      });
      alert(`Great job! Your ${workoutName} workout was saved to the database! 🎉`);
    } catch (error) {
      console.error("Failed to save workout:", error);
    }

    // 3. Reset the UI back to the dashboard
    setIsWorkoutStarted(false);
    setWorkoutStep(1);
    setTimeLeft(null);
    setIsTimerRunning(false);
  };

  const renderCustomRoutine = () => {
    let routine: any[] = [];
    if (selectedGoal === 'lose' && selectedTarget === 'upper') {
      routine = [
        { name: "Jumping Jacks", sets: "45 secs", icon: "⏱️", time: 45 },
        { name: "Mountain Climbers", sets: "30 secs", icon: "🏔️", time: 30 },
        { name: "Push-ups", sets: "12 reps", icon: "💪", time: null },
        { name: "Plank Shoulder Taps", sets: "40 secs", icon: "🖐️", time: 40 }
      ];
    } else if (selectedGoal === 'lose' && selectedTarget === 'lower') {
      routine = [
        { name: "High Knees", sets: "45 secs", icon: "🏃‍♀️", time: 45 },
        { name: "Squat Jumps", sets: "15 reps", icon: "⚡", time: null },
        { name: "Alternating Lunges", sets: "20 reps", icon: "🦵", time: null },
        { name: "Bicycle Crunches", sets: "30 secs", icon: "🚲", time: 30 }
      ];
    } else if (selectedGoal === 'build' && selectedTarget === 'upper') {
      routine = [
        { name: "Pike Push-ups", sets: "8-10 reps", icon: "⛺", time: null },
        { name: "Tricep Dips", sets: "12 reps", icon: "🪑", time: null },
        { name: "Superman Holds", sets: "30 secs", icon: "🦸‍♀️", time: 30 },
        { name: "Plank to Push-up", sets: "10 reps", icon: "🔥", time: null }
      ];
    } else if (selectedGoal === 'build' && selectedTarget === 'lower') {
      routine = [
        { name: "Bulgarian Split Squats", sets: "10/leg", icon: "🦵", time: null },
        { name: "Glute Bridges", sets: "15 reps", icon: "🌉", time: null },
        { name: "Slow Tempo Squats", sets: "12 reps", icon: "🏋️‍♀️", time: null },
        { name: "Wall Sit", sets: "60 secs", icon: "🧱", time: 60 }
      ];
    }

    return (
      <div className="space-y-3 relative pb-20">
        {routine.map((exercise, index) => (
          <div key={index} className="flex items-center justify-between bg-pink-50 p-4 rounded-2xl border border-pink-100">
            <div className="flex items-center gap-4">
              <span className="text-2xl">{exercise.icon}</span>
              <div>
                <h4 className="font-bold text-brand-dark">{exercise.name}</h4>
                <p className="text-xs text-gray-500">{exercise.sets}</p>
              </div>
            </div>
            
            {/* If the exercise has a time limit, show a timer button. Otherwise, show a checkmark */}
            {exercise.time ? (
              <button 
                onClick={() => handleStartTimer(exercise.time)}
                className="text-xs bg-white border border-brand-pink text-brand-pink font-bold px-3 py-1.5 rounded-full hover:bg-brand-pink hover:text-white transition-colors shadow-sm"
              >
                Start Timer
              </button>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-brand-pink flex items-center justify-center cursor-pointer hover:bg-brand-pink hover:text-white transition-colors text-brand-pink font-bold">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-brand-bg relative pb-28 shadow-2xl overflow-y-auto">
      <header className="pt-12 px-6 pb-2">
        <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">
          Kigehi’s Fitness <br /> Tracker App
        </h1>
      </header>

      {/* --- WORKOUT TAB --- */}
      {activeTab === 'workout' && (
        <div className="animate-fade-in">
          
          {!isWorkoutStarted && (
            <>
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
                    <WorkoutCard key={workout.id} title={workout.title} image={workout.image_url} category={workout.category} />
                  ))}
                </div>
              </div>

              <div className="px-6 mt-8 mb-4">
                <button onClick={() => setIsWorkoutStarted(true)} className="w-full bg-[#C2185B] text-white font-bold text-lg py-4 rounded-full shadow-xl hover:bg-[#AD1457] transition-transform transform hover:scale-105">
                  Start Workout
                </button>
              </div>
            </>
          )}

          {isWorkoutStarted && (
            <div className="px-6 mt-4 animate-fade-in relative">
              {workoutStep === 1 && (
                <div>
                  <button onClick={() => setIsWorkoutStarted(false)} className="text-sm text-gray-500 hover:text-brand-pink font-bold flex items-center mb-6">← Back to Dashboard</button>
                  <h2 className="text-2xl font-bold text-brand-dark mb-2">What is your focus?</h2>
                  <p className="text-gray-500 mb-6 text-sm">Select your primary fitness goal for this session.</p>
                  <div className="flex flex-col gap-4">
                    <button onClick={() => { setSelectedGoal('lose'); setWorkoutStep(2); }} className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 hover:border-brand-pink transition-colors text-left flex items-center"><span className="text-4xl mr-4">📉</span><div><h3 className="font-bold text-brand-dark text-lg">Lose Fat</h3><p className="text-sm text-gray-500">High intensity, sweat-inducing</p></div></button>
                    <button onClick={() => { setSelectedGoal('build'); setWorkoutStep(2); }} className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 hover:border-brand-pink transition-colors text-left flex items-center"><span className="text-4xl mr-4">💪</span><div><h3 className="font-bold text-brand-dark text-lg">Build Muscle</h3><p className="text-sm text-gray-500">Strength and hypertrophy</p></div></button>
                  </div>
                </div>
              )}

              {workoutStep === 2 && (
                <div>
                  <button onClick={() => setWorkoutStep(1)} className="text-sm text-gray-500 hover:text-brand-pink font-bold flex items-center mb-6">← Back to Goal</button>
                  <h2 className="text-2xl font-bold text-brand-dark mb-2">Target Area</h2>
                  <p className="text-gray-500 mb-6 text-sm">Which part of your body are you working on?</p>
                  <div className="flex flex-col gap-4">
                    <button onClick={() => { setSelectedTarget('upper'); setWorkoutStep(3); }} className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 hover:border-brand-pink transition-colors text-left flex items-center"><span className="text-4xl mr-4">🏋️‍♀️</span><div><h3 className="font-bold text-brand-dark text-lg">Upper Body</h3><p className="text-sm text-gray-500">Arms, chest, back, and core</p></div></button>
                    <button onClick={() => { setSelectedTarget('lower'); setWorkoutStep(3); }} className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 hover:border-brand-pink transition-colors text-left flex items-center"><span className="text-4xl mr-4">🦵</span><div><h3 className="font-bold text-brand-dark text-lg">Lower Body</h3><p className="text-sm text-gray-500">Legs, glutes, and calves</p></div></button>
                  </div>
                </div>
              )}

              {workoutStep === 3 && (
                <div>
                  <button onClick={() => { setWorkoutStep(2); setTimeLeft(null); setIsTimerRunning(false); }} className="text-sm text-gray-500 hover:text-brand-pink font-bold flex items-center mb-6">
                    ← Back to Target Area
                  </button>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 relative">
                    <div className="mb-6 border-b border-gray-100 pb-4">
                      <span className="text-xs font-bold text-brand-pink uppercase tracking-wider">Your Custom Routine</span>
                      <h3 className="font-bold text-brand-dark text-xl mt-1">
                        {selectedGoal === 'lose' ? 'Fat Burn' : 'Strength'}: {selectedTarget === 'upper' ? 'Upper Body' : 'Lower Body'}
                      </h3>
                    </div>
                    
                    {renderCustomRoutine()}

                    <button 
                      onClick={() => {
                        setIsWorkoutStarted(false);
                        setWorkoutStep(1);
                        setTimeLeft(null);
                        setIsTimerRunning(false);
                      }}
                      className="w-full mt-6 bg-[#C2185B] text-white font-bold py-3 rounded-full shadow-md hover:bg-[#AD1457] transition-colors"
                    >
                      Complete Workout
                    </button>
                  </div>

                  {/* FLOATING TIMER OVERLAY */}
                  {timeLeft !== null && (
                    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-50 animate-fade-in border-2 border-brand-pink">
                      <span className="text-2xl font-mono font-bold tracking-widest">{formatTime(timeLeft)}</span>
                      <div className="flex gap-2 border-l border-gray-600 pl-4">
                        <button 
                          onClick={() => setIsTimerRunning(!isTimerRunning)} 
                          className="text-sm font-bold hover:text-brand-pink"
                        >
                          {isTimerRunning ? '⏸ Pause' : '▶ Play'}
                        </button>
                        <button 
                          onClick={() => { setTimeLeft(null); setIsTimerRunning(false); }} 
                          className="text-sm text-gray-400 hover:text-white ml-2"
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- NUTRITION TAB (Unchanged) --- */}
      {activeTab === 'nutrition' && (
        <div className="px-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-brand-dark mb-6 mt-4">Nutrition Plan</h2>
          {nutritionGoal === null ? (
            <div className="flex flex-col gap-4">
              <p className="text-gray-600 mb-2">What is your primary fitness goal?</p>
              <button onClick={() => setNutritionGoal('lose')} className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 hover:border-brand-pink transition-colors text-left flex items-center"><span className="text-4xl mr-4">📉</span><div><h3 className="font-bold text-brand-dark text-lg">Lose Weight</h3><p className="text-sm text-gray-500">Calorie deficit & high protein</p></div></button>
              <button onClick={() => setNutritionGoal('gain')} className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 hover:border-brand-pink transition-colors text-left flex items-center"><span className="text-4xl mr-4">📈</span><div><h3 className="font-bold text-brand-dark text-lg">Gain Weight</h3><p className="text-sm text-gray-500">Calorie surplus & muscle building</p></div></button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100">
              <button onClick={() => setNutritionGoal(null)} className="text-sm text-gray-500 hover:text-brand-pink font-bold flex items-center mb-6">← Back to Goals</button>
              <div className="mb-6 border-b border-gray-100 pb-4"><h3 className="font-bold text-brand-dark text-xl">{nutritionGoal === 'lose' ? '🔥 Weight Loss Plan' : '💪 Muscle Gain Plan'}</h3></div>
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

      {/* --- PROGRESS TAB (Unchanged) --- */}
      {activeTab === 'progress' && (
        <div className="px-6 animate-fade-in">
          <button onClick={() => setActiveTab('workout')} className="text-sm text-gray-500 hover:text-brand-pink font-bold flex items-center mb-4 mt-4">← Back to Home</button>
          <h2 className="text-2xl font-bold text-brand-dark mb-6">Your Progress</h2>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 mb-4"><h3 className="font-bold text-gray-600 mb-2">Weight Journey</h3><p className="text-3xl font-black text-brand-pink mb-1">🎉 -2.5 kg</p><p className="text-sm text-gray-500">Amazing! You have lost 2.5 kg this month. Keep up the great work!</p></div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100"><h3 className="font-bold text-gray-600 mb-4">Activity (This Week)</h3><div className="flex justify-between items-end h-32 gap-2 border-b border-gray-100 pb-2"><div className="w-1/6 bg-pink-100 rounded-t-md h-1/2"></div><div className="w-1/6 bg-brand-pink rounded-t-md h-full"></div><div className="w-1/6 bg-pink-100 rounded-t-md h-3/4"></div><div className="w-1/6 bg-pink-200 rounded-t-md h-2/3"></div><div className="w-1/6 bg-brand-pink rounded-t-md h-5/6"></div></div><div className="flex justify-between mt-2 text-xs font-bold text-gray-400"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span></div></div>
        </div>
      )}

      {/* --- SETTINGS TAB (Unchanged) --- */}
      {activeTab === 'settings' && (
        <div className="px-6 animate-fade-in">
          <button onClick={() => setActiveTab('workout')} className="text-sm text-gray-500 hover:text-brand-pink font-bold flex items-center mb-4 mt-4">← Back to Home</button>
          <h2 className="text-2xl font-bold text-brand-dark mb-6">Settings</h2>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 flex flex-col gap-6">
            <div className="flex justify-between items-center"><div><h3 className="font-bold text-brand-dark">Dark Mode</h3><p className="text-xs text-gray-500">Switch app theme</p></div><div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div></div></div><hr className="border-gray-50" />
            <div className="flex justify-between items-center"><div><h3 className="font-bold text-brand-dark">Workout Music</h3><p className="text-xs text-gray-500">Play background tracks</p></div><div className="w-12 h-6 bg-brand-pink rounded-full relative cursor-pointer"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div></div></div><hr className="border-gray-50" />
            <div className="flex justify-between items-center"><div><h3 className="font-bold text-brand-dark">Notifications</h3><p className="text-xs text-gray-500">Daily workout reminders</p></div><div className="w-12 h-6 bg-brand-pink rounded-full relative cursor-pointer"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div></div></div>
          </div>
        </div>
      )}

      {/* --- BOTTOM NAV --- */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white h-20 border-t border-gray-100 flex justify-around items-center pb-2 text-xs font-bold z-50">
        <div onClick={() => { setActiveTab('workout'); setIsWorkoutStarted(false); setTimeLeft(null); setIsTimerRunning(false); }} className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'workout' ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-pink'}`}><span className="text-xl mb-1">🏋️‍♀️</span><span>Workout</span></div>
        <div onClick={() => { setActiveTab('nutrition'); setIsWorkoutStarted(false); }} className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'nutrition' ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-pink'}`}><span className="text-xl mb-1">🍎</span><span>Nutrition</span></div>
        <div onClick={() => { setActiveTab('progress'); setIsWorkoutStarted(false); }} className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'progress' ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-pink'}`}><span className="text-xl mb-1">📊</span><span>Progress</span></div>
        <div onClick={() => { setActiveTab('settings'); setIsWorkoutStarted(false); }} className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'settings' ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-pink'}`}><span className="text-xl mb-1">⚙️</span><span>Settings</span></div>
      </nav>

    </div>
  );
}

export default App;