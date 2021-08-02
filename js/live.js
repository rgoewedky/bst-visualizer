const svg = document.getElementById('canvas')
let r = 2.5;
let cx = 100
let cy = 100
let a = 1.6, b = 3.5
let unitLength = 0
const epsx = 0.5
const epsy = 0.25
const delta = 0.69
let levels = 6
let center = []
let k = 17
center.length = (1 << levels) - 1
let count = center.length - 1
let found = 0
let foundDeletedVal = -1
let nodes
let lineNodes
let textNodes
const element = document.getElementById('logger-content')
const smallBox = document.getElementById('small-box')


function writeLog(param) {
    element.innerHTML = `<p style="padding : 0.6rem 0;
    font-size:60%;color:whitesmoke;"><span>&gt;&gt;&nbsp;&nbsp;</span>${param}</p><hr class="consoleline">` + element.innerHTML

}

function smWriteLog(param) {
    smallBox.innerHTML = `<p>${param}</p>`
}

function smClear() {
    smallBox.innerHTML = ''
}

function spWriteLog(param, r, g, b, a) {
    element.innerHTML = `<p style="padding : 0.6rem 0;
    font-size:60%;color:rgba(${r},${g},${b},${a});"><span>&gt;&gt;&nbsp;&nbsp;</span>${param}</p><hr class="consoleline">` + element.innerHTML
}

function clearLog() {
    element.innerHTML = `<p style="padding : 0.6rem 0;
                font-size:60%;text-align:center;opacity: 90%;color:rgba(245, 245, 245, 0.508);">most recent log appears at the top</p>
            <hr class="consoleline">`
}



function init() {
    for (let i = levels - 1; i > -1; i--) {
        cy = 95 - ((levels - i - 1) * k)
        for (let j = 0; j < (1 << i); j++) {
            if (i == levels - 1) {
                unitLength = 100 / ((1 << i) + 1)
                cx -= unitLength
            }
            else {

                cx = (center[2 * count + 1].x + center[2 * count + 2].x) / 2;
            }
            const textNode = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textNode.setAttribute('x', cx - epsx + '%')
            textNode.setAttribute('y', cy + epsx + '%')
            textNode.setAttribute('font-family', 'monospace')
            textNode.setAttribute('font-weight', 'bold')
            textNode.setAttribute('fill', 'black')
            textNode.setAttribute('class', 'node-val')
            svg.prepend(textNode)

            const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            node.setAttribute('r', r + '%')
            node.setAttribute('cx', cx + '%')
            node.setAttribute('cy', cy + '%')
            node.setAttribute('stroke', 'white')
            node.setAttribute('stroke-width', '3')
            node.setAttribute('fill', 'none')
            node.setAttribute('class', 'node')
            svg.prepend(node)



            if (2 * count + 2 < center.length) {
                for (let ch = 2; ch > 0; ch--) {
                    [a, b] = euclideanDistance(center[2 * count + ch], { x: cx, y: cy })
                    let x1 = (a * center[2 * count + ch].x + b * cx) / (a + b)
                    let y1 = (a * center[2 * count + ch].y + b * cy) / (a + b)
                    let x2 = (b * center[2 * count + ch].x + a * cx) / (a + b)
                    let y2 = (b * center[2 * count + ch].y + a * cy) / (a + b)
                    const lineNode = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    lineNode.setAttribute('x1', x1 + '%')
                    lineNode.setAttribute('y1', y1 + '%')
                    lineNode.setAttribute('x2', x2 + '%')
                    lineNode.setAttribute('y2', y2 + '%')
                    lineNode.setAttribute('stroke', 'white')
                    lineNode.setAttribute('stroke-width', '2')
                    lineNode.setAttribute('class', 'edges')

                    svg.appendChild(lineNode)
                }
            }
            center[count--] = { x: cx, y: cy }

        }

    }


    nodes = document.getElementsByClassName('node')
    lineNodes = Array.from(document.getElementsByClassName('edges')).reverse()
    textNodes = document.getElementsByClassName('node-val')

}

init()

function euclideanDistance(center1, center2) {

    let sqDiffx = (center1.x - center2.x) * (center1.x - center2.x)
    let sqDiffy = (center1.y - center2.y) * (center1.y - center2.y)

    let distance = Math.sqrt(sqDiffx + sqDiffy)
    let b = (r + 10) * distance / 100
    return [distance - b, b]
}

function unset(id) {
    nodes[id].style.fill = 'none'
    nodes[id].style.display = 'none'
    if (id > 0) {
        lineNodes[id - 1].style.stroke = 'white'
        lineNodes[id - 1].style.display = 'none'
    }
    textNodes[id].textContent = ''
    textNodes[id].style.display = 'none'
}

