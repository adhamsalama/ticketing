import { Ticket } from '../ticket';

it('implements omptimistic concurrency control', async () => {
    const ticket = Ticket.build({
        title: 'test',
        price: 20,
        userId: 'asdf'
    });
    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({ price: 10});
    await firstInstance!.save();

    secondInstance!.set({ price: 15 });
    try {
        await secondInstance!.save();
    }
    catch (err) {
        return;
    }
    throw new Error('Should not reach this point');

});

it('increments the version number multiple times', async () => {
    const ticket = Ticket.build({
        title: 'test',
        price: 20,
        userId: 'asdf'
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);
    
    await ticket.save();
    expect(ticket.version).toEqual(2);

});
