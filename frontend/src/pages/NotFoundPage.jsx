import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="not-found-page">

      <div className="not-found-icon">
        <SearchX size={38} />
      </div>

      <span className="page-eyebrow">
        ERROR 404
      </span>

      <h1>Page not found</h1>

      <p>
        The page you are looking for does not exist
        or may have been moved.
      </p>

      <Link
        to="/dashboard"
        className="primary-button"
      >
        Return to Dashboard
      </Link>

    </div>
  );
}

export default NotFoundPage;