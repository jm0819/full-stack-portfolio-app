import { useEffect, useState } from 'react'

function App() {
  const [users, setUsers] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/users/')
      .then(response => response.json())
      .then(data => setUsers(data))
  }, [])

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('http://127.0.0.1:8000/users/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    })

    if (response.ok) {
      const newUser = await response.json()
      setUsers([...users, newUser])
      setName('')
      setEmail('')
    } else {
      alert("Error adding user! Email might already exist.")
    }
  }

  // NEW: Function to delete a user
  const handleDeleteUser = async (id: int) => {
    const response = await fetch(`http://127.0.0.1:8000/users/${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      // Instantly remove the deleted user from the screen
      setUsers(users.filter(user => user.id !== id))
    } else {
      alert("Error deleting user!")
    }
  }

  return (
    // Upgraded: Soft gradient background for the whole page
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex flex-col items-center py-12 font-sans px-4">
      
      {/* Upgraded: Gradient text for the header */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-10 tracking-tight text-center drop-shadow-sm">
        My Full-Stack App 🚀
      </h1>
      
      {/* Upgraded Form Card */}
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md mb-12 border border-white/50">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 tracking-wide">Add a New User</h3>
        <form onSubmit={handleAddUser} className="flex flex-col gap-5">
          <input 
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            placeholder="Full Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
          <input 
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            placeholder="Email Address" 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <button 
            type="submit" 
            className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Submit User
          </button>
        </form>
      </div>

      {/* Upgraded User List */}
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 px-2">Database Records</h2>
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id} className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 flex justify-between items-center hover:shadow-lg transition-all group">
              
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 text-lg">{user.name}</span> 
                <span className="text-gray-500 text-sm font-medium mt-1">{user.email}</span>
              </div>

              {/* NEW: Styled Delete Button */}
              <button 
                onClick={() => handleDeleteUser(user.id)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-xl transition-colors font-semibold text-sm border border-transparent hover:border-red-100"
              >
                Delete
              </button>
              
            </li>
          ))}
          
          {/* Empty State Message */}
          {users.length === 0 && (
            <p className="text-center text-gray-500 mt-8 font-medium">No users found. Add one above!</p>
          )}
        </ul>
      </div>
    </div>
  )
}

export default App