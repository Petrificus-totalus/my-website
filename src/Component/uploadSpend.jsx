import React, { useState } from "react";
import { Modal, Button, Form, Input, DatePicker, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { db, storage } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import moment from "moment";

const { Option } = Select;

const UploadSpend = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // 如果有图片，上传到 Firebase Storage
      if (values.image) {
        const imageRef = ref(storage, `spendItem/${values.image.file.name}`);
        await uploadBytes(imageRef, values.image.file);
        const downloadURL = await getDownloadURL(imageRef);
        values.image = downloadURL;
      } else {
        delete values.image;
      }
      if (!values.description) {
        delete values.description;
      }
      const firestoreDate = values.date
        ? Timestamp.fromDate(values.date.toDate())
        : null;

      console.log(values);
      //   添加数据到 Firestore
      await addDoc(collection(db, "transactions"), {
        ...values,
        date: firestoreDate,
      });
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.log("Error uploading data:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Item
      </Button>
      <Modal
        title="Add New Item"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Purchase Date">
            <DatePicker />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select mode="multiple" placeholder="Select tags">
              <Option value="food">Food</Option>
              <Option value="clean">Clean</Option>
              <Option value="play">Play</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="image" label="Upload Image">
            <Upload beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>
                Click to upload (optional)
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UploadSpend;
