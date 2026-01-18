import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchTeacherPersonalReports } from "../../services/reportsService";
import {
  Search,
  UserCheck,
  Clock,
  Activity,
  Download,
  FileDown,
} from "lucide-react";
import { useUser } from "../../contexts/UserContext";

const TeacherReports = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("attendance");
  const [reportData, setReportData] = useState({
    attendance: [],
    leaves: [],
    relief: [],
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchTeacherPersonalReports("");
        if (res && res.success) {
          setReportData({
            attendance: res.data.attendance || [],
            leaves: res.data.leaves || [],
            relief: res.data.relief || [],
          });
        }
      } catch (error) {
        console.error("Data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getFilteredData = () => {
    let list = reportData[activeTab] || [];
    if (searchTerm) {
      list = list.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    }
    return [...list].sort((a, b) => {
      const dateA = new Date(a.date || a.startDate || a.createdAt);
      const dateB = new Date(b.date || b.startDate || b.createdAt);
      return dateB - dateA;
    });
  };

  const exportPDF = () => {
    try {
      let data = getFilteredData();
      if (activeTab === "leaves") {
        data = data.filter((item) => item.status.toLowerCase() === "approved");
      }
      if (data.length === 0) return alert("No approved records available.");

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFillColor(26, 54, 138);
      doc.rect(0, 0, pageWidth, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc
        .setFontSize(18)
        .setFont("helvetica", "bold")
        .text("H/Meegasara Maha Vidyalaya", 14, 18);
      doc
        .setFontSize(10)
        .setFont("helvetica", "normal")
        .text("Official Academic Record - TeachGrid System", 14, 28);

      doc.setTextColor(40, 40, 40);
      doc
        .setFontSize(14)
        .setFont("helvetica", "bold")
        .text(`${activeTab.toUpperCase()} REPORT`, 14, 55);
      doc
        .setFontSize(10)
        .setFont("helvetica", "normal")
        .text("Teacher Name  :", 14, 63);
      doc.setFont("helvetica", "bold").text(`${user?.name || "N/A"}`, 45, 63);
      doc.setFont("helvetica", "normal").text("Report Type    :", 14, 68);
      doc.setFont("helvetica", "bold").text("Full Academic History", 45, 68);
      doc.setFont("helvetica", "normal").text("Generated On  :", 14, 73);
      doc.setFont("helvetica", "bold");
      const now = new Date();
      const dateTimeStr = `${now.toLocaleDateString()} | ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      doc.text(dateTimeStr, 45, 73);

      const headers =
        activeTab === "relief"
          ? [["DATE", "GRADE", "SUBJECT", "PERIOD", "STATUS"]]
          : activeTab === "attendance"
            ? [["DATE", "DESCRIPTION", "TIMING", "STATUS"]]
            : [["DATE", "LEAVE TYPE", "DURATION", "STATUS"]];

      const body = data.map((item) => {
        const rowDate = (
          item.date ||
          item.startDate ||
          item.createdAt ||
          ""
        ).split("T")[0];
        if (activeTab === "relief") {
          return [
            rowDate,
            `Grade ${item.grade}`,
            item.subject,
            item.period,
            item.status.toUpperCase(),
          ];
        } else if (activeTab === "attendance") {
          return [
            rowDate,
            "Attendance Entry",
            `${item.checkIn || "--"} - ${item.checkOut || "--"}`,
            item.status.toUpperCase(),
          ];
        } else {
          return [
            rowDate,
            item.leaveType,
            `${item.startDate.split("T")[0]} to ${item.endDate.split("T")[0]}`,
            item.status.toUpperCase(),
          ];
        }
      });

      autoTable(doc, {
        startY: 80,
        head: headers,
        body: body,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 3, halign: "center" },
        headStyles: {
          fillColor: [26, 54, 138],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { bottom: 45 },
        didDrawPage: (data) => {
          doc.setFontSize(8).setTextColor(150);
          doc.text(`Page ${data.pageNumber}`, pageWidth / 2, pageHeight - 10, {
            align: "center",
          });
        },
      });

      const finalPageHeight = doc.internal.pageSize.getHeight();
      const finalPageWidth = doc.internal.pageSize.getWidth();
      const footerY = finalPageHeight - 35;
      doc.setFontSize(10).setTextColor(40);
      doc.line(14, footerY, 74, footerY);
      doc
        .setFont("helvetica", "bold")
        .text("Teacher's Signature", 14, footerY + 5);
      doc.line(finalPageWidth - 74, footerY, finalPageWidth - 14, footerY);
      doc.text("Principal's Signature", finalPageWidth - 74, footerY + 5);

      doc.save(`Report_${activeTab}.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    let data = getFilteredData();
    if (activeTab === "leaves")
      data = data.filter((item) => item.status.toLowerCase() === "approved");
    let csvContent = "data:text/csv;charset=utf-8,Date,Detail,Status\r\n";
    data.forEach((item) => {
      const rowDate = (
        item.date ||
        item.startDate ||
        item.createdAt ||
        ""
      ).split("T")[0];
      csvContent += `${rowDate},${activeTab},${item.status}\r\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `Report_${activeTab}.csv`;
    link.click();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-[#1e293b]">
      <Header title="Reports Center" />
      <div className="p-4 lg:p-8 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="ATTENDANCE"
            value={reportData.attendance.length}
            label="Total Entries"
            icon={<UserCheck size={20} className="text-emerald-500" />}
          />
          <StatCard
            title="LEAVES"
            value={reportData.leaves.length}
            label="Total Requests"
            icon={<Clock size={20} className="text-orange-500" />}
          />
          <StatCard
            title="RELIEF"
            value={reportData.relief.length}
            label="Assigned Reliefs"
            icon={<Activity size={20} className="text-blue-500" />}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
          <div className="p-6 border-b border-[#f1f5f9] flex flex-col xl:flex-row justify-between gap-4">
            <div className="flex bg-white border border-[#e2e8f0] p-1 rounded-lg">
              {["attendance", "leaves", "relief"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-[#1e293b] text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-[#e2e8f0] text-sm md:w-64 outline-none focus:ring-2 focus:ring-indigo-500/10"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center bg-white border border-[#e2e8f0] rounded-lg p-1">
                <button
                  onClick={exportPDF}
                  className="flex items-center bg-black gap-2 px-4 py-1.5 rounded-md text-sm font-bold text-white border-r border-[#e2e8f0]"
                >
                  <FileDown size={16} className="text-red-500" /> PDF
                </button>
                <button
                  onClick={exportCSV}
                  className="flex items-center bg-gray-700 gap-2 px-4 py-1.5 rounded-md text-sm font-bold text-white"
                >
                  <Download size={16} className="text-emerald-400" /> CSV
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-left border-b border-slate-200 text-[11px] uppercase italic">
                  <th className="px-6 py-4">Date</th>
                  {activeTab === "attendance" && (
                    <>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Timing</th>
                    </>
                  )}
                  {activeTab === "leaves" && (
                    <>
                      <th className="px-6 py-4">Leave Type</th>
                      <th className="px-6 py-4">Duration</th>
                    </>
                  )}
                  {activeTab === "relief" && (
                    <>
                      <th className="px-6 py-4">Grade & Subject</th>
                      <th className="px-6 py-4">Period</th>
                    </>
                  )}
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-20 text-center font-bold text-slate-400 animate-pulse"
                    >
                      SYNCING...
                    </td>
                  </tr>
                ) : (
                  getFilteredData().map((item, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50 transition-all text-sm font-semibold text-slate-600"
                    >
                      <td className="px-6 py-4">
                        {
                          (
                            item.date ||
                            item.startDate ||
                            item.createdAt ||
                            ""
                          ).split("T")[0]
                        }
                      </td>
                      {activeTab === "attendance" && (
                        <>
                          <td className="px-6 py-4">Attendance Entry</td>
                          <td className="px-6 py-4">
                            {item.checkIn || "--"} - {item.checkOut || "--"}
                          </td>
                        </>
                      )}
                      {activeTab === "leaves" && (
                        <>
                          <td className="px-6 py-4">{item.leaveType}</td>
                          <td className="px-6 py-4 text-[10px]">
                            {item.startDate.split("T")[0]} to{" "}
                            {item.endDate.split("T")[0]}
                          </td>
                        </>
                      )}
                      {activeTab === "relief" && (
                        <>
                          <td className="px-6 py-4">
                            Grade {item.grade} - {item.subject}
                          </td>
                          <td className="px-6 py-4">Period {item.period}</td>
                        </>
                      )}
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, label, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          {title}
        </h3>
        <p className="text-3xl font-bold text-slate-900 leading-none">
          {value}
        </p>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg border border-[#f1f5f9]">
        {icon}
      </div>
    </div>
    <p className="text-xs text-slate-400 font-medium italic">{label}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  const styles =
    s === "present" || s === "approved" || s === "assigned"
      ? "bg-green-50 text-green-700 border-green-100"
      : s === "pending"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : "bg-red-50 text-red-700 border-red-100";
  return (
    <span
      className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border ${styles} shadow-sm`}
    >
      {status}
    </span>
  );
};

export default TeacherReports;
