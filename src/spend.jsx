// Spend.js
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Card, Tag, Space, Table } from "antd";
import moment from "moment";
// import "./Spend.css"; // 假设你有一个 CSS 文件来添加样式

const Spend = () => {
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <span>{parseFloat(text).toFixed(2)}</span>,
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.description && <span>{record.description}</span>}
          {record.image && <a href={record.image}>image</a>}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactionsCollectionRef = collection(db, "transactions");
      const q = query(transactionsCollectionRef, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);

      // 将事务按日期分组
      const transactionsByDate = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.date.toDate();
        const dateString = moment(date).format("YYYY-MM-DD");

        if (!transactionsByDate[dateString]) {
          transactionsByDate[dateString] = {
            totalAmount: 0,
            records: [],
          };
        }

        transactionsByDate[dateString].records.push(data);
        transactionsByDate[dateString].totalAmount += parseFloat(data.price); // 假设 price 字段存储金额
      });

      setGroupedTransactions(transactionsByDate);
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      {Object.entries(groupedTransactions).map(
        ([date, { records, totalAmount }]) => (
          <Card
            title={date}
            hoverable
            extra={<strong>{totalAmount.toFixed(2)}</strong>}
            key={date}
            style={{ marginBottom: "20px" }}
          >
            <Table columns={columns} dataSource={records} showHeader={false} />
          </Card>
        )
      )}
    </div>
  );
};

export default Spend;
