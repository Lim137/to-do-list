<template>
  <div class="page" @click="closeMenu">
    <div class="page-blocks">
      <div class="main-menu" v-if="showMainMenu">
        <main-menu @selectedList="selectList" />
      </div>
      <div class="todo-wrapper">
        <header class="todo-wrapper__header">
          <div class="first-string">
            <div class="first-string__first-half">
              <img
                class="first-string__burger-icon"
                src="./icon/burger-menu.png"
                alt=""
                @click="showMainMenu = !showMainMenu"
              />
              <h1 class="first-string__title">{{ selectedList }}</h1>
            </div>
            <div class="first-string__second-half">
              <button
                @click="toggleSwitch"
                :class="{ active: isGraphMode }"
                class="switch"
              ></button>

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
                      @click="
                        editingTasks = true;
                        page = 1;
                      "
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
          <div class="navigation-block" v-if="!isGraphMode">
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
        <!-- <div class="empty-block"></div> -->
        <div v-if="isGraphMode" class="chart-block">
          <chart-block
            class="chart-block__chart"
            :lengthUnsolvedTasks="unsolvedTasks.length"
            :lengthSolvedTasks="solvedTasks.length"
          />
          <div class="chart-block__text">{{ percentageCompletedTasks }}%</div>
        </div>
        <main class="todo-wrapper__main-block" v-if="!isGraphMode">
          <div v-if="page === 1">
            <div v-if="editingTasks">
              <button class="edit-tasks-button" @click="editingTasks = false">
                Cancel
              </button>
            </div>
            <div v-if="!editingTasks">
              <div class="todo-wrapper__task-list" ref="taskBlock">
                <unsolved-task-list
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
                :taskBlockWidth="taskBlockWidth"
                @updateUnsolvedTasks="updateTasks"
                @solveTasks="massSolve"
                @deleteTasks="massDelete"
                @editTask="editTask"
                @saveTask="saveTask"
                @cancelEdit="cancelEdit"
              />
            </div>
          </div>
          <div v-if="page === 2 && !isGraphMode">
            <solved-task-list
              :tasks="solvedTasks"
              :taskListName="selectedList"
            />
          </div>
        </main>
        <!-- <div class="empty-block"></div> -->
        <footer class="todo-wrapper__footer" v-if="page === 1 && !isGraphMode">
          <add-task-form
            class="add-task-form"
            :recognizedString="recognizedString"
            @addTask="add"
            @voiceRecognition="startVoiceRecognition"
          ></add-task-form>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

import AddTaskForm from "./components/AddTaskForm.vue";
import FilterPanel from "./components/FilterPanel.vue";
import UnsolvedTaskList from "./components/UnsolvedTaskList.vue";
import DraggableTaskList from "./components/DraggableTaskList.vue";
import ChartBlock from "./components/ChartBlock.vue";
import SolvedTaskList from "./components/SolvedTaskList.vue";
import MainMenu from "./components/MainMenu.vue";

