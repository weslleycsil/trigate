$(document).ready(function () {
  ready_function();
  startCountdown();
  after_load = function () {
    check_session();
  };
});
