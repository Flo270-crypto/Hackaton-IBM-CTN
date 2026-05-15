export const tokenValidator = {
    generate: (userId: string) => `token_${userId}`,
    verify: (token: string) => token.startsWith('token_'),
    invalidate: (token: string) => console.log(`invalidated ${token}`)
}
