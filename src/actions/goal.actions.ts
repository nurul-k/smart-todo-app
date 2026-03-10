'use server';

import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Goal from '@/models/Goal';
import Todo from '@/models/Todo';
import GoalDay from '@/models/GoalDay';
import { revalidatePath } from 'next/cache';
import GoalDayLog from '@/models/GoalDayLog';

/* -------------------------------------------------- */
/* CREATE GOAL */
/* -------------------------------------------------- */

export async function createGoal(data: {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: 'MONTHLY' | 'YEARLY' | 'CUSTOM';
}) {
  try {
    const session = await auth();
    if (!session) throw new Error('Unauthorized');

    const userId = (session.user as { id: string }).id;

    const { title, description, startDate, endDate, type } = data;

    if (!title.trim()) throw new Error('Goal title is required');

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) throw new Error('End date must be after start date');

    await dbConnect();

    const goal = await Goal.create({
      title: title.trim(),
      description,
      startDate: start,
      endDate: end,
      type,
      userId,
      status: 'ACTIVE',
      progress: 0,
    });

    revalidatePath('/goals');

    return { success: true, goal: JSON.parse(JSON.stringify(goal)) };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/* -------------------------------------------------- */
/* GET USER GOALS */
/* -------------------------------------------------- */

export async function getUserGoals() {
  try {
    const session = await auth();
    if (!session) throw new Error('Unauthorized');

    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });

    return {
      success: true,
      goals: goals.map((g) => JSON.parse(JSON.stringify(g))),
    };
  } catch (error) {
    return { success: false, goals: [], error: (error as Error).message };
  }
}

/* -------------------------------------------------- */
/* GET SINGLE GOAL */
/* -------------------------------------------------- */

export async function getGoalById(goalId: string) {
  try {
    const session = await auth();
    if (!session) throw new Error('Unauthorized');

    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return { success: false, goal: null, error: 'Goal not found' };
    }

    // FIX: convert ObjectId to string
    if (goal.userId.toString() !== userId) {
      return { success: false, goal: null, error: 'Unauthorized' };
    }

    return {
      success: true,
      goal: JSON.parse(JSON.stringify(goal)),
    };

  } catch (error) {
    return {
      success: false,
      goal: null,
      error: (error as Error).message,
    };
  }
}

/* -------------------------------------------------- */
/* PAUSE GOAL */
/* -------------------------------------------------- */

