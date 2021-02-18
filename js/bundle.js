var _gsScope;
! function (m, g) {
	"use strict";
	if ("IntersectionObserver" in m && "IntersectionObserverEntry" in m && "intersectionRatio" in m.IntersectionObserverEntry.prototype) "isIntersecting" in m.IntersectionObserverEntry.prototype || Object.defineProperty(m.IntersectionObserverEntry.prototype, "isIntersecting", {
		get: function () {
			return 0 < this.intersectionRatio
		}
	});
	else {
		var e = [];
		t.prototype.THROTTLE_TIMEOUT = 100, t.prototype.POLL_INTERVAL = null, t.prototype.USE_MUTATION_OBSERVER = !0, t.prototype.observe = function (e) {
			if (!this._observationTargets.some(function (t) {
					return t.element == e
				})) {
				if (!e || 1 != e.nodeType) throw new Error("target must be an Element");
				this._registerInstance(), this._observationTargets.push({
					element: e,
					entry: null
				}), this._monitorIntersections(), this._checkForIntersections()
			}
		}, t.prototype.unobserve = function (e) {
			this._observationTargets = this._observationTargets.filter(function (t) {
				return t.element != e
			}), this._observationTargets.length || (this._unmonitorIntersections(), this._unregisterInstance())
		}, t.prototype.disconnect = function () {
			this._observationTargets = [], this._unmonitorIntersections(), this._unregisterInstance()
		}, t.prototype.takeRecords = function () {
			var t = this._queuedEntries.slice();
			return this._queuedEntries = [], t
		}, t.prototype._initThresholds = function (t) {
			var e = t || [0];
			return Array.isArray(e) || (e = [e]), e.sort().filter(function (t, e, i) {
				if ("number" != typeof t || isNaN(t) || t < 0 || 1 < t) throw new Error("threshold must be a number between 0 and 1 inclusively");
				return t !== i[e - 1]
			})
		}, t.prototype._parseRootMargin = function (t) {
			var e = (t || "0px").split(/\s+/).map(function (t) {
				var e = /^(-?\d*\.?\d+)(px|%)$/.exec(t);
				if (!e) throw new Error("rootMargin must be specified in pixels or percent");
				return {
					value: parseFloat(e[1]),
					unit: e[2]
				}
			});
			return e[1] = e[1] || e[0], e[2] = e[2] || e[0], e[3] = e[3] || e[1], e
		}, t.prototype._monitorIntersections = function () {
			this._monitoringIntersections || (this._monitoringIntersections = !0, this.POLL_INTERVAL ? this._monitoringInterval = setInterval(this._checkForIntersections, this.POLL_INTERVAL) : (i(m, "resize", this._checkForIntersections, !0), i(g, "scroll", this._checkForIntersections, !0), this.USE_MUTATION_OBSERVER && "MutationObserver" in m && (this._domObserver = new MutationObserver(this._checkForIntersections), this._domObserver.observe(g, {
				attributes: !0,
				childList: !0,
				characterData: !0,
				subtree: !0
			}))))
		}, t.prototype._unmonitorIntersections = function () {
			this._monitoringIntersections && (this._monitoringIntersections = !1, clearInterval(this._monitoringInterval), this._monitoringInterval = null, s(m, "resize", this._checkForIntersections, !0), s(g, "scroll", this._checkForIntersections, !0), this._domObserver && (this._domObserver.disconnect(), this._domObserver = null))
		}, t.prototype._checkForIntersections = function () {
			var o = this._rootIsInDom(),
				h = o ? this._getRootRect() : {
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
					width: 0,
					height: 0
				};
			this._observationTargets.forEach(function (t) {
				var e = t.element,
					i = _(e),
					s = this._rootContainsTarget(e),
					r = t.entry,
					n = o && s && this._computeTargetAndRootIntersection(e, h),
					a = t.entry = new l({
						time: m.performance && performance.now && performance.now(),
						target: e,
						boundingClientRect: i,
						rootBounds: h,
						intersectionRect: n
					});
				r ? o && s ? this._hasCrossedThreshold(r, a) && this._queuedEntries.push(a) : r && r.isIntersecting && this._queuedEntries.push(a) : this._queuedEntries.push(a)
			}, this), this._queuedEntries.length && this._callback(this.takeRecords(), this)
		}, t.prototype._computeTargetAndRootIntersection = function (t, e) {
			if ("none" != m.getComputedStyle(t).display) {
				for (var i, s, r, n, a, o, h, l, p = _(t), f = y(t), u = !1; !u;) {
					var c = null,
						d = 1 == f.nodeType ? m.getComputedStyle(f) : {};
					if ("none" == d.display) return;
					if (f == this.root || f == g ? (u = !0, c = e) : f != g.body && f != g.documentElement && "visible" != d.overflow && (c = _(f)), c && (i = c, s = p, void 0, r = Math.max(i.top, s.top), n = Math.min(i.bottom, s.bottom), a = Math.max(i.left, s.left), o = Math.min(i.right, s.right), l = n - r, !(p = 0 <= (h = o - a) && 0 <= l && {
							top: r,
							bottom: n,
							left: a,
							right: o,
							width: h,
							height: l
						}))) break;
					f = y(f)
				}
				return p
			}
		}, t.prototype._getRootRect = function () {
			var t;
			if (this.root) t = _(this.root);
			else {
				var e = g.documentElement,
					i = g.body;
				t = {
					top: 0,
					left: 0,
					right: e.clientWidth || i.clientWidth,
					width: e.clientWidth || i.clientWidth,
					bottom: e.clientHeight || i.clientHeight,
					height: e.clientHeight || i.clientHeight
				}
			}
			return this._expandRectByRootMargin(t)
		}, t.prototype._expandRectByRootMargin = function (i) {
			var t = this._rootMarginValues.map(function (t, e) {
					return "px" == t.unit ? t.value : t.value * (e % 2 ? i.width : i.height) / 100
				}),
				e = {
					top: i.top - t[0],
					right: i.right + t[1],
					bottom: i.bottom + t[2],
					left: i.left - t[3]
				};
			return e.width = e.right - e.left, e.height = e.bottom - e.top, e
		}, t.prototype._hasCrossedThreshold = function (t, e) {
			var i = t && t.isIntersecting ? t.intersectionRatio || 0 : -1,
				s = e.isIntersecting ? e.intersectionRatio || 0 : -1;
			if (i !== s)
				for (var r = 0; r < this.thresholds.length; r++) {
					var n = this.thresholds[r];
					if (n == i || n == s || n < i != n < s) return !0
				}
		}, t.prototype._rootIsInDom = function () {
			return !this.root || r(g, this.root)
		}, t.prototype._rootContainsTarget = function (t) {
			return r(this.root || g, t)
		}, t.prototype._registerInstance = function () {
			e.indexOf(this) < 0 && e.push(this)
		}, t.prototype._unregisterInstance = function () {
			var t = e.indexOf(this); - 1 != t && e.splice(t, 1)
		}, m.IntersectionObserver = t, m.IntersectionObserverEntry = l
	}

	function l(t) {
		this.time = t.time, this.target = t.target, this.rootBounds = t.rootBounds, this.boundingClientRect = t.boundingClientRect, this.intersectionRect = t.intersectionRect || {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			width: 0,
			height: 0
		}, this.isIntersecting = !!t.intersectionRect;
		var e = this.boundingClientRect,
			i = e.width * e.height,
			s = this.intersectionRect,
			r = s.width * s.height;
		this.intersectionRatio = i ? Number((r / i).toFixed(4)) : this.isIntersecting ? 1 : 0
	}

	function t(t, e) {
		var i, s, r, n = e || {};
		if ("function" != typeof t) throw new Error("callback must be a function");
		if (n.root && 1 != n.root.nodeType) throw new Error("root must be an Element");
		this._checkForIntersections = (i = this._checkForIntersections.bind(this), s = this.THROTTLE_TIMEOUT, r = null, function () {
			r || (r = setTimeout(function () {
				i(), r = null
			}, s))
		}), this._callback = t, this._observationTargets = [], this._queuedEntries = [], this._rootMarginValues = this._parseRootMargin(n.rootMargin), this.thresholds = this._initThresholds(n.threshold), this.root = n.root || null, this.rootMargin = this._rootMarginValues.map(function (t) {
			return t.value + t.unit
		}).join(" ")
	}

	function i(t, e, i, s) {
		"function" == typeof t.addEventListener ? t.addEventListener(e, i, s || !1) : "function" == typeof t.attachEvent && t.attachEvent("on" + e, i)
	}

	function s(t, e, i, s) {
		"function" == typeof t.removeEventListener ? t.removeEventListener(e, i, s || !1) : "function" == typeof t.detatchEvent && t.detatchEvent("on" + e, i)
	}

	function _(t) {
		var e;
		try {
			e = t.getBoundingClientRect()
		} catch (t) {}
		return e ? (e.width && e.height || (e = {
			top: e.top,
			right: e.right,
			bottom: e.bottom,
			left: e.left,
			width: e.right - e.left,
			height: e.bottom - e.top
		}), e) : {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			width: 0,
			height: 0
		}
	}

	function r(t, e) {
		for (var i = e; i;) {
			if (i == t) return !0;
			i = y(i)
		}
		return !1
	}

	function y(t) {
		var e = t.parentNode;
		return e && 11 == e.nodeType && e.host ? e.host : e && e.assignedSlot ? e.assignedSlot.parentNode : e
	}
}(window, document), ((_gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window)._gsQueue || (_gsScope._gsQueue = [])).push(function () {
		"use strict";
		var t, h, l, e, w, x, T, k, _, i, y, P, v, b, c, d, g, s;
		_gsScope._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (s, p, y) {
			var g = function (t) {
					var e, i = [],
						s = t.length;
					for (e = 0; e !== s; i.push(t[e++]));
					return i
				},
				_ = function (t, e, i) {
					var s, r, n = t.cycle;
					for (s in n) r = n[s], t[s] = "function" == typeof r ? r(i, e[i]) : r[i % r.length];
					delete t.cycle
				},
				v = function (t, e, i) {
					y.call(this, t, e, i), this._cycle = 0, this._yoyo = !0 === this.vars.yoyo || !!this.vars.yoyoEase, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._repeat && this._uncache(!0), this.render = v.prototype.render
				},
				b = 1e-10,
				x = y._internals,
				T = x.isSelector,
				w = x.isArray,
				t = v.prototype = y.to({}, .1, {}),
				k = [];
			v.version = "2.0.2", t.constructor = v, t.kill()._gc = !1, v.killTweensOf = v.killDelayedCallsTo = y.killTweensOf, v.getTweensOf = y.getTweensOf, v.lagSmoothing = y.lagSmoothing, v.ticker = y.ticker, v.render = y.render, t.invalidate = function () {
				return this._yoyo = !0 === this.vars.yoyo || !!this.vars.yoyoEase, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._yoyoEase = null, this._uncache(!0), y.prototype.invalidate.call(this)
			}, t.updateTo = function (t, e) {
				var i, s = this.ratio,
					r = this.vars.immediateRender || t.immediateRender;
				for (i in e && this._startTime < this._timeline._time && (this._startTime = this._timeline._time, this._uncache(!1), this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay)), t) this.vars[i] = t[i];
				if (this._initted || r)
					if (e) this._initted = !1, r && this.render(0, !0, !0);
					else if (this._gc && this._enabled(!0, !1), this._notifyPluginsOfEnabled && this._firstPT && y._onPluginEvent("_onDisable", this), .998 < this._time / this._duration) {
					var n = this._totalTime;
					this.render(0, !0, !1), this._initted = !1, this.render(n, !0, !1)
				} else if (this._initted = !1, this._init(), 0 < this._time || r)
					for (var a, o = 1 / (1 - s), h = this._firstPT; h;) a = h.s + h.c, h.c *= o, h.s = a - h.c, h = h._next;
				return this
			}, t.render = function (t, e, i) {
				this._initted || 0 === this._duration && this.vars.repeat && this.invalidate();
				var s, r, n, a, o, h, l, p, f, u = this._dirty ? this.totalDuration() : this._totalDuration,
					c = this._time,
					d = this._totalTime,
					m = this._cycle,
					g = this._duration,
					_ = this._rawPrevTime;
				if (u - 1e-7 <= t && 0 <= t ? (this._totalTime = u, this._cycle = this._repeat, this._yoyo && 0 != (1 & this._cycle) ? (this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = g, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1), this._reversed || (s = !0, r = "onComplete", i = i || this._timeline.autoRemoveChildren), 0 === g && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0), (_ < 0 || t <= 0 && -1e-7 <= t || _ === b && "isPause" !== this.data) && _ !== t && (i = !0, b < _ && (r = "onReverseComplete")), this._rawPrevTime = p = !e || t || _ === t ? t : b)) : t < 1e-7 ? (this._totalTime = this._time = this._cycle = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== d || 0 === g && 0 < _) && (r = "onReverseComplete", s = this._reversed), t < 0 && (this._active = !1, 0 === g && (this._initted || !this.vars.lazy || i) && (0 <= _ && (i = !0), this._rawPrevTime = p = !e || t || _ === t ? t : b)), this._initted || (i = !0)) : (this._totalTime = this._time = t, 0 !== this._repeat && (a = g + this._repeatDelay, this._cycle = this._totalTime / a >> 0, 0 !== this._cycle && this._cycle === this._totalTime / a && d <= t && this._cycle--, this._time = this._totalTime - this._cycle * a, this._yoyo && 0 != (1 & this._cycle) && (this._time = g - this._time, (f = this._yoyoEase || this.vars.yoyoEase) && (this._yoyoEase || (!0 !== f || this._initted ? this._yoyoEase = f = !0 === f ? this._ease : f instanceof Ease ? f : Ease.map[f] : (f = this.vars.ease, this._yoyoEase = f = f ? f instanceof Ease ? f : "function" == typeof f ? new Ease(f, this.vars.easeParams) : Ease.map[f] || y.defaultEase : y.defaultEase)), this.ratio = f ? 1 - f.getRatio((g - this._time) / g) : 0)), this._time > g ? this._time = g : this._time < 0 && (this._time = 0)), this._easeType && !f ? (o = this._time / g, (1 === (h = this._easeType) || 3 === h && .5 <= o) && (o = 1 - o), 3 === h && (o *= 2), 1 === (l = this._easePower) ? o *= o : 2 === l ? o *= o * o : 3 === l ? o *= o * o * o : 4 === l && (o *= o * o * o * o), 1 === h ? this.ratio = 1 - o : 2 === h ? this.ratio = o : this._time / g < .5 ? this.ratio = o / 2 : this.ratio = 1 - o / 2) : f || (this.ratio = this._ease.getRatio(this._time / g))), c !== this._time || i || m !== this._cycle) {
					if (!this._initted) {
						if (this._init(), !this._initted || this._gc) return;
						if (!i && this._firstPT && (!1 !== this.vars.lazy && this._duration || this.vars.lazy && !this._duration)) return this._time = c, this._totalTime = d, this._rawPrevTime = _, this._cycle = m, x.lazyTweens.push(this), void(this._lazy = [t, e]);
						!this._time || s || f ? s && this._ease._calcEnd && !f && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1)) : this.ratio = this._ease.getRatio(this._time / g)
					}
					for (!1 !== this._lazy && (this._lazy = !1), this._active || !this._paused && this._time !== c && 0 <= t && (this._active = !0), 0 === d && (2 === this._initted && 0 < t && this._init(), this._startAt && (0 <= t ? this._startAt.render(t, !0, i) : r || (r = "_dummyGS")), this.vars.onStart && (0 !== this._totalTime || 0 === g) && (e || this._callback("onStart"))), n = this._firstPT; n;) n.f ? n.t[n.p](n.c * this.ratio + n.s) : n.t[n.p] = n.c * this.ratio + n.s, n = n._next;
					this._onUpdate && (t < 0 && this._startAt && this._startTime && this._startAt.render(t, !0, i), e || (this._totalTime !== d || r) && this._callback("onUpdate")), this._cycle !== m && (e || this._gc || this.vars.onRepeat && this._callback("onRepeat")), r && (!this._gc || i) && (t < 0 && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(t, !0, i), s && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[r] && this._callback(r), 0 === g && this._rawPrevTime === b && p !== b && (this._rawPrevTime = 0))
				} else d !== this._totalTime && this._onUpdate && (e || this._callback("onUpdate"))
			}, v.to = function (t, e, i) {
				return new v(t, e, i)
			}, v.from = function (t, e, i) {
				return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new v(t, e, i)
			}, v.fromTo = function (t, e, i, s) {
				return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, new v(t, e, s)
			}, v.staggerTo = v.allTo = function (t, e, i, s, r, n, a) {
				s = s || 0;
				var o, h, l, p, f = 0,
					u = [],
					c = function () {
						i.onComplete && i.onComplete.apply(i.onCompleteScope || this, arguments), r.apply(a || i.callbackScope || this, n || k)
					},
					d = i.cycle,
					m = i.startAt && i.startAt.cycle;
				for (w(t) || ("string" == typeof t && (t = y.selector(t) || t), T(t) && (t = g(t))), t = t || [], s < 0 && ((t = g(t)).reverse(), s *= -1), o = t.length - 1, l = 0; l <= o; l++) {
					for (p in h = {}, i) h[p] = i[p];
					if (d && (_(h, t, l), null != h.duration && (e = h.duration, delete h.duration)), m) {
						for (p in m = h.startAt = {}, i.startAt) m[p] = i.startAt[p];
						_(h.startAt, t, l)
					}
					h.delay = f + (h.delay || 0), l === o && r && (h.onComplete = c), u[l] = new v(t[l], e, h), f += s
				}
				return u
			}, v.staggerFrom = v.allFrom = function (t, e, i, s, r, n, a) {
				return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, v.staggerTo(t, e, i, s, r, n, a)
			}, v.staggerFromTo = v.allFromTo = function (t, e, i, s, r, n, a, o) {
				return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, v.staggerTo(t, e, s, r, n, a, o)
			}, v.delayedCall = function (t, e, i, s, r) {
				return new v(e, 0, {
					delay: t,
					onComplete: e,
					onCompleteParams: i,
					callbackScope: s,
					onReverseComplete: e,
					onReverseCompleteParams: i,
					immediateRender: !1,
					useFrames: r,
					overwrite: 0
				})
			}, v.set = function (t, e) {
				return new v(t, 0, e)
			}, v.isTweening = function (t) {
				return 0 < y.getTweensOf(t, !0).length
			};
			var n = function (t, e) {
					for (var i = [], s = 0, r = t._first; r;) r instanceof y ? i[s++] = r : (e && (i[s++] = r), s = (i = i.concat(n(r, e))).length), r = r._next;
					return i
				},
				f = v.getAllTweens = function (t) {
					return n(s._rootTimeline, t).concat(n(s._rootFramesTimeline, t))
				};
			v.killAll = function (t, e, i, s) {
				null == e && (e = !0), null == i && (i = !0);
				var r, n, a, o = f(0 != s),
					h = o.length,
					l = e && i && s;
				for (a = 0; a < h; a++) n = o[a], (l || n instanceof p || (r = n.target === n.vars.onComplete) && i || e && !r) && (t ? n.totalTime(n._reversed ? 0 : n.totalDuration()) : n._enabled(!1, !1))
			}, v.killChildTweensOf = function (t, e) {
				if (null != t) {
					var i, s, r, n, a, o = x.tweenLookup;
					if ("string" == typeof t && (t = y.selector(t) || t), T(t) && (t = g(t)), w(t))
						for (n = t.length; - 1 < --n;) v.killChildTweensOf(t[n], e);
					else {
						for (r in i = [], o)
							for (s = o[r].target.parentNode; s;) s === t && (i = i.concat(o[r].tweens)), s = s.parentNode;
						for (a = i.length, n = 0; n < a; n++) e && i[n].totalTime(i[n].totalDuration()), i[n]._enabled(!1, !1)
					}
				}
			};
			var r = function (t, e, i, s) {
				e = !1 !== e, i = !1 !== i;
				for (var r, n, a = f(s = !1 !== s), o = e && i && s, h = a.length; - 1 < --h;) n = a[h], (o || n instanceof p || (r = n.target === n.vars.onComplete) && i || e && !r) && n.paused(t)
			};
			return v.pauseAll = function (t, e, i) {
				r(!0, t, e, i)
			}, v.resumeAll = function (t, e, i) {
				r(!1, t, e, i)
			}, v.globalTimeScale = function (t) {
				var e = s._rootTimeline,
					i = y.ticker.time;
				return arguments.length ? (t = t || b, e._startTime = i - (i - e._startTime) * e._timeScale / t, e = s._rootFramesTimeline, i = y.ticker.frame, e._startTime = i - (i - e._startTime) * e._timeScale / t, e._timeScale = s._rootTimeline._timeScale = t, t) : e._timeScale
			}, t.progress = function (t, e) {
				return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 != (1 & this._cycle) ? 1 - t : t) + this._cycle * (this._duration + this._repeatDelay), e) : this._time / this.duration()
			}, t.totalProgress = function (t, e) {
				return arguments.length ? this.totalTime(this.totalDuration() * t, e) : this._totalTime / this.totalDuration()
			}, t.time = function (t, e) {
				return arguments.length ? (this._dirty && this.totalDuration(), t > this._duration && (t = this._duration), this._yoyo && 0 != (1 & this._cycle) ? t = this._duration - t + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (t += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(t, e)) : this._time
			}, t.duration = function (t) {
				return arguments.length ? s.prototype.duration.call(this, t) : this._duration
			}, t.totalDuration = function (t) {
				return arguments.length ? -1 === this._repeat ? this : this.duration((t - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat, this._dirty = !1), this._totalDuration)
			}, t.repeat = function (t) {
				return arguments.length ? (this._repeat = t, this._uncache(!0)) : this._repeat
			}, t.repeatDelay = function (t) {
				return arguments.length ? (this._repeatDelay = t, this._uncache(!0)) : this._repeatDelay
			}, t.yoyo = function (t) {
				return arguments.length ? (this._yoyo = t, this) : this._yoyo
			}, v
		}, !0), _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (p, f, u) {
			var c = function (t) {
					f.call(this, t), this._labels = {}, this.autoRemoveChildren = !0 === this.vars.autoRemoveChildren, this.smoothChildTiming = !0 === this.vars.smoothChildTiming, this._sortChildren = !0, this._onUpdate = this.vars.onUpdate;
					var e, i, s = this.vars;
					for (i in s) e = s[i], g(e) && -1 !== e.join("").indexOf("{self}") && (s[i] = this._swapSelfInParams(e));
					g(s.tweens) && this.add(s.tweens, 0, s.align, s.stagger)
				},
				m = 1e-10,
				t = u._internals,
				e = c._internals = {},
				d = t.isSelector,
				g = t.isArray,
				_ = t.lazyTweens,
				y = t.lazyRender,
				a = _gsScope._gsDefine.globals,
				v = function (t) {
					var e, i = {};
					for (e in t) i[e] = t[e];
					return i
				},
				b = function (t, e, i) {
					var s, r, n = t.cycle;
					for (s in n) r = n[s], t[s] = "function" == typeof r ? r(i, e[i]) : r[i % r.length];
					delete t.cycle
				},
				n = e.pauseCallback = function () {},
				x = function (t) {
					var e, i = [],
						s = t.length;
					for (e = 0; e !== s; i.push(t[e++]));
					return i
				},
				i = c.prototype = new f;
			return c.version = "2.0.2", i.constructor = c, i.kill()._gc = i._forcingPlayhead = i._hasPause = !1, i.to = function (t, e, i, s) {
				var r = i.repeat && a.TweenMax || u;
				return e ? this.add(new r(t, e, i), s) : this.set(t, i, s)
			}, i.from = function (t, e, i, s) {
				return this.add((i.repeat && a.TweenMax || u).from(t, e, i), s)
			}, i.fromTo = function (t, e, i, s, r) {
				var n = s.repeat && a.TweenMax || u;
				return e ? this.add(n.fromTo(t, e, i, s), r) : this.set(t, s, r)
			}, i.staggerTo = function (t, e, i, s, r, n, a, o) {
				var h, l, p = new c({
						onComplete: n,
						onCompleteParams: a,
						callbackScope: o,
						smoothChildTiming: this.smoothChildTiming
					}),
					f = i.cycle;
				for ("string" == typeof t && (t = u.selector(t) || t), d(t = t || []) && (t = x(t)), (s = s || 0) < 0 && ((t = x(t)).reverse(), s *= -1), l = 0; l < t.length; l++)(h = v(i)).startAt && (h.startAt = v(h.startAt), h.startAt.cycle && b(h.startAt, t, l)), f && (b(h, t, l), null != h.duration && (e = h.duration, delete h.duration)), p.to(t[l], e, h, l * s);
				return this.add(p, r)
			}, i.staggerFrom = function (t, e, i, s, r, n, a, o) {
				return i.immediateRender = 0 != i.immediateRender, i.runBackwards = !0, this.staggerTo(t, e, i, s, r, n, a, o)
			}, i.staggerFromTo = function (t, e, i, s, r, n, a, o, h) {
				return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, this.staggerTo(t, e, s, r, n, a, o, h)
			}, i.call = function (t, e, i, s) {
				return this.add(u.delayedCall(0, t, e, i), s)
			}, i.set = function (t, e, i) {
				return i = this._parseTimeOrLabel(i, 0, !0), null == e.immediateRender && (e.immediateRender = i === this._time && !this._paused), this.add(new u(t, 0, e), i)
			}, c.exportRoot = function (t, e) {
				null == (t = t || {}).smoothChildTiming && (t.smoothChildTiming = !0);
				var i, s, r, n, a = new c(t),
					o = a._timeline;
				for (null == e && (e = !0), o._remove(a, !0), a._startTime = 0, a._rawPrevTime = a._time = a._totalTime = o._time, r = o._first; r;) n = r._next, e && r instanceof u && r.target === r.vars.onComplete || ((s = r._startTime - r._delay) < 0 && (i = 1), a.add(r, s)), r = n;
				return o.add(a, 0), i && a.totalDuration(), a
			}, i.add = function (t, e, i, s) {
				var r, n, a, o, h, l;
				if ("number" != typeof e && (e = this._parseTimeOrLabel(e, 0, !0, t)), !(t instanceof p)) {
					if (t instanceof Array || t && t.push && g(t)) {
						for (i = i || "normal", s = s || 0, r = e, n = t.length, a = 0; a < n; a++) g(o = t[a]) && (o = new c({
							tweens: o
						})), this.add(o, r), "string" != typeof o && "function" != typeof o && ("sequence" === i ? r = o._startTime + o.totalDuration() / o._timeScale : "start" === i && (o._startTime -= o.delay())), r += s;
						return this._uncache(!0)
					}
					if ("string" == typeof t) return this.addLabel(t, e);
					if ("function" != typeof t) throw "Cannot add " + t + " into the timeline; it is not a tween, timeline, function, or string.";
					t = u.delayedCall(0, t)
				}
				if (f.prototype.add.call(this, t, e), t._time && (r = Math.max(0, Math.min(t.totalDuration(), (this.rawTime() - t._startTime) * t._timeScale)), 1e-5 < Math.abs(r - t._totalTime) && t.render(r, !1, !1)), (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration())
					for (l = (h = this).rawTime() > t._startTime; h._timeline;) l && h._timeline.smoothChildTiming ? h.totalTime(h._totalTime, !0) : h._gc && h._enabled(!0, !1), h = h._timeline;
				return this
			}, i.remove = function (t) {
				if (t instanceof p) {
					this._remove(t, !1);
					var e = t._timeline = t.vars.useFrames ? p._rootFramesTimeline : p._rootTimeline;
					return t._startTime = (t._paused ? t._pauseTime : e._time) - (t._reversed ? t.totalDuration() - t._totalTime : t._totalTime) / t._timeScale, this
				}
				if (t instanceof Array || t && t.push && g(t)) {
					for (var i = t.length; - 1 < --i;) this.remove(t[i]);
					return this
				}
				return "string" == typeof t ? this.removeLabel(t) : this.kill(null, t)
			}, i._remove = function (t, e) {
				return f.prototype._remove.call(this, t, e), this._last ? this._time > this.duration() && (this._time = this._duration, this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0, this
			}, i.append = function (t, e) {
				return this.add(t, this._parseTimeOrLabel(null, e, !0, t))
			}, i.insert = i.insertMultiple = function (t, e, i, s) {
				return this.add(t, e || 0, i, s)
			}, i.appendMultiple = function (t, e, i, s) {
				return this.add(t, this._parseTimeOrLabel(null, e, !0, t), i, s)
			}, i.addLabel = function (t, e) {
				return this._labels[t] = this._parseTimeOrLabel(e), this
			}, i.addPause = function (t, e, i, s) {
				var r = u.delayedCall(0, n, i, s || this);
				return r.vars.onComplete = r.vars.onReverseComplete = e, r.data = "isPause", this._hasPause = !0, this.add(r, t)
			}, i.removeLabel = function (t) {
				return delete this._labels[t], this
			}, i.getLabelTime = function (t) {
				return null != this._labels[t] ? this._labels[t] : -1
			}, i._parseTimeOrLabel = function (t, e, i, s) {
				var r, n;
				if (s instanceof p && s.timeline === this) this.remove(s);
				else if (s && (s instanceof Array || s.push && g(s)))
					for (n = s.length; - 1 < --n;) s[n] instanceof p && s[n].timeline === this && this.remove(s[n]);
				if (r = "number" != typeof t || e ? 99999999999 < this.duration() ? this.recent().endTime(!1) : this._duration : 0, "string" == typeof e) return this._parseTimeOrLabel(e, i && "number" == typeof t && null == this._labels[e] ? t - r : 0, i);
				if (e = e || 0, "string" != typeof t || !isNaN(t) && null == this._labels[t]) null == t && (t = r);
				else {
					if (-1 === (n = t.indexOf("="))) return null == this._labels[t] ? i ? this._labels[t] = r + e : e : this._labels[t] + e;
					e = parseInt(t.charAt(n - 1) + "1", 10) * Number(t.substr(n + 1)), t = 1 < n ? this._parseTimeOrLabel(t.substr(0, n - 1), 0, i) : r
				}
				return Number(t) + e
			}, i.seek = function (t, e) {
				return this.totalTime("number" == typeof t ? t : this._parseTimeOrLabel(t), !1 !== e)
			}, i.stop = function () {
				return this.paused(!0)
			}, i.gotoAndPlay = function (t, e) {
				return this.play(t, e)
			}, i.gotoAndStop = function (t, e) {
				return this.pause(t, e)
			}, i.render = function (t, e, i) {
				this._gc && this._enabled(!0, !1);
				var s, r, n, a, o, h, l, p = this._time,
					f = this._dirty ? this.totalDuration() : this._totalDuration,
					u = this._startTime,
					c = this._timeScale,
					d = this._paused;
				if (p !== this._time && (t += this._time - p), f - 1e-7 <= t && 0 <= t) this._totalTime = this._time = f, this._reversed || this._hasPausedChild() || (r = !0, a = "onComplete", o = !!this._timeline.autoRemoveChildren, 0 === this._duration && (t <= 0 && -1e-7 <= t || this._rawPrevTime < 0 || this._rawPrevTime === m) && this._rawPrevTime !== t && this._first && (o = !0, this._rawPrevTime > m && (a = "onReverseComplete"))), this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : m, t = f + 1e-4;
				else if (t < 1e-7)
					if (this._totalTime = this._time = 0, (0 !== p || 0 === this._duration && this._rawPrevTime !== m && (0 < this._rawPrevTime || t < 0 && 0 <= this._rawPrevTime)) && (a = "onReverseComplete", r = this._reversed), t < 0) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (o = r = !0, a = "onReverseComplete") : 0 <= this._rawPrevTime && this._first && (o = !0), this._rawPrevTime = t;
					else {
						if (this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : m, 0 === t && r)
							for (s = this._first; s && 0 === s._startTime;) s._duration || (r = !1), s = s._next;
						t = 0, this._initted || (o = !0)
					}
				else {
					if (this._hasPause && !this._forcingPlayhead && !e) {
						if (p <= t)
							for (s = this._first; s && s._startTime <= t && !h;) s._duration || "isPause" !== s.data || s.ratio || 0 === s._startTime && 0 === this._rawPrevTime || (h = s), s = s._next;
						else
							for (s = this._last; s && s._startTime >= t && !h;) s._duration || "isPause" === s.data && 0 < s._rawPrevTime && (h = s), s = s._prev;
						h && (this._time = t = h._startTime, this._totalTime = t + this._cycle * (this._totalDuration + this._repeatDelay))
					}
					this._totalTime = this._time = this._rawPrevTime = t
				}
				if (this._time !== p && this._first || i || o || h) {
					if (this._initted || (this._initted = !0), this._active || !this._paused && this._time !== p && 0 < t && (this._active = !0), 0 === p && this.vars.onStart && (0 === this._time && this._duration || e || this._callback("onStart")), p <= (l = this._time))
						for (s = this._first; s && (n = s._next, l === this._time && (!this._paused || d));)(s._active || s._startTime <= l && !s._paused && !s._gc) && (h === s && this.pause(), s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), s = n;
					else
						for (s = this._last; s && (n = s._prev, l === this._time && (!this._paused || d));) {
							if (s._active || s._startTime <= p && !s._paused && !s._gc) {
								if (h === s) {
									for (h = s._prev; h && h.endTime() > this._time;) h.render(h._reversed ? h.totalDuration() - (t - h._startTime) * h._timeScale : (t - h._startTime) * h._timeScale, e, i), h = h._prev;
									h = null, this.pause()
								}
								s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)
							}
							s = n
						}
					this._onUpdate && (e || (_.length && y(), this._callback("onUpdate"))), a && (this._gc || (u === this._startTime || c !== this._timeScale) && (0 === this._time || f >= this.totalDuration()) && (r && (_.length && y(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[a] && this._callback(a)))
				}
			}, i._hasPausedChild = function () {
				for (var t = this._first; t;) {
					if (t._paused || t instanceof c && t._hasPausedChild()) return !0;
					t = t._next
				}
				return !1
			}, i.getChildren = function (t, e, i, s) {
				s = s || -9999999999;
				for (var r = [], n = this._first, a = 0; n;) n._startTime < s || (n instanceof u ? !1 !== e && (r[a++] = n) : (!1 !== i && (r[a++] = n), !1 !== t && (a = (r = r.concat(n.getChildren(!0, e, i))).length))), n = n._next;
				return r
			}, i.getTweensOf = function (t, e) {
				var i, s, r = this._gc,
					n = [],
					a = 0;
				for (r && this._enabled(!0, !0), s = (i = u.getTweensOf(t)).length; - 1 < --s;)(i[s].timeline === this || e && this._contains(i[s])) && (n[a++] = i[s]);
				return r && this._enabled(!1, !0), n
			}, i.recent = function () {
				return this._recent
			}, i._contains = function (t) {
				for (var e = t.timeline; e;) {
					if (e === this) return !0;
					e = e.timeline
				}
				return !1
			}, i.shiftChildren = function (t, e, i) {
				i = i || 0;
				for (var s, r = this._first, n = this._labels; r;) r._startTime >= i && (r._startTime += t), r = r._next;
				if (e)
					for (s in n) n[s] >= i && (n[s] += t);
				return this._uncache(!0)
			}, i._kill = function (t, e) {
				if (!t && !e) return this._enabled(!1, !1);
				for (var i = e ? this.getTweensOf(e) : this.getChildren(!0, !0, !1), s = i.length, r = !1; - 1 < --s;) i[s]._kill(t, e) && (r = !0);
				return r
			}, i.clear = function (t) {
				var e = this.getChildren(!1, !0, !0),
					i = e.length;
				for (this._time = this._totalTime = 0; - 1 < --i;) e[i]._enabled(!1, !1);
				return !1 !== t && (this._labels = {}), this._uncache(!0)
			}, i.invalidate = function () {
				for (var t = this._first; t;) t.invalidate(), t = t._next;
				return p.prototype.invalidate.call(this)
			}, i._enabled = function (t, e) {
				if (t === this._gc)
					for (var i = this._first; i;) i._enabled(t, !0), i = i._next;
				return f.prototype._enabled.call(this, t, e)
			}, i.totalTime = function (t, e, i) {
				this._forcingPlayhead = !0;
				var s = p.prototype.totalTime.apply(this, arguments);
				return this._forcingPlayhead = !1, s
			}, i.duration = function (t) {
				return arguments.length ? (0 !== this.duration() && 0 !== t && this.timeScale(this._duration / t), this) : (this._dirty && this.totalDuration(), this._duration)
			}, i.totalDuration = function (t) {
				if (!arguments.length) {
					if (this._dirty) {
						for (var e, i, s = 0, r = this._last, n = 999999999999; r;) e = r._prev, r._dirty && r.totalDuration(), r._startTime > n && this._sortChildren && !r._paused && !this._calculatingDuration ? (this._calculatingDuration = 1, this.add(r, r._startTime - r._delay), this._calculatingDuration = 0) : n = r._startTime, r._startTime < 0 && !r._paused && (s -= r._startTime, this._timeline.smoothChildTiming && (this._startTime += r._startTime / this._timeScale, this._time -= r._startTime, this._totalTime -= r._startTime, this._rawPrevTime -= r._startTime), this.shiftChildren(-r._startTime, !1, -9999999999), n = 0), s < (i = r._startTime + r._totalDuration / r._timeScale) && (s = i), r = e;
						this._duration = this._totalDuration = s, this._dirty = !1
					}
					return this._totalDuration
				}
				return t && this.totalDuration() ? this.timeScale(this._totalDuration / t) : this
			}, i.paused = function (t) {
				if (!t)
					for (var e = this._first, i = this._time; e;) e._startTime === i && "isPause" === e.data && (e._rawPrevTime = 0), e = e._next;
				return p.prototype.paused.apply(this, arguments)
			}, i.usesFrames = function () {
				for (var t = this._timeline; t._timeline;) t = t._timeline;
				return t === p._rootFramesTimeline
			}, i.rawTime = function (t) {
				return t && (this._paused || this._repeat && 0 < this.time() && this.totalProgress() < 1) ? this._totalTime % (this._duration + this._repeatDelay) : this._paused ? this._totalTime : (this._timeline.rawTime(t) - this._startTime) * this._timeScale
			}, c
		}, !0), _gsScope._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function (e, o, t) {
			var i = function (t) {
					e.call(this, t), this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._cycle = 0, this._yoyo = !0 === this.vars.yoyo, this._dirty = !0
				},
				A = 1e-10,
				s = o._internals,
				S = s.lazyTweens,
				D = s.lazyRender,
				h = _gsScope._gsDefine.globals,
				l = new t(null, null, 1, 0),
				r = i.prototype = new e;
			return r.constructor = i, r.kill()._gc = !1, i.version = "2.0.2", r.invalidate = function () {
				return this._yoyo = !0 === this.vars.yoyo, this._repeat = this.vars.repeat || 0, this._repeatDelay = this.vars.repeatDelay || 0, this._uncache(!0), e.prototype.invalidate.call(this)
			}, r.addCallback = function (t, e, i, s) {
				return this.add(o.delayedCall(0, t, i, s), e)
			}, r.removeCallback = function (t, e) {
				if (t)
					if (null == e) this._kill(null, t);
					else
						for (var i = this.getTweensOf(t, !1), s = i.length, r = this._parseTimeOrLabel(e); - 1 < --s;) i[s]._startTime === r && i[s]._enabled(!1, !1);
				return this
			}, r.removePause = function (t) {
				return this.removeCallback(e._internals.pauseCallback, t)
			}, r.tweenTo = function (t, e) {
				e = e || {};
				var i, s, r, n = {
						ease: l,
						useFrames: this.usesFrames(),
						immediateRender: !1,
						lazy: !1
					},
					a = e.repeat && h.TweenMax || o;
				for (s in e) n[s] = e[s];
				return n.time = this._parseTimeOrLabel(t), i = Math.abs(Number(n.time) - this._time) / this._timeScale || .001, r = new a(this, i, n), n.onStart = function () {
					r.target.paused(!0), r.vars.time === r.target.time() || i !== r.duration() || r.isFromTo || r.duration(Math.abs(r.vars.time - r.target.time()) / r.target._timeScale).render(r.time(), !0, !0), e.onStart && e.onStart.apply(e.onStartScope || e.callbackScope || r, e.onStartParams || [])
				}, r
			}, r.tweenFromTo = function (t, e, i) {
				i = i || {}, t = this._parseTimeOrLabel(t), i.startAt = {
					onComplete: this.seek,
					onCompleteParams: [t],
					callbackScope: this
				}, i.immediateRender = !1 !== i.immediateRender;
				var s = this.tweenTo(e, i);
				return s.isFromTo = 1, s.duration(Math.abs(s.vars.time - t) / this._timeScale || .001)
			}, r.render = function (t, e, i) {
				this._gc && this._enabled(!0, !1);
				var s, r, n, a, o, h, l, p, f = this._time,
					u = this._dirty ? this.totalDuration() : this._totalDuration,
					c = this._duration,
					d = this._totalTime,
					m = this._startTime,
					g = this._timeScale,
					_ = this._rawPrevTime,
					y = this._paused,
					v = this._cycle;
				if (f !== this._time && (t += this._time - f), u - 1e-7 <= t && 0 <= t) this._locked || (this._totalTime = u, this._cycle = this._repeat), this._reversed || this._hasPausedChild() || (r = !0, a = "onComplete", o = !!this._timeline.autoRemoveChildren, 0 === this._duration && (t <= 0 && -1e-7 <= t || _ < 0 || _ === A) && _ !== t && this._first && (o = !0, A < _ && (a = "onReverseComplete"))), this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : A, this._yoyo && 0 != (1 & this._cycle) ? this._time = t = 0 : t = (this._time = c) + 1e-4;
				else if (t < 1e-7)
					if (this._locked || (this._totalTime = this._cycle = 0), ((this._time = 0) !== f || 0 === c && _ !== A && (0 < _ || t < 0 && 0 <= _) && !this._locked) && (a = "onReverseComplete", r = this._reversed), t < 0) this._active = !1, this._timeline.autoRemoveChildren && this._reversed ? (o = r = !0, a = "onReverseComplete") : 0 <= _ && this._first && (o = !0), this._rawPrevTime = t;
					else {
						if (this._rawPrevTime = c || !e || t || this._rawPrevTime === t ? t : A, 0 === t && r)
							for (s = this._first; s && 0 === s._startTime;) s._duration || (r = !1), s = s._next;
						t = 0, this._initted || (o = !0)
					}
				else if (0 === c && _ < 0 && (o = !0), this._time = this._rawPrevTime = t, this._locked || (this._totalTime = t, 0 !== this._repeat && (h = c + this._repeatDelay, this._cycle = this._totalTime / h >> 0, 0 !== this._cycle && this._cycle === this._totalTime / h && d <= t && this._cycle--, this._time = this._totalTime - this._cycle * h, this._yoyo && 0 != (1 & this._cycle) && (this._time = c - this._time), this._time > c ? t = (this._time = c) + 1e-4 : this._time < 0 ? this._time = t = 0 : t = this._time)), this._hasPause && !this._forcingPlayhead && !e) {
					if (f <= (t = this._time) || this._repeat && v !== this._cycle)
						for (s = this._first; s && s._startTime <= t && !l;) s._duration || "isPause" !== s.data || s.ratio || 0 === s._startTime && 0 === this._rawPrevTime || (l = s), s = s._next;
					else
						for (s = this._last; s && s._startTime >= t && !l;) s._duration || "isPause" === s.data && 0 < s._rawPrevTime && (l = s), s = s._prev;
					l && l._startTime < c && (this._time = t = l._startTime, this._totalTime = t + this._cycle * (this._totalDuration + this._repeatDelay))
				}
				if (this._cycle !== v && !this._locked) {
					var b = this._yoyo && 0 != (1 & v),
						x = b === (this._yoyo && 0 != (1 & this._cycle)),
						T = this._totalTime,
						w = this._cycle,
						k = this._rawPrevTime,
						P = this._time;
					if (this._totalTime = v * c, this._cycle < v ? b = !b : this._totalTime += c, this._time = f, this._rawPrevTime = 0 === c ? _ - 1e-4 : _, this._cycle = v, this._locked = !0, f = b ? 0 : c, this.render(f, e, 0 === c), e || this._gc || this.vars.onRepeat && (this._cycle = w, this._locked = !1, this._callback("onRepeat")), f !== this._time) return;
					if (x && (this._cycle = v, this._locked = !0, f = b ? c + 1e-4 : -1e-4, this.render(f, !0, !1)), this._locked = !1, this._paused && !y) return;
					this._time = P, this._totalTime = T, this._cycle = w, this._rawPrevTime = k
				}
				if (this._time !== f && this._first || i || o || l) {
					if (this._initted || (this._initted = !0), this._active || !this._paused && this._totalTime !== d && 0 < t && (this._active = !0), 0 === d && this.vars.onStart && (0 === this._totalTime && this._totalDuration || e || this._callback("onStart")), f <= (p = this._time))
						for (s = this._first; s && (n = s._next, p === this._time && (!this._paused || y));)(s._active || s._startTime <= this._time && !s._paused && !s._gc) && (l === s && this.pause(), s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)), s = n;
					else
						for (s = this._last; s && (n = s._prev, p === this._time && (!this._paused || y));) {
							if (s._active || s._startTime <= f && !s._paused && !s._gc) {
								if (l === s) {
									for (l = s._prev; l && l.endTime() > this._time;) l.render(l._reversed ? l.totalDuration() - (t - l._startTime) * l._timeScale : (t - l._startTime) * l._timeScale, e, i), l = l._prev;
									l = null, this.pause()
								}
								s._reversed ? s.render((s._dirty ? s.totalDuration() : s._totalDuration) - (t - s._startTime) * s._timeScale, e, i) : s.render((t - s._startTime) * s._timeScale, e, i)
							}
							s = n
						}
					this._onUpdate && (e || (S.length && D(), this._callback("onUpdate"))), a && (this._locked || this._gc || (m === this._startTime || g !== this._timeScale) && (0 === this._time || u >= this.totalDuration()) && (r && (S.length && D(), this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[a] && this._callback(a)))
				} else d !== this._totalTime && this._onUpdate && (e || this._callback("onUpdate"))
			}, r.getActive = function (t, e, i) {
				null == t && (t = !0), null == e && (e = !0), null == i && (i = !1);
				var s, r, n = [],
					a = this.getChildren(t, e, i),
					o = 0,
					h = a.length;
				for (s = 0; s < h; s++)(r = a[s]).isActive() && (n[o++] = r);
				return n
			}, r.getLabelAfter = function (t) {
				t || 0 !== t && (t = this._time);
				var e, i = this.getLabelsArray(),
					s = i.length;
				for (e = 0; e < s; e++)
					if (i[e].time > t) return i[e].name;
				return null
			}, r.getLabelBefore = function (t) {
				null == t && (t = this._time);
				for (var e = this.getLabelsArray(), i = e.length; - 1 < --i;)
					if (e[i].time < t) return e[i].name;
				return null
			}, r.getLabelsArray = function () {
				var t, e = [],
					i = 0;
				for (t in this._labels) e[i++] = {
					time: this._labels[t],
					name: t
				};
				return e.sort(function (t, e) {
					return t.time - e.time
				}), e
			}, r.invalidate = function () {
				return this._locked = !1, e.prototype.invalidate.call(this)
			}, r.progress = function (t, e) {
				return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 != (1 & this._cycle) ? 1 - t : t) + this._cycle * (this._duration + this._repeatDelay), e) : this._time / this.duration() || 0
			}, r.totalProgress = function (t, e) {
				return arguments.length ? this.totalTime(this.totalDuration() * t, e) : this._totalTime / this.totalDuration() || 0
			}, r.totalDuration = function (t) {
				return arguments.length ? -1 !== this._repeat && t ? this.timeScale(this.totalDuration() / t) : this : (this._dirty && (e.prototype.totalDuration.call(this), this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat), this._totalDuration)
			}, r.time = function (t, e) {
				return arguments.length ? (this._dirty && this.totalDuration(), t > this._duration && (t = this._duration), this._yoyo && 0 != (1 & this._cycle) ? t = this._duration - t + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (t += this._cycle * (this._duration + this._repeatDelay)), this.totalTime(t, e)) : this._time
			}, r.repeat = function (t) {
				return arguments.length ? (this._repeat = t, this._uncache(!0)) : this._repeat
			}, r.repeatDelay = function (t) {
				return arguments.length ? (this._repeatDelay = t, this._uncache(!0)) : this._repeatDelay
			}, r.yoyo = function (t) {
				return arguments.length ? (this._yoyo = t, this) : this._yoyo
			}, r.currentLabel = function (t) {
				return arguments.length ? this.seek(t, !0) : this.getLabelBefore(this._time + 1e-8)
			}, i
		}, !0), w = 180 / Math.PI, x = [], T = [], k = [], _ = {}, i = _gsScope._gsDefine.globals, y = function (t, e, i, s) {
			i === s && (i = s - (s - e) / 1e6), t === e && (e = t + (i - t) / 1e6), this.a = t, this.b = e, this.c = i, this.d = s, this.da = s - t, this.ca = i - t, this.ba = e - t
		}, P = function (t, e, i, s) {
			var r = {
					a: t
				},
				n = {},
				a = {},
				o = {
					c: s
				},
				h = (t + e) / 2,
				l = (e + i) / 2,
				p = (i + s) / 2,
				f = (h + l) / 2,
				u = (l + p) / 2,
				c = (u - f) / 8;
			return r.b = h + (t - h) / 4, n.b = f + c, r.c = n.a = (r.b + n.b) / 2, n.c = a.a = (f + u) / 2, a.b = u - c, o.b = p + (s - p) / 4, a.c = o.a = (a.b + o.b) / 2, [r, n, a, o]
		}, v = function (t, e, i, s, r) {
			var n, a, o, h, l, p, f, u, c, d, m, g, _, y = t.length - 1,
				v = 0,
				b = t[0].a;
			for (n = 0; n < y; n++) a = (l = t[v]).a, o = l.d, h = t[v + 1].d, r ? (m = x[n], _ = ((g = T[n]) + m) * e * .25 / (s ? .5 : k[n] || .5), u = o - ((p = o - (o - a) * (s ? .5 * e : 0 !== m ? _ / m : 0)) + (((f = o + (h - o) * (s ? .5 * e : 0 !== g ? _ / g : 0)) - p) * (3 * m / (m + g) + .5) / 4 || 0))) : u = o - ((p = o - (o - a) * e * .5) + (f = o + (h - o) * e * .5)) / 2, p += u, f += u, l.c = c = p, l.b = 0 !== n ? b : b = l.a + .6 * (l.c - l.a), l.da = o - a, l.ca = c - a, l.ba = b - a, i ? (d = P(a, b, c, o), t.splice(v, 1, d[0], d[1], d[2], d[3]), v += 4) : v++, b = f;
			(l = t[v]).b = b, l.c = b + .4 * (l.d - b), l.da = l.d - l.a, l.ca = l.c - l.a, l.ba = b - l.a, i && (d = P(l.a, b, l.c, l.d), t.splice(v, 1, d[0], d[1], d[2], d[3]))
		}, b = function (t, e, i, s) {
			var r, n, a, o, h, l, p = [];
			if (s)
				for (n = (t = [s].concat(t)).length; - 1 < --n;) "string" == typeof (l = t[n][e]) && "=" === l.charAt(1) && (t[n][e] = s[e] + Number(l.charAt(0) + l.substr(2)));
			if ((r = t.length - 2) < 0) return p[0] = new y(t[0][e], 0, 0, t[0][e]), p;
			for (n = 0; n < r; n++) a = t[n][e], o = t[n + 1][e], p[n] = new y(a, 0, 0, o), i && (h = t[n + 2][e], x[n] = (x[n] || 0) + (o - a) * (o - a), T[n] = (T[n] || 0) + (h - o) * (h - o));
			return p[n] = new y(t[n][e], 0, 0, t[n + 1][e]), p
		}, c = function (t, e, i, s, r, n) {
			var a, o, h, l, p, f, u, c, d = {},
				m = [],
				g = n || t[0];
			for (o in r = "string" == typeof r ? "," + r + "," : ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,", null == e && (e = 1), t[0]) m.push(o);
			if (1 < t.length) {
				for (c = t[t.length - 1], u = !0, a = m.length; - 1 < --a;)
					if (o = m[a], .05 < Math.abs(g[o] - c[o])) {
						u = !1;
						break
					}
				u && (t = t.concat(), n && t.unshift(n), t.push(t[1]), n = t[t.length - 3])
			}
			for (x.length = T.length = k.length = 0, a = m.length; - 1 < --a;) o = m[a], _[o] = -1 !== r.indexOf("," + o + ","), d[o] = b(t, o, _[o], n);
			for (a = x.length; - 1 < --a;) x[a] = Math.sqrt(x[a]), T[a] = Math.sqrt(T[a]);
			if (!s) {
				for (a = m.length; - 1 < --a;)
					if (_[o])
						for (f = (h = d[m[a]]).length - 1, l = 0; l < f; l++) p = h[l + 1].da / T[l] + h[l].da / x[l] || 0, k[l] = (k[l] || 0) + p * p;
				for (a = k.length; - 1 < --a;) k[a] = Math.sqrt(k[a])
			}
			for (a = m.length, l = i ? 4 : 1; - 1 < --a;) h = d[o = m[a]], v(h, e, i, s, _[o]), u && (h.splice(0, l), h.splice(h.length - l, l));
			return d
		}, d = function (t, e, i) {
			for (var s, r, n, a, o, h, l, p, f, u, c, d = 1 / i, m = t.length; - 1 < --m;)
				for (n = (u = t[m]).a, a = u.d - n, o = u.c - n, h = u.b - n, s = r = 0, p = 1; p <= i; p++) s = r - (r = ((l = d * p) * l * a + 3 * (f = 1 - l) * (l * o + f * h)) * l), e[c = m * i + p - 1] = (e[c] || 0) + s * s
		}, g = _gsScope._gsDefine.plugin({
			propName: "bezier",
			priority: -1,
			version: "1.3.8",
			API: 2,
			global: !0,
			init: function (t, e, i) {
				this._target = t, e instanceof Array && (e = {
					values: e
				}), this._func = {}, this._mod = {}, this._props = [], this._timeRes = null == e.timeResolution ? 6 : parseInt(e.timeResolution, 10);
				var s, r, n, a, o, h = e.values || [],
					l = {},
					p = h[0],
					f = e.autoRotate || i.vars.orientToBezier;
				for (s in this._autoRotate = f ? f instanceof Array ? f : [
						["x", "y", "rotation", !0 === f ? 0 : Number(f) || 0]
					] : null, p) this._props.push(s);
				for (n = this._props.length; - 1 < --n;) s = this._props[n], this._overwriteProps.push(s), r = this._func[s] = "function" == typeof t[s], l[s] = r ? t[s.indexOf("set") || "function" != typeof t["get" + s.substr(3)] ? s : "get" + s.substr(3)]() : parseFloat(t[s]), o || l[s] !== h[0][s] && (o = l);
				if (this._beziers = "cubic" !== e.type && "quadratic" !== e.type && "soft" !== e.type ? c(h, isNaN(e.curviness) ? 1 : e.curviness, !1, "thruBasic" === e.type, e.correlate, o) : function (t, e, i) {
						var s, r, n, a, o, h, l, p, f, u, c, d = {},
							m = "cubic" === (e = e || "soft") ? 3 : 2,
							g = "soft" === e,
							_ = [];
						if (g && i && (t = [i].concat(t)), null == t || t.length < m + 1) throw "invalid Bezier data";
						for (f in t[0]) _.push(f);
						for (h = _.length; - 1 < --h;) {
							for (d[f = _[h]] = o = [], u = 0, p = t.length, l = 0; l < p; l++) s = null == i ? t[l][f] : "string" == typeof (c = t[l][f]) && "=" === c.charAt(1) ? i[f] + Number(c.charAt(0) + c.substr(2)) : Number(c), g && 1 < l && l < p - 1 && (o[u++] = (s + o[u - 2]) / 2), o[u++] = s;
							for (p = u - m + 1, l = u = 0; l < p; l += m) s = o[l], r = o[l + 1], n = o[l + 2], a = 2 === m ? 0 : o[l + 3], o[u++] = c = 3 === m ? new y(s, r, n, a) : new y(s, (2 * r + s) / 3, (2 * r + n) / 3, n);
							o.length = u
						}
						return d
					}(h, e.type, l), this._segCount = this._beziers[s].length, this._timeRes) {
					var u = function (t, e) {
						var i, s, r, n, a = [],
							o = [],
							h = 0,
							l = 0,
							p = (e = e >> 0 || 6) - 1,
							f = [],
							u = [];
						for (i in t) d(t[i], a, e);
						for (r = a.length, s = 0; s < r; s++) h += Math.sqrt(a[s]), u[n = s % e] = h, n === p && (l += h, f[n = s / e >> 0] = u, o[n] = l, h = 0, u = []);
						return {
							length: l,
							lengths: o,
							segments: f
						}
					}(this._beziers, this._timeRes);
					this._length = u.length, this._lengths = u.lengths, this._segments = u.segments, this._l1 = this._li = this._s1 = this._si = 0, this._l2 = this._lengths[0], this._curSeg = this._segments[0], this._s2 = this._curSeg[0], this._prec = 1 / this._curSeg.length
				}
				if (f = this._autoRotate)
					for (this._initialRotations = [], f[0] instanceof Array || (this._autoRotate = f = [f]), n = f.length; - 1 < --n;) {
						for (a = 0; a < 3; a++) s = f[n][a], this._func[s] = "function" == typeof t[s] && t[s.indexOf("set") || "function" != typeof t["get" + s.substr(3)] ? s : "get" + s.substr(3)];
						s = f[n][2], this._initialRotations[n] = (this._func[s] ? this._func[s].call(this._target) : this._target[s]) || 0, this._overwriteProps.push(s)
					}
				return this._startRatio = i.vars.runBackwards ? 1 : 0, !0
			},
			set: function (t) {
				var e, i, s, r, n, a, o, h, l, p, f = this._segCount,
					u = this._func,
					c = this._target,
					d = t !== this._startRatio;
				if (this._timeRes) {
					if (l = this._lengths, p = this._curSeg, t *= this._length, s = this._li, t > this._l2 && s < f - 1) {
						for (h = f - 1; s < h && (this._l2 = l[++s]) <= t;);
						this._l1 = l[s - 1], this._li = s, this._curSeg = p = this._segments[s], this._s2 = p[this._s1 = this._si = 0]
					} else if (t < this._l1 && 0 < s) {
						for (; 0 < s && (this._l1 = l[--s]) >= t;);
						0 === s && t < this._l1 ? this._l1 = 0 : s++, this._l2 = l[s], this._li = s, this._curSeg = p = this._segments[s], this._s1 = p[(this._si = p.length - 1) - 1] || 0, this._s2 = p[this._si]
					}
					if (e = s, t -= this._l1, s = this._si, t > this._s2 && s < p.length - 1) {
						for (h = p.length - 1; s < h && (this._s2 = p[++s]) <= t;);
						this._s1 = p[s - 1], this._si = s
					} else if (t < this._s1 && 0 < s) {
						for (; 0 < s && (this._s1 = p[--s]) >= t;);
						0 === s && t < this._s1 ? this._s1 = 0 : s++, this._s2 = p[s], this._si = s
					}
					a = (s + (t - this._s1) / (this._s2 - this._s1)) * this._prec || 0
				} else a = (t - (e = t < 0 ? 0 : 1 <= t ? f - 1 : f * t >> 0) * (1 / f)) * f;
				for (i = 1 - a, s = this._props.length; - 1 < --s;) r = this._props[s], o = (a * a * (n = this._beziers[r][e]).da + 3 * i * (a * n.ca + i * n.ba)) * a + n.a, this._mod[r] && (o = this._mod[r](o, c)), u[r] ? c[r](o) : c[r] = o;
				if (this._autoRotate) {
					var m, g, _, y, v, b, x, T = this._autoRotate;
					for (s = T.length; - 1 < --s;) r = T[s][2], b = T[s][3] || 0, x = !0 === T[s][4] ? 1 : w, n = this._beziers[T[s][0]], m = this._beziers[T[s][1]], n && m && (n = n[e], m = m[e], g = n.a + (n.b - n.a) * a, g += ((y = n.b + (n.c - n.b) * a) - g) * a, y += (n.c + (n.d - n.c) * a - y) * a, _ = m.a + (m.b - m.a) * a, _ += ((v = m.b + (m.c - m.b) * a) - _) * a, v += (m.c + (m.d - m.c) * a - v) * a, o = d ? Math.atan2(v - _, y - g) * x + b : this._initialRotations[s], this._mod[r] && (o = this._mod[r](o, c)), u[r] ? c[r](o) : c[r] = o)
				}
			}
		}), s = g.prototype, g.bezierThrough = c, g.cubicToQuadratic = P, g._autoCSS = !0, g.quadraticToCubic = function (t, e, i) {
			return new y(t, (2 * e + t) / 3, (2 * e + i) / 3, i)
		}, g._cssRegister = function () {
			var t = i.CSSPlugin;
			if (t) {
				var e = t._internals,
					c = e._parseToProxy,
					d = e._setPluginRatio,
					m = e.CSSPropTween;
				e._registerComplexSpecialProp("bezier", {
					parser: function (t, e, i, s, r, n) {
						e instanceof Array && (e = {
							values: e
						}), n = new g;
						var a, o, h, l = e.values,
							p = l.length - 1,
							f = [],
							u = {};
						if (p < 0) return r;
						for (a = 0; a <= p; a++) h = c(t, l[a], s, r, n, p !== a), f[a] = h.end;
						for (o in e) u[o] = e[o];
						return u.values = f, (r = new m(t, "bezier", 0, 0, h.pt, 2)).data = h, r.plugin = n, r.setRatio = d, 0 === u.autoRotate && (u.autoRotate = !0), !u.autoRotate || u.autoRotate instanceof Array || (a = !0 === u.autoRotate ? 0 : Number(u.autoRotate), u.autoRotate = null != h.end.left ? [
							["left", "top", "rotation", a, !1]
						] : null != h.end.x && [
							["x", "y", "rotation", a, !1]
						]), u.autoRotate && (s._transform || s._enableTransforms(!1), h.autoRotate = s._target._gsTransform, h.proxy.rotation = h.autoRotate.rotation || 0, s._overwriteProps.push("rotation")), n._onInitTween(h.proxy, u, s._tween), r
					}
				})
			}
		}, s._mod = function (t) {
			for (var e, i = this._overwriteProps, s = i.length; - 1 < --s;)(e = t[i[s]]) && "function" == typeof e && (this._mod[i[s]] = e)
		}, s._kill = function (t) {
			var e, i, s = this._props;
			for (e in this._beziers)
				if (e in t)
					for (delete this._beziers[e], delete this._func[e], i = s.length; - 1 < --i;) s[i] === e && s.splice(i, 1);
			if (s = this._autoRotate)
				for (i = s.length; - 1 < --i;) t[s[i][2]] && s.splice(i, 1);
			return this._super._kill.call(this, t)
		}, _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function (n, B) {
			var d, k, A, m, j = function () {
					n.call(this, "css"), this._overwriteProps.length = 0, this.setRatio = j.prototype.setRatio
				},
				l = _gsScope._gsDefine.globals,
				g = {},
				t = j.prototype = new n("css");
			(t.constructor = j).version = "2.0.2", j.API = 2, j.defaultTransformPerspective = 0, j.defaultSkewType = "compensated", j.defaultSmoothOrigin = !0, t = "px", j.suffixMap = {
				top: t,
				right: t,
				bottom: t,
				left: t,
				width: t,
				height: t,
				fontSize: t,
				padding: t,
				margin: t,
				perspective: t,
				lineHeight: ""
			};
			var S, _, y, X, v, P, D, C, e, i, M = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
				F = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
				b = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,
				p = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g,
				E = /(?:\d|\-|\+|=|#|\.)*/g,
				I = /opacity *= *([^)]*)/i,
				x = /opacity:([^;]*)/i,
				a = /alpha\(opacity *=.+?\)/i,
				T = /^(rgb|hsl)/,
				o = /([A-Z])/g,
				h = /-([a-z])/gi,
				w = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,
				f = function (t, e) {
					return e.toUpperCase()
				},
				c = /(?:Left|Right|Width)/i,
				u = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
				R = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
				O = /,(?=[^\)]*(?:\(|$))/gi,
				L = /[\s,\(]/i,
				Y = Math.PI / 180,
				q = 180 / Math.PI,
				z = {},
				s = {
					style: {}
				},
				N = _gsScope.document || {
					createElement: function () {
						return s
					}
				},
				V = function (t, e) {
					return N.createElementNS ? N.createElementNS(e || "http://www.w3.org/1999/xhtml", t) : N.createElement(t)
				},
				G = V("div"),
				W = V("img"),
				r = j._internals = {
					_specialProps: g
				},
				U = (_gsScope.navigator || {}).userAgent || "",
				H = (e = U.indexOf("Android"), i = V("a"), y = -1 !== U.indexOf("Safari") && -1 === U.indexOf("Chrome") && (-1 === e || 3 < parseFloat(U.substr(e + 8, 2))), v = y && parseFloat(U.substr(U.indexOf("Version/") + 8, 2)) < 6, X = -1 !== U.indexOf("Firefox"), (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(U) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(U)) && (P = parseFloat(RegExp.$1)), !!i && (i.style.cssText = "top:1px;opacity:.55;", /^0.55/.test(i.style.opacity))),
				Z = function (t) {
					return I.test("string" == typeof t ? t : (t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
				},
				$ = function (t) {
					_gsScope.console && console.log(t)
				},
				Q = "",
				K = "",
				J = function (t, e) {
					var i, s, r = (e = e || G).style;
					if (void 0 !== r[t]) return t;
					for (t = t.charAt(0).toUpperCase() + t.substr(1), i = ["O", "Moz", "ms", "Ms", "Webkit"], s = 5; - 1 < --s && void 0 === r[i[s] + t];);
					return 0 <= s ? (Q = "-" + (K = 3 === s ? "ms" : i[s]).toLowerCase() + "-", K + t) : null
				},
				tt = ("undefined" != typeof window ? window : N.defaultView || {
					getComputedStyle: function () {}
				}).getComputedStyle,
				et = j.getStyle = function (t, e, i, s, r) {
					var n;
					return H || "opacity" !== e ? (!s && t.style[e] ? n = t.style[e] : (i = i || tt(t)) ? n = i[e] || i.getPropertyValue(e) || i.getPropertyValue(e.replace(o, "-$1").toLowerCase()) : t.currentStyle && (n = t.currentStyle[e]), null == r || n && "none" !== n && "auto" !== n && "auto auto" !== n ? n : r) : Z(t)
				},
				it = r.convertToPixels = function (t, e, i, s, r) {
					if ("px" === s || !s && "lineHeight" !== e) return i;
					if ("auto" === s || !i) return 0;
					var n, a, o, h = c.test(e),
						l = t,
						p = G.style,
						f = i < 0,
						u = 1 === i;
					if (f && (i = -i), u && (i *= 100), "lineHeight" !== e || s)
						if ("%" === s && -1 !== e.indexOf("border")) n = i / 100 * (h ? t.clientWidth : t.clientHeight);
						else {
							if (p.cssText = "border:0 solid red;position:" + et(t, "position") + ";line-height:0;", "%" !== s && l.appendChild && "v" !== s.charAt(0) && "rem" !== s) p[h ? "borderLeftWidth" : "borderTopWidth"] = i + s;
							else {
								if (l = t.parentNode || N.body, -1 !== et(l, "display").indexOf("flex") && (p.position = "absolute"), a = l._gsCache, o = B.ticker.frame, a && h && a.time === o) return a.width * i / 100;
								p[h ? "width" : "height"] = i + s
							}
							l.appendChild(G), n = parseFloat(G[h ? "offsetWidth" : "offsetHeight"]), l.removeChild(G), h && "%" === s && !1 !== j.cacheWidths && ((a = l._gsCache = l._gsCache || {}).time = o, a.width = n / i * 100), 0 !== n || r || (n = it(t, e, i, s, !0))
						}
					else a = tt(t).lineHeight, t.style.lineHeight = i, n = parseFloat(tt(t).lineHeight), t.style.lineHeight = a;
					return u && (n /= 100), f ? -n : n
				},
				st = r.calculateOffset = function (t, e, i) {
					if ("absolute" !== et(t, "position", i)) return 0;
					var s = "left" === e ? "Left" : "Top",
						r = et(t, "margin" + s, i);
					return t["offset" + s] - (it(t, e, parseFloat(r), r.replace(E, "")) || 0)
				},
				rt = function (t, e) {
					var i, s, r, n = {};
					if (e = e || tt(t, null))
						if (i = e.length)
							for (; - 1 < --i;)(-1 === (r = e[i]).indexOf("-transform") || Ot === r) && (n[r.replace(h, f)] = e.getPropertyValue(r));
						else
							for (i in e)(-1 === i.indexOf("Transform") || Rt === i) && (n[i] = e[i]);
					else if (e = t.currentStyle || t.style)
						for (i in e) "string" == typeof i && void 0 === n[i] && (n[i.replace(h, f)] = e[i]);
					return H || (n.opacity = Z(t)), s = Ht(t, e, !1), n.rotation = s.rotation, n.skewX = s.skewX, n.scaleX = s.scaleX, n.scaleY = s.scaleY, n.x = s.x, n.y = s.y, zt && (n.z = s.z, n.rotationX = s.rotationX, n.rotationY = s.rotationY, n.scaleZ = s.scaleZ), n.filters && delete n.filters, n
				},
				nt = function (t, e, i, s, r) {
					var n, a, o, h = {},
						l = t.style;
					for (a in i) "cssText" !== a && "length" !== a && isNaN(a) && (e[a] !== (n = i[a]) || r && r[a]) && -1 === a.indexOf("Origin") && ("number" == typeof n || "string" == typeof n) && (h[a] = "auto" !== n || "left" !== a && "top" !== a ? "" !== n && "auto" !== n && "none" !== n || "string" != typeof e[a] || "" === e[a].replace(p, "") ? n : 0 : st(t, a), void 0 !== l[a] && (o = new bt(l, a, l[a], o)));
					if (s)
						for (a in s) "className" !== a && (h[a] = s[a]);
					return {
						difs: h,
						firstMPT: o
					}
				},
				at = {
					width: ["Left", "Right"],
					height: ["Top", "Bottom"]
				},
				ot = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
				ht = function (t, e, i) {
					if ("svg" === (t.nodeName + "").toLowerCase()) return (i || tt(t))[e] || 0;
					if (t.getCTM && Gt(t)) return t.getBBox()[e] || 0;
					var s = parseFloat("width" === e ? t.offsetWidth : t.offsetHeight),
						r = at[e],
						n = r.length;
					for (i = i || tt(t, null); - 1 < --n;) s -= parseFloat(et(t, "padding" + r[n], i, !0)) || 0, s -= parseFloat(et(t, "border" + r[n] + "Width", i, !0)) || 0;
					return s
				},
				lt = function (t, e) {
					if ("contain" === t || "auto" === t || "auto auto" === t) return t + " ";
					(null == t || "" === t) && (t = "0 0");
					var i, s = t.split(" "),
						r = -1 !== t.indexOf("left") ? "0%" : -1 !== t.indexOf("right") ? "100%" : s[0],
						n = -1 !== t.indexOf("top") ? "0%" : -1 !== t.indexOf("bottom") ? "100%" : s[1];
					if (3 < s.length && !e) {
						for (s = t.split(", ").join(",").split(","), t = [], i = 0; i < s.length; i++) t.push(lt(s[i]));
						return t.join(",")
					}
					return null == n ? n = "center" === r ? "50%" : "0" : "center" === n && (n = "50%"), ("center" === r || isNaN(parseFloat(r)) && -1 === (r + "").indexOf("=")) && (r = "50%"), t = r + " " + n + (2 < s.length ? " " + s[2] : ""), e && (e.oxp = -1 !== r.indexOf("%"), e.oyp = -1 !== n.indexOf("%"), e.oxr = "=" === r.charAt(1), e.oyr = "=" === n.charAt(1), e.ox = parseFloat(r.replace(p, "")), e.oy = parseFloat(n.replace(p, "")), e.v = t), e || t
				},
				pt = function (t, e) {
					return "function" == typeof t && (t = t(C, D)), "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) : parseFloat(t) - parseFloat(e) || 0
				},
				ft = function (t, e) {
					"function" == typeof t && (t = t(C, D));
					var i = "string" == typeof t && "=" === t.charAt(1);
					return "string" == typeof t && "v" === t.charAt(t.length - 2) && (t = (i ? t.substr(0, 2) : 0) + window["inner" + ("vh" === t.substr(-2) ? "Height" : "Width")] * (parseFloat(i ? t.substr(2) : t) / 100)), null == t ? e : i ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) + e : parseFloat(t) || 0
				},
				ut = function (t, e, i, s) {
					var r, n, a, o, h;
					return "function" == typeof t && (t = t(C, D)), null == t ? o = e : "number" == typeof t ? o = t : (r = 360, n = t.split("_"), a = ((h = "=" === t.charAt(1)) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(n[0].substr(2)) : parseFloat(n[0])) * (-1 === t.indexOf("rad") ? 1 : q) - (h ? 0 : e), n.length && (s && (s[i] = e + a), -1 !== t.indexOf("short") && ((a %= r) !== a % 180 && (a = a < 0 ? a + r : a - r)), -1 !== t.indexOf("_cw") && a < 0 ? a = (a + 3599999999640) % r - (a / r | 0) * r : -1 !== t.indexOf("ccw") && 0 < a && (a = (a - 3599999999640) % r - (a / r | 0) * r)), o = e + a), o < 1e-6 && -1e-6 < o && (o = 0), o
				},
				ct = {
					aqua: [0, 255, 255],
					lime: [0, 255, 0],
					silver: [192, 192, 192],
					black: [0, 0, 0],
					maroon: [128, 0, 0],
					teal: [0, 128, 128],
					blue: [0, 0, 255],
					navy: [0, 0, 128],
					white: [255, 255, 255],
					fuchsia: [255, 0, 255],
					olive: [128, 128, 0],
					yellow: [255, 255, 0],
					orange: [255, 165, 0],
					gray: [128, 128, 128],
					purple: [128, 0, 128],
					green: [0, 128, 0],
					red: [255, 0, 0],
					pink: [255, 192, 203],
					cyan: [0, 255, 255],
					transparent: [255, 255, 255, 0]
				},
				dt = function (t, e, i) {
					return 255 * (6 * (t = t < 0 ? t + 1 : 1 < t ? t - 1 : t) < 1 ? e + (i - e) * t * 6 : t < .5 ? i : 3 * t < 2 ? e + (i - e) * (2 / 3 - t) * 6 : e) + .5 | 0
				},
				mt = j.parseColor = function (t, e) {
					var i, s, r, n, a, o, h, l, p, f, u;
					if (t)
						if ("number" == typeof t) i = [t >> 16, t >> 8 & 255, 255 & t];
						else {
							if ("," === t.charAt(t.length - 1) && (t = t.substr(0, t.length - 1)), ct[t]) i = ct[t];
							else if ("#" === t.charAt(0)) 4 === t.length && (t = "#" + (s = t.charAt(1)) + s + (r = t.charAt(2)) + r + (n = t.charAt(3)) + n), i = [(t = parseInt(t.substr(1), 16)) >> 16, t >> 8 & 255, 255 & t];
							else if ("hsl" === t.substr(0, 3))
								if (i = u = t.match(M), e) {
									if (-1 !== t.indexOf("=")) return t.match(F)
								} else a = Number(i[0]) % 360 / 360, o = Number(i[1]) / 100, s = 2 * (h = Number(i[2]) / 100) - (r = h <= .5 ? h * (o + 1) : h + o - h * o), 3 < i.length && (i[3] = Number(i[3])), i[0] = dt(a + 1 / 3, s, r), i[1] = dt(a, s, r), i[2] = dt(a - 1 / 3, s, r);
							else i = t.match(M) || ct.transparent;
							i[0] = Number(i[0]), i[1] = Number(i[1]), i[2] = Number(i[2]), 3 < i.length && (i[3] = Number(i[3]))
						}
					else i = ct.black;
					return e && !u && (s = i[0] / 255, r = i[1] / 255, n = i[2] / 255, h = ((l = Math.max(s, r, n)) + (p = Math.min(s, r, n))) / 2, l === p ? a = o = 0 : (f = l - p, o = .5 < h ? f / (2 - l - p) : f / (l + p), a = l === s ? (r - n) / f + (r < n ? 6 : 0) : l === r ? (n - s) / f + 2 : (s - r) / f + 4, a *= 60), i[0] = a + .5 | 0, i[1] = 100 * o + .5 | 0, i[2] = 100 * h + .5 | 0), i
				},
				gt = function (t, e) {
					var i, s, r, n = t.match(_t) || [],
						a = 0,
						o = "";
					if (!n.length) return t;
					for (i = 0; i < n.length; i++) s = n[i], a += (r = t.substr(a, t.indexOf(s, a) - a)).length + s.length, 3 === (s = mt(s, e)).length && s.push(1), o += r + (e ? "hsla(" + s[0] + "," + s[1] + "%," + s[2] + "%," + s[3] : "rgba(" + s.join(",")) + ")";
					return o + t.substr(a)
				},
				_t = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
			for (t in ct) _t += "|" + t + "\\b";
			_t = new RegExp(_t + ")", "gi"), j.colorStringFilter = function (t) {
				var e, i = t[0] + " " + t[1];
				_t.test(i) && (e = -1 !== i.indexOf("hsl(") || -1 !== i.indexOf("hsla("), t[0] = gt(t[0], e), t[1] = gt(t[1], e)), _t.lastIndex = 0
			}, B.defaultStringFilter || (B.defaultStringFilter = j.colorStringFilter);
			var yt = function (t, e, n, a) {
					if (null == t) return function (t) {
						return t
					};
					var o, h = e ? (t.match(_t) || [""])[0] : "",
						l = t.split(h).join("").match(b) || [],
						p = t.substr(0, t.indexOf(l[0])),
						f = ")" === t.charAt(t.length - 1) ? ")" : "",
						u = -1 !== t.indexOf(" ") ? " " : ",",
						c = l.length,
						d = 0 < c ? l[0].replace(M, "") : "";
					return c ? o = e ? function (t) {
						var e, i, s, r;
						if ("number" == typeof t) t += d;
						else if (a && O.test(t)) {
							for (r = t.replace(O, "|").split("|"), s = 0; s < r.length; s++) r[s] = o(r[s]);
							return r.join(",")
						}
						if (e = (t.match(_t) || [h])[0], s = (i = t.split(e).join("").match(b) || []).length, c > s--)
							for (; ++s < c;) i[s] = n ? i[(s - 1) / 2 | 0] : l[s];
						return p + i.join(u) + u + e + f + (-1 !== t.indexOf("inset") ? " inset" : "")
					} : function (t) {
						var e, i, s;
						if ("number" == typeof t) t += d;
						else if (a && O.test(t)) {
							for (i = t.replace(O, "|").split("|"), s = 0; s < i.length; s++) i[s] = o(i[s]);
							return i.join(",")
						}
						if (s = (e = t.match(b) || []).length, c > s--)
							for (; ++s < c;) e[s] = n ? e[(s - 1) / 2 | 0] : l[s];
						return p + e.join(u) + f
					} : function (t) {
						return t
					}
				},
				vt = function (l) {
					return l = l.split(","),
						function (t, e, i, s, r, n, a) {
							var o, h = (e + "").split(" ");
							for (a = {}, o = 0; o < 4; o++) a[l[o]] = h[o] = h[o] || h[(o - 1) / 2 >> 0];
							return s.parse(t, a, r, n)
						}
				},
				bt = (r._setPluginRatio = function (t) {
					this.plugin.setRatio(t);
					for (var e, i, s, r, n, a = this.data, o = a.proxy, h = a.firstMPT; h;) e = o[h.v], h.r ? e = h.r(e) : e < 1e-6 && -1e-6 < e && (e = 0), h.t[h.p] = e, h = h._next;
					if (a.autoRotate && (a.autoRotate.rotation = a.mod ? a.mod.call(this._tween, o.rotation, this.t, this._tween) : o.rotation), 1 === t || 0 === t)
						for (h = a.firstMPT, n = 1 === t ? "e" : "b"; h;) {
							if ((i = h.t).type) {
								if (1 === i.type) {
									for (r = i.xs0 + i.s + i.xs1, s = 1; s < i.l; s++) r += i["xn" + s] + i["xs" + (s + 1)];
									i[n] = r
								}
							} else i[n] = i.s + i.xs0;
							h = h._next
						}
				}, function (t, e, i, s, r) {
					this.t = t, this.p = e, this.v = i, this.r = r, s && ((s._prev = this)._next = s)
				}),
				xt = (r._parseToProxy = function (t, e, i, s, r, n) {
					var a, o, h, l, p, f = s,
						u = {},
						c = {},
						d = i._transform,
						m = z;
					for (i._transform = null, z = e, s = p = i.parse(t, e, s, r), z = m, n && (i._transform = d, f && (f._prev = null, f._prev && (f._prev._next = null))); s && s !== f;) {
						if (s.type <= 1 && (c[o = s.p] = s.s + s.c, u[o] = s.s, n || (l = new bt(s, "s", o, l, s.r), s.c = 0), 1 === s.type))
							for (a = s.l; 0 < --a;) h = "xn" + a, c[o = s.p + "_" + h] = s.data[h], u[o] = s[h], n || (l = new bt(s, h, o, l, s.rxp[h]));
						s = s._next
					}
					return {
						proxy: u,
						end: c,
						firstMPT: l,
						pt: p
					}
				}, r.CSSPropTween = function (t, e, i, s, r, n, a, o, h, l, p) {
					this.t = t, this.p = e, this.s = i, this.c = s, this.n = a || e, t instanceof xt || m.push(this.n), this.r = o ? "function" == typeof o ? o : Math.round : o, this.type = n || 0, h && (this.pr = h, d = !0), this.b = void 0 === l ? i : l, this.e = void 0 === p ? i + s : p, r && ((this._next = r)._prev = this)
				}),
				Tt = function (t, e, i, s, r, n) {
					var a = new xt(t, e, i, s - i, r, -1, n);
					return a.b = i, a.e = a.xs0 = s, a
				},
				wt = j.parseComplex = function (t, e, i, s, r, n, a, o, h, l) {
					i = i || n || "", "function" == typeof s && (s = s(C, D)), a = new xt(t, e, 0, 0, a, l ? 2 : 1, null, !1, o, i, s), s += "", r && _t.test(s + i) && (s = [i, s], j.colorStringFilter(s), i = s[0], s = s[1]);
					var p, f, u, c, d, m, g, _, y, v, b, x, T, w = i.split(", ").join(",").split(" "),
						k = s.split(", ").join(",").split(" "),
						P = w.length,
						A = !1 !== S;
					for ((-1 !== s.indexOf(",") || -1 !== i.indexOf(",")) && (-1 !== (s + i).indexOf("rgb") || -1 !== (s + i).indexOf("hsl") ? (w = w.join(" ").replace(O, ", ").split(" "), k = k.join(" ").replace(O, ", ").split(" ")) : (w = w.join(" ").split(",").join(", ").split(" "), k = k.join(" ").split(",").join(", ").split(" ")), P = w.length), P !== k.length && (P = (w = (n || "").split(" ")).length), a.plugin = h, a.setRatio = l, p = _t.lastIndex = 0; p < P; p++)
						if (c = w[p], d = k[p] + "", (_ = parseFloat(c)) || 0 === _) a.appendXtra("", _, pt(d, _), d.replace(F, ""), !(!A || -1 === d.indexOf("px")) && Math.round, !0);
						else if (r && _t.test(c)) x = ")" + ((x = d.indexOf(")") + 1) ? d.substr(x) : ""), T = -1 !== d.indexOf("hsl") && H, v = d, c = mt(c, T), d = mt(d, T), (y = 6 < c.length + d.length) && !H && 0 === d[3] ? (a["xs" + a.l] += a.l ? " transparent" : "transparent", a.e = a.e.split(k[p]).join("transparent")) : (H || (y = !1), T ? a.appendXtra(v.substr(0, v.indexOf("hsl")) + (y ? "hsla(" : "hsl("), c[0], pt(d[0], c[0]), ",", !1, !0).appendXtra("", c[1], pt(d[1], c[1]), "%,", !1).appendXtra("", c[2], pt(d[2], c[2]), y ? "%," : "%" + x, !1) : a.appendXtra(v.substr(0, v.indexOf("rgb")) + (y ? "rgba(" : "rgb("), c[0], d[0] - c[0], ",", Math.round, !0).appendXtra("", c[1], d[1] - c[1], ",", Math.round).appendXtra("", c[2], d[2] - c[2], y ? "," : x, Math.round), y && (c = c.length < 4 ? 1 : c[3], a.appendXtra("", c, (d.length < 4 ? 1 : d[3]) - c, x, !1))), _t.lastIndex = 0;
					else if (m = c.match(M)) {
						if (!(g = d.match(F)) || g.length !== m.length) return a;
						for (f = u = 0; f < m.length; f++) b = m[f], v = c.indexOf(b, u), a.appendXtra(c.substr(u, v - u), Number(b), pt(g[f], b), "", !(!A || "px" !== c.substr(v + b.length, 2)) && Math.round, 0 === f), u = v + b.length;
						a["xs" + a.l] += c.substr(u)
					} else a["xs" + a.l] += a.l || a["xs" + a.l] ? " " + d : d;
					if (-1 !== s.indexOf("=") && a.data) {
						for (x = a.xs0 + a.data.s, p = 1; p < a.l; p++) x += a["xs" + p] + a.data["xn" + p];
						a.e = x + a["xs" + p]
					}
					return a.l || (a.type = -1, a.xs0 = a.e), a.xfirst || a
				},
				kt = 9;
			for ((t = xt.prototype).l = t.pr = 0; 0 < --kt;) t["xn" + kt] = 0, t["xs" + kt] = "";
			t.xs0 = "", t._next = t._prev = t.xfirst = t.data = t.plugin = t.setRatio = t.rxp = null, t.appendXtra = function (t, e, i, s, r, n) {
				var a = this,
					o = a.l;
				return a["xs" + o] += n && (o || a["xs" + o]) ? " " + t : t || "", i || 0 === o || a.plugin ? (a.l++, a.type = a.setRatio ? 2 : 1, a["xs" + a.l] = s || "", 0 < o ? (a.data["xn" + o] = e + i, a.rxp["xn" + o] = r, a["xn" + o] = e, a.plugin || (a.xfirst = new xt(a, "xn" + o, e, i, a.xfirst || a, 0, a.n, r, a.pr), a.xfirst.xs0 = 0)) : (a.data = {
					s: e + i
				}, a.rxp = {}, a.s = e, a.c = i, a.r = r)) : a["xs" + o] += e + (s || ""), a
			};
			var Pt = function (t, e) {
					e = e || {}, this.p = e.prefix && J(t) || t, g[t] = g[this.p] = this, this.format = e.formatter || yt(e.defaultValue, e.color, e.collapsible, e.multi), e.parser && (this.parse = e.parser), this.clrs = e.color, this.multi = e.multi, this.keyword = e.keyword, this.dflt = e.defaultValue, this.pr = e.priority || 0
				},
				At = r._registerComplexSpecialProp = function (t, e, i) {
					"object" != typeof e && (e = {
						parser: i
					});
					var s, r = t.split(","),
						n = e.defaultValue;
					for (i = i || [n], s = 0; s < r.length; s++) e.prefix = 0 === s && e.prefix, e.defaultValue = i[s] || n, new Pt(r[s], e)
				},
				St = r._registerPluginProp = function (t) {
					if (!g[t]) {
						var h = t.charAt(0).toUpperCase() + t.substr(1) + "Plugin";
						At(t, {
							parser: function (t, e, i, s, r, n, a) {
								var o = l.com.greensock.plugins[h];
								return o ? (o._cssRegister(), g[i].parse(t, e, i, s, r, n, a)) : ($("Error: " + h + " js file not loaded."), r)
							}
						})
					}
				};
			(t = Pt.prototype).parseComplex = function (t, e, i, s, r, n) {
				var a, o, h, l, p, f, u = this.keyword;
				if (this.multi && (O.test(i) || O.test(e) ? (o = e.replace(O, "|").split("|"), h = i.replace(O, "|").split("|")) : u && (o = [e], h = [i])), h) {
					for (l = h.length > o.length ? h.length : o.length, a = 0; a < l; a++) e = o[a] = o[a] || this.dflt, i = h[a] = h[a] || this.dflt, u && ((p = e.indexOf(u)) !== (f = i.indexOf(u)) && (-1 === f ? o[a] = o[a].split(u).join("") : -1 === p && (o[a] += " " + u)));
					e = o.join(", "), i = h.join(", ")
				}
				return wt(t, this.p, e, i, this.clrs, this.dflt, s, this.pr, r, n)
			}, t.parse = function (t, e, i, s, r, n, a) {
				return this.parseComplex(t.style, this.format(et(t, this.p, A, !1, this.dflt)), this.format(e), r, n)
			}, j.registerSpecialProp = function (t, h, l) {
				At(t, {
					parser: function (t, e, i, s, r, n, a) {
						var o = new xt(t, i, 0, 0, r, 2, i, !1, l);
						return o.plugin = n, o.setRatio = h(t, e, s._tween, i), o
					},
					priority: l
				})
			}, j.useSVGTransformAttr = !0;
			var Dt, Ct, Mt, Ft, Et, It = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","),
				Rt = J("transform"),
				Ot = Q + "transform",
				Lt = J("transformOrigin"),
				zt = null !== J("perspective"),
				Nt = r.Transform = function () {
					this.perspective = parseFloat(j.defaultTransformPerspective) || 0, this.force3D = !(!1 === j.defaultForce3D || !zt) && (j.defaultForce3D || "auto")
				},
				Vt = _gsScope.SVGElement,
				Bt = function (t, e, i) {
					var s, r = N.createElementNS("http://www.w3.org/2000/svg", t),
						n = /([a-z])([A-Z])/g;
					for (s in i) r.setAttributeNS(null, s.replace(n, "$1-$2").toLowerCase(), i[s]);
					return e.appendChild(r), r
				},
				jt = N.documentElement || {},
				Xt = (Et = P || /Android/i.test(U) && !_gsScope.chrome, N.createElementNS && !Et && (Ct = Bt("svg", jt), Ft = (Mt = Bt("rect", Ct, {
					width: 100,
					height: 50,
					x: 100
				})).getBoundingClientRect().width, Mt.style[Lt] = "50% 50%", Mt.style[Rt] = "scaleX(0.5)", Et = Ft === Mt.getBoundingClientRect().width && !(X && zt), jt.removeChild(Ct)), Et),
				Yt = function (t, e, i, s, r, n) {
					var a, o, h, l, p, f, u, c, d, m, g, _, y, v, b = t._gsTransform,
						x = Ut(t, !0);
					b && (y = b.xOrigin, v = b.yOrigin), (!s || (a = s.split(" ")).length < 2) && (0 === (u = t.getBBox()).x && 0 === u.y && u.width + u.height === 0 && (u = {
						x: parseFloat(t.hasAttribute("x") ? t.getAttribute("x") : t.hasAttribute("cx") ? t.getAttribute("cx") : 0) || 0,
						y: parseFloat(t.hasAttribute("y") ? t.getAttribute("y") : t.hasAttribute("cy") ? t.getAttribute("cy") : 0) || 0,
						width: 0,
						height: 0
					}), a = [(-1 !== (e = lt(e).split(" "))[0].indexOf("%") ? parseFloat(e[0]) / 100 * u.width : parseFloat(e[0])) + u.x, (-1 !== e[1].indexOf("%") ? parseFloat(e[1]) / 100 * u.height : parseFloat(e[1])) + u.y]), i.xOrigin = l = parseFloat(a[0]), i.yOrigin = p = parseFloat(a[1]), s && x !== Wt && (f = x[0], u = x[1], c = x[2], d = x[3], m = x[4], g = x[5], (_ = f * d - u * c) && (o = l * (d / _) + p * (-c / _) + (c * g - d * m) / _, h = l * (-u / _) + p * (f / _) - (f * g - u * m) / _, l = i.xOrigin = a[0] = o, p = i.yOrigin = a[1] = h)), b && (n && (i.xOffset = b.xOffset, i.yOffset = b.yOffset, b = i), r || !1 !== r && !1 !== j.defaultSmoothOrigin ? (o = l - y, h = p - v, b.xOffset += o * x[0] + h * x[2] - o, b.yOffset += o * x[1] + h * x[3] - h) : b.xOffset = b.yOffset = 0), n || t.setAttribute("data-svg-origin", a.join(" "))
				},
				qt = function (t) {
					var e, i = V("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
						s = this.parentNode,
						r = this.nextSibling,
						n = this.style.cssText;
					if (jt.appendChild(i), i.appendChild(this), this.style.display = "block", t) try {
						e = this.getBBox(), this._originalGetBBox = this.getBBox, this.getBBox = qt
					} catch (t) {} else this._originalGetBBox && (e = this._originalGetBBox());
					return r ? s.insertBefore(this, r) : s.appendChild(this), jt.removeChild(i), this.style.cssText = n, e
				},
				Gt = function (t) {
					return !(!Vt || !t.getCTM || t.parentNode && !t.ownerSVGElement || ! function (e) {
						try {
							return e.getBBox()
						} catch (t) {
							return qt.call(e, !0)
						}
					}(t))
				},
				Wt = [1, 0, 0, 1, 0, 0],
				Ut = function (t, e) {
					var i, s, r, n, a, o, h = t._gsTransform || new Nt,
						l = t.style;
					if (Rt ? s = et(t, Ot, null, !0) : t.currentStyle && (s = (s = t.currentStyle.filter.match(u)) && 4 === s.length ? [s[0].substr(4), Number(s[2].substr(4)), Number(s[1].substr(4)), s[3].substr(4), h.x || 0, h.y || 0].join(",") : ""), i = !s || "none" === s || "matrix(1, 0, 0, 1, 0, 0)" === s, !Rt || !(o = !tt(t) || "none" === tt(t).display) && t.parentNode || (o && (n = l.display, l.display = "block"), t.parentNode || (a = 1, jt.appendChild(t)), i = !(s = et(t, Ot, null, !0)) || "none" === s || "matrix(1, 0, 0, 1, 0, 0)" === s, n ? l.display = n : o && Kt(l, "display"), a && jt.removeChild(t)), (h.svg || t.getCTM && Gt(t)) && (i && -1 !== (l[Rt] + "").indexOf("matrix") && (s = l[Rt], i = 0), r = t.getAttribute("transform"), i && r && (s = "matrix(" + (r = t.transform.baseVal.consolidate().matrix).a + "," + r.b + "," + r.c + "," + r.d + "," + r.e + "," + r.f + ")", i = 0)), i) return Wt;
					for (r = (s || "").match(M) || [], kt = r.length; - 1 < --kt;) n = Number(r[kt]), r[kt] = (a = n - (n |= 0)) ? (1e5 * a + (a < 0 ? -.5 : .5) | 0) / 1e5 + n : n;
					return e && 6 < r.length ? [r[0], r[1], r[4], r[5], r[12], r[13]] : r
				},
				Ht = r.getTransform = function (t, e, i, s) {
					if (t._gsTransform && i && !s) return t._gsTransform;
					var r, n, a, o, h, l, p = i && t._gsTransform || new Nt,
						f = p.scaleX < 0,
						u = zt && (parseFloat(et(t, Lt, e, !1, "0 0 0").split(" ")[2]) || p.zOrigin) || 0,
						c = parseFloat(j.defaultTransformPerspective) || 0;
					if (p.svg = !(!t.getCTM || !Gt(t)), p.svg && (Yt(t, et(t, Lt, e, !1, "50% 50%") + "", p, t.getAttribute("data-svg-origin")), Dt = j.useSVGTransformAttr || Xt), (r = Ut(t)) !== Wt) {
						if (16 === r.length) {
							var d, m, g, _, y, v = r[0],
								b = r[1],
								x = r[2],
								T = r[3],
								w = r[4],
								k = r[5],
								P = r[6],
								A = r[7],
								S = r[8],
								D = r[9],
								C = r[10],
								M = r[12],
								F = r[13],
								E = r[14],
								I = r[11],
								R = Math.atan2(P, C);
							p.zOrigin && (M = S * (E = -p.zOrigin) - r[12], F = D * E - r[13], E = C * E + p.zOrigin - r[14]), p.rotationX = R * q, R && (d = w * (_ = Math.cos(-R)) + S * (y = Math.sin(-R)), m = k * _ + D * y, g = P * _ + C * y, S = w * -y + S * _, D = k * -y + D * _, C = P * -y + C * _, I = A * -y + I * _, w = d, k = m, P = g), R = Math.atan2(-x, C), p.rotationY = R * q, R && (m = b * (_ = Math.cos(-R)) - D * (y = Math.sin(-R)), g = x * _ - C * y, D = b * y + D * _, C = x * y + C * _, I = T * y + I * _, v = d = v * _ - S * y, b = m, x = g), R = Math.atan2(b, v), p.rotation = R * q, R && (d = v * (_ = Math.cos(R)) + b * (y = Math.sin(R)), m = w * _ + k * y, g = S * _ + D * y, b = b * _ - v * y, k = k * _ - w * y, D = D * _ - S * y, v = d, w = m, S = g), p.rotationX && 359.9 < Math.abs(p.rotationX) + Math.abs(p.rotation) && (p.rotationX = p.rotation = 0, p.rotationY = 180 - p.rotationY), R = Math.atan2(w, k), p.scaleX = (1e5 * Math.sqrt(v * v + b * b + x * x) + .5 | 0) / 1e5, p.scaleY = (1e5 * Math.sqrt(k * k + P * P) + .5 | 0) / 1e5, p.scaleZ = (1e5 * Math.sqrt(S * S + D * D + C * C) + .5 | 0) / 1e5, v /= p.scaleX, w /= p.scaleY, b /= p.scaleX, k /= p.scaleY, 2e-5 < Math.abs(R) ? (p.skewX = R * q, w = 0, "simple" !== p.skewType && (p.scaleY *= 1 / Math.cos(R))) : p.skewX = 0, p.perspective = I ? 1 / (I < 0 ? -I : I) : 0, p.x = M, p.y = F, p.z = E, p.svg && (p.x -= p.xOrigin - (p.xOrigin * v - p.yOrigin * w), p.y -= p.yOrigin - (p.yOrigin * b - p.xOrigin * k))
						} else if (!zt || s || !r.length || p.x !== r[4] || p.y !== r[5] || !p.rotationX && !p.rotationY) {
							var O = 6 <= r.length,
								L = O ? r[0] : 1,
								z = r[1] || 0,
								N = r[2] || 0,
								V = O ? r[3] : 1;
							p.x = r[4] || 0, p.y = r[5] || 0, a = Math.sqrt(L * L + z * z), o = Math.sqrt(V * V + N * N), h = L || z ? Math.atan2(z, L) * q : p.rotation || 0, l = N || V ? Math.atan2(N, V) * q + h : p.skewX || 0, p.scaleX = a, p.scaleY = o, p.rotation = h, p.skewX = l, zt && (p.rotationX = p.rotationY = p.z = 0, p.perspective = c, p.scaleZ = 1), p.svg && (p.x -= p.xOrigin - (p.xOrigin * L + p.yOrigin * N), p.y -= p.yOrigin - (p.xOrigin * z + p.yOrigin * V))
						}
						for (n in 90 < Math.abs(p.skewX) && Math.abs(p.skewX) < 270 && (f ? (p.scaleX *= -1, p.skewX += p.rotation <= 0 ? 180 : -180, p.rotation += p.rotation <= 0 ? 180 : -180) : (p.scaleY *= -1, p.skewX += p.skewX <= 0 ? 180 : -180)), p.zOrigin = u, p) p[n] < 2e-5 && -2e-5 < p[n] && (p[n] = 0)
					}
					return i && ((t._gsTransform = p).svg && (Dt && t.style[Rt] ? B.delayedCall(.001, function () {
						Kt(t.style, Rt)
					}) : !Dt && t.getAttribute("transform") && B.delayedCall(.001, function () {
						t.removeAttribute("transform")
					}))), p
				},
				Zt = function (t) {
					var e, i, s = this.data,
						r = -s.rotation * Y,
						n = r + s.skewX * Y,
						a = 1e5,
						o = (Math.cos(r) * s.scaleX * a | 0) / a,
						h = (Math.sin(r) * s.scaleX * a | 0) / a,
						l = (Math.sin(n) * -s.scaleY * a | 0) / a,
						p = (Math.cos(n) * s.scaleY * a | 0) / a,
						f = this.t.style,
						u = this.t.currentStyle;
					if (u) {
						i = h, h = -l, l = -i, e = u.filter, f.filter = "";
						var c, d, m = this.t.offsetWidth,
							g = this.t.offsetHeight,
							_ = "absolute" !== u.position,
							y = "progid:DXImageTransform.Microsoft.Matrix(M11=" + o + ", M12=" + h + ", M21=" + l + ", M22=" + p,
							v = s.x + m * s.xPercent / 100,
							b = s.y + g * s.yPercent / 100;
						if (null != s.ox && (v += (c = (s.oxp ? m * s.ox * .01 : s.ox) - m / 2) - (c * o + (d = (s.oyp ? g * s.oy * .01 : s.oy) - g / 2) * h), b += d - (c * l + d * p)), _ ? y += ", Dx=" + ((c = m / 2) - (c * o + (d = g / 2) * h) + v) + ", Dy=" + (d - (c * l + d * p) + b) + ")" : y += ", sizingMethod='auto expand')", -1 !== e.indexOf("DXImageTransform.Microsoft.Matrix(") ? f.filter = e.replace(R, y) : f.filter = y + " " + e, (0 === t || 1 === t) && 1 === o && 0 === h && 0 === l && 1 === p && (_ && -1 === y.indexOf("Dx=0, Dy=0") || I.test(e) && 100 !== parseFloat(RegExp.$1) || -1 === e.indexOf(e.indexOf("Alpha")) && f.removeAttribute("filter")), !_) {
							var x, T, w, k = P < 8 ? 1 : -1;
							for (c = s.ieOffsetX || 0, d = s.ieOffsetY || 0, s.ieOffsetX = Math.round((m - ((o < 0 ? -o : o) * m + (h < 0 ? -h : h) * g)) / 2 + v), s.ieOffsetY = Math.round((g - ((p < 0 ? -p : p) * g + (l < 0 ? -l : l) * m)) / 2 + b), kt = 0; kt < 4; kt++) w = (i = -1 !== (x = u[T = ot[kt]]).indexOf("px") ? parseFloat(x) : it(this.t, T, parseFloat(x), x.replace(E, "")) || 0) !== s[T] ? kt < 2 ? -s.ieOffsetX : -s.ieOffsetY : kt < 2 ? c - s.ieOffsetX : d - s.ieOffsetY, f[T] = (s[T] = Math.round(i - w * (0 === kt || 2 === kt ? 1 : k))) + "px"
						}
					}
				},
				$t = r.set3DTransformRatio = r.setTransformRatio = function (t) {
					var e, i, s, r, n, a, o, h, l, p, f, u, c, d, m, g, _, y, v, b, x, T, w, k = this.data,
						P = this.t.style,
						A = k.rotation,
						S = k.rotationX,
						D = k.rotationY,
						C = k.scaleX,
						M = k.scaleY,
						F = k.scaleZ,
						E = k.x,
						I = k.y,
						R = k.z,
						O = k.svg,
						L = k.perspective,
						z = k.force3D,
						N = k.skewY,
						V = k.skewX;
					if (N && (V += N, A += N), !((1 !== t && 0 !== t || "auto" !== z || this.tween._totalTime !== this.tween._totalDuration && this.tween._totalTime) && z || R || L || D || S || 1 !== F) || Dt && O || !zt) A || V || O ? (A *= Y, T = V * Y, w = 1e5, i = Math.cos(A) * C, n = Math.sin(A) * C, s = Math.sin(A - T) * -M, a = Math.cos(A - T) * M, T && "simple" === k.skewType && (e = Math.tan(T - N * Y), s *= e = Math.sqrt(1 + e * e), a *= e, N && (e = Math.tan(N * Y), i *= e = Math.sqrt(1 + e * e), n *= e)), O && (E += k.xOrigin - (k.xOrigin * i + k.yOrigin * s) + k.xOffset, I += k.yOrigin - (k.xOrigin * n + k.yOrigin * a) + k.yOffset, Dt && (k.xPercent || k.yPercent) && (m = this.t.getBBox(), E += .01 * k.xPercent * m.width, I += .01 * k.yPercent * m.height), E < (m = 1e-6) && -m < E && (E = 0), I < m && -m < I && (I = 0)), v = (i * w | 0) / w + "," + (n * w | 0) / w + "," + (s * w | 0) / w + "," + (a * w | 0) / w + "," + E + "," + I + ")", O && Dt ? this.t.setAttribute("transform", "matrix(" + v) : P[Rt] = (k.xPercent || k.yPercent ? "translate(" + k.xPercent + "%," + k.yPercent + "%) matrix(" : "matrix(") + v) : P[Rt] = (k.xPercent || k.yPercent ? "translate(" + k.xPercent + "%," + k.yPercent + "%) matrix(" : "matrix(") + C + ",0,0," + M + "," + E + "," + I + ")";
					else {
						if (X && (C < (m = 1e-4) && -m < C && (C = F = 2e-5), M < m && -m < M && (M = F = 2e-5), !L || k.z || k.rotationX || k.rotationY || (L = 0)), A || V) A *= Y, g = i = Math.cos(A), _ = n = Math.sin(A), V && (A -= V * Y, g = Math.cos(A), _ = Math.sin(A), "simple" === k.skewType && (e = Math.tan((V - N) * Y), g *= e = Math.sqrt(1 + e * e), _ *= e, k.skewY && (e = Math.tan(N * Y), i *= e = Math.sqrt(1 + e * e), n *= e))), s = -_, a = g;
						else {
							if (!(D || S || 1 !== F || L || O)) return void(P[Rt] = (k.xPercent || k.yPercent ? "translate(" + k.xPercent + "%," + k.yPercent + "%) translate3d(" : "translate3d(") + E + "px," + I + "px," + R + "px)" + (1 !== C || 1 !== M ? " scale(" + C + "," + M + ")" : ""));
							i = a = 1, s = n = 0
						}
						p = 1, r = o = h = l = f = u = 0, c = L ? -1 / L : 0, d = k.zOrigin, m = 1e-6, b = ",", x = "0", (A = D * Y) && (g = Math.cos(A), f = c * (h = -(_ = Math.sin(A))), r = i * _, o = n * _, c *= p = g, i *= g, n *= g), (A = S * Y) && (e = s * (g = Math.cos(A)) + r * (_ = Math.sin(A)), y = a * g + o * _, l = p * _, u = c * _, r = s * -_ + r * g, o = a * -_ + o * g, p *= g, c *= g, s = e, a = y), 1 !== F && (r *= F, o *= F, p *= F, c *= F), 1 !== M && (s *= M, a *= M, l *= M, u *= M), 1 !== C && (i *= C, n *= C, h *= C, f *= C), (d || O) && (d && (E += r * -d, I += o * -d, R += p * -d + d), O && (E += k.xOrigin - (k.xOrigin * i + k.yOrigin * s) + k.xOffset, I += k.yOrigin - (k.xOrigin * n + k.yOrigin * a) + k.yOffset), E < m && -m < E && (E = x), I < m && -m < I && (I = x), R < m && -m < R && (R = 0)), v = k.xPercent || k.yPercent ? "translate(" + k.xPercent + "%," + k.yPercent + "%) matrix3d(" : "matrix3d(", v += (i < m && -m < i ? x : i) + b + (n < m && -m < n ? x : n) + b + (h < m && -m < h ? x : h), v += b + (f < m && -m < f ? x : f) + b + (s < m && -m < s ? x : s) + b + (a < m && -m < a ? x : a), S || D || 1 !== F ? (v += b + (l < m && -m < l ? x : l) + b + (u < m && -m < u ? x : u) + b + (r < m && -m < r ? x : r), v += b + (o < m && -m < o ? x : o) + b + (p < m && -m < p ? x : p) + b + (c < m && -m < c ? x : c) + b) : v += ",0,0,0,0,1,0,", v += E + b + I + b + R + b + (L ? 1 + -R / L : 1) + ")", P[Rt] = v
					}
				};
			(t = Nt.prototype).x = t.y = t.z = t.skewX = t.skewY = t.rotation = t.rotationX = t.rotationY = t.zOrigin = t.xPercent = t.yPercent = t.xOffset = t.yOffset = 0, t.scaleX = t.scaleY = t.scaleZ = 1, At("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {
				parser: function (t, e, i, s, r, n, a) {
					if (s._lastParsedTransform === a) return r;
					var o, h = (s._lastParsedTransform = a).scale && "function" == typeof a.scale ? a.scale : 0;
					"function" == typeof a[i] && (o = a[i], a[i] = e), h && (a.scale = h(C, t));
					var l, p, f, u, c, d, m, g, _, y = t._gsTransform,
						v = t.style,
						b = It.length,
						x = a,
						T = {},
						w = "transformOrigin",
						k = Ht(t, A, !0, x.parseTransform),
						P = x.transform && ("function" == typeof x.transform ? x.transform(C, D) : x.transform);
					if (k.skewType = x.skewType || k.skewType || j.defaultSkewType, s._transform = k, "rotationZ" in x && (x.rotation = x.rotationZ), P && "string" == typeof P && Rt)(p = G.style)[Rt] = P, p.display = "block", p.position = "absolute", -1 !== P.indexOf("%") && (p.width = et(t, "width"), p.height = et(t, "height")), N.body.appendChild(G), l = Ht(G, null, !1), "simple" === k.skewType && (l.scaleY *= Math.cos(l.skewX * Y)), k.svg && (d = k.xOrigin, m = k.yOrigin, l.x -= k.xOffset, l.y -= k.yOffset, (x.transformOrigin || x.svgOrigin) && (P = {}, Yt(t, lt(x.transformOrigin), P, x.svgOrigin, x.smoothOrigin, !0), d = P.xOrigin, m = P.yOrigin, l.x -= P.xOffset - k.xOffset, l.y -= P.yOffset - k.yOffset), (d || m) && (g = Ut(G, !0), l.x -= d - (d * g[0] + m * g[2]), l.y -= m - (d * g[1] + m * g[3]))), N.body.removeChild(G), l.perspective || (l.perspective = k.perspective), null != x.xPercent && (l.xPercent = ft(x.xPercent, k.xPercent)), null != x.yPercent && (l.yPercent = ft(x.yPercent, k.yPercent));
					else if ("object" == typeof x) {
						if (l = {
								scaleX: ft(null != x.scaleX ? x.scaleX : x.scale, k.scaleX),
								scaleY: ft(null != x.scaleY ? x.scaleY : x.scale, k.scaleY),
								scaleZ: ft(x.scaleZ, k.scaleZ),
								x: ft(x.x, k.x),
								y: ft(x.y, k.y),
								z: ft(x.z, k.z),
								xPercent: ft(x.xPercent, k.xPercent),
								yPercent: ft(x.yPercent, k.yPercent),
								perspective: ft(x.transformPerspective, k.perspective)
							}, null != (c = x.directionalRotation))
							if ("object" == typeof c)
								for (p in c) x[p] = c[p];
							else x.rotation = c;
						"string" == typeof x.x && -1 !== x.x.indexOf("%") && (l.x = 0, l.xPercent = ft(x.x, k.xPercent)), "string" == typeof x.y && -1 !== x.y.indexOf("%") && (l.y = 0, l.yPercent = ft(x.y, k.yPercent)), l.rotation = ut("rotation" in x ? x.rotation : "shortRotation" in x ? x.shortRotation + "_short" : k.rotation, k.rotation, "rotation", T), zt && (l.rotationX = ut("rotationX" in x ? x.rotationX : "shortRotationX" in x ? x.shortRotationX + "_short" : k.rotationX || 0, k.rotationX, "rotationX", T), l.rotationY = ut("rotationY" in x ? x.rotationY : "shortRotationY" in x ? x.shortRotationY + "_short" : k.rotationY || 0, k.rotationY, "rotationY", T)), l.skewX = ut(x.skewX, k.skewX), l.skewY = ut(x.skewY, k.skewY)
					}
					for (zt && null != x.force3D && (k.force3D = x.force3D, u = !0), (f = k.force3D || k.z || k.rotationX || k.rotationY || l.z || l.rotationX || l.rotationY || l.perspective) || null == x.scale || (l.scaleZ = 1); - 1 < --b;)(1e-6 < (P = l[_ = It[b]] - k[_]) || P < -1e-6 || null != x[_] || null != z[_]) && (u = !0, r = new xt(k, _, k[_], P, r), _ in T && (r.e = T[_]), r.xs0 = 0, r.plugin = n, s._overwriteProps.push(r.n));
					return P = x.transformOrigin, k.svg && (P || x.svgOrigin) && (d = k.xOffset, m = k.yOffset, Yt(t, lt(P), l, x.svgOrigin, x.smoothOrigin), r = Tt(k, "xOrigin", (y ? k : l).xOrigin, l.xOrigin, r, w), r = Tt(k, "yOrigin", (y ? k : l).yOrigin, l.yOrigin, r, w), (d !== k.xOffset || m !== k.yOffset) && (r = Tt(k, "xOffset", y ? d : k.xOffset, k.xOffset, r, w), r = Tt(k, "yOffset", y ? m : k.yOffset, k.yOffset, r, w)), P = "0px 0px"), (P || zt && f && k.zOrigin) && (Rt ? (u = !0, _ = Lt, P = (P || et(t, _, A, !1, "50% 50%")) + "", (r = new xt(v, _, 0, 0, r, -1, w)).b = v[_], r.plugin = n, zt ? (p = k.zOrigin, P = P.split(" "), k.zOrigin = (2 < P.length && (0 === p || "0px" !== P[2]) ? parseFloat(P[2]) : p) || 0, r.xs0 = r.e = P[0] + " " + (P[1] || "50%") + " 0px", (r = new xt(k, "zOrigin", 0, 0, r, -1, r.n)).b = p, r.xs0 = r.e = k.zOrigin) : r.xs0 = r.e = P) : lt(P + "", k)), u && (s._transformType = k.svg && Dt || !f && 3 !== this._transformType ? 2 : 3), o && (a[i] = o), h && (a.scale = h), r
				},
				prefix: !0
			}), At("boxShadow", {
				defaultValue: "0px 0px 0px 0px #999",
				prefix: !0,
				color: !0,
				multi: !0,
				keyword: "inset"
			}), At("borderRadius", {
				defaultValue: "0px",
				parser: function (t, e, i, s, r, n) {
					e = this.format(e);
					var a, o, h, l, p, f, u, c, d, m, g, _, y, v, b, x, T = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
						w = t.style;
					for (d = parseFloat(t.offsetWidth), m = parseFloat(t.offsetHeight), a = e.split(" "), o = 0; o < T.length; o++) this.p.indexOf("border") && (T[o] = J(T[o])), -1 !== (p = l = et(t, T[o], A, !1, "0px")).indexOf(" ") && (p = (l = p.split(" "))[0], l = l[1]), f = h = a[o], u = parseFloat(p), _ = p.substr((u + "").length), (y = "=" === f.charAt(1)) ? (c = parseInt(f.charAt(0) + "1", 10), f = f.substr(2), c *= parseFloat(f), g = f.substr((c + "").length - (c < 0 ? 1 : 0)) || "") : (c = parseFloat(f), g = f.substr((c + "").length)), "" === g && (g = k[i] || _), g !== _ && (v = it(t, "borderLeft", u, _), b = it(t, "borderTop", u, _), "%" === g ? (p = v / d * 100 + "%", l = b / m * 100 + "%") : "em" === g ? (p = v / (x = it(t, "borderLeft", 1, "em")) + "em", l = b / x + "em") : (p = v + "px", l = b + "px"), y && (f = parseFloat(p) + c + g, h = parseFloat(l) + c + g)), r = wt(w, T[o], p + " " + l, f + " " + h, !1, "0px", r);
					return r
				},
				prefix: !0,
				formatter: yt("0px 0px 0px 0px", !1, !0)
			}), At("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {
				defaultValue: "0px",
				parser: function (t, e, i, s, r, n) {
					return wt(t.style, i, this.format(et(t, i, A, !1, "0px 0px")), this.format(e), !1, "0px", r)
				},
				prefix: !0,
				formatter: yt("0px 0px", !1, !0)
			}), At("backgroundPosition", {
				defaultValue: "0 0",
				parser: function (t, e, i, s, r, n) {
					var a, o, h, l, p, f, u = "background-position",
						c = A || tt(t, null),
						d = this.format((c ? P ? c.getPropertyValue(u + "-x") + " " + c.getPropertyValue(u + "-y") : c.getPropertyValue(u) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"),
						m = this.format(e);
					if (-1 !== d.indexOf("%") != (-1 !== m.indexOf("%")) && m.split(",").length < 2 && ((f = et(t, "backgroundImage").replace(w, "")) && "none" !== f)) {
						for (a = d.split(" "), o = m.split(" "), W.setAttribute("src", f), h = 2; - 1 < --h;)(l = -1 !== (d = a[h]).indexOf("%")) !== (-1 !== o[h].indexOf("%")) && (p = 0 === h ? t.offsetWidth - W.width : t.offsetHeight - W.height, a[h] = l ? parseFloat(d) / 100 * p + "px" : parseFloat(d) / p * 100 + "%");
						d = a.join(" ")
					}
					return this.parseComplex(t.style, d, m, r, n)
				},
				formatter: lt
			}), At("backgroundSize", {
				defaultValue: "0 0",
				formatter: function (t) {
					return "co" === (t += "").substr(0, 2) ? t : lt(-1 === t.indexOf(" ") ? t + " " + t : t)
				}
			}), At("perspective", {
				defaultValue: "0px",
				prefix: !0
			}), At("perspectiveOrigin", {
				defaultValue: "50% 50%",
				prefix: !0
			}), At("transformStyle", {
				prefix: !0
			}), At("backfaceVisibility", {
				prefix: !0
			}), At("userSelect", {
				prefix: !0
			}), At("margin", {
				parser: vt("marginTop,marginRight,marginBottom,marginLeft")
			}), At("padding", {
				parser: vt("paddingTop,paddingRight,paddingBottom,paddingLeft")
			}), At("clip", {
				defaultValue: "rect(0px,0px,0px,0px)",
				parser: function (t, e, i, s, r, n) {
					var a, o, h;
					return P < 9 ? (o = t.currentStyle, h = P < 8 ? " " : ",", a = "rect(" + o.clipTop + h + o.clipRight + h + o.clipBottom + h + o.clipLeft + ")", e = this.format(e).split(",").join(h)) : (a = this.format(et(t, this.p, A, !1, this.dflt)), e = this.format(e)), this.parseComplex(t.style, a, e, r, n)
				}
			}), At("textShadow", {
				defaultValue: "0px 0px 0px #999",
				color: !0,
				multi: !0
			}), At("autoRound,strictUnits", {
				parser: function (t, e, i, s, r) {
					return r
				}
			}), At("border", {
				defaultValue: "0px solid #000",
				parser: function (t, e, i, s, r, n) {
					var a = et(t, "borderTopWidth", A, !1, "0px"),
						o = this.format(e).split(" "),
						h = o[0].replace(E, "");
					return "px" !== h && (a = parseFloat(a) / it(t, "borderTopWidth", 1, h) + h), this.parseComplex(t.style, this.format(a + " " + et(t, "borderTopStyle", A, !1, "solid") + " " + et(t, "borderTopColor", A, !1, "#000")), o.join(" "), r, n)
				},
				color: !0,
				formatter: function (t) {
					var e = t.split(" ");
					return e[0] + " " + (e[1] || "solid") + " " + (t.match(_t) || ["#000"])[0]
				}
			}), At("borderWidth", {
				parser: vt("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
			}), At("float,cssFloat,styleFloat", {
				parser: function (t, e, i, s, r, n) {
					var a = t.style,
						o = "cssFloat" in a ? "cssFloat" : "styleFloat";
					return new xt(a, o, 0, 0, r, -1, i, !1, 0, a[o], e)
				}
			});
			var Qt = function (t) {
				var e, i = this.t,
					s = i.filter || et(this.data, "filter") || "",
					r = this.s + this.c * t | 0;
				100 === r && (-1 === s.indexOf("atrix(") && -1 === s.indexOf("radient(") && -1 === s.indexOf("oader(") ? (i.removeAttribute("filter"), e = !et(this.data, "filter")) : (i.filter = s.replace(a, ""), e = !0)), e || (this.xn1 && (i.filter = s = s || "alpha(opacity=" + r + ")"), -1 === s.indexOf("pacity") ? 0 === r && this.xn1 || (i.filter = s + " alpha(opacity=" + r + ")") : i.filter = s.replace(I, "opacity=" + r))
			};
			At("opacity,alpha,autoAlpha", {
				defaultValue: "1",
				parser: function (t, e, i, s, r, n) {
					var a = parseFloat(et(t, "opacity", A, !1, "1")),
						o = t.style,
						h = "autoAlpha" === i;
					return "string" == typeof e && "=" === e.charAt(1) && (e = ("-" === e.charAt(0) ? -1 : 1) * parseFloat(e.substr(2)) + a), h && 1 === a && "hidden" === et(t, "visibility", A) && 0 !== e && (a = 0), H ? r = new xt(o, "opacity", a, e - a, r) : ((r = new xt(o, "opacity", 100 * a, 100 * (e - a), r)).xn1 = h ? 1 : 0, o.zoom = 1, r.type = 2, r.b = "alpha(opacity=" + r.s + ")", r.e = "alpha(opacity=" + (r.s + r.c) + ")", r.data = t, r.plugin = n, r.setRatio = Qt), h && ((r = new xt(o, "visibility", 0, 0, r, -1, null, !1, 0, 0 !== a ? "inherit" : "hidden", 0 === e ? "hidden" : "inherit")).xs0 = "inherit", s._overwriteProps.push(r.n), s._overwriteProps.push(i)), r
				}
			});
			var Kt = function (t, e) {
					e && (t.removeProperty ? (("ms" === e.substr(0, 2) || "webkit" === e.substr(0, 6)) && (e = "-" + e), t.removeProperty(e.replace(o, "-$1").toLowerCase())) : t.removeAttribute(e))
				},
				Jt = function (t) {
					if (this.t._gsClassPT = this, 1 === t || 0 === t) {
						this.t.setAttribute("class", 0 === t ? this.b : this.e);
						for (var e = this.data, i = this.t.style; e;) e.v ? i[e.p] = e.v : Kt(i, e.p), e = e._next;
						1 === t && this.t._gsClassPT === this && (this.t._gsClassPT = null)
					} else this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
				};
			At("className", {
				parser: function (t, e, i, s, r, n, a) {
					var o, h, l, p, f, u = t.getAttribute("class") || "",
						c = t.style.cssText;
					if ((r = s._classNamePT = new xt(t, i, 0, 0, r, 2)).setRatio = Jt, r.pr = -11, d = !0, r.b = u, h = rt(t, A), l = t._gsClassPT) {
						for (p = {}, f = l.data; f;) p[f.p] = 1, f = f._next;
						l.setRatio(1)
					}
					return (t._gsClassPT = r).e = "=" !== e.charAt(1) ? e : u.replace(new RegExp("(?:\\s|^)" + e.substr(2) + "(?![\\w-])"), "") + ("+" === e.charAt(0) ? " " + e.substr(2) : ""), t.setAttribute("class", r.e), o = nt(t, h, rt(t), a, p), t.setAttribute("class", u), r.data = o.firstMPT, t.style.cssText = c, r.xfirst = s.parse(t, o.difs, r, n)
				}
			});
			var te = function (t) {
				if ((1 === t || 0 === t) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
					var e, i, s, r, n, a = this.t.style,
						o = g.transform.parse;
					if ("all" === this.e) r = !(a.cssText = "");
					else
						for (s = (e = this.e.split(" ").join("").split(",")).length; - 1 < --s;) i = e[s], g[i] && (g[i].parse === o ? r = !0 : i = "transformOrigin" === i ? Lt : g[i].p), Kt(a, i);
					r && (Kt(a, Rt), (n = this.t._gsTransform) && (n.svg && (this.t.removeAttribute("data-svg-origin"), this.t.removeAttribute("transform")), delete this.t._gsTransform))
				}
			};
			for (At("clearProps", {
					parser: function (t, e, i, s, r) {
						return (r = new xt(t, i, 0, 0, r, 2)).setRatio = te, r.e = e, r.pr = -10, r.data = s._tween, d = !0, r
					}
				}), t = "bezier,throwProps,physicsProps,physics2D".split(","), kt = t.length; kt--;) St(t[kt]);
			(t = j.prototype)._firstPT = t._lastParsedTransform = t._transform = null, t._onInitTween = function (t, e, i, s) {
				if (!t.nodeType) return !1;
				this._target = D = t, this._tween = i, this._vars = e, C = s, S = e.autoRound, d = !1, k = e.suffixMap || j.suffixMap, A = tt(t, ""), m = this._overwriteProps;
				var r, n, a, o, h, l, p, f, u, c = t.style;
				if (_ && "" === c.zIndex && (("auto" === (r = et(t, "zIndex", A)) || "" === r) && this._addLazySet(c, "zIndex", 0)), "string" == typeof e && (o = c.cssText, r = rt(t, A), c.cssText = o + ";" + e, r = nt(t, r, rt(t)).difs, !H && x.test(e) && (r.opacity = parseFloat(RegExp.$1)), e = r, c.cssText = o), e.className ? this._firstPT = n = g.className.parse(t, e.className, "className", this, null, null, e) : this._firstPT = n = this.parse(t, e, null), this._transformType) {
					for (u = 3 === this._transformType, Rt ? y && (_ = !0, "" === c.zIndex && (("auto" === (p = et(t, "zIndex", A)) || "" === p) && this._addLazySet(c, "zIndex", 0)), v && this._addLazySet(c, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (u ? "visible" : "hidden"))) : c.zoom = 1, a = n; a && a._next;) a = a._next;
					f = new xt(t, "transform", 0, 0, null, 2), this._linkCSSP(f, null, a), f.setRatio = Rt ? $t : Zt, f.data = this._transform || Ht(t, A, !0), f.tween = i, f.pr = -1, m.pop()
				}
				if (d) {
					for (; n;) {
						for (l = n._next, a = o; a && a.pr > n.pr;) a = a._next;
						(n._prev = a ? a._prev : h) ? n._prev._next = n: o = n, (n._next = a) ? a._prev = n : h = n, n = l
					}
					this._firstPT = o
				}
				return !0
			}, t.parse = function (t, e, i, s) {
				var r, n, a, o, h, l, p, f, u, c, d = t.style;
				for (r in e) {
					if ("function" == typeof (l = e[r]) && (l = l(C, D)), n = g[r]) i = n.parse(t, l, r, this, i, s, e);
					else {
						if ("--" === r.substr(0, 2)) {
							this._tween._propLookup[r] = this._addTween.call(this._tween, t.style, "setProperty", tt(t).getPropertyValue(r) + "", l + "", r, !1, r);
							continue
						}
						h = et(t, r, A) + "", u = "string" == typeof l, "color" === r || "fill" === r || "stroke" === r || -1 !== r.indexOf("Color") || u && T.test(l) ? (u || (l = (3 < (l = mt(l)).length ? "rgba(" : "rgb(") + l.join(",") + ")"), i = wt(d, r, h, l, !0, "transparent", i, 0, s)) : u && L.test(l) ? i = wt(d, r, h, l, !0, null, i, 0, s) : (p = (a = parseFloat(h)) || 0 === a ? h.substr((a + "").length) : "", ("" === h || "auto" === h) && ("width" === r || "height" === r ? (a = ht(t, r, A), p = "px") : "left" === r || "top" === r ? (a = st(t, r, A), p = "px") : (a = "opacity" !== r ? 0 : 1, p = "")), (c = u && "=" === l.charAt(1)) ? (o = parseInt(l.charAt(0) + "1", 10), l = l.substr(2), o *= parseFloat(l), f = l.replace(E, "")) : (o = parseFloat(l), f = u ? l.replace(E, "") : ""), "" === f && (f = r in k ? k[r] : p), l = o || 0 === o ? (c ? o + a : o) + f : e[r], p !== f && ("" !== f || "lineHeight" === r) && (o || 0 === o) && a && (a = it(t, r, a, p), "%" === f ? (a /= it(t, r, 100, "%") / 100, !0 !== e.strictUnits && (h = a + "%")) : "em" === f || "rem" === f || "vw" === f || "vh" === f ? a /= it(t, r, 1, f) : "px" !== f && (o = it(t, r, o, f), f = "px"), c && (o || 0 === o) && (l = o + a + f)), c && (o += a), !a && 0 !== a || !o && 0 !== o ? void 0 !== d[r] && (l || l + "" != "NaN" && null != l) ? (i = new xt(d, r, o || a || 0, 0, i, -1, r, !1, 0, h, l)).xs0 = "none" !== l || "display" !== r && -1 === r.indexOf("Style") ? l : h : $("invalid " + r + " tween value: " + e[r]) : (i = new xt(d, r, a, o - a, i, 0, r, !1 !== S && ("px" === f || "zIndex" === r), 0, h, l)).xs0 = f)
					}
					s && i && !i.plugin && (i.plugin = s)
				}
				return i
			}, t.setRatio = function (t) {
				var e, i, s, r = this._firstPT;
				if (1 !== t || this._tween._time !== this._tween._duration && 0 !== this._tween._time)
					if (t || this._tween._time !== this._tween._duration && 0 !== this._tween._time || -1e-6 === this._tween._rawPrevTime)
						for (; r;) {
							if (e = r.c * t + r.s, r.r ? e = r.r(e) : e < 1e-6 && -1e-6 < e && (e = 0), r.type)
								if (1 === r.type)
									if (2 === (s = r.l)) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2;
									else if (3 === s) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3;
							else if (4 === s) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3 + r.xn3 + r.xs4;
							else if (5 === s) r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3 + r.xn3 + r.xs4 + r.xn4 + r.xs5;
							else {
								for (i = r.xs0 + e + r.xs1, s = 1; s < r.l; s++) i += r["xn" + s] + r["xs" + (s + 1)];
								r.t[r.p] = i
							} else -1 === r.type ? r.t[r.p] = r.xs0 : r.setRatio && r.setRatio(t);
							else r.t[r.p] = e + r.xs0;
							r = r._next
						} else
							for (; r;) 2 !== r.type ? r.t[r.p] = r.b : r.setRatio(t), r = r._next;
					else
						for (; r;) {
							if (2 !== r.type)
								if (r.r && -1 !== r.type)
									if (e = r.r(r.s + r.c), r.type) {
										if (1 === r.type) {
											for (s = r.l, i = r.xs0 + e + r.xs1, s = 1; s < r.l; s++) i += r["xn" + s] + r["xs" + (s + 1)];
											r.t[r.p] = i
										}
									} else r.t[r.p] = e + r.xs0;
							else r.t[r.p] = r.e;
							else r.setRatio(t);
							r = r._next
						}
			}, t._enableTransforms = function (t) {
				this._transform = this._transform || Ht(this._target, A, !0), this._transformType = this._transform.svg && Dt || !t && 3 !== this._transformType ? 2 : 3
			};
			var ee = function (t) {
				this.t[this.p] = this.e, this.data._linkCSSP(this, this._next, null, !0)
			};
			t._addLazySet = function (t, e, i) {
				var s = this._firstPT = new xt(t, e, 0, 0, this._firstPT, 2);
				s.e = i, s.setRatio = ee, s.data = this
			}, t._linkCSSP = function (t, e, i, s) {
				return t && (e && (e._prev = t), t._next && (t._next._prev = t._prev), t._prev ? t._prev._next = t._next : this._firstPT === t && (this._firstPT = t._next, s = !0), i ? i._next = t : s || null !== this._firstPT || (this._firstPT = t), t._next = e, t._prev = i), t
			}, t._mod = function (t) {
				for (var e = this._firstPT; e;) "function" == typeof t[e.p] && (e.r = t[e.p]), e = e._next
			}, t._kill = function (t) {
				var e, i, s, r = t;
				if (t.autoAlpha || t.alpha) {
					for (i in r = {}, t) r[i] = t[i];
					r.opacity = 1, r.autoAlpha && (r.visibility = 1)
				}
				for (t.className && (e = this._classNamePT) && ((s = e.xfirst) && s._prev ? this._linkCSSP(s._prev, e._next, s._prev._prev) : s === this._firstPT && (this._firstPT = e._next), e._next && this._linkCSSP(e._next, e._next._next, s._prev), this._classNamePT = null), e = this._firstPT; e;) e.plugin && e.plugin !== i && e.plugin._kill && (e.plugin._kill(t), i = e.plugin), e = e._next;
				return n.prototype._kill.call(this, r)
			};
			var ie = function (t, e, i) {
				var s, r, n, a;
				if (t.slice)
					for (r = t.length; - 1 < --r;) ie(t[r], e, i);
				else
					for (r = (s = t.childNodes).length; - 1 < --r;) a = (n = s[r]).type, n.style && (e.push(rt(n)), i && i.push(n)), 1 !== a && 9 !== a && 11 !== a || !n.childNodes.length || ie(n, e, i)
			};
			return j.cascadeTo = function (t, e, i) {
				var s, r, n, a, o = B.to(t, e, i),
					h = [o],
					l = [],
					p = [],
					f = [],
					u = B._internals.reservedProps;
				for (t = o._targets || o.target, ie(t, l, f), o.render(e, !0, !0), ie(t, p), o.render(0, !0, !0), o._enabled(!0), s = f.length; - 1 < --s;)
					if ((r = nt(f[s], l[s], p[s])).firstMPT) {
						for (n in r = r.difs, i) u[n] && (r[n] = i[n]);
						for (n in a = {}, r) a[n] = l[s][n];
						h.push(B.fromTo(f[s], e, a, r))
					}
				return h
			}, n.activate([j]), j
		}, !0), t = _gsScope._gsDefine.plugin({
			propName: "roundProps",
			version: "1.7.0",
			priority: -1,
			API: 2,
			init: function (t, e, i) {
				return this._tween = i, !0
			}
		}), h = function (e) {
			var i = e < 1 ? Math.pow(10, (e + "").length - 2) : 1;
			return function (t) {
				return (Math.round(t / e) * e * i | 0) / i
			}
		}, l = function (t, e) {
			for (; t;) t.f || t.blob || (t.m = e || Math.round), t = t._next
		}, (e = t.prototype)._onInitAllProps = function () {
			var t, e, i, s, r = this._tween,
				n = r.vars.roundProps,
				a = {},
				o = r._propLookup.roundProps;
			if ("object" != typeof n || n.push)
				for ("string" == typeof n && (n = n.split(",")), i = n.length; - 1 < --i;) a[n[i]] = Math.round;
			else
				for (s in n) a[s] = h(n[s]);
			for (s in a)
				for (t = r._firstPT; t;) e = t._next, t.pg ? t.t._mod(a) : t.n === s && (2 === t.f && t.t ? l(t.t._firstPT, a[s]) : (this._add(t.t, s, t.s, t.c, a[s]), e && (e._prev = t._prev), t._prev ? t._prev._next = e : r._firstPT === t && (r._firstPT = e), t._next = t._prev = null, r._propLookup[s] = o)), t = e;
			return !1
		}, e._add = function (t, e, i, s, r) {
			this._addTween(t, e, i, i + s, e, r || Math.round), this._overwriteProps.push(e)
		}, _gsScope._gsDefine.plugin({
			propName: "attr",
			API: 2,
			version: "0.6.1",
			init: function (t, e, i, s) {
				var r, n;
				if ("function" != typeof t.setAttribute) return !1;
				for (r in e) "function" == typeof (n = e[r]) && (n = n(s, t)), this._addTween(t, "setAttribute", t.getAttribute(r) + "", n + "", r, !1, r), this._overwriteProps.push(r);
				return !0
			}
		}), _gsScope._gsDefine.plugin({
			propName: "directionalRotation",
			version: "0.3.1",
			API: 2,
			init: function (t, e, i, s) {
				"object" != typeof e && (e = {
					rotation: e
				}), this.finals = {};
				var r, n, a, o, h, l, p = !0 === e.useRadians ? 2 * Math.PI : 360;
				for (r in e) "useRadians" !== r && ("function" == typeof (o = e[r]) && (o = o(s, t)), n = (l = (o + "").split("_"))[0], a = parseFloat("function" != typeof t[r] ? t[r] : t[r.indexOf("set") || "function" != typeof t["get" + r.substr(3)] ? r : "get" + r.substr(3)]()), h = (o = this.finals[r] = "string" == typeof n && "=" === n.charAt(1) ? a + parseInt(n.charAt(0) + "1", 10) * Number(n.substr(2)) : Number(n) || 0) - a, l.length && (-1 !== (n = l.join("_")).indexOf("short") && ((h %= p) !== h % (p / 2) && (h = h < 0 ? h + p : h - p)), -1 !== n.indexOf("_cw") && h < 0 ? h = (h + 9999999999 * p) % p - (h / p | 0) * p : -1 !== n.indexOf("ccw") && 0 < h && (h = (h - 9999999999 * p) % p - (h / p | 0) * p)), (1e-6 < h || h < -1e-6) && (this._addTween(t, r, a, a + h, r), this._overwriteProps.push(r)));
				return !0
			},
			set: function (t) {
				var e;
				if (1 !== t) this._super.setRatio.call(this, t);
				else
					for (e = this._firstPT; e;) e.f ? e.t[e.p](this.finals[e.p]) : e.t[e.p] = this.finals[e.p], e = e._next
			}
		})._autoCSS = !0, _gsScope._gsDefine("easing.Back", ["easing.Ease"], function (g) {
			var i, s, e, t, r = _gsScope.GreenSockGlobals || _gsScope,
				n = r.com.greensock,
				a = 2 * Math.PI,
				o = Math.PI / 2,
				h = n._class,
				l = function (t, e) {
					var i = h("easing." + t, function () {}, !0),
						s = i.prototype = new g;
					return s.constructor = i, s.getRatio = e, i
				},
				p = g.register || function () {},
				f = function (t, e, i, s, r) {
					var n = h("easing." + t, {
						easeOut: new e,
						easeIn: new i,
						easeInOut: new s
					}, !0);
					return p(n, t), n
				},
				_ = function (t, e, i) {
					this.t = t, this.v = e, i && (((this.next = i).prev = this).c = i.v - e, this.gap = i.t - t)
				},
				u = function (t, e) {
					var i = h("easing." + t, function (t) {
							this._p1 = t || 0 === t ? t : 1.70158, this._p2 = 1.525 * this._p1
						}, !0),
						s = i.prototype = new g;
					return s.constructor = i, s.getRatio = e, s.config = function (t) {
						return new i(t)
					}, i
				},
				c = f("Back", u("BackOut", function (t) {
					return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1
				}), u("BackIn", function (t) {
					return t * t * ((this._p1 + 1) * t - this._p1)
				}), u("BackInOut", function (t) {
					return (t *= 2) < 1 ? .5 * t * t * ((this._p2 + 1) * t - this._p2) : .5 * ((t -= 2) * t * ((this._p2 + 1) * t + this._p2) + 2)
				})),
				d = h("easing.SlowMo", function (t, e, i) {
					e = e || 0 === e ? e : .7, null == t ? t = .7 : 1 < t && (t = 1), this._p = 1 !== t ? e : 0, this._p1 = (1 - t) / 2, this._p2 = t, this._p3 = this._p1 + this._p2, this._calcEnd = !0 === i
				}, !0),
				m = d.prototype = new g;
			return m.constructor = d, m.getRatio = function (t) {
				var e = t + (.5 - t) * this._p;
				return t < this._p1 ? this._calcEnd ? 1 - (t = 1 - t / this._p1) * t : e - (t = 1 - t / this._p1) * t * t * t * e : t > this._p3 ? this._calcEnd ? 1 === t ? 0 : 1 - (t = (t - this._p3) / this._p1) * t : e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t : this._calcEnd ? 1 : e
			}, d.ease = new d(.7, .7), m.config = d.config = function (t, e, i) {
				return new d(t, e, i)
			}, (m = (i = h("easing.SteppedEase", function (t, e) {
				t = t || 1, this._p1 = 1 / t, this._p2 = t + (e ? 0 : 1), this._p3 = e ? 1 : 0
			}, !0)).prototype = new g).constructor = i, m.getRatio = function (t) {
				return t < 0 ? t = 0 : 1 <= t && (t = .999999999), ((this._p2 * t | 0) + this._p3) * this._p1
			}, m.config = i.config = function (t, e) {
				return new i(t, e)
			}, (m = (s = h("easing.ExpoScaleEase", function (t, e, i) {
				this._p1 = Math.log(e / t), this._p2 = e - t, this._p3 = t, this._ease = i
			}, !0)).prototype = new g).constructor = s, m.getRatio = function (t) {
				return this._ease && (t = this._ease.getRatio(t)), (this._p3 * Math.exp(this._p1 * t) - this._p3) / this._p2
			}, m.config = s.config = function (t, e, i) {
				return new s(t, e, i)
			}, (m = (e = h("easing.RoughEase", function (t) {
				for (var e, i, s, r, n, a, o = (t = t || {}).taper || "none", h = [], l = 0, p = 0 | (t.points || 20), f = p, u = !1 !== t.randomize, c = !0 === t.clamp, d = t.template instanceof g ? t.template : null, m = "number" == typeof t.strength ? .4 * t.strength : .4; - 1 < --f;) e = u ? Math.random() : 1 / p * f, i = d ? d.getRatio(e) : e, "none" === o ? s = m : "out" === o ? s = (r = 1 - e) * r * m : "in" === o ? s = e * e * m : s = (r = e < .5 ? 2 * e : 2 * (1 - e)) * r * .5 * m, u ? i += Math.random() * s - .5 * s : f % 2 ? i += .5 * s : i -= .5 * s, c && (1 < i ? i = 1 : i < 0 && (i = 0)), h[l++] = {
					x: e,
					y: i
				};
				for (h.sort(function (t, e) {
						return t.x - e.x
					}), a = new _(1, 1, null), f = p; - 1 < --f;) n = h[f], a = new _(n.x, n.y, a);
				this._prev = new _(0, 0, 0 !== a.t ? a : a.next)
			}, !0)).prototype = new g).constructor = e, m.getRatio = function (t) {
				var e = this._prev;
				if (t > e.t) {
					for (; e.next && t >= e.t;) e = e.next;
					e = e.prev
				} else
					for (; e.prev && t <= e.t;) e = e.prev;
				return (this._prev = e).v + (t - e.t) / e.gap * e.c
			}, m.config = function (t) {
				return new e(t)
			}, e.ease = new e, f("Bounce", l("BounceOut", function (t) {
				return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
			}), l("BounceIn", function (t) {
				return (t = 1 - t) < 1 / 2.75 ? 1 - 7.5625 * t * t : t < 2 / 2.75 ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : t < 2.5 / 2.75 ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 1 - (7.5625 * (t -= 2.625 / 2.75) * t + .984375)
			}), l("BounceInOut", function (t) {
				var e = t < .5;
				return t = (t = e ? 1 - 2 * t : 2 * t - 1) < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375, e ? .5 * (1 - t) : .5 * t + .5
			})), f("Circ", l("CircOut", function (t) {
				return Math.sqrt(1 - (t -= 1) * t)
			}), l("CircIn", function (t) {
				return -(Math.sqrt(1 - t * t) - 1)
			}), l("CircInOut", function (t) {
				return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
			})), f("Elastic", (t = function (t, e, i) {
				var s = h("easing." + t, function (t, e) {
						this._p1 = 1 <= t ? t : 1, this._p2 = (e || i) / (t < 1 ? t : 1), this._p3 = this._p2 / a * (Math.asin(1 / this._p1) || 0), this._p2 = a / this._p2
					}, !0),
					r = s.prototype = new g;
				return r.constructor = s, r.getRatio = e, r.config = function (t, e) {
					return new s(t, e)
				}, s
			})("ElasticOut", function (t) {
				return this._p1 * Math.pow(2, -10 * t) * Math.sin((t - this._p3) * this._p2) + 1
			}, .3), t("ElasticIn", function (t) {
				return -this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2)
			}, .3), t("ElasticInOut", function (t) {
				return (t *= 2) < 1 ? this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2) * -.5 : this._p1 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2) * .5 + 1
			}, .45)), f("Expo", l("ExpoOut", function (t) {
				return 1 - Math.pow(2, -10 * t)
			}), l("ExpoIn", function (t) {
				return Math.pow(2, 10 * (t - 1)) - .001
			}), l("ExpoInOut", function (t) {
				return (t *= 2) < 1 ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
			})), f("Sine", l("SineOut", function (t) {
				return Math.sin(t * o)
			}), l("SineIn", function (t) {
				return 1 - Math.cos(t * o)
			}), l("SineInOut", function (t) {
				return -.5 * (Math.cos(Math.PI * t) - 1)
			})), h("easing.EaseLookup", {
				find: function (t) {
					return g.map[t]
				}
			}, !0), p(r.SlowMo, "SlowMo", "ease,"), p(e, "RoughEase", "ease,"), p(i, "SteppedEase", "ease,"), c
		}, !0)
	}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
	function (u, c) {
		"use strict";
		var d = {},
			s = u.document,
			m = u.GreenSockGlobals = u.GreenSockGlobals || u,
			t = m[c];
		if (t) return "undefined" != typeof module && module.exports && (module.exports = t);
		var e, i, r, g, _, n, a, y = function (t) {
				var e, i = t.split("."),
					s = m;
				for (e = 0; e < i.length; e++) s[i[e]] = s = s[i[e]] || {};
				return s
			},
			f = y("com.greensock"),
			v = 1e-10,
			h = function (t) {
				var e, i = [],
					s = t.length;
				for (e = 0; e !== s; i.push(t[e++]));
				return i
			},
			b = function () {},
			x = (n = Object.prototype.toString, a = n.call([]), function (t) {
				return null != t && (t instanceof Array || "object" == typeof t && !!t.push && n.call(t) === a)
			}),
			T = {},
			w = function (o, h, l, p) {
				this.sc = T[o] ? T[o].sc : [], (T[o] = this).gsClass = null, this.func = l;
				var f = [];
				this.check = function (t) {
					for (var e, i, s, r, n = h.length, a = n; - 1 < --n;)(e = T[h[n]] || new w(h[n], [])).gsClass ? (f[n] = e.gsClass, a--) : t && e.sc.push(this);
					if (0 === a && l) {
						if (s = (i = ("com.greensock." + o).split(".")).pop(), r = y(i.join("."))[s] = this.gsClass = l.apply(l, f), p)
							if (m[s] = d[s] = r, "undefined" != typeof module && module.exports)
								if (o === c)
									for (n in module.exports = d[c] = r, d) r[n] = d[n];
								else d[c] && (d[c][s] = r);
						else "function" == typeof define && define.amd && define((u.GreenSockAMDPath ? u.GreenSockAMDPath + "/" : "") + o.split(".").pop(), [], function () {
							return r
						});
						for (n = 0; n < this.sc.length; n++) this.sc[n].check()
					}
				}, this.check(!0)
			},
			o = u._gsDefine = function (t, e, i, s) {
				return new w(t, e, i, s)
			},
			k = f._class = function (t, e, i) {
				return e = e || function () {}, o(t, [], function () {
					return e
				}, i), e
			};
		o.globals = m;
		var l = [0, 0, 1, 1],
			P = k("easing.Ease", function (t, e, i, s) {
				this._func = t, this._type = i || 0, this._power = s || 0, this._params = e ? l.concat(e) : l
			}, !0),
			A = P.map = {},
			p = P.register = function (t, e, i, s) {
				for (var r, n, a, o, h = e.split(","), l = h.length, p = (i || "easeIn,easeOut,easeInOut").split(","); - 1 < --l;)
					for (n = h[l], r = s ? k("easing." + n, null, !0) : f.easing[n] || {}, a = p.length; - 1 < --a;) o = p[a], A[n + "." + o] = A[o + n] = r[o] = t.getRatio ? t : t[o] || new t
			};
		for ((r = P.prototype)._calcEnd = !1, r.getRatio = function (t) {
				if (this._func) return this._params[0] = t, this._func.apply(null, this._params);
				var e = this._type,
					i = this._power,
					s = 1 === e ? 1 - t : 2 === e ? t : t < .5 ? 2 * t : 2 * (1 - t);
				return 1 === i ? s *= s : 2 === i ? s *= s * s : 3 === i ? s *= s * s * s : 4 === i && (s *= s * s * s * s), 1 === e ? 1 - s : 2 === e ? s : t < .5 ? s / 2 : 1 - s / 2
			}, i = (e = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"]).length; - 1 < --i;) r = e[i] + ",Power" + i, p(new P(null, null, 1, i), r, "easeOut", !0), p(new P(null, null, 2, i), r, "easeIn" + (0 === i ? ",easeNone" : "")), p(new P(null, null, 3, i), r, "easeInOut");
		A.linear = f.easing.Linear.easeIn, A.swing = f.easing.Quad.easeInOut;
		var S = k("events.EventDispatcher", function (t) {
			this._listeners = {}, this._eventTarget = t || this
		});
		(r = S.prototype).addEventListener = function (t, e, i, s, r) {
			r = r || 0;
			var n, a, o = this._listeners[t],
				h = 0;
			for (this !== g || _ || g.wake(), null == o && (this._listeners[t] = o = []), a = o.length; - 1 < --a;)(n = o[a]).c === e && n.s === i ? o.splice(a, 1) : 0 === h && n.pr < r && (h = a + 1);
			o.splice(h, 0, {
				c: e,
				s: i,
				up: s,
				pr: r
			})
		}, r.removeEventListener = function (t, e) {
			var i, s = this._listeners[t];
			if (s)
				for (i = s.length; - 1 < --i;)
					if (s[i].c === e) return void s.splice(i, 1)
		}, r.dispatchEvent = function (t) {
			var e, i, s, r = this._listeners[t];
			if (r)
				for (1 < (e = r.length) && (r = r.slice(0)), i = this._eventTarget; - 1 < --e;)(s = r[e]) && (s.up ? s.c.call(s.s || i, {
					type: t,
					target: i
				}) : s.c.call(s.s || i))
		};
		var D = u.requestAnimationFrame,
			C = u.cancelAnimationFrame,
			M = Date.now || function () {
				return (new Date).getTime()
			},
			F = M();
		for (i = (e = ["ms", "moz", "webkit", "o"]).length; - 1 < --i && !D;) D = u[e[i] + "RequestAnimationFrame"], C = u[e[i] + "CancelAnimationFrame"] || u[e[i] + "CancelRequestAnimationFrame"];
		k("Ticker", function (t, e) {
			var r, n, a, o, h, l = this,
				p = M(),
				i = !(!1 === e || !D) && "auto",
				f = 500,
				u = 33,
				c = function (t) {
					var e, i, s = M() - F;
					f < s && (p += s - u), F += s, l.time = (F - p) / 1e3, e = l.time - h, (!r || 0 < e || !0 === t) && (l.frame++, h += e + (o <= e ? .004 : o - e), i = !0), !0 !== t && (a = n(c)), i && l.dispatchEvent("tick")
				};
			S.call(l), l.time = l.frame = 0, l.tick = function () {
				c(!0)
			}, l.lagSmoothing = function (t, e) {
				return arguments.length ? (f = t || 1e10, void(u = Math.min(e, f, 0))) : f < 1e10
			}, l.sleep = function () {
				null != a && (i && C ? C(a) : clearTimeout(a), n = b, a = null, l === g && (_ = !1))
			}, l.wake = function (t) {
				null !== a ? l.sleep() : t ? p += -F + (F = M()) : 10 < l.frame && (F = M() - f + 5), n = 0 === r ? b : i && D ? D : function (t) {
					return setTimeout(t, 1e3 * (h - l.time) + 1 | 0)
				}, l === g && (_ = !0), c(2)
			}, l.fps = function (t) {
				return arguments.length ? (o = 1 / ((r = t) || 60), h = this.time + o, void l.wake()) : r
			}, l.useRAF = function (t) {
				return arguments.length ? (l.sleep(), i = t, void l.fps(r)) : i
			}, l.fps(t), setTimeout(function () {
				"auto" === i && l.frame < 5 && "hidden" !== (s || {}).visibilityState && l.useRAF(!1)
			}, 1500)
		}), (r = f.Ticker.prototype = new f.events.EventDispatcher).constructor = f.Ticker;
		var E = k("core.Animation", function (t, e) {
			if (this.vars = e = e || {}, this._duration = this._totalDuration = t || 0, this._delay = Number(e.delay) || 0, this._timeScale = 1, this._active = !0 === e.immediateRender, this.data = e.data, this._reversed = !0 === e.reversed, Q) {
				_ || g.wake();
				var i = this.vars.useFrames ? $ : Q;
				i.add(this, i._time), this.vars.paused && this.paused(!0)
			}
		});
		g = E.ticker = new f.Ticker, (r = E.prototype)._dirty = r._gc = r._initted = r._paused = !1, r._totalTime = r._time = 0, r._rawPrevTime = -1, r._next = r._last = r._onUpdate = r._timeline = r.timeline = null, r._paused = !1;
		var I = function () {
			_ && 2e3 < M() - F && ("hidden" !== (s || {}).visibilityState || !g.lagSmoothing()) && g.wake();
			var t = setTimeout(I, 2e3);
			t.unref && t.unref()
		};
		I(), r.play = function (t, e) {
			return null != t && this.seek(t, e), this.reversed(!1).paused(!1)
		}, r.pause = function (t, e) {
			return null != t && this.seek(t, e), this.paused(!0)
		}, r.resume = function (t, e) {
			return null != t && this.seek(t, e), this.paused(!1)
		}, r.seek = function (t, e) {
			return this.totalTime(Number(t), !1 !== e)
		}, r.restart = function (t, e) {
			return this.reversed(!1).paused(!1).totalTime(t ? -this._delay : 0, !1 !== e, !0)
		}, r.reverse = function (t, e) {
			return null != t && this.seek(t || this.totalDuration(), e), this.reversed(!0).paused(!1)
		}, r.render = function (t, e, i) {}, r.invalidate = function () {
			return this._time = this._totalTime = 0, this._initted = this._gc = !1, this._rawPrevTime = -1, (this._gc || !this.timeline) && this._enabled(!0), this
		}, r.isActive = function () {
			var t, e = this._timeline,
				i = this._startTime;
			return !e || !this._gc && !this._paused && e.isActive() && (t = e.rawTime(!0)) >= i && t < i + this.totalDuration() / this._timeScale - 1e-7
		}, r._enabled = function (t, e) {
			return _ || g.wake(), this._gc = !t, this._active = this.isActive(), !0 !== e && (t && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !t && this.timeline && this._timeline._remove(this, !0)), !1
		}, r._kill = function (t, e) {
			return this._enabled(!1, !1)
		}, r.kill = function (t, e) {
			return this._kill(t, e), this
		}, r._uncache = function (t) {
			for (var e = t ? this : this.timeline; e;) e._dirty = !0, e = e.timeline;
			return this
		}, r._swapSelfInParams = function (t) {
			for (var e = t.length, i = t.concat(); - 1 < --e;) "{self}" === t[e] && (i[e] = this);
			return i
		}, r._callback = function (t) {
			var e = this.vars,
				i = e[t],
				s = e[t + "Params"],
				r = e[t + "Scope"] || e.callbackScope || this;
			switch (s ? s.length : 0) {
				case 0:
					i.call(r);
					break;
				case 1:
					i.call(r, s[0]);
					break;
				case 2:
					i.call(r, s[0], s[1]);
					break;
				default:
					i.apply(r, s)
			}
		}, r.eventCallback = function (t, e, i, s) {
			if ("on" === (t || "").substr(0, 2)) {
				var r = this.vars;
				if (1 === arguments.length) return r[t];
				null == e ? delete r[t] : (r[t] = e, r[t + "Params"] = x(i) && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i, r[t + "Scope"] = s), "onUpdate" === t && (this._onUpdate = e)
			}
			return this
		}, r.delay = function (t) {
			return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + t - this._delay), this._delay = t, this) : this._delay
		}, r.duration = function (t) {
			return arguments.length ? (this._duration = this._totalDuration = t, this._uncache(!0), this._timeline.smoothChildTiming && 0 < this._time && this._time < this._duration && 0 !== t && this.totalTime(this._totalTime * (t / this._duration), !0), this) : (this._dirty = !1, this._duration)
		}, r.totalDuration = function (t) {
			return this._dirty = !1, arguments.length ? this.duration(t) : this._totalDuration
		}, r.time = function (t, e) {
			return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(t > this._duration ? this._duration : t, e)) : this._time
		}, r.totalTime = function (t, e, i) {
			if (_ || g.wake(), !arguments.length) return this._totalTime;
			if (this._timeline) {
				if (t < 0 && !i && (t += this.totalDuration()), this._timeline.smoothChildTiming) {
					this._dirty && this.totalDuration();
					var s = this._totalDuration,
						r = this._timeline;
					if (s < t && !i && (t = s), this._startTime = (this._paused ? this._pauseTime : r._time) - (this._reversed ? s - t : t) / this._timeScale, r._dirty || this._uncache(!1), r._timeline)
						for (; r._timeline;) r._timeline._time !== (r._startTime + r._totalTime) / r._timeScale && r.totalTime(r._totalTime, !0), r = r._timeline
				}
				this._gc && this._enabled(!0, !1), (this._totalTime !== t || 0 === this._duration) && (z.length && J(), this.render(t, e, !1), z.length && J())
			}
			return this
		}, r.progress = r.totalProgress = function (t, e) {
			var i = this.duration();
			return arguments.length ? this.totalTime(i * t, e) : i ? this._time / i : this.ratio
		}, r.startTime = function (t) {
			return arguments.length ? (t !== this._startTime && (this._startTime = t, this.timeline && this.timeline._sortChildren && this.timeline.add(this, t - this._delay)), this) : this._startTime
		}, r.endTime = function (t) {
			return this._startTime + (0 != t ? this.totalDuration() : this.duration()) / this._timeScale
		}, r.timeScale = function (t) {
			if (!arguments.length) return this._timeScale;
			var e, i;
			for (t = t || v, this._timeline && this._timeline.smoothChildTiming && (i = (e = this._pauseTime) || 0 === e ? e : this._timeline.totalTime(), this._startTime = i - (i - this._startTime) * this._timeScale / t), this._timeScale = t, i = this.timeline; i && i.timeline;) i._dirty = !0, i.totalDuration(), i = i.timeline;
			return this
		}, r.reversed = function (t) {
			return arguments.length ? (t != this._reversed && (this._reversed = t, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed
		}, r.paused = function (t) {
			if (!arguments.length) return this._paused;
			var e, i, s = this._timeline;
			return t != this._paused && s && (_ || t || g.wake(), i = (e = s.rawTime()) - this._pauseTime, !t && s.smoothChildTiming && (this._startTime += i, this._uncache(!1)), this._pauseTime = t ? e : null, this._paused = t, this._active = this.isActive(), !t && 0 !== i && this._initted && this.duration() && (e = s.smoothChildTiming ? this._totalTime : (e - this._startTime) / this._timeScale, this.render(e, e === this._totalTime, !0))), this._gc && !t && this._enabled(!0, !1), this
		};
		var R = k("core.SimpleTimeline", function (t) {
			E.call(this, 0, t), this.autoRemoveChildren = this.smoothChildTiming = !0
		});
		(r = R.prototype = new E).constructor = R, r.kill()._gc = !1, r._first = r._last = r._recent = null, r._sortChildren = !1, r.add = r.insert = function (t, e, i, s) {
			var r, n;
			if (t._startTime = Number(e || 0) + t._delay, t._paused && this !== t._timeline && (t._pauseTime = this.rawTime() - (t._timeline.rawTime() - t._pauseTime)), t.timeline && t.timeline._remove(t, !0), t.timeline = t._timeline = this, t._gc && t._enabled(!0, !0), r = this._last, this._sortChildren)
				for (n = t._startTime; r && r._startTime > n;) r = r._prev;
			return r ? (t._next = r._next, r._next = t) : (t._next = this._first, this._first = t), t._next ? t._next._prev = t : this._last = t, t._prev = r, this._recent = t, this._timeline && this._uncache(!0), this
		}, r._remove = function (t, e) {
			return t.timeline === this && (e || t._enabled(!1, !0), t._prev ? t._prev._next = t._next : this._first === t && (this._first = t._next), t._next ? t._next._prev = t._prev : this._last === t && (this._last = t._prev), t._next = t._prev = t.timeline = null, t === this._recent && (this._recent = this._last), this._timeline && this._uncache(!0)), this
		}, r.render = function (t, e, i) {
			var s, r = this._first;
			for (this._totalTime = this._time = this._rawPrevTime = t; r;) s = r._next, (r._active || t >= r._startTime && !r._paused && !r._gc) && (r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (t - r._startTime) * r._timeScale, e, i) : r.render((t - r._startTime) * r._timeScale, e, i)), r = s
		}, r.rawTime = function () {
			return _ || g.wake(), this._totalTime
		};
		var O = k("TweenLite", function (t, e, i) {
				if (E.call(this, e, i), this.render = O.prototype.render, null == t) throw "Cannot tween a null target.";
				this.target = t = "string" != typeof t ? t : O.selector(t) || t;
				var s, r, n, a = t.jquery || t.length && t !== u && t[0] && (t[0] === u || t[0].nodeType && t[0].style && !t.nodeType),
					o = this.vars.overwrite;
				if (this._overwrite = o = null == o ? Z[O.defaultOverwrite] : "number" == typeof o ? o >> 0 : Z[o], (a || t instanceof Array || t.push && x(t)) && "number" != typeof t[0])
					for (this._targets = n = h(t), this._propLookup = [], this._siblings = [], s = 0; s < n.length; s++)(r = n[s]) ? "string" != typeof r ? r.length && r !== u && r[0] && (r[0] === u || r[0].nodeType && r[0].style && !r.nodeType) ? (n.splice(s--, 1), this._targets = n = n.concat(h(r))) : (this._siblings[s] = tt(r, this, !1), 1 === o && 1 < this._siblings[s].length && it(r, this, null, 1, this._siblings[s])) : "string" == typeof (r = n[s--] = O.selector(r)) && n.splice(s + 1, 1) : n.splice(s--, 1);
				else this._propLookup = {}, this._siblings = tt(t, this, !1), 1 === o && 1 < this._siblings.length && it(t, this, null, 1, this._siblings);
				(this.vars.immediateRender || 0 === e && 0 === this._delay && !1 !== this.vars.immediateRender) && (this._time = -v, this.render(Math.min(0, -this._delay)))
			}, !0),
			L = function (t) {
				return t && t.length && t !== u && t[0] && (t[0] === u || t[0].nodeType && t[0].style && !t.nodeType)
			};
		(r = O.prototype = new E).constructor = O, r.kill()._gc = !1, r.ratio = 0, r._firstPT = r._targets = r._overwrittenProps = r._startAt = null, r._notifyPluginsOfEnabled = r._lazy = !1, O.version = "2.0.2", O.defaultEase = r._ease = new P(null, null, 1, 1), O.defaultOverwrite = "auto", O.ticker = g, O.autoSleep = 120, O.lagSmoothing = function (t, e) {
			g.lagSmoothing(t, e)
		}, O.selector = u.$ || u.jQuery || function (t) {
			var e = u.$ || u.jQuery;
			return e ? (O.selector = e)(t) : (s || (s = u.document), s ? s.querySelectorAll ? s.querySelectorAll(t) : s.getElementById("#" === t.charAt(0) ? t.substr(1) : t) : t)
		};
		var z = [],
			N = {},
			V = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
			B = /[\+-]=-?[\.\d]/,
			j = function (t) {
				for (var e, i = this._firstPT; i;) e = i.blob ? 1 === t && null != this.end ? this.end : t ? this.join("") : this.start : i.c * t + i.s, i.m ? e = i.m.call(this._tween, e, this._target || i.t, this._tween) : e < 1e-6 && -1e-6 < e && !i.blob && (e = 0), i.f ? i.fp ? i.t[i.p](i.fp, e) : i.t[i.p](e) : i.t[i.p] = e, i = i._next
			},
			X = function (t, e, i, s) {
				var r, n, a, o, h, l, p, f = [],
					u = 0,
					c = "",
					d = 0;
				for (f.start = t, f.end = e, t = f[0] = t + "", e = f[1] = e + "", i && (i(f), t = f[0], e = f[1]), f.length = 0, r = t.match(V) || [], n = e.match(V) || [], s && (s._next = null, s.blob = 1, f._firstPT = f._applyPT = s), h = n.length, o = 0; o < h; o++) p = n[o], c += (l = e.substr(u, e.indexOf(p, u) - u)) || !o ? l : ",", u += l.length, d ? d = (d + 1) % 5 : "rgba(" === l.substr(-5) && (d = 1), p === r[o] || r.length <= o ? c += p : (c && (f.push(c), c = ""), a = parseFloat(r[o]), f.push(a), f._firstPT = {
					_next: f._firstPT,
					t: f,
					p: f.length - 1,
					s: a,
					c: ("=" === p.charAt(1) ? parseInt(p.charAt(0) + "1", 10) * parseFloat(p.substr(2)) : parseFloat(p) - a) || 0,
					f: 0,
					m: d && d < 4 ? Math.round : 0
				}), u += p.length;
				return (c += e.substr(u)) && f.push(c), f.setRatio = j, B.test(e) && (f.end = null), f
			},
			Y = function (t, e, i, s, r, n, a, o, h) {
				"function" == typeof s && (s = s(h || 0, t));
				var l = typeof t[e],
					p = "function" !== l ? "" : e.indexOf("set") || "function" != typeof t["get" + e.substr(3)] ? e : "get" + e.substr(3),
					f = "get" !== i ? i : p ? a ? t[p](a) : t[p]() : t[e],
					u = "string" == typeof s && "=" === s.charAt(1),
					c = {
						t: t,
						p: e,
						s: f,
						f: "function" === l,
						pg: 0,
						n: r || e,
						m: n ? "function" == typeof n ? n : Math.round : 0,
						pr: 0,
						c: u ? parseInt(s.charAt(0) + "1", 10) * parseFloat(s.substr(2)) : parseFloat(s) - f || 0
					};
				return ("number" != typeof f || "number" != typeof s && !u) && (a || isNaN(f) || !u && isNaN(s) || "boolean" == typeof f || "boolean" == typeof s ? (c.fp = a, c = {
					t: X(f, u ? parseFloat(c.s) + c.c + (c.s + "").replace(/[0-9\-\.]/g, "") : s, o || O.defaultStringFilter, c),
					p: "setRatio",
					s: 0,
					c: 1,
					f: 2,
					pg: 0,
					n: r || e,
					pr: 0,
					m: 0
				}) : (c.s = parseFloat(f), u || (c.c = parseFloat(s) - c.s || 0))), c.c ? ((c._next = this._firstPT) && (c._next._prev = c), this._firstPT = c) : void 0
			},
			q = O._internals = {
				isArray: x,
				isSelector: L,
				lazyTweens: z,
				blobDif: X
			},
			G = O._plugins = {},
			W = q.tweenLookup = {},
			U = 0,
			H = q.reservedProps = {
				ease: 1,
				delay: 1,
				overwrite: 1,
				onComplete: 1,
				onCompleteParams: 1,
				onCompleteScope: 1,
				useFrames: 1,
				runBackwards: 1,
				startAt: 1,
				onUpdate: 1,
				onUpdateParams: 1,
				onUpdateScope: 1,
				onStart: 1,
				onStartParams: 1,
				onStartScope: 1,
				onReverseComplete: 1,
				onReverseCompleteParams: 1,
				onReverseCompleteScope: 1,
				onRepeat: 1,
				onRepeatParams: 1,
				onRepeatScope: 1,
				easeParams: 1,
				yoyo: 1,
				immediateRender: 1,
				repeat: 1,
				repeatDelay: 1,
				data: 1,
				paused: 1,
				reversed: 1,
				autoCSS: 1,
				lazy: 1,
				onOverwrite: 1,
				callbackScope: 1,
				stringFilter: 1,
				id: 1,
				yoyoEase: 1
			},
			Z = {
				none: 0,
				all: 1,
				auto: 2,
				concurrent: 3,
				allOnStart: 4,
				preexisting: 5,
				true: 1,
				false: 0
			},
			$ = E._rootFramesTimeline = new R,
			Q = E._rootTimeline = new R,
			K = 30,
			J = q.lazyRender = function () {
				var t, e = z.length;
				for (N = {}; - 1 < --e;)(t = z[e]) && !1 !== t._lazy && (t.render(t._lazy[0], t._lazy[1], !0), t._lazy = !1);
				z.length = 0
			};
		Q._startTime = g.time, $._startTime = g.frame, Q._active = $._active = !0, setTimeout(J, 1), E._updateRoot = O.render = function () {
			var t, e, i;
			if (z.length && J(), Q.render((g.time - Q._startTime) * Q._timeScale, !1, !1), $.render((g.frame - $._startTime) * $._timeScale, !1, !1), z.length && J(), g.frame >= K) {
				for (i in K = g.frame + (parseInt(O.autoSleep, 10) || 120), W) {
					for (t = (e = W[i].tweens).length; - 1 < --t;) e[t]._gc && e.splice(t, 1);
					0 === e.length && delete W[i]
				}
				if ((!(i = Q._first) || i._paused) && O.autoSleep && !$._first && 1 === g._listeners.tick.length) {
					for (; i && i._paused;) i = i._next;
					i || g.sleep()
				}
			}
		}, g.addEventListener("tick", E._updateRoot);
		var tt = function (t, e, i) {
				var s, r, n = t._gsTweenID;
				if (W[n || (t._gsTweenID = n = "t" + U++)] || (W[n] = {
						target: t,
						tweens: []
					}), e && ((s = W[n].tweens)[r = s.length] = e, i))
					for (; - 1 < --r;) s[r] === e && s.splice(r, 1);
				return W[n].tweens
			},
			et = function (t, e, i, s) {
				var r, n, a = t.vars.onOverwrite;
				return a && (r = a(t, e, i, s)), (a = O.onOverwrite) && (n = a(t, e, i, s)), !1 !== r && !1 !== n
			},
			it = function (t, e, i, s, r) {
				var n, a, o, h;
				if (1 === s || 4 <= s) {
					for (h = r.length, n = 0; n < h; n++)
						if ((o = r[n]) !== e) o._gc || o._kill(null, t, e) && (a = !0);
						else if (5 === s) break;
					return a
				}
				var l, p = e._startTime + v,
					f = [],
					u = 0,
					c = 0 === e._duration;
				for (n = r.length; - 1 < --n;)(o = r[n]) === e || o._gc || o._paused || (o._timeline !== e._timeline ? (l = l || st(e, 0, c), 0 === st(o, l, c) && (f[u++] = o)) : o._startTime <= p && o._startTime + o.totalDuration() / o._timeScale > p && ((c || !o._initted) && p - o._startTime <= 2e-10 || (f[u++] = o)));
				for (n = u; - 1 < --n;)
					if (h = (o = f[n])._firstPT, 2 === s && o._kill(i, t, e) && (a = !0), 2 !== s || !o._firstPT && o._initted && h) {
						if (2 !== s && !et(o, e)) continue;
						o._enabled(!1, !1) && (a = !0)
					}
				return a
			},
			st = function (t, e, i) {
				for (var s = t._timeline, r = s._timeScale, n = t._startTime; s._timeline;) {
					if (n += s._startTime, r *= s._timeScale, s._paused) return -100;
					s = s._timeline
				}
				return e < (n /= r) ? n - e : i && n === e || !t._initted && n - e < 2 * v ? v : (n += t.totalDuration() / t._timeScale / r) > e + v ? 0 : n - e - v
			};
		r._init = function () {
			var t, e, i, s, r, n, a = this.vars,
				o = this._overwrittenProps,
				h = this._duration,
				l = !!a.immediateRender,
				p = a.ease;
			if (a.startAt) {
				for (s in this._startAt && (this._startAt.render(-1, !0), this._startAt.kill()), r = {}, a.startAt) r[s] = a.startAt[s];
				if (r.data = "isStart", r.overwrite = !1, r.immediateRender = !0, r.lazy = l && !1 !== a.lazy, r.startAt = r.delay = null, r.onUpdate = a.onUpdate, r.onUpdateParams = a.onUpdateParams, r.onUpdateScope = a.onUpdateScope || a.callbackScope || this, this._startAt = O.to(this.target || {}, 0, r), l)
					if (0 < this._time) this._startAt = null;
					else if (0 !== h) return
			} else if (a.runBackwards && 0 !== h)
				if (this._startAt) this._startAt.render(-1, !0), this._startAt.kill(), this._startAt = null;
				else {
					for (s in 0 !== this._time && (l = !1), i = {}, a) H[s] && "autoCSS" !== s || (i[s] = a[s]);
					if (i.overwrite = 0, i.data = "isFromStart", i.lazy = l && !1 !== a.lazy, i.immediateRender = l, this._startAt = O.to(this.target, 0, i), l) {
						if (0 === this._time) return
					} else this._startAt._init(), this._startAt._enabled(!1), this.vars.immediateRender && (this._startAt = null)
				}
			if (this._ease = p = p ? p instanceof P ? p : "function" == typeof p ? new P(p, a.easeParams) : A[p] || O.defaultEase : O.defaultEase, a.easeParams instanceof Array && p.config && (this._ease = p.config.apply(p, a.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets)
				for (n = this._targets.length, t = 0; t < n; t++) this._initProps(this._targets[t], this._propLookup[t] = {}, this._siblings[t], o ? o[t] : null, t) && (e = !0);
			else e = this._initProps(this.target, this._propLookup, this._siblings, o, 0);
			if (e && O._onPluginEvent("_onInitAllProps", this), o && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), a.runBackwards)
				for (i = this._firstPT; i;) i.s += i.c, i.c = -i.c, i = i._next;
			this._onUpdate = a.onUpdate, this._initted = !0
		}, r._initProps = function (t, e, i, s, r) {
			var n, a, o, h, l, p;
			if (null == t) return !1;
			for (n in N[t._gsTweenID] && J(), this.vars.css || t.style && t !== u && t.nodeType && G.css && !1 !== this.vars.autoCSS && function (t, e) {
					var i, s = {};
					for (i in t) H[i] || i in e && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!G[i] || G[i] && G[i]._autoCSS) || (s[i] = t[i], delete t[i]);
					t.css = s
				}(this.vars, t), this.vars)
				if (p = this.vars[n], H[n]) p && (p instanceof Array || p.push && x(p)) && -1 !== p.join("").indexOf("{self}") && (this.vars[n] = p = this._swapSelfInParams(p, this));
				else if (G[n] && (h = new G[n])._onInitTween(t, this.vars[n], this, r)) {
				for (this._firstPT = l = {
						_next: this._firstPT,
						t: h,
						p: "setRatio",
						s: 0,
						c: 1,
						f: 1,
						n: n,
						pg: 1,
						pr: h._priority,
						m: 0
					}, a = h._overwriteProps.length; - 1 < --a;) e[h._overwriteProps[a]] = this._firstPT;
				(h._priority || h._onInitAllProps) && (o = !0), (h._onDisable || h._onEnable) && (this._notifyPluginsOfEnabled = !0), l._next && (l._next._prev = l)
			} else e[n] = Y.call(this, t, n, "get", p, n, 0, null, this.vars.stringFilter, r);
			return s && this._kill(s, t) ? this._initProps(t, e, i, s, r) : 1 < this._overwrite && this._firstPT && 1 < i.length && it(t, this, e, this._overwrite, i) ? (this._kill(e, t), this._initProps(t, e, i, s, r)) : (this._firstPT && (!1 !== this.vars.lazy && this._duration || this.vars.lazy && !this._duration) && (N[t._gsTweenID] = !0), o)
		}, r.render = function (t, e, i) {
			var s, r, n, a, o = this._time,
				h = this._duration,
				l = this._rawPrevTime;
			if (h - 1e-7 <= t && 0 <= t) this._totalTime = this._time = h, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (s = !0, r = "onComplete", i = i || this._timeline.autoRemoveChildren), 0 === h && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0), (l < 0 || t <= 0 && -1e-7 <= t || l === v && "isPause" !== this.data) && l !== t && (i = !0, v < l && (r = "onReverseComplete")), this._rawPrevTime = a = !e || t || l === t ? t : v);
			else if (t < 1e-7) this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== o || 0 === h && 0 < l) && (r = "onReverseComplete", s = this._reversed), t < 0 && (this._active = !1, 0 === h && (this._initted || !this.vars.lazy || i) && (0 <= l && (l !== v || "isPause" !== this.data) && (i = !0), this._rawPrevTime = a = !e || t || l === t ? t : v)), (!this._initted || this._startAt && this._startAt.progress()) && (i = !0);
			else if (this._totalTime = this._time = t, this._easeType) {
				var p = t / h,
					f = this._easeType,
					u = this._easePower;
				(1 === f || 3 === f && .5 <= p) && (p = 1 - p), 3 === f && (p *= 2), 1 === u ? p *= p : 2 === u ? p *= p * p : 3 === u ? p *= p * p * p : 4 === u && (p *= p * p * p * p), this.ratio = 1 === f ? 1 - p : 2 === f ? p : t / h < .5 ? p / 2 : 1 - p / 2
			} else this.ratio = this._ease.getRatio(t / h);
			if (this._time !== o || i) {
				if (!this._initted) {
					if (this._init(), !this._initted || this._gc) return;
					if (!i && this._firstPT && (!1 !== this.vars.lazy && this._duration || this.vars.lazy && !this._duration)) return this._time = this._totalTime = o, this._rawPrevTime = l, z.push(this), void(this._lazy = [t, e]);
					this._time && !s ? this.ratio = this._ease.getRatio(this._time / h) : s && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
				}
				for (!1 !== this._lazy && (this._lazy = !1), this._active || !this._paused && this._time !== o && 0 <= t && (this._active = !0), 0 === o && (this._startAt && (0 <= t ? this._startAt.render(t, !0, i) : r || (r = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === h) && (e || this._callback("onStart"))), n = this._firstPT; n;) n.f ? n.t[n.p](n.c * this.ratio + n.s) : n.t[n.p] = n.c * this.ratio + n.s, n = n._next;
				this._onUpdate && (t < 0 && this._startAt && -1e-4 !== t && this._startAt.render(t, !0, i), e || (this._time !== o || s || i) && this._callback("onUpdate")), r && (!this._gc || i) && (t < 0 && this._startAt && !this._onUpdate && -1e-4 !== t && this._startAt.render(t, !0, i), s && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[r] && this._callback(r), 0 === h && this._rawPrevTime === v && a !== v && (this._rawPrevTime = 0))
			}
		}, r._kill = function (t, e, i) {
			if ("all" === t && (t = null), null == t && (null == e || e === this.target)) return this._lazy = !1, this._enabled(!1, !1);
			e = "string" != typeof e ? e || this._targets || this.target : O.selector(e) || e;
			var s, r, n, a, o, h, l, p, f, u = i && this._time && i._startTime === this._startTime && this._timeline === i._timeline,
				c = this._firstPT;
			if ((x(e) || L(e)) && "number" != typeof e[0])
				for (s = e.length; - 1 < --s;) this._kill(t, e[s], i) && (h = !0);
			else {
				if (this._targets) {
					for (s = this._targets.length; - 1 < --s;)
						if (e === this._targets[s]) {
							o = this._propLookup[s] || {}, this._overwrittenProps = this._overwrittenProps || [], r = this._overwrittenProps[s] = t ? this._overwrittenProps[s] || {} : "all";
							break
						}
				} else {
					if (e !== this.target) return !1;
					o = this._propLookup, r = this._overwrittenProps = t ? this._overwrittenProps || {} : "all"
				}
				if (o) {
					if (l = t || o, p = t !== r && "all" !== r && t !== o && ("object" != typeof t || !t._tempKill), i && (O.onOverwrite || this.vars.onOverwrite)) {
						for (n in l) o[n] && (f || (f = []), f.push(n));
						if ((f || !t) && !et(this, i, e, f)) return !1
					}
					for (n in l)(a = o[n]) && (u && (a.f ? a.t[a.p](a.s) : a.t[a.p] = a.s, h = !0), a.pg && a.t._kill(l) && (h = !0), a.pg && 0 !== a.t._overwriteProps.length || (a._prev ? a._prev._next = a._next : a === this._firstPT && (this._firstPT = a._next), a._next && (a._next._prev = a._prev), a._next = a._prev = null), delete o[n]), p && (r[n] = 1);
					!this._firstPT && this._initted && c && this._enabled(!1, !1)
				}
			}
			return h
		}, r.invalidate = function () {
			return this._notifyPluginsOfEnabled && O._onPluginEvent("_onDisable", this), this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null, this._notifyPluginsOfEnabled = this._active = this._lazy = !1, this._propLookup = this._targets ? {} : [], E.prototype.invalidate.call(this), this.vars.immediateRender && (this._time = -v, this.render(Math.min(0, -this._delay))), this
		}, r._enabled = function (t, e) {
			if (_ || g.wake(), t && this._gc) {
				var i, s = this._targets;
				if (s)
					for (i = s.length; - 1 < --i;) this._siblings[i] = tt(s[i], this, !0);
				else this._siblings = tt(this.target, this, !0)
			}
			return E.prototype._enabled.call(this, t, e), !(!this._notifyPluginsOfEnabled || !this._firstPT) && O._onPluginEvent(t ? "_onEnable" : "_onDisable", this)
		}, O.to = function (t, e, i) {
			return new O(t, e, i)
		}, O.from = function (t, e, i) {
			return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new O(t, e, i)
		}, O.fromTo = function (t, e, i, s) {
			return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, new O(t, e, s)
		}, O.delayedCall = function (t, e, i, s, r) {
			return new O(e, 0, {
				delay: t,
				onComplete: e,
				onCompleteParams: i,
				callbackScope: s,
				onReverseComplete: e,
				onReverseCompleteParams: i,
				immediateRender: !1,
				lazy: !1,
				useFrames: r,
				overwrite: 0
			})
		}, O.set = function (t, e) {
			return new O(t, 0, e)
		}, O.getTweensOf = function (t, e) {
			if (null == t) return [];
			var i, s, r, n;
			if (t = "string" != typeof t ? t : O.selector(t) || t, (x(t) || L(t)) && "number" != typeof t[0]) {
				for (i = t.length, s = []; - 1 < --i;) s = s.concat(O.getTweensOf(t[i], e));
				for (i = s.length; - 1 < --i;)
					for (n = s[i], r = i; - 1 < --r;) n === s[r] && s.splice(i, 1)
			} else if (t._gsTweenID)
				for (i = (s = tt(t).concat()).length; - 1 < --i;)(s[i]._gc || e && !s[i].isActive()) && s.splice(i, 1);
			return s || []
		}, O.killTweensOf = O.killDelayedCallsTo = function (t, e, i) {
			"object" == typeof e && (i = e, e = !1);
			for (var s = O.getTweensOf(t, e), r = s.length; - 1 < --r;) s[r]._kill(i, t)
		};
		var rt = k("plugins.TweenPlugin", function (t, e) {
			this._overwriteProps = (t || "").split(","), this._propName = this._overwriteProps[0], this._priority = e || 0, this._super = rt.prototype
		}, !0);
		if (r = rt.prototype, rt.version = "1.19.0", rt.API = 2, r._firstPT = null, r._addTween = Y, r.setRatio = j, r._kill = function (t) {
				var e, i = this._overwriteProps,
					s = this._firstPT;
				if (null != t[this._propName]) this._overwriteProps = [];
				else
					for (e = i.length; - 1 < --e;) null != t[i[e]] && i.splice(e, 1);
				for (; s;) null != t[s.n] && (s._next && (s._next._prev = s._prev), s._prev ? (s._prev._next = s._next, s._prev = null) : this._firstPT === s && (this._firstPT = s._next)), s = s._next;
				return !1
			}, r._mod = r._roundProps = function (t) {
				for (var e, i = this._firstPT; i;)(e = t[this._propName] || null != i.n && t[i.n.split(this._propName + "_").join("")]) && "function" == typeof e && (2 === i.f ? i.t._applyPT.m = e : i.m = e), i = i._next
			}, O._onPluginEvent = function (t, e) {
				var i, s, r, n, a, o = e._firstPT;
				if ("_onInitAllProps" === t) {
					for (; o;) {
						for (a = o._next, s = r; s && s.pr > o.pr;) s = s._next;
						(o._prev = s ? s._prev : n) ? o._prev._next = o: r = o, (o._next = s) ? s._prev = o : n = o, o = a
					}
					o = e._firstPT = r
				}
				for (; o;) o.pg && "function" == typeof o.t[t] && o.t[t]() && (i = !0), o = o._next;
				return i
			}, rt.activate = function (t) {
				for (var e = t.length; - 1 < --e;) t[e].API === rt.API && (G[(new t[e])._propName] = t[e]);
				return !0
			}, o.plugin = function (t) {
				if (!(t && t.propName && t.init && t.API)) throw "illegal plugin definition.";
				var e, i = t.propName,
					s = t.priority || 0,
					r = t.overwriteProps,
					n = {
						init: "_onInitTween",
						set: "setRatio",
						kill: "_kill",
						round: "_mod",
						mod: "_mod",
						initAll: "_onInitAllProps"
					},
					a = k("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function () {
						rt.call(this, i, s), this._overwriteProps = r || []
					}, !0 === t.global),
					o = a.prototype = new rt(i);
				for (e in (o.constructor = a).API = t.API, n) "function" == typeof t[e] && (o[n[e]] = t[e]);
				return a.version = t.version, rt.activate([a]), a
			}, e = u._gsQueue) {
			for (i = 0; i < e.length; i++) e[i]();
			for (r in T) T[r].func || u.console.log("GSAP encountered missing dependency: " + r)
		}
		_ = !1
	}("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenMax"), ((_gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window)._gsQueue || (_gsScope._gsQueue = [])).push(function () {
		"use strict";
		var h = (_gsScope.document || {}).documentElement,
			l = _gsScope,
			a = function (t, e) {
				var i = "x" === e ? "Width" : "Height",
					s = "scroll" + i,
					r = "client" + i,
					n = document.body;
				return t === l || t === h || t === n ? Math.max(h[s], n[s]) - (l["inner" + i] || h[r] || n[r]) : t[s] - t["offset" + i]
			},
			p = function (t, e) {
				var i = "scroll" + ("x" === e ? "Left" : "Top");
				return t === l && (null != t.pageXOffset ? i = "page" + e.toUpperCase() + "Offset" : t = null != h[i] ? h : document.body),
					function () {
						return t[i]
					}
			},
			r = function (t, e) {
				var i, s = (i = t, "string" == typeof i && (i = TweenLite.selector(i)), i.length && i !== l && i[0] && i[0].style && !i.nodeType && (i = i[0]), i === l || i.nodeType && i.style ? i : null).getBoundingClientRect(),
					r = document.body,
					n = !e || e === l || e === r,
					a = n ? {
						top: h.clientTop - (window.pageYOffset || h.scrollTop || r.scrollTop || 0),
						left: h.clientLeft - (window.pageXOffset || h.scrollLeft || r.scrollLeft || 0)
					} : e.getBoundingClientRect(),
					o = {
						x: s.left - a.left,
						y: s.top - a.top
					};
				return !n && e && (o.x += p(e, "x")(), o.y += p(e, "y")()), o
			},
			s = function (t, e, i) {
				var s = typeof t;
				return isNaN(t) ? "number" === s || "string" === s && "=" === t.charAt(1) ? t : "max" === t ? a(e, i) : Math.min(a(e, i), r(t, e)[i]) : parseFloat(t)
			},
			o = _gsScope._gsDefine.plugin({
				propName: "scrollTo",
				API: 2,
				global: !0,
				version: "1.9.1",
				init: function (t, e, i) {
					return this._wdw = t === l, this._target = t, this._tween = i, "object" != typeof e ? "string" == typeof (e = {
						y: e
					}).y && "max" !== e.y && "=" !== e.y.charAt(1) && (e.x = e.y) : e.nodeType && (e = {
						y: e,
						x: e
					}), this.vars = e, this._autoKill = !1 !== e.autoKill, this.getX = p(t, "x"), this.getY = p(t, "y"), this.x = this.xPrev = this.getX(), this.y = this.yPrev = this.getY(), null != e.x ? (this._addTween(this, "x", this.x, s(e.x, t, "x") - (e.offsetX || 0), "scrollTo_x", !0), this._overwriteProps.push("scrollTo_x")) : this.skipX = !0, null != e.y ? (this._addTween(this, "y", this.y, s(e.y, t, "y") - (e.offsetY || 0), "scrollTo_y", !0), this._overwriteProps.push("scrollTo_y")) : this.skipY = !0, !0
				},
				set: function (t) {
					this._super.setRatio.call(this, t);
					var e = this._wdw || !this.skipX ? this.getX() : this.xPrev,
						i = this._wdw || !this.skipY ? this.getY() : this.yPrev,
						s = i - this.yPrev,
						r = e - this.xPrev,
						n = o.autoKillThreshold;
					this.x < 0 && (this.x = 0), this.y < 0 && (this.y = 0), this._autoKill && (!this.skipX && (n < r || r < -n) && e < a(this._target, "x") && (this.skipX = !0), !this.skipY && (n < s || s < -n) && i < a(this._target, "y") && (this.skipY = !0), this.skipX && this.skipY && (this._tween.kill(), this.vars.onAutoKill && this.vars.onAutoKill.apply(this.vars.onAutoKillScope || this._tween, this.vars.onAutoKillParams || []))), this._wdw ? l.scrollTo(this.skipX ? e : this.x, this.skipY ? i : this.y) : (this.skipY || (this._target.scrollTop = this.y), this.skipX || (this._target.scrollLeft = this.x)), this.xPrev = this.x, this.yPrev = this.y
				}
			}),
			t = o.prototype;
		o.max = a, o.getOffset = r, o.buildGetter = p, o.autoKillThreshold = 7, t._kill = function (t) {
			return t.scrollTo_x && (this.skipX = !0), t.scrollTo_y && (this.skipY = !0), this._super._kill.call(this, t)
		}
	}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
	function (t) {
		"use strict";
		var e = function () {
			return (_gsScope.GreenSockGlobals || _gsScope).ScrollToPlugin
		};
		"undefined" != typeof module && module.exports ? (require("../TweenLite.min.js"), module.exports = e()) : "function" == typeof define && define.amd && define(["TweenLite"], e)
	}(), ((_gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window)._gsQueue || (_gsScope._gsQueue = [])).push(function () {
		"use strict";
		_gsScope._gsDefine("easing.CustomEase", ["easing.Ease"], function (y) {
			var m = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
				v = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
				b = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/gi,
				g = /[cLlsS]/g,
				x = "CustomEase only accepts Cubic Bezier data.",
				D = function (t, e, i, s, r, n, a, o, h, l, p) {
					var f, u = (t + i) / 2,
						c = (e + s) / 2,
						d = (i + r) / 2,
						m = (s + n) / 2,
						g = (r + a) / 2,
						_ = (n + o) / 2,
						y = (u + d) / 2,
						v = (c + m) / 2,
						b = (d + g) / 2,
						x = (m + _) / 2,
						T = (y + b) / 2,
						w = (v + x) / 2,
						k = a - t,
						P = o - e,
						A = Math.abs((i - a) * P - (s - o) * k),
						S = Math.abs((r - a) * P - (n - o) * k);
					return l || (l = [{
						x: t,
						y: e
					}, {
						x: a,
						y: o
					}], p = 1), l.splice(p || l.length - 1, 0, {
						x: T,
						y: w
					}), h * (k * k + P * P) < (A + S) * (A + S) && (f = l.length, D(t, e, u, c, y, v, T, w, h, l, p), D(T, w, b, x, g, _, a, o, h, l, p + 1 + (l.length - f))), l
				},
				s = function (t) {
					var e = this.lookup[t * this.l | 0] || this.lookup[this.l - 1];
					return e.nx < t && (e = e.n), e.y + (t - e.x) / e.cx * e.cy
				},
				r = function (t, e, i) {
					this._calcEnd = !0, (this.id = t) && (y.map[t] = this), this.getRatio = s, this.setData(e, i)
				},
				t = r.prototype = new y;
			return t.constructor = r, t.setData = function (t, e) {
				var i, s, r, n, a, o, h, l, p, f, u = (t = t || "0,0,1,1").match(m),
					c = 1,
					d = [];
				if (f = (e = e || {}).precision || 1, this.data = t, this.lookup = [], this.points = d, this.fast = f <= 1, (g.test(t) || -1 !== t.indexOf("M") && -1 === t.indexOf("C")) && (u = function (t) {
						var e, i, s, r, n, a, o, h, l, p, f, u = (t + "").replace(b, function (t) {
								var e = +t;
								return e < 1e-4 && -1e-4 < e ? 0 : e
							}).match(v) || [],
							c = [],
							d = 0,
							m = 0,
							g = u.length,
							_ = 2;
						for (e = 0; e < g; e++)
							if (l = r, isNaN(u[e]) ? n = (r = u[e].toUpperCase()) !== u[e] : e--, i = +u[e + 1], s = +u[e + 2], n && (i += d, s += m), e || (o = i, h = s), "M" === r) a && a.length < 8 && (c.length -= 1, _ = 0), d = o = i, m = h = s, a = [i, s], _ = 2, c.push(a), e += 2, r = "L";
							else if ("C" === r) a || (a = [0, 0]), a[_++] = i, a[_++] = s, n || (d = m = 0), a[_++] = d + 1 * u[e + 3], a[_++] = m + 1 * u[e + 4], a[_++] = d += 1 * u[e + 5], a[_++] = m += 1 * u[e + 6], e += 6;
						else if ("S" === r) "C" === l || "S" === l ? (p = d - a[_ - 4], f = m - a[_ - 3], a[_++] = d + p, a[_++] = m + f) : (a[_++] = d, a[_++] = m), a[_++] = i, a[_++] = s, n || (d = m = 0), a[_++] = d += 1 * u[e + 3], a[_++] = m += 1 * u[e + 4], e += 4;
						else {
							if ("L" !== r && "Z" !== r) throw x;
							"Z" === r && (i = o, s = h, a.closed = !0), ("L" === r || .5 < Math.abs(d - i) || .5 < Math.abs(m - s)) && (a[_++] = d + (i - d) / 3, a[_++] = m + (s - m) / 3, a[_++] = d + 2 * (i - d) / 3, a[_++] = m + 2 * (s - m) / 3, a[_++] = i, a[_++] = s, "L" === r && (e += 2)), d = i, m = s
						}
						return c[0]
					}(t)), 4 === (i = u.length)) u.unshift(0, 0), u.push(1, 1), i = 8;
				else if ((i - 2) % 6) throw x;
				for ((0 != +u[0] || 1 != +u[i - 2]) && function (t, e, i) {
						i || 0 === i || (i = Math.max(+t[t.length - 1], +t[1]));
						var s, r = -1 * +t[0],
							n = -i,
							a = t.length,
							o = 1 / (+t[a - 2] + r),
							h = -e || (Math.abs(+t[a - 1] - +t[1]) < .01 * (+t[a - 2] - +t[0]) ? function (t) {
								var e, i = t.length,
									s = 999999999999;
								for (e = 1; e < i; e += 6) + t[e] < s && (s = +t[e]);
								return s
							}(t) + n : +t[a - 1] + n);
						for (h = h ? 1 / h : -o, s = 0; s < a; s += 2) t[s] = (+t[s] + r) * o, t[s + 1] = (+t[s + 1] + n) * h
					}(u, e.height, e.originY), this.rawBezier = u, n = 2; n < i; n += 6) s = {
					x: +u[n - 2],
					y: +u[n - 1]
				}, r = {
					x: +u[n + 4],
					y: +u[n + 5]
				}, d.push(s, r), D(s.x, s.y, +u[n], +u[n + 1], +u[n + 2], +u[n + 3], r.x, r.y, 1 / (2e5 * f), d, d.length - 1);
				for (i = d.length, n = 0; n < i; n++) h = d[n], l = d[n - 1] || h, h.x > l.x || l.y !== h.y && l.x === h.x || h === l ? (l.cx = h.x - l.x, l.cy = h.y - l.y, l.n = h, l.nx = h.x, this.fast && 1 < n && 2 < Math.abs(l.cy / l.cx - d[n - 2].cy / d[n - 2].cx) && (this.fast = !1), l.cx < c && (l.cx ? c = l.cx : (l.cx = .001, n === i - 1 && (l.x -= .001, c = Math.min(c, .001), this.fast = !1)))) : (d.splice(n--, 1), i--);
				if (i = 1 / c + 1 | 0, a = 1 / (this.l = i), h = d[o = 0], this.fast) {
					for (n = 0; n < i; n++) p = n * a, h.nx < p && (h = d[++o]), s = h.y + (p - h.x) / h.cx * h.cy, this.lookup[n] = {
						x: p,
						cx: a,
						y: s,
						cy: 0,
						nx: 9
					}, n && (this.lookup[n - 1].cy = s - this.lookup[n - 1].y);
					this.lookup[i - 1].cy = d[d.length - 1].y - s
				} else {
					for (n = 0; n < i; n++) h.nx < n * a && (h = d[++o]), this.lookup[n] = h;
					o < d.length - 1 && (this.lookup[n - 1] = d[d.length - 2])
				}
				return this._calcEnd = 1 !== d[d.length - 1].y || 0 !== d[0].y, this
			}, t.getRatio = s, t.getSVGData = function (t) {
				return r.getSVGData(this, t)
			}, r.create = function (t, e, i) {
				return new r(t, e, i)
			}, r.version = "0.2.2", r.bezierToPoints = D, r.get = function (t) {
				return y.map[t]
			}, r.getSVGData = function (t, e) {
				var i, s, r, n, a, o, h, l, p, f, u = 1e3,
					c = (e = e || {}).width || 100,
					d = e.height || 100,
					m = e.x || 0,
					g = (e.y || 0) + d,
					_ = e.path;
				if (e.invert && (d = -d, g = 0), (t = t.getRatio ? t : y.map[t] || console.log("No ease found: ", t)).rawBezier) {
					for (i = [], h = t.rawBezier.length, r = 0; r < h; r += 2) i.push(((m + t.rawBezier[r] * c) * u | 0) / u + "," + ((g + t.rawBezier[r + 1] * -d) * u | 0) / u);
					i[0] = "M" + i[0], i[1] = "C" + i[1]
				} else
					for (i = ["M" + m + "," + g], n = 1 / (h = Math.max(5, 200 * (e.precision || 1))), l = 5 / (h += 2), p = ((m + n * c) * u | 0) / u, s = ((f = ((g + t.getRatio(n) * -d) * u | 0) / u) - g) / (p - m), r = 2; r < h; r++) a = ((m + r * n * c) * u | 0) / u, o = ((g + t.getRatio(r * n) * -d) * u | 0) / u, (Math.abs((o - f) / (a - p) - s) > l || r === h - 1) && (i.push(p + "," + f), s = (o - f) / (a - p)), p = a, f = o;
				return _ && ("string" == typeof _ ? document.querySelector(_) : _).setAttribute("d", i.join(" ")), i.join(" ")
			}, r
		}, !0)
	}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
	function (t) {
		"use strict";
		var e = function () {
			return (_gsScope.GreenSockGlobals || _gsScope).CustomEase
		};
		"undefined" != typeof module && module.exports ? (require("../TweenLite.min.js"), module.exports = e()) : "function" == typeof define && define.amd && define(["TweenLite"], e)
	}(),
	function (t, e) {
		"function" == typeof define && define.amd ? define(function () {
			return t.is = e()
		}) : "object" == typeof exports ? module.exports = e() : t.is = e()
	}(this, function () {
		var n = {
				VERSION: "0.8.0",
				not: {},
				all: {},
				any: {}
			},
			s = Object.prototype.toString,
			i = Array.prototype.slice,
			r = Object.prototype.hasOwnProperty;

		function a(t) {
			return function () {
				return !t.apply(null, i.call(arguments))
			}
		}

		function o(s) {
			return function () {
				for (var t = f(arguments), e = t.length, i = 0; i < e; i++)
					if (!s.call(null, t[i])) return !1;
				return !0
			}
		}

		function h(s) {
			return function () {
				for (var t = f(arguments), e = t.length, i = 0; i < e; i++)
					if (s.call(null, t[i])) return !0;
				return !1
			}
		}
		var l = {
			"<": function (t, e) {
				return t < e
			},
			"<=": function (t, e) {
				return t <= e
			},
			">": function (t, e) {
				return e < t
			},
			">=": function (t, e) {
				return e <= t
			}
		};

		function p(t, e) {
			var i = e + "",
				s = +(i.match(/\d+/) || NaN),
				r = i.match(/^[<>]=?|/)[0];
			return l[r] ? l[r](t, s) : t == s || s != s
		}

		function f(t) {
			var e = i.call(t);
			return 1 === e.length && n.array(e[0]) && (e = e[0]), e
		}
		n.arguments = function (t) {
			return "[object Arguments]" === s.call(t) || null != t && "object" == typeof t && "callee" in t
		}, n.array = Array.isArray || function (t) {
			return "[object Array]" === s.call(t)
		}, n.boolean = function (t) {
			return !0 === t || !1 === t || "[object Boolean]" === s.call(t)
		}, n.char = function (t) {
			return n.string(t) && 1 === t.length
		}, n.date = function (t) {
			return "[object Date]" === s.call(t)
		}, n.domNode = function (t) {
			return n.object(t) && 0 < t.nodeType
		}, n.error = function (t) {
			return "[object Error]" === s.call(t)
		}, n.function = function (t) {
			return "[object Function]" === s.call(t) || "function" == typeof t
		}, n.json = function (t) {
			return "[object Object]" === s.call(t)
		}, n.nan = function (t) {
			return t != t
		}, n.null = function (t) {
			return null === t
		}, n.number = function (t) {
			return n.not.nan(t) && "[object Number]" === s.call(t)
		}, n.object = function (t) {
			return Object(t) === t
		}, n.regexp = function (t) {
			return "[object RegExp]" === s.call(t)
		}, n.sameType = function (t, e) {
			var i = s.call(t);
			return i === s.call(e) && ("[object Number]" !== i || (!n.any.nan(t, e) || n.all.nan(t, e)))
		}, n.sameType.api = ["not"], n.string = function (t) {
			return "[object String]" === s.call(t)
		}, n.undefined = function (t) {
			return void 0 === t
		}, n.windowObject = function (t) {
			return null != t && "object" == typeof t && "setInterval" in t
		}, n.empty = function (t) {
			if (n.object(t)) {
				var e = Object.getOwnPropertyNames(t).length;
				return !!(0 === e || 1 === e && n.array(t) || 2 === e && n.arguments(t))
			}
			return "" === t
		}, n.existy = function (t) {
			return null != t
		}, n.falsy = function (t) {
			return !t
		}, n.truthy = a(n.falsy), n.above = function (t, e) {
			return n.all.number(t, e) && e < t
		}, n.above.api = ["not"], n.decimal = function (t) {
			return n.number(t) && t % 1 != 0
		}, n.equal = function (t, e) {
			return n.all.number(t, e) ? t === e && 1 / t == 1 / e : n.all.string(t, e) || n.all.regexp(t, e) ? "" + t == "" + e : !!n.all.boolean(t, e) && t === e
		}, n.equal.api = ["not"], n.even = function (t) {
			return n.number(t) && t % 2 == 0
		}, n.finite = isFinite || function (t) {
			return n.not.infinite(t) && n.not.nan(t)
		}, n.infinite = function (t) {
			return t === 1 / 0 || t === -1 / 0
		}, n.integer = function (t) {
			return n.number(t) && t % 1 == 0
		}, n.negative = function (t) {
			return n.number(t) && t < 0
		}, n.odd = function (t) {
			return n.number(t) && t % 2 == 1
		}, n.positive = function (t) {
			return n.number(t) && 0 < t
		}, n.under = function (t, e) {
			return n.all.number(t, e) && t < e
		}, n.under.api = ["not"], n.within = function (t, e, i) {
			return n.all.number(t, e, i) && e < t && t < i
		}, n.within.api = ["not"];
		var u = {
			affirmative: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,
			alphaNumeric: /^[A-Za-z0-9]+$/,
			caPostalCode: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,
			creditCard: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
			dateString: /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/,
			email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
			eppPhone: /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
			hexadecimal: /^(?:0x)?[0-9a-fA-F]+$/,
			hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
			ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
			ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
			nanpPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
			socialSecurityNumber: /^(?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}$/,
			timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
			ukPostCode: /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,
			url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
			usZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/
		};

		function t(e, i) {
			n[e] = function (t) {
				return i[e].test(t)
			}
		}
		for (var e in u) u.hasOwnProperty(e) && t(e, u);
		n.ip = function (t) {
			return n.ipv4(t) || n.ipv6(t)
		}, n.capitalized = function (t) {
			if (n.not.string(t)) return !1;
			for (var e = t.split(" "), i = 0; i < e.length; i++) {
				var s = e[i];
				if (s.length) {
					var r = s.charAt(0);
					if (r !== r.toUpperCase()) return !1
				}
			}
			return !0
		}, n.endWith = function (t, e) {
			if (n.not.string(t)) return !1;
			e += "";
			var i = t.length - e.length;
			return 0 <= i && t.indexOf(e, i) === i
		}, n.endWith.api = ["not"], n.include = function (t, e) {
			return -1 < t.indexOf(e)
		}, n.include.api = ["not"], n.lowerCase = function (t) {
			return n.string(t) && t === t.toLowerCase()
		}, n.palindrome = function (t) {
			if (n.not.string(t)) return !1;
			for (var e = (t = t.replace(/[^a-zA-Z0-9]+/g, "").toLowerCase()).length - 1, i = 0, s = Math.floor(e / 2); i <= s; i++)
				if (t.charAt(i) !== t.charAt(e - i)) return !1;
			return !0
		}, n.space = function (t) {
			if (n.not.char(t)) return !1;
			var e = t.charCodeAt(0);
			return 8 < e && e < 14 || 32 === e
		}, n.startWith = function (t, e) {
			return n.string(t) && 0 === t.indexOf(e)
		}, n.startWith.api = ["not"], n.upperCase = function (t) {
			return n.string(t) && t === t.toUpperCase()
		};
		var c = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
			d = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
		n.day = function (t, e) {
			return n.date(t) && e.toLowerCase() === c[t.getDay()]
		}, n.day.api = ["not"], n.dayLightSavingTime = function (t) {
			var e = new Date(t.getFullYear(), 0, 1),
				i = new Date(t.getFullYear(), 6, 1),
				s = Math.max(e.getTimezoneOffset(), i.getTimezoneOffset());
			return t.getTimezoneOffset() < s
		}, n.future = function (t) {
			var e = new Date;
			return n.date(t) && t.getTime() > e.getTime()
		}, n.inDateRange = function (t, e, i) {
			if (n.not.date(t) || n.not.date(e) || n.not.date(i)) return !1;
			var s = t.getTime();
			return s > e.getTime() && s < i.getTime()
		}, n.inDateRange.api = ["not"], n.inLastMonth = function (t) {
			return n.inDateRange(t, new Date((new Date).setMonth((new Date).getMonth() - 1)), new Date)
		}, n.inLastWeek = function (t) {
			return n.inDateRange(t, new Date((new Date).setDate((new Date).getDate() - 7)), new Date)
		}, n.inLastYear = function (t) {
			return n.inDateRange(t, new Date((new Date).setFullYear((new Date).getFullYear() - 1)), new Date)
		}, n.inNextMonth = function (t) {
			return n.inDateRange(t, new Date, new Date((new Date).setMonth((new Date).getMonth() + 1)))
		}, n.inNextWeek = function (t) {
			return n.inDateRange(t, new Date, new Date((new Date).setDate((new Date).getDate() + 7)))
		}, n.inNextYear = function (t) {
			return n.inDateRange(t, new Date, new Date((new Date).setFullYear((new Date).getFullYear() + 1)))
		}, n.leapYear = function (t) {
			return n.number(t) && (t % 4 == 0 && t % 100 != 0 || t % 400 == 0)
		}, n.month = function (t, e) {
			return n.date(t) && e.toLowerCase() === d[t.getMonth()]
		}, n.month.api = ["not"], n.past = function (t) {
			var e = new Date;
			return n.date(t) && t.getTime() < e.getTime()
		}, n.quarterOfYear = function (t, e) {
			return n.date(t) && n.number(e) && e === Math.floor((t.getMonth() + 3) / 3)
		}, n.quarterOfYear.api = ["not"], n.today = function (t) {
			var e = (new Date).toDateString();
			return n.date(t) && t.toDateString() === e
		}, n.tomorrow = function (t) {
			var e = new Date,
				i = new Date(e.setDate(e.getDate() + 1)).toDateString();
			return n.date(t) && t.toDateString() === i
		}, n.weekend = function (t) {
			return n.date(t) && (6 === t.getDay() || 0 === t.getDay())
		}, n.weekday = a(n.weekend), n.year = function (t, e) {
			return n.date(t) && n.number(e) && e === t.getFullYear()
		}, n.year.api = ["not"], n.yesterday = function (t) {
			var e = new Date,
				i = new Date(e.setDate(e.getDate() - 1)).toDateString();
			return n.date(t) && t.toDateString() === i
		};
		var m = n.windowObject("object" == typeof global && global) && global,
			g = n.windowObject("object" == typeof self && self) && self,
			_ = n.windowObject("object" == typeof this && this) && this,
			y = m || g || _ || Function("return this")(),
			v = g && g.document,
			b = y.is,
			x = g && g.navigator,
			T = (x && x.appVersion || "").toLowerCase(),
			w = (x && x.userAgent || "").toLowerCase(),
			k = (x && x.vendor || "").toLowerCase();
		return n.android = function () {
				return /android/.test(w)
			}, n.android.api = ["not"], n.androidPhone = function () {
				return /android/.test(w) && /mobile/.test(w)
			}, n.androidPhone.api = ["not"], n.androidTablet = function () {
				return /android/.test(w) && !/mobile/.test(w)
			}, n.androidTablet.api = ["not"], n.blackberry = function () {
				return /blackberry/.test(w) || /bb10/.test(w)
			}, n.blackberry.api = ["not"], n.chrome = function (t) {
				var e = /google inc/.test(k) ? w.match(/(?:chrome|crios)\/(\d+)/) : null;
				return null !== e && p(e[1], t)
			}, n.chrome.api = ["not"], n.desktop = function () {
				return n.not.mobile() && n.not.tablet()
			}, n.desktop.api = ["not"], n.edge = function (t) {
				var e = w.match(/edge\/(\d+)/);
				return null !== e && p(e[1], t)
			}, n.edge.api = ["not"], n.firefox = function (t) {
				var e = w.match(/(?:firefox|fxios)\/(\d+)/);
				return null !== e && p(e[1], t)
			}, n.firefox.api = ["not"], n.ie = function (t) {
				var e = w.match(/(?:msie |trident.+?; rv:)(\d+)/);
				return null !== e && p(e[1], t)
			}, n.ie.api = ["not"], n.ios = function () {
				return n.iphone() || n.ipad() || n.ipod()
			}, n.ios.api = ["not"], n.ipad = function (t) {
				var e = w.match(/ipad.+?os (\d+)/);
				return null !== e && p(e[1], t)
			}, n.ipad.api = ["not"], n.iphone = function (t) {
				var e = w.match(/iphone(?:.+?os (\d+))?/);
				return null !== e && p(e[1] || 1, t)
			}, n.iphone.api = ["not"], n.ipod = function (t) {
				var e = w.match(/ipod.+?os (\d+)/);
				return null !== e && p(e[1], t)
			}, n.ipod.api = ["not"], n.linux = function () {
				return /linux/.test(T)
			}, n.linux.api = ["not"], n.mac = function () {
				return /mac/.test(T)
			}, n.mac.api = ["not"], n.mobile = function () {
				return n.iphone() || n.ipod() || n.androidPhone() || n.blackberry() || n.windowsPhone()
			}, n.mobile.api = ["not"], n.offline = a(n.online), n.offline.api = ["not"], n.online = function () {
				return !x || !0 === x.onLine
			}, n.online.api = ["not"], n.opera = function (t) {
				var e = w.match(/(?:^opera.+?version|opr)\/(\d+)/);
				return null !== e && p(e[1], t)
			}, n.opera.api = ["not"], n.phantom = function (t) {
				var e = w.match(/phantomjs\/(\d+)/);
				return null !== e && p(e[1], t)
			}, n.phantom.api = ["not"], n.safari = function (t) {
				var e = w.match(/version\/(\d+).+?safari/);
				return null !== e && p(e[1], t)
			}, n.safari.api = ["not"], n.tablet = function () {
				return n.ipad() || n.androidTablet() || n.windowsTablet()
			}, n.tablet.api = ["not"], n.touchDevice = function () {
				return !!v && ("ontouchstart" in g || "DocumentTouch" in g && v instanceof DocumentTouch)
			}, n.touchDevice.api = ["not"], n.windows = function () {
				return /win/.test(T)
			}, n.windows.api = ["not"], n.windowsPhone = function () {
				return n.windows() && /phone/.test(w)
			}, n.windowsPhone.api = ["not"], n.windowsTablet = function () {
				return n.windows() && n.not.windowsPhone() && /touch/.test(w)
			}, n.windowsTablet.api = ["not"], n.propertyCount = function (t, e) {
				if (n.not.object(t) || n.not.number(e)) return !1;
				var i = 0;
				for (var s in t)
					if (r.call(t, s) && ++i > e) return !1;
				return i === e
			}, n.propertyCount.api = ["not"], n.propertyDefined = function (t, e) {
				return n.object(t) && n.string(e) && e in t
			}, n.propertyDefined.api = ["not"], n.inArray = function (t, e) {
				if (n.not.array(e)) return !1;
				for (var i = 0; i < e.length; i++)
					if (e[i] === t) return !0;
				return !1
			}, n.inArray.api = ["not"], n.sorted = function (t, e) {
				if (n.not.array(t)) return !1;
				for (var i = l[e] || l[">="], s = 1; s < t.length; s++)
					if (!i(t[s], t[s - 1])) return !1;
				return !0
			},
			function () {
				var t = n;
				for (var e in t)
					if (r.call(t, e) && n.function(t[e]))
						for (var i = t[e].api || ["not", "all", "any"], s = 0; s < i.length; s++) "not" === i[s] && (n.not[e] = a(n[e])), "all" === i[s] && (n.all[e] = o(n[e])), "any" === i[s] && (n.any[e] = h(n[e]))
			}(), n.setNamespace = function () {
				return y.is = b, this
			}, n.setRegexp = function (t, e) {
				for (var i in u) r.call(u, i) && e === i && (u[i] = t)
			}, n
	}), "undefined" != typeof navigator && function (t, e) {
		"function" == typeof define && define.amd ? define(function () {
			return e(t)
		}) : "object" == typeof module && module.exports ? module.exports = e(t) : (t.lottie = e(t), t.bodymovin = t.lottie)
	}(window || {}, function (g) {
		"use strict";

		function e(t) {
			t ? Math.round : function (t) {
				return t
			}
		}

		function i(t, e, i, s) {
			this.type = t, this.currentTime = e, this.totalTime = i, this.direction = s < 0 ? -1 : 1
		}

		function s(t, e) {
			this.type = t, this.direction = e < 0 ? -1 : 1
		}

		function r(t, e, i, s) {
			this.type = t, this.currentLoop = i, this.totalLoops = e, this.direction = s < 0 ? -1 : 1
		}

		function n(t, e, i) {
			this.type = t, this.firstFrame = e, this.totalFrames = i
		}

		function a(t, e) {
			this.type = t, this.target = e
		}

		function T(t, e) {
			void 0 === e && (e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
			var i, s = "";
			for (i = t; 0 < i; --i) s += e[Math.round(Math.random() * (e.length - 1))];
			return s
		}

		function o(t, e, i) {
			var s, r, n, a, o, h, l, p;
			switch (h = i * (1 - e), l = i * (1 - (o = 6 * t - (a = Math.floor(6 * t))) * e), p = i * (1 - (1 - o) * e), a % 6) {
				case 0:
					s = i, r = p, n = h;
					break;
				case 1:
					s = l, r = i, n = h;
					break;
				case 2:
					s = h, r = i, n = p;
					break;
				case 3:
					s = h, r = l, n = i;
					break;
				case 4:
					s = p, r = h, n = i;
					break;
				case 5:
					s = i, r = h, n = l
			}
			return [s, r, n]
		}

		function h(t, e, i) {
			var s, r = Math.max(t, e, i),
				n = Math.min(t, e, i),
				a = r - n,
				o = 0 === r ? 0 : a / r,
				h = r / 255;
			switch (r) {
				case n:
					s = 0;
					break;
				case t:
					s = e - i + a * (e < i ? 6 : 0), s /= 6 * a;
					break;
				case e:
					s = i - t + 2 * a, s /= 6 * a;
					break;
				case i:
					s = t - e + 4 * a, s /= 6 * a
			}
			return [s, o, h]
		}

		function lt(t, e) {
			var i = h(255 * t[0], 255 * t[1], 255 * t[2]);
			return i[1] += e, 1 < i[1] ? i[1] = 1 : i[1] <= 0 && (i[1] = 0), o(i[0], i[1], i[2])
		}

		function pt(t, e) {
			var i = h(255 * t[0], 255 * t[1], 255 * t[2]);
			return i[2] += e, 1 < i[2] ? i[2] = 1 : i[2] < 0 && (i[2] = 0), o(i[0], i[1], i[2])
		}

		function ft(t, e) {
			var i = h(255 * t[0], 255 * t[1], 255 * t[2]);
			return i[0] += e / 360, 1 < i[0] ? i[0] -= 1 : i[0] < 0 && (i[0] += 1), o(i[0], i[1], i[2])
		}

		function t() {}

		function w(t) {
			return Array.apply(null, {
				length: t
			})
		}

		function k(t) {
			return document.createElementNS(gt, t)
		}

		function _(t) {
			return document.createElement(t)
		}

		function u() {}

		function c(t, e) {
			var i, s, r = t.length;
			for (i = 0; i < r; i += 1)
				for (var n in s = t[i].prototype) s.hasOwnProperty(n) && (e.prototype[n] = s[n])
		}

		function l() {
			this.c = !1, this._length = 0, this._maxLength = 8, this.v = w(this._maxLength), this.o = w(this._maxLength), this.i = w(this._maxLength)
		}

		function p() {}

		function f() {}

		function d() {}

		function m() {}

		function y() {
			this._length = 0, this._maxLength = 4, this.shapes = w(this._maxLength)
		}

		function v(t, e, i, s) {
			this.elem = t, this.frameId = -1, this.dataProps = w(e.length), this.renderer = i, this.k = !1, this.dashStr = "", this.dashArray = Ct("float32", e.length ? e.length - 1 : 0), this.dashoffset = Ct("float32", 1), this.initDynamicPropertyContainer(s);
			var r, n, a = e.length || 0;
			for (r = 0; r < a; r += 1) n = Ot.getProp(t, e[r].v, 0, 0, this), this.k = n.k || this.k, this.dataProps[r] = {
				n: e[r].n,
				p: n
			};
			this.k || this.getValue(!0), this._isAnimated = this.k
		}

		function b(t, e, i) {
			this.data = e, this.c = Ct("uint8c", 4 * e.p);
			var s = e.k.k[0].s ? e.k.k[0].s.length - 4 * e.p : e.k.k.length - 4 * e.p;
			this.o = Ct("float32", s), this._cmdf = !1, this._omdf = !1, this._collapsable = this.checkCollapsable(), this._hasOpacity = s, this.initDynamicPropertyContainer(i), this.prop = Ot.getProp(t, e.k, 1, null, this), this.k = this.prop.k, this.getValue(!0)
		}

		function x(t, e, i) {
			this._isFirstFrame = !0, this._hasMaskedPath = !1, this._frameId = -1, this._textData = t, this._renderType = e, this._elem = i, this._animatorsData = w(this._textData.a.length), this._pathData = {}, this._moreOptions = {
				alignment: {}
			}, this.renderedLetters = [], this.lettersChangedFlag = !1, this.initDynamicPropertyContainer(i)
		}

		function P(t, e, i) {
			var s = {
					propType: !1
				},
				r = Ot.getProp,
				n = e.a;
			this.a = {
				r: n.r ? r(t, n.r, 0, At, i) : s,
				rx: n.rx ? r(t, n.rx, 0, At, i) : s,
				ry: n.ry ? r(t, n.ry, 0, At, i) : s,
				sk: n.sk ? r(t, n.sk, 0, At, i) : s,
				sa: n.sa ? r(t, n.sa, 0, At, i) : s,
				s: n.s ? r(t, n.s, 1, .01, i) : s,
				a: n.a ? r(t, n.a, 1, 0, i) : s,
				o: n.o ? r(t, n.o, 0, .01, i) : s,
				p: n.p ? r(t, n.p, 1, 0, i) : s,
				sw: n.sw ? r(t, n.sw, 0, 0, i) : s,
				sc: n.sc ? r(t, n.sc, 1, 0, i) : s,
				fc: n.fc ? r(t, n.fc, 1, 0, i) : s,
				fh: n.fh ? r(t, n.fh, 0, 0, i) : s,
				fs: n.fs ? r(t, n.fs, 0, .01, i) : s,
				fb: n.fb ? r(t, n.fb, 0, .01, i) : s,
				t: n.t ? r(t, n.t, 0, 0, i) : s
			}, this.s = Kt.getTextSelectorProp(t, e.s, i), this.s.t = e.s.t
		}

		function ut(t, e, i, s, r, n) {
			this.o = t, this.sw = e, this.sc = i, this.fc = s, this.m = r, this.p = n, this._mdf = {
				o: !0,
				sw: !!e,
				sc: !!i,
				fc: !!s,
				m: !0,
				p: !0
			}
		}

		function A(t, e) {
			this._frameId = yt, this.pv = "", this.v = "", this.kf = !1, this._isFirstFrame = !0, this._mdf = !1, this.data = e, this.elem = t, this.comp = this.elem.comp, this.keysIndex = 0, this.canResize = !1, this.minimumFontSize = 1, this.effectsSequence = [], this.currentData = {
				ascent: 0,
				boxWidth: this.defaultBoxWidth,
				f: "",
				fStyle: "",
				fWeight: "",
				fc: "",
				j: "",
				justifyOffset: "",
				l: [],
				lh: 0,
				lineWidths: [],
				ls: "",
				of: "",
				s: "",
				sc: "",
				sw: 0,
				t: 0,
				tr: 0,
				sz: 0,
				ps: null,
				fillColorAnim: !1,
				strokeColorAnim: !1,
				strokeWidthAnim: !1,
				yOffset: 0,
				finalSize: 0,
				finalText: [],
				finalLineHeight: 0,
				__complete: !1
			}, this.copyData(this.currentData, this.data.d.k[0].s), this.searchProperty() || this.completeTextData(this.currentData)
		}

		function S() {}

		function D(t, e) {
			this.animationItem = t, this.layers = null, this.renderedFrame = -1, this.svgElement = k("svg");
			var i = k("defs");
			this.svgElement.appendChild(i);
			var s = k("g");
			this.svgElement.appendChild(s), this.layerElement = s, this.renderConfig = {
				preserveAspectRatio: e && e.preserveAspectRatio || "xMidYMid meet",
				imagePreserveAspectRatio: e && e.imagePreserveAspectRatio || "xMidYMid slice",
				progressiveLoad: e && e.progressiveLoad || !1,
				hideOnTransparent: !e || !1 !== e.hideOnTransparent,
				viewBoxOnly: e && e.viewBoxOnly || !1,
				viewBoxSize: e && e.viewBoxSize || !1,
				className: e && e.className || ""
			}, this.globalData = {
				_mdf: !1,
				frameNum: -1,
				defs: i,
				renderConfig: this.renderConfig
			}, this.elements = [], this.pendingElements = [], this.destroyed = !1, this.rendererType = "svg"
		}

		function C(t, e, i) {
			this.data = t, this.element = e, this.globalData = i, this.storedData = [], this.masksProperties = this.data.masksProperties || [], this.maskElement = null;
			var s, r = this.globalData.defs,
				n = this.masksProperties ? this.masksProperties.length : 0;
			this.viewData = w(n), this.solidPath = "";
			var a, o, h, l, p, f, u, c = this.masksProperties,
				d = 0,
				m = [],
				g = T(10),
				_ = "clipPath",
				y = "clip-path";
			for (s = 0; s < n; s++)
				if (("a" !== c[s].mode && "n" !== c[s].mode || c[s].inv || 100 !== c[s].o.k) && (y = _ = "mask"), "s" != c[s].mode && "i" != c[s].mode || 0 !== d ? l = null : ((l = k("rect")).setAttribute("fill", "#ffffff"), l.setAttribute("width", this.element.comp.data.w || 0), l.setAttribute("height", this.element.comp.data.h || 0), m.push(l)), a = k("path"), "n" != c[s].mode) {
					var v;
					if (d += 1, a.setAttribute("fill", "s" === c[s].mode ? "#000000" : "#ffffff"), a.setAttribute("clip-rule", "nonzero"), 0 !== c[s].x.k ? (y = _ = "mask", u = Ot.getProp(this.element, c[s].x, 0, null, this.element), v = "fi_" + T(10), (p = k("filter")).setAttribute("id", v), (f = k("feMorphology")).setAttribute("operator", "dilate"), f.setAttribute("in", "SourceGraphic"), f.setAttribute("radius", "0"), p.appendChild(f), r.appendChild(p), a.setAttribute("stroke", "s" === c[s].mode ? "#000000" : "#ffffff")) : u = f = null, this.storedData[s] = {
							elem: a,
							x: u,
							expan: f,
							lastPath: "",
							lastOperator: "",
							filterId: v,
							lastRadius: 0
						}, "i" == c[s].mode) {
						h = m.length;
						var b = k("g");
						for (o = 0; o < h; o += 1) b.appendChild(m[o]);
						var x = k("mask");
						x.setAttribute("mask-type", "alpha"), x.setAttribute("id", g + "_" + d), x.appendChild(a), r.appendChild(x), b.setAttribute("mask", "url(" + _t + "#" + g + "_" + d + ")"), m.length = 0, m.push(b)
					} else m.push(a);
					c[s].inv && !this.solidPath && (this.solidPath = this.createLayerSolidPath()), this.viewData[s] = {
						elem: a,
						lastPath: "",
						op: Ot.getProp(this.element, c[s].o, 0, .01, this.element),
						prop: Vt.getShapeProp(this.element, c[s], 3),
						invRect: l
					}, this.viewData[s].prop.k || this.drawPath(c[s], this.viewData[s].prop.v, this.viewData[s])
				} else this.viewData[s] = {
					op: Ot.getProp(this.element, c[s].o, 0, .01, this.element),
					prop: Vt.getShapeProp(this.element, c[s], 3),
					elem: a,
					lastPath: ""
				}, r.appendChild(a);
			for (this.maskElement = k(_), n = m.length, s = 0; s < n; s += 1) this.maskElement.appendChild(m[s]);
			0 < d && (this.maskElement.setAttribute("id", g), this.element.maskedElement.setAttribute(y, "url(" + _t + "#" + g + ")"), r.appendChild(this.maskElement)), this.viewData.length && this.element.addRenderableComponent(this)
		}

		function M() {}

		function F() {}

		function E() {}

		function I() {}

		function R() {}

		function O(t, e) {
			this.elem = t, this.pos = e
		}

		function L(t, e) {
			this.data = t, this.type = t.ty, this.d = "", this.lvl = e, this._mdf = !1, this.closed = !0 === t.hd, this.pElem = k("path"), this.msElem = null
		}

		function z(t, e, i) {
			this.caches = [], this.styles = [], this.transformers = t, this.lStr = "", this.sh = i, this.lvl = e, this._isAnimated = !!i.k;
			for (var s = 0, r = t.length; s < r;) {
				if (t[s].mProps.dynamicProperties.length) {
					this._isAnimated = !0;
					break
				}
				s += 1
			}
		}

		function N(t, e, i) {
			this.transform = {
				mProps: t,
				op: e,
				container: i
			}, this.elements = [], this._isAnimated = this.transform.mProps.dynamicProperties.length || this.transform.op.effectsSequence.length
		}

		function V(t, e, i) {
			this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.o = Ot.getProp(t, e.o, 0, .01, this), this.w = Ot.getProp(t, e.w, 0, null, this), this.d = new v(t, e.d || {}, "svg", this), this.c = Ot.getProp(t, e.c, 1, 255, this), this.style = i, this._isAnimated = !!this._isAnimated
		}

		function B(t, e, i) {
			this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.o = Ot.getProp(t, e.o, 0, .01, this), this.c = Ot.getProp(t, e.c, 1, 255, this), this.style = i
		}

		function j(t, e, i) {
			this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.initGradientData(t, e, i)
		}

		function X(t, e, i) {
			this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.w = Ot.getProp(t, e.w, 0, null, this), this.d = new v(t, e.d || {}, "svg", this), this.initGradientData(t, e, i), this._isAnimated = !!this._isAnimated
		}

		function Y() {
			this.it = [], this.prevViewData = [], this.gr = k("g")
		}

		function q() {}

		function G(t, e, i) {
			this.initFrame(), this.initBaseData(t, e, i), this.initFrame(), this.initTransform(t, e, i), this.initHierarchy()
		}

		function W() {}

		function U() {}

		function H() {}

		function Z() {}

		function $(t, e, i) {
			this.assetData = e.getAssetData(t.refId), this.initElement(t, e, i)
		}

		function Q(t, e, i) {
			this.initElement(t, e, i)
		}

		function K(t, e, i) {
			this.layers = t.layers, this.supports3d = !0, this.completeLayers = !1, this.pendingElements = [], this.elements = this.layers ? w(this.layers.length) : [], this.initElement(t, e, i), this.tm = t.tm ? Ot.getProp(this, t.tm, 0, e.frameRate, this) : {
				_placeholder: !0
			}
		}

		function J(t, e, i) {
			this.textSpans = [], this.renderType = "svg", this.initElement(t, e, i)
		}

		function tt(t, e, i) {
			this.shapes = [], this.shapesData = t.shapes, this.stylesList = [], this.shapeModifiers = [], this.itemsData = [], this.processedElements = [], this.animatedContents = [], this.initElement(t, e, i), this.prevViewData = []
		}

		function et(t, e) {
			this.filterManager = e;
			var i = k("feColorMatrix");
			if (i.setAttribute("type", "matrix"), i.setAttribute("color-interpolation-filters", "linearRGB"), i.setAttribute("values", "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"), i.setAttribute("result", "f1"), t.appendChild(i), (i = k("feColorMatrix")).setAttribute("type", "matrix"), i.setAttribute("color-interpolation-filters", "sRGB"), i.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"), i.setAttribute("result", "f2"), t.appendChild(i), this.matrixFilter = i, 100 !== e.effectElements[2].p.v || e.effectElements[2].p.k) {
				var s, r = k("feMerge");
				t.appendChild(r), (s = k("feMergeNode")).setAttribute("in", "SourceGraphic"), r.appendChild(s), (s = k("feMergeNode")).setAttribute("in", "f2"), r.appendChild(s)
			}
		}

		function it(t, e) {
			this.filterManager = e;
			var i = k("feColorMatrix");
			i.setAttribute("type", "matrix"), i.setAttribute("color-interpolation-filters", "sRGB"), i.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"), t.appendChild(i), this.matrixFilter = i
		}

		function st(t, e) {
			this.initialized = !1, this.filterManager = e, this.elem = t, this.paths = []
		}

		function rt(t, e) {
			this.filterManager = e;
			var i = k("feColorMatrix");
			i.setAttribute("type", "matrix"), i.setAttribute("color-interpolation-filters", "linearRGB"), i.setAttribute("values", "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"), i.setAttribute("result", "f1"), t.appendChild(i);
			var s = k("feComponentTransfer");
			s.setAttribute("color-interpolation-filters", "sRGB"), t.appendChild(s), this.matrixFilter = s;
			var r = k("feFuncR");
			r.setAttribute("type", "table"), s.appendChild(r), this.feFuncR = r;
			var n = k("feFuncG");
			n.setAttribute("type", "table"), s.appendChild(n), this.feFuncG = n;
			var a = k("feFuncB");
			a.setAttribute("type", "table"), s.appendChild(a), this.feFuncB = a
		}

		function nt(t, e) {
			this.filterManager = e;
			var i = this.filterManager.effectElements,
				s = k("feComponentTransfer");
			(i[10].p.k || 0 !== i[10].p.v || i[11].p.k || 1 !== i[11].p.v || i[12].p.k || 1 !== i[12].p.v || i[13].p.k || 0 !== i[13].p.v || i[14].p.k || 1 !== i[14].p.v) && (this.feFuncR = this.createFeFunc("feFuncR", s)), (i[17].p.k || 0 !== i[17].p.v || i[18].p.k || 1 !== i[18].p.v || i[19].p.k || 1 !== i[19].p.v || i[20].p.k || 0 !== i[20].p.v || i[21].p.k || 1 !== i[21].p.v) && (this.feFuncG = this.createFeFunc("feFuncG", s)), (i[24].p.k || 0 !== i[24].p.v || i[25].p.k || 1 !== i[25].p.v || i[26].p.k || 1 !== i[26].p.v || i[27].p.k || 0 !== i[27].p.v || i[28].p.k || 1 !== i[28].p.v) && (this.feFuncB = this.createFeFunc("feFuncB", s)), (i[31].p.k || 0 !== i[31].p.v || i[32].p.k || 1 !== i[32].p.v || i[33].p.k || 1 !== i[33].p.v || i[34].p.k || 0 !== i[34].p.v || i[35].p.k || 1 !== i[35].p.v) && (this.feFuncA = this.createFeFunc("feFuncA", s)), (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) && (s.setAttribute("color-interpolation-filters", "sRGB"), t.appendChild(s), s = k("feComponentTransfer")), (i[3].p.k || 0 !== i[3].p.v || i[4].p.k || 1 !== i[4].p.v || i[5].p.k || 1 !== i[5].p.v || i[6].p.k || 0 !== i[6].p.v || i[7].p.k || 1 !== i[7].p.v) && (s.setAttribute("color-interpolation-filters", "sRGB"), t.appendChild(s), this.feFuncRComposed = this.createFeFunc("feFuncR", s), this.feFuncGComposed = this.createFeFunc("feFuncG", s), this.feFuncBComposed = this.createFeFunc("feFuncB", s))
		}

		function at(t, e) {
			t.setAttribute("x", "-100%"), t.setAttribute("y", "-100%"), t.setAttribute("width", "400%"), t.setAttribute("height", "400%"), this.filterManager = e;
			var i = k("feGaussianBlur");
			i.setAttribute("in", "SourceAlpha"), i.setAttribute("result", "drop_shadow_1"), i.setAttribute("stdDeviation", "0"), this.feGaussianBlur = i, t.appendChild(i);
			var s = k("feOffset");
			s.setAttribute("dx", "25"), s.setAttribute("dy", "0"), s.setAttribute("in", "drop_shadow_1"), s.setAttribute("result", "drop_shadow_2"), this.feOffset = s, t.appendChild(s);
			var r = k("feFlood");
			r.setAttribute("flood-color", "#00ff00"), r.setAttribute("flood-opacity", "1"), r.setAttribute("result", "drop_shadow_3"), this.feFlood = r, t.appendChild(r);
			var n = k("feComposite");
			n.setAttribute("in", "drop_shadow_3"), n.setAttribute("in2", "drop_shadow_2"), n.setAttribute("operator", "in"), n.setAttribute("result", "drop_shadow_4"), t.appendChild(n);
			var a, o = k("feMerge");
			t.appendChild(o), a = k("feMergeNode"), o.appendChild(a), (a = k("feMergeNode")).setAttribute("in", "SourceGraphic"), this.feMergeNode = a, this.feMerge = o, this.originalNodeAdded = !1, o.appendChild(a)
		}

		function ot(t, e, i) {
			this.initialized = !1, this.filterManager = e, this.filterElem = t, (this.elem = i).matteElement = k("g"), i.matteElement.appendChild(i.layerElement), i.matteElement.appendChild(i.transformedElement), i.baseElement = i.matteElement
		}

		function ht(t) {
			var e, i, s = t.data.ef ? t.data.ef.length : 0,
				r = T(10),
				n = Gt.createFilter(r),
				a = 0;
			for (this.filters = [], e = 0; e < s; e += 1) i = null, 20 === t.data.ef[e].ty ? (a += 1, i = new et(n, t.effectsManager.effectElements[e])) : 21 === t.data.ef[e].ty ? (a += 1, i = new it(n, t.effectsManager.effectElements[e])) : 22 === t.data.ef[e].ty ? i = new st(t, t.effectsManager.effectElements[e]) : 23 === t.data.ef[e].ty ? (a += 1, i = new rt(n, t.effectsManager.effectElements[e])) : 24 === t.data.ef[e].ty ? (a += 1, i = new nt(n, t.effectsManager.effectElements[e])) : 25 === t.data.ef[e].ty ? (a += 1, i = new at(n, t.effectsManager.effectElements[e])) : 28 === t.data.ef[e].ty && (i = new ot(n, t.effectsManager.effectElements[e], t)), i && this.filters.push(i);
			a && (t.globalData.defs.appendChild(n), t.layerElement.setAttribute("filter", "url(" + _t + "#" + r + ")")), this.filters.length && t.addRenderableComponent(this)
		}

		function ct() {}

		function dt() {
			!0 === ue ? le.searchAnimations(ce, ue, de) : le.searchAnimations()
		}
		var mt, gt = "http://www.w3.org/2000/svg",
			_t = "",
			yt = -999999,
			vt = !0,
			bt = (/^((?!chrome|android).)*safari/i.test(navigator.userAgent), Math.round, Math.pow),
			xt = Math.sqrt,
			Tt = (Math.abs, Math.floor),
			wt = (Math.max, Math.min),
			kt = {};
		! function () {
			var t, e = Object.getOwnPropertyNames(Math),
				i = e.length;
			for (t = 0; t < i; t += 1) kt[e[t]] = Math[e[t]]
		}(), kt.random = Math.random, kt.abs = function (t) {
			if ("object" === typeof t && t.length) {
				var e, i = w(t.length),
					s = t.length;
				for (e = 0; e < s; e += 1) i[e] = Math.abs(t[e]);
				return i
			}
			return Math.abs(t)
		};
		var Pt = 150,
			At = Math.PI / 180,
			St = .5519;
		e(!1);
		var Dt = function () {
			var t, e, s = [];
			for (t = 0; t < 256; t += 1) e = t.toString(16), s[t] = 1 == e.length ? "0" + e : e;
			return function (t, e, i) {
				return t < 0 && (t = 0), e < 0 && (e = 0), i < 0 && (i = 0), "#" + s[t] + s[e] + s[i]
			}
		}();
		t.prototype = {
			triggerEvent: function (t, e) {
				if (this._cbs[t])
					for (var i = this._cbs[t].length, s = 0; s < i; s++) this._cbs[t][s](e)
			},
			addEventListener: function (t, e) {
				return this._cbs[t] || (this._cbs[t] = []), this._cbs[t].push(e),
					function () {
						this.removeEventListener(t, e)
					}.bind(this)
			},
			removeEventListener: function (t, e) {
				if (e) {
					if (this._cbs[t]) {
						for (var i = 0, s = this._cbs[t].length; i < s;) this._cbs[t][i] === e && (this._cbs[t].splice(i, 1), i -= 1, s -= 1), i += 1;
						this._cbs[t].length || (this._cbs[t] = null)
					}
				} else this._cbs[t] = null
			}
		};
		var Ct = "function" == typeof Uint8ClampedArray && "function" == typeof Float32Array ? function (t, e) {
			return "float32" === t ? new Float32Array(e) : "int16" === t ? new Int16Array(e) : "uint8c" === t ? new Uint8ClampedArray(e) : void 0
		} : function (t, e) {
			var i, s = 0,
				r = [];
			switch (t) {
				case "int16":
				case "uint8c":
					i = 1;
					break;
				default:
					i = 1.1
			}
			for (s = 0; s < e; s += 1) r.push(i);
			return r
		};
		u.prototype = {
			addDynamicProperty: function (t) {
				-1 === this.dynamicProperties.indexOf(t) && (this.dynamicProperties.push(t), this.container.addDynamicProperty(this), this._isAnimated = !0)
			},
			iterateDynamicProperties: function () {
				this._mdf = !1;
				var t, e = this.dynamicProperties.length;
				for (t = 0; t < e; t += 1) this.dynamicProperties[t].getValue(), this.dynamicProperties[t]._mdf && (this._mdf = !0)
			},
			initDynamicPropertyContainer: function (t) {
				this.container = t, this.dynamicProperties = [], this._mdf = !1, this._isAnimated = !1
			}
		};
		var Mt = function () {
			function t() {
				return this.props[0] = 1, this.props[1] = 0, this.props[2] = 0, this.props[3] = 0, this.props[4] = 0, this.props[5] = 1, this.props[6] = 0, this.props[7] = 0, this.props[8] = 0, this.props[9] = 0, this.props[10] = 1, this.props[11] = 0, this.props[12] = 0, this.props[13] = 0, this.props[14] = 0, this.props[15] = 1, this
			}

			function e(t) {
				if (0 === t) return this;
				var e = D(t),
					i = C(t);
				return this._t(e, -i, 0, 0, i, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
			}

			function i(t) {
				if (0 === t) return this;
				var e = D(t),
					i = C(t);
				return this._t(1, 0, 0, 0, 0, e, -i, 0, 0, i, e, 0, 0, 0, 0, 1)
			}

			function s(t) {
				if (0 === t) return this;
				var e = D(t),
					i = C(t);
				return this._t(e, 0, i, 0, 0, 1, 0, 0, -i, 0, e, 0, 0, 0, 0, 1)
			}

			function r(t) {
				if (0 === t) return this;
				var e = D(t),
					i = C(t);
				return this._t(e, -i, 0, 0, i, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
			}

			function n(t, e) {
				return this._t(1, e, t, 1, 0, 0)
			}

			function a(t, e) {
				return this.shear(M(t), M(e))
			}

			function o(t, e) {
				var i = D(e),
					s = C(e);
				return this._t(i, s, 0, 0, -s, i, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, M(t), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(i, -s, 0, 0, s, i, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
			}

			function h(t, e, i) {
				return i || 0 === i || (i = 1), 1 === t && 1 === e && 1 === i ? this : this._t(t, 0, 0, 0, 0, e, 0, 0, 0, 0, i, 0, 0, 0, 0, 1)
			}

			function l(t, e, i, s, r, n, a, o, h, l, p, f, u, c, d, m) {
				return this.props[0] = t, this.props[1] = e, this.props[2] = i, this.props[3] = s, this.props[4] = r, this.props[5] = n, this.props[6] = a, this.props[7] = o, this.props[8] = h, this.props[9] = l, this.props[10] = p, this.props[11] = f, this.props[12] = u, this.props[13] = c, this.props[14] = d, this.props[15] = m, this
			}

			function p(t, e, i) {
				return i = i || 0, 0 !== t || 0 !== e || 0 !== i ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, i, 1) : this
			}

			function f(t, e, i, s, r, n, a, o, h, l, p, f, u, c, d, m) {
				var g = this.props;
				if (1 === t && 0 === e && 0 === i && 0 === s && 0 === r && 1 === n && 0 === a && 0 === o && 0 === h && 0 === l && 1 === p && 0 === f) return g[12] = g[12] * t + g[15] * u, g[13] = g[13] * n + g[15] * c, g[14] = g[14] * p + g[15] * d, g[15] = g[15] * m, this._identityCalculated = !1, this;
				var _ = g[0],
					y = g[1],
					v = g[2],
					b = g[3],
					x = g[4],
					T = g[5],
					w = g[6],
					k = g[7],
					P = g[8],
					A = g[9],
					S = g[10],
					D = g[11],
					C = g[12],
					M = g[13],
					F = g[14],
					E = g[15];
				return g[0] = _ * t + y * r + v * h + b * u, g[1] = _ * e + y * n + v * l + b * c, g[2] = _ * i + y * a + v * p + b * d, g[3] = _ * s + y * o + v * f + b * m, g[4] = x * t + T * r + w * h + k * u, g[5] = x * e + T * n + w * l + k * c, g[6] = x * i + T * a + w * p + k * d, g[7] = x * s + T * o + w * f + k * m, g[8] = P * t + A * r + S * h + D * u, g[9] = P * e + A * n + S * l + D * c, g[10] = P * i + A * a + S * p + D * d, g[11] = P * s + A * o + S * f + D * m, g[12] = C * t + M * r + F * h + E * u, g[13] = C * e + M * n + F * l + E * c, g[14] = C * i + M * a + F * p + E * d, g[15] = C * s + M * o + F * f + E * m, this._identityCalculated = !1, this
			}

			function u() {
				return this._identityCalculated || (this._identity = !(1 !== this.props[0] || 0 !== this.props[1] || 0 !== this.props[2] || 0 !== this.props[3] || 0 !== this.props[4] || 1 !== this.props[5] || 0 !== this.props[6] || 0 !== this.props[7] || 0 !== this.props[8] || 0 !== this.props[9] || 1 !== this.props[10] || 0 !== this.props[11] || 0 !== this.props[12] || 0 !== this.props[13] || 0 !== this.props[14] || 1 !== this.props[15]), this._identityCalculated = !0), this._identity
			}

			function c(t) {
				for (var e = 0; e < 16;) {
					if (t.props[e] !== this.props[e]) return !1;
					e += 1
				}
				return !0
			}

			function d(t) {
				var e;
				for (e = 0; e < 16; e += 1) t.props[e] = this.props[e]
			}

			function m(t) {
				var e;
				for (e = 0; e < 16; e += 1) this.props[e] = t[e]
			}

			function g(t, e, i) {
				return {
					x: t * this.props[0] + e * this.props[4] + i * this.props[8] + this.props[12],
					y: t * this.props[1] + e * this.props[5] + i * this.props[9] + this.props[13],
					z: t * this.props[2] + e * this.props[6] + i * this.props[10] + this.props[14]
				}
			}

			function _(t, e, i) {
				return t * this.props[0] + e * this.props[4] + i * this.props[8] + this.props[12]
			}

			function y(t, e, i) {
				return t * this.props[1] + e * this.props[5] + i * this.props[9] + this.props[13]
			}

			function v(t, e, i) {
				return t * this.props[2] + e * this.props[6] + i * this.props[10] + this.props[14]
			}

			function b(t) {
				var e = this.props[0] * this.props[5] - this.props[1] * this.props[4],
					i = this.props[5] / e,
					s = -this.props[1] / e,
					r = -this.props[4] / e,
					n = this.props[0] / e,
					a = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / e,
					o = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / e;
				return [t[0] * i + t[1] * r + a, t[0] * s + t[1] * n + o, 0]
			}

			function x(t) {
				var e, i = t.length,
					s = [];
				for (e = 0; e < i; e += 1) s[e] = b(t[e]);
				return s
			}

			function T(t, e, i) {
				var s = Ct("float32", 6);
				if (this.isIdentity()) s[0] = t[0], s[1] = t[1], s[2] = e[0], s[3] = e[1], s[4] = i[0], s[5] = i[1];
				else {
					var r = this.props[0],
						n = this.props[1],
						a = this.props[4],
						o = this.props[5],
						h = this.props[12],
						l = this.props[13];
					s[0] = t[0] * r + t[1] * a + h, s[1] = t[0] * n + t[1] * o + l, s[2] = e[0] * r + e[1] * a + h, s[3] = e[0] * n + e[1] * o + l, s[4] = i[0] * r + i[1] * a + h, s[5] = i[0] * n + i[1] * o + l
				}
				return s
			}

			function w(t, e, i) {
				return this.isIdentity() ? [t, e, i] : [t * this.props[0] + e * this.props[4] + i * this.props[8] + this.props[12], t * this.props[1] + e * this.props[5] + i * this.props[9] + this.props[13], t * this.props[2] + e * this.props[6] + i * this.props[10] + this.props[14]]
			}

			function k(t, e) {
				if (this.isIdentity()) return t + "," + e;
				var i = this.props;
				return Math.round(100 * (t * i[0] + e * i[4] + i[12])) / 100 + "," + Math.round(100 * (t * i[1] + e * i[5] + i[13])) / 100
			}

			function P() {
				for (var t = 0, e = this.props, i = "matrix3d("; t < 16;) i += F(1e4 * e[t]) / 1e4, i += 15 === t ? ")" : ",", t += 1;
				return i
			}

			function A(t) {
				return t < 1e-6 && 0 < t || -1e-6 < t && t < 0 ? F(1e4 * t) / 1e4 : t
			}

			function S() {
				var t = this.props;
				return "matrix(" + A(t[0]) + "," + A(t[1]) + "," + A(t[4]) + "," + A(t[5]) + "," + A(t[12]) + "," + A(t[13]) + ")"
			}
			var D = Math.cos,
				C = Math.sin,
				M = Math.tan,
				F = Math.round;
			return function () {
				this.reset = t, this.rotate = e, this.rotateX = i, this.rotateY = s, this.rotateZ = r, this.skew = a, this.skewFromAxis = o, this.shear = n, this.scale = h, this.setTransform = l, this.translate = p, this.transform = f, this.applyToPoint = g, this.applyToX = _, this.applyToY = y, this.applyToZ = v, this.applyToPointArray = w, this.applyToTriplePoints = T, this.applyToPointStringified = k, this.toCSS = P, this.to2dCSS = S, this.clone = d, this.cloneFromProps = m, this.equals = c, this.inversePoints = x, this.inversePoint = b, this._t = this.transform, this.isIdentity = u, this._identity = !0, this._identityCalculated = !1, this.props = Ct("float32", 16), this.reset()
			}
		}();
		! function (o, h) {
			function l(t) {
				var e, i = t.length,
					a = this,
					s = 0,
					r = a.i = a.j = 0,
					n = a.S = [];
				for (i || (t = [i++]); s < m;) n[s] = s++;
				for (s = 0; s < m; s++) n[s] = n[r = x & r + t[s % i] + (e = n[s])], n[r] = e;
				a.g = function (t) {
					for (var e, i = 0, s = a.i, r = a.j, n = a.S; t--;) e = n[s = x & s + 1], i = i * m + n[x & (n[s] = n[r = x & r + e]) + (n[r] = e)];
					return a.i = s, a.j = r, i
				}
			}

			function p(t, e) {
				return e.i = t.i, e.j = t.j, e.S = t.S.slice(), e
			}

			function f(t, e) {
				for (var i, s = t + "", r = 0; r < s.length;) e[x & r] = x & (i ^= 19 * e[x & r]) + s.charCodeAt(r++);
				return u(e)
			}

			function u(t) {
				return String.fromCharCode.apply(0, t)
			}
			var c, d = this,
				m = 256,
				g = 6,
				_ = "random",
				y = h.pow(m, g),
				v = h.pow(2, 52),
				b = 2 * v,
				x = m - 1;
			h["seed" + _] = function (t, e, i) {
				var s = [],
					r = f(function t(e, i) {
						var s, r = [],
							n = typeof e;
						if (i && "object" == n)
							for (s in e) try {
								r.push(t(e[s], i - 1))
							} catch (t) {}
						return r.length ? r : "string" == n ? e : e + "\0"
					}((e = !0 === e ? {
						entropy: !0
					} : e || {}).entropy ? [t, u(o)] : null === t ? function () {
						try {
							if (c) return u(c.randomBytes(m));
							var t = new Uint8Array(m);
							return (d.crypto || d.msCrypto).getRandomValues(t), u(t)
						} catch (t) {
							var e = d.navigator,
								i = e && e.plugins;
							return [+new Date, d, i, d.screen, u(o)]
						}
					}() : t, 3), s),
					n = new l(s),
					a = function () {
						for (var t = n.g(g), e = y, i = 0; t < v;) t = (t + i) * m, e *= m, i = n.g(1);
						for (; b <= t;) t /= 2, e /= 2, i >>>= 1;
						return (t + i) / e
					};
				return a.int32 = function () {
					return 0 | n.g(4)
				}, a.quick = function () {
					return n.g(4) / 4294967296
				}, a.double = a, f(u(n.S), o), (e.pass || i || function (t, e, i, s) {
					return s && (s.S && p(s, n), t.state = function () {
						return p(n, {})
					}), i ? (h[_] = t, e) : t
				})(a, r, "global" in e ? e.global : this == h, e.state)
			}, f(h.random(), o)
		}([], kt);
		var Ft = function () {
			function s(t, e) {
				return 1 - 3 * e + 3 * t
			}

			function r(t, e) {
				return 3 * e - 6 * t
			}

			function n(t) {
				return 3 * t
			}

			function l(t, e, i) {
				return ((s(e, i) * t + r(e, i)) * t + n(e)) * t
			}

			function p(t, e, i) {
				return 3 * s(e, i) * t * t + 2 * r(e, i) * t + n(e)
			}

			function o(t) {
				this._p = t, this._mSampleValues = e ? new Float32Array(f) : new Array(f), this._precomputed = !1, this.get = this.get.bind(this)
			}
			var t = {
					getBezierEasing: function (t, e, i, s, r) {
						var n = r || ("bez_" + t + "_" + e + "_" + i + "_" + s).replace(/\./g, "p");
						if (h[n]) return h[n];
						var a = new o([t, e, i, s]);
						return h[n] = a
					}
				},
				h = {},
				f = 11,
				u = 1 / (f - 1),
				e = "function" == typeof Float32Array;
			return o.prototype = {
				get: function (t) {
					var e = this._p[0],
						i = this._p[1],
						s = this._p[2],
						r = this._p[3];
					return this._precomputed || this._precompute(), e === i && s === r ? t : 0 === t ? 0 : 1 === t ? 1 : l(this._getTForX(t), i, r)
				},
				_precompute: function () {
					var t = this._p[0],
						e = this._p[1],
						i = this._p[2],
						s = this._p[3];
					this._precomputed = !0, t === e && i === s || this._calcSampleValues()
				},
				_calcSampleValues: function () {
					for (var t = this._p[0], e = this._p[2], i = 0; i < f; ++i) this._mSampleValues[i] = l(i * u, t, e)
				},
				_getTForX: function (t) {
					for (var e = this._p[0], i = this._p[2], s = this._mSampleValues, r = 0, n = 1, a = f - 1; n !== a && s[n] <= t; ++n) r += u;
					var o = r + (t - s[--n]) / (s[n + 1] - s[n]) * u,
						h = p(o, e, i);
					return .001 <= h ? function (t, e, i, s) {
						for (var r = 0; r < 4; ++r) {
							var n = p(e, i, s);
							if (0 === n) return e;
							e -= (l(e, i, s) - t) / n
						}
						return e
					}(t, o, e, i) : 0 === h ? o : function (t, e, i, s, r) {
						for (var n, a, o = 0; 0 < (n = l(a = e + (i - e) / 2, s, r) - t) ? i = a : e = a, 1e-7 < Math.abs(n) && ++o < 10;);
						return a
					}(t, r, r + u, e, i)
				}
			}, t
		}();
		! function () {
			for (var n = 0, t = ["ms", "moz", "webkit", "o"], e = 0; e < t.length && !g.requestAnimationFrame; ++e) g.requestAnimationFrame = g[t[e] + "RequestAnimationFrame"], g.cancelAnimationFrame = g[t[e] + "CancelAnimationFrame"] || g[t[e] + "CancelRequestAnimationFrame"];
			g.requestAnimationFrame || (g.requestAnimationFrame = function (t, e) {
				var i = (new Date).getTime(),
					s = Math.max(0, 16 - (i - n)),
					r = setTimeout(function () {
						t(i + s)
					}, s);
				return n = i + s, r
			}), g.cancelAnimationFrame || (g.cancelAnimationFrame = function (t) {
				clearTimeout(t)
			})
		}();
		var Et = function () {
				function _(t, e, i, s, r, n) {
					var a = t * s + e * r + i * n - r * s - n * t - i * e;
					return -.001 < a && a < .001
				}

				function y(t) {
					this.segmentLength = 0, this.points = new Array(t)
				}

				function v(t, e) {
					this.partialLength = t, this.point = e
				}

				function C(t, e) {
					var i = e.percents,
						s = e.lengths,
						r = i.length,
						n = Tt((r - 1) * t),
						a = t * e.addedLength,
						o = 0;
					if (n === r - 1 || 0 === n || a === s[n]) return i[n];
					for (var h = s[n] > a ? -1 : 1, l = !0; l;)
						if (s[n] <= a && s[n + 1] > a ? (o = (a - s[n]) / (s[n + 1] - s[n]), l = !1) : n += h, n < 0 || r - 1 <= n) {
							if (n === r - 1) return i[n];
							l = !1
						}
					return i[n] + (i[n + 1] - i[n]) * o
				}
				var b, p = (Math, function (t, e, i, s) {
						var r, n, a, o, h, l, p = Pt,
							f = 0,
							u = [],
							c = [],
							d = ne.newElement();
						for (a = i.length, r = 0; r < p; r += 1) {
							for (h = r / (p - 1), n = l = 0; n < a; n += 1) o = bt(1 - h, 3) * t[n] + 3 * bt(1 - h, 2) * h * i[n] + 3 * (1 - h) * bt(h, 2) * s[n] + bt(h, 3) * e[n], u[n] = o, null !== c[n] && (l += bt(u[n] - c[n], 2)), c[n] = u[n];
							l && (f += l = xt(l)), d.percents[r] = h, d.lengths[r] = f
						}
						return d.addedLength = f, d
					}),
					t = (b = {}, function (t) {
						var e = t.s,
							i = t.e,
							s = t.to,
							r = t.ti,
							n = (e[0] + "_" + e[1] + "_" + i[0] + "_" + i[1] + "_" + s[0] + "_" + s[1] + "_" + r[0] + "_" + r[1]).replace(/\./g, "p");
						if (b[n]) t.bezierData = b[n];
						else {
							var a, o, h, l, p, f, u, c = Pt,
								d = 0,
								m = null;
							2 === e.length && (e[0] != i[0] || e[1] != i[1]) && _(e[0], e[1], i[0], i[1], e[0] + s[0], e[1] + s[1]) && _(e[0], e[1], i[0], i[1], i[0] + r[0], i[1] + r[1]) && (c = 2);
							var g = new y(c);
							for (h = s.length, a = 0; a < c; a += 1) {
								for (u = w(h), p = a / (c - 1), o = f = 0; o < h; o += 1) l = bt(1 - p, 3) * e[o] + 3 * bt(1 - p, 2) * p * (e[o] + s[o]) + 3 * (1 - p) * bt(p, 2) * (i[o] + r[o]) + bt(p, 3) * i[o], u[o] = l, null !== m && (f += bt(u[o] - m[o], 2));
								d += f = xt(f), g.points[a] = new v(f, u), m = u
							}
							g.segmentLength = d, t.bezierData = g, b[n] = g
						}
					}),
					M = Ct("float32", 8);
				return {
					getSegmentsLength: function (t) {
						var e, i = re.newElement(),
							s = t.c,
							r = t.v,
							n = t.o,
							a = t.i,
							o = t._length,
							h = i.lengths,
							l = 0;
						for (e = 0; e < o - 1; e += 1) h[e] = p(r[e], r[e + 1], n[e], a[e + 1]), l += h[e].addedLength;
						return s && o && (h[e] = p(r[e], r[0], n[e], a[0]), l += h[e].addedLength), i.totalLength = l, i
					},
					getNewSegment: function (t, e, i, s, r, n, a) {
						var o, h = C(r = r < 0 ? 0 : 1 < r ? 1 : r, a),
							l = C(n = 1 < n ? 1 : n, a),
							p = t.length,
							f = 1 - h,
							u = 1 - l,
							c = f * f * f,
							d = h * f * f * 3,
							m = h * h * f * 3,
							g = h * h * h,
							_ = f * f * u,
							y = h * f * u + f * h * u + f * f * l,
							v = h * h * u + f * h * l + h * f * l,
							b = h * h * l,
							x = f * u * u,
							T = h * u * u + f * l * u + f * u * l,
							w = h * l * u + f * l * l + h * u * l,
							k = h * l * l,
							P = u * u * u,
							A = l * u * u + u * l * u + u * u * l,
							S = l * l * u + u * l * l + l * u * l,
							D = l * l * l;
						for (o = 0; o < p; o += 1) M[4 * o] = Math.round(1e3 * (c * t[o] + d * i[o] + m * s[o] + g * e[o])) / 1e3, M[4 * o + 1] = Math.round(1e3 * (_ * t[o] + y * i[o] + v * s[o] + b * e[o])) / 1e3, M[4 * o + 2] = Math.round(1e3 * (x * t[o] + T * i[o] + w * s[o] + k * e[o])) / 1e3, M[4 * o + 3] = Math.round(1e3 * (P * t[o] + A * i[o] + S * s[o] + D * e[o])) / 1e3;
						return M
					},
					getPointInSegment: function (t, e, i, s, r, n) {
						var a = C(r, n),
							o = 1 - a;
						return [Math.round(1e3 * (o * o * o * t[0] + (a * o * o + o * a * o + o * o * a) * i[0] + (a * a * o + o * a * a + a * o * a) * s[0] + a * a * a * e[0])) / 1e3, Math.round(1e3 * (o * o * o * t[1] + (a * o * o + o * a * o + o * o * a) * i[1] + (a * a * o + o * a * a + a * o * a) * s[1] + a * a * a * e[1])) / 1e3]
					},
					buildBezierData: t,
					pointOnLine2D: _,
					pointOnLine3D: function (t, e, i, s, r, n, a, o, h) {
						if (0 === i && 0 === n && 0 === h) return _(t, e, s, r, a, o);
						var l, p = Math.sqrt(Math.pow(s - t, 2) + Math.pow(r - e, 2) + Math.pow(n - i, 2)),
							f = Math.sqrt(Math.pow(a - t, 2) + Math.pow(o - e, 2) + Math.pow(h - i, 2)),
							u = Math.sqrt(Math.pow(a - s, 2) + Math.pow(o - r, 2) + Math.pow(h - n, 2));
						return -1e-4 < (l = f < p ? u < p ? p - f - u : u - f - p : f < u ? u - f - p : f - p - u) && l < 1e-4
					}
				}
			}(),
			It = function () {
				function c(t, e) {
					for (var i = 0, s = e.length; i < s;) {
						if (e[i].id === t) return e[i].layers.__used ? JSON.parse(JSON.stringify(e[i].layers)) : (e[i].layers.__used = !0, e[i].layers);
						i += 1
					}
				}

				function d(t) {
					var e, i, s;
					for (e = t.length - 1; 0 <= e; e -= 1)
						if ("sh" == t[e].ty)
							if (t[e].ks.k.i) m(t[e].ks.k);
							else
								for (s = t[e].ks.k.length, i = 0; i < s; i += 1) t[e].ks.k[i].s && m(t[e].ks.k[i].s[0]), t[e].ks.k[i].e && m(t[e].ks.k[i].e[0]);
					else "gr" == t[e].ty && d(t[e].it)
				}

				function m(t) {
					var e, i = t.i.length;
					for (e = 0; e < i; e += 1) t.i[e][0] += t.v[e][0], t.i[e][1] += t.v[e][1], t.o[e][0] += t.v[e][0], t.o[e][1] += t.v[e][1]
				}

				function o(t, e) {
					var i = e ? e.split(".") : [100, 100, 100];
					return t[0] > i[0] || !(i[0] > t[0]) && (t[1] > i[1] || !(i[1] > t[1]) && (t[2] > i[2] || !(i[2] > t[2]) && void 0))
				}
				var h, i = function () {
						function s(t) {
							var e, i, s, r = t.length;
							for (e = 0; e < r; e += 1) 5 === t[e].ty && (i = t[e], s = i.t.d, i.t.d = {
								k: [{
									s: s,
									t: 0
								}]
							})
						}
						var r = [4, 4, 14];
						return function (t) {
							if (o(r, t.v) && (s(t.layers), t.assets)) {
								var e, i = t.assets.length;
								for (e = 0; e < i; e += 1) t.assets[e].layers && s(t.assets[e].layers)
							}
						}
					}(),
					s = (h = [4, 7, 99], function (t) {
						if (t.chars && !o(h, t.v)) {
							var e, i, s, r, n, a = t.chars.length;
							for (e = 0; e < a; e += 1)
								if (t.chars[e].data && t.chars[e].data.shapes)
									for (s = (n = t.chars[e].data.shapes[0].it).length, i = 0; i < s; i += 1)(r = n[i].ks.k).__converted || (m(n[i].ks.k), r.__converted = !0)
						}
					}),
					r = function () {
						function n(t) {
							var e, i, s, r = t.length;
							for (e = 0; e < r; e += 1)
								if ("gr" === t[e].ty) n(t[e].it);
								else if ("fl" === t[e].ty || "st" === t[e].ty)
								if (t[e].c.k && t[e].c.k[0].i)
									for (s = t[e].c.k.length, i = 0; i < s; i += 1) t[e].c.k[i].s && (t[e].c.k[i].s[0] /= 255, t[e].c.k[i].s[1] /= 255, t[e].c.k[i].s[2] /= 255, t[e].c.k[i].s[3] /= 255), t[e].c.k[i].e && (t[e].c.k[i].e[0] /= 255, t[e].c.k[i].e[1] /= 255, t[e].c.k[i].e[2] /= 255, t[e].c.k[i].e[3] /= 255);
								else t[e].c.k[0] /= 255, t[e].c.k[1] /= 255, t[e].c.k[2] /= 255, t[e].c.k[3] /= 255
						}

						function s(t) {
							var e, i = t.length;
							for (e = 0; e < i; e += 1) 4 === t[e].ty && n(t[e].shapes)
						}
						var r = [4, 1, 9];
						return function (t) {
							if (o(r, t.v) && (s(t.layers), t.assets)) {
								var e, i = t.assets.length;
								for (e = 0; e < i; e += 1) t.assets[e].layers && s(t.assets[e].layers)
							}
						}
					}(),
					n = function () {
						function l(t) {
							var e, i, s;
							for (e = t.length - 1; 0 <= e; e -= 1)
								if ("sh" == t[e].ty)
									if (t[e].ks.k.i) t[e].ks.k.c = t[e].closed;
									else
										for (s = t[e].ks.k.length, i = 0; i < s; i += 1) t[e].ks.k[i].s && (t[e].ks.k[i].s[0].c = t[e].closed), t[e].ks.k[i].e && (t[e].ks.k[i].e[0].c = t[e].closed);
							else "gr" == t[e].ty && l(t[e].it)
						}

						function s(t) {
							var e, i, s, r, n, a, o = t.length;
							for (i = 0; i < o; i += 1) {
								if ((e = t[i]).hasMask) {
									var h = e.masksProperties;
									for (r = h.length, s = 0; s < r; s += 1)
										if (h[s].pt.k.i) h[s].pt.k.c = h[s].cl;
										else
											for (a = h[s].pt.k.length, n = 0; n < a; n += 1) h[s].pt.k[n].s && (h[s].pt.k[n].s[0].c = h[s].cl), h[s].pt.k[n].e && (h[s].pt.k[n].e[0].c = h[s].cl)
								}
								4 === e.ty && l(e.shapes)
							}
						}
						var r = [4, 4, 18];
						return function (t) {
							if (o(r, t.v) && (s(t.layers), t.assets)) {
								var e, i = t.assets.length;
								for (e = 0; e < i; e += 1) t.assets[e].layers && s(t.assets[e].layers)
							}
						}
					}(),
					t = {};
				return t.completeData = function (t, e) {
					t.__complete || (r(t), i(t), s(t), n(t), function t(e, i, s) {
						var r, n, a, o, h, l, p, f = e.length;
						for (n = 0; n < f; n += 1)
							if ("ks" in (r = e[n]) && !r.completed) {
								if (r.completed = !0, r.tt && (e[n - 1].td = r.tt), r.hasMask) {
									var u = r.masksProperties;
									for (o = u.length, a = 0; a < o; a += 1)
										if (u[a].pt.k.i) m(u[a].pt.k);
										else
											for (l = u[a].pt.k.length, h = 0; h < l; h += 1) u[a].pt.k[h].s && m(u[a].pt.k[h].s[0]), u[a].pt.k[h].e && m(u[a].pt.k[h].e[0])
								}
								0 === r.ty ? (r.layers = c(r.refId, i), t(r.layers, i, s)) : 4 === r.ty ? d(r.shapes) : 5 == r.ty && (0 !== (p = r).t.a.length || "m" in p.t.p || (p.singleShape = !0))
							}
					}(t.layers, t.assets, e), t.__complete = !0)
				}, t
			}(),
			Rt = function () {
				function m(t, e) {
					var i = _("span");
					i.style.fontFamily = e;
					var s = _("span");
					s.innerHTML = "giItT1WQy@!-/#", i.style.position = "absolute", i.style.left = "-10000px", i.style.top = "-10000px", i.style.fontSize = "300px", i.style.fontVariant = "normal", i.style.fontStyle = "normal", i.style.fontWeight = "normal", i.style.letterSpacing = "0", i.appendChild(s), document.body.appendChild(i);
					var r = s.offsetWidth;
					return s.style.fontFamily = t + ", " + e, {
						node: s,
						w: r,
						parent: i
					}
				}
				var n = {
						w: 0,
						size: 0,
						shapes: []
					},
					t = [];
				t = t.concat([2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403]);
				var e = function () {
					this.fonts = [], this.chars = null, this.typekitLoaded = 0, this.isLoaded = !1, this.initTime = Date.now()
				};
				return e.getCombinedCharacterCodes = function () {
					return t
				}, e.prototype.addChars = function (t) {
					if (t) {
						this.chars || (this.chars = []);
						var e, i, s, r = t.length,
							n = this.chars.length;
						for (e = 0; e < r; e += 1) {
							for (i = 0, s = !1; i < n;) this.chars[i].style === t[e].style && this.chars[i].fFamily === t[e].fFamily && this.chars[i].ch === t[e].ch && (s = !0), i += 1;
							s || (this.chars.push(t[e]), n += 1)
						}
					}
				}, e.prototype.addFonts = function (t, e) {
					if (t) {
						if (this.chars) return this.isLoaded = !0, void(this.fonts = t.list);
						var i, s, r, n, a = t.list,
							o = a.length,
							h = o;
						for (i = 0; i < o; i += 1) {
							var l, p, f = !0;
							if (a[i].loaded = !1, a[i].monoCase = m(a[i].fFamily, "monospace"), a[i].sansCase = m(a[i].fFamily, "sans-serif"), a[i].fPath) {
								if ("p" === a[i].fOrigin || 3 === a[i].origin) {
									if (0 < (l = document.querySelectorAll('style[f-forigin="p"][f-family="' + a[i].fFamily + '"], style[f-origin="3"][f-family="' + a[i].fFamily + '"]')).length && (f = !1), f) {
										var u = _("style");
										u.setAttribute("f-forigin", a[i].fOrigin), u.setAttribute("f-origin", a[i].origin), u.setAttribute("f-family", a[i].fFamily), u.type = "text/css", u.innerHTML = "@font-face {font-family: " + a[i].fFamily + "; font-style: normal; src: url('" + a[i].fPath + "');}", e.appendChild(u)
									}
								} else if ("g" === a[i].fOrigin || 1 === a[i].origin) {
									for (l = document.querySelectorAll('link[f-forigin="g"], link[f-origin="1"]'), p = 0; p < l.length; p++) - 1 !== l[p].href.indexOf(a[i].fPath) && (f = !1);
									if (f) {
										var c = _("link");
										c.setAttribute("f-forigin", a[i].fOrigin), c.setAttribute("f-origin", a[i].origin), c.type = "text/css", c.rel = "stylesheet", c.href = a[i].fPath, document.body.appendChild(c)
									}
								} else if ("t" === a[i].fOrigin || 2 === a[i].origin) {
									for (l = document.querySelectorAll('script[f-forigin="t"], script[f-origin="2"]'), p = 0; p < l.length; p++) a[i].fPath === l[p].src && (f = !1);
									if (f) {
										var d = _("script");
										d.setAttribute("f-forigin", a[i].fOrigin), d.setAttribute("f-origin", a[i].origin), d.setAttribute("src", a[i].fPath), e.appendChild(d)
									}
								}
							} else a[i].loaded = !0, h -= 1;
							a[i].helper = (s = e, r = a[i], n = void 0, (n = k("text")).style.fontSize = "100px", n.setAttribute("font-family", r.fFamily), n.setAttribute("font-style", r.fStyle), n.setAttribute("font-weight", r.fWeight), n.textContent = "1", r.fClass ? (n.style.fontFamily = "inherit", n.className = r.fClass) : n.style.fontFamily = r.fFamily, s.appendChild(n), _("canvas").getContext("2d").font = r.fWeight + " " + r.fStyle + " 100px " + r.fFamily, n), a[i].cache = {}, this.fonts.push(a[i])
						}
						0 === h ? this.isLoaded = !0 : setTimeout(this.checkLoadedFonts.bind(this), 100)
					} else this.isLoaded = !0
				}, e.prototype.getCharData = function (t, e, i) {
					for (var s = 0, r = this.chars.length; s < r;) {
						if (this.chars[s].ch === t && this.chars[s].style === e && this.chars[s].fFamily === i) return this.chars[s];
						s += 1
					}
					return console && console.warn && console.warn("Missing character from exported characters list: ", t, e, i), n
				}, e.prototype.getFontByName = function (t) {
					for (var e = 0, i = this.fonts.length; e < i;) {
						if (this.fonts[e].fName === t) return this.fonts[e];
						e += 1
					}
					return this.fonts[0]
				}, e.prototype.measureText = function (t, e, i) {
					var s = this.getFontByName(e),
						r = t.charCodeAt(0);
					if (!s.cache[r + 1]) {
						var n = s.helper;
						if (" " === t) {
							n.textContent = "|" + t + "|";
							var a = n.getComputedTextLength();
							n.textContent = "||";
							var o = n.getComputedTextLength();
							s.cache[r + 1] = (a - o) / 100
						} else n.textContent = t, s.cache[r + 1] = n.getComputedTextLength() / 100
					}
					return s.cache[r + 1] * i
				}, e.prototype.checkLoadedFonts = function () {
					var t, e, i, s = this.fonts.length,
						r = s;
					for (t = 0; t < s; t += 1)
						if (this.fonts[t].loaded) r -= 1;
						else if ("t" === this.fonts[t].fOrigin || 2 === this.fonts[t].origin) {
						if (g.Typekit && g.Typekit.load && 0 === this.typekitLoaded) {
							this.typekitLoaded = 1;
							try {
								g.Typekit.load({
									async: !0,
									active: function () {
										this.typekitLoaded = 2
									}.bind(this)
								})
							} catch (t) {}
						}
						2 === this.typekitLoaded && (this.fonts[t].loaded = !0)
					} else "n" === this.fonts[t].fOrigin || 0 === this.fonts[t].origin ? this.fonts[t].loaded = !0 : (e = this.fonts[t].monoCase.node, i = this.fonts[t].monoCase.w, e.offsetWidth !== i ? (r -= 1, this.fonts[t].loaded = !0) : (e = this.fonts[t].sansCase.node, i = this.fonts[t].sansCase.w, e.offsetWidth !== i && (r -= 1, this.fonts[t].loaded = !0)), this.fonts[t].loaded && (this.fonts[t].sansCase.parent.parentNode.removeChild(this.fonts[t].sansCase.parent), this.fonts[t].monoCase.parent.parentNode.removeChild(this.fonts[t].monoCase.parent)));
					0 !== r && Date.now() - this.initTime < 5e3 ? setTimeout(this.checkLoadedFonts.bind(this), 20) : setTimeout(function () {
						this.isLoaded = !0
					}.bind(this), 0)
				}, e.prototype.loaded = function () {
					return this.isLoaded
				}, e
			}(),
			Ot = function () {
				function f(t, e) {
					var i, s = this.offsetTime;
					"multidimensional" === this.propType && (i = Ct("float32", this.pv.length));
					for (var r, n, a = e.lastIndex, o = a, h = this.keyframes.length - 1, l = !0; l;) {
						if (r = this.keyframes[o], n = this.keyframes[o + 1], o === h - 1 && t >= n.t - s) {
							r.h && (r = n), a = 0;
							break
						}
						if (n.t - s > t) {
							a = o;
							break
						}
						o < h - 1 ? o += 1 : (a = 0, l = !1)
					}
					var p, f, u, c, d, m, g, _, y, v, b, x, T, w, k, P, A, S, D, C, M, F, E, I, R, O, L, z, N, V, B, j, X = n.t - s,
						Y = r.t - s;
					if (r.to) {
						r.bezierData || Et.buildBezierData(r);
						var q = r.bezierData;
						if (X <= t || t < Y) {
							var G = X <= t ? q.points.length - 1 : 0;
							for (f = q.points[G].point.length, p = 0; p < f; p += 1) i[p] = q.points[G].point[p]
						} else {
							r.__fnct ? m = r.__fnct : (m = Ft.getBezierEasing(r.o.x, r.o.y, r.i.x, r.i.y, r.n).get, r.__fnct = m), u = m((t - Y) / (X - Y));
							var W, U = q.segmentLength * u,
								H = e.lastFrame < t && e._lastBezierData === q ? e._lastAddedLength : 0;
							for (d = e.lastFrame < t && e._lastBezierData === q ? e._lastPoint : 0, l = !0, c = q.points.length; l;) {
								if (H += q.points[d].partialLength, 0 === U || 0 === u || d === q.points.length - 1) {
									for (f = q.points[d].point.length, p = 0; p < f; p += 1) i[p] = q.points[d].point[p];
									break
								}
								if (H <= U && U < H + q.points[d + 1].partialLength) {
									for (W = (U - H) / q.points[d + 1].partialLength, f = q.points[d].point.length, p = 0; p < f; p += 1) i[p] = q.points[d].point[p] + (q.points[d + 1].point[p] - q.points[d].point[p]) * W;
									break
								}
								d < c - 1 ? d += 1 : l = !1
							}
							e._lastPoint = d, e._lastAddedLength = H - q.points[d].partialLength, e._lastBezierData = q
						}
					} else {
						var Z, $, Q, K, J;
						if (h = r.s.length, this.sh && 1 !== r.h)
							if (X <= t) i[0] = r.e[0], i[1] = r.e[1], i[2] = r.e[2];
							else if (t <= Y) i[0] = r.s[0], i[1] = r.s[1], i[2] = r.s[2];
						else {
							var tt = it(r.s),
								et = it(r.e);
							g = i, A = et, S = (t - Y) / (X - Y), I = [], R = (P = tt)[0], O = P[1], L = P[2], z = P[3], N = A[0], V = A[1], B = A[2], j = A[3], (C = R * N + O * V + L * B + z * j) < 0 && (C = -C, N = -N, V = -V, B = -B, j = -j), 1e-6 < 1 - C ? (D = Math.acos(C), M = Math.sin(D), F = Math.sin((1 - S) * D) / M, E = Math.sin(S * D) / M) : (F = 1 - S, E = S), I[0] = F * R + E * N, I[1] = F * O + E * V, I[2] = F * L + E * B, I[3] = F * z + E * j, y = (_ = I)[0], v = _[1], b = _[2], x = _[3], T = Math.atan2(2 * v * x - 2 * y * b, 1 - 2 * v * v - 2 * b * b), w = Math.asin(2 * y * v + 2 * b * x), k = Math.atan2(2 * y * x - 2 * v * b, 1 - 2 * y * y - 2 * b * b), g[0] = T / At, g[1] = w / At, g[2] = k / At
						} else
							for (o = 0; o < h; o += 1) 1 !== r.h && (X <= t ? u = 1 : t < Y ? u = 0 : (r.o.x.constructor === Array ? (r.__fnct || (r.__fnct = []), r.__fnct[o] ? m = r.__fnct[o] : (Z = r.o.x[o] || r.o.x[0], $ = r.o.y[o] || r.o.y[0], Q = r.i.x[o] || r.i.x[0], K = r.i.y[o] || r.i.y[0], m = Ft.getBezierEasing(Z, $, Q, K).get, r.__fnct[o] = m)) : r.__fnct ? m = r.__fnct : (Z = r.o.x, $ = r.o.y, Q = r.i.x, K = r.i.y, m = Ft.getBezierEasing(Z, $, Q, K).get, r.__fnct = m), u = m((t - Y) / (X - Y)))), J = 1 === r.h ? r.s[o] : r.s[o] + (r.e[o] - r.s[o]) * u, 1 === h ? i = J : i[o] = J
					}
					return e.lastIndex = a, i
				}

				function it(t) {
					var e = t[0] * At,
						i = t[1] * At,
						s = t[2] * At,
						r = Math.cos(e / 2),
						n = Math.cos(i / 2),
						a = Math.cos(s / 2),
						o = Math.sin(e / 2),
						h = Math.sin(i / 2),
						l = Math.sin(s / 2);
					return [o * h * a + r * n * l, o * n * a + r * h * l, r * h * a - o * n * l, r * n * a - o * h * l]
				}

				function u() {
					var t = this.comp.renderedFrame - this.offsetTime,
						e = this.keyframes[0].t - this.offsetTime,
						i = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
					if (!(t === this._caching.lastFrame || this._caching.lastFrame !== g && (this._caching.lastFrame >= i && i <= t || this._caching.lastFrame < e && t < e))) {
						this._caching.lastFrame >= t && (this._caching._lastBezierData = null, this._caching.lastIndex = 0);
						var s = this.interpolateValue(t, this._caching);
						this.pv = s
					}
					return this._caching.lastFrame = t, this.pv
				}

				function c(t) {
					var e;
					if ("unidimensional" === this.propType) e = t * this.mult, 1e-5 < r(this.v - e) && (this.v = e, this._mdf = !0);
					else
						for (var i = 0, s = this.v.length; i < s;) e = t[i] * this.mult, 1e-5 < r(this.v[i] - e) && (this.v[i] = e, this._mdf = !0), i += 1
				}

				function d() {
					if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length) {
						if (this.lock) return void this.setVValue(this.pv);
						this.lock = !0, this._mdf = this._isFirstFrame;
						var t, e = this.effectsSequence.length,
							i = this.kf ? this.pv : this.data.k;
						for (t = 0; t < e; t += 1) i = this.effectsSequence[t](i);
						this.setVValue(i), this._isFirstFrame = !1, this.lock = !1, this.frameId = this.elem.globalData.frameId
					}
				}

				function m(t) {
					this.effectsSequence.push(t), this.container.addDynamicProperty(this)
				}

				function a(t, e, i, s) {
					this.propType = "unidimensional", this.mult = i || 1, this.data = e, this.v = i ? e.k * i : e.k, this.pv = e.k, this._mdf = !1, this.elem = t, this.container = s, this.comp = t.comp, this.k = !1, this.kf = !1, this.vel = 0, this.effectsSequence = [], this._isFirstFrame = !0, this.getValue = d, this.setVValue = c, this.addEffect = m
				}

				function o(t, e, i, s) {
					this.propType = "multidimensional", this.mult = i || 1, this.data = e, this._mdf = !1, this.elem = t, this.container = s, this.comp = t.comp, this.k = !1, this.kf = !1, this.frameId = -1;
					var r, n = e.k.length;
					for (this.v = Ct("float32", n), this.pv = Ct("float32", n), Ct("float32", n), this.vel = Ct("float32", n), r = 0; r < n; r += 1) this.v[r] = e.k[r] * this.mult, this.pv[r] = e.k[r];
					this._isFirstFrame = !0, this.effectsSequence = [], this.getValue = d, this.setVValue = c, this.addEffect = m
				}

				function h(t, e, i, s) {
					this.propType = "unidimensional", this.keyframes = e.k, this.offsetTime = t.data.st, this.frameId = -1, this._caching = {
						lastFrame: g,
						lastIndex: 0,
						value: 0,
						_lastBezierData: null
					}, this.k = !0, this.kf = !0, this.data = e, this.mult = i || 1, this.elem = t, this.container = s, this.comp = t.comp, this.v = g, this.pv = g, this._isFirstFrame = !0, this.getValue = d, this.setVValue = c, this.interpolateValue = f, this.effectsSequence = [u.bind(this)], this.addEffect = m
				}

				function l(t, e, i, s) {
					this.propType = "multidimensional";
					var r, n, a, o, h, l = e.k.length;
					for (r = 0; r < l - 1; r += 1) e.k[r].to && e.k[r].s && e.k[r].e && (n = e.k[r].s, a = e.k[r].e, o = e.k[r].to, h = e.k[r].ti, (2 === n.length && (n[0] !== a[0] || n[1] !== a[1]) && Et.pointOnLine2D(n[0], n[1], a[0], a[1], n[0] + o[0], n[1] + o[1]) && Et.pointOnLine2D(n[0], n[1], a[0], a[1], a[0] + h[0], a[1] + h[1]) || 3 === n.length && (n[0] !== a[0] || n[1] !== a[1] || n[2] !== a[2]) && Et.pointOnLine3D(n[0], n[1], n[2], a[0], a[1], a[2], n[0] + o[0], n[1] + o[1], n[2] + o[2]) && Et.pointOnLine3D(n[0], n[1], n[2], a[0], a[1], a[2], a[0] + h[0], a[1] + h[1], a[2] + h[2])) && (e.k[r].to = null, e.k[r].ti = null), n[0] === a[0] && n[1] === a[1] && 0 === o[0] && 0 === o[1] && 0 === h[0] && 0 === h[1] && (2 === n.length || n[2] === a[2] && 0 === o[2] && 0 === h[2]) && (e.k[r].to = null, e.k[r].ti = null));
					this.effectsSequence = [u.bind(this)], this.keyframes = e.k, this.offsetTime = t.data.st, this.k = !0, this.kf = !0, this._isFirstFrame = !0, this.mult = i || 1, this.elem = t, this.container = s, this.comp = t.comp, this.getValue = d, this.setVValue = c, this.interpolateValue = f, this.frameId = -1;
					var p = e.k[0].s.length;
					for (this.v = Ct("float32", p), this.pv = Ct("float32", p), r = 0; r < p; r += 1) this.v[r] = g, this.pv[r] = g;
					this._caching = {
						lastFrame: g,
						lastIndex: 0,
						value: Ct("float32", p)
					}, this.addEffect = m
				}
				var g = yt,
					r = Math.abs;
				return {
					getProp: function (t, e, i, s, r) {
						var n;
						if (0 === e.a) n = 0 === i ? new a(t, e, s, r) : new o(t, e, s, r);
						else if (1 === e.a) n = 0 === i ? new h(t, e, s, r) : new l(t, e, s, r);
						else if (e.k.length)
							if ("number" == typeof e.k[0]) n = new o(t, e, s, r);
							else switch (i) {
								case 0:
									n = new h(t, e, s, r);
									break;
								case 1:
									n = new l(t, e, s, r)
							} else n = new a(t, e, s, r);
						return n.effectsSequence.length && r.addDynamicProperty(n), n
					}
				}
			}(),
			Lt = function () {
				function s(t, e, i) {
					if (this.elem = t, this.frameId = -1, this.propType = "transform", this.data = e, this.v = new Mt, this.pre = new Mt, this.appliedTransformations = 0, this.initDynamicPropertyContainer(i || t), e.p.s ? (this.px = Ot.getProp(t, e.p.x, 0, 0, this), this.py = Ot.getProp(t, e.p.y, 0, 0, this), e.p.z && (this.pz = Ot.getProp(t, e.p.z, 0, 0, this))) : this.p = Ot.getProp(t, e.p, 1, 0, this), e.r) this.r = Ot.getProp(t, e.r, 0, At, this);
					else if (e.rx) {
						if (this.rx = Ot.getProp(t, e.rx, 0, At, this), this.ry = Ot.getProp(t, e.ry, 0, At, this), this.rz = Ot.getProp(t, e.rz, 0, At, this), e.or.k[0].ti) {
							var s, r = e.or.k.length;
							for (s = 0; s < r; s += 1) e.or.k[s].to = e.or.k[s].ti = null
						}
						this.or = Ot.getProp(t, e.or, 1, At, this), this.or.sh = !0
					}
					e.sk && (this.sk = Ot.getProp(t, e.sk, 0, At, this), this.sa = Ot.getProp(t, e.sa, 0, At, this)), e.a && (this.a = Ot.getProp(t, e.a, 1, 0, this)), e.s && (this.s = Ot.getProp(t, e.s, 1, .01, this)), e.o ? this.o = Ot.getProp(t, e.o, 0, .01, t) : this.o = {
						_mdf: !1,
						v: 1
					}, this._isDirty = !0, this.dynamicProperties.length || this.getValue(!0)
				}
				return s.prototype = {
					applyToMatrix: function (t) {
						var e = this._mdf;
						this.iterateDynamicProperties(), this._mdf = this._mdf || e, this.a && t.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.s && t.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && t.skewFromAxis(-this.sk.v, this.sa.v), this.r ? t.rotate(-this.r.v) : t.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.data.p.s ? this.data.p.z ? t.translate(this.px.v, this.py.v, -this.pz.v) : t.translate(this.px.v, this.py.v, 0) : t.translate(this.p.v[0], this.p.v[1], -this.p.v[2])
					},
					getValue: function (t) {
						if (this.elem.globalData.frameId !== this.frameId) {
							if (this._isDirty && (this.precalculateMatrix(), this._isDirty = !1), this.iterateDynamicProperties(), this._mdf || t) {
								if (this.v.cloneFromProps(this.pre.props), this.appliedTransformations < 1 && this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations < 2 && this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && this.appliedTransformations < 3 && this.v.skewFromAxis(-this.sk.v, this.sa.v), this.r && this.appliedTransformations < 4 ? this.v.rotate(-this.r.v) : !this.r && this.appliedTransformations < 4 && this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.autoOriented) {
									var e, i, s = this.elem.globalData.frameRate;
									if (this.p && this.p.keyframes && this.p.getValueAtTime) this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t ? (e = this.p.getValueAtTime((this.p.keyframes[0].t + .01) / s, 0), i = this.p.getValueAtTime(this.p.keyframes[0].t / s, 0)) : this.p._caching.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t ? (e = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / s, 0), i = this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - .01) / s, 0)) : (e = this.p.pv, i = this.p.getValueAtTime((this.p._caching.lastFrame + this.p.offsetTime - .01) / s, this.p.offsetTime));
									else if (this.px && this.px.keyframes && this.py.keyframes && this.px.getValueAtTime && this.py.getValueAtTime) {
										e = [], i = [];
										var r = this.px,
											n = this.py;
										r._caching.lastFrame + r.offsetTime <= r.keyframes[0].t ? (e[0] = r.getValueAtTime((r.keyframes[0].t + .01) / s, 0), e[1] = n.getValueAtTime((n.keyframes[0].t + .01) / s, 0), i[0] = r.getValueAtTime(r.keyframes[0].t / s, 0), i[1] = n.getValueAtTime(n.keyframes[0].t / s, 0)) : r._caching.lastFrame + r.offsetTime >= r.keyframes[r.keyframes.length - 1].t ? (e[0] = r.getValueAtTime(r.keyframes[r.keyframes.length - 1].t / s, 0), e[1] = n.getValueAtTime(n.keyframes[n.keyframes.length - 1].t / s, 0), i[0] = r.getValueAtTime((r.keyframes[r.keyframes.length - 1].t - .01) / s, 0), i[1] = n.getValueAtTime((n.keyframes[n.keyframes.length - 1].t - .01) / s, 0)) : (e = [r.pv, n.pv], i[0] = r.getValueAtTime((r._caching.lastFrame + r.offsetTime - .01) / s, r.offsetTime), i[1] = n.getValueAtTime((n._caching.lastFrame + n.offsetTime - .01) / s, n.offsetTime))
									}
									this.v.rotate(-Math.atan2(e[1] - i[1], e[0] - i[0]))
								}
								this.data.p.s ? this.data.p.z ? this.v.translate(this.px.v, this.py.v, -this.pz.v) : this.v.translate(this.px.v, this.py.v, 0) : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2])
							}
							this.frameId = this.elem.globalData.frameId
						}
					},
					precalculateMatrix: function () {
						if (!this.a.k && (this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations = 1, !this.s.effectsSequence.length)) {
							if (this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.appliedTransformations = 2, this.sk) {
								if (this.sk.effectsSequence.length || this.sa.effectsSequence.length) return;
								this.pre.skewFromAxis(-this.sk.v, this.sa.v), this.appliedTransformations = 3
							}
							if (this.r) {
								if (this.r.effectsSequence.length) return;
								this.pre.rotate(-this.r.v), this.appliedTransformations = 4
							} else this.rz.effectsSequence.length || this.ry.effectsSequence.length || this.rx.effectsSequence.length || this.or.effectsSequence.length || (this.pre.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.appliedTransformations = 4)
						}
					},
					autoOrient: function () {}
				}, c([u], s), s.prototype.addDynamicProperty = function (t) {
					this._addDynamicProperty(t), this.elem.addDynamicProperty(t), this._isDirty = !0
				}, s.prototype._addDynamicProperty = u.prototype.addDynamicProperty, {
					getTransformProperty: function (t, e, i) {
						return new s(t, e, i)
					}
				}
			}();
		l.prototype.setPathData = function (t, e) {
			this.c = t, this.setLength(e);
			for (var i = 0; i < e;) this.v[i] = ee.newElement(), this.o[i] = ee.newElement(), this.i[i] = ee.newElement(), i += 1
		}, l.prototype.setLength = function (t) {
			for (; this._maxLength < t;) this.doubleArrayLength();
			this._length = t
		}, l.prototype.doubleArrayLength = function () {
			this.v = this.v.concat(w(this._maxLength)), this.i = this.i.concat(w(this._maxLength)), this.o = this.o.concat(w(this._maxLength)), this._maxLength *= 2
		}, l.prototype.setXYAt = function (t, e, i, s, r) {
			var n;
			switch (this._length = Math.max(this._length, s + 1), this._length >= this._maxLength && this.doubleArrayLength(), i) {
				case "v":
					n = this.v;
					break;
				case "i":
					n = this.i;
					break;
				case "o":
					n = this.o
			}(!n[s] || n[s] && !r) && (n[s] = ee.newElement()), n[s][0] = t, n[s][1] = e
		}, l.prototype.setTripleAt = function (t, e, i, s, r, n, a, o) {
			this.setXYAt(t, e, "v", a, o), this.setXYAt(i, s, "o", a, o), this.setXYAt(r, n, "i", a, o)
		}, l.prototype.reverse = function () {
			var t = new l;
			t.setPathData(this.c, this._length);
			var e = this.v,
				i = this.o,
				s = this.i,
				r = 0;
			this.c && (t.setTripleAt(e[0][0], e[0][1], s[0][0], s[0][1], i[0][0], i[0][1], 0, !1), r = 1);
			var n, a = this._length - 1,
				o = this._length;
			for (n = r; n < o; n += 1) t.setTripleAt(e[a][0], e[a][1], s[a][0], s[a][1], i[a][0], i[a][1], n, !1), a -= 1;
			return t
		};
		var zt, Nt, Vt = function () {
				function t(t, e, i) {
					var s, r, n, a, o, h, l, p, f, u = i.lastIndex,
						c = this.keyframes;
					if (t < c[0].t - this.offsetTime) s = c[0].s[0], n = !0, u = 0;
					else if (t >= c[c.length - 1].t - this.offsetTime) s = 1 === c[c.length - 2].h ? c[c.length - 1].s[0] : c[c.length - 2].e[0], n = !0;
					else {
						for (var d, m, g = u, _ = c.length - 1, y = !0; y && (d = c[g], !((m = c[g + 1]).t - this.offsetTime > t));) g < _ - 1 ? g += 1 : y = !1;
						if (u = g, !(n = 1 === d.h)) {
							if (t >= m.t - this.offsetTime) p = 1;
							else if (t < d.t - this.offsetTime) p = 0;
							else {
								var v;
								d.__fnct ? v = d.__fnct : (v = Ft.getBezierEasing(d.o.x, d.o.y, d.i.x, d.i.y).get, d.__fnct = v), p = v((t - (d.t - this.offsetTime)) / (m.t - this.offsetTime - (d.t - this.offsetTime)))
							}
							r = d.e[0]
						}
						s = d.s[0]
					}
					for (h = e._length, l = s.i[0].length, i.lastIndex = u, a = 0; a < h; a += 1)
						for (o = 0; o < l; o += 1) f = n ? s.i[a][o] : s.i[a][o] + (r.i[a][o] - s.i[a][o]) * p, e.i[a][o] = f, f = n ? s.o[a][o] : s.o[a][o] + (r.o[a][o] - s.o[a][o]) * p, e.o[a][o] = f, f = n ? s.v[a][o] : s.v[a][o] + (r.v[a][o] - s.v[a][o]) * p, e.v[a][o] = f
				}

				function r() {
					this.paths = this.localShapeCollection
				}

				function e(t) {
					(function (t, e) {
						if (t._length !== e._length || t.c !== e.c) return !1;
						var i, s = t._length;
						for (i = 0; i < s; i += 1)
							if (t.v[i][0] !== e.v[i][0] || t.v[i][1] !== e.v[i][1] || t.o[i][0] !== e.o[i][0] || t.o[i][1] !== e.o[i][1] || t.i[i][0] !== e.i[i][0] || t.i[i][1] !== e.i[i][1]) return !1;
						return !0
					})(this.v, t) || (this.v = ie.clone(t), this.localShapeCollection.releaseShapes(), this.localShapeCollection.addShape(this.v), this._mdf = !0, this.paths = this.localShapeCollection)
				}

				function i() {
					if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length) {
						if (this.lock) return void this.setVValue(this.pv);
						this.lock = !0, this._mdf = !1;
						var t, e = this.kf ? this.pv : this.data.ks ? this.data.ks.k : this.data.pt.k,
							i = this.effectsSequence.length;
						for (t = 0; t < i; t += 1) e = this.effectsSequence[t](e);
						this.setVValue(e), this.lock = !1, this.frameId = this.elem.globalData.frameId
					}
				}

				function a(t, e, i) {
					this.propType = "shape", this.comp = t.comp, this.container = t, this.elem = t, this.data = e, this.k = !1, this.kf = !1, this._mdf = !1;
					var s = 3 === i ? e.pt.k : e.ks.k;
					this.v = ie.clone(s), this.pv = ie.clone(this.v), this.localShapeCollection = se.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.reset = r, this.effectsSequence = []
				}

				function s(t) {
					this.effectsSequence.push(t), this.container.addDynamicProperty(this)
				}

				function o(t, e, i) {
					this.propType = "shape", this.comp = t.comp, this.elem = t, this.container = t, this.offsetTime = t.data.st, this.keyframes = 3 === i ? e.pt.k : e.ks.k, this.k = !0, this.kf = !0;
					var s = this.keyframes[0].s[0].i.length;
					this.keyframes[0].s[0].i[0].length, this.v = ie.newElement(), this.v.setPathData(this.keyframes[0].s[0].c, s), this.pv = ie.clone(this.v), this.localShapeCollection = se.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.lastFrame = n, this.reset = r, this._caching = {
						lastFrame: n,
						lastIndex: 0
					}, this.effectsSequence = [function () {
						var t = this.comp.renderedFrame - this.offsetTime,
							e = this.keyframes[0].t - this.offsetTime,
							i = this.keyframes[this.keyframes.length - 1].t - this.offsetTime,
							s = this._caching.lastFrame;
						return s !== n && (s < e && t < e || i < s && i < t) || (this._caching.lastIndex = s < t ? this._caching.lastIndex : 0, this.interpolateShape(t, this.pv, this._caching)), this._caching.lastFrame = t, this.pv
					}.bind(this)]
				}
				var n = -999999;
				a.prototype.interpolateShape = t, a.prototype.getValue = i, a.prototype.setVValue = e, a.prototype.addEffect = s, o.prototype.getValue = i, o.prototype.interpolateShape = t, o.prototype.setVValue = e, o.prototype.addEffect = s;
				var h = function () {
						function t(t, e) {
							this.v = ie.newElement(), this.v.setPathData(!0, 4), this.localShapeCollection = se.newShapeCollection(), this.paths = this.localShapeCollection, this.localShapeCollection.addShape(this.v), this.d = e.d, this.elem = t, this.comp = t.comp, this.frameId = -1, this.initDynamicPropertyContainer(t), this.p = Ot.getProp(t, e.p, 1, 0, this), this.s = Ot.getProp(t, e.s, 1, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertEllToPath())
						}
						var a = St;
						return t.prototype = {
							reset: r,
							getValue: function () {
								this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertEllToPath())
							},
							convertEllToPath: function () {
								var t = this.p.v[0],
									e = this.p.v[1],
									i = this.s.v[0] / 2,
									s = this.s.v[1] / 2,
									r = 3 !== this.d,
									n = this.v;
								n.v[0][0] = t, n.v[0][1] = e - s, n.v[1][0] = r ? t + i : t - i, n.v[1][1] = e, n.v[2][0] = t, n.v[2][1] = e + s, n.v[3][0] = r ? t - i : t + i, n.v[3][1] = e, n.i[0][0] = r ? t - i * a : t + i * a, n.i[0][1] = e - s, n.i[1][0] = r ? t + i : t - i, n.i[1][1] = e - s * a, n.i[2][0] = r ? t + i * a : t - i * a, n.i[2][1] = e + s, n.i[3][0] = r ? t - i : t + i, n.i[3][1] = e + s * a, n.o[0][0] = r ? t + i * a : t - i * a, n.o[0][1] = e - s, n.o[1][0] = r ? t + i : t - i, n.o[1][1] = e + s * a, n.o[2][0] = r ? t - i * a : t + i * a, n.o[2][1] = e + s, n.o[3][0] = r ? t - i : t + i, n.o[3][1] = e - s * a
							}
						}, c([u], t), t
					}(),
					l = function () {
						function t(t, e) {
							this.v = ie.newElement(), this.v.setPathData(!0, 0), this.elem = t, this.comp = t.comp, this.data = e, this.frameId = -1, this.d = e.d, this.initDynamicPropertyContainer(t), 1 === e.sy ? (this.ir = Ot.getProp(t, e.ir, 0, 0, this), this.is = Ot.getProp(t, e.is, 0, .01, this), this.convertToPath = this.convertStarToPath) : this.convertToPath = this.convertPolygonToPath, this.pt = Ot.getProp(t, e.pt, 0, 0, this), this.p = Ot.getProp(t, e.p, 1, 0, this), this.r = Ot.getProp(t, e.r, 0, At, this), this.or = Ot.getProp(t, e.or, 0, 0, this), this.os = Ot.getProp(t, e.os, 0, .01, this), this.localShapeCollection = se.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertToPath())
						}
						return t.prototype = {
							reset: r,
							getValue: function () {
								this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertToPath())
							},
							convertStarToPath: function () {
								var t, e, i, s, r = 2 * Math.floor(this.pt.v),
									n = 2 * Math.PI / r,
									a = !0,
									o = this.or.v,
									h = this.ir.v,
									l = this.os.v,
									p = this.is.v,
									f = 2 * Math.PI * o / (2 * r),
									u = 2 * Math.PI * h / (2 * r),
									c = -Math.PI / 2;
								c += this.r.v;
								var d = 3 === this.data.d ? -1 : 1;
								for (t = this.v._length = 0; t < r; t += 1) {
									i = a ? l : p, s = a ? f : u;
									var m = (e = a ? o : h) * Math.cos(c),
										g = e * Math.sin(c),
										_ = 0 === m && 0 === g ? 0 : g / Math.sqrt(m * m + g * g),
										y = 0 === m && 0 === g ? 0 : -m / Math.sqrt(m * m + g * g);
									m += +this.p.v[0], g += +this.p.v[1], this.v.setTripleAt(m, g, m - _ * s * i * d, g - y * s * i * d, m + _ * s * i * d, g + y * s * i * d, t, !0), a = !a, c += n * d
								}
							},
							convertPolygonToPath: function () {
								var t, e = Math.floor(this.pt.v),
									i = 2 * Math.PI / e,
									s = this.or.v,
									r = this.os.v,
									n = 2 * Math.PI * s / (4 * e),
									a = -Math.PI / 2,
									o = 3 === this.data.d ? -1 : 1;
								for (a += this.r.v, t = this.v._length = 0; t < e; t += 1) {
									var h = s * Math.cos(a),
										l = s * Math.sin(a),
										p = 0 === h && 0 === l ? 0 : l / Math.sqrt(h * h + l * l),
										f = 0 === h && 0 === l ? 0 : -h / Math.sqrt(h * h + l * l);
									h += +this.p.v[0], l += +this.p.v[1], this.v.setTripleAt(h, l, h - p * n * r * o, l - f * n * r * o, h + p * n * r * o, l + f * n * r * o, t, !0), a += i * o
								}
								this.paths.length = 0, this.paths[0] = this.v
							}
						}, c([u], t), t
					}(),
					p = function () {
						function t(t, e) {
							this.v = ie.newElement(), this.v.c = !0, this.localShapeCollection = se.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.elem = t, this.comp = t.comp, this.frameId = -1, this.d = e.d, this.initDynamicPropertyContainer(t), this.p = Ot.getProp(t, e.p, 1, 0, this), this.s = Ot.getProp(t, e.s, 1, 0, this), this.r = Ot.getProp(t, e.r, 0, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertRectToPath())
						}
						return t.prototype = {
							convertRectToPath: function () {
								var t = this.p.v[0],
									e = this.p.v[1],
									i = this.s.v[0] / 2,
									s = this.s.v[1] / 2,
									r = wt(i, s, this.r.v),
									n = r * (1 - St);
								this.v._length = 0, 2 === this.d || 1 === this.d ? (this.v.setTripleAt(t + i, e - s + r, t + i, e - s + r, t + i, e - s + n, 0, !0), this.v.setTripleAt(t + i, e + s - r, t + i, e + s - n, t + i, e + s - r, 1, !0), 0 !== r ? (this.v.setTripleAt(t + i - r, e + s, t + i - r, e + s, t + i - n, e + s, 2, !0), this.v.setTripleAt(t - i + r, e + s, t - i + n, e + s, t - i + r, e + s, 3, !0), this.v.setTripleAt(t - i, e + s - r, t - i, e + s - r, t - i, e + s - n, 4, !0), this.v.setTripleAt(t - i, e - s + r, t - i, e - s + n, t - i, e - s + r, 5, !0), this.v.setTripleAt(t - i + r, e - s, t - i + r, e - s, t - i + n, e - s, 6, !0), this.v.setTripleAt(t + i - r, e - s, t + i - n, e - s, t + i - r, e - s, 7, !0)) : (this.v.setTripleAt(t - i, e + s, t - i + n, e + s, t - i, e + s, 2), this.v.setTripleAt(t - i, e - s, t - i, e - s + n, t - i, e - s, 3))) : (this.v.setTripleAt(t + i, e - s + r, t + i, e - s + n, t + i, e - s + r, 0, !0), 0 !== r ? (this.v.setTripleAt(t + i - r, e - s, t + i - r, e - s, t + i - n, e - s, 1, !0), this.v.setTripleAt(t - i + r, e - s, t - i + n, e - s, t - i + r, e - s, 2, !0), this.v.setTripleAt(t - i, e - s + r, t - i, e - s + r, t - i, e - s + n, 3, !0), this.v.setTripleAt(t - i, e + s - r, t - i, e + s - n, t - i, e + s - r, 4, !0), this.v.setTripleAt(t - i + r, e + s, t - i + r, e + s, t - i + n, e + s, 5, !0), this.v.setTripleAt(t + i - r, e + s, t + i - n, e + s, t + i - r, e + s, 6, !0), this.v.setTripleAt(t + i, e + s - r, t + i, e + s - r, t + i, e + s - n, 7, !0)) : (this.v.setTripleAt(t - i, e - s, t - i + n, e - s, t - i, e - s, 1, !0), this.v.setTripleAt(t - i, e + s, t - i, e + s - n, t - i, e + s, 2, !0), this.v.setTripleAt(t + i, e + s, t + i - n, e + s, t + i, e + s, 3, !0)))
							},
							getValue: function (t) {
								this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertRectToPath())
							},
							reset: r
						}, c([u], t), t
					}(),
					f = {
						getShapeProp: function (t, e, i) {
							var s;
							if (3 === i || 4 === i) {
								var r = 3 === i ? e.pt : e.ks,
									n = r.k;
								s = 1 === r.a || n.length ? new o(t, e, i) : new a(t, e, i)
							} else 5 === i ? s = new p(t, e) : 6 === i ? s = new h(t, e) : 7 === i && (s = new l(t, e));
							return s.k && t.addDynamicProperty(s), s
						},
						getConstructorFunction: function () {
							return a
						},
						getKeyframedConstructorFunction: function () {
							return o
						}
					};
				return f
			}(),
			Bt = (Nt = {}, (zt = {}).registerModifier = function (t, e) {
				Nt[t] || (Nt[t] = e)
			}, zt.getModifier = function (t, e, i) {
				return new Nt[t](e, i)
			}, zt);
		p.prototype.initModifierProperties = function () {}, p.prototype.addShapeToModifier = function () {}, p.prototype.addShape = function (t) {
			if (!this.closed) {
				var e = {
					shape: t.sh,
					data: t,
					localShapeCollection: se.newShapeCollection()
				};
				this.shapes.push(e), this.addShapeToModifier(e), this._isAnimated && t.setAsAnimated()
			}
		}, p.prototype.init = function (t, e) {
			this.shapes = [], this.elem = t, this.initDynamicPropertyContainer(t), this.initModifierProperties(t, e), this.frameId = yt, this.closed = !1, this.k = !1, this.dynamicProperties.length ? this.k = !0 : this.getValue(!0)
		}, p.prototype.processKeys = function () {
			this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties())
		}, c([u], p), c([p], f), f.prototype.initModifierProperties = function (t, e) {
			this.s = Ot.getProp(t, e.s, 0, .01, this), this.e = Ot.getProp(t, e.e, 0, .01, this), this.o = Ot.getProp(t, e.o, 0, 0, this), this.sValue = 0, this.eValue = 0, this.getValue = this.processKeys, this.m = e.m, this._isAnimated = !!this.s.effectsSequence.length || !!this.e.effectsSequence.length || !!this.o.effectsSequence.length
		}, f.prototype.addShapeToModifier = function (t) {
			t.pathsData = []
		}, f.prototype.calculateShapeEdges = function (t, e, i, s, r) {
			var n = [];
			e <= 1 ? n.push({
				s: t,
				e: e
			}) : 1 <= t ? n.push({
				s: t - 1,
				e: e - 1
			}) : (n.push({
				s: t,
				e: 1
			}), n.push({
				s: 0,
				e: e - 1
			}));
			var a, o, h = [],
				l = n.length;
			for (a = 0; a < l; a += 1)
				if ((o = n[a]).e * r < s || o.s * r > s + i);
				else {
					var p, f;
					p = o.s * r <= s ? 0 : (o.s * r - s) / i, f = o.e * r >= s + i ? 1 : (o.e * r - s) / i, h.push([p, f])
				}
			return h.length || h.push([0, 0]), h
		}, f.prototype.releasePathsData = function (t) {
			var e, i = t.length;
			for (e = 0; e < i; e += 1) re.release(t[e]);
			return t.length = 0, t
		}, f.prototype.processShapes = function (t) {
			var e, i;
			if (this._mdf || t) {
				var s = this.o.v % 360 / 360;
				if (s < 0 && (s += 1), e = (1 < this.s.v ? 1 : this.s.v < 0 ? 0 : this.s.v) + s, (i = (1 < this.e.v ? 1 : this.e.v < 0 ? 0 : this.e.v) + s) < e) {
					var r = e;
					e = i, i = r
				}
				e = 1e-4 * Math.round(1e4 * e), i = 1e-4 * Math.round(1e4 * i), this.sValue = e, this.eValue = i
			} else e = this.sValue, i = this.eValue;
			var n, a, o, h, l, p, f, u = this.shapes.length,
				c = 0;
			if (i === e)
				for (a = 0; a < u; a += 1) this.shapes[a].localShapeCollection.releaseShapes(), this.shapes[a].shape._mdf = !0, this.shapes[a].shape.paths = this.shapes[a].localShapeCollection;
			else if (1 === i && 0 === e || 0 === i && 1 === e) {
				if (this._mdf)
					for (a = 0; a < u; a += 1) this.shapes[a].pathsData.length = 0, this.shapes[a].shape._mdf = !0
			} else {
				var d, m, g = [];
				for (a = 0; a < u; a += 1)
					if ((d = this.shapes[a]).shape._mdf || this._mdf || t || 2 === this.m) {
						if (h = (n = d.shape.paths)._length, f = 0, !d.shape._mdf && d.pathsData.length) f = d.totalShapeLength;
						else {
							for (l = this.releasePathsData(d.pathsData), o = 0; o < h; o += 1) p = Et.getSegmentsLength(n.shapes[o]), l.push(p), f += p.totalLength;
							d.totalShapeLength = f, d.pathsData = l
						}
						c += f, d.shape._mdf = !0
					} else d.shape.paths = d.localShapeCollection;
				var _, y = e,
					v = i,
					b = 0;
				for (a = u - 1; 0 <= a; a -= 1)
					if ((d = this.shapes[a]).shape._mdf) {
						for ((m = d.localShapeCollection).releaseShapes(), 2 === this.m && 1 < u ? (_ = this.calculateShapeEdges(e, i, d.totalShapeLength, b, c), b += d.totalShapeLength) : _ = [
								[y, v]
							], h = _.length, o = 0; o < h; o += 1) {
							y = _[o][0], v = _[o][1], g.length = 0, v <= 1 ? g.push({
								s: d.totalShapeLength * y,
								e: d.totalShapeLength * v
							}) : 1 <= y ? g.push({
								s: d.totalShapeLength * (y - 1),
								e: d.totalShapeLength * (v - 1)
							}) : (g.push({
								s: d.totalShapeLength * y,
								e: d.totalShapeLength
							}), g.push({
								s: 0,
								e: d.totalShapeLength * (v - 1)
							}));
							var x = this.addShapes(d, g[0]);
							if (g[0].s !== g[0].e) {
								if (1 < g.length)
									if (d.shape.paths.shapes[d.shape.paths._length - 1].c) {
										var T = x.pop();
										this.addPaths(x, m), x = this.addShapes(d, g[1], T)
									} else this.addPaths(x, m), x = this.addShapes(d, g[1]);
								this.addPaths(x, m)
							}
						}
						d.shape.paths = m
					}
			}
		}, f.prototype.addPaths = function (t, e) {
			var i, s = t.length;
			for (i = 0; i < s; i += 1) e.addShape(t[i])
		}, f.prototype.addSegment = function (t, e, i, s, r, n, a) {
			r.setXYAt(e[0], e[1], "o", n), r.setXYAt(i[0], i[1], "i", n + 1), a && r.setXYAt(t[0], t[1], "v", n), r.setXYAt(s[0], s[1], "v", n + 1)
		}, f.prototype.addSegmentFromArray = function (t, e, i, s) {
			e.setXYAt(t[1], t[5], "o", i), e.setXYAt(t[2], t[6], "i", i + 1), s && e.setXYAt(t[0], t[4], "v", i), e.setXYAt(t[3], t[7], "v", i + 1)
		}, f.prototype.addShapes = function (t, e, i) {
			var s, r, n, a, o, h, l, p, f = t.pathsData,
				u = t.shape.paths.shapes,
				c = t.shape.paths._length,
				d = 0,
				m = [],
				g = !0;
			for (i ? (o = i._length, p = i._length) : (i = ie.newElement(), p = o = 0), m.push(i), s = 0; s < c; s += 1) {
				for (h = f[s].lengths, i.c = u[s].c, n = u[s].c ? h.length : h.length + 1, r = 1; r < n; r += 1)
					if (d + (a = h[r - 1]).addedLength < e.s) d += a.addedLength, i.c = !1;
					else {
						if (d > e.e) {
							i.c = !1;
							break
						}
						e.s <= d && e.e >= d + a.addedLength ? (this.addSegment(u[s].v[r - 1], u[s].o[r - 1], u[s].i[r], u[s].v[r], i, o, g), g = !1) : (l = Et.getNewSegment(u[s].v[r - 1], u[s].v[r], u[s].o[r - 1], u[s].i[r], (e.s - d) / a.addedLength, (e.e - d) / a.addedLength, h[r - 1]), this.addSegmentFromArray(l, i, o, g), g = !1, i.c = !1), d += a.addedLength, o += 1
					}
				if (u[s].c && h.length) {
					if (a = h[r - 1], d <= e.e) {
						var _ = h[r - 1].addedLength;
						e.s <= d && e.e >= d + _ ? (this.addSegment(u[s].v[r - 1], u[s].o[r - 1], u[s].i[0], u[s].v[0], i, o, g), g = !1) : (l = Et.getNewSegment(u[s].v[r - 1], u[s].v[0], u[s].o[r - 1], u[s].i[0], (e.s - d) / _, (e.e - d) / _, h[r - 1]), this.addSegmentFromArray(l, i, o, g), g = !1, i.c = !1)
					} else i.c = !1;
					d += a.addedLength, o += 1
				}
				if (i._length && (i.setXYAt(i.v[p][0], i.v[p][1], "i", p), i.setXYAt(i.v[i._length - 1][0], i.v[i._length - 1][1], "o", i._length - 1)), d > e.e) break;
				s < c - 1 && (i = ie.newElement(), g = !0, m.push(i), o = 0)
			}
			return m
		}, Bt.registerModifier("tm", f), c([p], d), d.prototype.initModifierProperties = function (t, e) {
			this.getValue = this.processKeys, this.rd = Ot.getProp(t, e.r, 0, null, this), this._isAnimated = !!this.rd.effectsSequence.length
		}, d.prototype.processPath = function (t, e) {
			var i = ie.newElement();
			i.c = t.c;
			var s, r, n, a, o, h, l, p, f, u, c, d, m, g = t._length,
				_ = 0;
			for (s = 0; s < g; s += 1) r = t.v[s], a = t.o[s], n = t.i[s], r[0] === a[0] && r[1] === a[1] && r[0] === n[0] && r[1] === n[1] ? 0 !== s && s !== g - 1 || t.c ? (o = 0 === s ? t.v[g - 1] : t.v[s - 1], l = (h = Math.sqrt(Math.pow(r[0] - o[0], 2) + Math.pow(r[1] - o[1], 2))) ? Math.min(h / 2, e) / h : 0, p = d = r[0] + (o[0] - r[0]) * l, f = m = r[1] - (r[1] - o[1]) * l, u = p - (p - r[0]) * St, c = f - (f - r[1]) * St, i.setTripleAt(p, f, u, c, d, m, _), _ += 1, o = s === g - 1 ? t.v[0] : t.v[s + 1], l = (h = Math.sqrt(Math.pow(r[0] - o[0], 2) + Math.pow(r[1] - o[1], 2))) ? Math.min(h / 2, e) / h : 0, p = u = r[0] + (o[0] - r[0]) * l, f = c = r[1] + (o[1] - r[1]) * l, d = p - (p - r[0]) * St, m = f - (f - r[1]) * St, i.setTripleAt(p, f, u, c, d, m, _)) : i.setTripleAt(r[0], r[1], a[0], a[1], n[0], n[1], _) : i.setTripleAt(t.v[s][0], t.v[s][1], t.o[s][0], t.o[s][1], t.i[s][0], t.i[s][1], _), _ += 1;
			return i
		}, d.prototype.processShapes = function (t) {
			var e, i, s, r, n, a, o = this.shapes.length,
				h = this.rd.v;
			if (0 !== h)
				for (i = 0; i < o; i += 1) {
					if ((n = this.shapes[i]).shape.paths, a = n.localShapeCollection, n.shape._mdf || this._mdf || t)
						for (a.releaseShapes(), n.shape._mdf = !0, e = n.shape.paths.shapes, r = n.shape.paths._length, s = 0; s < r; s += 1) a.addShape(this.processPath(e[s], h));
					n.shape.paths = n.localShapeCollection
				}
			this.dynamicProperties.length || (this._mdf = !1)
		}, Bt.registerModifier("rd", d), c([p], m), m.prototype.initModifierProperties = function (t, e) {
			this.getValue = this.processKeys, this.c = Ot.getProp(t, e.c, 0, null, this), this.o = Ot.getProp(t, e.o, 0, null, this), this.tr = Lt.getTransformProperty(t, e.tr, this), this.so = Ot.getProp(t, e.tr.so, 0, .01, this), this.eo = Ot.getProp(t, e.tr.eo, 0, .01, this), this.data = e, this.dynamicProperties.length || this.getValue(!0), this._isAnimated = !!this.dynamicProperties.length, this.pMatrix = new Mt, this.rMatrix = new Mt, this.sMatrix = new Mt, this.tMatrix = new Mt, this.matrix = new Mt
		}, m.prototype.applyTransforms = function (t, e, i, s, r, n) {
			var a = n ? -1 : 1,
				o = s.s.v[0] + (1 - s.s.v[0]) * (1 - r),
				h = s.s.v[1] + (1 - s.s.v[1]) * (1 - r);
			t.translate(s.p.v[0] * a * r, s.p.v[1] * a * r, s.p.v[2]), e.translate(-s.a.v[0], -s.a.v[1], s.a.v[2]), e.rotate(-s.r.v * a * r), e.translate(s.a.v[0], s.a.v[1], s.a.v[2]), i.translate(-s.a.v[0], -s.a.v[1], s.a.v[2]), i.scale(n ? 1 / o : o, n ? 1 / h : h), i.translate(s.a.v[0], s.a.v[1], s.a.v[2])
		}, m.prototype.init = function (t, e, i, s) {
			this.elem = t, this.arr = e, this.pos = i, this.elemsData = s, this._currentCopies = 0, this._elements = [], this._groups = [], this.frameId = -1, this.initDynamicPropertyContainer(t), this.initModifierProperties(t, e[i]);
			for (; 0 < i;) i -= 1, this._elements.unshift(e[i]), 1;
			this.dynamicProperties.length ? this.k = !0 : this.getValue(!0)
		}, m.prototype.resetElements = function (t) {
			var e, i = t.length;
			for (e = 0; e < i; e += 1) t[e]._processed = !1, "gr" === t[e].ty && this.resetElements(t[e].it)
		}, m.prototype.cloneElements = function (t) {
			var e = (t.length, JSON.parse(JSON.stringify(t)));
			return this.resetElements(e), e
		}, m.prototype.changeGroupRender = function (t, e) {
			var i, s = t.length;
			for (i = 0; i < s; i += 1) t[i]._render = e, "gr" === t[i].ty && this.changeGroupRender(t[i].it, e)
		}, m.prototype.processShapes = function (t) {
			var e, i, s, r, n;
			if (this._mdf || t) {
				var a, o = Math.ceil(this.c.v);
				if (this._groups.length < o) {
					for (; this._groups.length < o;) {
						var h = {
							it: this.cloneElements(this._elements),
							ty: "gr"
						};
						h.it.push({
							a: {
								a: 0,
								ix: 1,
								k: [0, 0]
							},
							nm: "Transform",
							o: {
								a: 0,
								ix: 7,
								k: 100
							},
							p: {
								a: 0,
								ix: 2,
								k: [0, 0]
							},
							r: {
								a: 1,
								ix: 6,
								k: [{
									s: 0,
									e: 0,
									t: 0
								}, {
									s: 0,
									e: 0,
									t: 1
								}]
							},
							s: {
								a: 0,
								ix: 3,
								k: [100, 100]
							},
							sa: {
								a: 0,
								ix: 5,
								k: 0
							},
							sk: {
								a: 0,
								ix: 4,
								k: 0
							},
							ty: "tr"
						}), this.arr.splice(0, 0, h), this._groups.splice(0, 0, h), this._currentCopies += 1
					}
					this.elem.reloadShapes()
				}
				for (s = n = 0; s <= this._groups.length - 1; s += 1) a = n < o, this._groups[s]._render = a, this.changeGroupRender(this._groups[s].it, a), n += 1;
				this._currentCopies = o;
				var l = this.o.v,
					p = l % 1,
					f = 0 < l ? Math.floor(l) : Math.ceil(l),
					u = (this.tr.v.props, this.pMatrix.props),
					c = this.rMatrix.props,
					d = this.sMatrix.props;
				this.pMatrix.reset(), this.rMatrix.reset(), this.sMatrix.reset(), this.tMatrix.reset(), this.matrix.reset();
				var m, g, _ = 0;
				if (0 < l) {
					for (; _ < f;) this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), _ += 1;
					p && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, p, !1), _ += p)
				} else if (l < 0) {
					for (; f < _;) this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !0), _ -= 1;
					p && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, -p, !0), _ -= p)
				}
				for (s = 1 === this.data.m ? 0 : this._currentCopies - 1, r = 1 === this.data.m ? 1 : -1, n = this._currentCopies; n;) {
					if (g = (i = (e = this.elemsData[s].it)[e.length - 1].transform.mProps.v.props).length, e[e.length - 1].transform.mProps._mdf = !0, e[e.length - 1].transform.op._mdf = !0, e[e.length - 1].transform.op.v = this.so.v + (this.eo.v - this.so.v) * (s / (this._currentCopies - 1)), 0 !== _) {
						for ((0 !== s && 1 === r || s !== this._currentCopies - 1 && -1 === r) && this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), this.matrix.transform(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[9], c[10], c[11], c[12], c[13], c[14], c[15]), this.matrix.transform(d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8], d[9], d[10], d[11], d[12], d[13], d[14], d[15]), this.matrix.transform(u[0], u[1], u[2], u[3], u[4], u[5], u[6], u[7], u[8], u[9], u[10], u[11], u[12], u[13], u[14], u[15]), m = 0; m < g; m += 1) i[m] = this.matrix.props[m];
						this.matrix.reset()
					} else
						for (this.matrix.reset(), m = 0; m < g; m += 1) i[m] = this.matrix.props[m];
					_ += 1, n -= 1, s += r
				}
			} else
				for (n = this._currentCopies, s = 0, r = 1; n;) i = (e = this.elemsData[s].it)[e.length - 1].transform.mProps.v.props, e[e.length - 1].transform.mProps._mdf = !1, e[e.length - 1].transform.op._mdf = !1, n -= 1, s += r
		}, m.prototype.addShape = function () {}, Bt.registerModifier("rp", m), y.prototype.addShape = function (t) {
			this._length === this._maxLength && (this.shapes = this.shapes.concat(w(this._maxLength)), this._maxLength *= 2), this.shapes[this._length] = t, this._length += 1
		}, y.prototype.releaseShapes = function () {
			var t;
			for (t = 0; t < this._length; t += 1) ie.release(this.shapes[t]);
			this._length = 0
		}, v.prototype.getValue = function (t) {
			if ((this.elem.globalData.frameId !== this.frameId || t) && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf = this._mdf || t, this._mdf)) {
				var e = 0,
					i = this.dataProps.length;
				for ("svg" === this.renderer && (this.dashStr = ""), e = 0; e < i; e += 1) "o" != this.dataProps[e].n ? "svg" === this.renderer ? this.dashStr += " " + this.dataProps[e].p.v : this.dashArray[e] = this.dataProps[e].p.v : this.dashoffset[0] = this.dataProps[e].p.v
			}
		}, c([u], v), b.prototype.comparePoints = function (t, e) {
			for (var i = 0, s = this.o.length / 2; i < s;) {
				if (.01 < Math.abs(t[4 * i] - t[4 * e + 2 * i])) return !1;
				i += 1
			}
			return !0
		}, b.prototype.checkCollapsable = function () {
			if (this.o.length / 2 != this.c.length / 4) return !1;
			if (this.data.k.k[0].s)
				for (var t = 0, e = this.data.k.k.length; t < e;) {
					if (!this.comparePoints(this.data.k.k[t].s, this.data.p)) return !1;
					t += 1
				} else if (!this.comparePoints(this.data.k.k, this.data.p)) return !1;
			return !0
		}, b.prototype.getValue = function (t) {
			if (this.prop.getValue(), this._mdf = !1, this._cmdf = !1, this._omdf = !1, this.prop._mdf || t) {
				var e, i, s, r = 4 * this.data.p;
				for (e = 0; e < r; e += 1) i = e % 4 == 0 ? 100 : 255, s = Math.round(this.prop.v[e] * i), this.c[e] !== s && (this.c[e] = s, this._cmdf = !t);
				if (this.o.length)
					for (r = this.prop.v.length, e = 4 * this.data.p; e < r; e += 1) i = e % 2 == 0 ? 100 : 1, s = e % 2 == 0 ? Math.round(100 * this.prop.v[e]) : this.prop.v[e], this.o[e - 4 * this.data.p] !== s && (this.o[e - 4 * this.data.p] = s, this._omdf = !t);
				this._mdf = !t
			}
		}, c([u], b);
		var jt, Xt = function (t, e, i, s) {
				if (0 === e) return "";
				var r, n = t.o,
					a = t.i,
					o = t.v,
					h = " M" + s.applyToPointStringified(o[0][0], o[0][1]);
				for (r = 1; r < e; r += 1) h += " C" + s.applyToPointStringified(n[r - 1][0], n[r - 1][1]) + " " + s.applyToPointStringified(a[r][0], a[r][1]) + " " + s.applyToPointStringified(o[r][0], o[r][1]);
				return i && e && (h += " C" + s.applyToPointStringified(n[r - 1][0], n[r - 1][1]) + " " + s.applyToPointStringified(a[0][0], a[0][1]) + " " + s.applyToPointStringified(o[0][0], o[0][1]), h += "z"), h
			},
			Yt = function () {
				function t() {
					this.loadedAssets += 1, this.loadedAssets === this.totalImages && this.imagesLoadedCb && this.imagesLoadedCb(null)
				}

				function e(t) {
					var e = function (t, e, i) {
							var s = "";
							if (t.e) s = t.p;
							else if (e) {
								var r = t.p; - 1 !== r.indexOf("images/") && (r = r.split("/")[1]), s = e + r
							} else s = i, s += t.u ? t.u : "", s += t.p;
							return s
						}(t, this.assetsPath, this.path),
						i = _("img");
					i.crossOrigin = "anonymous", i.addEventListener("load", this._imageLoaded.bind(this), !1), i.addEventListener("error", function () {
						s.img = h, this._imageLoaded()
					}.bind(this), !1), i.src = e;
					var s = {
						img: i,
						assetData: t
					};
					return s
				}

				function i(t, e) {
					this.imagesLoadedCb = e;
					var i, s = t.length;
					for (i = 0; i < s; i += 1) t[i].layers || (this.totalImages += 1, this.images.push(this._createImageData(t[i])))
				}

				function s(t) {
					this.path = t || ""
				}

				function r(t) {
					this.assetsPath = t || ""
				}

				function n(t) {
					for (var e = 0, i = this.images.length; e < i;) {
						if (this.images[e].assetData === t) return this.images[e].img;
						e += 1
					}
				}

				function a() {
					this.imagesLoadedCb = null, this.images.length = 0
				}

				function o() {
					return this.totalImages === this.loadedAssets
				}
				var h = function () {
					var t = _("canvas");
					t.width = 1, t.height = 1;
					var e = t.getContext("2d");
					return e.fillStyle = "#FF0000", e.fillRect(0, 0, 1, 1), t
				}();
				return function () {
					this.loadAssets = i, this.setAssetsPath = r, this.setPath = s, this.loaded = o, this.destroy = a, this.getImage = n, this._createImageData = e, this._imageLoaded = t, this.assetsPath = "", this.path = "", this.totalImages = 0, this.loadedAssets = 0, this.imagesLoadedCb = null, this.images = []
				}
			}(),
			qt = (jt = {
				maskType: !0
			}, (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) && (jt.maskType = !1), jt),
			Gt = {
				createFilter: function (t) {
					var e = k("filter");
					return e.setAttribute("id", t), e.setAttribute("filterUnits", "objectBoundingBox"), e.setAttribute("x", "0%"), e.setAttribute("y", "0%"), e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e
				},
				createAlphaToLuminanceFilter: function () {
					var t = k("feColorMatrix");
					return t.setAttribute("type", "matrix"), t.setAttribute("color-interpolation-filters", "sRGB"), t.setAttribute("values", "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1"), t
				}
			},
			Wt = function () {
				function n(t) {
					return t.response && "object" == typeof t.response ? t.response : t.response && "string" == typeof t.response ? JSON.parse(t.response) : t.responseText ? JSON.parse(t.responseText) : void 0
				}
				return {
					load: function (t, e, i) {
						var s, r = new XMLHttpRequest;
						r.open("GET", t, !0), r.responseType = "json", r.send(), r.onreadystatechange = function () {
							if (4 == r.readyState)
								if (200 == r.status) s = n(r), e(s);
								else try {
									s = n(r), e(s)
								} catch (t) {
									i && i(t)
								}
						}
					}
				}
			}();
		x.prototype.searchProperties = function () {
			var t, e, i = this._textData.a.length,
				s = Ot.getProp;
			for (t = 0; t < i; t += 1) e = this._textData.a[t], this._animatorsData[t] = new P(this._elem, e, this);
			this._textData.p && "m" in this._textData.p ? (this._pathData = {
				f: s(this._elem, this._textData.p.f, 0, 0, this),
				l: s(this._elem, this._textData.p.l, 0, 0, this),
				r: this._textData.p.r,
				m: this._elem.maskManager.getMaskProperty(this._textData.p.m)
			}, this._hasMaskedPath = !0) : this._hasMaskedPath = !1, this._moreOptions.alignment = s(this._elem, this._textData.m.a, 1, 0, this)
		}, x.prototype.getMeasures = function (t, e) {
			if (this.lettersChangedFlag = e, this._mdf || this._isFirstFrame || e || this._hasMaskedPath && this._pathData.m._mdf) {
				this._isFirstFrame = !1;
				var i, s, r, n, a, o, h, l, p, f, u, c, d, m, g, _, y, v, b, x = this._moreOptions.alignment.v,
					T = this._animatorsData,
					w = this._textData,
					k = this.mHelper,
					P = this._renderType,
					A = this.renderedLetters.length,
					S = (this.data, t.l);
				if (this._hasMaskedPath) {
					if (b = this._pathData.m, !this._pathData.n || this._pathData._mdf) {
						var D, C = b.v;
						for (this._pathData.r && (C = C.reverse()), a = {
								tLength: 0,
								segments: []
							}, n = C._length - 1, r = _ = 0; r < n; r += 1) D = {
							s: C.v[r],
							e: C.v[r + 1],
							to: [C.o[r][0] - C.v[r][0], C.o[r][1] - C.v[r][1]],
							ti: [C.i[r + 1][0] - C.v[r + 1][0], C.i[r + 1][1] - C.v[r + 1][1]]
						}, Et.buildBezierData(D), a.tLength += D.bezierData.segmentLength, a.segments.push(D), _ += D.bezierData.segmentLength;
						r = n, b.v.c && (D = {
							s: C.v[r],
							e: C.v[0],
							to: [C.o[r][0] - C.v[r][0], C.o[r][1] - C.v[r][1]],
							ti: [C.i[0][0] - C.v[0][0], C.i[0][1] - C.v[0][1]]
						}, Et.buildBezierData(D), a.tLength += D.bezierData.segmentLength, a.segments.push(D), _ += D.bezierData.segmentLength), this._pathData.pi = a
					}
					if (a = this._pathData.pi, o = this._pathData.f.v, f = 1, p = !(l = u = 0), m = a.segments, o < 0 && b.v.c)
						for (a.tLength < Math.abs(o) && (o = -Math.abs(o) % a.tLength), f = (d = m[u = m.length - 1].bezierData.points).length - 1; o < 0;) o += d[f].partialLength, (f -= 1) < 0 && (f = (d = m[u -= 1].bezierData.points).length - 1);
					c = (d = m[u].bezierData.points)[f - 1], g = (h = d[f]).partialLength
				}
				n = S.length, s = i = 0;
				var M, F, E, I, R = 1.2 * t.finalSize * .714,
					O = !0;
				E = T.length;
				var L, z, N, V, B, j, X, Y, q, G, W, U, H, Z = -1,
					$ = o,
					Q = u,
					K = f,
					J = -1,
					tt = "",
					et = this.defaultPropsArray;
				if (2 === t.j || 1 === t.j) {
					var it = 0,
						st = 0,
						rt = 2 === t.j ? -.5 : -1,
						nt = 0,
						at = !0;
					for (r = 0; r < n; r += 1)
						if (S[r].n) {
							for (it && (it += st); nt < r;) S[nt].animatorJustifyOffset = it, nt += 1;
							at = !(it = 0)
						} else {
							for (F = 0; F < E; F += 1)(M = T[F].a).t.propType && (at && 2 === t.j && (st += M.t.v * rt), it += (L = T[F].s.getMult(S[r].anIndexes[F], w.a[F].s.totalChars)).length ? M.t.v * L[0] * rt : M.t.v * L * rt);
							at = !1
						}
					for (it && (it += st); nt < r;) S[nt].animatorJustifyOffset = it, nt += 1
				}
				for (r = 0; r < n; r += 1) {
					if (k.reset(), B = 1, S[r].n) i = 0, s += t.yOffset, s += O ? 1 : 0, o = $, O = !1, 0, this._hasMaskedPath && (f = K, c = (d = m[u = Q].bezierData.points)[f - 1], g = (h = d[f]).partialLength, l = 0), H = G = U = tt = "", et = this.defaultPropsArray;
					else {
						if (this._hasMaskedPath) {
							if (J !== S[r].line) {
								switch (t.j) {
									case 1:
										o += _ - t.lineWidths[S[r].line];
										break;
									case 2:
										o += (_ - t.lineWidths[S[r].line]) / 2
								}
								J = S[r].line
							}
							Z !== S[r].ind && (S[Z] && (o += S[Z].extra), o += S[r].an / 2, Z = S[r].ind), o += x[0] * S[r].an / 200;
							var ot = 0;
							for (F = 0; F < E; F += 1)(M = T[F].a).p.propType && (ot += (L = T[F].s.getMult(S[r].anIndexes[F], w.a[F].s.totalChars)).length ? M.p.v[0] * L[0] : M.p.v[0] * L), M.a.propType && (ot += (L = T[F].s.getMult(S[r].anIndexes[F], w.a[F].s.totalChars)).length ? M.a.v[0] * L[0] : M.a.v[0] * L);
							for (p = !0; p;) o + ot <= l + g || !d ? (y = (o + ot - l) / h.partialLength, N = c.point[0] + (h.point[0] - c.point[0]) * y, V = c.point[1] + (h.point[1] - c.point[1]) * y, k.translate(-x[0] * S[r].an / 200, -x[1] * R / 100), p = !1) : d && (l += h.partialLength, (f += 1) >= d.length && (f = 0, m[u += 1] ? d = m[u].bezierData.points : b.v.c ? d = m[u = f = 0].bezierData.points : (l -= h.partialLength, d = null)), d && (c = h, g = (h = d[f]).partialLength));
							z = S[r].an / 2 - S[r].add, k.translate(-z, 0, 0)
						} else z = S[r].an / 2 - S[r].add, k.translate(-z, 0, 0), k.translate(-x[0] * S[r].an / 200, -x[1] * R / 100, 0);
						for (S[r].l / 2, F = 0; F < E; F += 1)(M = T[F].a).t.propType && (L = T[F].s.getMult(S[r].anIndexes[F], w.a[F].s.totalChars), 0 === i && 0 === t.j || (this._hasMaskedPath ? o += L.length ? M.t.v * L[0] : M.t.v * L : i += L.length ? M.t.v * L[0] : M.t.v * L));
						for (S[r].l / 2, t.strokeWidthAnim && (X = t.sw || 0), t.strokeColorAnim && (j = t.sc ? [t.sc[0], t.sc[1], t.sc[2]] : [0, 0, 0]), t.fillColorAnim && t.fc && (Y = [t.fc[0], t.fc[1], t.fc[2]]), F = 0; F < E; F += 1)(M = T[F].a).a.propType && ((L = T[F].s.getMult(S[r].anIndexes[F], w.a[F].s.totalChars)).length ? k.translate(-M.a.v[0] * L[0], -M.a.v[1] * L[1], M.a.v[2] * L[2]) : k.translate(-M.a.v[0] * L, -M.a.v[1] * L, M.a.v[2] * L));
						for (F = 0; F < E; F += 1)(M = T[F].a).s.propType && ((L = T[F].s.getMult(S[r].anIndexes[F], w.a[F].s.totalChars)).length ? k.scale(1 + (M.s.v[0] - 1) * L[0], 1 + (M.s.v[1] - 1) * L[1], 1) : k.scale(1 + (M.s.v[0] - 1) * L, 1 + (M.s.v[1] - 1) * L, 1));
						for (F = 0; F < E; F += 1) {
							if (M = T[F].a, L = T[F].s.getMult(S[r].anIndexes[F], w.a[F].s.totalChars), M.sk.propType && (L.length ? k.skewFromAxis(-M.sk.v * L[0], M.sa.v * L[1]) : k.skewFromAxis(-M.sk.v * L, M.sa.v * L)), M.r.propType && (L.length ? k.rotateZ(-M.r.v * L[2]) : k.rotateZ(-M.r.v * L)), M.ry.propType && (L.length ? k.rotateY(M.ry.v * L[1]) : k.rotateY(M.ry.v * L)), M.rx.propType && (L.length ? k.rotateX(M.rx.v * L[0]) : k.rotateX(M.rx.v * L)), M.o.propType && (B += L.length ? (M.o.v * L[0] - B) * L[0] : (M.o.v * L - B) * L), t.strokeWidthAnim && M.sw.propType && (X += L.length ? M.sw.v * L[0] : M.sw.v * L), t.strokeColorAnim && M.sc.propType)
								for (q = 0; q < 3; q += 1) L.length ? j[q] = j[q] + (M.sc.v[q] - j[q]) * L[0] : j[q] = j[q] + (M.sc.v[q] - j[q]) * L;
							if (t.fillColorAnim && t.fc) {
								if (M.fc.propType)
									for (q = 0; q < 3; q += 1) L.length ? Y[q] = Y[q] + (M.fc.v[q] - Y[q]) * L[0] : Y[q] = Y[q] + (M.fc.v[q] - Y[q]) * L;
								M.fh.propType && (Y = L.length ? ft(Y, M.fh.v * L[0]) : ft(Y, M.fh.v * L)), M.fs.propType && (Y = L.length ? lt(Y, M.fs.v * L[0]) : lt(Y, M.fs.v * L)), M.fb.propType && (Y = L.length ? pt(Y, M.fb.v * L[0]) : pt(Y, M.fb.v * L))
							}
						}
						for (F = 0; F < E; F += 1)(M = T[F].a).p.propType && (L = T[F].s.getMult(S[r].anIndexes[F], w.a[F].s.totalChars), this._hasMaskedPath ? L.length ? k.translate(0, M.p.v[1] * L[0], -M.p.v[2] * L[1]) : k.translate(0, M.p.v[1] * L, -M.p.v[2] * L) : L.length ? k.translate(M.p.v[0] * L[0], M.p.v[1] * L[1], -M.p.v[2] * L[2]) : k.translate(M.p.v[0] * L, M.p.v[1] * L, -M.p.v[2] * L));
						if (t.strokeWidthAnim && (G = X < 0 ? 0 : X), t.strokeColorAnim && (W = "rgb(" + Math.round(255 * j[0]) + "," + Math.round(255 * j[1]) + "," + Math.round(255 * j[2]) + ")"), t.fillColorAnim && t.fc && (U = "rgb(" + Math.round(255 * Y[0]) + "," + Math.round(255 * Y[1]) + "," + Math.round(255 * Y[2]) + ")"), this._hasMaskedPath) {
							if (k.translate(0, -t.ls), k.translate(0, x[1] * R / 100 + s, 0), w.p.p) {
								v = (h.point[1] - c.point[1]) / (h.point[0] - c.point[0]);
								var ht = 180 * Math.atan(v) / Math.PI;
								h.point[0] < c.point[0] && (ht += 180), k.rotate(-ht * Math.PI / 180)
							}
							k.translate(N, V, 0), o -= x[0] * S[r].an / 200, S[r + 1] && Z !== S[r + 1].ind && (o += S[r].an / 2, o += t.tr / 1e3 * t.finalSize)
						} else {
							switch (k.translate(i, s, 0), t.ps && k.translate(t.ps[0], t.ps[1] + t.ascent, 0), t.j) {
								case 1:
									k.translate(S[r].animatorJustifyOffset + t.justifyOffset + (t.boxWidth - t.lineWidths[S[r].line]), 0, 0);
									break;
								case 2:
									k.translate(S[r].animatorJustifyOffset + t.justifyOffset + (t.boxWidth - t.lineWidths[S[r].line]) / 2, 0, 0)
							}
							k.translate(0, -t.ls), k.translate(z, 0, 0), k.translate(x[0] * S[r].an / 200, x[1] * R / 100, 0), i += S[r].l + t.tr / 1e3 * t.finalSize
						}
						"html" === P ? tt = k.toCSS() : "svg" === P ? tt = k.to2dCSS() : et = [k.props[0], k.props[1], k.props[2], k.props[3], k.props[4], k.props[5], k.props[6], k.props[7], k.props[8], k.props[9], k.props[10], k.props[11], k.props[12], k.props[13], k.props[14], k.props[15]], H = B
					}
					A <= r ? (I = new ut(H, G, W, U, tt, et), this.renderedLetters.push(I), A += 1, this.lettersChangedFlag = !0) : (I = this.renderedLetters[r], this.lettersChangedFlag = I.update(H, G, W, U, tt, et) || this.lettersChangedFlag)
				}
			}
		}, x.prototype.getValue = function () {
			this._elem.globalData.frameId !== this._frameId && (this._frameId = this._elem.globalData.frameId, this.iterateDynamicProperties())
		}, x.prototype.mHelper = new Mt, x.prototype.defaultPropsArray = [], c([u], x), ut.prototype.update = function (t, e, i, s, r, n) {
			this._mdf.o = !1, this._mdf.sw = !1, this._mdf.sc = !1, this._mdf.fc = !1, this._mdf.m = !1;
			var a = this._mdf.p = !1;
			return this.o !== t && (this.o = t, a = this._mdf.o = !0), this.sw !== e && (this.sw = e, a = this._mdf.sw = !0), this.sc !== i && (this.sc = i, a = this._mdf.sc = !0), this.fc !== s && (this.fc = s, a = this._mdf.fc = !0), this.m !== r && (this.m = r, a = this._mdf.m = !0), !n.length || this.p[0] === n[0] && this.p[1] === n[1] && this.p[4] === n[4] && this.p[5] === n[5] && this.p[12] === n[12] && this.p[13] === n[13] || (this.p = n, a = this._mdf.p = !0), a
		}, A.prototype.defaultBoxWidth = [0, 0], A.prototype.copyData = function (t, e) {
			for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
			return t
		}, A.prototype.setCurrentData = function (t) {
			t.__complete || this.completeTextData(t), this.currentData = t, this.currentData.boxWidth = this.currentData.boxWidth || this.defaultBoxWidth, this._mdf = !0
		}, A.prototype.searchProperty = function () {
			return this.searchKeyframes()
		}, A.prototype.searchKeyframes = function () {
			return this.kf = 1 < this.data.d.k.length, this.kf && this.addEffect(this.getKeyframeValue.bind(this)), this.kf
		}, A.prototype.addEffect = function (t) {
			this.effectsSequence.push(t), this.elem.addDynamicProperty(this)
		}, A.prototype.getValue = function (t) {
			if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length || t) {
				var e = this.currentData,
					i = this.keysIndex;
				if (this.lock) return void this.setCurrentData(this.currentData, currentTextValue);
				this.lock = !0, this._mdf = !1;
				var s, r = this.effectsSequence.length,
					n = t || this.data.d.k[this.keysIndex].s;
				for (s = 0; s < r; s += 1) n = i !== this.keysIndex ? this.effectsSequence[s](n, n.t) : this.effectsSequence[s](this.currentData, n.t);
				e !== n && this.setCurrentData(n), this.pv = this.v = this.currentData, this.lock = !1, this.frameId = this.elem.globalData.frameId
			}
		}, A.prototype.getKeyframeValue = function () {
			for (var t = this.data.d.k, e = this.elem.comp.renderedFrame, i = 0, s = t.length; i <= s - 1 && (t[i].s, !(i === s - 1 || t[i + 1].t > e));) i += 1;
			return this.keysIndex !== i && (this.keysIndex = i), this.data.d.k[this.keysIndex].s
		}, A.prototype.buildFinalText = function (t) {
			for (var e = Rt.getCombinedCharacterCodes(), i = [], s = 0, r = t.length; s < r;) - 1 !== e.indexOf(t.charCodeAt(s)) ? i[i.length - 1] += t.charAt(s) : i.push(t.charAt(s)), s += 1;
			return i
		}, A.prototype.completeTextData = function (t) {
			t.__complete = !0;
			var e, i, s, r, n, a, o, h = this.elem.globalData.fontManager,
				l = this.data,
				p = [],
				f = 0,
				u = l.m.g,
				c = 0,
				d = 0,
				m = 0,
				g = [],
				_ = 0,
				y = 0,
				v = h.getFontByName(t.f),
				b = 0,
				x = v.fStyle ? v.fStyle.split(" ") : [],
				T = "normal",
				w = "normal";
			for (i = x.length, e = 0; e < i; e += 1) switch (x[e].toLowerCase()) {
				case "italic":
					w = "italic";
					break;
				case "bold":
					T = "700";
					break;
				case "black":
					T = "900";
					break;
				case "medium":
					T = "500";
					break;
				case "regular":
				case "normal":
					T = "400";
					break;
				case "light":
				case "thin":
					T = "200"
			}
			t.fWeight = v.fWeight || T, t.fStyle = w, i = t.t.length, t.finalSize = t.s, t.finalText = this.buildFinalText(t.t), t.finalLineHeight = t.lh;
			var k, P = t.tr / 1e3 * t.finalSize;
			if (t.sz)
				for (var A, S, D = !0, C = t.sz[0], M = t.sz[1]; D;) {
					_ = A = 0, i = (S = this.buildFinalText(t.t)).length, P = t.tr / 1e3 * t.finalSize;
					var F = -1;
					for (e = 0; e < i; e += 1) k = S[e].charCodeAt(0), s = !1, " " === S[e] ? F = e : 13 !== k && 3 !== k || (s = !(_ = 0), A += t.finalLineHeight || 1.2 * t.finalSize), h.chars ? (o = h.getCharData(S[e], v.fStyle, v.fFamily), b = s ? 0 : o.w * t.finalSize / 100) : b = h.measureText(S[e], t.f, t.finalSize), C < _ + b && " " !== S[e] ? (-1 === F ? i += 1 : e = F, A += t.finalLineHeight || 1.2 * t.finalSize, S.splice(e, F === e ? 1 : 0, "\r"), F = -1, _ = 0) : (_ += b, _ += P);
					A += v.ascent * t.finalSize / 100, this.canResize && t.finalSize > this.minimumFontSize && M < A ? (t.finalSize -= 1, t.finalLineHeight = t.finalSize * t.lh / t.s) : (t.finalText = S, i = t.finalText.length, D = !1)
				}
			_ = -P;
			var E, I = b = 0;
			for (e = 0; e < i; e += 1)
				if (s = !1, k = (E = t.finalText[e]).charCodeAt(0), " " === E ? r = " " : 13 === k || 3 === k ? (I = 0, g.push(_), y = y < _ ? _ : y, _ = -2 * P, s = !(r = ""), m += 1) : r = t.finalText[e], h.chars ? (o = h.getCharData(E, v.fStyle, h.getFontByName(t.f).fFamily), b = s ? 0 : o.w * t.finalSize / 100) : b = h.measureText(r, t.f, t.finalSize), " " === E ? I += b + P : (_ += b + P + I, I = 0), p.push({
						l: b,
						an: b,
						add: c,
						n: s,
						anIndexes: [],
						val: r,
						line: m,
						animatorJustifyOffset: 0
					}), 2 == u) {
					if (c += b, "" === r || " " === r || e === i - 1) {
						for ("" !== r && " " !== r || (c -= b); d <= e;) p[d].an = c, p[d].ind = f, p[d].extra = b, d += 1;
						f += 1, c = 0
					}
				} else if (3 == u) {
				if (c += b, "" === r || e === i - 1) {
					for ("" === r && (c -= b); d <= e;) p[d].an = c, p[d].ind = f, p[d].extra = b, d += 1;
					c = 0, f += 1
				}
			} else p[f].ind = f, p[f].extra = 0, f += 1;
			if (t.l = p, y = y < _ ? _ : y, g.push(_), t.sz) t.boxWidth = t.sz[0], t.justifyOffset = 0;
			else switch (t.boxWidth = y, t.j) {
				case 1:
					t.justifyOffset = -t.boxWidth;
					break;
				case 2:
					t.justifyOffset = -t.boxWidth / 2;
					break;
				default:
					t.justifyOffset = 0
			}
			t.lineWidths = g;
			var R, O, L = l.a;
			a = L.length;
			var z, N, V = [];
			for (n = 0; n < a; n += 1) {
				for ((R = L[n]).a.sc && (t.strokeColorAnim = !0), R.a.sw && (t.strokeWidthAnim = !0), (R.a.fc || R.a.fh || R.a.fs || R.a.fb) && (t.fillColorAnim = !0), N = 0, z = R.s.b, e = 0; e < i; e += 1)(O = p[e]).anIndexes[n] = N, (1 == z && "" !== O.val || 2 == z && "" !== O.val && " " !== O.val || 3 == z && (O.n || " " == O.val || e == i - 1) || 4 == z && (O.n || e == i - 1)) && (1 === R.s.rn && V.push(N), N += 1);
				l.a[n].s.totalChars = N;
				var B, j = -1;
				if (1 === R.s.rn)
					for (e = 0; e < i; e += 1) j != (O = p[e]).anIndexes[n] && (j = O.anIndexes[n], B = V.splice(Math.floor(Math.random() * V.length), 1)[0]), O.anIndexes[n] = B
			}
			t.yOffset = t.finalLineHeight || 1.2 * t.finalSize, t.ls = t.ls || 0, t.ascent = v.ascent * t.finalSize / 100
		}, A.prototype.updateDocumentData = function (t, e) {
			e = void 0 === e ? this.keysIndex : e;
			var i = this.copyData({}, this.data.d.k[e].s);
			i = this.copyData(i, t), this.data.d.k[e].s = i, this.recalculate(e), this.elem.addDynamicProperty(this)
		}, A.prototype.recalculate = function (t) {
			var e = this.data.d.k[t].s;
			e.__complete = !1, this.keysIndex = 0, this._isFirstFrame = !0, this.getValue(e)
		}, A.prototype.canResizeFont = function (t) {
			this.canResize = t, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this)
		}, A.prototype.setMinimumFontSize = function (t) {
			this.minimumFontSize = Math.floor(t) || 1, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this)
		};
		var Ut, Ht, Zt, $t, Qt, Kt = function () {
				function s(t, e) {
					this._currentTextLength = -1, this.k = !1, this.data = e, this.elem = t, this.comp = t.comp, this.finalS = 0, this.finalE = 0, this.initDynamicPropertyContainer(t), this.s = Ot.getProp(t, e.s || {
						k: 0
					}, 0, 0, this), this.e = "e" in e ? Ot.getProp(t, e.e, 0, 0, this) : {
						v: 100
					}, this.o = Ot.getProp(t, e.o || {
						k: 0
					}, 0, 0, this), this.xe = Ot.getProp(t, e.xe || {
						k: 0
					}, 0, 0, this), this.ne = Ot.getProp(t, e.ne || {
						k: 0
					}, 0, 0, this), this.a = Ot.getProp(t, e.a, 0, .01, this), this.dynamicProperties.length || this.getValue()
				}
				var l = Math.max,
					p = Math.min,
					f = Math.floor;
				return s.prototype = {
					getMult: function (t) {
						this._currentTextLength !== this.elem.textProperty.currentData.l.length && this.getValue();
						var e = Ft.getBezierEasing(this.ne.v / 100, 0, 1 - this.xe.v / 100, 1).get,
							i = 0,
							s = this.finalS,
							r = this.finalE,
							n = this.data.sh;
						if (2 == n) i = e(i = r === s ? r <= t ? 1 : 0 : l(0, p(.5 / (r - s) + (t - s) / (r - s), 1)));
						else if (3 == n) i = e(i = r === s ? r <= t ? 0 : 1 : 1 - l(0, p(.5 / (r - s) + (t - s) / (r - s), 1)));
						else if (4 == n) r === s ? i = 0 : (i = l(0, p(.5 / (r - s) + (t - s) / (r - s), 1))) < .5 ? i *= 2 : i = 1 - 2 * (i - .5), i = e(i);
						else if (5 == n) {
							if (r === s) i = 0;
							else {
								var a = r - s,
									o = -a / 2 + (t = p(l(0, t + .5 - s), r - s)),
									h = a / 2;
								i = Math.sqrt(1 - o * o / (h * h))
							}
							i = e(i)
						} else 6 == n ? r === s ? i = 0 : (t = p(l(0, t + .5 - s), r - s), i = (1 + Math.cos(Math.PI + 2 * Math.PI * t / (r - s))) / 2) : t >= f(s) && (i = t - s < 0 ? 1 - (s - t) : l(0, p(r - t, 1))), i = e(i);
						return i * this.a.v
					},
					getValue: function (t) {
						this.iterateDynamicProperties(), this._mdf = t || this._mdf, this._currentTextLength = this.elem.textProperty.currentData.l.length || 0, t && 2 === this.data.r && (this.e.v = this._currentTextLength);
						var e = 2 === this.data.r ? 1 : 100 / this.data.totalChars,
							i = this.o.v / e,
							s = this.s.v / e + i,
							r = this.e.v / e + i;
						if (r < s) {
							var n = s;
							s = r, r = n
						}
						this.finalS = s, this.finalE = r
					}
				}, c([u], s), {
					getTextSelectorProp: function (t, e, i) {
						return new s(t, e, i)
					}
				}
			}(),
			Jt = function (t, e, i, s) {
				var r = 0,
					n = t,
					a = w(n);
				return {
					newElement: function () {
						return r ? a[r -= 1] : e()
					},
					release: function (t) {
						r === n && (a = te.double(a), n *= 2), i && i(t), a[r] = t, r += 1
					}
				}
			},
			te = {
				double: function (t) {
					return t.concat(w(t.length))
				}
			},
			ee = Jt(8, function () {
				return Ct("float32", 2)
			}),
			ie = ((Qt = Jt(4, function () {
				return new l
			}, function (t) {
				var e, i = t._length;
				for (e = 0; e < i; e += 1) ee.release(t.v[e]), ee.release(t.i[e]), ee.release(t.o[e]), t.v[e] = null, t.i[e] = null, t.o[e] = null;
				t._length = 0, t.c = !1
			})).clone = function (t) {
				var e, i = Qt.newElement(),
					s = void 0 === t._length ? t.v.length : t._length;
				for (i.setLength(s), i.c = t.c, e = 0; e < s; e += 1) i.setTripleAt(t.v[e][0], t.v[e][1], t.o[e][0], t.o[e][1], t.i[e][0], t.i[e][1], e);
				return i
			}, Qt),
			se = (Ut = {
				newShapeCollection: function () {
					var t;
					return t = Ht ? $t[Ht -= 1] : new y, t
				},
				release: function (t) {
					var e, i = t._length;
					for (e = 0; e < i; e += 1) ie.release(t.shapes[e]);
					t._length = 0, Ht === Zt && ($t = te.double($t), Zt *= 2), $t[Ht] = t, Ht += 1
				}
			}, Ht = 0, $t = w(Zt = 4), Ut),
			re = Jt(8, function () {
				return {
					lengths: [],
					totalLength: 0
				}
			}, function (t) {
				var e, i = t.lengths.length;
				for (e = 0; e < i; e += 1) ne.release(t.lengths[e]);
				t.lengths.length = 0
			}),
			ne = Jt(8, function () {
				return {
					addedLength: 0,
					percents: Ct("float32", Pt),
					lengths: Ct("float32", Pt)
				}
			});
		S.prototype.checkLayers = function (t) {
			var e, i, s = this.layers.length;
			for (this.completeLayers = !0, e = s - 1; 0 <= e; e--) this.elements[e] || (i = this.layers[e]).ip - i.st <= t - this.layers[e].st && i.op - i.st > t - this.layers[e].st && this.buildItem(e), this.completeLayers = !!this.elements[e] && this.completeLayers;
			this.checkPendingElements()
		}, S.prototype.createItem = function (t) {
			switch (t.ty) {
				case 2:
					return this.createImage(t);
				case 0:
					return this.createComp(t);
				case 1:
					return this.createSolid(t);
				case 3:
					return this.createNull(t);
				case 4:
					return this.createShape(t);
				case 5:
					return this.createText(t);
				case 13:
					return this.createCamera(t)
			}
			return this.createNull(t)
		}, S.prototype.createCamera = function () {
			throw new Error("You're using a 3d camera. Try the html renderer.")
		}, S.prototype.buildAllItems = function () {
			var t, e = this.layers.length;
			for (t = 0; t < e; t += 1) this.buildItem(t);
			this.checkPendingElements()
		}, S.prototype.includeLayers = function (t) {
			this.completeLayers = !1;
			var e, i, s = t.length,
				r = this.layers.length;
			for (e = 0; e < s; e += 1)
				for (i = 0; i < r;) {
					if (this.layers[i].id == t[e].id) {
						this.layers[i] = t[e];
						break
					}
					i += 1
				}
		}, S.prototype.setProjectInterface = function (t) {
			this.globalData.projectInterface = t
		}, S.prototype.initItems = function () {
			this.globalData.progressiveLoad || this.buildAllItems()
		}, S.prototype.buildElementParenting = function (t, e, i) {
			for (var s = this.elements, r = this.layers, n = 0, a = r.length; n < a;) r[n].ind == e && (s[n] && !0 !== s[n] ? (i.push(s[n]), s[n].setAsParent(), void 0 !== r[n].parent ? this.buildElementParenting(t, r[n].parent, i) : t.setHierarchy(i)) : (this.buildItem(n), this.addPendingElement(t))), n += 1
		}, S.prototype.addPendingElement = function (t) {
			this.pendingElements.push(t)
		}, S.prototype.searchExtraCompositions = function (t) {
			var e, i = t.length;
			for (e = 0; e < i; e += 1)
				if (t[e].xt) {
					var s = this.createComp(t[e]);
					s.initExpressions(), this.globalData.projectInterface.registerComposition(s)
				}
		}, S.prototype.setupGlobalData = function (t, e) {
			this.globalData.fontManager = new Rt, this.globalData.fontManager.addChars(t.chars), this.globalData.fontManager.addFonts(t.fonts, e), this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem), this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem), this.globalData.imageLoader = this.animationItem.imagePreloader, this.globalData.frameId = 0, this.globalData.frameRate = t.fr, this.globalData.nm = t.nm, this.globalData.compSize = {
				w: t.w,
				h: t.h
			}
		}, c([S], D), D.prototype.createNull = function (t) {
			return new G(t, this.globalData, this)
		}, D.prototype.createShape = function (t) {
			return new tt(t, this.globalData, this)
		}, D.prototype.createText = function (t) {
			return new J(t, this.globalData, this)
		}, D.prototype.createImage = function (t) {
			return new $(t, this.globalData, this)
		}, D.prototype.createComp = function (t) {
			return new K(t, this.globalData, this)
		}, D.prototype.createSolid = function (t) {
			return new Q(t, this.globalData, this)
		}, D.prototype.configAnimation = function (t) {
			this.svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.renderConfig.viewBoxSize ? this.svgElement.setAttribute("viewBox", this.renderConfig.viewBoxSize) : this.svgElement.setAttribute("viewBox", "0 0 " + t.w + " " + t.h), this.renderConfig.viewBoxOnly || (this.svgElement.setAttribute("width", t.w), this.svgElement.setAttribute("height", t.h), this.svgElement.style.width = "100%", this.svgElement.style.height = "100%", this.svgElement.style.transform = "translate3d(0,0,0)"), this.renderConfig.className && this.svgElement.setAttribute("class", this.renderConfig.className), this.svgElement.setAttribute("preserveAspectRatio", this.renderConfig.preserveAspectRatio), this.animationItem.wrapper.appendChild(this.svgElement);
			var e = this.globalData.defs;
			this.setupGlobalData(t, e), this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.data = t;
			var i = k("clipPath"),
				s = k("rect");
			s.setAttribute("width", t.w), s.setAttribute("height", t.h), s.setAttribute("x", 0), s.setAttribute("y", 0);
			var r = "animationMask_" + T(10);
			i.setAttribute("id", r), i.appendChild(s), this.layerElement.setAttribute("clip-path", "url(" + _t + "#" + r + ")"), e.appendChild(i), this.layers = t.layers, this.elements = w(t.layers.length)
		}, D.prototype.destroy = function () {
			this.animationItem.wrapper.innerHTML = "", this.layerElement = null, this.globalData.defs = null;
			var t, e = this.layers ? this.layers.length : 0;
			for (t = 0; t < e; t++) this.elements[t] && this.elements[t].destroy();
			this.elements.length = 0, this.destroyed = !0, this.animationItem = null
		}, D.prototype.updateContainerSize = function () {}, D.prototype.buildItem = function (t) {
			var e = this.elements;
			if (!e[t] && 99 != this.layers[t].ty) {
				e[t] = !0;
				var i = this.createItem(this.layers[t]);
				e[t] = i, mt && (0 === this.layers[t].ty && this.globalData.projectInterface.registerComposition(i), i.initExpressions()), this.appendElementInPos(i, t), this.layers[t].tt && (this.elements[t - 1] && !0 !== this.elements[t - 1] ? i.setMatte(e[t - 1].layerId) : (this.buildItem(t - 1), this.addPendingElement(i)))
			}
		}, D.prototype.checkPendingElements = function () {
			for (; this.pendingElements.length;) {
				var t = this.pendingElements.pop();
				if (t.checkParenting(), t.data.tt)
					for (var e = 0, i = this.elements.length; e < i;) {
						if (this.elements[e] === t) {
							t.setMatte(this.elements[e - 1].layerId);
							break
						}
						e += 1
					}
			}
		}, D.prototype.renderFrame = function (t) {
			if (this.renderedFrame !== t && !this.destroyed) {
				null === t ? t = this.renderedFrame : this.renderedFrame = t, this.globalData.frameNum = t, this.globalData.frameId += 1, this.globalData.projectInterface.currentFrame = t, this.globalData._mdf = !1;
				var e, i = this.layers.length;
				for (this.completeLayers || this.checkLayers(t), e = i - 1; 0 <= e; e--)(this.completeLayers || this.elements[e]) && this.elements[e].prepareFrame(t - this.layers[e].st);
				if (this.globalData._mdf)
					for (e = 0; e < i; e += 1)(this.completeLayers || this.elements[e]) && this.elements[e].renderFrame()
			}
		}, D.prototype.appendElementInPos = function (t, e) {
			var i = t.getBaseElement();
			if (i) {
				for (var s, r = 0; r < e;) this.elements[r] && !0 !== this.elements[r] && this.elements[r].getBaseElement() && (s = this.elements[r].getBaseElement()), r += 1;
				s ? this.layerElement.insertBefore(i, s) : this.layerElement.appendChild(i)
			}
		}, D.prototype.hide = function () {
			this.layerElement.style.display = "none"
		}, D.prototype.show = function () {
			this.layerElement.style.display = "block"
		}, C.prototype.getMaskProperty = function (t) {
			return this.viewData[t].prop
		}, C.prototype.renderFrame = function (t) {
			var e, i = this.element.finalTransform.mat,
				s = this.masksProperties.length;
			for (e = 0; e < s; e++)
				if ((this.viewData[e].prop._mdf || t) && this.drawPath(this.masksProperties[e], this.viewData[e].prop.v, this.viewData[e]), (this.viewData[e].op._mdf || t) && this.viewData[e].elem.setAttribute("fill-opacity", this.viewData[e].op.v), "n" !== this.masksProperties[e].mode && (this.viewData[e].invRect && (this.element.finalTransform.mProp._mdf || t) && (this.viewData[e].invRect.setAttribute("x", -i.props[12]), this.viewData[e].invRect.setAttribute("y", -i.props[13])), this.storedData[e].x && (this.storedData[e].x._mdf || t))) {
					var r = this.storedData[e].expan;
					this.storedData[e].x.v < 0 ? ("erode" !== this.storedData[e].lastOperator && (this.storedData[e].lastOperator = "erode", this.storedData[e].elem.setAttribute("filter", "url(" + _t + "#" + this.storedData[e].filterId + ")")), r.setAttribute("radius", -this.storedData[e].x.v)) : ("dilate" !== this.storedData[e].lastOperator && (this.storedData[e].lastOperator = "dilate", this.storedData[e].elem.setAttribute("filter", null)), this.storedData[e].elem.setAttribute("stroke-width", 2 * this.storedData[e].x.v))
				}
		}, C.prototype.getMaskelement = function () {
			return this.maskElement
		}, C.prototype.createLayerSolidPath = function () {
			var t = "M0,0 ";
			return t += " h" + this.globalData.compSize.w, t += " v" + this.globalData.compSize.h, (t += " h-" + this.globalData.compSize.w) + " v-" + this.globalData.compSize.h + " "
		}, C.prototype.drawPath = function (t, e, i) {
			var s, r, n = " M" + e.v[0][0] + "," + e.v[0][1];
			for (r = e._length, s = 1; s < r; s += 1) n += " C" + e.o[s - 1][0] + "," + e.o[s - 1][1] + " " + e.i[s][0] + "," + e.i[s][1] + " " + e.v[s][0] + "," + e.v[s][1];
			if (e.c && 1 < r && (n += " C" + e.o[s - 1][0] + "," + e.o[s - 1][1] + " " + e.i[0][0] + "," + e.i[0][1] + " " + e.v[0][0] + "," + e.v[0][1]), i.lastPath !== n) {
				var a = "";
				i.elem && (e.c && (a = t.inv ? this.solidPath + n : n), i.elem.setAttribute("d", a)), i.lastPath = n
			}
		}, C.prototype.destroy = function () {
			this.element = null, this.globalData = null, this.maskElement = null, this.data = null, this.masksProperties = null
		}, M.prototype = {
			initHierarchy: function () {
				this.hierarchy = [], this._isParent = !1, this.checkParenting()
			},
			setHierarchy: function (t) {
				this.hierarchy = t
			},
			setAsParent: function () {
				this._isParent = !0
			},
			checkParenting: function () {
				void 0 !== this.data.parent && this.comp.buildElementParenting(this, this.data.parent, [])
			}
		}, F.prototype = {
			initFrame: function () {
				this._isFirstFrame = !1, this.dynamicProperties = [], this._mdf = !1
			},
			prepareProperties: function (t, e) {
				var i, s = this.dynamicProperties.length;
				for (i = 0; i < s; i += 1)(e || this._isParent && "transform" === this.dynamicProperties[i].propType) && (this.dynamicProperties[i].getValue(), this.dynamicProperties[i]._mdf && (this.globalData._mdf = !0, this._mdf = !0))
			},
			addDynamicProperty: function (t) {
				-1 === this.dynamicProperties.indexOf(t) && this.dynamicProperties.push(t)
			}
		}, E.prototype = {
			initTransform: function () {
				this.finalTransform = {
					mProp: this.data.ks ? Lt.getTransformProperty(this, this.data.ks, this) : {
						o: 0
					},
					_matMdf: !1,
					_opMdf: !1,
					mat: new Mt
				}, this.data.ao && (this.finalTransform.mProp.autoOriented = !0), this.data.ty
			},
			renderTransform: function () {
				if (this.finalTransform._opMdf = this.finalTransform.mProp.o._mdf || this._isFirstFrame, this.finalTransform._matMdf = this.finalTransform.mProp._mdf || this._isFirstFrame, this.hierarchy) {
					var t, e = this.finalTransform.mat,
						i = 0,
						s = this.hierarchy.length;
					if (!this.finalTransform._matMdf)
						for (; i < s;) {
							if (this.hierarchy[i].finalTransform.mProp._mdf) {
								this.finalTransform._matMdf = !0;
								break
							}
							i += 1
						}
					if (this.finalTransform._matMdf)
						for (t = this.finalTransform.mProp.v.props, e.cloneFromProps(t), i = 0; i < s; i += 1) t = this.hierarchy[i].finalTransform.mProp.v.props, e.transform(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15])
				}
			},
			globalToLocal: function (t) {
				var e = [];
				e.push(this.finalTransform);
				for (var i = !0, s = this.comp; i;) s.finalTransform ? (s.data.hasMask && e.splice(0, 0, s.finalTransform), s = s.comp) : i = !1;
				var r, n, a = e.length;
				for (r = 0; r < a; r += 1) n = e[r].mat.applyToPointArray(0, 0, 0), t = [t[0] - n[0], t[1] - n[1], 0];
				return t
			},
			mHelper: new Mt
		}, I.prototype = {
			initRenderable: function () {
				this.isInRange = !1, this.hidden = !1, this.isTransparent = !1, this.renderableComponents = []
			},
			addRenderableComponent: function (t) {
				-1 === this.renderableComponents.indexOf(t) && this.renderableComponents.push(t)
			},
			removeRenderableComponent: function (t) {
				-1 !== this.renderableComponents.indexOf(t) && this.renderableComponents.splice(this.renderableComponents.indexOf(t), 1)
			},
			prepareRenderableFrame: function (t) {
				this.checkLayerLimits(t)
			},
			checkTransparency: function () {
				this.finalTransform.mProp.o.v <= 0 ? !this.isTransparent && this.globalData.renderConfig.hideOnTransparent && (this.isTransparent = !0, this.hide()) : this.isTransparent && (this.isTransparent = !1, this.show())
			},
			checkLayerLimits: function (t) {
				this.data.ip - this.data.st <= t && this.data.op - this.data.st > t ? !0 !== this.isInRange && (this.globalData._mdf = !0, this._mdf = !0, this.isInRange = !0, this.show()) : !1 !== this.isInRange && (this.globalData._mdf = !0, this.isInRange = !1, this.hide())
			},
			renderRenderable: function () {
				var t, e = this.renderableComponents.length;
				for (t = 0; t < e; t += 1) this.renderableComponents[t].renderFrame(this._isFirstFrame)
			},
			sourceRectAtTime: function () {
				return {
					top: 0,
					left: 0,
					width: 100,
					height: 100
				}
			},
			getLayerSize: function () {
				return 5 === this.data.ty ? {
					w: this.data.textData.width,
					h: this.data.textData.height
				} : {
					w: this.data.width,
					h: this.data.height
				}
			}
		}, c([I, function (t) {
			function e() {}
			return e.prototype = t, e
		}({
			initElement: function (t, e, i) {
				this.initFrame(), this.initBaseData(t, e, i), this.initTransform(t, e, i), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide()
			},
			hide: function () {
				this.hidden || this.isInRange && !this.isTransparent || ((this.baseElement || this.layerElement).style.display = "none", this.hidden = !0)
			},
			show: function () {
				this.isInRange && !this.isTransparent && (this.data.hd || ((this.baseElement || this.layerElement).style.display = "block"), this.hidden = !1, this._isFirstFrame = !0)
			},
			renderFrame: function () {
				this.data.hd || this.hidden || (this.renderTransform(), this.renderRenderable(), this.renderElement(), this.renderInnerContent(), this._isFirstFrame && (this._isFirstFrame = !1))
			},
			renderInnerContent: function () {},
			prepareFrame: function (t) {
				this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), this.checkTransparency()
			},
			destroy: function () {
				this.innerElem = null, this.destroyBaseElement()
			}
		})], R), L.prototype.reset = function () {
			this.d = "", this._mdf = !1
		}, z.prototype.setAsAnimated = function () {
			this._isAnimated = !0
		}, c([u], V), c([u], B), j.prototype.initGradientData = function (t, e, i) {
			this.o = Ot.getProp(t, e.o, 0, .01, this), this.s = Ot.getProp(t, e.s, 1, null, this), this.e = Ot.getProp(t, e.e, 1, null, this), this.h = Ot.getProp(t, e.h || {
				k: 0
			}, 0, .01, this), this.a = Ot.getProp(t, e.a || {
				k: 0
			}, 0, At, this), this.g = new b(t, e.g, this), this.style = i, this.stops = [], this.setGradientData(i.pElem, e), this.setGradientOpacity(e, i), this._isAnimated = !!this._isAnimated
		}, j.prototype.setGradientData = function (t, e) {
			var i = "gr_" + T(10),
				s = k(1 === e.t ? "linearGradient" : "radialGradient");
			s.setAttribute("id", i), s.setAttribute("spreadMethod", "pad"), s.setAttribute("gradientUnits", "userSpaceOnUse");
			var r, n, a, o = [];
			for (a = 4 * e.g.p, n = 0; n < a; n += 4) r = k("stop"), s.appendChild(r), o.push(r);
			t.setAttribute("gf" === e.ty ? "fill" : "stroke", "url(" + _t + "#" + i + ")"), this.gf = s, this.cst = o
		}, j.prototype.setGradientOpacity = function (t, e) {
			if (this.g._hasOpacity && !this.g._collapsable) {
				var i, s, r, n = k("mask"),
					a = k("path");
				n.appendChild(a);
				var o = "op_" + T(10),
					h = "mk_" + T(10);
				n.setAttribute("id", h);
				var l = k(1 === t.t ? "linearGradient" : "radialGradient");
				l.setAttribute("id", o), l.setAttribute("spreadMethod", "pad"), l.setAttribute("gradientUnits", "userSpaceOnUse"), r = t.g.k.k[0].s ? t.g.k.k[0].s.length : t.g.k.k.length;
				var p = this.stops;
				for (s = 4 * t.g.p; s < r; s += 2)(i = k("stop")).setAttribute("stop-color", "rgb(255,255,255)"), l.appendChild(i), p.push(i);
				a.setAttribute("gf" === t.ty ? "fill" : "stroke", "url(" + _t + "#" + o + ")"), this.of = l, this.ms = n, this.ost = p, this.maskId = h, e.msElem = a
			}
		}, c([u], j), c([j, u], X);
		var ae = function () {
			function e(t, e, i) {
				(i || e.transform.op._mdf) && e.transform.container.setAttribute("opacity", e.transform.op.v), (i || e.transform.mProps._mdf) && e.transform.container.setAttribute("transform", e.transform.mProps.v.to2dCSS())
			}

			function i(t, e, i) {
				var s, r, n, a, o, h, l, p, f, u, c, d = e.styles.length,
					m = e.lvl;
				for (h = 0; h < d; h += 1) {
					if (a = e.sh._mdf || i, e.styles[h].lvl < m) {
						for (p = _.reset(), u = m - e.styles[h].lvl, c = e.transformers.length - 1; !a && 0 < u;) a = e.transformers[c].mProps._mdf || a, u--, c--;
						if (a)
							for (u = m - e.styles[h].lvl, c = e.transformers.length - 1; 0 < u;) f = e.transformers[c].mProps.v.props, p.transform(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7], f[8], f[9], f[10], f[11], f[12], f[13], f[14], f[15]), u--, c--
					} else p = g;
					if (r = (l = e.sh.paths)._length, a) {
						for (n = "", s = 0; s < r; s += 1)(o = l.shapes[s]) && o._length && (n += Xt(o, o._length, o.c, p));
						e.caches[h] = n
					} else n = e.caches[h];
					e.styles[h].d += !0 === t.hd ? "" : n, e.styles[h]._mdf = a || e.styles[h]._mdf
				}
			}

			function s(t, e, i) {
				var s = e.style;
				(e.c._mdf || i) && s.pElem.setAttribute("fill", "rgb(" + Tt(e.c.v[0]) + "," + Tt(e.c.v[1]) + "," + Tt(e.c.v[2]) + ")"), (e.o._mdf || i) && s.pElem.setAttribute("fill-opacity", e.o.v)
			}

			function r(t, e, i) {
				n(t, e, i), a(t, e, i)
			}

			function n(t, e, i) {
				var s, r, n, a, o, h = e.gf,
					l = e.g._hasOpacity,
					p = e.s.v,
					f = e.e.v;
				if (e.o._mdf || i) {
					var u = "gf" === t.ty ? "fill-opacity" : "stroke-opacity";
					e.style.pElem.setAttribute(u, e.o.v)
				}
				if (e.s._mdf || i) {
					var c = 1 === t.t ? "x1" : "cx",
						d = "x1" === c ? "y1" : "cy";
					h.setAttribute(c, p[0]), h.setAttribute(d, p[1]), l && !e.g._collapsable && (e.of.setAttribute(c, p[0]), e.of.setAttribute(d, p[1]))
				}
				if (e.g._cmdf || i) {
					s = e.cst;
					var m = e.g.c;
					for (n = s.length, r = 0; r < n; r += 1)(a = s[r]).setAttribute("offset", m[4 * r] + "%"), a.setAttribute("stop-color", "rgb(" + m[4 * r + 1] + "," + m[4 * r + 2] + "," + m[4 * r + 3] + ")")
				}
				if (l && (e.g._omdf || i)) {
					var g = e.g.o;
					for (n = (s = e.g._collapsable ? e.cst : e.ost).length, r = 0; r < n; r += 1) a = s[r], e.g._collapsable || a.setAttribute("offset", g[2 * r] + "%"), a.setAttribute("stop-opacity", g[2 * r + 1])
				}
				if (1 === t.t)(e.e._mdf || i) && (h.setAttribute("x2", f[0]), h.setAttribute("y2", f[1]), l && !e.g._collapsable && (e.of.setAttribute("x2", f[0]), e.of.setAttribute("y2", f[1])));
				else if ((e.s._mdf || e.e._mdf || i) && (o = Math.sqrt(Math.pow(p[0] - f[0], 2) + Math.pow(p[1] - f[1], 2)), h.setAttribute("r", o), l && !e.g._collapsable && e.of.setAttribute("r", o)), e.e._mdf || e.h._mdf || e.a._mdf || i) {
					o || (o = Math.sqrt(Math.pow(p[0] - f[0], 2) + Math.pow(p[1] - f[1], 2)));
					var _ = Math.atan2(f[1] - p[1], f[0] - p[0]),
						y = o * (1 <= e.h.v ? .99 : e.h.v <= -1 ? -.99 : e.h.v),
						v = Math.cos(_ + e.a.v) * y + p[0],
						b = Math.sin(_ + e.a.v) * y + p[1];
					h.setAttribute("fx", v), h.setAttribute("fy", b), l && !e.g._collapsable && (e.of.setAttribute("fx", v), e.of.setAttribute("fy", b))
				}
			}

			function a(t, e, i) {
				var s = e.style,
					r = e.d;
				r && (r._mdf || i) && r.dashStr && (s.pElem.setAttribute("stroke-dasharray", r.dashStr), s.pElem.setAttribute("stroke-dashoffset", r.dashoffset[0])), e.c && (e.c._mdf || i) && s.pElem.setAttribute("stroke", "rgb(" + Tt(e.c.v[0]) + "," + Tt(e.c.v[1]) + "," + Tt(e.c.v[2]) + ")"), (e.o._mdf || i) && s.pElem.setAttribute("stroke-opacity", e.o.v), (e.w._mdf || i) && (s.pElem.setAttribute("stroke-width", e.w.v), s.msElem && s.msElem.setAttribute("stroke-width", e.w.v))
			}
			var g = new Mt,
				_ = new Mt;
			return {
				createRenderFunction: function (t) {
					switch (t.ty, t.ty) {
						case "fl":
							return s;
						case "gf":
							return n;
						case "gs":
							return r;
						case "st":
							return a;
						case "sh":
						case "el":
						case "rc":
						case "sr":
							return i;
						case "tr":
							return e
					}
				}
			}
		}();
		q.prototype = {
			checkMasks: function () {
				if (!this.data.hasMask) return !1;
				for (var t = 0, e = this.data.masksProperties.length; t < e;) {
					if ("n" !== this.data.masksProperties[t].mode && !1 !== this.data.masksProperties[t].cl) return !0;
					t += 1
				}
				return !1
			},
			initExpressions: function () {
				this.layerInterface = LayerExpressionInterface(this), this.data.hasMask && this.maskManager && this.layerInterface.registerMaskInterface(this.maskManager);
				var t = EffectsExpressionInterface.createEffectsInterface(this, this.layerInterface);
				this.layerInterface.registerEffectsInterface(t), 0 === this.data.ty || this.data.xt ? this.compInterface = CompExpressionInterface(this) : 4 === this.data.ty ? (this.layerInterface.shapeInterface = ShapeExpressionInterface(this.shapesData, this.itemsData, this.layerInterface), this.layerInterface.content = this.layerInterface.shapeInterface) : 5 === this.data.ty && (this.layerInterface.textInterface = TextExpressionInterface(this), this.layerInterface.text = this.layerInterface.textInterface)
			},
			blendModeEnums: {
				1: "multiply",
				2: "screen",
				3: "overlay",
				4: "darken",
				5: "lighten",
				6: "color-dodge",
				7: "color-burn",
				8: "hard-light",
				9: "soft-light",
				10: "difference",
				11: "exclusion",
				12: "hue",
				13: "saturation",
				14: "color",
				15: "luminosity"
			},
			getBlendMode: function () {
				return this.blendModeEnums[this.data.bm] || ""
			},
			setBlendMode: function () {
				var t = this.getBlendMode();
				(this.baseElement || this.layerElement).style["mix-blend-mode"] = t
			},
			initBaseData: function (t, e, i) {
				this.globalData = e, this.comp = i, this.data = t, this.layerId = "ly_" + T(10), this.data.sr || (this.data.sr = 1), this.effectsManager = new ct(this.data, this, this.dynamicProperties)
			},
			getType: function () {
				return this.type
			}
		}, G.prototype.prepareFrame = function (t) {
			this.prepareProperties(t, !0)
		}, G.prototype.renderFrame = function () {}, G.prototype.getBaseElement = function () {
			return null
		}, G.prototype.destroy = function () {}, G.prototype.sourceRectAtTime = function () {}, G.prototype.hide = function () {}, c([q, E, M, F], G), W.prototype = {
			initRendererElement: function () {
				this.layerElement = k("g")
			},
			createContainerElements: function () {
				this.matteElement = k("g"), this.transformedElement = this.layerElement, this.maskedElement = this.layerElement, this._sizeChanged = !1;
				var t, e, i, s = null;
				if (this.data.td) {
					if (3 == this.data.td || 1 == this.data.td) {
						var r = k("mask");
						r.setAttribute("id", this.layerId), r.setAttribute("mask-type", 3 == this.data.td ? "luminance" : "alpha"), r.appendChild(this.layerElement), s = r, this.globalData.defs.appendChild(r), qt.maskType || 1 != this.data.td || (r.setAttribute("mask-type", "luminance"), t = T(10), e = Gt.createFilter(t), this.globalData.defs.appendChild(e), e.appendChild(Gt.createAlphaToLuminanceFilter()), (i = k("g")).appendChild(this.layerElement), s = i, r.appendChild(i), i.setAttribute("filter", "url(" + _t + "#" + t + ")"))
					} else if (2 == this.data.td) {
						var n = k("mask");
						n.setAttribute("id", this.layerId), n.setAttribute("mask-type", "alpha");
						var a = k("g");
						n.appendChild(a), t = T(10), e = Gt.createFilter(t);
						var o = k("feColorMatrix");
						o.setAttribute("type", "matrix"), o.setAttribute("color-interpolation-filters", "sRGB"), o.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 -1 1"), e.appendChild(o), this.globalData.defs.appendChild(e);
						var h = k("rect");
						h.setAttribute("width", this.comp.data.w), h.setAttribute("height", this.comp.data.h), h.setAttribute("x", "0"), h.setAttribute("y", "0"), h.setAttribute("fill", "#ffffff"), h.setAttribute("opacity", "0"), a.setAttribute("filter", "url(" + _t + "#" + t + ")"), a.appendChild(h), a.appendChild(this.layerElement), s = a, qt.maskType || (n.setAttribute("mask-type", "luminance"), e.appendChild(Gt.createAlphaToLuminanceFilter()), i = k("g"), a.appendChild(h), i.appendChild(this.layerElement), s = i, a.appendChild(i)), this.globalData.defs.appendChild(n)
					}
				} else this.data.tt ? (this.matteElement.appendChild(this.layerElement), s = this.matteElement, this.baseElement = this.matteElement) : this.baseElement = this.layerElement;
				if (this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.data.cl && this.layerElement.setAttribute("class", this.data.cl), 0 === this.data.ty && !this.data.hd) {
					var l = k("clipPath"),
						p = k("path");
					p.setAttribute("d", "M0,0 L" + this.data.w + ",0 L" + this.data.w + "," + this.data.h + " L0," + this.data.h + "z");
					var f = "cp_" + T(8);
					if (l.setAttribute("id", f), l.appendChild(p), this.globalData.defs.appendChild(l), this.checkMasks()) {
						var u = k("g");
						u.setAttribute("clip-path", "url(" + _t + "#" + f + ")"), u.appendChild(this.layerElement), this.transformedElement = u, s ? s.appendChild(this.transformedElement) : this.baseElement = this.transformedElement
					} else this.layerElement.setAttribute("clip-path", "url(" + _t + "#" + f + ")")
				}
				0 !== this.data.bm && this.setBlendMode()
			},
			renderElement: function () {
				this.finalTransform._matMdf && this.transformedElement.setAttribute("transform", this.finalTransform.mat.to2dCSS()), this.finalTransform._opMdf && this.transformedElement.setAttribute("opacity", this.finalTransform.mProp.o.v)
			},
			destroyBaseElement: function () {
				this.layerElement = null, this.matteElement = null, this.maskManager.destroy()
			},
			getBaseElement: function () {
				return this.data.hd ? null : this.baseElement
			},
			createRenderableComponents: function () {
				this.maskManager = new C(this.data, this, this.globalData), this.renderableEffectsManager = new ht(this)
			},
			setMatte: function (t) {
				this.matteElement && this.matteElement.setAttribute("mask", "url(" + _t + "#" + t + ")")
			}
		}, U.prototype = {
			addShapeToModifiers: function (t) {
				var e, i = this.shapeModifiers.length;
				for (e = 0; e < i; e += 1) this.shapeModifiers[e].addShape(t)
			},
			isShapeInAnimatedModifiers: function (t) {
				for (var e = this.shapeModifiers.length; 0 < e;)
					if (this.shapeModifiers[0].isAnimatedWithShape(t)) return !0;
				return !1
			},
			renderModifiers: function () {
				if (this.shapeModifiers.length) {
					var t, e = this.shapes.length;
					for (t = 0; t < e; t += 1) this.shapes[t].sh.reset();
					for (t = (e = this.shapeModifiers.length) - 1; 0 <= t; t -= 1) this.shapeModifiers[t].processShapes(this._isFirstFrame)
				}
			},
			lcEnum: {
				1: "butt",
				2: "round",
				3: "square"
			},
			ljEnum: {
				1: "miter",
				2: "round",
				3: "bevel"
			},
			searchProcessedElement: function (t) {
				for (var e = this.processedElements, i = 0, s = e.length; i < s;) {
					if (e[i].elem === t) return e[i].pos;
					i += 1
				}
				return 0
			},
			addProcessedElement: function (t, e) {
				for (var i = this.processedElements, s = i.length; s;)
					if (i[s -= 1].elem === t) return void(i[s].pos = e);
				i.push(new O(t, e))
			},
			prepareFrame: function (t) {
				this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange)
			}
		}, H.prototype.initElement = function (t, e, i) {
			this.lettersChangedFlag = !0, this.initFrame(), this.initBaseData(t, e, i), this.textProperty = new A(this, t.t, this.dynamicProperties), this.textAnimator = new x(t.t, this.renderType, this), this.initTransform(t, e, i), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide(), this.textAnimator.searchProperties(this.dynamicProperties)
		}, H.prototype.prepareFrame = function (t) {
			this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), (this.textProperty._mdf || this.textProperty._isFirstFrame) && (this.buildNewText(), this.textProperty._isFirstFrame = !1, this.textProperty._mdf = !1)
		}, H.prototype.createPathShape = function (t, e) {
			var i, s, r = e.length,
				n = "";
			for (i = 0; i < r; i += 1) s = e[i].ks.k, n += Xt(s, s.i.length, !0, t);
			return n
		}, H.prototype.updateDocumentData = function (t, e) {
			this.textProperty.updateDocumentData(t, e)
		}, H.prototype.canResizeFont = function (t) {
			this.textProperty.canResizeFont(t)
		}, H.prototype.setMinimumFontSize = function (t) {
			this.textProperty.setMinimumFontSize(t)
		}, H.prototype.applyTextPropertiesToMatrix = function (t, e, i, s, r) {
			switch (t.ps && e.translate(t.ps[0], t.ps[1] + t.ascent, 0), e.translate(0, -t.ls, 0), t.j) {
				case 1:
					e.translate(t.justifyOffset + (t.boxWidth - t.lineWidths[i]), 0, 0);
					break;
				case 2:
					e.translate(t.justifyOffset + (t.boxWidth - t.lineWidths[i]) / 2, 0, 0)
			}
			e.translate(s, r, 0)
		}, H.prototype.buildColor = function (t) {
			return "rgb(" + Math.round(255 * t[0]) + "," + Math.round(255 * t[1]) + "," + Math.round(255 * t[2]) + ")"
		}, H.prototype.emptyProp = new ut, H.prototype.destroy = function () {}, c([q, E, M, F, R], Z), Z.prototype.initElement = function (t, e, i) {
			this.initFrame(), this.initBaseData(t, e, i), this.initTransform(t, e, i), this.initRenderable(), this.initHierarchy(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), !this.data.xt && e.progressiveLoad || this.buildAllItems(), this.hide()
		}, Z.prototype.prepareFrame = function (t) {
			if (this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), this.isInRange || this.data.xt) {
				if (this.tm._placeholder) this.renderedFrame = t / this.data.sr;
				else {
					var e = this.tm.v;
					e === this.data.op && (e = this.data.op - 1), this.renderedFrame = e
				}
				var i, s = this.elements.length;
				for (this.completeLayers || this.checkLayers(this.renderedFrame), i = s - 1; 0 <= i; i -= 1)(this.completeLayers || this.elements[i]) && (this.elements[i].prepareFrame(this.renderedFrame - this.layers[i].st), this.elements[i]._mdf && (this._mdf = !0))
			}
		}, Z.prototype.renderInnerContent = function () {
			var t, e = this.layers.length;
			for (t = 0; t < e; t += 1)(this.completeLayers || this.elements[t]) && this.elements[t].renderFrame()
		}, Z.prototype.setElements = function (t) {
			this.elements = t
		}, Z.prototype.getElements = function () {
			return this.elements
		}, Z.prototype.destroyElements = function () {
			var t, e = this.layers.length;
			for (t = 0; t < e; t += 1) this.elements[t] && this.elements[t].destroy()
		}, Z.prototype.destroy = function () {
			this.destroyElements(), this.destroyBaseElement()
		}, c([q, E, W, M, F, R], $), $.prototype.createContent = function () {
			var t = this.globalData.getAssetsPath(this.assetData);
			this.innerElem = k("image"), this.innerElem.setAttribute("width", this.assetData.w + "px"), this.innerElem.setAttribute("height", this.assetData.h + "px"), this.innerElem.setAttribute("preserveAspectRatio", this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio), this.innerElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", t), this.layerElement.appendChild(this.innerElem)
		}, c([$], Q), Q.prototype.createContent = function () {
			var t = k("rect");
			t.setAttribute("width", this.data.sw), t.setAttribute("height", this.data.sh), t.setAttribute("fill", this.data.sc), this.layerElement.appendChild(t)
		}, c([D, Z, W], K), c([q, E, W, M, F, R, H], J), J.prototype.createContent = function () {
			this.data.singleShape && !this.globalData.fontManager.chars && (this.textContainer = k("text"))
		}, J.prototype.buildTextContents = function (t) {
			for (var e = 0, i = t.length, s = [], r = ""; e < i;) t[e] === String.fromCharCode(13) || t[e] === String.fromCharCode(3) ? (s.push(r), r = "") : r += t[e], e += 1;
			return s.push(r), s
		}, J.prototype.buildNewText = function () {
			var t, e, i = this.textProperty.currentData;
			this.renderedLetters = w(i ? i.l.length : 0), i.fc ? this.layerElement.setAttribute("fill", this.buildColor(i.fc)) : this.layerElement.setAttribute("fill", "rgba(0,0,0,0)"), i.sc && (this.layerElement.setAttribute("stroke", this.buildColor(i.sc)), this.layerElement.setAttribute("stroke-width", i.sw)), this.layerElement.setAttribute("font-size", i.finalSize);
			var s = this.globalData.fontManager.getFontByName(i.f);
			if (s.fClass) this.layerElement.setAttribute("class", s.fClass);
			else {
				this.layerElement.setAttribute("font-family", s.fFamily);
				var r = i.fWeight,
					n = i.fStyle;
				this.layerElement.setAttribute("font-style", n), this.layerElement.setAttribute("font-weight", r)
			}
			var a = i.l || [],
				o = !!this.globalData.fontManager.chars;
			e = a.length;
			var h, l, p = this.mHelper,
				f = "",
				u = this.data.singleShape,
				c = 0,
				d = 0,
				m = !0,
				g = i.tr / 1e3 * i.finalSize;
			if (!u || o || i.sz) {
				var _, y, v = this.textSpans.length;
				for (t = 0; t < e; t += 1) o && u && 0 !== t || (h = t < v ? this.textSpans[t] : k(o ? "path" : "text"), v <= t && (h.setAttribute("stroke-linecap", "butt"), h.setAttribute("stroke-linejoin", "round"), h.setAttribute("stroke-miterlimit", "4"), this.textSpans[t] = h, this.layerElement.appendChild(h)), h.style.display = "inherit"), p.reset(), p.scale(i.finalSize / 100, i.finalSize / 100), u && (a[t].n && (c = -g, d += i.yOffset, d += m ? 1 : 0, m = !1), this.applyTextPropertiesToMatrix(i, p, a[t].line, c, d), c += a[t].l || 0, c += g), o ? (l = (_ = (y = this.globalData.fontManager.getCharData(i.finalText[t], s.fStyle, this.globalData.fontManager.getFontByName(i.f).fFamily)) && y.data || {}).shapes ? _.shapes[0].it : [], u ? f += this.createPathShape(p, l) : h.setAttribute("d", this.createPathShape(p, l))) : (u && h.setAttribute("transform", "translate(" + p.props[12] + "," + p.props[13] + ")"), h.textContent = a[t].val, h.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve"));
				u && h && h.setAttribute("d", f)
			} else {
				var b = this.textContainer,
					x = "start";
				switch (i.j) {
					case 1:
						x = "end";
						break;
					case 2:
						x = "middle"
				}
				b.setAttribute("text-anchor", x), b.setAttribute("letter-spacing", g);
				var T = this.buildTextContents(i.finalText);
				for (e = T.length, d = i.ps ? i.ps[1] + i.ascent : 0, t = 0; t < e; t += 1)(h = this.textSpans[t] || k("tspan")).textContent = T[t], h.setAttribute("x", 0), h.setAttribute("y", d), h.style.display = "inherit", b.appendChild(h), this.textSpans[t] = h, d += i.finalLineHeight;
				this.layerElement.appendChild(b)
			}
			for (; t < this.textSpans.length;) this.textSpans[t].style.display = "none", t += 1;
			this._sizeChanged = !0
		}, J.prototype.sourceRectAtTime = function (t) {
			if (this.prepareFrame(this.comp.renderedFrame - this.data.st), this.renderInnerContent(), this._sizeChanged) {
				this._sizeChanged = !1;
				var e = this.layerElement.getBBox();
				this.bbox = {
					top: e.y,
					left: e.x,
					width: e.width,
					height: e.height
				}
			}
			return this.bbox
		}, J.prototype.renderInnerContent = function () {
			if (!this.data.singleShape && (this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag), this.lettersChangedFlag || this.textAnimator.lettersChangedFlag)) {
				this._sizeChanged = !0;
				var t, e, i, s, r = this.textAnimator.renderedLetters,
					n = this.textProperty.currentData.l;
				for (e = n.length, t = 0; t < e; t += 1) n[t].n || (i = r[t], s = this.textSpans[t], i._mdf.m && s.setAttribute("transform", i.m), i._mdf.o && s.setAttribute("opacity", i.o), i._mdf.sw && s.setAttribute("stroke-width", i.sw), i._mdf.sc && s.setAttribute("stroke", i.sc), i._mdf.fc && s.setAttribute("fill", i.fc))
			}
		}, c([q, E, W, U, M, F, R], tt), tt.prototype.initSecondaryElement = function () {}, tt.prototype.identityMatrix = new Mt, tt.prototype.buildExpressionInterface = function () {}, tt.prototype.createContent = function () {
			this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes()
		}, tt.prototype.filterUniqueShapes = function () {
			var t, e, i, s, r = this.shapes.length,
				n = this.stylesList.length,
				a = [],
				o = !1;
			for (i = 0; i < n; i += 1) {
				for (s = this.stylesList[i], o = !1, t = a.length = 0; t < r; t += 1) - 1 !== (e = this.shapes[t]).styles.indexOf(s) && (a.push(e), o = e._isAnimated || o);
				1 < a.length && o && this.setShapesAsAnimated(a)
			}
		}, tt.prototype.setShapesAsAnimated = function (t) {
			var e, i = t.length;
			for (e = 0; e < i; e += 1) t[e].setAsAnimated()
		}, tt.prototype.createStyleElement = function (t, e) {
			var i, s = new L(t, e),
				r = s.pElem;
			if ("st" === t.ty) i = new V(this, t, s);
			else if ("fl" === t.ty) i = new B(this, t, s);
			else if ("gf" === t.ty || "gs" === t.ty) {
				i = new("gf" === t.ty ? j : X)(this, t, s), this.globalData.defs.appendChild(i.gf), i.maskId && (this.globalData.defs.appendChild(i.ms), this.globalData.defs.appendChild(i.of), r.setAttribute("mask", "url(" + _t + "#" + i.maskId + ")"))
			}
			return "st" !== t.ty && "gs" !== t.ty || (r.setAttribute("stroke-linecap", this.lcEnum[t.lc] || "round"), r.setAttribute("stroke-linejoin", this.ljEnum[t.lj] || "round"), r.setAttribute("fill-opacity", "0"), 1 === t.lj && r.setAttribute("stroke-miterlimit", t.ml)), 2 === t.r && r.setAttribute("fill-rule", "evenodd"), t.ln && r.setAttribute("id", t.ln), t.cl && r.setAttribute("class", t.cl), this.stylesList.push(s), this.addToAnimatedContents(t, i), i
		}, tt.prototype.createGroupElement = function (t) {
			var e = new Y;
			return t.ln && e.gr.setAttribute("id", t.ln), t.cl && e.gr.setAttribute("class", t.cl), e
		}, tt.prototype.createTransformElement = function (t, e) {
			var i = Lt.getTransformProperty(this, t, this),
				s = new N(i, i.o, e);
			return this.addToAnimatedContents(t, s), s
		}, tt.prototype.createShapeElement = function (t, e, i) {
			var s = 4;
			"rc" === t.ty ? s = 5 : "el" === t.ty ? s = 6 : "sr" === t.ty && (s = 7);
			var r = new z(e, i, Vt.getShapeProp(this, t, s, this));
			return this.shapes.push(r), this.addShapeToModifiers(r), this.addToAnimatedContents(t, r), r
		}, tt.prototype.addToAnimatedContents = function (t, e) {
			for (var i = 0, s = this.animatedContents.length; i < s;) {
				if (this.animatedContents[i].element === e) return;
				i += 1
			}
			this.animatedContents.push({
				fn: ae.createRenderFunction(t),
				element: e,
				data: t
			})
		}, tt.prototype.setElementStyles = function (t) {
			var e, i = t.styles,
				s = this.stylesList.length;
			for (e = 0; e < s; e += 1) this.stylesList[e].closed || i.push(this.stylesList[e])
		}, tt.prototype.reloadShapes = function () {
			this._isFirstFrame = !0;
			var t, e = this.itemsData.length;
			for (t = 0; t < e; t += 1) this.prevViewData[t] = this.itemsData[t];
			for (this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes(), e = this.dynamicProperties.length, t = 0; t < e; t += 1) this.dynamicProperties[t].getValue();
			this.renderModifiers()
		}, tt.prototype.searchShapes = function (t, e, i, s, r, n, a) {
			var o, h, l, p, f, u, c = [].concat(n),
				d = t.length - 1,
				m = [],
				g = [];
			for (o = d; 0 <= o; o -= 1) {
				if ((u = this.searchProcessedElement(t[o])) ? e[o] = i[u - 1] : t[o]._render = a, "fl" == t[o].ty || "st" == t[o].ty || "gf" == t[o].ty || "gs" == t[o].ty) u ? e[o].style.closed = !1 : e[o] = this.createStyleElement(t[o], r), t[o]._render && s.appendChild(e[o].style.pElem), m.push(e[o].style);
				else if ("gr" == t[o].ty) {
					if (u)
						for (l = e[o].it.length, h = 0; h < l; h += 1) e[o].prevViewData[h] = e[o].it[h];
					else e[o] = this.createGroupElement(t[o]);
					this.searchShapes(t[o].it, e[o].it, e[o].prevViewData, e[o].gr, r + 1, c, a), t[o]._render && s.appendChild(e[o].gr)
				} else "tr" == t[o].ty ? (u || (e[o] = this.createTransformElement(t[o], s)), p = e[o].transform, c.push(p)) : "sh" == t[o].ty || "rc" == t[o].ty || "el" == t[o].ty || "sr" == t[o].ty ? (u || (e[o] = this.createShapeElement(t[o], c, r)), this.setElementStyles(e[o])) : "tm" == t[o].ty || "rd" == t[o].ty || "ms" == t[o].ty ? (u ? (f = e[o]).closed = !1 : ((f = Bt.getModifier(t[o].ty)).init(this, t[o]), e[o] = f, this.shapeModifiers.push(f)), g.push(f)) : "rp" == t[o].ty && (u ? (f = e[o]).closed = !0 : (f = Bt.getModifier(t[o].ty), (e[o] = f).init(this, t, o, e), this.shapeModifiers.push(f), a = !1), g.push(f));
				this.addProcessedElement(t[o], o + 1)
			}
			for (d = m.length, o = 0; o < d; o += 1) m[o].closed = !0;
			for (d = g.length, o = 0; o < d; o += 1) g[o].closed = !0
		}, tt.prototype.renderInnerContent = function () {
			this.renderModifiers();
			var t, e = this.stylesList.length;
			for (t = 0; t < e; t += 1) this.stylesList[t].reset();
			for (this.renderShape(), t = 0; t < e; t += 1)(this.stylesList[t]._mdf || this._isFirstFrame) && (this.stylesList[t].msElem && (this.stylesList[t].msElem.setAttribute("d", this.stylesList[t].d), this.stylesList[t].d = "M0 0" + this.stylesList[t].d), this.stylesList[t].pElem.setAttribute("d", this.stylesList[t].d || "M0 0"))
		}, tt.prototype.renderShape = function () {
			var t, e, i = this.animatedContents.length;
			for (t = 0; t < i; t += 1) e = this.animatedContents[t], (this._isFirstFrame || e.element._isAnimated) && !0 !== e.data && e.fn(e.data, e.element, this._isFirstFrame)
		}, tt.prototype.destroy = function () {
			this.destroyBaseElement(), this.shapesData = null, this.itemsData = null
		}, et.prototype.renderFrame = function (t) {
			if (t || this.filterManager._mdf) {
				var e = this.filterManager.effectElements[0].p.v,
					i = this.filterManager.effectElements[1].p.v,
					s = this.filterManager.effectElements[2].p.v / 100;
				this.matrixFilter.setAttribute("values", i[0] - e[0] + " 0 0 0 " + e[0] + " " + (i[1] - e[1]) + " 0 0 0 " + e[1] + " " + (i[2] - e[2]) + " 0 0 0 " + e[2] + " 0 0 0 " + s + " 0")
			}
		}, it.prototype.renderFrame = function (t) {
			if (t || this.filterManager._mdf) {
				var e = this.filterManager.effectElements[2].p.v,
					i = this.filterManager.effectElements[6].p.v;
				this.matrixFilter.setAttribute("values", "0 0 0 0 " + e[0] + " 0 0 0 0 " + e[1] + " 0 0 0 0 " + e[2] + " 0 0 0 " + i + " 0")
			}
		}, st.prototype.initialize = function () {
			var t, e, i, s, r = this.elem.layerElement.children || this.elem.layerElement.childNodes;
			for (1 === this.filterManager.effectElements[1].p.v ? (s = this.elem.maskManager.masksProperties.length, i = 0) : s = (i = this.filterManager.effectElements[0].p.v - 1) + 1, (e = k("g")).setAttribute("fill", "none"), e.setAttribute("stroke-linecap", "round"), e.setAttribute("stroke-dashoffset", 1); i < s; i += 1) t = k("path"), e.appendChild(t), this.paths.push({
				p: t,
				m: i
			});
			if (3 === this.filterManager.effectElements[10].p.v) {
				var n = k("mask"),
					a = "stms_" + T(10);
				n.setAttribute("id", a), n.setAttribute("mask-type", "alpha"), n.appendChild(e), this.elem.globalData.defs.appendChild(n);
				var o = k("g");
				for (o.setAttribute("mask", "url(" + _t + "#" + a + ")"); r[0];) o.appendChild(r[0]);
				this.elem.layerElement.appendChild(o), this.masker = n, e.setAttribute("stroke", "#fff")
			} else if (1 === this.filterManager.effectElements[10].p.v || 2 === this.filterManager.effectElements[10].p.v) {
				if (2 === this.filterManager.effectElements[10].p.v)
					for (r = this.elem.layerElement.children || this.elem.layerElement.childNodes; r.length;) this.elem.layerElement.removeChild(r[0]);
				this.elem.layerElement.appendChild(e), this.elem.layerElement.removeAttribute("mask"), e.setAttribute("stroke", "#fff")
			}
			this.initialized = !0, this.pathMasker = e
		}, st.prototype.renderFrame = function (t) {
			this.initialized || this.initialize();
			var e, i, s, r = this.paths.length;
			for (e = 0; e < r; e += 1)
				if (-1 !== this.paths[e].m && (i = this.elem.maskManager.viewData[this.paths[e].m], s = this.paths[e].p, (t || this.filterManager._mdf || i.prop._mdf) && s.setAttribute("d", i.lastPath), t || this.filterManager.effectElements[9].p._mdf || this.filterManager.effectElements[4].p._mdf || this.filterManager.effectElements[7].p._mdf || this.filterManager.effectElements[8].p._mdf || i.prop._mdf)) {
					var n;
					if (0 !== this.filterManager.effectElements[7].p.v || 100 !== this.filterManager.effectElements[8].p.v) {
						var a = Math.min(this.filterManager.effectElements[7].p.v, this.filterManager.effectElements[8].p.v) / 100,
							o = Math.max(this.filterManager.effectElements[7].p.v, this.filterManager.effectElements[8].p.v) / 100,
							h = s.getTotalLength();
						n = "0 0 0 " + h * a + " ";
						var l, p = h * (o - a),
							f = 1 + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v / 100,
							u = Math.floor(p / f);
						for (l = 0; l < u; l += 1) n += "1 " + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v / 100 + " ";
						n += "0 " + 10 * h + " 0 0"
					} else n = "1 " + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v / 100;
					s.setAttribute("stroke-dasharray", n)
				}
			if ((t || this.filterManager.effectElements[4].p._mdf) && this.pathMasker.setAttribute("stroke-width", 2 * this.filterManager.effectElements[4].p.v), (t || this.filterManager.effectElements[6].p._mdf) && this.pathMasker.setAttribute("opacity", this.filterManager.effectElements[6].p.v), (1 === this.filterManager.effectElements[10].p.v || 2 === this.filterManager.effectElements[10].p.v) && (t || this.filterManager.effectElements[3].p._mdf)) {
				var c = this.filterManager.effectElements[3].p.v;
				this.pathMasker.setAttribute("stroke", "rgb(" + Tt(255 * c[0]) + "," + Tt(255 * c[1]) + "," + Tt(255 * c[2]) + ")")
			}
		}, rt.prototype.renderFrame = function (t) {
			if (t || this.filterManager._mdf) {
				var e = this.filterManager.effectElements[0].p.v,
					i = this.filterManager.effectElements[1].p.v,
					s = this.filterManager.effectElements[2].p.v,
					r = s[0] + " " + i[0] + " " + e[0],
					n = s[1] + " " + i[1] + " " + e[1],
					a = s[2] + " " + i[2] + " " + e[2];
				this.feFuncR.setAttribute("tableValues", r), this.feFuncG.setAttribute("tableValues", n), this.feFuncB.setAttribute("tableValues", a)
			}
		}, nt.prototype.createFeFunc = function (t, e) {
			var i = k(t);
			return i.setAttribute("type", "table"), e.appendChild(i), i
		}, nt.prototype.getTableValue = function (t, e, i, s, r) {
			for (var n, a, o = 0, h = Math.min(t, e), l = Math.max(t, e), p = Array.call(null, {
					length: 256
				}), f = 0, u = r - s, c = e - t; o <= 256;) a = (n = o / 256) <= h ? c < 0 ? r : s : l <= n ? c < 0 ? s : r : s + u * Math.pow((n - t) / c, 1 / i), p[f++] = a, o += 256 / 255;
			return p.join(" ")
		}, nt.prototype.renderFrame = function (t) {
			if (t || this.filterManager._mdf) {
				var e, i = this.filterManager.effectElements;
				this.feFuncRComposed && (t || i[3].p._mdf || i[4].p._mdf || i[5].p._mdf || i[6].p._mdf || i[7].p._mdf) && (e = this.getTableValue(i[3].p.v, i[4].p.v, i[5].p.v, i[6].p.v, i[7].p.v), this.feFuncRComposed.setAttribute("tableValues", e), this.feFuncGComposed.setAttribute("tableValues", e), this.feFuncBComposed.setAttribute("tableValues", e)), this.feFuncR && (t || i[10].p._mdf || i[11].p._mdf || i[12].p._mdf || i[13].p._mdf || i[14].p._mdf) && (e = this.getTableValue(i[10].p.v, i[11].p.v, i[12].p.v, i[13].p.v, i[14].p.v), this.feFuncR.setAttribute("tableValues", e)), this.feFuncG && (t || i[17].p._mdf || i[18].p._mdf || i[19].p._mdf || i[20].p._mdf || i[21].p._mdf) && (e = this.getTableValue(i[17].p.v, i[18].p.v, i[19].p.v, i[20].p.v, i[21].p.v), this.feFuncG.setAttribute("tableValues", e)), this.feFuncB && (t || i[24].p._mdf || i[25].p._mdf || i[26].p._mdf || i[27].p._mdf || i[28].p._mdf) && (e = this.getTableValue(i[24].p.v, i[25].p.v, i[26].p.v, i[27].p.v, i[28].p.v), this.feFuncB.setAttribute("tableValues", e)), this.feFuncA && (t || i[31].p._mdf || i[32].p._mdf || i[33].p._mdf || i[34].p._mdf || i[35].p._mdf) && (e = this.getTableValue(i[31].p.v, i[32].p.v, i[33].p.v, i[34].p.v, i[35].p.v), this.feFuncA.setAttribute("tableValues", e))
			}
		}, at.prototype.renderFrame = function (t) {
			if (t || this.filterManager._mdf) {
				if ((t || this.filterManager.effectElements[4].p._mdf) && this.feGaussianBlur.setAttribute("stdDeviation", this.filterManager.effectElements[4].p.v / 4), t || this.filterManager.effectElements[0].p._mdf) {
					var e = this.filterManager.effectElements[0].p.v;
					this.feFlood.setAttribute("flood-color", Dt(Math.round(255 * e[0]), Math.round(255 * e[1]), Math.round(255 * e[2])))
				}
				if ((t || this.filterManager.effectElements[1].p._mdf) && this.feFlood.setAttribute("flood-opacity", this.filterManager.effectElements[1].p.v / 255), t || this.filterManager.effectElements[2].p._mdf || this.filterManager.effectElements[3].p._mdf) {
					var i = this.filterManager.effectElements[3].p.v,
						s = (this.filterManager.effectElements[2].p.v - 90) * At,
						r = i * Math.cos(s),
						n = i * Math.sin(s);
					this.feOffset.setAttribute("dx", r), this.feOffset.setAttribute("dy", n)
				}
			}
		};
		var oe = [],
			he = 0;
		ot.prototype.findSymbol = function (t) {
			for (var e = 0, i = oe.length; e < i;) {
				if (oe[e] === t) return oe[e];
				e += 1
			}
			return null
		}, ot.prototype.replaceInParent = function (t, e) {
			var i = t.layerElement.parentNode;
			if (i) {
				for (var s = i.children, r = 0, n = s.length; r < n && s[r] !== t.layerElement;) r += 1;
				var a;
				r <= n - 2 && (a = s[r + 1]);
				var o = k("use");
				o.setAttribute("href", "#" + e), a ? i.insertBefore(o, a) : i.appendChild(o)
			}
		}, ot.prototype.setElementAsMask = function (t, e) {
			if (!this.findSymbol(e)) {
				var i = "matte_" + T(5) + "_" + he++,
					s = k("mask");
				s.setAttribute("id", e.layerId), s.setAttribute("mask-type", "alpha"), oe.push(e);
				var r = t.globalData.defs;
				r.appendChild(s);
				var n = k("symbol");
				n.setAttribute("id", i), this.replaceInParent(e, i), n.appendChild(e.layerElement), r.appendChild(n);
				var a = k("use");
				a.setAttribute("href", "#" + i), s.appendChild(a), e.data.hd = !1, e.show()
			}
			t.setMatte(e.layerId)
		}, ot.prototype.initialize = function () {
			for (var t = this.filterManager.effectElements[0].p.v, e = this.elem.comp.elements, i = 0, s = e.length; i < s;) e[i] && e[i].data.ind === t && this.setElementAsMask(this.elem, e[i]), i += 1;
			this.initialized = !0
		}, ot.prototype.renderFrame = function () {
			this.initialized || this.initialize()
		}, ht.prototype.renderFrame = function (t) {
			var e, i = this.filters.length;
			for (e = 0; e < i; e += 1) this.filters[e].renderFrame(t)
		};
		var le = function () {
				function i(t) {
					for (var e = 0, i = t.target; e < f;) l[e].animation === i && (l.splice(e, 1), e -= 1, f -= 1, i.isPaused || r()), e += 1
				}

				function h(t, e) {
					if (!t) return null;
					for (var i = 0; i < f;) {
						if (l[i].elem == t && null !== l[i].elem) return l[i].animation;
						i += 1
					}
					var s = new pe;
					return n(s, t), s.setData(t, e), s
				}

				function s() {
					u += 1, e()
				}

				function r() {
					u -= 1
				}

				function n(t, e) {
					t.addEventListener("destroy", i), t.addEventListener("_active", s), t.addEventListener("_idle", r), l.push({
						elem: e,
						animation: t
					}), f += 1
				}

				function a(t) {
					var e, i = t - p;
					for (e = 0; e < f; e += 1) l[e].animation.advanceTime(i);
					p = t, u && !d ? g.requestAnimationFrame(a) : c = !0
				}

				function t(t) {
					p = t, g.requestAnimationFrame(a)
				}

				function e() {
					!d && u && c && (g.requestAnimationFrame(t), c = !1)
				}
				var o = {},
					l = [],
					p = 0,
					f = 0,
					u = 0,
					c = !0,
					d = !1;
				return o.registerAnimation = h, o.loadAnimation = function (t) {
					var e = new pe;
					return n(e, null), e.setParams(t), e
				}, o.setSpeed = function (t, e) {
					var i;
					for (i = 0; i < f; i += 1) l[i].animation.setSpeed(t, e)
				}, o.setDirection = function (t, e) {
					var i;
					for (i = 0; i < f; i += 1) l[i].animation.setDirection(t, e)
				}, o.play = function (t) {
					var e;
					for (e = 0; e < f; e += 1) l[e].animation.play(t)
				}, o.pause = function (t) {
					var e;
					for (e = 0; e < f; e += 1) l[e].animation.pause(t)
				}, o.stop = function (t) {
					var e;
					for (e = 0; e < f; e += 1) l[e].animation.stop(t)
				}, o.togglePause = function (t) {
					var e;
					for (e = 0; e < f; e += 1) l[e].animation.togglePause(t)
				}, o.searchAnimations = function (t, e, i) {
					var s, r = [].concat([].slice.call(document.getElementsByClassName("lottie")), [].slice.call(document.getElementsByClassName("bodymovin"))),
						n = r.length;
					for (s = 0; s < n; s += 1) i && r[s].setAttribute("data-bm-type", i), h(r[s], t);
					if (e && 0 === n) {
						i || (i = "svg");
						var a = document.getElementsByTagName("body")[0];
						a.innerHTML = "";
						var o = _("div");
						o.style.width = "100%", o.style.height = "100%", o.setAttribute("data-bm-type", i), a.appendChild(o), h(o, t)
					}
				}, o.resize = function () {
					var t;
					for (t = 0; t < f; t += 1) l[t].animation.resize()
				}, o.goToAndStop = function (t, e, i) {
					var s;
					for (s = 0; s < f; s += 1) l[s].animation.goToAndStop(t, e, i)
				}, o.destroy = function (t) {
					var e;
					for (e = f - 1; 0 <= e; e -= 1) l[e].animation.destroy(t)
				}, o.freeze = function () {
					d = !0
				}, o.unfreeze = function () {
					d = !1, e()
				}, o.getRegisteredAnimations = function () {
					var t, e = l.length,
						i = [];
					for (t = 0; t < e; t += 1) i.push(l[t].animation);
					return i
				}, o
			}(),
			pe = function () {
				this._cbs = [], this.name = "", this.path = "", this.isLoaded = !1, this.currentFrame = 0, this.currentRawFrame = 0, this.totalFrames = 0, this.frameRate = 0, this.frameMult = 0, this.playSpeed = 1, this.playDirection = 1, this.playCount = 0, this.animationData = {}, this.assets = [], this.isPaused = !0, this.autoplay = !1, this.loop = !0, this.renderer = null, this.animationID = T(10), this.assetsPath = "", this.timeCompleted = 0, this.segmentPos = 0, this.subframeEnabled = vt, this.segments = [], this._idle = !0, this._completedLoop = !1, this.projectInterface = {}, this.imagePreloader = new Yt
			};
		c([t], pe), pe.prototype.setParams = function (t) {
			t.context && (this.context = t.context), (t.wrapper || t.container) && (this.wrapper = t.wrapper || t.container);
			var e = t.animType ? t.animType : t.renderer ? t.renderer : "svg";
			switch (e) {
				case "canvas":
					this.renderer = new CanvasRenderer(this, t.rendererSettings);
					break;
				case "svg":
					this.renderer = new D(this, t.rendererSettings);
					break;
				default:
					this.renderer = new HybridRenderer(this, t.rendererSettings)
			}
			this.renderer.setProjectInterface(this.projectInterface), this.animType = e, "" === t.loop || null === t.loop || (!1 === t.loop ? this.loop = !1 : !0 === t.loop ? this.loop = !0 : this.loop = parseInt(t.loop)), this.autoplay = !("autoplay" in t) || t.autoplay, this.name = t.name ? t.name : "", this.autoloadSegments = !t.hasOwnProperty("autoloadSegments") || t.autoloadSegments, this.assetsPath = t.assetsPath, t.animationData ? this.configAnimation(t.animationData) : t.path && ("json" != t.path.substr(-4) && ("/" != t.path.substr(-1, 1) && (t.path += "/"), t.path += "data.json"), -1 != t.path.lastIndexOf("\\") ? this.path = t.path.substr(0, t.path.lastIndexOf("\\") + 1) : this.path = t.path.substr(0, t.path.lastIndexOf("/") + 1), this.fileName = t.path.substr(t.path.lastIndexOf("/") + 1), this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf(".json")), Wt.load(t.path, this.configAnimation.bind(this), function () {
				this.trigger("data_failed")
			}.bind(this)))
		}, pe.prototype.setData = function (t, e) {
			var i = {
					wrapper: t,
					animationData: e ? "object" == typeof e ? e : JSON.parse(e) : null
				},
				s = t.attributes;
			i.path = s.getNamedItem("data-animation-path") ? s.getNamedItem("data-animation-path").value : s.getNamedItem("data-bm-path") ? s.getNamedItem("data-bm-path").value : s.getNamedItem("bm-path") ? s.getNamedItem("bm-path").value : "", i.animType = s.getNamedItem("data-anim-type") ? s.getNamedItem("data-anim-type").value : s.getNamedItem("data-bm-type") ? s.getNamedItem("data-bm-type").value : s.getNamedItem("bm-type") ? s.getNamedItem("bm-type").value : s.getNamedItem("data-bm-renderer") ? s.getNamedItem("data-bm-renderer").value : s.getNamedItem("bm-renderer") ? s.getNamedItem("bm-renderer").value : "canvas";
			var r = s.getNamedItem("data-anim-loop") ? s.getNamedItem("data-anim-loop").value : s.getNamedItem("data-bm-loop") ? s.getNamedItem("data-bm-loop").value : s.getNamedItem("bm-loop") ? s.getNamedItem("bm-loop").value : "";
			"" === r || (i.loop = "false" !== r && ("true" === r || parseInt(r)));
			var n = s.getNamedItem("data-anim-autoplay") ? s.getNamedItem("data-anim-autoplay").value : s.getNamedItem("data-bm-autoplay") ? s.getNamedItem("data-bm-autoplay").value : !s.getNamedItem("bm-autoplay") || s.getNamedItem("bm-autoplay").value;
			i.autoplay = "false" !== n, i.name = s.getNamedItem("data-name") ? s.getNamedItem("data-name").value : s.getNamedItem("data-bm-name") ? s.getNamedItem("data-bm-name").value : s.getNamedItem("bm-name") ? s.getNamedItem("bm-name").value : "", "false" === (s.getNamedItem("data-anim-prerender") ? s.getNamedItem("data-anim-prerender").value : s.getNamedItem("data-bm-prerender") ? s.getNamedItem("data-bm-prerender").value : s.getNamedItem("bm-prerender") ? s.getNamedItem("bm-prerender").value : "") && (i.prerender = !1), this.setParams(i)
		}, pe.prototype.includeLayers = function (t) {
			t.op > this.animationData.op && (this.animationData.op = t.op, this.totalFrames = Math.floor(t.op - this.animationData.ip));
			var e, i, s = this.animationData.layers,
				r = s.length,
				n = t.layers,
				a = n.length;
			for (i = 0; i < a; i += 1)
				for (e = 0; e < r;) {
					if (s[e].id == n[i].id) {
						s[e] = n[i];
						break
					}
					e += 1
				}
			if ((t.chars || t.fonts) && (this.renderer.globalData.fontManager.addChars(t.chars), this.renderer.globalData.fontManager.addFonts(t.fonts, this.renderer.globalData.defs)), t.assets)
				for (r = t.assets.length, e = 0; e < r; e += 1) this.animationData.assets.push(t.assets[e]);
			this.animationData.__complete = !1, It.completeData(this.animationData, this.renderer.globalData.fontManager), this.renderer.includeLayers(t.layers), mt && mt.initExpressions(this), this.loadNextSegment()
		}, pe.prototype.loadNextSegment = function () {
			var t = this.animationData.segments;
			if (!t || 0 === t.length || !this.autoloadSegments) return this.trigger("data_ready"), void(this.timeCompleted = this.totalFrames);
			var e = t.shift();
			this.timeCompleted = e.time * this.frameRate;
			var i = this.path + this.fileName + "_" + this.segmentPos + ".json";
			this.segmentPos += 1, Wt.load(i, this.includeLayers.bind(this), function () {
				this.trigger("data_failed")
			}.bind(this))
		}, pe.prototype.loadSegments = function () {
			this.animationData.segments || (this.timeCompleted = this.totalFrames), this.loadNextSegment()
		}, pe.prototype.imagesLoaded = function () {
			this.trigger("loaded_images"), this.checkLoaded()
		}, pe.prototype.preloadImages = function () {
			this.imagePreloader.setAssetsPath(this.assetsPath), this.imagePreloader.setPath(this.path), this.imagePreloader.loadAssets(this.animationData.assets, this.imagesLoaded.bind(this))
		}, pe.prototype.configAnimation = function (t) {
			this.renderer && (this.animationData = t, this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip), this.renderer.configAnimation(t), t.assets || (t.assets = []), this.renderer.searchExtraCompositions(t.assets), this.assets = this.animationData.assets, this.frameRate = this.animationData.fr, this.firstFrame = Math.round(this.animationData.ip), this.frameMult = this.animationData.fr / 1e3, this.trigger("config_ready"), this.preloadImages(), this.loadSegments(), this.updaFrameModifier(), this.waitForFontsLoaded())
		}, pe.prototype.waitForFontsLoaded = function () {
			this.renderer && (this.renderer.globalData.fontManager.loaded() ? this.checkLoaded() : setTimeout(this.waitForFontsLoaded.bind(this), 20))
		}, pe.prototype.checkLoaded = function () {
			this.isLoaded || !this.renderer.globalData.fontManager.loaded() || !this.imagePreloader.loaded() && "canvas" === this.renderer.rendererType || (this.isLoaded = !0, It.completeData(this.animationData, this.renderer.globalData.fontManager), mt && mt.initExpressions(this), this.renderer.initItems(), setTimeout(function () {
				this.trigger("DOMLoaded")
			}.bind(this), 0), this.gotoFrame(), this.autoplay && this.play())
		}, pe.prototype.resize = function () {
			this.renderer.updateContainerSize()
		}, pe.prototype.setSubframe = function (t) {
			this.subframeEnabled = !!t
		}, pe.prototype.gotoFrame = function () {
			this.currentFrame = this.subframeEnabled ? this.currentRawFrame : ~~this.currentRawFrame, this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted && (this.currentFrame = this.timeCompleted), this.trigger("enterFrame"), this.renderFrame()
		}, pe.prototype.renderFrame = function () {
			!1 !== this.isLoaded && this.renderer.renderFrame(this.currentFrame + this.firstFrame)
		}, pe.prototype.play = function (t) {
			t && this.name != t || !0 === this.isPaused && (this.isPaused = !1, this._idle && (this._idle = !1, this.trigger("_active")))
		}, pe.prototype.pause = function (t) {
			t && this.name != t || !1 === this.isPaused && (this.isPaused = !0, this._idle = !0, this.trigger("_idle"))
		}, pe.prototype.togglePause = function (t) {
			t && this.name != t || (!0 === this.isPaused ? this.play() : this.pause())
		}, pe.prototype.stop = function (t) {
			t && this.name != t || (this.pause(), this.playCount = 0, this._completedLoop = !1, this.setCurrentRawFrameValue(0))
		}, pe.prototype.goToAndStop = function (t, e, i) {
			i && this.name != i || (e ? this.setCurrentRawFrameValue(t) : this.setCurrentRawFrameValue(t * this.frameModifier), this.pause())
		}, pe.prototype.goToAndPlay = function (t, e, i) {
			this.goToAndStop(t, e, i), this.play()
		}, pe.prototype.advanceTime = function (t) {
			if (!0 !== this.isPaused && !1 !== this.isLoaded) {
				var e = this.currentRawFrame + t * this.frameModifier,
					i = !1;
				e >= this.totalFrames - 1 && 0 < this.frameModifier ? this.loop && this.playCount !== this.loop ? e >= this.totalFrames ? (this.playCount += 1, this.checkSegments(e % this.totalFrames) || (this.setCurrentRawFrameValue(e % this.totalFrames), this._completedLoop = !0, this.trigger("loopComplete"))) : this.setCurrentRawFrameValue(e) : this.checkSegments(e > this.totalFrames ? e % this.totalFrames : 0) || (i = !0, e = this.totalFrames - 1) : e < 0 ? this.checkSegments(e % this.totalFrames) || (!this.loop || this.playCount-- <= 0 && !0 !== this.loop ? (i = !0, e = 0) : (this.setCurrentRawFrameValue(this.totalFrames + e % this.totalFrames), this._completedLoop ? this.trigger("loopComplete") : this._completedLoop = !0)) : this.setCurrentRawFrameValue(e), i && (this.setCurrentRawFrameValue(e), this.pause(), this.trigger("complete"))
			}
		}, pe.prototype.adjustSegment = function (t, e) {
			this.playCount = 0, t[1] < t[0] ? (0 < this.frameModifier && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(-1)), this.timeCompleted = this.totalFrames = t[0] - t[1], this.firstFrame = t[1], this.setCurrentRawFrameValue(this.totalFrames - .001 - e)) : t[1] > t[0] && (this.frameModifier < 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(1)), this.timeCompleted = this.totalFrames = t[1] - t[0], this.firstFrame = t[0], this.setCurrentRawFrameValue(.001 + e)), this.trigger("segmentStart")
		}, pe.prototype.setSegment = function (t, e) {
			var i = -1;
			this.isPaused && (this.currentRawFrame + this.firstFrame < t ? i = t : this.currentRawFrame + this.firstFrame > e && (i = e - t)), this.firstFrame = t, this.timeCompleted = this.totalFrames = e - t, -1 !== i && this.goToAndStop(i, !0)
		}, pe.prototype.playSegments = function (t, e) {
			if (e && (this.segments.length = 0), "object" == typeof t[0]) {
				var i, s = t.length;
				for (i = 0; i < s; i += 1) this.segments.push(t[i])
			} else this.segments.push(t);
			this.segments.length && this.adjustSegment(this.segments.shift(), 0), this.isPaused && this.play()
		}, pe.prototype.resetSegments = function (t) {
			this.segments.length = 0, this.segments.push([this.animationData.ip, this.animationData.op]), t && this.checkSegments(0)
		}, pe.prototype.checkSegments = function (t) {
			return !!this.segments.length && (this.adjustSegment(this.segments.shift(), t), !0)
		}, pe.prototype.destroy = function (t) {
			t && this.name != t || !this.renderer || (this.renderer.destroy(), this.imagePreloader.destroy(), this.trigger("destroy"), this._cbs = null, this.onEnterFrame = this.onLoopComplete = this.onComplete = this.onSegmentStart = this.onDestroy = null, this.renderer = null)
		}, pe.prototype.setCurrentRawFrameValue = function (t) {
			this.currentRawFrame = t, this.gotoFrame()
		}, pe.prototype.setSpeed = function (t) {
			this.playSpeed = t, this.updaFrameModifier()
		}, pe.prototype.setDirection = function (t) {
			this.playDirection = t < 0 ? -1 : 1, this.updaFrameModifier()
		}, pe.prototype.updaFrameModifier = function () {
			this.frameModifier = this.frameMult * this.playSpeed * this.playDirection
		}, pe.prototype.getPath = function () {
			return this.path
		}, pe.prototype.getAssetsPath = function (t) {
			var e = "";
			if (t.e) e = t.p;
			else if (this.assetsPath) {
				var i = t.p; - 1 !== i.indexOf("images/") && (i = i.split("/")[1]), e = this.assetsPath + i
			} else e = this.path, e += t.u ? t.u : "", e += t.p;
			return e
		}, pe.prototype.getAssetData = function (t) {
			for (var e = 0, i = this.assets.length; e < i;) {
				if (t == this.assets[e].id) return this.assets[e];
				e += 1
			}
		}, pe.prototype.hide = function () {
			this.renderer.hide()
		}, pe.prototype.show = function () {
			this.renderer.show()
		}, pe.prototype.getDuration = function (t) {
			return t ? this.totalFrames : this.totalFrames / this.frameRate
		}, pe.prototype.trigger = function (t) {
			if (this._cbs && this._cbs[t]) switch (t) {
				case "enterFrame":
					this.triggerEvent(t, new i(t, this.currentFrame, this.totalFrames, this.frameMult));
					break;
				case "loopComplete":
					this.triggerEvent(t, new r(t, this.loop, this.playCount, this.frameMult));
					break;
				case "complete":
					this.triggerEvent(t, new s(t, this.frameMult));
					break;
				case "segmentStart":
					this.triggerEvent(t, new n(t, this.firstFrame, this.totalFrames));
					break;
				case "destroy":
					this.triggerEvent(t, new a(t, this));
					break;
				default:
					this.triggerEvent(t)
			}
			"enterFrame" === t && this.onEnterFrame && this.onEnterFrame.call(this, new i(t, this.currentFrame, this.totalFrames, this.frameMult)), "loopComplete" === t && this.onLoopComplete && this.onLoopComplete.call(this, new r(t, this.loop, this.playCount, this.frameMult)), "complete" === t && this.onComplete && this.onComplete.call(this, new s(t, this.frameMult)), "segmentStart" === t && this.onSegmentStart && this.onSegmentStart.call(this, new n(t, this.firstFrame, this.totalFrames)), "destroy" === t && this.onDestroy && this.onDestroy.call(this, new a(t, this))
		};
		var fe = {};
		fe.play = le.play, fe.pause = le.pause, fe.setLocationHref = function (t) {
			_t = t
		}, fe.togglePause = le.togglePause, fe.setSpeed = le.setSpeed, fe.setDirection = le.setDirection, fe.stop = le.stop, fe.searchAnimations = dt, fe.registerAnimation = le.registerAnimation, fe.loadAnimation = function (t) {
			return !0 === ue && (t.animationData = JSON.parse(ce)), le.loadAnimation(t)
		}, fe.setSubframeRendering = function (t) {
			vt = t
		}, fe.resize = le.resize, fe.goToAndStop = le.goToAndStop, fe.destroy = le.destroy, fe.setQuality = function (t) {
			if ("string" == typeof t) switch (t) {
				case "high":
					Pt = 200;
					break;
				case "medium":
					Pt = 50;
					break;
				case "low":
					Pt = 10
			} else !isNaN(t) && 1 < t && (Pt = t);
			e(!(50 <= Pt))
		}, fe.inBrowser = function () {
			return "undefined" != typeof navigator
		}, fe.installPlugin = function (t, e) {
			"expressions" === t && (mt = e)
		}, fe.freeze = le.freeze, fe.unfreeze = le.unfreeze, fe.getRegisteredAnimations = le.getRegisteredAnimations, fe.__getFactory = function (t) {
			switch (t) {
				case "propertyFactory":
					return Ot;
				case "shapePropertyFactory":
					return Vt;
				case "matrix":
					return Mt
			}
		}, fe.version = "5.4.2";
		var ue = "__[STANDALONE]__",
			ce = "__[ANIMATIONDATA]__",
			de = "";
		if (ue) {
			var me = document.getElementsByTagName("script"),
				ge = (me[me.length - 1] || {
					src: ""
				}).src.replace(/^[^\?]+\??/, "");
			de = function (t) {
				for (var e = ge.split("&"), i = 0; i < e.length; i++) {
					var s = e[i].split("=");
					if (decodeURIComponent(s[0]) == t) return decodeURIComponent(s[1])
				}
			}("renderer")
		}
		var _e = setInterval(function () {
			"complete" === document.readyState && (clearInterval(_e), dt())
		}, 100);
		return fe
	}),
	function (t, e) {
		if ("function" == typeof define && define.amd) define(["exports", "module"], e);
		else if ("undefined" != typeof exports && "undefined" != typeof module) e(exports, module);
		else {
			var i = {
				exports: {}
			};
			e(i.exports, i), t.Impetus = i.exports
		}
	}(this, function (t, e) {
		"use strict";

		function G() {
			var t = !1;
			try {
				var e = Object.defineProperty({}, "passive", {
					get: function () {
						t = !0
					}
				});
				window.addEventListener("test", null, e)
			} catch (t) {}
			return G = function () {
				return t
			}, t
		}
		window.addEventListener("touchmove", function () {});
		e.exports = function t(e) {
			function i() {
				document.removeEventListener("touchmove", a, !!G() && {
					passive: !1
				}), document.removeEventListener("touchend", o), document.removeEventListener("touchcancel", h), document.removeEventListener("mousemove", a, !!G() && {
					passive: !1
				}), document.removeEventListener("mouseup", o)
			}

			function s() {
				g.call(m, z, N)
			}

			function r(t) {
				if ("touchmove" === t.type || "touchstart" === t.type || "touchend" === t.type) {
					var e = t.targetTouches[0] || t.changedTouches[0];
					return {
						x: e.clientX,
						y: e.clientY,
						id: e.identifier
					}
				}
				return {
					x: t.clientX,
					y: t.clientY,
					id: null
				}
			}

			function n(t) {
				var e = r(t);
				j || X || (Y = !(j = !0), R = e.id, M = E = e.x, F = I = e.y, q = [], l(M, F), i(), document.addEventListener("touchmove", a, !!G() && {
					passive: !1
				}), document.addEventListener("touchend", o), document.addEventListener("touchcancel", h), document.addEventListener("mousemove", a, !!G() && {
					passive: !1
				}), document.addEventListener("mouseup", o))
			}

			function a(t) {
				t.preventDefault();
				var e = r(t);
				j && e.id === R && (E = e.x, I = e.y, l(M, F), B || W(p), B = !0)
			}

			function o(t) {
				var e = r(t);
				j && e.id === R && h()
			}

			function h() {
				j = !1, l(M, F),
					function () {
						var t = q[0],
							e = q[q.length - 1],
							i = e.x - t.x,
							s = e.y - t.y,
							r = (e.time - t.time) / 15 / y;
						O = i / r || 0, L = s / r || 0;
						var n = u();
						(1 < Math.abs(O) || 1 < Math.abs(L) || !n.inBounds) && (Y = !0, W(c))
					}(), i()
			}

			function l(t, e) {
				for (var i = Date.now(); 0 < q.length && !(i - q[0].time <= 100);) q.shift();
				q.push({
					x: t,
					y: e,
					time: i
				})
			}

			function p() {
				var t = E - M,
					e = I - F;
				if (z += t * y, N += e * y, P) {
					var i = u();
					0 !== i.x && (z -= t * f(i.x) * y), 0 !== i.y && (N -= e * f(i.y) * y)
				} else u(!0);
				s(), M = E, F = I, B = !1
			}

			function f(t) {
				return 5e-6 * Math.pow(t, 2) + 1e-4 * t + .55
			}

			function u(t) {
				var e = 0,
					i = 0;
				return void 0 !== A && z < A ? e = A - z : void 0 !== S && S < z && (e = S - z), void 0 !== D && N < D ? i = D - N : void 0 !== C && C < N && (i = C - N), t && (0 !== e && (z = 0 < e ? A : S), 0 !== i && (N = 0 < i ? D : C)), {
					x: e,
					y: i,
					inBounds: 0 === e && 0 === i
				}
			}

			function c() {
				if (Y) {
					z += O *= b, N += L *= b;
					var t = u();
					if (Math.abs(O) > V || Math.abs(L) > V || !t.inBounds) {
						if (P) {
							if (0 !== t.x)
								if (t.x * O <= 0) O += .04 * t.x;
								else {
									var e = 0 < t.x ? 2.5 : -2.5;
									O = .11 * (t.x + e)
								}
							0 !== t.y && (t.y * L <= 0 ? L += .04 * t.y : (e = 0 < t.y ? 2.5 : -2.5, L = .11 * (t.y + e)))
						} else 0 !== t.x && (z = 0 < t.x ? A : S, O = 0), 0 !== t.y && (N = 0 < t.y ? D : C, L = 0);
						s(), W(c)
					} else Y = !1
				}
			}
			var d = e.source,
				m = void 0 === d ? document : d,
				g = e.update,
				_ = e.multiplier,
				y = void 0 === _ ? 1 : _,
				v = e.friction,
				b = void 0 === v ? .92 : v,
				x = e.initialValues,
				T = e.boundX,
				w = e.boundY,
				k = e.bounce,
				P = void 0 === k || k;
			! function (t, e) {
				if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
			}(this, t);
			var A, S, D, C, M, F, E, I, R, O, L, z = 0,
				N = 0,
				V = .3 * y,
				B = !1,
				j = !1,
				X = !1,
				Y = !1,
				q = [];
			! function () {
				if (!(m = "string" == typeof m ? document.querySelector(m) : m)) throw new Error("IMPETUS: source not found.");
				if (!g) throw new Error("IMPETUS: update function not defined.");
				x && (x[0] && (z = x[0]), x[1] && (N = x[1]), s()), T && (A = T[0], S = T[1]), w && (D = w[0], C = w[1]), m.addEventListener("touchstart", n), m.addEventListener("mousedown", n)
			}(), this.destroy = function () {
				return m.removeEventListener("touchstart", n), m.removeEventListener("mousedown", n), i(), null
			}, this.pause = function () {
				i(), X = !(j = !1)
			}, this.resume = function () {
				X = !1
			}, this.setValues = function (t, e) {
				"number" == typeof t && (z = t), "number" == typeof e && (N = e)
			}, this.setMultiplier = function (t) {
				V = .3 * (y = t)
			}, this.setBoundX = function (t) {
				A = t[0], S = t[1]
			}, this.setBoundY = function (t) {
				D = t[0], C = t[1]
			}
		};
		var W = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (t) {
			window.setTimeout(t, 1e3 / 60)
		}
	});