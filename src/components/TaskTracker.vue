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
                src="@/icon/burger-menu.png"
                alt=""
                @click="showMainMenu = !showMainMenu"
              />
              <input
                class="first-string__title"
                v-model="selectedList.title"
                :disabled="selectedList.id === -1"
              />
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
                  src="@/icon/additionally.png"
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
                  :taskBlockWidth="taskBlockWidth - 20"
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
                :taskBlockWidth="taskBlockWidth - 20"
                @updateUnsolvedTasks="updateTasks"
                @solveTasks="massSolve"
                @deleteTasks="massDelete"
                @editTask="editTask"
                @saveTask="saveTask"
                @cancelEdit="cancelEdit"
                @taskMoved="updateAllUnsolvedTasksInDB"
              />
            </div>
          </div>
          <div v-if="page === 2 && !isGraphMode">
            <solved-task-list
              :tasks="solvedTasks"
              :taskListId="selectedList.id"
            />
          </div>
        </main>
        <footer
          class="todo-wrapper__footer"
          v-if="page === 1 && !isGraphMode && selectedList.id !== -1"
        >
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
import AddTaskForm from "./AddTaskForm.vue";
import FilterPanel from "./FilterPanel.vue";
import UnsolvedTaskList from "./UnsolvedTaskList.vue";
import DraggableTaskList from "./DraggableTaskList.vue";
import ChartBlock from "./ChartBlock.vue";
import SolvedTaskList from "./SolvedTaskList.vue";
import MainMenu from "./MainMenu.vue";
import apiService from "@/apiService";

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
      selectedList: [],
      editingTitle: false,
      listName: "",
    };
  },
  created: function () {},
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
  maxSolvedTasksInList: 25,
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
    // normalizedSolvedTasksList() {
    //   if (this.solvedTasks.length > this.$options.maxTasksInList) {
    //     return this.solvedTasks.slice(
    //       this.solvedTasks.length - this.$options.maxTasksInList
    //     );
    //   } else {
    //     return this.solvedTasks;
    //   }
    // },
  },

  methods: {
    selectList(list) {
      this.page = 1;
      this.selectedList = list;
    },
    updateAllUnsolvedTasksInDB() {
      apiService
        .deleteAllUncompletedTasksFromDB(this.selectedList.id)
        .then(() => {
          this.uploadUnsolvedTasksToDatabase();
        })
        .catch((error) => {
          console.error("Ошибка при удалении всех нерешенных задач:", error);
        });
    },
    uploadUnsolvedTasksToDatabase() {
      const uploadData = this.unsolvedTasks.map((task) => {
        return {
          list_id: task.list_id,
          title: task.title,
        };
      });
      uploadData.forEach((task) => {
        apiService
          .createTask(task)
          .then(() => {})
          .catch((error) => {
            console.error("Ошибка при создании задачи:", error);
          });
      });
    },
    readLastAddedUnsolvedTask() {
      apiService
        .getAllUncompletedTasksByListId(this.selectedList.id)
        .then((response) => {
          const data = response.data;
          const lastAddedTask = data[data.length - 1];

          lastAddedTask.editing = false;
          lastAddedTask.editingText = lastAddedTask.title;
          lastAddedTask.swipeLeftOffsetX = 0;
          lastAddedTask.showDeleteButton = false;
          lastAddedTask.swipeLeft = 0;
          lastAddedTask.swipeRightOffsetX = 0;
          lastAddedTask.swipeRight = 0;
          lastAddedTask.checked = false;

          this.unsolvedTasks.push(lastAddedTask);
        })
        .catch((error) => {
          console.error("Ошибка при получении данных:", error);
        });
    },
    readUnsolvedTasksFromDB() {
      apiService
        .getAllUncompletedTasksByListId(this.selectedList.id)
        .then((response) => {
          const data = response.data;

          data.forEach((task) => {
            task.editing = false;
            task.editingText = task.title;
            task.swipeLeftOffsetX = 0;
            task.showDeleteButton = false;
            task.swipeLeft = 0;
            task.swipeRightOffsetX = 0;
            task.swipeRight = 0;
            task.checked = false;
          });

          this.unsolvedTasks = data;
        })
        .catch((error) => {
          console.error("Ошибка при получении данных:", error);
        });
    },
    readSolvedTasksFromDB() {
      apiService
        .getAllCompletedTasksByListId(this.selectedList.id)
        .then((response) => {
          const data = response.data;
          this.solvedTasks = data;
        })
        .catch((error) => {
          console.error("Ошибка при получении данных:", error);
        });
    },
    async readLastSolvedTask() {
      // apiService
      //   .getAllCompletedTasksByListId(this.selectedList.id)
      //   .then((response) => {
      //     const data = response.data;
      //     const lastSolvedTask = data[data.length - 1];

      //     this.solvedTasks.push(lastSolvedTask);
      //   })
      //   .catch((error) => {
      //     console.error("Ошибка при получении данных:", error);
      //   });
      try {
        const response = await apiService.getAllCompletedTasksByListId(
          this.selectedList.id
        );
        const data = response.data;
        const lastSolvedTask = data[data.length - 1];

        this.solvedTasks.push(lastSolvedTask);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    },
    updateAllSolvedTasksInDB() {
      apiService
        .deleteAllCompletedTasksFromDB(this.selectedList.id)
        .then(() => {
          this.uploadSolvedTasksToDatabase();
        })
        .catch((error) => {
          console.error("Ошибка при удалении всех решенных задач:", error);
        });
    },
    uploadSolvedTasksToDatabase() {
      const uploadData = this.solvedTasks.map((task) => {
        return {
          list_id: task.list_id,
          title: task.title,
        };
      });
      uploadData.forEach((task) => {
        apiService
          .addCompletedTask(task)
          .then(() => {})
          .catch((error) => {
            console.error("Ошибка при создании задачи:", error);
          });
      });
    },
    massDelete(tasks) {
      tasks.forEach((task) => this.deleteTask(task));
      if (this.unsolvedTasks.length === 0) {
        this.editingTasks = false;
      }
    },
    async massSolve(tasks) {
      for (const task of tasks) {
        await this.solveTask(task);
      }
      if (this.unsolvedTasks.length === 0) {
        this.editingTasks = false;
      }
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
      const newTask = {
        list_id: this.selectedList.id,
        title: task,
      };
      apiService
        .createTask(newTask)
        .then(() => {
          this.readLastAddedUnsolvedTask();
        })
        .catch((error) => {
          console.error("Ошибка при создании задачи:", error);
        });
    },
    deleteTask(task) {
      this.unsolvedTasks = this.unsolvedTasks.filter((t) => t.id !== task.id);
      apiService
        .deleteTask(task.id)
        .then(() => {})
        .catch((error) => {
          console.error("Ошибка при удалении нерешенной задачи:", error);
        });
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
    async solveTask(task) {
      // const { list_id, title } = task;
      // const solvedTask = { list_id, title };
      // if (this.selectedList.id === -1) {
      //   return;
      // }
      // apiService
      //   .addCompletedTask(solvedTask)
      //   .then(() => {
      //     this.readLastSolvedTask();
      //   })
      //   .catch((error) => {
      //     console.error("Ошибка при решении задачи:", error);
      //   });
      // this.unsolvedTasks = this.unsolvedTasks.filter((t) => t.id !== task.id);
      // apiService
      //   .deleteTask(task.id)
      //   .then(() => {})
      //   .catch((error) => {
      //     console.error(
      //       "Ошибка при удалении решенной задачи из списка нерешенных:",
      //       error
      //     );
      //   });
      // const { list_id, title } = task;
      // const solvedTask = { list_id, title };

      // if (this.selectedList.id === -1) {
      //   return;
      // }

      // try {
      //   await apiService.addCompletedTask(solvedTask);

      //   await this.readLastSolvedTask();
      //   this.unsolvedTasks = this.unsolvedTasks.filter((t) => t.id !== task.id);
      //   await apiService.deleteTask(task.id);
      const { list_id, title } = task;
      const solvedTask = { list_id, title };

      if (this.selectedList.id === -1) {
        return;
      }

      try {
        await apiService.addCompletedTask(solvedTask);

        await this.readLastSolvedTask();
        this.unsolvedTasks = this.unsolvedTasks.filter((t) => t.id !== task.id);
        await apiService.deleteTask(task.id);
        const completedTaskCount = await apiService.getCountOfCompletedTasks(
          this.selectedList.id
        );
        console.log(completedTaskCount.data.count);

        if (completedTaskCount.data.count > 100) {
          // Если количество решенных задач больше или равно 100, удалите самую раннюю задачу
          await apiService.deleteOldestCompletedTaskByListId(
            this.selectedList.id
          );
        }
      } catch (error) {
        console.error("Ошибка при решении задачи:", error);
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
      apiService
        .updateTask(task.id, task.title)
        .then(() => {})
        .catch((error) => {
          console.error("Ошибка при изменении списка задач:", error);
        });
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
        if (this.selectedList.id === -1) {
          return;
        }
      },
      deep: true,
    },
    selectedList: {
      handler() {
        if (this.selectedList.id === -1) {
          return;
        }
        this.readUnsolvedTasksFromDB();
        this.readSolvedTasksFromDB();
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
  border-radius: 10px;
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
  border-radius: 10px;
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
  background: linear-gradient(137deg, #75f6ff, #14fbff);
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
  width: 8px;
}
.todo-wrapper__main-block::-webkit-scrollbar-thumb {
  background-color: rgb(31, 188, 211);
  border-radius: 4px;
}

.todo-wrapper__main-block::-webkit-scrollbar-thumb:hover {
  background-color: rgb(25, 151, 170);
}

.todo-wrapper__main-block::-webkit-scrollbar-track {
  background-color: #dddcdc;
  border-radius: 4px;
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
  width: 100%;
  display: flex;
  background-color: rgb(31, 188, 211);
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
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.edit-tasks-button:hover {
  background-color: rgb(14, 144, 163);
}

.edit-tasks-button:active {
  background-color: rgb(7, 90, 102);
}
.navigation-block {
  display: flex;
  justify-content: space-between;
}
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
go to the server folderSample file contents .chart-block__chart {
  padding-top: 80px;
  margin-bottom: 10px;
}
.chart-block__text {
  font-size: 40px;
  color: #fff;
}
</style>
