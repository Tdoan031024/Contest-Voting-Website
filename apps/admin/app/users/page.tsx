'use client';

const users = [
  {
    id: 'admin',
    name: 'Administrator',
    username: 'admin',
    role: 'Super Admin',
    status: 'Dang hoat dong',
  },
];

export default function UsersAdminPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border border-[#dce5e1] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f766e]">Quan ly</p>
          <h2 className="mt-1 text-2xl font-black text-[#18211f]">Quan ly nguoi dung</h2>
          <p className="mt-1 max-w-2xl text-sm text-[#6b7773]">
            Theo doi tai khoan quan tri va phan quyen truy cap he thong.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e45136] px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#c83f28]">
          <span className="text-lg leading-none">+</span>
          Them nguoi dung
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[#dce5e1] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Tong tai khoan</p>
          <p className="mt-2 text-3xl font-black text-[#18211f]">{users.length}</p>
        </div>
        <div className="rounded-lg border border-[#dce5e1] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Dang hoat dong</p>
          <p className="mt-2 text-3xl font-black text-[#18211f]">{users.length}</p>
        </div>
        <div className="rounded-lg border border-[#dce5e1] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a8b85]">Vai tro cao nhat</p>
          <p className="mt-2 text-lg font-black text-[#18211f]">Super Admin</p>
          <p className="mt-1 text-sm text-[#6b7773]">Co quyen quan ly toan bo he thong.</p>
        </div>
      </section>

      <section className="rounded-lg border border-[#dce5e1] bg-white shadow-sm">
        <div className="border-b border-[#edf2f0] p-4">
          <input
            type="text"
            placeholder="Tim kiem nguoi dung..."
            className="h-11 w-full max-w-md rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-sm font-semibold text-[#18211f] outline-none transition placeholder:text-[#9aa9a4] focus:border-[#0f766e] focus:bg-white"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f0] bg-[#fbfdfc] text-xs font-black uppercase tracking-[0.12em] text-[#7a8b85]">
                <th className="px-5 py-4">Nguoi dung</th>
                <th className="px-5 py-4">Ten dang nhap</th>
                <th className="px-5 py-4">Vai tro</th>
                <th className="px-5 py-4">Trang thai</th>
                <th className="px-5 py-4 text-right">Thao tac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2f0]">
              {users.map((user) => (
                <tr key={user.id} className="transition hover:bg-[#fbfdfc]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#123c34] text-sm font-black text-white">
                        AD
                      </span>
                      <div>
                        <p className="text-sm font-black text-[#18211f]">{user.name}</p>
                        <p className="mt-1 text-xs font-medium text-[#7a8b85]">Tai khoan quan tri mac dinh</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-[#52605b]">{user.username}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full border border-[#b9d8cf] bg-[#edf8f4] px-3 py-1.5 text-xs font-black text-[#0f766e]">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#b9d8cf] bg-[#edf8f4] px-3 py-1.5 text-xs font-black text-[#0f766e]">
                      <span className="h-2 w-2 rounded-full bg-[#18a058]" />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-lg border border-[#dce5e1] bg-white px-3 py-2 text-sm font-bold text-[#0f766e] transition hover:border-[#0f766e]">
                        Sua
                      </button>
                      <button className="rounded-lg border border-[#dce5e1] bg-white px-3 py-2 text-sm font-bold text-[#52605b] transition hover:border-[#0f766e] hover:text-[#0f766e]">
                        Phan quyen
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
