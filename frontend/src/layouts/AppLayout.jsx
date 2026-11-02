import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-shell">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="app-main">

        <Topbar onMenuClick={openSidebar} />

        <main className="app-content">
          <Outlet />
        </main>

        <footer className="app-footer">
          <span>
            © {new Date().getFullYear()} Eureka Solutions. All rights reserved.
          </span>

          <span>
            Built with <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a> and <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer">Vite</a>.
          </span>
        </footer>

      </div>

    </div>
  );
}

export default AppLayout;