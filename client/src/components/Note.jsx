import React, {useState, useEffect} from "react";

function Note(props) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: props.title,
    content: props.content
  })

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
  }

  return (
    <div className="note-container">
    
      <div className="note" onClick={()=>setModalOpen(true)} >
        <h1>{props.title}</h1>
        <p>{props.content}</p>
        <button onClick={handleClick}><img src="/assets/trash-outline.svg" /></button>
        <button onClick={onEdit} >Edit</button>
      </div>

      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevent closing modal when clicking inside
          >
            {isEditing ? (
              <form className="modal-Editform" onSubmit={onSave} >
                <input
                    className="modalInput"
                    placeholder="title"
                    name="title"
                    value={editedNote.title}
                    onChange={handleChange}
                    required
                />

                <textarea
                    className="modalTextarea"
                    placeholder="take a note"
                    name="content"
                    value={editedNote.content}
                    onChange={handleChange}
                    rows="3"
                    required
                />    
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </form>

                ) : (
                <>
                  <h1>{editedNote.title}</h1>
                  <p>{editedNote.content}</p>
                  <div className="modal-buttons">
                    <button style={{marginLeft: "10px"}} onClick={() => setEditing(true)}>Edit</button>
                    <button style={{marginLeft: "10px", background: "none"}} onClick={handleClick}><img src="/assets/trash-outline.svg" /></button>
                    <button style={{marginLeft: "10px"}} onClick={() => setModalOpen(false)}>Close</button>
                  </div>
                </>
              )
            }

          </div>
        </div>
      )}

    </div>
  )
}

export default Note;
