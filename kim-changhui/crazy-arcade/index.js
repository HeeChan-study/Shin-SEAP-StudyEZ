const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

/**
 * 定数集
 */
const CANVAS_WIDTH = 600; // キャンバスの広さ
const CANVAS_HEIGHT = 600;
const CHARACTER_WIDTH = 44; // キャラクターイメージの大きさ
const CHARACTER_HEIGHT = 56;
const FRAME_SET = 1000 / 60; // キャラクター動きフレーム 60fps
const TILE_SIZE = 40; // タイルサイズ
const FOR_BOOM_TIME = 3200; // 水風船の爆発までにかかる時間。
const BOOM_LEFT_TIME = 500; // 水風船が爆発が消えるまでイメージが残る時間。


/**
 * 変数集
 */
let characterX = CANVAS_WIDTH / 2 - CHARACTER_WIDTH / 2; // キャラクター位置
let characterY = CANVAS_HEIGHT / 2 - CHARACTER_HEIGHT / 2; // キャラクター位置

let characterSpeed = 3; // キャラクタースピード
let waterBallonCount = 1; // 水風船の個数
let waterBallonRange = 3; // 水風船範囲

let moveInterval = {}; // 動きインターバル関数
let moveArray = []; // キャラクターの動き配列
let waterBallonArray = []; // 水風船配列
let bupArray = []; // 水風船爆発イメージの配列
let bdownArray = [];
let bleftArray = [];
let brightArray = [];


/**
 * イメージオブジェクトの作成
 */
const backgroundImg = new Image(); // バックグラウンド·イメージ
const characterImg = new Image(); // キャラクターイメージ
const bcenterImg = new Image(); // 水風船の真ん中爆発のイメージ
const bupImg = new Image(); // 水風船の上爆発のイメージ
const bdownImg = new Image(); // 水風船の下爆発のイメージ
const bleftImg = new Image(); // 水風船の左爆発のイメージ
const brightImg = new Image(); // 水風船の右爆発のイメージ

/**
 * イメージリンク
 */
backgroundImg.src = './public/img/mapbg2.png'
characterImg.src = './public/img/bazzi_down.png';
bcenterImg.src = './public/img/bcenter.png';
bupImg.src = './public/img/bup.png';
bdownImg.src = './public/img/bdown.png';
bleftImg.src = './public/img/bleft.png';
brightImg.src = './public/img/bright.png';

/**
 * イメージリンク変数
 */
const characterUpImageLink = './public/img/bazzi_up.png';
const characterDownImageLink = './public/img/bazzi_down.png'; // default image
const characterLeftImageLink = './public/img/bazzi_left.png';
const characterRightImageLink = './public/img/bazzi_right.png';

/**
 * フラグ集
 */
let characterMoveFlag = false; // キャラクター動きフラグ
let imageOnloadFlag = false; // イメージ描くフラグ
let upFlag = false; // 上下左右キーボードフラッグ
let downFlag = false;
let leftFlag = false;
let rightFlag = false;

///////////////////////////////////////////////////////////////////////////////////////

/**
 * キャンバス広さ設定
 */
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;


/**
 * モニターごとのピクセルに応じた設定
 */
const dpr = window.devicePixelRatio;
context.scale(dpr, dpr);


/**
 * キーボード keydown イベント リスナー
 */
document.addEventListener('keydown', (e) => {

  switch (e.key) {
    case "ArrowUp":
    case "W":
    case "w":
    case "ArrowDown":
    case "S":
    case "s":
    case "ArrowLeft":
    case "A":
    case "a":
    case "ArrowRight":
    case "D":
    case "d":
      characterMoveFuntion(e.key);
      break;

    case "Space":
    case " ":
      waterBallonFunction(characterX, characterY);
      break;
  }
});


/**
 * キーボード キーアップ イベント リスナー
 */
document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      stopMoveFunction("Up");
      break;

    case "S":
    case "ArrowDown":
    case "s":
      stopMoveFunction("Down");
      break;

    case "A":
    case "ArrowLeft":
    case "a":
      stopMoveFunction("Left");
      break;

    case "D":
    case "ArrowRight":
    case "d":
      stopMoveFunction("Right");
      break;
  }
});

/**
 * キャラクター動き開始関数
 */
const characterMoveFuntion = (keycode) => {

  switch (keycode) {
    case "ArrowUp":
    case "w":
    case "W":
      moveArray.push("Up");
      break;

    case "ArrowDown":
    case "S":
    case "s":
      moveArray.push("Down");
      break;

    case "ArrowLeft":
    case "A":
    case "a":
      moveArray.push("Left");
      break;

    case "ArrowRight":
    case "D":
    case "d":
      moveArray.push("Right");
      break;
  }
}


