export default function toggleClasses(toggleClass, classList, force) {
  var level = classList.indexOf(toggleClass);
  var removeClassList = classList.slice(0, level);
  removeClassList.map(function (className) {
    return document.body.classList.remove(className);
  });
  document.body.classList.toggle(toggleClass, force);
}