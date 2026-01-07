# CADLINK Analytics Platform - Architecture

## Tech Stack

### Frontend
- **Next.js 15+** (App Router, Server Components)
- **TypeScript** (Type safety)
- **Tailwind CSS** (Styling)
- **Shadcn UI** (Component library)
- **Recharts** (Data visualization)
- **Zustand** (State management)
- **Socket.io Client** (Real-time updates)

### Backend
- **Next.js API Routes** (REST API)
- **PostgreSQL** (Primary database)
- **Redis** (Session cache, real-time data)
- **Prisma** (ORM)
- **Socket.io Server** (WebSocket)

### Third-Party Services
- **Stripe** (Payments)
- **Vercel Analytics** (Performance)
- **Resend** (Email notifications)
- **Upstash Redis** (Serverless Redis)

## Database Schema

### Core Tables

```sql
-- Users & Authentication
users (id, email, name, role, created_at, last_login)
sessions (id, user_id, ip, device, browser, country, city, started_at, ended_at)

-- Analytics Events
events (id, session_id, event_type, page_url, timestamp, metadata)
page_views (id, session_id, page_url, duration, timestamp)
cart_events (id, session_id, product_id, action, timestamp)
conversions (id, session_id, order_id, revenue, timestamp)

-- Products
products (id, name, price, cost, stock, status, created_at)
price_history (id, product_id, old_price, new_price, changed_at)

-- Payments
orders (id, user_id, total, status, stripe_id, created_at)
refunds (id, order_id, amount, reason, created_at)

-- Configuration
integrations (id, name, config, enabled, created_at)
tracking_scripts (id, name, code, location, enabled, version)

-- Admin
admin_users (id, email, role, two_fa_enabled)
audit_logs (id, admin_id, action, details, timestamp)
```

## API Structure

```
/api/v1/
  ├── analytics/
  │   ├── live-visitors
  │   ├── sessions
  │   ├── events
  │   └── funnel
  ├── products/
  │   ├── [id]
  │   ├── analytics
  │   └── price-history
  ├── payments/
  │   ├── stripe-webhook
  │   └── orders
  ├── integrations/
  │   ├── google-analytics
  │   └── tracking-scripts
  └── admin/
      ├── users
      └── audit-logs
```

## Real-Time Architecture

```
Client → WebSocket → Redis Pub/Sub → Multiple Instances
   ↓
  Events stored in PostgreSQL
   ↓
  Aggregated analytics in Redis (cache)
```

## Security Layers

1. **JWT Authentication** - Secure API access
2. **RBAC** - Role-based permissions
3. **Rate Limiting** - API abuse prevention
4. **CORS** - Cross-origin protection
5. **Input Validation** - XSS/SQL injection prevention
6. **IP Masking** - GDPR compliance
7. **2FA** - Admin account security

## Implementation Phases

### Phase 1: Analytics Core (Week 1-2)
- Real-time visitor tracking
- Session management
- Event collection
- Basic dashboards

### Phase 2: User Behavior (Week 3)
- User journey tracking
- Funnel analysis
- Conversion tracking

### Phase 3: Product Management (Week 4)
- CRUD operations
- Analytics integration
- Price management

### Phase 4: Integrations (Week 5)
- Stripe webhooks
- Script injection
- Google Analytics

### Phase 5: Advanced Features (Week 6+)
- Notifications
- Audit logs
- Export/reporting
