<template>
  <div class="tasks-block">
    <draggable-block
      v-model="unsolvedTasks"
      group="task-list"
      :options="dragOptions"
      item-key="id"
    >
      <template #item="{ element }">
        <div>
          <div v-if="!element.editing">
            <div class="task">
              <label class="task__text">
                <input
                  type="checkbox"
                  name="task"
                  :id="element.id"
                  v-model="element.checked"
                />
                <span @click="$emit('editTask', element)">{{
                  element.title
                }}</span>
              </label>
            </div>
          </div>

          <text-edit-block
            v-if="element.editing"
            :taskFromApp="element"
            @cancelEdit="$emit('cancelEdit', element)"
            @saveTask="$emit('saveTask', element)"
          />
        </div>
      </template>
    </draggable-block>
    <button @click="$emit('solveTasks', checkedTasks)" class="edit-button">
      solve
    </button>
    <button
      class="task__delete-button"
      @click="$emit('deleteTasks', checkedTasks)"
    >
      delete
    </button>
  </div>
</template>

<script>
import draggableBlock from "vuedraggable";
import focusDirective from "../directives/focus.js";
import TextEditBlock from "./TextEditBlock.vue";
export default {
  components: {
    draggableBlock,
    TextEditBlock,
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
  computed: {
    checkedTasks() {
      return this.unsolvedTasks.filter((t) => t.checked === true);
    },
  },
  props: {
    tasks: {
      type: Object,
      required: true,
    },
    taskBlockWidth: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.unsolvedTasks = this.tasks;
  },
  emits: {
    updateUnsolvedTasks: (tasks) => typeof tasks === "object",
    solveTasks: (task) => typeof task === "object",
    deleteTasks: (task) => typeof task === "object",
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

<style scoped>
.tasks-block {
  padding: 10px;
}
.task {
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
  padding: 10px;
  gap: 5px;
  margin-bottom: 5px;
}

button {
  padding: 7px 14px;
  font-size: 16px;
  background-color: rgb(31, 188, 211);
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: rgb(14, 144, 163);
}

button:active {
  background-color: rgb(7, 90, 102);
}

.task__text {
  display: flex;
  font-size: 36px;
  flex: 1 1 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
