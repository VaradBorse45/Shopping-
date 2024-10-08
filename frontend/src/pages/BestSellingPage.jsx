import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch("http://localhost:8000/allitems");
        const reviewResponse = await fetch("http://localhost:8000/allreviews");

        if (!productResponse.ok || !reviewResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const productData = await productResponse.json();
        const reviewData = await reviewResponse.json();

        setProducts(productData);
        setReviews(reviewData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProductsWithRating = products.filter((product) => {
    // Check if any review matches the product ID with a rating of 5
    return reviews.some((review) => {
      return review.productId === product._id && review.rating === 5;
    });
  });

  const pageCount = Math.ceil(filteredProductsWithRating.length / pageSize);
  const paginatedProducts = filteredProductsWithRating.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize
  );

  const handlePageChange = (page) => {
    setPageNumber(page);
  };

  return (
    <>
      <Header activeHeading={2} />
      <div className="container mx-auto px-4 py-8">
        {/* Product Grid */}
        {isLoading ? (
          <Loader />
        ) : filteredProductsWithRating.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product, index) => (
                <Link
                  key={index}
                  to={`/product/${product._id}`}
                  className="hover:no-underline"
                >
                  <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-300">
                    <img
                      src={product.images}
                      alt={product.name}
                      className="h-40 w-full object-cover rounded mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-700">
                        Category: {product.category}
                      </p>
                      <p className="text-green-600 font-bold">
                        ${product.discountPrice}
                      </p>
                    </div>
                    <p className="text-gray-700">Stock: {product.stock}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`mx-2 px-4 py-2 rounded ${
                      page === pageNumber
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </>
        ) : (
          <h1 className="text-center text-2xl text-gray-800 mt-8">
            No products found!
          </h1>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductsPage;
