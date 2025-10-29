import React from "react";
import Sidebar from "./Sidebar";

export default function Dashboard() {
return (

      <div className="flex h-screen bg-gray-100">
        <Sidebar/>


    <main className="flex-1 p-4">
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-2xl font-semibold">Welcome back, John Smith!</h2>
          <p className="text-sm opacity-90">Here's your overview for today.</p>
        </div>

        
    </main>

</div>


)

}