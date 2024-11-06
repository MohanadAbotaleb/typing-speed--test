export const addClass = (element, className)  => {
    if(!element || !className) return;
    element.classList.add(className);
}
export const removeClass = (element, className) => {
    if(!element || !className) return;
    element.classList.remove(className);
}

export const hasClass = (element, className) => {
    if (!element || !className) return false;
    return element.classList.contains(className);
  
}