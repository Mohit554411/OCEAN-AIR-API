# Public API Project Specification Template

## Project Overview
This project will be a clone of the public-api system, using the same tech stack and design model but with a local database implementation.

## Tech Stack
- **Backend**: Node.js with TypeScript
- **Framework**: Koa.js (with @koa/router, @koa/cors)
- **Database**: Local PostgreSQL (replacing the cloud instance)
- **ORM**: TypeORM
- **API Design**: REST API with OpenAPI documentation
- **Message Broker**: Kafka
- **Authentication**: JWT-based authentication
- **Testing**: Jest

## Core Dependencies
- TypeScript
- Koa and related middleware
- TypeORM for database operations
- Jest for testing
- Node-rdkafka (if using Kafka messaging)
- Other utility libraries based on specific requirements

## Project Structure
```
/
├── src/
│   ├── api/            # API endpoint definitions
│   ├── commands/       # CLI commands
│   ├── components/     # Reusable components
│   ├── consumer/       # Kafka consumers
│   ├── dataloaders/    # Data loader implementations
│   ├── entities/       # TypeORM entity definitions
│   ├── jobs/           # Background job definitions
│   ├── lib/            # Shared library code
│   ├── migrations/     # Database migrations
│   ├── producer/       # Kafka producers
│   ├── services/       # Business logic services
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── server.ts       # Main application entry point for API
│   └── worker.ts       # Worker process entry point
├── .kubernetes/        # Kubernetes configuration (optional for local)
├── docker/             # Docker configuration
├── tests/              # Integration and unit tests
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Database Schema
The database will include tables for:
- Users, Companies, and User-Company relationships
- Authentication and Authorization (tokens, credentials)
- Platform and API Gateway configurations
- Domain-specific tables (based on your requirements)

## API Design
- RESTful API design following OpenAPI specification
- API versioning
- Authentication middleware
- Rate limiting
- Request validation
- Error handling

## Required Environment Variables
```
PG_HOST=localhost
PG_USERNAME=postgres
PG_PASSWORD=your_password
PG_DATABASE=your_db_name
NODE_ENV=development
DB_POOL_SIZE=4
DB_CONNECTION_TIMEOUT_MS=15000
KAFKA_HOSTS=localhost:9092 (if using Kafka)
```

## Development Setup
1. Prerequisites: Node.js, PostgreSQL, Docker (optional)
2. Install dependencies: `yarn install`
3. Configure local environment variables
4. Run database migrations: `yarn migration:run`
5. Start development server: `yarn dev`

## Your Custom Requirements
Please add your specific requirements below:

- [YOUR SPECIFIC PROJECT REQUIREMENTS]
- [DATABASE CUSTOMIZATIONS]
- [API ENDPOINTS NEEDED]
- [AUTHENTICATION REQUIREMENTS]
- [ANY OTHER SPECIFIC NEEDS]

Once you provide your specific requirements, we can create a detailed implementation plan tailored to your needs. 