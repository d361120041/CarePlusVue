// src/utils/number.js
export function formatCount(n) {
    if (typeof n !== 'number') return n;
    if (n >= 10000) {
        // 保留一位小數，如果要整數，改成 Math.floor(n/10000)
        return (n / 10000).toFixed(1).replace(/\.0$/, '') + '萬';
    }
    return n.toString();
}
