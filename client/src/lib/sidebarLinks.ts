// lib/sidebarLinks.ts
import { Home, Briefcase, Search, Settings, User, Users, AlertCircle, ChartGantt, ShieldAlert, AlertTriangle, AlertOctagon, Layers3 } from 'lucide-react';

export const STATIC_SIDEBAR_LINKS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Timeline', href: '/timeline', icon: ChartGantt },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Users', href: '/users', icon: User },
  { label: 'Teams', href: '/teams', icon: Users },
];

export const STATIC_PRIORITY_LINKS = [
  { label: 'Urgent', href: '/priority/urgent', icon: AlertCircle },
  { label: 'High', href: '/priority/high', icon: ShieldAlert },
  { label: 'Medium', href: '/priority/medium', icon: AlertTriangle },
  { label: 'Low', href: '/priority/low', icon: AlertOctagon },
  { label: 'Backlog', href: '/priority/backlog', icon: Layers3 },
];
