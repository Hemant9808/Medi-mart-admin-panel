import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateProduct from "../../components/CreateProduct";
import EditProduct from "../../components/EditProduct";
import { useMediaQuery } from "react-responsive";
import { Dialog } from "@mui/material";
import Popup from "../../components/CustomModal";
import { toast } from "react-toastify";
import { Toaster } from "react-hot-toast";

interface Product {
  name: string;
  imageUrl: string;
  url: string;
  _id: string;
}

interface Category {
  _id: string;
  name: string;
  imageUrl: string;
  products: Product[];
  __v: number;
}

export default function AdminProduct(): JSX.Element {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 700px)" });

  const [data, setData] = useState<any>();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const { categoryId } = useParams();
  console.log("admin product", categoryId);

  // const token = localStorage.getItem("adminToken");
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<string>();

  function refresh() {
    fetch(
      `https://medimart-nayg.onrender.com/product/getProductByCategories?category=${categoryId}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data: Category) => {
        setData(data);
        console.log("data", data);
      });
  }

  async function updateCategory() {
    console.log("Updating category");
    if (!data) return;
    data.name = name;
    data.imageUrl = imageUrl;
    let response = await fetch(
      "https://node-js-jwt-auth.onrender.com/api/category/update",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      }
    );
    response = await response.json();
    setEdit(false);
    refresh();
    console.log(response);
  }

  useEffect(() => {
    if (data) {
      const filtered = data?.filter((product: any) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      console.log("filtered", filtered);

      setFilteredProducts(filtered);
    }
  }, [data, query]);

  useEffect(() => {
    fetch(
      // `http://localhost:4000/product/getProductByCategories?category=${categoryId}`,

      `https://medimart-nayg.onrender.com/product/getProductByCategories?category=${categoryId}`,
      {
        method: "GET",

        body: JSON.stringify(data),
      }
    )
      .then((res) => res.json())
      .then((data: Category) => {
        console.log("data inside ", data);

        setData(data);
        setName(data.name);
        setImageUrl(data.imageUrl);
      });
  }, []);
  const handleBack = () => {
    setModalVisible(false);
  };
  const notify = () => {toast("Wow so easy!");console.log("toast...");
  }
  notify();
  return (
    <>
     
      <div className="w-4/5 mx-auto mb-20 min-h-screen">
        <div>&nbsp;</div>
        <div
          className={`${
            isSmallScreen ? "justify-center flex-wrap" : "justify-between "
          } mt-8 flex items-center max-w-[1250px] mx-auto `}
        >
          <div className="font-medium text-3xl text-center ">
            <div className="font-semibold text-3xl my-2 mr-5 px-6 py-5">
              {data && data.name}
            </div>
          </div>
          <div className="flex">
            {edit ? (
              <>
                <button
                  type="button"
                  onClick={updateCategory}
                  className="flex justify-center items-center px-10 rounded-full mx-2 min-w-[200px] my-3 h-[60px]  bg-black text-white hover:bg-slate-900 "
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEdit(false);
                  }}
                  className="flex justify-center items-center px-5 py-3 mx-2 my-3 card2 "
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setModalVisible(true);
                    setProductId("");
                  }}
                  className="flex justify-center items-center px-5 py-3 mx-2 my-3 card2 "
                >
                  Add Product
                </button>
              </>
            )}
          </div>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="mb-20 mt-16">
          <div className="flex justify-center min-h-[600px]">
            <div className="w-[1000px] bg-gray-200 py-4 rounded-lg">
              <div className="w-full flex justify-center mb-3">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-[95%] border-none  py-2 px-4 rounded-lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              {filteredProducts.length === 0 && (
                <div className="mx-auto text-center font-medium mt-10 ">
                  No Products found
                </div>
              )}
              {filteredProducts.map((item: Product, index: number) => (
                <List
                  setProductId={setProductId}
                  item={item}
                  index={index + 1}
                  key={index}
                  refresh={refresh}
                  setModalVisible={setModalVisible}
                  productId={productId || ""}
                />
              ))}
            </div>
          </div>
          <Dialog
            className=" rounded-[50px]"
            open={modalVisible}
            onClose={handleBack}
          >
            <CreateProduct
              refresh={refresh}
              //@ts-ignore
              productId={productId}
              visible={modalVisible}
              setVisible={setModalVisible}
            />
          </Dialog>
        </div>
      </div>
    </>
  );
}

interface ListProps {
  item: Product;
  refresh: () => void;
  index: number;
  setProductId: any;
  setModalVisible: any;
  productId?: string;
}

function List({
  item,
  refresh,
  index,
  setProductId,
  setModalVisible,
  productId,
}: ListProps) {
  const [productEdit, setProductEdit] = useState(false);
  const [name, setName] = useState(item.name);

  useEffect(() => {
    setName(item.name);
  }, [item]);

  // const token = localStorage.getItem("adminToken");

  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [popupText, setPopupText] = useState<string>("");

  console.log(productId);

  const onContinue = async () => {
    console.log("continue clicked...");

    await fetch(
      `https://medimart-nayg.onrender.com/product/deleteProduct/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZTE1NzFmZWM4M2VlM2E4OGJjNzI4YSIsImlhdCI6MTcyNjQxMzc1OX0.QH1quEr3Hakn0Ku4h7GSLbAlyrr1tj3QkEeeH9OooC0`,
        },
      }
    );

    setOpenPopup(false);
    refresh();
  };

  return (
    <>
      <EditProduct
        refresh={refresh}
        visible={false}
        setVisible={setProductEdit}
        product={item}
      />
      <Popup
        //@ts-ignore
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        onContinue={onContinue}
        heading={popupText}
      />

      <div
        className={`w-full min-h-[55px] ${
          index % 2 === 0 ? "bg-gray-100" : "bg-white"
        } flex items-center justify-between  p-7`}
      >
        <div className=" flex md:gap-14 gap-10">
          <h4>{index}</h4>
          <div className="">
            {productEdit ? (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className=" min-w-32 px-4"
                />
              </>
            ) : (
              <>{item.name}</>
            )}
          </div>
        </div>

        <>
          <div className="flex flex-nowrap">
            <button
              className="bg-teal-600 mx-2 w-[70px]  text-white rounded-md text-[14px] p-1"
              onClick={() => {
                setProductId(item._id);
                setModalVisible(true);
              }}
            >
              Edit
            </button>
            <button
              className="bg-red-700 mx-2 w-[70px]  text-white rounded-md text-[14px] p-1"
              onClick={() => {
                setProductId(item._id);
                setPopupText("Do your really want to delete this product ?");
                setOpenPopup(true);
              }}
            >
              Delete
            </button>
          </div>
        </>
      </div>
    </>
  );
}
