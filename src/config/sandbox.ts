const templateFiles = {
  "/App.js": `
  import React from 'react';
  import './index.css';
  
  function App() {
    return (
      <div className="container">
        <h1>Hello, World!</h1>
      </div>
    );
  }
  
  export default App;
    `,
  "/index.css": `
  body {
    margin: 0;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  
  h1 {
    color: #333;
    font-size: 2.5rem;
    text-align: center;
  }
    `,
};

export { templateFiles };
