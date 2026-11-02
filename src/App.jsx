import { useCallback, useEffect, useMemo, useState } from "react";

const API = "/api/students";

export default function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load records.");
      setStudents(data);
      setError(false);
    } catch (err) {
      setMessage(err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter((student) =>
      `${student.name} ${student.department}`.toLowerCase().includes(term)
    );
  }, [students, search]);

  function resetForm() {
    setName("");
    setDepartment("");
    setEditId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError(false);

    const payload = { name: name.trim(), department: department.trim() };
    const url = editId ? `${API}/${editId}` : API;

    try {
      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed.");
      setMessage(data.message || (editId ? "Student updated successfully." : "Student added successfully."));
      resetForm();
      await loadStudents();
    } catch (err) {
      setMessage(err.message);
      setError(true);
    }
  }

  function editStudent(student) {
    setEditId(student._id);
    setName(student.name);
    setDepartment(student.department);
    setMessage("Editing selected student record.");
    setError(false);
    document.getElementById("student-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function deleteStudent(id) {
    if (!window.confirm("Are you sure you want to delete this student record?")) return;
    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Delete failed.");
      setMessage(data.message);
      setError(false);
      if (editId === id) resetForm();
      await loadStudents();
    } catch (err) {
      setMessage(err.message);
      setError(true);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark">G</span> GAME<span>ZONE</span><i>.</i></a>
        <nav><a href="#dashboard">Dashboard</a><a href="#records">Records</a><a href="#student-form">Add Member</a></nav>
        <span className="status-pill"><i /> SYSTEM ONLINE</span>
      </header>

      <main>
        <section className="hero" id="dashboard">
          <div className="hero-copy">
            <p className="eyebrow"><span className="spark">✦</span> COMMUNITY CONTROL CENTER</p>
            <h1>MANAGE YOUR<br /><span>PLAYER HUB.</span></h1>
            <p className="hero-text">A central place to organize community records. Add, view, update and manage every member with ease.</p>
            <a className="primary-btn" href="#student-form">＋ Add New Member</a>
          </div>
          <div className="hero-visual">
            <div className="ring ring-a" /><div className="ring ring-b" />
            <div className="console-card"><div className="console-top"><span>GAMEZONE / ADMIN</span><b>•••</b></div><div className="console-icon">🎮</div><strong>PLAYER<br />MANAGEMENT</strong><small>CREATE · VIEW · UPDATE · DELETE</small></div>
            <span className="float-chip chip-a">⚡ CRUD ACTIVE</span><span className="float-chip chip-b">🏆 COMMUNITY HUB</span>
          </div>
        </section>

        <section className="stats">
          <article><span className="stat-icon">👥</span><div><strong>{students.length}</strong><small>TOTAL RECORDS</small></div></article>
          <article><span className="stat-icon">🛡️</span><div><strong>4</strong><small>CRUD OPERATIONS</small></div></article>
          <article><span className="stat-icon">⚡</span><div><strong>LIVE</strong><small>DATABASE STATUS</small></div></article>
        </section>

        <section className="workspace">
          <div className="section-title"><div><p className="eyebrow">DATABASE MANAGEMENT</p><h2>COMMUNITY <span>RECORDS</span></h2></div><button className="outline-btn" onClick={loadStudents}>↻ Refresh</button></div>

          <div className="content-grid">
            <section className="panel records-panel" id="records">
              <div className="panel-heading"><div><h3>Student Records</h3><p>Manage registered community members</p></div><span className="count">{students.length} RECORDS</span></div>
              <input className="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="⌕  Search name or department..." aria-label="Search students" />
              {message && <div className={`notice ${error ? "notice-error" : ""}`} role="status">{message}</div>}
              {loading ? <div className="empty">Loading records…</div> : filteredStudents.length === 0 ? <div className="empty"><span>👾</span><b>No records found</b><small>Add a member or change your search.</small></div> : (
                <div className="table-wrap"><table><thead><tr><th>MEMBER</th><th>DEPARTMENT</th><th>ACTIONS</th></tr></thead><tbody>
                  {filteredStudents.map((student) => <tr key={student._id}><td><div className="member-cell"><span className="avatar">🎮</span><span>{student.name}</span></div></td><td><span className="department-tag">{student.department}</span></td><td><div className="actions"><button onClick={() => editStudent(student)}>Edit</button><button className="delete-btn" onClick={() => deleteStudent(student._id)}>Delete</button></div></td></tr>)}
                </tbody></table></div>
              )}
            </section>

            <section className="panel form-panel" id="student-form">
              <div className="panel-heading"><div><h3>{editId ? "Update Member" : "Add New Member"}</h3><p>{editId ? "Modify the selected record" : "Create a community record"}</p></div><span className="form-emoji">👾</span></div>
              <form onSubmit={handleSubmit}>
                <label htmlFor="studentName">Student Name</label>
                <input id="studentName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter student name" required maxLength="80" />
                <label htmlFor="department">Department</label>
                <select id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required>
                  <option value="">Select department</option><option value="CSE">Computer Science (CSE)</option><option value="IT">Information Technology (IT)</option><option value="ECE">Electronics (ECE)</option><option value="EEE">Electrical (EEE)</option><option value="MECH">Mechanical</option><option value="CIVIL">Civil</option><option value="Other">Other</option>
                </select>
                <button className="primary-btn submit-btn" type="submit">{editId ? "Save Changes →" : "Add Member →"}</button>
                {editId && <button className="cancel-btn" type="button" onClick={resetForm}>Cancel Editing</button>}
              </form>
              <div className="form-tip"><span>✦</span> Records are stored in your MongoDB database.</div>
            </section>
          </div>
        </section>
      </main>
      <footer><a className="brand" href="#"><span className="brand-mark">G</span> GAME<span>ZONE</span><i>.</i></a><p>FULL STACK COMMUNITY MANAGEMENT · REACT · NODE · EXPRESS · MONGODB</p><a href="#dashboard">Back to top ↑</a></footer>
    </div>
  );
}