const Vue = require('vue/dist/vue');
const _ = require('lodash');

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
      return _.orderBy(this.tasks, 'id', 'desc');
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

        timer: {
          seconds: 0,
          active: true,
          instance: null
        }
      });

      this.taskName = '';
    }
  }
});