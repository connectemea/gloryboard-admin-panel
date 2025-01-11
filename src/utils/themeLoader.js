// themeLoader.js

export const loadTheme = (themePath) => {
    if (!themePath) {
      console.error("No theme path provided.");
      return;
    }
  
    const resolvedPath = themePath.startsWith("/") ? themePath : `/${themePath}`;
  
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = resolvedPath; // Path to the CSS file in the public folder
  
    link.onload = () => console.log("Theme loaded successfully:", resolvedPath);
    link.onerror = (error) => console.error("Failed to load theme:", error);
  
    document.head.appendChild(link);
  };
  