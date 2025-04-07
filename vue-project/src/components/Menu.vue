<template>
  <div v-if="isLoggedIn" class="menu-container">
    <button v-if="isMobile" class="menu-button" @click="toggleMenu">☰</button>
    <nav :class="{ 'menu-open': isMenuOpen }">
      <button v-if="isMobile && isMenuOpen" class="close-button" @click="closeMenu">×</button>
      <ul>
        <li><router-link class="buttons" to="/">Főoldal</router-link></li>
        <li><router-link class="buttons" to="/search">Keresés</router-link></li>
        <li><router-link class="buttons" to="/profile">Profil</router-link></li>
      </ul>
      <div v-if="!isMobile" class="logout-container">
        <button class="logout-button" @click="logout">Kijelentkezés</button>
      </div>
      <div v-else-if="isMobile && isMenuOpen" class="logout-container">
        <button class="logout-button" @click="logout">Kijelentkezés</button>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isMenuOpen = ref(false);
    const isMobile = ref(window.innerWidth < 768);

    const isLoggedInReactive = ref(localStorage.getItem('userId') !== null);


    const isLoggedIn = computed(() => isLoggedInReactive.value);


    watch(
      () => localStorage.getItem('userId'),
      (newUserId) => {
        isLoggedInReactive.value = newUserId !== null;
      },
      { immediate: true } 
    );

    window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth < 768;
    });

    const closeMenu = () => {
      isMenuOpen.value = false;
    };

    const logout = () => {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      isLoggedInReactive.value = false; 
      router.push('/login');
    };

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const isAuthPage = computed(() => {
      return (
        route.path.startsWith('/login') ||
        route.path.startsWith('/registration') ||
        route.path.startsWith('/forgotten-password')
      );
    });
    console.log(isAuthPage.value)



    return {
      logout,
      isAuthPage,
      isMenuOpen,
      isMobile,
      toggleMenu,
      closeMenu,
      isLoggedIn, 
    };
  },
});
</script>

<style scoped>
.menu-container {
  position: relative;
}

nav {
  background-color: #bb79d2;
  width: 100%;
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  border-bottom: 7px solid #6e2d86;
  transition: transform 0.3s ease-in-out;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: black;
  margin-top: -7px;
}

nav.menu-open {
  transform: translateX(0);
}

.menu-button {
  display: none;
  background-color: transparent;
  border: none;
  font-size: 3rem;
  cursor: pointer;
}

@media (max-width: 767px) {
  nav {
    transform: translateX(-100%);
    width: 100%;
    flex-direction: column;
    border-radius: 20px;
    box-sizing: border-box;
  }
  .menu-button {
    display: block;
  }
  ul {
    flex-direction: column;
  }
  .logout-container {
    margin-top: 10px;
  }
  li {
    margin-top: 5px;
  }
  .logout-button {
    margin-top: 5px;
  }
  .menu-container {
    margin-left: 20px;
  }
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 20px;
}

li {
  display: inline;
}

li a {
  font-family: 'Lucida Console', monospace;
  font-size: 1.1rem;
  text-decoration: none;
  color: black;
}

.buttons {
  background-color: #ce9fdf;
  border-radius: 10px;
  border: 2px solid black;
  padding: 10px;
  font-family: 'Lucida Console', monospace;
  color: white;
}

.logout-container {
  display: flex;
  align-items: center;
  padding: 0;
}

.logout-button {
  background-color: #ce9fdf;
  border-radius: 10px;
  padding: 6px;
  color: #4f2060;
  border: 2px solid black;
  cursor: pointer;
  font-size: 1.1rem;
  font-family: 'Lucida Console', monospace;
}
</style>
