import AppLayout from "@/components/layout/AppLayout";
import { CreateTicketForm } from "@/components/tickets/CreateTicketForm";

const CreateTicket = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Create a New Ticket</h1>
        <CreateTicketForm />
      </div>
    </AppLayout>
  );
};

export default CreateTicket;
