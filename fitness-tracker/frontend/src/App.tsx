import React, { useEffect, useState, useRef } from 'react';
import CalendarStrip from './components/CalendarStrip';
import WorkoutCard from './components/WorkoutCard';

interface Workout { id: number; title: string; category: string; image_url: string; duration_min: number; }
interface HistoryLog { id: number; workout_type: string; duration: number; calories: number; date: string; }

// 7-Day Nutrition Dictionary
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const nutritionPlanData: Record<string, any> = {
  Monday: { lose: { break: "Oatmeal & Berries (300 kcal)", lunch: "Chicken Salad (400 kcal)", snack: "Almonds (150 kcal)", dinner: "Baked Salmon (450 kcal)", total: "~1,300 kcal" }, gain: { break: "3 Eggs & Toast (600 kcal)", lunch: "Chicken & Rice (750 kcal)", snack: "Protein Shake (400 kcal)", dinner: "Steak & Potatoes (800 kcal)", total: "~2,550 kcal" } },
  Tuesday: { lose: { break: "Greek Yogurt (250 kcal)", lunch: "Turkey Wrap (350 kcal)", snack: "Apple & Peanut Butter (200 kcal)", dinner: "Grilled Tofu (400 kcal)", total: "~1,200 kcal" }, gain: { break: "Pancakes & Bacon (700 kcal)", lunch: "Beef Burrito (800 kcal)", snack: "Trail Mix (350 kcal)", dinner: "Pasta Bolognese (850 kcal)", total: "~2,700 kcal" } },
  Wednesday: { lose: { break: "Smoothie Bowl (300 kcal)", lunch: "Quinoa Salad (350 kcal)", snack: "Carrot Sticks & Hummus (150 kcal)", dinner: "Chicken Stir-fry (450 kcal)", total: "~1,250 kcal" }, gain: { break: "Oatmeal with Peanut Butter (650 kcal)", lunch: "Tuna Sandwich (700 kcal)", snack: "Greek Yogurt & Nuts (450 kcal)", dinner: "Roast Chicken & Sweet Potato (800 kcal)", total: "~2,600 kcal" } },
  Thursday: { lose: { break: "Avocado Toast (300 kcal)", lunch: "Lentil Soup (350 kcal)", snack: "Hard-boiled Egg (70 kcal)", dinner: "Shrimp Tacos (480 kcal)", total: "~1,200 kcal" }, gain: { break: "Bagel with Cream Cheese & Salmon (700 kcal)", lunch: "Chicken Alfredo (850 kcal)", snack: "Protein Bar (300 kcal)", dinner: "Pork Chops & Rice (800 kcal)", total: "~2,650 kcal" } },
  Friday: { lose: { break: "Chia Pudding (250 kcal)", lunch: "Spinach Salad (300 kcal)", snack: "Edamame (150 kcal)", dinner: "Turkey Meatballs (500 kcal)", total: "~1,200 kcal" }, gain: { break: "French Toast (750 kcal)", lunch: "Double Cheeseburger (900 kcal)", snack: "Fruit Smoothie (350 kcal)", dinner: "Salmon & Quinoa (850 kcal)", total: "~2,850 kcal" } },
  Saturday: { lose: { break: "2 Scrambled Eggs (200 kcal)", lunch: "Veggie Wrap (350 kcal)", snack: "Rice Cakes (100 kcal)", dinner: "Steak & Broccoli (550 kcal)", total: "~1,200 kcal" }, gain: { break: "Breakfast Burrito (800 kcal)", lunch: "BBQ Ribs (950 kcal)", snack: "Ice Cream (400 kcal)", dinner: "Pizza (3 Slices) (900 kcal)", total: "~3,050 kcal" } },
  Sunday: { lose: { break: "Fruit Salad (200 kcal)", lunch: "Tomato Soup (300 kcal)", snack: "Cottage Cheese (150 kcal)", dinner: "Roast Chicken & Veggies (500 kcal)", total: "~1,150 kcal" }, gain: { break: "Waffles & Syrup (750 kcal)", lunch: "Lasagna (850 kcal)", snack: "Mixed Nuts (500 kcal)", dinner: "Steak & Macaroni (950 kcal)", total: "~3,050 kcal" } }
};

