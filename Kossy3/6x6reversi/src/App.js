import React from 'react';
import './App.css';

//石の描画
const Stone = (props) => {
  //クラス名のリスト
  const stones = [
    'Stone white',
    'noStone',
    'Stone black',
  ]
  return (
    <button
      className={stones[props.colorIndex]}
      onClick={props.onClick}
    >
    </button>

  );
}

//盤の作成
class Board extends React.Component {
  //石とマスの描画
  renderStone(value, index) {
    return (
      <div
        key={index}
        className={'square' + (this.props.placeableBoard[index] ? ' placeable' : '')}
      >
        <Stone
          colorIndex={value + 1}
          onClick={() => this.props.onClick(index)}
        />
      </div>
    );
  }

  render() {
    let board = Array(6).fill(0).map((v, i) => {
      i++;
      return (
        <div className='board-row' key={i}>
          {Array(6).fill(0).map((v, j) => {
            j++;
            let index = i * 8 + j;
            let value = this.props.board[index];
            return this.renderStone(value, index);
          })}
        </div>);
    });
    return (
      <div className='board'>
        {board}
      </div>);

  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      //盤の初期化 2:外枠, 1:黒, -1:白, 0:空
      board: [
        2, 2, 2, 2, 2, 2, 2, 2,
        2, 0, 0, 0, 0, 0, 0, 2,
        2, 0, 0, 0, 0, 0, 0, 2,
        2, 0, 0,-1, 1, 0, 0, 2,
        2, 0, 0, 1,-1, 0, 0, 2,
        2, 0, 0, 0, 0, 0, 0, 2,
        2, 0, 0, 0, 0, 0, 0, 2,
        2, 2, 2, 2, 2, 2, 2, 2
      ],
      //順番 1:黒, -1:白
      turn: 1,
    };
  }
  
  //石が置けるかの確認
  //置ける場合は引数のboardの反転部分を書き換え（置いた場所への代入はしない）
  // isPlaceble　返値 置けるかどうか
  putStoneTest(board, i, color) {
    let isPlaceable = false;
    const vectors = [9, 8, 7, 1, -1, -7, -8, -9];
    if (board[i] !== 0) {
      return isPlaceable;
    }
    vectors.forEach(vec => {
      let point = i + vec;
      if (board[point] === color) {
        return;
      }
      while (board[point] === -color) {
        point += vec;
      }
      if (board[point] === color) {
        isPlaceable = true;
        point -= vec;
        while (point + vec !== i) {
          board[point] *= -1
          point -= vec;
        }
      }
    });
    return isPlaceable;
  }

  //石を置く処理　置けない場合は早期リターン
  //ターンの交代も含む
  putStone(i) {
    let board = this.state.board.slice();
    let isPlaceable = this.putStoneTest(board, i, this.state.turn);
    if (!isPlaceable) {
      return;
    }
    board[i] = this.state.turn;
    let turn = this.state.turn;
    turn = -turn;
    this.setState({
      board: board,
      turn: turn,
    });

    //パス判定
    if (!this.isPlaceable(board, turn)) {
      turn = -turn;
      this.setState({
        board: board,
        turn: turn,
      });
    }
    //CPUの番ならcpuを呼ぶ
    //レンダリング猶予100ms
    if (turn === -1){
      setTimeout(() => this.cpu(-1), 100);
    }
  }

  //盤面全体を確認して、置ける場所があるかどうかを返す関数
  isPlaceable(board, color) {
    let testBoard = board.slice();
    const placeableBoard = this.getPlaceableBoard(testBoard, color);
    const placeable = placeableBoard.includes(true);
    return placeable;
  }

  //盤面全体の置ける場所をtrue, 置けない場所をfalseのリストで返す関数
  getPlaceableBoard(board, color) {
    const placeableBoard = board.map((value, index) => {
      let testBoard = board.slice();
      return this.putStoneTest(testBoard, index, color);
    });
    return placeableBoard;
  }

  //cpu用　評価関数
  cpuEval(board, color) {
    const evalBoard = [
      2,  2,  2,  2,  2,  2,  2,  2,
      2, 30,-10,  0,  0,-10, 30,  2,
      2,-10,-15, -5, -5,-15,-10,  2,
      2, -3, -5, -1, -1, -5, -3,  2,
      2, -3, -5, -1, -1, -5, -3,  2,
      2,-10,-15, -5, -5,-15,-10,  2,
      2, 30,-10, -3, -3,-10, 30,  2,
      2,  2,  2,  2,  2,  2,  2,  2
    ];
    const turn = 36 - board.filter(function (value) {
      return value === 0;
    }).length;
    const result = board.map((v, i)=>{
      if(v === color) {
        return evalBoard[i] + turn/2;
      } else {
        return 0;
      }
    });
    const score =  result.reduce((sum, value) => sum + value, 0);
    return score;
  }

  //cpu処理
  cpu(cpuColor){
    const maxScore = 1000; //mini-max用 評価の最大値
    const minScore = -1000; //mini-max用 評価の最小値
    const limitDepth = 4; //探索の最大深度
    const initBoard = this.state.board;
    const initColor = this.state.turn;

    //探索用再帰関数
    const test = (board, color, depth) => {
      //最深部到達で即スコア返す
      if (limitDepth === depth){
        return {
          score: this.cpuEval(board, color),
          move: [],
        };
      }
      //手番の保存
      let move = [];
      //mini-max用のスコア保存変数を初期化
      let score = 0;
      if (color === cpuColor) {
        score = minScore;
      }
      if (-color === cpuColor) {
        score = maxScore;
      }
      //盤面を総当たりで置ける場所を探して処理
      for (let i=0; i<64; i++) {
        if(board[i] === 2){
          continue;
        }
        let testBoard = board.slice();
        const placeable = this.putStoneTest(testBoard, i, color);
        if (placeable) {
          //置ける場所があった場合の処理
          testBoard[i] = color;
          //再帰
          let result = test(testBoard, -color, depth + 1);
          // mini-max
          //自分の番は最大値をとる
          if (color === cpuColor && result.score > score) {
            score = result.score;
            move = [i].concat(result.move);
          }
          //相手の番は最小値をとる
          if (-color === cpuColor && result.score < score) {
            score = result.score;
            move = [i].concat(result.move);
          }
        }
      }
      //評価と手番を返す
      return {
        score,
        move,
      }
    }
    //最善手を打つ
    let result = test(initBoard, initColor, 0);
    console.log(result);
    this.putStone(result.move[0]);
  }

  render() {
    //ゲームの情報をオブジェクトで保存
    let gameInfo = {
      //black, white : それぞれの石の数
      black: this.state.board.filter(function (value) {
        return value === 1;
      }).length,
      white: this.state.board.filter(function (value) {
        return value === -1;
      }).length,
      //winner : 勝者
      winner: null,
    }

    //決着判定
    if (
      !this.isPlaceable(this.state.board, this.state.turn) &&
      !this.isPlaceable(this.state.board, -this.state.turn)) {
      if (gameInfo.black > gameInfo.white) {
        gameInfo.winner = 1;
      } else if (gameInfo.black < gameInfo.white) {
        gameInfo.winner = -1;
      } else {
        gameInfo.winner = 0;
      }
    }

    //決着の表示
    const showWinner = (
      <div className='game-info'>
        <p>{gameInfo.black + " - " + gameInfo.white + (gameInfo.winner === 0 ? " Draw" : " Winner")}</p>
        {gameInfo.winner === 0 ? null : (
          <Stone
            colorIndex={gameInfo.winner + 1}
            isPlaceable={false}
            onClick={() => undefined}
          />)}
      </div>
    );

    //ゲーム中の表示
    const nextTurn = (
      <div className='game-info'>
        <p>{gameInfo.black + " - " + gameInfo.white + " Turn"}</p>
        <Stone
          colorIndex={this.state.turn + 1}
          isPlaceable={false}
          onClick={() => undefined}
        />
      </div>
    );

    const placeableBoard = this.getPlaceableBoard(this.state.board, this.state.turn);

    return (
      <div className="App">
        {gameInfo.winner === null ? nextTurn : showWinner}
        <div className="game-board">
          <Board
            board={this.state.board}
            placeableBoard={placeableBoard}
            onClick={(i) => this.putStone(i)}
          />
        </div>
      </div>
    );
  }
}


export default App;