export default {
  name: "App",

  components: {
    AddTaskForm,
    FilterPanel,
    UnsolvedTaskList,
    DraggableTaskList,
    ChartBlock,
    SolvedTaskList,
    MainMenu,
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
      isGraphMode: false,
      showMainMenu: true,
      selectedList: "",
    };
  },
  created: function () {},
  mounted: function () {
    this.readDataFromLocalStorage();
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
    percentageCompletedTasks() {
      if (this.unsolvedTasks.length + this.solvedTasks.length !== 0) {
        return (
          (this.solvedTasks.length /
            (this.unsolvedTasks.length + this.solvedTasks.length)) *
          100
        ).toFixed(2);
      } else {
        return 0;
      }
    },
  },

  methods: {
    selectList(list) {
      this.page = 1;
      this.selectedList = list;
      this.readDataFromLocalStorage();
    },
    readDataFromLocalStorage() {
      const unsolvedTasksData = localStorage.getItem(
        `${this.selectedList} unsolved`
      );
      if (unsolvedTasksData) {
        this.unsolvedTasks = JSON.parse(unsolvedTasksData);
      } else {
        this.unsolvedTasks = [];
      }
      const solvedTasksData = localStorage.getItem(
        `${this.selectedList} solved`
      );
      if (solvedTasksData) {
        this.solvedTasks = JSON.parse(solvedTasksData);
      } else {
        this.solvedTasks = [];
      }
    },
    massDelete(tasks) {
      console.log(tasks);
      const tasksToDelTitles = tasks.map((t) => t.title);
      console.log(tasksToDelTitles);
      this.unsolvedTasks = this.unsolvedTasks.filter(
        (t) => !tasksToDelTitles.includes(t.title)
      );
      if (this.unsolvedTasks.length === 0) {
        this.editingTasks = false;
      }
    },
    massSolve(tasks) {
      console.log(tasks);
      this.solvedTasks = [...this.solvedTasks, ...tasks];
      localStorage.setItem(
        `${this.selectedList} solved`,
        JSON.stringify(this.solvedTasks)
      );
      this.massDelete(tasks);
    },
    closeMenu() {
      this.showExtraFeatures = false;
    },
    closeFindPopup(filter) {
      this.showFindPopup = false;
      this.filter = filter;
    },
    returnTasksToStandartPosition() {
      this.unsolvedTasks.forEach((t) => {
        t.swipeLeft = 0;
        t.swipeLeftOffsetX = 0;
      });
    },
    toggleSwitch() {
      this.isGraphMode = !this.isGraphMode;
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
        checked: false,
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
      localStorage.setItem(
        `${this.selectedList} solved`,
        JSON.stringify(this.solvedTasks)
      );
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
          `${this.selectedList} unsolved`,
          JSON.stringify(this.unsolvedTasks)
        );
      },
      deep: true,
    },
    selectedList() {
      console.log(this.selectedList);
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

.switch {
  width: 80px;
  height: 40px;
  background-color: #fff;
  border-radius: 20px;
  position: relative;
  transition: background-color 0.3s ease;
}

.switch.active {
  background-color: #7fc33e;
}
/* .menu {
  background-color: #f9f9f9;
  padding: 10px;
  position: absolute;
  top: 40px;
  right: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
} */
.switch:before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgb(31, 188, 211);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.switch.active:before {
  transform: translateX(40px);
}

.page {
  /* width: 100vh; */
  background: linear-gradient(
    137deg,
    #75f6ff,
    #14fbff
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.page-blocks {
  display: flex;
  justify-content: center;
}
.main-menu {
  width: 300px;
  min-height: 100vh;
}
.todo-wrapper {
  max-width: 800px;
  min-width: 600px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

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
  align-items: center;
}

.first-string__second-half {
  display: flex;
  gap: 30px;
  align-items: center;
}
.first-string__burger-icon {
  width: 64px;
  height: 64px;
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
  box-shadow: rgba(14, 30, 37, 0.12) 0px -2px 4px 0px,
    rgba(14, 30, 37, 0.32) 0px -2px 16px 0px;
}
.first-string__title {
  color: #fff;
  display: flex;
  flex: 1 1 0;
  font-size: 60px;
  justify-content: center;
}

.edit-tasks-button {
  display: inline-block;
  padding: 7px 14px;
  font-size: 16px;
  background-color: rgb(31, 188, 211);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.edit-tasks-button:hover {
  background-color: rgb(14, 144, 163);
}

/* Эффект при активации */
.edit-tasks-button:active {
  background-color: rgb(7, 90, 102);
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
.chart-block {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  align-items: center;
}
.chart-block__chart {
  padding-top: 80px;
  margin-bottom: 10px;
}
.chart-block__text {
  font-size: 40px;
  color: #fff;
}
/* Кастомизировать графу done. Кастомизировать графу Edit. Добавить картинку в background для кнопки показать график. Сделать чтобы поиск убирался при переходя в какое либо другое поле. Сделать менюшку бургера(там будут все списки задач и управление аккаунтом пользоваьеля). Кастомизировать поле редактирования задачи*/
</style>
