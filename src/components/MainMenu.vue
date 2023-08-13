<template>
  <div class="menu-block" ref="taskListName">
    <div class="text menu-block__title">Account_info@gmail.com</div>
    <transition-group
      name="list-catalog"
      tag="div"
      appear
      transition="opacity 0.5s"
    >
      <div v-for="(taskList, index) in taskListCatalog" :key="index">
        <div class="list-catalog" :style="{ width: `${taskBlockWidth}px` }">
          <div
            class="list-catalog__list-name text"
            @click="selectedList = taskList"
          >
            {{ taskList }}
          </div>

          <img
            class="list-catalog__delete-button"
            src="../icon/delete.png"
            @click="deleteTaskList(taskList, index)"
          />
        </div>
      </div>
    </transition-group>
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
      />
      <button
        class="add-new-list-field__cancel-button"
        @click="cancelInputField"
      >
        ✕
      </button>
      <button @click="saveTaskList">
        <img
          class="add-new-list-field__save-button"
          src="../icon/saveIcon.png"
          alt=""
        />
      </button>
    </div>
  </div>
</template>
<script>
import focusDirective from "../directives/focus.js";
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
      selectedList: "",
    };
  },
  emits: {
    selectedList: (list) => typeof list === "string" || list === undefined,
  },
  props: {},
  created() {
    const taskListCatalogData = localStorage.getItem("taskListCatalog");
    if (taskListCatalogData) {
      this.taskListCatalog = JSON.parse(taskListCatalogData);
      this.selectedList = this.taskListCatalog[0];
    }
  },
  mounted() {
    this.taskBlockWidth = this.$refs.taskListName.clientWidth;
  },
  methods: {
    cancelInputField() {
      this.taskListName = "";
      this.addingTask = false;
    },
    saveTaskList() {
      if (this.taskListName) {
        this.taskListCatalog.push(this.taskListName);
        this.selectedList = this.taskListName;
      }

      this.taskListName = "";
      this.addingTask = false;
    },
    deleteTaskList(taskList, index) {
      this.taskListCatalog = this.taskListCatalog.filter(
        (list) => list !== taskList
      );
      this.deleteFromLocalStorage(taskList);
      if (this.taskListCatalog[index]) {
        this.selectedList = this.taskListCatalog[index];
      } else if (this.taskListCatalog[0]) {
        this.selectedList = this.taskListCatalog[0];
      }
      if (this.taskListCatalog.length === 0) {
        this.selectedList = "Not selected";
      }
    },
    deleteFromLocalStorage(taskList) {
      localStorage.removeItem(`${taskList} solved`);
      localStorage.removeItem(`${taskList} unsolved`);
    },
  },
  watch: {
    taskListCatalog: {
      handler() {
        localStorage.setItem(
          "taskListCatalog",
          JSON.stringify(this.taskListCatalog)
        );
      },
      deep: true,
    },
    selectedList() {
      if (this.selectedList === undefined) {
        this.selectedList = "Not selected";
      }
      this.$emit("selectedList", this.selectedList);
    },
  },
};
</script>
<style scoped>
.list-catalog-move,
.list-catalog-leave-active,
.list-catalog-enter-active {
  transition: all 0.5s ease;
}
.list-catalog-leave-active {
}
.list-catalog-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.list-catalog-leave-to {
  opacity: 0;
}
.menu-block {
  background-color: rgb(31, 188, 211);

  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.menu-block__title {
  width: 100%;
  padding: 15px;
}
.text {
  background-color: rgb(31, 188, 211);

  font-size: 36px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #fff;
}
.list-catalog {
  display: flex;
  height: 40px;
  position: relative;
  /* width: 300px; */
}

.list-catalog__list-name {
  flex: 1 1 0;
}
.list-catalog__delete-button {
  width: 40px;
}
.menu-block__create-button {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
  padding: 5px;
  width: 100%;
  margin-left: 5px;
  margin-right: 5px;
}
.add-new-list-field {
  height: 40px;
  display: flex;
  width: 100%;
  padding: 0px 5px;
}
.add-new-list-field__input {
  background-color: rgb(31, 188, 211);
  color: #fff;
  font-size: 36px;
  width: 100%;
}
.add-new-list-field__cancel-button {
  width: 40px;
}
.add-new-list-field__save-button {
  height: 40px;
}
/* 1. Сделать чтобы при отображении графика и перелистывании списка график тоже менялся (если не получится можно сделать чтобы при перелистывании график скрывался)
   2. Кастомизация блоков текста во всем приложении
   3. Сделать возможность менять название листов задач
   4. Авторизация и регистрация*/
</style>
