var anims = {
  in(select, props, state, options) {
    var target = select(options.target)
    var tl = new TimelineMax()
    tl.from(box, 1, {scale: 0, opacity: 0})
    return {timeline: tl};
  },
  out(select, props, state, options) {
    var target = select(options.target)
    var tl = new TimelineMax()
    tl.to(box, 1, {scale: 0, opacity: 0})
    return {timeline: tl};
  }
}

@GSAP(anims)
export default Item extends React.Component() {
  componentWillEnter(done) {
    this.timelines.start('in').finish(done);
  }
  componentWillLeave(done) {
    this.timelines.start('out').finish(done);
  }
}

export default App extends React.Component() {
  constructor(props) {
    super(props)

    this.state = {itemCount: 1}
  }
  handleAddClick() {
    this.timeline.start('rotate')
  }
  handleRemoveClick() {
    this.timeline.pause('rotate')
  }
  render() {
    return <TransitionGroup>
      {Array(this.state.itemCount).map(() => Item)}
      <Button label='start' onClick={this.handleAddClick}/>
      <Button label='stop' onClick={this.handleRemoveClick}/>
    </TransitionGroup>
  }
}
