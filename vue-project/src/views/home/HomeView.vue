<template>
  <div class="home-container">
    <div class="top-bar">
      <div class="menu-icon" @click="toggleMenu">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="search-icon" @click="goToSearch">
        🔍
      </div>
    </div>
    <div class="content">
      <div class="sidebar"></div>
      <div class="main-content">
        <v-card class="form-card"></v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToSearch() {
      this.$router.push('/search');
    },
    toggleMenu() {
      console.log("Menu clicked");
    }
  }
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.form-card {
  width: 100%;
  max-width: 1000px; 
  padding: 20px;
  background: rgb(128, 195, 197);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-left: 20px;
  margin-top: 20px;
  height: 94%;
}

.top-bar {
  height: 70px;
  background-color: lightblue;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.content {
  display: flex;
  flex: 1;
  overflow: hidden;
  margin-top: 70px;
}

.sidebar {
  width: 700px;
  background-color: grey;
}

.main-content {
  display: flex;
  background-color: white;
  width: 1500px;
}

.search-icon {
  font-size: 30px;
  cursor: pointer;
}

.menu-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 24px;
  cursor: pointer;
}

.menu-icon div {
  width: 100%;
  height: 4px;
  background-color: black;
}
</style>