import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import Layout from "../../components/Layout";
import {
  Users as UsersIcon,
  Search,
  Filter,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Store,
  CheckCircle,
  XCircle,
  Shield,
  ShoppingBag,
} from "lucide-react";

const Users = () => {
  const { users, deleteUser, verifyUser } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Apply filters
  const filteredUsers = useMemo(() => {
    let filtered = users.filter((user) => user.role !== "admin");

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter === "active") {
      filtered = filtered.filter((user) => user.active);
    } else if (statusFilter === "banned") {
      filtered = filtered.filter((user) => !user.active);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.storeName?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [users, roleFilter, statusFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const allUsers = users.filter((u) => u.role !== "admin");
    return {
      total: allUsers.length,
      buyers: allUsers.filter((u) => u.role === "buyer").length,
      sellers: allUsers.filter((u) => u.role === "seller").length,
      verified: allUsers.filter((u) => u.verified).length,
    };
  }, [users]);

  const handleBanUser = (userId) => {
    if (window.confirm("Are you sure you want to ban this user?")) {
      deleteUser(userId);
    }
  };

  const handleVerifyUser = (userId) => {
    verifyUser(userId);
  };

  const getRoleIcon = (role) => {
    if (role === "seller") {
      return <Store className="h-5 w-5 text-accent-600" />;
    }
    return <ShoppingBag className="h-5 w-5 text-primary-600" />;
  };

  const getRoleBadge = (role) => {
    const styles = {
      buyer: "bg-primary-100 text-primary-700",
      seller: "bg-accent-100 text-accent-700",
    };

    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-md ${
          styles[role] || "bg-gray-100 text-gray-700"
        }`}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <Layout type="admin">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">Manage and monitor platform users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600 mt-1">Total Users</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-100 p-3 rounded-md">
                <ShoppingBag className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.buyers}</p>
            <p className="text-sm text-gray-600 mt-1">Buyers</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-accent-100 p-3 rounded-md">
                <Store className="h-6 w-6 text-accent-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.sellers}</p>
            <p className="text-sm text-gray-600 mt-1">Sellers</p>
          </div>

          <div className="bg-white border-2 border-gray-200 shadow-md p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-md">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.verified}</p>
            <p className="text-sm text-gray-600 mt-1">Verified</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-gray-200 shadow-md p-6 mb-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="buyer">Buyers</option>
                <option value="seller">Sellers</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="bg-white border-2 border-gray-200 shadow-md p-12 text-center rounded-lg">
              <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white border-2 border-gray-200 shadow-md p-6 hover:shadow-lg transition rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 p-3 rounded-md">
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {user.name}
                        </h3>
                        {getRoleBadge(user.role)}
                        {user.verified && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {!user.active && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md">
                            Banned
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{user.phone}</span>
                        </div>
                        {user.address && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">
                              {user.address}
                            </span>
                          </div>
                        )}
                      </div>

                      {user.role === "seller" && user.storeName && (
                        <div className="mt-3 flex items-center space-x-2 text-sm">
                          <Store className="h-4 w-4 text-accent-600" />
                          <span className="font-medium text-accent-700">
                            {user.storeName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {user.role === "seller" &&
                      !user.verified &&
                      user.active && (
                        <button
                          onClick={() => handleVerifyUser(user.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white border-b-4 border-green-800 hover:bg-green-700 transition text-sm rounded-md"
                        >
                          <UserCheck className="h-4 w-4" />
                          <span>Verify</span>
                        </button>
                      )}
                    {user.active && (
                      <button
                        onClick={() => handleBanUser(user.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white border-b-4 border-red-800 hover:bg-red-700 transition text-sm rounded-md"
                      >
                        <UserX className="h-4 w-4" />
                        <span>Ban</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Users;
