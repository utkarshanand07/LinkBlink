# LinkBlink URL Shortener

**LinkBlink** is an enterprise-grade URL shortener and link management SaaS built for scale and high performance. It features a robust, event-driven analytics pipeline that separates high-speed redirections from heavy telemetry processing. Powered by a **React** frontend and a **Spring Boot** backend, LinkBlink implements strict Role-Based Access Control (RBAC), subscription-based tier limits, and deep data aggregation for comprehensive user dashboards.

---

## Features

- **High-Speed Redirection:** Optimized URL resolution with synchronous cache-ready lookups ensuring minimal latency during redirects.
- **Asynchronous Telemetry Pipeline:** Non-blocking click event processing, including GeoIP resolution and User-Agent parsing (Browser, OS, Device).
- **Role-Based Access Control (RBAC):** Centralized `TierService` enforcing strict usage limits (Guest, Basic, Pro, Enterprise) securely at the API level.
- **Custom Link Branding:** Support for unique, user-defined URL aliases for premium tiers.
- **Advanced Data Aggregation:** Highly optimized native SQL and JPQL queries powering a Recharts-based Bento Box dashboard without causing OutOfMemory errors.
- **Automated Subscription Management:** Nightly Spring Cron workers handle plan demotions and the lazy-deletion of expired links.
- **Stateless Authentication:** Secure perimeter defense using stateless JSON Web Tokens (JWT) and BCrypt password hashing.

---

## Tech Stack

### Frontend

- **Framework:** React.js
- **Styling:** TailwindCSS (optimized for Bento Box layouts)
- **Data Visualization:** Recharts
- **State Management & Caching:** React Query

### Backend

- **Core Framework:** Java 17+ with Spring Boot
- **Security:** Spring Security (JWT-based authentication)
- **ORM:** Hibernate / Spring Data JPA

### Database & Infrastructure

- **Primary Datastore:** PostgreSQL
- **Architecture:** Designed with hexagonal adapters to support external Kafka/Upstash queues and Tinybird analytics ingestion.

---

## Project Structure

```text
linkblink/
│── url-shortener-frontend/  # React SPA and UI components
│── src/main/java/.../       # Spring Boot Backend
│   ├── analytics/           # Event publishers, listeners, and aggregation services
│   ├── controller/          # REST API Controllers (Auth, Url, Redirect, Analytics)
│   ├── dtos/                # Data Transfer Objects
│   ├── models/              # JPA Entities and Enums (Tier, User, UrlMapping, ClickEvent)
│   ├── repository/          # Spring Data JPA Repositories with optimized Native Queries
│   ├── security/            # JWT Filters, WebConfig, and perimeter defense
│   └── service/             # Core business logic (TierService, UrlMappingService)
│── pom.xml                  # Maven dependencies
│── application.properties   # Environment and application configuration
│── README.md                # Project documentation
```

---

## Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/yourusername/linkblink.git
cd linkblink
```

### Setup the Backend (Spring Boot)

Ensure you have Java 17+ and Maven installed.

Create or modify your `src/main/resources/application.properties` (or set environment variables) with the following configuration:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/linkblink
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update

# Security
jwt.secret=your_highly_secure_base64_encoded_secret_key
jwt.expiration=86400000

# Network & App Logic
frontend.url=http://localhost:3000
analytics.enabled=true
```

Compile and run the Spring Boot server:

```bash
mvn clean install
mvn spring-boot:run
```

### Setup the Frontend (React)

Open a new terminal window and navigate to the frontend directory:

```bash
cd url-shortener-frontend
npm install
```

Create a `.env` file in the `url-shortener-frontend` directory:

```properties
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

Start the React development server:

```bash
npm start
```

---

## API Endpoints

### Authentication & Identity

| Method | Endpoint | Description | Access |
|----------|----------|-------------|----------|
| POST | `/api/auth/public/register` | Register a new user account | Public |
| POST | `/api/auth/public/login` | Authenticate and receive a JWT | Public |
| GET | `/api/auth/users/me` | Fetch current user profile and tier limits | Secured |

### URL Management & Redirection

| Method | Endpoint | Description | Access |
|----------|----------|-------------|----------|
| POST | `/api/urls/shorten` | Create a new short URL | Public (Supports Guests) |
| GET | `/{shortUrl}` | Redirect to original URL and trigger telemetry | Public |
| GET | `/api/urls/myurls` | Fetch paginated list of user's links | Secured |
| PUT | `/api/urls/{id}` | Update destination of an existing link | Secured |
| DELETE | `/api/urls/{id}` | Delete a single link and cascade click events | Secured |
| DELETE | `/api/urls/bulk` | Bulk delete multiple links safely | Secured |

### Dashboard & Analytics

| Method | Endpoint | Description | Access |
|----------|----------|-------------|----------|
| GET | `/api/urls/totalClicks` | Fetch time-series click data for timeline graphs | Secured |
| GET | `/api/analytics/advanced/url/{id}` | Fetch deep categorical analytics for a single URL | Enterprise |
| GET | `/api/analytics/advanced/total` | Fetch aggregated categorical data for all URLs | Enterprise |

---

## Deployment

To deploy LinkBlink to a production environment:

### Database

Provision a managed PostgreSQL instance (e.g., Supabase, Neon, AWS RDS). Ensure composite indexes are added to the `click_event` table for performance.

### Backend

Containerize the Spring Boot application using Docker and deploy to a cloud provider like Render, Railway, or AWS Elastic Beanstalk. Ensure environment variables are securely injected.

### Frontend

Build the React application:

```bash
npm run build
```

Deploy the static assets to Vercel, Netlify, or AWS S3/CloudFront.

### Telemetry (Scale-Up)

For enterprise-scale traffic, configure the Upstash/Tinybird adapters in `application.properties` to route telemetry payloads off the main SQL database.

---

## Contribution

Contributions to LinkBlink are welcome!

To contribute:

1. Fork the repository.
2. Create a dedicated feature branch:

   ```bash
   git checkout -b feature/awesome-new-feature
   ```

3. Commit your changes with descriptive messages.
4. Push to your branch:

   ```bash
   git push origin feature/awesome-new-feature
   ```

5. Open a Pull Request against the main repository.
