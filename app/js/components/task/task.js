const fs = require('fs');
const store = require('../../store');
const _ = require('lodash');

module.exports = {
  template: fs.readFileSync(__dirname + '/task.html', 'utf-8'),

  props: {
    taskId: {
      required: true,
      type: Number
    }
  },

  data() {
    return {
      task: null
    }
  },

  computed: {
    styleObject() {
      if (this.task.completed) {
        return {
          textDecoration: 'line-through'
        };
      }

      return {};
    }
  },

  created() {
    this.task = _.find(store.tasks, { id: this.taskId });
  },

  mounted() {
    if (this.task.timer.active) {
      this.startTimer();
    }
  },

  methods: {
    startTimer() {
      this.task.timer.active = true;

      this.task.timer.instance = window.setInterval(() => {
        this.task.timer.seconds += 1;
      }, 1000);

      // Tell our parent that we started a timer in order to block power save
      this.$emit('timerStarted');
    },

    stopTimer() {
      this.task.timer.active = false;

      window.clearInterval(this.task.timer.instance);

      // Tell our parent that we stopped a timer in order to check if we can disable power save blocker
      this.$emit('timerStopped');
    },

    completeTask() {
      if (this.task.timer.active) {
        this.stopTimer();
      }

      this.task.completed = true;
    }
  }
}