import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id,
        },
        onSuccess: (payment) => console.log(payment)
    });
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft/1000));
        };
        findTimeLeft(); // to avoid waiting for 1 sec
        const timerId = setInterval(findTimeLeft, 1000);
        // this function wil be called if we navigate away from the component or rerendered
        return () => {
            clearInterval(timerId);
        };
    }, []);

    if(timeLeft < 0) {
        return <div>Order Expired</div>
    }

    return <div>
        Time left to pay: {timeLeft} seconds.
        <StripeCheckout 
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51K8UVGABm7D5syb0EIihan0dwyTlYdSZTxmqIpOhzOCNGZyOfkeMj228VAd5L6Sr3cUw2c5RqWXKpUVuJgYfGzqj00dFpr1XbI'
        amount={order.ticket.price * 100}
        email={currentUser.email}
    />    
    {errors}
    </div>
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
};

export default OrderShow;