function set(id, val) {
    nodes[id].style.fill = 'violet'
    nodes[id].style.display = 'block'
    if (id != 0) {
        if ((id - 1) % 2 == 0) lineNodes[id - 1].style.stroke = '#CCF609'
        else lineNodes[id - 1].style.stroke = '#ed01fe'
        lineNodes[id - 1].style.display = 'block'
    }
    textNodes[id].textContent = val
    textNodes[id].style.display = 'block'
}



function Node(val, id) {
    this.id = id
    this.val = val
    this.height = 1
    this.left = null
    this.right = null
    this.par = this
    let _this = this

    this.insertNode = (val, id, flag) => {
        if (this.val != val) {
            if (this.val > val) {

                if (this.left == null) {
                    if (flag) {
                        writeLog(this.val + " > " + val + " and left child is null so we found the position to insert")
                        smWriteLog(this.val + " > " + val)
                        explore(2 * id + 1)
                        setTimeout(() => {
                            let cur = new Node(val, 2 * id + 1)
                            cur.par = _this
                            _this.left = cur
                            set(2 * id + 1, val)
                            smClear()
                            if (flag)
                                writeLog(val + " : successfully inserted in tree")
                        }, 1520)
                    }
                    else {
                        let cur = new Node(val, 2 * id + 1)
                        cur.par = this
                        this.left = cur
                        set(2 * id + 1, val)
                    }

                }
                else {
                    if (flag) {
                        writeLog(this.val + " > " + val + " -> we have to go to left subtree")
                        smWriteLog(this.val + " > " + val)
                        explore(2 * id + 1)
                        setTimeout(() => {
                            _this.left.insertNode(val, 2 * id + 1, flag)
                        }, 1520)
                    }
                    else {
                        this.left.insertNode(val, 2 * id + 1, flag)
                    }
                }
            }
            else {
                if (this.right == null) {
                    if (flag) {
                        writeLog(this.val + " < " + val + " and right child is null so we found the position to insert")
                        smWriteLog(this.val + " < " + val)
                        explore(2 * id + 2)
                        setTimeout(() => {
                            let cur = new Node(val, 2 * id + 2)
                            cur.par = _this
                            _this.right = cur
                            set(2 * id + 2, val)
                            smClear()
                            if (flag)
                                writeLog(val + " : successfully inserted in tree")
                        }, 1520)
                    }
                    else {
                        let cur = new Node(val, 2 * id + 2)
                        cur.par = this
                        this.right = cur
                        set(2 * id + 2, val)
                    }

                }
                else {
                    if (flag) {
                        writeLog(this.val + " < " + val + " -> we have to go to right subtree")
                        smWriteLog(this.val + " < " + val)
                        explore(2 * id + 2)
                        setTimeout(() => {
                            _this.right.insertNode(val, 2 * id + 2, flag)
                        }, 1520)
                    }
                    else {
                        this.right.insertNode(val, 2 * id + 2, flag)
                    }
                }
            }

        }
        else if (flag)
            spWriteLog(val + " : is already present in bst")
    }

    this.searchNode = (val, id) => {
        explore(id)
        if (this.val == val) {
            writeLog(this.val + " = " + val + " -> we found the element")
            smWriteLog('found')
            found = 1
            explore(id)
            setTimeout(() => {
                smClear()
                return true
            }, 1520)

        }
        else if (this.val < val) {
            writeLog(this.val + " < " + val + " -> we have to go to right subtree")
            smWriteLog(this.val + " < " + val)
            if (this.right == null) {
                writeLog(val + " : not found")
                smWriteLog('not found')
                return false
            }

            setTimeout(() => {
                return _this.right.searchNode(val, 2 * id + 2)
            }, 1520)
        }
        else {
            writeLog(this.val + " > " + val + " -> we have to go to left subtree")
            smWriteLog(this.val + " > " + val)
            if (this.left == null) {
                writeLog(val + " : not found")
                smWriteLog('not found')
                return false
            }

            setTimeout(() => {
                return _this.left.searchNode(val, 2 * id + 1)
            }, 1520)
        }
    }

    this.deleteNode = (val, id) => {
        //we found the node to be deleted
        if (this.val == val) {

            found = -1;
            explore(id);

            //deleted node has zero child


            setTimeout(() => {

                if (_this.left == null && _this.right == null) {

                    if (_this.par == _this) { _this.par = null; tree = new Tree(); }
                    else {
                        if (_this.par.left == _this) _this.par.left = null
                        else _this.par.right = null
                    }
                    unset(id)
                    writeLog(foundDeletedVal + " : successfully deleted and bst retain it's structure")
                    foundDeletedVal = -1
                    return
                }

                if (_this.left == null || _this.right == null) {

                    let cur = null
                    if (_this.left == null) {
                        cur = _this.right
                        if (_this.par == _this) {
                            tree.root = null;
                            tree.root = cur
                        }
                        else {



                            if (_this.par.left == _this) {
                                _this.par.left = null
                                _this.par.left = cur
                            }
                            else {
                                _this.par.right = null
                                _this.par.right = cur
                            }

                        }
                    }
                    else {
                        cur = _this.left
                        if (_this.par == _this) {

                            tree.root = null;
                            tree.root = cur

                        }
                        else {


                            if (_this.par.left == _this) {
                                _this.par.left = null
                                _this.par.left = cur
                            }
                            else {
                                _this.par.right = null
                                _this.par.right = cur
                            }

                        }

                    }
                    _this.clean(id)
                    cur.update(id, id == 0 ? cur : _this.par)
                    writeLog(foundDeletedVal + " : successfully deleted and bst retain it's structure")
                    foundDeletedVal = -1
                    return
                }

                //deleted node has two child
                let cur = _this.right
                let curId = 2 * id + 2
                while (cur.left != null) {
                    cur = cur.left
                    curId = 2 * curId + 1
                }
                let curVal = cur.val
                cur.val = _this.val
                _this.val = curVal
                set(id, curVal)
                set(curId, cur.val)
                cur.deleteNode(cur.val, curId)

            }, 1520)



            //deleted node has one child  

        }
        else if (this.val < val) {
            if (this.right == null) {
                writeLog('element to be deleted not found in bst')
                return
            }
            writeLog(this.val + " < " + val + " -> we have to go to right subtree")
            explore(id)
            setTimeout(() => {
                _this.right.deleteNode(val, 2 * id + 2)
            }
                , 1520)


        }
        else {
            if (this.left == null) {
                writeLog('element to be deleted not found in bst')
                return
            }
            writeLog(this.val + " > " + val + " -> we have to go to left subtree")
            explore(id)
            setTimeout(() => {
                _this.left.deleteNode(val, 2 * id + 1)
            }
                , 1520)

        }
    }

    this.in_order = (id, arr) => {
        if (this.left != null) this.left.in_order(2 * id + 1, arr)
        arr.push(this.val)
        if (this.right != null) this.right.in_order(2 * id + 2, arr)
    }

    this.pre_order = (id, arr) => {
        arr.push(this.val)
        if (this.left != null) this.left.pre_order(2 * id + 1, arr)
        if (this.right != null) this.right.pre_order(2 * id + 2, arr)
    }

    this.post_order = (id, arr) => {
        if (this.left != null) this.left.post_order(2 * id + 1, arr)
        if (this.right != null) this.right.post_order(2 * id + 2, arr)
        arr.push(this.val)
    }


    this.update = (id, par) => {
        set(id, this.val)
        this.par = par
        if (this.left != null) {
            this.left.update(2 * id + 1, this)
        }
        if (this.right != null) {
            this.right.update(2 * id + 2, this)
        }
    }
    this.clean = (id) => {
        if (this.left != null) this.left.clean(2 * id + 1)
        if (this.right != null) this.right.clean(2 * id + 2)
        unset(id)
    }
}

