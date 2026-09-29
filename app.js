 // ==========================================
// PERSISTENCE REPOSITORY
// ==========================================
const DB_KEY = 'simple_tasks_v3_db';

const db = {
  getTasks: () => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveTasks: (tasks) => {
    localStorage.setItem(DB_KEY, JSON.stringify(tasks));
  }
};

// Format Date Utility: Format -> "28 Sep 2026, 01:47 PM"
function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const day = d.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${day} ${month} ${year}, ${time}`;
}

// ==========================================
// MINIMAL TASK ITEM COMPONENT
// ==========================================
function TaskItem({ task, isSubtask = false, isOverdue = false, onToggle, onDelete, onAddSubtask }) {
  const isCompleted = task.is_completed === 1;

  return (
    <div className={`task-swipe-wrapper ${isSubtask ? 'is-subtask' : ''}`}>
      <div className={`task-item ${isOverdue ? 'is-overdue-card' : ''}`}>
        <div 
          className={`checkbox ${isCompleted ? 'completed' : ''}`}
          onClick={() => onToggle(task.id, task.is_completed)}
        >
          {isCompleted && <span className="checkmark">✓</span>}
        </div>

        <div className="task-content">
          <div className={`task-title ${isCompleted ? 'completed' : ''}`}>
            {task.title}
          </div>
          <div className="task-meta">
            {formatDate(task.created_at)}
          </div>
        </div>

        <div className="task-actions">
          {!isSubtask && (
            <button className="action-btn" onClick={() => onAddSubtask(task.id)}>
              +Sub
            </button>
          )}
          <button className="delete-btn" onClick={() => onDelete(task.id)}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN APPLICATION
// ==========================================
function App() {
  const [tasks, setTasks] = React.useState([]);
  const [inputText, setInputText] = React.useState('');
  
  // Splash Screen Animation States
  const [splashVisible, setSplashVisible] = React.useState(true);
  const [welcomeText, setWelcomeText] = React.useState('');
  const [showTasksWord, setShowTasksWord] = React.useState(false);

  // Typewriter Splash Screen Animation Logic
  React.useEffect(() => {
    const fullText = "Welcome";
    let index = 0;

    const interval = setInterval(() => {
      setWelcomeText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(interval);
        setTimeout(() => setShowTasksWord(true), 250);
        setTimeout(() => setSplashVisible(false), 1400);
      }
    }, 90);

    return () => clearInterval(interval);
  }, []);

  const loadTasks = React.useCallback(() => {
    const rawTasks = db.getTasks();
    setTasks(rawTasks);
  }, []);

  React.useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Daily Progress Calculation (Tasks created today)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todaysTasks = tasks.filter(t => new Date(t.created_at) >= todayStart);
  const completedToday = todaysTasks.filter(t => t.is_completed === 1);
  const progressPercent = todaysTasks.length > 0 
    ? Math.round((completedToday.length / todaysTasks.length) * 100) 
    : 0;

  // Trigger Celebration Confetti
  const triggerCelebration = () => {
    if (window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleAddTask = (parentId = null) => {
    const titlePrompt = parentId ? prompt("Enter subtask title:") : inputText.trim();
    if (!titlePrompt || !titlePrompt.trim()) return;

    const allTasks = db.getTasks();
    const newTask = {
      id: Date.now().toString(),
      parent_id: parentId,
      title: titlePrompt.trim(),
      is_completed: 0,
      created_at: new Date().toISOString()
    };

    db.saveTasks([...allTasks, newTask]);
    if (!parentId) setInputText('');
    loadTasks();
  };

  const handleToggleTask = (id, currentStatus) => {
    const allTasks = db.getTasks();
    const nextStatus = currentStatus === 0 ? 1 : 0;
    
    const updated = allTasks.map((t) => 
      t.id === id ? { ...t, is_completed: nextStatus } : t
    );
    
    db.saveTasks(updated);
    loadTasks();

    if (nextStatus === 1) {
      const currentToday = updated.filter(t => new Date(t.created_at) >= todayStart);
      const allDone = currentToday.length > 0 && currentToday.every(t => t.is_completed === 1);
      if (allDone) {
        triggerCelebration();
      }
    }
  };

  const handleDeleteTask = (id) => {
    const allTasks = db.getTasks();
    const updated = allTasks.filter((t) => t.id !== id && t.parent_id !== id);
    db.saveTasks(updated);
    loadTasks();
  };

  // Categorize Tasks: Overdue vs Active
  // A task is only Overdue if it was created before today AND is incomplete.
  const activeParents = [];
  const overdueParents = [];
  const subtaskMap = {};

  tasks.forEach((t) => {
    if (t.parent_id) {
      if (!subtaskMap[t.parent_id]) subtaskMap[t.parent_id] = [];
      subtaskMap[t.parent_id].push(t);
    }
  });

  tasks.forEach((t) => {
    if (!t.parent_id) {
      const isBeforeToday = new Date(t.created_at) < todayStart;
      const isOverdue = t.is_completed === 0 && isBeforeToday;
      const itemWithSubs = { ...t, subtasks: subtaskMap[t.id] || [] };
      
      if (isOverdue) {
        overdueParents.push(itemWithSubs);
      } else {
        activeParents.push(itemWithSubs);
      }
    }
  });

  return (
    <React.Fragment>
      {/* Typewriter Opening Animation */}
      <div className={`splash-screen ${!splashVisible ? 'hidden' : ''}`}>
        <div className="splash-text-container">
          <span className="splash-welcome">{welcomeText}</span>
          <span className={`splash-tasks ${showTasksWord ? 'show' : ''}`}>to Tasks</span>
        </div>
      </div>

      <div className="header">
        <h1>My Tasks</h1>
        <div className="progress-container">
          <div className="progress-header">
            <span>Daily Progress</span>
            <span>{completedToday.length}/{todaysTasks.length} Completed ({progressPercent}%)</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>

      <div className="task-list">
        {overdueParents.length > 0 && (
          <React.Fragment>
            <div className="section-title overdue">⚠️ Overdue Tasks</div>
            {overdueParents.map((item) => (
              <React.Fragment key={item.id}>
                <TaskItem
                  task={item}
                  isOverdue
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                  onAddSubtask={handleAddTask}
                />
                {item.subtasks.map((sub) => (
                  <TaskItem
                    key={sub.id}
                    task={sub}
                    isSubtask
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        )}

        <div className="section-title active">Tasks</div>
        {activeParents.length === 0 && overdueParents.length === 0 ? (
          <div className="empty-state">No active tasks. Add one below to start!</div>
        ) : (
          activeParents.map((item) => (
            <React.Fragment key={item.id}>
              <TaskItem
                task={item}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onAddSubtask={handleAddTask}
              />
              {item.subtasks.map((sub) => (
                <TaskItem
                  key={sub.id}
                  task={sub}
                  isSubtask
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </React.Fragment>
          ))
        )}
      </div>

      <div className="input-bar">
        <input
          type="text"
          className="task-input"
          placeholder="New Task..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask(null)}
        />
        <button className="add-btn" onClick={() => handleAddTask(null)}>Add</button>
      </div>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
