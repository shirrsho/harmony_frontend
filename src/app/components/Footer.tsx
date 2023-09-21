'use client'
import { Layout, theme } from "antd";

const { Footer } = Layout;

export default function CustomFooter(){
    const {
        token: { colorPrimary },
      } = theme.useToken();
    return(
    <Footer
        style={{
            backgroundColor: colorPrimary,
            color: "gray",
            textAlign: "center",
            fontSize: "11px",
            padding: "20px"
        }}
    >
        Hasnain Iqbal Shirsho, 2023
    </Footer>
    )
}