import {
  LoaderCircle,
  AlertCircle,
  Inbox,
  RefreshCw
} from 'lucide-react';

export function LoadingState({
  message = 'Loading information...'
}) {
  return (
    <div className="feedback-state">
      <LoaderCircle
        className="loading-spinner"
        size={32}
      />

      <h3>Loading</h3>

      <p>{message}</p>
    </div>
  );
}

export function EmptyState({
  title = 'No records found',
  message = 'There is nothing to display right now.',
  icon: Icon = Inbox,
  action
}) {
  return (
    <div className="feedback-state">
      <div className="feedback-icon">
        <Icon size={28} />
      </div>

      <h3>{title}</h3>

      <p>{message}</p>

      {action && (
        <div className="feedback-action">
          {action}
        </div>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load the requested information.',
  onRetry
}) {
  return (
    <div className="feedback-state error-state">
      <div className="feedback-icon error-icon">
        <AlertCircle size={28} />
      </div>

      <h3>{title}</h3>

      <p>{message}</p>

      {onRetry && (
        <button
          className="secondary-button"
          onClick={onRetry}
        >
          <RefreshCw size={15} />
          Try again
        </button>
      )}
    </div>
  );
}