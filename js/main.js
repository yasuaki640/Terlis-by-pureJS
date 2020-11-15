const COLS = 10, ROWS = 20;
const PATTERN_COLS = 4, PATTERN_ROWS = 4;
let count = 0;
let cells;
let isFalling = false;
let fallingBlockKey;
let blockDirection = 0;
const UPWARD = 0;
const UPWARD_AFTER_GO_AROUND = 4;

// キーボードイベントを監視する
document.addEventListener("keydown", onKeyDown);


// ブロックのパターン
let blocks = {
    i: {
        class: "i",
        pattern: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ]
    },
    o: {
        class: "o",
        pattern: [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ]
    },
    t: {
        class: "t",
        pattern: [

            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0]
        ]
    },
    s: {
        class: "s",
        pattern: [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0]
        ]
    },
    z: {
        class: "z",
        pattern: [
            [0, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ]
    },
    j: {
        class: "j",
        pattern: [
            [0, 0, 0, 0],
            [1, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0]
        ]
    },
    l: {
        class: "l",
        pattern: [
            [0, 0, 0, 0],
            [0, 0, 1, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0]
        ]
    }
};

loadTable();
setInterval(function () {
    count++;
    document.getElementById("hello_text").textContent = "テトリス作成で学ぶJavaScript   " + count + "秒経過";

    if (hasFallingBlock()) { // 落下中のブロックがあるか確認する
        fallBlocks();// あればブロックを落とす
    } else { // なければ
        deleteRow();// そろっている行を消す
        generateBlock();// ランダムにブロックを作成する
    }
}, 1000);

function loadTable() {
    cells = [];
    let td_array = document.getElementsByTagName("td");
    let index = 0;
    for (let row = 0; row < ROWS; row++) {
        cells[row] = [];
        for (let col = 0; col < COLS; col++) {
            cells[row][col] = td_array[index];
            index++;
        }
    }

}

function fallBlocks() {
    // 1. 底についていないか？
    for (let col = 0; col < 10; col++) {
        if (cells[19][col].blockNum === fallingBlockNum) {
            isFalling = false;
            return; // 一番下の行にブロックがいるので落とさない
        }
    }
    // 2. 1マス下に別のブロックがないか？
    for (let row = ROWS - 2; row >= 0; row--) {
        for (let col = 0; col < COLS; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                if (cells[row + 1][col].className !== ""
                    && cells[row + 1][col].blockNum !== fallingBlockNum) {
                    isFalling = false;
                    return; // 一つ下のマスにブロックがいるので落とさない
                }
            }
        }
    }
    // 下から二番目の行から繰り返しクラスを下げていく
    for (let row = ROWS - 2; row >= 0; row--) {
        for (let col = 0; col < COLS; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                dropBlock(row, col);
            }
        }
    }
}


function hasFallingBlock() {
    // 落下中のブロックがあるか確認する
    return isFalling;
}

function deleteRow() {
    // そろっている行を消す
    for (let row = 19; row >= 0; row--) {
        let canDelete = true;
        for (let col = 0; col < 10; col++) {
            if (cells[row][col].className === "") {
                canDelete = false;
            }
        }
        if (canDelete) {
            // 1行消す
            for (let col = 0; col < 10; col++) {
                cells[row][col].className = "";
            }
            // 上の行のブロックをすべて1マス落とす
            for (let downRow = row - 1; downRow >= 0; downRow--) {
                for (let col = 0; col < 10; col++) {
                    dropBlock(downRow, col);
                }
            }
        }
    }
}

function dropBlock(row, col) {
    cells[row + 1][col].className = cells[row][col].className;
    cells[row + 1][col].blockNum = cells[row][col].blockNum;
    cells[row][col].className = "";
    cells[row][col].blockNum = null;
}

let fallingBlockNum = 0;

