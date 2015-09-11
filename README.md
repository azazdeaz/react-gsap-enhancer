# react-gsap-enhancer [![Build Status](https://img.shields.io/travis/azazdeaz/react-gsap-enhancer.svg?style=flat-square)](https://travis-ci.org/azazdeaz/react-gsap-enhancer) [![Coverage Status](https:/https://github.com/azazdeaz/react-gsap-enhancer/img.shields.io/coveralls/azazdeaz/react-gsap-enhancer.svg?style=flat-square)](https://coveralls.io/r/azazdeaz/react-gsap-enhancer?branch=master) [![npm](https://img.shields.io/npm/dm/react-gsap-enhancer.svg?style=flat-square)]()

A [React] component enhancer for applying [GSAP] animations on components without side effects.

###Demos
 - [update the component while it's animating](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/update-and-animate-transform)
 - [control timeline with component events](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/morphing-search-input)
 - [use with Radium and react-motion](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/cow-jumps-over-the-moooooon)
 - [and more...!](http://azazdeaz.github.io/react-gsap-enhancer/#/demo/rainbow-rocket-man)

###Why? 
We have great tools (like [react-motion], or [Animated]) to get our React components move but to create more complicated animation sequences is still a pain without great tools like [GSAP]. GSAP is easy to use and ultra performant if you let it mutate the DOM directly but unfortunately it is not safe if that piece of DOM is controlled by React. So this tool is about make this safe.

###How it works?
It's pretty simple: in every render cycle:
 - after each render save the attributes of the rendered DOM elements, than start/restart the added animations.
 - before each render stop the animations and restore the saved attributes (so React will find the DOM as it was after the update) 

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
 - ```addAnimation(animationSource) -> animation```: Creates an animation with the given source, adds it to the component and also returns it
 - ```removeAnimation(animation)```:  Removes the given animation and all the changes it caused on the component.

#####animationSource
 - ```({target}) -> GSAP Animation```
A function that returns a GSAP Animation

#####animation
Reference to the GSAP Animation returned from the ```animationSource```. It also has the same API.

#####target
jQuery like selector object that refers to the root component and lets select its children with chainable selector methods.
 - ```target.find(selector)```: returns with the first match
 - ```target.findAll(selector)```: returns with all the matches
 - ```target.findInChildren(selector)```: returns with the first match in the direct children
 - ```target.findAllInChildren(selector)```: returns with all the matches in the direct children

#####selector
Selector are usually simple objects and the "find" functions are using it to select the elements with matching props. Ie. ```{key: 'head'}```, ```{color: 'red'}```, and ```{key: 'head', color:  'red}``` are all matches to ```<div key='head' color='red'/>```. Strings are considered to keys so ```target.find('head')``` is the same as ```target.find({key: 'head'})```.

I'm looking forward for your feedback!

[react-motion]: https://github.com/chenglou/react-motion
[Animated]: https://facebook.github.io/react-native/docs/animations.html#animated
[GSAP]: http://greensock.com/
[React]: https://github.com/facebook/react
