<template>
  <div
    class="menu-block"
    ref="taskListName"
    @mouseover="showScrollbar = true"
    @mouseout="showScrollbar = false"
  >
    <div class="menu-block__account-info">
      <div
        class="text menu-block__title"
        :style="{ width: `${taskBlockWidth - 32 - 20}px` }"
      >
        {{ loggedInAccount }}
      </div>
      <img
        class="menu-block__logout-button"
        src="@/icon/log-out-icon.png"
        @click="logOut"
      />
    </div>
    <div class="all-lists" ref="allLists">
      <transition-group name="list-catalog" tag="div" appear>
        <div v-for="(taskList, index) in taskListCatalog" :key="index">
          <div class="list-catalog" :style="listStyles">
            <div
              class="list-catalog__list-name text"
              :class="{
                'list-catalog__selected-list': selectedList === taskList,
              }"
              @click="selectedList = taskList"
            >
              {{ taskList.title }}
            </div>
            <div class="list-catalog__delete-button-field">
              <div>
                <img
                  class="list-catalog__delete-button"
                  src="@/icon/delete.png"
                  @click="deleteTaskList(taskList.id, index)"
                />
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
    <button
      class="text menu-block__create-button"
      v-if="!addingTask"
      @click="addingTask = true"
    >
      Add list
    </button>
    <div class="add-new-list-field" v-if="addingTask">
      <input
        class="add-new-list-field__input"
        type="text"
        v-model="taskListName"
        v-focus
        @keydown.enter="saveTaskList"
        @keydown.esc="cancelInputField"
      />
      <img
        class="add-new-list-field__cancel-button"
        src="@/icon/delete.png"
        @click="cancelInputField"
      />

      <img
        class="add-new-list-field__save-button"
        src="../icon/saveIcon.png"
        alt=""
        @click="saveTaskList"
      />
    </div>
  </div>
