!(function(t) {
  'function' == typeof define && define.amd ? define(['jquery'], t) : t(jQuery);
})(function(x) {
  x.ui = x.ui || {};
  x.ui.version = '1.12.1';
  var n,
    i = 0,
    r = Array.prototype.slice;
  (x.cleanData =
    ((n = x.cleanData),
    function(t) {
      var e, i, s;
      for (s = 0; null != (i = t[s]); s++)
        try {
          (e = x._data(i, 'events')) &&
            e.remove &&
            x(i).triggerHandler('remove');
        } catch (t) {}
      n(t);
    })),
    (x.widget = function(t, i, e) {
      var s,
        n,
        o,
        a = {},
        r = t.split('.')[0],
        h = r + '-' + (t = t.split('.')[1]);
      return (
        e || ((e = i), (i = x.Widget)),
        x.isArray(e) && (e = x.extend.apply(null, [{}].concat(e))),
        (x.expr[':'][h.toLowerCase()] = function(t) {
          return !!x.data(t, h);
        }),
        (x[r] = x[r] || {}),
        (s = x[r][t]),
        (n = x[r][t] = function(t, e) {
          if (!this._createWidget) return new n(t, e);
          arguments.length && this._createWidget(t, e);
        }),
        x.extend(n, s, {
          version: e.version,
          _proto: x.extend({}, e),
          _childConstructors: []
        }),
        ((o = new i()).options = x.widget.extend({}, o.options)),
        x.each(e, function(e, s) {
          function n() {
            return i.prototype[e].apply(this, arguments);
          }
          function o(t) {
            return i.prototype[e].apply(this, t);
          }
          x.isFunction(s)
            ? (a[e] = function() {
                var t,
                  e = this._super,
                  i = this._superApply;
                return (
                  (this._super = n),
                  (this._superApply = o),
                  (t = s.apply(this, arguments)),
                  (this._super = e),
                  (this._superApply = i),
                  t
                );
              })
            : (a[e] = s);
        }),
        (n.prototype = x.widget.extend(
          o,
          { widgetEventPrefix: (s && o.widgetEventPrefix) || t },
          a,
          { constructor: n, namespace: r, widgetName: t, widgetFullName: h }
        )),
        s
          ? (x.each(s._childConstructors, function(t, e) {
              var i = e.prototype;
              x.widget(i.namespace + '.' + i.widgetName, n, e._proto);
            }),
            delete s._childConstructors)
          : i._childConstructors.push(n),
        x.widget.bridge(t, n),
        n
      );
    }),
    (x.widget.extend = function(t) {
      for (var e, i, s = r.call(arguments, 1), n = 0, o = s.length; n < o; n++)
        for (e in s[n])
          (i = s[n][e]),
            s[n].hasOwnProperty(e) &&
              void 0 !== i &&
              (x.isPlainObject(i)
                ? (t[e] = x.isPlainObject(t[e])
                    ? x.widget.extend({}, t[e], i)
                    : x.widget.extend({}, i))
                : (t[e] = i));
      return t;
    }),
    (x.widget.bridge = function(o, e) {
      var a = e.prototype.widgetFullName || o;
      x.fn[o] = function(i) {
        var t = 'string' == typeof i,
          s = r.call(arguments, 1),
          n = this;
        return (
          t
            ? this.length || 'instance' !== i
              ? this.each(function() {
                  var t,
                    e = x.data(this, a);
                  return 'instance' === i
                    ? ((n = e), !1)
                    : e
                    ? x.isFunction(e[i]) && '_' !== i.charAt(0)
                      ? (t = e[i].apply(e, s)) !== e && void 0 !== t
                        ? ((n = t && t.jquery ? n.pushStack(t.get()) : t), !1)
                        : void 0
                      : x.error(
                          "no such method '" +
                            i +
                            "' for " +
                            o +
                            ' widget instance'
                        )
                    : x.error(
                        'cannot call methods on ' +
                          o +
                          " prior to initialization; attempted to call method '" +
                          i +
                          "'"
                      );
                })
              : (n = void 0)
            : (s.length && (i = x.widget.extend.apply(null, [i].concat(s))),
              this.each(function() {
                var t = x.data(this, a);
                t
                  ? (t.option(i || {}), t._init && t._init())
                  : x.data(this, a, new e(i, this));
              })),
          n
        );
      };
    }),
    (x.Widget = function() {}),
    (x.Widget._childConstructors = []),
    (x.Widget.prototype = {
      widgetName: 'widget',
      widgetEventPrefix: '',
      defaultElement: '<div>',
      options: { classes: {}, disabled: !1, create: null },
      _createWidget: function(t, e) {
        (e = x(e || this.defaultElement || this)[0]),
          (this.element = x(e)),
          (this.uuid = i++),
          (this.eventNamespace = '.' + this.widgetName + this.uuid),
          (this.bindings = x()),
          (this.hoverable = x()),
          (this.focusable = x()),
          (this.classesElementLookup = {}),
          e !== this &&
            (x.data(e, this.widgetFullName, this),
            this._on(!0, this.element, {
              remove: function(t) {
                t.target === e && this.destroy();
              }
            }),
            (this.document = x(e.style ? e.ownerDocument : e.document || e)),
            (this.window = x(
              this.document[0].defaultView || this.document[0].parentWindow
            ))),
          (this.options = x.widget.extend(
            {},
            this.options,
            this._getCreateOptions(),
            t
          )),
          this._create(),
          this.options.disabled &&
            this._setOptionDisabled(this.options.disabled),
          this._trigger('create', null, this._getCreateEventData()),
          this._init();
      },
      _getCreateOptions: function() {
        return {};
      },
      _getCreateEventData: x.noop,
      _create: x.noop,
      _init: x.noop,
      destroy: function() {
        var i = this;
        this._destroy(),
          x.each(this.classesElementLookup, function(t, e) {
            i._removeClass(e, t);
          }),
          this.element.off(this.eventNamespace).removeData(this.widgetFullName),
          this.widget()
            .off(this.eventNamespace)
            .removeAttr('aria-disabled'),
          this.bindings.off(this.eventNamespace);
      },
      _destroy: x.noop,
      widget: function() {
        return this.element;
      },
      option: function(t, e) {
        var i,
          s,
          n,
          o = t;
        if (0 === arguments.length) return x.widget.extend({}, this.options);
        if ('string' == typeof t)
          if (((o = {}), (t = (i = t.split('.')).shift()), i.length)) {
            for (
              s = o[t] = x.widget.extend({}, this.options[t]), n = 0;
              n < i.length - 1;
              n++
            )
              (s[i[n]] = s[i[n]] || {}), (s = s[i[n]]);
            if (((t = i.pop()), 1 === arguments.length))
              return void 0 === s[t] ? null : s[t];
            s[t] = e;
          } else {
            if (1 === arguments.length)
              return void 0 === this.options[t] ? null : this.options[t];
            o[t] = e;
          }
        return this._setOptions(o), this;
      },
      _setOptions: function(t) {
        var e;
        for (e in t) this._setOption(e, t[e]);
        return this;
      },
      _setOption: function(t, e) {
        return (
          'classes' === t && this._setOptionClasses(e),
          (this.options[t] = e),
          'disabled' === t && this._setOptionDisabled(e),
          this
        );
      },
      _setOptionClasses: function(t) {
        var e, i, s;
        for (e in t)
          (s = this.classesElementLookup[e]),
            t[e] !== this.options.classes[e] &&
              s &&
              s.length &&
              ((i = x(s.get())),
              this._removeClass(s, e),
              i.addClass(
                this._classes({ element: i, keys: e, classes: t, add: !0 })
              ));
      },
      _setOptionDisabled: function(t) {
        this._toggleClass(
          this.widget(),
          this.widgetFullName + '-disabled',
          null,
          !!t
        ),
          t &&
            (this._removeClass(this.hoverable, null, 'ui-state-hover'),
            this._removeClass(this.focusable, null, 'ui-state-focus'));
      },
      enable: function() {
        return this._setOptions({ disabled: !1 });
      },
      disable: function() {
        return this._setOptions({ disabled: !0 });
      },
      _classes: function(n) {
        var o = [],
          a = this;
        function t(t, e) {
          var i, s;
          for (s = 0; s < t.length; s++)
            (i = a.classesElementLookup[t[s]] || x()),
              (i = n.add
                ? x(x.unique(i.get().concat(n.element.get())))
                : x(i.not(n.element).get())),
              (a.classesElementLookup[t[s]] = i),
              o.push(t[s]),
              e && n.classes[t[s]] && o.push(n.classes[t[s]]);
        }
        return (
          (n = x.extend(
            { element: this.element, classes: this.options.classes || {} },
            n
          )),
          this._on(n.element, { remove: '_untrackClassesElement' }),
          n.keys && t(n.keys.match(/\S+/g) || [], !0),
          n.extra && t(n.extra.match(/\S+/g) || []),
          o.join(' ')
        );
      },
      _untrackClassesElement: function(i) {
        var s = this;
        x.each(s.classesElementLookup, function(t, e) {
          -1 !== x.inArray(i.target, e) &&
            (s.classesElementLookup[t] = x(e.not(i.target).get()));
        });
      },
      _removeClass: function(t, e, i) {
        return this._toggleClass(t, e, i, !1);
      },
      _addClass: function(t, e, i) {
        return this._toggleClass(t, e, i, !0);
      },
      _toggleClass: function(t, e, i, s) {
        s = 'boolean' == typeof s ? s : i;
        var n = 'string' == typeof t || null === t,
          o = {
            extra: n ? e : i,
            keys: n ? t : e,
            element: n ? this.element : t,
            add: s
          };
        return o.element.toggleClass(this._classes(o), s), this;
      },
      _on: function(a, r, t) {
        var h,
          l = this;
        'boolean' != typeof a && ((t = r), (r = a), (a = !1)),
          t
            ? ((r = h = x(r)), (this.bindings = this.bindings.add(r)))
            : ((t = r), (r = this.element), (h = this.widget())),
          x.each(t, function(t, e) {
            function i() {
              if (
                a ||
                (!0 !== l.options.disabled &&
                  !x(this).hasClass('ui-state-disabled'))
              )
                return ('string' == typeof e ? l[e] : e).apply(l, arguments);
            }
            'string' != typeof e &&
              (i.guid = e.guid = e.guid || i.guid || x.guid++);
            var s = t.match(/^([\w:-]*)\s*(.*)$/),
              n = s[1] + l.eventNamespace,
              o = s[2];
            o ? h.on(n, o, i) : r.on(n, i);
          });
      },
      _off: function(t, e) {
        (e =
          (e || '').split(' ').join(this.eventNamespace + ' ') +
          this.eventNamespace),
          t.off(e).off(e),
          (this.bindings = x(this.bindings.not(t).get())),
          (this.focusable = x(this.focusable.not(t).get())),
          (this.hoverable = x(this.hoverable.not(t).get()));
      },
      _delay: function(t, e) {
        var i = this;
        return setTimeout(function() {
          return ('string' == typeof t ? i[t] : t).apply(i, arguments);
        }, e || 0);
      },
      _hoverable: function(t) {
        (this.hoverable = this.hoverable.add(t)),
          this._on(t, {
            mouseenter: function(t) {
              this._addClass(x(t.currentTarget), null, 'ui-state-hover');
            },
            mouseleave: function(t) {
              this._removeClass(x(t.currentTarget), null, 'ui-state-hover');
            }
          });
      },
      _focusable: function(t) {
        (this.focusable = this.focusable.add(t)),
          this._on(t, {
            focusin: function(t) {
              this._addClass(x(t.currentTarget), null, 'ui-state-focus');
            },
            focusout: function(t) {
              this._removeClass(x(t.currentTarget), null, 'ui-state-focus');
            }
          });
      },
      _trigger: function(t, e, i) {
        var s,
          n,
          o = this.options[t];
        if (
          ((i = i || {}),
          ((e = x.Event(e)).type = (t === this.widgetEventPrefix
            ? t
            : this.widgetEventPrefix + t
          ).toLowerCase()),
          (e.target = this.element[0]),
          (n = e.originalEvent))
        )
          for (s in n) s in e || (e[s] = n[s]);
        return (
          this.element.trigger(e, i),
          !(
            (x.isFunction(o) &&
              !1 === o.apply(this.element[0], [e].concat(i))) ||
            e.isDefaultPrevented()
          )
        );
      }
    }),
    x.each({ show: 'fadeIn', hide: 'fadeOut' }, function(o, a) {
      x.Widget.prototype['_' + o] = function(e, t, i) {
        var s;
        'string' == typeof t && (t = { effect: t });
        var n = t ? (!0 === t || 'number' == typeof t ? a : t.effect || a) : o;
        'number' == typeof (t = t || {}) && (t = { duration: t }),
          (s = !x.isEmptyObject(t)),
          (t.complete = i),
          t.delay && e.delay(t.delay),
          s && x.effects && x.effects.effect[n]
            ? e[o](t)
            : n !== o && e[n]
            ? e[n](t.duration, t.easing, i)
            : e.queue(function(t) {
                x(this)[o](), i && i.call(e[0]), t();
              });
      };
    });
  var o, k, C, s, a, h, l, c, D;
  x.widget;
  function I(t, e, i) {
    return [
      parseFloat(t[0]) * (c.test(t[0]) ? e / 100 : 1),
      parseFloat(t[1]) * (c.test(t[1]) ? i / 100 : 1)
    ];
  }
  function T(t, e) {
    return parseInt(x.css(t, e), 10) || 0;
  }
  (k = Math.max),
    (C = Math.abs),
    (s = /left|center|right/),
    (a = /top|center|bottom/),
    (h = /[\+\-]\d+(\.[\d]+)?%?/),
    (l = /^\w+/),
    (c = /%$/),
    (D = x.fn.position),
    (x.position = {
      scrollbarWidth: function() {
        if (void 0 !== o) return o;
        var t,
          e,
          i = x(
            "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"
          ),
          s = i.children()[0];
        return (
          x('body').append(i),
          (t = s.offsetWidth),
          i.css('overflow', 'scroll'),
          t === (e = s.offsetWidth) && (e = i[0].clientWidth),
          i.remove(),
          (o = t - e)
        );
      },
      getScrollInfo: function(t) {
        var e = t.isWindow || t.isDocument ? '' : t.element.css('overflow-x'),
          i = t.isWindow || t.isDocument ? '' : t.element.css('overflow-y'),
          s =
            'scroll' === e ||
            ('auto' === e && t.width < t.element[0].scrollWidth);
        return {
          width:
            'scroll' === i ||
            ('auto' === i && t.height < t.element[0].scrollHeight)
              ? x.position.scrollbarWidth()
              : 0,
          height: s ? x.position.scrollbarWidth() : 0
        };
      },
      getWithinInfo: function(t) {
        var e = x(t || window),
          i = x.isWindow(e[0]),
          s = !!e[0] && 9 === e[0].nodeType;
        return {
          element: e,
          isWindow: i,
          isDocument: s,
          offset: !i && !s ? x(t).offset() : { left: 0, top: 0 },
          scrollLeft: e.scrollLeft(),
          scrollTop: e.scrollTop(),
          width: e.outerWidth(),
          height: e.outerHeight()
        };
      }
    }),
    (x.fn.position = function(u) {
      if (!u || !u.of) return D.apply(this, arguments);
      u = x.extend({}, u);
      var d,
        p,
        f,
        g,
        m,
        t,
        e,
        i,
        _ = x(u.of),
        v = x.position.getWithinInfo(u.within),
        b = x.position.getScrollInfo(v),
        y = (u.collision || 'flip').split(' '),
        w = {};
      return (
        (t =
          9 === (i = (e = _)[0]).nodeType
            ? {
                width: e.width(),
                height: e.height(),
                offset: { top: 0, left: 0 }
              }
            : x.isWindow(i)
            ? {
                width: e.width(),
                height: e.height(),
                offset: { top: e.scrollTop(), left: e.scrollLeft() }
              }
            : i.preventDefault
            ? { width: 0, height: 0, offset: { top: i.pageY, left: i.pageX } }
            : {
                width: e.outerWidth(),
                height: e.outerHeight(),
                offset: e.offset()
              }),
        _[0].preventDefault && (u.at = 'left top'),
        (p = t.width),
        (f = t.height),
        (g = t.offset),
        (m = x.extend({}, g)),
        x.each(['my', 'at'], function() {
          var t,
            e,
            i = (u[this] || '').split(' ');
          1 === i.length &&
            (i = s.test(i[0])
              ? i.concat(['center'])
              : a.test(i[0])
              ? ['center'].concat(i)
              : ['center', 'center']),
            (i[0] = s.test(i[0]) ? i[0] : 'center'),
            (i[1] = a.test(i[1]) ? i[1] : 'center'),
            (t = h.exec(i[0])),
            (e = h.exec(i[1])),
            (w[this] = [t ? t[0] : 0, e ? e[0] : 0]),
            (u[this] = [l.exec(i[0])[0], l.exec(i[1])[0]]);
        }),
        1 === y.length && (y[1] = y[0]),
        'right' === u.at[0]
          ? (m.left += p)
          : 'center' === u.at[0] && (m.left += p / 2),
        'bottom' === u.at[1]
          ? (m.top += f)
          : 'center' === u.at[1] && (m.top += f / 2),
        (d = I(w.at, p, f)),
        (m.left += d[0]),
        (m.top += d[1]),
        this.each(function() {
          var i,
            t,
            a = x(this),
            r = a.outerWidth(),
            h = a.outerHeight(),
            e = T(this, 'marginLeft'),
            s = T(this, 'marginTop'),
            n = r + e + T(this, 'marginRight') + b.width,
            o = h + s + T(this, 'marginBottom') + b.height,
            l = x.extend({}, m),
            c = I(w.my, a.outerWidth(), a.outerHeight());
          'right' === u.my[0]
            ? (l.left -= r)
            : 'center' === u.my[0] && (l.left -= r / 2),
            'bottom' === u.my[1]
              ? (l.top -= h)
              : 'center' === u.my[1] && (l.top -= h / 2),
            (l.left += c[0]),
            (l.top += c[1]),
            (i = { marginLeft: e, marginTop: s }),
            x.each(['left', 'top'], function(t, e) {
              x.ui.position[y[t]] &&
                x.ui.position[y[t]][e](l, {
                  targetWidth: p,
                  targetHeight: f,
                  elemWidth: r,
                  elemHeight: h,
                  collisionPosition: i,
                  collisionWidth: n,
                  collisionHeight: o,
                  offset: [d[0] + c[0], d[1] + c[1]],
                  my: u.my,
                  at: u.at,
                  within: v,
                  elem: a
                });
            }),
            u.using &&
              (t = function(t) {
                var e = g.left - l.left,
                  i = e + p - r,
                  s = g.top - l.top,
                  n = s + f - h,
                  o = {
                    target: {
                      element: _,
                      left: g.left,
                      top: g.top,
                      width: p,
                      height: f
                    },
                    element: {
                      element: a,
                      left: l.left,
                      top: l.top,
                      width: r,
                      height: h
                    },
                    horizontal: i < 0 ? 'left' : 0 < e ? 'right' : 'center',
                    vertical: n < 0 ? 'top' : 0 < s ? 'bottom' : 'middle'
                  };
                p < r && C(e + i) < p && (o.horizontal = 'center'),
                  f < h && C(s + n) < f && (o.vertical = 'middle'),
                  k(C(e), C(i)) > k(C(s), C(n))
                    ? (o.important = 'horizontal')
                    : (o.important = 'vertical'),
                  u.using.call(this, t, o);
              }),
            a.offset(x.extend(l, { using: t }));
        })
      );
    }),
    (x.ui.position = {
      fit: {
        left: function(t, e) {
          var i,
            s = e.within,
            n = s.isWindow ? s.scrollLeft : s.offset.left,
            o = s.width,
            a = t.left - e.collisionPosition.marginLeft,
            r = n - a,
            h = a + e.collisionWidth - o - n;
          e.collisionWidth > o
            ? 0 < r && h <= 0
              ? ((i = t.left + r + e.collisionWidth - o - n), (t.left += r - i))
              : (t.left =
                  0 < h && r <= 0 ? n : h < r ? n + o - e.collisionWidth : n)
            : 0 < r
            ? (t.left += r)
            : 0 < h
            ? (t.left -= h)
            : (t.left = k(t.left - a, t.left));
        },
        top: function(t, e) {
          var i,
            s = e.within,
            n = s.isWindow ? s.scrollTop : s.offset.top,
            o = e.within.height,
            a = t.top - e.collisionPosition.marginTop,
            r = n - a,
            h = a + e.collisionHeight - o - n;
          e.collisionHeight > o
            ? 0 < r && h <= 0
              ? ((i = t.top + r + e.collisionHeight - o - n), (t.top += r - i))
              : (t.top =
                  0 < h && r <= 0 ? n : h < r ? n + o - e.collisionHeight : n)
            : 0 < r
            ? (t.top += r)
            : 0 < h
            ? (t.top -= h)
            : (t.top = k(t.top - a, t.top));
        }
      },
      flip: {
        left: function(t, e) {
          var i,
            s,
            n = e.within,
            o = n.offset.left + n.scrollLeft,
            a = n.width,
            r = n.isWindow ? n.scrollLeft : n.offset.left,
            h = t.left - e.collisionPosition.marginLeft,
            l = h - r,
            c = h + e.collisionWidth - a - r,
            u =
              'left' === e.my[0]
                ? -e.elemWidth
                : 'right' === e.my[0]
                ? e.elemWidth
                : 0,
            d =
              'left' === e.at[0]
                ? e.targetWidth
                : 'right' === e.at[0]
                ? -e.targetWidth
                : 0,
            p = -2 * e.offset[0];
          l < 0
            ? ((i = t.left + u + d + p + e.collisionWidth - a - o) < 0 ||
                i < C(l)) &&
              (t.left += u + d + p)
            : 0 < c &&
              (0 <
                (s = t.left - e.collisionPosition.marginLeft + u + d + p - r) ||
                C(s) < c) &&
              (t.left += u + d + p);
        },
        top: function(t, e) {
          var i,
            s,
            n = e.within,
            o = n.offset.top + n.scrollTop,
            a = n.height,
            r = n.isWindow ? n.scrollTop : n.offset.top,
            h = t.top - e.collisionPosition.marginTop,
            l = h - r,
            c = h + e.collisionHeight - a - r,
            u =
              'top' === e.my[1]
                ? -e.elemHeight
                : 'bottom' === e.my[1]
                ? e.elemHeight
                : 0,
            d =
              'top' === e.at[1]
                ? e.targetHeight
                : 'bottom' === e.at[1]
                ? -e.targetHeight
                : 0,
            p = -2 * e.offset[1];
          l < 0
            ? ((s = t.top + u + d + p + e.collisionHeight - a - o) < 0 ||
                s < C(l)) &&
              (t.top += u + d + p)
            : 0 < c &&
              (0 <
                (i = t.top - e.collisionPosition.marginTop + u + d + p - r) ||
                C(i) < c) &&
              (t.top += u + d + p);
        }
      },
      flipfit: {
        left: function() {
          x.ui.position.flip.left.apply(this, arguments),
            x.ui.position.fit.left.apply(this, arguments);
        },
        top: function() {
          x.ui.position.flip.top.apply(this, arguments),
            x.ui.position.fit.top.apply(this, arguments);
        }
      }
    });
  var t;
  x.ui.position,
    x.extend(x.expr[':'], {
      data: x.expr.createPseudo
        ? x.expr.createPseudo(function(e) {
            return function(t) {
              return !!x.data(t, e);
            };
          })
        : function(t, e, i) {
            return !!x.data(t, i[3]);
          }
    }),
    x.fn.extend({
      disableSelection:
        ((t =
          'onselectstart' in document.createElement('div')
            ? 'selectstart'
            : 'mousedown'),
        function() {
          return this.on(t + '.ui-disableSelection', function(t) {
            t.preventDefault();
          });
        }),
      enableSelection: function() {
        return this.off('.ui-disableSelection');
      }
    });
  (x.ui.focusable = function(t, e) {
    var i,
      s,
      n,
      o,
      a,
      r = t.nodeName.toLowerCase();
    return 'area' === r
      ? ((s = (i = t.parentNode).name),
        !(!t.href || !s || 'map' !== i.nodeName.toLowerCase()) &&
          0 < (n = x("img[usemap='#" + s + "']")).length && n.is(':visible'))
      : (/^(input|select|textarea|button|object)$/.test(r)
          ? (o = !t.disabled) &&
            (a = x(t).closest('fieldset')[0]) &&
            (o = !a.disabled)
          : (o = ('a' === r && t.href) || e),
        o &&
          x(t).is(':visible') &&
          (function(t) {
            var e = t.css('visibility');
            for (; 'inherit' === e; )
              (t = t.parent()), (e = t.css('visibility'));
            return 'hidden' !== e;
          })(x(t)));
  }),
    x.extend(x.expr[':'], {
      focusable: function(t) {
        return x.ui.focusable(t, null != x.attr(t, 'tabindex'));
      }
    });
  x.ui.focusable,
    (x.fn.form = function() {
      return 'string' == typeof this[0].form
        ? this.closest('form')
        : x(this[0].form);
    }),
    (x.ui.formResetMixin = {
      _formResetHandler: function() {
        var e = x(this);
        setTimeout(function() {
          var t = e.data('ui-form-reset-instances');
          x.each(t, function() {
            this.refresh();
          });
        });
      },
      _bindFormResetHandler: function() {
        if (((this.form = this.element.form()), this.form.length)) {
          var t = this.form.data('ui-form-reset-instances') || [];
          t.length ||
            this.form.on('reset.ui-form-reset', this._formResetHandler),
            t.push(this),
            this.form.data('ui-form-reset-instances', t);
        }
      },
      _unbindFormResetHandler: function() {
        if (this.form.length) {
          var t = this.form.data('ui-form-reset-instances');
          t.splice(x.inArray(this, t), 1),
            t.length
              ? this.form.data('ui-form-reset-instances', t)
              : this.form
                  .removeData('ui-form-reset-instances')
                  .off('reset.ui-form-reset');
        }
      }
    });
  '1.7' === x.fn.jquery.substring(0, 3) &&
    (x.each(['Width', 'Height'], function(t, i) {
      var n = 'Width' === i ? ['Left', 'Right'] : ['Top', 'Bottom'],
        s = i.toLowerCase(),
        o = {
          innerWidth: x.fn.innerWidth,
          innerHeight: x.fn.innerHeight,
          outerWidth: x.fn.outerWidth,
          outerHeight: x.fn.outerHeight
        };
      function a(t, e, i, s) {
        return (
          x.each(n, function() {
            (e -= parseFloat(x.css(t, 'padding' + this)) || 0),
              i && (e -= parseFloat(x.css(t, 'border' + this + 'Width')) || 0),
              s && (e -= parseFloat(x.css(t, 'margin' + this)) || 0);
          }),
          e
        );
      }
      (x.fn['inner' + i] = function(t) {
        return void 0 === t
          ? o['inner' + i].call(this)
          : this.each(function() {
              x(this).css(s, a(this, t) + 'px');
            });
      }),
        (x.fn['outer' + i] = function(t, e) {
          return 'number' != typeof t
            ? o['outer' + i].call(this, t)
            : this.each(function() {
                x(this).css(s, a(this, t, !0, e) + 'px');
              });
        });
    }),
    (x.fn.addBack = function(t) {
      return this.add(null == t ? this.prevObject : this.prevObject.filter(t));
    }));
  (x.ui.keyCode = {
    BACKSPACE: 8,
    COMMA: 188,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    LEFT: 37,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PERIOD: 190,
    RIGHT: 39,
    SPACE: 32,
    TAB: 9,
    UP: 38
  }),
    (x.ui.escapeSelector =
      ((e = /([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g),
      function(t) {
        return t.replace(e, '\\$1');
      })),
    (x.fn.labels = function() {
      var t, e, i, s, n;
      return this[0].labels && this[0].labels.length
        ? this.pushStack(this[0].labels)
        : ((s = this.eq(0).parents('label')),
          (i = this.attr('id')) &&
            ((n = (t = this.eq(0)
              .parents()
              .last()).add(t.length ? t.siblings() : this.siblings())),
            (e = "label[for='" + x.ui.escapeSelector(i) + "']"),
            (s = s.add(n.find(e).addBack(e)))),
          this.pushStack(s));
    }),
    (x.fn.scrollParent = function(t) {
      var e = this.css('position'),
        i = 'absolute' === e,
        s = t ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
        n = this.parents()
          .filter(function() {
            var t = x(this);
            return (
              (!i || 'static' !== t.css('position')) &&
              s.test(
                t.css('overflow') + t.css('overflow-y') + t.css('overflow-x')
              )
            );
          })
          .eq(0);
      return 'fixed' !== e && n.length
        ? n
        : x(this[0].ownerDocument || document);
    }),
    x.extend(x.expr[':'], {
      tabbable: function(t) {
        var e = x.attr(t, 'tabindex'),
          i = null != e;
        return (!i || 0 <= e) && x.ui.focusable(t, i);
      }
    }),
    x.fn.extend({
      uniqueId:
        ((u = 0),
        function() {
          return this.each(function() {
            this.id || (this.id = 'ui-id-' + ++u);
          });
        }),
      removeUniqueId: function() {
        return this.each(function() {
          /^ui-id-\d+$/.test(this.id) && x(this).removeAttr('id');
        });
      }
    }),
    (x.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()));
  var e,
    u,
    d = !1;
  x(document).on('mouseup', function() {
    d = !1;
  });
  x.widget('ui.mouse', {
    version: '1.12.1',
    options: {
      cancel: 'input, textarea, button, select, option',
      distance: 1,
      delay: 0
    },
    _mouseInit: function() {
      var e = this;
      this.element
        .on('mousedown.' + this.widgetName, function(t) {
          return e._mouseDown(t);
        })
        .on('click.' + this.widgetName, function(t) {
          if (!0 === x.data(t.target, e.widgetName + '.preventClickEvent'))
            return (
              x.removeData(t.target, e.widgetName + '.preventClickEvent'),
              t.stopImmediatePropagation(),
              !1
            );
        }),
        (this.started = !1);
    },
    _mouseDestroy: function() {
      this.element.off('.' + this.widgetName),
        this._mouseMoveDelegate &&
          this.document
            .off('mousemove.' + this.widgetName, this._mouseMoveDelegate)
            .off('mouseup.' + this.widgetName, this._mouseUpDelegate);
    },
    _mouseDown: function(t) {
      if (!d) {
        (this._mouseMoved = !1),
          this._mouseStarted && this._mouseUp(t),
          (this._mouseDownEvent = t);
        var e = this,
          i = 1 === t.which,
          s =
            !('string' != typeof this.options.cancel || !t.target.nodeName) &&
            x(t.target).closest(this.options.cancel).length;
        return i && !s && this._mouseCapture(t)
          ? ((this.mouseDelayMet = !this.options.delay),
            this.mouseDelayMet ||
              (this._mouseDelayTimer = setTimeout(function() {
                e.mouseDelayMet = !0;
              }, this.options.delay)),
            this._mouseDistanceMet(t) &&
            this._mouseDelayMet(t) &&
            ((this._mouseStarted = !1 !== this._mouseStart(t)),
            !this._mouseStarted)
              ? (t.preventDefault(), !0)
              : (!0 ===
                  x.data(t.target, this.widgetName + '.preventClickEvent') &&
                  x.removeData(
                    t.target,
                    this.widgetName + '.preventClickEvent'
                  ),
                (this._mouseMoveDelegate = function(t) {
                  return e._mouseMove(t);
                }),
                (this._mouseUpDelegate = function(t) {
                  return e._mouseUp(t);
                }),
                this.document
                  .on('mousemove.' + this.widgetName, this._mouseMoveDelegate)
                  .on('mouseup.' + this.widgetName, this._mouseUpDelegate),
                t.preventDefault(),
                (d = !0)))
          : !0;
      }
    },
    _mouseMove: function(t) {
      if (this._mouseMoved) {
        if (
          x.ui.ie &&
          (!document.documentMode || document.documentMode < 9) &&
          !t.button
        )
          return this._mouseUp(t);
        if (!t.which)
          if (
            t.originalEvent.altKey ||
            t.originalEvent.ctrlKey ||
            t.originalEvent.metaKey ||
            t.originalEvent.shiftKey
          )
            this.ignoreMissingWhich = !0;
          else if (!this.ignoreMissingWhich) return this._mouseUp(t);
      }
      return (
        (t.which || t.button) && (this._mouseMoved = !0),
        this._mouseStarted
          ? (this._mouseDrag(t), t.preventDefault())
          : (this._mouseDistanceMet(t) &&
              this._mouseDelayMet(t) &&
              ((this._mouseStarted =
                !1 !== this._mouseStart(this._mouseDownEvent, t)),
              this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)),
            !this._mouseStarted)
      );
    },
    _mouseUp: function(t) {
      this.document
        .off('mousemove.' + this.widgetName, this._mouseMoveDelegate)
        .off('mouseup.' + this.widgetName, this._mouseUpDelegate),
        this._mouseStarted &&
          ((this._mouseStarted = !1),
          t.target === this._mouseDownEvent.target &&
            x.data(t.target, this.widgetName + '.preventClickEvent', !0),
          this._mouseStop(t)),
        this._mouseDelayTimer &&
          (clearTimeout(this._mouseDelayTimer), delete this._mouseDelayTimer),
        (this.ignoreMissingWhich = !1),
        (d = !1),
        t.preventDefault();
    },
    _mouseDistanceMet: function(t) {
      return (
        Math.max(
          Math.abs(this._mouseDownEvent.pageX - t.pageX),
          Math.abs(this._mouseDownEvent.pageY - t.pageY)
        ) >= this.options.distance
      );
    },
    _mouseDelayMet: function() {
      return this.mouseDelayMet;
    },
    _mouseStart: function() {},
    _mouseDrag: function() {},
    _mouseStop: function() {},
    _mouseCapture: function() {
      return !0;
    }
  }),
    (x.ui.plugin = {
      add: function(t, e, i) {
        var s,
          n = x.ui[t].prototype;
        for (s in i)
          (n.plugins[s] = n.plugins[s] || []), n.plugins[s].push([e, i[s]]);
      },
      call: function(t, e, i, s) {
        var n,
          o = t.plugins[e];
        if (
          o &&
          (s ||
            (t.element[0].parentNode &&
              11 !== t.element[0].parentNode.nodeType))
        )
          for (n = 0; n < o.length; n++)
            t.options[o[n][0]] && o[n][1].apply(t.element, i);
      }
    }),
    (x.ui.safeActiveElement = function(e) {
      var i;
      try {
        i = e.activeElement;
      } catch (t) {
        i = e.body;
      }
      return (i = i || e.body).nodeName || (i = e.body), i;
    }),
    (x.ui.safeBlur = function(t) {
      t && 'body' !== t.nodeName.toLowerCase() && x(t).trigger('blur');
    });
  x.widget('ui.draggable', x.ui.mouse, {
    version: '1.12.1',
    widgetEventPrefix: 'drag',
    options: {
      addClasses: !0,
      appendTo: 'parent',
      axis: !1,
      connectToSortable: !1,
      containment: !1,
      cursor: 'auto',
      cursorAt: !1,
      grid: !1,
      handle: !1,
      helper: 'original',
      iframeFix: !1,
      opacity: !1,
      refreshPositions: !1,
      revert: !1,
      revertDuration: 500,
      scope: 'default',
      scroll: !0,
      scrollSensitivity: 20,
      scrollSpeed: 20,
      snap: !1,
      snapMode: 'both',
      snapTolerance: 20,
      stack: !1,
      zIndex: !1,
      drag: null,
      start: null,
      stop: null
    },
    _create: function() {
      'original' === this.options.helper && this._setPositionRelative(),
        this.options.addClasses && this._addClass('ui-draggable'),
        this._setHandleClassName(),
        this._mouseInit();
    },
    _setOption: function(t, e) {
      this._super(t, e),
        'handle' === t &&
          (this._removeHandleClassName(), this._setHandleClassName());
    },
    _destroy: function() {
      (this.helper || this.element).is('.ui-draggable-dragging')
        ? (this.destroyOnClear = !0)
        : (this._removeHandleClassName(), this._mouseDestroy());
    },
    _mouseCapture: function(t) {
      var e = this.options;
      return (
        !(
          this.helper ||
          e.disabled ||
          0 < x(t.target).closest('.ui-resizable-handle').length
        ) &&
        ((this.handle = this._getHandle(t)),
        !!this.handle &&
          (this._blurActiveElement(t),
          this._blockFrames(!0 === e.iframeFix ? 'iframe' : e.iframeFix),
          !0))
      );
    },
    _blockFrames: function(t) {
      this.iframeBlocks = this.document.find(t).map(function() {
        var t = x(this);
        return x('<div>')
          .css('position', 'absolute')
          .appendTo(t.parent())
          .outerWidth(t.outerWidth())
          .outerHeight(t.outerHeight())
          .offset(t.offset())[0];
      });
    },
    _unblockFrames: function() {
      this.iframeBlocks &&
        (this.iframeBlocks.remove(), delete this.iframeBlocks);
    },
    _blurActiveElement: function(t) {
      var e = x.ui.safeActiveElement(this.document[0]);
      x(t.target).closest(e).length || x.ui.safeBlur(e);
    },
    _mouseStart: function(t) {
      var e = this.options;
      return (
        (this.helper = this._createHelper(t)),
        this._addClass(this.helper, 'ui-draggable-dragging'),
        this._cacheHelperProportions(),
        x.ui.ddmanager && (x.ui.ddmanager.current = this),
        this._cacheMargins(),
        (this.cssPosition = this.helper.css('position')),
        (this.scrollParent = this.helper.scrollParent(!0)),
        (this.offsetParent = this.helper.offsetParent()),
        (this.hasFixedAncestor =
          0 <
          this.helper.parents().filter(function() {
            return 'fixed' === x(this).css('position');
          }).length),
        (this.positionAbs = this.element.offset()),
        this._refreshOffsets(t),
        (this.originalPosition = this.position = this._generatePosition(t, !1)),
        (this.originalPageX = t.pageX),
        (this.originalPageY = t.pageY),
        e.cursorAt && this._adjustOffsetFromHelper(e.cursorAt),
        this._setContainment(),
        !1 === this._trigger('start', t)
          ? (this._clear(), !1)
          : (this._cacheHelperProportions(),
            x.ui.ddmanager &&
              !e.dropBehaviour &&
              x.ui.ddmanager.prepareOffsets(this, t),
            this._mouseDrag(t, !0),
            x.ui.ddmanager && x.ui.ddmanager.dragStart(this, t),
            !0)
      );
    },
    _refreshOffsets: function(t) {
      (this.offset = {
        top: this.positionAbs.top - this.margins.top,
        left: this.positionAbs.left - this.margins.left,
        scroll: !1,
        parent: this._getParentOffset(),
        relative: this._getRelativeOffset()
      }),
        (this.offset.click = {
          left: t.pageX - this.offset.left,
          top: t.pageY - this.offset.top
        });
    },
    _mouseDrag: function(t, e) {
      if (
        (this.hasFixedAncestor &&
          (this.offset.parent = this._getParentOffset()),
        (this.position = this._generatePosition(t, !0)),
        (this.positionAbs = this._convertPositionTo('absolute')),
        !e)
      ) {
        var i = this._uiHash();
        if (!1 === this._trigger('drag', t, i))
          return this._mouseUp(new x.Event('mouseup', t)), !1;
        this.position = i.position;
      }
      return (
        (this.helper[0].style.left = this.position.left + 'px'),
        (this.helper[0].style.top = this.position.top + 'px'),
        x.ui.ddmanager && x.ui.ddmanager.drag(this, t),
        !1
      );
    },
    _mouseStop: function(t) {
      var e = this,
        i = !1;
      return (
        x.ui.ddmanager &&
          !this.options.dropBehaviour &&
          (i = x.ui.ddmanager.drop(this, t)),
        this.dropped && ((i = this.dropped), (this.dropped = !1)),
        ('invalid' === this.options.revert && !i) ||
        ('valid' === this.options.revert && i) ||
        !0 === this.options.revert ||
        (x.isFunction(this.options.revert) &&
          this.options.revert.call(this.element, i))
          ? x(this.helper).animate(
              this.originalPosition,
              parseInt(this.options.revertDuration, 10),
              function() {
                !1 !== e._trigger('stop', t) && e._clear();
              }
            )
          : !1 !== this._trigger('stop', t) && this._clear(),
        !1
      );
    },
    _mouseUp: function(t) {
      return (
        this._unblockFrames(),
        x.ui.ddmanager && x.ui.ddmanager.dragStop(this, t),
        this.handleElement.is(t.target) && this.element.trigger('focus'),
        x.ui.mouse.prototype._mouseUp.call(this, t)
      );
    },
    cancel: function() {
      return (
        this.helper.is('.ui-draggable-dragging')
          ? this._mouseUp(new x.Event('mouseup', { target: this.element[0] }))
          : this._clear(),
        this
      );
    },
    _getHandle: function(t) {
      return (
        !this.options.handle ||
        !!x(t.target).closest(this.element.find(this.options.handle)).length
      );
    },
    _setHandleClassName: function() {
      (this.handleElement = this.options.handle
        ? this.element.find(this.options.handle)
        : this.element),
        this._addClass(this.handleElement, 'ui-draggable-handle');
    },
    _removeHandleClassName: function() {
      this._removeClass(this.handleElement, 'ui-draggable-handle');
    },
    _createHelper: function(t) {
      var e = this.options,
        i = x.isFunction(e.helper),
        s = i
          ? x(e.helper.apply(this.element[0], [t]))
          : 'clone' === e.helper
          ? this.element.clone().removeAttr('id')
          : this.element;
      return (
        s.parents('body').length ||
          s.appendTo(
            'parent' === e.appendTo ? this.element[0].parentNode : e.appendTo
          ),
        i && s[0] === this.element[0] && this._setPositionRelative(),
        s[0] === this.element[0] ||
          /(fixed|absolute)/.test(s.css('position')) ||
          s.css('position', 'absolute'),
        s
      );
    },
    _setPositionRelative: function() {
      /^(?:r|a|f)/.test(this.element.css('position')) ||
        (this.element[0].style.position = 'relative');
    },
    _adjustOffsetFromHelper: function(t) {
      'string' == typeof t && (t = t.split(' ')),
        x.isArray(t) && (t = { left: +t[0], top: +t[1] || 0 }),
        'left' in t && (this.offset.click.left = t.left + this.margins.left),
        'right' in t &&
          (this.offset.click.left =
            this.helperProportions.width - t.right + this.margins.left),
        'top' in t && (this.offset.click.top = t.top + this.margins.top),
        'bottom' in t &&
          (this.offset.click.top =
            this.helperProportions.height - t.bottom + this.margins.top);
    },
    _isRootNode: function(t) {
      return /(html|body)/i.test(t.tagName) || t === this.document[0];
    },
    _getParentOffset: function() {
      var t = this.offsetParent.offset(),
        e = this.document[0];
      return (
        'absolute' === this.cssPosition &&
          this.scrollParent[0] !== e &&
          x.contains(this.scrollParent[0], this.offsetParent[0]) &&
          ((t.left += this.scrollParent.scrollLeft()),
          (t.top += this.scrollParent.scrollTop())),
        this._isRootNode(this.offsetParent[0]) && (t = { top: 0, left: 0 }),
        {
          top:
            t.top +
            (parseInt(this.offsetParent.css('borderTopWidth'), 10) || 0),
          left:
            t.left +
            (parseInt(this.offsetParent.css('borderLeftWidth'), 10) || 0)
        }
      );
    },
    _getRelativeOffset: function() {
      if ('relative' !== this.cssPosition) return { top: 0, left: 0 };
      var t = this.element.position(),
        e = this._isRootNode(this.scrollParent[0]);
      return {
        top:
          t.top -
          (parseInt(this.helper.css('top'), 10) || 0) +
          (e ? 0 : this.scrollParent.scrollTop()),
        left:
          t.left -
          (parseInt(this.helper.css('left'), 10) || 0) +
          (e ? 0 : this.scrollParent.scrollLeft())
      };
    },
    _cacheMargins: function() {
      this.margins = {
        left: parseInt(this.element.css('marginLeft'), 10) || 0,
        top: parseInt(this.element.css('marginTop'), 10) || 0,
        right: parseInt(this.element.css('marginRight'), 10) || 0,
        bottom: parseInt(this.element.css('marginBottom'), 10) || 0
      };
    },
    _cacheHelperProportions: function() {
      this.helperProportions = {
        width: this.helper.outerWidth(),
        height: this.helper.outerHeight()
      };
    },
    _setContainment: function() {
      var t,
        e,
        i,
        s = this.options,
        n = this.document[0];
      (this.relativeContainer = null),
        s.containment
          ? 'window' !== s.containment
            ? 'document' !== s.containment
              ? s.containment.constructor !== Array
                ? ('parent' === s.containment &&
                    (s.containment = this.helper[0].parentNode),
                  (i = (e = x(s.containment))[0]) &&
                    ((t = /(scroll|auto)/.test(e.css('overflow'))),
                    (this.containment = [
                      (parseInt(e.css('borderLeftWidth'), 10) || 0) +
                        (parseInt(e.css('paddingLeft'), 10) || 0),
                      (parseInt(e.css('borderTopWidth'), 10) || 0) +
                        (parseInt(e.css('paddingTop'), 10) || 0),
                      (t
                        ? Math.max(i.scrollWidth, i.offsetWidth)
                        : i.offsetWidth) -
                        (parseInt(e.css('borderRightWidth'), 10) || 0) -
                        (parseInt(e.css('paddingRight'), 10) || 0) -
                        this.helperProportions.width -
                        this.margins.left -
                        this.margins.right,
                      (t
                        ? Math.max(i.scrollHeight, i.offsetHeight)
                        : i.offsetHeight) -
                        (parseInt(e.css('borderBottomWidth'), 10) || 0) -
                        (parseInt(e.css('paddingBottom'), 10) || 0) -
                        this.helperProportions.height -
                        this.margins.top -
                        this.margins.bottom
                    ]),
                    (this.relativeContainer = e)))
                : (this.containment = s.containment)
              : (this.containment = [
                  0,
                  0,
                  x(n).width() -
                    this.helperProportions.width -
                    this.margins.left,
                  (x(n).height() || n.body.parentNode.scrollHeight) -
                    this.helperProportions.height -
                    this.margins.top
                ])
            : (this.containment = [
                x(window).scrollLeft() -
                  this.offset.relative.left -
                  this.offset.parent.left,
                x(window).scrollTop() -
                  this.offset.relative.top -
                  this.offset.parent.top,
                x(window).scrollLeft() +
                  x(window).width() -
                  this.helperProportions.width -
                  this.margins.left,
                x(window).scrollTop() +
                  (x(window).height() || n.body.parentNode.scrollHeight) -
                  this.helperProportions.height -
                  this.margins.top
              ])
          : (this.containment = null);
    },
    _convertPositionTo: function(t, e) {
      e = e || this.position;
      var i = 'absolute' === t ? 1 : -1,
        s = this._isRootNode(this.scrollParent[0]);
      return {
        top:
          e.top +
          this.offset.relative.top * i +
          this.offset.parent.top * i -
          ('fixed' === this.cssPosition
            ? -this.offset.scroll.top
            : s
            ? 0
            : this.offset.scroll.top) *
            i,
        left:
          e.left +
          this.offset.relative.left * i +
          this.offset.parent.left * i -
          ('fixed' === this.cssPosition
            ? -this.offset.scroll.left
            : s
            ? 0
            : this.offset.scroll.left) *
            i
      };
    },
    _generatePosition: function(t, e) {
      var i,
        s,
        n,
        o,
        a = this.options,
        r = this._isRootNode(this.scrollParent[0]),
        h = t.pageX,
        l = t.pageY;
      return (
        (r && this.offset.scroll) ||
          (this.offset.scroll = {
            top: this.scrollParent.scrollTop(),
            left: this.scrollParent.scrollLeft()
          }),
        e &&
          (this.containment &&
            ((i = this.relativeContainer
              ? ((s = this.relativeContainer.offset()),
                [
                  this.containment[0] + s.left,
                  this.containment[1] + s.top,
                  this.containment[2] + s.left,
                  this.containment[3] + s.top
                ])
              : this.containment),
            t.pageX - this.offset.click.left < i[0] &&
              (h = i[0] + this.offset.click.left),
            t.pageY - this.offset.click.top < i[1] &&
              (l = i[1] + this.offset.click.top),
            t.pageX - this.offset.click.left > i[2] &&
              (h = i[2] + this.offset.click.left),
            t.pageY - this.offset.click.top > i[3] &&
              (l = i[3] + this.offset.click.top)),
          a.grid &&
            ((n = a.grid[1]
              ? this.originalPageY +
                Math.round((l - this.originalPageY) / a.grid[1]) * a.grid[1]
              : this.originalPageY),
            (l = i
              ? n - this.offset.click.top >= i[1] ||
                n - this.offset.click.top > i[3]
                ? n
                : n - this.offset.click.top >= i[1]
                ? n - a.grid[1]
                : n + a.grid[1]
              : n),
            (o = a.grid[0]
              ? this.originalPageX +
                Math.round((h - this.originalPageX) / a.grid[0]) * a.grid[0]
              : this.originalPageX),
            (h = i
              ? o - this.offset.click.left >= i[0] ||
                o - this.offset.click.left > i[2]
                ? o
                : o - this.offset.click.left >= i[0]
                ? o - a.grid[0]
                : o + a.grid[0]
              : o)),
          'y' === a.axis && (h = this.originalPageX),
          'x' === a.axis && (l = this.originalPageY)),
        {
          top:
            l -
            this.offset.click.top -
            this.offset.relative.top -
            this.offset.parent.top +
            ('fixed' === this.cssPosition
              ? -this.offset.scroll.top
              : r
              ? 0
              : this.offset.scroll.top),
          left:
            h -
            this.offset.click.left -
            this.offset.relative.left -
            this.offset.parent.left +
            ('fixed' === this.cssPosition
              ? -this.offset.scroll.left
              : r
              ? 0
              : this.offset.scroll.left)
        }
      );
    },
    _clear: function() {
      this._removeClass(this.helper, 'ui-draggable-dragging'),
        this.helper[0] === this.element[0] ||
          this.cancelHelperRemoval ||
          this.helper.remove(),
        (this.helper = null),
        (this.cancelHelperRemoval = !1),
        this.destroyOnClear && this.destroy();
    },
    _trigger: function(t, e, i) {
      return (
        (i = i || this._uiHash()),
        x.ui.plugin.call(this, t, [e, i, this], !0),
        /^(drag|start|stop)/.test(t) &&
          ((this.positionAbs = this._convertPositionTo('absolute')),
          (i.offset = this.positionAbs)),
        x.Widget.prototype._trigger.call(this, t, e, i)
      );
    },
    plugins: {},
    _uiHash: function() {
      return {
        helper: this.helper,
        position: this.position,
        originalPosition: this.originalPosition,
        offset: this.positionAbs
      };
    }
  }),
    x.ui.plugin.add('draggable', 'connectToSortable', {
      start: function(e, t, i) {
        var s = x.extend({}, t, { item: i.element });
        (i.sortables = []),
          x(i.options.connectToSortable).each(function() {
            var t = x(this).sortable('instance');
            t &&
              !t.options.disabled &&
              (i.sortables.push(t),
              t.refreshPositions(),
              t._trigger('activate', e, s));
          });
      },
      stop: function(e, t, i) {
        var s = x.extend({}, t, { item: i.element });
        (i.cancelHelperRemoval = !1),
          x.each(i.sortables, function() {
            var t = this;
            t.isOver
              ? ((t.isOver = 0),
                (i.cancelHelperRemoval = !0),
                (t.cancelHelperRemoval = !1),
                (t._storedCSS = {
                  position: t.placeholder.css('position'),
                  top: t.placeholder.css('top'),
                  left: t.placeholder.css('left')
                }),
                t._mouseStop(e),
                (t.options.helper = t.options._helper))
              : ((t.cancelHelperRemoval = !0), t._trigger('deactivate', e, s));
          });
      },
      drag: function(i, s, n) {
        x.each(n.sortables, function() {
          var t = !1,
            e = this;
          (e.positionAbs = n.positionAbs),
            (e.helperProportions = n.helperProportions),
            (e.offset.click = n.offset.click),
            e._intersectsWith(e.containerCache) &&
              ((t = !0),
              x.each(n.sortables, function() {
                return (
                  (this.positionAbs = n.positionAbs),
                  (this.helperProportions = n.helperProportions),
                  (this.offset.click = n.offset.click),
                  this !== e &&
                    this._intersectsWith(this.containerCache) &&
                    x.contains(e.element[0], this.element[0]) &&
                    (t = !1),
                  t
                );
              })),
            t
              ? (e.isOver ||
                  ((e.isOver = 1),
                  (n._parent = s.helper.parent()),
                  (e.currentItem = s.helper
                    .appendTo(e.element)
                    .data('ui-sortable-item', !0)),
                  (e.options._helper = e.options.helper),
                  (e.options.helper = function() {
                    return s.helper[0];
                  }),
                  (i.target = e.currentItem[0]),
                  e._mouseCapture(i, !0),
                  e._mouseStart(i, !0, !0),
                  (e.offset.click.top = n.offset.click.top),
                  (e.offset.click.left = n.offset.click.left),
                  (e.offset.parent.left -=
                    n.offset.parent.left - e.offset.parent.left),
                  (e.offset.parent.top -=
                    n.offset.parent.top - e.offset.parent.top),
                  n._trigger('toSortable', i),
                  (n.dropped = e.element),
                  x.each(n.sortables, function() {
                    this.refreshPositions();
                  }),
                  (n.currentItem = n.element),
                  (e.fromOutside = n)),
                e.currentItem && (e._mouseDrag(i), (s.position = e.position)))
              : e.isOver &&
                ((e.isOver = 0),
                (e.cancelHelperRemoval = !0),
                (e.options._revert = e.options.revert),
                (e.options.revert = !1),
                e._trigger('out', i, e._uiHash(e)),
                e._mouseStop(i, !0),
                (e.options.revert = e.options._revert),
                (e.options.helper = e.options._helper),
                e.placeholder && e.placeholder.remove(),
                s.helper.appendTo(n._parent),
                n._refreshOffsets(i),
                (s.position = n._generatePosition(i, !0)),
                n._trigger('fromSortable', i),
                (n.dropped = !1),
                x.each(n.sortables, function() {
                  this.refreshPositions();
                }));
        });
      }
    }),
    x.ui.plugin.add('draggable', 'cursor', {
      start: function(t, e, i) {
        var s = x('body'),
          n = i.options;
        s.css('cursor') && (n._cursor = s.css('cursor')),
          s.css('cursor', n.cursor);
      },
      stop: function(t, e, i) {
        var s = i.options;
        s._cursor && x('body').css('cursor', s._cursor);
      }
    }),
    x.ui.plugin.add('draggable', 'opacity', {
      start: function(t, e, i) {
        var s = x(e.helper),
          n = i.options;
        s.css('opacity') && (n._opacity = s.css('opacity')),
          s.css('opacity', n.opacity);
      },
      stop: function(t, e, i) {
        var s = i.options;
        s._opacity && x(e.helper).css('opacity', s._opacity);
      }
    }),
    x.ui.plugin.add('draggable', 'scroll', {
      start: function(t, e, i) {
        i.scrollParentNotHidden ||
          (i.scrollParentNotHidden = i.helper.scrollParent(!1)),
          i.scrollParentNotHidden[0] !== i.document[0] &&
            'HTML' !== i.scrollParentNotHidden[0].tagName &&
            (i.overflowOffset = i.scrollParentNotHidden.offset());
      },
      drag: function(t, e, i) {
        var s = i.options,
          n = !1,
          o = i.scrollParentNotHidden[0],
          a = i.document[0];
        o !== a && 'HTML' !== o.tagName
          ? ((s.axis && 'x' === s.axis) ||
              (i.overflowOffset.top + o.offsetHeight - t.pageY <
              s.scrollSensitivity
                ? (o.scrollTop = n = o.scrollTop + s.scrollSpeed)
                : t.pageY - i.overflowOffset.top < s.scrollSensitivity &&
                  (o.scrollTop = n = o.scrollTop - s.scrollSpeed)),
            (s.axis && 'y' === s.axis) ||
              (i.overflowOffset.left + o.offsetWidth - t.pageX <
              s.scrollSensitivity
                ? (o.scrollLeft = n = o.scrollLeft + s.scrollSpeed)
                : t.pageX - i.overflowOffset.left < s.scrollSensitivity &&
                  (o.scrollLeft = n = o.scrollLeft - s.scrollSpeed)))
          : ((s.axis && 'x' === s.axis) ||
              (t.pageY - x(a).scrollTop() < s.scrollSensitivity
                ? (n = x(a).scrollTop(x(a).scrollTop() - s.scrollSpeed))
                : x(window).height() - (t.pageY - x(a).scrollTop()) <
                    s.scrollSensitivity &&
                  (n = x(a).scrollTop(x(a).scrollTop() + s.scrollSpeed))),
            (s.axis && 'y' === s.axis) ||
              (t.pageX - x(a).scrollLeft() < s.scrollSensitivity
                ? (n = x(a).scrollLeft(x(a).scrollLeft() - s.scrollSpeed))
                : x(window).width() - (t.pageX - x(a).scrollLeft()) <
                    s.scrollSensitivity &&
                  (n = x(a).scrollLeft(x(a).scrollLeft() + s.scrollSpeed)))),
          !1 !== n &&
            x.ui.ddmanager &&
            !s.dropBehaviour &&
            x.ui.ddmanager.prepareOffsets(i, t);
      }
    }),
    x.ui.plugin.add('draggable', 'snap', {
      start: function(t, e, i) {
        var s = i.options;
        (i.snapElements = []),
          x(
            s.snap.constructor !== String
              ? s.snap.items || ':data(ui-draggable)'
              : s.snap
          ).each(function() {
            var t = x(this),
              e = t.offset();
            this !== i.element[0] &&
              i.snapElements.push({
                item: this,
                width: t.outerWidth(),
                height: t.outerHeight(),
                top: e.top,
                left: e.left
              });
          });
      },
      drag: function(t, e, i) {
        var s,
          n,
          o,
          a,
          r,
          h,
          l,
          c,
          u,
          d,
          p = i.options,
          f = p.snapTolerance,
          g = e.offset.left,
          m = g + i.helperProportions.width,
          _ = e.offset.top,
          v = _ + i.helperProportions.height;
        for (u = i.snapElements.length - 1; 0 <= u; u--)
          (h =
            (r = i.snapElements[u].left - i.margins.left) +
            i.snapElements[u].width),
            (c =
              (l = i.snapElements[u].top - i.margins.top) +
              i.snapElements[u].height),
            m < r - f ||
            h + f < g ||
            v < l - f ||
            c + f < _ ||
            !x.contains(
              i.snapElements[u].item.ownerDocument,
              i.snapElements[u].item
            )
              ? (i.snapElements[u].snapping &&
                  i.options.snap.release &&
                  i.options.snap.release.call(
                    i.element,
                    t,
                    x.extend(i._uiHash(), { snapItem: i.snapElements[u].item })
                  ),
                (i.snapElements[u].snapping = !1))
              : ('inner' !== p.snapMode &&
                  ((s = Math.abs(l - v) <= f),
                  (n = Math.abs(c - _) <= f),
                  (o = Math.abs(r - m) <= f),
                  (a = Math.abs(h - g) <= f),
                  s &&
                    (e.position.top = i._convertPositionTo('relative', {
                      top: l - i.helperProportions.height,
                      left: 0
                    }).top),
                  n &&
                    (e.position.top = i._convertPositionTo('relative', {
                      top: c,
                      left: 0
                    }).top),
                  o &&
                    (e.position.left = i._convertPositionTo('relative', {
                      top: 0,
                      left: r - i.helperProportions.width
                    }).left),
                  a &&
                    (e.position.left = i._convertPositionTo('relative', {
                      top: 0,
                      left: h
                    }).left)),
                (d = s || n || o || a),
                'outer' !== p.snapMode &&
                  ((s = Math.abs(l - _) <= f),
                  (n = Math.abs(c - v) <= f),
                  (o = Math.abs(r - g) <= f),
                  (a = Math.abs(h - m) <= f),
                  s &&
                    (e.position.top = i._convertPositionTo('relative', {
                      top: l,
                      left: 0
                    }).top),
                  n &&
                    (e.position.top = i._convertPositionTo('relative', {
                      top: c - i.helperProportions.height,
                      left: 0
                    }).top),
                  o &&
                    (e.position.left = i._convertPositionTo('relative', {
                      top: 0,
                      left: r
                    }).left),
                  a &&
                    (e.position.left = i._convertPositionTo('relative', {
                      top: 0,
                      left: h - i.helperProportions.width
                    }).left)),
                !i.snapElements[u].snapping &&
                  (s || n || o || a || d) &&
                  i.options.snap.snap &&
                  i.options.snap.snap.call(
                    i.element,
                    t,
                    x.extend(i._uiHash(), { snapItem: i.snapElements[u].item })
                  ),
                (i.snapElements[u].snapping = s || n || o || a || d));
      }
    }),
    x.ui.plugin.add('draggable', 'stack', {
      start: function(t, e, i) {
        var s,
          n = i.options,
          o = x.makeArray(x(n.stack)).sort(function(t, e) {
            return (
              (parseInt(x(t).css('zIndex'), 10) || 0) -
              (parseInt(x(e).css('zIndex'), 10) || 0)
            );
          });
        o.length &&
          ((s = parseInt(x(o[0]).css('zIndex'), 10) || 0),
          x(o).each(function(t) {
            x(this).css('zIndex', s + t);
          }),
          this.css('zIndex', s + o.length));
      }
    }),
    x.ui.plugin.add('draggable', 'zIndex', {
      start: function(t, e, i) {
        var s = x(e.helper),
          n = i.options;
        s.css('zIndex') && (n._zIndex = s.css('zIndex')),
          s.css('zIndex', n.zIndex);
      },
      stop: function(t, e, i) {
        var s = i.options;
        s._zIndex && x(e.helper).css('zIndex', s._zIndex);
      }
    });
  x.ui.draggable;
  x.widget('ui.droppable', {
    version: '1.12.1',
    widgetEventPrefix: 'drop',
    options: {
      accept: '*',
      addClasses: !0,
      greedy: !1,
      scope: 'default',
      tolerance: 'intersect',
      activate: null,
      deactivate: null,
      drop: null,
      out: null,
      over: null
    },
    _create: function() {
      var t,
        e = this.options,
        i = e.accept;
      (this.isover = !1),
        (this.isout = !0),
        (this.accept = x.isFunction(i)
          ? i
          : function(t) {
              return t.is(i);
            }),
        (this.proportions = function() {
          if (!arguments.length)
            return (
              t ||
              (t = {
                width: this.element[0].offsetWidth,
                height: this.element[0].offsetHeight
              })
            );
          t = arguments[0];
        }),
        this._addToManager(e.scope),
        e.addClasses && this._addClass('ui-droppable');
    },
    _addToManager: function(t) {
      (x.ui.ddmanager.droppables[t] = x.ui.ddmanager.droppables[t] || []),
        x.ui.ddmanager.droppables[t].push(this);
    },
    _splice: function(t) {
      for (var e = 0; e < t.length; e++) t[e] === this && t.splice(e, 1);
    },
    _destroy: function() {
      var t = x.ui.ddmanager.droppables[this.options.scope];
      this._splice(t);
    },
    _setOption: function(t, e) {
      if ('accept' === t)
        this.accept = x.isFunction(e)
          ? e
          : function(t) {
              return t.is(e);
            };
      else if ('scope' === t) {
        var i = x.ui.ddmanager.droppables[this.options.scope];
        this._splice(i), this._addToManager(e);
      }
      this._super(t, e);
    },
    _activate: function(t) {
      var e = x.ui.ddmanager.current;
      this._addActiveClass(), e && this._trigger('activate', t, this.ui(e));
    },
    _deactivate: function(t) {
      var e = x.ui.ddmanager.current;
      this._removeActiveClass(),
        e && this._trigger('deactivate', t, this.ui(e));
    },
    _over: function(t) {
      var e = x.ui.ddmanager.current;
      e &&
        (e.currentItem || e.element)[0] !== this.element[0] &&
        this.accept.call(this.element[0], e.currentItem || e.element) &&
        (this._addHoverClass(), this._trigger('over', t, this.ui(e)));
    },
    _out: function(t) {
      var e = x.ui.ddmanager.current;
      e &&
        (e.currentItem || e.element)[0] !== this.element[0] &&
        this.accept.call(this.element[0], e.currentItem || e.element) &&
        (this._removeHoverClass(), this._trigger('out', t, this.ui(e)));
    },
    _drop: function(e, t) {
      var i = t || x.ui.ddmanager.current,
        s = !1;
      return (
        !(!i || (i.currentItem || i.element)[0] === this.element[0]) &&
        (this.element
          .find(':data(ui-droppable)')
          .not('.ui-draggable-dragging')
          .each(function() {
            var t = x(this).droppable('instance');
            if (
              t.options.greedy &&
              !t.options.disabled &&
              t.options.scope === i.options.scope &&
              t.accept.call(t.element[0], i.currentItem || i.element) &&
              p(
                i,
                x.extend(t, { offset: t.element.offset() }),
                t.options.tolerance,
                e
              )
            )
              return !(s = !0);
          }),
        !s &&
          !!this.accept.call(this.element[0], i.currentItem || i.element) &&
            (this._removeActiveClass(),
            this._removeHoverClass(),
            this._trigger('drop', e, this.ui(i)),
            this.element))
      );
    },
    ui: function(t) {
      return {
        draggable: t.currentItem || t.element,
        helper: t.helper,
        position: t.position,
        offset: t.positionAbs
      };
    },
    _addHoverClass: function() {
      this._addClass('ui-droppable-hover');
    },
    _removeHoverClass: function() {
      this._removeClass('ui-droppable-hover');
    },
    _addActiveClass: function() {
      this._addClass('ui-droppable-active');
    },
    _removeActiveClass: function() {
      this._removeClass('ui-droppable-active');
    }
  });
  var p = (x.ui.intersect = function(t, e, i, s) {
    if (!e.offset) return !1;
    var n = (t.positionAbs || t.position.absolute).left + t.margins.left,
      o = (t.positionAbs || t.position.absolute).top + t.margins.top,
      a = n + t.helperProportions.width,
      r = o + t.helperProportions.height,
      h = e.offset.left,
      l = e.offset.top,
      c = h + e.proportions().width,
      u = l + e.proportions().height;
    switch (i) {
      case 'fit':
        return h <= n && a <= c && l <= o && r <= u;
      case 'intersect':
        return (
          h < n + t.helperProportions.width / 2 &&
          a - t.helperProportions.width / 2 < c &&
          l < o + t.helperProportions.height / 2 &&
          r - t.helperProportions.height / 2 < u
        );
      case 'pointer':
        return (
          f(s.pageY, l, e.proportions().height) &&
          f(s.pageX, h, e.proportions().width)
        );
      case 'touch':
        return (
          ((l <= o && o <= u) || (l <= r && r <= u) || (o < l && u < r)) &&
          ((h <= n && n <= c) || (h <= a && a <= c) || (n < h && c < a))
        );
      default:
        return !1;
    }
  });
  function f(t, e, i) {
    return e <= t && t < e + i;
  }
  !(x.ui.ddmanager = {
    current: null,
    droppables: { default: [] },
    prepareOffsets: function(t, e) {
      var i,
        s,
        n = x.ui.ddmanager.droppables[t.options.scope] || [],
        o = e ? e.type : null,
        a = (t.currentItem || t.element).find(':data(ui-droppable)').addBack();
      t: for (i = 0; i < n.length; i++)
        if (
          !(
            n[i].options.disabled ||
            (t &&
              !n[i].accept.call(n[i].element[0], t.currentItem || t.element))
          )
        ) {
          for (s = 0; s < a.length; s++)
            if (a[s] === n[i].element[0]) {
              n[i].proportions().height = 0;
              continue t;
            }
          (n[i].visible = 'none' !== n[i].element.css('display')),
            n[i].visible &&
              ('mousedown' === o && n[i]._activate.call(n[i], e),
              (n[i].offset = n[i].element.offset()),
              n[i].proportions({
                width: n[i].element[0].offsetWidth,
                height: n[i].element[0].offsetHeight
              }));
        }
    },
    drop: function(t, e) {
      var i = !1;
      return (
        x.each(
          (x.ui.ddmanager.droppables[t.options.scope] || []).slice(),
          function() {
            this.options &&
              (!this.options.disabled &&
                this.visible &&
                p(t, this, this.options.tolerance, e) &&
                (i = this._drop.call(this, e) || i),
              !this.options.disabled &&
                this.visible &&
                this.accept.call(this.element[0], t.currentItem || t.element) &&
                ((this.isout = !0),
                (this.isover = !1),
                this._deactivate.call(this, e)));
          }
        ),
        i
      );
    },
    dragStart: function(t, e) {
      t.element.parentsUntil('body').on('scroll.droppable', function() {
        t.options.refreshPositions || x.ui.ddmanager.prepareOffsets(t, e);
      });
    },
    drag: function(o, a) {
      o.options.refreshPositions && x.ui.ddmanager.prepareOffsets(o, a),
        x.each(x.ui.ddmanager.droppables[o.options.scope] || [], function() {
          if (!this.options.disabled && !this.greedyChild && this.visible) {
            var t,
              e,
              i,
              s = p(o, this, this.options.tolerance, a),
              n =
                !s && this.isover
                  ? 'isout'
                  : s && !this.isover
                  ? 'isover'
                  : null;
            n &&
              (this.options.greedy &&
                ((e = this.options.scope),
                (i = this.element
                  .parents(':data(ui-droppable)')
                  .filter(function() {
                    return x(this).droppable('instance').options.scope === e;
                  })).length &&
                  ((t = x(i[0]).droppable('instance')).greedyChild =
                    'isover' === n)),
              t &&
                'isover' === n &&
                ((t.isover = !1), (t.isout = !0), t._out.call(t, a)),
              (this[n] = !0),
              (this['isout' === n ? 'isover' : 'isout'] = !1),
              this['isover' === n ? '_over' : '_out'].call(this, a),
              t &&
                'isout' === n &&
                ((t.isout = !1), (t.isover = !0), t._over.call(t, a)));
          }
        });
    },
    dragStop: function(t, e) {
      t.element.parentsUntil('body').off('scroll.droppable'),
        t.options.refreshPositions || x.ui.ddmanager.prepareOffsets(t, e);
    }
  }) !== x.uiBackCompat &&
    x.widget('ui.droppable', x.ui.droppable, {
      options: { hoverClass: !1, activeClass: !1 },
      _addActiveClass: function() {
        this._super(),
          this.options.activeClass &&
            this.element.addClass(this.options.activeClass);
      },
      _removeActiveClass: function() {
        this._super(),
          this.options.activeClass &&
            this.element.removeClass(this.options.activeClass);
      },
      _addHoverClass: function() {
        this._super(),
          this.options.hoverClass &&
            this.element.addClass(this.options.hoverClass);
      },
      _removeHoverClass: function() {
        this._super(),
          this.options.hoverClass &&
            this.element.removeClass(this.options.hoverClass);
      }
    });
  x.ui.droppable;
  x.widget('ui.resizable', x.ui.mouse, {
    version: '1.12.1',
    widgetEventPrefix: 'resize',
    options: {
      alsoResize: !1,
      animate: !1,
      animateDuration: 'slow',
      animateEasing: 'swing',
      aspectRatio: !1,
      autoHide: !1,
      classes: { 'ui-resizable-se': 'ui-icon ui-icon-gripsmall-diagonal-se' },
      containment: !1,
      ghost: !1,
      grid: !1,
      handles: 'e,s,se',
      helper: !1,
      maxHeight: null,
      maxWidth: null,
      minHeight: 10,
      minWidth: 10,
      zIndex: 90,
      resize: null,
      start: null,
      stop: null
    },
    _num: function(t) {
      return parseFloat(t) || 0;
    },
    _isNumber: function(t) {
      return !isNaN(parseFloat(t));
    },
    _hasScroll: function(t, e) {
      if ('hidden' === x(t).css('overflow')) return !1;
      var i,
        s = e && 'left' === e ? 'scrollLeft' : 'scrollTop';
      return 0 < t[s] || ((t[s] = 1), (i = 0 < t[s]), (t[s] = 0), i);
    },
    _create: function() {
      var t,
        e = this.options,
        i = this;
      this._addClass('ui-resizable'),
        x.extend(this, {
          _aspectRatio: !!e.aspectRatio,
          aspectRatio: e.aspectRatio,
          originalElement: this.element,
          _proportionallyResizeElements: [],
          _helper:
            e.helper || e.ghost || e.animate
              ? e.helper || 'ui-resizable-helper'
              : null
        }),
        this.element[0].nodeName.match(
          /^(canvas|textarea|input|select|button|img)$/i
        ) &&
          (this.element.wrap(
            x("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
              position: this.element.css('position'),
              width: this.element.outerWidth(),
              height: this.element.outerHeight(),
              top: this.element.css('top'),
              left: this.element.css('left')
            })
          ),
          (this.element = this.element
            .parent()
            .data('ui-resizable', this.element.resizable('instance'))),
          (this.elementIsWrapper = !0),
          (t = {
            marginTop: this.originalElement.css('marginTop'),
            marginRight: this.originalElement.css('marginRight'),
            marginBottom: this.originalElement.css('marginBottom'),
            marginLeft: this.originalElement.css('marginLeft')
          }),
          this.element.css(t),
          this.originalElement.css('margin', 0),
          (this.originalResizeStyle = this.originalElement.css('resize')),
          this.originalElement.css('resize', 'none'),
          this._proportionallyResizeElements.push(
            this.originalElement.css({
              position: 'static',
              zoom: 1,
              display: 'block'
            })
          ),
          this.originalElement.css(t),
          this._proportionallyResize()),
        this._setupHandles(),
        e.autoHide &&
          x(this.element)
            .on('mouseenter', function() {
              e.disabled ||
                (i._removeClass('ui-resizable-autohide'), i._handles.show());
            })
            .on('mouseleave', function() {
              e.disabled ||
                i.resizing ||
                (i._addClass('ui-resizable-autohide'), i._handles.hide());
            }),
        this._mouseInit();
    },
    _destroy: function() {
      this._mouseDestroy();
      function t(t) {
        x(t)
          .removeData('resizable')
          .removeData('ui-resizable')
          .off('.resizable')
          .find('.ui-resizable-handle')
          .remove();
      }
      var e;
      return (
        this.elementIsWrapper &&
          (t(this.element),
          (e = this.element),
          this.originalElement
            .css({
              position: e.css('position'),
              width: e.outerWidth(),
              height: e.outerHeight(),
              top: e.css('top'),
              left: e.css('left')
            })
            .insertAfter(e),
          e.remove()),
        this.originalElement.css('resize', this.originalResizeStyle),
        t(this.originalElement),
        this
      );
    },
    _setOption: function(t, e) {
      switch ((this._super(t, e), t)) {
        case 'handles':
          this._removeHandles(), this._setupHandles();
      }
    },
    _setupHandles: function() {
      var t,
        e,
        i,
        s,
        n,
        o = this.options,
        a = this;
      if (
        ((this.handles =
          o.handles ||
          (x('.ui-resizable-handle', this.element).length
            ? {
                n: '.ui-resizable-n',
                e: '.ui-resizable-e',
                s: '.ui-resizable-s',
                w: '.ui-resizable-w',
                se: '.ui-resizable-se',
                sw: '.ui-resizable-sw',
                ne: '.ui-resizable-ne',
                nw: '.ui-resizable-nw'
              }
            : 'e,s,se')),
        (this._handles = x()),
        this.handles.constructor === String)
      )
        for (
          'all' === this.handles && (this.handles = 'n,e,s,w,se,sw,ne,nw'),
            i = this.handles.split(','),
            this.handles = {},
            e = 0;
          e < i.length;
          e++
        )
          (s = 'ui-resizable-' + (t = x.trim(i[e]))),
            (n = x('<div>')),
            this._addClass(n, 'ui-resizable-handle ' + s),
            n.css({ zIndex: o.zIndex }),
            (this.handles[t] = '.ui-resizable-' + t),
            this.element.append(n);
      (this._renderAxis = function(t) {
        var e, i, s, n;
        for (e in ((t = t || this.element), this.handles))
          this.handles[e].constructor === String
            ? (this.handles[e] = this.element
                .children(this.handles[e])
                .first()
                .show())
            : (this.handles[e].jquery || this.handles[e].nodeType) &&
              ((this.handles[e] = x(this.handles[e])),
              this._on(this.handles[e], { mousedown: a._mouseDown })),
            this.elementIsWrapper &&
              this.originalElement[0].nodeName.match(
                /^(textarea|input|select|button)$/i
              ) &&
              ((i = x(this.handles[e], this.element)),
              (n = /sw|ne|nw|se|n|s/.test(e)
                ? i.outerHeight()
                : i.outerWidth()),
              (s = [
                'padding',
                /ne|nw|n/.test(e)
                  ? 'Top'
                  : /se|sw|s/.test(e)
                  ? 'Bottom'
                  : /^e$/.test(e)
                  ? 'Right'
                  : 'Left'
              ].join('')),
              t.css(s, n),
              this._proportionallyResize()),
            (this._handles = this._handles.add(this.handles[e]));
      }),
        this._renderAxis(this.element),
        (this._handles = this._handles.add(
          this.element.find('.ui-resizable-handle')
        )),
        this._handles.disableSelection(),
        this._handles.on('mouseover', function() {
          a.resizing ||
            (this.className &&
              (n = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),
            (a.axis = n && n[1] ? n[1] : 'se'));
        }),
        o.autoHide &&
          (this._handles.hide(), this._addClass('ui-resizable-autohide'));
    },
    _removeHandles: function() {
      this._handles.remove();
    },
    _mouseCapture: function(t) {
      var e,
        i,
        s = !1;
      for (e in this.handles)
        ((i = x(this.handles[e])[0]) !== t.target &&
          !x.contains(i, t.target)) ||
          (s = !0);
      return !this.options.disabled && s;
    },
    _mouseStart: function(t) {
      var e,
        i,
        s,
        n = this.options,
        o = this.element;
      return (
        (this.resizing = !0),
        this._renderProxy(),
        (e = this._num(this.helper.css('left'))),
        (i = this._num(this.helper.css('top'))),
        n.containment &&
          ((e += x(n.containment).scrollLeft() || 0),
          (i += x(n.containment).scrollTop() || 0)),
        (this.offset = this.helper.offset()),
        (this.position = { left: e, top: i }),
        (this.size = this._helper
          ? { width: this.helper.width(), height: this.helper.height() }
          : { width: o.width(), height: o.height() }),
        (this.originalSize = this._helper
          ? { width: o.outerWidth(), height: o.outerHeight() }
          : { width: o.width(), height: o.height() }),
        (this.sizeDiff = {
          width: o.outerWidth() - o.width(),
          height: o.outerHeight() - o.height()
        }),
        (this.originalPosition = { left: e, top: i }),
        (this.originalMousePosition = { left: t.pageX, top: t.pageY }),
        (this.aspectRatio =
          'number' == typeof n.aspectRatio
            ? n.aspectRatio
            : this.originalSize.width / this.originalSize.height || 1),
        (s = x('.ui-resizable-' + this.axis).css('cursor')),
        x('body').css('cursor', 'auto' === s ? this.axis + '-resize' : s),
        this._addClass('ui-resizable-resizing'),
        this._propagate('start', t),
        !0
      );
    },
    _mouseDrag: function(t) {
      var e,
        i,
        s = this.originalMousePosition,
        n = this.axis,
        o = t.pageX - s.left || 0,
        a = t.pageY - s.top || 0,
        r = this._change[n];
      return (
        this._updatePrevProperties(),
        r &&
          ((e = r.apply(this, [t, o, a])),
          this._updateVirtualBoundaries(t.shiftKey),
          (this._aspectRatio || t.shiftKey) && (e = this._updateRatio(e, t)),
          (e = this._respectSize(e, t)),
          this._updateCache(e),
          this._propagate('resize', t),
          (i = this._applyChanges()),
          !this._helper &&
            this._proportionallyResizeElements.length &&
            this._proportionallyResize(),
          x.isEmptyObject(i) ||
            (this._updatePrevProperties(),
            this._trigger('resize', t, this.ui()),
            this._applyChanges())),
        !1
      );
    },
    _mouseStop: function(t) {
      this.resizing = !1;
      var e,
        i,
        s,
        n,
        o,
        a,
        r,
        h = this.options,
        l = this;
      return (
        this._helper &&
          ((s =
            (i =
              (e = this._proportionallyResizeElements).length &&
              /textarea/i.test(e[0].nodeName)) && this._hasScroll(e[0], 'left')
              ? 0
              : l.sizeDiff.height),
          (n = i ? 0 : l.sizeDiff.width),
          (o = { width: l.helper.width() - n, height: l.helper.height() - s }),
          (a =
            parseFloat(l.element.css('left')) +
              (l.position.left - l.originalPosition.left) || null),
          (r =
            parseFloat(l.element.css('top')) +
              (l.position.top - l.originalPosition.top) || null),
          h.animate || this.element.css(x.extend(o, { top: r, left: a })),
          l.helper.height(l.size.height),
          l.helper.width(l.size.width),
          this._helper && !h.animate && this._proportionallyResize()),
        x('body').css('cursor', 'auto'),
        this._removeClass('ui-resizable-resizing'),
        this._propagate('stop', t),
        this._helper && this.helper.remove(),
        !1
      );
    },
    _updatePrevProperties: function() {
      (this.prevPosition = {
        top: this.position.top,
        left: this.position.left
      }),
        (this.prevSize = { width: this.size.width, height: this.size.height });
    },
    _applyChanges: function() {
      var t = {};
      return (
        this.position.top !== this.prevPosition.top &&
          (t.top = this.position.top + 'px'),
        this.position.left !== this.prevPosition.left &&
          (t.left = this.position.left + 'px'),
        this.size.width !== this.prevSize.width &&
          (t.width = this.size.width + 'px'),
        this.size.height !== this.prevSize.height &&
          (t.height = this.size.height + 'px'),
        this.helper.css(t),
        t
      );
    },
    _updateVirtualBoundaries: function(t) {
      var e,
        i,
        s,
        n,
        o,
        a = this.options;
      (o = {
        minWidth: this._isNumber(a.minWidth) ? a.minWidth : 0,
        maxWidth: this._isNumber(a.maxWidth) ? a.maxWidth : 1 / 0,
        minHeight: this._isNumber(a.minHeight) ? a.minHeight : 0,
        maxHeight: this._isNumber(a.maxHeight) ? a.maxHeight : 1 / 0
      }),
        (this._aspectRatio || t) &&
          ((e = o.minHeight * this.aspectRatio),
          (s = o.minWidth / this.aspectRatio),
          (i = o.maxHeight * this.aspectRatio),
          (n = o.maxWidth / this.aspectRatio),
          e > o.minWidth && (o.minWidth = e),
          s > o.minHeight && (o.minHeight = s),
          i < o.maxWidth && (o.maxWidth = i),
          n < o.maxHeight && (o.maxHeight = n)),
        (this._vBoundaries = o);
    },
    _updateCache: function(t) {
      (this.offset = this.helper.offset()),
        this._isNumber(t.left) && (this.position.left = t.left),
        this._isNumber(t.top) && (this.position.top = t.top),
        this._isNumber(t.height) && (this.size.height = t.height),
        this._isNumber(t.width) && (this.size.width = t.width);
    },
    _updateRatio: function(t) {
      var e = this.position,
        i = this.size,
        s = this.axis;
      return (
        this._isNumber(t.height)
          ? (t.width = t.height * this.aspectRatio)
          : this._isNumber(t.width) && (t.height = t.width / this.aspectRatio),
        'sw' === s && ((t.left = e.left + (i.width - t.width)), (t.top = null)),
        'nw' === s &&
          ((t.top = e.top + (i.height - t.height)),
          (t.left = e.left + (i.width - t.width))),
        t
      );
    },
    _respectSize: function(t) {
      var e = this._vBoundaries,
        i = this.axis,
        s = this._isNumber(t.width) && e.maxWidth && e.maxWidth < t.width,
        n = this._isNumber(t.height) && e.maxHeight && e.maxHeight < t.height,
        o = this._isNumber(t.width) && e.minWidth && e.minWidth > t.width,
        a = this._isNumber(t.height) && e.minHeight && e.minHeight > t.height,
        r = this.originalPosition.left + this.originalSize.width,
        h = this.originalPosition.top + this.originalSize.height,
        l = /sw|nw|w/.test(i),
        c = /nw|ne|n/.test(i);
      return (
        o && (t.width = e.minWidth),
        a && (t.height = e.minHeight),
        s && (t.width = e.maxWidth),
        n && (t.height = e.maxHeight),
        o && l && (t.left = r - e.minWidth),
        s && l && (t.left = r - e.maxWidth),
        a && c && (t.top = h - e.minHeight),
        n && c && (t.top = h - e.maxHeight),
        t.width || t.height || t.left || !t.top
          ? t.width || t.height || t.top || !t.left || (t.left = null)
          : (t.top = null),
        t
      );
    },
    _getPaddingPlusBorderDimensions: function(t) {
      for (
        var e = 0,
          i = [],
          s = [
            t.css('borderTopWidth'),
            t.css('borderRightWidth'),
            t.css('borderBottomWidth'),
            t.css('borderLeftWidth')
          ],
          n = [
            t.css('paddingTop'),
            t.css('paddingRight'),
            t.css('paddingBottom'),
            t.css('paddingLeft')
          ];
        e < 4;
        e++
      )
        (i[e] = parseFloat(s[e]) || 0), (i[e] += parseFloat(n[e]) || 0);
      return { height: i[0] + i[2], width: i[1] + i[3] };
    },
    _proportionallyResize: function() {
      if (this._proportionallyResizeElements.length)
        for (
          var t, e = 0, i = this.helper || this.element;
          e < this._proportionallyResizeElements.length;
          e++
        )
          (t = this._proportionallyResizeElements[e]),
            this.outerDimensions ||
              (this.outerDimensions = this._getPaddingPlusBorderDimensions(t)),
            t.css({
              height: i.height() - this.outerDimensions.height || 0,
              width: i.width() - this.outerDimensions.width || 0
            });
    },
    _renderProxy: function() {
      var t = this.element,
        e = this.options;
      (this.elementOffset = t.offset()),
        this._helper
          ? ((this.helper =
              this.helper || x("<div style='overflow:hidden;'></div>")),
            this._addClass(this.helper, this._helper),
            this.helper.css({
              width: this.element.outerWidth(),
              height: this.element.outerHeight(),
              position: 'absolute',
              left: this.elementOffset.left + 'px',
              top: this.elementOffset.top + 'px',
              zIndex: ++e.zIndex
            }),
            this.helper.appendTo('body').disableSelection())
          : (this.helper = this.element);
    },
    _change: {
      e: function(t, e) {
        return { width: this.originalSize.width + e };
      },
      w: function(t, e) {
        var i = this.originalSize;
        return { left: this.originalPosition.left + e, width: i.width - e };
      },
      n: function(t, e, i) {
        var s = this.originalSize;
        return { top: this.originalPosition.top + i, height: s.height - i };
      },
      s: function(t, e, i) {
        return { height: this.originalSize.height + i };
      },
      se: function(t, e, i) {
        return x.extend(
          this._change.s.apply(this, arguments),
          this._change.e.apply(this, [t, e, i])
        );
      },
      sw: function(t, e, i) {
        return x.extend(
          this._change.s.apply(this, arguments),
          this._change.w.apply(this, [t, e, i])
        );
      },
      ne: function(t, e, i) {
        return x.extend(
          this._change.n.apply(this, arguments),
          this._change.e.apply(this, [t, e, i])
        );
      },
      nw: function(t, e, i) {
        return x.extend(
          this._change.n.apply(this, arguments),
          this._change.w.apply(this, [t, e, i])
        );
      }
    },
    _propagate: function(t, e) {
      x.ui.plugin.call(this, t, [e, this.ui()]),
        'resize' !== t && this._trigger(t, e, this.ui());
    },
    plugins: {},
    ui: function() {
      return {
        originalElement: this.originalElement,
        element: this.element,
        helper: this.helper,
        position: this.position,
        size: this.size,
        originalSize: this.originalSize,
        originalPosition: this.originalPosition
      };
    }
  }),
    x.ui.plugin.add('resizable', 'animate', {
      stop: function(e) {
        var i = x(this).resizable('instance'),
          t = i.options,
          s = i._proportionallyResizeElements,
          n = s.length && /textarea/i.test(s[0].nodeName),
          o = n && i._hasScroll(s[0], 'left') ? 0 : i.sizeDiff.height,
          a = n ? 0 : i.sizeDiff.width,
          r = { width: i.size.width - a, height: i.size.height - o },
          h =
            parseFloat(i.element.css('left')) +
              (i.position.left - i.originalPosition.left) || null,
          l =
            parseFloat(i.element.css('top')) +
              (i.position.top - i.originalPosition.top) || null;
        i.element.animate(x.extend(r, l && h ? { top: l, left: h } : {}), {
          duration: t.animateDuration,
          easing: t.animateEasing,
          step: function() {
            var t = {
              width: parseFloat(i.element.css('width')),
              height: parseFloat(i.element.css('height')),
              top: parseFloat(i.element.css('top')),
              left: parseFloat(i.element.css('left'))
            };
            s && s.length && x(s[0]).css({ width: t.width, height: t.height }),
              i._updateCache(t),
              i._propagate('resize', e);
          }
        });
      }
    }),
    x.ui.plugin.add('resizable', 'containment', {
      start: function() {
        var i,
          s,
          t,
          e,
          n,
          o,
          a,
          r = x(this).resizable('instance'),
          h = r.options,
          l = r.element,
          c = h.containment,
          u =
            c instanceof x
              ? c.get(0)
              : /parent/.test(c)
              ? l.parent().get(0)
              : c;
        u &&
          ((r.containerElement = x(u)),
          /document/.test(c) || c === document
            ? ((r.containerOffset = { left: 0, top: 0 }),
              (r.containerPosition = { left: 0, top: 0 }),
              (r.parentData = {
                element: x(document),
                left: 0,
                top: 0,
                width: x(document).width(),
                height:
                  x(document).height() || document.body.parentNode.scrollHeight
              }))
            : ((i = x(u)),
              (s = []),
              x(['Top', 'Right', 'Left', 'Bottom']).each(function(t, e) {
                s[t] = r._num(i.css('padding' + e));
              }),
              (r.containerOffset = i.offset()),
              (r.containerPosition = i.position()),
              (r.containerSize = {
                height: i.innerHeight() - s[3],
                width: i.innerWidth() - s[1]
              }),
              (t = r.containerOffset),
              (e = r.containerSize.height),
              (n = r.containerSize.width),
              (o = r._hasScroll(u, 'left') ? u.scrollWidth : n),
              (a = r._hasScroll(u) ? u.scrollHeight : e),
              (r.parentData = {
                element: u,
                left: t.left,
                top: t.top,
                width: o,
                height: a
              })));
      },
      resize: function(t) {
        var e,
          i,
          s,
          n,
          o = x(this).resizable('instance'),
          a = o.options,
          r = o.containerOffset,
          h = o.position,
          l = o._aspectRatio || t.shiftKey,
          c = { top: 0, left: 0 },
          u = o.containerElement,
          d = !0;
        u[0] !== document && /static/.test(u.css('position')) && (c = r),
          h.left < (o._helper ? r.left : 0) &&
            ((o.size.width =
              o.size.width +
              (o._helper
                ? o.position.left - r.left
                : o.position.left - c.left)),
            l && ((o.size.height = o.size.width / o.aspectRatio), (d = !1)),
            (o.position.left = a.helper ? r.left : 0)),
          h.top < (o._helper ? r.top : 0) &&
            ((o.size.height =
              o.size.height +
              (o._helper ? o.position.top - r.top : o.position.top)),
            l && ((o.size.width = o.size.height * o.aspectRatio), (d = !1)),
            (o.position.top = o._helper ? r.top : 0)),
          (s = o.containerElement.get(0) === o.element.parent().get(0)),
          (n = /relative|absolute/.test(o.containerElement.css('position'))),
          s && n
            ? ((o.offset.left = o.parentData.left + o.position.left),
              (o.offset.top = o.parentData.top + o.position.top))
            : ((o.offset.left = o.element.offset().left),
              (o.offset.top = o.element.offset().top)),
          (e = Math.abs(
            o.sizeDiff.width +
              (o._helper ? o.offset.left - c.left : o.offset.left - r.left)
          )),
          (i = Math.abs(
            o.sizeDiff.height +
              (o._helper ? o.offset.top - c.top : o.offset.top - r.top)
          )),
          e + o.size.width >= o.parentData.width &&
            ((o.size.width = o.parentData.width - e),
            l && ((o.size.height = o.size.width / o.aspectRatio), (d = !1))),
          i + o.size.height >= o.parentData.height &&
            ((o.size.height = o.parentData.height - i),
            l && ((o.size.width = o.size.height * o.aspectRatio), (d = !1))),
          d ||
            ((o.position.left = o.prevPosition.left),
            (o.position.top = o.prevPosition.top),
            (o.size.width = o.prevSize.width),
            (o.size.height = o.prevSize.height));
      },
      stop: function() {
        var t = x(this).resizable('instance'),
          e = t.options,
          i = t.containerOffset,
          s = t.containerPosition,
          n = t.containerElement,
          o = x(t.helper),
          a = o.offset(),
          r = o.outerWidth() - t.sizeDiff.width,
          h = o.outerHeight() - t.sizeDiff.height;
        t._helper &&
          !e.animate &&
          /relative/.test(n.css('position')) &&
          x(this).css({ left: a.left - s.left - i.left, width: r, height: h }),
          t._helper &&
            !e.animate &&
            /static/.test(n.css('position')) &&
            x(this).css({
              left: a.left - s.left - i.left,
              width: r,
              height: h
            });
      }
    }),
    x.ui.plugin.add('resizable', 'alsoResize', {
      start: function() {
        var t = x(this).resizable('instance').options;
        x(t.alsoResize).each(function() {
          var t = x(this);
          t.data('ui-resizable-alsoresize', {
            width: parseFloat(t.width()),
            height: parseFloat(t.height()),
            left: parseFloat(t.css('left')),
            top: parseFloat(t.css('top'))
          });
        });
      },
      resize: function(t, i) {
        var e = x(this).resizable('instance'),
          s = e.options,
          n = e.originalSize,
          o = e.originalPosition,
          a = {
            height: e.size.height - n.height || 0,
            width: e.size.width - n.width || 0,
            top: e.position.top - o.top || 0,
            left: e.position.left - o.left || 0
          };
        x(s.alsoResize).each(function() {
          var t = x(this),
            s = x(this).data('ui-resizable-alsoresize'),
            n = {},
            e = t.parents(i.originalElement[0]).length
              ? ['width', 'height']
              : ['width', 'height', 'top', 'left'];
          x.each(e, function(t, e) {
            var i = (s[e] || 0) + (a[e] || 0);
            i && 0 <= i && (n[e] = i || null);
          }),
            t.css(n);
        });
      },
      stop: function() {
        x(this).removeData('ui-resizable-alsoresize');
      }
    }),
    x.ui.plugin.add('resizable', 'ghost', {
      start: function() {
        var t = x(this).resizable('instance'),
          e = t.size;
        (t.ghost = t.originalElement.clone()),
          t.ghost.css({
            opacity: 0.25,
            display: 'block',
            position: 'relative',
            height: e.height,
            width: e.width,
            margin: 0,
            left: 0,
            top: 0
          }),
          t._addClass(t.ghost, 'ui-resizable-ghost'),
          !1 !== x.uiBackCompat &&
            'string' == typeof t.options.ghost &&
            t.ghost.addClass(this.options.ghost),
          t.ghost.appendTo(t.helper);
      },
      resize: function() {
        var t = x(this).resizable('instance');
        t.ghost &&
          t.ghost.css({
            position: 'relative',
            height: t.size.height,
            width: t.size.width
          });
      },
      stop: function() {
        var t = x(this).resizable('instance');
        t.ghost && t.helper && t.helper.get(0).removeChild(t.ghost.get(0));
      }
    }),
    x.ui.plugin.add('resizable', 'grid', {
      resize: function() {
        var t,
          e = x(this).resizable('instance'),
          i = e.options,
          s = e.size,
          n = e.originalSize,
          o = e.originalPosition,
          a = e.axis,
          r = 'number' == typeof i.grid ? [i.grid, i.grid] : i.grid,
          h = r[0] || 1,
          l = r[1] || 1,
          c = Math.round((s.width - n.width) / h) * h,
          u = Math.round((s.height - n.height) / l) * l,
          d = n.width + c,
          p = n.height + u,
          f = i.maxWidth && i.maxWidth < d,
          g = i.maxHeight && i.maxHeight < p,
          m = i.minWidth && i.minWidth > d,
          _ = i.minHeight && i.minHeight > p;
        (i.grid = r),
          m && (d += h),
          _ && (p += l),
          f && (d -= h),
          g && (p -= l),
          /^(se|s|e)$/.test(a)
            ? ((e.size.width = d), (e.size.height = p))
            : /^(ne)$/.test(a)
            ? ((e.size.width = d),
              (e.size.height = p),
              (e.position.top = o.top - u))
            : /^(sw)$/.test(a)
            ? ((e.size.width = d),
              (e.size.height = p),
              (e.position.left = o.left - c))
            : ((p - l <= 0 || d - h <= 0) &&
                (t = e._getPaddingPlusBorderDimensions(this)),
              0 < p - l
                ? ((e.size.height = p), (e.position.top = o.top - u))
                : ((p = l - t.height),
                  (e.size.height = p),
                  (e.position.top = o.top + n.height - p)),
              0 < d - h
                ? ((e.size.width = d), (e.position.left = o.left - c))
                : ((d = h - t.width),
                  (e.size.width = d),
                  (e.position.left = o.left + n.width - d)));
      }
    });
  x.ui.resizable,
    x.widget('ui.selectable', x.ui.mouse, {
      version: '1.12.1',
      options: {
        appendTo: 'body',
        autoRefresh: !0,
        distance: 0,
        filter: '*',
        tolerance: 'touch',
        selected: null,
        selecting: null,
        start: null,
        stop: null,
        unselected: null,
        unselecting: null
      },
      _create: function() {
        var s = this;
        this._addClass('ui-selectable'),
          (this.dragged = !1),
          (this.refresh = function() {
            (s.elementPos = x(s.element[0]).offset()),
              (s.selectees = x(s.options.filter, s.element[0])),
              s._addClass(s.selectees, 'ui-selectee'),
              s.selectees.each(function() {
                var t = x(this),
                  e = t.offset(),
                  i = {
                    left: e.left - s.elementPos.left,
                    top: e.top - s.elementPos.top
                  };
                x.data(this, 'selectable-item', {
                  element: this,
                  $element: t,
                  left: i.left,
                  top: i.top,
                  right: i.left + t.outerWidth(),
                  bottom: i.top + t.outerHeight(),
                  startselected: !1,
                  selected: t.hasClass('ui-selected'),
                  selecting: t.hasClass('ui-selecting'),
                  unselecting: t.hasClass('ui-unselecting')
                });
              });
          }),
          this.refresh(),
          this._mouseInit(),
          (this.helper = x('<div>')),
          this._addClass(this.helper, 'ui-selectable-helper');
      },
      _destroy: function() {
        this.selectees.removeData('selectable-item'), this._mouseDestroy();
      },
      _mouseStart: function(i) {
        var s = this,
          t = this.options;
        (this.opos = [i.pageX, i.pageY]),
          (this.elementPos = x(this.element[0]).offset()),
          this.options.disabled ||
            ((this.selectees = x(t.filter, this.element[0])),
            this._trigger('start', i),
            x(t.appendTo).append(this.helper),
            this.helper.css({
              left: i.pageX,
              top: i.pageY,
              width: 0,
              height: 0
            }),
            t.autoRefresh && this.refresh(),
            this.selectees.filter('.ui-selected').each(function() {
              var t = x.data(this, 'selectable-item');
              (t.startselected = !0),
                i.metaKey ||
                  i.ctrlKey ||
                  (s._removeClass(t.$element, 'ui-selected'),
                  (t.selected = !1),
                  s._addClass(t.$element, 'ui-unselecting'),
                  (t.unselecting = !0),
                  s._trigger('unselecting', i, { unselecting: t.element }));
            }),
            x(i.target)
              .parents()
              .addBack()
              .each(function() {
                var t,
                  e = x.data(this, 'selectable-item');
                if (e)
                  return (
                    (t =
                      (!i.metaKey && !i.ctrlKey) ||
                      !e.$element.hasClass('ui-selected')),
                    s
                      ._removeClass(
                        e.$element,
                        t ? 'ui-unselecting' : 'ui-selected'
                      )
                      ._addClass(
                        e.$element,
                        t ? 'ui-selecting' : 'ui-unselecting'
                      ),
                    (e.unselecting = !t),
                    (e.selecting = t),
                    (e.selected = t)
                      ? s._trigger('selecting', i, { selecting: e.element })
                      : s._trigger('unselecting', i, {
                          unselecting: e.element
                        }),
                    !1
                  );
              }));
      },
      _mouseDrag: function(s) {
        if (((this.dragged = !0), !this.options.disabled)) {
          var t,
            n = this,
            o = this.options,
            a = this.opos[0],
            r = this.opos[1],
            h = s.pageX,
            l = s.pageY;
          return (
            h < a && ((t = h), (h = a), (a = t)),
            l < r && ((t = l), (l = r), (r = t)),
            this.helper.css({ left: a, top: r, width: h - a, height: l - r }),
            this.selectees.each(function() {
              var t = x.data(this, 'selectable-item'),
                e = !1,
                i = {};
              t &&
                t.element !== n.element[0] &&
                ((i.left = t.left + n.elementPos.left),
                (i.right = t.right + n.elementPos.left),
                (i.top = t.top + n.elementPos.top),
                (i.bottom = t.bottom + n.elementPos.top),
                'touch' === o.tolerance
                  ? (e = !(
                      i.left > h ||
                      i.right < a ||
                      i.top > l ||
                      i.bottom < r
                    ))
                  : 'fit' === o.tolerance &&
                    (e =
                      i.left > a && i.right < h && i.top > r && i.bottom < l),
                e
                  ? (t.selected &&
                      (n._removeClass(t.$element, 'ui-selected'),
                      (t.selected = !1)),
                    t.unselecting &&
                      (n._removeClass(t.$element, 'ui-unselecting'),
                      (t.unselecting = !1)),
                    t.selecting ||
                      (n._addClass(t.$element, 'ui-selecting'),
                      (t.selecting = !0),
                      n._trigger('selecting', s, { selecting: t.element })))
                  : (t.selecting &&
                      ((s.metaKey || s.ctrlKey) && t.startselected
                        ? (n._removeClass(t.$element, 'ui-selecting'),
                          (t.selecting = !1),
                          n._addClass(t.$element, 'ui-selected'),
                          (t.selected = !0))
                        : (n._removeClass(t.$element, 'ui-selecting'),
                          (t.selecting = !1),
                          t.startselected &&
                            (n._addClass(t.$element, 'ui-unselecting'),
                            (t.unselecting = !0)),
                          n._trigger('unselecting', s, {
                            unselecting: t.element
                          }))),
                    t.selected &&
                      (s.metaKey ||
                        s.ctrlKey ||
                        t.startselected ||
                        (n._removeClass(t.$element, 'ui-selected'),
                        (t.selected = !1),
                        n._addClass(t.$element, 'ui-unselecting'),
                        (t.unselecting = !0),
                        n._trigger('unselecting', s, {
                          unselecting: t.element
                        })))));
            }),
            !1
          );
        }
      },
      _mouseStop: function(e) {
        var i = this;
        return (
          (this.dragged = !1),
          x('.ui-unselecting', this.element[0]).each(function() {
            var t = x.data(this, 'selectable-item');
            i._removeClass(t.$element, 'ui-unselecting'),
              (t.unselecting = !1),
              (t.startselected = !1),
              i._trigger('unselected', e, { unselected: t.element });
          }),
          x('.ui-selecting', this.element[0]).each(function() {
            var t = x.data(this, 'selectable-item');
            i
              ._removeClass(t.$element, 'ui-selecting')
              ._addClass(t.$element, 'ui-selected'),
              (t.selecting = !1),
              (t.selected = !0),
              (t.startselected = !0),
              i._trigger('selected', e, { selected: t.element });
          }),
          this._trigger('stop', e),
          this.helper.remove(),
          !1
        );
      }
    }),
    x.widget('ui.sortable', x.ui.mouse, {
      version: '1.12.1',
      widgetEventPrefix: 'sort',
      ready: !1,
      options: {
        appendTo: 'parent',
        axis: !1,
        connectWith: !1,
        containment: !1,
        cursor: 'auto',
        cursorAt: !1,
        dropOnEmpty: !0,
        forcePlaceholderSize: !1,
        forceHelperSize: !1,
        grid: !1,
        handle: !1,
        helper: 'original',
        items: '> *',
        opacity: !1,
        placeholder: !1,
        revert: !1,
        scroll: !0,
        scrollSensitivity: 20,
        scrollSpeed: 20,
        scope: 'default',
        tolerance: 'intersect',
        zIndex: 1e3,
        activate: null,
        beforeStop: null,
        change: null,
        deactivate: null,
        out: null,
        over: null,
        receive: null,
        remove: null,
        sort: null,
        start: null,
        stop: null,
        update: null
      },
      _isOverAxis: function(t, e, i) {
        return e <= t && t < e + i;
      },
      _isFloating: function(t) {
        return (
          /left|right/.test(t.css('float')) ||
          /inline|table-cell/.test(t.css('display'))
        );
      },
      _create: function() {
        (this.containerCache = {}),
          this._addClass('ui-sortable'),
          this.refresh(),
          (this.offset = this.element.offset()),
          this._mouseInit(),
          this._setHandleClassName(),
          (this.ready = !0);
      },
      _setOption: function(t, e) {
        this._super(t, e), 'handle' === t && this._setHandleClassName();
      },
      _setHandleClassName: function() {
        var t = this;
        this._removeClass(
          this.element.find('.ui-sortable-handle'),
          'ui-sortable-handle'
        ),
          x.each(this.items, function() {
            t._addClass(
              this.instance.options.handle
                ? this.item.find(this.instance.options.handle)
                : this.item,
              'ui-sortable-handle'
            );
          });
      },
      _destroy: function() {
        this._mouseDestroy();
        for (var t = this.items.length - 1; 0 <= t; t--)
          this.items[t].item.removeData(this.widgetName + '-item');
        return this;
      },
      _mouseCapture: function(t, e) {
        var i = null,
          s = !1,
          n = this;
        return (
          !this.reverting &&
          !this.options.disabled &&
            'static' !== this.options.type &&
            (this._refreshItems(t),
            x(t.target)
              .parents()
              .each(function() {
                if (x.data(this, n.widgetName + '-item') === n)
                  return (i = x(this)), !1;
              }),
            x.data(t.target, n.widgetName + '-item') === n && (i = x(t.target)),
            !!i &&
              !(
                this.options.handle &&
                !e &&
                (x(this.options.handle, i)
                  .find('*')
                  .addBack()
                  .each(function() {
                    this === t.target && (s = !0);
                  }),
                !s)
              ) &&
                ((this.currentItem = i), this._removeCurrentsFromItems(), !0))
        );
      },
      _mouseStart: function(t, e, i) {
        var s,
          n,
          o = this.options;
        if (
          ((this.currentContainer = this).refreshPositions(),
          (this.helper = this._createHelper(t)),
          this._cacheHelperProportions(),
          this._cacheMargins(),
          (this.scrollParent = this.helper.scrollParent()),
          (this.offset = this.currentItem.offset()),
          (this.offset = {
            top: this.offset.top - this.margins.top,
            left: this.offset.left - this.margins.left
          }),
          x.extend(this.offset, {
            click: {
              left: t.pageX - this.offset.left,
              top: t.pageY - this.offset.top
            },
            parent: this._getParentOffset(),
            relative: this._getRelativeOffset()
          }),
          this.helper.css('position', 'absolute'),
          (this.cssPosition = this.helper.css('position')),
          (this.originalPosition = this._generatePosition(t)),
          (this.originalPageX = t.pageX),
          (this.originalPageY = t.pageY),
          o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt),
          (this.domPosition = {
            prev: this.currentItem.prev()[0],
            parent: this.currentItem.parent()[0]
          }),
          this.helper[0] !== this.currentItem[0] && this.currentItem.hide(),
          this._createPlaceholder(),
          o.containment && this._setContainment(),
          o.cursor &&
            'auto' !== o.cursor &&
            ((n = this.document.find('body')),
            (this.storedCursor = n.css('cursor')),
            n.css('cursor', o.cursor),
            (this.storedStylesheet = x(
              '<style>*{ cursor: ' + o.cursor + ' !important; }</style>'
            ).appendTo(n))),
          o.opacity &&
            (this.helper.css('opacity') &&
              (this._storedOpacity = this.helper.css('opacity')),
            this.helper.css('opacity', o.opacity)),
          o.zIndex &&
            (this.helper.css('zIndex') &&
              (this._storedZIndex = this.helper.css('zIndex')),
            this.helper.css('zIndex', o.zIndex)),
          this.scrollParent[0] !== this.document[0] &&
            'HTML' !== this.scrollParent[0].tagName &&
            (this.overflowOffset = this.scrollParent.offset()),
          this._trigger('start', t, this._uiHash()),
          this._preserveHelperProportions || this._cacheHelperProportions(),
          !i)
        )
          for (s = this.containers.length - 1; 0 <= s; s--)
            this.containers[s]._trigger('activate', t, this._uiHash(this));
        return (
          x.ui.ddmanager && (x.ui.ddmanager.current = this),
          x.ui.ddmanager &&
            !o.dropBehaviour &&
            x.ui.ddmanager.prepareOffsets(this, t),
          (this.dragging = !0),
          this._addClass(this.helper, 'ui-sortable-helper'),
          this._mouseDrag(t),
          !0
        );
      },
      _mouseDrag: function(t) {
        var e,
          i,
          s,
          n,
          o = this.options,
          a = !1;
        for (
          this.position = this._generatePosition(t),
            this.positionAbs = this._convertPositionTo('absolute'),
            this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs),
            this.options.scroll &&
              (this.scrollParent[0] !== this.document[0] &&
              'HTML' !== this.scrollParent[0].tagName
                ? (this.overflowOffset.top +
                    this.scrollParent[0].offsetHeight -
                    t.pageY <
                  o.scrollSensitivity
                    ? (this.scrollParent[0].scrollTop = a =
                        this.scrollParent[0].scrollTop + o.scrollSpeed)
                    : t.pageY - this.overflowOffset.top < o.scrollSensitivity &&
                      (this.scrollParent[0].scrollTop = a =
                        this.scrollParent[0].scrollTop - o.scrollSpeed),
                  this.overflowOffset.left +
                    this.scrollParent[0].offsetWidth -
                    t.pageX <
                  o.scrollSensitivity
                    ? (this.scrollParent[0].scrollLeft = a =
                        this.scrollParent[0].scrollLeft + o.scrollSpeed)
                    : t.pageX - this.overflowOffset.left <
                        o.scrollSensitivity &&
                      (this.scrollParent[0].scrollLeft = a =
                        this.scrollParent[0].scrollLeft - o.scrollSpeed))
                : (t.pageY - this.document.scrollTop() < o.scrollSensitivity
                    ? (a = this.document.scrollTop(
                        this.document.scrollTop() - o.scrollSpeed
                      ))
                    : this.window.height() -
                        (t.pageY - this.document.scrollTop()) <
                        o.scrollSensitivity &&
                      (a = this.document.scrollTop(
                        this.document.scrollTop() + o.scrollSpeed
                      )),
                  t.pageX - this.document.scrollLeft() < o.scrollSensitivity
                    ? (a = this.document.scrollLeft(
                        this.document.scrollLeft() - o.scrollSpeed
                      ))
                    : this.window.width() -
                        (t.pageX - this.document.scrollLeft()) <
                        o.scrollSensitivity &&
                      (a = this.document.scrollLeft(
                        this.document.scrollLeft() + o.scrollSpeed
                      ))),
              !1 !== a &&
                x.ui.ddmanager &&
                !o.dropBehaviour &&
                x.ui.ddmanager.prepareOffsets(this, t)),
            this.positionAbs = this._convertPositionTo('absolute'),
            (this.options.axis && 'y' === this.options.axis) ||
              (this.helper[0].style.left = this.position.left + 'px'),
            (this.options.axis && 'x' === this.options.axis) ||
              (this.helper[0].style.top = this.position.top + 'px'),
            e = this.items.length - 1;
          0 <= e;
          e--
        )
          if (
            ((s = (i = this.items[e]).item[0]),
            (n = this._intersectsWithPointer(i)) &&
              i.instance === this.currentContainer &&
              !(
                s === this.currentItem[0] ||
                this.placeholder[1 === n ? 'next' : 'prev']()[0] === s ||
                x.contains(this.placeholder[0], s) ||
                ('semi-dynamic' === this.options.type &&
                  x.contains(this.element[0], s))
              ))
          ) {
            if (
              ((this.direction = 1 === n ? 'down' : 'up'),
              'pointer' !== this.options.tolerance &&
                !this._intersectsWithSides(i))
            )
              break;
            this._rearrange(t, i), this._trigger('change', t, this._uiHash());
            break;
          }
        return (
          this._contactContainers(t),
          x.ui.ddmanager && x.ui.ddmanager.drag(this, t),
          this._trigger('sort', t, this._uiHash()),
          (this.lastPositionAbs = this.positionAbs),
          !1
        );
      },
      _mouseStop: function(t, e) {
        if (t) {
          if (
            (x.ui.ddmanager &&
              !this.options.dropBehaviour &&
              x.ui.ddmanager.drop(this, t),
            this.options.revert)
          ) {
            var i = this,
              s = this.placeholder.offset(),
              n = this.options.axis,
              o = {};
            (n && 'x' !== n) ||
              (o.left =
                s.left -
                this.offset.parent.left -
                this.margins.left +
                (this.offsetParent[0] === this.document[0].body
                  ? 0
                  : this.offsetParent[0].scrollLeft)),
              (n && 'y' !== n) ||
                (o.top =
                  s.top -
                  this.offset.parent.top -
                  this.margins.top +
                  (this.offsetParent[0] === this.document[0].body
                    ? 0
                    : this.offsetParent[0].scrollTop)),
              (this.reverting = !0),
              x(this.helper).animate(
                o,
                parseInt(this.options.revert, 10) || 500,
                function() {
                  i._clear(t);
                }
              );
          } else this._clear(t, e);
          return !1;
        }
      },
      cancel: function() {
        if (this.dragging) {
          this._mouseUp(new x.Event('mouseup', { target: null })),
            'original' === this.options.helper
              ? (this.currentItem.css(this._storedCSS),
                this._removeClass(this.currentItem, 'ui-sortable-helper'))
              : this.currentItem.show();
          for (var t = this.containers.length - 1; 0 <= t; t--)
            this.containers[t]._trigger('deactivate', null, this._uiHash(this)),
              this.containers[t].containerCache.over &&
                (this.containers[t]._trigger('out', null, this._uiHash(this)),
                (this.containers[t].containerCache.over = 0));
        }
        return (
          this.placeholder &&
            (this.placeholder[0].parentNode &&
              this.placeholder[0].parentNode.removeChild(this.placeholder[0]),
            'original' !== this.options.helper &&
              this.helper &&
              this.helper[0].parentNode &&
              this.helper.remove(),
            x.extend(this, {
              helper: null,
              dragging: !1,
              reverting: !1,
              _noFinalSort: null
            }),
            this.domPosition.prev
              ? x(this.domPosition.prev).after(this.currentItem)
              : x(this.domPosition.parent).prepend(this.currentItem)),
          this
        );
      },
      serialize: function(e) {
        var t = this._getItemsAsjQuery(e && e.connected),
          i = [];
        return (
          (e = e || {}),
          x(t).each(function() {
            var t = (x(e.item || this).attr(e.attribute || 'id') || '').match(
              e.expression || /(.+)[\-=_](.+)/
            );
            t &&
              i.push(
                (e.key || t[1] + '[]') +
                  '=' +
                  (e.key && e.expression ? t[1] : t[2])
              );
          }),
          !i.length && e.key && i.push(e.key + '='),
          i.join('&')
        );
      },
      toArray: function(t) {
        var e = this._getItemsAsjQuery(t && t.connected),
          i = [];
        return (
          (t = t || {}),
          e.each(function() {
            i.push(x(t.item || this).attr(t.attribute || 'id') || '');
          }),
          i
        );
      },
      _intersectsWith: function(t) {
        var e = this.positionAbs.left,
          i = e + this.helperProportions.width,
          s = this.positionAbs.top,
          n = s + this.helperProportions.height,
          o = t.left,
          a = o + t.width,
          r = t.top,
          h = r + t.height,
          l = this.offset.click.top,
          c = this.offset.click.left,
          u = 'x' === this.options.axis || (r < s + l && s + l < h),
          d = 'y' === this.options.axis || (o < e + c && e + c < a),
          p = u && d;
        return 'pointer' === this.options.tolerance ||
          this.options.forcePointerForContainers ||
          ('pointer' !== this.options.tolerance &&
            this.helperProportions[this.floating ? 'width' : 'height'] >
              t[this.floating ? 'width' : 'height'])
          ? p
          : o < e + this.helperProportions.width / 2 &&
              i - this.helperProportions.width / 2 < a &&
              r < s + this.helperProportions.height / 2 &&
              n - this.helperProportions.height / 2 < h;
      },
      _intersectsWithPointer: function(t) {
        var e,
          i,
          s =
            'x' === this.options.axis ||
            this._isOverAxis(
              this.positionAbs.top + this.offset.click.top,
              t.top,
              t.height
            ),
          n =
            'y' === this.options.axis ||
            this._isOverAxis(
              this.positionAbs.left + this.offset.click.left,
              t.left,
              t.width
            );
        return (
          !(!s || !n) &&
          ((e = this._getDragVerticalDirection()),
          (i = this._getDragHorizontalDirection()),
          this.floating
            ? 'right' === i || 'down' === e
              ? 2
              : 1
            : e && ('down' === e ? 2 : 1))
        );
      },
      _intersectsWithSides: function(t) {
        var e = this._isOverAxis(
            this.positionAbs.top + this.offset.click.top,
            t.top + t.height / 2,
            t.height
          ),
          i = this._isOverAxis(
            this.positionAbs.left + this.offset.click.left,
            t.left + t.width / 2,
            t.width
          ),
          s = this._getDragVerticalDirection(),
          n = this._getDragHorizontalDirection();
        return this.floating && n
          ? ('right' === n && i) || ('left' === n && !i)
          : s && (('down' === s && e) || ('up' === s && !e));
      },
      _getDragVerticalDirection: function() {
        var t = this.positionAbs.top - this.lastPositionAbs.top;
        return 0 != t && (0 < t ? 'down' : 'up');
      },
      _getDragHorizontalDirection: function() {
        var t = this.positionAbs.left - this.lastPositionAbs.left;
        return 0 != t && (0 < t ? 'right' : 'left');
      },
      refresh: function(t) {
        return (
          this._refreshItems(t),
          this._setHandleClassName(),
          this.refreshPositions(),
          this
        );
      },
      _connectWith: function() {
        var t = this.options;
        return t.connectWith.constructor === String
          ? [t.connectWith]
          : t.connectWith;
      },
      _getItemsAsjQuery: function(t) {
        var e,
          i,
          s,
          n,
          o = [],
          a = [],
          r = this._connectWith();
        if (r && t)
          for (e = r.length - 1; 0 <= e; e--)
            for (i = (s = x(r[e], this.document[0])).length - 1; 0 <= i; i--)
              (n = x.data(s[i], this.widgetFullName)) &&
                n !== this &&
                !n.options.disabled &&
                a.push([
                  x.isFunction(n.options.items)
                    ? n.options.items.call(n.element)
                    : x(n.options.items, n.element)
                        .not('.ui-sortable-helper')
                        .not('.ui-sortable-placeholder'),
                  n
                ]);
        function h() {
          o.push(this);
        }
        for (
          a.push([
            x.isFunction(this.options.items)
              ? this.options.items.call(this.element, null, {
                  options: this.options,
                  item: this.currentItem
                })
              : x(this.options.items, this.element)
                  .not('.ui-sortable-helper')
                  .not('.ui-sortable-placeholder'),
            this
          ]),
            e = a.length - 1;
          0 <= e;
          e--
        )
          a[e][0].each(h);
        return x(o);
      },
      _removeCurrentsFromItems: function() {
        var i = this.currentItem.find(':data(' + this.widgetName + '-item)');
        this.items = x.grep(this.items, function(t) {
          for (var e = 0; e < i.length; e++) if (i[e] === t.item[0]) return !1;
          return !0;
        });
      },
      _refreshItems: function(t) {
        (this.items = []), (this.containers = [this]);
        var e,
          i,
          s,
          n,
          o,
          a,
          r,
          h,
          l = this.items,
          c = [
            [
              x.isFunction(this.options.items)
                ? this.options.items.call(this.element[0], t, {
                    item: this.currentItem
                  })
                : x(this.options.items, this.element),
              this
            ]
          ],
          u = this._connectWith();
        if (u && this.ready)
          for (e = u.length - 1; 0 <= e; e--)
            for (i = (s = x(u[e], this.document[0])).length - 1; 0 <= i; i--)
              (n = x.data(s[i], this.widgetFullName)) &&
                n !== this &&
                !n.options.disabled &&
                (c.push([
                  x.isFunction(n.options.items)
                    ? n.options.items.call(n.element[0], t, {
                        item: this.currentItem
                      })
                    : x(n.options.items, n.element),
                  n
                ]),
                this.containers.push(n));
        for (e = c.length - 1; 0 <= e; e--)
          for (o = c[e][1], i = 0, h = (a = c[e][0]).length; i < h; i++)
            (r = x(a[i])).data(this.widgetName + '-item', o),
              l.push({
                item: r,
                instance: o,
                width: 0,
                height: 0,
                left: 0,
                top: 0
              });
      },
      refreshPositions: function(t) {
        var e, i, s, n;
        for (
          this.floating =
            !!this.items.length &&
            ('x' === this.options.axis || this._isFloating(this.items[0].item)),
            this.offsetParent &&
              this.helper &&
              (this.offset.parent = this._getParentOffset()),
            e = this.items.length - 1;
          0 <= e;
          e--
        )
          ((i = this.items[e]).instance !== this.currentContainer &&
            this.currentContainer &&
            i.item[0] !== this.currentItem[0]) ||
            ((s = this.options.toleranceElement
              ? x(this.options.toleranceElement, i.item)
              : i.item),
            t || ((i.width = s.outerWidth()), (i.height = s.outerHeight())),
            (n = s.offset()),
            (i.left = n.left),
            (i.top = n.top));
        if (this.options.custom && this.options.custom.refreshContainers)
          this.options.custom.refreshContainers.call(this);
        else
          for (e = this.containers.length - 1; 0 <= e; e--)
            (n = this.containers[e].element.offset()),
              (this.containers[e].containerCache.left = n.left),
              (this.containers[e].containerCache.top = n.top),
              (this.containers[e].containerCache.width = this.containers[
                e
              ].element.outerWidth()),
              (this.containers[e].containerCache.height = this.containers[
                e
              ].element.outerHeight());
        return this;
      },
      _createPlaceholder: function(i) {
        var s,
          n = (i = i || this).options;
        (n.placeholder && n.placeholder.constructor !== String) ||
          ((s = n.placeholder),
          (n.placeholder = {
            element: function() {
              var t = i.currentItem[0].nodeName.toLowerCase(),
                e = x('<' + t + '>', i.document[0]);
              return (
                i
                  ._addClass(
                    e,
                    'ui-sortable-placeholder',
                    s || i.currentItem[0].className
                  )
                  ._removeClass(e, 'ui-sortable-helper'),
                'tbody' === t
                  ? i._createTrPlaceholder(
                      i.currentItem.find('tr').eq(0),
                      x('<tr>', i.document[0]).appendTo(e)
                    )
                  : 'tr' === t
                  ? i._createTrPlaceholder(i.currentItem, e)
                  : 'img' === t && e.attr('src', i.currentItem.attr('src')),
                s || e.css('visibility', 'hidden'),
                e
              );
            },
            update: function(t, e) {
              (s && !n.forcePlaceholderSize) ||
                (e.height() ||
                  e.height(
                    i.currentItem.innerHeight() -
                      parseInt(i.currentItem.css('paddingTop') || 0, 10) -
                      parseInt(i.currentItem.css('paddingBottom') || 0, 10)
                  ),
                e.width() ||
                  e.width(
                    i.currentItem.innerWidth() -
                      parseInt(i.currentItem.css('paddingLeft') || 0, 10) -
                      parseInt(i.currentItem.css('paddingRight') || 0, 10)
                  ));
            }
          })),
          (i.placeholder = x(
            n.placeholder.element.call(i.element, i.currentItem)
          )),
          i.currentItem.after(i.placeholder),
          n.placeholder.update(i, i.placeholder);
      },
      _createTrPlaceholder: function(t, e) {
        var i = this;
        t.children().each(function() {
          x('<td>&#160;</td>', i.document[0])
            .attr('colspan', x(this).attr('colspan') || 1)
            .appendTo(e);
        });
      },
      _contactContainers: function(t) {
        var e,
          i,
          s,
          n,
          o,
          a,
          r,
          h,
          l,
          c,
          u = null,
          d = null;
        for (e = this.containers.length - 1; 0 <= e; e--)
          if (!x.contains(this.currentItem[0], this.containers[e].element[0]))
            if (this._intersectsWith(this.containers[e].containerCache)) {
              if (u && x.contains(this.containers[e].element[0], u.element[0]))
                continue;
              (u = this.containers[e]), (d = e);
            } else
              this.containers[e].containerCache.over &&
                (this.containers[e]._trigger('out', t, this._uiHash(this)),
                (this.containers[e].containerCache.over = 0));
        if (u)
          if (1 === this.containers.length)
            this.containers[d].containerCache.over ||
              (this.containers[d]._trigger('over', t, this._uiHash(this)),
              (this.containers[d].containerCache.over = 1));
          else {
            for (
              s = 1e4,
                n = null,
                o = (l = u.floating || this._isFloating(this.currentItem))
                  ? 'left'
                  : 'top',
                a = l ? 'width' : 'height',
                c = l ? 'pageX' : 'pageY',
                i = this.items.length - 1;
              0 <= i;
              i--
            )
              x.contains(
                this.containers[d].element[0],
                this.items[i].item[0]
              ) &&
                this.items[i].item[0] !== this.currentItem[0] &&
                ((r = this.items[i].item.offset()[o]),
                (h = !1),
                t[c] - r > this.items[i][a] / 2 && (h = !0),
                Math.abs(t[c] - r) < s &&
                  ((s = Math.abs(t[c] - r)),
                  (n = this.items[i]),
                  (this.direction = h ? 'up' : 'down')));
            if (!n && !this.options.dropOnEmpty) return;
            if (this.currentContainer === this.containers[d])
              return void (
                this.currentContainer.containerCache.over ||
                (this.containers[d]._trigger('over', t, this._uiHash()),
                (this.currentContainer.containerCache.over = 1))
              );
            n
              ? this._rearrange(t, n, null, !0)
              : this._rearrange(t, null, this.containers[d].element, !0),
              this._trigger('change', t, this._uiHash()),
              this.containers[d]._trigger('change', t, this._uiHash(this)),
              (this.currentContainer = this.containers[d]),
              this.options.placeholder.update(
                this.currentContainer,
                this.placeholder
              ),
              this.containers[d]._trigger('over', t, this._uiHash(this)),
              (this.containers[d].containerCache.over = 1);
          }
      },
      _createHelper: function(t) {
        var e = this.options,
          i = x.isFunction(e.helper)
            ? x(e.helper.apply(this.element[0], [t, this.currentItem]))
            : 'clone' === e.helper
            ? this.currentItem.clone()
            : this.currentItem;
        return (
          i.parents('body').length ||
            x(
              'parent' !== e.appendTo
                ? e.appendTo
                : this.currentItem[0].parentNode
            )[0].appendChild(i[0]),
          i[0] === this.currentItem[0] &&
            (this._storedCSS = {
              width: this.currentItem[0].style.width,
              height: this.currentItem[0].style.height,
              position: this.currentItem.css('position'),
              top: this.currentItem.css('top'),
              left: this.currentItem.css('left')
            }),
          (i[0].style.width && !e.forceHelperSize) ||
            i.width(this.currentItem.width()),
          (i[0].style.height && !e.forceHelperSize) ||
            i.height(this.currentItem.height()),
          i
        );
      },
      _adjustOffsetFromHelper: function(t) {
        'string' == typeof t && (t = t.split(' ')),
          x.isArray(t) && (t = { left: +t[0], top: +t[1] || 0 }),
          'left' in t && (this.offset.click.left = t.left + this.margins.left),
          'right' in t &&
            (this.offset.click.left =
              this.helperProportions.width - t.right + this.margins.left),
          'top' in t && (this.offset.click.top = t.top + this.margins.top),
          'bottom' in t &&
            (this.offset.click.top =
              this.helperProportions.height - t.bottom + this.margins.top);
      },
      _getParentOffset: function() {
        this.offsetParent = this.helper.offsetParent();
        var t = this.offsetParent.offset();
        return (
          'absolute' === this.cssPosition &&
            this.scrollParent[0] !== this.document[0] &&
            x.contains(this.scrollParent[0], this.offsetParent[0]) &&
            ((t.left += this.scrollParent.scrollLeft()),
            (t.top += this.scrollParent.scrollTop())),
          (this.offsetParent[0] === this.document[0].body ||
            (this.offsetParent[0].tagName &&
              'html' === this.offsetParent[0].tagName.toLowerCase() &&
              x.ui.ie)) &&
            (t = { top: 0, left: 0 }),
          {
            top:
              t.top +
              (parseInt(this.offsetParent.css('borderTopWidth'), 10) || 0),
            left:
              t.left +
              (parseInt(this.offsetParent.css('borderLeftWidth'), 10) || 0)
          }
        );
      },
      _getRelativeOffset: function() {
        if ('relative' !== this.cssPosition) return { top: 0, left: 0 };
        var t = this.currentItem.position();
        return {
          top:
            t.top -
            (parseInt(this.helper.css('top'), 10) || 0) +
            this.scrollParent.scrollTop(),
          left:
            t.left -
            (parseInt(this.helper.css('left'), 10) || 0) +
            this.scrollParent.scrollLeft()
        };
      },
      _cacheMargins: function() {
        this.margins = {
          left: parseInt(this.currentItem.css('marginLeft'), 10) || 0,
          top: parseInt(this.currentItem.css('marginTop'), 10) || 0
        };
      },
      _cacheHelperProportions: function() {
        this.helperProportions = {
          width: this.helper.outerWidth(),
          height: this.helper.outerHeight()
        };
      },
      _setContainment: function() {
        var t,
          e,
          i,
          s = this.options;
        'parent' === s.containment &&
          (s.containment = this.helper[0].parentNode),
          ('document' !== s.containment && 'window' !== s.containment) ||
            (this.containment = [
              0 - this.offset.relative.left - this.offset.parent.left,
              0 - this.offset.relative.top - this.offset.parent.top,
              'document' === s.containment
                ? this.document.width()
                : this.window.width() -
                  this.helperProportions.width -
                  this.margins.left,
              ('document' === s.containment
                ? this.document.height() ||
                  document.body.parentNode.scrollHeight
                : this.window.height() ||
                  this.document[0].body.parentNode.scrollHeight) -
                this.helperProportions.height -
                this.margins.top
            ]),
          /^(document|window|parent)$/.test(s.containment) ||
            ((t = x(s.containment)[0]),
            (e = x(s.containment).offset()),
            (i = 'hidden' !== x(t).css('overflow')),
            (this.containment = [
              e.left +
                (parseInt(x(t).css('borderLeftWidth'), 10) || 0) +
                (parseInt(x(t).css('paddingLeft'), 10) || 0) -
                this.margins.left,
              e.top +
                (parseInt(x(t).css('borderTopWidth'), 10) || 0) +
                (parseInt(x(t).css('paddingTop'), 10) || 0) -
                this.margins.top,
              e.left +
                (i ? Math.max(t.scrollWidth, t.offsetWidth) : t.offsetWidth) -
                (parseInt(x(t).css('borderLeftWidth'), 10) || 0) -
                (parseInt(x(t).css('paddingRight'), 10) || 0) -
                this.helperProportions.width -
                this.margins.left,
              e.top +
                (i
                  ? Math.max(t.scrollHeight, t.offsetHeight)
                  : t.offsetHeight) -
                (parseInt(x(t).css('borderTopWidth'), 10) || 0) -
                (parseInt(x(t).css('paddingBottom'), 10) || 0) -
                this.helperProportions.height -
                this.margins.top
            ]));
      },
      _convertPositionTo: function(t, e) {
        e = e || this.position;
        var i = 'absolute' === t ? 1 : -1,
          s =
            'absolute' !== this.cssPosition ||
            (this.scrollParent[0] !== this.document[0] &&
              x.contains(this.scrollParent[0], this.offsetParent[0]))
              ? this.scrollParent
              : this.offsetParent,
          n = /(html|body)/i.test(s[0].tagName);
        return {
          top:
            e.top +
            this.offset.relative.top * i +
            this.offset.parent.top * i -
            ('fixed' === this.cssPosition
              ? -this.scrollParent.scrollTop()
              : n
              ? 0
              : s.scrollTop()) *
              i,
          left:
            e.left +
            this.offset.relative.left * i +
            this.offset.parent.left * i -
            ('fixed' === this.cssPosition
              ? -this.scrollParent.scrollLeft()
              : n
              ? 0
              : s.scrollLeft()) *
              i
        };
      },
      _generatePosition: function(t) {
        var e,
          i,
          s = this.options,
          n = t.pageX,
          o = t.pageY,
          a =
            'absolute' !== this.cssPosition ||
            (this.scrollParent[0] !== this.document[0] &&
              x.contains(this.scrollParent[0], this.offsetParent[0]))
              ? this.scrollParent
              : this.offsetParent,
          r = /(html|body)/i.test(a[0].tagName);
        return (
          'relative' !== this.cssPosition ||
            (this.scrollParent[0] !== this.document[0] &&
              this.scrollParent[0] !== this.offsetParent[0]) ||
            (this.offset.relative = this._getRelativeOffset()),
          this.originalPosition &&
            (this.containment &&
              (t.pageX - this.offset.click.left < this.containment[0] &&
                (n = this.containment[0] + this.offset.click.left),
              t.pageY - this.offset.click.top < this.containment[1] &&
                (o = this.containment[1] + this.offset.click.top),
              t.pageX - this.offset.click.left > this.containment[2] &&
                (n = this.containment[2] + this.offset.click.left),
              t.pageY - this.offset.click.top > this.containment[3] &&
                (o = this.containment[3] + this.offset.click.top)),
            s.grid &&
              ((e =
                this.originalPageY +
                Math.round((o - this.originalPageY) / s.grid[1]) * s.grid[1]),
              (o = this.containment
                ? e - this.offset.click.top >= this.containment[1] &&
                  e - this.offset.click.top <= this.containment[3]
                  ? e
                  : e - this.offset.click.top >= this.containment[1]
                  ? e - s.grid[1]
                  : e + s.grid[1]
                : e),
              (i =
                this.originalPageX +
                Math.round((n - this.originalPageX) / s.grid[0]) * s.grid[0]),
              (n = this.containment
                ? i - this.offset.click.left >= this.containment[0] &&
                  i - this.offset.click.left <= this.containment[2]
                  ? i
                  : i - this.offset.click.left >= this.containment[0]
                  ? i - s.grid[0]
                  : i + s.grid[0]
                : i))),
          {
            top:
              o -
              this.offset.click.top -
              this.offset.relative.top -
              this.offset.parent.top +
              ('fixed' === this.cssPosition
                ? -this.scrollParent.scrollTop()
                : r
                ? 0
                : a.scrollTop()),
            left:
              n -
              this.offset.click.left -
              this.offset.relative.left -
              this.offset.parent.left +
              ('fixed' === this.cssPosition
                ? -this.scrollParent.scrollLeft()
                : r
                ? 0
                : a.scrollLeft())
          }
        );
      },
      _rearrange: function(t, e, i, s) {
        i
          ? i[0].appendChild(this.placeholder[0])
          : e.item[0].parentNode.insertBefore(
              this.placeholder[0],
              'down' === this.direction ? e.item[0] : e.item[0].nextSibling
            ),
          (this.counter = this.counter ? ++this.counter : 1);
        var n = this.counter;
        this._delay(function() {
          n === this.counter && this.refreshPositions(!s);
        });
      },
      _clear: function(t, e) {
        this.reverting = !1;
        var i,
          s = [];
        if (
          (!this._noFinalSort &&
            this.currentItem.parent().length &&
            this.placeholder.before(this.currentItem),
          (this._noFinalSort = null),
          this.helper[0] === this.currentItem[0])
        ) {
          for (i in this._storedCSS)
            ('auto' !== this._storedCSS[i] &&
              'static' !== this._storedCSS[i]) ||
              (this._storedCSS[i] = '');
          this.currentItem.css(this._storedCSS),
            this._removeClass(this.currentItem, 'ui-sortable-helper');
        } else this.currentItem.show();
        function n(e, i, s) {
          return function(t) {
            s._trigger(e, t, i._uiHash(i));
          };
        }
        for (
          this.fromOutside &&
            !e &&
            s.push(function(t) {
              this._trigger('receive', t, this._uiHash(this.fromOutside));
            }),
            (!this.fromOutside &&
              this.domPosition.prev ===
                this.currentItem.prev().not('.ui-sortable-helper')[0] &&
              this.domPosition.parent === this.currentItem.parent()[0]) ||
              e ||
              s.push(function(t) {
                this._trigger('update', t, this._uiHash());
              }),
            this !== this.currentContainer &&
              (e ||
                (s.push(function(t) {
                  this._trigger('remove', t, this._uiHash());
                }),
                s.push(
                  function(e) {
                    return function(t) {
                      e._trigger('receive', t, this._uiHash(this));
                    };
                  }.call(this, this.currentContainer)
                ),
                s.push(
                  function(e) {
                    return function(t) {
                      e._trigger('update', t, this._uiHash(this));
                    };
                  }.call(this, this.currentContainer)
                ))),
            i = this.containers.length - 1;
          0 <= i;
          i--
        )
          e || s.push(n('deactivate', this, this.containers[i])),
            this.containers[i].containerCache.over &&
              (s.push(n('out', this, this.containers[i])),
              (this.containers[i].containerCache.over = 0));
        if (
          (this.storedCursor &&
            (this.document.find('body').css('cursor', this.storedCursor),
            this.storedStylesheet.remove()),
          this._storedOpacity &&
            this.helper.css('opacity', this._storedOpacity),
          this._storedZIndex &&
            this.helper.css(
              'zIndex',
              'auto' === this._storedZIndex ? '' : this._storedZIndex
            ),
          (this.dragging = !1),
          e || this._trigger('beforeStop', t, this._uiHash()),
          this.placeholder[0].parentNode.removeChild(this.placeholder[0]),
          this.cancelHelperRemoval ||
            (this.helper[0] !== this.currentItem[0] && this.helper.remove(),
            (this.helper = null)),
          !e)
        ) {
          for (i = 0; i < s.length; i++) s[i].call(this, t);
          this._trigger('stop', t, this._uiHash());
        }
        return (this.fromOutside = !1), !this.cancelHelperRemoval;
      },
      _trigger: function() {
        !1 === x.Widget.prototype._trigger.apply(this, arguments) &&
          this.cancel();
      },
      _uiHash: function(t) {
        var e = t || this;
        return {
          helper: e.helper,
          placeholder: e.placeholder || x([]),
          position: e.position,
          originalPosition: e.originalPosition,
          offset: e.positionAbs,
          item: e.currentItem,
          sender: t ? t.element : null
        };
      }
    }),
    x.widget('ui.accordion', {
      version: '1.12.1',
      options: {
        active: 0,
        animate: {},
        classes: {
          'ui-accordion-header': 'ui-corner-top',
          'ui-accordion-header-collapsed': 'ui-corner-all',
          'ui-accordion-content': 'ui-corner-bottom'
        },
        collapsible: !1,
        event: 'click',
        header: '> li > :first-child, > :not(li):even',
        heightStyle: 'auto',
        icons: {
          activeHeader: 'ui-icon-triangle-1-s',
          header: 'ui-icon-triangle-1-e'
        },
        activate: null,
        beforeActivate: null
      },
      hideProps: {
        borderTopWidth: 'hide',
        borderBottomWidth: 'hide',
        paddingTop: 'hide',
        paddingBottom: 'hide',
        height: 'hide'
      },
      showProps: {
        borderTopWidth: 'show',
        borderBottomWidth: 'show',
        paddingTop: 'show',
        paddingBottom: 'show',
        height: 'show'
      },
      _create: function() {
        var t = this.options;
        (this.prevShow = this.prevHide = x()),
          this._addClass('ui-accordion', 'ui-widget ui-helper-reset'),
          this.element.attr('role', 'tablist'),
          t.collapsible ||
            (!1 !== t.active && null != t.active) ||
            (t.active = 0),
          this._processPanels(),
          t.active < 0 && (t.active += this.headers.length),
          this._refresh();
      },
      _getCreateEventData: function() {
        return {
          header: this.active,
          panel: this.active.length ? this.active.next() : x()
        };
      },
      _createIcons: function() {
        var t,
          e,
          i = this.options.icons;
        i &&
          ((t = x('<span>')),
          this._addClass(t, 'ui-accordion-header-icon', 'ui-icon ' + i.header),
          t.prependTo(this.headers),
          (e = this.active.children('.ui-accordion-header-icon')),
          this._removeClass(e, i.header)
            ._addClass(e, null, i.activeHeader)
            ._addClass(this.headers, 'ui-accordion-icons'));
      },
      _destroyIcons: function() {
        this._removeClass(this.headers, 'ui-accordion-icons'),
          this.headers.children('.ui-accordion-header-icon').remove();
      },
      _destroy: function() {
        var t;
        this.element.removeAttr('role'),
          this.headers
            .removeAttr(
              'role aria-expanded aria-selected aria-controls tabIndex'
            )
            .removeUniqueId(),
          this._destroyIcons(),
          (t = this.headers
            .next()
            .css('display', '')
            .removeAttr('role aria-hidden aria-labelledby')
            .removeUniqueId()),
          'content' !== this.options.heightStyle && t.css('height', '');
      },
      _setOption: function(t, e) {
        'active' !== t
          ? ('event' === t &&
              (this.options.event &&
                this._off(this.headers, this.options.event),
              this._setupEvents(e)),
            this._super(t, e),
            'collapsible' !== t ||
              e ||
              !1 !== this.options.active ||
              this._activate(0),
            'icons' === t && (this._destroyIcons(), e && this._createIcons()))
          : this._activate(e);
      },
      _setOptionDisabled: function(t) {
        this._super(t),
          this.element.attr('aria-disabled', t),
          this._toggleClass(null, 'ui-state-disabled', !!t),
          this._toggleClass(
            this.headers.add(this.headers.next()),
            null,
            'ui-state-disabled',
            !!t
          );
      },
      _keydown: function(t) {
        if (!t.altKey && !t.ctrlKey) {
          var e = x.ui.keyCode,
            i = this.headers.length,
            s = this.headers.index(t.target),
            n = !1;
          switch (t.keyCode) {
            case e.RIGHT:
            case e.DOWN:
              n = this.headers[(s + 1) % i];
              break;
            case e.LEFT:
            case e.UP:
              n = this.headers[(s - 1 + i) % i];
              break;
            case e.SPACE:
            case e.ENTER:
              this._eventHandler(t);
              break;
            case e.HOME:
              n = this.headers[0];
              break;
            case e.END:
              n = this.headers[i - 1];
          }
          n &&
            (x(t.target).attr('tabIndex', -1),
            x(n).attr('tabIndex', 0),
            x(n).trigger('focus'),
            t.preventDefault());
        }
      },
      _panelKeyDown: function(t) {
        t.keyCode === x.ui.keyCode.UP &&
          t.ctrlKey &&
          x(t.currentTarget)
            .prev()
            .trigger('focus');
      },
      refresh: function() {
        var t = this.options;
        this._processPanels(),
          (!1 === t.active && !0 === t.collapsible) || !this.headers.length
            ? ((t.active = !1), (this.active = x()))
            : !1 === t.active
            ? this._activate(0)
            : this.active.length && !x.contains(this.element[0], this.active[0])
            ? this.headers.length ===
              this.headers.find('.ui-state-disabled').length
              ? ((t.active = !1), (this.active = x()))
              : this._activate(Math.max(0, t.active - 1))
            : (t.active = this.headers.index(this.active)),
          this._destroyIcons(),
          this._refresh();
      },
      _processPanels: function() {
        var t = this.headers,
          e = this.panels;
        (this.headers = this.element.find(this.options.header)),
          this._addClass(
            this.headers,
            'ui-accordion-header ui-accordion-header-collapsed',
            'ui-state-default'
          ),
          (this.panels = this.headers
            .next()
            .filter(':not(.ui-accordion-content-active)')
            .hide()),
          this._addClass(
            this.panels,
            'ui-accordion-content',
            'ui-helper-reset ui-widget-content'
          ),
          e && (this._off(t.not(this.headers)), this._off(e.not(this.panels)));
      },
      _refresh: function() {
        var i,
          t = this.options,
          e = t.heightStyle,
          s = this.element.parent();
        (this.active = this._findActive(t.active)),
          this._addClass(
            this.active,
            'ui-accordion-header-active',
            'ui-state-active'
          )._removeClass(this.active, 'ui-accordion-header-collapsed'),
          this._addClass(this.active.next(), 'ui-accordion-content-active'),
          this.active.next().show(),
          this.headers
            .attr('role', 'tab')
            .each(function() {
              var t = x(this),
                e = t.uniqueId().attr('id'),
                i = t.next(),
                s = i.uniqueId().attr('id');
              t.attr('aria-controls', s), i.attr('aria-labelledby', e);
            })
            .next()
            .attr('role', 'tabpanel'),
          this.headers
            .not(this.active)
            .attr({
              'aria-selected': 'false',
              'aria-expanded': 'false',
              tabIndex: -1
            })
            .next()
            .attr({ 'aria-hidden': 'true' })
            .hide(),
          this.active.length
            ? this.active
                .attr({
                  'aria-selected': 'true',
                  'aria-expanded': 'true',
                  tabIndex: 0
                })
                .next()
                .attr({ 'aria-hidden': 'false' })
            : this.headers.eq(0).attr('tabIndex', 0),
          this._createIcons(),
          this._setupEvents(t.event),
          'fill' === e
            ? ((i = s.height()),
              this.element.siblings(':visible').each(function() {
                var t = x(this),
                  e = t.css('position');
                'absolute' !== e && 'fixed' !== e && (i -= t.outerHeight(!0));
              }),
              this.headers.each(function() {
                i -= x(this).outerHeight(!0);
              }),
              this.headers
                .next()
                .each(function() {
                  x(this).height(
                    Math.max(0, i - x(this).innerHeight() + x(this).height())
                  );
                })
                .css('overflow', 'auto'))
            : 'auto' === e &&
              ((i = 0),
              this.headers
                .next()
                .each(function() {
                  var t = x(this).is(':visible');
                  t || x(this).show(),
                    (i = Math.max(
                      i,
                      x(this)
                        .css('height', '')
                        .height()
                    )),
                    t || x(this).hide();
                })
                .height(i));
      },
      _activate: function(t) {
        var e = this._findActive(t)[0];
        e !== this.active[0] &&
          ((e = e || this.active[0]),
          this._eventHandler({
            target: e,
            currentTarget: e,
            preventDefault: x.noop
          }));
      },
      _findActive: function(t) {
        return 'number' == typeof t ? this.headers.eq(t) : x();
      },
      _setupEvents: function(t) {
        var i = { keydown: '_keydown' };
        t &&
          x.each(t.split(' '), function(t, e) {
            i[e] = '_eventHandler';
          }),
          this._off(this.headers.add(this.headers.next())),
          this._on(this.headers, i),
          this._on(this.headers.next(), { keydown: '_panelKeyDown' }),
          this._hoverable(this.headers),
          this._focusable(this.headers);
      },
      _eventHandler: function(t) {
        var e,
          i,
          s = this.options,
          n = this.active,
          o = x(t.currentTarget),
          a = o[0] === n[0],
          r = a && s.collapsible,
          h = r ? x() : o.next(),
          l = n.next(),
          c = {
            oldHeader: n,
            oldPanel: l,
            newHeader: r ? x() : o,
            newPanel: h
          };
        t.preventDefault(),
          (a && !s.collapsible) ||
            !1 === this._trigger('beforeActivate', t, c) ||
            ((s.active = !r && this.headers.index(o)),
            (this.active = a ? x() : o),
            this._toggle(c),
            this._removeClass(
              n,
              'ui-accordion-header-active',
              'ui-state-active'
            ),
            s.icons &&
              ((e = n.children('.ui-accordion-header-icon')),
              this._removeClass(e, null, s.icons.activeHeader)._addClass(
                e,
                null,
                s.icons.header
              )),
            a ||
              (this._removeClass(o, 'ui-accordion-header-collapsed')._addClass(
                o,
                'ui-accordion-header-active',
                'ui-state-active'
              ),
              s.icons &&
                ((i = o.children('.ui-accordion-header-icon')),
                this._removeClass(i, null, s.icons.header)._addClass(
                  i,
                  null,
                  s.icons.activeHeader
                )),
              this._addClass(o.next(), 'ui-accordion-content-active')));
      },
      _toggle: function(t) {
        var e = t.newPanel,
          i = this.prevShow.length ? this.prevShow : t.oldPanel;
        this.prevShow.add(this.prevHide).stop(!0, !0),
          (this.prevShow = e),
          (this.prevHide = i),
          this.options.animate
            ? this._animate(e, i, t)
            : (i.hide(), e.show(), this._toggleComplete(t)),
          i.attr({ 'aria-hidden': 'true' }),
          i.prev().attr({ 'aria-selected': 'false', 'aria-expanded': 'false' }),
          e.length && i.length
            ? i.prev().attr({ tabIndex: -1, 'aria-expanded': 'false' })
            : e.length &&
              this.headers
                .filter(function() {
                  return 0 === parseInt(x(this).attr('tabIndex'), 10);
                })
                .attr('tabIndex', -1),
          e
            .attr('aria-hidden', 'false')
            .prev()
            .attr({
              'aria-selected': 'true',
              'aria-expanded': 'true',
              tabIndex: 0
            });
      },
      _animate: function(t, i, e) {
        function s() {
          r._toggleComplete(e);
        }
        var n,
          o,
          a,
          r = this,
          h = 0,
          l = t.css('box-sizing'),
          c = t.length && (!i.length || t.index() < i.index()),
          u = this.options.animate || {},
          d = (c && u.down) || u;
        return (
          'number' == typeof d && (a = d),
          'string' == typeof d && (o = d),
          (o = o || d.easing || u.easing),
          (a = a || d.duration || u.duration),
          i.length
            ? t.length
              ? ((n = t.show().outerHeight()),
                i.animate(this.hideProps, {
                  duration: a,
                  easing: o,
                  step: function(t, e) {
                    e.now = Math.round(t);
                  }
                }),
                void t.hide().animate(this.showProps, {
                  duration: a,
                  easing: o,
                  complete: s,
                  step: function(t, e) {
                    (e.now = Math.round(t)),
                      'height' !== e.prop
                        ? 'content-box' === l && (h += e.now)
                        : 'content' !== r.options.heightStyle &&
                          ((e.now = Math.round(n - i.outerHeight() - h)),
                          (h = 0));
                  }
                }))
              : i.animate(this.hideProps, a, o, s)
            : t.animate(this.showProps, a, o, s)
        );
      },
      _toggleComplete: function(t) {
        var e = t.oldPanel,
          i = e.prev();
        this._removeClass(e, 'ui-accordion-content-active'),
          this._removeClass(i, 'ui-accordion-header-active')._addClass(
            i,
            'ui-accordion-header-collapsed'
          ),
          e.length && (e.parent()[0].className = e.parent()[0].className),
          this._trigger('activate', null, t);
      }
    }),
    x.widget('ui.menu', {
      version: '1.12.1',
      defaultElement: '<ul>',
      delay: 300,
      options: {
        icons: { submenu: 'ui-icon-caret-1-e' },
        items: '> *',
        menus: 'ul',
        position: { my: 'left top', at: 'right top' },
        role: 'menu',
        blur: null,
        focus: null,
        select: null
      },
      _create: function() {
        (this.activeMenu = this.element),
          (this.mouseHandled = !1),
          this.element
            .uniqueId()
            .attr({ role: this.options.role, tabIndex: 0 }),
          this._addClass('ui-menu', 'ui-widget ui-widget-content'),
          this._on({
            'mousedown .ui-menu-item': function(t) {
              t.preventDefault();
            },
            'click .ui-menu-item': function(t) {
              var e = x(t.target),
                i = x(x.ui.safeActiveElement(this.document[0]));
              !this.mouseHandled &&
                e.not('.ui-state-disabled').length &&
                (this.select(t),
                t.isPropagationStopped() || (this.mouseHandled = !0),
                e.has('.ui-menu').length
                  ? this.expand(t)
                  : !this.element.is(':focus') &&
                    i.closest('.ui-menu').length &&
                    (this.element.trigger('focus', [!0]),
                    this.active &&
                      1 === this.active.parents('.ui-menu').length &&
                      clearTimeout(this.timer)));
            },
            'mouseenter .ui-menu-item': function(t) {
              if (!this.previousFilter) {
                var e = x(t.target).closest('.ui-menu-item'),
                  i = x(t.currentTarget);
                e[0] === i[0] &&
                  (this._removeClass(
                    i.siblings().children('.ui-state-active'),
                    null,
                    'ui-state-active'
                  ),
                  this.focus(t, i));
              }
            },
            mouseleave: 'collapseAll',
            'mouseleave .ui-menu': 'collapseAll',
            focus: function(t, e) {
              var i =
                this.active || this.element.find(this.options.items).eq(0);
              e || this.focus(t, i);
            },
            blur: function(t) {
              this._delay(function() {
                x.contains(
                  this.element[0],
                  x.ui.safeActiveElement(this.document[0])
                ) || this.collapseAll(t);
              });
            },
            keydown: '_keydown'
          }),
          this.refresh(),
          this._on(this.document, {
            click: function(t) {
              this._closeOnDocumentClick(t) && this.collapseAll(t),
                (this.mouseHandled = !1);
            }
          });
      },
      _destroy: function() {
        var t = this.element
          .find('.ui-menu-item')
          .removeAttr('role aria-disabled')
          .children('.ui-menu-item-wrapper')
          .removeUniqueId()
          .removeAttr('tabIndex role aria-haspopup');
        this.element
          .removeAttr('aria-activedescendant')
          .find('.ui-menu')
          .addBack()
          .removeAttr(
            'role aria-labelledby aria-expanded aria-hidden aria-disabled tabIndex'
          )
          .removeUniqueId()
          .show(),
          t.children().each(function() {
            var t = x(this);
            t.data('ui-menu-submenu-caret') && t.remove();
          });
      },
      _keydown: function(t) {
        var e,
          i,
          s,
          n,
          o = !0;
        switch (t.keyCode) {
          case x.ui.keyCode.PAGE_UP:
            this.previousPage(t);
            break;
          case x.ui.keyCode.PAGE_DOWN:
            this.nextPage(t);
            break;
          case x.ui.keyCode.HOME:
            this._move('first', 'first', t);
            break;
          case x.ui.keyCode.END:
            this._move('last', 'last', t);
            break;
          case x.ui.keyCode.UP:
            this.previous(t);
            break;
          case x.ui.keyCode.DOWN:
            this.next(t);
            break;
          case x.ui.keyCode.LEFT:
            this.collapse(t);
            break;
          case x.ui.keyCode.RIGHT:
            this.active &&
              !this.active.is('.ui-state-disabled') &&
              this.expand(t);
            break;
          case x.ui.keyCode.ENTER:
          case x.ui.keyCode.SPACE:
            this._activate(t);
            break;
          case x.ui.keyCode.ESCAPE:
            this.collapse(t);
            break;
          default:
            (o = !1),
              (i = this.previousFilter || ''),
              (n = !1),
              (s =
                96 <= t.keyCode && t.keyCode <= 105
                  ? (t.keyCode - 96).toString()
                  : String.fromCharCode(t.keyCode)),
              clearTimeout(this.filterTimer),
              s === i ? (n = !0) : (s = i + s),
              (e = this._filterMenuItems(s)),
              (e =
                n && -1 !== e.index(this.active.next())
                  ? this.active.nextAll('.ui-menu-item')
                  : e).length ||
                ((s = String.fromCharCode(t.keyCode)),
                (e = this._filterMenuItems(s))),
              e.length
                ? (this.focus(t, e),
                  (this.previousFilter = s),
                  (this.filterTimer = this._delay(function() {
                    delete this.previousFilter;
                  }, 1e3)))
                : delete this.previousFilter;
        }
        o && t.preventDefault();
      },
      _activate: function(t) {
        this.active &&
          !this.active.is('.ui-state-disabled') &&
          (this.active.children("[aria-haspopup='true']").length
            ? this.expand(t)
            : this.select(t));
      },
      refresh: function() {
        var t,
          e,
          i,
          s,
          n = this,
          o = this.options.icons.submenu,
          a = this.element.find(this.options.menus);
        this._toggleClass(
          'ui-menu-icons',
          null,
          !!this.element.find('.ui-icon').length
        ),
          (e = a
            .filter(':not(.ui-menu)')
            .hide()
            .attr({
              role: this.options.role,
              'aria-hidden': 'true',
              'aria-expanded': 'false'
            })
            .each(function() {
              var t = x(this),
                e = t.prev(),
                i = x('<span>').data('ui-menu-submenu-caret', !0);
              n._addClass(i, 'ui-menu-icon', 'ui-icon ' + o),
                e.attr('aria-haspopup', 'true').prepend(i),
                t.attr('aria-labelledby', e.attr('id'));
            })),
          this._addClass(e, 'ui-menu', 'ui-widget ui-widget-content ui-front'),
          (t = a.add(this.element).find(this.options.items))
            .not('.ui-menu-item')
            .each(function() {
              var t = x(this);
              n._isDivider(t) &&
                n._addClass(t, 'ui-menu-divider', 'ui-widget-content');
            }),
          (s = (i = t.not('.ui-menu-item, .ui-menu-divider'))
            .children()
            .not('.ui-menu')
            .uniqueId()
            .attr({ tabIndex: -1, role: this._itemRole() })),
          this._addClass(i, 'ui-menu-item')._addClass(
            s,
            'ui-menu-item-wrapper'
          ),
          t.filter('.ui-state-disabled').attr('aria-disabled', 'true'),
          this.active &&
            !x.contains(this.element[0], this.active[0]) &&
            this.blur();
      },
      _itemRole: function() {
        return { menu: 'menuitem', listbox: 'option' }[this.options.role];
      },
      _setOption: function(t, e) {
        if ('icons' === t) {
          var i = this.element.find('.ui-menu-icon');
          this._removeClass(i, null, this.options.icons.submenu)._addClass(
            i,
            null,
            e.submenu
          );
        }
        this._super(t, e);
      },
      _setOptionDisabled: function(t) {
        this._super(t),
          this.element.attr('aria-disabled', String(t)),
          this._toggleClass(null, 'ui-state-disabled', !!t);
      },
      focus: function(t, e) {
        var i, s, n;
        this.blur(t, t && 'focus' === t.type),
          this._scrollIntoView(e),
          (this.active = e.first()),
          (s = this.active.children('.ui-menu-item-wrapper')),
          this._addClass(s, null, 'ui-state-active'),
          this.options.role &&
            this.element.attr('aria-activedescendant', s.attr('id')),
          (n = this.active
            .parent()
            .closest('.ui-menu-item')
            .children('.ui-menu-item-wrapper')),
          this._addClass(n, null, 'ui-state-active'),
          t && 'keydown' === t.type
            ? this._close()
            : (this.timer = this._delay(function() {
                this._close();
              }, this.delay)),
          (i = e.children('.ui-menu')).length &&
            t &&
            /^mouse/.test(t.type) &&
            this._startOpening(i),
          (this.activeMenu = e.parent()),
          this._trigger('focus', t, { item: e });
      },
      _scrollIntoView: function(t) {
        var e, i, s, n, o, a;
        this._hasScroll() &&
          ((e = parseFloat(x.css(this.activeMenu[0], 'borderTopWidth')) || 0),
          (i = parseFloat(x.css(this.activeMenu[0], 'paddingTop')) || 0),
          (s = t.offset().top - this.activeMenu.offset().top - e - i),
          (n = this.activeMenu.scrollTop()),
          (o = this.activeMenu.height()),
          (a = t.outerHeight()),
          s < 0
            ? this.activeMenu.scrollTop(n + s)
            : o < s + a && this.activeMenu.scrollTop(n + s - o + a));
      },
      blur: function(t, e) {
        e || clearTimeout(this.timer),
          this.active &&
            (this._removeClass(
              this.active.children('.ui-menu-item-wrapper'),
              null,
              'ui-state-active'
            ),
            this._trigger('blur', t, { item: this.active }),
            (this.active = null));
      },
      _startOpening: function(t) {
        clearTimeout(this.timer),
          'true' === t.attr('aria-hidden') &&
            (this.timer = this._delay(function() {
              this._close(), this._open(t);
            }, this.delay));
      },
      _open: function(t) {
        var e = x.extend({ of: this.active }, this.options.position);
        clearTimeout(this.timer),
          this.element
            .find('.ui-menu')
            .not(t.parents('.ui-menu'))
            .hide()
            .attr('aria-hidden', 'true'),
          t
            .show()
            .removeAttr('aria-hidden')
            .attr('aria-expanded', 'true')
            .position(e);
      },
      collapseAll: function(e, i) {
        clearTimeout(this.timer),
          (this.timer = this._delay(function() {
            var t = i
              ? this.element
              : x(e && e.target).closest(this.element.find('.ui-menu'));
            t.length || (t = this.element),
              this._close(t),
              this.blur(e),
              this._removeClass(
                t.find('.ui-state-active'),
                null,
                'ui-state-active'
              ),
              (this.activeMenu = t);
          }, this.delay));
      },
      _close: function(t) {
        (t = t || (this.active ? this.active.parent() : this.element))
          .find('.ui-menu')
          .hide()
          .attr('aria-hidden', 'true')
          .attr('aria-expanded', 'false');
      },
      _closeOnDocumentClick: function(t) {
        return !x(t.target).closest('.ui-menu').length;
      },
      _isDivider: function(t) {
        return !/[^\-\u2014\u2013\s]/.test(t.text());
      },
      collapse: function(t) {
        var e =
          this.active &&
          this.active.parent().closest('.ui-menu-item', this.element);
        e && e.length && (this._close(), this.focus(t, e));
      },
      expand: function(t) {
        var e =
          this.active &&
          this.active
            .children('.ui-menu ')
            .find(this.options.items)
            .first();
        e &&
          e.length &&
          (this._open(e.parent()),
          this._delay(function() {
            this.focus(t, e);
          }));
      },
      next: function(t) {
        this._move('next', 'first', t);
      },
      previous: function(t) {
        this._move('prev', 'last', t);
      },
      isFirstItem: function() {
        return this.active && !this.active.prevAll('.ui-menu-item').length;
      },
      isLastItem: function() {
        return this.active && !this.active.nextAll('.ui-menu-item').length;
      },
      _move: function(t, e, i) {
        var s;
        this.active &&
          (s =
            'first' === t || 'last' === t
              ? this.active['first' === t ? 'prevAll' : 'nextAll'](
                  '.ui-menu-item'
                ).eq(-1)
              : this.active[t + 'All']('.ui-menu-item').eq(0)),
          (s && s.length && this.active) ||
            (s = this.activeMenu.find(this.options.items)[e]()),
          this.focus(i, s);
      },
      nextPage: function(t) {
        var e, i, s;
        this.active
          ? this.isLastItem() ||
            (this._hasScroll()
              ? ((i = this.active.offset().top),
                (s = this.element.height()),
                this.active.nextAll('.ui-menu-item').each(function() {
                  return (e = x(this)).offset().top - i - s < 0;
                }),
                this.focus(t, e))
              : this.focus(
                  t,
                  this.activeMenu
                    .find(this.options.items)
                    [this.active ? 'last' : 'first']()
                ))
          : this.next(t);
      },
      previousPage: function(t) {
        var e, i, s;
        this.active
          ? this.isFirstItem() ||
            (this._hasScroll()
              ? ((i = this.active.offset().top),
                (s = this.element.height()),
                this.active.prevAll('.ui-menu-item').each(function() {
                  return 0 < (e = x(this)).offset().top - i + s;
                }),
                this.focus(t, e))
              : this.focus(t, this.activeMenu.find(this.options.items).first()))
          : this.next(t);
      },
      _hasScroll: function() {
        return this.element.outerHeight() < this.element.prop('scrollHeight');
      },
      select: function(t) {
        this.active = this.active || x(t.target).closest('.ui-menu-item');
        var e = { item: this.active };
        this.active.has('.ui-menu').length || this.collapseAll(t, !0),
          this._trigger('select', t, e);
      },
      _filterMenuItems: function(t) {
        var e = t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&'),
          i = new RegExp('^' + e, 'i');
        return this.activeMenu
          .find(this.options.items)
          .filter('.ui-menu-item')
          .filter(function() {
            return i.test(
              x.trim(
                x(this)
                  .children('.ui-menu-item-wrapper')
                  .text()
              )
            );
          });
      }
    });
  x.widget('ui.autocomplete', {
    version: '1.12.1',
    defaultElement: '<input>',
    options: {
      appendTo: null,
      autoFocus: !1,
      delay: 300,
      minLength: 1,
      position: { my: 'left top', at: 'left bottom', collision: 'none' },
      source: null,
      change: null,
      close: null,
      focus: null,
      open: null,
      response: null,
      search: null,
      select: null
    },
    requestIndex: 0,
    pending: 0,
    _create: function() {
      var i,
        s,
        n,
        t = this.element[0].nodeName.toLowerCase(),
        e = 'textarea' === t,
        o = 'input' === t;
      (this.isMultiLine = e || (!o && this._isContentEditable(this.element))),
        (this.valueMethod = this.element[e || o ? 'val' : 'text']),
        (this.isNewMenu = !0),
        this._addClass('ui-autocomplete-input'),
        this.element.attr('autocomplete', 'off'),
        this._on(this.element, {
          keydown: function(t) {
            if (this.element.prop('readOnly')) s = n = i = !0;
            else {
              s = n = i = !1;
              var e = x.ui.keyCode;
              switch (t.keyCode) {
                case e.PAGE_UP:
                  (i = !0), this._move('previousPage', t);
                  break;
                case e.PAGE_DOWN:
                  (i = !0), this._move('nextPage', t);
                  break;
                case e.UP:
                  (i = !0), this._keyEvent('previous', t);
                  break;
                case e.DOWN:
                  (i = !0), this._keyEvent('next', t);
                  break;
                case e.ENTER:
                  this.menu.active &&
                    ((i = !0), t.preventDefault(), this.menu.select(t));
                  break;
                case e.TAB:
                  this.menu.active && this.menu.select(t);
                  break;
                case e.ESCAPE:
                  this.menu.element.is(':visible') &&
                    (this.isMultiLine || this._value(this.term),
                    this.close(t),
                    t.preventDefault());
                  break;
                default:
                  (s = !0), this._searchTimeout(t);
              }
            }
          },
          keypress: function(t) {
            if (i)
              return (
                (i = !1),
                void (
                  (this.isMultiLine && !this.menu.element.is(':visible')) ||
                  t.preventDefault()
                )
              );
            if (!s) {
              var e = x.ui.keyCode;
              switch (t.keyCode) {
                case e.PAGE_UP:
                  this._move('previousPage', t);
                  break;
                case e.PAGE_DOWN:
                  this._move('nextPage', t);
                  break;
                case e.UP:
                  this._keyEvent('previous', t);
                  break;
                case e.DOWN:
                  this._keyEvent('next', t);
              }
            }
          },
          input: function(t) {
            if (n) return (n = !1), void t.preventDefault();
            this._searchTimeout(t);
          },
          focus: function() {
            (this.selectedItem = null), (this.previous = this._value());
          },
          blur: function(t) {
            this.cancelBlur
              ? delete this.cancelBlur
              : (clearTimeout(this.searching), this.close(t), this._change(t));
          }
        }),
        this._initSource(),
        (this.menu = x('<ul>')
          .appendTo(this._appendTo())
          .menu({ role: null })
          .hide()
          .menu('instance')),
        this._addClass(this.menu.element, 'ui-autocomplete', 'ui-front'),
        this._on(this.menu.element, {
          mousedown: function(t) {
            t.preventDefault(),
              (this.cancelBlur = !0),
              this._delay(function() {
                delete this.cancelBlur,
                  this.element[0] !==
                    x.ui.safeActiveElement(this.document[0]) &&
                    this.element.trigger('focus');
              });
          },
          menufocus: function(t, e) {
            var i, s;
            if (
              this.isNewMenu &&
              ((this.isNewMenu = !1),
              t.originalEvent && /^mouse/.test(t.originalEvent.type))
            )
              return (
                this.menu.blur(),
                void this.document.one('mousemove', function() {
                  x(t.target).trigger(t.originalEvent);
                })
              );
            (s = e.item.data('ui-autocomplete-item')),
              !1 !== this._trigger('focus', t, { item: s }) &&
                t.originalEvent &&
                /^key/.test(t.originalEvent.type) &&
                this._value(s.value),
              (i = e.item.attr('aria-label') || s.value) &&
                x.trim(i).length &&
                (this.liveRegion.children().hide(),
                x('<div>')
                  .text(i)
                  .appendTo(this.liveRegion));
          },
          menuselect: function(t, e) {
            var i = e.item.data('ui-autocomplete-item'),
              s = this.previous;
            this.element[0] !== x.ui.safeActiveElement(this.document[0]) &&
              (this.element.trigger('focus'),
              (this.previous = s),
              this._delay(function() {
                (this.previous = s), (this.selectedItem = i);
              })),
              !1 !== this._trigger('select', t, { item: i }) &&
                this._value(i.value),
              (this.term = this._value()),
              this.close(t),
              (this.selectedItem = i);
          }
        }),
        (this.liveRegion = x('<div>', {
          role: 'status',
          'aria-live': 'assertive',
          'aria-relevant': 'additions'
        }).appendTo(this.document[0].body)),
        this._addClass(this.liveRegion, null, 'ui-helper-hidden-accessible'),
        this._on(this.window, {
          beforeunload: function() {
            this.element.removeAttr('autocomplete');
          }
        });
    },
    _destroy: function() {
      clearTimeout(this.searching),
        this.element.removeAttr('autocomplete'),
        this.menu.element.remove(),
        this.liveRegion.remove();
    },
    _setOption: function(t, e) {
      this._super(t, e),
        'source' === t && this._initSource(),
        'appendTo' === t && this.menu.element.appendTo(this._appendTo()),
        'disabled' === t && e && this.xhr && this.xhr.abort();
    },
    _isEventTargetInWidget: function(t) {
      var e = this.menu.element[0];
      return (
        t.target === this.element[0] ||
        t.target === e ||
        x.contains(e, t.target)
      );
    },
    _closeOnClickOutside: function(t) {
      this._isEventTargetInWidget(t) || this.close();
    },
    _appendTo: function() {
      var t = this.options.appendTo;
      return (
        ((t =
          t && (t.jquery || t.nodeType ? x(t) : this.document.find(t).eq(0))) &&
          t[0]) ||
          (t = this.element.closest('.ui-front, dialog')),
        t.length || (t = this.document[0].body),
        t
      );
    },
    _initSource: function() {
      var i,
        s,
        n = this;
      x.isArray(this.options.source)
        ? ((i = this.options.source),
          (this.source = function(t, e) {
            e(x.ui.autocomplete.filter(i, t.term));
          }))
        : 'string' == typeof this.options.source
        ? ((s = this.options.source),
          (this.source = function(t, e) {
            n.xhr && n.xhr.abort(),
              (n.xhr = x.ajax({
                url: s,
                data: t,
                dataType: 'json',
                success: function(t) {
                  e(t);
                },
                error: function() {
                  e([]);
                }
              }));
          }))
        : (this.source = this.options.source);
    },
    _searchTimeout: function(s) {
      clearTimeout(this.searching),
        (this.searching = this._delay(function() {
          var t = this.term === this._value(),
            e = this.menu.element.is(':visible'),
            i = s.altKey || s.ctrlKey || s.metaKey || s.shiftKey;
          (t && (!t || e || i)) ||
            ((this.selectedItem = null), this.search(null, s));
        }, this.options.delay));
    },
    search: function(t, e) {
      return (
        (t = null != t ? t : this._value()),
        (this.term = this._value()),
        t.length < this.options.minLength
          ? this.close(e)
          : !1 !== this._trigger('search', e)
          ? this._search(t)
          : void 0
      );
    },
    _search: function(t) {
      this.pending++,
        this._addClass('ui-autocomplete-loading'),
        (this.cancelSearch = !1),
        this.source({ term: t }, this._response());
    },
    _response: function() {
      var e = ++this.requestIndex;
      return x.proxy(function(t) {
        e === this.requestIndex && this.__response(t),
          this.pending--,
          this.pending || this._removeClass('ui-autocomplete-loading');
      }, this);
    },
    __response: function(t) {
      (t = t && this._normalize(t)),
        this._trigger('response', null, { content: t }),
        !this.options.disabled && t && t.length && !this.cancelSearch
          ? (this._suggest(t), this._trigger('open'))
          : this._close();
    },
    close: function(t) {
      (this.cancelSearch = !0), this._close(t);
    },
    _close: function(t) {
      this._off(this.document, 'mousedown'),
        this.menu.element.is(':visible') &&
          (this.menu.element.hide(),
          this.menu.blur(),
          (this.isNewMenu = !0),
          this._trigger('close', t));
    },
    _change: function(t) {
      this.previous !== this._value() &&
        this._trigger('change', t, { item: this.selectedItem });
    },
    _normalize: function(t) {
      return t.length && t[0].label && t[0].value
        ? t
        : x.map(t, function(t) {
            return 'string' == typeof t
              ? { label: t, value: t }
              : x.extend({}, t, {
                  label: t.label || t.value,
                  value: t.value || t.label
                });
          });
    },
    _suggest: function(t) {
      var e = this.menu.element.empty();
      this._renderMenu(e, t),
        (this.isNewMenu = !0),
        this.menu.refresh(),
        e.show(),
        this._resizeMenu(),
        e.position(x.extend({ of: this.element }, this.options.position)),
        this.options.autoFocus && this.menu.next(),
        this._on(this.document, { mousedown: '_closeOnClickOutside' });
    },
    _resizeMenu: function() {
      var t = this.menu.element;
      t.outerWidth(
        Math.max(t.width('').outerWidth() + 1, this.element.outerWidth())
      );
    },
    _renderMenu: function(i, t) {
      var s = this;
      x.each(t, function(t, e) {
        s._renderItemData(i, e);
      });
    },
    _renderItemData: function(t, e) {
      return this._renderItem(t, e).data('ui-autocomplete-item', e);
    },
    _renderItem: function(t, e) {
      return x('<li>')
        .append(x('<div>').text(e.label))
        .appendTo(t);
    },
    _move: function(t, e) {
      if (this.menu.element.is(':visible'))
        return (this.menu.isFirstItem() && /^previous/.test(t)) ||
          (this.menu.isLastItem() && /^next/.test(t))
          ? (this.isMultiLine || this._value(this.term), void this.menu.blur())
          : void this.menu[t](e);
      this.search(null, e);
    },
    widget: function() {
      return this.menu.element;
    },
    _value: function() {
      return this.valueMethod.apply(this.element, arguments);
    },
    _keyEvent: function(t, e) {
      (this.isMultiLine && !this.menu.element.is(':visible')) ||
        (this._move(t, e), e.preventDefault());
    },
    _isContentEditable: function(t) {
      if (!t.length) return !1;
      var e = t.prop('contentEditable');
      return 'inherit' === e
        ? this._isContentEditable(t.parent())
        : 'true' === e;
    }
  }),
    x.extend(x.ui.autocomplete, {
      escapeRegex: function(t) {
        return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
      },
      filter: function(t, e) {
        var i = new RegExp(x.ui.autocomplete.escapeRegex(e), 'i');
        return x.grep(t, function(t) {
          return i.test(t.label || t.value || t);
        });
      }
    }),
    x.widget('ui.autocomplete', x.ui.autocomplete, {
      options: {
        messages: {
          noResults: 'No search results.',
          results: function(t) {
            return (
              t +
              (1 < t ? ' results are' : ' result is') +
              ' available, use up and down arrow keys to navigate.'
            );
          }
        }
      },
      __response: function(t) {
        var e;
        this._superApply(arguments),
          this.options.disabled ||
            this.cancelSearch ||
            ((e =
              t && t.length
                ? this.options.messages.results(t.length)
                : this.options.messages.noResults),
            this.liveRegion.children().hide(),
            x('<div>')
              .text(e)
              .appendTo(this.liveRegion));
      }
    });
  x.ui.autocomplete;
  var g = /ui-corner-([a-z]){2,6}/g;
  x.widget('ui.controlgroup', {
    version: '1.12.1',
    defaultElement: '<div>',
    options: {
      direction: 'horizontal',
      disabled: null,
      onlyVisible: !0,
      items: {
        button:
          'input[type=button], input[type=submit], input[type=reset], button, a',
        controlgroupLabel: '.ui-controlgroup-label',
        checkboxradio: "input[type='checkbox'], input[type='radio']",
        selectmenu: 'select',
        spinner: '.ui-spinner-input'
      }
    },
    _create: function() {
      this._enhance();
    },
    _enhance: function() {
      this.element.attr('role', 'toolbar'), this.refresh();
    },
    _destroy: function() {
      this._callChildMethod('destroy'),
        this.childWidgets.removeData('ui-controlgroup-data'),
        this.element.removeAttr('role'),
        this.options.items.controlgroupLabel &&
          this.element
            .find(this.options.items.controlgroupLabel)
            .find('.ui-controlgroup-label-contents')
            .contents()
            .unwrap();
    },
    _initWidgets: function() {
      var a = this,
        r = [];
      x.each(this.options.items, function(n, t) {
        var e,
          o = {};
        if (t)
          return 'controlgroupLabel' === n
            ? ((e = a.element.find(t)).each(function() {
                var t = x(this);
                t.children('.ui-controlgroup-label-contents').length ||
                  t
                    .contents()
                    .wrapAll(
                      "<span class='ui-controlgroup-label-contents'></span>"
                    );
              }),
              a._addClass(
                e,
                null,
                'ui-widget ui-widget-content ui-state-default'
              ),
              void (r = r.concat(e.get())))
            : void (
                x.fn[n] &&
                ((o = a['_' + n + 'Options']
                  ? a['_' + n + 'Options']('middle')
                  : { classes: {} }),
                a.element.find(t).each(function() {
                  var t = x(this),
                    e = t[n]('instance'),
                    i = x.widget.extend({}, o);
                  if ('button' !== n || !t.parent('.ui-spinner').length) {
                    (e = e || t[n]()[n]('instance')) &&
                      (i.classes = a._resolveClassesValues(i.classes, e)),
                      t[n](i);
                    var s = t[n]('widget');
                    x.data(s[0], 'ui-controlgroup-data', e || t[n]('instance')),
                      r.push(s[0]);
                  }
                }))
              );
      }),
        (this.childWidgets = x(x.unique(r))),
        this._addClass(this.childWidgets, 'ui-controlgroup-item');
    },
    _callChildMethod: function(e) {
      this.childWidgets.each(function() {
        var t = x(this).data('ui-controlgroup-data');
        t && t[e] && t[e]();
      });
    },
    _updateCornerClass: function(t, e) {
      var i = this._buildSimpleOptions(e, 'label').classes.label;
      this._removeClass(
        t,
        null,
        'ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-corner-all'
      ),
        this._addClass(t, null, i);
    },
    _buildSimpleOptions: function(t, e) {
      var i = 'vertical' === this.options.direction,
        s = { classes: {} };
      return (
        (s.classes[e] = {
          middle: '',
          first: 'ui-corner-' + (i ? 'top' : 'left'),
          last: 'ui-corner-' + (i ? 'bottom' : 'right'),
          only: 'ui-corner-all'
        }[t]),
        s
      );
    },
    _spinnerOptions: function(t) {
      var e = this._buildSimpleOptions(t, 'ui-spinner');
      return (
        (e.classes['ui-spinner-up'] = ''),
        (e.classes['ui-spinner-down'] = ''),
        e
      );
    },
    _buttonOptions: function(t) {
      return this._buildSimpleOptions(t, 'ui-button');
    },
    _checkboxradioOptions: function(t) {
      return this._buildSimpleOptions(t, 'ui-checkboxradio-label');
    },
    _selectmenuOptions: function(t) {
      var e = 'vertical' === this.options.direction;
      return {
        width: e && 'auto',
        classes: {
          middle: {
            'ui-selectmenu-button-open': '',
            'ui-selectmenu-button-closed': ''
          },
          first: {
            'ui-selectmenu-button-open': 'ui-corner-' + (e ? 'top' : 'tl'),
            'ui-selectmenu-button-closed': 'ui-corner-' + (e ? 'top' : 'left')
          },
          last: {
            'ui-selectmenu-button-open': e ? '' : 'ui-corner-tr',
            'ui-selectmenu-button-closed':
              'ui-corner-' + (e ? 'bottom' : 'right')
          },
          only: {
            'ui-selectmenu-button-open': 'ui-corner-top',
            'ui-selectmenu-button-closed': 'ui-corner-all'
          }
        }[t]
      };
    },
    _resolveClassesValues: function(i, s) {
      var n = {};
      return (
        x.each(i, function(t) {
          var e = s.options.classes[t] || '';
          (e = x.trim(e.replace(g, ''))),
            (n[t] = (e + ' ' + i[t]).replace(/\s+/g, ' '));
        }),
        n
      );
    },
    _setOption: function(t, e) {
      'direction' === t &&
        this._removeClass('ui-controlgroup-' + this.options.direction),
        this._super(t, e),
        'disabled' !== t
          ? this.refresh()
          : this._callChildMethod(e ? 'disable' : 'enable');
    },
    refresh: function() {
      var n,
        o = this;
      this._addClass(
        'ui-controlgroup ui-controlgroup-' + this.options.direction
      ),
        'horizontal' === this.options.direction &&
          this._addClass(null, 'ui-helper-clearfix'),
        this._initWidgets(),
        (n = this.childWidgets),
        this.options.onlyVisible && (n = n.filter(':visible')),
        n.length &&
          (x.each(['first', 'last'], function(t, e) {
            var i = n[e]().data('ui-controlgroup-data');
            if (i && o['_' + i.widgetName + 'Options']) {
              var s = o['_' + i.widgetName + 'Options'](
                1 === n.length ? 'only' : e
              );
              (s.classes = o._resolveClassesValues(s.classes, i)),
                i.element[i.widgetName](s);
            } else o._updateCornerClass(n[e](), e);
          }),
          this._callChildMethod('refresh'));
    }
  });
  x.widget('ui.checkboxradio', [
    x.ui.formResetMixin,
    {
      version: '1.12.1',
      options: {
        disabled: null,
        label: null,
        icon: !0,
        classes: {
          'ui-checkboxradio-label': 'ui-corner-all',
          'ui-checkboxradio-icon': 'ui-corner-all'
        }
      },
      _getCreateOptions: function() {
        var t,
          e,
          i = this,
          s = this._super() || {};
        return (
          this._readType(),
          (e = this.element.labels()),
          (this.label = x(e[e.length - 1])),
          this.label.length ||
            x.error('No label found for checkboxradio widget'),
          (this.originalLabel = ''),
          this.label
            .contents()
            .not(this.element[0])
            .each(function() {
              i.originalLabel +=
                3 === this.nodeType ? x(this).text() : this.outerHTML;
            }),
          this.originalLabel && (s.label = this.originalLabel),
          null != (t = this.element[0].disabled) && (s.disabled = t),
          s
        );
      },
      _create: function() {
        var t = this.element[0].checked;
        this._bindFormResetHandler(),
          null == this.options.disabled &&
            (this.options.disabled = this.element[0].disabled),
          this._setOption('disabled', this.options.disabled),
          this._addClass('ui-checkboxradio', 'ui-helper-hidden-accessible'),
          this._addClass(
            this.label,
            'ui-checkboxradio-label',
            'ui-button ui-widget'
          ),
          'radio' === this.type &&
            this._addClass(this.label, 'ui-checkboxradio-radio-label'),
          this.options.label && this.options.label !== this.originalLabel
            ? this._updateLabel()
            : this.originalLabel && (this.options.label = this.originalLabel),
          this._enhance(),
          t &&
            (this._addClass(
              this.label,
              'ui-checkboxradio-checked',
              'ui-state-active'
            ),
            this.icon && this._addClass(this.icon, null, 'ui-state-hover')),
          this._on({
            change: '_toggleClasses',
            focus: function() {
              this._addClass(
                this.label,
                null,
                'ui-state-focus ui-visual-focus'
              );
            },
            blur: function() {
              this._removeClass(
                this.label,
                null,
                'ui-state-focus ui-visual-focus'
              );
            }
          });
      },
      _readType: function() {
        var t = this.element[0].nodeName.toLowerCase();
        (this.type = this.element[0].type),
          ('input' === t && /radio|checkbox/.test(this.type)) ||
            x.error(
              "Can't create checkboxradio on element.nodeName=" +
                t +
                ' and element.type=' +
                this.type
            );
      },
      _enhance: function() {
        this._updateIcon(this.element[0].checked);
      },
      widget: function() {
        return this.label;
      },
      _getRadioGroup: function() {
        var t = this.element[0].name,
          e = "input[name='" + x.ui.escapeSelector(t) + "']";
        return t
          ? (this.form.length
              ? x(this.form[0].elements).filter(e)
              : x(e).filter(function() {
                  return 0 === x(this).form().length;
                })
            ).not(this.element)
          : x([]);
      },
      _toggleClasses: function() {
        var t = this.element[0].checked;
        this._toggleClass(
          this.label,
          'ui-checkboxradio-checked',
          'ui-state-active',
          t
        ),
          this.options.icon &&
            'checkbox' === this.type &&
            this._toggleClass(
              this.icon,
              null,
              'ui-icon-check ui-state-checked',
              t
            )._toggleClass(this.icon, null, 'ui-icon-blank', !t),
          'radio' === this.type &&
            this._getRadioGroup().each(function() {
              var t = x(this).checkboxradio('instance');
              t &&
                t._removeClass(
                  t.label,
                  'ui-checkboxradio-checked',
                  'ui-state-active'
                );
            });
      },
      _destroy: function() {
        this._unbindFormResetHandler(),
          this.icon && (this.icon.remove(), this.iconSpace.remove());
      },
      _setOption: function(t, e) {
        if ('label' !== t || e) {
          if ((this._super(t, e), 'disabled' === t))
            return (
              this._toggleClass(this.label, null, 'ui-state-disabled', e),
              void (this.element[0].disabled = e)
            );
          this.refresh();
        }
      },
      _updateIcon: function(t) {
        var e = 'ui-icon ui-icon-background ';
        this.options.icon
          ? (this.icon ||
              ((this.icon = x('<span>')),
              (this.iconSpace = x('<span> </span>')),
              this._addClass(this.iconSpace, 'ui-checkboxradio-icon-space')),
            'checkbox' === this.type
              ? ((e += t ? 'ui-icon-check ui-state-checked' : 'ui-icon-blank'),
                this._removeClass(
                  this.icon,
                  null,
                  t ? 'ui-icon-blank' : 'ui-icon-check'
                ))
              : (e += 'ui-icon-blank'),
            this._addClass(this.icon, 'ui-checkboxradio-icon', e),
            t ||
              this._removeClass(
                this.icon,
                null,
                'ui-icon-check ui-state-checked'
              ),
            this.icon.prependTo(this.label).after(this.iconSpace))
          : void 0 !== this.icon &&
            (this.icon.remove(), this.iconSpace.remove(), delete this.icon);
      },
      _updateLabel: function() {
        var t = this.label.contents().not(this.element[0]);
        this.icon && (t = t.not(this.icon[0])),
          this.iconSpace && (t = t.not(this.iconSpace[0])),
          t.remove(),
          this.label.append(this.options.label);
      },
      refresh: function() {
        var t = this.element[0].checked,
          e = this.element[0].disabled;
        this._updateIcon(t),
          this._toggleClass(
            this.label,
            'ui-checkboxradio-checked',
            'ui-state-active',
            t
          ),
          null !== this.options.label && this._updateLabel(),
          e !== this.options.disabled && this._setOptions({ disabled: e });
      }
    }
  ]);
  var m;
  x.ui.checkboxradio;
  x.widget('ui.button', {
    version: '1.12.1',
    defaultElement: '<button>',
    options: {
      classes: { 'ui-button': 'ui-corner-all' },
      disabled: null,
      icon: null,
      iconPosition: 'beginning',
      label: null,
      showLabel: !0
    },
    _getCreateOptions: function() {
      var t,
        e = this._super() || {};
      return (
        (this.isInput = this.element.is('input')),
        null != (t = this.element[0].disabled) && (e.disabled = t),
        (this.originalLabel = this.isInput
          ? this.element.val()
          : this.element.html()),
        this.originalLabel && (e.label = this.originalLabel),
        e
      );
    },
    _create: function() {
      !this.option.showLabel & !this.options.icon &&
        (this.options.showLabel = !0),
        null == this.options.disabled &&
          (this.options.disabled = this.element[0].disabled || !1),
        (this.hasTitle = !!this.element.attr('title')),
        this.options.label &&
          this.options.label !== this.originalLabel &&
          (this.isInput
            ? this.element.val(this.options.label)
            : this.element.html(this.options.label)),
        this._addClass('ui-button', 'ui-widget'),
        this._setOption('disabled', this.options.disabled),
        this._enhance(),
        this.element.is('a') &&
          this._on({
            keyup: function(t) {
              t.keyCode === x.ui.keyCode.SPACE &&
                (t.preventDefault(),
                this.element[0].click
                  ? this.element[0].click()
                  : this.element.trigger('click'));
            }
          });
    },
    _enhance: function() {
      this.element.is('button') || this.element.attr('role', 'button'),
        this.options.icon &&
          (this._updateIcon('icon', this.options.icon), this._updateTooltip());
    },
    _updateTooltip: function() {
      (this.title = this.element.attr('title')),
        this.options.showLabel ||
          this.title ||
          this.element.attr('title', this.options.label);
    },
    _updateIcon: function(t, e) {
      var i = 'iconPosition' !== t,
        s = i ? this.options.iconPosition : e,
        n = 'top' === s || 'bottom' === s;
      this.icon
        ? i && this._removeClass(this.icon, null, this.options.icon)
        : ((this.icon = x('<span>')),
          this._addClass(this.icon, 'ui-button-icon', 'ui-icon'),
          this.options.showLabel || this._addClass('ui-button-icon-only')),
        i && this._addClass(this.icon, null, e),
        this._attachIcon(s),
        n
          ? (this._addClass(this.icon, null, 'ui-widget-icon-block'),
            this.iconSpace && this.iconSpace.remove())
          : (this.iconSpace ||
              ((this.iconSpace = x('<span> </span>')),
              this._addClass(this.iconSpace, 'ui-button-icon-space')),
            this._removeClass(this.icon, null, 'ui-wiget-icon-block'),
            this._attachIconSpace(s));
    },
    _destroy: function() {
      this.element.removeAttr('role'),
        this.icon && this.icon.remove(),
        this.iconSpace && this.iconSpace.remove(),
        this.hasTitle || this.element.removeAttr('title');
    },
    _attachIconSpace: function(t) {
      this.icon[/^(?:end|bottom)/.test(t) ? 'before' : 'after'](this.iconSpace);
    },
    _attachIcon: function(t) {
      this.element[/^(?:end|bottom)/.test(t) ? 'append' : 'prepend'](this.icon);
    },
    _setOptions: function(t) {
      var e = void 0 === t.showLabel ? this.options.showLabel : t.showLabel,
        i = void 0 === t.icon ? this.options.icon : t.icon;
      e || i || (t.showLabel = !0), this._super(t);
    },
    _setOption: function(t, e) {
      'icon' === t &&
        (e
          ? this._updateIcon(t, e)
          : this.icon &&
            (this.icon.remove(), this.iconSpace && this.iconSpace.remove())),
        'iconPosition' === t && this._updateIcon(t, e),
        'showLabel' === t &&
          (this._toggleClass('ui-button-icon-only', null, !e),
          this._updateTooltip()),
        'label' === t &&
          (this.isInput
            ? this.element.val(e)
            : (this.element.html(e),
              this.icon &&
                (this._attachIcon(this.options.iconPosition),
                this._attachIconSpace(this.options.iconPosition)))),
        this._super(t, e),
        'disabled' === t &&
          (this._toggleClass(null, 'ui-state-disabled', e),
          (this.element[0].disabled = e) && this.element.blur());
    },
    refresh: function() {
      var t = this.element.is('input, button')
        ? this.element[0].disabled
        : this.element.hasClass('ui-button-disabled');
      t !== this.options.disabled && this._setOptions({ disabled: t }),
        this._updateTooltip();
    }
  }),
    !1 !== x.uiBackCompat &&
      (x.widget('ui.button', x.ui.button, {
        options: { text: !0, icons: { primary: null, secondary: null } },
        _create: function() {
          this.options.showLabel &&
            !this.options.text &&
            (this.options.showLabel = this.options.text),
            !this.options.showLabel &&
              this.options.text &&
              (this.options.text = this.options.showLabel),
            this.options.icon ||
            (!this.options.icons.primary && !this.options.icons.secondary)
              ? this.options.icon &&
                (this.options.icons.primary = this.options.icon)
              : this.options.icons.primary
              ? (this.options.icon = this.options.icons.primary)
              : ((this.options.icon = this.options.icons.secondary),
                (this.options.iconPosition = 'end')),
            this._super();
        },
        _setOption: function(t, e) {
          'text' !== t
            ? ('showLabel' === t && (this.options.text = e),
              'icon' === t && (this.options.icons.primary = e),
              'icons' === t &&
                (e.primary
                  ? (this._super('icon', e.primary),
                    this._super('iconPosition', 'beginning'))
                  : e.secondary &&
                    (this._super('icon', e.secondary),
                    this._super('iconPosition', 'end'))),
              this._superApply(arguments))
            : this._super('showLabel', e);
        }
      }),
      (x.fn.button =
        ((m = x.fn.button),
        function() {
          return !this.length ||
            (this.length && 'INPUT' !== this[0].tagName) ||
            (this.length &&
              'INPUT' === this[0].tagName &&
              'checkbox' !== this.attr('type') &&
              'radio' !== this.attr('type'))
            ? m.apply(this, arguments)
            : (x.ui.checkboxradio || x.error('Checkboxradio widget missing'),
              0 === arguments.length
                ? this.checkboxradio({ icon: !1 })
                : this.checkboxradio.apply(this, arguments));
        })),
      (x.fn.buttonset = function() {
        return (
          x.ui.controlgroup || x.error('Controlgroup widget missing'),
          'option' === arguments[0] && 'items' === arguments[1] && arguments[2]
            ? this.controlgroup.apply(this, [
                arguments[0],
                'items.button',
                arguments[2]
              ])
            : 'option' === arguments[0] && 'items' === arguments[1]
            ? this.controlgroup.apply(this, [arguments[0], 'items.button'])
            : ('object' == typeof arguments[0] &&
                arguments[0].items &&
                (arguments[0].items = { button: arguments[0].items }),
              this.controlgroup.apply(this, arguments))
        );
      }));
  var _;
  x.ui.button;
  function v() {
    (this._curInst = null),
      (this._keyEvent = !1),
      (this._disabledInputs = []),
      (this._datepickerShowing = !1),
      (this._inDialog = !1),
      (this._mainDivId = 'ui-datepicker-div'),
      (this._inlineClass = 'ui-datepicker-inline'),
      (this._appendClass = 'ui-datepicker-append'),
      (this._triggerClass = 'ui-datepicker-trigger'),
      (this._dialogClass = 'ui-datepicker-dialog'),
      (this._disableClass = 'ui-datepicker-disabled'),
      (this._unselectableClass = 'ui-datepicker-unselectable'),
      (this._currentClass = 'ui-datepicker-current-day'),
      (this._dayOverClass = 'ui-datepicker-days-cell-over'),
      (this.regional = []),
      (this.regional[''] = {
        closeText: 'Done',
        prevText: 'Prev',
        nextText: 'Next',
        currentText: 'Today',
        monthNames: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ],
        monthNamesShort: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ],
        dayNames: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        weekHeader: 'Wk',
        dateFormat: 'mm/dd/yy',
        firstDay: 0,
        isRTL: !1,
        showMonthAfterYear: !1,
        yearSuffix: ''
      }),
      (this._defaults = {
        showOn: 'focus',
        showAnim: 'fadeIn',
        showOptions: {},
        defaultDate: null,
        appendText: '',
        buttonText: '...',
        buttonImage: '',
        buttonImageOnly: !1,
        hideIfNoPrevNext: !1,
        navigationAsDateFormat: !1,
        gotoCurrent: !1,
        changeMonth: !1,
        changeYear: !1,
        yearRange: 'c-10:c+10',
        showOtherMonths: !1,
        selectOtherMonths: !1,
        showWeek: !1,
        calculateWeek: this.iso8601Week,
        shortYearCutoff: '+10',
        minDate: null,
        maxDate: null,
        duration: 'fast',
        beforeShowDay: null,
        beforeShow: null,
        onSelect: null,
        onChangeMonthYear: null,
        onClose: null,
        numberOfMonths: 1,
        showCurrentAtPos: 0,
        stepMonths: 1,
        stepBigMonths: 12,
        altField: '',
        altFormat: '',
        constrainInput: !0,
        showButtonPanel: !1,
        autoSize: !1,
        disabled: !1
      }),
      x.extend(this._defaults, this.regional['']),
      (this.regional.en = x.extend(!0, {}, this.regional[''])),
      (this.regional['en-US'] = x.extend(!0, {}, this.regional.en)),
      (this.dpDiv = b(
        x(
          "<div id='" +
            this._mainDivId +
            "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"
        )
      ));
  }
  function b(t) {
    var e =
      'button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a';
    return t
      .on('mouseout', e, function() {
        x(this).removeClass('ui-state-hover'),
          -1 !== this.className.indexOf('ui-datepicker-prev') &&
            x(this).removeClass('ui-datepicker-prev-hover'),
          -1 !== this.className.indexOf('ui-datepicker-next') &&
            x(this).removeClass('ui-datepicker-next-hover');
      })
      .on('mouseover', e, y);
  }
  function y() {
    x.datepicker._isDisabledDatepicker(
      _.inline ? _.dpDiv.parent()[0] : _.input[0]
    ) ||
      (x(this)
        .parents('.ui-datepicker-calendar')
        .find('a')
        .removeClass('ui-state-hover'),
      x(this).addClass('ui-state-hover'),
      -1 !== this.className.indexOf('ui-datepicker-prev') &&
        x(this).addClass('ui-datepicker-prev-hover'),
      -1 !== this.className.indexOf('ui-datepicker-next') &&
        x(this).addClass('ui-datepicker-next-hover'));
  }
  function w(t, e) {
    for (var i in (x.extend(t, e), e)) null == e[i] && (t[i] = e[i]);
    return t;
  }
  x.extend(x.ui, { datepicker: { version: '1.12.1' } }),
    x.extend(v.prototype, {
      markerClassName: 'hasDatepicker',
      maxRows: 4,
      _widgetDatepicker: function() {
        return this.dpDiv;
      },
      setDefaults: function(t) {
        return w(this._defaults, t || {}), this;
      },
      _attachDatepicker: function(t, e) {
        var i, s, n;
        (s = 'div' === (i = t.nodeName.toLowerCase()) || 'span' === i),
          t.id || ((this.uuid += 1), (t.id = 'dp' + this.uuid)),
          ((n = this._newInst(x(t), s)).settings = x.extend({}, e || {})),
          'input' === i
            ? this._connectDatepicker(t, n)
            : s && this._inlineDatepicker(t, n);
      },
      _newInst: function(t, e) {
        return {
          id: t[0].id.replace(/([^A-Za-z0-9_\-])/g, '\\\\$1'),
          input: t,
          selectedDay: 0,
          selectedMonth: 0,
          selectedYear: 0,
          drawMonth: 0,
          drawYear: 0,
          inline: e,
          dpDiv: e
            ? b(
                x(
                  "<div class='" +
                    this._inlineClass +
                    " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"
                )
              )
            : this.dpDiv
        };
      },
      _connectDatepicker: function(t, e) {
        var i = x(t);
        (e.append = x([])),
          (e.trigger = x([])),
          i.hasClass(this.markerClassName) ||
            (this._attachments(i, e),
            i
              .addClass(this.markerClassName)
              .on('keydown', this._doKeyDown)
              .on('keypress', this._doKeyPress)
              .on('keyup', this._doKeyUp),
            this._autoSize(e),
            x.data(t, 'datepicker', e),
            e.settings.disabled && this._disableDatepicker(t));
      },
      _attachments: function(t, e) {
        var i,
          s,
          n,
          o = this._get(e, 'appendText'),
          a = this._get(e, 'isRTL');
        e.append && e.append.remove(),
          o &&
            ((e.append = x(
              "<span class='" + this._appendClass + "'>" + o + '</span>'
            )),
            t[a ? 'before' : 'after'](e.append)),
          t.off('focus', this._showDatepicker),
          e.trigger && e.trigger.remove(),
          ('focus' !== (i = this._get(e, 'showOn')) && 'both' !== i) ||
            t.on('focus', this._showDatepicker),
          ('button' !== i && 'both' !== i) ||
            ((s = this._get(e, 'buttonText')),
            (n = this._get(e, 'buttonImage')),
            (e.trigger = x(
              this._get(e, 'buttonImageOnly')
                ? x('<img/>')
                    .addClass(this._triggerClass)
                    .attr({ src: n, alt: s, title: s })
                : x("<button type='button'></button>")
                    .addClass(this._triggerClass)
                    .html(
                      n ? x('<img/>').attr({ src: n, alt: s, title: s }) : s
                    )
            )),
            t[a ? 'before' : 'after'](e.trigger),
            e.trigger.on('click', function() {
              return (
                x.datepicker._datepickerShowing &&
                x.datepicker._lastInput === t[0]
                  ? x.datepicker._hideDatepicker()
                  : (x.datepicker._datepickerShowing &&
                      x.datepicker._lastInput !== t[0] &&
                      x.datepicker._hideDatepicker(),
                    x.datepicker._showDatepicker(t[0])),
                !1
              );
            }));
      },
      _autoSize: function(t) {
        if (this._get(t, 'autoSize') && !t.inline) {
          var e,
            i,
            s,
            n,
            o = new Date(2009, 11, 20),
            a = this._get(t, 'dateFormat');
          a.match(/[DM]/) &&
            ((e = function(t) {
              for (n = s = i = 0; n < t.length; n++)
                t[n].length > i && ((i = t[n].length), (s = n));
              return s;
            }),
            o.setMonth(
              e(this._get(t, a.match(/MM/) ? 'monthNames' : 'monthNamesShort'))
            ),
            o.setDate(
              e(this._get(t, a.match(/DD/) ? 'dayNames' : 'dayNamesShort')) +
                20 -
                o.getDay()
            )),
            t.input.attr('size', this._formatDate(t, o).length);
        }
      },
      _inlineDatepicker: function(t, e) {
        var i = x(t);
        i.hasClass(this.markerClassName) ||
          (i.addClass(this.markerClassName).append(e.dpDiv),
          x.data(t, 'datepicker', e),
          this._setDate(e, this._getDefaultDate(e), !0),
          this._updateDatepicker(e),
          this._updateAlternate(e),
          e.settings.disabled && this._disableDatepicker(t),
          e.dpDiv.css('display', 'block'));
      },
      _dialogDatepicker: function(t, e, i, s, n) {
        var o,
          a,
          r,
          h,
          l,
          c = this._dialogInst;
        return (
          c ||
            ((this.uuid += 1),
            (o = 'dp' + this.uuid),
            (this._dialogInput = x(
              "<input type='text' id='" +
                o +
                "' style='position: absolute; top: -100px; width: 0px;'/>"
            )),
            this._dialogInput.on('keydown', this._doKeyDown),
            x('body').append(this._dialogInput),
            ((c = this._dialogInst = this._newInst(
              this._dialogInput,
              !1
            )).settings = {}),
            x.data(this._dialogInput[0], 'datepicker', c)),
          w(c.settings, s || {}),
          (e = e && e.constructor === Date ? this._formatDate(c, e) : e),
          this._dialogInput.val(e),
          (this._pos = n ? (n.length ? n : [n.pageX, n.pageY]) : null),
          this._pos ||
            ((a = document.documentElement.clientWidth),
            (r = document.documentElement.clientHeight),
            (h =
              document.documentElement.scrollLeft || document.body.scrollLeft),
            (l = document.documentElement.scrollTop || document.body.scrollTop),
            (this._pos = [a / 2 - 100 + h, r / 2 - 150 + l])),
          this._dialogInput
            .css('left', this._pos[0] + 20 + 'px')
            .css('top', this._pos[1] + 'px'),
          (c.settings.onSelect = i),
          (this._inDialog = !0),
          this.dpDiv.addClass(this._dialogClass),
          this._showDatepicker(this._dialogInput[0]),
          x.blockUI && x.blockUI(this.dpDiv),
          x.data(this._dialogInput[0], 'datepicker', c),
          this
        );
      },
      _destroyDatepicker: function(t) {
        var e,
          i = x(t),
          s = x.data(t, 'datepicker');
        i.hasClass(this.markerClassName) &&
          ((e = t.nodeName.toLowerCase()),
          x.removeData(t, 'datepicker'),
          'input' === e
            ? (s.append.remove(),
              s.trigger.remove(),
              i
                .removeClass(this.markerClassName)
                .off('focus', this._showDatepicker)
                .off('keydown', this._doKeyDown)
                .off('keypress', this._doKeyPress)
                .off('keyup', this._doKeyUp))
            : ('div' !== e && 'span' !== e) ||
              i.removeClass(this.markerClassName).empty(),
          _ === s && (_ = null));
      },
      _enableDatepicker: function(e) {
        var t,
          i,
          s = x(e),
          n = x.data(e, 'datepicker');
        s.hasClass(this.markerClassName) &&
          ('input' === (t = e.nodeName.toLowerCase())
            ? ((e.disabled = !1),
              n.trigger
                .filter('button')
                .each(function() {
                  this.disabled = !1;
                })
                .end()
                .filter('img')
                .css({ opacity: '1.0', cursor: '' }))
            : ('div' !== t && 'span' !== t) ||
              ((i = s.children('.' + this._inlineClass))
                .children()
                .removeClass('ui-state-disabled'),
              i
                .find('select.ui-datepicker-month, select.ui-datepicker-year')
                .prop('disabled', !1)),
          (this._disabledInputs = x.map(this._disabledInputs, function(t) {
            return t === e ? null : t;
          })));
      },
      _disableDatepicker: function(e) {
        var t,
          i,
          s = x(e),
          n = x.data(e, 'datepicker');
        s.hasClass(this.markerClassName) &&
          ('input' === (t = e.nodeName.toLowerCase())
            ? ((e.disabled = !0),
              n.trigger
                .filter('button')
                .each(function() {
                  this.disabled = !0;
                })
                .end()
                .filter('img')
                .css({ opacity: '0.5', cursor: 'default' }))
            : ('div' !== t && 'span' !== t) ||
              ((i = s.children('.' + this._inlineClass))
                .children()
                .addClass('ui-state-disabled'),
              i
                .find('select.ui-datepicker-month, select.ui-datepicker-year')
                .prop('disabled', !0)),
          (this._disabledInputs = x.map(this._disabledInputs, function(t) {
            return t === e ? null : t;
          })),
          (this._disabledInputs[this._disabledInputs.length] = e));
      },
      _isDisabledDatepicker: function(t) {
        if (!t) return !1;
        for (var e = 0; e < this._disabledInputs.length; e++)
          if (this._disabledInputs[e] === t) return !0;
        return !1;
      },
      _getInst: function(t) {
        try {
          return x.data(t, 'datepicker');
        } catch (t) {
          throw 'Missing instance data for this datepicker';
        }
      },
      _optionDatepicker: function(t, e, i) {
        var s,
          n,
          o,
          a,
          r = this._getInst(t);
        if (2 === arguments.length && 'string' == typeof e)
          return 'defaults' === e
            ? x.extend({}, x.datepicker._defaults)
            : r
            ? 'all' === e
              ? x.extend({}, r.settings)
              : this._get(r, e)
            : null;
        (s = e || {}),
          'string' == typeof e && ((s = {})[e] = i),
          r &&
            (this._curInst === r && this._hideDatepicker(),
            (n = this._getDateDatepicker(t, !0)),
            (o = this._getMinMaxDate(r, 'min')),
            (a = this._getMinMaxDate(r, 'max')),
            w(r.settings, s),
            null !== o &&
              void 0 !== s.dateFormat &&
              void 0 === s.minDate &&
              (r.settings.minDate = this._formatDate(r, o)),
            null !== a &&
              void 0 !== s.dateFormat &&
              void 0 === s.maxDate &&
              (r.settings.maxDate = this._formatDate(r, a)),
            'disabled' in s &&
              (s.disabled
                ? this._disableDatepicker(t)
                : this._enableDatepicker(t)),
            this._attachments(x(t), r),
            this._autoSize(r),
            this._setDate(r, n),
            this._updateAlternate(r),
            this._updateDatepicker(r));
      },
      _changeDatepicker: function(t, e, i) {
        this._optionDatepicker(t, e, i);
      },
      _refreshDatepicker: function(t) {
        var e = this._getInst(t);
        e && this._updateDatepicker(e);
      },
      _setDateDatepicker: function(t, e) {
        var i = this._getInst(t);
        i &&
          (this._setDate(i, e),
          this._updateDatepicker(i),
          this._updateAlternate(i));
      },
      _getDateDatepicker: function(t, e) {
        var i = this._getInst(t);
        return (
          i && !i.inline && this._setDateFromField(i, e),
          i ? this._getDate(i) : null
        );
      },
      _doKeyDown: function(t) {
        var e,
          i,
          s,
          n = x.datepicker._getInst(t.target),
          o = !0,
          a = n.dpDiv.is('.ui-datepicker-rtl');
        if (((n._keyEvent = !0), x.datepicker._datepickerShowing))
          switch (t.keyCode) {
            case 9:
              x.datepicker._hideDatepicker(), (o = !1);
              break;
            case 13:
              return (
                (s = x(
                  'td.' +
                    x.datepicker._dayOverClass +
                    ':not(.' +
                    x.datepicker._currentClass +
                    ')',
                  n.dpDiv
                ))[0] &&
                  x.datepicker._selectDay(
                    t.target,
                    n.selectedMonth,
                    n.selectedYear,
                    s[0]
                  ),
                (e = x.datepicker._get(n, 'onSelect'))
                  ? ((i = x.datepicker._formatDate(n)),
                    e.apply(n.input ? n.input[0] : null, [i, n]))
                  : x.datepicker._hideDatepicker(),
                !1
              );
            case 27:
              x.datepicker._hideDatepicker();
              break;
            case 33:
              x.datepicker._adjustDate(
                t.target,
                t.ctrlKey
                  ? -x.datepicker._get(n, 'stepBigMonths')
                  : -x.datepicker._get(n, 'stepMonths'),
                'M'
              );
              break;
            case 34:
              x.datepicker._adjustDate(
                t.target,
                t.ctrlKey
                  ? +x.datepicker._get(n, 'stepBigMonths')
                  : +x.datepicker._get(n, 'stepMonths'),
                'M'
              );
              break;
            case 35:
              (t.ctrlKey || t.metaKey) && x.datepicker._clearDate(t.target),
                (o = t.ctrlKey || t.metaKey);
              break;
            case 36:
              (t.ctrlKey || t.metaKey) && x.datepicker._gotoToday(t.target),
                (o = t.ctrlKey || t.metaKey);
              break;
            case 37:
              (t.ctrlKey || t.metaKey) &&
                x.datepicker._adjustDate(t.target, a ? 1 : -1, 'D'),
                (o = t.ctrlKey || t.metaKey),
                t.originalEvent.altKey &&
                  x.datepicker._adjustDate(
                    t.target,
                    t.ctrlKey
                      ? -x.datepicker._get(n, 'stepBigMonths')
                      : -x.datepicker._get(n, 'stepMonths'),
                    'M'
                  );
              break;
            case 38:
              (t.ctrlKey || t.metaKey) &&
                x.datepicker._adjustDate(t.target, -7, 'D'),
                (o = t.ctrlKey || t.metaKey);
              break;
            case 39:
              (t.ctrlKey || t.metaKey) &&
                x.datepicker._adjustDate(t.target, a ? -1 : 1, 'D'),
                (o = t.ctrlKey || t.metaKey),
                t.originalEvent.altKey &&
                  x.datepicker._adjustDate(
                    t.target,
                    t.ctrlKey
                      ? +x.datepicker._get(n, 'stepBigMonths')
                      : +x.datepicker._get(n, 'stepMonths'),
                    'M'
                  );
              break;
            case 40:
              (t.ctrlKey || t.metaKey) &&
                x.datepicker._adjustDate(t.target, 7, 'D'),
                (o = t.ctrlKey || t.metaKey);
              break;
            default:
              o = !1;
          }
        else
          36 === t.keyCode && t.ctrlKey
            ? x.datepicker._showDatepicker(this)
            : (o = !1);
        o && (t.preventDefault(), t.stopPropagation());
      },
      _doKeyPress: function(t) {
        var e,
          i,
          s = x.datepicker._getInst(t.target);
        if (x.datepicker._get(s, 'constrainInput'))
          return (
            (e = x.datepicker._possibleChars(
              x.datepicker._get(s, 'dateFormat')
            )),
            (i = String.fromCharCode(
              null == t.charCode ? t.keyCode : t.charCode
            )),
            t.ctrlKey || t.metaKey || i < ' ' || !e || -1 < e.indexOf(i)
          );
      },
      _doKeyUp: function(t) {
        var e = x.datepicker._getInst(t.target);
        if (e.input.val() !== e.lastVal)
          try {
            x.datepicker.parseDate(
              x.datepicker._get(e, 'dateFormat'),
              e.input ? e.input.val() : null,
              x.datepicker._getFormatConfig(e)
            ) &&
              (x.datepicker._setDateFromField(e),
              x.datepicker._updateAlternate(e),
              x.datepicker._updateDatepicker(e));
          } catch (t) {}
        return !0;
      },
      _showDatepicker: function(t) {
        var e, i, s, n, o, a, r;
        'input' !== (t = t.target || t).nodeName.toLowerCase() &&
          (t = x('input', t.parentNode)[0]),
          x.datepicker._isDisabledDatepicker(t) ||
            x.datepicker._lastInput === t ||
            ((e = x.datepicker._getInst(t)),
            x.datepicker._curInst &&
              x.datepicker._curInst !== e &&
              (x.datepicker._curInst.dpDiv.stop(!0, !0),
              e &&
                x.datepicker._datepickerShowing &&
                x.datepicker._hideDatepicker(x.datepicker._curInst.input[0])),
            !1 !==
              (s = (i = x.datepicker._get(e, 'beforeShow'))
                ? i.apply(t, [t, e])
                : {}) &&
              (w(e.settings, s),
              (e.lastVal = null),
              (x.datepicker._lastInput = t),
              x.datepicker._setDateFromField(e),
              x.datepicker._inDialog && (t.value = ''),
              x.datepicker._pos ||
                ((x.datepicker._pos = x.datepicker._findPos(t)),
                (x.datepicker._pos[1] += t.offsetHeight)),
              (n = !1),
              x(t)
                .parents()
                .each(function() {
                  return !(n |= 'fixed' === x(this).css('position'));
                }),
              (o = { left: x.datepicker._pos[0], top: x.datepicker._pos[1] }),
              (x.datepicker._pos = null),
              e.dpDiv.empty(),
              e.dpDiv.css({
                position: 'absolute',
                display: 'block',
                top: '-1000px'
              }),
              x.datepicker._updateDatepicker(e),
              (o = x.datepicker._checkOffset(e, o, n)),
              e.dpDiv.css({
                position:
                  x.datepicker._inDialog && x.blockUI
                    ? 'static'
                    : n
                    ? 'fixed'
                    : 'absolute',
                display: 'none',
                left: o.left + 'px',
                top: o.top + 'px'
              }),
              e.inline ||
                ((a = x.datepicker._get(e, 'showAnim')),
                (r = x.datepicker._get(e, 'duration')),
                e.dpDiv.css(
                  'z-index',
                  (function(t) {
                    for (var e, i; t.length && t[0] !== document; ) {
                      if (
                        ('absolute' === (e = t.css('position')) ||
                          'relative' === e ||
                          'fixed' === e) &&
                        ((i = parseInt(t.css('zIndex'), 10)),
                        !isNaN(i) && 0 !== i)
                      )
                        return i;
                      t = t.parent();
                    }
                    return 0;
                  })(x(t)) + 1
                ),
                (x.datepicker._datepickerShowing = !0),
                x.effects && x.effects.effect[a]
                  ? e.dpDiv.show(a, x.datepicker._get(e, 'showOptions'), r)
                  : e.dpDiv[a || 'show'](a ? r : null),
                x.datepicker._shouldFocusInput(e) && e.input.trigger('focus'),
                (x.datepicker._curInst = e))));
      },
      _updateDatepicker: function(t) {
        (this.maxRows = 4),
          (_ = t).dpDiv.empty().append(this._generateHTML(t)),
          this._attachHandlers(t);
        var e,
          i = this._getNumberOfMonths(t),
          s = i[1],
          n = t.dpDiv.find('.' + this._dayOverClass + ' a');
        0 < n.length && y.apply(n.get(0)),
          t.dpDiv
            .removeClass(
              'ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4'
            )
            .width(''),
          1 < s &&
            t.dpDiv
              .addClass('ui-datepicker-multi-' + s)
              .css('width', 17 * s + 'em'),
          t.dpDiv[(1 !== i[0] || 1 !== i[1] ? 'add' : 'remove') + 'Class'](
            'ui-datepicker-multi'
          ),
          t.dpDiv[(this._get(t, 'isRTL') ? 'add' : 'remove') + 'Class'](
            'ui-datepicker-rtl'
          ),
          t === x.datepicker._curInst &&
            x.datepicker._datepickerShowing &&
            x.datepicker._shouldFocusInput(t) &&
            t.input.trigger('focus'),
          t.yearshtml &&
            ((e = t.yearshtml),
            setTimeout(function() {
              e === t.yearshtml &&
                t.yearshtml &&
                t.dpDiv
                  .find('select.ui-datepicker-year:first')
                  .replaceWith(t.yearshtml),
                (e = t.yearshtml = null);
            }, 0));
      },
      _shouldFocusInput: function(t) {
        return (
          t.input &&
          t.input.is(':visible') &&
          !t.input.is(':disabled') &&
          !t.input.is(':focus')
        );
      },
      _checkOffset: function(t, e, i) {
        var s = t.dpDiv.outerWidth(),
          n = t.dpDiv.outerHeight(),
          o = t.input ? t.input.outerWidth() : 0,
          a = t.input ? t.input.outerHeight() : 0,
          r =
            document.documentElement.clientWidth +
            (i ? 0 : x(document).scrollLeft()),
          h =
            document.documentElement.clientHeight +
            (i ? 0 : x(document).scrollTop());
        return (
          (e.left -= this._get(t, 'isRTL') ? s - o : 0),
          (e.left -=
            i && e.left === t.input.offset().left
              ? x(document).scrollLeft()
              : 0),
          (e.top -=
            i && e.top === t.input.offset().top + a
              ? x(document).scrollTop()
              : 0),
          (e.left -= Math.min(
            e.left,
            e.left + s > r && s < r ? Math.abs(e.left + s - r) : 0
          )),
          (e.top -= Math.min(
            e.top,
            e.top + n > h && n < h ? Math.abs(n + a) : 0
          )),
          e
        );
      },
      _findPos: function(t) {
        for (
          var e, i = this._getInst(t), s = this._get(i, 'isRTL');
          t &&
          ('hidden' === t.type || 1 !== t.nodeType || x.expr.filters.hidden(t));

        )
          t = t[s ? 'previousSibling' : 'nextSibling'];
        return [(e = x(t).offset()).left, e.top];
      },
      _hideDatepicker: function(t) {
        var e,
          i,
          s,
          n,
          o = this._curInst;
        !o ||
          (t && o !== x.data(t, 'datepicker')) ||
          (this._datepickerShowing &&
            ((e = this._get(o, 'showAnim')),
            (i = this._get(o, 'duration')),
            (s = function() {
              x.datepicker._tidyDialog(o);
            }),
            x.effects && (x.effects.effect[e] || x.effects[e])
              ? o.dpDiv.hide(e, x.datepicker._get(o, 'showOptions'), i, s)
              : o.dpDiv[
                  'slideDown' === e
                    ? 'slideUp'
                    : 'fadeIn' === e
                    ? 'fadeOut'
                    : 'hide'
                ](e ? i : null, s),
            e || s(),
            (this._datepickerShowing = !1),
            (n = this._get(o, 'onClose')) &&
              n.apply(o.input ? o.input[0] : null, [
                o.input ? o.input.val() : '',
                o
              ]),
            (this._lastInput = null),
            this._inDialog &&
              (this._dialogInput.css({
                position: 'absolute',
                left: '0',
                top: '-100px'
              }),
              x.blockUI && (x.unblockUI(), x('body').append(this.dpDiv))),
            (this._inDialog = !1)));
      },
      _tidyDialog: function(t) {
        t.dpDiv.removeClass(this._dialogClass).off('.ui-datepicker-calendar');
      },
      _checkExternalClick: function(t) {
        if (x.datepicker._curInst) {
          var e = x(t.target),
            i = x.datepicker._getInst(e[0]);
          ((e[0].id === x.datepicker._mainDivId ||
            0 !== e.parents('#' + x.datepicker._mainDivId).length ||
            e.hasClass(x.datepicker.markerClassName) ||
            e.closest('.' + x.datepicker._triggerClass).length ||
            !x.datepicker._datepickerShowing ||
            (x.datepicker._inDialog && x.blockUI)) &&
            (!e.hasClass(x.datepicker.markerClassName) ||
              x.datepicker._curInst === i)) ||
            x.datepicker._hideDatepicker();
        }
      },
      _adjustDate: function(t, e, i) {
        var s = x(t),
          n = this._getInst(s[0]);
        this._isDisabledDatepicker(s[0]) ||
          (this._adjustInstDate(
            n,
            e + ('M' === i ? this._get(n, 'showCurrentAtPos') : 0),
            i
          ),
          this._updateDatepicker(n));
      },
      _gotoToday: function(t) {
        var e,
          i = x(t),
          s = this._getInst(i[0]);
        this._get(s, 'gotoCurrent') && s.currentDay
          ? ((s.selectedDay = s.currentDay),
            (s.drawMonth = s.selectedMonth = s.currentMonth),
            (s.drawYear = s.selectedYear = s.currentYear))
          : ((e = new Date()),
            (s.selectedDay = e.getDate()),
            (s.drawMonth = s.selectedMonth = e.getMonth()),
            (s.drawYear = s.selectedYear = e.getFullYear())),
          this._notifyChange(s),
          this._adjustDate(i);
      },
      _selectMonthYear: function(t, e, i) {
        var s = x(t),
          n = this._getInst(s[0]);
        (n['selected' + ('M' === i ? 'Month' : 'Year')] = n[
          'draw' + ('M' === i ? 'Month' : 'Year')
        ] = parseInt(e.options[e.selectedIndex].value, 10)),
          this._notifyChange(n),
          this._adjustDate(s);
      },
      _selectDay: function(t, e, i, s) {
        var n,
          o = x(t);
        x(s).hasClass(this._unselectableClass) ||
          this._isDisabledDatepicker(o[0]) ||
          (((n = this._getInst(o[0])).selectedDay = n.currentDay = x(
            'a',
            s
          ).html()),
          (n.selectedMonth = n.currentMonth = e),
          (n.selectedYear = n.currentYear = i),
          this._selectDate(
            t,
            this._formatDate(n, n.currentDay, n.currentMonth, n.currentYear)
          ));
      },
      _clearDate: function(t) {
        var e = x(t);
        this._selectDate(e, '');
      },
      _selectDate: function(t, e) {
        var i,
          s = x(t),
          n = this._getInst(s[0]);
        (e = null != e ? e : this._formatDate(n)),
          n.input && n.input.val(e),
          this._updateAlternate(n),
          (i = this._get(n, 'onSelect'))
            ? i.apply(n.input ? n.input[0] : null, [e, n])
            : n.input && n.input.trigger('change'),
          n.inline
            ? this._updateDatepicker(n)
            : (this._hideDatepicker(),
              (this._lastInput = n.input[0]),
              'object' != typeof n.input[0] && n.input.trigger('focus'),
              (this._lastInput = null));
      },
      _updateAlternate: function(t) {
        var e,
          i,
          s,
          n = this._get(t, 'altField');
        n &&
          ((e = this._get(t, 'altFormat') || this._get(t, 'dateFormat')),
          (i = this._getDate(t)),
          (s = this.formatDate(e, i, this._getFormatConfig(t))),
          x(n).val(s));
      },
      noWeekends: function(t) {
        var e = t.getDay();
        return [0 < e && e < 6, ''];
      },
      iso8601Week: function(t) {
        var e,
          i = new Date(t.getTime());
        return (
          i.setDate(i.getDate() + 4 - (i.getDay() || 7)),
          (e = i.getTime()),
          i.setMonth(0),
          i.setDate(1),
          Math.floor(Math.round((e - i) / 864e5) / 7) + 1
        );
      },
      parseDate: function(i, o, t) {
        if (null == i || null == o) throw 'Invalid arguments';
        if ('' === (o = 'object' == typeof o ? o.toString() : o + ''))
          return null;
        function a(t) {
          var e = r + 1 < i.length && i.charAt(r + 1) === t;
          return e && r++, e;
        }
        function e(t) {
          var e = a(t),
            i =
              '@' === t
                ? 14
                : '!' === t
                ? 20
                : 'y' === t && e
                ? 4
                : 'o' === t
                ? 3
                : 2,
            s = new RegExp('^\\d{' + ('y' === t ? i : 1) + ',' + i + '}'),
            n = o.substring(u).match(s);
          if (!n) throw 'Missing number at position ' + u;
          return (u += n[0].length), parseInt(n[0], 10);
        }
        function s(t, e, i) {
          var s = -1,
            n = x
              .map(a(t) ? i : e, function(t, e) {
                return [[e, t]];
              })
              .sort(function(t, e) {
                return -(t[1].length - e[1].length);
              });
          if (
            (x.each(n, function(t, e) {
              var i = e[1];
              if (o.substr(u, i.length).toLowerCase() === i.toLowerCase())
                return (s = e[0]), (u += i.length), !1;
            }),
            -1 !== s)
          )
            return s + 1;
          throw 'Unknown name at position ' + u;
        }
        function n() {
          if (o.charAt(u) !== i.charAt(r))
            throw 'Unexpected literal at position ' + u;
          u++;
        }
        var r,
          h,
          l,
          c,
          u = 0,
          d = (t ? t.shortYearCutoff : null) || this._defaults.shortYearCutoff,
          p =
            'string' != typeof d
              ? d
              : (new Date().getFullYear() % 100) + parseInt(d, 10),
          f = (t ? t.dayNamesShort : null) || this._defaults.dayNamesShort,
          g = (t ? t.dayNames : null) || this._defaults.dayNames,
          m = (t ? t.monthNamesShort : null) || this._defaults.monthNamesShort,
          _ = (t ? t.monthNames : null) || this._defaults.monthNames,
          v = -1,
          b = -1,
          y = -1,
          w = -1,
          k = !1;
        for (r = 0; r < i.length; r++)
          if (k) "'" !== i.charAt(r) || a("'") ? n() : (k = !1);
          else
            switch (i.charAt(r)) {
              case 'd':
                y = e('d');
                break;
              case 'D':
                s('D', f, g);
                break;
              case 'o':
                w = e('o');
                break;
              case 'm':
                b = e('m');
                break;
              case 'M':
                b = s('M', m, _);
                break;
              case 'y':
                v = e('y');
                break;
              case '@':
                (v = (c = new Date(e('@'))).getFullYear()),
                  (b = c.getMonth() + 1),
                  (y = c.getDate());
                break;
              case '!':
                (v = (c = new Date(
                  (e('!') - this._ticksTo1970) / 1e4
                )).getFullYear()),
                  (b = c.getMonth() + 1),
                  (y = c.getDate());
                break;
              case "'":
                a("'") ? n() : (k = !0);
                break;
              default:
                n();
            }
        if (u < o.length && ((l = o.substr(u)), !/^\s+/.test(l)))
          throw 'Extra/unparsed characters found in date: ' + l;
        if (
          (-1 === v
            ? (v = new Date().getFullYear())
            : v < 100 &&
              (v +=
                new Date().getFullYear() -
                (new Date().getFullYear() % 100) +
                (v <= p ? 0 : -100)),
          -1 < w)
        )
          for (b = 1, y = w; ; ) {
            if (y <= (h = this._getDaysInMonth(v, b - 1))) break;
            b++, (y -= h);
          }
        if (
          (c = this._daylightSavingAdjust(
            new Date(v, b - 1, y)
          )).getFullYear() !== v ||
          c.getMonth() + 1 !== b ||
          c.getDate() !== y
        )
          throw 'Invalid date';
        return c;
      },
      ATOM: 'yy-mm-dd',
      COOKIE: 'D, dd M yy',
      ISO_8601: 'yy-mm-dd',
      RFC_822: 'D, d M y',
      RFC_850: 'DD, dd-M-y',
      RFC_1036: 'D, d M y',
      RFC_1123: 'D, d M yy',
      RFC_2822: 'D, d M yy',
      RSS: 'D, d M y',
      TICKS: '!',
      TIMESTAMP: '@',
      W3C: 'yy-mm-dd',
      _ticksTo1970:
        24 *
        (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) *
        60 *
        60 *
        1e7,
      formatDate: function(i, t, e) {
        if (!t) return '';
        function n(t) {
          var e = a + 1 < i.length && i.charAt(a + 1) === t;
          return e && a++, e;
        }
        function s(t, e, i) {
          var s = '' + e;
          if (n(t)) for (; s.length < i; ) s = '0' + s;
          return s;
        }
        function o(t, e, i, s) {
          return n(t) ? s[e] : i[e];
        }
        var a,
          r = (e ? e.dayNamesShort : null) || this._defaults.dayNamesShort,
          h = (e ? e.dayNames : null) || this._defaults.dayNames,
          l = (e ? e.monthNamesShort : null) || this._defaults.monthNamesShort,
          c = (e ? e.monthNames : null) || this._defaults.monthNames,
          u = '',
          d = !1;
        if (t)
          for (a = 0; a < i.length; a++)
            if (d)
              "'" !== i.charAt(a) || n("'") ? (u += i.charAt(a)) : (d = !1);
            else
              switch (i.charAt(a)) {
                case 'd':
                  u += s('d', t.getDate(), 2);
                  break;
                case 'D':
                  u += o('D', t.getDay(), r, h);
                  break;
                case 'o':
                  u += s(
                    'o',
                    Math.round(
                      (new Date(
                        t.getFullYear(),
                        t.getMonth(),
                        t.getDate()
                      ).getTime() -
                        new Date(t.getFullYear(), 0, 0).getTime()) /
                        864e5
                    ),
                    3
                  );
                  break;
                case 'm':
                  u += s('m', t.getMonth() + 1, 2);
                  break;
                case 'M':
                  u += o('M', t.getMonth(), l, c);
                  break;
                case 'y':
                  u += n('y')
                    ? t.getFullYear()
                    : (t.getFullYear() % 100 < 10 ? '0' : '') +
                      (t.getFullYear() % 100);
                  break;
                case '@':
                  u += t.getTime();
                  break;
                case '!':
                  u += 1e4 * t.getTime() + this._ticksTo1970;
                  break;
                case "'":
                  n("'") ? (u += "'") : (d = !0);
                  break;
                default:
                  u += i.charAt(a);
              }
        return u;
      },
      _possibleChars: function(i) {
        function t(t) {
          var e = s + 1 < i.length && i.charAt(s + 1) === t;
          return e && s++, e;
        }
        var s,
          e = '',
          n = !1;
        for (s = 0; s < i.length; s++)
          if (n) "'" !== i.charAt(s) || t("'") ? (e += i.charAt(s)) : (n = !1);
          else
            switch (i.charAt(s)) {
              case 'd':
              case 'm':
              case 'y':
              case '@':
                e += '0123456789';
                break;
              case 'D':
              case 'M':
                return null;
              case "'":
                t("'") ? (e += "'") : (n = !0);
                break;
              default:
                e += i.charAt(s);
            }
        return e;
      },
      _get: function(t, e) {
        return void 0 !== t.settings[e] ? t.settings[e] : this._defaults[e];
      },
      _setDateFromField: function(t, e) {
        if (t.input.val() !== t.lastVal) {
          var i = this._get(t, 'dateFormat'),
            s = (t.lastVal = t.input ? t.input.val() : null),
            n = this._getDefaultDate(t),
            o = n,
            a = this._getFormatConfig(t);
          try {
            o = this.parseDate(i, s, a) || n;
          } catch (t) {
            s = e ? '' : s;
          }
          (t.selectedDay = o.getDate()),
            (t.drawMonth = t.selectedMonth = o.getMonth()),
            (t.drawYear = t.selectedYear = o.getFullYear()),
            (t.currentDay = s ? o.getDate() : 0),
            (t.currentMonth = s ? o.getMonth() : 0),
            (t.currentYear = s ? o.getFullYear() : 0),
            this._adjustInstDate(t);
        }
      },
      _getDefaultDate: function(t) {
        return this._restrictMinMax(
          t,
          this._determineDate(t, this._get(t, 'defaultDate'), new Date())
        );
      },
      _determineDate: function(r, t, e) {
        var i,
          s,
          n =
            null == t || '' === t
              ? e
              : 'string' == typeof t
              ? (function(t) {
                  try {
                    return x.datepicker.parseDate(
                      x.datepicker._get(r, 'dateFormat'),
                      t,
                      x.datepicker._getFormatConfig(r)
                    );
                  } catch (t) {}
                  for (
                    var e =
                        (t.toLowerCase().match(/^c/)
                          ? x.datepicker._getDate(r)
                          : null) || new Date(),
                      i = e.getFullYear(),
                      s = e.getMonth(),
                      n = e.getDate(),
                      o = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
                      a = o.exec(t);
                    a;

                  ) {
                    switch (a[2] || 'd') {
                      case 'd':
                      case 'D':
                        n += parseInt(a[1], 10);
                        break;
                      case 'w':
                      case 'W':
                        n += 7 * parseInt(a[1], 10);
                        break;
                      case 'm':
                      case 'M':
                        (s += parseInt(a[1], 10)),
                          (n = Math.min(n, x.datepicker._getDaysInMonth(i, s)));
                        break;
                      case 'y':
                      case 'Y':
                        (i += parseInt(a[1], 10)),
                          (n = Math.min(n, x.datepicker._getDaysInMonth(i, s)));
                    }
                    a = o.exec(t);
                  }
                  return new Date(i, s, n);
                })(t)
              : 'number' == typeof t
              ? isNaN(t)
                ? e
                : ((i = t), (s = new Date()).setDate(s.getDate() + i), s)
              : new Date(t.getTime());
        return (
          (n = n && 'Invalid Date' === n.toString() ? e : n) &&
            (n.setHours(0),
            n.setMinutes(0),
            n.setSeconds(0),
            n.setMilliseconds(0)),
          this._daylightSavingAdjust(n)
        );
      },
      _daylightSavingAdjust: function(t) {
        return t
          ? (t.setHours(12 < t.getHours() ? t.getHours() + 2 : 0), t)
          : null;
      },
      _setDate: function(t, e, i) {
        var s = !e,
          n = t.selectedMonth,
          o = t.selectedYear,
          a = this._restrictMinMax(t, this._determineDate(t, e, new Date()));
        (t.selectedDay = t.currentDay = a.getDate()),
          (t.drawMonth = t.selectedMonth = t.currentMonth = a.getMonth()),
          (t.drawYear = t.selectedYear = t.currentYear = a.getFullYear()),
          (n === t.selectedMonth && o === t.selectedYear) ||
            i ||
            this._notifyChange(t),
          this._adjustInstDate(t),
          t.input && t.input.val(s ? '' : this._formatDate(t));
      },
      _getDate: function(t) {
        return !t.currentYear || (t.input && '' === t.input.val())
          ? null
          : this._daylightSavingAdjust(
              new Date(t.currentYear, t.currentMonth, t.currentDay)
            );
      },
      _attachHandlers: function(t) {
        var e = this._get(t, 'stepMonths'),
          i = '#' + t.id.replace(/\\\\/g, '\\');
        t.dpDiv.find('[data-handler]').map(function() {
          var t = {
            prev: function() {
              x.datepicker._adjustDate(i, -e, 'M');
            },
            next: function() {
              x.datepicker._adjustDate(i, +e, 'M');
            },
            hide: function() {
              x.datepicker._hideDatepicker();
            },
            today: function() {
              x.datepicker._gotoToday(i);
            },
            selectDay: function() {
              return (
                x.datepicker._selectDay(
                  i,
                  +this.getAttribute('data-month'),
                  +this.getAttribute('data-year'),
                  this
                ),
                !1
              );
            },
            selectMonth: function() {
              return x.datepicker._selectMonthYear(i, this, 'M'), !1;
            },
            selectYear: function() {
              return x.datepicker._selectMonthYear(i, this, 'Y'), !1;
            }
          };
          x(this).on(
            this.getAttribute('data-event'),
            t[this.getAttribute('data-handler')]
          );
        });
      },
      _generateHTML: function(t) {
        var e,
          i,
          s,
          n,
          o,
          a,
          r,
          h,
          l,
          c,
          u,
          d,
          p,
          f,
          g,
          m,
          _,
          v,
          b,
          y,
          w,
          k,
          x,
          C,
          D,
          I,
          T,
          P,
          M,
          S,
          H,
          z,
          O,
          A,
          N,
          W,
          E,
          F,
          L,
          R = new Date(),
          B = this._daylightSavingAdjust(
            new Date(R.getFullYear(), R.getMonth(), R.getDate())
          ),
          Y = this._get(t, 'isRTL'),
          j = this._get(t, 'showButtonPanel'),
          q = this._get(t, 'hideIfNoPrevNext'),
          K = this._get(t, 'navigationAsDateFormat'),
          U = this._getNumberOfMonths(t),
          V = this._get(t, 'showCurrentAtPos'),
          $ = this._get(t, 'stepMonths'),
          X = 1 !== U[0] || 1 !== U[1],
          G = this._daylightSavingAdjust(
            t.currentDay
              ? new Date(t.currentYear, t.currentMonth, t.currentDay)
              : new Date(9999, 9, 9)
          ),
          Q = this._getMinMaxDate(t, 'min'),
          J = this._getMinMaxDate(t, 'max'),
          Z = t.drawMonth - V,
          tt = t.drawYear;
        if ((Z < 0 && ((Z += 12), tt--), J))
          for (
            e = this._daylightSavingAdjust(
              new Date(
                J.getFullYear(),
                J.getMonth() - U[0] * U[1] + 1,
                J.getDate()
              )
            ),
              e = Q && e < Q ? Q : e;
            this._daylightSavingAdjust(new Date(tt, Z, 1)) > e;

          )
            --Z < 0 && ((Z = 11), tt--);
        for (
          t.drawMonth = Z,
            t.drawYear = tt,
            i = this._get(t, 'prevText'),
            i = K
              ? this.formatDate(
                  i,
                  this._daylightSavingAdjust(new Date(tt, Z - $, 1)),
                  this._getFormatConfig(t)
                )
              : i,
            s = this._canAdjustMonth(t, -1, tt, Z)
              ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" +
                i +
                "'><span class='ui-icon ui-icon-circle-triangle-" +
                (Y ? 'e' : 'w') +
                "'>" +
                i +
                '</span></a>'
              : q
              ? ''
              : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" +
                i +
                "'><span class='ui-icon ui-icon-circle-triangle-" +
                (Y ? 'e' : 'w') +
                "'>" +
                i +
                '</span></a>',
            n = this._get(t, 'nextText'),
            n = K
              ? this.formatDate(
                  n,
                  this._daylightSavingAdjust(new Date(tt, Z + $, 1)),
                  this._getFormatConfig(t)
                )
              : n,
            o = this._canAdjustMonth(t, 1, tt, Z)
              ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" +
                n +
                "'><span class='ui-icon ui-icon-circle-triangle-" +
                (Y ? 'w' : 'e') +
                "'>" +
                n +
                '</span></a>'
              : q
              ? ''
              : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" +
                n +
                "'><span class='ui-icon ui-icon-circle-triangle-" +
                (Y ? 'w' : 'e') +
                "'>" +
                n +
                '</span></a>',
            a = this._get(t, 'currentText'),
            r = this._get(t, 'gotoCurrent') && t.currentDay ? G : B,
            a = K ? this.formatDate(a, r, this._getFormatConfig(t)) : a,
            h = t.inline
              ? ''
              : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
                this._get(t, 'closeText') +
                '</button>',
            l = j
              ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" +
                (Y ? h : '') +
                (this._isInRange(t, r)
                  ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" +
                    a +
                    '</button>'
                  : '') +
                (Y ? '' : h) +
                '</div>'
              : '',
            c = parseInt(this._get(t, 'firstDay'), 10),
            c = isNaN(c) ? 0 : c,
            u = this._get(t, 'showWeek'),
            d = this._get(t, 'dayNames'),
            p = this._get(t, 'dayNamesMin'),
            f = this._get(t, 'monthNames'),
            g = this._get(t, 'monthNamesShort'),
            m = this._get(t, 'beforeShowDay'),
            _ = this._get(t, 'showOtherMonths'),
            v = this._get(t, 'selectOtherMonths'),
            b = this._getDefaultDate(t),
            y = '',
            k = 0;
          k < U[0];
          k++
        ) {
          for (x = '', this.maxRows = 4, C = 0; C < U[1]; C++) {
            if (
              ((D = this._daylightSavingAdjust(new Date(tt, Z, t.selectedDay))),
              (I = ' ui-corner-all'),
              (T = ''),
              X)
            ) {
              if (((T += "<div class='ui-datepicker-group"), 1 < U[1]))
                switch (C) {
                  case 0:
                    (T += ' ui-datepicker-group-first'),
                      (I = ' ui-corner-' + (Y ? 'right' : 'left'));
                    break;
                  case U[1] - 1:
                    (T += ' ui-datepicker-group-last'),
                      (I = ' ui-corner-' + (Y ? 'left' : 'right'));
                    break;
                  default:
                    (T += ' ui-datepicker-group-middle'), (I = '');
                }
              T += "'>";
            }
            for (
              T +=
                "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" +
                I +
                "'>" +
                (/all|left/.test(I) && 0 === k ? (Y ? o : s) : '') +
                (/all|right/.test(I) && 0 === k ? (Y ? s : o) : '') +
                this._generateMonthYearHeader(
                  t,
                  Z,
                  tt,
                  Q,
                  J,
                  0 < k || 0 < C,
                  f,
                  g
                ) +
                "</div><table class='ui-datepicker-calendar'><thead><tr>",
                P = u
                  ? "<th class='ui-datepicker-week-col'>" +
                    this._get(t, 'weekHeader') +
                    '</th>'
                  : '',
                w = 0;
              w < 7;
              w++
            )
              P +=
                "<th scope='col'" +
                (5 <= (w + c + 6) % 7
                  ? " class='ui-datepicker-week-end'"
                  : '') +
                "><span title='" +
                d[(M = (w + c) % 7)] +
                "'>" +
                p[M] +
                '</span></th>';
            for (
              T += P + '</tr></thead><tbody>',
                S = this._getDaysInMonth(tt, Z),
                tt === t.selectedYear &&
                  Z === t.selectedMonth &&
                  (t.selectedDay = Math.min(t.selectedDay, S)),
                H = (this._getFirstDayOfMonth(tt, Z) - c + 7) % 7,
                z = Math.ceil((H + S) / 7),
                O = X && this.maxRows > z ? this.maxRows : z,
                this.maxRows = O,
                A = this._daylightSavingAdjust(new Date(tt, Z, 1 - H)),
                N = 0;
              N < O;
              N++
            ) {
              for (
                T += '<tr>',
                  W = u
                    ? "<td class='ui-datepicker-week-col'>" +
                      this._get(t, 'calculateWeek')(A) +
                      '</td>'
                    : '',
                  w = 0;
                w < 7;
                w++
              )
                (E = m ? m.apply(t.input ? t.input[0] : null, [A]) : [!0, '']),
                  (L =
                    ((F = A.getMonth() !== Z) && !v) ||
                    !E[0] ||
                    (Q && A < Q) ||
                    (J && J < A)),
                  (W +=
                    "<td class='" +
                    (5 <= (w + c + 6) % 7 ? ' ui-datepicker-week-end' : '') +
                    (F ? ' ui-datepicker-other-month' : '') +
                    ((A.getTime() === D.getTime() &&
                      Z === t.selectedMonth &&
                      t._keyEvent) ||
                    (b.getTime() === A.getTime() && b.getTime() === D.getTime())
                      ? ' ' + this._dayOverClass
                      : '') +
                    (L
                      ? ' ' + this._unselectableClass + ' ui-state-disabled'
                      : '') +
                    (F && !_
                      ? ''
                      : ' ' +
                        E[1] +
                        (A.getTime() === G.getTime()
                          ? ' ' + this._currentClass
                          : '') +
                        (A.getTime() === B.getTime()
                          ? ' ui-datepicker-today'
                          : '')) +
                    "'" +
                    ((F && !_) || !E[2]
                      ? ''
                      : " title='" + E[2].replace(/'/g, '&#39;') + "'") +
                    (L
                      ? ''
                      : " data-handler='selectDay' data-event='click' data-month='" +
                        A.getMonth() +
                        "' data-year='" +
                        A.getFullYear() +
                        "'") +
                    '>' +
                    (F && !_
                      ? '&#xa0;'
                      : L
                      ? "<span class='ui-state-default'>" +
                        A.getDate() +
                        '</span>'
                      : "<a class='ui-state-default" +
                        (A.getTime() === B.getTime()
                          ? ' ui-state-highlight'
                          : '') +
                        (A.getTime() === G.getTime()
                          ? ' ui-state-active'
                          : '') +
                        (F ? ' ui-priority-secondary' : '') +
                        "' href='#'>" +
                        A.getDate() +
                        '</a>') +
                    '</td>'),
                  A.setDate(A.getDate() + 1),
                  (A = this._daylightSavingAdjust(A));
              T += W + '</tr>';
            }
            11 < ++Z && ((Z = 0), tt++),
              (x += T +=
                '</tbody></table>' +
                (X
                  ? '</div>' +
                    (0 < U[0] && C === U[1] - 1
                      ? "<div class='ui-datepicker-row-break'></div>"
                      : '')
                  : ''));
          }
          y += x;
        }
        return (y += l), (t._keyEvent = !1), y;
      },
      _generateMonthYearHeader: function(t, e, i, s, n, o, a, r) {
        var h,
          l,
          c,
          u,
          d,
          p,
          f,
          g,
          m = this._get(t, 'changeMonth'),
          _ = this._get(t, 'changeYear'),
          v = this._get(t, 'showMonthAfterYear'),
          b = "<div class='ui-datepicker-title'>",
          y = '';
        if (o || !m)
          y += "<span class='ui-datepicker-month'>" + a[e] + '</span>';
        else {
          for (
            h = s && s.getFullYear() === i,
              l = n && n.getFullYear() === i,
              y +=
                "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",
              c = 0;
            c < 12;
            c++
          )
            (!h || c >= s.getMonth()) &&
              (!l || c <= n.getMonth()) &&
              (y +=
                "<option value='" +
                c +
                "'" +
                (c === e ? " selected='selected'" : '') +
                '>' +
                r[c] +
                '</option>');
          y += '</select>';
        }
        if ((v || (b += y + (!o && m && _ ? '' : '&#xa0;')), !t.yearshtml))
          if (((t.yearshtml = ''), o || !_))
            b += "<span class='ui-datepicker-year'>" + i + '</span>';
          else {
            for (
              u = this._get(t, 'yearRange').split(':'),
                d = new Date().getFullYear(),
                f = (p = function(t) {
                  var e = t.match(/c[+\-].*/)
                    ? i + parseInt(t.substring(1), 10)
                    : t.match(/[+\-].*/)
                    ? d + parseInt(t, 10)
                    : parseInt(t, 10);
                  return isNaN(e) ? d : e;
                })(u[0]),
                g = Math.max(f, p(u[1] || '')),
                f = s ? Math.max(f, s.getFullYear()) : f,
                g = n ? Math.min(g, n.getFullYear()) : g,
                t.yearshtml +=
                  "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
              f <= g;
              f++
            )
              t.yearshtml +=
                "<option value='" +
                f +
                "'" +
                (f === i ? " selected='selected'" : '') +
                '>' +
                f +
                '</option>';
            (t.yearshtml += '</select>'),
              (b += t.yearshtml),
              (t.yearshtml = null);
          }
        return (
          (b += this._get(t, 'yearSuffix')),
          v && (b += (!o && m && _ ? '' : '&#xa0;') + y),
          (b += '</div>')
        );
      },
      _adjustInstDate: function(t, e, i) {
        var s = t.selectedYear + ('Y' === i ? e : 0),
          n = t.selectedMonth + ('M' === i ? e : 0),
          o =
            Math.min(t.selectedDay, this._getDaysInMonth(s, n)) +
            ('D' === i ? e : 0),
          a = this._restrictMinMax(
            t,
            this._daylightSavingAdjust(new Date(s, n, o))
          );
        (t.selectedDay = a.getDate()),
          (t.drawMonth = t.selectedMonth = a.getMonth()),
          (t.drawYear = t.selectedYear = a.getFullYear()),
          ('M' !== i && 'Y' !== i) || this._notifyChange(t);
      },
      _restrictMinMax: function(t, e) {
        var i = this._getMinMaxDate(t, 'min'),
          s = this._getMinMaxDate(t, 'max'),
          n = i && e < i ? i : e;
        return s && s < n ? s : n;
      },
      _notifyChange: function(t) {
        var e = this._get(t, 'onChangeMonthYear');
        e &&
          e.apply(t.input ? t.input[0] : null, [
            t.selectedYear,
            t.selectedMonth + 1,
            t
          ]);
      },
      _getNumberOfMonths: function(t) {
        var e = this._get(t, 'numberOfMonths');
        return null == e ? [1, 1] : 'number' == typeof e ? [1, e] : e;
      },
      _getMinMaxDate: function(t, e) {
        return this._determineDate(t, this._get(t, e + 'Date'), null);
      },
      _getDaysInMonth: function(t, e) {
        return 32 - this._daylightSavingAdjust(new Date(t, e, 32)).getDate();
      },
      _getFirstDayOfMonth: function(t, e) {
        return new Date(t, e, 1).getDay();
      },
      _canAdjustMonth: function(t, e, i, s) {
        var n = this._getNumberOfMonths(t),
          o = this._daylightSavingAdjust(
            new Date(i, s + (e < 0 ? e : n[0] * n[1]), 1)
          );
        return (
          e < 0 &&
            o.setDate(this._getDaysInMonth(o.getFullYear(), o.getMonth())),
          this._isInRange(t, o)
        );
      },
      _isInRange: function(t, e) {
        var i,
          s,
          n = this._getMinMaxDate(t, 'min'),
          o = this._getMinMaxDate(t, 'max'),
          a = null,
          r = null,
          h = this._get(t, 'yearRange');
        return (
          h &&
            ((i = h.split(':')),
            (s = new Date().getFullYear()),
            (a = parseInt(i[0], 10)),
            (r = parseInt(i[1], 10)),
            i[0].match(/[+\-].*/) && (a += s),
            i[1].match(/[+\-].*/) && (r += s)),
          (!n || e.getTime() >= n.getTime()) &&
            (!o || e.getTime() <= o.getTime()) &&
            (!a || e.getFullYear() >= a) &&
            (!r || e.getFullYear() <= r)
        );
      },
      _getFormatConfig: function(t) {
        var e = this._get(t, 'shortYearCutoff');
        return {
          shortYearCutoff: (e =
            'string' != typeof e
              ? e
              : (new Date().getFullYear() % 100) + parseInt(e, 10)),
          dayNamesShort: this._get(t, 'dayNamesShort'),
          dayNames: this._get(t, 'dayNames'),
          monthNamesShort: this._get(t, 'monthNamesShort'),
          monthNames: this._get(t, 'monthNames')
        };
      },
      _formatDate: function(t, e, i, s) {
        e ||
          ((t.currentDay = t.selectedDay),
          (t.currentMonth = t.selectedMonth),
          (t.currentYear = t.selectedYear));
        var n = e
          ? 'object' == typeof e
            ? e
            : this._daylightSavingAdjust(new Date(s, i, e))
          : this._daylightSavingAdjust(
              new Date(t.currentYear, t.currentMonth, t.currentDay)
            );
        return this.formatDate(
          this._get(t, 'dateFormat'),
          n,
          this._getFormatConfig(t)
        );
      }
    }),
    (x.fn.datepicker = function(t) {
      if (!this.length) return this;
      x.datepicker.initialized ||
        (x(document).on('mousedown', x.datepicker._checkExternalClick),
        (x.datepicker.initialized = !0)),
        0 === x('#' + x.datepicker._mainDivId).length &&
          x('body').append(x.datepicker.dpDiv);
      var e = Array.prototype.slice.call(arguments, 1);
      return 'string' != typeof t ||
        ('isDisabled' !== t && 'getDate' !== t && 'widget' !== t)
        ? 'option' === t &&
          2 === arguments.length &&
          'string' == typeof arguments[1]
          ? x.datepicker['_' + t + 'Datepicker'].apply(
              x.datepicker,
              [this[0]].concat(e)
            )
          : this.each(function() {
              'string' == typeof t
                ? x.datepicker['_' + t + 'Datepicker'].apply(
                    x.datepicker,
                    [this].concat(e)
                  )
                : x.datepicker._attachDatepicker(this, t);
            })
        : x.datepicker['_' + t + 'Datepicker'].apply(
            x.datepicker,
            [this[0]].concat(e)
          );
    }),
    (x.datepicker = new v()),
    (x.datepicker.initialized = !1),
    (x.datepicker.uuid = new Date().getTime()),
    (x.datepicker.version = '1.12.1');
  x.datepicker;
  x.widget('ui.dialog', {
    version: '1.12.1',
    options: {
      appendTo: 'body',
      autoOpen: !0,
      buttons: [],
      classes: {
        'ui-dialog': 'ui-corner-all',
        'ui-dialog-titlebar': 'ui-corner-all'
      },
      closeOnEscape: !0,
      closeText: 'Close',
      draggable: !0,
      hide: null,
      height: 'auto',
      maxHeight: null,
      maxWidth: null,
      minHeight: 150,
      minWidth: 150,
      modal: !1,
      position: {
        my: 'center',
        at: 'center',
        of: window,
        collision: 'fit',
        using: function(t) {
          var e = x(this)
            .css(t)
            .offset().top;
          e < 0 && x(this).css('top', t.top - e);
        }
      },
      resizable: !0,
      show: null,
      title: null,
      width: 300,
      beforeClose: null,
      close: null,
      drag: null,
      dragStart: null,
      dragStop: null,
      focus: null,
      open: null,
      resize: null,
      resizeStart: null,
      resizeStop: null
    },
    sizeRelatedOptions: {
      buttons: !0,
      height: !0,
      maxHeight: !0,
      maxWidth: !0,
      minHeight: !0,
      minWidth: !0,
      width: !0
    },
    resizableRelatedOptions: {
      maxHeight: !0,
      maxWidth: !0,
      minHeight: !0,
      minWidth: !0
    },
    _create: function() {
      (this.originalCss = {
        display: this.element[0].style.display,
        width: this.element[0].style.width,
        minHeight: this.element[0].style.minHeight,
        maxHeight: this.element[0].style.maxHeight,
        height: this.element[0].style.height
      }),
        (this.originalPosition = {
          parent: this.element.parent(),
          index: this.element
            .parent()
            .children()
            .index(this.element)
        }),
        (this.originalTitle = this.element.attr('title')),
        null == this.options.title &&
          null != this.originalTitle &&
          (this.options.title = this.originalTitle),
        this.options.disabled && (this.options.disabled = !1),
        this._createWrapper(),
        this.element
          .show()
          .removeAttr('title')
          .appendTo(this.uiDialog),
        this._addClass('ui-dialog-content', 'ui-widget-content'),
        this._createTitlebar(),
        this._createButtonPane(),
        this.options.draggable && x.fn.draggable && this._makeDraggable(),
        this.options.resizable && x.fn.resizable && this._makeResizable(),
        (this._isOpen = !1),
        this._trackFocus();
    },
    _init: function() {
      this.options.autoOpen && this.open();
    },
    _appendTo: function() {
      var t = this.options.appendTo;
      return t && (t.jquery || t.nodeType)
        ? x(t)
        : this.document.find(t || 'body').eq(0);
    },
    _destroy: function() {
      var t,
        e = this.originalPosition;
      this._untrackInstance(),
        this._destroyOverlay(),
        this.element
          .removeUniqueId()
          .css(this.originalCss)
          .detach(),
        this.uiDialog.remove(),
        this.originalTitle && this.element.attr('title', this.originalTitle),
        (t = e.parent.children().eq(e.index)).length && t[0] !== this.element[0]
          ? t.before(this.element)
          : e.parent.append(this.element);
    },
    widget: function() {
      return this.uiDialog;
    },
    disable: x.noop,
    enable: x.noop,
    close: function(t) {
      var e = this;
      this._isOpen &&
        !1 !== this._trigger('beforeClose', t) &&
        ((this._isOpen = !1),
        (this._focusedElement = null),
        this._destroyOverlay(),
        this._untrackInstance(),
        this.opener.filter(':focusable').trigger('focus').length ||
          x.ui.safeBlur(x.ui.safeActiveElement(this.document[0])),
        this._hide(this.uiDialog, this.options.hide, function() {
          e._trigger('close', t);
        }));
    },
    isOpen: function() {
      return this._isOpen;
    },
    moveToTop: function() {
      this._moveToTop();
    },
    _moveToTop: function(t, e) {
      var i = !1,
        s = this.uiDialog
          .siblings('.ui-front:visible')
          .map(function() {
            return +x(this).css('z-index');
          })
          .get(),
        n = Math.max.apply(null, s);
      return (
        n >= +this.uiDialog.css('z-index') &&
          (this.uiDialog.css('z-index', n + 1), (i = !0)),
        i && !e && this._trigger('focus', t),
        i
      );
    },
    open: function() {
      var t = this;
      this._isOpen
        ? this._moveToTop() && this._focusTabbable()
        : ((this._isOpen = !0),
          (this.opener = x(x.ui.safeActiveElement(this.document[0]))),
          this._size(),
          this._position(),
          this._createOverlay(),
          this._moveToTop(null, !0),
          this.overlay &&
            this.overlay.css('z-index', this.uiDialog.css('z-index') - 1),
          this._show(this.uiDialog, this.options.show, function() {
            t._focusTabbable(), t._trigger('focus');
          }),
          this._makeFocusTarget(),
          this._trigger('open'));
    },
    _focusTabbable: function() {
      var t = this._focusedElement;
      (t = t || this.element.find('[autofocus]')).length ||
        (t = this.element.find(':tabbable')),
        t.length || (t = this.uiDialogButtonPane.find(':tabbable')),
        t.length || (t = this.uiDialogTitlebarClose.filter(':tabbable')),
        t.length || (t = this.uiDialog),
        t.eq(0).trigger('focus');
    },
    _keepFocus: function(t) {
      function e() {
        var t = x.ui.safeActiveElement(this.document[0]);
        this.uiDialog[0] === t ||
          x.contains(this.uiDialog[0], t) ||
          this._focusTabbable();
      }
      t.preventDefault(), e.call(this), this._delay(e);
    },
    _createWrapper: function() {
      (this.uiDialog = x('<div>')
        .hide()
        .attr({ tabIndex: -1, role: 'dialog' })
        .appendTo(this._appendTo())),
        this._addClass(
          this.uiDialog,
          'ui-dialog',
          'ui-widget ui-widget-content ui-front'
        ),
        this._on(this.uiDialog, {
          keydown: function(t) {
            if (
              this.options.closeOnEscape &&
              !t.isDefaultPrevented() &&
              t.keyCode &&
              t.keyCode === x.ui.keyCode.ESCAPE
            )
              return t.preventDefault(), void this.close(t);
            if (t.keyCode === x.ui.keyCode.TAB && !t.isDefaultPrevented()) {
              var e = this.uiDialog.find(':tabbable'),
                i = e.filter(':first'),
                s = e.filter(':last');
              (t.target !== s[0] && t.target !== this.uiDialog[0]) || t.shiftKey
                ? (t.target !== i[0] && t.target !== this.uiDialog[0]) ||
                  !t.shiftKey ||
                  (this._delay(function() {
                    s.trigger('focus');
                  }),
                  t.preventDefault())
                : (this._delay(function() {
                    i.trigger('focus');
                  }),
                  t.preventDefault());
            }
          },
          mousedown: function(t) {
            this._moveToTop(t) && this._focusTabbable();
          }
        }),
        this.element.find('[aria-describedby]').length ||
          this.uiDialog.attr({
            'aria-describedby': this.element.uniqueId().attr('id')
          });
    },
    _createTitlebar: function() {
      var t;
      (this.uiDialogTitlebar = x('<div>')),
        this._addClass(
          this.uiDialogTitlebar,
          'ui-dialog-titlebar',
          'ui-widget-header ui-helper-clearfix'
        ),
        this._on(this.uiDialogTitlebar, {
          mousedown: function(t) {
            x(t.target).closest('.ui-dialog-titlebar-close') ||
              this.uiDialog.trigger('focus');
          }
        }),
        (this.uiDialogTitlebarClose = x("<button type='button'></button>")
          .button({
            label: x('<a>')
              .text(this.options.closeText)
              .html(),
            icon: 'ui-icon-closethick',
            showLabel: !1
          })
          .appendTo(this.uiDialogTitlebar)),
        this._addClass(this.uiDialogTitlebarClose, 'ui-dialog-titlebar-close'),
        this._on(this.uiDialogTitlebarClose, {
          click: function(t) {
            t.preventDefault(), this.close(t);
          }
        }),
        (t = x('<span>')
          .uniqueId()
          .prependTo(this.uiDialogTitlebar)),
        this._addClass(t, 'ui-dialog-title'),
        this._title(t),
        this.uiDialogTitlebar.prependTo(this.uiDialog),
        this.uiDialog.attr({ 'aria-labelledby': t.attr('id') });
    },
    _title: function(t) {
      this.options.title ? t.text(this.options.title) : t.html('&#160;');
    },
    _createButtonPane: function() {
      (this.uiDialogButtonPane = x('<div>')),
        this._addClass(
          this.uiDialogButtonPane,
          'ui-dialog-buttonpane',
          'ui-widget-content ui-helper-clearfix'
        ),
        (this.uiButtonSet = x('<div>').appendTo(this.uiDialogButtonPane)),
        this._addClass(this.uiButtonSet, 'ui-dialog-buttonset'),
        this._createButtons();
    },
    _createButtons: function() {
      var n = this,
        t = this.options.buttons;
      this.uiDialogButtonPane.remove(),
        this.uiButtonSet.empty(),
        x.isEmptyObject(t) || (x.isArray(t) && !t.length)
          ? this._removeClass(this.uiDialog, 'ui-dialog-buttons')
          : (x.each(t, function(t, e) {
              var i, s;
              (e = x.isFunction(e) ? { click: e, text: t } : e),
                (e = x.extend({ type: 'button' }, e)),
                (i = e.click),
                (s = {
                  icon: e.icon,
                  iconPosition: e.iconPosition,
                  showLabel: e.showLabel,
                  icons: e.icons,
                  text: e.text
                }),
                delete e.click,
                delete e.icon,
                delete e.iconPosition,
                delete e.showLabel,
                delete e.icons,
                'boolean' == typeof e.text && delete e.text,
                x('<button></button>', e)
                  .button(s)
                  .appendTo(n.uiButtonSet)
                  .on('click', function() {
                    i.apply(n.element[0], arguments);
                  });
            }),
            this._addClass(this.uiDialog, 'ui-dialog-buttons'),
            this.uiDialogButtonPane.appendTo(this.uiDialog));
    },
    _makeDraggable: function() {
      var n = this,
        o = this.options;
      function a(t) {
        return { position: t.position, offset: t.offset };
      }
      this.uiDialog.draggable({
        cancel: '.ui-dialog-content, .ui-dialog-titlebar-close',
        handle: '.ui-dialog-titlebar',
        containment: 'document',
        start: function(t, e) {
          n._addClass(x(this), 'ui-dialog-dragging'),
            n._blockFrames(),
            n._trigger('dragStart', t, a(e));
        },
        drag: function(t, e) {
          n._trigger('drag', t, a(e));
        },
        stop: function(t, e) {
          var i = e.offset.left - n.document.scrollLeft(),
            s = e.offset.top - n.document.scrollTop();
          (o.position = {
            my: 'left top',
            at:
              'left' +
              (0 <= i ? '+' : '') +
              i +
              ' top' +
              (0 <= s ? '+' : '') +
              s,
            of: n.window
          }),
            n._removeClass(x(this), 'ui-dialog-dragging'),
            n._unblockFrames(),
            n._trigger('dragStop', t, a(e));
        }
      });
    },
    _makeResizable: function() {
      var o = this,
        a = this.options,
        t = a.resizable,
        e = this.uiDialog.css('position'),
        i = 'string' == typeof t ? t : 'n,e,s,w,se,sw,ne,nw';
      function r(t) {
        return {
          originalPosition: t.originalPosition,
          originalSize: t.originalSize,
          position: t.position,
          size: t.size
        };
      }
      this.uiDialog
        .resizable({
          cancel: '.ui-dialog-content',
          containment: 'document',
          alsoResize: this.element,
          maxWidth: a.maxWidth,
          maxHeight: a.maxHeight,
          minWidth: a.minWidth,
          minHeight: this._minHeight(),
          handles: i,
          start: function(t, e) {
            o._addClass(x(this), 'ui-dialog-resizing'),
              o._blockFrames(),
              o._trigger('resizeStart', t, r(e));
          },
          resize: function(t, e) {
            o._trigger('resize', t, r(e));
          },
          stop: function(t, e) {
            var i = o.uiDialog.offset(),
              s = i.left - o.document.scrollLeft(),
              n = i.top - o.document.scrollTop();
            (a.height = o.uiDialog.height()),
              (a.width = o.uiDialog.width()),
              (a.position = {
                my: 'left top',
                at:
                  'left' +
                  (0 <= s ? '+' : '') +
                  s +
                  ' top' +
                  (0 <= n ? '+' : '') +
                  n,
                of: o.window
              }),
              o._removeClass(x(this), 'ui-dialog-resizing'),
              o._unblockFrames(),
              o._trigger('resizeStop', t, r(e));
          }
        })
        .css('position', e);
    },
    _trackFocus: function() {
      this._on(this.widget(), {
        focusin: function(t) {
          this._makeFocusTarget(), (this._focusedElement = x(t.target));
        }
      });
    },
    _makeFocusTarget: function() {
      this._untrackInstance(), this._trackingInstances().unshift(this);
    },
    _untrackInstance: function() {
      var t = this._trackingInstances(),
        e = x.inArray(this, t);
      -1 !== e && t.splice(e, 1);
    },
    _trackingInstances: function() {
      var t = this.document.data('ui-dialog-instances');
      return t || ((t = []), this.document.data('ui-dialog-instances', t)), t;
    },
    _minHeight: function() {
      var t = this.options;
      return 'auto' === t.height
        ? t.minHeight
        : Math.min(t.minHeight, t.height);
    },
    _position: function() {
      var t = this.uiDialog.is(':visible');
      t || this.uiDialog.show(),
        this.uiDialog.position(this.options.position),
        t || this.uiDialog.hide();
    },
    _setOptions: function(t) {
      var i = this,
        s = !1,
        n = {};
      x.each(t, function(t, e) {
        i._setOption(t, e),
          t in i.sizeRelatedOptions && (s = !0),
          t in i.resizableRelatedOptions && (n[t] = e);
      }),
        s && (this._size(), this._position()),
        this.uiDialog.is(':data(ui-resizable)') &&
          this.uiDialog.resizable('option', n);
    },
    _setOption: function(t, e) {
      var i,
        s,
        n = this.uiDialog;
      'disabled' !== t &&
        (this._super(t, e),
        'appendTo' === t && this.uiDialog.appendTo(this._appendTo()),
        'buttons' === t && this._createButtons(),
        'closeText' === t &&
          this.uiDialogTitlebarClose.button({
            label: x('<a>')
              .text('' + this.options.closeText)
              .html()
          }),
        'draggable' === t &&
          ((i = n.is(':data(ui-draggable)')) && !e && n.draggable('destroy'),
          !i && e && this._makeDraggable()),
        'position' === t && this._position(),
        'resizable' === t &&
          ((s = n.is(':data(ui-resizable)')) && !e && n.resizable('destroy'),
          s && 'string' == typeof e && n.resizable('option', 'handles', e),
          s || !1 === e || this._makeResizable()),
        'title' === t &&
          this._title(this.uiDialogTitlebar.find('.ui-dialog-title')));
    },
    _size: function() {
      var t,
        e,
        i,
        s = this.options;
      this.element
        .show()
        .css({ width: 'auto', minHeight: 0, maxHeight: 'none', height: 0 }),
        s.minWidth > s.width && (s.width = s.minWidth),
        (t = this.uiDialog
          .css({ height: 'auto', width: s.width })
          .outerHeight()),
        (e = Math.max(0, s.minHeight - t)),
        (i =
          'number' == typeof s.maxHeight
            ? Math.max(0, s.maxHeight - t)
            : 'none'),
        'auto' === s.height
          ? this.element.css({ minHeight: e, maxHeight: i, height: 'auto' })
          : this.element.height(Math.max(0, s.height - t)),
        this.uiDialog.is(':data(ui-resizable)') &&
          this.uiDialog.resizable('option', 'minHeight', this._minHeight());
    },
    _blockFrames: function() {
      this.iframeBlocks = this.document.find('iframe').map(function() {
        var t = x(this);
        return x('<div>')
          .css({
            position: 'absolute',
            width: t.outerWidth(),
            height: t.outerHeight()
          })
          .appendTo(t.parent())
          .offset(t.offset())[0];
      });
    },
    _unblockFrames: function() {
      this.iframeBlocks &&
        (this.iframeBlocks.remove(), delete this.iframeBlocks);
    },
    _allowInteraction: function(t) {
      return (
        !!x(t.target).closest('.ui-dialog').length ||
        !!x(t.target).closest('.ui-datepicker').length
      );
    },
    _createOverlay: function() {
      if (this.options.modal) {
        var e = !0;
        this._delay(function() {
          e = !1;
        }),
          this.document.data('ui-dialog-overlays') ||
            this._on(this.document, {
              focusin: function(t) {
                e ||
                  this._allowInteraction(t) ||
                  (t.preventDefault(),
                  this._trackingInstances()[0]._focusTabbable());
              }
            }),
          (this.overlay = x('<div>').appendTo(this._appendTo())),
          this._addClass(this.overlay, null, 'ui-widget-overlay ui-front'),
          this._on(this.overlay, { mousedown: '_keepFocus' }),
          this.document.data(
            'ui-dialog-overlays',
            (this.document.data('ui-dialog-overlays') || 0) + 1
          );
      }
    },
    _destroyOverlay: function() {
      if (this.options.modal && this.overlay) {
        var t = this.document.data('ui-dialog-overlays') - 1;
        t
          ? this.document.data('ui-dialog-overlays', t)
          : (this._off(this.document, 'focusin'),
            this.document.removeData('ui-dialog-overlays')),
          this.overlay.remove(),
          (this.overlay = null);
      }
    }
  }),
    !1 !== x.uiBackCompat &&
      x.widget('ui.dialog', x.ui.dialog, {
        options: { dialogClass: '' },
        _createWrapper: function() {
          this._super(), this.uiDialog.addClass(this.options.dialogClass);
        },
        _setOption: function(t, e) {
          'dialogClass' === t &&
            this.uiDialog.removeClass(this.options.dialogClass).addClass(e),
            this._superApply(arguments);
        }
      });
  x.ui.dialog,
    x.widget('ui.progressbar', {
      version: '1.12.1',
      options: {
        classes: {
          'ui-progressbar': 'ui-corner-all',
          'ui-progressbar-value': 'ui-corner-left',
          'ui-progressbar-complete': 'ui-corner-right'
        },
        max: 100,
        value: 0,
        change: null,
        complete: null
      },
      min: 0,
      _create: function() {
        (this.oldValue = this.options.value = this._constrainedValue()),
          this.element.attr({ role: 'progressbar', 'aria-valuemin': this.min }),
          this._addClass('ui-progressbar', 'ui-widget ui-widget-content'),
          (this.valueDiv = x('<div>').appendTo(this.element)),
          this._addClass(
            this.valueDiv,
            'ui-progressbar-value',
            'ui-widget-header'
          ),
          this._refreshValue();
      },
      _destroy: function() {
        this.element.removeAttr(
          'role aria-valuemin aria-valuemax aria-valuenow'
        ),
          this.valueDiv.remove();
      },
      value: function(t) {
        if (void 0 === t) return this.options.value;
        (this.options.value = this._constrainedValue(t)), this._refreshValue();
      },
      _constrainedValue: function(t) {
        return (
          void 0 === t && (t = this.options.value),
          (this.indeterminate = !1 === t),
          'number' != typeof t && (t = 0),
          !this.indeterminate &&
            Math.min(this.options.max, Math.max(this.min, t))
        );
      },
      _setOptions: function(t) {
        var e = t.value;
        delete t.value,
          this._super(t),
          (this.options.value = this._constrainedValue(e)),
          this._refreshValue();
      },
      _setOption: function(t, e) {
        'max' === t && (e = Math.max(this.min, e)), this._super(t, e);
      },
      _setOptionDisabled: function(t) {
        this._super(t),
          this.element.attr('aria-disabled', t),
          this._toggleClass(null, 'ui-state-disabled', !!t);
      },
      _percentage: function() {
        return this.indeterminate
          ? 100
          : (100 * (this.options.value - this.min)) /
              (this.options.max - this.min);
      },
      _refreshValue: function() {
        var t = this.options.value,
          e = this._percentage();
        this.valueDiv
          .toggle(this.indeterminate || t > this.min)
          .width(e.toFixed(0) + '%'),
          this._toggleClass(
            this.valueDiv,
            'ui-progressbar-complete',
            null,
            t === this.options.max
          )._toggleClass(
            'ui-progressbar-indeterminate',
            null,
            this.indeterminate
          ),
          this.indeterminate
            ? (this.element.removeAttr('aria-valuenow'),
              this.overlayDiv ||
                ((this.overlayDiv = x('<div>').appendTo(this.valueDiv)),
                this._addClass(this.overlayDiv, 'ui-progressbar-overlay')))
            : (this.element.attr({
                'aria-valuemax': this.options.max,
                'aria-valuenow': t
              }),
              this.overlayDiv &&
                (this.overlayDiv.remove(), (this.overlayDiv = null))),
          this.oldValue !== t && ((this.oldValue = t), this._trigger('change')),
          t === this.options.max && this._trigger('complete');
      }
    }),
    x.widget('ui.selectmenu', [
      x.ui.formResetMixin,
      {
        version: '1.12.1',
        defaultElement: '<select>',
        options: {
          appendTo: null,
          classes: {
            'ui-selectmenu-button-open': 'ui-corner-top',
            'ui-selectmenu-button-closed': 'ui-corner-all'
          },
          disabled: null,
          icons: { button: 'ui-icon-triangle-1-s' },
          position: { my: 'left top', at: 'left bottom', collision: 'none' },
          width: !1,
          change: null,
          close: null,
          focus: null,
          open: null,
          select: null
        },
        _create: function() {
          var t = this.element.uniqueId().attr('id');
          (this.ids = { element: t, button: t + '-button', menu: t + '-menu' }),
            this._drawButton(),
            this._drawMenu(),
            this._bindFormResetHandler(),
            (this._rendered = !1),
            (this.menuItems = x());
        },
        _drawButton: function() {
          var t,
            e = this,
            i = this._parseOption(
              this.element.find('option:selected'),
              this.element[0].selectedIndex
            );
          (this.labels = this.element.labels().attr('for', this.ids.button)),
            this._on(this.labels, {
              click: function(t) {
                this.button.focus(), t.preventDefault();
              }
            }),
            this.element.hide(),
            (this.button = x('<span>', {
              tabindex: this.options.disabled ? -1 : 0,
              id: this.ids.button,
              role: 'combobox',
              'aria-expanded': 'false',
              'aria-autocomplete': 'list',
              'aria-owns': this.ids.menu,
              'aria-haspopup': 'true',
              title: this.element.attr('title')
            }).insertAfter(this.element)),
            this._addClass(
              this.button,
              'ui-selectmenu-button ui-selectmenu-button-closed',
              'ui-button ui-widget'
            ),
            (t = x('<span>').appendTo(this.button)),
            this._addClass(
              t,
              'ui-selectmenu-icon',
              'ui-icon ' + this.options.icons.button
            ),
            (this.buttonItem = this._renderButtonItem(i).appendTo(this.button)),
            !1 !== this.options.width && this._resizeButton(),
            this._on(this.button, this._buttonEvents),
            this.button.one('focusin', function() {
              e._rendered || e._refreshMenu();
            });
        },
        _drawMenu: function() {
          var s = this;
          (this.menu = x('<ul>', {
            'aria-hidden': 'true',
            'aria-labelledby': this.ids.button,
            id: this.ids.menu
          })),
            (this.menuWrap = x('<div>').append(this.menu)),
            this._addClass(this.menuWrap, 'ui-selectmenu-menu', 'ui-front'),
            this.menuWrap.appendTo(this._appendTo()),
            (this.menuInstance = this.menu
              .menu({
                classes: { 'ui-menu': 'ui-corner-bottom' },
                role: 'listbox',
                select: function(t, e) {
                  t.preventDefault(),
                    s._setSelection(),
                    s._select(e.item.data('ui-selectmenu-item'), t);
                },
                focus: function(t, e) {
                  var i = e.item.data('ui-selectmenu-item');
                  null != s.focusIndex &&
                    i.index !== s.focusIndex &&
                    (s._trigger('focus', t, { item: i }),
                    s.isOpen || s._select(i, t)),
                    (s.focusIndex = i.index),
                    s.button.attr(
                      'aria-activedescendant',
                      s.menuItems.eq(i.index).attr('id')
                    );
                }
              })
              .menu('instance')),
            this.menuInstance._off(this.menu, 'mouseleave'),
            (this.menuInstance._closeOnDocumentClick = function() {
              return !1;
            }),
            (this.menuInstance._isDivider = function() {
              return !1;
            });
        },
        refresh: function() {
          this._refreshMenu(),
            this.buttonItem.replaceWith(
              (this.buttonItem = this._renderButtonItem(
                this._getSelectedItem().data('ui-selectmenu-item') || {}
              ))
            ),
            null === this.options.width && this._resizeButton();
        },
        _refreshMenu: function() {
          var t,
            e = this.element.find('option');
          this.menu.empty(),
            this._parseOptions(e),
            this._renderMenu(this.menu, this.items),
            this.menuInstance.refresh(),
            (this.menuItems = this.menu
              .find('li')
              .not('.ui-selectmenu-optgroup')
              .find('.ui-menu-item-wrapper')),
            (this._rendered = !0),
            e.length &&
              ((t = this._getSelectedItem()),
              this.menuInstance.focus(null, t),
              this._setAria(t.data('ui-selectmenu-item')),
              this._setOption('disabled', this.element.prop('disabled')));
        },
        open: function(t) {
          this.options.disabled ||
            (this._rendered
              ? (this._removeClass(
                  this.menu.find('.ui-state-active'),
                  null,
                  'ui-state-active'
                ),
                this.menuInstance.focus(null, this._getSelectedItem()))
              : this._refreshMenu(),
            this.menuItems.length &&
              ((this.isOpen = !0),
              this._toggleAttr(),
              this._resizeMenu(),
              this._position(),
              this._on(this.document, this._documentClick),
              this._trigger('open', t)));
        },
        _position: function() {
          this.menuWrap.position(
            x.extend({ of: this.button }, this.options.position)
          );
        },
        close: function(t) {
          this.isOpen &&
            ((this.isOpen = !1),
            this._toggleAttr(),
            (this.range = null),
            this._off(this.document),
            this._trigger('close', t));
        },
        widget: function() {
          return this.button;
        },
        menuWidget: function() {
          return this.menu;
        },
        _renderButtonItem: function(t) {
          var e = x('<span>');
          return (
            this._setText(e, t.label),
            this._addClass(e, 'ui-selectmenu-text'),
            e
          );
        },
        _renderMenu: function(s, t) {
          var n = this,
            o = '';
          x.each(t, function(t, e) {
            var i;
            e.optgroup !== o &&
              ((i = x('<li>', { text: e.optgroup })),
              n._addClass(
                i,
                'ui-selectmenu-optgroup',
                'ui-menu-divider' +
                  (e.element.parent('optgroup').prop('disabled')
                    ? ' ui-state-disabled'
                    : '')
              ),
              i.appendTo(s),
              (o = e.optgroup)),
              n._renderItemData(s, e);
          });
        },
        _renderItemData: function(t, e) {
          return this._renderItem(t, e).data('ui-selectmenu-item', e);
        },
        _renderItem: function(t, e) {
          var i = x('<li>'),
            s = x('<div>', { title: e.element.attr('title') });
          return (
            e.disabled && this._addClass(i, null, 'ui-state-disabled'),
            this._setText(s, e.label),
            i.append(s).appendTo(t)
          );
        },
        _setText: function(t, e) {
          e ? t.text(e) : t.html('&#160;');
        },
        _move: function(t, e) {
          var i,
            s,
            n = '.ui-menu-item';
          this.isOpen
            ? (i = this.menuItems.eq(this.focusIndex).parent('li'))
            : ((i = this.menuItems
                .eq(this.element[0].selectedIndex)
                .parent('li')),
              (n += ':not(.ui-state-disabled)')),
            (s =
              'first' === t || 'last' === t
                ? i['first' === t ? 'prevAll' : 'nextAll'](n).eq(-1)
                : i[t + 'All'](n).eq(0)).length &&
              this.menuInstance.focus(e, s);
        },
        _getSelectedItem: function() {
          return this.menuItems.eq(this.element[0].selectedIndex).parent('li');
        },
        _toggle: function(t) {
          this[this.isOpen ? 'close' : 'open'](t);
        },
        _setSelection: function() {
          var t;
          this.range &&
            (window.getSelection
              ? ((t = window.getSelection()).removeAllRanges(),
                t.addRange(this.range))
              : this.range.select(),
            this.button.focus());
        },
        _documentClick: {
          mousedown: function(t) {
            this.isOpen &&
              (x(t.target).closest(
                '.ui-selectmenu-menu, #' + x.ui.escapeSelector(this.ids.button)
              ).length ||
                this.close(t));
          }
        },
        _buttonEvents: {
          mousedown: function() {
            var t;
            window.getSelection
              ? (t = window.getSelection()).rangeCount &&
                (this.range = t.getRangeAt(0))
              : (this.range = document.selection.createRange());
          },
          click: function(t) {
            this._setSelection(), this._toggle(t);
          },
          keydown: function(t) {
            var e = !0;
            switch (t.keyCode) {
              case x.ui.keyCode.TAB:
              case x.ui.keyCode.ESCAPE:
                this.close(t), (e = !1);
                break;
              case x.ui.keyCode.ENTER:
                this.isOpen && this._selectFocusedItem(t);
                break;
              case x.ui.keyCode.UP:
                t.altKey ? this._toggle(t) : this._move('prev', t);
                break;
              case x.ui.keyCode.DOWN:
                t.altKey ? this._toggle(t) : this._move('next', t);
                break;
              case x.ui.keyCode.SPACE:
                this.isOpen ? this._selectFocusedItem(t) : this._toggle(t);
                break;
              case x.ui.keyCode.LEFT:
                this._move('prev', t);
                break;
              case x.ui.keyCode.RIGHT:
                this._move('next', t);
                break;
              case x.ui.keyCode.HOME:
              case x.ui.keyCode.PAGE_UP:
                this._move('first', t);
                break;
              case x.ui.keyCode.END:
              case x.ui.keyCode.PAGE_DOWN:
                this._move('last', t);
                break;
              default:
                this.menu.trigger(t), (e = !1);
            }
            e && t.preventDefault();
          }
        },
        _selectFocusedItem: function(t) {
          var e = this.menuItems.eq(this.focusIndex).parent('li');
          e.hasClass('ui-state-disabled') ||
            this._select(e.data('ui-selectmenu-item'), t);
        },
        _select: function(t, e) {
          var i = this.element[0].selectedIndex;
          (this.element[0].selectedIndex = t.index),
            this.buttonItem.replaceWith(
              (this.buttonItem = this._renderButtonItem(t))
            ),
            this._setAria(t),
            this._trigger('select', e, { item: t }),
            t.index !== i && this._trigger('change', e, { item: t }),
            this.close(e);
        },
        _setAria: function(t) {
          var e = this.menuItems.eq(t.index).attr('id');
          this.button.attr({
            'aria-labelledby': e,
            'aria-activedescendant': e
          }),
            this.menu.attr('aria-activedescendant', e);
        },
        _setOption: function(t, e) {
          if ('icons' === t) {
            var i = this.button.find('span.ui-icon');
            this._removeClass(i, null, this.options.icons.button)._addClass(
              i,
              null,
              e.button
            );
          }
          this._super(t, e),
            'appendTo' === t && this.menuWrap.appendTo(this._appendTo()),
            'width' === t && this._resizeButton();
        },
        _setOptionDisabled: function(t) {
          this._super(t),
            this.menuInstance.option('disabled', t),
            this.button.attr('aria-disabled', t),
            this._toggleClass(this.button, null, 'ui-state-disabled', t),
            this.element.prop('disabled', t),
            t
              ? (this.button.attr('tabindex', -1), this.close())
              : this.button.attr('tabindex', 0);
        },
        _appendTo: function() {
          var t = this.options.appendTo;
          return (
            ((t =
              t &&
              (t.jquery || t.nodeType ? x(t) : this.document.find(t).eq(0))) &&
              t[0]) ||
              (t = this.element.closest('.ui-front, dialog')),
            t.length || (t = this.document[0].body),
            t
          );
        },
        _toggleAttr: function() {
          this.button.attr('aria-expanded', this.isOpen),
            this._removeClass(
              this.button,
              'ui-selectmenu-button-' + (this.isOpen ? 'closed' : 'open')
            )
              ._addClass(
                this.button,
                'ui-selectmenu-button-' + (this.isOpen ? 'open' : 'closed')
              )
              ._toggleClass(
                this.menuWrap,
                'ui-selectmenu-open',
                null,
                this.isOpen
              ),
            this.menu.attr('aria-hidden', !this.isOpen);
        },
        _resizeButton: function() {
          var t = this.options.width;
          !1 !== t
            ? (null === t &&
                ((t = this.element.show().outerWidth()), this.element.hide()),
              this.button.outerWidth(t))
            : this.button.css('width', '');
        },
        _resizeMenu: function() {
          this.menu.outerWidth(
            Math.max(
              this.button.outerWidth(),
              this.menu.width('').outerWidth() + 1
            )
          );
        },
        _getCreateOptions: function() {
          var t = this._super();
          return (t.disabled = this.element.prop('disabled')), t;
        },
        _parseOptions: function(t) {
          var i = this,
            s = [];
          t.each(function(t, e) {
            s.push(i._parseOption(x(e), t));
          }),
            (this.items = s);
        },
        _parseOption: function(t, e) {
          var i = t.parent('optgroup');
          return {
            element: t,
            index: e,
            value: t.val(),
            label: t.text(),
            optgroup: i.attr('label') || '',
            disabled: i.prop('disabled') || t.prop('disabled')
          };
        },
        _destroy: function() {
          this._unbindFormResetHandler(),
            this.menuWrap.remove(),
            this.button.remove(),
            this.element.show(),
            this.element.removeUniqueId(),
            this.labels.attr('for', this.ids.element);
        }
      }
    ]),
    x.widget('ui.slider', x.ui.mouse, {
      version: '1.12.1',
      widgetEventPrefix: 'slide',
      options: {
        animate: !1,
        classes: {
          'ui-slider': 'ui-corner-all',
          'ui-slider-handle': 'ui-corner-all',
          'ui-slider-range': 'ui-corner-all ui-widget-header'
        },
        distance: 0,
        max: 100,
        min: 0,
        orientation: 'horizontal',
        range: !1,
        step: 1,
        value: 0,
        values: null,
        change: null,
        slide: null,
        start: null,
        stop: null
      },
      numPages: 5,
      _create: function() {
        (this._keySliding = !1),
          (this._mouseSliding = !1),
          (this._animateOff = !0),
          (this._handleIndex = null),
          this._detectOrientation(),
          this._mouseInit(),
          this._calculateNewMax(),
          this._addClass(
            'ui-slider ui-slider-' + this.orientation,
            'ui-widget ui-widget-content'
          ),
          this._refresh(),
          (this._animateOff = !1);
      },
      _refresh: function() {
        this._createRange(),
          this._createHandles(),
          this._setupEvents(),
          this._refreshValue();
      },
      _createHandles: function() {
        var t,
          e,
          i = this.options,
          s = this.element.find('.ui-slider-handle'),
          n = [];
        for (
          e = (i.values && i.values.length) || 1,
            s.length > e && (s.slice(e).remove(), (s = s.slice(0, e))),
            t = s.length;
          t < e;
          t++
        )
          n.push("<span tabindex='0'></span>");
        (this.handles = s.add(x(n.join('')).appendTo(this.element))),
          this._addClass(this.handles, 'ui-slider-handle', 'ui-state-default'),
          (this.handle = this.handles.eq(0)),
          this.handles.each(function(t) {
            x(this)
              .data('ui-slider-handle-index', t)
              .attr('tabIndex', 0);
          });
      },
      _createRange: function() {
        var t = this.options;
        t.range
          ? (!0 === t.range &&
              (t.values
                ? t.values.length && 2 !== t.values.length
                  ? (t.values = [t.values[0], t.values[0]])
                  : x.isArray(t.values) && (t.values = t.values.slice(0))
                : (t.values = [this._valueMin(), this._valueMin()])),
            this.range && this.range.length
              ? (this._removeClass(
                  this.range,
                  'ui-slider-range-min ui-slider-range-max'
                ),
                this.range.css({ left: '', bottom: '' }))
              : ((this.range = x('<div>').appendTo(this.element)),
                this._addClass(this.range, 'ui-slider-range')),
            ('min' !== t.range && 'max' !== t.range) ||
              this._addClass(this.range, 'ui-slider-range-' + t.range))
          : (this.range && this.range.remove(), (this.range = null));
      },
      _setupEvents: function() {
        this._off(this.handles),
          this._on(this.handles, this._handleEvents),
          this._hoverable(this.handles),
          this._focusable(this.handles);
      },
      _destroy: function() {
        this.handles.remove(),
          this.range && this.range.remove(),
          this._mouseDestroy();
      },
      _mouseCapture: function(t) {
        var e,
          i,
          s,
          n,
          o,
          a,
          r,
          h = this,
          l = this.options;
        return (
          !l.disabled &&
          ((this.elementSize = {
            width: this.element.outerWidth(),
            height: this.element.outerHeight()
          }),
          (this.elementOffset = this.element.offset()),
          (e = { x: t.pageX, y: t.pageY }),
          (i = this._normValueFromMouse(e)),
          (s = this._valueMax() - this._valueMin() + 1),
          this.handles.each(function(t) {
            var e = Math.abs(i - h.values(t));
            (e < s ||
              (s === e &&
                (t === h._lastChangedValue || h.values(t) === l.min))) &&
              ((s = e), (n = x(this)), (o = t));
          }),
          !1 !== this._start(t, o) &&
            ((this._mouseSliding = !0),
            (this._handleIndex = o),
            this._addClass(n, null, 'ui-state-active'),
            n.trigger('focus'),
            (a = n.offset()),
            (r = !x(t.target)
              .parents()
              .addBack()
              .is('.ui-slider-handle')),
            (this._clickOffset = r
              ? { left: 0, top: 0 }
              : {
                  left: t.pageX - a.left - n.width() / 2,
                  top:
                    t.pageY -
                    a.top -
                    n.height() / 2 -
                    (parseInt(n.css('borderTopWidth'), 10) || 0) -
                    (parseInt(n.css('borderBottomWidth'), 10) || 0) +
                    (parseInt(n.css('marginTop'), 10) || 0)
                }),
            this.handles.hasClass('ui-state-hover') || this._slide(t, o, i),
            (this._animateOff = !0)))
        );
      },
      _mouseStart: function() {
        return !0;
      },
      _mouseDrag: function(t) {
        var e = { x: t.pageX, y: t.pageY },
          i = this._normValueFromMouse(e);
        return this._slide(t, this._handleIndex, i), !1;
      },
      _mouseStop: function(t) {
        return (
          this._removeClass(this.handles, null, 'ui-state-active'),
          (this._mouseSliding = !1),
          this._stop(t, this._handleIndex),
          this._change(t, this._handleIndex),
          (this._handleIndex = null),
          (this._clickOffset = null),
          (this._animateOff = !1)
        );
      },
      _detectOrientation: function() {
        this.orientation =
          'vertical' === this.options.orientation ? 'vertical' : 'horizontal';
      },
      _normValueFromMouse: function(t) {
        var e, i, s, n;
        return (
          1 <
            (i =
              ('horizontal' === this.orientation
                ? ((e = this.elementSize.width),
                  t.x -
                    this.elementOffset.left -
                    (this._clickOffset ? this._clickOffset.left : 0))
                : ((e = this.elementSize.height),
                  t.y -
                    this.elementOffset.top -
                    (this._clickOffset ? this._clickOffset.top : 0))) / e) &&
            (i = 1),
          i < 0 && (i = 0),
          'vertical' === this.orientation && (i = 1 - i),
          (s = this._valueMax() - this._valueMin()),
          (n = this._valueMin() + i * s),
          this._trimAlignValue(n)
        );
      },
      _uiHash: function(t, e, i) {
        var s = {
          handle: this.handles[t],
          handleIndex: t,
          value: void 0 !== e ? e : this.value()
        };
        return (
          this._hasMultipleValues() &&
            ((s.value = void 0 !== e ? e : this.values(t)),
            (s.values = i || this.values())),
          s
        );
      },
      _hasMultipleValues: function() {
        return this.options.values && this.options.values.length;
      },
      _start: function(t, e) {
        return this._trigger('start', t, this._uiHash(e));
      },
      _slide: function(t, e, i) {
        var s,
          n = this.value(),
          o = this.values();
        this._hasMultipleValues() &&
          ((s = this.values(e ? 0 : 1)),
          (n = this.values(e)),
          2 === this.options.values.length &&
            !0 === this.options.range &&
            (i = 0 === e ? Math.min(s, i) : Math.max(s, i)),
          (o[e] = i)),
          i !== n &&
            !1 !== this._trigger('slide', t, this._uiHash(e, i, o)) &&
            (this._hasMultipleValues() ? this.values(e, i) : this.value(i));
      },
      _stop: function(t, e) {
        this._trigger('stop', t, this._uiHash(e));
      },
      _change: function(t, e) {
        this._keySliding ||
          this._mouseSliding ||
          ((this._lastChangedValue = e),
          this._trigger('change', t, this._uiHash(e)));
      },
      value: function(t) {
        return arguments.length
          ? ((this.options.value = this._trimAlignValue(t)),
            this._refreshValue(),
            void this._change(null, 0))
          : this._value();
      },
      values: function(t, e) {
        var i, s, n;
        if (1 < arguments.length)
          return (
            (this.options.values[t] = this._trimAlignValue(e)),
            this._refreshValue(),
            void this._change(null, t)
          );
        if (!arguments.length) return this._values();
        if (!x.isArray(t))
          return this._hasMultipleValues() ? this._values(t) : this.value();
        for (i = this.options.values, s = t, n = 0; n < i.length; n += 1)
          (i[n] = this._trimAlignValue(s[n])), this._change(null, n);
        this._refreshValue();
      },
      _setOption: function(t, e) {
        var i,
          s = 0;
        switch (
          ('range' === t &&
            !0 === this.options.range &&
            ('min' === e
              ? ((this.options.value = this._values(0)),
                (this.options.values = null))
              : 'max' === e &&
                ((this.options.value = this._values(
                  this.options.values.length - 1
                )),
                (this.options.values = null))),
          x.isArray(this.options.values) && (s = this.options.values.length),
          this._super(t, e),
          t)
        ) {
          case 'orientation':
            this._detectOrientation(),
              this._removeClass(
                'ui-slider-horizontal ui-slider-vertical'
              )._addClass('ui-slider-' + this.orientation),
              this._refreshValue(),
              this.options.range && this._refreshRange(e),
              this.handles.css('horizontal' === e ? 'bottom' : 'left', '');
            break;
          case 'value':
            (this._animateOff = !0),
              this._refreshValue(),
              this._change(null, 0),
              (this._animateOff = !1);
            break;
          case 'values':
            for (
              this._animateOff = !0, this._refreshValue(), i = s - 1;
              0 <= i;
              i--
            )
              this._change(null, i);
            this._animateOff = !1;
            break;
          case 'step':
          case 'min':
          case 'max':
            (this._animateOff = !0),
              this._calculateNewMax(),
              this._refreshValue(),
              (this._animateOff = !1);
            break;
          case 'range':
            (this._animateOff = !0), this._refresh(), (this._animateOff = !1);
        }
      },
      _setOptionDisabled: function(t) {
        this._super(t), this._toggleClass(null, 'ui-state-disabled', !!t);
      },
      _value: function() {
        var t = this.options.value;
        return (t = this._trimAlignValue(t));
      },
      _values: function(t) {
        var e, i, s;
        if (arguments.length)
          return (e = this.options.values[t]), (e = this._trimAlignValue(e));
        if (this._hasMultipleValues()) {
          for (i = this.options.values.slice(), s = 0; s < i.length; s += 1)
            i[s] = this._trimAlignValue(i[s]);
          return i;
        }
        return [];
      },
      _trimAlignValue: function(t) {
        if (t <= this._valueMin()) return this._valueMin();
        if (t >= this._valueMax()) return this._valueMax();
        var e = 0 < this.options.step ? this.options.step : 1,
          i = (t - this._valueMin()) % e,
          s = t - i;
        return (
          2 * Math.abs(i) >= e && (s += 0 < i ? e : -e),
          parseFloat(s.toFixed(5))
        );
      },
      _calculateNewMax: function() {
        var t = this.options.max,
          e = this._valueMin(),
          i = this.options.step;
        (t = Math.round((t - e) / i) * i + e) > this.options.max && (t -= i),
          (this.max = parseFloat(t.toFixed(this._precision())));
      },
      _precision: function() {
        var t = this._precisionOf(this.options.step);
        return (
          null !== this.options.min &&
            (t = Math.max(t, this._precisionOf(this.options.min))),
          t
        );
      },
      _precisionOf: function(t) {
        var e = t.toString(),
          i = e.indexOf('.');
        return -1 === i ? 0 : e.length - i - 1;
      },
      _valueMin: function() {
        return this.options.min;
      },
      _valueMax: function() {
        return this.max;
      },
      _refreshRange: function(t) {
        'vertical' === t && this.range.css({ width: '', left: '' }),
          'horizontal' === t && this.range.css({ height: '', bottom: '' });
      },
      _refreshValue: function() {
        var e,
          i,
          t,
          s,
          n,
          o = this.options.range,
          a = this.options,
          r = this,
          h = !this._animateOff && a.animate,
          l = {};
        this._hasMultipleValues()
          ? this.handles.each(function(t) {
              (i =
                ((r.values(t) - r._valueMin()) /
                  (r._valueMax() - r._valueMin())) *
                100),
                (l['horizontal' === r.orientation ? 'left' : 'bottom'] =
                  i + '%'),
                x(this)
                  .stop(1, 1)
                  [h ? 'animate' : 'css'](l, a.animate),
                !0 === r.options.range &&
                  ('horizontal' === r.orientation
                    ? (0 === t &&
                        r.range
                          .stop(1, 1)
                          [h ? 'animate' : 'css']({ left: i + '%' }, a.animate),
                      1 === t &&
                        r.range[h ? 'animate' : 'css'](
                          { width: i - e + '%' },
                          { queue: !1, duration: a.animate }
                        ))
                    : (0 === t &&
                        r.range
                          .stop(1, 1)
                          [h ? 'animate' : 'css'](
                            { bottom: i + '%' },
                            a.animate
                          ),
                      1 === t &&
                        r.range[h ? 'animate' : 'css'](
                          { height: i - e + '%' },
                          { queue: !1, duration: a.animate }
                        ))),
                (e = i);
            })
          : ((t = this.value()),
            (s = this._valueMin()),
            (n = this._valueMax()),
            (i = n !== s ? ((t - s) / (n - s)) * 100 : 0),
            (l['horizontal' === this.orientation ? 'left' : 'bottom'] =
              i + '%'),
            this.handle.stop(1, 1)[h ? 'animate' : 'css'](l, a.animate),
            'min' === o &&
              'horizontal' === this.orientation &&
              this.range
                .stop(1, 1)
                [h ? 'animate' : 'css']({ width: i + '%' }, a.animate),
            'max' === o &&
              'horizontal' === this.orientation &&
              this.range
                .stop(1, 1)
                [h ? 'animate' : 'css']({ width: 100 - i + '%' }, a.animate),
            'min' === o &&
              'vertical' === this.orientation &&
              this.range
                .stop(1, 1)
                [h ? 'animate' : 'css']({ height: i + '%' }, a.animate),
            'max' === o &&
              'vertical' === this.orientation &&
              this.range
                .stop(1, 1)
                [h ? 'animate' : 'css']({ height: 100 - i + '%' }, a.animate));
      },
      _handleEvents: {
        keydown: function(t) {
          var e,
            i,
            s,
            n = x(t.target).data('ui-slider-handle-index');
          switch (t.keyCode) {
            case x.ui.keyCode.HOME:
            case x.ui.keyCode.END:
            case x.ui.keyCode.PAGE_UP:
            case x.ui.keyCode.PAGE_DOWN:
            case x.ui.keyCode.UP:
            case x.ui.keyCode.RIGHT:
            case x.ui.keyCode.DOWN:
            case x.ui.keyCode.LEFT:
              if (
                (t.preventDefault(),
                !this._keySliding &&
                  ((this._keySliding = !0),
                  this._addClass(x(t.target), null, 'ui-state-active'),
                  !1 === this._start(t, n)))
              )
                return;
          }
          switch (
            ((s = this.options.step),
            (e = i = this._hasMultipleValues() ? this.values(n) : this.value()),
            t.keyCode)
          ) {
            case x.ui.keyCode.HOME:
              i = this._valueMin();
              break;
            case x.ui.keyCode.END:
              i = this._valueMax();
              break;
            case x.ui.keyCode.PAGE_UP:
              i = this._trimAlignValue(
                e + (this._valueMax() - this._valueMin()) / this.numPages
              );
              break;
            case x.ui.keyCode.PAGE_DOWN:
              i = this._trimAlignValue(
                e - (this._valueMax() - this._valueMin()) / this.numPages
              );
              break;
            case x.ui.keyCode.UP:
            case x.ui.keyCode.RIGHT:
              if (e === this._valueMax()) return;
              i = this._trimAlignValue(e + s);
              break;
            case x.ui.keyCode.DOWN:
            case x.ui.keyCode.LEFT:
              if (e === this._valueMin()) return;
              i = this._trimAlignValue(e - s);
          }
          this._slide(t, n, i);
        },
        keyup: function(t) {
          var e = x(t.target).data('ui-slider-handle-index');
          this._keySliding &&
            ((this._keySliding = !1),
            this._stop(t, e),
            this._change(t, e),
            this._removeClass(x(t.target), null, 'ui-state-active'));
        }
      }
    });
  function P(e) {
    return function() {
      var t = this.element.val();
      e.apply(this, arguments),
        this._refresh(),
        t !== this.element.val() && this._trigger('change');
    };
  }
  x.widget('ui.spinner', {
    version: '1.12.1',
    defaultElement: '<input>',
    widgetEventPrefix: 'spin',
    options: {
      classes: {
        'ui-spinner': 'ui-corner-all',
        'ui-spinner-down': 'ui-corner-br',
        'ui-spinner-up': 'ui-corner-tr'
      },
      culture: null,
      icons: { down: 'ui-icon-triangle-1-s', up: 'ui-icon-triangle-1-n' },
      incremental: !0,
      max: null,
      min: null,
      numberFormat: null,
      page: 10,
      step: 1,
      change: null,
      spin: null,
      start: null,
      stop: null
    },
    _create: function() {
      this._setOption('max', this.options.max),
        this._setOption('min', this.options.min),
        this._setOption('step', this.options.step),
        '' !== this.value() && this._value(this.element.val(), !0),
        this._draw(),
        this._on(this._events),
        this._refresh(),
        this._on(this.window, {
          beforeunload: function() {
            this.element.removeAttr('autocomplete');
          }
        });
    },
    _getCreateOptions: function() {
      var s = this._super(),
        n = this.element;
      return (
        x.each(['min', 'max', 'step'], function(t, e) {
          var i = n.attr(e);
          null != i && i.length && (s[e] = i);
        }),
        s
      );
    },
    _events: {
      keydown: function(t) {
        this._start(t) && this._keydown(t) && t.preventDefault();
      },
      keyup: '_stop',
      focus: function() {
        this.previous = this.element.val();
      },
      blur: function(t) {
        this.cancelBlur
          ? delete this.cancelBlur
          : (this._stop(),
            this._refresh(),
            this.previous !== this.element.val() && this._trigger('change', t));
      },
      mousewheel: function(t, e) {
        if (e) {
          if (!this.spinning && !this._start(t)) return !1;
          this._spin((0 < e ? 1 : -1) * this.options.step, t),
            clearTimeout(this.mousewheelTimer),
            (this.mousewheelTimer = this._delay(function() {
              this.spinning && this._stop(t);
            }, 100)),
            t.preventDefault();
        }
      },
      'mousedown .ui-spinner-button': function(t) {
        var e;
        function i() {
          this.element[0] === x.ui.safeActiveElement(this.document[0]) ||
            (this.element.trigger('focus'),
            (this.previous = e),
            this._delay(function() {
              this.previous = e;
            }));
        }
        (e =
          this.element[0] === x.ui.safeActiveElement(this.document[0])
            ? this.previous
            : this.element.val()),
          t.preventDefault(),
          i.call(this),
          (this.cancelBlur = !0),
          this._delay(function() {
            delete this.cancelBlur, i.call(this);
          }),
          !1 !== this._start(t) &&
            this._repeat(
              null,
              x(t.currentTarget).hasClass('ui-spinner-up') ? 1 : -1,
              t
            );
      },
      'mouseup .ui-spinner-button': '_stop',
      'mouseenter .ui-spinner-button': function(t) {
        if (x(t.currentTarget).hasClass('ui-state-active'))
          return (
            !1 !== this._start(t) &&
            void this._repeat(
              null,
              x(t.currentTarget).hasClass('ui-spinner-up') ? 1 : -1,
              t
            )
          );
      },
      'mouseleave .ui-spinner-button': '_stop'
    },
    _enhance: function() {
      this.uiSpinner = this.element
        .attr('autocomplete', 'off')
        .wrap('<span>')
        .parent()
        .append('<a></a><a></a>');
    },
    _draw: function() {
      this._enhance(),
        this._addClass(
          this.uiSpinner,
          'ui-spinner',
          'ui-widget ui-widget-content'
        ),
        this._addClass('ui-spinner-input'),
        this.element.attr('role', 'spinbutton'),
        (this.buttons = this.uiSpinner
          .children('a')
          .attr('tabIndex', -1)
          .attr('aria-hidden', !0)
          .button({ classes: { 'ui-button': '' } })),
        this._removeClass(this.buttons, 'ui-corner-all'),
        this._addClass(this.buttons.first(), 'ui-spinner-button ui-spinner-up'),
        this._addClass(
          this.buttons.last(),
          'ui-spinner-button ui-spinner-down'
        ),
        this.buttons
          .first()
          .button({ icon: this.options.icons.up, showLabel: !1 }),
        this.buttons
          .last()
          .button({ icon: this.options.icons.down, showLabel: !1 }),
        this.buttons.height() > Math.ceil(0.5 * this.uiSpinner.height()) &&
          0 < this.uiSpinner.height() &&
          this.uiSpinner.height(this.uiSpinner.height());
    },
    _keydown: function(t) {
      var e = this.options,
        i = x.ui.keyCode;
      switch (t.keyCode) {
        case i.UP:
          return this._repeat(null, 1, t), !0;
        case i.DOWN:
          return this._repeat(null, -1, t), !0;
        case i.PAGE_UP:
          return this._repeat(null, e.page, t), !0;
        case i.PAGE_DOWN:
          return this._repeat(null, -e.page, t), !0;
      }
      return !1;
    },
    _start: function(t) {
      return (
        !(!this.spinning && !1 === this._trigger('start', t)) &&
        (this.counter || (this.counter = 1), (this.spinning = !0))
      );
    },
    _repeat: function(t, e, i) {
      (t = t || 500),
        clearTimeout(this.timer),
        (this.timer = this._delay(function() {
          this._repeat(40, e, i);
        }, t)),
        this._spin(e * this.options.step, i);
    },
    _spin: function(t, e) {
      var i = this.value() || 0;
      this.counter || (this.counter = 1),
        (i = this._adjustValue(i + t * this._increment(this.counter))),
        (this.spinning && !1 === this._trigger('spin', e, { value: i })) ||
          (this._value(i), this.counter++);
    },
    _increment: function(t) {
      var e = this.options.incremental;
      return e
        ? x.isFunction(e)
          ? e(t)
          : Math.floor((t * t * t) / 5e4 - (t * t) / 500 + (17 * t) / 200 + 1)
        : 1;
    },
    _precision: function() {
      var t = this._precisionOf(this.options.step);
      return (
        null !== this.options.min &&
          (t = Math.max(t, this._precisionOf(this.options.min))),
        t
      );
    },
    _precisionOf: function(t) {
      var e = t.toString(),
        i = e.indexOf('.');
      return -1 === i ? 0 : e.length - i - 1;
    },
    _adjustValue: function(t) {
      var e,
        i,
        s = this.options;
      return (
        (i = t - (e = null !== s.min ? s.min : 0)),
        (t = e + (i = Math.round(i / s.step) * s.step)),
        (t = parseFloat(t.toFixed(this._precision()))),
        null !== s.max && t > s.max
          ? s.max
          : null !== s.min && t < s.min
          ? s.min
          : t
      );
    },
    _stop: function(t) {
      this.spinning &&
        (clearTimeout(this.timer),
        clearTimeout(this.mousewheelTimer),
        (this.counter = 0),
        (this.spinning = !1),
        this._trigger('stop', t));
    },
    _setOption: function(t, e) {
      var i, s, n;
      if ('culture' === t || 'numberFormat' === t)
        return (
          (i = this._parse(this.element.val())),
          (this.options[t] = e),
          void this.element.val(this._format(i))
        );
      ('max' !== t && 'min' !== t && 'step' !== t) ||
        ('string' == typeof e && (e = this._parse(e))),
        'icons' === t &&
          ((s = this.buttons.first().find('.ui-icon')),
          this._removeClass(s, null, this.options.icons.up),
          this._addClass(s, null, e.up),
          (n = this.buttons.last().find('.ui-icon')),
          this._removeClass(n, null, this.options.icons.down),
          this._addClass(n, null, e.down)),
        this._super(t, e);
    },
    _setOptionDisabled: function(t) {
      this._super(t),
        this._toggleClass(this.uiSpinner, null, 'ui-state-disabled', !!t),
        this.element.prop('disabled', !!t),
        this.buttons.button(t ? 'disable' : 'enable');
    },
    _setOptions: P(function(t) {
      this._super(t);
    }),
    _parse: function(t) {
      return (
        'string' == typeof t &&
          '' !== t &&
          (t =
            window.Globalize && this.options.numberFormat
              ? Globalize.parseFloat(t, 10, this.options.culture)
              : +t),
        '' === t || isNaN(t) ? null : t
      );
    },
    _format: function(t) {
      return '' === t
        ? ''
        : window.Globalize && this.options.numberFormat
        ? Globalize.format(t, this.options.numberFormat, this.options.culture)
        : t;
    },
    _refresh: function() {
      this.element.attr({
        'aria-valuemin': this.options.min,
        'aria-valuemax': this.options.max,
        'aria-valuenow': this._parse(this.element.val())
      });
    },
    isValid: function() {
      var t = this.value();
      return null !== t && t === this._adjustValue(t);
    },
    _value: function(t, e) {
      var i;
      '' !== t &&
        null !== (i = this._parse(t)) &&
        (e || (i = this._adjustValue(i)), (t = this._format(i))),
        this.element.val(t),
        this._refresh();
    },
    _destroy: function() {
      this.element
        .prop('disabled', !1)
        .removeAttr(
          'autocomplete role aria-valuemin aria-valuemax aria-valuenow'
        ),
        this.uiSpinner.replaceWith(this.element);
    },
    stepUp: P(function(t) {
      this._stepUp(t);
    }),
    _stepUp: function(t) {
      this._start() && (this._spin((t || 1) * this.options.step), this._stop());
    },
    stepDown: P(function(t) {
      this._stepDown(t);
    }),
    _stepDown: function(t) {
      this._start() &&
        (this._spin((t || 1) * -this.options.step), this._stop());
    },
    pageUp: P(function(t) {
      this._stepUp((t || 1) * this.options.page);
    }),
    pageDown: P(function(t) {
      this._stepDown((t || 1) * this.options.page);
    }),
    value: function(t) {
      if (!arguments.length) return this._parse(this.element.val());
      P(this._value).call(this, t);
    },
    widget: function() {
      return this.uiSpinner;
    }
  }),
    !1 !== x.uiBackCompat &&
      x.widget('ui.spinner', x.ui.spinner, {
        _enhance: function() {
          this.uiSpinner = this.element
            .attr('autocomplete', 'off')
            .wrap(this._uiSpinnerHtml())
            .parent()
            .append(this._buttonHtml());
        },
        _uiSpinnerHtml: function() {
          return '<span>';
        },
        _buttonHtml: function() {
          return '<a></a><a></a>';
        }
      });
  var M;
  x.ui.spinner;
  x.widget('ui.tabs', {
    version: '1.12.1',
    delay: 300,
    options: {
      active: null,
      classes: {
        'ui-tabs': 'ui-corner-all',
        'ui-tabs-nav': 'ui-corner-all',
        'ui-tabs-panel': 'ui-corner-bottom',
        'ui-tabs-tab': 'ui-corner-top'
      },
      collapsible: !1,
      event: 'click',
      heightStyle: 'content',
      hide: null,
      show: null,
      activate: null,
      beforeActivate: null,
      beforeLoad: null,
      load: null
    },
    _isLocal:
      ((M = /#.*$/),
      function(t) {
        var e, i;
        (e = t.href.replace(M, '')), (i = location.href.replace(M, ''));
        try {
          e = decodeURIComponent(e);
        } catch (t) {}
        try {
          i = decodeURIComponent(i);
        } catch (t) {}
        return 1 < t.hash.length && e === i;
      }),
    _create: function() {
      var e = this,
        t = this.options;
      (this.running = !1),
        this._addClass('ui-tabs', 'ui-widget ui-widget-content'),
        this._toggleClass('ui-tabs-collapsible', null, t.collapsible),
        this._processTabs(),
        (t.active = this._initialActive()),
        x.isArray(t.disabled) &&
          (t.disabled = x
            .unique(
              t.disabled.concat(
                x.map(this.tabs.filter('.ui-state-disabled'), function(t) {
                  return e.tabs.index(t);
                })
              )
            )
            .sort()),
        !1 !== this.options.active && this.anchors.length
          ? (this.active = this._findActive(t.active))
          : (this.active = x()),
        this._refresh(),
        this.active.length && this.load(t.active);
    },
    _initialActive: function() {
      var i = this.options.active,
        t = this.options.collapsible,
        s = location.hash.substring(1);
      return (
        null === i &&
          (s &&
            this.tabs.each(function(t, e) {
              if (x(e).attr('aria-controls') === s) return (i = t), !1;
            }),
          null === i &&
            (i = this.tabs.index(this.tabs.filter('.ui-tabs-active'))),
          (null !== i && -1 !== i) || (i = !!this.tabs.length && 0)),
        !1 !== i &&
          -1 === (i = this.tabs.index(this.tabs.eq(i))) &&
          (i = !t && 0),
        !t && !1 === i && this.anchors.length && (i = 0),
        i
      );
    },
    _getCreateEventData: function() {
      return {
        tab: this.active,
        panel: this.active.length ? this._getPanelForTab(this.active) : x()
      };
    },
    _tabKeydown: function(t) {
      var e = x(x.ui.safeActiveElement(this.document[0])).closest('li'),
        i = this.tabs.index(e),
        s = !0;
      if (!this._handlePageNav(t)) {
        switch (t.keyCode) {
          case x.ui.keyCode.RIGHT:
          case x.ui.keyCode.DOWN:
            i++;
            break;
          case x.ui.keyCode.UP:
          case x.ui.keyCode.LEFT:
            (s = !1), i--;
            break;
          case x.ui.keyCode.END:
            i = this.anchors.length - 1;
            break;
          case x.ui.keyCode.HOME:
            i = 0;
            break;
          case x.ui.keyCode.SPACE:
            return (
              t.preventDefault(),
              clearTimeout(this.activating),
              void this._activate(i)
            );
          case x.ui.keyCode.ENTER:
            return (
              t.preventDefault(),
              clearTimeout(this.activating),
              void this._activate(i !== this.options.active && i)
            );
          default:
            return;
        }
        t.preventDefault(),
          clearTimeout(this.activating),
          (i = this._focusNextTab(i, s)),
          t.ctrlKey ||
            t.metaKey ||
            (e.attr('aria-selected', 'false'),
            this.tabs.eq(i).attr('aria-selected', 'true'),
            (this.activating = this._delay(function() {
              this.option('active', i);
            }, this.delay)));
      }
    },
    _panelKeydown: function(t) {
      this._handlePageNav(t) ||
        (t.ctrlKey &&
          t.keyCode === x.ui.keyCode.UP &&
          (t.preventDefault(), this.active.trigger('focus')));
    },
    _handlePageNav: function(t) {
      return t.altKey && t.keyCode === x.ui.keyCode.PAGE_UP
        ? (this._activate(this._focusNextTab(this.options.active - 1, !1)), !0)
        : t.altKey && t.keyCode === x.ui.keyCode.PAGE_DOWN
        ? (this._activate(this._focusNextTab(this.options.active + 1, !0)), !0)
        : void 0;
    },
    _findNextTab: function(t, e) {
      var i = this.tabs.length - 1;
      for (
        ;
        -1 !==
        x.inArray(
          (i < t && (t = 0), t < 0 && (t = i), t),
          this.options.disabled
        );

      )
        t = e ? t + 1 : t - 1;
      return t;
    },
    _focusNextTab: function(t, e) {
      return (t = this._findNextTab(t, e)), this.tabs.eq(t).trigger('focus'), t;
    },
    _setOption: function(t, e) {
      'active' !== t
        ? (this._super(t, e),
          'collapsible' === t &&
            (this._toggleClass('ui-tabs-collapsible', null, e),
            e || !1 !== this.options.active || this._activate(0)),
          'event' === t && this._setupEvents(e),
          'heightStyle' === t && this._setupHeightStyle(e))
        : this._activate(e);
    },
    _sanitizeSelector: function(t) {
      return t ? t.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, '\\$&') : '';
    },
    refresh: function() {
      var t = this.options,
        e = this.tablist.children(':has(a[href])');
      (t.disabled = x.map(e.filter('.ui-state-disabled'), function(t) {
        return e.index(t);
      })),
        this._processTabs(),
        !1 !== t.active && this.anchors.length
          ? this.active.length && !x.contains(this.tablist[0], this.active[0])
            ? this.tabs.length === t.disabled.length
              ? ((t.active = !1), (this.active = x()))
              : this._activate(this._findNextTab(Math.max(0, t.active - 1), !1))
            : (t.active = this.tabs.index(this.active))
          : ((t.active = !1), (this.active = x())),
        this._refresh();
    },
    _refresh: function() {
      this._setOptionDisabled(this.options.disabled),
        this._setupEvents(this.options.event),
        this._setupHeightStyle(this.options.heightStyle),
        this.tabs
          .not(this.active)
          .attr({
            'aria-selected': 'false',
            'aria-expanded': 'false',
            tabIndex: -1
          }),
        this.panels
          .not(this._getPanelForTab(this.active))
          .hide()
          .attr({ 'aria-hidden': 'true' }),
        this.active.length
          ? (this.active.attr({
              'aria-selected': 'true',
              'aria-expanded': 'true',
              tabIndex: 0
            }),
            this._addClass(this.active, 'ui-tabs-active', 'ui-state-active'),
            this._getPanelForTab(this.active)
              .show()
              .attr({ 'aria-hidden': 'false' }))
          : this.tabs.eq(0).attr('tabIndex', 0);
    },
    _processTabs: function() {
      var h = this,
        t = this.tabs,
        e = this.anchors,
        i = this.panels;
      (this.tablist = this._getList().attr('role', 'tablist')),
        this._addClass(
          this.tablist,
          'ui-tabs-nav',
          'ui-helper-reset ui-helper-clearfix ui-widget-header'
        ),
        this.tablist
          .on('mousedown' + this.eventNamespace, '> li', function(t) {
            x(this).is('.ui-state-disabled') && t.preventDefault();
          })
          .on('focus' + this.eventNamespace, '.ui-tabs-anchor', function() {
            x(this)
              .closest('li')
              .is('.ui-state-disabled') && this.blur();
          }),
        (this.tabs = this.tablist
          .find('> li:has(a[href])')
          .attr({ role: 'tab', tabIndex: -1 })),
        this._addClass(this.tabs, 'ui-tabs-tab', 'ui-state-default'),
        (this.anchors = this.tabs
          .map(function() {
            return x('a', this)[0];
          })
          .attr({ role: 'presentation', tabIndex: -1 })),
        this._addClass(this.anchors, 'ui-tabs-anchor'),
        (this.panels = x()),
        this.anchors.each(function(t, e) {
          var i,
            s,
            n,
            o = x(e)
              .uniqueId()
              .attr('id'),
            a = x(e).closest('li'),
            r = a.attr('aria-controls');
          h._isLocal(e)
            ? ((n = (i = e.hash).substring(1)),
              (s = h.element.find(h._sanitizeSelector(i))))
            : ((i =
                '#' + (n = a.attr('aria-controls') || x({}).uniqueId()[0].id)),
              (s = h.element.find(i)).length ||
                (s = h._createPanel(n)).insertAfter(
                  h.panels[t - 1] || h.tablist
                ),
              s.attr('aria-live', 'polite')),
            s.length && (h.panels = h.panels.add(s)),
            r && a.data('ui-tabs-aria-controls', r),
            a.attr({ 'aria-controls': n, 'aria-labelledby': o }),
            s.attr('aria-labelledby', o);
        }),
        this.panels.attr('role', 'tabpanel'),
        this._addClass(this.panels, 'ui-tabs-panel', 'ui-widget-content'),
        t &&
          (this._off(t.not(this.tabs)),
          this._off(e.not(this.anchors)),
          this._off(i.not(this.panels)));
    },
    _getList: function() {
      return this.tablist || this.element.find('ol, ul').eq(0);
    },
    _createPanel: function(t) {
      return x('<div>')
        .attr('id', t)
        .data('ui-tabs-destroy', !0);
    },
    _setOptionDisabled: function(t) {
      var e, i, s;
      for (
        x.isArray(t) &&
          (t.length ? t.length === this.anchors.length && (t = !0) : (t = !1)),
          s = 0;
        (i = this.tabs[s]);
        s++
      )
        (e = x(i)),
          !0 === t || -1 !== x.inArray(s, t)
            ? (e.attr('aria-disabled', 'true'),
              this._addClass(e, null, 'ui-state-disabled'))
            : (e.removeAttr('aria-disabled'),
              this._removeClass(e, null, 'ui-state-disabled'));
      (this.options.disabled = t),
        this._toggleClass(
          this.widget(),
          this.widgetFullName + '-disabled',
          null,
          !0 === t
        );
    },
    _setupEvents: function(t) {
      var i = {};
      t &&
        x.each(t.split(' '), function(t, e) {
          i[e] = '_eventHandler';
        }),
        this._off(this.anchors.add(this.tabs).add(this.panels)),
        this._on(!0, this.anchors, {
          click: function(t) {
            t.preventDefault();
          }
        }),
        this._on(this.anchors, i),
        this._on(this.tabs, { keydown: '_tabKeydown' }),
        this._on(this.panels, { keydown: '_panelKeydown' }),
        this._focusable(this.tabs),
        this._hoverable(this.tabs);
    },
    _setupHeightStyle: function(t) {
      var i,
        e = this.element.parent();
      'fill' === t
        ? ((i = e.height()),
          (i -= this.element.outerHeight() - this.element.height()),
          this.element.siblings(':visible').each(function() {
            var t = x(this),
              e = t.css('position');
            'absolute' !== e && 'fixed' !== e && (i -= t.outerHeight(!0));
          }),
          this.element
            .children()
            .not(this.panels)
            .each(function() {
              i -= x(this).outerHeight(!0);
            }),
          this.panels
            .each(function() {
              x(this).height(
                Math.max(0, i - x(this).innerHeight() + x(this).height())
              );
            })
            .css('overflow', 'auto'))
        : 'auto' === t &&
          ((i = 0),
          this.panels
            .each(function() {
              i = Math.max(
                i,
                x(this)
                  .height('')
                  .height()
              );
            })
            .height(i));
    },
    _eventHandler: function(t) {
      var e = this.options,
        i = this.active,
        s = x(t.currentTarget).closest('li'),
        n = s[0] === i[0],
        o = n && e.collapsible,
        a = o ? x() : this._getPanelForTab(s),
        r = i.length ? this._getPanelForTab(i) : x(),
        h = { oldTab: i, oldPanel: r, newTab: o ? x() : s, newPanel: a };
      t.preventDefault(),
        s.hasClass('ui-state-disabled') ||
          s.hasClass('ui-tabs-loading') ||
          this.running ||
          (n && !e.collapsible) ||
          !1 === this._trigger('beforeActivate', t, h) ||
          ((e.active = !o && this.tabs.index(s)),
          (this.active = n ? x() : s),
          this.xhr && this.xhr.abort(),
          r.length ||
            a.length ||
            x.error('jQuery UI Tabs: Mismatching fragment identifier.'),
          a.length && this.load(this.tabs.index(s), t),
          this._toggle(t, h));
    },
    _toggle: function(t, e) {
      var i = this,
        s = e.newPanel,
        n = e.oldPanel;
      function o() {
        (i.running = !1), i._trigger('activate', t, e);
      }
      function a() {
        i._addClass(
          e.newTab.closest('li'),
          'ui-tabs-active',
          'ui-state-active'
        ),
          s.length && i.options.show
            ? i._show(s, i.options.show, o)
            : (s.show(), o());
      }
      (this.running = !0),
        n.length && this.options.hide
          ? this._hide(n, this.options.hide, function() {
              i._removeClass(
                e.oldTab.closest('li'),
                'ui-tabs-active',
                'ui-state-active'
              ),
                a();
            })
          : (this._removeClass(
              e.oldTab.closest('li'),
              'ui-tabs-active',
              'ui-state-active'
            ),
            n.hide(),
            a()),
        n.attr('aria-hidden', 'true'),
        e.oldTab.attr({ 'aria-selected': 'false', 'aria-expanded': 'false' }),
        s.length && n.length
          ? e.oldTab.attr('tabIndex', -1)
          : s.length &&
            this.tabs
              .filter(function() {
                return 0 === x(this).attr('tabIndex');
              })
              .attr('tabIndex', -1),
        s.attr('aria-hidden', 'false'),
        e.newTab.attr({
          'aria-selected': 'true',
          'aria-expanded': 'true',
          tabIndex: 0
        });
    },
    _activate: function(t) {
      var e,
        i = this._findActive(t);
      i[0] !== this.active[0] &&
        (i.length || (i = this.active),
        (e = i.find('.ui-tabs-anchor')[0]),
        this._eventHandler({
          target: e,
          currentTarget: e,
          preventDefault: x.noop
        }));
    },
    _findActive: function(t) {
      return !1 === t ? x() : this.tabs.eq(t);
    },
    _getIndex: function(t) {
      return (
        'string' == typeof t &&
          (t = this.anchors.index(
            this.anchors.filter("[href$='" + x.ui.escapeSelector(t) + "']")
          )),
        t
      );
    },
    _destroy: function() {
      this.xhr && this.xhr.abort(),
        this.tablist.removeAttr('role').off(this.eventNamespace),
        this.anchors.removeAttr('role tabIndex').removeUniqueId(),
        this.tabs.add(this.panels).each(function() {
          x.data(this, 'ui-tabs-destroy')
            ? x(this).remove()
            : x(this).removeAttr(
                'role tabIndex aria-live aria-busy aria-selected aria-labelledby aria-hidden aria-expanded'
              );
        }),
        this.tabs.each(function() {
          var t = x(this),
            e = t.data('ui-tabs-aria-controls');
          e
            ? t.attr('aria-controls', e).removeData('ui-tabs-aria-controls')
            : t.removeAttr('aria-controls');
        }),
        this.panels.show(),
        'content' !== this.options.heightStyle && this.panels.css('height', '');
    },
    enable: function(i) {
      var t = this.options.disabled;
      !1 !== t &&
        ((t =
          void 0 !== i &&
          ((i = this._getIndex(i)),
          x.isArray(t)
            ? x.map(t, function(t) {
                return t !== i ? t : null;
              })
            : x.map(this.tabs, function(t, e) {
                return e !== i ? e : null;
              }))),
        this._setOptionDisabled(t));
    },
    disable: function(t) {
      var e = this.options.disabled;
      if (!0 !== e) {
        if (void 0 === t) e = !0;
        else {
          if (((t = this._getIndex(t)), -1 !== x.inArray(t, e))) return;
          e = x.isArray(e) ? x.merge([t], e).sort() : [t];
        }
        this._setOptionDisabled(e);
      }
    },
    load: function(t, s) {
      t = this._getIndex(t);
      function n(t, e) {
        'abort' === e && o.panels.stop(!1, !0),
          o._removeClass(i, 'ui-tabs-loading'),
          a.removeAttr('aria-busy'),
          t === o.xhr && delete o.xhr;
      }
      var o = this,
        i = this.tabs.eq(t),
        e = i.find('.ui-tabs-anchor'),
        a = this._getPanelForTab(i),
        r = { tab: i, panel: a };
      this._isLocal(e[0]) ||
        ((this.xhr = x.ajax(this._ajaxSettings(e, s, r))),
        this.xhr &&
          'canceled' !== this.xhr.statusText &&
          (this._addClass(i, 'ui-tabs-loading'),
          a.attr('aria-busy', 'true'),
          this.xhr
            .done(function(t, e, i) {
              setTimeout(function() {
                a.html(t), o._trigger('load', s, r), n(i, e);
              }, 1);
            })
            .fail(function(t, e) {
              setTimeout(function() {
                n(t, e);
              }, 1);
            })));
    },
    _ajaxSettings: function(t, i, s) {
      var n = this;
      return {
        url: t.attr('href').replace(/#.*$/, ''),
        beforeSend: function(t, e) {
          return n._trigger(
            'beforeLoad',
            i,
            x.extend({ jqXHR: t, ajaxSettings: e }, s)
          );
        }
      };
    },
    _getPanelForTab: function(t) {
      var e = x(t).attr('aria-controls');
      return this.element.find(this._sanitizeSelector('#' + e));
    }
  }),
    !1 !== x.uiBackCompat &&
      x.widget('ui.tabs', x.ui.tabs, {
        _processTabs: function() {
          this._superApply(arguments), this._addClass(this.tabs, 'ui-tab');
        }
      });
  x.ui.tabs;
  x.widget('ui.tooltip', {
    version: '1.12.1',
    options: {
      classes: { 'ui-tooltip': 'ui-corner-all ui-widget-shadow' },
      content: function() {
        var t = x(this).attr('title') || '';
        return x('<a>')
          .text(t)
          .html();
      },
      hide: !0,
      items: '[title]:not([disabled])',
      position: {
        my: 'left top+15',
        at: 'left bottom',
        collision: 'flipfit flip'
      },
      show: !0,
      track: !1,
      close: null,
      open: null
    },
    _addDescribedBy: function(t, e) {
      var i = (t.attr('aria-describedby') || '').split(/\s+/);
      i.push(e),
        t
          .data('ui-tooltip-id', e)
          .attr('aria-describedby', x.trim(i.join(' ')));
    },
    _removeDescribedBy: function(t) {
      var e = t.data('ui-tooltip-id'),
        i = (t.attr('aria-describedby') || '').split(/\s+/),
        s = x.inArray(e, i);
      -1 !== s && i.splice(s, 1),
        t.removeData('ui-tooltip-id'),
        (i = x.trim(i.join(' ')))
          ? t.attr('aria-describedby', i)
          : t.removeAttr('aria-describedby');
    },
    _create: function() {
      this._on({ mouseover: 'open', focusin: 'open' }),
        (this.tooltips = {}),
        (this.parents = {}),
        (this.liveRegion = x('<div>')
          .attr({
            role: 'log',
            'aria-live': 'assertive',
            'aria-relevant': 'additions'
          })
          .appendTo(this.document[0].body)),
        this._addClass(this.liveRegion, null, 'ui-helper-hidden-accessible'),
        (this.disabledTitles = x([]));
    },
    _setOption: function(t, e) {
      var i = this;
      this._super(t, e),
        'content' === t &&
          x.each(this.tooltips, function(t, e) {
            i._updateContent(e.element);
          });
    },
    _setOptionDisabled: function(t) {
      this[t ? '_disable' : '_enable']();
    },
    _disable: function() {
      var s = this;
      x.each(this.tooltips, function(t, e) {
        var i = x.Event('blur');
        (i.target = i.currentTarget = e.element[0]), s.close(i, !0);
      }),
        (this.disabledTitles = this.disabledTitles.add(
          this.element
            .find(this.options.items)
            .addBack()
            .filter(function() {
              var t = x(this);
              if (t.is('[title]'))
                return t
                  .data('ui-tooltip-title', t.attr('title'))
                  .removeAttr('title');
            })
        ));
    },
    _enable: function() {
      this.disabledTitles.each(function() {
        var t = x(this);
        t.data('ui-tooltip-title') &&
          t.attr('title', t.data('ui-tooltip-title'));
      }),
        (this.disabledTitles = x([]));
    },
    open: function(t) {
      var i = this,
        e = x(t ? t.target : this.element).closest(this.options.items);
      e.length &&
        !e.data('ui-tooltip-id') &&
        (e.attr('title') && e.data('ui-tooltip-title', e.attr('title')),
        e.data('ui-tooltip-open', !0),
        t &&
          'mouseover' === t.type &&
          e.parents().each(function() {
            var t,
              e = x(this);
            e.data('ui-tooltip-open') &&
              (((t = x.Event('blur')).target = t.currentTarget = this),
              i.close(t, !0)),
              e.attr('title') &&
                (e.uniqueId(),
                (i.parents[this.id] = {
                  element: this,
                  title: e.attr('title')
                }),
                e.attr('title', ''));
          }),
        this._registerCloseHandlers(t, e),
        this._updateContent(e, t));
    },
    _updateContent: function(e, i) {
      var t,
        s = this.options.content,
        n = this,
        o = i ? i.type : null;
      if ('string' == typeof s || s.nodeType || s.jquery)
        return this._open(i, e, s);
      (t = s.call(e[0], function(t) {
        n._delay(function() {
          e.data('ui-tooltip-open') && (i && (i.type = o), this._open(i, e, t));
        });
      })) && this._open(i, e, t);
    },
    _open: function(t, e, i) {
      var s,
        n,
        o,
        a,
        r = x.extend({}, this.options.position);
      function h(t) {
        (r.of = t), n.is(':hidden') || n.position(r);
      }
      i &&
        ((s = this._find(e))
          ? s.tooltip.find('.ui-tooltip-content').html(i)
          : (e.is('[title]') &&
              (t && 'mouseover' === t.type
                ? e.attr('title', '')
                : e.removeAttr('title')),
            (s = this._tooltip(e)),
            (n = s.tooltip),
            this._addDescribedBy(e, n.attr('id')),
            n.find('.ui-tooltip-content').html(i),
            this.liveRegion.children().hide(),
            (a = x('<div>').html(n.find('.ui-tooltip-content').html()))
              .removeAttr('name')
              .find('[name]')
              .removeAttr('name'),
            a
              .removeAttr('id')
              .find('[id]')
              .removeAttr('id'),
            a.appendTo(this.liveRegion),
            this.options.track && t && /^mouse/.test(t.type)
              ? (this._on(this.document, { mousemove: h }), h(t))
              : n.position(x.extend({ of: e }, this.options.position)),
            n.hide(),
            this._show(n, this.options.show),
            this.options.track &&
              this.options.show &&
              this.options.show.delay &&
              (o = this.delayedShow = setInterval(function() {
                n.is(':visible') && (h(r.of), clearInterval(o));
              }, x.fx.interval)),
            this._trigger('open', t, { tooltip: n })));
    },
    _registerCloseHandlers: function(t, i) {
      var e = {
        keyup: function(t) {
          if (t.keyCode === x.ui.keyCode.ESCAPE) {
            var e = x.Event(t);
            (e.currentTarget = i[0]), this.close(e, !0);
          }
        }
      };
      i[0] !== this.element[0] &&
        (e.remove = function() {
          this._removeTooltip(this._find(i).tooltip);
        }),
        (t && 'mouseover' !== t.type) || (e.mouseleave = 'close'),
        (t && 'focusin' !== t.type) || (e.focusout = 'close'),
        this._on(!0, i, e);
    },
    close: function(t) {
      var e,
        i = this,
        s = x(t ? t.currentTarget : this.element),
        n = this._find(s);
      n
        ? ((e = n.tooltip),
          n.closing ||
            (clearInterval(this.delayedShow),
            s.data('ui-tooltip-title') &&
              !s.attr('title') &&
              s.attr('title', s.data('ui-tooltip-title')),
            this._removeDescribedBy(s),
            (n.hiding = !0),
            e.stop(!0),
            this._hide(e, this.options.hide, function() {
              i._removeTooltip(x(this));
            }),
            s.removeData('ui-tooltip-open'),
            this._off(s, 'mouseleave focusout keyup'),
            s[0] !== this.element[0] && this._off(s, 'remove'),
            this._off(this.document, 'mousemove'),
            t &&
              'mouseleave' === t.type &&
              x.each(this.parents, function(t, e) {
                x(e.element).attr('title', e.title), delete i.parents[t];
              }),
            (n.closing = !0),
            this._trigger('close', t, { tooltip: e }),
            n.hiding || (n.closing = !1)))
        : s.removeData('ui-tooltip-open');
    },
    _tooltip: function(t) {
      var e = x('<div>').attr('role', 'tooltip'),
        i = x('<div>').appendTo(e),
        s = e.uniqueId().attr('id');
      return (
        this._addClass(i, 'ui-tooltip-content'),
        this._addClass(e, 'ui-tooltip', 'ui-widget ui-widget-content'),
        e.appendTo(this._appendTo(t)),
        (this.tooltips[s] = { element: t, tooltip: e })
      );
    },
    _find: function(t) {
      var e = t.data('ui-tooltip-id');
      return e ? this.tooltips[e] : null;
    },
    _removeTooltip: function(t) {
      t.remove(), delete this.tooltips[t.attr('id')];
    },
    _appendTo: function(t) {
      var e = t.closest('.ui-front, dialog');
      return e.length || (e = this.document[0].body), e;
    },
    _destroy: function() {
      var n = this;
      x.each(this.tooltips, function(t, e) {
        var i = x.Event('blur'),
          s = e.element;
        (i.target = i.currentTarget = s[0]),
          n.close(i, !0),
          x('#' + t).remove(),
          s.data('ui-tooltip-title') &&
            (s.attr('title') || s.attr('title', s.data('ui-tooltip-title')),
            s.removeData('ui-tooltip-title'));
      }),
        this.liveRegion.remove();
    }
  }),
    !1 !== x.uiBackCompat &&
      x.widget('ui.tooltip', x.ui.tooltip, {
        options: { tooltipClass: null },
        _tooltip: function() {
          var t = this._superApply(arguments);
          return (
            this.options.tooltipClass &&
              t.tooltip.addClass(this.options.tooltipClass),
            t
          );
        }
      });
  x.ui.tooltip;
  var S,
    H,
    z,
    O,
    A,
    N,
    W,
    E,
    F,
    L,
    R,
    B,
    Y,
    j,
    q,
    K,
    U,
    V,
    $,
    X,
    G,
    Q = 'ui-effects-',
    J = 'ui-effects-style',
    Z = 'ui-effects-animated',
    tt = x;
  function et(t, e, i) {
    var s = E[e.type] || {};
    return null == t
      ? i || !e.def
        ? null
        : e.def
      : ((t = s.floor ? ~~t : parseFloat(t)),
        isNaN(t)
          ? e.def
          : s.mod
          ? (t + s.mod) % s.mod
          : t < 0
          ? 0
          : s.max < t
          ? s.max
          : t);
  }
  function it(a) {
    var r = N(),
      h = (r._rgba = []);
    return (
      (a = a.toLowerCase()),
      R(A, function(t, e) {
        var i,
          s = e.re.exec(a),
          n = s && e.parse(s),
          o = e.space || 'rgba';
        if (n)
          return (
            (i = r[o](n)),
            (r[W[o].cache] = i[W[o].cache]),
            (h = r._rgba = i._rgba),
            !1
          );
      }),
      h.length
        ? ('0,0,0,0' === h.join() && S.extend(h, z.transparent), r)
        : z[a]
    );
  }
  function st(t, e, i) {
    return 6 * (i = (i + 1) % 1) < 1
      ? t + (e - t) * i * 6
      : 2 * i < 1
      ? e
      : 3 * i < 2
      ? t + (e - t) * (2 / 3 - i) * 6
      : t;
  }
  function nt(t) {
    var e,
      i,
      s = t.ownerDocument.defaultView
        ? t.ownerDocument.defaultView.getComputedStyle(t, null)
        : t.currentStyle,
      n = {};
    if (s && s.length && s[0] && s[s[0]])
      for (i = s.length; i--; )
        'string' == typeof s[(e = s[i])] && (n[x.camelCase(e)] = s[e]);
    else for (e in s) 'string' == typeof s[e] && (n[e] = s[e]);
    return n;
  }
  function ot(t, e, i, s) {
    return (
      x.isPlainObject(t) && (t = (e = t).effect),
      (t = { effect: t }),
      null == e && (e = {}),
      x.isFunction(e) && ((s = e), (i = null), (e = {})),
      ('number' != typeof e && !x.fx.speeds[e]) || ((s = i), (i = e), (e = {})),
      x.isFunction(i) && ((s = i), (i = null)),
      e && x.extend(t, e),
      (i = i || e.duration),
      (t.duration = x.fx.off
        ? 0
        : 'number' == typeof i
        ? i
        : i in x.fx.speeds
        ? x.fx.speeds[i]
        : x.fx.speeds._default),
      (t.complete = s || e.complete),
      t
    );
  }
  function at(t) {
    return (
      !t ||
      'number' == typeof t ||
      x.fx.speeds[t] ||
      ('string' == typeof t && !x.effects.effect[t]) ||
        x.isFunction(t) || ('object' == typeof t && !t.effect)
    );
  }
  function rt(t, e) {
    var i = e.outerWidth(),
      s = e.outerHeight(),
      n = /^rect\((-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto)\)$/.exec(
        t
      ) || ['', 0, i, s, 0];
    return {
      top: parseFloat(n[1]) || 0,
      right: 'auto' === n[2] ? i : parseFloat(n[2]),
      bottom: 'auto' === n[3] ? s : parseFloat(n[3]),
      left: parseFloat(n[4]) || 0
    };
  }
  (x.effects = { effect: {} }),
    (O = /^([\-+])=\s*(\d+\.?\d*)/),
    (A = [
      {
        re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
        parse: function(t) {
          return [t[1], t[2], t[3], t[4]];
        }
      },
      {
        re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
        parse: function(t) {
          return [2.55 * t[1], 2.55 * t[2], 2.55 * t[3], t[4]];
        }
      },
      {
        re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
        parse: function(t) {
          return [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)];
        }
      },
      {
        re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
        parse: function(t) {
          return [
            parseInt(t[1] + t[1], 16),
            parseInt(t[2] + t[2], 16),
            parseInt(t[3] + t[3], 16)
          ];
        }
      },
      {
        re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
        space: 'hsla',
        parse: function(t) {
          return [t[1], t[2] / 100, t[3] / 100, t[4]];
        }
      }
    ]),
    (N = (S = tt).Color = function(t, e, i, s) {
      return new S.Color.fn.parse(t, e, i, s);
    }),
    (W = {
      rgba: {
        props: {
          red: { idx: 0, type: 'byte' },
          green: { idx: 1, type: 'byte' },
          blue: { idx: 2, type: 'byte' }
        }
      },
      hsla: {
        props: {
          hue: { idx: 0, type: 'degrees' },
          saturation: { idx: 1, type: 'percent' },
          lightness: { idx: 2, type: 'percent' }
        }
      }
    }),
    (E = {
      byte: { floor: !0, max: 255 },
      percent: { max: 1 },
      degrees: { mod: 360, floor: !0 }
    }),
    (F = N.support = {}),
    (L = S('<p>')[0]),
    (R = S.each),
    (L.style.cssText = 'background-color:rgba(1,1,1,.5)'),
    (F.rgba = -1 < L.style.backgroundColor.indexOf('rgba')),
    R(W, function(t, e) {
      (e.cache = '_' + t),
        (e.props.alpha = { idx: 3, type: 'percent', def: 1 });
    }),
    (N.fn = S.extend(N.prototype, {
      parse: function(n, t, e, i) {
        if (n === H) return (this._rgba = [null, null, null, null]), this;
        (n.jquery || n.nodeType) && ((n = S(n).css(t)), (t = H));
        var o = this,
          s = S.type(n),
          a = (this._rgba = []);
        return (
          t !== H && ((n = [n, t, e, i]), (s = 'array')),
          'string' === s
            ? this.parse(it(n) || z._default)
            : 'array' === s
            ? (R(W.rgba.props, function(t, e) {
                a[e.idx] = et(n[e.idx], e);
              }),
              this)
            : 'object' === s
            ? (R(
                W,
                n instanceof N
                  ? function(t, e) {
                      n[e.cache] && (o[e.cache] = n[e.cache].slice());
                    }
                  : function(t, i) {
                      var s = i.cache;
                      R(i.props, function(t, e) {
                        if (!o[s] && i.to) {
                          if ('alpha' === t || null == n[t]) return;
                          o[s] = i.to(o._rgba);
                        }
                        o[s][e.idx] = et(n[t], e, !0);
                      }),
                        o[s] &&
                          S.inArray(null, o[s].slice(0, 3)) < 0 &&
                          ((o[s][3] = 1), i.from && (o._rgba = i.from(o[s])));
                    }
              ),
              this)
            : void 0
        );
      },
      is: function(t) {
        var n = N(t),
          o = !0,
          a = this;
        return (
          R(W, function(t, e) {
            var i,
              s = n[e.cache];
            return (
              s &&
                ((i = a[e.cache] || (e.to && e.to(a._rgba)) || []),
                R(e.props, function(t, e) {
                  if (null != s[e.idx]) return (o = s[e.idx] === i[e.idx]);
                })),
              o
            );
          }),
          o
        );
      },
      _space: function() {
        var i = [],
          s = this;
        return (
          R(W, function(t, e) {
            s[e.cache] && i.push(t);
          }),
          i.pop()
        );
      },
      transition: function(t, a) {
        var r = N(t),
          e = r._space(),
          i = W[e],
          s = 0 === this.alpha() ? N('transparent') : this,
          h = s[i.cache] || i.to(s._rgba),
          l = h.slice();
        return (
          (r = r[i.cache]),
          R(i.props, function(t, e) {
            var i = e.idx,
              s = h[i],
              n = r[i],
              o = E[e.type] || {};
            null !== n &&
              (null === s
                ? (l[i] = n)
                : (o.mod &&
                    (o.mod / 2 < n - s
                      ? (s += o.mod)
                      : o.mod / 2 < s - n && (s -= o.mod)),
                  (l[i] = et((n - s) * a + s, e))));
          }),
          this[e](l)
        );
      },
      blend: function(t) {
        if (1 === this._rgba[3]) return this;
        var e = this._rgba.slice(),
          i = e.pop(),
          s = N(t)._rgba;
        return N(
          S.map(e, function(t, e) {
            return (1 - i) * s[e] + i * t;
          })
        );
      },
      toRgbaString: function() {
        var t = 'rgba(',
          e = S.map(this._rgba, function(t, e) {
            return null == t ? (2 < e ? 1 : 0) : t;
          });
        return 1 === e[3] && (e.pop(), (t = 'rgb(')), t + e.join() + ')';
      },
      toHslaString: function() {
        var t = 'hsla(',
          e = S.map(this.hsla(), function(t, e) {
            return (
              null == t && (t = 2 < e ? 1 : 0),
              e && e < 3 && (t = Math.round(100 * t) + '%'),
              t
            );
          });
        return 1 === e[3] && (e.pop(), (t = 'hsl(')), t + e.join() + ')';
      },
      toHexString: function(t) {
        var e = this._rgba.slice(),
          i = e.pop();
        return (
          t && e.push(~~(255 * i)),
          '#' +
            S.map(e, function(t) {
              return 1 === (t = (t || 0).toString(16)).length ? '0' + t : t;
            }).join('')
        );
      },
      toString: function() {
        return 0 === this._rgba[3] ? 'transparent' : this.toRgbaString();
      }
    })),
    (N.fn.parse.prototype = N.fn),
    (W.hsla.to = function(t) {
      if (null == t[0] || null == t[1] || null == t[2])
        return [null, null, null, t[3]];
      var e,
        i,
        s = t[0] / 255,
        n = t[1] / 255,
        o = t[2] / 255,
        a = t[3],
        r = Math.max(s, n, o),
        h = Math.min(s, n, o),
        l = r - h,
        c = r + h,
        u = 0.5 * c;
      return (
        (e =
          h === r
            ? 0
            : s === r
            ? (60 * (n - o)) / l + 360
            : n === r
            ? (60 * (o - s)) / l + 120
            : (60 * (s - n)) / l + 240),
        (i = 0 == l ? 0 : u <= 0.5 ? l / c : l / (2 - c)),
        [Math.round(e) % 360, i, u, null == a ? 1 : a]
      );
    }),
    (W.hsla.from = function(t) {
      if (null == t[0] || null == t[1] || null == t[2])
        return [null, null, null, t[3]];
      var e = t[0] / 360,
        i = t[1],
        s = t[2],
        n = t[3],
        o = s <= 0.5 ? s * (1 + i) : s + i - s * i,
        a = 2 * s - o;
      return [
        Math.round(255 * st(a, o, e + 1 / 3)),
        Math.round(255 * st(a, o, e)),
        Math.round(255 * st(a, o, e - 1 / 3)),
        n
      ];
    }),
    R(W, function(h, t) {
      var i = t.props,
        a = t.cache,
        r = t.to,
        l = t.from;
      (N.fn[h] = function(t) {
        if ((r && !this[a] && (this[a] = r(this._rgba)), t === H))
          return this[a].slice();
        var e,
          s = S.type(t),
          n = 'array' === s || 'object' === s ? t : arguments,
          o = this[a].slice();
        return (
          R(i, function(t, e) {
            var i = n['object' === s ? t : e.idx];
            null == i && (i = o[e.idx]), (o[e.idx] = et(i, e));
          }),
          l ? (((e = N(l(o)))[a] = o), e) : N(o)
        );
      }),
        R(i, function(a, r) {
          N.fn[a] ||
            (N.fn[a] = function(t) {
              var e,
                i = S.type(t),
                s = 'alpha' === a ? (this._hsla ? 'hsla' : 'rgba') : h,
                n = this[s](),
                o = n[r.idx];
              return 'undefined' === i
                ? o
                : ('function' === i && ((t = t.call(this, o)), (i = S.type(t))),
                  null == t && r.empty
                    ? this
                    : ('string' === i &&
                        (e = O.exec(t)) &&
                        (t = o + parseFloat(e[2]) * ('+' === e[1] ? 1 : -1)),
                      (n[r.idx] = t),
                      this[s](n)));
            });
        });
    }),
    (N.hook = function(t) {
      var e = t.split(' ');
      R(e, function(t, o) {
        (S.cssHooks[o] = {
          set: function(t, e) {
            var i,
              s,
              n = '';
            if (
              'transparent' !== e &&
              ('string' !== S.type(e) || (i = it(e)))
            ) {
              if (((e = N(i || e)), !F.rgba && 1 !== e._rgba[3])) {
                for (
                  s = 'backgroundColor' === o ? t.parentNode : t;
                  ('' === n || 'transparent' === n) && s && s.style;

                )
                  try {
                    (n = S.css(s, 'backgroundColor')), (s = s.parentNode);
                  } catch (t) {}
                e = e.blend(n && 'transparent' !== n ? n : '_default');
              }
              e = e.toRgbaString();
            }
            try {
              t.style[o] = e;
            } catch (t) {}
          }
        }),
          (S.fx.step[o] = function(t) {
            t.colorInit ||
              ((t.start = N(t.elem, o)),
              (t.end = N(t.end)),
              (t.colorInit = !0)),
              S.cssHooks[o].set(t.elem, t.start.transition(t.end, t.pos));
          });
      });
    }),
    N.hook(
      'backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor'
    ),
    (S.cssHooks.borderColor = {
      expand: function(i) {
        var s = {};
        return (
          R(['Top', 'Right', 'Bottom', 'Left'], function(t, e) {
            s['border' + e + 'Color'] = i;
          }),
          s
        );
      }
    }),
    (z = S.Color.names = {
      aqua: '#00ffff',
      black: '#000000',
      blue: '#0000ff',
      fuchsia: '#ff00ff',
      gray: '#808080',
      green: '#008000',
      lime: '#00ff00',
      maroon: '#800000',
      navy: '#000080',
      olive: '#808000',
      purple: '#800080',
      red: '#ff0000',
      silver: '#c0c0c0',
      teal: '#008080',
      white: '#ffffff',
      yellow: '#ffff00',
      transparent: [null, null, null, 0],
      _default: '#ffffff'
    }),
    (q = ['add', 'remove', 'toggle']),
    (K = {
      border: 1,
      borderBottom: 1,
      borderColor: 1,
      borderLeft: 1,
      borderRight: 1,
      borderTop: 1,
      borderWidth: 1,
      margin: 1,
      padding: 1
    }),
    x.each(
      [
        'borderLeftStyle',
        'borderRightStyle',
        'borderBottomStyle',
        'borderTopStyle'
      ],
      function(t, e) {
        x.fx.step[e] = function(t) {
          (('none' !== t.end && !t.setAttr) || (1 === t.pos && !t.setAttr)) &&
            (tt.style(t.elem, e, t.end), (t.setAttr = !0));
        };
      }
    ),
    x.fn.addBack ||
      (x.fn.addBack = function(t) {
        return this.add(
          null == t ? this.prevObject : this.prevObject.filter(t)
        );
      }),
    (x.effects.animateClass = function(n, t, e, i) {
      var o = x.speed(t, e, i);
      return this.queue(function() {
        var t,
          i = x(this),
          e = i.attr('class') || '',
          s = o.children ? i.find('*').addBack() : i;
        (s = s.map(function() {
          return { el: x(this), start: nt(this) };
        })),
          (t = function() {
            x.each(q, function(t, e) {
              n[e] && i[e + 'Class'](n[e]);
            });
          })(),
          (s = s.map(function() {
            return (
              (this.end = nt(this.el[0])),
              (this.diff = (function(t, e) {
                var i,
                  s,
                  n = {};
                for (i in e)
                  (s = e[i]),
                    t[i] !== s &&
                      (K[i] ||
                        (!x.fx.step[i] && isNaN(parseFloat(s))) ||
                        (n[i] = s));
                return n;
              })(this.start, this.end)),
              this
            );
          })),
          i.attr('class', e),
          (s = s.map(function() {
            var t = this,
              e = x.Deferred(),
              i = x.extend({}, o, {
                queue: !1,
                complete: function() {
                  e.resolve(t);
                }
              });
            return this.el.animate(this.diff, i), e.promise();
          })),
          x.when.apply(x, s.get()).done(function() {
            t(),
              x.each(arguments, function() {
                var e = this.el;
                x.each(this.diff, function(t) {
                  e.css(t, '');
                });
              }),
              o.complete.call(i[0]);
          });
      });
    }),
    x.fn.extend({
      addClass:
        ((j = x.fn.addClass),
        function(t, e, i, s) {
          return e
            ? x.effects.animateClass.call(this, { add: t }, e, i, s)
            : j.apply(this, arguments);
        }),
      removeClass:
        ((Y = x.fn.removeClass),
        function(t, e, i, s) {
          return 1 < arguments.length
            ? x.effects.animateClass.call(this, { remove: t }, e, i, s)
            : Y.apply(this, arguments);
        }),
      toggleClass:
        ((B = x.fn.toggleClass),
        function(t, e, i, s, n) {
          return 'boolean' == typeof e || void 0 === e
            ? i
              ? x.effects.animateClass.call(
                  this,
                  e ? { add: t } : { remove: t },
                  i,
                  s,
                  n
                )
              : B.apply(this, arguments)
            : x.effects.animateClass.call(this, { toggle: t }, e, i, s);
        }),
      switchClass: function(t, e, i, s, n) {
        return x.effects.animateClass.call(
          this,
          { add: e, remove: t },
          i,
          s,
          n
        );
      }
    }),
    x.expr &&
      x.expr.filters &&
      x.expr.filters.animated &&
      (x.expr.filters.animated =
        ((U = x.expr.filters.animated),
        function(t) {
          return !!x(t).data(Z) || U(t);
        })),
    !1 !== x.uiBackCompat &&
      x.extend(x.effects, {
        save: function(t, e) {
          for (var i = 0, s = e.length; i < s; i++)
            null !== e[i] && t.data(Q + e[i], t[0].style[e[i]]);
        },
        restore: function(t, e) {
          for (var i, s = 0, n = e.length; s < n; s++)
            null !== e[s] && ((i = t.data(Q + e[s])), t.css(e[s], i));
        },
        setMode: function(t, e) {
          return 'toggle' === e && (e = t.is(':hidden') ? 'show' : 'hide'), e;
        },
        createWrapper: function(i) {
          if (i.parent().is('.ui-effects-wrapper')) return i.parent();
          var s = {
              width: i.outerWidth(!0),
              height: i.outerHeight(!0),
              float: i.css('float')
            },
            t = x('<div></div>')
              .addClass('ui-effects-wrapper')
              .css({
                fontSize: '100%',
                background: 'transparent',
                border: 'none',
                margin: 0,
                padding: 0
              }),
            e = { width: i.width(), height: i.height() },
            n = document.activeElement;
          try {
            n.id;
          } catch (t) {
            n = document.body;
          }
          return (
            i.wrap(t),
            (i[0] !== n && !x.contains(i[0], n)) || x(n).trigger('focus'),
            (t = i.parent()),
            'static' === i.css('position')
              ? (t.css({ position: 'relative' }),
                i.css({ position: 'relative' }))
              : (x.extend(s, {
                  position: i.css('position'),
                  zIndex: i.css('z-index')
                }),
                x.each(['top', 'left', 'bottom', 'right'], function(t, e) {
                  (s[e] = i.css(e)),
                    isNaN(parseInt(s[e], 10)) && (s[e] = 'auto');
                }),
                i.css({
                  position: 'relative',
                  top: 0,
                  left: 0,
                  right: 'auto',
                  bottom: 'auto'
                })),
            i.css(e),
            t.css(s).show()
          );
        },
        removeWrapper: function(t) {
          var e = document.activeElement;
          return (
            t.parent().is('.ui-effects-wrapper') &&
              (t.parent().replaceWith(t),
              (t[0] !== e && !x.contains(t[0], e)) || x(e).trigger('focus')),
            t
          );
        }
      }),
    x.extend(x.effects, {
      version: '1.12.1',
      define: function(t, e, i) {
        return (
          i || ((i = e), (e = 'effect')),
          (x.effects.effect[t] = i),
          (x.effects.effect[t].mode = e),
          i
        );
      },
      scaledDimensions: function(t, e, i) {
        if (0 === e)
          return { height: 0, width: 0, outerHeight: 0, outerWidth: 0 };
        var s = 'horizontal' !== i ? (e || 100) / 100 : 1,
          n = 'vertical' !== i ? (e || 100) / 100 : 1;
        return {
          height: t.height() * n,
          width: t.width() * s,
          outerHeight: t.outerHeight() * n,
          outerWidth: t.outerWidth() * s
        };
      },
      clipToBox: function(t) {
        return {
          width: t.clip.right - t.clip.left,
          height: t.clip.bottom - t.clip.top,
          left: t.clip.left,
          top: t.clip.top
        };
      },
      unshift: function(t, e, i) {
        var s = t.queue();
        1 < e && s.splice.apply(s, [1, 0].concat(s.splice(e, i))), t.dequeue();
      },
      saveStyle: function(t) {
        t.data(J, t[0].style.cssText);
      },
      restoreStyle: function(t) {
        (t[0].style.cssText = t.data(J) || ''), t.removeData(J);
      },
      mode: function(t, e) {
        var i = t.is(':hidden');
        return (
          'toggle' === e && (e = i ? 'show' : 'hide'),
          (i ? 'hide' === e : 'show' === e) && (e = 'none'),
          e
        );
      },
      getBaseline: function(t, e) {
        var i, s;
        switch (t[0]) {
          case 'top':
            i = 0;
            break;
          case 'middle':
            i = 0.5;
            break;
          case 'bottom':
            i = 1;
            break;
          default:
            i = t[0] / e.height;
        }
        switch (t[1]) {
          case 'left':
            s = 0;
            break;
          case 'center':
            s = 0.5;
            break;
          case 'right':
            s = 1;
            break;
          default:
            s = t[1] / e.width;
        }
        return { x: s, y: i };
      },
      createPlaceholder: function(t) {
        var e,
          i = t.css('position'),
          s = t.position();
        return (
          t
            .css({
              marginTop: t.css('marginTop'),
              marginBottom: t.css('marginBottom'),
              marginLeft: t.css('marginLeft'),
              marginRight: t.css('marginRight')
            })
            .outerWidth(t.outerWidth())
            .outerHeight(t.outerHeight()),
          /^(static|relative)/.test(i) &&
            ((i = 'absolute'),
            (e = x('<' + t[0].nodeName + '>')
              .insertAfter(t)
              .css({
                display: /^(inline|ruby)/.test(t.css('display'))
                  ? 'inline-block'
                  : 'block',
                visibility: 'hidden',
                marginTop: t.css('marginTop'),
                marginBottom: t.css('marginBottom'),
                marginLeft: t.css('marginLeft'),
                marginRight: t.css('marginRight'),
                float: t.css('float')
              })
              .outerWidth(t.outerWidth())
              .outerHeight(t.outerHeight())
              .addClass('ui-effects-placeholder')),
            t.data(Q + 'placeholder', e)),
          t.css({ position: i, left: s.left, top: s.top }),
          e
        );
      },
      removePlaceholder: function(t) {
        var e = Q + 'placeholder',
          i = t.data(e);
        i && (i.remove(), t.removeData(e));
      },
      cleanUp: function(t) {
        x.effects.restoreStyle(t), x.effects.removePlaceholder(t);
      },
      setTransition: function(s, t, n, o) {
        return (
          (o = o || {}),
          x.each(t, function(t, e) {
            var i = s.cssUnit(e);
            0 < i[0] && (o[e] = i[0] * n + i[1]);
          }),
          o
        );
      }
    }),
    x.fn.extend({
      effect: function() {
        function t(t) {
          var e = x(this),
            i = x.effects.mode(e, r) || o;
          e.data(Z, !0),
            h.push(i),
            o && ('show' === i || (i === o && 'hide' === i)) && e.show(),
            (o && 'none' === i) || x.effects.saveStyle(e),
            x.isFunction(t) && t();
        }
        var s = ot.apply(this, arguments),
          n = x.effects.effect[s.effect],
          o = n.mode,
          e = s.queue,
          i = e || 'fx',
          a = s.complete,
          r = s.mode,
          h = [];
        if (x.fx.off || !n)
          return r
            ? this[r](s.duration, a)
            : this.each(function() {
                a && a.call(this);
              });
        function l(t) {
          var e = x(this);
          function i() {
            x.isFunction(a) && a.call(e[0]), x.isFunction(t) && t();
          }
          (s.mode = h.shift()),
            !1 === x.uiBackCompat || o
              ? 'none' === s.mode
                ? (e[r](), i())
                : n.call(e[0], s, function() {
                    e.removeData(Z),
                      x.effects.cleanUp(e),
                      'hide' === s.mode && e.hide(),
                      i();
                  })
              : (e.is(':hidden')
                ? 'hide' === r
                : 'show' === r)
              ? (e[r](), i())
              : n.call(e[0], s, i);
        }
        return !1 === e ? this.each(t).each(l) : this.queue(i, t).queue(i, l);
      },
      show:
        ((X = x.fn.show),
        function(t) {
          if (at(t)) return X.apply(this, arguments);
          var e = ot.apply(this, arguments);
          return (e.mode = 'show'), this.effect.call(this, e);
        }),
      hide:
        (($ = x.fn.hide),
        function(t) {
          if (at(t)) return $.apply(this, arguments);
          var e = ot.apply(this, arguments);
          return (e.mode = 'hide'), this.effect.call(this, e);
        }),
      toggle:
        ((V = x.fn.toggle),
        function(t) {
          if (at(t) || 'boolean' == typeof t) return V.apply(this, arguments);
          var e = ot.apply(this, arguments);
          return (e.mode = 'toggle'), this.effect.call(this, e);
        }),
      cssUnit: function(t) {
        var i = this.css(t),
          s = [];
        return (
          x.each(['em', 'px', '%', 'pt'], function(t, e) {
            0 < i.indexOf(e) && (s = [parseFloat(i), e]);
          }),
          s
        );
      },
      cssClip: function(t) {
        return t
          ? this.css(
              'clip',
              'rect(' +
                t.top +
                'px ' +
                t.right +
                'px ' +
                t.bottom +
                'px ' +
                t.left +
                'px)'
            )
          : rt(this.css('clip'), this);
      },
      transfer: function(t, e) {
        var i = x(this),
          s = x(t.to),
          n = 'fixed' === s.css('position'),
          o = x('body'),
          a = n ? o.scrollTop() : 0,
          r = n ? o.scrollLeft() : 0,
          h = s.offset(),
          l = {
            top: h.top - a,
            left: h.left - r,
            height: s.innerHeight(),
            width: s.innerWidth()
          },
          c = i.offset(),
          u = x("<div class='ui-effects-transfer'></div>")
            .appendTo('body')
            .addClass(t.className)
            .css({
              top: c.top - a,
              left: c.left - r,
              height: i.innerHeight(),
              width: i.innerWidth(),
              position: n ? 'fixed' : 'absolute'
            })
            .animate(l, t.duration, t.easing, function() {
              u.remove(), x.isFunction(e) && e();
            });
      }
    }),
    (x.fx.step.clip = function(t) {
      t.clipInit ||
        ((t.start = x(t.elem).cssClip()),
        'string' == typeof t.end && (t.end = rt(t.end, t.elem)),
        (t.clipInit = !0)),
        x(t.elem).cssClip({
          top: t.pos * (t.end.top - t.start.top) + t.start.top,
          right: t.pos * (t.end.right - t.start.right) + t.start.right,
          bottom: t.pos * (t.end.bottom - t.start.bottom) + t.start.bottom,
          left: t.pos * (t.end.left - t.start.left) + t.start.left
        });
    }),
    (G = {}),
    x.each(['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'], function(e, t) {
      G[t] = function(t) {
        return Math.pow(t, e + 2);
      };
    }),
    x.extend(G, {
      Sine: function(t) {
        return 1 - Math.cos((t * Math.PI) / 2);
      },
      Circ: function(t) {
        return 1 - Math.sqrt(1 - t * t);
      },
      Elastic: function(t) {
        return 0 === t || 1 === t
          ? t
          : -Math.pow(2, 8 * (t - 1)) *
              Math.sin(((80 * (t - 1) - 7.5) * Math.PI) / 15);
      },
      Back: function(t) {
        return t * t * (3 * t - 2);
      },
      Bounce: function(t) {
        for (var e, i = 4; t < ((e = Math.pow(2, --i)) - 1) / 11; );
        return (
          1 / Math.pow(4, 3 - i) - 7.5625 * Math.pow((3 * e - 2) / 22 - t, 2)
        );
      }
    }),
    x.each(G, function(t, e) {
      (x.easing['easeIn' + t] = e),
        (x.easing['easeOut' + t] = function(t) {
          return 1 - e(1 - t);
        }),
        (x.easing['easeInOut' + t] = function(t) {
          return t < 0.5 ? e(2 * t) / 2 : 1 - e(-2 * t + 2) / 2;
        });
    });
  x.effects,
    x.effects.define('blind', 'hide', function(t, e) {
      var i = {
          up: ['bottom', 'top'],
          vertical: ['bottom', 'top'],
          down: ['top', 'bottom'],
          left: ['right', 'left'],
          horizontal: ['right', 'left'],
          right: ['left', 'right']
        },
        s = x(this),
        n = t.direction || 'up',
        o = s.cssClip(),
        a = { clip: x.extend({}, o) },
        r = x.effects.createPlaceholder(s);
      (a.clip[i[n][0]] = a.clip[i[n][1]]),
        'show' === t.mode &&
          (s.cssClip(a.clip), r && r.css(x.effects.clipToBox(a)), (a.clip = o)),
        r && r.animate(x.effects.clipToBox(a), t.duration, t.easing),
        s.animate(a, {
          queue: !1,
          duration: t.duration,
          easing: t.easing,
          complete: e
        });
    }),
    x.effects.define('bounce', function(t, e) {
      var i,
        s,
        n,
        o = x(this),
        a = t.mode,
        r = 'hide' === a,
        h = 'show' === a,
        l = t.direction || 'up',
        c = t.distance,
        u = t.times || 5,
        d = 2 * u + (h || r ? 1 : 0),
        p = t.duration / d,
        f = t.easing,
        g = 'up' === l || 'down' === l ? 'top' : 'left',
        m = 'up' === l || 'left' === l,
        _ = 0,
        v = o.queue().length;
      for (
        x.effects.createPlaceholder(o),
          n = o.css(g),
          c = c || o['top' == g ? 'outerHeight' : 'outerWidth']() / 3,
          h &&
            (((s = { opacity: 1 })[g] = n),
            o
              .css('opacity', 0)
              .css(g, m ? 2 * -c : 2 * c)
              .animate(s, p, f)),
          r && (c /= Math.pow(2, u - 1)),
          (s = {})[g] = n;
        _ < u;
        _++
      )
        ((i = {})[g] = (m ? '-=' : '+=') + c),
          o.animate(i, p, f).animate(s, p, f),
          (c = r ? 2 * c : c / 2);
      r &&
        (((i = { opacity: 0 })[g] = (m ? '-=' : '+=') + c), o.animate(i, p, f)),
        o.queue(e),
        x.effects.unshift(o, v, 1 + d);
    }),
    x.effects.define('clip', 'hide', function(t, e) {
      var i,
        s = {},
        n = x(this),
        o = t.direction || 'vertical',
        a = 'both' === o,
        r = a || 'horizontal' === o,
        h = a || 'vertical' === o;
      (i = n.cssClip()),
        (s.clip = {
          top: h ? (i.bottom - i.top) / 2 : i.top,
          right: r ? (i.right - i.left) / 2 : i.right,
          bottom: h ? (i.bottom - i.top) / 2 : i.bottom,
          left: r ? (i.right - i.left) / 2 : i.left
        }),
        x.effects.createPlaceholder(n),
        'show' === t.mode && (n.cssClip(s.clip), (s.clip = i)),
        n.animate(s, {
          queue: !1,
          duration: t.duration,
          easing: t.easing,
          complete: e
        });
    }),
    x.effects.define('drop', 'hide', function(t, e) {
      var i,
        s = x(this),
        n = 'show' === t.mode,
        o = t.direction || 'left',
        a = 'up' === o || 'down' === o ? 'top' : 'left',
        r = 'up' === o || 'left' === o ? '-=' : '+=',
        h = '+=' == r ? '-=' : '+=',
        l = { opacity: 0 };
      x.effects.createPlaceholder(s),
        (i =
          t.distance || s['top' == a ? 'outerHeight' : 'outerWidth'](!0) / 2),
        (l[a] = r + i),
        n && (s.css(l), (l[a] = h + i), (l.opacity = 1)),
        s.animate(l, {
          queue: !1,
          duration: t.duration,
          easing: t.easing,
          complete: e
        });
    }),
    x.effects.define('explode', 'hide', function(t, e) {
      var i,
        s,
        n,
        o,
        a,
        r,
        h = t.pieces ? Math.round(Math.sqrt(t.pieces)) : 3,
        l = h,
        c = x(this),
        u = 'show' === t.mode,
        d = c
          .show()
          .css('visibility', 'hidden')
          .offset(),
        p = Math.ceil(c.outerWidth() / l),
        f = Math.ceil(c.outerHeight() / h),
        g = [];
      function m() {
        g.push(this),
          g.length === h * l &&
            (c.css({ visibility: 'visible' }), x(g).remove(), e());
      }
      for (i = 0; i < h; i++)
        for (o = d.top + i * f, r = i - (h - 1) / 2, s = 0; s < l; s++)
          (n = d.left + s * p),
            (a = s - (l - 1) / 2),
            c
              .clone()
              .appendTo('body')
              .wrap('<div></div>')
              .css({
                position: 'absolute',
                visibility: 'visible',
                left: -s * p,
                top: -i * f
              })
              .parent()
              .addClass('ui-effects-explode')
              .css({
                position: 'absolute',
                overflow: 'hidden',
                width: p,
                height: f,
                left: n + (u ? a * p : 0),
                top: o + (u ? r * f : 0),
                opacity: u ? 0 : 1
              })
              .animate(
                {
                  left: n + (u ? 0 : a * p),
                  top: o + (u ? 0 : r * f),
                  opacity: u ? 1 : 0
                },
                t.duration || 500,
                t.easing,
                m
              );
    }),
    x.effects.define('fade', 'toggle', function(t, e) {
      var i = 'show' === t.mode;
      x(this)
        .css('opacity', i ? 0 : 1)
        .animate(
          { opacity: i ? 1 : 0 },
          { queue: !1, duration: t.duration, easing: t.easing, complete: e }
        );
    }),
    x.effects.define('fold', 'hide', function(e, t) {
      var i = x(this),
        s = e.mode,
        n = 'show' === s,
        o = 'hide' === s,
        a = e.size || 15,
        r = /([0-9]+)%/.exec(a),
        h = !!e.horizFirst ? ['right', 'bottom'] : ['bottom', 'right'],
        l = e.duration / 2,
        c = x.effects.createPlaceholder(i),
        u = i.cssClip(),
        d = { clip: x.extend({}, u) },
        p = { clip: x.extend({}, u) },
        f = [u[h[0]], u[h[1]]],
        g = i.queue().length;
      r && (a = (parseInt(r[1], 10) / 100) * f[o ? 0 : 1]),
        (d.clip[h[0]] = a),
        (p.clip[h[0]] = a),
        (p.clip[h[1]] = 0),
        n &&
          (i.cssClip(p.clip), c && c.css(x.effects.clipToBox(p)), (p.clip = u)),
        i
          .queue(function(t) {
            c &&
              c
                .animate(x.effects.clipToBox(d), l, e.easing)
                .animate(x.effects.clipToBox(p), l, e.easing),
              t();
          })
          .animate(d, l, e.easing)
          .animate(p, l, e.easing)
          .queue(t),
        x.effects.unshift(i, g, 4);
    }),
    x.effects.define('highlight', 'show', function(t, e) {
      var i = x(this),
        s = { backgroundColor: i.css('backgroundColor') };
      'hide' === t.mode && (s.opacity = 0),
        x.effects.saveStyle(i),
        i
          .css({
            backgroundImage: 'none',
            backgroundColor: t.color || '#ffff99'
          })
          .animate(s, {
            queue: !1,
            duration: t.duration,
            easing: t.easing,
            complete: e
          });
    }),
    x.effects.define('size', function(n, e) {
      var t,
        o,
        i,
        s = x(this),
        a = ['fontSize'],
        r = [
          'borderTopWidth',
          'borderBottomWidth',
          'paddingTop',
          'paddingBottom'
        ],
        h = [
          'borderLeftWidth',
          'borderRightWidth',
          'paddingLeft',
          'paddingRight'
        ],
        l = n.mode,
        c = 'effect' !== l,
        u = n.scale || 'both',
        d = n.origin || ['middle', 'center'],
        p = s.css('position'),
        f = s.position(),
        g = x.effects.scaledDimensions(s),
        m = n.from || g,
        _ = n.to || x.effects.scaledDimensions(s, 0);
      x.effects.createPlaceholder(s),
        'show' === l && ((i = m), (m = _), (_ = i)),
        (o = {
          from: { y: m.height / g.height, x: m.width / g.width },
          to: { y: _.height / g.height, x: _.width / g.width }
        }),
        ('box' !== u && 'both' !== u) ||
          (o.from.y !== o.to.y &&
            ((m = x.effects.setTransition(s, r, o.from.y, m)),
            (_ = x.effects.setTransition(s, r, o.to.y, _))),
          o.from.x !== o.to.x &&
            ((m = x.effects.setTransition(s, h, o.from.x, m)),
            (_ = x.effects.setTransition(s, h, o.to.x, _)))),
        ('content' !== u && 'both' !== u) ||
          (o.from.y !== o.to.y &&
            ((m = x.effects.setTransition(s, a, o.from.y, m)),
            (_ = x.effects.setTransition(s, a, o.to.y, _)))),
        d &&
          ((t = x.effects.getBaseline(d, g)),
          (m.top = (g.outerHeight - m.outerHeight) * t.y + f.top),
          (m.left = (g.outerWidth - m.outerWidth) * t.x + f.left),
          (_.top = (g.outerHeight - _.outerHeight) * t.y + f.top),
          (_.left = (g.outerWidth - _.outerWidth) * t.x + f.left)),
        s.css(m),
        ('content' !== u && 'both' !== u) ||
          ((r = r.concat(['marginTop', 'marginBottom']).concat(a)),
          (h = h.concat(['marginLeft', 'marginRight'])),
          s.find('*[width]').each(function() {
            var t = x(this),
              e = x.effects.scaledDimensions(t),
              i = {
                height: e.height * o.from.y,
                width: e.width * o.from.x,
                outerHeight: e.outerHeight * o.from.y,
                outerWidth: e.outerWidth * o.from.x
              },
              s = {
                height: e.height * o.to.y,
                width: e.width * o.to.x,
                outerHeight: e.height * o.to.y,
                outerWidth: e.width * o.to.x
              };
            o.from.y !== o.to.y &&
              ((i = x.effects.setTransition(t, r, o.from.y, i)),
              (s = x.effects.setTransition(t, r, o.to.y, s))),
              o.from.x !== o.to.x &&
                ((i = x.effects.setTransition(t, h, o.from.x, i)),
                (s = x.effects.setTransition(t, h, o.to.x, s))),
              c && x.effects.saveStyle(t),
              t.css(i),
              t.animate(s, n.duration, n.easing, function() {
                c && x.effects.restoreStyle(t);
              });
          })),
        s.animate(_, {
          queue: !1,
          duration: n.duration,
          easing: n.easing,
          complete: function() {
            var t = s.offset();
            0 === _.opacity && s.css('opacity', m.opacity),
              c ||
                (s.css('position', 'static' === p ? 'relative' : p).offset(t),
                x.effects.saveStyle(s)),
              e();
          }
        });
    }),
    x.effects.define('scale', function(t, e) {
      var i = x(this),
        s = t.mode,
        n =
          parseInt(t.percent, 10) ||
          (0 === parseInt(t.percent, 10) || 'effect' !== s ? 0 : 100),
        o = x.extend(
          !0,
          {
            from: x.effects.scaledDimensions(i),
            to: x.effects.scaledDimensions(i, n, t.direction || 'both'),
            origin: t.origin || ['middle', 'center']
          },
          t
        );
      t.fade && ((o.from.opacity = 1), (o.to.opacity = 0)),
        x.effects.effect.size.call(this, o, e);
    }),
    x.effects.define('puff', 'hide', function(t, e) {
      var i = x.extend(!0, {}, t, {
        fade: !0,
        percent: parseInt(t.percent, 10) || 150
      });
      x.effects.effect.scale.call(this, i, e);
    }),
    x.effects.define('pulsate', 'show', function(t, e) {
      var i = x(this),
        s = t.mode,
        n = 'show' === s,
        o = n || 'hide' === s,
        a = 2 * (t.times || 5) + (o ? 1 : 0),
        r = t.duration / a,
        h = 0,
        l = 1,
        c = i.queue().length;
      for (
        (!n && i.is(':visible')) || (i.css('opacity', 0).show(), (h = 1));
        l < a;
        l++
      )
        i.animate({ opacity: h }, r, t.easing), (h = 1 - h);
      i.animate({ opacity: h }, r, t.easing),
        i.queue(e),
        x.effects.unshift(i, c, 1 + a);
    }),
    x.effects.define('shake', function(t, e) {
      var i = 1,
        s = x(this),
        n = t.direction || 'left',
        o = t.distance || 20,
        a = t.times || 3,
        r = 2 * a + 1,
        h = Math.round(t.duration / r),
        l = 'up' === n || 'down' === n ? 'top' : 'left',
        c = 'up' === n || 'left' === n,
        u = {},
        d = {},
        p = {},
        f = s.queue().length;
      for (
        x.effects.createPlaceholder(s),
          u[l] = (c ? '-=' : '+=') + o,
          d[l] = (c ? '+=' : '-=') + 2 * o,
          p[l] = (c ? '-=' : '+=') + 2 * o,
          s.animate(u, h, t.easing);
        i < a;
        i++
      )
        s.animate(d, h, t.easing).animate(p, h, t.easing);
      s
        .animate(d, h, t.easing)
        .animate(u, h / 2, t.easing)
        .queue(e),
        x.effects.unshift(s, f, 1 + r);
    }),
    x.effects.define('slide', 'show', function(t, e) {
      var i,
        s,
        n = x(this),
        o = {
          up: ['bottom', 'top'],
          down: ['top', 'bottom'],
          left: ['right', 'left'],
          right: ['left', 'right']
        },
        a = t.mode,
        r = t.direction || 'left',
        h = 'up' === r || 'down' === r ? 'top' : 'left',
        l = 'up' === r || 'left' === r,
        c = t.distance || n['top' == h ? 'outerHeight' : 'outerWidth'](!0),
        u = {};
      x.effects.createPlaceholder(n),
        (i = n.cssClip()),
        (s = n.position()[h]),
        (u[h] = (l ? -1 : 1) * c + s),
        (u.clip = n.cssClip()),
        (u.clip[o[r][1]] = u.clip[o[r][0]]),
        'show' === a &&
          (n.cssClip(u.clip), n.css(h, u[h]), (u.clip = i), (u[h] = s)),
        n.animate(u, {
          queue: !1,
          duration: t.duration,
          easing: t.easing,
          complete: e
        });
    });
  !1 !== x.uiBackCompat &&
    x.effects.define('transfer', function(t, e) {
      x(this).transfer(t, e);
    });
});
