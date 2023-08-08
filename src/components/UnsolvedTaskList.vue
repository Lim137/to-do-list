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
            <div v-if="task.swipeLeftOffsetX === 0">
              <div
                class="task__solve-block"
                :style="{
                  width: task.swipeRight,
                  opacity:
                    task.swipeRightOffsetX > 50 &&
                    task.swipeRight !== `${this.taskBlockWidth}px`
                      ? '0.5'
                      : '1',
                }"
                ref="solveBlock"
              >
                <img
                  src="../icon/check.png"
                  class="task__solve-img"
                  alt=""
                  ref="solveIcon"
                  :style="{
                    width:
                      task.swipeRightOffsetX < 41 ? task.swipeRight : '40px',
                  }"
                />
              </div>
            </div>
            <div
              class="text-button-block"
              :style="{
                transform:
                  task.swipeLeftOffsetX !== 0
                    ? `translateX(${task.swipeLeftOffsetX}px)`
                    : task.swipeRightOffsetX !== 0
                    ? `translateX(${task.swipeRightOffsetX}px)`
                    : 'translateX(0px)',
                opacity: task.swipeRightOffsetX > 50 ? '0.5' : '1',
              }"
            >
              <button class="text-button" ref="textButton">
                <div
                  class="text-button"
                  :style="{
                    width: `${
                      taskBlockWidth - Math.abs(task.swipeLeftOffsetX)
                    }px`,
                  }"
                  ref="textButton"
                >
                  {{ index + 1 }}. {{ task.title }}
                </div>
              </button>
            </div>

            <div
              class="task-block__image-conteiner"
              :style="{ width: task.swipeLeft }"
            >
              <div class="task-block__icon task-block__icon_bg-yellow">
                <img
                  src="../icon/editing.png"
                  @click="$emit('editTask', task)"
                />
              </div>
              <div class="task-block__icon task-block__icon_bg-red">
                <img
                  v-if="task.swipeRightOffsetX === 0"
                  src="../icon/delete.png"
                  @click="$emit('deleteTask', task)"
                />
              </div>
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
    taskBlockWidth: {
      type: Number,
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
      const { movement: x, dragging } = event;
      // обработка стрейфа влево
      if (task.swipeRightOffsetX === 0) {
        // if (x[0] < task.swipeLeftOffsetX && x[0] > -50 && direction[0] === -1) {
        //   task.swipeLeftOffsetX = x[0];
        // }

        //
        if (x[0] < 0) {
          task.swipeLeft = `${Math.abs(x[0])}px`;
          console.log(task.swipeLeft);
          task.swipeLeftOffsetX = x[0];
        }

        if (!dragging) {
          if (x[0] >= -10) {
            task.swipeLeftOffsetX = 0;
            task.swipeLeft = `0px`;
            return;
          } else {
            task.swipeLeft = `64px`;
            task.swipeLeftOffsetX = -65;
          }
        }
        //

        // if (direction[0] === -1 && task.swipeLeftOffsetX - 1 > -50) {
        //   task.swipeLeftOffsetX = task.swipeLeftOffsetX - 1;
        // }
        // if (task.swipeLeft === -1) {
        //   if (distance >= 5 && direction[0] === 1) {
        //     task.swipeLeft = 0;
        //   }
        // }
        // if (
        //   direction[0] === 1 &&
        //   task.swipeLeftOffsetX + 1 < 0 &&
        //   task.swipeLeftOffsetX !== 0
        // ) {
        //   task.swipeLeftOffsetX = task.swipeLeftOffsetX + 1;
        // }
        // if (task.swipeLeftOffsetX < 0) {
        //   if (distance > 40 && direction[0] === -1) {
        //     task.swipeLeft = -1;
        //   }
        // }

        // if (!dragging) {
        //   if (task.swipeLeft === -1) {
        //     task.swipeLeftOffsetX = -40;
        //   } else if (task.swipeLeft === 0) {
        //     task.swipeLeftOffsetX = 0;
        //     return;
        //   }
        // }
      }
      // обработка стрейфа вправо
      if (task.swipeLeftOffsetX === 0) {
        if (x[0] > 0 && x[0] < this.taskBlockWidth - 100) {
          task.swipeRight = `${Math.abs(x[0])}px`;
          task.swipeRightOffsetX = x[0];
          // console.log("solveBlock = ", this.$refs.solveBlock[0].clientWidth);
          // console.log("solveIcon = ", this.$refs.solveIcon[0].clientWidth);
          // console.log(distance);
          // console.log(task.swipeRightOffsetX);
          // if (distance > 41) {
          //   task.swipeRight = 1;
          //   task.swipeRightOffsetX -= 40;
          // } else {
          //   task.swipeRight = 0;
          // }
        }
        if (!dragging) {
          if (x[0] <= 50) {
            task.swipeRightOffsetX = 0;
            task.swipeRight = `0px`;
            return;
          } else {
            task.swipeRight = `${this.taskBlockWidth}px`;
            setTimeout(() => {
              this.$emit("solveTask", task);
            }, 1000);
          }
        }
      }
      // console.log(task.swipeRightOffsetX);
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
  position: relative;
  height: 40px;
  display: flex;
  margin: 10px 0px;
}
.task-block:first-child {
  margin-top: 2px;
}
.task__solve-img {
  display: flex;
  height: 32px;
  align-self: center;
}
.text-button-block {
  display: flex;
  flex: 1 1 0;
  /* width: calc(100% - 400px); */
}
.text-button {
  font-size: 36px;
  border: 0;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  background-color: transparent;
}
.task-block__image-conteiner {
  position: relative;
  height: 32px;
  display: flex;
}
.task-block__icon {
  width: 50%;
  align-self: center;
  z-index: 2;
}
.task-block__icon_bg-yellow {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 32px;
  background: yellow;
}
.task-block__icon_bg-red {
  background: red;
  position: absolute;
  right: 0;
  height: 32px;
  bottom: 0;
}
.edit-block {
  display: flex;
  font-size: 36px;
}
.task__solve-block {
  position: absolute;
  z-index: 2;
  left: 0;
  bottom: 0;
  background-color: #009045;
  display: flex;
  align-content: center;
  justify-content: center;
}
</style>
