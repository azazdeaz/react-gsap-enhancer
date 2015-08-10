const initialValues = {
  [0]: 'x,y,z,scale,scaleX,scaleY,scaleZ,rotation,percentX,percentY' +
       'width,height,top,left,bottom,right'
}

function createInitialStyle () {
  const style = {}
  Object.keys(initialValues).forEach((initialValue) => {
    const keys = initialValues[initialValue]
    keys.split(',').forEach(key => style[key] = initialValue)
  })
  return style
}

console.log('IIIIIIIIIII', createInitialStyle())
export default createInitialStyle()
