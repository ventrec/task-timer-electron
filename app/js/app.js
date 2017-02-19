const Vue = require('vue/dist/vue');
const _ = require('lodash');
const moment = require('moment');
const {powerSaveBlocker} = require('electron');

Vue.filter('pad', require('./filters/pad'));
Vue.filter('seconds', require('./filters/seconds'));
Vue.filter('minutes', require('./filters/minutes'));
Vue.filter('hours', require('./filters/hours'));

new Vue({
  el: '#app',

  data() {
    return require('./store')
  },

  computed: {
    orderedTasks() {
      return _.orderBy(this.tasks, ['completed', 'timer.active'], ['asc', 'desc']);
    }
  },

  components: {
    task: require('./components/task/task')
  },

  filters: {
    pad: require('./filters/pad')
  },

  mounted() {
    // TODO: Read local file containing tasks
  },

  methods: {
    newTask() {
      // Validation
      if (this.taskName.length < 3) {
        alert('The task name must contain atleast 3 characters');

        return;
      }

      this.tasks.unshift({
        id: (this.tasks.length + 1),
        name: this.taskName,
        completed: false,
        created_at: moment().format(this.dateFormat),

        timer: {
          seconds: 0,
          active: true,
          instance: null
        }
      });

      this.taskName = '';
    },

    /**
     * Enable power save blocker if it is not already enabled
     */
    handleTimerStarted() {
      if (this.powerSaveBlockerId === null) {
        this.powerSaveBlockerId = powerSaveBlocker.start('prevent-app-suspension');
      }
    },

    handleTimerStopped() {
      // Do we have any running tasks?
      let activeTasks = this.tasks.filter(function (task) {
        return task.timer.active === true;
      });

      // If we do not have any active tasks, enable power save
      if (activeTasks.length === 0) {
        powerSaveBlocker.stop(this.powerSaveBlockerId);

        this.powerSaveBlockerId = null;
      }
    },
  }
});