</template>
<script>
import focusDirective from "../directives/focus.js";
import apiService from "@/apiService";
export default {
  directives: {
    focus: focusDirective,
  },
  data() {
    return {
      taskListCatalog: [],
      addingTask: false,
      taskListName: "",
      taskBlockWidth: 0,
      selectedList: [],
      loggedInAccount: "",
      showScrollbar: false,
      isScrollbarVisible: true,
      userId: 0,
    };
  },
  emits: {
    selectedList: (list) => typeof list === "object",
  },
  props: {},
  created() {
    let data = localStorage.getItem("loggedInUser");
    if (data) {
      this.loggedInAccount = data;
    } else {
      data = sessionStorage.getItem("loggedInUser");
      this.loggedInAccount = data;
    }
    apiService
      .getUserIdByEmail(this.loggedInAccount)
      .then((response) => {
        this.userId = response.data.userId;
        this.getListCatalogByUserIdFromDB();
      })

      .catch((error) => {
        console.error("Ошибка при получении данных:", error);
      });
  },
  mounted() {
    this.taskBlockWidth = this.$refs.taskListName.clientWidth;
  },
  computed: {
    listStyles() {
      return {
        width: `${this.taskBlockWidth - 20 - 8}px`,
        marginRight:
          this.showScrollbar && this.isScrollbarVisible ? "2px" : "10px",
      };
    },
  },
  methods: {
    updateTaskListInDB(id, title) {
      apiService
        .updateTaskList(id, title)
        .then(() => {})
        .catch((error) => {
          console.error("Ошибка при обновлении списка задач:", error);
        });
    },
    getListCatalogByUserIdFromDB() {
      apiService
        .getAllTaskListsByUserId(this.userId)
        .then((response) => {
          this.taskListCatalog = response.data;
          if (this.taskListCatalog[0]) {
            this.selectedList = this.taskListCatalog[0];
          } else {
            this.selectedList = undefined;
          }
        })
        .catch((error) => {
          console.error("Ошибка при получении данных:", error);
        });
    },
    checkScrollbarVisibility() {
      const element = this.$refs.allLists;

      if (element.scrollHeight > element.clientHeight) {
        this.isScrollbarVisible = true;
      } else {
        this.isScrollbarVisible = false;
      }
    },
    logOut() {
      localStorage.removeItem("loggedInUser");
      sessionStorage.removeItem("loggedInUser");
      location.reload();
    },
    cancelInputField() {
      this.taskListName = "";
      this.addingTask = false;
    },
    saveTaskList() {
      if (this.taskListName) {
        const newListData = {
          title: this.taskListName,
          user_id: this.userId,
        };

        apiService
          .createTaskList(newListData)
          .then(() => {
            this.getListCatalogByUserIdFromDB();
          })
          .catch((error) => {
            console.error("Ошибка при создании списка задач:", error);
          });
      }
      this.taskListName = "";
      this.addingTask = false;
    },
    deleteTaskList(taskListId, index) {
      apiService
        .deleteAllUncompletedTasksFromDB(taskListId)
        .then(() => {
          apiService
            .deleteAllCompletedTasksFromDB(taskListId)
            .then(() => {
              apiService
                .deleteTaskList(taskListId)
                .then(() => {
                  this.getListCatalogByUserIdFromDB();
                })
                .catch((error) => {
                  console.error("Ошибка при создании списка задач:", error);
                });
            })
            .catch((error) => {
              console.error(
                "Ошибка при удалении всех решенных задач, связанных с удаляемым списком:",
                error
              );
            });
        })
        .catch((error) => {
          console.error(
            "Ошибка при удалении всех нерешенных задач, связанных с удаляемым списком:",
            error
          );
        });

      if (this.taskListCatalog[index]) {
        this.selectedList = this.taskListCatalog[index];
      } else {
        this.selectedList = this.taskListCatalog[0];
      }
    },
  },
  watch: {
    taskListCatalog: {
      handler() {
        this.$nextTick(() => {
          this.checkScrollbarVisibility();
        });
        if (this.taskListCatalog.length === 0) {
          this.selectedList = undefined;
        }
      },
      deep: true,
    },
    selectedList: {
      handler(newValue, oldValue) {
        // handler() {
        if (newValue && oldValue) {
          if (newValue.id === oldValue.id) {
            this.updateTaskListInDB(newValue.id, newValue.title);
          }
        }
        if (this.selectedList === undefined) {
          this.selectedList = { listName: "Not selected", id: -1 };
        }

        this.$emit("selectedList", this.selectedList);
      },
      deep: true,
    },
    userId() {
      console.log(this.userId);
    },
  },
};
</script>
<style scoped>
.list-catalog-move,
.list-catalog-leave-active,
.list-catalog-enter-active {
  transition: opacity 0.5s ease;
}
.list-catalog-leave-active {
}
.list-catalog-enter-from {
  opacity: 0;
}
.list-catalog-leave-to {
  opacity: 0;
}
.menu-block {
  background-color: rgb(31, 188, 211);
  padding: 5px 10px 0px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.menu-block__account-info {
  display: flex;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
}
.menu-block__title {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
}
.text {
  background-color: rgb(31, 188, 211);

  font-size: 36px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
}
.menu-block__logout-button {
  height: 32px;
}
.all-lists {
  margin: 10px 0px;
  overflow-y: hidden;
  overflow-x: hidden;
  flex: 1 1 0;
}

.all-lists::-webkit-scrollbar {
  width: 8px;
}
.menu-block:hover .all-lists {
  overflow-y: auto;
}
.all-lists::-webkit-scrollbar-thumb {
  background-color: white;
  border-radius: 4px;
}

.all-lists::-webkit-scrollbar-thumb:hover {
  background-color: gray;
}

.all-lists::-webkit-scrollbar-track {
  background-color: #dddcdc;
  border-radius: 4px;
}
/* .list-catalog {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 10px;
  padding-left: 10px;
  padding-right: 2px;
  height: 100%;
} */
.list-catalog {
  display: grid; /* Используем grid контейнер */
  grid-template-columns: 1fr auto; /* Два столбца: один занимает всю доступную ширину, второй минимальной ширины */
  position: relative;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 2px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
}
.all-lists:last-child {
  margin-bottom: 0px;
}
.list-catalog__list-name {
  padding: 5px;
  border-radius: 10px 0px 0px 10px;
}

.list-catalog__delete-button-field {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: red;
  border-radius: 0px 10px 10px 0px;
}

.list-catalog__delete-button {
  width: 32px;
  height: 32px; /* Установите фиксированную высоту для кнопки */
}

.list-catalog__selected-list {
  background-color: #1595ac;
}

.menu-block__create-button {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
  padding: 5px;
  width: 100%;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
}
.add-new-list-field {
  display: flex;
  width: 100%;
  padding: 0px 5px;
  margin-bottom: 5px;
  gap: 5px;
  align-items: center;
}
.add-new-list-field__input {
  background-color: rgb(31, 188, 211);
  color: #fff;
  font-size: 36px;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 5px;
  border-radius: 10px;
}
.add-new-list-field__cancel-button {
  height: 32px;
}
.add-new-list-field__save-button {
  background-color: rgb(31, 188, 211);
  height: 32px;
}
</style>
