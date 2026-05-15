import { createSession } from '../auth/session';
import { tokenValidator } from '../utils/tokenValidator';

export const processPayment = (userId: string) => {
    const session = createSession(userId);
    const valid = tokenValidator.verify(session);
    return valid;
}