function Tree() {
    this.root = null
    let _this = this
    this.add = (val, flag) => {
        if (this.root == null) {
            this.root = new Node(val, 0)
            set(0, val)
            if (flag)
                writeLog(val + " : successfully inserted in tree")
        }
        else {
            if (flag) {
                explore(0)
                setTimeout(() => {
                    _this.root.insertNode(val, 0, flag)
                }, 1520)
            }
            else {
                this.root.insertNode(val, 0, flag)
            }

        }
    }

    this.find = (val) => {

        if (this.root == null) {
            writeLog('tree is empty')
            return false
        }
        else {
            return this.root.searchNode(val, 0)
        }
    }

    this.delete = (val) => {
        if (this.root == null) {
            writeLog('tree is empty')
            return;
        }

        this.root.deleteNode(val, 0)
    }

    this.level_order = (arr) => {
        if (this.root == null) {
            return
        }

        let q = []
        q.push(this.root);

        while (q.length > 0) {
            let cur = q.shift()
            if (cur.left != null) {
                q.push(cur.left)
            }
            if (cur.right != null) {
                q.push(cur.right)
            }
            arr.push(cur.val)
        }
    }



    this.clear = (id) => {
        if (this.root != null) {
            this.root.clean(id)
        }
    }
}

const colors = ['#F0F970', '#EEF85E', '#ECF84D', '#EAF73B', '#E8F629', '#E7F517', '#E3F20A']
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function explore(id) {

    for (let i = 1; i < 8; i++) {
        await sleep(200);
        if (found == 0) nodes[id].style.fill = colors[i - 1]
        else nodes[id].style.fill = found == 1 ? '#0AF248' : '#CF352E'
    }
    found = 0
    nodes[id].style.fill = 'violet'
}

