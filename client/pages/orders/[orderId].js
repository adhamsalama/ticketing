import { useEffect, useState } from 'react';

const OrderShow = ({ order }) => {
    const [timeLeft, setTimeLeft] = useState('');

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
    return <div>Time left to pay: {timeLeft} seconds.</div>
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
};

export default OrderShow;