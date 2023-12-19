import { Button, Modal, Form, Input, Select, List, Row, Col } from "antd";
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
  const [selectedTags, setSelectedTags] = useState([]);

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
      await addDoc(collection(db, "algorithm"), {
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
      const querySnapshot = await getDocs(collection(db, "algorithm"));
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
  const handleTagsChange = (tags) => {
    setSelectedTags(tags); // 更新 tags state
  };
  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>Add solution</Button>
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form}>
          <Form.Item name="tags">
            <Select
              placeholder="Select Tags"
              mode="multiple"
              onChange={handleTagsChange}
            >
              <Option value="dp">Dp</Option>
              <Option value="leetcode">Leetcode</Option>
              <Option value="tree">Tree</Option>
              <Option value="linkedlist">Linkedlist</Option>
              <Option value="backtracking">Backtracking</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="desc"
            rules={[
              {
                required: true,
                message: "Please input Intro",
              },
            ]}
          >
            <Input.TextArea showCount maxLength={100} />
          </Form.Item>

          {selectedTags.includes("leetcode") && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="num">
                  <Input
                    type="number"
                    placeholder="Number"
                    style={{ width: "100px" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="difficulty" style={{ margin: "0 5px" }}>
                  <Select placeholder="Select Difficulty">
                    <Option value="easy">Easy</Option>
                    <Option value="medium">Medium</Option>
                    <Option value="hard">Hard</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}

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
        renderItem={(item) => {
          const hasNum = item.hasOwnProperty("num");

          // 根据是否有 num 属性来决定显示的内容
          const displayText = hasNum
            ? `${item.num} - ${item.difficulty} - ${item.tags.join(", ")} - ${
                item.desc
              }`
            : `${item.tags.join(", ")} - ${item.desc}`;
          return (
            <List.Item
              actions={[
                <Button onClick={() => showModal(item.markdown)}>
                  Detail
                </Button>,
              ]}
            >
              <List.Item.Meta title={displayText} />
            </List.Item>
          );
        }}
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