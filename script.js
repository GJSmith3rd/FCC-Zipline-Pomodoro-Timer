/* global $ */

// timer selector
var $clock = $('.timer');

// setup time pause variables
var displayTime;

var startTime;
var resumeMin;
var pauseMin;

var timerMins = new Date();
var breakMins = new Date();
var setBreakMins = new Date();

// initially set pomodoro variables
var setUnits = 2;
var setCounter = setUnits;

var sessUnits = 2;
var sessCounter = sessUnits;

var sessTime = 1;
var sessBreakTime = 1;
var setBreakTime = 1;

$(document).ready(function() {

  /*
  MAIN DRIVER
  */

  function mainDriver() {

    // timerMins = convertValueToMinutes(sessTime);
    // breakMins = convertValueToMinutes(sessBreakTime);
    // setBreakMins = convertValueToMinutes(setBreakTime);

    console.log('main driver' + setCounter + ':' + sessCounter);

    if ((setCounter > 1) && (sessCounter > 1)) {
      console.log('more sets & more sessions');
      //more sets and more sessions available

      updateStatus();
      sessCounter -= 1;
      sessTimer(timerMins);

    } else if ((setCounter > 1) && (sessCounter === 0)) {
      console.log('new set & more sessions');
      //more sets but no sessions available

      sessCounter = sessUnits;
      updateStatus();
      setCounter -= 1;
      sessTimer(timerMins);

    } else if (sessCounter > 1) {
      //no sets but more sessions available
      console.log('no more sets & more sessions');

      updateStatus();
      sessCounter -= 1;
      sessTimer(timerMins);

    } else {
      //(setCounter === 0 && sessCounter === 0))
      //no sets and no more sessions available
      console.log('no more sets & more sessions');

      updateStatus();
    }

  }

  function updateStatus() {

    if (setCounter === 0 && sessCounter === 0) {
      $('#sessText').text('Pomodoro Over');
    } else {
      timerMins = convertValueToMinutes(sessTime);
      $('#sessText').text('Sets ' + setCounter + ' Sessions ' + sessCounter);
    }
  }

  /*
  POMODORO SETUP FUNCTION
  */

  function sessTimer(timerMins) {
    /*
    TIMER EVENTS
    */
    $.ionSound.play('bell_ring', {
      volume: 0.1,
      loop: 1

    });
    $('.timer').countdown(timerMins, function(event) {

        $(this).
        html(event.strftime('<span>%M</span> min ' + '<span>%S</span> sec'));

      }) //finish
      .on('finish.countdown', function(event) {
        $.ionSound.play('bell_ring', {
          volume: 0.1,
          loop: 1

        });
        $('.timer').hide();
        $('.break').show();
        document.title = 'Timer ' +
          '0' +
          'm' +
          '0' +
          's';

        //breakTimer(breakMins, '.break');
        console.log(sessCounter);
        if (sessCounter === 0) {
          $('#sessText').text('Set Break');
          breakMins = convertValueToMinutes(setBreakTime);
          breakTimer(breakMins);

        } else {
          $('#sessText').text('Session Break');
          breakMins = convertValueToMinutes(sessBreakTime);
          breakTimer(breakMins);
        }

      })
      //update
      .on('update.countdown', function(event) {
        $.ionSound.play('snap', {
          volume: 0.1
        });
        document.title = 'Timer ' +
          event.offset.minutes +
          'm' +
          event.offset.seconds +
          's';
      });

  }

  function breakTimer(testMins) {
    /*
    TIMER EVENTS
    */

    $('.break').countdown(testMins, function(event) {

        $(this).
        html(event.strftime('<span>%M</span> min ' + '<span>%S</span> sec'));

      }) //finish
      .on('finish.countdown', function(event) {
        $.ionSound.play('bell_ring', {
          volume: 0.1,
          loop: 2
        });
        $('.timer').show();
        $('.break').hide();

        document.title = 'Timer ' +
          '0' +
          'm' +
          '0' +
          's';
        console.log('calling main driver');
        mainDriver();
      })
      //stop
      // .on('stop.countdown', function (event) {
      //   $.ionSound.play('bell_ring', { volume: 0.1, loop: 5 });
      // })//update
      .on('update.countdown', function(event) {
        // $.ionSound.play('snap', {
        //   volume: 0.1
        // });

        document.title = 'Timer ' +
          event.offset.minutes +
          'm' +
          event.offset.seconds +
          's';
      });

  }

  //resetTimer();
  function resetTimer() {
    timerMins = convertValueToMinutes(sessTime);
    breakMins = convertValueToMinutes(sessTime + sessBreakTime);

    $('.break').hide();
    $('#sessText').text('Session Time');

    sessTimer(timerMins, '.timer');
    //breakTimer(breakMins, '.break');
  }

  /*
  TIMER CONTROLS
  */

  $('#timer-reset').click(function() {

    // reset timer
    //var duration = convertValueToMinutes(sessTime);
    //$clock.countdown(duration);
    resetTimer();
    $('#timer-resume').removeClass('disabled');
    $('#timer-resume').removeClass('active');
    $('#timer-pause').removeClass('disabled');
    $('#timer-pause').removeClass('active');
  });

  $('#timer-resume').click(function() {
    //resume timer
    $clock.countdown('resume');

    $(this).addClass('disabled');
    $('#timer-pause').removeClass('disabled');
  });

  $('#timer-pause').click(function() {
    // pause timer
    $clock.countdown('pause');

    pauseMin = new Date();

    $(this).addClass('disabled');
    $('#timer-resume').removeClass('disabled');
  });

  /*
  CONVERT VALUES TO MINUTES
  */
  function convertValueToMinutes(timerValue) {

    startTime = new Date();
    var currentTime = startTime;
    var timerTime = startTime;

    return timerTime.setMinutes(currentTime.getMinutes() + timerValue);
  }

  // setup click eventS for panels
  $(document).on('click', '.panel-heading, clickable', function(e) {

    var $this = $(this);

    if (!$this.hasClass('panel-collapsed')) {

      panelClosed();

    } else {

      panelOpen();

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
  (function() {
    var soundLocation = 'http://cdn.mobilecreature.com/pomodoro/media/sounds/';

    $.ionSound({
      sounds: [{
        name: 'bell_ring'
      }, {
        name: 'snap'
      }, {
        name: 'computer_error'
      }],
      volume: 0.1,
      multiplay: false,
      path: soundLocation,
      preload: true
    });
  })();

  /*
  PRIMER
  */
  (function() {
    timerMins = convertValueToMinutes(sessTime);
    breakMins = convertValueToMinutes(sessTime + sessBreakTime);
    setBreakMins = convertValueToMinutes(sessTime + setBreakTime);
    $('.break').hide();
    if (sessTime < 10) {
      displayTime = '0' + sessTime;
    } else {
      displayTime = sessTime;
    }
    $('.timer').text(displayTime + ' min 00 sec');
    $('#sessText').text('Pomodoro Start');

    mainDriver();

  })();

  /*
  PANEL CONTROLS
  */

  // call immediate function to close panels
  (function() {
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

  /*
  DEVELOPMENT SETUP
  */
  (function() {
    if (location.host === '10.0.0.75:3039') {

      //use live.js if mobile dev ide
      $.getScript('live.js');

      //use less browser scripts if mobile dev ide and
      //async add scripts and links to dom head dynamically
      $('head script')
        .last()
        .append('<link rel="stylesheet/less"' +
          ' type="text/css" href="styles.less" />');
      $('head script')
        .last()
        .append('<script async=false >less = {env: "development", ' +
          'async: false, fileAsync: false, poll: 1000, functions: {},' +
          ' dumpLineNumbers: "comments",' +
          ' relativeUrls: false}; </script>');
      $('head script')
        .last()
        .append('<script async=false src="less.min.js" type="text/javascript"></script>');
      $('head script')
        .last()
        .append('<script async=false>less.watch();</script>');

    } else {
      //use local css generated by gulp tasks
      $('head script')
        .last()
        .append('<link async="false" rel="stylesheet" href="styles.css" />');

    }

  })();

});
