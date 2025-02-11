<template>
  <div class="home-container">
    <div class="top-bar"></div>
    <div class="content">
      <div class="sidebar"></div>
      <div class="main-content">
        <v-card class="form-card">
        
      </v-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  
}
.form-card {
    width: 100%;
    max-width: 1000px; 
    padding: 20px;
    background: rgb(128, 195, 197);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin-left: 20px;
    margin-top:20px;
    height:94%;
  }

.top-bar {
  height: 70px;
  background-color: lightblue;
  width: 100%;
}

.content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 700px;
  background-color: grey;
}

.main-content {
  flex: display;
  background-color: white;
  width: 1500px;
}
</style>