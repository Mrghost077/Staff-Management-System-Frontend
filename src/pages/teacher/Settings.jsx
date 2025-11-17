const Settings = () => {
  return (
    <main className="flex-1 p-10 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600">Update your profile and notification preferences.</p>
      </header>

      <section className="bg-white rounded-2xl shadow p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          <p className="text-sm text-gray-500">Basic information about your account.</p>
        </div>
        <form className="grid gap-4 md:grid-cols-2">
          <input type="text" placeholder="Full Name" className="border rounded-xl px-4 py-2" />
          <input type="email" placeholder="Email" className="border rounded-xl px-4 py-2" />
          <input type="text" placeholder="Phone" className="border rounded-xl px-4 py-2" />
          <select className="border rounded-xl px-4 py-2">
            <option value="">Notification preference</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
          <button type="button" className="bg-black text-white rounded-xl px-4 py-2 md:col-span-2">
            Save Changes
          </button>
        </form>
      </section>
    </main>
  )
}

export default Settings


