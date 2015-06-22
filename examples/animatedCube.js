var anims = {
  rotate(select, props, state, options) {
    var box = select({name: 'box'})
    var tl = new TimelineMax({repeat: -1})
    tl.to(box, 1, {rotate: 360})
    return {timeline: tl, options: {startOnMount: true});
  }
}

@GSAP(anims)
export default App extends React.Component() {
  handleStartClick() {
    this.timeline.start('rotate');
  }
  handleStopClick() {
    this.timeline.pause('rotate');
  }
  render() {
    return <div>
      <Box name='box'/>
      <Button label='start' onClick={this.handleStartClick}/>
      <Button label='stop' onClick={this.handleStopClick}/>
    </div>
  }
}
