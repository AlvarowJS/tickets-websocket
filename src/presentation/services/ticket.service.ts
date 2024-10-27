import { UuidAdapter } from "../../config/uuid.adapter";
import { Ticket } from "../../domain/interfaces/ticket";
import { WssService } from "./wss.service";

export class TicketService {

    constructor(
        private readonly wssService = WssService.instance,
    ) { }
    public readonly tickets: Ticket[] = [
        { id: UuidAdapter.v4(), number: 1, createdAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 2, createdAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 3, createdAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 4, createdAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 5, createdAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 6, createdAt: new Date(), done: false }
    ];
    public readonly workinOnTickets: Ticket[] = [];

    public get pendingTickets(): Ticket[] {
        return this.tickets.filter(ticket => !ticket.handleAtDesk);
    }

    public get lastWorkingOnTicket(): Ticket[] {
        return this.workinOnTickets.splice(0, 4);
    }


    public get lastTicketNumber(): number {
        return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0;
    }

    public createTicket() {
        const ticket: Ticket = {
            id: UuidAdapter.v4(),
            number: this.lastTicketNumber + 1,
            createdAt: new Date(),
            done: false,
            handleAt: undefined,
            handleAtDesk: undefined
        }
        this.tickets.push(ticket);
        this.onTicketNumberChanged();

        return ticket;

    }

    public drawTicket(desk: string) {

        const ticket = this.tickets.find(t => !t.handleAtDesk);
        if (!ticket) return { status: 'error', message: 'No hay tickets pendientes' };

        ticket.handleAtDesk = desk;
        ticket.handleAt = new Date();

        this.workinOnTickets.unshift({ ...ticket });

        return { status: 'ok', ticket }

    }

    public onFinishedTicket(id: string) {
        const ticket = this.tickets.find(t => t.id === id);
        if (!ticket) return {
            status: 'error',
            message: 'Ticket no encontrado'
        }
        this.tickets.map(ticket => {

            if (ticket.id === id) {
                ticket.done = true;
            }

            return ticket;
        });
        return { status: 'ok' }
    }

    private onTicketNumberChanged() {
        this.wssService.sendMessage('on-ticket-count-changed', this.pendingTickets.length);
    }
}