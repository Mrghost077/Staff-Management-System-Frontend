import { useState, useMemo, useEffect } from "react";
import Header from "../../components/Header";
import axios from "axios";

// Helper to get API URL
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3301';

const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  // 1. We define how each status looks and what it says
  const config = {
    present: { label: "Present", style: "bg-green-100 text-green-700" },
    leave: { label: "Leave", style: "bg-red-100 text-red-700" },
    late: { label: "Late", style: "bg-orange-100 text-orange-700" },
    unmarked: { label: "Not Marked", style: "bg-slate-100 text-slate-500" }
  };

  // 2. We look up the status sent from the backend. 
  // If it's missing, we default to "unmarked"
  const current = config[status] || config['unmarked'];

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${current.style}`}>
      {current.label}
    </span>
  );
};

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7)); // Default: Current Month YYYY-MM
  const [isExporting, setIsExporting] = useState(false);

  // 1. Fetch Teacher's Attendance
  useEffect(() => {
    const fetchMyAttendance = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/attendance/my-attendance`, {
          withCredentials: true // Crucial for JWT cookies
        });
        if (response.data.success) {
          setAttendanceData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching personal attendance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyAttendance();
  }, []);

  // 2. Filter Logic (Month + Search)
  const filteredData = useMemo(() => {
    return attendanceData.filter((row) => {
      const matchesSearch = row.date.includes(search);
      const matchesMonth = row.date.startsWith(date);
      return matchesSearch && matchesMonth;
    });
  }, [attendanceData, search, date]);

  // 3. Stats Calculation
  const stats = useMemo(() => {
    // Only calculate stats for the selected month's data
    const monthlyRecords = attendanceData.filter(d => d.date.startsWith(date));
    const total = monthlyRecords.length;
    const present = monthlyRecords.filter(d => d.status === "present").length;
    const late = monthlyRecords.filter(d => d.status === "late").length;
    
    return {
      rate: total > 0 ? `${Math.round(((present + late) / total) * 100)}%` : "0%",
      presentDays: present + late,
      leaveDays: monthlyRecords.filter(d => d.status === "leave").length
    };
  }, [attendanceData, date]);

  const handleExport = async () => {
    setIsExporting(true);

    const teacherId = attendanceData.length > 0 ? attendanceData[0].teacher : null;

    if (!teacherId) {
        alert("No records found to export.");
        setIsExporting(false);
        return;
    }

    const url = `${API_BASE_URL}/api/attendance/export/pdf?date=${date}&teacherId=${teacherId}`;
    
    window.open(url, '_blank');
    setIsExporting(false);
};

  if (loading) return <div className="p-10 text-center">Loading your records...</div>;

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header title="My Attendance History" />

      <div className="p-6 max-w-7xl mx-auto">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Monthly Rate" value={stats.rate} subtitle={`In ${date}`} icon="📊" />
          <StatCard title="Days Attended" value={stats.presentDays} subtitle="Present + Late" icon="✅" />
          <StatCard title="Days on Leave" value={stats.leaveDays} subtitle="Approved Leaves" icon="❌" />
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-400 mb-1 ml-1">FILTER MONTH</label>
              <input
                type="month"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-400 mb-1 ml-1">SEARCH DATE</label>
              <input
                type="text"
                placeholder="YYYY-MM-DD"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:bg-gray-400 self-end"
          >
            {isExporting ? "Generating..." : "Download Report"}
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length ? (
                filteredData.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-700">{row.date}</td>
                    <td className="p-4 text-gray-600">{row.checkIn || '--:--'}</td>
                    <td className="p-4 text-gray-600">{row.checkOut || '--:--'}</td>
                    <td className="p-4 text-gray-600">{row.subject || 'General'}</td>
                    <td className="p-4">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400 italic">
                    No attendance records found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Attendance;