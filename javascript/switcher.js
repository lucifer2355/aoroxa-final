window.console =
  window.console ||
  (function() {
    var a = {};
    a.log = a.warn = a.debug = a.info = a.error = a.time = a.dir = a.profile = a.clear = a.exception = a.trace = a.assert = function() {};
    return a;
  })();
$(document).ready(function() {
  var a =
    '<div class="switcher-container"><h2>STYLE SWITCHER<a href="#" class="sw-click"><i class="fa fa-cog"></i></a></h2><div class="selector-box"><div class="clearfix"></div><div class="sw-odd"><div class="sw-image"><button name="button" type="submit" class="flat-button sw-buy">Buy Now</button></div><h3>MAIN COLOR</h3><div class="ws-colors"><a href="#color1" class="styleswitch main-color" id="color1">&nbsp;<span class="cl1"></span></a><a href="#color2" class="styleswitch main-color" id="color2">&nbsp;<span class="cl2"></span></a><a href="#color3" class="styleswitch main-color" id="color3">&nbsp;<span class="cl3"></span></a></div><h3>SECONDARY COLOR</h3><div class="ws-colors-sub"><a href="#colorsub1" class="styleswitch secondary-color" id="colorsub1">&nbsp;<span class="cl1"></span></a><a href="#colorsub2" class="styleswitch secondary-color" id="colorsub2">&nbsp;<span class="cl2"></span></a><a href="#colorsub3" class="styleswitch secondary-color" id="colorsub3">&nbsp;<span class="cl3"></span></a></div></div><div class="sw-even"><h3>Layout:</h3><a href="#" class="sw-light">BOX</a><a href="#" class="sw-dark">WIDE</a></div><div class="clearfix"></div></div></div>';
  $('body').append(a);
  switchAnimate.loadEvent();
  switchColor.loadEvent();
});
var switchColor = {
  colorObj: {
    colorCookie: 'colorCookie',
    switchClass: '.styleswitch',
    currentClass: 'current',
    headLink: 'head link[id=colors]',
    colorItem: '.ws-colors a.main-color',
    reset: '#reset',
    defaultColor: 'color1'
  },
  colorObjSecond: {
    colorCookie: 'colorCookie_S',
    switchClass: '.styleswitch',
    currentClass: 'current_s',
    headLink: 'head link[id=colors_s]',
    colorItem: '.ws-colors-sub a.secondary-color',
    reset: '#reset',
    defaultColor: 'colorsub1'
  },
  loadEvent: function() {
    var a = switchColor.colorObj;
    if ($.cookie(a.colorCookie)) {
      switchColor.setColor($.cookie(a.colorCookie));
    } else {
      switchColor.setColor(a.defaultColor);
    }
    $(a.colorItem).on('click', function() {
      var c = $(this).attr('id');
      switchColor.setColor(c);
    });
    $(a.reset).on('click', function() {
      switchColor.setColor(a.defaultColor);
    });
    var b = switchColor.colorObjSecond;
    if ($.cookie(b.colorCookie)) {
      switchColor.setColor_S($.cookie(b.colorCookie));
    } else {
      switchColor.setColor_S(b.defaultColor);
    }
    $(b.colorItem).on('click', function() {
      var c = $(this).attr('id');
      switchColor.setColor_S(c);
    });
    $(b.reset).on('click', function() {
      switchColor.setColor_S(b.defaultColor);
    });
  },
  setColor: function(c) {
    var a = switchColor.colorObj;
    $.cookie(a.colorCookie, c);
    $(a.headLink).attr('href', 'stylesheet/colors/' + c + '.css');
    $(a.switchClass).removeClass(a.currentClass);
    $('#' + c).addClass(a.currentClass);
    if ($('.infomation.text-center h3').length === 1) {
      var b = $('.infomation.text-center h3')
        .closest('.section')
        .css('background-color')
        .toString();
      if (b === 'rgb(91, 91, 91)') {
        $('.infomation.text-center h3').css('color', '#fff');
      }
    }
  },
  setColor_S: function(c) {
    var b = switchColor.colorObjSecond;
    $.cookie(b.colorCookie, c);
    $(b.headLink).attr('href', 'stylesheet/colors/' + c + '.css');
    $(b.switchClass).removeClass(b.currentClass);
    $('#' + c).addClass(b.currentClass);
    if ($('.infomation.text-center h3').length === 1) {
      var a = $('.infomation.text-center h3')
        .closest('.section')
        .css('background-color')
        .toString();
      if (a === 'rgb(91, 91, 91)') {
        $('.infomation.text-center h3').css('color', '#fff');
      }
    }
  }
};
var switchAnimate = {
  loadEvent: function() {
    $('.switcher-container h2 a.sw-click').on('click', function(b) {
      $(this).addClass('active');
      var a = $('.switcher-container');
      if (a.css('left') === '-220px') {
        $('.switcher-container').animate({ left: '0' }, 300, 'easeInOutExpo');
      } else {
        $(this).removeClass('active');
        $('.switcher-container').animate(
          { left: '-220px' },
          300,
          'easeInOutExpo'
        );
      }
      b.preventDefault();
    });
  }
};