/**
 * キャラクター画像変更関数
 */
const characterImageFunction = (direction) => {
  switch (direction) {
    case "Up":
      characterImg.src = characterUpImageLink;
      break;

    case "Down":
      characterImg.src = characterDownImageLink;
      break;

    case "Left":
      characterImg.src = characterLeftImageLink;
      break;

    case "Right":
      characterImg.src = characterRightImageLink;
      break;
  }
}


/**
 * キャラクタ動き止め関数
 */
const stopMoveFunction = (direction) => {
  moveArray = moveArray.filter((e) => e !== direction);

  if (moveArray.length <= 0) {
    clearInterval(moveInterval);
  }
}


/**
 * 水風船関数
 */
const waterBallonFunction = (characterX, characterY) => {
  const waterBallonImg = new Image(); // 물풍선 이미지
  waterBallonImg.src = './public/img/Bomb302icon.png';

  /**
   * 水風船の位置調整
   */
  const adjustedCharacterX = Math.floor((characterX + CHARACTER_WIDTH / 2) / TILE_SIZE) * TILE_SIZE;
  const adjustedCharacterY = Math.floor((characterY + CHARACTER_HEIGHT / 2) / TILE_SIZE) * TILE_SIZE;

  const waterBallonX = adjustedCharacterX;
  const waterBallonY = adjustedCharacterY;

  
  let boomFlag = false; // 水風船爆発フラグ

  let timeout = {};
  let boomInterval = {};

  /**
   * 時間経過後、現在の水風船爆発フラグ変更
   */
  timeout = setTimeout(() => {
    waterBallonArray.forEach((current) => {
      if (current.waterBallonX === waterBallonX && current.waterBallonY === waterBallonY) {
        current.boomFlag = true;
      }
    })

  }, FOR_BOOM_TIME);


  // 水風船オブジェクトの作成
  waterBallonArray.push({
    waterBallonImg: waterBallonImg,
    waterBallonX: waterBallonX,
    waterBallonY: waterBallonY,
    timeout: timeout,
    boomFlag: boomFlag,
  });

  /**
   * 水風船が爆発した場合に実行
   */
  boomInterval = setInterval(() => {
    waterBallonArray.forEach((current) => {
      if (current.waterBallonX === waterBallonX && current.waterBallonY === waterBallonY && current.boomFlag) {
        
        /**
         * 爆発による爆発オブジェクトの生成
         */
        for (let i = 1; i <= waterBallonRange; i++) {
          const bupX = adjustedCharacterX;
          const bupY = adjustedCharacterY - TILE_SIZE * i;
          const bdownX = adjustedCharacterX;
          const bdownY = adjustedCharacterY + TILE_SIZE * i;
          const bleftX = adjustedCharacterX - TILE_SIZE * i;
          const bleftY = adjustedCharacterY;
          const brightX = adjustedCharacterX + TILE_SIZE * i;
          const brightY = adjustedCharacterY;

          current.waterBallonImg.src = './public/img/bcenter.png';

          bupArray.push({
            bupImg: bupImg,
            bupX: bupX,
            bupY: bupY,
          });

          bdownArray.push({
            bdownImg: bdownImg,
            bdownX: bdownX,
            bdownY: bdownY,
          });

          bleftArray.push({
            bleftImg: bleftImg,
            bleftX: bleftX,
            bleftY: bleftY,
          });

          brightArray.push({
            brightImg: brightImg,
            brightX: brightX,
            brightY: brightY,
          });

          /**
           * 爆発範囲にある他の水風船の爆発フラグの変更
           */
          for (let j = 0; j < waterBallonArray.length; j++) {
            if (((waterBallonArray[j].waterBallonX === bupX) && (waterBallonArray[j].waterBallonY === bupY))
              || ((waterBallonArray[j].waterBallonX === bdownX) && (waterBallonArray[j].waterBallonY === bdownY))
              || ((waterBallonArray[j].waterBallonX === bleftX) && (waterBallonArray[j].waterBallonY === bleftY))
              || ((waterBallonArray[j].waterBallonX === brightX) && (waterBallonArray[j].waterBallonY === brightY))
            ) {
              clearTimeout(waterBallonArray[j].timeout);
              waterBallonArray[j].boomFlag = true;
            }
          }

          /**
           * 爆発後、配列からオブジェクトを削除
           */
          setTimeout(() => {
            waterBallonImg.src = './public/img/Bomb302icon.png';
            bupArray = bupArray.filter((current) =>
              !(current.bupX === bupX && current.bupY === bupY)
            );

            bdownArray = bdownArray.filter((current) =>
              !(current.bdownX === bdownX && current.bdownY === bdownY)
            );

            bleftArray = bleftArray.filter((current) =>
              !(current.bleftX === bleftX && current.bleftY === bleftY)
            );

            brightArray = brightArray.filter((current) =>
              !(current.brightX === brightX && current.brightY === brightY)
            );

            waterBallonArray = waterBallonArray.filter((current) =>
              !(current.waterBallonX === waterBallonX && current.waterBallonY === waterBallonY)
            );

          }, BOOM_LEFT_TIME);

        }
        current.boomFlag = false;
        clearInterval(boomInterval);
        return;
      }
    });
  }, 10);

}

