export const mockUsers = [
    { id: 'u1', name: 'Alice Chen', email: 'alice@example.com', ltv: 1250.50, lastSeen: '2 mins ago', country: 'US', status: 'active' },
    { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', ltv: 450.00, lastSeen: '15 mins ago', country: 'UK', status: 'idle' },
    { id: 'u3', name: 'Charlie Kim', email: 'charlie@example.com', ltv: 2200.00, lastSeen: '1 hour ago', country: 'KR', status: 'offline' },
    { id: 'u4', name: 'David Miller', email: 'david@example.com', ltv: 89.99, lastSeen: 'Just now', country: 'DE', status: 'active' },
    { id: 'u5', name: 'Eva Green', email: 'eva@example.com', ltv: 3400.25, lastSeen: '3 days ago', country: 'FR', status: 'offline' },
]

export const mockUserHistory = {
    'u1': [
        { time: '10:00 AM', event: 'Session Start', type: 'info' },
        { time: '10:02 AM', event: 'Viewed Product: Digital Factory', type: 'view' },
        { time: '10:05 AM', event: 'Added to Cart', type: 'cart' },
        { time: '10:15 AM', event: 'Checkout Initiated', type: 'checkout' },
        { time: '10:18 AM', event: 'Purchase Complete ($450)', type: 'purchase' },
    ],
    'u2': [
        { time: '09:30 AM', event: 'Session Start', type: 'info' },
        { time: '09:35 AM', event: 'Viewed Product: VCarve Pro', type: 'view' },
        { time: '09:40 AM', event: 'Added to Cart', type: 'cart' },
        { time: '10:00 AM', event: 'Cart Abandoned', type: 'error' },
    ]
}

export const mockProducts = [
    { id: 'p1', name: 'Digital Factory 11', price: 1995, cogs: 400, stock: 150 },
    { id: 'p2', name: 'VCarve Pro', price: 699, cogs: 150, stock: 45 },
    { id: 'p3', name: 'Aspire 12', price: 1995, cogs: 500, stock: 80 },
    { id: 'p4', name: 'Filmmaker 10', price: 495, cogs: 100, stock: 200 },
]
