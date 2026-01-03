/**
 * Simulates the AI Productivity Agent logic.
 * In a real app, this might call an LLM API.
 * Here we use deterministic rules to generate the JSON response.
 */

const PRODUCTIVITY_TIPS = [
    "Eat the frog: Do the hardest task first thing in the morning.",
    "Use the Pomodoro Technique: 25 minutes focus, 5 minutes break.",
    "Two-minute rule: If it takes less than 2 minutes, do it now.",
    "Time blocking: Schedule specific chunks of time for deep work.",
    "Single-tasking: Focus on one thing at a time to reduce cognitive load."
];

export function generateSmartPlan(tasks, mood, history = []) {
    // 1. Analyze Mood
    const isHighEnergy = mood === 'High Energy';
    const isLowEnergy = mood === 'Low Energy';

    // 2. Prioritize Tasks
    const prioritizedTasks = tasks.map(task => {
        let score = 5; // Default medium
        let priority = "Medium";
        let reason = "Standard task relevance.";

        // Simple keyword heuristics
        const lowerText = task.text.toLowerCase();

        if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('deadline')) {
            score += 4;
            priority = "High";
            reason = "Marked as urgent or deadline-driven.";
        } else if (lowerText.includes('buy') || lowerText.includes('shop')) {
            score = isLowEnergy ? 8 : 4; // Shopping is good for low energy
            priority = isLowEnergy ? "High" : "Low";
            reason = isLowEnergy ? "Good low-energy active task." : "Can be deferred.";
        } else if (lowerText.includes('meeting') || lowerText.includes('call')) {
            score = 8;
            priority = "High";
            reason = "Scheduled commitment.";
        }

        if (task.completed) {
            score = 0;
            priority = "Completed";
            reason = "Already done.";
        }

        return {
            ...task,
            priority,
            priority_score: score,
            reason
        };
    }).sort((a, b) => b.priority_score - a.priority_score);

    // 3. Daily Plan
    const activeTasks = prioritizedTasks.filter(t => !t.completed);

    // Arrays for time-based scheduling
    const morning = [];
    const afternoon = [];
    const evening = [];
    const unassigned = [];

    // Keywords
    const morningKeywords = ['morning', 'mrng', 'morn', 'breakfast', 'sunrise', 'dawn', 'am', 'wake', 'start'];
    const afternoonKeywords = ['afternoon', 'noon', 'midday', 'lunch', 'pm', 'break'];
    const eveningKeywords = ['evening', 'eve', 'night', 'nite', 'sunset', 'dusk', 'dinner', 'bed', 'sleep'];

    activeTasks.forEach(task => {
        const lower = task.text.toLowerCase();
        let assigned = false;

        // 1. Check explicit reminder time
        if (task.reminderTime) {
            const date = new Date(task.reminderTime);
            const hour = date.getHours(); // 0-23

            if (hour >= 4 && hour < 12) {
                morning.push(task);
                assigned = true;
            } else if (hour >= 12 && hour < 17) {
                afternoon.push(task);
                assigned = true;
            } else {
                evening.push(task);
                assigned = true;
            }
        }

        // 2. Fallback to Keywords if no time set
        if (!assigned) {
            if (morningKeywords.some(k => lower.includes(k))) {
                morning.push(task);
                assigned = true;
            } else if (afternoonKeywords.some(k => lower.includes(k))) {
                afternoon.push(task);
                assigned = true;
            } else if (eveningKeywords.some(k => lower.includes(k))) {
                evening.push(task);
                assigned = true;
            }
        }

        if (!assigned) {
            unassigned.push(task);
        }
    });

    // Distribute unassigned tasks to balance the day, favoring Morning/Afternoon for high priority
    // We'll roughly aim for an even split, but respect the pre-filled slots
    const totalSlots = activeTasks.length;
    const targetPerSlot = Math.ceil(totalSlots / 3);

    unassigned.forEach(task => {
        if (morning.length < targetPerSlot) {
            morning.push(task);
        } else if (afternoon.length < targetPerSlot) {
            afternoon.push(task);
        } else {
            evening.push(task);
        }
    });

    // 4. Mood Based Recommendations
    let recommended = [];
    let avoid = [];
    let moodReasoning = "";

    if (isHighEnergy) {
        recommended = activeTasks.filter(t => t.priority_score >= 7);
        avoid = activeTasks.filter(t => t.priority_score < 4);
        moodReasoning = "You have high energy! Tackle the difficult, high-focus tasks now.";
    } else if (isLowEnergy) {
        recommended = activeTasks.filter(t => t.priority_score < 7);
        avoid = activeTasks.filter(t => t.priority_score >= 8); // Avoid very demanding stuff
        moodReasoning = "Energy is low. Focus on admin, errands, or simple organizational tasks.";
    } else {
        moodReasoning = "Your energy is balanced. Maintain a steady pace through your prioritized list.";
    }

    // 5. Pick a random tip
    const randomTip = PRODUCTIVITY_TIPS[Math.floor(Math.random() * PRODUCTIVITY_TIPS.length)];

    return {
        prioritized_tasks: prioritizedTasks,
        mood_based_plan: {
            recommended_tasks: recommended,
            avoid_tasks: avoid,
            reasoning: moodReasoning
        },
        daily_plan: {
            morning,
            afternoon,
            evening,
            break_suggestions: isHighEnergy ? "Take short active breaks." : "Rest frequently to recharge."
        },
        productivity_tip: randomTip
    };
}
