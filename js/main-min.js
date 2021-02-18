'use strict';
var _createClass = function ()
{
	function c(f, l)
	{
		for (var o, n = 0; n < l.length; n++) o = l[n], o.enumerable = o.enumerable || !1, o.configurable = !0, 'value' in o && (o.writable = !0), Object.defineProperty(f, o.key, o)
	}
	return function (f, l, n)
	{
		return l && c(f.prototype, l), n && c(f, n), f
	}
}();

function _classCallCheck(c, f)
{
	if (!(c instanceof f)) throw new TypeError('Cannot call a class as a function')
}
var body = document.querySelector('body'),
	isMobile = is.mobile(),
	isTablet = is.tablet(),
	isFF = is.firefox(),
	isIE11 = is.ie(11);
isMobile || isTablet || (document.styleSheets[1].disabled = !0, document.styleSheets[2].disabled = !0);
var currentPage = null,
	currentPageName = null,
	initLanding = null,
	raf = null,
	scrollAllow = !1,
	dragCursorAllow = !1,
	pixelRatio = window.devicePixelRatio || 1,
	windowHeight, windowWidth, deviceOrientation, scrollEaseFactor = 0.12,
	scrollMultiplier, fire = null,
	guestbook = null,
	cursor = null,
	mylottie = null,
	scrollbar = null,
	visiterCityName = document.querySelector('#visiter_city') ? document.querySelector('#visiter_city').innerHTML : null,
	homepage = null,
	grayClassName = isFF ? null : 'gray',
	customInOut1 = CustomEase.create('custom', 'M0,0 C0.272,0 0.178,0.992 1,1'),
	Helper = function ()
	{
		function c()
		{
			_classCallCheck(this, c)
		}
		return _createClass(c, [
		{
			key: 'precisionRound',
			value: function precisionRound(f, l)
			{
				var n = Math.pow(10, l);
				return Math.round(f * n) / n
			}
		},
		{
			key: 'randomRnage',
			value: function randomRnage(f, l)
			{
				return Math.floor(Math.random() * l) + f
			}
		},
		{
			key: 'randomRnageS',
			value: function randomRnageS(f, l)
			{
				return Math.random() * l + f
			}
		},
		{
			key: 'randomRnageF',
			value: function randomRnageF(f, l)
			{
				return Math.random() * (l - f) + f
			}
		},
		{
			key: 'roundTwo',
			value: function roundTwo(f)
			{
				return Math.round(100 * f) / 100
			}
		},
		{
			key: 'limit',
			value: function limit(f, l, n)
			{
				return Math.max(f, Math.min(l, n))
			}
		},
		{
			key: 'clamp',
			value: function clamp(f, l, n)
			{
				return Math.min(Math.max(n, f), l)
			}
		},
		{
			key: 'modulate',
			value: function modulate(f, l, n, o)
			{
				var p = l[0],
					q = l[1],
					t = n[0],
					u = n[1],
					z = Math.min(n[0], n[1]),
					A = Math.max(n[0], n[1]),
					B = t + (f - p) * ((u - t) / (q - p));
				return !0 === o ? this.clamp(z, A, B) : B
			}
		},
		{
			key: 'lerp',
			value: function lerp(f, l, n)
			{
				return Math.round(this.roundTwo(1 - n) * f) + n * l
			}
		},
		{
			key: 'ease',
			value: function ease(f, l, n)
			{
				var o = f - l;
				return 1 < Math.abs(o) ? n * o + l : f
			}
		},
		{
			key: 'ease2',
			value: function ease2(f, l, n)
			{
				return 1 < Math.abs(f - l) ? (1 - n) * l + n * f : f
			}
		},
		{
			key: 'classToggle',
			value: function classToggle(f, l)
			{
				!1 === f.classList.contains(l) ? f.classList.add(l) : f.classList.remove(l)
			}
		},
		{
			key: 'scrollTo',
			value: function scrollTo(f, l, n)
			{
				if (!isMobile && !isTablet)
				{
					var o = -1 * n.getBoundingClientRect().left,
						p = n.getBoundingClientRect().width,
						q = p > windowWidth ? o : o + (windowWidth - p) / 2;
					TweenMax.to(f, l,
					{
						currentScroll: '+=' + q,
						ease: Power4.easeInOut
					})
				}
				else TweenMax.to(f.wrapper, l,
				{
					scrollTo: n,
					ease: Power3.easeInOut
				})
			}
		},
		{
			key: 'numberWithCommas',
			value: function numberWithCommas(f)
			{
				for (var n = /(-?\d+)(\d{3})/, o = (f || 0).toString(); n.test(o);) o = o.replace(n, '$1,$2');
				return o
			}
		},
		{
			key: 'ordinal_suffix_of',
			value: function ordinal_suffix_of(f)
			{
				var l = f % 10,
					n = f % 100;
				return 1 == l && 11 != n ? 'st' : 2 == l && 12 != n ? 'nd' : 3 == l && 13 != n ? 'rd' : 'th'
			}
		},
		{
			key: 'strip',
			value: function strip(f)
			{
				var l = new DOMParser().parseFromString(f, 'text/html');
				return l.body.textContent || ''
			}
		},
		{
			key: 'hexToRgb',
			value: function hexToRgb(f)
			{
				var l = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
					n = f.replace(l, function (p, q, t, u)
					{
						return q + q + t + t + u + u
					}),
					o = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(n);
				return o ? parseInt(o[1], 16) + ', ' + parseInt(o[2], 16) + ', ' + parseInt(o[3], 16) : null
			}
		},
		{
			key: 'shuffleArray',
			value: function shuffleArray(f)
			{
				return f.map(function (l)
				{
					return [Math.random(), l]
				}).sort(function (l, n)
				{
					return l[0] - n[0]
				}).map(function (l)
				{
					return l[1]
				})
			}
		}]), c
	}();
