const OrderIndex = ({ orders }) => {
    return <div>
        
        <ol class="list-group list-group-numbered">
            {orders.map(order => {
                return <li class="list-group-item d-flex justify-content-between align-items-start">
                            <div class="ms-2 me-auto">
                            <div class="fw-bold">{order.ticket.title}</div>
                            {order.status}
                            </div>
                            <span class="badge bg-primary rounded-pill">${order.ticket.price}</span>
                        </li>
            })}
        </ol>
    </div>;
};

OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');

    return { orders: data };
};

export default OrderIndex;