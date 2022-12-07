/**
 * 味方を管理するclass
 */
class Friend {
	constructor(name, maxHp, offense, speed, herb, herbPower) {
		this.name = name; //名前
		this.type = 'friend'; //敵味方判別
		this.maxHp = maxHp; //最大体力
		this.hp = maxHp; //体力
		this.liveFlag = true; //生存フラグ
		this.offense = offense; //攻撃力
		this.speed = speed; //素早さ
		this.herb = herb; //薬草
		this.herbPower = herbPower; //薬草の回復力

		this.command = ''; //選択されたcommand
		this.target = ''; //ターゲット
	}

	/**
	 * 表示用のパラメータを返す
	 */
	getMainParameter() {
		return '<b>' + this.name + '</b><br>' + '体力' + this.hp + '<br>' + '薬草' + this.herb + '<br>';
	}

	/**
	 * コマンドビューに表示するコマンド（HTML）を返す
	 * eventが"start"の場合
	 *  はじめに表示するコマンド（HTML）を返す
	 * eventがユーザーのコマンド選択の結果の場合
	 *  eventに応じて、表示するコマンド（HTML）を返す、
	 *  または、味方1人のコマンド選択を終了させる"end"を返す
	 */
	getCommand(event) {
		// はじめに表示するコマンド
		if (event === 'start') {
			let text = [
				'<div><b id="friendName">' + this.name + '</b></div>',
				'<div id="attackCommand">攻撃</div>',
				'<div id="recoveryCommand">薬草</div>',
			];
			return text;
		}

		// 選択されたコマンドのidまたはclassを取得する
		if (event.target.id !== '') {
			this.command = event.target.id;
		} else {
			this.command = event.target.className;
		}

		// 攻撃コマンドが選択されたとき
		if (this.command === 'attackCommand') {
			// 生存している的の配列（characterList配列の要素番号）を取得する
			let livedEnemy = searchLiveCharacterByType('enemy');
			// 生存している敵をコマンドビューに表示するためのHTML
			let livedEnemyHTML = [];

			// 生存している敵をコマンドビューに表示する
			for (let c of livedEnemy) {
				livedEnemyHTML.push('<div class="enemyCommand">' + characterList[c].name + '</div>');
			}
			livedEnemyHTML.unshift('<div><b id="friendName">' + this.name + '</b></div>');
			return livedEnemyHTML;
			// 敵が選択されたとき
		} else if (this.command === 'enemyCommand') {
			// 選択された敵をターゲットとして保存する
			this.target = characterList[searchCharacterByName(event.target.innerText)[0]];
			return 'end';
			// 薬草コマンドが選択された時
		} else if (this.command === 'recoveryCommand') {
			return 'end';
		}
	}

	/**
	 * 表示されたコマンドにイベントハンドラを登録する
	 */
	setEventHandler(event) {
		// コマンド初期状態の場合
		if (event === 'start') {
			// 攻撃コマンドのイベントハンドラを設定する
			attackCommand.addEventListener('click', command.callback);
			// 回復コマンドのイベントハンドラを設定する
			recoveryCommand.addEventListener('click', command.callback);
		}

		// 攻撃コマンドが選択された場合
		if (this.command === 'attackCommand') {
			let element = document.getElementsByClassName('enemyCommand');
			for (let i = 0; i < element.length; ++i) {
				element[i].addEventListener('click', command.callback);
			}
		}
	}

