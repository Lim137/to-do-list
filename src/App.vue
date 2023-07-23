<template>
  <div class="todo-wrapper">
    <h1>TODO</h1>
    <hr />
    <div class="filter-block">
      <div class="filter-block__title">Фильтр:</div>
      <input
        class="filter-block__input-field"
        type="text"
        v-model="filter"
        :disabled="isEmptyTaskList"
      />
      <button class="filter-block__cancel-button" @click="filter = ''">
        X
      </button>
    </div>
    <hr />
    <div v-if="!editingTasks">
      <button class="edit-tasks-button" @click="editingTasks = true">
        Редактировать
      </button>
    </div>
    <div v-else>
      <button class="edit-tasks-button" @click="editingTasks = false">
        Отмена
      </button>
    </div>
    <hr />
    <div v-if="!editingTasks">
      <div class="tasks-block">
        <div v-for="(task, index) in filteredTasks" :key="task.id">
          <div
            v-if="!task.editing"
            v-drag="(event) => dragHandler(event, task)"
            :style="{
              transform:
                task.swipeLeftOffsetX !== 0
                  ? `translateX(${task.swipeLeftOffsetX}px)`
                  : task.swipeRightOffsetX !== 0
                  ? `translateX(${task.swipeRightOffsetX}px)`
                  : 'translateX(0px)',
            }"
            :class="task.swipeRightOffsetX === 0 ? 'move-transition' : ''"
          >
            <div class="task-block">
              <div v-if="task.swipeRight === 1">
                <img src="./icon/solve.png" class="task__solve-img" alt="" />
              </div>

              <button class="text-button">
                {{ index + 1 }}. {{ task.title }}
              </button>
              <img
                src="./icon/editing.png"
                class="task__icon-edit"
                @click="editTask(task)"
              />
              <img
                v-if="task.swipeLeft === -1"
                src="./icon/delete.png"
                class="task__icon task__icon_delete"
                @click="deleteTask(task)"
                ref="deleteImg"
              />
            </div>
          </div>
          <div v-if="task.editing" class="edit-block">
            <input
              class="edit-block__editing-field"
              type="text"
              v-model="task.editingText"
              v-focus
              @keydown.esc="cancelEdit(task)"
              @keydown.enter="saveTask(task)"
            />
            <button class="edit-block__save-button" @click="saveTask(task)">
              Сохранить
            </button>
            <button class="edit-block__cancel-button" @click="cancelEdit(task)">
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <draggable v-model="unsolvedTasks" :options="dragOptions" item-key="id">
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
                    @change="updateTask(element)"
                  />
                  <span @click="editTask(element)">{{ element.title }}</span>
                </label>

                <button @click="editTask(element)">edit</button>
                <button
                  class="task__delete-button"
                  @click="deleteTask(element)"
                >
                  delete
                </button>
              </div>
            </div>
            <div v-if="element.editing">
              <input
                type="text"
                v-model="element.editingText"
                v-focus
                @keydown.esc="cancelEdit(element)"
                @keydown.enter="saveTask(element)"
              />
              <button @click="saveTask(element)">Сохранить</button>
              <button @click="cancelEdit(element)">Отмена</button>
            </div>
          </div>
        </template>
      </draggable>
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
        <img
          src="./icon/voice-button.png"
          v-if="isEnabledSpeechApi"
          @click="startVoiceRecognition"
          alt=""
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
import draggable from "vuedraggable";
import { v4 as uuidv4 } from "uuid";
import focusDirective from "./directives/focus.js";

