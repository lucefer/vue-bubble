;
(function() {
    let vueBubble = {}
    let mPow = Math.pow, mAbs = Math.abs, mCeil = Math.ceil, mRound = Math.round
    function setAttribute(dom, key, value){
      dom.setAttribute(key, value)
    }
    function setStyle(dom, key, value){
      dom.style[key] = value
      if(key === 'transform'){
        dom.style["webkitTransform"] = value
      }
    }
    function resetSvgPosition(svg){
      svg.setAttribute("d", "M 150 150 L 150 150 Q 150 150, 150 150 L150 150 Q 150 150,  150 150 Z")
    }
    function Data(binding) {
        this.value = binding.value
        this.afterHide = binding.afterHide
        this.show = binding.show
    }
    Data.prototype.update = function(binding) {
        this.value = binding.value
        this.afterHide = binding.afterHide
        this.show = binding.show
    }

    vueBubble.install = function(Vue) {
        Vue.directive('bubble', {
            isFn: true,
            bind: function(el, binding) {
                el.bubbleData = new Data(binding.value)
                if (!binding.value) {
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
                el.bubbleData.update(binding.value)
                if (!binding.value) {
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
            unbind: function(el) {
              el.removeEventListener("touchstart", el.handler)
              el.removeEventListener("mousedown", el.handler)
              el.bubbleData = null
              el.handler = null
            },
            inserted: function(el, binding, vnode) {
                let rootSvg = document.querySelector("#rootSvg")
                if (!rootSvg) {
                    let str = `<svg id="rootSvg" width="300px" height="300px" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                  <circle id="rootSvgC1" cx="150" cy="150" r="8" stroke="black" stroke-width="0" fill="red"/>
                                  <path id = "rootSvgPath" d="M 10 60 L10 40 Q  50 50,  10 40 L10 60 Q  50 50,  10 60 Z" stroke="" fill="rgb(255,0,0)"/>
                                  <circle id="rootSvgC2" cx="150" cy="150" r="10"  stroke="red" stroke-width="0" fill="red"></circle></svg>`,
                    n = document.createElement("div")
                    n.innerHTML = str
                    n.id = "tmpSvg"
                    setAttribute(n, "width", "300px")
                    setAttribute(n, "height", "300px")
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
                let radius = width > height ? mCeil(height / 2) : mCeil(width / 2),
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
                let offset = 150 - radius,
                    startX = 150,
                    startY = 150,
                    minradius = 5,
                    smallCircle = mRound(radius * 0.6)
                rootSvg.style.cssText = "position:absolute;left:" + (offsetX - offset) + "px;top:" + (offsetY - offset) + "px;display:none"

                setAttribute(rootSvgC1, "r", smallCircle)
                setAttribute(rootSvgC2, "r", radius)

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
                el.handler = mousedown
                function mousedown(e) {
                    if (timer) {
                        return
                    }
                    if (!el.bubbleData || !el.bubbleData.show) {
                        return
                    }
                    msg.addEventListener('contextmenu', contextmenu)
                    window.addEventListener('touchstart', contextmenu)

                    resetSvgPosition(rootSvgPath)

                    offsetX = msg.offsetLeft
                    offsetY = msg.offsetTop
                    point.p1x = point.p2x = point.p3x = point.p4x = startX
                    point.p1y = point.p2y = point.p3y = point.p4y = startY

                    control.x = startX
                    control.y = startY
                    rootSvg.style.cssText = "position:absolute;left:" + (offsetX - offset) + "px;top:" + (offsetY - offset) + "px;display:block;"
                    setAttribute(rootSvgC1, "fill", color)
                    setAttribute(rootSvgPath, "fill", color)
                    setAttribute(rootSvgC2, "fill", color)
                    setAttribute(rootSvgC2, "cx", startX)
                    setAttribute(rootSvgC2, "cy", startY)

                    left = msg.getBoundingClientRect().left
                    top = msg.getBoundingClientRect().top

                    msg.style.cssText = "position:fixed;top:" + top + "px;left:" + left + "px;z-index:2017"
                    if (!tmpMsg) {
                        tmpMsg = msg.cloneNode()
                        tmpMsg.textContent = "1"
                        msg.parentNode.insertBefore(tmpMsg, msg)
                    }

                    setStyle(tmpMsg, "cssText", "visibility:hidden")

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
                    setStyle(rootSvgC2, "opacity", 1)

                    function mousemove(e) {
                        e.preventDefault()
                        e.stopPropagation()
                        e = isMobile ? e.changedTouches[0] : e
                        cx = e.pageX
                        cy = e.pageY
                        moveOffsetX = cx - x
                        moveOffsetY = cy - y
                        distance = Math.sqrt(mPow((moveOffsetX), 2) + mPow((moveOffsetY), 2))


                        currR = mRound(smallCircle - distance / 20)

                        if (currR < minradius) {
                            currR = minradius
                        }

                        endPointX = startX + moveOffsetX
                        endPointY = startY + moveOffsetY
                        getPoint(startX, startY, endPointX, endPointY, currR, radius)
                        setAttribute(rootSvgC2, "cx", endPointX)
                        setAttribute(rootSvgC2, "cy", endPointY)

                        setStyle(msg, "transform", "translate(" + moveOffsetX + "px," + moveOffsetY + "px)")

                        if (currentDistance > maxDistance) {
                            setStyle(rootSvgC1, "opacity", 0)
                            setStyle(rootSvgPath, "opacity", 0)
                            return
                        } else {
                            setStyle(rootSvgC1, "opacity", 1)
                            setStyle(rootSvgPath, "opacity", 1)
                        }

                        rootSvgPath.setAttribute("d", "M  " + point.p4x + " " + point.p4y + " L " + point.p1x + " " + point.p1y + " Q  " + control.x + " " + control.y + ",  " + point.p2x + " " + point.p2y + " L" + point.p3x + " " + point.p3y + " Q  " + control.x +
                            " " + control.y +
                            ",  " + point.p4x + " " + point.p4y + " Z")

                        setAttribute(rootSvgC1, "r", currR)
                    }



                    function getPoint(sx, sy, ex, ey, r1, r2) {
                        deltaX = ex - sx
                        deltaY = ey - sy
                        currentDistance = Math.sqrt(mPow((deltaY), 2) + mPow((deltaX), 2))
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
                        return Math.sqrt(mPow((ey - sy), 2) + mPow((ex - sx), 2))
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
                            setAttribute(rootSvgC1, "r", radius)
                            setStyle(rootSvgPath, "opacity", 0)
                            resetSvgPosition(rootSvgPath)
                            setStyle(rootSvgC1, "opacity", 0)
                            animation(startX, startY, startX + cx - x, startY + cy - y)
                        } else {
                            if (el.bubbleData && typeof el.bubbleData.afterHide === 'function') {
                                el.bubbleData.afterHide()
                            }
                            rootSvgC2.style.opacity = 0
                            setStyle(rootSvgC2, "opacity", 0)

                            if (binding.value && binding.value.show) {
                                setStyle(msg, "cssText", "opacity:1")
                            } else {
                                setStyle(msg, "cssText", "opacity:0")
                            }

                            setStyle(tmpMsg, "display", "none")
                            setStyle(rootSvg, "display", "none")
                            resetSvgPosition(rootSvgPath)
                        }
                    }



                    function animation(sx, sy, ex, ey) {
                        let count = 1
                        let minDeltaX = ex - sx
                        let minDeltaY = ey - sy
                        timer = setInterval(function a() {
                            count = (mAbs(count) % 2 == 0 ? -1 : 1) * count
                            let currX = sx + minDeltaX / (count * 2)
                            let currY = sy + minDeltaY / (count * 2)
                            if (mAbs(count) == 5) {
                                clearInterval(timer)
                                timer = null
                                setStyle(msg, "cssText", "")
                                setStyle(tmpMsg, "display", "none")
                                setStyle(rootSvg, "display", "none")
                                setStyle(rootSvgC1, "opacity", 0)
                                setAttribute(rootSvgC1, "r", radius)
                                setAttribute(rootSvgC2, "cx", startX)
                                setAttribute(rootSvgC2, "cy", startY)
                                return
                            } else {
                                setAttribute(rootSvgC2, "cx", currX)
                                setAttribute(rootSvgC2, "cy", currY)
                                setStyle(msg, "transform", "translate(" + (currX - sx) + "px," + (currY - sy) + "px)")
                            }
                            count = mAbs(count) + 1
                        }, 40)
                    }
                }
            }
        })
    }


    if (typeof exports == "object") {
        module.exports = vueBubble
    } else if (typeof define == "function" && define.amd) {
        define([], function() {
            return vueBubble
        })
    } else if (window.Vue) {
        window.vueBubble = vueBubble
        Vue.use(vueBubble)
    }


})()
