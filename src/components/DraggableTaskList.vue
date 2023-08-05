<template>
  <draggable-block
    v-model="unsolvedTasks"
    group="task-list"
    :options="dragOptions"
    item-key="id"
  >
    <template #item="{ element }">
      <div>
        <div v-if="!element.editing">
          <div>
            <label>
              <input
                type="checkbox"
                name="task"
                :id="element.id"
                v-model="element.checked"
                @change="$emit('solveTask', element)"
              />
              <span @click="$emit('editTask', element)">{{
                element.title
              }}</span>
            </label>

            <button @click="$emit('editTask', element)">edit</button>
            <button
              class="task__delete-button"
              @click="$emit('deleteTask', element)"
            >
              delete
            </button>
          </div>
        </div>
        <div v-if="element.editing" class="edit-block">
          <input
            class="edit-block__editing-field"
            type="text"
            v-model="element.editingText"
            v-focus
            @keydown.esc="$emit('cancelEdit', element)"
            @keydown.enter="$emit('saveTask', element)"
          />
          <button
            class="edit-block__save-button"
            @click="$emit('saveTask', element)"
          >
            Save
          </button>
          <button
            class="edit-block__cancel-button"
            @click="$emit('cancelEdit', element)"
          >
            Cancel
          </button>
        </div>
      </div>
    </template>
  </draggable-block>
</template>

<script>
import draggableBlock from "vuedraggable";
import focusDirective from "../directives/focus.js";
export default {
  components: {
    draggableBlock,
  },
  directives: {
    focus: focusDirective,
  },
  data() {
    return {
      dragOptions: {
        animation: 150,
      },
      unsolvedTasks: [],
    };
  },
  props: {
    tasks: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.unsolvedTasks = this.tasks;
  },
  emits: {
    updateUnsolvedTasks: (tasks) => typeof tasks === "object",
    solveTask: (task) => typeof task === "object",
    deleteTask: (task) => typeof task === "object",
    editTask: (task) => typeof task === "object",
    cancelEdit: (task) => typeof task === "object",
    saveTask: (task) => typeof task === "object",
  },

  watch: {
    unsolvedTasks: {
      handler() {
        this.$emit("updateUnsolvedTasks", this.unsolvedTasks);
      },
      deep: true,
    },
    tasks() {
      this.unsolvedTasks = this.tasks;
    },
  },
};
</script>
