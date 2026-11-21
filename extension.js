'use strict';

const vscode = require('vscode');
const { convert } = require('./src/convert');

function activate(context) {
  const disposable = vscode.commands.registerCommand('md2esa.copyForEsa', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('Markdown ファイルを開いてから実行してください。');
      return;
    }

    const doc = editor.document;
    const selection = editor.selection;
    const useSelection = !selection.isEmpty;
    const source = useSelection ? doc.getText(selection) : doc.getText();

    const { text, count } = convert(source);
    await vscode.env.clipboard.writeText(text);

    const target = useSelection ? '選択範囲' : 'ファイル全体';
    const detail = count > 0 ? `（数式 ${count} 個を変換）` : '（変換対象の数式はありませんでした）';
    vscode.window.showInformationMessage(`esa用にコピーしました：${target}${detail}`);
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
