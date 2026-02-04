import { addDays, format, isValid, nextFriday, nextMonday, nextSaturday, nextSunday, nextThursday, nextTuesday, nextWednesday, setHours, setMinutes, startOfDay } from 'date-fns';
import { callPlanningLLM } from './llm.js';

const dayMap = {
  monday: nextMonday,
  tuesday: nextTuesday,
  wednesday: nextWednesday,
  thursday: nextThursday,
  friday: nextFriday,
  saturday: nextSaturday,
  sunday: nextSunday,
};

function parseTime(text) {
  const timeMatch = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
  if (!timeMatch) return null;
  let hour = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2] || 0);
  const meridiem = timeMatch[3]?.toLowerCase();
  if (meridiem === 'pm' && hour < 12) hour += 12;
  if (meridiem === 'am' && hour === 12) hour = 0;
  return { hour, minutes };
}

function parseRelativeDate(text) {
  const lower = text.toLowerCase();
  const now = new Date();

  if (lower.includes('tomorrow')) return addDays(startOfDay(now), 1);
  if (lower.includes('day after tomorrow')) return addDays(startOfDay(now), 2);
  if (lower.includes('today')) return startOfDay(now);

  const dayMatch = lower.match(/\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/);
  if (dayMatch) {
    const fn = dayMap[dayMatch[1]];
    return fn ? fn(now) : null;
  }

  return null;
}

function buildDateTime(date, timeText) {
  if (!date) return null;
  const time = parseTime(timeText || '');
  if (!time) return date;
  const withHour = setHours(date, time.hour);
  return setMinutes(withHour, time.minutes);
}

function fallbackParse(command) {
  const lower = command.toLowerCase();
  const fromMatch = lower.match(/\bfrom\s+([a-z\s]+?)\s+to\s+([a-z\s]+?)(?:\s|$)/i);
  const toMatch = lower.match(/\bto\s+([a-z\s]+?)(?:\s|$)/i);
  const from = fromMatch?.[1]?.trim() || '';
  const to = fromMatch?.[2]?.trim() || toMatch?.[1]?.trim() || '';
  const date = parseRelativeDate(command);
  const dateTime = buildDateTime(date, command);
  const isoDate = date ? format(date, 'yyyy-MM-dd') : '';
  const timeText = dateTime ? format(dateTime, 'HH:mm') : '';
  return {
    from: from ? from.replace(/\b(kota|delhi)\b/i, (m) => m[0].toUpperCase() + m.slice(1)) : from,
    to: to ? to.replace(/\b(kota|delhi)\b/i, (m) => m[0].toUpperCase() + m.slice(1)) : to,
    date: isoDate,
    time: timeText,
    raw: command,
  };
}

export async function parseCommand(command) {
  const llm = await callPlanningLLM(command);
  if (llm?.from || llm?.to || llm?.date) {
    const date = llm.date ? new Date(llm.date) : null;
    const normalizedDate = date && isValid(date) ? format(date, 'yyyy-MM-dd') : llm.date || '';
    return {
      from: llm.from || '',
      to: llm.to || '',
      date: normalizedDate,
      time: llm.time || '',
      raw: command,
    };
  }
  return fallbackParse(command);
}
