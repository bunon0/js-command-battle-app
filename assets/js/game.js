/**
 * キャラクターをインスタンス化する
 */
let friend1 = new Friend('カズキ', 180, 66, 13, 2, 45);
let friend2 = new Friend('だいすけ', 110, 16, 12, 3, 45);
let friend3 = new Friend('あや', 140, 43, 11, 1, 45);
let enemy1 = new Troll('トロル', 280, 38, 20, './assets/images/troll.png');
let enemy2 = new Dragon('ドラゴン', 380, 68, 6, './assets/images/dragon.png');

/**
 * キャラクター配列を作る
 */
let characterList = [];
characterList.push(friend1);
characterList.push(friend2);
characterList.push(friend3);
characterList.push(enemy1);
characterList.push(enemy2);

/**
 * ゲーム管理クラスをインスタンス化する
 */
let gameManege = new GameManege();

/**
 * コマンドクラスをインスタンス化する
 */
let command = new Command();
// コマンド選択の準備を整える
command.preparation();
