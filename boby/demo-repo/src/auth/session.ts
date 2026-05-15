import { tokenValidator } from '../utils/tokenValidator';
import { dbConnect } from '../api/database';

export const createSession = (userId: string) => {
    const token = tokenValidator.generate(userId);
    dbConnect.saveSession(token);
    return token;
}

export const destroySession = (token: string) => {
    tokenValidator.invalidate(token);
    dbConnect.removeSession(token);
}
