import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, Legend } from "recharts";

// ─── MOCK DATABASE ────────────────────────────────────────────────────────────
const initialStudents = [
	{ id: 1, name: "Aisha Rahman", email: "aisha@univ.edu", course: "CS101", gpa: 3.4 },
	{ id: 2, name: "Marcus Chen", email: "marcus@univ.edu", course: "CS101", gpa: 2.1 },
	{ id: 3, name: "Priya Nair", email: "priya@univ.edu", course: "CS101", gpa: 3.8 },
	{ id: 4, name: "James Okonkwo", email: "james@univ.edu", course: "CS101", gpa: 1.9 },
	{ id: 5, name: "Sofia Alvarez", email: "sofia@univ.edu", course: "CS101", gpa: 2.8 },
	{ id: 6, name: "Lena Hoffmann", email: "lena@univ.edu", course: "MAT201", gpa: 3.6 },
	{ id: 7, name: "Tom Nakamura", email: "tom@univ.edu", course: "MAT201", gpa: 1.5 },
	{ id: 8, name: "Diana Petrov", email: "diana@univ.edu", course: "MAT201", gpa: 3.2 },
];

const initialOutcomes = [
	{ id: 1, code: "CLO-1", title: "Problem Solving", description: "Apply algorithmic thinking", course: "CS101", weight: 30 },
	{ id: 2, code: "CLO-2", title: "Code Quality", description: "Write clean, maintainable code", course: "CS101", weight: 25 },
	{ id: 3, code: "CLO-3", title: "Data Structures", description: "Implement core data structures", course: "CS101", weight: 25 },
	{ id: 4, code: "CLO-4", title: "Collaboration", description: "Work effectively in teams", course: "CS101", weight: 20 },
	{ id: 5, code: "CLO-1", title: "Calculus", description: "Solve integral and differential equations", course: "MAT201", weight: 40 },
	{ id: 6, code: "CLO-2", title: "Linear Algebra", description: "Apply matrix operations", course: "MAT201", weight: 35 },
	{ id: 7, code: "CLO-3", title: "Statistics", description: "Interpret statistical data", course: "MAT201", weight: 25 },
];

const initialScores = [
	{ id: 1, studentId: 1, outcomeId: 1, score: 78, date: "2025-03-10" },
	{ id: 2, studentId: 1, outcomeId: 2, score: 85, date: "2025-03-12" },
	{ id: 3, studentId: 1, outcomeId: 3, score: 72, date: "2025-03-14" },
	{ id: 4, studentId: 1, outcomeId: 4, score: 90, date: "2025-03-16" },
	{ id: 5, studentId: 2, outcomeId: 1, score: 35, date: "2025-03-10" },
	{ id: 6, studentId: 2, outcomeId: 2, score: 42, date: "2025-03-12" },
	{ id: 7, studentId: 2, outcomeId: 3, score: 38, date: "2025-03-14" },
	{ id: 8, studentId: 2, outcomeId: 4, score: 55, date: "2025-03-16" },
	{ id: 9, studentId: 3, outcomeId: 1, score: 92, date: "2025-03-10" },
	{ id: 10, studentId: 3, outcomeId: 2, score: 88, date: "2025-03-12" },
	{ id: 11, studentId: 3, outcomeId: 3, score: 95, date: "2025-03-14" },
	{ id: 12, studentId: 3, outcomeId: 4, score: 87, date: "2025-03-16" },
	{ id: 13, studentId: 4, outcomeId: 1, score: 28, date: "2025-03-10" },
	{ id: 14, studentId: 4, outcomeId: 2, score: 35, date: "2025-03-12" },
	{ id: 15, studentId: 4, outcomeId: 3, score: 30, date: "2025-03-14" },
	{ id: 16, studentId: 4, outcomeId: 4, score: 45, date: "2025-03-16" },
	{ id: 17, studentId: 5, outcomeId: 1, score: 62, date: "2025-03-10" },
	{ id: 18, studentId: 5, outcomeId: 2, score: 58, date: "2025-03-12" },
	{ id: 19, studentId: 5, outcomeId: 3, score: 65, date: "2025-03-14" },
	{ id: 20, studentId: 5, outcomeId: 4, score: 70, date: "2025-03-16" },
	{ id: 21, studentId: 6, outcomeId: 5, score: 88, date: "2025-03-10" },
	{ id: 22, studentId: 6, outcomeId: 6, score: 82, date: "2025-03-12" },
	{ id: 23, studentId: 6, outcomeId: 7, score: 79, date: "2025-03-14" },
	{ id: 24, studentId: 7, outcomeId: 5, score: 32, date: "2025-03-10" },
	{ id: 25, studentId: 7, outcomeId: 6, score: 28, date: "2025-03-12" },
	{ id: 26, studentId: 7, outcomeId: 7, score: 38, date: "2025-03-14" },
	{ id: 27, studentId: 8, outcomeId: 5, score: 74, date: "2025-03-10" },
	{ id: 28, studentId: 8, outcomeId: 6, score: 68, date: "2025-03-12" },
	{ id: 29, studentId: 8, outcomeId: 7, score: 72, date: "2025-03-14" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getGrade = (score) => {
	if (score >= 90) return { letter: "A+", color: "#10b981" };
	if (score >= 80) return { letter: "A", color: "#34d399" };
	if (score >= 70) return { letter: "B", color: "#60a5fa" };
	if (score >= 60) return { letter: "C", color: "#fbbf24" };
	if (score >= 40) return { letter: "D", color: "#f97316" };
	return { letter: "F", color: "#ef4444" };
};

const avgScore = (scores) => scores.length ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length) : 0;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
	const icons = {
		dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
		students: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
		outcomes: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
		scores: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z",
		analytics: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",
		admin: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z",
		teacher: "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z",
		student: "M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z",
		alert: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
		add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
		close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
		logout: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
		menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
		warning: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
		check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
		trash: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
		edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
	};
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
			<path d={icons[name] || icons.dashboard} />
		</svg>
	);
};

