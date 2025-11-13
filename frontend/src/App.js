
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Home, MessageCircle, Send, FileText, Zap, GitBranch, Settings, LogOut
} from "react-icons/ai";

// === Sidebar Component ===
const Sidebar = ({ active, setActive, onLogout }) => {
  const menu = [
    { name: "Home", icon: Home },
    { name: "Inbox", icon: MessageCircle },
    { name: "Broadcast", icon: Send },
    { name: "Template", icon: FileText },
    { name: "Automation", icon: Zap },
    { name: "Workflow", icon: GitBranch },
    { name: "Manage", icon: Settings },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>SmartChat</h2>
      </div>
      <nav className="sidebar-menu">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              className={active === item.name ? "active" : ""}
              onClick={() => setActive(item.name)}
            >
              <Icon className="menu-icon" />
              {item.name}
            </button>
          );
        })}
      </nav>
      <button className="logout-btn" onClick={onLogout}>
        <LogOut className="menu-icon" /> Logout
      </button>
    </div>
  );
};

// === Panel Components ===
const HomePanel = () => (
  <div className="panel">
    <h1>Welcome to SmartChat</h1>
    <p>Select a module from the sidebar.</p>
  </div>
);

const Inbox = () => (
  <div className="panel">
    <h1>Inbox</h1>
    <p>WhatsApp messages appear here.</p>
  </div>
);

const Broadcast = () => (
  <div className="panel">
    <h1>Broadcast</h1>
    <p>Send bulk messages.</p>
  </div>
);

const Template = () => (
  <div className="panel">
    <h1>Template</h1>
    <p>Manage message templates.</p>
  </div>
);

const Automation = () => (
  <div className="panel">
    <h1>Automation</h1>
    <p>Set up auto-replies.</p>
  </div>
);

const Workflow = () => (
  <div className="panel">
    <h1>Workflow</h1>
    <p>Design conversation flows.</p>
  </div>
);

const Manage = () => (
  <div className="panel">
    <h1>Manage</h1>
    <p>Users, settings, integrations.</p>
  </div>
);

const panels = { HomePanel, Inbox, Broadcast, Template, Automation, Workflow, Manage };

// === Login Component ===
const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { email, password });
      alert(res.data.message);
      setUser({ email });
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>SmartChat</h1>
        <p>Login to your AiSensy-style WhatsApp dashboard.</p>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
          <p>Don't have an account? <Link to="/signup">Signup</Link></p>
        </form>
      </div>
    </div>
  );
};

// === Signup Component ===
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, { email, password });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>SmartChat</h1>
        <p>Create your account.</p>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSignup}>
          <h2>Sign Up</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Create Account</button>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
};

// === Dashboard Wrapper ===
const Dashboard = ({ user, setUser }) => {
  const [active, setActive] = useState("HomePanel");
  const Panel = panels[active];

  const handleLogout = () => setUser(null);

  return (
    <div className="dashboard-container">
      <Sidebar active={active} setActive={setActive} onLogout={handleLogout} />
      <div className="main-panel">
        <Panel />
      </div>
    </div>
  );
};

// === Main App ===
function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
