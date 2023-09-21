// theme/themeConfig.ts
import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
    token: {
      // colorPrimary:'#010F28',
      colorPrimary: "#222E3C",
      borderRadius: 4,
  
      // Alias Token
      colorBgContainer: "#fff",
    },
    components: {
      Button: {
        colorPrimary: "#222E3C",
        algorithm: true, // Enable algorithm
      },
      Input: {
        colorPrimary: "#222E3C",
        algorithm: true, // Enable algorithm
      },
    },
  };

export default theme;