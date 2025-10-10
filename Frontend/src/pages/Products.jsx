import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import useAuthStore from '../store/authStore';
import { productsAPI, categoriesAPI } from '../lib/api';
import toast from 'react-hot-toast';
import '../../src/styles/pages/Products.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  // Form state
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || ''); 

  // Auth state
  const { isAuthenticated } = useAuthStore();

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await categoriesAPI.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Failed to load categories');
      }
    };
    
    loadCategories();
  }, []);

  // Fetch products when search params change
  const fetchProducts = useCallback(async () => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    try {
      setLoading(true);
      const { data } = await productsAPI.getAll({
        search,
        category,
        page,
        limit: 8
      });
      
      setProducts(data.products || data);
      setPagination(data.pagination || {
        currentPage: page,
        totalPages: 1,
        totalItems: (data.products || data).length,
        hasNextPage: false,
        hasPrevPage: false
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

useEffect(() => {
    fetchProducts();
}, [fetchProducts]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    }
    
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    
    // Reset to first page on new search
    params.set('page', '1');
    
    setSearchParams(params);
  };
  
  // Handle category filter change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const params = new URLSearchParams(searchParams);
    
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    
    // Reset to first page when changing categories
    params.set('page', '1');
    setSearchParams(params);
  };
  
  // Handle pagination
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Update local state when URL params change
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    
    setSearchInput(search);
    setSelectedCategory(category);
  }, [searchParams]);
  
  // Fetch products when component mounts or search params change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="products">
      <div className="products__container">
        <header className="products__header">
          <h1 className="products__title">Our Products</h1>
          
          <form onSubmit={handleSearch} className="products__filters">
            <div className="products__search">
              <div className="products__search-input-wrapper">
                <Search className="products__search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="products__search-input"
                  aria-label="Search products"
                />
              </div>
              <button 
                type="submit" 
                className="products__search-button"
                disabled={loading}
              >
                Search
              </button>
            </div>
            
            <div className="products__category-select-wrapper">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="products__category-select"
                aria-label="Filter by category"
                disabled={loading}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </header>

        <div className="products__grid">
          {loading ? (
            <div className="products__loading">
              <div className="products__loading-spinner" aria-hidden="true"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="products__empty">
              <p>No products found. Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  ...product,
                  // Ensure the product has all required props for the ProductCard
                  image: product.images && product.images[0],
                  category: product.category || 'Uncategorized',
                  price: product.price || 0,
                  mrp: product.mrp || product.price || 0,
                  inStock: product.inStock !== undefined ? product.inStock : true,
                  rating: product.rating || 0,
                  reviewCount: product.reviewCount || 0
                }}
                isAuthenticated={isAuthenticated}
              />
            ))
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="products__pagination">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage || loading}
              className="products__pagination-button"
              aria-label="Previous page"
            >
              &larr; Previous
            </button>

            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              // Show limited page numbers with ellipsis
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.currentPage <= 3) {
                pageNum = i + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`products__pagination-button ${
                    pagination.currentPage === pageNum ? 'products__pagination-button--active' : ''
                  }`}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={pagination.currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}

            {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
              <span className="products__pagination-ellipsis">...</span>
            )}

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage || loading}
              className="products__pagination-button"
              aria-label="Next page"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}