(function(b) {
  b.fn.countTo = function(c) {
    c = c || {};
    return b(this).each(function() {
      var e = b.extend(
        {},
        b.fn.countTo.defaults,
        {
          from: b(this).data('from'),
          to: b(this).data('to'),
          speed: b(this).data('speed'),
          refreshInterval: b(this).data('refresh-interval'),
          decimals: b(this).data('decimals')
        },
        c
      );
      var j = Math.ceil(e.speed / e.refreshInterval),
        k = (e.to - e.from) / j;
      var l = this,
        h = b(this),
        g = 0,
        i = e.from,
        f = h.data('countTo') || {};
      h.data('countTo', f);
      if (f.interval) {
        clearInterval(f.interval);
      }
      f.interval = setInterval(m, e.refreshInterval);
      d(i);
      function m() {
        i += k;
        g++;
        d(i);
        if (typeof e.onUpdate == 'function') {
          e.onUpdate.call(l, i);
        }
        if (g >= j) {
          h.removeData('countTo');
          clearInterval(f.interval);
          i = e.to;
          if (typeof e.onComplete == 'function') {
            e.onComplete.call(l, i);
          }
        }
      }
      function d(o) {
        var n = e.formatter.call(l, o, e);
        h.text(n);
      }
    });
  };
  b.fn.countTo.defaults = {
    from: 0,
    to: 0,
    speed: 1000,
    refreshInterval: 100,
    decimals: 0,
    formatter: a,
    onUpdate: null,
    onComplete: null
  };
  function a(d, c) {
    return d.toFixed(c.decimals);
  }
})(jQuery);