	/**
	 * 行動するメソッド
	 */
	action() {
		if (this.hp > 0) {
			//コマンドに応じた処理を行う
			switch (this.command) {
				//攻撃
				case 'enemyCommand':
					this.attack();
					break;
				//回復
				case 'recoveryCommand':
					this.recovery();
					break;
				default:
					Message.printMessage(this.name + 'はボーッとした<br>');
			}
		}
	}
	/**
	 * 攻撃するメソッド
	 */
	attack() {
		//攻撃相手が生存していれば攻撃
		if (this.target.liveFlag) {
			this.target.hp -= this.offense;
			//敵の体力から自分の攻撃力を引く
			if (this.target.hp < 0) {
				this.target.hp = 0;
			}

			//攻撃相手の体力がマイナスになる場合は、0にする
			Message.printMessage(
				this.name +
					'の攻撃<br>' +
					this.target.name +
					'に' +
					this.offense +
					'のダメージを与えた！<br>'
			);
		} else {
			Message.printMessage(this.name + 'の攻撃・・・<br>' + this.target.name + 'は倒れている<br>');
		}
	}
	/**
	 * 回復するメソッド
	 */
	recovery() {
		//薬草がない場合
		if (this.herb <= 0) {
			Message.printMessage(this.name + 'は薬草を・・・<br>薬草がない！<br>');
			return;
		}
		//体力が最大体力の場合
		if (this.maxHp == this.hp) {
			Message.printMessage(this.name + 'は薬草を・・・<br>これ以上回復できない！<br>');
			return;
		}
		//回復する値
		let heal = this.herbPower;
		//最大体力を超えて回復してしまいそうな場合
		if (this.maxHp - this.hp < this.herbPower) {
			heal = this.maxHp - this.hp;
		}
		//体力を回復する
		this.hp += heal;
		//薬草をひとつ減らす
		--this.herb;

		Message.printMessage(this.name + 'は薬草を飲んだ<br>体力が' + heal + '回復した！<br>');
	}
}

/**
 * 敵を管理するclass
 */
class Enemy {
	constructor(name, hp, offense, speed, path) {
		this.name = name; //名前
		this.type = 'enemy'; //敵味方種別
		this.hp = hp; //体力
		this.liveFlag = true; //生存フラグ
		this.offense = offense; //攻撃力
		this.speed = speed; //素早さ
		this.path = path; //画像の場所
	}
	/**
	 * 行動するメソッド
	 */
	action() {
		if (this.hp > 0) {
			this.attack();
		}
	}
}

/**
 * トロルclass
 */
class Troll extends Enemy {
	constructor(name, hp, offense, speed, path) {
		//継承
		super(name, hp, offense, speed, path);
	}
	/**
	 * 攻撃するメソッド
	 */
	attack() {
		// 生存している味方をランダムに選択する
		let f = characterList[searchLivedCharacterRandom('friend')];
		// 生存している味方をランダムに選択する
		f.hp -= this.offense;

		// 攻撃対象の体力がマイナスになる場合は0にする
		if (f.hp < 0) {
			f.hp = 0;
		}

		// 攻撃対象が生存している場合
		if (f.liveFlag) {
			Message.printMessage(
				this.name +
					'が襲いかかってきた<br>' +
					f.name +
					'は' +
					this.offense +
					'のダメージを受けた！<br>'
			);
			//攻撃対象の体力が0の場合
		} else {
			Message.printMessage(this.name + 'の攻撃・・・<br>' + f.name + 'は倒れている<br>');
		}
	}
}

/**
 * ドラゴンclass
 */
class Dragon extends Enemy {
	constructor(name, hp, offense, speed, path) {
		//継承
		super(name, hp, offense, speed, path);
	}
	/**
	 * 攻撃するメソッド
	 */
	attack() {
		// 一定のか確率で攻撃をミスする
		if (getRandomIntInclusive(0, 4) === 4) {
			Message.printMessage('ドラゴンは<br>グフッグフッと咳き込んでいる・・・<br>');
			return;
		}

		// 生存している味方をランダムに選択する
		let f = characterList[searchLivedCharacterRandom('friend')];
		// 生存している味方をランダムに選択する
		f.hp -= this.offense;

		// 攻撃対象の体力がマイナスになる場合は0にする
		if (f.hp < 0) {
			f.hp = 0;
		}

		// 攻撃対象が生存している場合
		if (f.liveFlag) {
			Message.printMessage(
				this.name + 'は炎を吹いた<br>' + f.name + 'は' + this.offense + 'のダメージを受けた！<br>'
			);
			//攻撃対象の体力が0の場合
		} else {
			Message.printMessage(this.name + 'の攻撃・・・<br>' + f.name + 'は倒れている<br>');
		}
	}
}

