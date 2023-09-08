<template>
  <div class="input-wrapper">
    <div class="input-wrapper__input-container">
      <input
        type="text"
        v-model="taskTitle"
        @keydown.enter="add"
        class="input-wrapper__input"
      />

      <img
        src="@/icon/delete.png"
        @click="taskTitle = ''"
        class="input-wrapper__clear-button"
      />
      <img
        src="../icon/voice-button.png"
        v-if="isEnabledSpeechApi"
        @click="$emit('voiceRecognition')"
        alt=""
      />
    </div>
    <button class="input-wrapper__add-button" @click="add">Add</button>
  </div>
</template>

<script>
export default {
  data() {
    return { taskTitle: "", isEnabledSpeechApi: false };
  },
  props: {
    recognizedString: {
      type: String,
    },
  },
  emits: {
    addTask: (task) => typeof task === "string",
    voiceRecognition: null,
  },
  created() {
    this.isEnabledSpeechApi = "webkitSpeechRecognition" in window;
  },
  methods: {
    add() {
      if (!this.taskTitle) {
        return;
      }
      this.$emit("addTask", this.taskTitle);
      this.taskTitle = "";
    },
  },
  watch: {
    recognizedString() {
      if (this.recognizedString) {
        this.taskTitle = this.recognizedString;
      }
    },
  },
};
</script>

<style scoped>
.input-wrapper__input-container {
  display: flex;
  align-items: center;
}

.input-wrapper__input {
  flex: 1;
  font-size: 36px;
  background-color: transparent;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  margin: 5px;
  border-radius: 10px;
  color: #fff;
  padding: 5px;
}

.input-wrapper__clear-button {
  color: #fff;
  background-color: transparent;
  border: 0;
}

.input-wrapper__add-button {
  color: #fff;
  margin-top: 10px;
  padding: 5px;
  font-size: 36px;
  background-color: transparent;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  border-radius: 10px;
  margin: 5px;
}
</style>