export async function pauseGoal(goalId: string) {
  try {
    const session = await auth();
    if (!session) throw new Error('Unauthorized');

    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const goal = await Goal.findById(goalId);

    if (!goal) throw new Error('Goal not found');
    if (goal.userId !== userId) throw new Error('Unauthorized');

    goal.status = 'PAUSED';
    await goal.save();

    revalidatePath('/goals');

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/* -------------------------------------------------- */
/* RESUME GOAL */
/* -------------------------------------------------- */

export async function resumeGoal(goalId: string) {
  try {
    const session = await auth();
    if (!session) throw new Error('Unauthorized');

    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const goal = await Goal.findById(goalId);

    if (!goal) throw new Error('Goal not found');
    if (goal.userId !== userId) throw new Error('Unauthorized');

    goal.status = 'ACTIVE';
    await goal.save();

    revalidatePath('/goals');

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/* -------------------------------------------------- */
/* DELETE GOAL */
/* -------------------------------------------------- */

export async function deleteGoal(goalId: string) {
  try {
    const session = await auth();
    if (!session) throw new Error('Unauthorized');

    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const goal = await Goal.findById(goalId);

    if (!goal) throw new Error('Goal not found');
    if (goal.userId !== userId) throw new Error('Unauthorized');

    await Goal.deleteOne({ _id: goalId });

    revalidatePath('/goals');

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/* -------------------------------------------------- */
/* UPDATE GOAL PROGRESS */
/* -------------------------------------------------- */

export async function updateGoalProgress(goalId: string) {
  try {
    await dbConnect();

    const goal = await Goal.findById(goalId);
    if (!goal) return;

    const totalTodos = await Todo.countDocuments({ goalId });
    const completedTodos = await Todo.countDocuments({
      goalId,
      completed: true,
    });

    const progress =
      totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

    goal.progress = progress;

    if (progress >= 100) {
      goal.status = 'COMPLETED';
    }

    await goal.save();
  } catch (error) {
    console.error('Failed to update goal progress:', error);
  }
}

/* -------------------------------------------------- */
/* MISSION 365 STATS */
/* -------------------------------------------------- */

export async function getGoalTracker() {
  try {
    const session = await auth();
    if (!session) throw new Error('Unauthorized');

    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31);

    const daysPassed = Math.floor(
      (now.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    const totalYearDays =
      (yearEnd.getTime() - yearStart.getTime()) /
      (1000 * 60 * 60 * 24);

    const daysRemaining = Math.ceil(totalYearDays - daysPassed);

    // Completed todos this year
    const completedTodos = await Todo.find({
      userId,
      completed: true,
      updatedAt: { $gte: yearStart, $lte: yearEnd },
    });

    const productiveDaysArray = Array.from(completedTodos);

    const productiveDays = productiveDaysArray.length;
    const missedDays = Math.max(0, daysPassed - productiveDays);

    const productivityRate =
      daysPassed === 0
        ? 0
        : Math.round((productiveDays / daysPassed) * 100);

    const activeGoals = await Goal.countDocuments({
      userId,
      status: 'ACTIVE',
    });

    const completedGoals = await Goal.countDocuments({
      userId,
      status: 'COMPLETED',
    });

    return {
      success: true,
      stats: {
        daysPassed,
        daysRemaining,
        productiveDays,
        missedDays,
        productivityRate,
        activeGoals,
        completedGoals,
        productiveDaysArray,
      },
    };
  } catch (error) {
    return {
      success: false,
      stats: null,
      error: (error as Error).message,
    };
  }
}


export async function updateGoalDay(goalId: string, date: string, status: string) {
  try {
    const session = await auth();
    if (!session) throw new Error('Unauthorized');

    const userId = (session.user as any).id;

    await dbConnect();

    const existing = await GoalDay.findOne({
      goalId,
      date: new Date(date),
    });

    if (existing) {
      existing.status = status;
      await existing.save();
    } else {
      await GoalDay.create({
        goalId,
        userId,
        date: new Date(date),
        status,
      });
    }

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getGoalDays(goalId: string) {
  try {
    const session = await auth();
    if (!session) throw new Error('Unauthorized');

    await dbConnect();

    const days = await GoalDay.find({ goalId });

    return {
      success: true,
      days: JSON.parse(JSON.stringify(days)),
    };
  } catch (error) {
    return { success: false, days: [] };
  }
}

export async function getGoalYearProgress(goalId: string) {

  const session = await auth();
  if (!session) throw new Error('Unauthorized');

  await dbConnect();

  const days = await GoalDay.find({ goalId });

  const productiveDays = days.filter(
    (d) => d.status === 'productive'
  ).length;

  const goal = await Goal.findById(goalId);

  if (!goal) {
    return {
      success: false,
      percent: 0,
      productiveDays: 0,
      totalDays: 0,
    };
  }

  const start = new Date(goal.startDate);
  const end = new Date(goal.endDate);

  const totalDays =
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const percent = Math.round((productiveDays / totalDays) * 100);

  return {
    success: true,
    percent,
    productiveDays,
    totalDays,
  };
}

export async function getGoalDayLogs(goalId: string) {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const logs = await GoalDayLog.find({ goalId, userId });

    return {
      success: true,
      logs: JSON.parse(JSON.stringify(logs)),
    };

  } catch (error) {
    return {
      success: false,
      logs: [],
      error: (error as Error).message,
    };
  }
}


export async function saveGoalDayLog(
  goalId: string,
  date: string,
  category: "productive" | "neutral" | "wasted" | "vacation",
  note?: string
) {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const selectedDate = new Date(date);

    const today = new Date();
    today.setHours(0,0,0,0);

    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0,0,0,0);

    // ❌ Prevent editing past days
    if (selectedDay < today) {
      throw new Error("Past days cannot be edited");
    }

    const existing = await GoalDayLog.findOne({
      goalId,
      userId,
      date: selectedDate,
    });

    if (existing) {

      existing.category = category;

      if (note !== undefined) {
        existing.note = note;
      }

      await existing.save();

    } else {

      await GoalDayLog.create({
        goalId,
        userId,
        date: selectedDate,
        category,
        note,
      });

    }

    return { success: true };

  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function getGoalTimeline(goalId: string) {

  try {

    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    await dbConnect();

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return { success: false, days: [] };
    }

    const start = new Date(goal.startDate);
    const end = new Date(goal.endDate);

    const days: string[] = [];

    let current = new Date(start);

    while (current <= end) {

      days.push(new Date(current).toISOString().split("T")[0]);

      current.setDate(current.getDate() + 1);

    }

    return {
      success: true,
      days,
    };

  } catch (error) {

    return {
      success: false,
      days: [],
    };

  }

}

export async function getGoalStreak(goalId: string) {
  try {

    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const logs = await GoalDayLog.find({
      goalId,
      userId,
      category: "productive"
    }).sort({ date: 1 });

    const days = logs.map((l) =>
      new Date(l.date).toISOString().split("T")[0]
    );

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    let prevDate: Date | null = null;

    for (const day of days) {

      const currentDate = new Date(day);

      if (!prevDate) {
        tempStreak = 1;
      } else {

        const diff =
          (currentDate.getTime() - prevDate.getTime()) /
          (1000 * 60 * 60 * 24);

        if (diff === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }

      }

      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }

      prevDate = currentDate;

    }

    // calculate current streak (from today backwards)

    const today = new Date().toISOString().split("T")[0];

    let checkDate = new Date(today);

    while (true) {

      const key = checkDate.toISOString().split("T")[0];

      if (days.includes(key)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }

    }

    return {
      success: true,
      currentStreak,
      bestStreak
    };

  } catch (error) {

    return {
      success: false,
      currentStreak: 0,
      bestStreak: 0
    };

  }
}

export async function getGoalHeatmap(goalId: string) {

  try {

    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const userId = (session.user as { id: string }).id;

    await dbConnect();

    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const logs = await GoalDayLog.find({
      goalId,
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const map: any = {};

    logs.forEach((log) => {

      const key = new Date(log.date).toISOString().split("T")[0];

      map[key] = log.category;

    });

    const days: any[] = [];

    const current = new Date(startOfMonth);

    while (current <= endOfMonth) {

      const key = current.toISOString().split("T")[0];

      days.push({
        date: key,
        category: map[key] || null
      });

      current.setDate(current.getDate() + 1);

    }

    return {
      success: true,
      days
    };

  } catch {

    return {
      success: false,
      days: []
    };

  }

}