function generateBlock() {
    // ランダムにブロックを生成する
    // 1. ブロックパターンからランダムに一つパターンを選ぶ
    let keys = Object.keys(blocks);
    let nextBlockKey = keys[Math.floor(Math.random() * keys.length)];
    let nextBlock = blocks[nextBlockKey];
    let nextFallingBlockNum = fallingBlockNum + 1;
    let pattern = nextBlock.pattern;

    // ATTENTION kuso code
    for (let row = 1; row < pattern.length - 1; row++) {
        for (let col = 0; col < pattern[row].length; col++) {
            if (pattern[row][col] === 0) {
                continue;
            } else if (cells[row - 1][col + 3].className !== "") {
                alert("game over");
                return;
            }
            // 2. 選んだパターンをもとにブロックを配置する
            cells[row - 1][col + 3].className = nextBlock.class;
            cells[row - 1][col + 3].blockNum = nextFallingBlockNum;

        }
    }
    // 3. 落下中のブロックがあるとする
    isFalling = true;
    fallingBlockNum = nextFallingBlockNum;
    this.fallingBlockKey = nextBlockKey;
    blockDirection = UPWARD;
}

// キー入力によってそれぞれの関数を呼び出す
function onKeyDown(event) {
    const funcs = {
        "ArrowLeft": function () {
            moveLeft()
        },
        "ArrowRight": function () {
            moveRight()
        },
        "ArrowDown": function () {
            fallBlocks()
        },
        "KeyF": function () {
            rotateRight()
        }
    };

    if (event.code != null) {
        funcs[event.code]();
    }
}

function moveRight() {
    // 1. 右壁についていないか？
    for (let row = ROWS - 1; row >= 0; row--) {
        if (cells[row][COLS - 1].blockNum === fallingBlockNum) {
            return; // 一番左の列はいけないので動かない
        }
    }
    // 2. 1マス右に別のブロックがないか？
    for (let row = ROWS - 1; row >= 0; row--) {
        for (let col = 0; col < COLS; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                if (cells[row][col + 1].className !== ""
                    && cells[row][col + 1].blockNum !== fallingBlockNum) {
                    return; // 一つ右のマスにブロックがいるので落とさない
                }
            }
        }
    }
    // ブロックを右に移動させる
    for (let row = 0; row < ROWS; row++) {
        for (let col = COLS - 1; col >= 0; col--) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                cells[row][col + 1].className = cells[row][col].className;
                cells[row][col + 1].blockNum = cells[row][col].blockNum;
                cells[row][col].className = "";
                cells[row][col].blockNum = null;
            }
        }
    }
}

function moveLeft() {
    //  左壁についていないか？
    for (let row = ROWS - 1; row >= 0; row--) {
        if (cells[row][0].blockNum === fallingBlockNum) {
            return; // 一番左の列はいけないので動かない
        }
    }
    //  1マス左に別のブロックがないか？
    for (let row = ROWS - 1; row >= 0; row--) {
        for (let col = 0; col < 10; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                if (cells[row][col - 1].className !== ""
                    && cells[row][col - 1].blockNum !== fallingBlockNum) {
                    return; // 一つ左のマスにブロックがいるので落とさない
                }
            }
        }
    }
    // ブロックを左に移動させる
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                cells[row][col - 1].className = cells[row][col].className;
                cells[row][col - 1].blockNum = cells[row][col].blockNum;
                cells[row][col].className = "";
                cells[row][col].blockNum = null;
            }
        }
    }
}