var helper = new Helper,
	RAF = function ()
	{
		function c()
		{
			var f = this;
			_classCallCheck(this, c), this.subscribers = [], this._dt = 0, this._framerate = 16, this._now = Date.now(), this._lt = this._now, this._elapsedInterval = 0, this._raf = null, this.update = function ()
			{
				f._now = Date.now(), f._dt = f._now - f._lt, f._elapsedInterval += f._dt, f._elapsedInterval >= f._framerate && (f._elapsedInterval = 0, f._processUpdate()), f._lt = f._now, f._raf = window.requestAnimationFrame(f.update)
			}
		}
		return _createClass(c, [
		{
			key: '_processUpdate',
			value: function _processUpdate()
			{
				for (var l, f = 0; f < this.subscribers.length; f++) l = this.subscribers[f], l[1]()
			}
		},
		{
			key: 'subscribe',
			value: function subscribe(f, l)
			{
				this.subscribers.push([f, l])
			}
		},
		{
			key: 'unsubscribe',
			value: function unsubscribe(f)
			{
				for (var l = 0; l < this.subscribers.length; l++) this.subscribers[l][0] === f && this.subscribers.splice(l, 1)
			}
		},
		{
			key: 'start',
			value: function start()
			{
				this._raf = window.requestAnimationFrame(this.update)
			}
		},
		{
			key: 'stop',
			value: function stop()
			{
				window.cancelAnimationFrame(this._raf)
			}
		},
		{
			key: 'resume',
			value: function resume()
			{
				this.start()
			}
		}]), c
	}(),
	ImageLoad = function ()
	{
		function c(f, l)
		{
			var n = this;
			_classCallCheck(this, c), this._imgArr = [], this._totalImg = null, this._remainImg = null, this._percentage = 0, this._loader = null, this._loader = l, f.forEach(function (o)
			{
				var p = Array.from(o.querySelectorAll('img'));
				p.forEach(function (t)
				{
					var u = t.getAttribute('src');
					n._imgArr.push(
					{
						src: u,
						ele: null
					})
				});
				var q = Array.from(o.querySelectorAll('[data-inview="true"]'));
				q.forEach(function (t)
				{
					var u = window.getComputedStyle(t, null).getPropertyValue('background-image'),
						z = u.replace(/"/g, '').replace('url(', '').replace(')', '');
					z.includes('none') || n._imgArr.push(
					{
						src: z,
						ele: null
					})
				})
			}), this._totalImg = this._imgArr.length, this._remainImg = this._imgArr.length, this._load()
		}
		return _createClass(c, [
		{
			key: 'cancel',
			value: function cancel()
			{
				this._imgArr.forEach(function (n)
				{
					n.ele.src = ''
				});
				for (var l, f = 0; f < this._imgArr.length; f++) l = this._imgArr[f], l.ele.src = ''
			}
		},
		{
			key: '_load',
			value: function _load()
			{
				var f = this;
				0 === this._totalImg ? this._loader.update(1) : this._imgArr.forEach(function (l)
				{
					var n = new Image;
					n.src = l.src, l.ele = n, l.ele.onload = function ()
					{
						f._progress()
					}
				})
			}
		},
		{
			key: '_progress',
			value: function _progress()
			{
				this._remainImg -= 1, this._percentage = 0 < this._totalImg ? (this._totalImg - this._remainImg) / this._totalImg : 1, this._loader.update(this._percentage)
			}
		}]), c
	}();
var Preloader = function ()
	{
		function c(f)
		{
			_classCallCheck(this, c), this.wrapper = document.querySelectorAll('.Preloader')[0], this.msgZh = document.querySelectorAll('.Preloader__Message__Zh')[0], this.msgEn = document.querySelectorAll('.Preloader__Message__En')[0], this.msgZhId = 'homepage' === currentPageName ? 'PreloaderMsgDownloading' : 'PreloaderMsgSiteTitile', this.msgZhEle = document.querySelector('#' + this.msgZhId), this.dim = document.querySelectorAll('.Preloader__Dim')[0], this._progressTl = new TimelineMax, this._progress = 0, this._dur = 2, this._callback = null, this._msgArr = ['下載完成!', '搞掂!'], this._callback = f, this.msgZhEle.style.display = 'block'
		}
		return _createClass(c, [
		{
			key: 'setDim',
			value: function setDim(f)
			{
				this.dim.style.background = 'linear-gradient(to bottom, rgba(' + f + ',0.8), rgba(' + f + ',1) 100%)'
			}
		},
		{
			key: 'update',
			value: function update(f)
			{
				var t = this,
					l = this._progressTl,
					n = this._dur,
					o = this.msgEn,
					p = this.msgZh,
					q = Math.round(100 * f);
				l.clear(), l.to(this, n,
				{
					_progress: q,
					roundProps: '_progress',
					ease: Power4.easeInOut
				}, 0).to(p, n,
				{
					fontSize: q / 16 + 'vh',
					ease: Power4.easeInOut
				}, 0).to(o, n,
				{
					fontSize: q / 20 + 'vh',
					ease: Power4.easeInOut,
					onUpdate: function onUpdate()
					{
						o.innerHTML = t._progress.toString() + '%'
					},
					onComplete: function onComplete()
					{
						if (100 === t._progress)
						{
							var u = Math.floor(Math.random() * t._msgArr.length);
							p.innerHTML = t._msgArr[u], t._callback()
						}
					}
				}, 0)
			}
		},
		{
			key: 'dispose',
			value: function dispose()
			{
				this.wrapper.parentNode.removeChild(this.wrapper)
			}
		}]), c
	}(),
	PageLoader = function ()
	{
		function c(f)
		{
			var t = this;
			_classCallCheck(this, c), this.wrapper = null, this.homepageWrapper = homepage.wrapper, this.dim = document.querySelector('#dim_wrapper'), this.tl = new TimelineMax, this.dur = 1.8, this.rotation = isMobile || isTablet ? '0' : '3', this._callback = null, this._callback = f;
			var l = this.homepageWrapper,
				n = this.dim,
				o = this.tl,
				p = this.dur,
				q = this.rotation;
			homepage.wrapper.classList.add(grayClassName), cursor.cursorBlocker.classList.add('show'), homepage.wrapper.style.pointerEvents = 'none', o.to(l, p,
			{
				rotation: q,
				force3D: !0,
				ease: Power2.easeInOut
			}, 0).to(n, p,
			{
				autoAlpha: 0.5,
				ease: Power2.easeInOut
			}, 0).to(l, 0.1,
			{
				rotation: q,
				force3D: !0,
				ease: customInOut1,
				onComplete: function onComplete()
				{
					t._callback()
				}
			}), o.tweenTo(2)
		}
		return _createClass(c, [
		{
			key: 'setDim',
			value: function setDim(f)
			{
				this.dim.style.background = 'linear-gradient(to bottom, rgba(' + f + ',0.8), rgba(' + f + ',1) 60%)'
			}
		},
		{
			key: 'update',
			value: function update(f)
			{
				1 === f && this.tl.play()
			}
		},
		{
			key: 'dispose',
			value: function dispose()
			{
				this.tl.clear()
			}
		}]), c
	}(),
	Clock = function ()
	{
		function c()
		{
			var f = this;
			_classCallCheck(this, c), this.clockEle = document.querySelectorAll('.Home__Message--time__Clock')[0], this.msgEle = document.querySelectorAll('.Home__Message--time__Comment')[0], this.timer = setInterval(function ()
			{
				f.update()
			}, 500)
		}
		return _createClass(c, [
		{
			key: '_checkTime',
			value: function _checkTime(f)
			{
				return 10 > f ? '0' + f : f
			}
		},
		{
			key: '_setMsg',
			value: function _setMsg(f)
			{
				var l = null;
				return l = 12 >= f ? 6 >= f ? 'You should be sleeping by now. It is quite late in ' + visiterCityName + '.' : 10 >= f ? 'Good morning! Any good coffee spots in ' + visiterCityName + '?' : 'What is for lunch today?' : 18 >= f ? 15 >= f ? 'Shall we take a coffee break?' : 'Doing anything fun tonight?' : 21 >= f ? 'Please don’t tell me you are still at work, it is late in ' + visiterCityName + '!' : 'Please close your browser and go to bed.', l
			}
		},
		{
			key: 'update',
			value: function update()
			{
				var f = new Date,
					l = this._checkTime(f.getHours()),
					o = this._checkTime(f.getMinutes()),
					p = this._checkTime(f.getSeconds()),
					q = 12 <= l ? 'PM' : 'AM';
				this.clockEle.innerHTML = l % 12 + ':' + o + ':' + p + ' ' + q, this.msgEle.innerHTML = this._setMsg(l)
			}
		}]), c
	}();
var Inview = function ()
	{
		function c(f)
		{
			var l = this;
			_classCallCheck(this, c), this.eleArr = [], this.observerConfig = {
				rootMargin: '-20%'
			}, this.blockObserver = null, f.forEach(function (n)
			{
				var o = Array.from(n.querySelectorAll('[data-inview="true"]'));
				o.forEach(function (p)
				{
					l.eleArr.push(p)
				})
			}), this.blockObserver = new IntersectionObserver(function (n)
			{
				n.forEach(function (o)
				{
					var p = o.target,
						q = o.intersectionRatio;
					0 < q ? p.classList.add('show') : p.classList.remove('show')
				})
			}, this.observerConfig), this.observe()
		}
		return _createClass(c, [
		{
			key: 'observe',
			value: function observe()
			{
				var l = this,
					f = !0 === isFF ? 'fuck_ff' : null;
				this.eleArr.forEach(function (n)
				{
					l.blockObserver.observe(n), n.classList.add(f)
				})
			}
		},
		{
			key: 'unobserve',
			value: function unobserve()
			{
				var f = this;
				this.eleArr.forEach(function (l)
				{
					f.blockObserver.unobserve(l)
				})
			}
		}]), c
	}(),
	Scrollbar = function ()
	{
		function c()
		{
			var f = this;
			_classCallCheck(this, c), this.ele = document.querySelectorAll('.Scrollbar')[0], isMobile || isTablet ? this.hide() : window.addEventListener('resize', function ()
			{
				f.setWidth(currentPage.totalWidth)
			}, !1)
		}
		return _createClass(c, [
		{
			key: 'setWidth',
			value: function setWidth(f)
			{
				var l = windowWidth / f * windowWidth;
				TweenMax.to(this.ele, 1,
				{
					width: l + 'px',
					ease: Power4.easeInOut
				})
			}
		},
		{
			key: 'hide',
			value: function hide()
			{
				this.ele.style.visibility = 'hidden', this.ele.style.display = 'none'
			}
		}]), c
	}(),
	Vid = function ()
	{
		function c(f)
		{
			var l = this;
			_classCallCheck(this, c), this.vidArr = [], f.forEach(function (n)
			{
				var o = Array.from(n.querySelectorAll('video'));
				o.forEach(function (p)
				{
					l.vidArr.push(p)
				})
			}), Array.isArray(this.vidArr) && 0 !== this.vidArr.length && this.vidArr.forEach(function (n)
			{
				n.preload = 'auto', n.controls = !1, isMobile || isTablet ? n.play() : n.addEventListener('canplay', function ()
				{
					n.play()
				}, !1)
			})
		}
		return _createClass(c, [
		{
			key: 'pause',
			value: function pause()
			{
				this.vidArr.forEach(function (f)
				{
					f.pause()
				})
			}
		},
		{
			key: 'play',
			value: function play()
			{
				this.vidArr.forEach(function (f)
				{
					f.play()
				})
			}
		},
		{
			key: 'dispose',
			value: function dispose()
			{
				this.vidArr.forEach(function (f)
				{
					f.pause(), f.loop = !1;
					var l = f.querySelectorAll('source')[0];
					l.setAttribute('src', ''), l.setAttribute('loop', 'false'), l.remove()
				}), this.vidArr = null
			}
		}]), c
	}(),
	NavButton = function ()
	{
		function c(f, l, n)
		{
			var o = this;
			_classCallCheck(this, c), this.buttonEleName = null, this.buttonEle = null, this.sectionName = null, this.section = null, this._callback = null, this.dur = isMobile || isTablet ? 1 : 2, this.buttonEleName = f, this.buttonEle = document.querySelector(this.buttonEleName), this.sectionName = l, this.section = document.querySelector(this.sectionName), this._callback = n, this.buttonEle.addEventListener('click', function ()
			{
				helper.scrollTo(homepage, o.dur, o.section), 'function' == typeof o._callback && o._callback()
			}, !1), isMobile || isTablet || (this.buttonEle.addEventListener('mouseover', function (p)
			{
				o.onHoverOver(p)
			}, !1), this.buttonEle.addEventListener('mouseout', function ()
			{
				o.onHoverOut()
			}, !1))
		}
		return _createClass(c, [
		{
			key: 'onHoverOver',
			value: function onHoverOver(f)
			{
				var l = f.target.dataset.arrow_deg;
				cursor.addClass('move'), cursor.arrowDeg = l
			}
		},
		{
			key: 'onHoverOut',
			value: function onHoverOut()
			{
				cursor.removeClass('move')
			}
		}]), c
	}(),
	Menu = function c()
	{
		_classCallCheck(this, c), this.mobileMenu = null, this.navHome = null, this.navAbout = null, this.navWorks = null, this.navGuestbook = null, isMobile || isTablet ? (this.mobileMenu = document.querySelectorAll('.Menu--mobile'), this.navHome = new NavButton('#button_home_mobile', '#section_home', null), this.navAbout = new NavButton('#button_about_mobile', '#section_about', null), this.navWorks = new NavButton('#button_work_mobile', '#section_reuters_news', null), this.navGuestbook = new NavButton('#button_guestbook_mobile', '#section_guestbook', null)) : (this.mobileMenu = null, this.navAbout = new NavButton('#button_about', '#section_about', null), this.navWorks = new NavButton('#button_work', '#section_reuters_news', null), this.navGuestbook = new NavButton('#button_guestbook', '#section_guestbook', function ()
		{
			guestbook.focusMsg()
		}))
	},
	Dribbble = function ()
	{
		function c()
		{
			var n = this;
			_classCallCheck(this, c), this.ele = document.querySelectorAll('.Dribbble__Link')[0], this.tl = new TimelineMax(
			{
				paused: !0,
				repeat: -1
			}), this.timer = null;
			var f = this.ele,
				l = this.tl;
			l.to(f, 0.3,
			{
				y: '20%',
				force3D: !0,
				ease: Power4.easeIn
			}).to(f, 0.26,
			{
				y: '0%',
				force3D: !0,
				ease: Power2.easeOut
			}), f.addEventListener('mouseover', function ()
			{
				n._play()
			}, !1), f.addEventListener('mouseout', function ()
			{
				n._reverse()
			}, !1)
		}
		return _createClass(c, [
		{
			key: '_play',
			value: function _play()
			{
				window.clearTimeout(this.timer), this.tl.play()
			}
		},
		{
			key: '_reverse',
			value: function _reverse()
			{
				var f = this;
				this.timer = setTimeout(function ()
				{
					f.tl.tweenTo(0.5)
				}, 400)
			}
		}]), c
	}(),
	CaseStudy = function ()
	{
		function c(f, l)
		{
			var n = this;
			_classCallCheck(this, c), this.wrapper = document.querySelector('#CaseStudyWrapper'), this.topWrapper = null, this.bottomWrapper = null, this.wrapperArr = [this.topWrapper, this.bottomWrapper], this.topWrapperWidth = null, this.bottomWrapperWidth = null, this.totalWidth = 1, this.loader = 'homepage' === initLanding ? new PageLoader(function ()
			{
				n.show()
			}) : new Preloader(function ()
			{
				n.show()
			}), this.imageLoad = null, this.inview = null, this.links = null, this.vids = null, this.currentScroll = 0, this.targetScroll = 0, this.dim = this.loader.dim, this.url = null, this.hex = null, this.tl = new TimelineMax, this.updateEvent = function ()
			{
				n.updateInfo()
			}, this.url = f, this.hex = l;
			var o = helper.hexToRgb(this.hex);
			this.loader.setDim(o), raf.unsubscribe('raf_homepage'), cursor.pause(), scrollbar.setWidth(0)
		}
		return _createClass(c, [
		{
			key: 'load',
			value: function load()
			{
				var l = this;
				(function f(n)
				{
					return new Promise(function (o, p)
					{
						var q = new XMLHttpRequest;
						q.open(n.method || 'GET', n.url), n.headers && Object.keys(n.headers).forEach(function (t)
						{
							q.setRequestHeader(t, n.headers[t])
						}), q.onload = function ()
						{
							200 <= q.status && 300 > q.status ? o(q.response) : p(q.statusText)
						}, q.onerror = function ()
						{
							p(q.statusText)
						}, q.send(n.body)
					})
				})(
				{
					url: this.url
				}).then(function (n)
				{
					var o = new DOMParser,
						p = o.parseFromString(n, 'text/html'),
						q = p.querySelector('title').innerHTML;
					document.title = q;
					var t = p.querySelector('#CaseStudyWrapper'),
						u = t.innerHTML;
					l.wrapper.innerHTML = u, l.init()
				}).catch(function (n)
				{
					console.log(n)
				})
			}
		},
		{
			key: 'init',
			value: function init()
			{
				cursor.arrowDeg = 0, this.topWrapper = this.wrapper.querySelectorAll('.CaseStudy')[0], this.bottomWrapper = this.wrapper.querySelectorAll('.CaseStudy')[1], this.vids = new Vid([this.wrapper]), this.inview = new Inview([this.wrapper]), this.links = new Links([this.wrapper]), this.updateInfo(), this.imageLoad = new ImageLoad([this.wrapper], this.loader), window.addEventListener('resize', this.updateEvent, !1)
			}
		},
		{
			key: 'updateInfo',
			value: function updateInfo()
			{
				this.topWrapperWidth = this.topWrapper.offsetWidth, this.bottomWrapperWidth = this.bottomWrapper.offsetWidth, this.totalWidth = this.topWrapperWidth + this.bottomWrapperWidth
			}
		},
		{
			key: 'show',
			value: function show()
			{
				var o = this,
					f = this.wrapper,
					l = this.dim,
					n = null == homepage ? this.loader.wrapper : [homepage.wrapper, homepage.menu.mobileMenu];
				this.tl.clear(), this.tl.eventCallback('onComplete', null), this.tl = new TimelineMax(
				{
					paused: !0,
					onComplete: function onComplete()
					{
						cursor.resume(), scrollbar.setWidth(o.totalWidth), raf.subscribe('raf_cs', function ()
						{
							currentPage.render()
						}), 'homepage' === initLanding && (homepage.pause(), cursor.cursorBlocker.classList.remove('show')), o.loader.dispose()
					}
				});
				var p = 1.6,
					q = {
						x: null,
						y: null,
						rotation: null
					};
				isMobile || isTablet ? 'portrait' === deviceOrientation ? (q.x = '-80vw', q.y = '0', q.rotation = '0') : (q.x = '0', q.y = '-50vh', q.rotation = '0') : (q.x = '0', q.y = '-50vh', q.rotation = '8'), this.tl.to(f, p + 0.2,
				{
					x: '0',
					y: '0%',
					force3D: !0,
					ease: Power4.easeInOut
				}, 0).to(l, p + 0.4,
				{
					autoAlpha: 1,
					ease: Power4.easeInOut
				}, 0).to(n, p + 0.4,
				{
					x: q.x,
					y: q.y,
					force3D: !0,
					rotation: q.rotation,
					ease: Power4.easeInOut
				}, 0), this.tl.play()
			}
		},
		{
			key: 'hide',
			value: function hide()
			{
				var o = this;
				raf.unsubscribe('raf_cs'), homepage.resume(), cursor.pause(), scrollbar.setWidth(0), homepage.wrapper.classList.remove(grayClassName), cursor.cursorBlocker.classList.remove('show');
				var n = [homepage.wrapper, homepage.menu.mobileMenu],
					f = this.wrapper,
					l = this.dim;
				this.tl.clear(), this.tl.eventCallback('onComplete', null), this.tl = new TimelineMax(
				{
					paused: !0,
					onComplete: function onComplete()
					{
						isMobile || isTablet || raf.subscribe('raf_homepage', function ()
						{
							homepage.render()
						}), homepage.wrapper.style.pointerEvents = '', cursor.resume(), scrollbar.setWidth(currentPage.totalWidth), o.dispose()
					}
				});
				var p = 2,
					q = {
						x: null,
						y: null
					};
				isMobile || isTablet ? 'portrait' === deviceOrientation ? (q.x = '100%', q.y = '0') : (q.x = '0', q.y = '100%') : (q.x = '0', q.y = '100%'), this.tl.to(f, p,
				{
					x: q.x,
					y: q.y,
					force3D: !0,
					ease: Power4.easeInOut
				}, 0).to(l, p - 0.2,
				{
					autoAlpha: 0,
					ease: Power4.easeInOut
				}, 0).to(n, p + 0.2,
				{
					y: '0',
					x: '0',
					force3D: !0,
					rotation: 0,
					ease: Power4.easeInOut
				}, 0), this.tl.play()
			}
		},
		{
			key: 'render',
			value: function render()
			{
				var f = this.currentScroll,
					l = this.totalWidth,
					n = this.topWrapperWidth,
					o = this.bottomWrapperWidth,
					p = this.topWrapper,
					q = this.bottomWrapper;
				this.targetScroll = helper.ease2(f, this.targetScroll, scrollEaseFactor);
				var u, z, t = this.targetScroll % l,
					A = -(t / l) * windowWidth;
				0 > t ? (u = Math.abs(t) < n ? t : l + t, z = n + t) : (u = t > o ? -l + t : t, z = -o + t), p.style.transform = 'translate3d(' + u + 'px, 0, 0)', q.style.transform = 'translate3d(' + z + 'px, 0, 0)', scrollbar.ele.style.transform = 'translate3d(' + A + 'px, 0, 0)'
			}
		},
		{
			key: 'dispose',
			value: function dispose()
			{
				window.removeEventListener('resize', this.updateEvent, !1), TweenMax.set(this.wrapper,
				{
					clearProps: 'all'
				}), this.inview.unobserve(), this.vids.dispose(), this.wrapper.removeChild(this.topWrapper), this.wrapper.removeChild(this.bottomWrapper)
			}
		}]), c
	}(),
	Fire = function ()
	{
		function c()
		{
			var l = this;
			_classCallCheck(this, c), this.ref = null, this.visiterRef = null, this.guestbookRef = null, this.msgCounterEle = Array.from(document.querySelectorAll('.message_counter'));
			// firebase.initializeApp(
			// {
				// apiKey: 'AIzaSyB6Ph1JToqzXPqMBPVk_r7W89vjx-oBFWc',
				// authDomain: 'portfolio-2018-caf7d.firebaseapp.com',
				// databaseURL: 'https://portfolio-2018-caf7d.firebaseio.com',
				// projectId: 'portfolio-2018-caf7d',
				// storageBucket: 'portfolio-2018-caf7d.appspot.com',
				// messagingSenderId: '576827157021'
			// }), this.ref = firebase.database().ref(), firebase.auth().onAuthStateChanged(function (n)
			// {
				// if (n)
				// {
					// var o = n.uid;
					// l.setUser(o), guestbook || (guestbook = new Guestbook), l.subMsgCount()
				// }
				// else firebase.auth().signInAnonymously()
			// })
		}
		return _createClass(c, [
		{
			key: 'setUser',
			value: function setUser(f)
			{
				this.visiterRef = this.ref.child('visiter/uid/' + f), this.guestbookRef = this.ref.child('guestbook'), this.visiterRef.update(
				{
					city: visiterCityName
				})
			}
		},
		{
			key: 'subMsgCount',
			value: function subMsgCount()
			{
				var f = this;
				this.ref.child('guestbook/total_count').on('value', function (l)
				{
					f.msgCounterEle.forEach(function (n)
					{
						n.innerHTML = helper.numberWithCommas(l.val())
					})
				})
			}
		}]), c
	}();
var Guestbook = function ()
{
	function c()
	{
		var f = this;
		_classCallCheck(this, c), this.msgWrapper = document.querySelector('#messages_wrapper'), this.inputEle = document.querySelector('#Form__Message'), this.inputName = document.querySelector('#Form__Visiter'), this.buttonEle = document.querySelector('#Form__Send'), this.moveMsgAllow = !0, this.msgCtrlUpEle = document.querySelector('#MessageWindow__Control__Up'), this.msgCtrlDownEle = document.querySelector('#MessageWindow__Control__Down'), this.msgCtrls = [this.msgCtrlUpEle, this.msgCtrlDownEle], this.placeholderArr = ['Tell me a secret', 'Say something nice', 'Should designer code?', '⌘ + Q to send', 'Do not post your password here', 'Do you like what you do?'], this.msgArr = [], this.msgArrCount = 0, this.msgCtrls.forEach(function (l)
		{
			l.addEventListener('mouseover', function (n)
			{
				f.onHoverOver(n)
			}, !1), l.addEventListener('mouseout', function ()
			{
				f.onHoverOut()
			}, !1), l.addEventListener('click', function (n)
			{
				f.onMouseClick(n)
			}, !1)
		}), this.inputEle.addEventListener('input', function ()
		{
			f.buttonToggle()
		}, !1), this.inputName.addEventListener('input', function ()
		{
			f.buttonToggle()
		}, !1), this.buttonEle.addEventListener('click', function ()
		{
			f.sendMsg()
		}, !1), document.addEventListener('keydown', function (l)
		{
			f.key(l)
		}, !1), this.setPlaceholderTxt(), this.readMsg(), this.subMsg()
	}
	return _createClass(c, [
	{
		key: 'onHoverOver',
		value: function onHoverOver(f)
		{
			var l = f.target.dataset.arrow_deg;
			cursor.addClass('move'), cursor.arrowDeg = l
		}
	},
	{
		key: 'onHoverOut',
		value: function onHoverOut()
		{
			cursor.removeClass('move')
		}
	},
	{
		key: 'key',
		value: function key(f)
		{
			var l = f.keyCode;
			13 === l && (f.preventDefault(), this.valMsg() && this.valName() && this.sendMsg())
		}
	},
	{
		key: 'setPlaceholderTxt',
		value: function setPlaceholderTxt()
		{
			var f = Math.floor(Math.random() * this.placeholderArr.length);
			this.inputEle.setAttribute('placeholder', this.placeholderArr[f]), this.inputName.setAttribute('placeholder', 'Visitor'), !1 === this.valName() && (this.inputName.value = 'Visitor')
		}
	},
	{
		key: '_commentClass',
		value: function _commentClass(f)
		{
			var n = '';
			return n = 70 < f ? 105 < f ? '--XS' : '--S' : 35 < f ? '--M' : '--L', 'Message__Comment'.concat(n)
		}
	},
	{
		key: 'buildMsg',
		value: function buildMsg(f)
		{
			var o = document.createElement('div'),
				p = 'undefined' == typeof f.city || null === f.city || '' === f.city ? 'from Earth' : 'from\r\n' + f.city,
				q = helper.strip(f.content),
				l = f.kwok,
				n = f.visiterName;
			l && o.classList.add('Message--kwok'), o.classList.add('Message');
			var t = document.createElement('p');
			t.classList.add('Message__Visiter');
			var u = document.createElement('p');
			u.classList.add('Message__Comment');
			var z = this._commentClass(q.length);
			u.classList.add(z), t.textContent = n + ' ' + p, u.textContent = q, o.appendChild(u), o.appendChild(t), this.msgWrapper.appendChild(o)
		}
	},
	{
		key: 'pushMsg',
		value: function pushMsg(f)
		{
			this.msgArrCount++;
			var o = document.createElement('div'),
				p = 'undefined' == typeof f.city || null === f.city || '' === f.city ? 'from Earth' : 'from\r\n' + f.city,
				q = helper.strip(f.content),
				l = f.kwok,
				n = f.visiterName;
			l && o.classList.add('Message--kwok'), o.classList.add('Message');
			var t = document.createElement('p');
			t.classList.add('Message__Visiter');
			var u = document.createElement('p');
			u.classList.add('Message__Comment');
			var z = this._commentClass(q.length);
			u.classList.add(z), t.textContent = n + ' ' + p, u.textContent = q, o.appendChild(u), o.appendChild(t), this.msgArr.push(o)
		}
	},
	{
		key: 'addMsg',
		value: function addMsg(f)
		{
			for (var l = this.msgArr.length, n = this.msgArrCount - 1, p = document.createDocumentFragment(), q = 0; q < l; q++)
				if (q > n - f && q <= n)
				{
					var t = this.msgArr[q];
					p.appendChild(t), this.msgArrCount--
				} this.msgWrapper.insertBefore(p, this.msgWrapper.childNodes[0])
		}
	},
	{
		key: 'readMsg',
		value: function readMsg()
		{
			var f = this;
			fire.ref.child('guestbook/message').orderByChild('timestamp').once('value').then(function (l)
			{
				f.msgWrapper.innerHTML = '', l.forEach(function (n)
				{
					var o = n.val();
					f.pushMsg(o)
				}), f.addMsg(18)
			})
		}
	},
	{
		key: 'subMsg',
		value: function subMsg()
		{
			var f = this;
			fire.ref.child('guestbook/message').orderByChild('timestamp').on('child_changed', function (l)
			{
				var n = l.val();
				n.city && n.uid && void 0 !== n.kwok && f.buildMsg(n)
			})
		}
	},
	{
		key: 'valMsg',
		value: function valMsg()
		{
			this.msg = this.inputEle.value;
			var f = !!this.msg || 1 === this.msg.length;
			return f
		}
	},
	{
		key: 'valName',
		value: function valName()
		{
			this.visiterName = this.inputName.value;
			var f = !!this.visiterName || 1 === this.visiterName.length;
			return f
		}
	},
	{
		key: 'buttonToggle',
		value: function buttonToggle()
		{
			this.valMsg() && this.valName() ? this.buttonEle.classList.add('show') : this.buttonEle.classList.remove('show')
		}
	},
	{
		key: 'sendMsg',
		value: function sendMsg()
		{
			if (this.valMsg() && this.valName())
			{
				var f = this.inputEle,
					l = this.inputName;
				this.setPlaceholderTxt(), f.setAttribute('disabled', 'disabled'), l.setAttribute('disabled', 'disabled');
				var n = Date.now(),
					o = fire.guestbookRef.child('message/' + n);
				o.update(
				{
					visiterName: helper.strip(this.visiterName),
					content: helper.strip(this.msg),
					timestamp: firebase.database.ServerValue.TIMESTAMP
				}), f.value = '', f.removeAttribute('disabled'), l.removeAttribute('disabled'), this.buttonToggle(), TweenMax.to(this.msgWrapper, 0.6,
				{
					y: 0,
					ease: Power4.easeInOut,
					force3D: !0
				})
			}
			else this.focusMsg(), this.setPlaceholderTxt(), this.buttonToggle()
		}
	},
	{
		key: 'focusMsg',
		value: function focusMsg()
		{
			isMobile || isTablet || this.inputEle.focus()
		}
	},
	{
		key: 'onMouseClick',
		value: function onMouseClick(f)
		{
			var z = this,
				l = f.target.dataset.direction;
			if (!0 === this.moveMsgAllow)
			{
				var p = this.msgWrapper,
					t = Math.round(windowHeight * (7 / 9)),
					_ele$getBoundingClien = p.getBoundingClientRect(),
					n = _ele$getBoundingClien.top,
					o = _ele$getBoundingClien.height,
					u = {
						ease: Power4.easeInOut,
						force3D: !0,
						y: null,
						onStart: function onStart()
						{
							z.moveMsgAllow = !1
						},
						onComplete: function onComplete()
						{
							z.moveMsgAllow = !0
						}
					};
				'up' === l && (this.addMsg(8), u.y = 20 > n && n > -t ? Math.round(o - t + 10) : '+=' + t), 'down' === l && (u.y = n > -(o - windowHeight) ? '-=' + t : '-=0'), TweenMax.to(p, 0.8, u)
			}
		}
	}]), c
}();
var MyLottie = function ()
	{
		function c()
		{
			_classCallCheck(this, c), this._lotties = [], this._eyeballEle = document.querySelectorAll('.Cursor__Eyeball')[0], this._hourglassEle = document.querySelectorAll('.Cursor__Hourglass')[0];
			var f = lottie.loadAnimation(
			{
				container: this._eyeballEle,
				renderer: 'svg',
				loop: !0,
				autoplay: !1,
				path: '../asset/lottie/eyeball.json'
			});
			this._lotties.push(['eyeball', f]);
			var l = lottie.loadAnimation(
			{
				container: this._hourglassEle,
				renderer: 'svg',
				loop: !0,
				autoplay: !1,
				path: '../asset/lottie/hourglass.json'
			});
			this._lotties.push(['hourglass', l])
		}
		return _createClass(c, [
		{
			key: 'play',
			value: function play(f)
			{
				this._lotties.forEach(function (l)
				{
					l[0] === f && l[1].play()
				})
			}
		},
		{
			key: 'stop',
			value: function stop(f)
			{
				this._lotties.forEach(function (l)
				{
					l[0] === f && l[1].goToAndStop(1, !0)
				})
			}
		}]), c
	}(),
	Cursor = function ()
	{
		function c()
		{
			var f = this;
			_classCallCheck(this, c), this.cursorEle = document.querySelectorAll('.Cursor')[0], this.cursorBorder = document.querySelectorAll('.CursorBorder')[0], this.eleArr = [this.cursorEle, this.cursorBorder], this.cursorArrowEle = document.querySelectorAll('.Cursor__Arrow')[0], this.cursorBlocker = document.querySelector('#CursorBlocker'), this.cursorXOffset = 0, this.cursorYOffset = 0, this.mouseX = 0.1 * windowHeight, this.mouseY = 0.9 * windowHeight, this.cursorX = 0, this.cursorY = 0, this.cursorEaseFactor = 0.2, this.dragTimer = null, this.dragEvent = null, this.dragCurrentX = 0, this.dragLastX = null, this.arrowDeg = 0, isMobile || isTablet ? this.addClass('hide') : (document.body.style.cursor = 'none', document.addEventListener('mousemove', function (l)
			{
				f.mouseMove(l)
			}, !1), document.addEventListener('mousedown', function (l)
			{
				f.mouseDown(l)
			}, !1), document.addEventListener('mouseup', function ()
			{
				f.mouseUp()
			}, !1), this.dragEvent = new Impetus(
			{
				source: body,
				multiplier: 3,
				friction: 0.92,
				update: function update(l)
				{
					f.drag(l)
				}
			}), this.dragEvent.pause(), document.addEventListener('wheel', function (l)
			{
				f.mouseScroll(l)
			}, !1), window.addEventListener('resize', function ()
			{
				f.updateInfo()
			}, !1), this.updateInfo())
		}
		return _createClass(c, [
		{
			key: 'updateInfo',
			value: function updateInfo()
			{
				this.cursorXOffset = this.cursorEle.offsetWidth / 2, this.cursorYOffset = this.cursorEle.offsetHeight / 2
			}
		},
		{
			key: 'addClass',
			value: function addClass(f)
			{
				this.eleArr.forEach(function (l)
				{
					l.classList.add(f)
				})
			}
		},
		{
			key: 'removeClass',
			value: function removeClass(f)
			{
				this.eleArr.forEach(function (l)
				{
					l.classList.remove(f)
				})
			}
		},
		{
			key: 'mouseScroll',
			value: function mouseScroll(f)
			{
				var l = f.deltaY,
					n = f.deltaX;
				!0 == scrollAllow && (currentPage.currentScroll += (l + n) * scrollMultiplier)
			}
		},
		{
			key: 'mouseMove',
			value: function mouseMove(f)
			{
				document.body.style.cursor = 'none', this.mouseX = f.clientX, this.mouseY = f.clientY
			}
		},
		{
			key: 'mouseDown',
			value: function mouseDown(f)
			{
				var l = this;
				return 0 === f.button ? void(dragCursorAllow && (this.dragTimer = setTimeout(function ()
				{
					l.addClass('drag'), l.cursorBlocker.classList.add('show')
				}, 120))) : (this.dragEvent.pause(), void setTimeout(function ()
				{
					l.dragEvent.resume()
				}, 500))
			}
		},
		{
			key: 'drag',
			value: function drag(f)
			{
				this.dragLastX = this.dragCurrentX || 0, this.dragCurrentX = f;
				var l = this.dragLastX - this.dragCurrentX;
				currentPage.currentScroll -= l
			}
		},
		{
			key: 'mouseUp',
			value: function mouseUp()
			{
				window.clearTimeout(this.dragTimer), this.removeClass('drag'), this.cursorBlocker.classList.remove('show')
			}
		},
		{
			key: 'pause',
			value: function pause()
			{
				cursor.addClass('loading'), scrollAllow = !1, dragCursorAllow = !1, null !== this.dragEvent && (this.dragEvent.pause(), mylottie.play('hourglass'))
			}
		},
		{
			key: 'resume',
			value: function resume()
			{
				cursor.removeClass('loading'), scrollAllow = !0, dragCursorAllow = !0, null !== this.dragEvent && (this.dragEvent.resume(), mylottie.stop('hourglass'))
			}
		},
		{
			key: 'render',
			value: function render()
			{
				var f = this.mouseX,
					l = this.cursorXOffset,
					n = this.mouseY,
					o = this.cursorYOffset,
					p = this.cursorEaseFactor,
					q = this.arrowDeg,
					t = this.cursorEle,
					u = this.cursorBorder,
					z = this.cursorArrowEle,
					A = f - l,
					B = n - o;
				this.cursorX = helper.ease2(A, this.cursorX, p), this.cursorY = helper.ease2(B, this.cursorY, p), t.style.transform = 'translate3d(' + A + 'px, ' + B + 'px, 0)', u.style.transform = 'translate3d(' + this.cursorX + 'px, ' + this.cursorY + 'px, 0)', z.style.transform = 'rotate(' + q + 'deg)'
			}
		}]), c
	}();
var Homepage = function ()
{
	function c()
	{
		var f = this;
		_classCallCheck(this, c), this.wrapper = document.querySelector('#Homepage'), this.topWrapper = document.querySelector('#Homepage__Top'), this.bottomWrapper = document.querySelector('#Homepage__Bottom'), this.wrapperArr = [this.topWrapper, this.bottomWrapper], this.topWrapperWidth = null, this.bottomWrapperWidth = null, this.totalWidth = 1, this.visiterCityName = document.querySelector('#visiter_city').innerHTML, this.loader = new Preloader(function ()
		{
			f.show()
		}), this.imageLoad = new ImageLoad(this.wrapperArr, this.loader), this.inview = new Inview(this.wrapperArr), this.links = new Links(this.wrapperArr), this.vids = new Vid(this.wrapperArr), this.currentScroll = 0, this.targetScroll = 0, this.menu = new Menu, this.map = null, this.awards = null, this.dribbble = null, this.clock = null, this.thanksEle = document.querySelector('#name_list_wrapper'), this.navHome = null, this.navAbout = null, this.navWorks = null, this.navGuestbook = null, isMobile || isTablet ? TweenMax.set(this.wrapper,
		{
			visibility: 'visible',
			display: 'block'
		}) : TweenMax.set(this.wrapper,
		{
			y: '100vh',
			force3D: !0,
			visibility: 'visible',
			display: 'block'
		}), cursor.pause(), this.setHistory(), this.updateInfo(), fire = new Fire, this.map = new MapLine, this.awards = new Awards, this.clock = new Clock, this.awards.start(), this.map.start(), isMobile || isTablet || (this.dribbble = new Dribbble, raf.subscribe('raf_homepage', function ()
		{
			f.render()
		})), window.addEventListener('resize', function ()
		{
			f.updateInfo()
		}, !1)
	}
	return _createClass(c, [
	{
		key: 'setHistory',
		value: function setHistory()
		{
			var f = {
				url: window.location.pathname,
				isHome: !0
			};
			window.history.replaceState(f, '', f.url)
		}
	},
	{
		key: 'updateInfo',
		value: function updateInfo()
		{
			this.topWrapperWidth = this.topWrapper.offsetWidth, this.bottomWrapperWidth = this.bottomWrapper.offsetWidth, this.totalWidth = this.topWrapperWidth + this.bottomWrapperWidth
		}
	},
	{
		key: 'show',
		value: function show()
		{
			var o = this;
			cursor.resume();
			var f = [this.wrapper, this.menu.mobileMenu],
				l = this.loader.dim,
				n = new TimelineMax(
				{
					delay: 0.5,
					paused: !0,
					onComplete: function onComplete()
					{
						o.loader.dispose(), scrollbar.setWidth(o.totalWidth)
					}
				}),
				p = 2,
				q = {
					x: null,
					y: null,
					rotation: null
				};
			isMobile || isTablet ? 'portrait' === deviceOrientation ? (q.x = '-50vw', q.y = '0', q.rotation = '0') : (q.x = '0', q.y = '-50vh', q.rotation = '0') : (q.x = '0', q.y = '-50vh', q.rotation = '8'), n.to(f, p,
			{
				x: '0',
				y: '0',
				rotation: 0,
				force3D: !0,
				ease: Power4.easeInOut
			}, 0).to(l, p + 0.4,
			{
				autoAlpha: 1,
				ease: Power4.easeInOut
			}, 0).to(this.loader.wrapper, p,
			{
				x: q.x,
				y: q.y,
				force3D: !0,
				rotation: q.rotation,
				ease: Power4.easeInOut
			}, 0), n.play()
		}
	},
	{
		key: 'pause',
		value: function pause()
		{
			raf.unsubscribe('raf_awards'), this.vids.pause(), this.map.pause(), this.thanksEle.classList.add('stop'), this.wrapper.style.visibility = 'hidden'
		}
	},
	{
		key: 'resume',
		value: function resume()
		{
			this.awards.start(), this.vids.play(), this.map.start(), this.thanksEle.classList.remove('stop'), this.wrapper.style.visibility = 'visible'
		}
	},
	{
		key: 'render',
		value: function render()
		{
			var f = this.currentScroll,
				l = this.totalWidth,
				n = this.topWrapperWidth,
				o = this.bottomWrapperWidth,
				p = this.topWrapper,
				q = this.bottomWrapper;
			this.targetScroll = helper.ease2(f, this.targetScroll, scrollEaseFactor);
			var u, z, t = this.targetScroll % l,
				A = -(t / l) * windowWidth;
			0 > t ? (u = Math.abs(t) < n ? t : l + t, z = n + t) : (u = t > o ? -l + t : t, z = -o + t), p.style.transform = 'translate3d(' + u + 'px, 0, 0)', q.style.transform = 'translate3d(' + z + 'px, 0, 0)', scrollbar.ele.style.transform = 'translate3d(' + A + 'px, 0, 0)'
		}
	},
	{
		key: 'dispose',
		value: function dispose()
		{}
	}]), c
}();
var Links = function ()
{
	function c(f)
	{
		var l = this;
		_classCallCheck(this, c), this.eleArr = [], f.forEach(function (n)
		{
			var o = Array.from(n.querySelectorAll('[data-link~="true"]'));
			o.forEach(function (p)
			{
				l.eleArr.push(p)
			})
		}), 0 !== this.eleArr.length && this.eleArr.forEach(function (n)
		{
			n.addEventListener('click', function (o)
			{
				l.detect(o)
			}, !1), isMobile || isTablet || (n.addEventListener('mouseover', function (o)
			{
				l.onHoverOver(o)
			}, !1), n.addEventListener('mouseout', function (o)
			{
				l.onHoverOut(o)
			}, !1))
		})
	}
	return _createClass(c, [
	{
		key: '_realTarget',
		value: function _realTarget(f)
		{
			var l = null;
			return l = 'A' === f.target.nodeName || 'BUTTON' === f.target.nodeName ? f.target : f.target.parentNode, l
		}
	},
	{
		key: 'onHoverOver',
		value: function onHoverOver(f)
		{
			var o = this._realTarget(f),
				_target$dataset = o.dataset,
				l = _target$dataset.cursor_class,
				n = _target$dataset.lottie;
			cursor.addClass(l), mylottie.play(n)
		}
	},
	{
		key: 'onHoverOut',
		value: function onHoverOut(f)
		{
			var o = this._realTarget(f),
				_target$dataset2 = o.dataset,
				l = _target$dataset2.cursor_class,
				n = _target$dataset2.lottie;
			cursor.removeClass(l), mylottie.stop(n)
		}
	},
	{
		key: 'detect',
		value: function detect(f)
		{
			f.preventDefault();
			var o = window.location.hostname.toString(),
				p = this._realTarget(f),
				_target$dataset3 = p.dataset,
				l = _target$dataset3.link,
				n = _target$dataset3.hex,
				q = p.toString();
			if (!q.includes(o)) !1 === q.includes('HTMLButtonElement') && !1 === q.includes('HTMLDivElement') && window.open(q, '_blank');
			else if (!0 === isIE11) window.location.href = q;
			else if (l.includes('cs'))
			{
				var t = {
					url: q,
					isHome: !1,
					hex: n
				};
				window.history.pushState(t, '', t.url), currentPage = new CaseStudy(q, n), currentPage.load()
			}
			else if (l.includes('home'))
				if ('homepage' === initLanding)
				{
					var u = {
						url: q,
						isHome: !0
					};
					window.history.pushState(u, '', u.url), currentPage.hide(), currentPage.imageLoad.cancel(), currentPage = homepage, document.title = 'Kwok Yin Mak 麥國然'
				}
			else window.location.href = q
		}
	}]), c
}();
var Awards = function ()
{
	function c()
	{
		var f = this;
		_classCallCheck(this, c), this.wrapper = document.querySelector('#section_awards'), this.titleEles = this.wrapper.querySelectorAll('.Award__Title'), this.canvas = this.wrapper.querySelectorAll('canvas')[0], this.ctx = this.canvas.getContext('2d',
		{
			alpha: !1
		}), this.cW = null, this.cH = null, this.p1 = {
			x: 0,
			y: 0
		}, this.p2 = {
			x: 0,
			y: 0
		}, this.points = 1200, this.bufferArr = [], this.forward = !0, this.rotateionFactor = 2, this.frame = 0, this.ctx.scale(pixelRatio, pixelRatio), window.addEventListener('resize', function ()
		{
			f._updateInfo()
		}, !1), this._updateInfo()
	}
	return _createClass(c, [
	{
		key: '_updateInfo',
		value: function _updateInfo()
		{
			this.canvas.width = this.canvas.offsetWidth * pixelRatio, this.canvas.height = this.canvas.offsetHeight * pixelRatio, this.cW = this.canvas.width, this.cH = this.canvas.height, this.p1 = {
				x: 0.2 * this.cW,
				y: 0.26 * this.cH
			}, this.p2 = {
				x: 0.76 * this.cW,
				y: 0.78 * this.cH
			}, this._buildBuffer()
		}
	},
	{
		key: '_updatePoint',
		value: function _updatePoint(f)
		{
			var l = 15 * Math.sin(f.xAdj),
				n = 15 * Math.cos(f.yAdj),
				o = f.x + l,
				p = f.y + n;
			return {
				x: o,
				y: p,
				xAdj: l,
				yAdj: n
			}
		}
	},
	{
		key: '_buildBuffer',
		value: function _buildBuffer()
		{
			var q = this,
				f = Array(this.points).fill(this.p1),
				l = Array(this.points).fill(this.p2),
				o = 0,
				p = 0;
			this.bufferArr = [], this.bufferArr = [f, l].map(function (t)
			{
				return t.map(function (_ref)
				{
					var u = _ref.x,
						z = _ref.y;
					return o += helper.randomRnage(helper.randomRnageS(-0.03, 0), helper.randomRnageS(0, 0.06)), p += helper.randomRnage(helper.randomRnageS(-0.03, 0), helper.randomRnageS(0, 0.06)), q._updatePoint(
					{
						x: u,
						y: z,
						xAdj: o,
						yAdj: p
					})
				})
			})
		}
	},
	{
		key: 'start',
		value: function start()
		{
			var f = this;
			raf.subscribe('raf_awards', function ()
			{
				f.render()
			})
		}
	},
	{
		key: 'render',
		value: function render()
		{
			var f = this.ctx,
				l = this.cW,
				n = this.cH,
				o = this.frame,
				p = this.forward,
				q = this.bufferArr,
				t = this.titleEles,
				u = this.rotateionFactor;
			f.fillStyle = '#ffffff', f.fillRect(0, 0, l, n), f.beginPath(), f.moveTo(q[0][o].x, q[0][o].y), f.lineTo(q[1][o].x, q[1][o].y), f.strokeStyle = 'rgba(0, 0, 0, 0.2)', f.lineWidth = 1 * pixelRatio, f.stroke(), t[1].style.transform = 'translate3d(' + q[1][o].xAdj + 'px, ' + q[1][o].yAdj + 'px, 0)rotate(' + q[1][o].yAdj / u + 'deg)', t[0].style.transform = 'translate3d(' + q[0][o].xAdj + 'px, ' + q[0][o].yAdj + 'px, 0)rotate(' + q[0][o].yAdj / u + 'deg)', !0 === p ? (o === this.points - 2 && (this.forward = !1), this.frame++) : (1 === o && (this.forward = !0), this.frame--)
		}
	}]), c
}();
var MapLine = function ()
{
	function c()
	{
		var f = this;
		_classCallCheck(this, c), this.pointStart = {
			x: 0,
			y: 0
		}, this.pointMid = {
			x: 0,
			y: 0
		}, this.pointEnd = {
			x: 0,
			y: 0
		}, this.pointControl1 = {
			x: 0,
			y: 0
		}, this.pointControl2 = {
			x: 0,
			y: 0
		}, this.pointControl3 = {
			x: 0,
			y: 0
		}, this.pointControl4 = {
			x: 0,
			y: 0
		}, this.wrapper = document.querySelector('#section_about'), this.canvas = this.wrapper.querySelectorAll('canvas')[0], this.ctx = this.canvas.getContext('2d',
		{
			alpha: !1
		}), this.ctxW = 0, this.ctxH = 0, this.frame = 0, this.updateInfo = function ()
		{
			var o = f.canvas.offsetWidth * pixelRatio,
				p = f.canvas.offsetHeight * pixelRatio;
			f.canvas.width = o, f.canvas.height = p, f.ctxW = o, f.ctxH = p;
			var l = f.ctxW,
				n = f.ctxH;
			f.pointStart = {
				x: 0.1 * l,
				y: 0.8 * n
			}, f.pointEnd = {
				x: 0.9 * l,
				y: 0.2 * n
			}
		}, this.ctx.scale(pixelRatio, pixelRatio), this.updateInfo(), window.addEventListener('resize', this.updateInfo, !1)
	}
	return _createClass(c, [
	{
		key: 'start',
		value: function start()
		{
			var f = this;
			raf.subscribe('raf_map', function ()
			{
				f.render()
			})
		}
	},
	{
		key: 'pause',
		value: function pause()
		{
			raf.unsubscribe('raf_map')
		}
	},
	{
		key: 'render',
		value: function render()
		{
			var f = this.frame;
			if (0 == f % 8)
			{
				var l = this.ctx,
					n = this.ctxW,
					o = this.ctxH,
					p = this.pointStart,
					q = this.pointMid,
					t = this.pointEnd,
					u = this.pointControl1,
					z = this.pointControl2,
					A = this.pointControl3,
					B = this.pointControl4;
				this.pointMid = {
					x: helper.randomRnage(0.2 * n, 0.8 * n),
					y: helper.randomRnage(0.35 * o, 0.65 * o)
				}, this.pointControl1 = {
					x: helper.randomRnage(0.1 * n, 0.4 * n),
					y: helper.randomRnage(0, o)
				}, this.pointControl2 = {
					x: helper.randomRnage(0.1 * n, 0.8 * n),
					y: helper.randomRnage(0, 0.5 * o)
				}, this.pointControl3 = {
					x: helper.randomRnage(0, 0.8 * n),
					y: helper.randomRnage(0.2 * o, o)
				}, this.pointControl4 = {
					x: helper.randomRnage(0, 0.8 * n),
					y: helper.randomRnage(0.2 * o, o)
				}, l.fillStyle = '#ffffff', l.fillRect(0, 0, n, o), l.beginPath(), l.moveTo(p.x, p.y), l.bezierCurveTo(u.x, u.y, z.x, z.y, q.x, q.y), l.bezierCurveTo(A.x, A.y, B.x, B.y, t.x, t.y), l.strokeStyle = '#000000', l.lineWidth = 1 * pixelRatio, l.stroke()
			}
			this.frame++
		}
	}]), c
}();
var App = function ()
{
	function c()
	{
		var f = this;
		_classCallCheck(this, c), currentPageName = body.getAttribute('data-page'), initLanding = currentPageName, body.setAttribute('data-page', ''), this.setInfo(), raf = new RAF, scrollbar = new Scrollbar, cursor = new Cursor, isMobile || isTablet || (raf.subscribe('raf_cursor', function ()
		{
			cursor.render()
		}), mylottie = new MyLottie), window.addEventListener('resize', function ()
		{
			f.setInfo()
		}, !1), this.setPage(), raf.start()
	}
	return _createClass(c, [
	{
		key: 'setInfo',
		value: function setInfo()
		{
			windowHeight = window.innerHeight, windowWidth = window.innerWidth;
			var f = isFF ? 8 / pixelRatio : 1;
			scrollMultiplier = 1.5 * (windowWidth / 1400) * f, deviceOrientation = windowHeight > windowWidth ? 'portrait' : 'landscape'
		}
	},
	{
		key: 'setPage',
		value: function setPage()
		{
			if ('homepage' === currentPageName) homepage = new Homepage, currentPage = homepage;
			else
			{
				var l = document.querySelectorAll('.CaseStudy')[0],
					f = l.dataset.hex;
				currentPage = new CaseStudy(null, f), currentPage.init()
			}
		}
	}]), c
}();
window.onpopstate = function (c)
{
	var l = c || window.event,
		f = l.state;
	!0 === f.isHome ? 'homepage' === initLanding ? (currentPage.hide(), currentPage.imageLoad.cancel(), currentPage = homepage, document.title = 'Kwok Yin Mak 麥國然') : window.location.href = f.url : (currentPage = new CaseStudy(f.url, f.hex), currentPage.load())
};

function ready(c)
{
	'loading' === document.readyState ? document.addEventListener('DOMContentLoaded', c) : c()
}
var app = null;
ready(function ()
{
	app = new App
});

document.addEventListener('dragstart', function (e)
{
	e.preventDefault();
	return false;
});

document.onselectstart = function (e)
{
	e.preventDefault();
	return false;
}