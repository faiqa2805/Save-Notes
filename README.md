# SaveNotes

A production-ready, containerized full-stack web application designed for high-performance, streamlined organization of PDF documents and academic notes. Built with a focus on optimal database integrity, minimal client-side overhead, and clean architectural patterns.

---

## 🚀 Architecture & Core Features

* **Dynamic Document Categorization**: Optimized relational database schema utilizing foreign key constraints to seamlessly map documents to user-managed sections.
* **On-Demand Data Fetching**: Implements an efficient lazy-loading architecture where section payloads are retrieved asynchronously upon user interaction, drastically reducing initial page load times and bandwidth consumption.
* **Full CRUD Operations**: End-to-end implementation of Create, Read, Update, and Delete actions for section management, complete with dynamic frontend UI synchronization.
* **High Schema Integrity**: Built on atomic database transaction principles where invalid or undefined inputs are strictly rejected at the database layer to maintain data purity.
* **Modern UI Engine**: Server-side rendered views built with highly optimized, modular CSS layout structures ensuring a responsive, card-based interface.

---

## 🛠️ Tech Stack

* **Frontend**: EJS (Embedded JavaScript Templates), Semantic HTML5, Vanilla JavaScript, Optimized Custom CSS
* **Backend**: Node.js, Express.js (RESTful API architecture & custom middleware plumbing)
* **Database**: PostgreSQL (Relational schema modeling with robust indexing)
* **DevOps & Deployment**: Docker (Multi-layer image building), Render Container Network, Neon Serverless Postgres (SSL-enforced production database pipeline)

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
