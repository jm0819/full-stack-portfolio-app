import { useEffect, useState } from 'react'

// We define this once so the whole app knows where to talk to the backend
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'

function App() {
  // Database State
  const [items, setItems] = useState<any[]>([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')

  // Order Calculator State
  const [cart, setCart] = useState<any[]>([])

  // 1. Fetch menu items from the database
  useEffect(() => {
    // FIXED: Added fetch() and pointed it to the /items/ route
    fetch(`${API_URL}/items/`) 
      .then(response => response.json())
      .then(data => setItems(data))
  }, [])

  // 2. Add a new item to the database
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    // FIXED: Updated to use the dynamic API_URL
    const response = await fetch(`${API_URL}/items/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, price: parseFloat(price) })
    })

    if (response.ok) {
      const newItem = await response.json()
      setItems([...items, newItem])
      setName('')
      setCategory('')
      setPrice('')
    } else {
      alert("Error adding item!")
    }
  }

  // 3. Delete an item from the database
  const handleDeleteItem = async (id: number) => {
    // FIXED: Updated to use the dynamic API_URL
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setItems(items.filter(item => item.id !== id))
      // Remove it from the current order if it gets deleted from the menu
      setCart(cart.filter(cartItem => cartItem.id !== id)) 
    }
  }

  // 4. Calculator functions
  const addToOrder = (item: any) => {
    setCart([...cart, item])
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-8">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-8 text-center tracking-tight">
        Digital Menu & Order System 🍔
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Database Management */}
        <div className="space-y-8">
          
          {/* Add Item Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-700 mb-4">Add Menu Item</h2>
            <form onSubmit={handleAddItem} className="flex flex-col gap-4">
              <input 
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Item Name (e.g. Cheeseburger)" 
                value={name} onChange={e => setName(e.target.value)} required 
              />
              <input 
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Category (e.g. Main Course)" 
                value={category} onChange={e => setCategory(e.target.value)} required 
              />
              <input 
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Price (e.g. 8.99)" 
                type="number" step="0.01"
                value={price} onChange={e => setPrice(e.target.value)} required 
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors">
                Save to Database
              </button>
            </form>
          </div>

          {/* Menu List */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-700 mb-4">Current Menu</h2>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all">
                  <div>
                    <span className="font-bold text-slate-800 block">{item.name}</span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-green-600">${item.price.toFixed(2)}</span>
                    <button onClick={() => addToOrder(item)} className="bg-slate-800 hover:bg-slate-900 text-white text-sm px-3 py-1 rounded-md transition-colors">
                      Add
                    </button>
                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-400 hover:text-red-600 text-sm font-semibold transition-colors">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {items.length === 0 && <p className="text-slate-500 italic text-center">Menu is empty.</p>}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Calculator */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Live Order</h2>
          
          <ul className="space-y-3 mb-6 min-h-[150px]">
            {cart.map((cartItem, index) => (
              <li key={index} className="flex justify-between items-center text-slate-700">
                <span>{cartItem.name}</span>
                <span className="font-medium">${cartItem.price.toFixed(2)}</span>
              </li>
            ))}
            {cart.length === 0 && <p className="text-slate-400 italic text-center mt-8">No items added to order yet.</p>}
          </ul>

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-slate-800">Total</span>
            <span className="text-3xl font-black text-green-600">${calculateTotal()}</span>
          </div>
          
          <button 
            onClick={() => setCart([])} 
            className="w-full mt-6 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-colors border border-red-200"
          >
            Clear Order
          </button>
        </div>

      </div>
    </div>
  )
}

export default App