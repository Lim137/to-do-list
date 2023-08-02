<template>
  <div class="tasks-block">
    <transition-group
      name="task-list"
      tag="div"
      appear
      transition="opacity 0.5s"
    >
      <div v-for="(task, index) in filteredTasks" :key="task.id">
        <div
          v-if="!task.editing"
          v-drag="(event) => dragHandler(event, task)"
          :class="task.swipeRightOffsetX === 0 ? 'move-transition' : ''"
        >
          <div class="task-block">
            <div v-if="task.swipeRight === 1">
              <img src="../icon/solve.png" class="task__solve-img" alt="" />
            </div>

            <button
              class="text-button"
              :style="{
                transform:
                  task.swipeLeftOffsetX !== 0
                    ? `translateX(${task.swipeLeftOffsetX}px)`
                    : task.swipeRightOffsetX !== 0
                    ? `translateX(${task.swipeRightOffsetX}px)`
                    : 'translateX(0px)',
              }"
            >
              {{ index + 1 }}. {{ task.title }}
            </button>
            <div class="task-block__image-conteiner">
              <img
                src="../icon/editing.png"
                class="task-block__icon task-block__icon_z-index-2"
                @click="$emit('editTask', task)"
                :style="{
                  transform:
                    task.swipeLeftOffsetX !== 0
                      ? `translateX(${task.swipeLeftOffsetX}px)`
                      : task.swipeRightOffsetX !== 0
                      ? `translateX(${task.swipeRightOffsetX}px)`
                      : 'translateX(0px)',
                }"
              />
              <img
                v-if="task.swipeRightOffsetX === 0"
                src="../icon/delete.png"
                class="task-block__icon"
                @click="$emit('deleteTask', task)"
              />
            </div>
          </div>
        </div>
        <div v-if="task.editing" class="edit-block">
          <input
            class="edit-block__editing-field"
            type="text"
            v-model="task.editingText"
            v-focus
            @keydown.esc="$emit('cancelEdit', task)"
            @keydown.enter="$emit('saveTask', task)"
          />
          <button
            class="edit-block__save-button"
            @click="$emit('saveTask', task)"
          >
            Save
          </button>
          <button
            class="edit-block__cancel-button"
            @click="$emit('cancelEdit', task)"
          >
            Cancel
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import focusDirective from "../directives/focus.js";
export default {
  // :class="task.swipeRight === 1 ? 'task__solve-img-show' : ''"
  directives: {
    focus: focusDirective,
  },
  props: {
    filteredTasks: {
      type: Object,
      required: true,
    },
  },
  emits: {
    solveTask: (task) => typeof task === "object",
    deleteTask: (task) => typeof task === "object",
    editTask: (task) => typeof task === "object",
    cancelEdit: (task) => typeof task === "object",
    saveTask: (task) => typeof task === "object",
  },
  methods: {
    dragHandler(event, task) {
      const { movement: x, dragging, distance, direction } = event;
      // обработка стрейфа влево
      if (task.swipeRightOffsetX === 0) {
        // if (x[0] < task.swipeLeftOffsetX && x[0] > -50 && direction[0] === -1) {
        //   task.swipeLeftOffsetX = x[0];
        // }
        if (direction[0] === -1 && task.swipeLeftOffsetX - 1 > -50) {
          task.swipeLeftOffsetX = task.swipeLeftOffsetX - 1;
        }
        if (task.swipeLeft === -1) {
          if (distance >= 5 && direction[0] === 1) {
            task.swipeLeft = 0;
          }
        }
        if (
          direction[0] === 1 &&
          task.swipeLeftOffsetX + 1 < 0 &&
          task.swipeLeftOffsetX !== 0
        ) {
          task.swipeLeftOffsetX = task.swipeLeftOffsetX + 1;
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
        console.log(task.swipeLeftOffsetX);
      }
      // обработка стрейфа вправо
      if (task.swipeLeftOffsetX === 0) {
        if (x[0] > 0) {
          task.swipeRightOffsetX = x[0];
          if (distance > 40) {
            task.swipeRight = 1;
            task.swipeRightOffsetX -= 40;
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
          if (task.swipeRight === 1) {
            this.$emit("solveTask", task);
          }
        }
      }
      return task.swipeLeft;
    },
  },
};
</script>
<style scoped>
.task-list-move,
.task-list-leave-active,
.task-list-enter-active {
  transition: all 0.5s ease;
}
.task-list-leave-active {
  position: absolute;
}
.task-list-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.task-list-leave-to {
  opacity: 0;
}
.tasks-block {
  background-color: #fff;
  overflow: hidden;
  font-size: 36px;
}
.move-transition {
  transition: transform 0.3s ease;
}

.task-block {
  height: 40px;
  display: flex;
  margin: 10px 0px;
}
.task-block:first-child {
  margin-top: 2px;
}
.task__solve-img {
  display: flex;
  height: 40px;
  width: 40px;
  align-self: center;
  transition: all 0.5s ease;
}
.text-button {
  position: relative;
  font-size: 36px;
  border: 0;
  background-color: transparent;
}
.task-block__image-conteiner {
  position: relative;
  width: 40px;
  height: 40px;
}
.task-block__icon {
  width: 100%;
  height: auto;
  position: absolute;
  top: 0;
  left: 0;
}
.task-block__icon_z-index-2 {
  z-index: 1;
}
.edit-block {
  display: flex;
  font-size: 36px;
}
/* .edit-block__editing-field {
  font-size: 36px;
}
.edit-block__save-button {
  font-size: 36px;
}
.edit-block__cancel-button {
  font-size: 36px;
} */
</style>