export default {
  name: "App",
  directives: {
    focus: focusDirective,
  },
  components: {
    draggable,
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
      isDragging: false,
      editingTasks: false,
      isEnabledSpeechApi: false,
    };
  },
  created: function () {
    const tasksData = localStorage.getItem("unsolvedTasks");
    if (tasksData) {
      this.unsolvedTasks = JSON.parse(tasksData);
    }

    this.isEnabledSpeechApi = "webkitSpeechRecognition" in window;
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
    log() {
      console.log("hello");
    },

    dragHandler(event, task) {
      const { movement: x, dragging, memo, distance, direction } = event;
      console.log("memo = ", memo);

      // обработка стрейфа влево
      if (task.swipeRightOffsetX === 0) {
        if (x[0] < 0 && x[0] > -50) {
          task.swipeLeftOffsetX = x[0];
        }

        if (task.swipeLeft === -1) {
          if (distance >= 40 && direction[0] === 1) {
            task.swipeLeft = 0;
          }
        }
        if (task.swipeLeftOffsetX < 0) {
          if (distance > 40 && direction[0] === -1) {
            task.swipeLeft = -1;
          }
        }
        if (!dragging) {
          if (task.swipeLeft === -1) {
            task.swipeLeftOffsetX = -40;
          } else if (task.swipeLeft === 0) {
            task.swipeLeftOffsetX = 0;
            return;
          }
        }
      }

      // обработка стрейфа вправо
      if (task.swipeLeftOffsetX === 0) {
        if (task.swipeLeftOffsetX === 0) {
          console.log(task.swipeLeftOffsetX);
        }

        if (x[0] > 0) {
          task.swipeRightOffsetX = x[0];
          if (distance > 100) {
            task.swipeRight = 1;
          } else {
            task.swipeRight = 0;
          }
        }
        if (!dragging) {
          if (x[0] <= 99) {
            task.swipeRightOffsetX = 0;
            task.swipeRight = 0;
            return;
          }
        }
      }
      return task.swipeLeft;
    },
    addToVariable(value, swipeStatus) {
      swipeStatus += value;

      // Проверяем и ограничиваем значение переменной
      if (swipeStatus > 1) {
        swipeStatus = 1;
      } else if (swipeStatus < -1) {
        swipeStatus = -1;
      }
      return swipeStatus;
    },
    startVoiceRecognition() {
      // Начать распознавание речи

      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "ru-RU";

      recognition.onresult = (event) => {
        const taskName = event.results[0][0].transcript;
        this.taskTitle = taskName;
      };
      recognition.onspeechend = () => {
        recognition.stop();
      };

      recognition.start();
    },
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
        swipeLeftOffsetX: 0,
        showDeleteButton: false,
        swipeLeft: 0,
        swipeRightOffsetX: 0,
        swipeRight: 0,
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
    updateTask(task) {
      this.solvedTasks.push(task);
      console.log(this.solvedTasks);
      this.unsolvedTasks = this.unsolvedTasks.filter((t) => t !== task);
      localStorage.setItem("unsolvedTasks", JSON.stringify(this.unsolvedTasks));
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
.todo-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  font-size: 36px;
}
.filter-block {
  display: flex;
}
.filter-block__title {
  font-size: 36px;
  margin-right: 8px;
}
.filter-block__input-field {
  font-size: 36px;
}
.filter-block__cancel-button {
  font-size: 36px;
}
.edit-tasks-button {
  font-size: 36px;
}
.task {
  width: 800px;
}
.task-block {
  height: 40px;
  display: flex;
  margin-top: 8px;
}
.task__title {
  align-self: center;
  margin-right: 10px;
}

.task__icon-edit {
  align-self: center;
  margin-top: -4px;
  margin-left: 6px;
  height: 40px;
  width: 40px;
}
.task__icon_delete {
  margin-left: 6px;
  align-self: center;
  height: 40px;
  width: 40px;
}
.task__solve-img {
  display: flex;
  padding-right: 6px;
  height: 40px;
  width: 40px;
  align-self: center;
}
.tasks-block {
  font-size: 36px;
}

.edit-block {
  display: flex;
}
.edit-block__editing-field {
  font-size: 36px;
}
.edit-block__save-button {
  font-size: 36px;
}
.edit-block__cancel-button {
  font-size: 36px;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
}

.text-button {
  position: relative;
  font-size: 36px;
  border: 0;
  background-color: #fff;
}

.move-transition {
  transition: transform 0.3s ease;
}

.input-wrapper__input-container {
  display: flex;
  align-items: center;
}

.input-wrapper__input {
  flex: 1;
  font-size: 36px;
}

.input-wrapper__clear-button {
  font-size: 36px;
}

.input-wrapper__add-button {
  margin-top: 10px;
  height: 30px;
}
</style>
