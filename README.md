## 🏗️ System Architecture & Design

* **Strict Database Integrity:** Enforced atomic consistency natively in PostgreSQL using strict schemas and foreign key constraints (`section_id INT REFERENCES sections(id)`), entirely preventing invalid or partial application-layer writes.
* **Optimized Containerization:** Deployed via a lightweight `node:18-alpine` Docker image. Structured the `Dockerfile` to leverage multi-layer caching, ensuring fast, reproducible cloud builds on Render.
* **Asynchronous Data Fetching:** Migrated from monolithic page loads to an on-demand, lazy-loading architecture. Fetching section payloads only upon user interaction significantly reduces initial server load and client bandwidth.
* **Stateless Configuration:** Adhered strictly to Twelve-Factor App security principles by isolating database URIs and credentials from the source code, utilizing `dotenv` and cloud-native environment variables for secure deployments.

---

## 🛠️ Tech Stack

* **Frontend**: EJS, Semantic HTML5, JavaScript, CSS
* **Backend**: Node.js, Express.js (RESTful API architecture & custom middleware)
* **Database**: PostgreSQL
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


3. Update your local environment variables in `.env` file in the root directory:
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
node app.js

```
## 🚀 Roadmap & Future Enhancements

To further scale the application and adhere to enterprise-grade production standards, the following architectural upgrades are planned:

*   **Multi-Tenant Security:** Implement JWT-based authentication and PostgreSQL Row-Level Security (RLS) to safely isolate data across multiple users.
*   **Cloud Object Storage:** Decouple asset storage from the compute layer by integrating AWS S3 for robust, scalable PDF file management.
*   **In-Memory Caching:** Introduce a Redis caching layer to intercept high-frequency database queries, minimizing latency and reducing the read-load on the primary database.
*   **Automated CI/CD Pipelines:** Integrate GitHub Actions to enforce strict unit and integration testing workflows (Jest/Supertest) prior to any automated production deployment.
---

## 🎨 Acknowledgments & Asset Attributions

Special thanks to the following creators for providing the graphical assets used in the application interface:

* [Add icons](https://www.flaticon.com/free-icons/add) created by **Kiranshastry - Flaticon**
* [Search icons](https://www.flaticon.com/free-icons/search) created by **Freepik - Flaticon**
* [Cancel icons](https://www.flaticon.com/free-icons/cancel) created by **srip - Flaticon**
* [Check icons](https://www.flaticon.com/free-icons/check) created by **Freepik - Flaticon**
* [Pencil icons](https://www.flaticon.com/free-icons/pencil) created by **Freepik - Flaticon**
