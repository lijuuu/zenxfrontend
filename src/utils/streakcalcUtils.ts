import {  parseISO, subDays, isSameDay } from 'date-fns';


export const calculateStreak = (activityData, currentDate) => {
  console.log("calculateStreak - Starting with Activity Data:", JSON.stringify(activityData, null, 2));

  if (!activityData || activityData.length === 0) {
    console.log("calculateStreak - No activity data available, returning streak: 0");
    return 0;
  }

  const sortedDays = [...activityData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  console.log("calculateStreak - Sorted Days (descending order):", JSON.stringify(sortedDays, null, 2));

  const today = new Date(currentDate);
  console.log("calculateStreak - Today (local timezone):", today.toString(), "ISO:", today.toISOString());
  const yesterday = subDays(today, 1);
  console.log("calculateStreak - Yesterday (local timezone):", yesterday.toString(), "ISO:", yesterday.toISOString());

  const todayData = sortedDays.find(day => isSameDay(parseISO(day.date), today));
  console.log("calculateStreak - Today Data:", todayData ? JSON.stringify(todayData, null, 2) : "Not found");
  const todayBonus = todayData && todayData.count > 0 ? 1 : 0;
  console.log("calculateStreak - Today Bonus (1 if count > 0, else 0):", todayBonus);

  const yesterdayData = sortedDays.find(day => isSameDay(parseISO(day.date), yesterday));
  console.log("calculateStreak - Yesterday Data:", yesterdayData ? JSON.stringify(yesterdayData, null, 2) : "Not found");
  if (!yesterdayData) {
    console.log("calculateStreak - No data for yesterday, returning streak as todayBonus:", todayBonus);
    return todayBonus;
  }

  let currentStreak = 0;
  let checkDate = yesterday;
  console.log("calculateStreak - Starting Streak Calculation from Yesterday, checkDate:", checkDate.toString());

  for (const day of sortedDays) {
    const activityDate = parseISO(day.date);
    console.log(
      "calculateStreak - Checking Day:",
      day.date,
      "Parsed Activity Date (local timezone):",
      activityDate.toString(),
      "with count:",
      day.count || 0
    );

    if (isSameDay(activityDate, checkDate)) {
      if (day.count > 0) {
        currentStreak++;
        console.log(
          "calculateStreak - Contributions found, Streak incremented to:",
          currentStreak,
          "for date:",
          day.date
        );
        checkDate = subDays(checkDate, 1);
        console.log("calculateStreak - Moving to previous day, new checkDate:", checkDate.toString());
      } else {
        console.log("calculateStreak - No contributions on", day.date, "streak ends");
        break;
      }
    } else if (activityDate > checkDate) {
      console.log(
        "calculateStreak - Activity date",
        activityDate.toString(),
        "is after checkDate",
        checkDate.toString(),
        "skipping"
      );
      continue;
    } else {
      console.log(
        "calculateStreak - Activity date",
        activityDate.toString(),
        "is before checkDate",
        checkDate.toString(),
        "but not matching, streak ends (missed day)"
      );
      break;
    }
  }

  const finalStreak = currentStreak + todayBonus;
  console.log(
    "calculateStreak - Past Streak (from yesterday backwards):",
    currentStreak,
    "Today Bonus:",
    todayBonus,
    "Final Streak:",
    finalStreak
  );
  return finalStreak;
};