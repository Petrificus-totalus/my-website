import { Button, Modal, Form, Input, Select, List } from "antd";
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

import hljs from "highlight.js";
import "highlight.js/styles/default.css";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";

const { Option } = Select;

export default function Leetcode() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [selectedMarkdown, setSelectedMarkdown] = useState("");
  const [markdown, setMarkdown] = useState("");
  const mdParser = new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str, true).value;
        } catch (__) {}
      }
      return ""; // 使用自定义的样式
    },
  });

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      await addDoc(collection(db, "leetcode"), {
        ...values,
        markdown,
      });

      setIsModalOpen(false);
      form.resetFields();
      setMarkdown("");
    } catch (error) {
      console.log("Error uploading data:", error);
    }
  };
  const handleEditorChange = ({ html, text }) => {
    setMarkdown(text);
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "leetcode"));
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(docs);
    };

    fetchData();
  }, []);
  const showModal = (markdown) => {
    setSelectedMarkdown(markdown);
    setIsModalOpen1(true);
  };

  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };
  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>Add solution</Button>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form}>
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
          <Form.Item>
            <MdEditor
              style={{ height: "300px" }}
              value={markdown}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
            />
          </Form.Item>
        </Form>
      </Modal>

      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button onClick={() => showModal(item.markdown)}>Detail</Button>,
            ]}
          >
            <List.Item.Meta
              title={`${item.num} - ${item.difficulty} - ${item.tags.join(
                ", "
              )}`}
            />
          </List.Item>
        )}
      />
      <Modal
        open={isModalOpen1}
        onCancel={handleCancel1}
        footer={null}
        width={720}
        className="modal-content"
      >
        <div
          dangerouslySetInnerHTML={{
            __html: mdParser.render(selectedMarkdown),
          }}
        />
      </Modal>
    </div>
  );
}
