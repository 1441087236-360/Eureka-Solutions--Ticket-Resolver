import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader.jsx';
import TicketForm from '../features/tickets/TicketForm.jsx';

function CreateTicketPage() {
  return (
    <div className="page-container">

      <PageHeader
        eyebrow="TICKET MANAGEMENT"
        title="Create a Ticket"
        description="Submit a support request with the relevant issue information."
        actions={
          <Link
            to="/tickets"
            className="secondary-button"
          >
            <ArrowLeft size={16} />
            Back to tickets
          </Link>
        }
      />

      <section className="content-card ticket-form-card">

        <div className="ticket-form-card-heading">
          <div>
            <h2>New support request</h2>

            <p>
              Fields marked with * are required.
            </p>
          </div>

          <span className="form-reference-label">
            NEW REQUEST
          </span>
        </div>

        <TicketForm />

      </section>

    </div>
  );
}

export default CreateTicketPage;