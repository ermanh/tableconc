# TableConc
TableConc is a concordance search tool for tabular data. 

This web tool is intended for users who want to inspect or apply additional search conditions on other relevant data (in other columns of a table) in addition to the main data they want to analyze. 

## Supported Files
- .csv
- .tsv
- .txt (entire file treated as a single column)
- .json (must contain only one array of objects, non-string values will be stringified)

## Supported Functions
- Search
    - Apply search conditions on up to 3 different columns (logical AND)
    - Regular expressions
- Concordance and matched pattern display
    - Customize text and background highlight colors
    - Limit the length of the concordance display
- Filter
    - Filter a column by its values
    - Limit filter options by how many times the values occur
- Sort
    - Sort a column by ascending or descending order
    - Sort a concordance column by word position relative to the matched pattern
    - Sort the table by the original index in the file
- Other table functions
    - Select which columns to show
    - Adjust the width of data columns
    - Change text alignment
    - Customize the number of rows displayed
- Website display
    - Light/dark modes
    - Hide certain sections to increase data viewing space
    - Table header will stick to the top of the website when scrolled