let tree = new Tree()
const insertBtn = document.getElementById('insert')
const searchBtn = document.getElementById('search')
const deleteBtn = document.getElementById('delete')
const resetBtn = document.getElementById('reset')
const generateBtn = document.getElementById('generate')
const printBtn = document.getElementById('traversal')
const inputs = document.getElementsByClassName('input')
const dialogBox = document.getElementsByClassName('dialog-box')[0]
const bigBox = document.getElementsByClassName('big-box')[0]
const preBtn = document.getElementById('pre')
const inBtn = document.getElementById('in')
const postBtn = document.getElementById('post')
const levelBtn = document.getElementById('level')
const closeBtn = document.getElementById('close')

insertBtn.addEventListener('click', () => {
    smClear()

    if (inputs[0].value == "" || inputs[0].value > 5) {
        if (inputs[0].value == "")
            alert('enter a number!!');
        else alert('number must be in the range : [0, 5]')
        return;
    }

    let num = Math.floor(inputs[0].value)
    inputs[0].value = ""
    spWriteLog('insertion of ' + num + ' starts...', 119, 248, 119, 0.864)
    tree.add(num, true);
})


searchBtn.addEventListener('click', () => {
    smClear()

    if (inputs[1].value == "") {
        alert('enter a number!!');
        return;
    }


    let num = inputs[1].value
    inputs[1].value = ""
    if (tree.root == null) {
        alert('tree is empty')
        return
    }
    spWriteLog('searching for ' + num + ' starts...', 250, 181, 8, 0.892)
    tree.find(num)



})

deleteBtn.addEventListener('click', () => {
    smClear()
    if (inputs[2].value == "") {
        alert('enter a number!!');
        return;
    }



    let num = inputs[2].value
    inputs[2].value = ""
    if (tree.root == null) {
        alert('tree is empty')
        return
    }
    foundDeletedVal = num
    spWriteLog('deletion of ' + num + ' starts...', 255, 0, 0, 1)
    tree.delete(num)


})


resetBtn.addEventListener('click', () => {
    for (let i = 0; i < inputs.length; i++) inputs[i].value = ""

    if (tree != null) {
        //traverse and clear the tree
        tree.clear(0)
        tree = new Tree()
    }

    clearLog()
    smClear()
})

function shuffle(arr) {
    arr.sort(() => Math.random() - 0.5);
}
let arr = [0, 1, 2, 3, 4, 5];

generateBtn.addEventListener('click', () => {
    if (tree.root != null) {
        let answer = confirm('Your current tree will be overided by the new one?')
        if (answer) {
            resetBtn.click()
        }
        else return
    }
    shuffle(arr)
    generator()
    writeLog("random bst generated")

})

function generator() {
    for (let i = 0; i < arr.length; i++) {
        // await sleep(200)
        tree.add(arr[i], false)
    }
    // writeLog('bst generated successfully!!')
}



printBtn.addEventListener('click', () => {
    if (tree.root == null) {
        alert('tree is empty')
        return
    }

    bigBox.style.display = 'block'

    // let a = []
    // tree.traversal(0, a)
    // writeLog(a)
})

window.onclick = (e) => {
    if (e.target == bigBox) bigBox.style.display = 'none'
}
preBtn.addEventListener('click', () => {
    smClear()
    bigBox.style.display = 'none'
    let a = []
    tree.root.pre_order(0, a)
    writeLog("Pre-Order Traversal : " + a)
    smWriteLog("pre: " + a)

})
inBtn.addEventListener('click', () => {
    smClear()
    bigBox.style.display = 'none'
    let a = []
    tree.root.in_order(0, a)
    writeLog('In-Order Traversal : ' + a)
    smWriteLog("in: " + a)

})
postBtn.addEventListener('click', () => {
    smClear()
    bigBox.style.display = 'none'
    let a = []
    tree.root.post_order(0, a)
    writeLog('Post-Order Traversal : ' + a)
    smWriteLog("post: " + a)
})
levelBtn.addEventListener('click', () => {
    smClear()
    bigBox.style.display = 'none'
    let a = []
    tree.level_order(a)
    writeLog("Level-Order Traversal : " + a)
    smWriteLog("level: " + a)
})
closeBtn.addEventListener('click', () => {
    smClear()
    bigBox.style.display = 'none'
})

//testing
