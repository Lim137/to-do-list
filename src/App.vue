<template>
  <div class="todo-wrapper">
    <h1>TODO</h1>
    <hr />
    <div>
      <ul>
        <li
          class="unsolvedTasks"
          v-for="(task, index) in unsolvedTasks"
          :key="index"
        >
          <label>
            <input
              type="checkbox"
              name="task"
              id="index"
              v-model="task.checked"
              @change="updateTask(task)"
            />
            {{ task.title }}
          </label>
          <button class="task__delete-button" @click="deleteTask(task)">
            X
          </button>
        </li>
      </ul>
    </div>
    <!-- <div class="unsolvedTasks" v-for="(task, index) in unsolvedTasks" :key="index">
      <div class="task">
        <span class="task__title">{{ index + 1 }}. {{ task }}</span>
        <button class="task__delete-button" @click="deleteTask(task)">X</button>
      </div>
    </div> -->
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
export default {
  name: "App",
  data() {
    return {
      unsolvedTasks: [],
      taskTitle: "",
      solvedTasks: [],
    };
  },
  methods: {
    add() {
      if (!this.taskTitle) {
        return;
      }
      this.unsolvedTasks.push({ title: this.taskTitle, checked: false });
      this.taskTitle = "";
    },
    deleteTask(task) {
      this.unsolvedTasks = this.unsolvedTasks.filter(
        (t) => t.title !== task.title
      );
    },
    updateTask(task) {
      if (task.checked === true) {
        this.solvedTasks.push(task);
        console.log(this.solvedTasks);
        this.unsolvedTasks = this.unsolvedTasks.filter((t) => t !== task);
      }
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
