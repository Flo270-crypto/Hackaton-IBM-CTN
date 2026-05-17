import { createSession, destroySession } from '../auth/session';

export const mobileLogin = (userId: string) => {
    return createSession(userId);
}

export const mobileLogout = (token: string) => {
    destroySession(token);
}