function rotateRight() {
    fallingBlockKey = this.fallingBlockKey;
    let rotatedBlockState = blocks[fallingBlockKey].pattern;

    const rotate90degToRight = pattern => pattern[0].map((_, c) => pattern.map(r => r[c]).reverse());
    for (let i = 0; i < blockDirection; i++) {
        rotatedBlockState = rotate90degToRight(rotatedBlockState);
    }
    let rotated = rotate90degToRight(rotatedBlockState);

    //4*4行列の中で最も左上にくるブロックの座標を得る。
    let blockPointMap = searchBlockPoint(rotatedBlockState);

    //落ちているブロック位置を探索する
    let fallingBlockPointMap = searchFallingBlockPoint();

    //4*4のマスの(0,0)をフィールド上の座標に変換する。
    let x = fallingBlockPointMap.keys().next().value - blockPointMap.keys().next().value;
    let y = fallingBlockPointMap.values().next().value - blockPointMap.values().next().value;
    let pointInFieldMap = new Map([[x, y]]);

    let subArrayAroundBlock = getInfoAroundBlock(x, y);

    if (checkCanRotateBlock(subArrayAroundBlock, rotatedBlockState)) {
        rotateBlock(y, x, rotatedBlockState);
    }

    function rotateBlock(y, x, rotatedBlockState) {
        for (let row = y; row < PATTERN_ROWS + y; row++) {
            for (let col = x; col < PATTERN_COLS + x; col++) {
                if (col > COLS - 1 || row > ROWS - 1) {
                    break;
                }
                //回転対象ブロックをいったん初期化
                if (cells[row][col].blockNum !== undefined
                    && cells[row][col].blockNum !== null
                    && cells[row][col].blockNum === fallingBlockNum) {
                    cells[row][col].className = "";
                    cells[row][col].blockNum = null;
                }
                //ブロックを配置する
                if (rotatedBlockState[row - y][col - x] === 1) {
                    cells[row][col].blockNum = fallingBlockNum;
                    cells[row][col].className = fallingBlockKey;
                }
            }
        }
        blockDirection++;
        blockDirection %= UPWARD_AFTER_GO_AROUND;
    }

    function checkCanRotateBlock(subArrayAroundBlock, rotated) {
        for (let row = 0; row < PATTERN_ROWS; row++) {
            for (let col = 0; col < PATTERN_COLS; col++) {
                if (rotated[row][col] === 1) {
                    if (subArrayAroundBlock[row][col] === 2 || subArrayAroundBlock[row][col] === 3) {
                        return false;
                    }
                }
            }
        }
        return true;
    }


    function searchBlockPoint(currentState) {
        let blockPoint = new Map();
        for (let row = 0; row < currentState.length; row++) {
            for (let col = 0; col < currentState[row].length; col++) {
                if (currentState[row][col] === 1) {
                    blockPoint.set(col, row);
                    return blockPoint;
                }
            }
        }
    }

    function searchFallingBlockPoint() {
        let fallingBlockPoint = new Map();
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (cells[row][col].blockNum !== undefined
                    && cells[row][col].blockNum === fallingBlockNum) {
                    fallingBlockPoint.set(col, row);
                    return fallingBlockPoint;
                }
            }
        }
    }

    function getInfoAroundBlock(x, y) {
        let subArrOfFields = [[0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]];

        //4*4の配列に壁やほかのブロックなどの障害物の情報を入れていく
        for (let row = 0; row < PATTERN_ROWS; row++) {
            for (let col = 0; col < PATTERN_COLS; col++) {
                //回転対象のブロックを含む4*4の部分配列に
                //他のブロックや壁外などの情報を詰める
                let patternX = col + x;
                let patternY = row + y;
                // 1 = 落ちているブロック自身
                // 2 = すでに積みあがったブロック
                // 3 = フィールドの範囲外であることを示す
                if (patternX > COLS - 1 || patternY > ROWS - 1) {
                    subArrOfFields[row][col] = 3;
                } else if (cells[patternY][patternX].blockNum !== undefined
                    && cells[patternY][patternX].blockNum !== null) {
                    if (cells[patternY][patternX].blockNum === fallingBlockNum) {
                        subArrOfFields[row][col] = 1;
                    } else {
                        subArrOfFields[row][col] = 2;
                    }
                }
            }
        }
        return subArrOfFields;
    }
}


