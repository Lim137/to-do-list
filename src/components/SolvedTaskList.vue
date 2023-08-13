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
    taskListName: {
      type: String,
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
      localStorage.setItem(
        `${this.taskListName} solved`,
        JSON.stringify(this.solvedTasks)
      );
    },
  },
};
</script>

<style scoped>
.task-wrapper {
  padding: 10px 0px;
}
.task {
  font-size: 36px;
  border: 0;
  padding-bottom: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
</style>
