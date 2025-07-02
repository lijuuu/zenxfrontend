import {  parseISO, subDays, isSameDay } from 'date-fns';


export const calculateStreak = (activityData, currentDate) => {

  if (!activityData || activityData.length === 0) {
    return 0;
  }

  const sortedDays = [...activityData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const today = new Date(currentDate);
  const yesterday = subDays(today, 1);

  const todayData = sortedDays.find(day => isSameDay(parseISO(day.date), today));
  const todayBonus = todayData && todayData.count > 0 ? 1 : 0;

  const yesterdayData = sortedDays.find(day => isSameDay(parseISO(day.date), yesterday));
  if (!yesterdayData) {
    return todayBonus;
  }

  let currentStreak = 0;
  let checkDate = yesterday;

  for (const day of sortedDays) {
    const activityDate = parseISO(day.date);
    

    if (isSameDay(activityDate, checkDate)) {
      if (day.count > 0) {
        currentStreak++;
       
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    } else if (activityDate > checkDate) {
      
      continue;
    } else {
      
      break;
    }
  }

  const finalStreak = currentStreak + todayBonus;
  
  return finalStreak;
};