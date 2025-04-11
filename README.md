# Ocean Air API

A comprehensive API for managing ocean and air transport visibility built with Node.js, TypeScript, Koa, and PostgreSQL.

## Project Overview

This API provides endpoints for tracking and managing transport visibility across ocean and air shipments. It allows companies to:

- Create, update, and delete transports
- Allocate vehicles to transports
- Monitor transport status
- Manage partners and places
- View transport emissions

## Tech Stack

- **Backend**: Node.js with TypeScript
- **Framework**: Koa.js (with @koa/router, @koa/cors)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **API Design**: REST API with OpenAPI documentation
- **Authentication**: JWT-based authentication
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ocean-air-api.git
   cd ocean-air-api
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. Create a PostgreSQL database:
   ```bash
   createdb ocean_air_db
   ```

5. Run database migrations:
   ```bash
   yarn migration:run
   ```

6. Start the development server:
   ```bash
   yarn dev
   ```

## Project Structure

```
/
├── src/
│   ├── api/                  # API endpoint definitions
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # Route definitions
│   │   └── validators/       # Request validation
│   ├── commands/             # CLI commands
│   ├── components/           # Reusable components
│   ├── consumer/             # Kafka consumers
│   ├── dataloaders/          # Data loader implementations
│   ├── database/             # Database configuration
│   ├── entities/             # TypeORM entity definitions
│   ├── jobs/                 # Background job definitions
│   ├── lib/                  # Shared library code
│   ├── middleware/           # Koa middleware
│   ├── migrations/           # Database migrations
│   ├── producer/             # Kafka producers
│   ├── services/             # Business logic services
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── server.ts             # Main application entry point
│   └── worker.ts             # Worker process entry point
├── docker/                   # Docker configuration
├── tests/                    # Integration and unit tests
├── .env.example              # Example environment variables
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## API Endpoints

The API provides the following main endpoints:

- **Authentication:**
  - `POST /api/v1/auth/login`: User login
  - `POST /api/v1/auth/register`: User registration

- **Transports:**
  - `GET /api/v1/transports`: List all transports
  - `GET /api/v1/transports/:identifier_type/:identifier_value`: Get transport details
  - `PUT /api/v1/transports/:identifier_type/:identifier_value`: Create or update transport
  - `DELETE /api/v1/transports/:identifier_type/:identifier_value`: Delete transport

- **Vehicle Allocation:**
  - `POST /api/v1/transports/:identifier_type/:identifier_value/allocation`: Allocate vehicle
  - `POST /api/v1/transports/:identifier_type/:identifier_value/deallocation`: Deallocate vehicle

- **Partners:**
  - `GET /api/v1/partners`: List partners
  - `POST /api/v1/partners`: Create partner
  - `PUT /api/v1/partners/:id`: Update partner
  - `DELETE /api/v1/partners/:id`: Delete partner

- **Places:**
  - `GET /api/v1/places`: List places
  - `GET /api/v1/places/:place_reference_id`: Get place details
  - `PUT /api/v1/places/:place_reference_id`: Create or update place
  - `DELETE /api/v1/places/:place_reference_id`: Delete place

- **Vehicles:**
  - `GET /api/v1/vehicles`: List vehicles
  - `GET /api/v1/vehicles/:license_plate_number`: Get vehicle details
  - `POST /api/v1/vehicles`: Create vehicle
  - `PUT /api/v1/vehicles/:id`: Update vehicle
  - `DELETE /api/v1/vehicles/:id`: Delete vehicle

## File Structure Explanation

- **controllers/**: Handle HTTP requests and responses
- **routes/**: Define API routes and map them to controllers
- **middleware/**: Implement request processing functions like authentication and error handling
- **entities/**: Define database models with TypeORM decorators
- **services/**: Implement business logic separated from controllers
- **utils/**: Utility functions for common tasks like logging, validation, and JWT handling
- **types/**: TypeScript type definitions for request/response objects

## Scripts

- `yarn dev`: Start development server with hot reloading
- `yarn build`: Build the project for production
- `yarn start`: Start the production server
- `yarn test`: Run tests
- `yarn migration:generate`: Generate TypeORM migrations
- `yarn migration:run`: Run pending migrations
- `yarn migration:revert`: Revert last migration

## License

This project is proprietary and confidential.

## Contact

For questions or support, please contact ocean-air-api@example.com.
