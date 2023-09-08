<template>
  <div>
    <div>
      <Pie :data="chartData" :options="options" class="pie" />
    </div>
  </div>
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: "App",
  components: {
    Pie,
  },
  props: {
    lengthUnsolvedTasks: {
      type: Number,
      required: true,
    },
    lengthSolvedTasks: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  computed: {
    chartData() {
      return {
        labels: ["TO DO", "DONE"],
        datasets: [
          {
            backgroundColor: ["#fff", "#29dff7"],
            data: [this.quantityUnsolvedTasks, this.quantitySolvedTasks],
          },
        ],
      };
    },
    quantityUnsolvedTasks() {
      return this.lengthUnsolvedTasks;
    },
    quantitySolvedTasks() {
      return this.lengthSolvedTasks;
    },
  },
};
</script>