// ─── BADGE ────────────────────────────────────────────────────────────────────
const Badge = ({ score }) => {
	const g = getGrade(score);
	return (
		<span style={{ background: g.color + "22", color: g.color, border: `1px solid ${g.color}44`, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>
			{g.letter} · {score}
		</span>
	);
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accent, icon }) => (
	<div style={{ background: "#0f1923", border: "1px solid #1e2d3d", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 160 }}>
		<div style={{ background: accent + "22", color: accent, padding: 10, borderRadius: 10 }}><Icon name={icon} size={22} /></div>
		<div>
			<div style={{ fontSize: 26, fontWeight: 800, color: "#e8f0fe", fontFamily: "'Courier Prime', monospace", lineHeight: 1 }}>{value}</div>
			<div style={{ fontSize: 12, color: "#4a6a8a", marginTop: 4 }}>{label}</div>
			{sub && <div style={{ fontSize: 11, color: accent, marginTop: 2 }}>{sub}</div>}
		</div>
	</div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
	const [role, setRole] = useState(null); // "admin" | "teacher" | "student"
	const [activeNav, setActiveNav] = useState("dashboard");
	const [students, setStudents] = useState(initialStudents);
	const [outcomes, setOutcomes] = useState(initialOutcomes);
	const [scores, setScores] = useState(initialScores);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [toast, setToast] = useState(null);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [loggedInStudentId, setLoggedInStudentId] = useState(1);

	// Forms
	const [newOutcome, setNewOutcome] = useState({ code: "", title: "", description: "", course: "CS101", weight: 25 });
	const [newScore, setNewScore] = useState({ studentId: "", outcomeId: "", score: "" });
	const [newStudent, setNewStudent] = useState({ name: "", email: "", course: "CS101" });

	const showToast = (msg, type = "success") => {
		setToast({ msg, type });
		setTimeout(() => setToast(null), 3000);
	};

	// Derived
	const weakStudents = useMemo(() => {
		return students.filter(s => {
			const sScores = scores.filter(sc => sc.studentId === s.id);
			return sScores.length > 0 && avgScore(sScores) < 40;
		});
	}, [students, scores]);

	const getStudentAvg = (studentId) => avgScore(scores.filter(s => s.studentId === studentId));

	// CRUD
	const addOutcome = () => {
		if (!newOutcome.code || !newOutcome.title) return showToast("Fill required fields", "error");
		setOutcomes(prev => [...prev, { ...newOutcome, id: Date.now(), weight: Number(newOutcome.weight) }]);
		setNewOutcome({ code: "", title: "", description: "", course: "CS101", weight: 25 });
		showToast("Learning outcome added!");
	};

	const addScore = () => {
		if (!newScore.studentId || !newScore.outcomeId || newScore.score === "") return showToast("Fill all fields", "error");
		const val = Number(newScore.score);
		if (val < 0 || val > 100) return showToast("Score must be 0–100", "error");
		const existing = scores.find(s => s.studentId === Number(newScore.studentId) && s.outcomeId === Number(newScore.outcomeId));
		if (existing) {
			setScores(prev => prev.map(s => s.id === existing.id ? { ...s, score: val, date: new Date().toISOString().slice(0, 10) } : s));
			showToast("Score updated!");
		} else {
			setScores(prev => [...prev, { id: Date.now(), studentId: Number(newScore.studentId), outcomeId: Number(newScore.outcomeId), score: val, date: new Date().toISOString().slice(0, 10) }]);
			showToast("Score entered!");
		}
		setNewScore({ studentId: "", outcomeId: "", score: "" });
	};

	const addStudent = () => {
		if (!newStudent.name || !newStudent.email) return showToast("Fill required fields", "error");
		setStudents(prev => [...prev, { ...newStudent, id: Date.now(), gpa: 0 }]);
		setNewStudent({ name: "", email: "", course: "CS101" });
		showToast("Student added!");
	};

	const deleteOutcome = (id) => {
		setOutcomes(prev => prev.filter(o => o.id !== id));
		setScores(prev => prev.filter(s => s.outcomeId !== id));
		showToast("Outcome deleted");
	};

	const deleteStudent = (id) => {
		setStudents(prev => prev.filter(s => s.id !== id));
		setScores(prev => prev.filter(s => s.studentId !== id));
		showToast("Student removed");
	};

	// ── LOGIN SCREEN ──
	if (!role) {
		return (
			<div style={{ minHeight: "100vh", background: "#060d14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
				<style>{`@import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Sora:wght@300;400;600;800&display=swap');`}</style>
				<div style={{ textAlign: "center" }}>
					<div style={{ fontSize: 13, letterSpacing: 6, color: "#1d4ed8", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Courier Prime', monospace" }}>◆ Academic ERP System ◆</div>
					<h1 style={{ fontSize: 42, fontWeight: 800, color: "#e8f0fe", fontFamily: "'Sora', sans-serif", marginBottom: 8, letterSpacing: -1 }}>Student Learning<br />Outcomes Tracker</h1>
					<p style={{ color: "#4a6a8a", marginBottom: 40, fontSize: 15 }}>Select your role to enter the system</p>
					<div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
						{[
							{ r: "admin", label: "Administrator", icon: "admin", color: "#6366f1", desc: "Full system control" },
							{ r: "teacher", label: "Instructor", icon: "teacher", color: "#0ea5e9", desc: "Manage outcomes & scores" },
							{ r: "student", label: "Student", icon: "student", color: "#10b981", desc: "View your performance" },
						].map(({ r, label, icon, color, desc }) => (
							<button key={r} onClick={() => { setRole(r); setActiveNav("dashboard"); }}
								style={{ background: "#0a1520", border: `1px solid ${color}44`, borderRadius: 16, padding: "28px 32px", cursor: "pointer", color: "#e8f0fe", transition: "all .2s", width: 180 }}
								onMouseEnter={e => { e.currentTarget.style.background = color + "22"; e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateY(-4px)"; }}
								onMouseLeave={e => { e.currentTarget.style.background = "#0a1520"; e.currentTarget.style.borderColor = color + "44"; e.currentTarget.style.transform = "none"; }}>
								<div style={{ color, marginBottom: 12 }}><Icon name={icon} size={32} /></div>
								<div style={{ fontWeight: 700, fontSize: 16, fontFamily: "'Sora', sans-serif" }}>{label}</div>
								<div style={{ fontSize: 12, color: "#4a6a8a", marginTop: 6 }}>{desc}</div>
							</button>
						))}
					</div>
				</div>
			</div>
		);
	}

	// ── NAV CONFIG ──
	const navItems = {
		admin: [
			{ id: "dashboard", label: "Dashboard", icon: "dashboard" },
			{ id: "students", label: "Students", icon: "students" },
			{ id: "outcomes", label: "Outcomes", icon: "outcomes" },
			{ id: "scores", label: "Enter Scores", icon: "scores" },
			{ id: "analytics", label: "Analytics", icon: "analytics" },
		],
		teacher: [
			{ id: "dashboard", label: "Dashboard", icon: "dashboard" },
			{ id: "outcomes", label: "Outcomes", icon: "outcomes" },
			{ id: "scores", label: "Enter Scores", icon: "scores" },
			{ id: "analytics", label: "Analytics", icon: "analytics" },
		],
		student: [
			{ id: "dashboard", label: "Dashboard", icon: "dashboard" },
			{ id: "my-scores", label: "My Scores", icon: "scores" },
			{ id: "analytics", label: "Analytics", icon: "analytics" },
		],
	};

	const roleColors = { admin: "#6366f1", teacher: "#0ea5e9", student: "#10b981" };
	const roleColor = roleColors[role];
	const currentStudent = students.find(s => s.id === loggedInStudentId);

	// ── PAGES ──
	const renderPage = () => {
		// DASHBOARD
		if (activeNav === "dashboard") {
			const totalStudents = students.length;
			const totalOutcomes = outcomes.length;
			const allAvg = scores.length ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length) : 0;
			const weak = weakStudents.length;

			const barData = students.slice(0, 6).map(s => ({
				name: s.name.split(" ")[0],
				avg: getStudentAvg(s.id),
			}));

			const coursePerf = ["CS101", "MAT201"].map(course => {
				const courseStudents = students.filter(s => s.course === course);
				const courseScores = scores.filter(s => courseStudents.find(cs => cs.id === s.studentId));
				return { course, avg: avgScore(courseScores) };
			});

			if (role === "student") {
				const myScores = scores.filter(s => s.studentId === loggedInStudentId);
				const myAvg = avgScore(myScores);
				const myGrade = getGrade(myAvg);
				const myOutcomes = outcomes.filter(o => o.course === currentStudent?.course);
				const radarData = myOutcomes.map(o => {
					const s = scores.find(sc => sc.studentId === loggedInStudentId && sc.outcomeId === o.id);
					return { subject: o.title, score: s?.score || 0 };
				});

				return (
					<div style={{ padding: 32 }}>
						<h2 style={{ fontSize: 24, fontWeight: 800, color: "#e8f0fe", marginBottom: 4, fontFamily: "'Sora', sans-serif" }}>My Dashboard</h2>
						<p style={{ color: "#4a6a8a", marginBottom: 28 }}>Welcome back, {currentStudent?.name}</p>
						<div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
							<StatCard label="Overall Average" value={myAvg} sub={`Grade: ${myGrade.letter}`} accent={myGrade.color} icon="analytics" />
							<StatCard label="Assessments Done" value={myScores.length} sub={`of ${myOutcomes.length} outcomes`} accent="#0ea5e9" icon="outcomes" />
							<StatCard label="Course" value={currentStudent?.course} sub="Current enrollment" accent="#6366f1" icon="scores" />
						</div>
						{myAvg < 40 && (
							<div style={{ background: "#ef444422", border: "1px solid #ef4444", borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 12, alignItems: "center", color: "#ef4444" }}>
								<Icon name="warning" size={20} />
								<span>Your average score is below the passing threshold. Please reach out to your instructor.</span>
							</div>
						)}
						<div style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 14, padding: 24 }}>
							<h3 style={{ color: "#e8f0fe", marginBottom: 20, fontFamily: "'Sora', sans-serif" }}>Performance by Outcome</h3>
							<ResponsiveContainer width="100%" height={280}>
								<RadarChart data={radarData}>
									<PolarGrid stroke="#1e2d3d" />
									<PolarAngleAxis dataKey="subject" tick={{ fill: "#4a6a8a", fontSize: 12 }} />
									<PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#4a6a8a", fontSize: 10 }} />
									<Radar name="Score" dataKey="score" stroke={roleColor} fill={roleColor} fillOpacity={0.25} />
								</RadarChart>
							</ResponsiveContainer>
						</div>
					</div>
				);
			}

			return (
				<div style={{ padding: 32 }}>
					<h2 style={{ fontSize: 24, fontWeight: 800, color: "#e8f0fe", marginBottom: 4, fontFamily: "'Sora', sans-serif" }}>Dashboard Overview</h2>
					<p style={{ color: "#4a6a8a", marginBottom: 28 }}>Academic performance summary · Spring 2025</p>
					<div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
						<StatCard label="Total Students" value={totalStudents} accent="#0ea5e9" icon="students" />
						<StatCard label="Learning Outcomes" value={totalOutcomes} accent="#6366f1" icon="outcomes" />
						<StatCard label="Class Average" value={`${allAvg}%`} sub="All courses" accent="#10b981" icon="analytics" />
						<StatCard label="At-Risk Students" value={weak} sub="Score < 40" accent="#ef4444" icon="alert" />
					</div>

					{weak > 0 && (
						<div style={{ background: "#ef444415", border: "1px solid #ef444444", borderRadius: 12, padding: "14px 20px", marginBottom: 24 }}>
							<div style={{ color: "#ef4444", fontWeight: 700, display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
								<Icon name="warning" size={16} /> At-Risk Student Alert
							</div>
							<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
								{weakStudents.map(s => (
									<span key={s.id} style={{ background: "#ef444422", color: "#ef4444", padding: "4px 12px", borderRadius: 20, fontSize: 13 }}>
										{s.name} · {getStudentAvg(s.id)}%
									</span>
								))}
							</div>
						</div>
					)}

					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
						<div style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 14, padding: 24 }}>
							<h3 style={{ color: "#e8f0fe", marginBottom: 20, fontFamily: "'Sora', sans-serif", fontSize: 15 }}>Student Averages</h3>
							<ResponsiveContainer width="100%" height={240}>
								<BarChart data={barData}>
									<CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
									<XAxis dataKey="name" tick={{ fill: "#4a6a8a", fontSize: 12 }} />
									<YAxis domain={[0, 100]} tick={{ fill: "#4a6a8a", fontSize: 12 }} />
									<Tooltip contentStyle={{ background: "#0f1923", border: "1px solid #1e2d3d", borderRadius: 8, color: "#e8f0fe" }} />
									<Bar dataKey="avg" fill={roleColor} radius={[4, 4, 0, 0]} name="Average %" />
								</BarChart>
							</ResponsiveContainer>
						</div>
						<div style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 14, padding: 24 }}>
							<h3 style={{ color: "#e8f0fe", marginBottom: 20, fontFamily: "'Sora', sans-serif", fontSize: 15 }}>Course Performance</h3>
							<ResponsiveContainer width="100%" height={240}>
								<BarChart data={coursePerf}>
									<CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
									<XAxis dataKey="course" tick={{ fill: "#4a6a8a", fontSize: 12 }} />
									<YAxis domain={[0, 100]} tick={{ fill: "#4a6a8a", fontSize: 12 }} />
									<Tooltip contentStyle={{ background: "#0f1923", border: "1px solid #1e2d3d", borderRadius: 8, color: "#e8f0fe" }} />
									<Bar dataKey="avg" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Avg Score" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			);
		}

		// STUDENTS (admin)
		if (activeNav === "students") {
			return (
				<div style={{ padding: 32 }}>
					<h2 style={{ fontSize: 22, fontWeight: 800, color: "#e8f0fe", marginBottom: 24, fontFamily: "'Sora', sans-serif" }}>Student Management</h2>

					{/* Add Student */}
					<div style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 14, padding: 24, marginBottom: 24 }}>
						<h3 style={{ color: "#e8f0fe", marginBottom: 16, fontSize: 15 }}>➕ Enroll New Student</h3>
						<div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
							{[ ["Name", "name", "text"], ["Email", "email", "email"] ].map(([ph, key, type]) => (
								<input key={key} type={type} placeholder={ph} value={newStudent[key]}
									onChange={e => setNewStudent(p => ({ ...p, [key]: e.target.value }))}
									style={inputStyle} />
							))}
							<select value={newStudent.course} onChange={e => setNewStudent(p => ({ ...p, course: e.target.value }))} style={selectStyle}>
								<option value="CS101">CS101</option>
								<option value="MAT201">MAT201</option>
							</select>
							<button onClick={addStudent} style={btnStyle(roleColor)}>Add Student</button>
						</div>
					</div>

					{/* Student Table */}
					<div style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 14, overflow: "hidden" }}>
						<table style={{ width: "100%", borderCollapse: "collapse" }}>
							<thead>
								<tr style={{ background: "#060d14", borderBottom: "1px solid #1e2d3d" }}>
									{["Student", "Course", "Email", "Average", "Status", "Action"].map(h => (
										<th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "#4a6a8a", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{students.map((s, i) => {
									const avg = getStudentAvg(s.id);
									const isWeak = avg < 40 && scores.filter(sc => sc.studentId === s.id).length > 0;
									return (
										<tr key={s.id} style={{ borderBottom: "1px solid #1e2d3d11", background: i % 2 ? "#060d1444" : "transparent" }}>
											<td style={{ padding: "14px 20px", color: "#e8f0fe", fontWeight: 600 }}>
												<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
													<div style={{ width: 32, height: 32, borderRadius: "50%", background: roleColor + "33", color: roleColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>
														{s.name[0]}
													</div>
													{s.name}
												</div>
											</td>
											<td style={{ padding: "14px 20px", color: "#4a6a8a" }}>{s.course}</td>
											<td style={{ padding: "14px 20px", color: "#4a6a8a", fontSize: 13 }}>{s.email}</td>
											<td style={{ padding: "14px 20px" }}><Badge score={avg} /></td>
											<td style={{ padding: "14px 20px" }}>
												{isWeak ? (
													<span style={{ color: "#ef4444", fontSize: 12, display: "flex", gap: 4, alignItems: "center" }}><Icon name="warning" size={14} /> At Risk</span>
												) : (
													<span style={{ color: "#10b981", fontSize: 12 }}>✓ Normal</span>
												)}
											</td>
											<td style={{ padding: "14px 20px" }}>
												<button onClick={() => setSelectedStudent(s)} style={{ background: "none", border: "1px solid #1e2d3d", borderRadius: 6, padding: "4px 12px", color: "#0ea5e9", cursor: "pointer", fontSize: 12, marginRight: 8 }}>View</button>
												<button onClick={() => deleteStudent(s.id)} style={{ background: "none", border: "1px solid #ef444444", borderRadius: 6, padding: "4px 12px", color: "#ef4444", cursor: "pointer", fontSize: 12 }}>Remove</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					{/* Student Detail Modal */}
					{selectedStudent && (
						<div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
							onClick={() => setSelectedStudent(null)}>
							<div style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 18, padding: 32, width: 560, maxHeight: "80vh", overflowY: "auto" }}
								onClick={e => e.stopPropagation()}>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
									<h3 style={{ color: "#e8f0fe", fontFamily: "'Sora', sans-serif" }}>{selectedStudent.name}</h3>
									<button onClick={() => setSelectedStudent(null)} style={{ background: "none", border: "none", color: "#4a6a8a", cursor: "pointer" }}><Icon name="close" /></button>
								</div>
								{outcomes.filter(o => o.course === selectedStudent.course).map(o => {
									const sc = scores.find(s => s.studentId === selectedStudent.id && s.outcomeId === o.id);
									return (
										<div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #1e2d3d" }}>
											<div>
												<div style={{ color: "#e8f0fe", fontWeight: 600, fontSize: 14 }}>{o.title}</div>
												<div style={{ color: "#4a6a8a", fontSize: 12 }}>{o.code} · Weight: {o.weight}%</div>
											</div>
											{sc ? <Badge score={sc.score} /> : <span style={{ color: "#4a6a8a", fontSize: 13 }}>Not graded</span>}
										</div>
									);
								})}
								<div style={{ marginTop: 20, padding: "16px 0", borderTop: "1px solid #1e2d3d", display: "flex", justifyContent: "space-between" }}>
									<span style={{ color: "#4a6a8a" }}>Overall Average</span>
									<Badge score={getStudentAvg(selectedStudent.id)} />
								</div>
							</div>
						</div>
					)}
				</div>
			);
		}

		// OUTCOMES
		if (activeNav === "outcomes") {
			const visibleCourse = role === "admin" ? null : "CS101";
			const filteredOutcomes = visibleCourse ? outcomes.filter(o => o.course === visibleCourse) : outcomes;
			return (
				<div style={{ padding: 32 }}>
					<h2 style={{ fontSize: 22, fontWeight: 800, color: "#e8f0fe", marginBottom: 24, fontFamily: "'Sora', sans-serif" }}>Learning Outcomes</h2>

					{/* Add Outcome */}
					<div style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 14, padding: 24, marginBottom: 24 }}>
						<h3 style={{ color: "#e8f0fe", marginBottom: 16, fontSize: 15 }}>➕ Add New Learning Outcome</h3>
						<div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
							<input placeholder="CLO Code (e.g. CLO-5)" value={newOutcome.code} onChange={e => setNewOutcome(p => ({ ...p, code: e.target.value }))} style={{ ...inputStyle, width: 160 }} />
							<input placeholder="Title" value={newOutcome.title} onChange={e => setNewOutcome(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
							<input placeholder="Description" value={newOutcome.description} onChange={e => setNewOutcome(p => ({ ...p, description: e.target.value }))} style={{ ...inputStyle, width: 240 }} />
							<select value={newOutcome.course} onChange={e => setNewOutcome(p => ({ ...p, course: e.target.value }))} style={selectStyle}>
								<option value="CS101">CS101</option>
								<option value="MAT201">MAT201</option>
							</select>
							<input type="number" placeholder="Weight %" value={newOutcome.weight} onChange={e => setNewOutcome(p => ({ ...p, weight: e.target.value }))} style={{ ...inputStyle, width: 100 }} />
							<button onClick={addOutcome} style={btnStyle(roleColor)}>Add Outcome</button>
						</div>
					</div>

					{/* Outcomes Grid */}
					<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
						{filteredOutcomes.map(o => (
							<div key={o.id} style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 14, padding: 20, position: "relative" }}>
								<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
									<span style={{ background: roleColor + "22", color: roleColor, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontFamily: "monospace", fontWeight: 700 }}>{o.code}</span>
									<span style={{ fontSize: 11, color: "#4a6a8a" }}>{o.course}</span>
								</div>
								<div style={{ color: "#e8f0fe", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{o.title}</div>
								<div style={{ color: "#4a6a8a", fontSize: 13, marginBottom: 12 }}>{o.description}</div>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
									<span style={{ color: "#4a6a8a", fontSize: 12 }}>Weight: <span style={{ color: "#e8f0fe" }}>{o.weight}%</span></span>
									<button onClick={() => deleteOutcome(o.id)} style={{ background: "none", border: "1px solid #ef444444", borderRadius: 6, padding: "3px 10px", color: "#ef4444", cursor: "pointer", fontSize: 12 }}>Delete</button>
								</div>
							</div>
						))}
					</div>
				</div>
			);
		}

		// SCORES
		if (activeNav === "scores") {
			const recentScores = [...scores].sort((a, b) => b.id - a.id).slice(0, 15);
			return (
				<div style={{ padding: 32 }}>
					<h2 style={{ fontSize: 22, fontWeight: 800, color: "#e8f0fe", marginBottom: 24, fontFamily: "'Sora', sans-serif" }}>Enter Student Scores</h2>

					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
						<div style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 14, padding: 24 }}>
							<h3 style={{ color: "#e8f0fe", marginBottom: 16, fontSize: 15 }}>📝 Record Score</h3>
							<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
								<select value={newScore.studentId} onChange={e => setNewScore(p => ({ ...p, studentId: e.target.value }))} style={{ ...selectStyle, width: "100%" }}>
									<option value="">Select Student</option>
									{students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.course})</option>)}
								</select>
								<select value={newScore.outcomeId} onChange={e => setNewScore(p => ({ ...p, outcomeId: e.target.value }))} style={{ ...selectStyle, width: "100%" }}>
									<option value="">Select Learning Outcome</option>
									{outcomes.filter(o => !newScore.studentId || o.course === students.find(s => s.id === Number(newScore.studentId))?.course)
										.map(o => <option key={o.id} value={o.id}>{o.code}: {o.title}</option>)}
								</select>
								<input type="number" min="0" max="100" placeholder="Score (0–100)" value={newScore.score}
									onChange={e => setNewScore(p => ({ ...p, score: e.target.value }))}
									style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }} />
								{newScore.score !== "" && (
									<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
										<span style={{ color: "#4a6a8a", fontSize: 13 }}>Preview:</span>
										<Badge score={Number(newScore.score)} />
										{Number(newScore.score) < 40 && <span style={{ color: "#ef4444", fontSize: 12 }}>⚠ Below passing threshold</span>}
									</div>
								)}
								<button onClick={addScore} style={{ ...btnStyle(roleColor), width: "100%", justifyContent: "center", padding: "12px" }}>Save Score</button>
							</div>
						</div>

						<div style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 14, padding: 24 }}>
							<h3 style={{ color: "#e8f0fe", marginBottom: 16, fontSize: 15 }}>Recent Entries</h3>
							<div style={{ overflowY: "auto", maxHeight: 300 }}>
								{recentScores.map(sc => {
									const stu = students.find(s => s.id === sc.studentId);
									const out = outcomes.find(o => o.id === sc.outcomeId);
									return (
										<div key={sc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1e2d3d11" }}>
											<div>
												<div style={{ color: "#e8f0fe", fontSize: 13, fontWeight: 600 }}>{stu?.name || "?"}</div>
												<div style={{ color: "#4a6a8a", fontSize: 12 }}>{out?.title || "?"} · {sc.date}</div>
											</div>
											<Badge score={sc.score} />
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			);
		}

		// MY SCORES (student)
		if (activeNav === "my-scores") {
			const myScores = scores.filter(s => s.studentId === loggedInStudentId);
			const myOutcomes = outcomes.filter(o => o.course === currentStudent?.course);
			return (
				<div style={{ padding: 32 }}>
					<h2 style={{ fontSize: 22, fontWeight: 800, color: "#e8f0fe", marginBottom: 24, fontFamily: "'Sora', sans-serif" }}>My Scores</h2>
					<div style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 14, overflow: "hidden" }}>
						<table style={{ width: "100%", borderCollapse: "collapse" }}>
							<thead>
								<tr style={{ background: "#060d14", borderBottom: "1px solid #1e2d3d" }}>
									{["Outcome", "Code", "Weight", "Score", "Status"].map(h => (
										<th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "#4a6a8a", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{myOutcomes.map(o => {
									const sc = myScores.find(s => s.outcomeId === o.id);
									return (
										<tr key={o.id} style={{ borderBottom: "1px solid #1e2d3d22" }}>
											<td style={{ padding: "14px 20px", color: "#e8f0fe", fontWeight: 600 }}>{o.title}</td>
											<td style={{ padding: "14px 20px", color: "#4a6a8a", fontFamily: "monospace" }}>{o.code}</td>
											<td style={{ padding: "14px 20px", color: "#4a6a8a" }}>{o.weight}%</td>
											<td style={{ padding: "14px 20px" }}>{sc ? <Badge score={sc.score} /> : <span style={{ color: "#4a6a8a" }}>—</span>}</td>
											<td style={{ padding: "14px 20px" }}>
												{!sc ? <span style={{ color: "#4a6a8a", fontSize: 12 }}>Pending</span>
													: sc.score < 40 ? <span style={{ color: "#ef4444", fontSize: 12 }}>⚠ At Risk</span>
														: sc.score >= 70 ? <span style={{ color: "#10b981", fontSize: 12 }}>✓ Good</span>
															: <span style={{ color: "#fbbf24", fontSize: 12 }}>⚡ Average</span>}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			);
		}

		// ANALYTICS
		if (activeNav === "analytics") {
			const outcomePerf = outcomes.map(o => {
				const oScores = scores.filter(s => s.outcomeId === o.id);
				return { name: o.title.length > 12 ? o.title.slice(0, 12) + "…" : o.title, avg: avgScore(oScores), course: o.course };
			});

			const distributionData = [
				{ range: "90–100", count: scores.filter(s => s.score >= 90).length, fill: "#10b981" },
				{ range: "80–89", count: scores.filter(s => s.score >= 80 && s.score < 90).length, fill: "#34d399" },
				{ range: "70–79", count: scores.filter(s => s.score >= 70 && s.score < 80).length, fill: "#60a5fa" },
				{ range: "60–69", count: scores.filter(s => s.score >= 60 && s.score < 70).length, fill: "#fbbf24" },
				{ range: "40–59", count: scores.filter(s => s.score >= 40 && s.score < 60).length, fill: "#f97316" },
				{ range: "<40", count: scores.filter(s => s.score < 40).length, fill: "#ef4444" },
			];

			const studentTrend = students.slice(0, 5).map(s => ({
				name: s.name.split(" ")[0],
				avg: getStudentAvg(s.id),
				weakFlag: getStudentAvg(s.id) < 40 ? 1 : 0,
			}));

			return (
				<div style={{ padding: 32 }}>
					<h2 style={{ fontSize: 22, fontWeight: 800, color: "#e8f0fe", marginBottom: 24, fontFamily: "'Sora', sans-serif" }}>Performance Analytics</h2>

					<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
						<div style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 14, padding: 24 }}>
							<h3 style={{ color: "#e8f0fe", marginBottom: 20, fontSize: 15 }}>Score Distribution</h3>
							<ResponsiveContainer width="100%" height={240}>
								<BarChart data={distributionData}>
									<CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
									<XAxis dataKey="range" tick={{ fill: "#4a6a8a", fontSize: 11 }} />
									<YAxis tick={{ fill: "#4a6a8a", fontSize: 11 }} />
									<Tooltip contentStyle={{ background: "#0f1923", border: "1px solid #1e2d3d", borderRadius: 8, color: "#e8f0fe" }} />
									<Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]}>
										{distributionData.map((entry, index) => (
											<rect key={index} fill={entry.fill} />
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						</div>

						<div style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 14, padding: 24 }}>
							<h3 style={{ color: "#e8f0fe", marginBottom: 20, fontSize: 15 }}>Outcome Avg by Course</h3>
							<ResponsiveContainer width="100%" height={240}>
								<BarChart data={outcomePerf}>
									<CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
									<XAxis dataKey="name" tick={{ fill: "#4a6a8a", fontSize: 10 }} />
									<YAxis domain={[0, 100]} tick={{ fill: "#4a6a8a", fontSize: 10 }} />
									<Tooltip contentStyle={{ background: "#0f1923", border: "1px solid #1e2d3d", borderRadius: 8, color: "#e8f0fe" }} />
									<Bar dataKey="avg" name="Avg Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Weak Student Detection */}
					<div style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 14, padding: 24, marginBottom: 20 }}>
						<h3 style={{ color: "#e8f0fe", marginBottom: 16, fontSize: 15 }}>🎯 Student Ranking</h3>
						<ResponsiveContainer width="100%" height={200}>
							<BarChart data={students.map(s => ({ name: s.name.split(" ")[0], avg: getStudentAvg(s.id) })).sort((a, b) => b.avg - a.avg)}>
								<CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
								<XAxis dataKey="name" tick={{ fill: "#4a6a8a", fontSize: 11 }} />
								<YAxis domain={[0, 100]} tick={{ fill: "#4a6a8a", fontSize: 11 }} />
								<Tooltip contentStyle={{ background: "#0f1923", border: "1px solid #1e2d3d", borderRadius: 8, color: "#e8f0fe" }} />
								<Bar dataKey="avg" name="Average" radius={[4, 4, 0, 0]}
									fill={roleColor}
									label={{ position: "top", fill: "#4a6a8a", fontSize: 10, formatter: v => v > 0 ? v : "" }} />
							</BarChart>
						</ResponsiveContainer>
					</div>

					{/* Weak students table */}
					{weakStudents.length > 0 && (
						<div style={{ background: "#ef44440d", border: "1px solid #ef444433", borderRadius: 14, padding: 24 }}>
							<h3 style={{ color: "#ef4444", marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
								<Icon name="warning" /> Students Requiring Intervention (avg &lt; 40)
							</h3>
							<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
								{weakStudents.map(s => {
									const avg = getStudentAvg(s.id);
									const myScoreDetails = scores.filter(sc => sc.studentId === s.id);
									return (
										<div key={s.id} style={{ background: "#0a1520", border: "1px solid #ef444433", borderRadius: 12, padding: 16 }}>
											<div style={{ color: "#e8f0fe", fontWeight: 700, marginBottom: 4 }}>{s.name}</div>
											<div style={{ color: "#4a6a8a", fontSize: 12, marginBottom: 12 }}>{s.course}</div>
											<div style={{ display: "flex", justifyContent: "space-between" }}>
												<span style={{ color: "#4a6a8a", fontSize: 12 }}>Average</span>
												<Badge score={avg} />
											</div>
											<div style={{ marginTop: 12, height: 4, background: "#1e2d3d", borderRadius: 4, overflow: "hidden" }}>
												<div style={{ width: `${avg}%`, height: "100%", background: "#ef4444", borderRadius: 4 }} />
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
			);
		}

		return <div style={{ padding: 32, color: "#4a6a8a" }}>Select a module from the sidebar.</div>;
	};

	const inputStyle = {
		background: "#060d14", border: "1px solid #1e2d3d", borderRadius: 8, padding: "10px 14px",
		color: "#e8f0fe", fontSize: 14, outline: "none", minWidth: 160,
	};
	const selectStyle = {
		...inputStyle, cursor: "pointer",
	};
	const btnStyle = (color) => ({
		background: color, border: "none", borderRadius: 8, padding: "10px 20px",
		color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14, display: "flex", gap: 6, alignItems: "center",
	});

	const currentNav = navItems[role];
	const roleLabel = { admin: "Administrator", teacher: "Instructor", student: "Student" };

	return (
		<div style={{ display: "flex", height: "100vh", background: "#060d14", fontFamily: "'Segoe UI', sans-serif", overflow: "hidden" }}>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Sora:wght@300;400;600;800&display=swap');
				::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #060d14; } ::-webkit-scrollbar-thumb { background: #1e2d3d; border-radius: 3px; }
				input::placeholder { color: #2a4a6a; } select option { background: #0a1520; }
			`}</style>

			{/* SIDEBAR */}
			{sidebarOpen && (
				<div style={{ width: 220, background: "#0a1520", borderRight: "1px solid #1e2d3d", display: "flex", flexDirection: "column", flexShrink: 0 }}>
					<div style={{ padding: "24px 20px 16px" }}>
						<div style={{ fontSize: 10, letterSpacing: 3, color: roleColor, textTransform: "uppercase", fontFamily: "'Courier Prime', monospace", marginBottom: 6 }}>◆ SLO Tracker</div>
						<div style={{ fontSize: 15, fontWeight: 800, color: "#e8f0fe", fontFamily: "'Sora', sans-serif" }}>Academic ERP</div>
					</div>

					<div style={{ padding: "0 12px 12px", borderBottom: "1px solid #1e2d3d" }}>
						<div style={{ background: roleColor + "22", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
							<div style={{ width: 28, height: 28, borderRadius: "50%", background: roleColor + "44", color: roleColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
								<Icon name={role === "admin" ? "admin" : role === "teacher" ? "teacher" : "student"} size={15} />
							</div>
							<div>
								<div style={{ color: "#e8f0fe", fontSize: 13, fontWeight: 700 }}>{roleLabel[role]}</div>
								{role === "student" && <div style={{ color: "#4a6a8a", fontSize: 11 }}>{currentStudent?.name}</div>}
							</div>
						</div>
					</div>

					<nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
						{currentNav.map(item => {
							const active = activeNav === item.id;
							return (
								<button key={item.id} onClick={() => setActiveNav(item.id)}
									style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left", width: "100%", transition: "all .15s",
										background: active ? roleColor + "22" : "transparent",
										color: active ? roleColor : "#4a6a8a",
										fontWeight: active ? 700 : 400, fontSize: 14 }}>
									<Icon name={item.icon} size={16} />
									{item.label}
								</button>
							);
						})}
					</nav>

					<button onClick={() => { setRole(null); setActiveNav("dashboard"); }}
						style={{ margin: 12, display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, border: "1px solid #1e2d3d", cursor: "pointer", background: "transparent", color: "#4a6a8a", fontSize: 13 }}>
						<Icon name="logout" size={15} /> Sign Out
					</button>
				</div>
			)}

			{/* MAIN */}
			<div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
				{/* NAVBAR */}
				<div style={{ background: "#0a1520", borderBottom: "1px solid #1e2d3d", padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
					<button onClick={() => setSidebarOpen(p => !p)} style={{ background: "none", border: "none", color: "#4a6a8a", cursor: "pointer", padding: 4 }}>
						<Icon name="menu" />
					</button>
					<div style={{ flex: 1, fontSize: 14, color: "#4a6a8a", fontFamily: "'Courier Prime', monospace" }}>
						{currentNav.find(n => n.id === activeNav)?.label || "Dashboard"}
					</div>
					{weakStudents.length > 0 && role !== "student" && (
						<div style={{ display: "flex", alignItems: "center", gap: 6, background: "#ef444422", color: "#ef4444", padding: "4px 12px", borderRadius: 20, fontSize: 12 }}>
							<Icon name="alert" size={13} /> {weakStudents.length} at-risk
						</div>
					)}
					<div style={{ fontSize: 12, color: "#4a6a8a", fontFamily: "monospace" }}>Spring 2025</div>
				</div>

				{/* PAGE */}
				<div style={{ flex: 1, overflowY: "auto" }}>
					{renderPage()}
				</div>
			</div>

			{/* TOAST */}
			{toast && (
				<div style={{ position: "fixed", bottom: 24, right: 24, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, zIndex: 9999, boxShadow: "0 8px 32px #00000066" }}>
					{toast.type === "error" ? "⚠ " : "✓ "}{toast.msg}
				</div>
			)}
		</div>
	);
}