function App() {
  // AUTHENTICATION STATES
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('currentUser') !== null);
  const [currentUser, setCurrentUser] = useState<string | null>(() => localStorage.getItem('currentUser'));
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // APP DATA STATES
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const [activeTab, setActiveTab] = useState('workout');
  
  // SETTINGS & STATS STATES (Persisted in localStorage)
  const [isDarkMode, setIsDarkMode] = useState(() => JSON.parse(localStorage.getItem('isDarkMode') || 'false'));
  const [isMusicOn, setIsMusicOn] = useState(() => JSON.parse(localStorage.getItem('isMusicOn') || 'false'));
  const [isNotificationsOn, setIsNotificationsOn] = useState(() => JSON.parse(localStorage.getItem('isNotificationsOn') || 'false'));
  const [steps, setSteps] = useState(() => parseInt(localStorage.getItem('savedSteps') || '8540'));
  const [caloriesBurned, setCaloriesBurned] = useState(() => parseInt(localStorage.getItem('savedCals') || '1250'));

  // NUTRITION & WORKOUT FLOW STATES
  const [nutritionGoal, setNutritionGoal] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [workoutStep, setWorkoutStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // EFFECTS
  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    localStorage.setItem('isMusicOn', JSON.stringify(isMusicOn));
    localStorage.setItem('isNotificationsOn', JSON.stringify(isNotificationsOn));
    localStorage.setItem('savedSteps', steps.toString());
    localStorage.setItem('savedCals', caloriesBurned.toString());
  }, [isDarkMode, isMusicOn, isNotificationsOn, steps, caloriesBurned]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/todays-plan')
      .then(res => res.json())
      .then(data => setWorkouts(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    if (activeTab === 'progress' && isLoggedIn) {
      fetch('http://127.0.0.1:8000/my-history')
        .then(res => res.json())
        .then(data => setHistory(data))
        .catch(err => console.error("Failed to fetch history:", err));
    }
  }, [activeTab, isLoggedIn]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => (prev ? prev - 1 : 0)), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    if (isMusicOn && isWorkoutStarted && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio block:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isMusicOn, isWorkoutStarted]);

  // HANDLERS
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? '/login' : '/signup';
    
    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(`Error: ${data.detail || "Authentication failed"}`);
        return;
      }

      if (authMode === 'login') {
        setIsLoggedIn(true);
        setCurrentUser(username);
        localStorage.setItem('currentUser', username);
      } else {
        alert("Sign up successful! Please log in.");
        setAuthMode('login');
        setPassword('');
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("Network error. Please make sure your Python backend is running.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setUsername('');
    setPassword('');
  };

  const handleUpdateSteps = () => {
    const newSteps = window.prompt("Log your new steps for today:", steps.toString());
    if (newSteps && !isNaN(Number(newSteps))) setSteps(Number(newSteps));
  };

  const handleUpdateCalories = () => {
    const newCals = window.prompt("Log your calories burned today:", caloriesBurned.toString());
    if (newCals && !isNaN(Number(newCals))) setCaloriesBurned(Number(newCals));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60); const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  };

  const handleCompleteWorkout = async () => {
    const workoutName = `${selectedGoal === 'lose' ? 'Fat Burn' : 'Strength'}: ${selectedTarget === 'upper' ? 'Upper Body' : 'Lower Body'}`;
    const estimatedCalories = selectedGoal === 'lose' ? 350 : 200;
    try {
      await fetch('http://127.0.0.1:8000/log-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workout_type: workoutName, duration: 30, calories: estimatedCalories })
      });
      alert(`Great job ${currentUser}! Your ${workoutName} workout was saved to the database! 🎉`);
    } catch (error) {
      console.error("Failed to save workout:", error);
    }
    setIsWorkoutStarted(false); setWorkoutStep(1); setTimeLeft(null); setIsTimerRunning(false);
  };

  const renderCustomRoutine = () => {
    let routine: any[] = [];
    if (selectedGoal === 'lose' && selectedTarget === 'upper') routine = [{ name: "Jumping Jacks", sets: "45 secs", icon: "⏱️", time: 45 }, { name: "Mountain Climbers", sets: "30 secs", icon: "🏔️", time: 30 }, { name: "Push-ups", sets: "12 reps", icon: "💪", time: null }, { name: "Plank Shoulder Taps", sets: "40 secs", icon: "🖐️", time: 40 }];
    else if (selectedGoal === 'lose' && selectedTarget === 'lower') routine = [{ name: "High Knees", sets: "45 secs", icon: "🏃‍♀️", time: 45 }, { name: "Squat Jumps", sets: "15 reps", icon: "⚡", time: null }, { name: "Alternating Lunges", sets: "20 reps", icon: "🦵", time: null }, { name: "Bicycle Crunches", sets: "30 secs", icon: "🚲", time: 30 }];
    else if (selectedGoal === 'build' && selectedTarget === 'upper') routine = [{ name: "Pike Push-ups", sets: "8-10 reps", icon: "⛺", time: null }, { name: "Tricep Dips", sets: "12 reps", icon: "🪑", time: null }, { name: "Superman Holds", sets: "30 secs", icon: "🦸‍♀️", time: 30 }, { name: "Plank to Push-up", sets: "10 reps", icon: "🔥", time: null }];
    else if (selectedGoal === 'build' && selectedTarget === 'lower') routine = [{ name: "Bulgarian Split Squats", sets: "10/leg", icon: "🦵", time: null }, { name: "Glute Bridges", sets: "15 reps", icon: "🌉", time: null }, { name: "Slow Tempo Squats", sets: "12 reps", icon: "🏋️‍♀️", time: null }, { name: "Wall Sit", sets: "60 secs", icon: "🧱", time: 60 }];

    return (
      <div className="space-y-3 relative pb-20">
        {routine.map((exercise, index) => (
          <div key={index} className="flex items-center justify-between bg-pink-50 dark:bg-gray-700 p-4 rounded-2xl border border-pink-100 dark:border-gray-600">
            <div className="flex items-center gap-4">
              <span className="text-2xl">{exercise.icon}</span>
              <div>
                <h4 className="font-bold text-brand-dark dark:text-gray-100">{exercise.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-300">{exercise.sets}</p>
              </div>
            </div>
            {exercise.time ? (
              <button onClick={() => handleStartTimer(exercise.time)} className="text-xs bg-white dark:bg-gray-800 border border-brand-pink text-brand-pink font-bold px-3 py-1.5 rounded-full hover:bg-brand-pink hover:text-white transition-colors shadow-sm">
                Start Timer
              </button>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-brand-pink flex items-center justify-center text-brand-pink font-bold">✓</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="max-w-md mx-auto min-h-screen bg-brand-bg dark:bg-gray-900 transition-colors duration-300 relative pb-28 shadow-2xl overflow-y-auto">
        
        {!isLoggedIn ? (
          <div className="flex flex-col justify-center items-center h-screen px-6 animate-fade-in">
            <h1 className="text-4xl font-extrabold text-brand-dark dark:text-white mb-2 text-center">Kigehi’s Fitness</h1>
            <p className="text-gray-500 mb-8 text-center">Your personal tracking companion</p>
            
            <form onSubmit={handleAuth} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl w-full border border-pink-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-6">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              
              <input 
                type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required 
                className="w-full mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-brand-dark dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-brand-pink"
              />
              <input 
                type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                className="w-full mb-6 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-brand-dark dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-brand-pink"
              />
              
              <button type="submit" className="w-full bg-[#C2185B] text-white font-bold py-3 rounded-full shadow-md hover:bg-[#AD1457] transition-colors mb-4">
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>
              
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <span onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-brand-pink font-bold cursor-pointer hover:underline">
                  {authMode === 'login' ? 'Sign up' : 'Log in'}
                </span>
              </p>
            </form>
          </div>
        ) : (
          <>
            <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=electronic-rock-king-around-here-15045.mp3" />

            <header className="pt-12 px-6 pb-2 flex justify-between items-end">
              <h1 className="text-3xl font-extrabold text-brand-dark dark:text-white tracking-tight">Kigehi’s Fitness <br /> Tracker App</h1>
              <button onClick={handleLogout} className="text-xs font-bold text-brand-pink mb-2 hover:underline">Log Out</button>
            </header>

            {/* --- WORKOUT TAB --- */}
            {activeTab === 'workout' && (
              <div className="animate-fade-in">
                {!isWorkoutStarted && (
                  <>
                    <CalendarStrip />
                    <div className="px-6 mb-6 grid grid-cols-2 gap-4">
                      <div onClick={handleUpdateSteps} className="cursor-pointer bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-pink-100 dark:border-gray-700 hover:border-brand-pink transition-colors">
                        <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">Steps ✏️</h3>
                        <div className="relative w-16 h-16 border-4 border-brand-pink rounded-full flex items-center justify-center mx-auto">
                           <span className="font-bold text-brand-dark dark:text-white text-xs">{steps.toLocaleString()}</span>
                        </div>
                      </div>
                      <div onClick={handleUpdateCalories} className="cursor-pointer bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-pink-100 dark:border-gray-700 flex flex-col justify-center items-center hover:border-brand-pink transition-colors">
                        <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Calories ✏️</h3>
                        <span className="text-2xl font-black text-brand-dark dark:text-white">{caloriesBurned.toLocaleString()}</span>
                        <span className="text-xs text-gray-400">kcal</span>
                      </div>
                    </div>

                    <div className="px-6">
                      <h2 className="text-xl font-bold text-brand-dark dark:text-white mb-4">Today's Plan</h2>
                      <div className="grid grid-cols-2 gap-4">
                        {workouts.map((workout) => (
                          <WorkoutCard key={workout.id} title={workout.title} image={workout.image_url} category={workout.category} />
                        ))}
                      </div>
                    </div>

                    <div className="px-6 mt-8 mb-4">
                      <button onClick={() => setIsWorkoutStarted(true)} className="w-full bg-[#C2185B] text-white font-bold text-lg py-4 rounded-full shadow-xl hover:bg-[#AD1457] hover:scale-105 transition-transform">
                        Start Workout
                      </button>
                    </div>
                  </>
                )}

                {isWorkoutStarted && (
                  <div className="px-6 mt-4 animate-fade-in relative">
                    {workoutStep === 1 && (
                      <div>
                        <button onClick={() => setIsWorkoutStarted(false)} className="text-sm text-gray-500 hover:text-brand-pink dark:text-gray-400 font-bold flex items-center mb-6">← Back to Dashboard</button>
                        <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-2">What is your focus?</h2>
                        <div className="flex flex-col gap-4 mt-4">
                          <button onClick={() => { setSelectedGoal('lose'); setWorkoutStep(2); }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-pink-100 dark:border-gray-700 hover:border-brand-pink text-left flex items-center"><span className="text-4xl mr-4">📉</span><div><h3 className="font-bold text-brand-dark dark:text-white text-lg">Lose Fat</h3><p className="text-sm text-gray-500 dark:text-gray-400">High intensity, sweat-inducing</p></div></button>
                          <button onClick={() => { setSelectedGoal('build'); setWorkoutStep(2); }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-pink-100 dark:border-gray-700 hover:border-brand-pink text-left flex items-center"><span className="text-4xl mr-4">💪</span><div><h3 className="font-bold text-brand-dark dark:text-white text-lg">Build Muscle</h3><p className="text-sm text-gray-500 dark:text-gray-400">Strength and hypertrophy</p></div></button>
                        </div>
                      </div>
                    )}

                    {workoutStep === 2 && (
                      <div>
                        <button onClick={() => setWorkoutStep(1)} className="text-sm text-gray-500 hover:text-brand-pink dark:text-gray-400 font-bold flex items-center mb-6">← Back to Goal</button>
                        <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-2">Target Area</h2>
                        <div className="flex flex-col gap-4 mt-4">
                          <button onClick={() => { setSelectedTarget('upper'); setWorkoutStep(3); }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-pink-100 dark:border-gray-700 hover:border-brand-pink text-left flex items-center"><span className="text-4xl mr-4">🏋️‍♀️</span><div><h3 className="font-bold text-brand-dark dark:text-white text-lg">Upper Body</h3></div></button>
                          <button onClick={() => { setSelectedTarget('lower'); setWorkoutStep(3); }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-pink-100 dark:border-gray-700 hover:border-brand-pink text-left flex items-center"><span className="text-4xl mr-4">🦵</span><div><h3 className="font-bold text-brand-dark dark:text-white text-lg">Lower Body</h3></div></button>
                        </div>
                      </div>
                    )}

                    {workoutStep === 3 && (
                      <div>
                        <button onClick={() => { setWorkoutStep(2); setTimeLeft(null); setIsTimerRunning(false); }} className="text-sm text-gray-500 hover:text-brand-pink dark:text-gray-400 font-bold flex items-center mb-6">← Back to Target Area</button>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-pink-100 dark:border-gray-700 relative">
                          <div className="mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                            <span className="text-xs font-bold text-brand-pink uppercase tracking-wider">Your Custom Routine</span>
                            <h3 className="font-bold text-brand-dark dark:text-white text-xl mt-1">{selectedGoal === 'lose' ? 'Fat Burn' : 'Strength'}: {selectedTarget === 'upper' ? 'Upper Body' : 'Lower Body'}</h3>
                          </div>
                          {renderCustomRoutine()}
                          <button onClick={handleCompleteWorkout} className="w-full mt-6 bg-[#C2185B] text-white font-bold py-3 rounded-full shadow-md hover:bg-[#AD1457]">Complete Workout</button>
                        </div>

                        {timeLeft !== null && (
                          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-50 animate-fade-in border-2 border-brand-pink">
                            <span className="text-2xl font-mono font-bold tracking-widest">{formatTime(timeLeft)}</span>
                            <div className="flex gap-2 border-l border-gray-600 pl-4">
                              <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="text-sm font-bold hover:text-brand-pink">{isTimerRunning ? '⏸' : '▶'}</button>
                              <button onClick={() => { setTimeLeft(null); setIsTimerRunning(false); }} className="text-sm text-gray-400 hover:text-white ml-2">✖</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --- NUTRITION TAB --- */}
            {activeTab === 'nutrition' && (
              <div className="px-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-6 mt-4">Nutrition Plan</h2>
                {nutritionGoal === null ? (
                  <div className="flex flex-col gap-4">
                    <button onClick={() => setNutritionGoal('lose')} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-pink-100 dark:border-gray-700 hover:border-brand-pink text-left flex items-center"><span className="text-4xl mr-4">📉</span><div><h3 className="font-bold text-brand-dark dark:text-white text-lg">Lose Weight</h3></div></button>
                    <button onClick={() => setNutritionGoal('gain')} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-pink-100 dark:border-gray-700 hover:border-brand-pink text-left flex items-center"><span className="text-4xl mr-4">📈</span><div><h3 className="font-bold text-brand-dark dark:text-white text-lg">Gain Weight</h3></div></button>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-pink-100 dark:border-gray-700">
                    <button onClick={() => setNutritionGoal(null)} className="text-sm text-gray-500 hover:text-brand-pink dark:text-gray-400 font-bold flex items-center mb-6">← Back to Goals</button>
                    <div className="flex overflow-x-auto gap-3 mb-6 pb-2 hide-scroll-bar">
                      {daysOfWeek.map(day => (
                        <button key={day} onClick={() => setSelectedDay(day)} className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${selectedDay === day ? 'bg-brand-pink text-white shadow-md' : 'bg-pink-50 text-brand-dark dark:bg-gray-700 dark:text-gray-300 border border-transparent'}`}>
                          {day}
                        </button>
                      ))}
                    </div>
                    <div className="mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                      <span className="text-xs font-bold text-brand-pink uppercase tracking-wider">{selectedDay}'s Meals</span>
                      <h3 className="font-bold text-brand-dark dark:text-white text-xl mt-1">{nutritionGoal === 'lose' ? '🔥 Weight Loss Plan' : '💪 Muscle Gain Plan'}</h3>
                    </div>
                    <ul className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                      <li><strong className="text-brand-dark dark:text-white">🍳 Breakfast:</strong> {nutritionPlanData[selectedDay][nutritionGoal].break}</li>
                      <li><strong className="text-brand-dark dark:text-white">🥗 Lunch:</strong> {nutritionPlanData[selectedDay][nutritionGoal].lunch}</li>
                      <li><strong className="text-brand-dark dark:text-white">🍎 Snack:</strong> {nutritionPlanData[selectedDay][nutritionGoal].snack}</li>
                      <li><strong className="text-brand-dark dark:text-white">🍽️ Dinner:</strong> {nutritionPlanData[selectedDay][nutritionGoal].dinner}</li>
                      <li className="pt-4 text-center font-bold text-brand-pink text-lg border-t border-gray-50 dark:border-gray-700 mt-4">Total: {nutritionPlanData[selectedDay][nutritionGoal].total}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* --- PROGRESS TAB --- */}
            {activeTab === 'progress' && (
              <div className="px-6 animate-fade-in">
                <button onClick={() => setActiveTab('workout')} className="text-sm text-gray-500 hover:text-brand-pink dark:text-gray-400 font-bold flex items-center mb-4 mt-4">← Back to Home</button>
                <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-6">Your Progress</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-pink-100 dark:border-gray-700 mb-6">
                   <h3 className="font-bold text-brand-dark dark:text-white text-lg mb-4">🏆 Recent Workouts</h3>
                   {history.length === 0 ? (
                     <p className="text-sm text-gray-500">No workouts completed yet. Go sweat!</p>
                   ) : (
                     <div className="space-y-4">
                       {history.map((log) => (
                         <div key={log.id} className="flex justify-between items-center border-b border-gray-50 dark:border-gray-700 pb-3">
                           <div>
                             <p className="font-bold text-brand-dark dark:text-gray-200 text-sm">{log.workout_type}</p>
                             <p className="text-xs text-gray-400">{new Date(log.date).toLocaleDateString()}</p>
                           </div>
                           <div className="text-right">
                             <p className="text-sm font-bold text-brand-pink">{log.calories} kcal</p>
                             <p className="text-xs text-gray-400">{log.duration} mins</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              </div>
            )}

            {/* --- SETTINGS TAB --- */}
            {activeTab === 'settings' && (
              <div className="px-6 animate-fade-in">
                <button onClick={() => setActiveTab('workout')} className="text-sm text-gray-500 hover:text-brand-pink dark:text-gray-400 font-bold flex items-center mb-4 mt-4">← Back to Home</button>
                <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-6">Settings</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-pink-100 dark:border-gray-700 flex flex-col gap-6">
                  <div className="flex justify-between items-center" onClick={() => setIsDarkMode(!isDarkMode)}>
                    <div><h3 className="font-bold text-brand-dark dark:text-white">Dark Mode</h3><p className="text-xs text-gray-500 dark:text-gray-400">Switch app theme</p></div>
                    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${isDarkMode ? 'bg-brand-pink' : 'bg-gray-200 dark:bg-gray-600'}`}><div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${isDarkMode ? 'right-0.5' : 'left-0.5'}`}></div></div>
                  </div>
                  <hr className="border-gray-50 dark:border-gray-700" />
                  <div className="flex justify-between items-center" onClick={() => setIsMusicOn(!isMusicOn)}>
                    <div><h3 className="font-bold text-brand-dark dark:text-white">Workout Music</h3><p className="text-xs text-gray-500 dark:text-gray-400">Play background tracks</p></div>
                    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${isMusicOn ? 'bg-brand-pink' : 'bg-gray-200 dark:bg-gray-600'}`}><div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${isMusicOn ? 'right-0.5' : 'left-0.5'}`}></div></div>
                  </div>
                  <hr className="border-gray-50 dark:border-gray-700" />
                  <div className="flex justify-between items-center" onClick={() => setIsNotificationsOn(!isNotificationsOn)}>
                    <div><h3 className="font-bold text-brand-dark dark:text-white">Notifications</h3><p className="text-xs text-gray-500 dark:text-gray-400">Daily workout reminders</p></div>
                    <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${isNotificationsOn ? 'bg-brand-pink' : 'bg-gray-200 dark:bg-gray-600'}`}><div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${isNotificationsOn ? 'right-0.5' : 'left-0.5'}`}></div></div>
                  </div>
                </div>
              </div>
            )}

            {/* --- BOTTOM NAV --- */}
            <nav className="fixed bottom-0 w-full max-w-md bg-white dark:bg-gray-900 h-20 border-t border-gray-100 dark:border-gray-800 flex justify-around items-center pb-2 text-xs font-bold z-50 transition-colors duration-300">
              <div onClick={() => { setActiveTab('workout'); setIsWorkoutStarted(false); setTimeLeft(null); setIsTimerRunning(false); }} className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'workout' ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-pink'}`}><span className="text-xl mb-1">🏋️‍♀️</span><span>Workout</span></div>
              <div onClick={() => { setActiveTab('nutrition'); setIsWorkoutStarted(false); }} className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'nutrition' ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-pink'}`}><span className="text-xl mb-1">🍎</span><span>Nutrition</span></div>
              <div onClick={() => { setActiveTab('progress'); setIsWorkoutStarted(false); }} className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'progress' ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-pink'}`}><span className="text-xl mb-1">📊</span><span>Progress</span></div>
              <div onClick={() => { setActiveTab('settings'); setIsWorkoutStarted(false); }} className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'settings' ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-pink'}`}><span className="text-xl mb-1">⚙️</span><span>Settings</span></div>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}

export default App;