# belly-button-challenge

---
 ### Karoly Burygan
---
## Sources:
<ol>
    <li>
        "The Best Way to Deep Copy Objects or Arrays in JavaScript - structuredClone()". dcode. Sept. 7, 2022. https://www.youtube.com/watch?v=LnBxD1aXw7I&t=330s 
        <ul>
            <li>
                Used in app.js line 229 here: 
                
                data = structuredClone(data1);
<br>
            </li>
        </ul>
   </li>
   <li>
        "Styling Markers in JavaScript". Plotly.com. n.d. https://plotly.com/javascript/marker-style/
        <ul>
            <li>
                Used in app.js line 70 here: 
                
                color: otu_ids.map(item => `rgb(
                    ${item % 256}, 
                    ${Math.floor(item / 2) % 256}, 
                    ${Math.floor(item / 3) % 256})`),
<br>
            </li>
        </ul>
   </li>
   <li>
        "JavaScript String concat()". Refsnes Data. n.d. https://www.w3schools.com/jsref/jsref_concat_string.asp
        <ul>
            <li>
                Used in app.js line 18 here: 
                
                let otu_ids = sortedOTUsBySampleValue.otu_ids.
                    slice(0,10).map(item => 'OTU '.concat(
                        item.toString())).reverse();
<br>
            </li>
        </ul>
   </li>
   <li>
        "JavaScript NUmber toString()". Refsnes Data. n.d. https://www.w3schools.com/jsref/jsref_tostring_number.asp
        <ul>
            <li>
                Used in app.js line 18 here: 
                
                let otu_ids = sortedOTUsBySampleValue.otu_ids.
                    slice(0,10).map(item => 'OTU '.concat(
                        item.toString())).reverse();
<br>
            </li>
        </ul>
   </li>

</ol>