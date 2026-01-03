import { useMemo } from 'react';
import { generateSmartPlan } from '../utils/aiAgent';
import '../styles/SmartPlanner.css';

export function SmartPlanner({ tasks, mood }) {
    // Only re-calculate if tasks or mood change
    const plan = useMemo(() => {
        if (!mood || tasks.length === 0) return null;
        return generateSmartPlan(tasks, mood);
    }, [tasks, mood]);

    if (!plan) return null;

    return (
        <div className="smart-planner">
            <div className="ai-header">
                <span className="ai-icon">✨</span>
                <h3>AI Productivity Agent</h3>
            </div>

            <div className="productivity-tip">
                <strong>💡 Tip:</strong> {plan.productivity_tip}
            </div>

            <div className="plan-section">
                <h4>Mood Analysis</h4>
                <p className="mood-reasoning">{plan.mood_based_plan.reasoning}</p>
            </div>

            <div className="plan-section">
                <h4>Daily Plan</h4>
                <div className="time-blocks">
                    <div className="time-block">
                        <h5>🌅 Morning</h5>
                        <ul>{plan.daily_plan.morning.map(t => <li key={t.id}>{t.text}</li>)}</ul>
                        {plan.daily_plan.morning.length === 0 && <span className="empty-slot">Free</span>}
                    </div>
                    <div className="time-block">
                        <h5>☀️ Afternoon</h5>
                        <ul>{plan.daily_plan.afternoon.map(t => <li key={t.id}>{t.text}</li>)}</ul>
                        {plan.daily_plan.afternoon.length === 0 && <span className="empty-slot">Free</span>}
                    </div>
                    <div className="time-block">
                        <h5>🌙 Evening</h5>
                        <ul>{plan.daily_plan.evening.map(t => <li key={t.id}>{t.text}</li>)}</ul>
                        {plan.daily_plan.evening.length === 0 && <span className="empty-slot">Free</span>}
                    </div>
                </div>
                <p className="break-suggestion">🧘 {plan.daily_plan.break_suggestions}</p>
            </div>
        </div>
    );
}
