window.Game = new (function Game() {
  var that = this;

  var _score = -1,
      _highscore = 0,
      _step = 1,
      _x = -64 * 4,
      _interrupted = false,
      _toh = 0,
      _playing = false;

  $(init);

  function init() {
    $(document).on('click', '#tweet', tweet);
    $(document).on('touchstart touchmove touchend mousedown mousemove mouseup keydown keypress keyup', stopped);
    walk();
    //start();
    loadHighscore();
    updateHighscore();
  }

  function loadHighscore() {
    if (window.localStorage)
      _highscore = localStorage.getItem('highscore') * 1;
    if (!_highscore)
      _highscore = 5;
  }

  function walk() {
    if (_step == 1) _step = 2; else _step = 1;
    _x += (_step == 1)? 6 : 4;
    $('#player')[0].className = 'obj step' + _step;
    $('#player')[0].style.marginLeft = _x + 'px';

    if (_x < -20)
      setTimeout(walk, 100);
    else
      start();
  }

  function start() {
    $('h1').hide();
    $('#player').css('margin-left', '-18px')
    $('#player')[0].className = 'obj step1';
    $('#speech').text('READY?');
    setTimeout(start2, 3000);
  }

  function start2() {
    $('#highscore').show();
    $('#player')[0].className = 'obj';
    _interrupted = false;
    _playing = true;
    _score = -1;
    nextSecond();
  }

  function nextSecond() {
    _score++;
    $('#speech').text(_score > 0? _score : '');
    if (!_interrupted)
      _toh = setTimeout(nextSecond, 1000);
  }

  function stopped() {
    _interrupted = true;
    clearTimeout(_toh);
    if (_playing)
      endOfGame();
  }

  function endOfGame() {
    _playing = false;
    $('#player')[0].className = 'obj step1';
    if (_score < _highscore)
      lose();
    else
      win();
  }

  function lose() {
    $('#speech').text('YOU LOSE!');
    _again = 6;
    setTimeout(countdown, 2000)
  }

  function countdown() {
    _again--;
    $('#speech').text('Trying again in ' + _again);
    if (_again)
      setTimeout(countdown, 1000);
    else
      start2();
  }

  function win() {
    $('#speech').text('YOU WON!');
    _highscore = _score;
    localStorage.setItem('highscore', _highscore);
    updateHighscore();
  }

  function updateHighscore() {
    $('#highscore').text('HIGHSCORE: ' + _highscore);
  }

  function tweet(event) {
    Utils.eat(event);
    window.location.href = "http://twitter.com/intent/tweet?text="+
    encodeURIComponent("Tired of endless runners? Play Endless Sitter! http://endless-sitter.com ") +
    encodeURIComponent("The genre-defining game by @q42. My score was " + _highscore + ". What's yours?");
  }

})();