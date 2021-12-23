import  { Subjects } from './subjects';
import { Event } from './base-listener';

export interface TicketCreatedEvent {
    subject: Subjects.TicketCreated;
    
    data: {
        id: string,
        title: string,
        price: number,
        userId: string,
        version: number
    };
    
}