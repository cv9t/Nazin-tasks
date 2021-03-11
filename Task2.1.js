function arrayDiff(a, b) {
    return a.map((item) => b.includes(item) ? null: item)
            .filter(item => item != null);
}

console.log(JSON.stringify(arrayDiff([1,2],[1])) == JSON.stringify([2]));
console.log(JSON.stringify(arrayDiff([1,2,2,2,3],[2])) == JSON.stringify([1,3]));
console.log(JSON.stringify(arrayDiff([1,2,2,2,3],[2, 9, 99, -1])) == JSON.stringify([1,3]));