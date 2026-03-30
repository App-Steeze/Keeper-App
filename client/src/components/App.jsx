import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [notes, setNotes] = useState([]);

  async function fetchNotes(){
    try {
      const res = await axios.get(`${API_URL}/notes`);
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  // fetch notes once when the app load
  useEffect(() => {
    fetchNotes();
  }, []);

  async function addNote(newNote) {
    try {
      const res = await axios.post(`${API_URL}/create-note`, newNote);
      setNotes(prevNotes => [res.data, ...prevNotes]);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteNote(id) {
    try{
      await axios.delete(`${API_URL}/delete/${id}`);
      setNotes(prevNotes => {
      return prevNotes.filter((noteItem) => {
        return noteItem.id !== id;
      });
    }); 
    }catch(err){
      console.error(err);
    }
  }

  async function updateNote(id, updatedNote){
    try{
      const res = await axios.put(`${API_URL}/update/${id}`, updatedNote);
      setNotes(prevNotes => prevNotes.map(note => (note.id === id ? res.data : note)))
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem) => {
        return (
          <Note
            key={noteItem.id}
            id={noteItem.id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
            onUpdate={updateNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
