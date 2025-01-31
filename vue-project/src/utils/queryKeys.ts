const HEALTH_KEYS = {
    health: 'health'
}

const USER_KEYS = {
    users: 'users',
    user: 'user'
}

const AUTH_KEYS = {
    setPassword: 'setPassword',
}

export const QUERY_KEYS = {
    ...HEALTH_KEYS,
    ...USER_KEYS,
    ...AUTH_KEYS
} as const