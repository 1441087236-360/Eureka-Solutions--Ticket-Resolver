import {
  Menu,
  ChevronRight,
  Bell,
  CircleUserRound
} from 'lucide-react';

import { useLocation } from 'react-router-dom';

const pageTitles = [
  {
    match: '/dashboard',
    title: 'Dashboard',
    subtitle: 'Overview of your support operations.'
  },
  {
    match: '/tickets/new',
    title: 'Create Ticket',
    subtitle: 'Submit a new support request.'
  },
  {
    match: '/tickets',
    title: 'Tickets',
    subtitle: 'Manage and track support requests.'
  }
];

function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();

  const currentPage =
    pageTitles.find(
      (page) => pathname === page.match ||
        (page.match === '/tickets' &&
          pathname.startsWith('/tickets/') &&
          pathname !== '/tickets/new')
    ) || pageTitles[0];

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>

        <div className="topbar-breadcrumb">
          <span>Workspace</span>

          <ChevronRight size={14} />

          <strong>{currentPage.title}</strong>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-environment">
          <span className="environment-dot" />
          -
        </div>

        <div
          className="topbar-icon"
          title="Notifications"
        >
          <Bell size={19} />
          <span className="notification-indicator" />
        </div>

        <div className="topbar-profile">
          <div className="profile-avatar">
            <CircleUserRound size={20} />
          </div>

          <div className="profile-info">
            <strong>Admin</strong>
            <span>Workspace</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;