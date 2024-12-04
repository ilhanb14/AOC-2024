document.getElementById('input').addEventListener('change', function () {
    let fr = new FileReader();

    fr.onload = function () {
        const lines = fr.result.split(/\r?\n/).map((line) => line.split(' '));

        let countSafe = 0;
        for (let line of lines) {
            line = line.map(string => parseInt(string));

            let errors = checkLine(line);

            if (errors == 0) {
                countSafe++;
            } else if (errors <= 2) {   // If there are 2 errors or less, try if removing one value makes the line valid
                let foundValid = false; // Used to stop early if a valid version of the line is found
                let i = 0;

                while (!foundValid && i < line.length) {    // Check slices of the line with one value removed until you find one that's valid
                    let slice = i == 0 ? line.slice(1, line.length) : line.slice(0, i).concat(line.slice(i+1, line.length));
                    if (checkLine(slice) == 0)
                        foundValid = true;
                    i++;
                }

                if (foundValid)
                    countSafe++;
            }   // If there are 3 pairs that gave an error removing a single value will not help anyway so don't check
        }

        console.log(countSafe);
    }

    fr.readAsText(this.files[0]);
})

function checkLine(line) {
    let errors = 0; // Counter for number of errors found

    // Sorted ascending and descending to check the order of the line if it is sorted
    // JSON.stringify to properly compare
    let ascending = JSON.stringify(line.toSorted((a,b) => a-b));
    let descending = JSON.stringify(line.toSorted((a,b) => b-a));

    if (JSON.stringify(line) === ascending) {
        for (let i = 1; i < line.length; i++) {
            if (!checkAscendingPair(line[i-1], line[i]))    // If a pair of values is not correctly ascending count an error
                errors++;
        }
    } else if (JSON.stringify(line) === descending) {
        for (let i = 1; i < line.length; i++) {
            if (!checkAscendingPair(line[i], line[i-1]))    // Same check as ascending but with values reversed
                errors++;
        }
    } else {
        return 1;   // List is not in order so there is at least one error
    }

    return errors;
}

function checkAscendingPair(left, right) {
    return (left < right && right <= left+3);
}