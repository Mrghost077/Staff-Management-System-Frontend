import React, { useState } from "react";
import {
  Home,
  Calendar,
  ClipboardList,
  Users,
  Bell,
  Settings,
  LogOut,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle
} from "lucide-react";

// Navigation Sidebar Component
function NavigationBar({ activeView, setActiveView }) {
  return (
    <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between h-screen">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold">
            RD
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Ravindu Deshan</h3>
            <h2 className="text-sm text-gray-500">deshanravindu256@gmail.com</h2>
          </div>
        </div>

        <span className="inline-block bg-gray-100 text-black text-xs font-medium px-2 py-1 rounded-full mb-10">
          Admin
        </span>

        <div className="border-t border-gray-300 mb-6"></div>

        <nav className="space-y-4">
          {[
            { name: "Dashboard", icon: <Home size={20} /> },
            { name: "Attendance Records", icon: <Calendar size={20} /> },
            { name: "Leave Management", icon: <ClipboardList size={20} /> },
            { name: "Relief Duty", icon: <Users size={20} /> },
            { name: "Announcement", icon: <Bell size={20} /> },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveView(item.name)}
              className={`flex items-center gap-3 p-2 w-full text-left rounded-md transition-colors ${
                activeView === item.name
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-3">
        <button className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-200 rounded-md w-full text-left">
          <Settings size={18} /> Settings
        </button>

        <button className="flex items-center gap-3 p-2 text-red-600 hover:bg-red-100 rounded-md w-full text-left">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

// Admin Dashboard Component
function AdminDashboard() {
  const [activeView, setActiveView] = useState("Dashboard");

  // Sample data
  const leaveRequests = [
    {
      id: 1,
      name: "John Smith",
      initials: "JS",
      type: "Medical Leave",
      dates: "Jan 15 - Jan 17",
      priority: "high",
      submitted: "2 days ago"
    },
    {
      id: 2,
      name: "Emily Davis",
      initials: "ED",
      type: "Personal Leave",
      dates: "Jan 20",
      priority: "medium",
      submitted: "1 day ago"
    },
    {
      id: 3,
      name: "Michael Johnson",
      initials: "MJ",
      type: "Family Emergency",
      dates: "Jan 22 - Jan 24",
      priority: "high",
      submitted: "3 hours ago"
    }
  ];

  const teacherAvailability = [
    { name: "Alice Brown", subject: "Mathematics", status: "Available" },
    { name: "Bob Wilson", subject: "English", status: "On Leave" },
    { name: "Carol Taylor", subject: "Science", status: "Available" },
    { name: "David Lee", subject: "History", status: "Relief Duty" },
    { name: "Eva Martinez", subject: "Art", status: "Available" },
    { name: "Frank Davis", subject: "PE", status: "On Leave" }
  ];

 