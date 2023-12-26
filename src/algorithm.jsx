import { Button, Modal, Form, Input, Select, List, Row, Col, Tag } from "antd";
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import useMarkdownEditor from "./Hooks/markdownEditor";
import { tagsOptions } from "./constant";
const { Option } = Select;

export default function Leetcode() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSearchTags, setSelectedSearchTags] = useState([]);

  const { markdown, setMarkdown, mdParser, handleEditorChange } =
    useMarkdownEditor();

  const [detailMarkdown, setDetailMarkdown] = useState("");

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
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
    setDetailMarkdown(markdown);
    setIsDetailModalOpen(true);
  };

  const fetchItemsWithTagsContainingLe = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "algorithm"));
      const filteredDocs = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) =>
          selectedSearchTags.every((element) => item.tags.includes(element))
        );
      setData(filteredDocs);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: "10px" }}>
        <Button onClick={() => setIsModalOpen(true)}>Add solution</Button>
        <Select
          mode="multiple"
          allowClear
          style={{
            width: "220px",
            margin: "0 20px",
          }}
          placeholder="Please select"
          defaultValue={[]}
          onChange={(tags) => {
            setSelectedSearchTags(tags);
          }}
          options={tagsOptions}
        />

        <Button onClick={fetchItemsWithTagsContainingLe} type="primary">
          Search
        </Button>
      </Row>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Form form={form}>
          <Form.Item name="tags">
            <Select
              placeholder="Select Tags"
              mode="multiple"
              onChange={(tags) => {
                setSelectedTags(tags);
              }}
              options={tagsOptions}
            />
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
            ? `${item.num} - ${item.difficulty}  ${item.desc}`
            : item.desc;
          return (
            <List.Item
              onClick={() => showModal(item.markdown)}
              className="custom-list-item"
            >
              {item.tags.map((i, index) => (
                <Tag key={index}>{i}</Tag>
              ))}
              <List.Item.Meta title={displayText} />
            </List.Item>
          );
        }}
      />
      <Modal
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
        }}
        footer={null}
        width={720}
        className="modal-content"
      >
        <div
          dangerouslySetInnerHTML={{
            __html: mdParser.render(detailMarkdown),
          }}
        />
      </Modal>
    </div>
  );
}
