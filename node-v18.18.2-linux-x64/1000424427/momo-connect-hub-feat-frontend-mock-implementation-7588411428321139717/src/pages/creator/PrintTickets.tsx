import AppLayout from "@/components/layout/AppLayout";
import { PrintQueue } from "@/components/creator/PrintQueue";
import { useTickets } from "@/hooks/useTickets";
import { Ticket } from "@/types/ticket";

const PrintTickets = () => {
  const { myTickets, isLoading } = useTickets();

  const ticketsToPrint = (myTickets || []).filter(
    (ticket: Ticket) => ticket.is_physical && ticket.status === 'active'
  );

  const handlePrint = (ticketId: string) => {
    console.log(`Printing ticket ${ticketId}`);
    // This would trigger a print view for the specific ticket
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Print Tickets</h1>
        {isLoading ? <p>Loading...</p> : <PrintQueue ticketsToPrint={ticketsToPrint} onPrint={handlePrint} />}
      </div>
    </AppLayout>
  );
};

export default PrintTickets;
