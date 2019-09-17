function unique(array) {
    let result = [];
    for (let str of array) {
        if (!result.includes(str)) {
            result.push(str);
        }
    }
    return result;
}

export default unique;
