import React from "react";

export default function Cardviews() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

     {/* Attendance */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <p className="text-gray-500 font-medium">Attendance Rate</p>
        <h2 className="text-3xl font-bold mt-3">96%</h2>
        <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
          <div className="h-full bg-black rounded-full w-[96%]"></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">This month</p>
      </div>

      {/* Approved Leaves */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <p className="text-gray-500 font-medium">Approved Leaves</p>
        <h2 className="text-3xl font-bold mt-3">3/5</h2>
        <p className="text-sm text-gray-500 mt-1">This academic year</p>
      </div>

      {/* Relief Duties */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <p className="text-gray-500 font-medium">Relief Duties</p>
        <h2 className="text-3xl font-bold mt-3">12</h2>
        <p className="text-sm text-gray-500 mt-1">Completed this year</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <p className="text-gray-500 font-medium">Quick Actions</p>

        <button className="w-full mt-4 border border-gray-300 rounded-lg p-2 hover:bg-gray-100">
          Apply Leave
        </button>

        <button className="w-full mt-3 border border-gray-300 rounded-lg p-2 hover:bg-gray-100">
          View Attendance
        </button>
      </div>

    </div>
  );
}
    