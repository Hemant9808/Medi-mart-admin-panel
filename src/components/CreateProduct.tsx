import { useForm, SubmitHandler } from "react-hook-form";
import CustomButton from "./CustomButton/CustomButton";
import { useEffect, useRef, useState } from "react";

interface CreateProductProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

interface IFormInput {
  name: string;
  description: string;
  price: number;
  brand: string;
  manufacturer: string;
  stock: number;
  images: string;
  discountPrice?: number;
}

export default function CreateProduct({
  visible,
  setVisible,
}: CreateProductProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://medimart-nayg.onrender.com/product/getAllCategories"
      );
      const data = await response.json();

      const categoriesFromBackend = data.map(
        (category: { _id: string; name: string }) => category.name
      );
      console.log("categoriesFromBackend", categoriesFromBackend);

      setAllCategories(categoriesFromBackend);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    if (newCategory && !allCategories.includes(newCategory)) {
      setAllCategories([...allCategories, newCategory]);
      setSelectedCategories([...selectedCategories, newCategory]);
      console.log("handleAddCategory", selectedCategories);

      setNewCategory("");
    }
  };

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
      console.log("handleCategorySelect", selectedCategories);
    }
  };

  const token = localStorage.getItem("adminToken");
  if (!token) {
    window.location.href = "/";
  }

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const imagesArray = data.images
      .split(",")
      .map((url) => ({ url: url.trim() }));
    const response = await fetch(
      "https://medimart-nayg.onrender.com/product/addProducts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZTE1NzFmZWM4M2VlM2E4OGJjNzI4YSIsImlhdCI6MTcyNjQxMzc1OX0.QH1quEr3Hakn0Ku4h7GSLbAlyrr1tj3QkEeeH9OooC0`,
        },
        body: JSON.stringify({
          ...data,
          images: imagesArray,
          categories: selectedCategories,
        }),
      }
    );

    const result = await response.json();
    if (result.success) {
      setVisible(false);
      reset();
    } else {
      console.error(result.message);
    }
  };
  const popupRef = useRef(null);
  const handleClickOutside = (event: any) => {
    //@ts-ignore
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setVisible(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {visible && (
        <div className=" inset-0 z-50 h-[100%]  fixed flex items-center justify-center bg-black bg-opacity-75">
          <div
            ref={popupRef}
            className="bg-white h-[100vh]  overflow-scroll hide-scrollbar  sm:h-[90%] rounded-lg p-8 shadow-lg max-w-md w-full"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <h2 className="text-xl font-semibold text-center mb-4">
                Create New Product
              </h2>

              <div className="w-full">
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Name
                </label>
                <input
                  id="productName"
                  className="input-field w-full my-2 px-2 py-2 rounded-lg"
                  type="text"
                  placeholder="Enter product name"
                  {...register("name", {
                    required: "Product name is required",
                  })}
                />
                {errors.name && (
                  <span className="text-red-600">{errors.name.message}</span>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  className="input-field w-full my-2 px-2 py-2 rounded-lg"
                  placeholder="Enter product description"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                {errors.description && (
                  <span className="text-red-600">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <input
                  id="price"
                  className="input-field w-full my-2 px-2 py-2 rounded-lg"
                  type="number"
                  placeholder="Enter product price"
                  {...register("price", {
                    required: "Price is required",
                    valueAsNumber: true,
                  })}
                />
                {errors.price && (
                  <span className="text-red-600">{errors.price.message}</span>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-700"
                >
                  Brand
                </label>
                <input
                  id="brand"
                  className="input-field w-full my-2 px-2 py-2 rounded-lg"
                  type="text"
                  placeholder="Enter brand"
                  {...register("brand", { required: "Brand is required" })}
                />
                {errors.brand && (
                  <span className="text-red-600">{errors.brand.message}</span>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="manufacturer"
                  className="block text-sm font-medium text-gray-700"
                >
                  Manufacturer
                </label>
                <input
                  id="manufacturer"
                  className="input-field w-full my-2 px-2 py-2 rounded-lg"
                  type="text"
                  placeholder="Enter manufacturer"
                  {...register("manufacturer", {
                    required: "Manufacturer is required",
                  })}
                />
                {errors.manufacturer && (
                  <span className="text-red-600">
                    {errors.manufacturer.message}
                  </span>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700"
                >
                  Stock
                </label>
                <input
                  id="stock"
                  className="input-field w-full my-2 px-2 py-2 rounded-lg"
                  type="number"
                  placeholder="Enter stock quantity"
                  {...register("stock", {
                    required: "Stock is required",
                    valueAsNumber: true,
                  })}
                />
                {errors.stock && (
                  <span className="text-red-600">{errors.stock.message}</span>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700"
                >
                  Images (URL)
                </label>
                <input
                  id="images"
                  className="input-field w-full my-2 px-2 py-2 rounded-lg"
                  type="text"
                  placeholder="Enter image URLs"
                  {...register("images", { required: "Images are required" })}
                />
                {errors.images && (
                  <span className="text-red-600">{errors.images.message}</span>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="discountPrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Discount Price
                </label>
                <input
                  id="discountPrice"
                  className="input-field w-full my-2 px-2 py-2 rounded-lg"
                  type="number"
                  placeholder="Enter discount price (optional)"
                  {...register("discountPrice", { valueAsNumber: true })}
                />
              </div>

              {/* Category Selection with Checkboxes */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Categories
                </label>
                <div className="my-2">
                  {allCategories.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${index}`}
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategorySelect(category)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`category-${index}`}
                        className="text-gray-700"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Category Input with Add Button */}
              <div className="flex items-center w-full">
                <input
                  id="newCategory"
                  className="input-field border border-blue-500 flex-grow my-2 px-2 py-2 rounded-lg"
                  type="text"
                  placeholder="Type to add new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
                  onClick={handleAddCategory}
                >
                  Add
                </button>
              </div>

              <div className="flex justify-end space-x-4">
                <CustomButton
                  type="button"
                  varient="secondary"
                  onClick={() => setVisible(false)}
                >
                  Cancel
                </CustomButton>
                <CustomButton type="submit" varient="primary">
                  Create
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
