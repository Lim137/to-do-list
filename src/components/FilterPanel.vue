<template>
  <div class="filter-block">
    <input
      class="filter-block__input-field"
      type="text"
      v-model="filter"
      :disabled="isEmptyTaskList"
    />
    <div class="vertical-line"></div>
    <button
      class="filter-block__cancel-button"
      @click="$emit('closeFindPopup', '')"
    >
      ✕
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter: "",
    };
  },
  props: {
    isEmptyTaskList: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    tasksFilter: (filter) => typeof filter === "string",
    closeFindPopup: null,
  },

  watch: {
    filter() {
      this.$emit("tasksFilter", this.filter);
    },
  },
};
</script>

<style scoped>
.filter-block {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 5px;
  height: 40px;
}
/* .filter-block__title {
  font-size: 36px;
  margin-right: 8px;
} */
.filter-block__input-field {
  flex: 1;
  padding: 5px;
  border: none;
  outline: none;
  font-size: 30px;
}
.vertical-line {
  width: 1px;
  height: 45px;
  background-color: #ccc;
  margin: 0 10px;
}
.filter-block__cancel-button {
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  color: #000;
  font-size: 26px;
  border-radius: 50%;
  cursor: pointer;
  /* margin-left: 10px; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-block__cancel-button:hover {
  background-color: #e5e5e5;
}
</style>
