import { Button, Modal, Form, Input, Select } from "antd";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import { db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";

import "react-quill/dist/quill.snow.css";

const { Option } = Select;

export default function Leetcode() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [quillValue, setQuillValue] = useState("");

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      values.quillValue = quillValue;
      console.log(values);
      await addDoc(collection(db, "leetcode"), values);

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.log("Error uploading data:", error);
    }
  };
  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>Add solution</Button>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} style={{ display: "flex" }}>
          <Form.Item name="num">
            <Input
              type="number"
              placeholder="Number"
              style={{ width: "100px" }}
            />
          </Form.Item>
          <Form.Item name="difficulty" style={{ margin: "0 5px" }}>
            <Select placeholder="Select Difficulty">
              <Option value="easy">Easy</Option>
              <Option value="medium">Medium</Option>
              <Option value="hard">Hard</Option>
            </Select>
          </Form.Item>
          <Form.Item name="tags">
            <Select placeholder="Select Tags" mode="multiple">
              <Option value="dp">Dp</Option>
              <Option value="linkedlist">Linkedlist</Option>
              <Option value="backtracking">Backtracking</Option>
            </Select>
          </Form.Item>
        </Form>

        <ReactQuill theme="snow" value={quillValue} onChange={setQuillValue} />
      </Modal>
    </div>
  );
}
