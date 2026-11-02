import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TicketsPage from './pages/TicketsPage.jsx';
import CreateTicketPage from './pages/CreateTicketPage.jsx';
import TicketDetailsPage from './pages/TicketDetailsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<AppLayout />}>

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/tickets"
            element={<TicketsPage />}
          />

          <Route
            path="/tickets/new"
            element={<CreateTicketPage />}
          />

          <Route
            path="/tickets/:id"
            element={<TicketDetailsPage />}
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;