
import { useForm, SubmitHandler } from "react-hook-form";
import CustomButton from "./CustomButton/CustomButton";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Box, Button, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
// import { UploadRounded } from "@mui/icons-material";

interface CreateProductProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  productId: string;
  refresh: any;
  categoryId?: string;
}

interface IFormInput {
  _id?: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  manufacturer: string;
  stock: number;
  images: string;
  discountPrice?: number;
  category: [string];
}

export default function CreateProduct({
  setVisible,
  productId,
  refresh,
}: CreateProductProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<{ url: string }[]>([]);
  const { categoryId } = useParams();

  const fetchSubcategories = async () => {
    try {
      const response = await fetch(
        `https://medimart-nayg.onrender.com/category/fetchSubcategories/${categoryId}`
      );
      const data = await response.json();
      const categoriesFromBackend = data.map(
        (category: { _id: string; name: string }) => category.name
      );
      setAllCategories(categoriesFromBackend);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProductById = async () => {
    const response = await fetch(
      `https://medimart-nayg.onrender.com/product/getProductById/${productId}`,
      { method: "Get" }
    );
    const data = await response.json();
    if (data) {
      reset({
        _id: data._id,
        name: data.name,
        description: data.description,
        price: data.price,
        brand: data.brand,
        manufacturer: data.manufacturer,
        stock: data.stock,
        images: data.images.join(","), // Convert images array back to comma-separated string
        discountPrice: data.discountPrice,
      });
      setSelectedCategories(data.subcategories);
    }
  };

  useEffect(() => {
    fetchSubcategories();
    if (productId) fetchProductById();

    return () => {
      reset();
      setSelectedCategories([]);
      setNewCategory("");
    };
  }, []);

  const handleAddCategory = () => {
    if (newCategory && !allCategories.includes(newCategory)) {
      setAllCategories([...allCategories, newCategory]);
      setSelectedCategories([...selectedCategories, newCategory]);
    }
  };

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat: any) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const imagesArray = uploadedImage;
    const response = await fetch(
      // "https://medimart-nayg.onrender.com/product/addProducts",
      "http://localhost:4000/product/addProducts",

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZTE1NzFmZWM4M2VlM2E4OGJjNzI4YSIsImlhdCI6MTcyNjQxMzc1OX0.QH1quEr3Hakn0Ku4h7GSLbAlyrr1tj3QkEeeH9OooC0`,
        },
        body: JSON.stringify({
          ...data,
          images: imagesArray,
          category: [categoryId],
          subcategories: selectedCategories,
        }),
      }
    );

    const result = await response.json();
    if (result.success) {
      setVisible(false);
      reset();
      refresh();
    } else {
      console.error(result.message);
    }
  };

  const [uploading, setUploading] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploading(true);
      fileupload(acceptedFiles[0]);
    },
  });

  const fileupload = async (file: any) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        "https://medimart-nayg.onrender.com/product/upload-image",
        //  "http://localhost:4000/product/upload-image",
  
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("image upload response", response);
      setUploading(false);
      setUploadedImage((prevImages) => [...prevImages, { url: response.data.coverImage }]);
    } catch (error:any) {
      setUploading(false);
      console.log(error.message);     
    }
   
  };
  console.log("uploadedImage,", uploadedImage);

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 z-50 h-screen max-h-screen flex items-center justify-center bg-black bg-opacity-75">
        <div className="bg-white h-[90%] w-[80%] overflow-y-auto rounded-lg p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center mb-6">
              {productId ? "Update Product" : "Create New Product"}
            </h2>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Image Upload */}
                <Box
                  {...getRootProps()}
                  sx={{
                    border: "2px dashed #cccccc",
                    borderRadius: "4px",
                    padding: "20px",
                    textAlign: "center",
                    backgroundColor: "#f9f9f9",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <input {...getInputProps()} />
                  <CloudUploadIcon sx={{ fontSize: 40, color: "#1976d2" }} />
                  <Typography variant="body1" sx={{ color: "#000000" }}>
                    Drag and drop images here, or click to select files
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </Button>
                </Box>
                {uploadedImage.length > 0 ? (
                  <div className="flex gap-3">
                    {uploadedImage.map((imageUrl) => (
                      <img className="max-h-[3rem]" src={imageUrl.url} alt="" />
                    ))}
                  </div>
                ) : (
                  <></>
                )}

                {/* Images URLs */}
                {/* <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Images (URLs)
                  </label>
                  <input
                    className="input-field w-full my-2 px-3 py-2 rounded-lg border border-gray-300"
                    type="text"
                    placeholder="Enter image URLs separated by commas"
                    {...register("images", { required: "Images are required" })}
                  />
                  {errors.images && (
                    <span className="text-red-600">{errors.images.message}</span>
                  )}
                </div> */}

                {/* Description */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    className="input-field w-full my-2 px-3 py-2 rounded-lg border border-gray-300 h-40"
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

                {/* Subcategories Selection */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Subcategories
                  </label>
                  <div className="my-2 max-h-40 overflow-y-auto border border-gray-300 p-2 rounded-lg">
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
                  {/* Add New Category */}
                  <div className="flex items-center mt-2">
                    <input
                      className="input-field border border-gray-300 flex-grow my-2 px-3 py-2 rounded-lg"
                      type="text"
                      placeholder="Add new subcategory"
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
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Product Name */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    className="input-field w-full my-2 px-3 py-2 rounded-lg border border-gray-300"
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

                {/* Price */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    className="input-field w-full my-2 px-3 py-2 rounded-lg border border-gray-300"
                    type="number"
                    placeholder="Enter price"
                    {...register("price", { required: "Price is required" })}
                  />
                  {errors.price && (
                    <span className="text-red-600">{errors.price.message}</span>
                  )}
                </div>

                {/* Discount Price */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Price
                  </label>
                  <input
                    className="input-field w-full my-2 px-3 py-2 rounded-lg border border-gray-300"
                    type="number"
                    placeholder="Enter discount price"
                    {...register("discountPrice")}
                  />
                </div>

                {/* Brand */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    className="input-field w-full my-2 px-3 py-2 rounded-lg border border-gray-300"
                    type="text"
                    placeholder="Enter brand"
                    {...register("brand", { required: "Brand is required" })}
                  />
                  {errors.brand && (
                    <span className="text-red-600">{errors.brand.message}</span>
                  )}
                </div>

                {/* Manufacturer */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Manufacturer
                  </label>
                  <input
                    className="input-field w-full my-2 px-3 py-2 rounded-lg border border-gray-300"
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

                {/* Stock */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    className="input-field w-full my-2 px-3 py-2 rounded-lg border border-gray-300"
                    type="number"
                    placeholder="Enter stock quantity"
                    {...register("stock", { required: "Stock is required" })}
                  />
                  {errors.stock && (
                    <span className="text-red-600">{errors.stock.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <CustomButton
                type="button"
                varient="secondary"
                onClick={() => setVisible(false)}
              >
                Cancel
              </CustomButton>
              <CustomButton type="submit" varient="primary">
                {productId ? "Update Product" : "Create Product"}
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
