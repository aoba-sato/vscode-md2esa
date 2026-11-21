'use strict';

/**
 * Markdown 内の $$ 数式ブロックを esa 用の ```math ブロックに変換する。
 *
 * - 行頭（インデント・引用 ">" の後ろも可）から始まる $$ ... $$ を対象にする
 *   - 1行: `$$ E = mc^2 $$`
 *   - 複数行: `$$` 〜 `$$`（開始・終了行に数式が続いていても可）
 * - コードブロック（``` / ~~~）の中は変換しない
 * - 文中の $$...$$ や、閉じられていない $$ はそのまま残す
 */

const FENCE_RE = /^((?:[ \t]*>)*[ \t]*)(`{3,}|~{3,})/;
const OPEN_RE = /^((?:[ \t]*>)*[ \t]*)\$\$(.*)$/;

function detectEol(text) {
  return text.includes('\r\n') ? '\r\n' : '\n';
}

/** 行の先頭から、開始行と同じ prefix（インデント・引用記号）を取り除く */
function stripPrefix(line, prefix) {
  if (line.startsWith(prefix)) return line.slice(prefix.length);
  // 引用記号だけ一致して空白が違う場合などに備え、prefix の非空白部分で緩くマッチ
  const quoteOnly = prefix.replace(/[ \t]/g, '');
  if (quoteOnly) {
    const re = new RegExp('^' + quoteOnly.split('').map(() => '[ \\t]*>').join('') + '[ \\t]?');
    const m = line.match(re);
    if (m) return line.slice(m[0].length);
  }
  return line.replace(/^[ \t]+/, '');
}

/** 末尾の $$ を取り除く（エスケープされた \$$ は対象外） */
function endsWithClose(s) {
  const t = s.replace(/[ \t]+$/, '');
  return t.endsWith('$$') && !t.endsWith('\\$$');
}

function removeClose(s) {
  return s.replace(/[ \t]+$/, '').slice(0, -2);
}

function emitBlock(out, prefix, body) {
  // 前後の空行を除去
  while (body.length && body[0].trim() === '') body.shift();
  while (body.length && body[body.length - 1].trim() === '') body.pop();
  out.push(prefix + '```math');
  for (const l of body) out.push(l === '' ? prefix.replace(/[ \t]+$/, '') : prefix + l);
  out.push(prefix + '```');
}

function convert(text) {
  const eol = detectEol(text);
  const lines = text.split(/\r?\n/);
  const out = [];
  let fence = null; // { char, len }
  let count = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // コードブロック内はそのまま
    const fm = line.match(FENCE_RE);
    if (fence) {
      if (fm && fm[2][0] === fence.char && fm[2].length >= fence.len &&
          line.slice(fm[0].length).trim() === '') {
        fence = null;
      }
      out.push(line);
      continue;
    }
    if (fm) {
      fence = { char: fm[2][0], len: fm[2].length };
      out.push(line);
      continue;
    }

    const om = line.match(OPEN_RE);
    if (!om) {
      out.push(line);
      continue;
    }

    const prefix = om[1];
    const rest = om[2];

    // 1行: $$ ... $$
    if (rest.trim() !== '' && endsWithClose(rest)) {
      const inner = removeClose(rest).trim();
      if (inner !== '') {
        emitBlock(out, prefix, [inner]);
        count++;
      } else {
        out.push(line); // $$$$ のような空ブロックは触らない
      }
      continue;
    }

    // 複数行: 閉じ $$ を探す
    const body = [];
    if (rest.trim() !== '') body.push(rest.trim());
    let closeAt = -1;
    for (let j = i + 1; j < lines.length; j++) {
      const content = stripPrefix(lines[j], prefix);
      if (endsWithClose(content)) {
        const before = removeClose(content);
        if (before.trim() !== '') body.push(before.replace(/[ \t]+$/, ''));
        closeAt = j;
        break;
      }
      // 途中でコードフェンスが来たら数式ではないとみなす
      if (FENCE_RE.test(lines[j])) break;
      body.push(content.replace(/[ \t]+$/, ''));
    }

    if (closeAt === -1) {
      out.push(line); // 閉じられていない
      continue;
    }

    emitBlock(out, prefix, body);
    count++;
    i = closeAt;
  }

  return { text: out.join(eol), count };
}

module.exports = { convert };
