<script setup>
const serviceUrl = import.meta.env.VITE_SERVICE_URL
console.log('serviceUrl:', serviceUrl)
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-container">
        <router-link to="/login" class="navbar-brand">Artbook</router-link>
        <ul class="navbar-menu">
          <li>
            <router-link to="/gallery" active-class="active">Gallery</router-link>
          </li>
          <li>
            <router-link to="/upload" active-class="active">Upload</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #ffffff;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  transition: color 0.2s;
}

.navbar-brand:hover {
  color: #4a90e2;
}

.navbar-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.navbar-menu a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.2s;
}

.navbar-menu a:hover,
.navbar-menu a.active {
  color: #4a90e2;
}

.main-content {
  flex: 1;
  background-color: #f5f5f5;
}
</style>
