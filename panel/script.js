class Training {
    constructor() {
        this._setupLevel();
        this.setupTable(1);

        this.counter = 0;
        this.isStaretd = false;
    }

    get level() {
        const l = document.getElementById('level');
        return parseInt(l.value);
    }

    /**
     * 難易度の選択肢のセットアップ
     */
    _setupLevel() {
        const level = document.getElementById('level');

        for (let i = 1; i <= 20; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.innerText = `Lv. ${i}`;
            level.appendChild(option);
        }
    }

    /**
     * テーブルのセットアップ
     * @param {Number} level - 難易度
     */
    setupTable(level) {
        const ntable = document.getElementById('num-table');
        // clear
        while (ntable.firstChild) {
            ntable.removeChild(ntable.firstChild);
        }

        const nitem = parseInt(level, 10) + 3;
        const size = Math.ceil(Math.sqrt(nitem));
        const answer = this._generateAnswerList(nitem, size);

        for (let i = 0; i < size; i++) {
            const row = document.createElement('div');
            row.classList.add('row');

            for (let j = 0; j < size; j++) {
                const col = document.createElement('div');
                col.classList.add('col');

                const ans = answer[(i * size) + j] || 0;
                if (!ans) {
                    col.classList.add('-boderonly');
                }

                const span = document.createElement('span');
                span.innerText = ans || '　';  // スタイルが崩れるため
                col.appendChild(span);
                row.appendChild(col);

                const self = this;
                col.addEventListener('click', function () {
                    self._check(this, ans, nitem);
                });
            }

            ntable.appendChild(row);

        }
    }

    /**
     * 回答リストを生成する（ハズレはundefined）
     * @param {Number} nitem - 回答数
     * @param {Number} size - テーブルの1辺のサイズ
     */
    _generateAnswerList(nitem, size) {
        // answer
        const list = [...Array(nitem)].map((a, i) => i + 1);
        // dummy
        list.push(...Array(Math.pow(size, 2) - nitem));

        // random sort
        for (let i = list.length - 1; 0 < i; i--) {
            const r = Math.floor(Math.random() * (i + 1));
            [list[i], list[r]] = [list[r], list[i]];
        }

        return list;
    }

    /**
     * スタート
     */
    start() {
        this._visualizeTable(false);

        this.isStaretd = true;
        this.counter = 0;
    }

    /**
     * リセット
     */
    reset() {
        this.setupTable(this.level);
        this.counter = 0;
        this.isStaretd = false;
    }

    _check(self, ans, nitem) {
        if (!this.isStaretd) { return; }
        self.classList.remove('-boderonly');

        if (ans === 0 || this.counter + 1 !== ans) {
            this._fail(self);
            return;
        }

        this.counter++;
        if (this.counter === nitem) {
            this._success();
            return;
        }
    }

    _fail(self) {
        this._visualizeTable(true);
        self.classList.add('-failed');
        this.isStaretd = false;
        setTimeout(() => { alert('失敗'); }, 100);
    }

    _success() {
        this._visualizeTable(true);
        this.isStaretd = false;
        setTimeout(() => { alert('成功'); }, 100);
    }

    _visualizeTable(isVisible) {
        const ntable = document.getElementById('num-table');
        ntable.childNodes.forEach(a => {
            a.childNodes.forEach(b => {
                if (isVisible) {
                    b.classList.remove('-boderonly');
                } else {
                    b.classList.add('-boderonly');
                }
            });
        });
    }
}


window.onload = () => {
    const startEvent = () => {
        training.start();
        start.style.display = 'none';
        reset.style.display = 'inline-block';
    };

    const resetEvent = () => {
        training.reset();
        start.style.display = 'inline-block';
        reset.style.display = 'none';
    };

    const training = new Training();
    const level = document.getElementById('level');
    level.addEventListener('change', function () {
        resetEvent();
        training.setupTable(this.value);
    });

    const start = document.getElementById('btn-start');
    const reset = document.getElementById('btn-reset');
    reset.style.display = 'none';

    start.addEventListener('click', startEvent);
    reset.addEventListener('click', resetEvent);
};
