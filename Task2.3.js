function squareEveryDigit(number) {
    return String(number).split("")
            .map(item => Math.pow(item, 2))
            .join("");
}

console.log(squareEveryDigit(9119) == 811181);
console.log(squareEveryDigit(323) == 949);
console.log(squareEveryDigit(101) == 101);