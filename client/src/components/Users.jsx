import { useSelector } from "react-redux";
import Header from "../layout/Header";
import { Helmet } from "react-helmet-async";

const Users = () => {
  const { users } = useSelector((state) => state.user);
  const { borrowedBooks } = useSelector((state) => state.borrow);

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
      <Helmet>
        <title>Users</title>
        <meta name="description" content="Users" />
      </Helmet>
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium font-semibold md:text-2xl">
            Registered Users
          </h2>
        </header>

        {/* Enhanced Table */}
        <div className="mt-6 overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                    Books Borrowed
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                    Registered On
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {users && users.length > 0 ? (
                  users
                    .filter((u) => u.role === "user") // ✅ fixed filter
                    .map((user, index) => (
                      <tr
                        key={user._id}
                        className="transition-colors duration-150 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                              {borrowedBooks?.filter((b) => b.user?.id === user._id)
                                .length || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            <div className="font-medium">
                              {formatDate(user.createdAt)?.split(' ')[0]}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDate(user.createdAt)?.split(' ')[1]}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gray-100 rounded-full">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-600">No users found</p>
                        <p className="text-sm text-gray-400">Users will appear here once they register</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default Users;