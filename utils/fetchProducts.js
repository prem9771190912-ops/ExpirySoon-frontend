import api from "../config/axiosConfig";

const fetchProducts = async (setLoading,setProducts,setTotalPages, page=1, sortBy="expiry",category="all") => {

  setLoading(true);
  try {

    const res = await api.get("/product/upcoming", {
      params: { page, sortBy, category },
    });

    setProducts((prev) =>
      page === 1 ? res.data.products : [...prev, ...res.data.products]
    );

    setTotalPages(res.data.totalPages || 1);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  } finally {
    setLoading(false);
  }

};

export default fetchProducts;
