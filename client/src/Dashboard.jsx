import { useState, useEffect } from 'react'

function Dashboard() {

const [projectName, setProjectName] = useState('')
const [title, setTitle] = useState('')
const [promptText, setPromptText] = useState('')
const [capsules, setCapsules] = useState([]);
const [promptVersion, setPromptVersion] = useState('v1');
const [responseSummary, setResponseSummary] = useState('');
const [category, setCategory] = useState('Coding');
const [usefulness, setUsefulness] = useState('Good');
const [reviewed, setReviewed] = useState(false);
const [improved, setImproved] = useState(false);
const [screenshotUrl, setScreenshotUrl] = useState('');
const [notes, setNotes] = useState('');
const[editingId, setEditingId] = useState(null);

const createCapsule = async () => {
    const response = await fetch(
`http://localhost:5000/api/capsules`, {
        method: 'POST',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
    },
        body: JSON.stringify({
        project_name: projectName,
        prompt_title: title,
        prompt_version: promptVersion,
        prompt_text: promptText,
        response_summary: responseSummary,
        category: category,
        usefulness: usefulness,
        reviewed: reviewed ? 1 : 0,
        improved: improved ? 1 : 0,
        screenshot_url: screenshotUrl,
        notes: notes,
        }),
    });

    const data = await response.json();
    console.log('Capsule created:', data);
    loadCapsules();
};

const loadCapsules = async () => {
    const response = await fetch('http://localhost:5000/api/capsules', {
      credentials: 'include', // Include credentials for cookie-based authentication
    }

    );
    const data = await response.json();
    setCapsules(data);
};

useEffect(() => {
    loadCapsules();
}, []);

const deleteCapsule = async (id) => {
    await fetch(`http://localhost:5000/api/capsules/${id}`, {
        method: 'DELETE',
        credentials: 'include', 
    });
    loadCapsules();
};

const editCapsule = (capsule) => {
    setEditingId(capsule.id);
    setProjectName(capsule.project_name);
    setTitle(capsule.prompt_title); 
    setPromptText(capsule.prompt_text);
    setPromptVersion(capsule.prompt_version || 'v1');
    setResponseSummary(capsule.response_summary || '');
    setCategory(capsule.category || 'Coding');
    setUsefulness(capsule.usefulness || 'Good');
    setReviewed(!!capsule.reviewed);
    setImproved(!!capsule.improved);
    setScreenshotUrl(capsule.screenshot_url || '');
    setNotes(capsule.notes || '');
};

const updateCapsule = async () => {
    await fetch(`http://localhost:5000/api/capsules/${editingId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
    },
        body: JSON.stringify({
        project_name: projectName,
        prompt_title: title,
        prompt_version: promptVersion,
        prompt_text: promptText,
        response_summary: responseSummary,
        category: category,
        usefulness: usefulness,
        reviewed: reviewed ? 1 : 0,
        improved: improved ? 1 : 0,
        screenshot_url: screenshotUrl,
        notes: notes,
        }),
    });
    setEditingId(null);
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
        <input placeholder="Prompt text" value={promptText} onChange={(e) => setPromptText(e.target.value)} />
    </div>

    <div>
        <input placeholder ="Prompt version" value={promptVersion} onChange={(e) => setPromptVersion(e.target.value)} />
    </div>

    <div>
        <input placeholder="Response summary" value={responseSummary} onChange={(e) => setResponseSummary(e.target.value)} />   
    </div>

    <div>
        <label>
            Category:
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Coding">Coding</option>
                <option value="Writing">Writing</option>
                <option value="Research">Research</option>
                <option value="Study">Study</option>
                <option value="Other">Other</option>
            </select>
        </label>
    </div>

    <div>
        <label>
            Usefulness:
            <select value={usefulness} onChange={(e) => setUsefulness(e.target.value)}>
                <option value="Good">Good</option>
                <option value="Needs Improvement">Needs Improvement</option>
            </select>
        </label>
    </div>

    <div>
        <label>
            <input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} />
            Reviewed
        </label>
    </div>

    <div>
        <label>
            <input type="checkbox" checked={improved} onChange={(e) => setImproved(e.target.checked)} />
            Improved
        </label>
    </div>

    <div>
        <input type="url" placeholder="Screenshot Evidence URL" value={screenshotUrl} onChange={(e) => setScreenshotUrl(e.target.value)} />  
    </div>

    <div>
        <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
    </div>

    <div>
        {editingId === null ? (
        <button onClick={createCapsule}>Create Capsule</button>
        ) : (
            <button onClick={updateCapsule}>Save Changes</button>
        )}
    </div>

    <div>
    {capsules.map((capsule) => (
        <div key={capsule.id}>
        {capsule.project_name} - {capsule.prompt_title}
        <br />
        <button onClick={() => editCapsule(capsule)}>Edit</button>
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

export default Dashboard;