<template>
  <div id="action-bar" class="grid-cell span-12-xs">
    <div class="action-bar-left">
      <div v-for="(action, index) in actions.filter(x => x.align === 'left')" :key="index">
        <button v-if="action.type === 'back'" class="back-button" @click="back">
          <i class="material-icons icon">arrow_back</i>
          Back
        </button>
        <router-link v-else-if="action.type === 'link'" class="button link-button">
          <i class="material-icons icon" v-if="action.icon">{{ action.icon }}</i>
          {{ action.text }}
        </router-link>
      </div>
    </div>
    <div class="action-bar-right">
      <div v-for="(action, index) in actions.filter(x => x.align === 'right')" :key="index">
        <router-link
          v-if="action.type === 'link'"
          class="button link-button"
          :to="action.link"
          :append="action.append"
        >
          <i class="material-icons icon" v-if="action.icon">{{ action.icon }}</i>
          {{ action.text }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "actionbar",
  props: ["actions"],
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss">
#action-bar {
  padding: 0 0 5px 0;
  display: flex;

  .action-bar-left {
    flex: 1 1 auto;
  }

  .action-bar-right {
    flex: 0 0 auto;
  }
}
</style>
