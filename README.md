# FlowDesk

FlowDesk is an enterprise-style workflow and case management platform built to demonstrate a production-minded full-stack architecture: Django REST Framework APIs, a React + TypeScript frontend, JWT authentication, organization-scoped data, file attachments, activity tracking, PostgreSQL, Redis, Celery, and Docker.

## Portfolio highlights

- **Multi-tenant case management**: cases are scoped to a user's organization so teams only see their own work.
- **Workflow lifecycle**: cases move through open, in-progress, on-hold, resolved, and closed states with validated transitions.
- **Audit trail**: important case events such as creation, status changes, comments, and attachments are written to an activity timeline.
- **Collaboration**: users can add comments and upload attachments to cases.
- **Dashboard metrics**: aggregate case statistics power the dashboard experience.
- **Authenticated SPA**: protected React routes redirect unauthenticated users to login and return them to their original destination after signing in.
- **API documentation**: DRF Spectacular provides OpenAPI schema and Swagger UI endpoints.

## Tech stack

### Backend

- Django 5
- Django REST Framework
- Simple JWT
- PostgreSQL
- Redis
- Celery
- DRF Spectacular
- django-filter

### Frontend

- React
- TypeScript
- Vite
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- shadcn-style component primitives

### Infrastructure

- Docker Compose
- PostgreSQL health checks
- Redis health checks
- Environment-based configuration

## Core features

### Authentication and authorization

- Email-based custom user model.
- JWT login, refresh, logout, and current-user endpoints.
- Global API authentication defaults.
- Frontend token attachment, refresh handling, and session-expiry redirects.

### Case management

- Create, update, list, search, filter, sort, and soft-delete cases.
- Organization-scoped queries for cases, comments, attachments, and activity.
- Case priorities and statuses.
- Due dates and closed timestamps.

### Collaboration

- Case comments.
- Case attachments with original filename metadata.
- Per-case activity timeline.

### Dashboard

- Total cases.
- Open, in-progress, on-hold, resolved, and closed counts.
- Overdue case count.

## API overview

The backend is mounted under `/api/v1/`.

| Area | Endpoint |
| --- | --- |
| Login | `POST /api/v1/auth/login/` |
| Refresh token | `POST /api/v1/auth/refresh/` |
| Logout | `POST /api/v1/auth/logout/` |
| Current user | `GET /api/v1/auth/me/` |
| Cases | `/api/v1/cases/` |
| Case dashboard | `GET /api/v1/cases/dashboard/` |
| Change status | `POST /api/v1/cases/:id/change-status/` |
| Activity | `GET /api/v1/cases/:id/activity/` |
| Comments | `/api/v1/cases/:id/comments/` |
| Attachments | `/api/v1/cases/:id/attachments/` |
| OpenAPI schema | `/api/schema/` |
| Swagger UI | `/api/docs/` |

## Local development

### Prerequisites

- Python 3.10+
- uv
- Node.js and pnpm
- Docker and Docker Compose

### Environment

Create a `.env` file with values for Django, Postgres, Redis, and frontend API configuration. At minimum, the backend expects settings such as `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`, `REDIS_HOST`, and `REDIS_PORT`.

### Run infrastructure

```bash
docker compose -f infra/compose/docker-compose.dev.yml up -d
```

### Run backend

```bash
cd backend
uv sync
uv run python manage.py migrate
uv run python manage.py seed_data
uv run python manage.py runserver
```

### Run frontend

```bash
cd frontend
pnpm install
pnpm dev
```

## Quality checks

```bash
cd frontend && pnpm lint
cd frontend && pnpm build
cd backend && uv run python manage.py test
```

## Roadmap

- Add role-based permissions for admins, managers, and agents.
- Add end-to-end browser tests.
- Add notification delivery for Celery tasks.
- Add production Docker services for backend, frontend, worker, and reverse proxy.
- Add screenshots and a hosted demo link.
