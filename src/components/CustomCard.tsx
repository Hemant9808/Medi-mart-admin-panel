import { useEffect, useState } from "react";
// import EditCategory from "./EditCategory";

interface Props {
    name: string;
    //imageUrl: [string];
    link: string;
    refresh: () => void;
    id:string
}

export default function CustomCard({ name, link, refresh,id }: Props) {

    const [edit, setEdit] = useState(false);
    const [visible, setVisible] = useState(false);
    const [dataName, setDataName] = useState(name);
    console.log("link",link);
    
    //const [dataImageUrl, setDataImageUrl] = useState(imageUrl);
    // const [currentImage, setCurrentImage] = useState(0);

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        setDataName(name);
       // setDataImageUrl(imageUrl);
    }, [name]);

    function handleCancel() {
        setEdit(false);
        setDataName(name);
    }


    async function updateCategory() {
        console.log('Updating category');
        let response = await fetch('https://medimart-nayg.onrender.com/product/addOrUpdateCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token

            },
            body: JSON.stringify({
                id: id,
                name: dataName,
            })
        });
        response = await response.json();
        setEdit(false);
        console.log(response);
    }



    async function handleDelete() {
        console.log("Deleting")
        try {
            const response = await fetch(`https://node-js-jwt-auth.onrender.com/api/category/${link}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + token
                },
            });
            const data = await response.json();
            console.log(data);
            if (data.success) {
                refresh();
            }
            else {
                alert(data.message);
            }
        }
        catch (err) {
            console.log(err);
            {visible ? ''  : ''}
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            // setCurrentImage(prevImage => prevImage + 1);
        }, 4000);

        return () => {
            clearInterval(intervalId);
        };
    }, []); 

    return (
        <>

            {edit &&
            <></>
            //  <EditCategory token={token} categoryId={link} setVisible={setEdit} refresh={refresh} data={{ name: dataName, imageUrl: dataImageUrl || "kfnnf" }} />
             }
            <div className="my-8 mx-4 overflow-hidden bg-white rounded-xl shadow-md w-60" >

                <div className="h-60 flex justify-center items-center overflow-hidden">
                    <a href={`/admin/category/${link}`}>

                        <div className="h-[25rem] bg-gray-400 w-[25rem] flex justify-center items-center overflow-hidden">
                            {/* <img className="w-full" src={imageUrl[currentImage % imageUrl.length] || "kfjkf"} alt="Product Image" /> */}
                        </div>
                    </a>
                </div>

                <div className="text-center my-4">
                    <div onMouseEnter={() => setVisible(true)}
                        onMouseLeave={() => setVisible(false)}
                        className="">
                        {edit ?
                            <>
                                <input type="text" value={dataName} onChange={(e) => setDataName(e.target.value)}
                                    className="text-center my-1 w-full py-2 rounded-lg" />
                                <button className="my-1 bg-gray-700 hover:bg-gray-800 w-full py-2 text-white rounded-lg"
                                    type="button"
                                    onClick={updateCategory}
                                >Save</button>
                                <button className="my-1 w-full py-2 rounded-lg"
                                    type="button"
                                    onClick={handleCancel}
                                >Cancel</button>
                            </>
                            :
                            <>
                                <div className="my-1">{dataName}</div>
                                <button className="my-1 bg-gray-700 hover:bg-gray-800 w-full py-2 text-white rounded-lg"
                                    type="button" onClick={() => setEdit(true)}>Edit</button>
                                <button className="my-1 bg-gray-700 hover:bg-gray-800 w-full py-2 text-white rounded-lg"
                                    type="button" onClick={handleDelete}>Delete</button>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}


