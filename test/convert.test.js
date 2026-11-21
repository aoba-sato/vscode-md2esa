'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { convert } = require('../src/convert');

const c = (s) => convert(s).text;

test('複数行の $$ ブロック', () => {
  assert.equal(
    c('前\n$$\na + b\n= c\n$$\n後'),
    '前\n```math\na + b\n= c\n```\n後'
  );
});

test('1行の $$ ... $$', () => {
  assert.equal(c('$$ E = mc^2 $$'), '```math\nE = mc^2\n```');
});

test('開始・終了行に数式が続く', () => {
  assert.equal(c('$$a\nb$$'), '```math\na\nb\n```');
});

test('コードブロック内は変換しない', () => {
  const src = '```\n$$\nx\n$$\n```\n~~~md\n$$ y $$\n~~~';
  assert.equal(c(src), src);
});

test('文中の $$ と インライン $ は変換しない', () => {
  const src = '文中 $$x$$ です。$y$ も。';
  assert.equal(c(src), src);
});

test('閉じられていない $$ はそのまま', () => {
  const src = '$$\nx\n\n本文';
  assert.equal(c(src), src);
});

test('インデント（リスト内）を保持', () => {
  assert.equal(
    c('- item\n  $$\n  x^2\n  $$'),
    '- item\n  ```math\n  x^2\n  ```'
  );
});

test('引用内', () => {
  assert.equal(c('> $$\n> x\n> $$'), '> ```math\n> x\n> ```');
});

test('CRLF を保持', () => {
  assert.equal(c('$$\r\nx\r\n$$\r\n'), '```math\r\nx\r\n```\r\n');
});

test('変換数を返す', () => {
  assert.equal(convert('$$a$$\n\n$$\nb\n$$').count, 2);
});

test('既存の ```math はそのまま', () => {
  const src = '```math\nx\n```';
  assert.equal(c(src), src);
});
