# SaveNotes

Inspired by my sister's need for a structured, section-based repository for her books and academic documents, I built SaveNotes as a personal challenge in end-to-end systems engineering. Instead of relying on existing mass-market tools, I used this MVP capstone project to practice rigorous architectural planning and low-overhead design. It turned into an incredible deep dive into the joy of systems-level thinking—resulting in a fully containerized, high-performance web application engineered for optimal database integrity and dynamic data delivery.

---

## 🏗️ System Architecture & Design Trade-offs

### 1. Enforced Data Integrity (Database Layer)

* **Implementation**: Relational schema constraints utilizing strict data typing, unique bounds, and foreign key references (`section_id INT REFERENCES sections(id)`).
* **Engineering Impact**: Rejects corrupted, partial, or undefined writes directly at the database engine level, ensuring absolute atomic consistency and system data reliability.

### 2. Infrastructure Isolation (DevOps Layer)

* **Implementation**: Fully containerized runtime using a case-sensitive `Dockerfile` built on a lightweight `node:18-alpine` footprint.
* **Engineering Impact**: Guarantees immutable, environment-agnostic deployments while utilizing optimized multi-layer Docker caching to minimize deployment build pipeline times.

### 3. Latency & Resource Optimization (Network Layer)

* **Implementation**: Migrated from monolithic page loads to a dynamic, client-triggered asynchronous lazy-loading data flow.
* **Engineering Impact**: Significantly reduces initial server memory footprint, minimizes client bandwidth consumption, and prevents DOM bottlenecks to improve Time to Interactive (TTI).

### 4. Stateless Application Configuration (Security Layer)

* **Implementation**: Total decoupling of production credentials and network connection strings from the core codebase via runtime environment injection (`dotenv`).
* **Engineering Impact**: Follows industry-standard Twelve-Factor App principles, completely eliminating configuration drift and allowing horizontal scaling without security leaks.

---

## 🛠️ Tech Stack

* **Frontend**: EJS (Embedded JavaScript Templates), Semantic HTML5, Vanilla JavaScript, Optimized Custom CSS
* **Backend**: Node.js, Express.js (RESTful API architecture & custom middleware plumbing)
* **Database**: PostgreSQL (Relational schema modeling with robust indexing)
* **DevOps & Deployment**: Docker , Render Container Network, Neon Serverless Postgres 

---

## 📦 Local Installation & Setup

### Prerequisites

* Node.js (v18+)
* PostgreSQL instance running locally

### Execution Steps

1. Clone the repository:
```bash
git clone https://github.com/faiqa2805/Save-Notes.git
cd Save-Notes

```


2. Install dependencies:
```bash
npm install

```


3. Configure your local environment variables by creating a `.env` file in the root directory:
```env
DATABASE_URL=postgres://your_user:your_password@localhost:5432/your_db
PORT=3000

```


4. Run the database initialization script:
```sql
CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    pdf_url TEXT NOT NULL,
    section_id INT REFERENCES sections(id)
);

```


5. Start the development server:
```bash
npm start

```



---

## 🐳 Docker Production Build

This application is fully containerized to ensure cross-environment consistency and horizontal scaling capability.

### Build the Image:

```bash
docker build -t savenotes:latest .

```

### Run the Container locally:

```bash
docker run -p 3000:3000 --env-file .env savenotes:latest

```

---

## 🎨 Acknowledgments & Asset Attributions

Special thanks to the following creators for providing the graphical assets used in the application interface:

* [Add icons](https://www.flaticon.com/free-icons/add) created by **Kiranshastry - Flaticon**
* [Search icons](https://www.flaticon.com/free-icons/search) created by **Freepik - Flaticon**
* [Cancel icons](https://www.flaticon.com/free-icons/cancel) created by **srip - Flaticon**
* [Check icons](https://www.flaticon.com/free-icons/check) created by **Freepik - Flaticon**
* [Pencil icons](https://www.flaticon.com/free-icons/pencil) created by **Freepik - Flaticon**
