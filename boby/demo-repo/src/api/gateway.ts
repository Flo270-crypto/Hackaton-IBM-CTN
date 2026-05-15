import { createSession } from '../auth/session';
import { processPayment } from '../payments/stripe';

export const apiHandler = (userId: string) => {
    const session = createSession(userId);
    const payment = processPayment(userId);
    return { session, payment };
}
