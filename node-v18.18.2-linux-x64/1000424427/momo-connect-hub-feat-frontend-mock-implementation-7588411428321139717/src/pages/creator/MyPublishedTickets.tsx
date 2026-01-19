import AppLayout from "@/components/layout/AppLayout";
import { TicketList } from "@/components/tickets/TicketList";
import { useTickets } from "@/hooks/useTickets";

const MyPublishedTickets = () => {
  const { myTickets, isLoading } = useTickets();

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Published Tickets</h1>
        {isLoading ? <p>Loading...</p> : <TicketList tickets={myTickets || []} />}
      </div>
    </AppLayout>
  );
};

export default MyPublishedTickets;
