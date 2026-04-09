import { useState, useEffect } from 'react'
import API from '../services/api'

function ProductSearch() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const categories = [
    'All', 'Electronics', 'Footwear',
    'Clothing', 'Books', 'Accessories'
  ]

  const fetchProducts = async (searchQuery = '', searchCategory = '') => {
    setLoading(true)
    setSearched(true)
    try {
      const params = {}
      if (searchQuery) params.q = searchQuery
      if (searchCategory && searchCategory !== 'All')
        params.category = searchCategory

      const response = await API.get('/products/search/', { params })
      setProducts(response.data.results)
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load all products on page load
  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts(query, category)
  }

  const handleCategoryClick = (cat) => {
    setCategory(cat)
    fetchProducts(query, cat)
  }

  return (
    <div className="container py-5">
      <h3 className="text-center mb-4">🔍 Product Search</h3>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              🔍 Search
            </button>
          </div>
        </div>
      </form>

      {/* Category Filter Buttons */}
      <div className="d-flex justify-content-center gap-2 flex-wrap mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`btn btn-sm ${
              category === cat
                ? 'btn-primary'
                : 'btn-outline-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      {searched && !loading && (
        <p className="text-center text-muted mb-3">
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2 text-muted">Searching products...</p>
        </div>
      )}

      {/* Product Cards */}
      {!loading && (
        <div className="row g-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="col-md-4 col-sm-6">
                <div className="card h-100 shadow-sm border-0">

                  {/* Product Image */}
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="card-img-top bg-light d-flex align-items-center justify-content-center"
                      style={{ height: '200px', fontSize: '3rem' }}
                    >
                      📦
                    </div>
                  )}

                  <div className="card-body">
                    <span className="badge bg-secondary mb-2">
                      {product.category}
                    </span>
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-muted" style={{ fontSize: '14px' }}>
                      {product.description}
                    </p>
                  </div>

                  <div className="card-footer d-flex justify-content-between align-items-center bg-white border-0 pb-3">
                    <span className="fw-bold text-primary fs-5">
                      ${product.price}
                    </span>
                    <span className={`badge ${product.in_stock ? 'bg-success' : 'bg-danger'}`}>
                      {product.in_stock ? '✅ In Stock' : '❌ Out of Stock'}
                    </span>
                  </div>

                </div>
              </div>
            ))
          ) : (
            searched && (
              <div className="text-center mt-4">
                <p className="text-muted fs-5">
                  😕 No products found. Try a different search!
                </p>
              </div>
            )
          )}
        </div>
      )}

    </div>
  )
}

export default ProductSearch