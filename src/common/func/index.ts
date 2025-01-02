import type { DateLogs, LogEntry } from '../types';

export const parseDate = (dateStr: string) => {
  // '2024/7/23' の形式を処理
  if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateStr)) {
    const [year, month, day]: number[] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
  // '2024年11月11日月曜日' の形式を処理
  const jpDateMatch: RegExpMatchArray | null = dateStr.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (jpDateMatch) {
    const [, year, month, day]: number[] = jpDateMatch.map(Number);
    return new Date(year, month - 1, day);
  }
  return null;
};

export function getTargetDayLogs(dateLogs: DateLogs[], targetDay: Date): DateLogs[] {
  const targetDayLogs: DateLogs[] = dateLogs.filter((item: DateLogs) => {
    return item.registered_date === targetDay.toLocaleDateString();
  });
  return targetDayLogs;
}

export function groupedLogsByDate(dayLogs: DateLogs[]): Record<string, LogEntry[][]> {
  const dayLogsbydateKey: Record<string, LogEntry[][]> = dayLogs.reduce(
    (acc: Record<string, LogEntry[][]>, log: DateLogs): Record<string, LogEntry[][]> => {
      const date: string = log.timestamp.split(' ')[0];
      acc[date] = acc[date] || [];
      acc[date].push(log.logs);
      return acc;
    },
    {},
  );
  return dayLogsbydateKey;
}
