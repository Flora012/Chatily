<template>
    <header class="app-header">
      <div class="logo">
        <h1>My App</h1>
      </div>
      <nav>
       
      </nav>
    </header>
  </template>
  
  <script>
  export default {
    name: 'HeaderComponent',
  };
  
  </script>
  
  <style scoped>
  .app-header {
    background-color: #f0f0f0; 
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-weight: bold;
  }
  </style>
  