    /* Transform Array Function */
function transformNums(arr) {

    /* Write original array on page */
    document.getElementById("originalArray").innerHTML = arr;
 
    /* Sort the array in ascending order */
    arr.sort(function(a, b){return a - b});

    var transformedArray = []; /* Initialize an empty array */
    
    /* loop 3 times while reversing the initial array and concatinating it to the new array*/
    for (var i=0; i<3; i++) {
        transformedArray = transformedArray.concat(arr);
        arr.reverse();
    }

    /* Write new array to page */
    document.getElementById("transformedArray").innerHTML = transformedArray;

    /* Show the new array in console */
    console.log(transformedArray);
}

/* List Generator */
function listGenerator() {
    const numItems = 100;
    let listHtml = '<ul>';
    for (var i = 1; i <= numItems; i++) {
        
        var textToAdd = (i%2 == 0) ? "EVEN" : "ODD";

        textToAdd += (i%3 == 0) ? " 3 MULTIPLE" : "";

        textToAdd += (i%5 == 0) ? " 5 MULTIPLE" : "";

        listHtml += '<li>' + textToAdd + '</li>';
    }

    listHtml += '</ul>';

    document.getElementById("showList").innerHTML = listHtml;
}

var arr = [3, 1, 2, 5, 4];
transformNums(arr);

listGenerator();