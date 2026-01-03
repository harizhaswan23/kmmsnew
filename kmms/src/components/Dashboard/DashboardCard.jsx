import React from "react";

const DashboardCard = ({ title, value, icon: Icon, color = "bg-indigo-600", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>

        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
