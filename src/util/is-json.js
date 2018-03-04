module.exports = function(v) {
  try {
    JSON.parse(v)
    return true
  } catch(e) {
    return false
  } 
}