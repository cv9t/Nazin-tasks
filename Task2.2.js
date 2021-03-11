function alphabetPosition(string) {
    return string.toLowerCase()
            .split("")
            .map(item => (item.charCodeAt() >= 97 && item.charCodeAt() <= 122) ? item.charCodeAt() - 96 : null)
            .filter(item => item!=null)
            .join(" ");
}

console.log(alphabetPosition("The sunset sets at twelve o' clock.") == "20 8 5 19 21 14 19 5 20 19 5 20 19 1 20 20 23 5 12 22 5 15 3 12 15 3 11");