import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Card, Tag, Space, Table, Button, Modal, Carousel } from "antd";
import moment from "moment";

const Spend = () => {
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});
  const showModal = (record) => {
    setCurrentRecord(record);
    setIsModalVisible(true);
  };
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
          {(record.description || record.image.length > 0) && (
            <Button onClick={() => showModal(record)}>View Details</Button>
          )}
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
        transactionsByDate[dateString].totalAmount += parseFloat(data.price);
      });

      setGroupedTransactions(transactionsByDate);
    };

    fetchTransactions();
  }, []);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
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
      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {currentRecord.image && (
          <Carousel dotPosition="top">
            {currentRecord.image.map((item) => (
              <img
                key={item}
                src={item}
                alt="transaction"
                style={{ width: "100%" }}
              />
            ))}
          </Carousel>
        )}
        {currentRecord.description && <p>{currentRecord.description}</p>}
      </Modal>
    </div>
  );
};

export default Spend;