/**
 * ゲームを管理するclass
 */
class GameManege {
	constructor() {
		// 行動の順番を決める
		this.actionOrder();
		// パラメーターを表示する
		this.showParameter();
		// 敵の画像を表示する
		this.showEnemyImage();
		// はじめのメッセージを表示する
		this.showFirstMessage();
	}

	// 行動の順番を決める
	actionOrder() {
		// 素早さでソート
		characterList.sort(function (a, b) {
			return b.speed - a.speed;
		});
	}

	// パラメーターを表示または更新する
	showParameter() {
		// パラメーターを消去する
		parameterView.innerHTML = '';

		// 味方のパラメーターを表示する
		for (let c of characterList) {
			if (c.type === 'friend') {
				parameterView.innerHTML += '<div class="parameter">' + c.getMainParameter() + '</div>';
			}
		}

		// 敵のパラメーターをコンソールに表示する（デバック用）
		for (let c of characterList) {
			if (c.type === 'enemy') {
				console.log(c.name + '' + c.hp);
			}
		}
	}

	// 敵の画像を表示する
	showEnemyImage() {
		let i = 0;
		for (let c of characterList) {
			if (c.type === 'enemy') {
				enemyImageView.innerHTML +=
					'<img id = "enemyImage' +
					characterList.indexOf(c) +
					'"src="' +
					c.path +
					'"style="position:absolute; left:' +
					160 * i++ +
					'px; bottom: 0px">';
			}
		}
	}

	// 先頭開始時のメッセージを表示する
	showFirstMessage() {
		Message.printMessage('モンスターが現れた<br>');
	}

	// 倒れたキャラクターを処理する
	removeDiedCharacter() {
		for (let c of characterList) {
			if (c.hp <= 0 && c.liveFlag === true) {
				Message.addMessage(c.name + 'は倒れた<br>');
				// 生存フラグを落とす
				c.liveFlag = false;

				// 敵の場合は画像を削除
				if (c.type === 'enemy') {
					document.getElementById('enemyImage' + characterList.indexOf(c).remove());
				}
			}
		}
	}

	// 勝敗の判定をする
	judgeWinLose() {
		// 味方が残っていなければゲームオーバー
		if (!isAliveByType('friend')) {
			Message.addMessage('全滅しました・・・<br>');
			return 'lose';
		}
		// 敵が残っていなければ処理
		if (!isAliveByType('enemy')) {
			Message.addMessage('モンスターをやっつけた<br>');
			return 'win';
		}
		return 'none';
	}

	// 1ターン
	async battle() {
		let winLose = 'none';

		// 倒れたキャラクターはスキップする
		for (let c of characterList) {
			if (c.liveFlag === false) {
				continue;
			}
			await sleep(900);

			// キャラクターの駆動
			c.action();
			await sleep(1100);

			// パラメーターを更新する
			this.showParameter();
			await sleep(900);

			// 倒れたキャラクターを処理する
			this.removeDiedCharacter();
			await sleep(300);

			// 勝敗の判定をする
			winLose = this.judgeWinLose();

			// 決着がついた場合
			if (winLose === 'win' || winLose === 'lose') {
				return false;
			}
		}
		return true;
	}
}

/**
 * コマンドを管理するclass
 */
