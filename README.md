# react-gsap-enhancer [![Build Status](https://img.shields.io/travis/azazdeaz/react-gsap-enhancer.svg?style=flat-square)](https://travis-ci.org/azazdeaz/react-gsap-enhancer) [![Coveralls branch](https://img.shields.io/coveralls/azazdeaz/react-gsap-enhancer/master.svg?style=flat-square)](https://coveralls.io/github/azazdeaz/react-gsap-enhancer) [![npm](https://img.shields.io/npm/dm/react-gsap-enhancer.svg?style=flat-square)]()

[![Join the chat at https://gitter.im/azazdeaz/react-gsap-enhancer](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/azazdeaz/react-gsap-enhancer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A [React] component enhancer for applying [GSAP] animations on components without side effects.

###Demos
 - Playground
  - [update the component while it's animating](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/update-and-animate-transform)
  - [control timeline with component events](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/morphing-search-input)
  - [use with Radium and react-motion](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/cow-jumps-over-the-moooooon)
  - [use options (ES5)](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/sending-options-to-the-animation-source)
  - [and more...!](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/rainbow-rocket-man)
 - CodePen
  - [Material Login Dialog](http://codepen.io/azazdeaz/pen/yYavVK?editors=001)

###Why? 
We have great tools (like [react-motion], or [Animated]) to animate the state and props of out React component but if you ever needed to create a longer animation sequence with React you can still feel the desire to reach out for a tool like [GSAP] which makes it easy to compose your animation and apply it on the DOM with its super performance and bulit in polyfills. Unfortunately, if you let anything to mutate the DOM of a component, React can break on the next update because is suppose that the DOM looks exacly the same like after the last update. This tool is a work around for this problem.

###How it works?
It's pretty simple: in every render cycle:
 - after each render save the attributes of the rendered DOM elements, than start/restart the added animations.
 - before each render stop the animations and restore the saved attributes (so React will find the DOM as it was after the update)

>In this way you can even update a style of an element (like ```transform: 'translateX(${mouse.x})'```) while you animating the same style relative to its original value (like: ```.to(node, 1, {x: '+=300', yoyo: true}```) 

>[Check it out!](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/update-and-animate-transform)

###Usage
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
  var footer = target.find({key: footer})
  var buttons = footer.findAll({type: 'button'})
  ...
}
```
and later in a component you can use it like:
```javascript
...
handleClick() {
  var animation = this.addAnimation(moveAnimation)
...
```
the ```addAnimation()``` returns an object that has the same API like the original GSAP Animation so you are free to control it like:
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

###API

#####methods added to the component
 - ```addAnimation(animationSource[, options]) -> animation```: Creates an animation with the given source, adds it to the component, and also returns it. The options will be passed to the animationSource.
 - ```removeAnimation(animation)```:  Removes the given animation and all the changes it caused on the component.

#####```animation```
Wraps the GSAP Animation returned from the ```animationSource```. It provides has the same API as the wrapped animation.

#####```animationSource```
 - ```({target, options}) -> GSAP Animation```
A function that returns a GSAP Animation. 

#####```target```
jQuery like selector object that refers to the root component and lets select its children with chainable selector methods.
 - ```target.find(selector)```: returns with the first match
 - ```target.findAll(selector)```: returns with all the matches
 - ```target.findInChildren(selector)```: returns with the first match in the direct children
 - ```target.findAllInChildren(selector)```: returns with all the matches in the direct children

#####```options```
Arbitrary object

#####```selector```
Selectors are usually simple objects and the "find" functions are using it to select the elements with matching props. Ie. ```{key: 'head'}```, ```{color: 'red'}```, and ```{key: 'head', color:  'red}``` are all matches to ```<div key='head' color='red'/>```. Strings are considered to keys so ```target.find('head')``` is the same as ```target.find({key: 'head'})```.

I'm looking forward for your feedback!

[react-motion]: https://github.com/chenglou/react-motion
[Animated]: https://facebook.github.io/react-native/docs/animations.html#animated
[GSAP]: http://greensock.com/
[React]: https://github.com/facebook/react
