"use client";

import React from 'react';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-semibold mb-4">Admin Dashboard</h1>
      <p className="mb-6 text-gray-700">Manage users, content queues, and settings from here.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="bg-white rounded-lg shadow border p-4"> 
          <h2 className="text-lg font-semibold mb-2">Users</h2>
          <p className="text-sm text-gray-600">Add, edit, or remove users and assign roles.</p>
        </section>
        <section className="bg-white rounded-lg shadow border p-4"> 
          <h2 className="text-lg font-semibold mb-2">Content Queue</h2>
          <p className="text-sm text-gray-600">Review posts awaiting approval.</p>
        </section>
        <section className="bg-white rounded-lg shadow border p-4"> 
          <h2 className="text-lg font-semibold mb-2">Settings</h2>
          <p className="text-sm text-gray-600">Configure roles, permissions, and integrations.</p>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
