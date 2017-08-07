;
(function() {
    let vueBubble = {}


    vueBubble.install = function(Vue) {
        Vue.directive('bubble', {
            isFn: true,
            bind: function(el, binding) {
              if(!binding.value){
                return
              }
                if (binding.value.show) {
                    el.style.opacity = 1
                } else {
                    if (binding.value.show == undefined) {
                        if (binding.value.value == "0") {
                            el.style.opacity = 0
                        } else {
                            el.style.opacity = 1
                        }
                    } else {
                        el.style.opacity = 0
                    }
                }
                el.textContent = binding.value.value
            },
            update: function(el, binding) {
              if(!binding.value){
                return
              }
                if (binding.value.show) {
                    el.style.opacity = 1
                } else {
                    if (binding.value.show == undefined) {
                        if (binding.value.value == "0") {
                            el.style.opacity = 0
                        } else {
                            el.style.opacity = 1
                        }
                    } else {
                        el.style.opacity = 0
                    }
                }
                el.textContent = binding.value.value


            },
            inserted: function(el, binding) {
                let rootSvg = document.querySelector("#rootSvg")
                if (!rootSvg) {
                    let str = `<svg id="rootSvg" width="300px" height="300px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                  <circle id="rootSvgC1" cx="150" cy="150" r="8" stroke="black" stroke-width="0" fill="red"/>
                                  <path id = "rootSvgPath" d="M 10 60 L10 40 Q  50 50,  10 40 L10 60 Q  50 50,  10 60 Z" stroke="" fill="rgb(255,0,0)"/>
                                  <circle id="rootSvgC2" cx="150" cy="150" r="10"  stroke="red" stroke-width="0" fill="red"></circle></svg>`,
                    n = document.createElement("div")
                    n.innerHTML = str
                    n.id = "tmpSvg"
                    n.setAttribute("width", "300px")
                    n.setAttribute("height", "300px")
                    document.body.appendChild(n)
                    el.parentNode.appendChild(n.children[0])
                    document.querySelector("#tmpSvg").remove()
                    rootSvg = document.querySelector("#rootSvg")
                    n = null
                }

                let msg = el,
                    offsetX = msg.offsetLeft,
                    offsetY = msg.offsetTop,
                    width = el.offsetWidth,
                    height = el.offsetHeight,
                    color = getComputedStyle(msg, null)["background-color"]
                let radius = width > height ? Math.ceil(height / 2) : Math.ceil(width / 2),
                    line = {
                      direction: 'x',
                      offset: 0
                    }

                if (width > height) {
                    line.direction = 'x'
                    line.offset = width - height
                } else if (width < height) {
                    line.direction = 'y'
                    line.offset = height - width
                } else {
                    line.direction = 'none'
                    line.offset = 0
                }
                let offset = 150 - radius, startX = 150, startY = 150, minradius = 5, smallCircle = Math.round(radius * 0.6)
                rootSvg.style.cssText = "position:absolute;left:" + (offsetX - offset) + "px;top:" + (offsetY - offset) + "px;display:none"

                rootSvgC2.setAttribute("r", radius)
                rootSvgC1.setAttribute("r", smallCircle)

                let isMobile = "ontouchstart" in window
                if (isMobile) {
                    msg.addEventListener("touchstart", mousedown)
                } else {
                    msg.addEventListener("mousedown", mousedown)
                }

                let left = 0,
                    top = 0,
                    tmpMsg, distance = 0,
                    moveOffsetX = 0,
                    moveOffsetY = 0,
                    endPointX = 0,
                    endPointY = 0,
                    point = {
                        p1x: 150,
                        p2x: 150,
                        p3x: 150,
                        p4x: 150,
                        p1y: 150,
                        p2y: 150,
                        p3y: 150,
                        p4y: 150
                    },
                    control = {},
                    currentDistance = 0,
                    deltaX = 0,
                    deltaY = 0,
                    sinAngel = 0,
                    cosAngel = 0,
                    timer,
                    maxDistance = radius * 7 > 200 ? 200 : radius * 7

                function contextmenu(e) {
                    e.preventDefault();
                }

                function mousedown(e) {
                   if (timer) {
                      return
                   }
                    msg.addEventListener('contextmenu', contextmenu)
                    window.addEventListener('touchstart', contextmenu)
                    rootSvgPath.setAttribute("d", "M 150 150 L 150 150 Q 150 150, 150 150 L150 150 Q 150 150,  150 150 Z")

                    offsetX = msg.offsetLeft
                    offsetY = msg.offsetTop


                    rootSvg.style.cssText = "position:absolute;left:" + (offsetX - offset) + "px;top:" + (offsetY - offset) + "px;display:block;"
                    rootSvgC1.setAttribute("fill", color)
                    rootSvgPath.setAttribute("fill", color)
                    rootSvgC2.setAttribute("fill", color)
                    rootSvgC2.setAttribute("cx", startX)
                    rootSvgC2.setAttribute("cy", startY)
                    left = msg.getBoundingClientRect().left
                    top = msg.getBoundingClientRect().top
                    msg.style.cssText = "position:fixed;top:" + top + "px;left:" + left + "px;z-index:2017"
                    if (!tmpMsg) {
                        tmpMsg = msg.cloneNode()
                        tmpMsg.textContent = "1"
                        msg.parentNode.insertBefore(tmpMsg, msg)
                    }

                    tmpMsg.style.cssText = "visibility:hidden"


                    if (rootSvg.parentNode !== el.parentNode) {
                        el.parentNode.appendChild(rootSvg)
                    }


                    if (isMobile) {
                        document.addEventListener("touchmove", mousemove)
                        document.addEventListener("touchend", mouseup)
                        document.addEventListener("touchcancel", mouseup)
                        e.preventDefault()
                        e.stopPropagation()
                    } else {
                        document.addEventListener("mousemove", mousemove)
                        document.addEventListener("mouseup", mouseup)
                    }
                    e = isMobile ? e.changedTouches[0] : e

                    let x = e.pageX,
                        y = e.pageY,
                        cx = x,
                        cy = y,
                        currR = radius,
                        e2x,
                        e2y

                        control.x = 150
                        control.y = 150


                    rootSvgC2.style.opacity = 1

                    function mousemove(e) {
                        e.preventDefault()
                        e.stopPropagation()
                        e = isMobile ? e.changedTouches[0] : e
                        cx = e.pageX
                        cy = e.pageY
                        moveOffsetX = cx - x
                        moveOffsetY = cy - y
                        distance = Math.sqrt(Math.pow((moveOffsetX), 2) + Math.pow((moveOffsetY), 2))


                        currR = Math.round(smallCircle - distance / 20)

                        if (currR < minradius) {
                            currR = minradius
                        }

                        endPointX = startX + moveOffsetX
                        endPointY = startY + moveOffsetY
                        getPoint(startX, startY, endPointX, endPointY, currR, radius)
                        rootSvgC2.setAttribute("cx", endPointX)
                        rootSvgC2.setAttribute("cy", endPointY)
                        msg.style.transform = "translate(" + moveOffsetX + "px," + moveOffsetY + "px)"
                        if (currentDistance > maxDistance) {
                            rootSvgC1.style.opacity = 0
                            rootSvgPath.style.opacity = 0
                            return
                        } else {
                            rootSvgPath.style.opacity = 1
                            rootSvgC1.style.opacity = 1
                        }

                        rootSvgPath.setAttribute("d", "M  " + point.p4x + " " + point.p4y + " L " + point.p1x + " " + point.p1y + " Q  " + control.x + " " + control.y + ",  " + point.p2x + " " + point.p2y + " L" + point.p3x + " " + point.p3y + " Q  " + control.x +
                            " " + control.y +
                            ",  " + point.p4x + " " + point.p4y + " Z")

                        rootSvgC1.setAttribute("r", currR)
                    }



                    function getPoint(sx, sy, ex, ey, r1, r2) {
                        deltaX = ex - sx
                        deltaY = ey - sy
                        currentDistance = Math.sqrt(Math.pow((deltaY), 2) + Math.pow((deltaX), 2))
                        if (currentDistance == 0) return
                        sinAngel = deltaY / currentDistance
                        cosAngel = deltaX / currentDistance
                        control.x = startX + deltaX / 2
                        control.y = startX + deltaY / 2
                        point.p1x = sx - r1 * sinAngel
                        point.p1y = sy + r1 * cosAngel
                        point.p2x = ex - r2 * sinAngel
                        point.p2y = ey + r2 * cosAngel
                        point.p3x = ex + r2 * sinAngel
                        point.p3y = ey - r2 * cosAngel
                        point.p4x = sx + r1 * sinAngel
                        point.p4y = sy - r1 * cosAngel
                    }





                    function getDistance(sx, sy, ex, ey) {
                        return Math.sqrt(Math.pow((ey - sy), 2) + Math.pow((ex - sx), 2))
                    }

                    function mouseup(e) {
                        e = isMobile ? e.changedTouches[0] : e
                        msg.removeEventListener('contextmenu', contextmenu);
                        if (isMobile) {
                            document.removeEventListener("touchmove", mousemove)
                            document.removeEventListener("touchend", mouseup)
                            document.removeEventListener("touchcancel", mouseup)
                            window.removeEventListener("touchstart", contextmenu)
                        } else {
                            document.removeEventListener("mousemove", mousemove)
                            document.removeEventListener("mouseup", mouseup)
                        }
                        cx = e.pageX
                        cy = e.pageY
                        endPointX = startX + cx - x
                        endPointY = startY + cy - y
                        let currentDistance = getDistance(startX, startY, endPointX, endPointY)

                        if (currentDistance < maxDistance) {
                            rootSvgC1.setAttribute("r", radius)
                            rootSvgPath.style.opacity = 0
                            rootSvgPath.setAttribute("d", "M 150 150 L150 150 Q  150 150,  150 150 L150 150 Q  150 150,  150 150 Z")
                            rootSvgC1.style.opacity = 0
                            animation(startX, startY, startX + cx - x, startY + cy - y)
                        } else {
                            if (binding.value && typeof binding.value.afterHide === 'function') {
                                binding.value.afterHide()
                            }
                            rootSvgC2.style.opacity = 0
                            if(binding.value && binding.value.show){
                                msg.style.cssText = "opacity:1"
                            }else{
                                msg.style.cssText = "opacity:0"
                            }

                            tmpMsg.style.display = "none"
                            rootSvg.style.display = "none"
                            rootSvgPath.setAttribute("d", "M 150 150 L150 150 Q  150 150,  150 150 L150 150 Q  150 150,  150 150 Z")
                        }
                    }



                    function animation(sx, sy, ex, ey) {
                        let count = 1
                        let minDeltaX = ex - sx
                        let minDeltaY = ey - sy
                        timer = setInterval(function a() {
                            count = (Math.abs(count) % 2 == 0 ? -1 : 1) * count
                            let currX = sx + minDeltaX / (count * 2)
                            let currY = sy + minDeltaY / (count * 2)
                            if (Math.abs(count) == 5) {
                                clearInterval(timer)
                                timer = null

                                msg.style.cssText = ""
                                tmpMsg.style.display = "none"

                                clearInterval(timer)

                                rootSvgC2.setAttribute("cx", startX)
                                rootSvgC1.setAttribute("r", radius)
                                rootSvgC2.setAttribute("cy", startY)
                                rootSvg.style.display = "none"
                                rootSvgC1.style.opacity = 0
                                return
                            } else {
                                rootSvgC2.setAttribute("cx", currX)
                                rootSvgC2.setAttribute("cy", currY)
                                msg.style.transform = "translate(" + (currX - sx) + "px," + (currY - sy) + "px)"
                            }
                            count = Math.abs(count) + 1
                        }, 40)
                    }
                }
            }
        })
    }


    if (typeof exports == "object") {
        module.exports = vueBubble
    } else if (typeof define == "function" && define.amd) {
        define([], function() { return vueBubble })
    } else if (window.Vue) {
        window.vueBubble = vueBubble
        Vue.use(vueBubble)
    }


})()
