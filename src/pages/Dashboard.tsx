import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import axios from "axios";
import { Link } from "react-router-dom";

interface PrescriptionDataType {
  key: string;
  userId: string; // Add userId to the data type
  userName: string;
  email: string;
  url: string;
  createdAt: string;
}

type DataIndex = keyof PrescriptionDataType;

const App: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [prescriptions, setPrescriptions] = useState<PrescriptionDataType[]>(
    []
  );

  const searchInput = useRef<InputRef>(null);

  // Fetching prescription data from API
  const getAllPrescription = async () => {
    const response = await axios.get(
      "http://localhost:4000/product/getAllPrescription"
    );
    const formattedData = response.data.map((item: any) => ({
      key: item._id,
      userId: item.userId._id, // Store userId
      userName: item.userId.userName,
      email: item.userId.email,
      url: item.url,
      createdAt: new Date(item.createdAt).toLocaleString(), // Formatting date
    }));
    setPrescriptions(formattedData);
  };

  useEffect(() => {
    getAllPrescription();
  }, []);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<PrescriptionDataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<PrescriptionDataType> = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      width: "20%", // Adjust width as necessary
      ...getColumnSearchProps("userId"),
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      width: "25%",
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "25%",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Prescription URL",
      dataIndex: "url",
      key: "url",
      render: (url) => (
        <Link
          className="underline "
          to={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url}
        </Link>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];

  return (
    <div className="md:px-[8rem] py-[5rem] overflow-auto">
      <h1 className="text-teal-500 font-semibold text-3xl mb-4">Dashboard</h1>
      <div className="min-w-[1000px] overflow-x-scroll">
        <Table<PrescriptionDataType>
          columns={columns}
          dataSource={prescriptions}
        />
      </div>
    </div>
  );
};

export default App;
