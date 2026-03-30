import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;
const { Pool } = pg;
env.config();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
     origin: process.env.CLIENT_URL || "http://localhost:5173"
}
));
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "client/dist")));

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
});


app.get("/notes", async (req, res) => {
    try {
      const { rows } = await db.query("SELECT * FROM keeper ORDER BY id DESC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
})

app.post("/create-note", async(req,res)=>{
    const inputTitle = req.body.title;
    const inputContent =req.body.content;
    try{
        const {rows} =await db.query("INSERT INTO keeper (title, content) VALUES ($1, $2) RETURNING *", [inputTitle, inputContent]);
        res.json(rows[0]);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

app.put("/update/:id", async(req, res)=>{
    try{
        const id =req.params.id; 
    //    or const {id} = req.params
        const { title, content} = req.body;
        const {rows} = await db.query("UPDATE keeper SET title = $1, content = $2 WHERE id = $3 RETURNING *", [title, content, id])
        res.json(rows[0]);
    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
})

app.delete("/delete/:id", async(req, res)=>{
    const { id } = req.params;
    try{
        await db.query("DELETE FROM keeper WHERE id = $1", [id]);
        res.json({ success: true });      
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});