# md2esa

[![最新リリース](https://img.shields.io/github/v/release/aoba-sato/vscode-md2esa?label=release)](https://github.com/aoba-sato/vscode-md2esa/releases/latest)

VSCode で書いた Markdown の数式ブロック `$$ … $$` を、esa の数式ブロック ` ```math ` に変換してクリップボードにコピーする VSCode 拡張機能です。

- 元のファイルは書き換えず、 `$$`のまま保持します 
- [使い方](#使い方)でクリップボードに変換版がコピーされます

## インストール

1. [最新リリース](https://github.com/aoba-sato/vscode-md2esa/releases/latest)を開き、**Assets** にある `md2esa-x.x.x.vsix` をダウンロードする
2. VSCodeで拡張機能ビュー（`Ctrl+Shift+X` / Mac: `Cmd+Shift+X`）を開く
3. 右上の `…` メニューから **「VSIX からのインストール...」** を選び、ダウンロードした `.vsix` を指定する

ターミナルからインストールすることもできます。

```sh
code --install-extension md2esa-x.x.x.vsix
```

> 過去のバージョンは [Releases 一覧](https://github.com/aoba-sato/vscode-md2esa/releases) から入手できます。

## 使い方

Markdown ファイル（`.md`）を開いた状態で、次のいずれかを実行します。

| 方法 | 操作 |
| --- | --- |
| ボタン | エディタ右上のコピーアイコンをクリック |
| 右クリック | エディタ内で右クリック →「esa用にコピー」 |
| ショートカット | `Ctrl+Alt+E`（Mac: `Cmd+Alt+E`） |
| コマンドパレット | `Ctrl+Shift+P` →「esa用にコピー」 |


- **何も選択していない場合**はファイル全体、**文字を選択している場合**はその範囲だけを変換します

## 変換例

変換前（VSCode）：

```markdown
運動エネルギーは次の式で表されます。

$$
E = \frac{1}{2} m v^2
$$

1 行で書いても変換されます。

$$ F = ma $$
```

変換後（クリップボード）：

````markdown
運動エネルギーは次の式で表されます。

```math
E = \frac{1}{2} m v^2
```

1 行で書いても変換されます。

```math
F = ma
```
````

リストや引用（`>`）の中の数式も、インデントや `>` を保ったまま変換します。

## 変換されないもの

次のものは変換せず、そのまま残します。

- コードブロック（` ``` ` / `~~~`）の中の `$$`
- 文の途中にある `$$ … $$`（例：`式 $$x$$ です`）
- インライン数式 `$ … $`
- 閉じられていない `$$`

## 更新方法

Release が更新された場合、[インストール](#インストール)と同様の方法で新しい `.vsix` を入れれば更新できます（アンインストールは不要です）。


## ライセンス
[MIT License](LICENSE)
