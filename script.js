/* global $ */

$(document).ready(function () {

  // setup time pause variables
  //var startTime;

  //var timerTime = new Date();
  //var breakTime = new Date();

  // pomodoro variables
  var sessionValue = 10;
  var sessionBreakValue = 3;
  var setValue = 3;
  var setBreakValue = 3;

  var veryshort = 1;
  var short = 5;
  var medium = 15;
  var standard = 25;

  // sounds
  var snap = 'snap';
  var start = 'start';
  var finish = 'finish';

  /*
  FIRST DISPLAY INIT
  */
  $('.minutes').text(('0' + sessionValue).slice(-2));
  $('.seconds').text('00');

  /*
  CONVERT VALUES TO TIME
  */

  function valueToTime(num) {

    var secMs = (num * 1000);
    var minMs = (num * 60 * 1000);

    var timeSecs = new Date(Date.now() + secMs);
    var timeMins = new Date(Date.now() + minMs);

    return {
      timeDate: new Date(Date.now()),
      timeSecs: timeSecs,
      timeMins: timeMins

    };

  }

  /*
  CONVERT TIME TO MILLISECONDS
  */

  function getTimeRemaining(endtime) {

    var t = Date.parse(endtime) - Date.parse(new Date());
    var secs = Math.floor((t / 1000) % 60);
    var mins = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));

    return {
      'total': t,
      'days': days,
      'hours': hours,
      'mins': mins,
      'secs': secs
    };

  }

  /*
  CLEAR TIMERS
  */
  function clearTimers() {
    for (var j = 1; j < 99; j++) {
      window.clearInterval(j);
    }
    for (var k = 1; k < 99; k++) {
      window.clearTimeout(k);
    }
  }

  /*
  DISPLAY UPDATER
  */
  function initDisplay() {
    $('.minutes').text(('0' + sessionValue).slice(-2));
    $('.seconds').text('00');
    $('#sessText').text('Start Session');
  }

  //resetTimer();
  function resetTimer() {
    console.log('resetTimer');

    clearTimers();
    initDisplay();
    //startTimers();

    for (var i = 0; i <= 5; i++) {
      $.ionSound.play(start);
      setTimeout((function (iVal) {

        return function () {

          console.log(iVal);
          console.log(valueToTime(sessionValue).timeSecs);

          console.log('startTimers');
          initDisplay();
          $('#sessText').text('Session In Progress');

          //sessions
          var sessionInterval =
            setInterval(updateSessionClock, 1000, valueToTime(sessionValue).timeSecs);

          function updateSessionClock(endtime) {
            var t = getTimeRemaining(endtime);

            $('.minutes').text(('0' + t.mins).slice(-2));
            $('.seconds').text(('0' + t.secs).slice(-2));
            $.ionSound.play(snap);

            if (t.total <= 0) {
              clearInterval(sessionInterval);
              initDisplay();
            }
          }

        };

      })(i), sessionValue * i * 1000);
      //$.ionSound.play(finish);
    }

  }

  /*
  TIMER CONTROLS
  */
  $('#timer-minus').click(function () {
    switch (true) {
      case sessionValue < 2:
        $(this).removeClass('enabled');
        $(this).addClass('disabled');
        $('#timer-plus').removeClass('disabled');
        $('#timer-plus').addClass('enabled');
        break;
      default:
        if ($('#timer-plus').hasClass('disabled') === true) {
          $('#timer-plus').removeClass('disabled');
          $('#timer-plus').addClass('enabled');
        }
        clearTimers();
        sessionValue -= 1;
        initDisplay();
        break;
    }
  });

  $('#timer-plus').click(function () {
    switch (true) {
      case sessionValue > 24:
        $(this).removeClass('enabled');
        $(this).addClass('disabled');
        $('#timer-minus').removeClass('disabled');
        $('#timer-minus').addClass('enabled');
        break;
      default:
        if ($('#timer-minus').hasClass('disabled') === true) {
          $('#timer-minus').removeClass('disabled');
          $('#timer-minus').addClass('enabled');
        }
        clearTimers();
        sessionValue += 1;
        initDisplay();
        break;
    }
  });

  $('#timer-reset').click(function () {

    resetTimer();
    $('#timer-minus').removeClass('disabled');
    $('#timer-minus').addClass('enabled');
    $('#timer-plus').removeClass('disabled');
    $('#timer-plus').addClass('enabled');
  });

  /*
  PANEL CONTROLS
  */

  // call immediate function to close panels
  (function () {
    $('.panel')
      .find('.panel-body')
      .slideUp();

    $('.panel').children('.clickable')
      .addBack()
      .addClass('panel-collapsed');

    $('.panel').children('.clickable')
      .addBack()
      .find('i')
      .removeClass('glyphicon-chevron-up')
      .addClass('glyphicon-chevron-down');
  })();

  // setup presets
  $('.veryshort, .short, .medium, .standard').click(function (e) {
    var $this = $(this);
    switch (true) {
      case $this.hasClass('veryshort'):
        sessionValue = veryshort;
        break;
      case $this.hasClass('short'):
        sessionValue = short;
        break;
      case $this.hasClass('medium'):
        sessionValue = medium;
        break;
      case $this.hasClass('standard'):
        sessionValue = standard;
        break;
    }
    clearTimers();
    initDisplay();
  });

  // setup click eventS for panels
  $('.main-panel').click(function (e) {
    var $this = $(this);
    switch (true) {
      case !$this.hasClass('panel-collapsed'):
        panelClosed();
        break;
      default:
        panelOpen();
        break;
    }

    //close
    function panelClosed() {
      $this.parents('.panel')
        .find('.panel-body')
        .slideUp();

      $this.siblings('.clickable')
        .addBack()
        .addClass('panel-collapsed');

      $this.siblings('.clickable')
        .addBack()
        .find('i')
        .removeClass('glyphicon-chevron-up')
        .addClass('glyphicon-chevron-down');
    }

    //open
    function panelOpen() {
      $this.parents('.panel')
        .find('.panel-body')
        .slideDown();

      $this.siblings('.clickable')
        .addBack()
        .removeClass('panel-collapsed');

      $this.siblings('.clickable')
        .addBack()
        .find('i')
        .removeClass('glyphicon-chevron-down')
        .addClass('glyphicon-chevron-up');
    }
  });

  /*
  SET IONSOUND CONFIG
  */
  var soundLocation = 'http://mobilecreature-cdn.appspot.com/pomodoro/media/sounds/';

  $.ionSound({
    sounds: [
      { name: 'bell_ring', alias: 'start' },
      { name: 'bell_ring', loop: 3, alias: 'finish' },
      { name: 'snap' },
      { name: 'computer_error' }
    ],
    volume: 0.1,
    multiplay: false,
    path: soundLocation,
    preload: true
  });

});
