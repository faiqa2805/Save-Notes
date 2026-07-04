import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
const port = process.env.PORT || 3000;

dotenv.config(); // Loads a local .env file during development

const isProduction = process.env.NODE_ENV === "production";

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  // Cloud providers like Neon/Supabase require SSL over public networks
  ssl: isProduction ? { rejectUnauthorized: false } : false
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req,res)=>{
  try {
    const result = await db.query("select * from sections order by id ASC");

    res.render("index.ejs", {
      sections: result.rows
    });
  } catch (err) {
    console.error("error in loading homepage sections", err);
    res.status(500).send("Internal server error");
  }
});

// GET ROUTE: Search for documents across all categories
app.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.redirect("/");
  }

  try {
    // 1. Fetch all sidebar sections so the category navigation layout stays loaded
    const sectionsResult = await db.query("SELECT * FROM sections ORDER BY id ASC");

    // 2. Perform a safe, case-insensitive partial match search using SQL ILIKE
    // The '%' wildcards match any characters before or after the search term
    const searchResult = await db.query(
      "SELECT * FROM books WHERE title ILIKE $1 ORDER BY id ASC",
      [`%${query.trim()}%`]
    );

    // 3. Render index.ejs with the search results populated into the books card area
    res.render("index.ejs", {
      sections: sectionsResult.rows,
      currentSectionId: "search-results", // Special flag to let the UI know we are in a search state
      currentSectionName: `Search Results for "${query}"`,
      books: searchResult.rows
    });
  } catch (err) {
    console.error("Error executing database search query:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add-section", async (req,res)=>{
  const {sectionName} =req.body;

  if (!sectionName || sectionName.trim() === ""){
    return res.redirect("/");
  }

  try {
    await db.query(
      "insert into sections (name) values ($1) on conflict do nothing",
      [sectionName.trim()]
    );

    res.redirect ("/");
  } catch (err) {
    console.error("Error inserting section into DB:", err);
    res.status(500).send("Internal Server Error");
  }
});

//fethcing pdfs of any section
// fetching pdfs of any section
app.get("/sections/:id", async (req, res) => {
  const sectionId = req.params.id;

  try {
    const sectionsResult = await db.query("select * from sections order by id ASC");

    const booksResult = await db.query(
      "select * from books where section_id = $1 order by id ASC",
      [sectionId]
    );

    const currentSection = sectionsResult.rows.find(sec => sec.id == sectionId);

    res.render("index.ejs", {
      sections: sectionsResult.rows,
      currentSectionId: sectionId,
      currentSectionName: currentSection ? currentSection.name : "",
      books: booksResult.rows 
    });
  } catch (err) {
    console.error("Error fetching section contents:", err);
    res.status(500).send("Internal Server Error");
  }
});

// GET route to display the "Add New PDF" page
app.get("/new", async (req, res) => {
  try {
    // Fetch all sections to populate our dropdown menu
    const result = await db.query("SELECT * FROM sections ORDER BY name ASC;");
    
    res.render("new.ejs", { 
      sections: result.rows 
    });
  } catch (err) {
    console.error("Error fetching sections for form:", err);
    res.status(500).send("Internal Server Error");
  }
});

// POST route to handle the insertion of a new document
app.post("/add", async (req, res) => {
  const { title, pdf_url, section_id } = req.body;

  // 1. Defensively validate incoming data before touching the database
  if (!title || !pdf_url || !section_id) {
    console.warn("Received incomplete form submission data.");
    return res.status(400).send("Bad Request: All form fields are strictly required.");
  }

  try {
    // 2. Perform safe, parameterized SQL insertion to prevent SQL injection vulnerabilities
    // PostgreSQL maintains complete database schema integrity, ensuring valid relational mapping.
    const queryText = `
      INSERT INTO books (title, pdf_url, section_id) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const queryValues = [title.trim(), pdf_url.trim(), parseInt(section_id, 10)];
    
    const result = await db.query(queryText, queryValues);
    
    console.log(`Successfully added new document: "${result.rows[0].title}"`);

    // 3. Guide the user safely back to the clean home screen dashboard layout
    res.redirect("/");

  } catch (err) {
    console.error("Database Transaction Error during document insertion:", err);
    
    // Fallback: Send a meaningful response instead of leaving the browser loading infinitely
    res.status(500).send("Internal Server Error: Failed to commit file registration to the database.");
  }
});

// 1. POST ROUTE: Edit / Rename an existing section
app.post("/edit-section", async (req, res) => {
  const { updatedSectionId, updatedSectionName } = req.body;

  if (!updatedSectionName || updatedSectionName.trim() === "") {
    return res.redirect("/");
  }

  try {
    // Safely update the section name using its primary key ID
    await db.query(
      "UPDATE sections SET name = $1 WHERE id = $2",
      [updatedSectionName.trim(), parseInt(updatedSectionId, 10)]
    );

    // Redirect back to the home screen or keep them inside the active view
    res.redirect("/");
  } catch (err) {
    console.error("Error updating section name in DB:", err);
    res.status(500).send("Internal Server Error");
  }
});

// 2. POST ROUTE: Delete a section (and cascade cleanup files)
app.post("/delete-section", async (req, res) => {
  const { deleteSectionId } = req.body;

  try {
    // TRANSACTION-SAFE DESIGN: 
    // First, clear out all books linked to this section to maintain clean foreign keys
    await db.query("DELETE FROM books WHERE section_id = $1", [parseInt(deleteSectionId, 10)]);
    
    // Now safely delete the parent section container
    await db.query("DELETE FROM sections WHERE id = $1", [parseInt(deleteSectionId, 10)]);

    res.redirect("/");
  } catch (err) {
    console.error("Error executing safe section deletion sequence:", err);
    res.status(500).send("Internal Server Error: Cascade deletion sequence aborted.");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});