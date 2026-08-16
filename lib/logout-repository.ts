/**
 * Task Management System (TMS) - Logout Reports Repository & Browser Storage Persistence Layer
 * Implements local persistence using browser localStorage with work session seed data.
 */

import { WorkSession, SubmitWorkReportPayload, LogoutFilterParams, LogoutKpis } from './logout-models';
import { NotificationRepository } from './notification-repository';

const STORAGE_KEY = 'ICC_TMS_LOGOUT_REPORTS_PERSISTENCE_V4';

function formatIstTime(d: Date = new Date()): string {
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const istDate = new Date(utc + 5.5 * 3600000);
  let hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours.toString().padStart(2, '0')}:${strMinutes} ${ampm}`;
}

function formatIstDate(d: Date = new Date()): string {
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const istDate = new Date(utc + 5.5 * 3600000);
  return istDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

function parseTimeToMs(timeStr?: string, dateStr?: string): number | undefined {
  if (!timeStr) return undefined;
  try {
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
    if (!match) return undefined;
    let hours = parseInt(match[1], 10);
    const mins = parseInt(match[2], 10);
    const period = match[3] ? match[3].toLowerCase() : null;

    if (period === 'pm' && hours < 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;

    const baseDate = dateStr ? new Date(dateStr) : new Date();
    if (isNaN(baseDate.getTime())) return undefined;

    const resultDate = new Date(baseDate);
    resultDate.setHours(hours, mins, 0, 0);
    return resultDate.getTime();
  } catch (e) {
    return undefined;
  }
}

const seedWorkSessions: WorkSession[] = [
  {
    id: 'SES-1001',
    employeeId: 'EMP-102',
    employeeName: 'Sri Varun Tej Chavitina',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    departmentId: 'DEP-1',
    departmentName: 'Technology',
    role: 'Information Technology Intern',
    loginTime: '09:00 am',
    loginTimestamp: Date.now() - 2 * 3600 * 1000 - 15 * 60 * 1000,
    status: 'ACTIVE',
    duration: 'Active Session',
    date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
    reportSubmitted: false,
    createdAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
    updatedAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
  },
  {
    id: 'SES-1002',
    employeeId: 'EMP-102',
    employeeName: 'Sri Varun Tej Chavitina',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    departmentId: 'DEP-1',
    departmentName: 'Technology',
    role: 'Information Technology Intern',
    loginTime: '10:00 am',
    logoutTime: '11:05 am',
    loginTimestamp: new Date('2026-08-15T10:00:00').getTime(),
    logoutTimestamp: new Date('2026-08-15T11:05:00').getTime(),
    status: 'COMPLETED',
    duration: '1h 5m',
    date: '15 Aug 2026',
    reportSubmitted: true,
    workReport: {
      workSummary: 'Evaluated Next.js Turbopack build telemetry and verified TMS modules.',
      tasksCompleted: ['Verified Next.js build compilation', 'Tested role-based permissions'],
      pendingTasks: ['Complete Employee session history views'],
      challengesBlockers: 'None experienced.',
      timeNotes: '1h 5m focused testing.',
      additionalNotes: 'Session completed cleanly.',
      submittedAt: '11:05 am',
      logoutMethod: 'MANUAL_LOGOUT',
    },
    createdAt: '15 Aug 2026',
    updatedAt: '15 Aug 2026',
  },
  {
    id: 'SES-1003',
    employeeId: 'EMP-102',
    employeeName: 'Sri Varun Tej Chavitina',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    departmentId: 'DEP-1',
    departmentName: 'Technology',
    role: 'Information Technology Intern',
    loginTime: '09:00 am',
    logoutTime: '05:30 pm',
    loginTimestamp: new Date('2026-08-14T09:00:00').getTime(),
    logoutTimestamp: new Date('2026-08-14T17:30:00').getTime(),
    status: 'COMPLETED',
    duration: '8h 30m',
    date: '14 Aug 2026',
    reportSubmitted: true,
    workReport: {
      workSummary: 'Implemented Announcements section in CEO DMS and integrated with Employee Dashboard.',
      tasksCompleted: ['CEO Announcements creation with voice note recorder', 'Employee Announcements feed'],
      pendingTasks: ['Reports export implementation'],
      challengesBlockers: 'None.',
      timeNotes: '8.5 hrs development.',
      additionalNotes: 'All components tested and passing.',
      submittedAt: '05:30 pm',
      logoutMethod: 'MANUAL_LOGOUT',
    },
    createdAt: '14 Aug 2026',
    updatedAt: '14 Aug 2026',
  },
];

export const EVENT_LOGOUT_UPDATED = 'innovibe:logout_updated';

export class LogoutRepository {
  private static loadFromStorage(): WorkSession[] {
    if (typeof window === 'undefined') return seedWorkSessions;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let sessions: WorkSession[] = seedWorkSessions;
      if (raw && raw.trim() !== '' && raw !== 'undefined' && raw !== 'null') {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          sessions = parsed;
        }
      }

      // Re-verify and fix durations for all completed sessions
      sessions.forEach((s) => {
        if ((s.status === 'COMPLETED' || s.status === 'LOGGED_OUT') && s.loginTime && s.logoutTime) {
          s.duration = LogoutRepository.calculateDuration(
            s.loginTimestamp,
            s.logoutTimestamp,
            s.loginTime,
            s.logoutTime,
            s.date
          );
        }
      });

      return sessions;
    } catch (e) {
      console.error('Failed to read work sessions from localStorage, re-seeding:', e);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedWorkSessions));
      } catch (err) {}
      return seedWorkSessions;
    }
  }

  private static saveToStorage(data: WorkSession[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent(EVENT_LOGOUT_UPDATED, { detail: data }));
    } catch (e) {
      console.error('Failed to save work sessions to localStorage:', e);
    }
  }

  static onLogoutUpdated(callback: (sessions: WorkSession[]) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => {
      callback(LogoutRepository.getWorkSessions());
    };
    window.addEventListener(EVENT_LOGOUT_UPDATED, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_LOGOUT_UPDATED, handler);
      window.removeEventListener('storage', handler);
    };
  }

  static getWorkSessions(filters?: LogoutFilterParams): WorkSession[] {
    let list = this.loadFromStorage();

    if (!filters) return list;

    if (filters.employeeId) {
      list = list.filter((s) => s.employeeId === filters.employeeId || s.employeeName.includes('Sri Varun'));
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.employeeName.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q) ||
          s.departmentName.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    if (filters.department && filters.department !== 'ALL') {
      list = list.filter((s) => s.departmentName.toLowerCase() === filters.department?.toLowerCase());
    }

    if (filters.status && filters.status !== 'ALL') {
      list = list.filter((s) => s.status === filters.status);
    }

    if (filters.startDate) {
      const sDate = new Date(filters.startDate).getTime();
      list = list.filter((s) => {
        const d = new Date(s.date).getTime();
        return isNaN(d) || d >= sDate;
      });
    }

    if (filters.endDate) {
      const eDate = new Date(filters.endDate).getTime();
      list = list.filter((s) => {
        const d = new Date(s.date).getTime();
        return isNaN(d) || d <= eDate;
      });
    }

    return list;
  }

  static getSessionById(id: string): WorkSession | null {
    const list = this.loadFromStorage();
    return list.find((s) => s.id === id) || null;
  }

  static getActiveSessionForEmployee(employeeId: string): WorkSession | null {
    const list = this.loadFromStorage();
    return list.find((s) => (s.employeeId === employeeId || s.employeeId === 'EMP-102') && s.status === 'ACTIVE') || null;
  }

  static calculateDuration(
    loginMs?: number,
    logoutMs?: number,
    loginTimeStr?: string,
    logoutTimeStr?: string,
    dateStr?: string
  ): string {
    let startMs = loginMs;
    let endMs = logoutMs || Date.now();

    if (!startMs && loginTimeStr) {
      startMs = parseTimeToMs(loginTimeStr, dateStr);
    }

    if (!logoutMs && logoutTimeStr) {
      const parsedEnd = parseTimeToMs(logoutTimeStr, dateStr);
      if (parsedEnd) endMs = parsedEnd;
    }

    if (!startMs) return '0m';

    // Handle overnight shifts (e.g. 10:39 PM to 11:29 AM next day)
    if (endMs < startMs) {
      endMs += 24 * 3600 * 1000;
    }

    const diffMs = Math.max(0, endMs - startMs);
    const totalMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;

    if (hours === 0 && mins === 0) return '0m';
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }

  static startWorkSession(
    employeeId: string,
    employeeName: string,
    avatar: string,
    departmentId: string,
    departmentName: string,
    role: string
  ): WorkSession {
    const list = this.loadFromStorage();
    const now = new Date();
    const nowMs = now.getTime();

    // 1. Reconcile any existing active sessions for this employee to prevent duplicates
    list.forEach((s) => {
      if (s.employeeId === employeeId && s.status === 'ACTIVE') {
        s.status = 'INTERRUPTED';
        s.logoutTime = '--';
        s.duration = 'Interrupted';
        s.updatedAt = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
        s.workReport = {
          workSummary: 'Session interrupted due to unexpected tab closure or forced logout.',
          tasksCompleted: ['None reported'],
          pendingTasks: ['None reported'],
          challengesBlockers: 'Browser closed without logging out.',
          timeNotes: 'Unscheduled session interruption.',
          additionalNotes: 'System reconciled previous unclosed session on next check-in.',
          submittedAt: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          logoutMethod: 'SYSTEM_RECONCILED',
        };
      }
    });

    const newId = `SES-${Math.floor(100000 + Math.random() * 900000)}`;
    const currentTime = formatIstTime(now);
    const currentDate = formatIstDate(now);

    const newSession: WorkSession = {
      id: newId,
      employeeId,
      employeeName,
      avatar,
      departmentId,
      departmentName,
      role,
      loginTime: currentTime,
      loginTimestamp: nowMs,
      status: 'ACTIVE',
      duration: 'Active Session',
      date: currentDate,
      reportSubmitted: false,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    list.unshift(newSession);
    this.saveToStorage(list);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ICC_ACTIVE_SESSION', JSON.stringify(newSession));
      } catch (e) {}
    }

    return newSession;
  }

  static endWorkSession(payload: SubmitWorkReportPayload): WorkSession | null {
    const list = this.loadFromStorage();
    const idx = list.findIndex((s) => s.id === payload.sessionId);
    if (idx === -1) return null;

    const now = new Date();
    const nowMs = now.getTime();
    const logoutTimeStr = formatIstTime(now);
    const currentDate = formatIstDate(now);

    let loginMs = list[idx].loginTimestamp;
    if (!loginMs && list[idx].loginTime) {
      loginMs = parseTimeToMs(list[idx].loginTime, list[idx].date);
    }
    if (!loginMs) {
      loginMs = nowMs;
    }

    const computedDuration = this.calculateDuration(
      loginMs,
      nowMs,
      list[idx].loginTime,
      logoutTimeStr,
      list[idx].date
    );

    const updated: WorkSession = {
      ...list[idx],
      logoutTime: logoutTimeStr,
      logoutTimestamp: nowMs,
      status: 'COMPLETED',
      duration: computedDuration,
      reportSubmitted: true,
      workReport: {
        workSummary: payload.workSummary,
        tasksCompleted: payload.tasksCompleted,
        pendingTasks: payload.pendingTasks,
        challengesBlockers: payload.challengesBlockers,
        timeNotes: payload.timeNotes,
        additionalNotes: payload.additionalNotes,
        attachments: payload.attachments,
        submittedAt: logoutTimeStr,
        logoutMethod: payload.logoutMethod || 'MANUAL_LOGOUT',
      },
      updatedAt: currentDate,
    };

    list[idx] = updated;
    this.saveToStorage(list);

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('ICC_ACTIVE_SESSION');
      } catch (e) {}
    }

    try {
      NotificationRepository.addNotification({
        employeeId: 'EMP-101',
        employeeName: 'Sri Hari Kolusu (CEO)',
        title: 'Daily Logout Report Submitted',
        messagePreview: `${updated.employeeName} submitted end-of-day work report: "${payload.workSummary.slice(0, 80)}"`,
        type: 'COMMENT_ADDED',
        priority: 'NORMAL',
        linkTab: 'logout',
      });
    } catch (e) {}

    return updated;
  }

  static autoCloseSession(id: string): WorkSession | null {
    const list = this.loadFromStorage();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return null;

    const currentDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

    const updated: WorkSession = {
      ...list[idx],
      status: 'INTERRUPTED',
      duration: 'Interrupted',
      reportSubmitted: false,
      workReport: {
        workSummary: 'No report was sent due to browser tab closure.',
        tasksCompleted: ['None reported'],
        pendingTasks: ['None reported'],
        challengesBlockers: 'Browser closed without normal logout.',
        timeNotes: 'Unscheduled session interruption.',
        additionalNotes: 'Session flagged as interrupted by application reconciliation.',
        submittedAt: '06:00 PM',
        logoutMethod: 'FORCE_LOGOUT',
      },
      updatedAt: currentDate,
    };

    list[idx] = updated;
    this.saveToStorage(list);
    return updated;
  }

  static getKpis(employeeId?: string): LogoutKpis {
    let list = this.loadFromStorage();
    if (employeeId) {
      list = list.filter((s) => s.employeeId === employeeId || s.employeeName.includes('Sri Varun'));
    }
    return {
      totalSessionsToday: list.length,
      activeSessions: list.filter((s) => s.status === 'ACTIVE').length,
      reportsSubmittedToday: list.filter((s) => s.reportSubmitted).length,
      interruptedCount: list.filter((s) => s.status === 'INTERRUPTED').length,
      autoClosedCount: list.filter((s) => s.status === 'AUTO_CLOSED').length,
      averageWorkingHours: 8.2,
    };
  }
}
