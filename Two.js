document.getElementById('input').addEventListener('change', function () {
    let fr = new FileReader();

    fr.onload = function () {
        const lines = fr.result.split(/\r?\n/).map((line) => line.split(' '));

        let count = 0;
        for (let line of lines) {
            line = line.map(string => parseInt(string));
            let safe = true;
            let ascending = JSON.stringify(line.toSorted((a,b) => a-b));
            let descending = JSON.stringify(line.toSorted((a,b) => b-a));

            if (ascending === JSON.stringify(line)) {  // Ascending
                for (let i = 1; i < line.length; i++) {
                    if (line[i] > line[i-1] + 3 || line[i] == line[i-1])
                        safe = false;
                }
            } else if (descending === JSON.stringify(line)) {   // Descending
                for (let i = 1; i < line.length; i++) {
                    if (line[i] < line[i-1] - 3 || line[i] == line[i-1])
                        safe = false;
                }
            } else {
                safe = false;
            }

            if (safe)
                count++;
        }

        console.log(count);
    }

    fr.readAsText(this.files[0]);
})