import { useState } from 'react'
import { furnitureCatalog, categories, categorySuggestions } from '../../../data/furnitureCatalog'
import useDesignerStore from '../../../store/useDesignerStore'
import { Search, X } from 'lucide-react'

function ItemButton({ item, onAdd }) {
  return (
    <button
      onClick={() => onAdd(item.id, item)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-amber-50 hover:border-amber-200 border border-transparent transition-all group"
    >
      <span className="text-xl shrink-0">{item.icon}</span>
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">{item.name}</div>
        <div className="text-xs text-gray-400 truncate">{item.description}</div>
      </div>
      <span className="ml-auto text-gray-300 group-hover:text-amber-400 text-lg shrink-0">+</span>
    </button>
  )
}

export default function CatalogSidebar() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const addObject = useDesignerStore((s) => s.addObject)

  const query = search.trim().toLowerCase()
  const isSearching = query.length > 0

  const filtered = isSearching
    ? furnitureCatalog.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      )
    : activeCategory === 'all'
      ? furnitureCatalog
      : furnitureCatalog.filter((item) => item.category === activeCategory)

  // Suggested items: items from other categories recommended for this room type
  const suggestionIds = !isSearching ? categorySuggestions[activeCategory] : null
  const suggested = suggestionIds
    ? furnitureCatalog.filter(
        (item) => suggestionIds.includes(item.id) && item.category !== activeCategory
      )
    : []

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200" style={{ width: 240 }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Furniture</h2>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search furniture..."
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-md border border-gray-200 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div className="px-3 py-2 border-b border-gray-100 flex flex-wrap gap-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {filtered.length > 0 && (
          <div className="space-y-1">
            {filtered.map((item) => (
              <ItemButton key={item.id} item={item} onAdd={addObject} />
            ))}
          </div>
        )}

        {suggested.length > 0 && (
          <>
            <div className="px-3 pt-4 pb-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Suggested</div>
            </div>
            <div className="space-y-1">
              {suggested.map((item) => (
                <ItemButton key={item.id} item={item} onAdd={addObject} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
