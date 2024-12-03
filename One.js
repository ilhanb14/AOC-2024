document.getElementById('input').addEventListener('change', function () {
    let fr = new FileReader();

    fr.onload = function () {
        const pairs = fr.result.split(/\r?\n/);
        const left = [];
        const right = [];

        for (let pair of pairs) {
            const splitPair = pair.split(/\s+/).slice(0, 2);
            left.push(splitPair[0]);
            right.push(splitPair[1]);
        }
        
        const leftSorted = left.sort();
        const rightSorted = right.sort();
        
        const sortedPairs = [];
        for (let i in leftSorted)
            sortedPairs.push([leftSorted[i], rightSorted[i]]);

        const total = sortedPairs.reduce((total, pair) => {
            const distance = pair[0] > pair[1] ? pair[0] - pair[1] : pair[1] - pair[0];
            return total + distance;
        }, 0);

        console.log("Total distance: ", total);

        let similarityScore = 0;
        for (let leftNum of left) {
            const rightDupes = right.filter((num) => num === leftNum);
            similarityScore += leftNum * rightDupes.length;
        }
        console.log("Similarity score:", similarityScore);
    }

    fr.readAsText(this.files[0]);
})