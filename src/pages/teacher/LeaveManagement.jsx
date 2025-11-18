const leaveRequests = [
  { id: 1, type: 'Casual Leave', dates: 'Jan 25 - Jan 26', status: 'Pending' },
  { id: 2, type: 'Medical Leave', dates: 'Feb 05', status: 'Approved' }
]

const LeaveManagement = () => {
  return (
    <main className="flex-1 p-10 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-gray-900">Leave Management</h1>
        <p className="text-gray-600">Manage your personal leave requests and history.</p>
      </header>

      <section className="bg-white rounded-2xl shadow p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Request Leave</h2>
          <p className="text-sm text-gray-500">Submit new leave applications for approval.</p>
        </div>
        <form className="grid gap-4 md:grid-cols-2">
          <input type="text" placeholder="Leave Type" className="border rounded-xl px-4 py-2" />
          <input type="date" className="border rounded-xl px-4 py-2" />
          <textarea placeholder="Reason" className="border rounded-xl px-4 py-2 md:col-span-2" rows={3} />
          <button type="button" className="bg-black text-white rounded-xl px-4 py-2 md:col-span-2">
            Submit Request
          </button>
        </form>
      </section>

      <section className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Requests</h2>
        <div className="space-y-4">
          {leaveRequests.map((request) => (
            <article key={request.id} className="border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{request.type}</p>
                <p className="text-sm text-gray-500">{request.dates}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  request.status === 'Approved'
                    ? 'bg-green-100 text-green-700'
                    : request.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                }`}
              >
                {request.status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default LeaveManagement


