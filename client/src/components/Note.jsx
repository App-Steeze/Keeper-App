import React, {useState, useEffect} from "react";

function Note(props) {
  const [isEditing, setEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: props.title,
    content: props.content
  })
  const [isSaved, setSave] = useState(false)

  useEffect(() => {
    setEditedNote({
      title: props.title,
      content: props.content
    });
  }, [props.title, props.content]);
  
  
  function handleClick(e) {
    // prevent modal open
    e.stopPropagation();

    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (confirmDelete) {
      props.onDelete(props.id);
  }}

  function onEdit(e){
    // prevent modal open
    e.stopPropagation();

    setEditing(true)
    setSave(false)
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setEditedNote(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function onSave(e) {
    e.preventDefault();
    await props.onUpdate(props.id, editedNote);
    setEditing(false);
    setSave(true);
  }

  function showModal(){
    props.onView()

  }

  return (
    <div className="note-container">
      {isEditing? 
      (<form className="editedForm" onSubmit={onSave} >
         <input
              placeholder="title"
              name="title"
              value={editedNote.title}
              onChange={handleChange}
              required
            />

            <textarea
              placeholder="take a note"
              name="content"
              value={editedNote.content}
              onChange={handleChange}
              rows="3"
              required
            />    
            {isSaved ?<button onClick={onEdit} >Edit</button>: <button>Save</button>}
      </form>) : 
      
      (<div className="note" onClick={showModal} >
        <h1>{props.title}</h1>
        <p>{props.content}</p>
        <button onClick={handleClick}><img src="/assets/trash-outline.svg" /></button>
        <button onClick={onEdit} >Edit</button>
      </div>)  }

    </div>
  )
}

export default Note;
