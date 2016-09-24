# react-gsap-enhancer [![Build Status](https://img.shields.io/travis/azazdeaz/react-gsap-enhancer.svg?style=flat-square)](https://travis-ci.org/azazdeaz/react-gsap-enhancer) [![Coveralls branch](https://img.shields.io/coveralls/azazdeaz/react-gsap-enhancer/master.svg?style=flat-square)](https://coveralls.io/github/azazdeaz/react-gsap-enhancer)  [![npm](https://img.shields.io/npm/dm/react-gsap-enhancer.svg?style=flat-square)](https://www.npmjs.com/package/react-gsap-enhancer) ![maintainance](https://img.shields.io/badge/actively%20maintained-%3A\(%20sorry-red.svg?style=flat-square)


[![Join the chat at https://gitter.im/azazdeaz/react-gsap-enhancer](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/azazdeaz/react-gsap-enhancer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

|[Demos](#demos)|[Why?](#why)|[How it works?](#how-it-works)|[Usage](#usage)|[API](#api)|
|---------------|------------|------------------------------|---------------|-----------|

A [React] component enhancer for applying [GSAP] animations on components without side effects.

>For simple use cases **you might not need this tool**. See [this egghead.io tutorial](https://egghead.io/lessons/react-using-tweenmax-with-react).

*Developed as part of the [Animachine project](https://github.com/animachine/animachine).*

**Requirements:** 
 - From v0.2 react-gsap-enhancer requires **[react v0.14+][react-npm]**. Check out [this release notes](https://github.com/azazdeaz/react-gsap-enhancer/releases/tag/v0.2.0) for upgrading from v0.1.x.
 - **GSAP v1.18+** ([*NPM*][gsap-npm], [*CDN*][gsap-cdn])

### Demos
 - Playground
  - [update the component while it's animating](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/update-and-animate-transform)
  - [control timeline with component events](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/morphing-search-input)
  - [use with Radium and react-motion](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/cow-jumps-over-the-moooooon)
  - [use options (ES5)](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/sending-options-to-the-animation-source)
  - [use with react-addons-transition-group (ES5)](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/using-transition-group)
  - [and more...!](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/rainbow-rocket-man)
 - CodePen
  - [Material Login Dialog](http://codepen.io/azazdeaz/pen/yYavVK?editors=001)

### Why?
We have great tools (like [react-motion], or [Animated]) to animate the state and props of our React components but if you ever needed to create a longer animation sequence with React you can still feel the desire to reach out for a tool like [GSAP] which makes it easy to compose your animation and apply it on the DOM with its super performance and bulit in polyfills. Unfortunately, if you let anything to mutate the DOM of a component, React can break on the next update because is suppose that the DOM looks exacly the same like after the last update. This tool is a work around for this problem.

### How it works?
It's pretty simple: in every render cycle:
 - after each render save the attributes of the rendered DOM elements than start/restart the added animations.
 - before each render stop the animations and restore the saved attributes (so React will find the DOM as it was after the update)

>In this way you can even update a style of an element (like ```transform: 'translateX(${mouse.x})'```) while you animating the same style relative to its original value (like: ```.to(node, 1, {x: '+=300', yoyo: true}```)

>[Check it out!](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/update-and-animate-transform) 

### Usage
First you have to enhance the component with react-gsap-enhancer:

**ES5**
```javascript
var GSAP = require('react-gsap-enhancer')
var MyComponent = GSAP()(React.createClass({
  render: function() {/*...*/}
}))
```
**ES6**
```javascript
import GSAP from 'react-gsap-enhancer'

class MyComponent extends Component {
  render() {/*...*/}
}

export default GSAP()(MyComponent)
```
**ES7**
```javascript
import GSAP from 'react-gsap-enhancer'

@GSAP()
export default class MyComponent extends Component {
  render() {/*...*/}
}
```

Now you can attach animations to the component with ```addAnimation(animationSource)```. The ```animationsSource``` is a function that returns a GSAP Animation (ex. TweenLite, or TimelineMax) like this:
```javascript
function moveAnimation(utils) {
  return TweenMax.to(utils.target, 1, {x: '+=123'})
}
```
the utils.target refers to the root node of the component but you can select any of it's children by they props in the good old jQuery style:
```javascript
function moveAnimation({target}) {//just ES6 syntax sugar
  var footer = target.find({type: 'footer'})
  var buttons = footer.findAll({type: 'button'})
  ...
}
```
and later in a component you can use it like:
```javascript
...
handleClick() {
  var controller = this.addAnimation(moveAnimation)
...
```
the ```addAnimation()``` returns a [controller object](#controller) that has the same API like the original GSAP Animation so you are free to control it like:
```javascript
...
handleStartLoad() {
  this.progressAnim = this.addAnimation(progressAnim)
  this.otherAnim.timeScale(3.4).reverse()
}
handleProgress(progress) {
  this.progressAnim.tweenTo(progress)
}
...
```

### API

##### addAnimation()
 - ```enhancedComponent.addAnimation(animationSource[, options]) -> controller```: Add an animation to the component with the given source and returns a Controller for it. The options will be passed to the animationSource.

##### ```controller```
Wraps the GSAP Animation returned from the ```animationSource```. It's exposing the following GSAP API methods:  
*For TweenMax and TweenLite:*  
> [delay](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/delay/)\*,
[duration](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/duration/)\*,
[eventCallback](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/eventCallback/),
[invalidate](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/invalidate/),
[isActive](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/isActive/),
[pause](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/pause/),
[paused](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/paused/),
[play](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/play/),
[progress](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/progress/),
[restart](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/restart/),
[resume](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/resume/),
[reverse](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/reverse/),
[reversed](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/reversed/),
[seek](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/seek/),
[startTime](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/startTime/)\*,
[time](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/time/),
[timeScale](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/timeScale/),
[totalDuration](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/totalDuration/)\*,
[totalProgress](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/totalProgress/)\*,
[totalTime](http://greensock.com/docs/#/HTML5/GSAP/TweenMax/totalTime/)\*,

*For TimelineMax and TimelineLite:*  
> [currentLabel](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/currentLabel/),
[duration](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/duration/)\*,
[endTime](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/endTime/)\*,
[eventCallback](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/eventCallback/),
[from](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/from/),
[fromTo](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/fromTo/),
[getLabelAfter](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/getLabelAfter/),
[getLabelBefore](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/getLabelBefore/),
[getLabelArray](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/getLabelArray/),
[getLabelTime](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/getLabelTime/),
[invalidate](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/invalidate/),
[isActive](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/isActive/),
[pause](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/pause/),
[paused](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/paused/),
[play](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/play/),
[progress](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/progress/),
[restart](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/restart/),
[resume](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/resume/),
[reverse](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/reverse/),
[reversed](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/reversed/),
[seek](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/seek/),
[startTime](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/startTime/)\*,
[time](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/time/),
[timeScale](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/timeScale/),
[totalDuration](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/totalDuration/)\*,
[totalProgress](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/totalProgress/)\*,
[totalTime](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/totalTime/)\*,
[tweenFromTo](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/tweenFromTo/),
[tweenTo](http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/tweenTo/),

**Notes:**
  - Some of the methods above doesn't available for TweenLite and TimelineLite. Please check the GSAP docs for more detailes.
  - controller.kill() will also remove all the effects the animation made on your component.
  - As you can see the editor methods (like ```.to()``` or ```.add()```) aren't exposed by the controller so you can only use them inside the [animationSource](#animationsource) function while you construct the animation.

***\**** Trough the controller you can only get values with these methods.

```javascript
var controller = this.addAnimation(animationSource)
controller.timeScale(2).play()
```

##### ```animationSource```
 - ```({target, options}) -> GSAP Animation```

A function that returns a GSAP Animation.
```javascript
function animationSource(utils) {
  return TweenMax.to(utils.target, 1, {x: 100})
}
this.addAnimation(animationSource)
```

##### ```target```
jQuery like object that refers to the root component and lets select its children with chainable find methods and [selectors](#selector).
 - ```target.find(selector)```: returns with the first match
 - ```target.findAll(selector)```: returns with all the matches
 - ```target.findInChildren(selector)```: returns with the first match in the direct children
 - ```target.findAllInChildren(selector)```: returns with all the matches in the direct children
```javascript
function animationSource(utils) {
  var button = utils.target.findAll({type: 'button'}).find({role: 'submit'})
  return TweenMax.to(button, 1, {x: 100})
}
```

##### ```options```
Arbitrary object. Passed to the [addAnimation](#methods-added-to-the-component) call as the second argument and and will be passed to the [animationSource](#animationsource)
```javascript
this.addAnimation(animationSource, {offset: this.props.offset})

...

function animationSource(utils) {
  return TweenMax.to(utils.target, 1, {x: utils.options.offset})
}
```

##### ```selector```
Selectors are usually simple objects and the "find" functions are using it to select the elements with matching props. Ie. ```{key: 'head'}```, ```{color: 'red'}```, and ```{key: 'head', color:  'red}``` are all matches to ```<div key='head' color='red'/>```.

I'm looking forward for your feedback!

[react-motion]: https://github.com/chenglou/react-motion
[Animated]: https://facebook.github.io/react-native/docs/animations.html#animated
[GSAP]: http://greensock.com/
[React]: https://github.com/facebook/react
[react-npm]: https://www.npmjs.com/package/react
[gsap-npm]: https://www.npmjs.com/package/gsap
[gsap-cdn]: https://cdnjs.com/libraries/gsap
