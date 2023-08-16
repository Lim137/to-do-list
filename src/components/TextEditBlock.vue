<template>
  <div class="edit-block">
    <input
      class="edit-block__editing-field"
      type="text"
      v-model="task.editingText"
      v-focus
      @keydown.esc="$emit('cancelEdit', task)"
      @keydown.enter="$emit('saveTask', task)"
    />
    <button class="edit-block__save-button" @click="$emit('saveTask', task)">
      Save
    </button>
    <button
      class="edit-block__cancel-button"
      @click="$emit('cancelEdit', task)"
    >
      Cancel
    </button>
  </div>
</template>

<script>
import focusDirective from "../directives/focus.js";
export default {
  directives: {
    focus: focusDirective,
  },
  props: {
    taskFromApp: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      task: [],
    };
  },
  mounted() {
    this.task = this.taskFromApp;
  },
  emits: {
    cancelEdit: (task) => typeof task === "object",
    saveTask: (task) => typeof task === "object",
  },
};
</script>

<style scoped>
.edit-block {
  display: flex;
  width: 100%;
  font-size: 36px;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;

  display: flex;
  margin: 10px 0px;
}
.edit-block__editing-field,
.edit-block__save-button,
.edit-block__cancel-button {
  align-items: center;
  font-size: 36px;
}
.edit-block__editing-field {
  padding: 5px;
  flex: 1;
  border-radius: 10px;
}
.edit-block__save-button,
.edit-block__cancel-button {
  background-color: rgb(31, 188, 211);
  border-radius: 10px;
  padding: 5px;
  color: #fff;
}
.edit-block__save-button {
  margin: 0px 5px;
}
</style>
