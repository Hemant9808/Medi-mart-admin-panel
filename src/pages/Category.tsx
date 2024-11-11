import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import CustomCard from "../components/CustomCard";
// import AddCategory from "../components/AddCategory";
import CreateProduct from "../components/CreateProduct";
import { Dialog } from "@mui/material";
import { refresh } from "aos";
import axios from "axios";
import { AddCategoryDialog } from "../components/AddCategoryDialog";

interface Category {
  _id: string;
  imageUrl: [string];
  name: string;
}

export default function Category() {
  //   const token = localStorage.getItem("adminToken");
  // if (!token)
  //     window.location.href = '/';
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [data, setData] = useState<Category[] | undefined>();
  //   const [createCategory, setCreateCategory] = useState(false);
  const [filteredCategory, setFilteredCategory] = useState<
    Category[] | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");
  const isSmallScreen = useMediaQuery({ query: "(max-width: 700px)" });

  async function getData() {
    try {
      const response = await fetch(
        "https://medimart-nayg.onrender.com/product/getAllCategories"
      ); // Adjust your API URL accordingly
      const data = await response.json();

      // Assuming the response is an array of objects with _id and name
      //const categoriesFromBackend = data?.map((category: { _id: string; name: string }) => category.name);
      console.log("data", data);

      console.log("categoriesFromBackend", data);

      setData(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  //Get data on page load
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }
    const filtered = data.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategory(filtered);
    console.log(filteredCategory);
  }, [data, searchQuery]);
  const handleBack = () => {
    setModalVisible(false);
  };
  // const addcategory =()=>{
  //     const response = axios.post("http://localhost:4000/category/addOrUpdateCategory",{name:categoryName});
  //     console.log("addcategory respnse ", response)
  // }

  return (
    <div className="md:min-h-screen">
      {/* Header  */}
      <div
        className={`${
          isSmallScreen ? "justify-center flex-wrap" : "justify-between "
        } mt-8 flex items-center max-w-[1250px] mx-auto `}
      >
        <div className=" mb-4 text-3xl font-semibold">Product Categories</div>
        {/* <button
                  onClick={() => {
                  setModalVisible(true);
                    // setProductId("");
                  }}
                  className="flex justify-center items-center px-5 py-3 mx-2 my-3 card2 "
                >
                  Add Category
                </button> */}
        <AddCategoryDialog />
        <div
          className={`${
            isSmallScreen ? "flex-wrap justify-center" : "justify-between"
          } flex items-center`}
        >
          <input
            type="text"
            placeholder="Search"
            className=" px-4 py-2 mr-4  w-[350px] border-2 rounded-[2rem]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* <button
            onClick={() => {
              setModalVisible(true);
            }}
            className="flex justify-center items-center px-5 py-3 mx-2 my-3 card2 "
          >
            Add Product
          </button> */}
        </div>
      </div>

      {/* Categories  */}
      <div
        className={`${
          isSmallScreen ? "justify-center" : ""
        } flex flex-wrap mt-20 mx-auto max-w-[1250px]`}
      >
        {data &&
          filteredCategory &&
          filteredCategory?.length > 0 &&
          filteredCategory?.map((item: any, index: number) => {
            return (
              <CustomCard
                key={index}
                refresh={getData}
                name={item.name}
                link={item.name}
                id={item._id}
              />
            );
          })}
      </div>

      {
        <Dialog
          className=" rounded-[50px]"
          open={modalVisible}
          onClose={handleBack}
        >
          <p>category name</p>
          <input
            onChange={(e) => {
              setCategoryName(e.target.value);
              console.log("category", categoryName);
            }}
            type="text"
          />
          <button
            onClick={() => {
              // addcategory();
              //setModalVisible(true);
              // setProductId("");
            }}
            className="flex justify-center items-center px-5 py-3 mx-2 my-3 card2 "
          >
            Add
          </button>
        </Dialog>

        // createCategory && <AddCategory token={token} setVisible={setCreateCategory} refresh={getData} />
      }
    </div>
  );
}
