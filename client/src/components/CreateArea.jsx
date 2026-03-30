import React, { useState } from "react";

function CreateArea(props) {
  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  const [isTyping, setTyping] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    let newValue = value;

    if (name === "title") {
      newValue = value.substring(0, 100); // limit title to 30 characters
    }else if(name === "content"){
      newValue = value.substring(0, 600)
    }

    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: newValue
      };
    });
    setTyping(true)
  }

  async function submitNote(event) {
    event.preventDefault();
  if(note.title.trim() === "" || note.content.trim() === ""){
    return;
  }
    await props.onAdd(note);
    setNote({
      title: "",
      content: ""
    });
  }

  return (
    <div>
      <form className="originForm" onSubmit={submitNote}>
        <input
          required
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        />
        <textarea
          required
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows="3"
        />
        {isTyping && <button >Add</button>}
        
      </form>
    </div>
  );
}

export default CreateArea;
