function determineThInnerHTML(d, i, totalColumns) {
    if (i > 2) {
        
    }


    if (i == 0) {  // return text aligner only
        return `<svg id="text-align-control" class="align-left" 
                 height="13", width="15">
                    <path d="M0,3 L8,3 M0,6 L13,6 M0,9 L8,9 M0,12 L13,12"/>
                </svg>`;
    } else if (i == 1) {  // return sorter for original-index column
        return `<div class="sort line-number" id="i${i}">&#x25B2;</div>`; 
    } else if (i == 2) {
        if (i == totalColumns - 1) {  // add sorter only
            return `<pre>${d}</pre>
                    <div class="sort" id="i${i}">&equiv;</div>`; 
        } else {  // add sorter & right-side column resizer
            return `<pre>${d}</pre>
                    <div class="sort" id="i${i}">&equiv;</div>
                    <div class="resize-right"></div>`; 
        }
    } else {
        if (i !== totalColumns - 1) {  // add sorter & column resizers
            return `<div class="resize-left"></div>
                    <pre>${d}</pre>
                    <div class="sort" id="i${i}">&equiv;</div>
                    <div class="resize-right"></div>`; 
        } else {  // add sorter & left-side column resizer
            return `<div class="resize-left"></div>
                    <pre>${d}</pre>
                    <div class="sort" id="i${i}">&equiv;</div>`;
        }
    }
}
