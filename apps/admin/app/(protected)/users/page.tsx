'use client';

const users = [
  {
    id: 'admin',
    name: 'Administrator',
    username: 'admin',
    role: 'Super Admin',
    status: 'Đang hoạt động',
  },
];

export default function UsersAdminPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-[#dce5e1] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f766e]">Quản lý bảo mật</p>
          <h2 className="mt-1 text-2xl font-black text-[#123c34]">Quản lý người dùng</h2>
          <p className="mt-1 max-w-2xl text-sm text-[#6b7773]">
            Theo dõi tài khoản quản trị và phân quyền truy cập hệ thống.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e45136] px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#c83f28] active:scale-[0.98]">
          <span className="text-lg leading-none">+</span>
          Thêm người dùng mới
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#dce5e1] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Tổng tài khoản</p>
          <p className="mt-2 text-3xl font-black text-[#123c34]">{users.length}</p>
        </div>
        <div className="rounded-2xl border border-[#dce5e1] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Đang hoạt động</p>
          <p className="mt-2 text-3xl font-black text-[#18a058]">{users.length}</p>
        </div>
        <div className="rounded-2xl border border-[#dce5e1] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Vai trò cao nhất</p>
          <p className="mt-2 text-lg font-black text-[#123c34]">Super Admin</p>
          <p className="mt-1 text-xs text-[#6b7773]">Có toàn quyền quản trị và thiết lập hệ thống.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-[#dce5e1] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#edf2f0] p-4">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng quản trị..."
            className="h-11 w-full max-w-md rounded-xl border border-[#dce5e1] bg-[#fbfdfc] px-3 text-sm font-semibold text-[#18211f] outline-none transition placeholder:text-[#9aa9a4] focus:border-[#0f766e] focus:bg-white"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f0] bg-[#fbfdfc] text-xs font-black uppercase tracking-[0.12em] text-[#7a8b85]">
                <th className="px-5 py-4">Người dùng</th>
                <th className="px-5 py-4">Tên đăng nhập</th>
                <th className="px-5 py-4">Vai trò</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2f0]">
              {users.map((user) => (
                <tr key={user.id} className="transition hover:bg-[#edf4f1]/20">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#123c34] text-xs font-bold text-white shadow-sm">
                        AD
                      </span>
                      <div>
                        <p className="text-sm font-black text-[#123c34]">{user.name}</p>
                        <p className="mt-0.5 text-xs font-semibold text-[#7a8b85]">Tài khoản hệ thống mặc định</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-[#52605b]">{user.username}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full border border-[#b9d8cf] bg-[#edf8f4] px-3 py-1 text-xs font-bold text-[#0f766e]">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b9d8cf] bg-[#edf8f4] px-3 py-1 text-xs font-bold text-[#0f766e]">
                      <span className="h-2 w-2 rounded-full bg-[#18a058] animate-pulse" />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-xl border border-[#dce5e1] bg-white px-3 py-1.5 text-xs font-bold text-[#0f766e] transition hover:bg-[#edf4f1] hover:border-[#0f766e]">
                        Sửa
                      </button>
                      <button className="rounded-xl border border-[#dce5e1] bg-white px-3 py-1.5 text-xs font-bold text-[#52605b] transition hover:bg-[#edf4f1]">
                        Phân quyền
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}