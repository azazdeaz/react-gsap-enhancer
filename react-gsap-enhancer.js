var ReactGSAPEnhancer =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

	var _gsapEnhancer = __webpack_require__(1);

	exports['default'] = _interopRequire(_gsapEnhancer);

	var _createTarget = __webpack_require__(6);

	exports.createTarget = _interopRequire(_createTarget);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _attachRefs = __webpack_require__(3);

	var _attachRefs2 = _interopRequireDefault(_attachRefs);

	var _Animation = __webpack_require__(5);

	var _Animation2 = _interopRequireDefault(_Animation);

	var _createTarget = __webpack_require__(6);

	var _createTarget2 = _interopRequireDefault(_createTarget);

	var _utils = __webpack_require__(7);

	exports['default'] = function (animationSourceMap) {
	  if (animationSourceMap && animationSourceMap.prototype && animationSourceMap.prototype.render) {
	    var ComposedComponent = animationSourceMap;
	    return enhance(undefined, ComposedComponent);
	  } else {
	    return enhance.bind(undefined, animationSourceMap);
	  }
	};

	function enhance(animationSourceMap, ComposedComponent) {
	  var GSAPEnhancer = (function (_ComposedComponent) {
	    _inherits(GSAPEnhancer, _ComposedComponent);

	    function GSAPEnhancer(props) {
	      var _this = this;

	      _classCallCheck(this, GSAPEnhancer);

	      _get(Object.getPrototypeOf(GSAPEnhancer.prototype), 'constructor', this).call(this, props);

	      this.addAnimation = function (animationSource, options) {
	        //if the animation is in the source map the if from there
	        var sourceMap = _this.__animationSourceMap;
	        if (sourceMap && sourceMap[animationSource]) {
	          animationSource = sourceMap[animationSource];
	        }

	        if ('production' !== process.env.NODE_ENV) {
	          if (typeof animationSource !== 'function') {
	            var error = '[react-gsap-enhancer] animationSource (the first parameter of ' + ('addAnimation(animationSource, options)) has to be a function instead of "' + animationSource + '"');
	            if (sourceMap) {
	              error += '\nYou provided a sourceMap so the animationSource also can' + (' be a string key of theese: [' + Object.keys(sourceMap) + ']');
	            }
	            var _name = Object.getPrototypeOf(Object.getPrototypeOf(_this)).constructor.name;
	            error += '\nCheck out the addAnimation() call in ' + _name;
	            throw Error(error);
	          }
	        }

	        var target = (0, _createTarget2['default'])(_this.__itemTree);
	        var animation = new _Animation2['default'](animationSource, options, target, function () {
	          return (0, _utils.reattachAll)(_this.__itemTree, _this.__runningAnimations);
	        });
	        _this.__runningAnimations.add(animation);
	        //the animation will be attached on the next render so force the update
	        _this.forceUpdate();

	        return animation;
	      };

	      this.__itemTree = new Map();
	      this.__runningAnimations = new Set();
	      this.__animationSourceMap = animationSourceMap;
	    }

	    //TODO test this
	    // Class inheritance uses Object.create and because of __proto__ issues
	    // with IE <10 any static properties of the superclass aren't inherited and
	    // so need to be manually populated
	    // See http://babeljs.io/docs/advanced/caveats/#classes-10-and-below-
	    // var staticKeys = [
	    //   'defaultProps',
	    //   'propTypes',
	    //   'contextTypes',
	    //   'childContextTypes'
	    // ]
	    //
	    // staticKeys.forEach((key) => {
	    //   if (ComposedComponent.hasOwnProperty(key)) {
	    //     GSAPEnhancer[key] = ComposedComponent[key]
	    //   }
	    // })

	    //TODO test this
	    // if (process.env.NODE_ENV !== 'production') {
	    //   // This fixes React Hot Loader by exposing the original components top level
	    //   // prototype methods on the enhanced prototype as discussed in
	    //   // https://github.com/FormidableLabs/radium/issues/219
	    //   Object.keys(ComposedComponent.prototype).forEach(key => {
	    //     if (!GSAPEnhancer.prototype.hasOwnProperty(key)) {
	    //       var descriptor = Object.getOwnPropertyDescriptor(ComposedComponent.prototype, key)
	    //       Object.defineProperty(GSAPEnhancer.prototype, key, descriptor)
	    //     }
	    //   })
	    // }

	    _createClass(GSAPEnhancer, [{
	      key: 'removeAnimation',
	      value: function removeAnimation(animation) {
	        if ('production' !== process.env.NODE_ENV) {
	          if (!(animation instanceof _Animation2['default'])) {
	            var _name2 = Object.getPrototypeOf(Object.getPrototypeOf(this)).constructor.name;
	            throw Error('[react-gsap-enhancer] animation has to be an instance of Animation' + (' but you gave "' + animation + '"') + ('\nCheck out the removeAnimation() call in ' + _name2));
	          }
	        }

	        animation.kill();
	        this.__runningAnimations['delete'](animation);
	        //rerender the component without the animation
	        this.forceUpdate();
	      }
	    }, {
	      key: 'componentDidMount',
	      value: function componentDidMount() {
	        (0, _utils.saveRenderedStyles)(this.__itemTree);

	        if (_get(Object.getPrototypeOf(GSAPEnhancer.prototype), 'componentDidMount', this)) {
	          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	          }

	          _get(Object.getPrototypeOf(GSAPEnhancer.prototype), 'componentDidMount', this).apply(this, args);
	        }
	      }
	    }, {
	      key: 'componentWillUpdate',
	      value: function componentWillUpdate() {
	        (0, _utils.restoreRenderedStyles)(this.__itemTree);

	        if (_get(Object.getPrototypeOf(GSAPEnhancer.prototype), 'componentWillUpdate', this)) {
	          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            args[_key2] = arguments[_key2];
	          }

	          _get(Object.getPrototypeOf(GSAPEnhancer.prototype), 'componentWillUpdate', this).apply(this, args);
	        }
	      }
	    }, {
	      key: 'render',
	      value: function render() {
	        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	          args[_key3] = arguments[_key3];
	        }

	        return (0, _attachRefs2['default'])(_get(Object.getPrototypeOf(GSAPEnhancer.prototype), 'render', this).apply(this, args), this.__itemTree);
	      }
	    }, {
	      key: 'componentDidUpdate',
	      value: function componentDidUpdate() {
	        (0, _utils.saveRenderedStyles)(this.__itemTree);
	        (0, _utils.attachAll)(this.__runningAnimations);

	        if (_get(Object.getPrototypeOf(GSAPEnhancer.prototype), 'componentDidUpdate', this)) {
	          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	            args[_key4] = arguments[_key4];
	          }

	          _get(Object.getPrototypeOf(GSAPEnhancer.prototype), 'componentDidUpdate', this).apply(this, args);
	        }
	      }
	    }]);

	    return GSAPEnhancer;
	  })(ComposedComponent);

	  return GSAPEnhancer;
	}
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = attachRefs;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	function attachRefs(element, itemMap) {
	  var idx = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
	  var key = element.key;
	  var previousRef = element.ref;

	  if (key === null) {
	    key = idx;
	  }

	  if (typeof previousRef === 'string') {
	    throw Error('[react-gsap-enhancer] On one of the elements you have used a ' + ('string ref ("' + previousRef + '") but react-gsap-enhancer can only handle ') + 'callback refs. Please migrate the string refs to callback refs in the ' + 'enhanced component.\nExample: change <div ref=\'foo\'/> to <div ref={comp => this.foo = comp}/>\nSee also: https://github.com/azazdeaz/react-gsap-enhancer/issues/3');
	  }

	  var item;
	  if (itemMap.has(key)) {
	    item = itemMap.get(key);
	  } else {
	    item = itemMap.set(key, {
	      children: new Map()
	    }).get(key);
	  }

	  if (!item.ref) {
	    item.ref = function (component) {
	      var node = _react2['default'].findDOMNode(component);
	      item.props = element.props;
	      item.node = node;

	      if (typeof previousRef === 'function') {
	        previousRef(component);
	      }
	    };
	  }

	  var originalChildren = element.props.children;
	  var children = undefined;
	  if (typeof originalChildren !== 'object') {
	    children = originalChildren;
	  } else if ((0, _react.isValidElement)(originalChildren)) {
	    children = cloneChild(originalChildren);
	  } else {
	    children = _react.Children.map(originalChildren, function (child, childIdx) {
	      return cloneChild(child, childIdx);
	    });
	  }

	  function cloneChild(child, childIdx) {
	    if (_react2['default'].isValidElement(child)) {
	      return attachRefs(child, item.children, childIdx);
	    } else {
	      return child;
	    }
	  }

	  return _react2['default'].cloneElement(element, { ref: item.ref, children: children });
	}

	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Animation = (function () {
	  function Animation(animationSource, options, target, onNeedReattachAllAninmations) {
	    _classCallCheck(this, Animation);

	    this._animationSource = animationSource;
	    this._target = target;
	    this._options = options;
	    this._onNeedReattachAllAninmations = onNeedReattachAllAninmations;
	    this._commandsWaitingForAttach = [];
	  }

	  _createClass(Animation, [{
	    key: 'replaceAnimationSource',
	    value: function replaceAnimationSource(animationSource) {
	      if (this._gsapAnimation) {
	        this._gsapAnimation.kill();
	        this._gsapAnimation = undefined;
	        this._animationSource = animationSource;
	        this._onNeedReattachAllAninmations();
	      } else {
	        //it's not attached yet
	        this._animationSource = animationSource;
	      }
	    }
	  }, {
	    key: 'attach',
	    value: function attach() {
	      var _this = this;

	      if (this._gsapAnimation) {
	        var time = this._gsapAnimation.time();
	        var paused = this._gsapAnimation.paused();
	        this._gsapAnimation.invalidate().restart().time(time);

	        if (paused) {
	          this._gsapAnimation.pause();
	        }
	      } else {
	        this._gsapAnimation = this._animationSource({
	          target: this._target,
	          options: this._options
	        });

	        if ('production' !== process.env.NODE_ENV) {
	          if (!this._gsapAnimation || typeof this._gsapAnimation.play !== 'function') {
	            throw Error('[react-gsap-enhancer] The return value of the animation ' + 'source doesn\'t seems to be a GSAP Animation' + ('\nCheck out this animation source: \n' + this._animationSource) + ('\nbecause it returned this value: ' + this._gsapAnimation));
	          }
	        }
	      }

	      this._commandsWaitingForAttach.splice(0).forEach(function (_ref) {
	        var fnName = _ref.fnName;
	        var args = _ref.args;
	        return _this[fnName].apply(_this, _toConsumableArray(args));
	      });
	    }
	  }]);

	  return Animation;
	})();

	exports['default'] = Animation;

	function bindAPI() {
	  var TweenMaxMethods = ['delay', 'duration', 'endTime', 'eventCallback', 'invalidate', 'isActive', 'kill', 'pause', 'paused', 'play', 'progress', 'repeat', 'repeatDelay', 'restart', 'resume', 'reverse', 'reversed', 'seek', 'startTime', 'time', 'timeScale', 'totalDuration', 'totalProgress', 'totalTime', 'updateTo', 'yoyo'];
	  var TimelineMaxMethods = ['recent', 'add', 'addCallback', 'addLabel', 'addPause', 'call', 'clear', 'currentLabel', 'duration', 'endTime', 'eventCallback', 'from', 'fromTo', 'getActive', 'getChildren', 'getLabelAfter', 'getLabelBefore', 'getLabelsArray', 'getLabelTime', 'getTweensOf', 'invalidate', 'isActive', 'kill', 'pause', 'paused', 'play', 'progress', 'remove', 'removeCallback', 'removeLabel', 'render', 'repeat', 'repeatDelay', 'restart', 'resume', 'reverse', 'reversed', 'seek', 'set', 'shiftChildren', 'staggerFrom', 'staggerFromTo', 'staggerTo', 'startTime', 'time', 'timeScale', 'to', 'totalDuration', 'totalProgress', 'totalTime', 'tweenFromTo', 'tweenTo', 'useFrames', 'yoyo'];

	  TweenMaxMethods.concat(TimelineMaxMethods).forEach(function (fnName) {
	    Animation.prototype[fnName] = function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      var result = undefined;

	      if (!this._gsapAnimation) {
	        this._commandsWaitingForAttach.push({ fnName: fnName, args: args });
	      } else if (typeof this._gsapAnimation[fnName] === 'function') {
	        var _gsapAnimation;

	        result = (_gsapAnimation = this._gsapAnimation)[fnName].apply(_gsapAnimation, args);
	      } else {
	        throw Error('Animation source has no method: \'' + fnName + '\'');
	      }
	      return result === this._gsapAnimation ? this : result;
	    };
	  });
	}
	bindAPI();
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports['default'] = convertToTarget;
	exports['default'] = createTarget;
	function find(selection, selector) {
	  var result = [];

	  selection.forEach(function (item) {
	    var match = undefined;

	    recurseChildren(item, function (childItem, key) {
	      if (!match && testSelector(key, childItem, selector)) {
	        match = childItem;
	      }
	    });

	    if (match) {
	      result.push(match);
	    }
	  });

	  return convertToTarget(result);
	}

	function findAll(selection, selector) {
	  var result = [];

	  selection.forEach(function (item) {
	    return recurseChildren(item, function (childItem, key) {
	      if (testSelector(key, childItem, selector)) {
	        result.push(childItem);
	      }
	    });
	  });
	  return convertToTarget(result);
	}

	function findInChildren(selection, selector) {
	  var result = [];

	  selection.forEach(function (item) {
	    var match = undefined;
	    iterateChildren(item, function (childItem, key) {
	      if (!match && testSelector(key, childItem, selector)) {
	        match = childItem;
	      }
	    });

	    if (match) {
	      result.push(match);
	    }
	  });

	  return convertToTarget(result);
	}

	function findAllInChildren(selection, selector) {
	  var result = [];

	  selection.forEach(function (item) {
	    return iterateChildren(item, function (childItem, key) {
	      if (testSelector(key, childItem, selector)) {
	        result.push(childItem);
	      }
	    });
	  });
	  return convertToTarget(result);
	}

	function findWithCommands(target, commands) {
	  commands.forEach(function (command) {
	    if (!target[command.type]) {
	      throw Error('[react-gsap-enhancer] unknown command type "' + target[command.type] + '"');
	    }
	    target = target[command.type](command.selector);
	  });
	  return target;
	}

	function isMounted(item) {
	  return !!item.node;
	}

	function testSelector(key, childItem) {
	  var selector = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  if (typeof selector === 'string') {
	    selector = { key: selector };
	  }
	  var props = _extends({}, childItem.props, { key: key });
	  return Object.keys(selector).every(function (selectorKey) {
	    return selector[selectorKey] === props[selectorKey];
	  });
	}

	function iterateChildren(item, callback) {
	  item.children.forEach(function (childItem, key) {
	    if (isMounted(childItem)) {
	      callback(childItem, key);
	    }
	  });
	}

	function recurseChildren(item, callback) {
	  iterateChildren(item, function (childItem, key) {
	    callback(childItem, key);
	    recurseChildren(childItem, callback);
	  });
	}

	function convertToTarget(selection) {
	  var target = selection.map(function (item) {
	    return item.node;
	  }).filter(function (node) {
	    return !!node;
	  });

	  target.find = function (selector) {
	    return find(selection, selector);
	  };
	  target.findAll = function (selector) {
	    return findAll(selection, selector);
	  };
	  target.findInChildren = function (selector) {
	    return findInChildren(selection, selector);
	  };
	  target.findAllInChildren = function (selector) {
	    return findAllInChildren(selection, selector);
	  };
	  target.findWithCommands = function (commands) {
	    return findWithCommands(target, commands);
	  };

	  return target;
	}

	function createTarget(itemTree) {
	  var target = convertToTarget([{ children: itemTree }]);
	  //call find so target will refer to the first node which should be the root
	  return target.find();
	}

	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.walkItemTree = walkItemTree;
	exports.reattachAll = reattachAll;
	exports.attachAll = attachAll;
	exports.restoreRenderedStyles = restoreRenderedStyles;
	exports.saveRenderedStyles = saveRenderedStyles;

	function walkItemTree(itemTree, callback) {
	  function walk(map) {
	    map.forEach(function (item) {
	      if (item.node) {
	        callback(item);
	        if (item.children) {
	          walk(item.children);
	        }
	      }
	    });
	  }
	  walk(itemTree);
	}

	function reattachAll(itemTree, runningAnimations) {
	  restoreRenderedStyles(itemTree);
	  attachAll(runningAnimations);
	}

	function attachAll(runningAnimations) {
	  runningAnimations.forEach(function (animation) {
	    return animation.attach();
	  });
	}

	function restoreRenderedStyles(itemTree) {
	  walkItemTree(itemTree, function (item) {
	    var savedAttributeNames = Object.keys(item.savedAttributes || {});
	    //restore the original attribute values
	    savedAttributeNames.forEach(function (name) {
	      item.node.setAttribute(name, item.savedAttributes[name]);
	    });
	    //remove the attributes added after the render
	    for (var i = 0; i < item.node.attributes.length; ++i) {
	      var _name = item.node.attributes[i].name;
	      if (savedAttributeNames.indexOf(_name) === -1) {
	        item.node.removeAttribute(_name);
	        --i;
	      }
	    }
	  });
	}

	function saveRenderedStyles(itemTree) {
	  walkItemTree(itemTree, function (item) {
	    item.savedAttributes = {};
	    for (var i = 0; i < item.node.attributes.length; ++i) {
	      var attribute = item.node.attributes[i];
	      var _name2 = attribute.name;
	      var value = attribute.value;
	      item.savedAttributes[_name2] = value;
	    }
	    item.node._gsTransform = null;
	    item.node._gsTweenID = null;
	  });
	}

/***/ }
/******/ ]);