<template>
  <div class="todo-wrapper">
    <h1>TODO</h1>
    <hr />
    <div>
      Фильтр:
      <input type="text" v-model="filter" :disabled="isEmptyTaskList" />
      <button @click="filter = ''">X</button>
    </div>
    <hr />
    <div v-for="task in filteredTasks" :key="task.taskId">
      <div v-if="!task.editing">
        <div>
          <label>
            <input
              type="checkbox"
              name="task"
              :id="task.id"
              v-model="task.checked"
              @change="updateTask(task)"
            />
            {{ task.title }}
          </label>

          <button @click="editTask(task)">Редактировать</button>
          <button class="task__delete-button" @click="deleteTask(task)">
            Удалить
          </button>
        </div>
      </div>
      <div v-if="task.editing">
        <input type="text" v-model="task.editingText" v-focus />
        <button @click="saveTask(task)">Сохранить</button>
        <button @click="cancelEdit(task)">Отмена</button>
      </div>
    </div>
    <hr />
    <div class="input-wrapper">
      <div class="input-wrapper__input-container">
        <input
          type="text"
          v-model="taskTitle"
          @keydown.enter="add"
          class="input-wrapper__input"
        />
        <button @click="taskTitle = ''" class="input-wrapper__clear-button">
          X
        </button>
      </div>
      <button class="input-wrapper__add-button" @click="add">Add</button>
    </div>
  </div>
</template>

<script>
// import draggable from "vuedraggable";
import { v4 as uuidv4 } from "uuid";
import focusDirective from "./directives/focus.js";

export default {
  name: "App",
  directives: {
    focus: focusDirective,
  },
  data() {
    return {
      unsolvedTasks: [],
      taskTitle: "",
      solvedTasks: [],
      dragOptions: {
        animation: 150,
      },
      filter: "",
    };
  },
  created: function () {
    const tasksData = localStorage.getItem("unsolvedTasks");
    if (tasksData) {
      this.unsolvedTasks = JSON.parse(tasksData);
    }
  },
  computed: {
    filteredTasks() {
      return this.unsolvedTasks.filter((task) =>
        task.title.toLowerCase().includes(this.filter.toLowerCase())
      );
    },
    isEmptyTaskList() {
      return this.filteredTasks.length === 0 && this.filter === "";
    },
  },
  methods: {
    add() {
      if (!this.taskTitle) {
        return;
      }
      const taskId = uuidv4();
      this.unsolvedTasks.push({
        id: taskId,
        title: this.taskTitle,
        checked: false,
        editing: false,
        editingText: this.taskTitle,
      });
      localStorage.setItem("unsolvedTasks", JSON.stringify(this.unsolvedTasks));
      this.taskTitle = "";
    },
    deleteTask(task) {
      this.unsolvedTasks = this.unsolvedTasks.filter(
        (t) => t.title !== task.title
      );

      localStorage.setItem("unsolvedTasks", JSON.stringify(this.unsolvedTasks));
    },
    updateTask(task) {
      if (task.checked === true) {
        this.solvedTasks.push(task);
        console.log(this.solvedTasks);
        this.unsolvedTasks = this.unsolvedTasks.filter((t) => t !== task);
        localStorage.setItem(
          "unsolvedTasks",
          JSON.stringify(this.unsolvedTasks)
        );
      }
    },
    saveTask(task) {
      this.unsolvedTasks.forEach((t) => {
        if (task.title === t.title) {
          t.title = task.editingText;
        }
      });
      task.editing = false;
      if (this.filteredTasks.length === 0) {
        this.filter = "";
      }
    },
    editTask(task) {
      // this.filter = "";

      task.editing = true;
      this.unsolvedTasks.forEach((t) => {
        if (t.title !== task.title) {
          t.editing = false;
        }
      });
      // this.$nextTick(() => {
      //   this.$refs.editingInput.focus();
      // });
    },
    cancelEdit(task) {
      task.editingText = task.title;
      task.editing = false;
    },
  },
  watch: {
    unsolvedTasks: {
      handler() {
        console.log("enter");
        localStorage.setItem(
          "unsolvedTasks",
          JSON.stringify(this.unsolvedTasks)
        );
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
.todo-wrapper {
  max-width: 800px;
  margin: 0 auto;
}
.task {
  width: 400px;
}
.task__title {
  align-self: flex-start;
  margin-right: 5px;
}
.task__delete-button {
  align-self: flex-end;
}
.input-wrapper {
  display: flex;
  flex-direction: column;
}

.input-wrapper__input-container {
  display: flex;
  align-items: center;
}

.input-wrapper__input {
  flex: 1;
}

.input-wrapper__clear-button {
  margin-left: 5px;
}

.input-wrapper__add-button {
  margin-top: 5px;
}
</style>
