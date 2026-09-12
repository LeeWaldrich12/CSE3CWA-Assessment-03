import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';

function Landing() {
  return (
    <div>
      <h1> AI Capsule</h1>
      
      <p>
        Save,review and improve your useful AI prompts.
      </p>

      <Link to ="/login">Login</Link>
      </div>
  );
}

function Login() {
  const loginWithGitHub = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  return(
    <div>
      <h1>Login</h1>
      <button onClick={loginWithGitHub}>Login with GitHub</button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;