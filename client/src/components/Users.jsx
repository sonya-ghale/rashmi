import React from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Users = () => {
  const { users } = useSelector((state) => state.user);

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl font-semibold">
            Registered Users
          </h2>
        </header>

        <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">No. of Books Borrowed</th>
                <th className="px-4 py-2 text-left">Registered on</th>
              </tr>
            </thead>

            <tbody>
              {users && users.length > 0 ? (
                users
                  .filter((u) => u.role === "user") // ✅ fixed filter
                  .map((user, index) => (
                    <tr
                      key={user._id}
                      className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">
                        {user.borrowedBooks?.length || 0}
                      </td>
                      <td className="px-4 py-2">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default Users;
