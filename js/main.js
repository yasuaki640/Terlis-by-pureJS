// キーボードイベントを監視する
document.addEventListener("keydown", onKeyDown);

let count = 0;

let cells;

// ブロックのパターン
let blocks = {
    i: {
        class: "i",
        pattern: [
            [1, 1, 1, 1]
        ]
    },
    o: {
        class: "o",
        pattern: [
            [1, 1],
            [1, 1]
        ]
    },
    t: {
        class: "t",
        pattern: [
            [0, 1, 0],
            [1, 1, 1]
        ]
    },
    s: {
        class: "s",
        pattern: [
            [0, 1, 1],
            [1, 1, 0]
        ]
    },
    z: {
        class: "z",
        pattern: [
            [1, 1, 0],
            [0, 1, 1]
        ]
    },
    j: {
        class: "j",
        pattern: [
            [1, 0, 0],
            [1, 1, 1]
        ]
    },
    l: {
        class: "l",
        pattern: [
            [0, 0, 1],
            [1, 1, 1]
        ]
    }
};

loadTable();
setInterval(function () {
    count++;
    document.getElementById("hello_text").textContent = "テトリス作成で学ぶJavaScript   " + count + "秒経過";
    // ブロックが積み上がり切っていないかのチェック
    /*
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 10; col++) {
        if (cells[row][col].className !== "" && ) {
          alert("game over");
        }
      }
    }
    */
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
    for (let row = 0; row < 20; row++) {
        cells[row] = [];
        for (let col = 0; col < 10; col++) {
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
    for (let row = 18; row >= 0; row--) {
        for (let col = 0; col < 10; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                if (cells[row + 1][col].className !== "" && cells[row + 1][col].blockNum !== fallingBlockNum) {
                    isFalling = false;
                    return; // 一つ下のマスにブロックがいるので落とさない
                }
            }
        }
    }
    // 下から二番目の行から繰り返しクラスを下げていく
    for (let row = 18; row >= 0; row--) {
        for (let col = 0; col < 10; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                cells[row + 1][col].className = cells[row][col].className;
                cells[row + 1][col].blockNum = cells[row][col].blockNum;
                cells[row][col].className = "";
                cells[row][col].blockNum = null;
            }
        }
    }
}

let isFalling = false;

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
                    cells[downRow + 1][col].className = cells[downRow][col].className;
                    cells[downRow + 1][col].blockNum = cells[downRow][col].blockNum;
                    cells[downRow][col].className = "";
                    cells[downRow][col].blockNum = null;
                }
            }
        }
    }
}

let fallingBlockNum = 0;

function generateBlock() {
    // ランダムにブロックを生成する
    // 1. ブロックパターンからランダムに一つパターンを選ぶ
    let keys = Object.keys(blocks);
    let nextBlockKey = keys[Math.floor(Math.random() * keys.length)];
    let nextBlock = blocks[nextBlockKey];
    let nextFallingBlockNum = fallingBlockNum + 1;
    // 2. 選んだパターンをもとにブロックを配置する
    let pattern = nextBlock.pattern;
    for (let row = 0; row < pattern.length; row++) {
        for (let col = 0; col < pattern[row].length; col++) {
            if (pattern[row][col]) {
                cells[row][col + 3].className = nextBlock.class;
                cells[row][col + 3].blockNum = nextFallingBlockNum;
            }
        }
    }
    // 3. 落下中のブロックがあるとする
    isFalling = true;
    fallingBlockNum = nextFallingBlockNum;
}

// キー入力によってそれぞれの関数を呼び出す
function onKeyDown(event) {
    if (event.keyCode === 37) {
        moveLeft();
    } else if (event.keyCode === 39) {
        moveRight();
    } /*else if (event.keyCode === 38) {
    rotateRight();
  } */
}

function moveRight() {
    // 1. 右壁についていないか？
    for (let row = 19; row >= 0; row--) {
        if (cells[row][9].blockNum === fallingBlockNum) {
            return; // 一番左の列はいけないので動かない
        }
    }
    // 2. 1マス右に別のブロックがないか？
    for (let row = 19; row >= 0; row--) {
        for (let col = 0; col < 10; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                if (cells[row][col + 1].className !== "" && cells[row][col + 1].blockNum !== fallingBlockNum) {
                    return; // 一つ右のマスにブロックがいるので落とさない
                }
            }
        }
    }
    // ブロックを右に移動させる
    for (let row = 0; row < 20; row++) {
        for (let col = 9; col >= 0; col--) {
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
    for (let row = 19; row >= 0; row--) {
        if (cells[row][0].blockNum === fallingBlockNum) {
            return; // 一番左の列はいけないので動かない
        }
    }
    //  1マス左に別のブロックがないか？
    for (let row = 19; row >= 0; row--) {
        for (let col = 0; col < 10; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                if (cells[row][col - 1].className !== "" && cells[row][col - 1].blockNum !== fallingBlockNum) {
                    return; // 一つ左のマスにブロックがいるので落とさない
                }
            }
        }
    }
    // ブロックを左に移動させる
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
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
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                cells[col - 1][row].className = cells[row][col].className;
                cells[col - 1][row].blockNum = cells[row][col].blockNum;
                cells[row][col].className = "";
                cells[row][col].blockNum = null;
            }
        }
    }
}