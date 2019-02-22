<template>
  <div id="app">
    <div id="main-nav">
      <router-link to="/">Home</router-link>
      <router-link to="/reports">Reports</router-link>
    </div>
    <router-view class="grid"/>
  </div>
</template>

<style lang="scss">
@import "@/styles/global.scss";
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#main-nav {
  display: flex;
  background-color: $primary-color;
  justify-content: center;

  a {
    flex: 0 0 auto;
    font-weight: bold;
    padding: 15px 20px;
    color: $primary-font;

    &.router-link-exact-active {
      background-color: $primary-font;
      color: $secondary-font;
    }
  }
}
</style>
