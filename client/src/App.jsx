import { useState, useEffect } from 'react'

function App() {

  const [projectName, setProjectName] = useState('')
  const [title, setTitle] = useState('')
  const[propmtText, setPromptText] = useState('')
  const [capsules, setCapsules] = useState([]);

  const createCapsule = async () => {
    const response = await fetch(
`http://localhost:5000/api/capsules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_name: projectName,
        prompt_title: title,
        prompt_version: "v1",
        prompt_text: propmtText,
        response_summary:"",
        category:"Coding",
        usefulness: "Good",
        reviewed: 0,
        improved: 0,
        screenshot_url: "",
        notes: "",
      }),
    });

    const data = await response.json();
    console.log('Capsule created:', data);
    loadCapsules();
  };

  const loadCapsules = async () => {
    const response = await fetch('http://localhost:5000/api/capsules');
    const data = await response.json();
    setCapsules(data);
  };

  useEffect(() => {
    loadCapsules();
  }, []);

  const deleteCapsule = async (id) => {
    await fetch(`http://localhost:5000/api/capsules/${id}`, {
      method: 'DELETE',
    });
    loadCapsules();
  };

  const updateCapsule = async (id) => {
    await fetch(`http://localhost:5000/api/capsules/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_name: projectName,
        prompt_title: title,
        prompt_version: "v1",
        prompt_text: propmtText,
        response_summary:"",
        category:"Coding",
        usefulness: "Good",
        reviewed: 0,
        improved: 0,
        screenshot_url: "",
        notes: "",
      }),
    });
    loadCapsules();
  };

  return (
  <div>
    <h1>AI Capsule Dashboard</h1>

    <div>
      <input placeholder="Project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
    </div>

    <div>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
    </div>

    <div>
      <input placeholder="Prompt text" value={propmtText} onChange={(e) => setPromptText(e.target.value)} />
    </div>

    <div>
      <button onClick={createCapsule}>Create Capsule</button>
    </div>

    <div>
      {capsules.map((capsule) => (
        <div key={capsule.id}>
          {capsule.project_name} - {capsule.prompt_title}
          <br />
          <button onClick={() => updateCapsule(capsule.id)}>Update</button>
          <br />
          <button onClick={() => deleteCapsule(capsule.id)}
          >
            Delete
          </button>
          
        </div>
      ))}
    </div>

  </div>
  );
}

export default App;