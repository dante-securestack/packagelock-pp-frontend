export default ({ width, height, maxWidth, maxHeight } = { }) => {
  
  function dimensionsByScale(scale) {
    return { width: width * scale, height: height * scale }
  }

  let scale, dimensions

  if (width < maxWidth ) {
    scale = maxWidth / width
  } else {
    scale = maxHeight / height
  }

  dimensions = dimensionsByScale(scale)
  if (dimensions.width > maxWidth) {
    scale = maxWidth / width
    dimensions = dimensionsByScale(scale)
  } else if (dimensions.height > maxHeight) {
    scale = maxHeight / height
    dimensions = dimensionsByScale(scale)
  }
  
  // console.table({ width, height, scaledWidth : dimensions.width, scaledHeight: dimensions.height, maxWidth, maxHeight })
  return dimensions
}