import  { Subjects } from './subjects';
import { Event } from './base-listener';

export interface TicketUpdatedEvent {
    subject: Subjects.TicketUpdated;
    
    data: {
        id: string,
        title: string,
        price: number,
        userId: string,
        version: number,
        orderId?: string
    };
    
}