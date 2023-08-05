<template>
  <div class="page" @click="closeMenu">
    <div class="todo-wrapper">
      <header class="todo-wrapper__header">
        <div class="first-string">
          <div class="first-string__first-half">
            <img
              class="first-string__burger-icon"
              src="./icon/burger-menu.png"
              alt=""
            />
            <h1 class="first-string__title">TODO</h1>
          </div>
          <div class="first-string__second-half">
            <div class="test-chart">
              <img
                class="first-string__chart-icon"
                src="./icon/chart.png"
                alt=""
              />
            </div>

            <div
              class="burger-container"
              @click.stop
              @click="showExtraFeatures = !showExtraFeatures"
            >
              <img
                class="first-string__additionally-icon"
                src="./icon/additionally.png"
                alt=""
              />

              <div v-if="showExtraFeatures" class="menu">
                <div class="menu-item">
                  <button
                    class="menu-item__button"
                    @click="editingTasks = true"
                  >
                    Edit
                  </button>
                </div>
                <div class="menu-item">
                  <button
                    class="menu-item__button"
                    @click="showFindPopup = true"
                  >
                    Find
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="navigation-block">
          <button
            class="navigation-block__button navigation-block__unsolved-tasks"
            :class="page === 1 ? 'navigation-block__active-button' : ''"
            @click="page = 1"
          >
            TO DO
          </button>
          <button
            class="navigation-block__button navigation-block__solved-tasks"
            :class="page === 2 ? 'navigation-block__active-button' : ''"
            @click="page = 2"
          >
            DONE
          </button>
        </div>
      </header>
      <div
        v-if="showFindPopup"
        class="find-popup"
        :class="showFindPopup ? 'closeFindPopup' : ''"
      >
        <filter-panel
          :isEmptyTaskList="isEmptyTaskList"
          @tasksFilter="changeFilter"
          @closeFindPopup="closeFindPopup"
        />
      </div>
      <div class="empty-block"></div>
      <main class="todo-wrapper__main-block">
        <div v-if="page === 1">
          <div v-if="editingTasks">
            <button class="edit-tasks-button" @click="editingTasks = false">
              Cancel
            </button>
          </div>
          <div v-if="!editingTasks">
            <div class="todo-wrapper__task-list" ref="taskBlock">
              <task-list
                :taskBlockWidth="taskBlockWidth"
                :filteredTasks="filteredTasks"
                @solveTask="solveTask"
                @deleteTask="deleteTask"
                @editTask="editTask"
                @saveTask="saveTask"
                @cancelEdit="cancelEdit"
              />
            </div>
          </div>
          <div v-else>
            <draggable-task-list
              :tasks="unsolvedTasks"
              @updateUnsolvedTasks="updateTasks"
              @solveTask="solveTask"
              @deleteTask="deleteTask"
              @editTask="editTask"
              @saveTask="saveTask"
              @cancelEdit="cancelEdit"
            />
          </div>
        </div>
      </main>
      <div class="empty-block"></div>
      <footer class="todo-wrapper__footer" v-if="page === 1">
        <add-task-form
          class="add-task-form"
          :recognizedString="recognizedString"
          @addTask="add"
          @voiceRecognition="startVoiceRecognition"
        ></add-task-form>
      </footer>
      <div v-if="page === 2">
        <div v-for="task in solvedTasks" :key="task.id">
          {{ task.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

import AddTaskForm from "./components/AddTaskForm.vue";
import FilterPanel from "./components/FilterPanel.vue";
import TaskList from "./components/TaskList.vue";
import DraggableTaskList from "./components/DraggableTaskList.vue";

export default {
  name: "App",

  components: {
    AddTaskForm,
    FilterPanel,
    TaskList,
    DraggableTaskList,
  },
  data() {
    return {
      unsolvedTasks: [],
      solvedTasks: [],
      recognizedString: "",
      filter: "",
      editingTasks: false,
      page: 1,
      isOn: false,
      showExtraFeatures: false,
      showFindPopup: false,
      taskBlockWidth: 0,
    };
  },
  created: function () {
    const unsolvedTasksData = localStorage.getItem("unsolvedTasks");
    if (unsolvedTasksData) {
      this.unsolvedTasks = JSON.parse(unsolvedTasksData);
    }
    const solvedTasksData = localStorage.getItem("solvedTasks");
    if (solvedTasksData) {
      this.solvedTasks = JSON.parse(solvedTasksData);
    }
  },
  mounted: function () {
    window.addEventListener("beforeunload", this.returnTasksToStandartPosition);
    this.taskBlockWidth = this.$refs.taskBlock.clientWidth;
  },
  beforeUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.returnTasksToStandartPosition
    );
  },
  computed: {
    filteredTasks() {
      return this.unsolvedTasks.filter((task) =>
        this.filterTasks(task.title, this.filter)
      );
    },
    isEmptyTaskList() {
      return this.filteredTasks.length === 0 && this.filter === "";
    },
  },
  methods: {
    closeMenu() {
      this.showExtraFeatures = false;
    },
    closeFindPopup() {
      this.showFindPopup = false;
    },
    returnTasksToStandartPosition() {
      this.unsolvedTasks.forEach((t) => {
        t.swipeLeft = 0;
        t.swipeLeftOffsetX = 0;
      });
    },

    changeFilter(filter) {
      this.filter = filter;
    },

    startVoiceRecognition() {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "ru-RU";

      recognition.onresult = (event) => {
        const taskName = event.results[0][0].transcript;
        this.recognizedString = taskName;
      };
      recognition.onspeechend = () => {
        recognition.stop();
      };

      recognition.start();
    },
    add(task) {
      const taskId = uuidv4();
      this.unsolvedTasks.push({
        id: taskId,
        title: task,
        editing: false,
        editingText: task,
        swipeLeftOffsetX: 0,
        showDeleteButton: false,
        swipeLeft: 0,
        swipeRightOffsetX: 0,
        swipeRight: 0,
      });
    },
    deleteTask(task) {
      this.unsolvedTasks = this.unsolvedTasks.filter((t) => t.id !== task.id);
    },
    updateTasks(tasks) {
      this.unsolvedTasks = tasks;
    },
    filterTasks(task, filter) {
      task = task.toLowerCase();
      filter = filter.toLowerCase();
      const filterWords = filter.split(" ");
      for (const word of filterWords) {
        if (!task.includes(word)) {
          return;
        }
      }
      return true;
    },
    solveTask(task) {
      this.solvedTasks.push(task);
      // console.log("solvedTasks = ", this.solvedTasks);
      localStorage.setItem("solvedTasks", JSON.stringify(this.solvedTasks));
      this.unsolvedTasks = this.unsolvedTasks.filter((t) => t !== task);
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
      task.editing = true;
      this.unsolvedTasks.forEach((t) => {
        if (t.title !== task.title) {
          t.editing = false;
        }
      });
    },
    cancelEdit(task) {
      task.editingText = task.title;
      task.editing = false;
    },
  },
  watch: {
    unsolvedTasks: {
      handler() {
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
.burger-container {
  position: relative;
  cursor: pointer;
}

.burger-menu {
  width: 30px;
  height: 4px;
  background-color: #333;
  margin: 6px 0;
  transition: transform 0.3s;
}

.burger-menu.active:nth-child(1) {
  transform: translateY(10px) rotate(-45deg);
}

.burger-menu.active:nth-child(2) {
  opacity: 0;
}

.burger-menu.active:nth-child(3) {
  transform: translateY(-10px) rotate(45deg);
}
.menu {
  background-color: #f9f9f9;
  padding: 10px;
  position: absolute;
  top: 30px;
  right: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  min-width: 150px;
}

.menu-item {
  padding: 8px 12px;
}

.menu-item__button {
  display: block;
  width: 100%;
  background-color: transparent;
  border: none;
  text-align: center;
  font-size: 36px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #333;
}

.menu-item__button:hover {
  background-color: #e6e6e6;
}
.find-popup {
  position: absolute;
  top: 80px;
  right: 100px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: #333;
  min-width: 300px;
  padding: 10px;
  pointer-events: auto;
}

/* .menu {
  background-color: #f9f9f9;
  padding: 10px;
  position: absolute;
  top: 40px;
  right: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
} */

.page {
  /* width: 100vh; */
  background: linear-gradient(
    137deg,
    #75f6ff,
    #14fbff
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.todo-wrapper {
  max-width: 800px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  font-size: 36px;
  background-color: rgb(31, 188, 211);
}
.todo-wrapper__header {
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
.first-string {
  display: flex;
  justify-content: space-between;
  padding: 10px 40px;
}
.first-string__first-half {
  display: flex;
  gap: 30px;
  align-content: center;
}

.first-string__second-half {
  display: flex;
  gap: 30px;
  align-content: center;
}
.first-string__burger-icon {
  width: 100%;
  height: auto;
}
.test-chart {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid transparent;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  margin-top: 10px;
}
.first-string__chart-icon {
}
.first-string__additionally-icon {
}
.todo-wrapper__main-block {
  background-color: #fff;
  flex: 1 1 0;
  overflow-y: auto;

  padding: 0px 10px;
}
.empty-block {
  height: 15px;
  background-color: #fff;
}
.todo-wrapper__main-block::-webkit-scrollbar {
  width: 8px; /* Ширина ползунка */
}
.todo-wrapper__main-block::-webkit-scrollbar-thumb {
  background-color: rgb(31, 188, 211); /* Цвет ползунка */
  border-radius: 4px; /* Скругление углов ползунка */
}

.todo-wrapper__main-block::-webkit-scrollbar-thumb:hover {
  background-color: rgb(25, 151, 170); /* Цвет ползунка при наведении */
}

.todo-wrapper__main-block::-webkit-scrollbar-track {
  background-color: #dddcdc; /* Цвет фона ползунка */
  border-radius: 4px; /* Скругление углов фона ползунка */
}
.todo-wrapper__task-list {
  flex: 1 1 0;
  overflow-y: auto;
}
.todo-wrapper__footer {
}
.first-string__title {
  color: #fff;
  display: flex;
  font-size: 60px;
  justify-content: center;
}

.navigation-block {
  display: flex;
  justify-content: space-between;
  /* margin-top: 10px; */
}
/* .todo-wrapper__header::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgba(0, 0, 0, 1);
} */
.navigation-block__button {
  color: #fff;
  padding: 15px;
  font-size: 36px;
  width: 50%;
  background-color: transparent;
  border: 0;
  border-bottom: 3px solid transparent;
  border-radius: 10px;
  transition: border-bottom 0.5s ease;
}
.navigation-block__unsolved-tasks {
}
.navigation-block__solved-tasks {
}
.navigation-block__active-button {
  border-bottom-color: rgb(115, 255, 0);
}
.edit-tasks {
  background-color: #fff;
}
.edit-tasks__button {
  font-size: 36px;
  background-color: transparent;
  border: 0;
}
.task {
  width: 800px;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
}
.add-task-form {
  justify-self: flex-end;
}
.position-transition {
  transition: width, height 0.3s ease;
}
</style>
