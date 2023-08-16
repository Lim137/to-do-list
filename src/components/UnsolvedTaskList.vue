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
          class="string-block"
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
              <button class="text-button">
                <div
                  class="text-button"
                  :style="{
                    width: `${
                      taskBlockWidth - Math.abs(task.swipeLeftOffsetX) - 10
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
              :style="{
                width: task.swipeLeft,
              }"
            >
              <div class="task-block__icon task-block__icon_bg-yellow">
                <img
                  src="../icon/editing.png"
                  @click="$emit('editTask', task)"
                  :style="{
                    width:
                      task.swipeLeftOffsetX > -41 ? task.swipeLeft : '40px',
                  }"
                />
              </div>
              <div class="task-block__icon task-block__icon_bg-red">
                <img
                  src="../icon/delete.png"
                  @click="$emit('deleteTask', task)"
                  :style="{
                    width:
                      task.swipeLeftOffsetX > -41 ? task.swipeLeft : '40px',
                  }"
                />
              </div>
            </div>
          </div>
        </div>
        <text-edit-block
          v-if="task.editing"
          :taskFromApp="task"
          @cancelEdit="$emit('cancelEdit', task)"
          @saveTask="$emit('saveTask', task)"
        />
      </div>
    </transition-group>
  </div>
</template>

<script>
import TextEditBlock from "./TextEditBlock.vue";
export default {
  // :class="task.swipeRight === 1 ? 'task__solve-img-show' : ''"

  components: {
    TextEditBlock,
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
          task.swipeLeftOffsetX = x[0];
        }

        if (!dragging) {
          if (x[0] >= -10) {
            task.swipeLeftOffsetX = 0;
            task.swipeLeft = `0px`;
            return;
          } else {
            task.swipeLeft = `103.2px`;
            task.swipeLeftOffsetX = -103.2;
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
.string-block {
  display: flex;
}
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
  padding: 10px;
  font-size: 36px;
}
.move-transition {
  transition: transform 0.3s ease;
}

.task-block {
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;

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
  padding: 5px;
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
  display: flex;
  align-self: center;
  justify-self: center;
  height: 100%;
}
.task-block__icon {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;

  /* height: 100%; */
}
.task-block__icon_bg-yellow {
  /* position: absolute;
  left: 0;
  bottom: 0; */
  background-color: yellow;
}
.task-block__icon_bg-red {
  background-color: red;
  /* position: absolute;
  right: 0;
  bottom: 0; */
  border-radius: 0px 10px 10px 0px;
}

.task__solve-block {
  position: absolute;
  z-index: 2;
  left: 0;
  bottom: 0;
  background-color: #009045;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}
</style>