class Command {
	constructor() {
		// コマンドを実行する味方
		this.friendElementNum = [];
		// 何人目の味方がコマンド選択中華（0が1人目）
		this.current = 0;
	}
	// コマンド入力の準備をする
	preparation() {
		// コマンドを実行する味方の配列を空にする
		this.friendElementNum.splice(0);

		// commandを選択する味方を配列に入れる
		for (let c of characterList) {
			if (c.type === 'friend' && c.liveFlag === true) {
				this.friendElementNum.push(characterList.indexOf(c));
			}
		}

		// 味方のコマンドを取得する
		let text = characterList[this.friendElementNum[this.current]].getCommand('start');

		// コマンドを表示する
		this.showCommand(text);

		// イベントハンドラを登録する
		characterList[this.friendElementNum[this.current]].setEventHandler('start');
	}
	// コマンドを表示する
	showCommand(commands) {
		commandView.innerHTML = commands.join('');
	}

	// コマンドをクリックした時に呼ばれるコールバック関数
	callback(event) {
		// 味方のコマンド選択
		let result = command.commandTurn(event);

		// 味方全員のコマンド選択が終わった場合
		if (result) {
			// 先頭開始
			let promise = gameManege.battle();

			// 先頭が狩猟した場合
			promise.then(function (bool) {
				if (bool) {
					command.preparation();
				}
			});
		}
	}

	// 味方全員のコマンド選択が終わったら呼ばれる関数
	commandTurn(event) {
		// 味方1人のコマンドを取得する
		let result = characterList[this.friendElementNum[this.current]].getCommand(event);

		// 味方1人のコマンド入力が終わりの場合
		if (result === 'end') {
			// コマンドを選択していない味方が残っている場合
			if (!(this.current === this.friendElementNum.length - 1)) {
				// 次の味方
				++this.current;
				// 味方のコマンドを取得する
				let text = characterList[this.friendElementNum[this.current]].getCommand('start');
				// コマンドを表示する
				this.showCommand(text);
				// 表示されたコマンドにイベントハンドラを割り当てる
				characterList[this.friendElementNum[this.current]].setEventHandler('start');
			} else {
				// コマンドビューを空白にすうr
				commandView.innerHTML = '';

				this.current = 0;
				return true;
			}
			// 味方1人のコマンド入力が終わっていない場合
		} else {
			// 次のコマンドを表示して、イベントハンドラを登録する
			this.showCommand(result);
			// 表示されたコマンドにイベントハンドラを割り当てる
			characterList[this.friendElementNum[this.current]].setEventHandler();
		}

		return false;
	}
}

/**
 * メッセージを管理するclass
 */
class Message {
	static printMessage(text) {
		messageView.innerHTML = text;
	}

	static addMessage(text) {
		messageView.innerHTML += text;
	}
}

/**
 * characterList配列関連
 */
// 種別(type)で指定されたキャラクターが、全滅しているか調べる
function isAliveByType(type) {
	for (let c of characterList) {
		if (c.type === type && c.liveFlag === true) {
			return true;
		}
	}

	return false;
}
// 名前でキャラクターを探索し、配列の要素番号を返す
function searchCharacterByName(name) {
	let characterElementNum = [];

	let i = 0;
	for (let c of characterList) {
		if (c.name === name) {
			characterElementNum.push(i);
		}
		++i;
	}

	return characterElementNum;
}
// 種別（type）で指定された生存しているキャラクターを探し、配列の要素番号を返す
function searchLiveCharacterByType(type) {
	let characterElementNum = [];

	let i = 0;
	for (let c of characterList) {
		if (c.type === type && c.liveFlag === true) {
			characterElementNum.push(i);
		}
		++i;
	}

	return characterElementNum;
}

// 生存しているキャラクターのなかからランダムで1人選ぶ
function searchLivedCharacterRandom(type) {
	let livedcharacter = searchLiveCharacterByType(type);

	let randomValue = getRandomIntInclusive(0, livedcharacter.length - 1);

	return livedcharacter[randomValue];
}

/**
 * ツール
 */
// msミリ秒スリープする
function sleep(ms) {
	return new Promise(function (resolve) {
		setTimeout(resolve, ms);
	});
}

// minからmaxまでのランダムな整数を返す
function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
