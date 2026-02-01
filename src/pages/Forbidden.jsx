import React from "react";
import { Link } from "react-router-dom";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <p className="mt-4 text-gray-700">
        Bạn không có quyền truy cập trang này
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-md"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default Forbidden;