/**
 * 1秒当たりモニターリフレッシュレート単位で実行され、常にcanvasを描く。
 */
function loop(timeStamp) {
  context.clearRect(0, 0, canvas.width, canvas.height); // キャンバス初期化
  context.drawImage(backgroundImg, 0, 0); // バックグラウンドを描く

  /**
   * 水風船を描く
   */
  for (let i = 0; i < waterBallonArray.length; i++) {
    const currentWaterBallonImg = waterBallonArray[i].waterBallonImg;
    const currentWaterBallonX = waterBallonArray[i].waterBallonX;
    const currentWaterBallonY = waterBallonArray[i].waterBallonY;
    context.drawImage(currentWaterBallonImg, currentWaterBallonX, currentWaterBallonY);
  }

  /**
   * 水風船爆発を描く
   */
  for (let i = 0; i < bupArray.length; i++) {
    const currentBupImg = bupArray[i].bupImg;
    const currentBupX = bupArray[i].bupX;
    const currentBupY = bupArray[i].bupY;
    context.drawImage(currentBupImg, currentBupX, currentBupY);
  }

  for (let i = 0; i < bdownArray.length; i++) {
    const currentBdownImg = bdownArray[i].bdownImg;
    const currentBdownX = bdownArray[i].bdownX;
    const currentBdownY = bdownArray[i].bdownY;
    context.drawImage(currentBdownImg, currentBdownX, currentBdownY);
  }

  for (let i = 0; i < bleftArray.length; i++) {
    const currentBleftImg = bleftArray[i].bleftImg;
    const currentBleftX = bleftArray[i].bleftX;
    const currentBleftY = bleftArray[i].bleftY;
    context.drawImage(currentBleftImg, currentBleftX, currentBleftY);
  }

  for (let i = 0; i < brightArray.length; i++) {
    const currentBrightImg = brightArray[i].brightImg;
    const currentBrightX = brightArray[i].brightX;
    const currentBrightY = brightArray[i].brightY;
    context.drawImage(currentBrightImg, currentBrightX, currentBrightY);
  }

  /**
   * キャラクターを描く。ブラウザの最初のロード時にエラーが発生しないように処理
   */
  if (!imageOnloadFlag) {
    imageOnloadFlag = true;

    characterImg.onload = () => {
      context.drawImage(characterImg, characterX, characterY);
    }

  } else {
    context.drawImage(characterImg, characterX, characterY);
  }

  /**
   * キャラクターの動きはいつもチェックして処理
   */
  switch (moveArray.at(-1)) {
    case "Up":
      if (upFlag) break;
      upFlag = true;
      downFlag = false;
      leftFlag = false;
      rightFlag = false;

      characterImageFunction("Up");
      clearInterval(moveInterval);
      moveInterval = setInterval(() => {
        characterX += 0;
        characterY -= characterSpeed;
      }, FRAME_SET);
      break;

    case "Down":
      if (downFlag) break;
      upFlag = false;
      downFlag = true;
      leftFlag = false;
      rightFlag = false;

      characterImageFunction("Down");
      clearInterval(moveInterval);
      moveInterval = setInterval(() => {
        characterX += 0;
        characterY += characterSpeed;
      }, FRAME_SET);
      break;

    case "Left":
      if (leftFlag) break;
      upFlag = false;
      downFlag = false;
      leftFlag = true;
      rightFlag = false;

      characterImageFunction("Left");
      clearInterval(moveInterval);
      moveInterval = setInterval(() => {
        characterX -= characterSpeed;
        characterY += 0;
      }, FRAME_SET);
      break;

    case "Right":
      if (rightFlag) break;
      upFlag = false;
      downFlag = false;
      leftFlag = false;
      rightFlag = true;

      characterImageFunction("Right");
      clearInterval(moveInterval);
      moveInterval = setInterval(() => {
        characterX += characterSpeed;
        characterY += 0;
      }, FRAME_SET);
      break;

  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);