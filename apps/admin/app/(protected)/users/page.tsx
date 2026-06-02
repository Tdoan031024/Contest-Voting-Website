'use client';

import { useEffect, useMemo, useState } from 'react';
import { WebUser } from '@huitfest/shared';
import { apiUrl } from '../../api';

const providerLabel: Record<string, string> = {
  email: 'Đăng ký thường',
  quick: 'Đăng ký nhanh',
  google: 'Google',
};

function formatDate(value?: string) {
  if (!value) return 'Chưa có';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<WebUser[]>([]);
  const [search, setSearch] = useState('');
  const [provider, setProvider] = useState('ALL');

  useEffect(() => {
    async function loadUsers() {
      const res = await fetch(apiUrl('/api/admin/web-users'));
      if (res.ok) setUsers(await res.json());
    }
    loadUsers().catch(() => setUsers([]));
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return users
      .filter((user) => provider === 'ALL' || user.provider === provider)
      .filter((user) =>
        !keyword ||
        user.fullName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        (user.phone || '').includes(keyword) ||
        (user.schoolOrCompany || '').toLowerCase().includes(keyword)
      );
  }, [provider, search, users]);

  const activeCount = users.filter((user) => user.status === 'ACTIVE').length;
  const googleCount = users.filter((user) => user.provider === 'google').length;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f766e]">Quản lý người dùng web</p>
        <h2 className="mt-1 text-xl font-black text-[#123c34]">Người dùng đã đăng ký ở website chính</h2>
        <p className="mt-1 text-xs text-[#6b7773]">Theo dõi tài khoản bình chọn, hình thức đăng ký, thông tin liên hệ và lịch sử đăng nhập gần nhất.</p>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {[
          ['Tổng tài khoản', users.length.toLocaleString()],
          ['Đang hoạt động', activeCount.toLocaleString()],
          ['Đăng nhập Google', googleCount.toLocaleString()],
          ['Kết quả lọc', filteredUsers.length.toLocaleString()],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#dce5e1] bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a8b85]">{label}</p>
            <p className="mt-1 text-2xl font-black text-[#123c34]">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-[#dce5e1] bg-white shadow-sm">
        <div className="grid gap-3 border-b border-[#edf2f0] p-4 md:grid-cols-[1fr_220px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo họ tên, email, số điện thoại hoặc đơn vị..."
            className="h-10 rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-semibold text-[#18211f] outline-none focus:border-[#0f766e] focus:bg-white"
          />
          <select value={provider} onChange={(event) => setProvider(event.target.value)} className="h-10 rounded-lg border border-[#dce5e1] bg-[#fbfdfc] px-3 text-xs font-bold text-[#52605b] outline-none focus:border-[#0f766e]">
            <option value="ALL">Tất cả hình thức</option>
            <option value="email">Đăng ký thường</option>
            <option value="quick">Đăng ký nhanh</option>
            <option value="google">Google</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf2f0] bg-[#fbfdfc] text-[10px] font-black uppercase tracking-[0.12em] text-[#7a8b85]">
                <th className="px-5 py-3">Người dùng</th>
                <th className="px-5 py-3">Liên hệ</th>
                <th className="px-5 py-3">Đơn vị / bảng quan tâm</th>
                <th className="px-5 py-3">Hình thức</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3">Ngày đăng ký</th>
                <th className="px-5 py-3">Đăng nhập gần nhất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2f0] text-xs">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#edf4f1]/25">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#123c34] text-xs font-black text-white">
                        {user.fullName.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-black text-[#123c34]">{user.fullName}</p>
                        <p className="mt-0.5 text-[11px] text-[#7a8b85]">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-bold text-[#123c34]">{user.email}</p>
                    <p className="mt-1 text-[11px] text-[#6b7773]">{user.phone || 'Chưa cập nhật SĐT'}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-bold text-[#52605b]">{user.schoolOrCompany || 'Chưa cập nhật'}</p>
                    <p className="mt-1 text-[11px] text-[#6b7773]">{user.contestTable || 'Chưa chọn bảng thi'}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full border border-[#b9d8cf] bg-[#edf8f4] px-3 py-1 text-[11px] font-bold text-[#0f766e]">
                      {providerLabel[user.provider] || user.provider}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${user.status === 'ACTIVE' ? 'border-[#b9d8cf] bg-[#edf8f4] text-[#0f766e]' : 'border-[#f0c9bd] bg-[#fff5f2] text-[#c83f28]'}`}>
                      {user.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-[#52605b]">{formatDate(user.registeredAt)}</td>
                  <td className="px-5 py-3 font-semibold text-[#52605b]">{formatDate(user.lastLoginAt)}</td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm font-semibold text-[#7a8b85]">
                    Chưa có người dùng web phù hợp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
