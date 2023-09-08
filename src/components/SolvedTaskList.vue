<template>
  <div class="task-wrapper">
    <div v-for="(task, index) in solvedTasks" :key="task.id">
      <div class="task">{{ index + 1 }}. {{ task.title }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tasks: {
      type: Object,
      required: true,
    },
    taskListId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      solvedTasks: [...this.tasks],
    };
  },
  maxTasksInList: 25,
  mounted() {
    this.normalizedTaskList();
  },
  methods: {
    normalizedTaskList() {
      if (this.solvedTasks.length > this.$options.maxTasksInList) {
        this.solvedTasks.splice(
          0,
          this.solvedTasks.length - this.$options.maxTasksInList
        );
      }
    },
  },
};
</script>

<style scoped>
.task-wrapper {
  padding: 10px;
}
.task {
  display: flex;
  align-items: center;

  font-size: 36px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
  border: 0;
  padding: 5px;
  margin-bottom: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
</style>
