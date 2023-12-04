import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { Layout, Menu, Button, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Home from "./spend";
import Chart from "./chart";
import Leetcode from "./leetcode";
import UploadSpend from "./Component/uploadSpend";
import H5c3 from "./h5c3";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Router>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} width={200}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["spend"]}
            defaultOpenKeys={["bank_account"]}
            style={{ height: "100vh", borderRight: 0 }}
          >
            <SubMenu key="bank_account" icon={<UserOutlined />} title="Account">
              <Menu.Item key="spend">
                <Link to="/account_spend">spend</Link>
              </Menu.Item>
              <Menu.Item key="chart">
                <Link to="/account_chart">chart</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="learn" icon={<MenuFoldOutlined />} title="Learn">
              <Menu.Item key="leetcode">
                <Link to="/learn_leetcode">leetcode</Link>
              </Menu.Item>
              <Menu.Item key="h5c3">
                <Link to="/learn_h5c3">h5c3</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <UploadSpend />
          </Header>
          <Content
            style={{
              margin: "20px 0",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/account_spend" replace />}
              />
              <Route path="/account_spend" element={<Home />} />
              <Route path="/account_chart" element={<Chart />} />
              <Route path="/learn_leetcode" element={<Leetcode />} />
              <Route path="/learn_h5c3" element={<H5c3 />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
