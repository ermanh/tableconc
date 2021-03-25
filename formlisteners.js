// Selecting "Contains Chinese" disables & deselects "Full word(s)"
const selectChinese = document.getElementById("chinese");
selectChinese.addEventListener('change', function() {
    const fullwords = document.getElementById("full-words");
    const fullwordsLabel = document.getElementById("full-words-label");
    if (this.checked) {
        fullwords.disabled = true;
        fullwordsLabel.style.color = "gray";
    } else {
        fullwords.disabled = false;
        fullwordsLabel.style = "none";
    }
});
