import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  CloudCheck,
  X
} from 'lucide-react';

import { NavLink } from 'react-router-dom';

const navigation = [
  {
    label: 'OVERVIEW',
    items: [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        end: true
      }
    ]
  },
  {
    label: 'SUPPORT MANAGEMENT',
    items: [
      {
        name: 'All Tickets',
        path: '/tickets',
        icon: Ticket,
        end: true
      },
      {
        name: 'Create Ticket',
        path: '/tickets/new',
        icon: PlusCircle,
        end: true
      }
    ]
  }
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <CloudCheck size={23} />
          </div>

          <div className="sidebar-brand-text">
            <h2>Eureka Solutions</h2>
            <span>Ticket Resolver</span>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        <div className="sidebar-divider" />

        <nav className="sidebar-navigation">
          {navigation.map((section) => (
            <div
              className="nav-section"
              key={section.label}
            >
              <span className="nav-section-label">
                {section.label}
              </span>

              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'nav-link-active' : ''}`
                    }
                  >
                    <Icon size={18} strokeWidth={1.9} />

                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <div className="help-icon">
              <CloudCheck size={19} />
            </div>

            <div>
              <strong>Workspace</strong>
              <span>2026 Edition</span>
            </div>
          </div>

          <div className="sidebar-version">
            Eureka Solutions · Ticket Resolver v1.0.0
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;