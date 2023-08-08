<template>
  <div>
    <div>
      <Pie :data="data" :options="options" class="pie" />
    </div>
  </div>
</template>

<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "vue-chartjs";
// import * as chartConfig from "./chartConfig.js";

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
      data: {
        labels: ["TO DO", "DONE"],
        datasets: [
          {
            backgroundColor: ["#fff", "#29dff7"],
            data: [
              this.$props.lengthUnsolvedTasks,
              this.$props.lengthSolvedTasks,
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
};
</script>
