import React from "react";
import { Bell,User } from "lucide-react";

export default function TopBar(){
    return(
       <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 w-full">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
      <div className="flex items-center gap-4">
       <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <User size={20} />
        </button>
      </div>
    </header>

    )
}