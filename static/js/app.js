// Belly Button Biodiversity Dashboard -- An Essential File (app.js)

// URL to retrieve OTU data
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Retrieve 'sample.json' from 'url' using d3.json
const dataPromise = d3.json(url);

// Global variable to hold a deep copy of retrieved data
let data = null;


// Function to create bar chart of top 10 most common OTUs for the person with id 'person_id'
function plotPersonsBarData(person_id, sortedOTUsBySampleValue){
    
    // Save top 10 most common OTU sample values, otu ids, and otu labels to 'sample_values', 'otu_ids',
    // and 'otu_labels', respectively
    let sample_values = sortedOTUsBySampleValue.sample_values.slice(0,10).reverse();
    let otu_ids = sortedOTUsBySampleValue.otu_ids.slice(0,10).map(item => 'OTU '.concat(item.toString())).reverse();
    let otu_labels = sortedOTUsBySampleValue.otu_labels.slice(0,10).reverse();

    // Plot sample values (x-axis) by otu ids (y-axis) in a horizontal bar chart
    let trace = {
        x: sample_values,
        y: otu_ids,
        text: otu_labels,
        type: 'bar',
        orientation: 'h',
        width: .8
    };

    // Layout for the bar chart
    let layout ={
        title: `${person_id}'s Operational Taxonomic Units (OTUs) Profile`,
        width: 450,
        xaxis: {
            title:{
                text: 'OTU Population'
            }
        },
        yaxis: {
            title:{
                text: 'OTU ID'
            }
        },
    };

    // Plotting the bar chart
    Plotly.newPlot('bar', [trace], layout);

}


// Function to create bubble chart of all OTUs for the person with id 'person_id'
function plotPersonsBubbleChart(person_id, sortedOTUsBySampleValue){
    
    // Save all OTU sample values, otu ids, and otu labels to 'sample_values', 'otu_ids',
    // and 'otu_labels', respectively
    let sample_values = sortedOTUsBySampleValue.sample_values;
    let otu_ids = sortedOTUsBySampleValue.otu_ids;
    let otu_labels = sortedOTUsBySampleValue.otu_labels;

    // Plot sample values (x-axis) by otu ids (y-axis) in a horizontal bar chart
    let trace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        type: 'scatter',
        mode: 'markers',
        marker: {
            // NOTE: the rgb function along with dividing the otu_id by a factor of 1, 2, or 3 was done to make the 
            // bubble chart more colorful.
            color: otu_ids.map(item => `rgb(${item % 256}, ${Math.floor(item / 2) % 256}, ${Math.floor(item / 3) % 256})`),
            size: sample_values
        }
    };

    // Layout for bubble chart
    let layout ={
        title: `${person_id}'s Operational Taxonomic Units (OTUs) Profile`,
        xaxis: {
            title:{
                text: 'OTU ID'
            }
        },
        yaxis: {
            title:{
                text: 'OTU Population'
            }
        },
    };

    // Ploting the bubble chart
    Plotly.newPlot('bubble', [trace], layout);

}


// Function to pack up each OTU's id (an element of 'otu_ids'), sample value (an element of 
// 'sample_values') and label (an element of 'otu_labels') so that their correspondence to 
// each other is maintained in a dictionary structure and not just by their commonly shared
// index (because the index of the sample value may change when it is sorted).
function bindSampleValues_Otu_ids_Otu_labels(sample_values, otu_ids, otu_labels){
    let listDict = [];
    for (let i = 0; i < sample_values.length; i++){
        let dict = {
            'sample_value': sample_values[i],
            'otu_id': otu_ids[i],
            'otu_label': otu_labels[i]
        };

        listDict.push(dict);
    }
    return listDict;
}


// Function to reestablish array structures for the sample values (into 'sample_values'), 
// the uto ids (into 'uto_ids'), and the uto labels (into 'uto_labels') for the purpose of
// using those arrays as the x values, y values, and text values in the bar chart to come.
// This function returns a dictionary of the lists "sample_values", "otu_ids", and 
// "otu_labels" where an index q in each list corresponds to the different associations
// of that particular OTU (-- assuming 0 <= q < sample_values.length).
function unbindUTORecords(sortedListOfDicts){
    let sample_values = [];
    let otu_ids = [];
    let otu_labels = [];

    for (let i = 0; i < sortedListOfDicts.length; i++){
        sample_values.push(sortedListOfDicts[i].sample_value);
        otu_ids.push(sortedListOfDicts[i].otu_id);
        otu_labels.push(sortedListOfDicts[i].otu_label);
    }

    return {'sample_values': sample_values, 'otu_ids':otu_ids,'otu_labels':otu_labels};
}


// Function to sort OTUs by sample value of the OTU
function sortOTUPopulationsBySampleValue(sample_values, otu_ids, otu_labels){
    // In order to keep the otu_id, its (otu's) corresponding otu_label, and its (otu's) corresponding 
    // sample_value together during the sorting of the sample_values, they have to be bound together before the
    // the sort-->bindSampleValues_Otu_ids_Otu_labels binds them together.
    let listOfDicts = bindSampleValues_Otu_ids_Otu_labels(sample_values, otu_ids, otu_labels);

    // Sorting the bounded otu records by sample_value size.
    let sortedListOfDicts = listOfDicts.sort((firstOTU, secondOTU) => secondOTU.sample_value - firstOTU.sample_value);
    
    // Unbinding the otu records-->unbindUTORecords unbinds UTO records in preparation for plotting the sorted data.
    let unboundUTORecords = unbindUTORecords(sortedListOfDicts);

    return unboundUTORecords;
}


// Function to update the 'Demographic Info' when a new person is selected from the dropdown menu
function loadPersonsDemographicData(person_index1){
    // Grab each demographic field by its corresponding html tag id and update its 'text'
    d3.select('#demoId').text(`id: ${data.names[person_index1]}`);
    d3.select('#demoEthnicity').text(`ethnicity: ${data.metadata[person_index1].ethnicity}`);
    d3.select('#demoGender').text(`gender: ${data.metadata[person_index1].gender}`);
    d3.select('#demoAge').text(`age: ${data.metadata[person_index1].age}`);
    d3.select('#demoLocation').text(`location: ${data.metadata[person_index1].location}`);
    d3.select('#demoBbtype').text(`bbtype: ${data.metadata[person_index1].bbtype}`);
    d3.select('#demoWfreq').text(`wfreq: ${data.metadata[person_index1].wfreq}`);
}


// Fucntion to be called every time a new id is selected from the dropdown menu. When this funciton
// is called it executes the process that displays the data for the new person selected.
function optionChanged(person_index){
    if (data != null){
        // Initialize variables to pass to the following functions
        let person_id = data.samples[person_index].id;
        let sample_values = data.samples[person_index].sample_values;
        let otu_ids = data.samples[person_index].otu_ids;
        let otu_labels = data.samples[person_index].otu_labels;
        
        // Load 'Demographic Info'
        loadPersonsDemographicData(person_index);
        let sortedOTUsBySampleValue = sortOTUPopulationsBySampleValue(sample_values, otu_ids, otu_labels);
        plotPersonsBarData(person_id, sortedOTUsBySampleValue);
        plotPersonsBubbleChart(person_id, sortedOTUsBySampleValue);
        plotPersonsGaugeWashFrequency(person_index);
    }
}


// Store the OTU data and initialize the .html file with new tags and values from the data.
dataPromise.then(function(data1){

    // Make a deep copy of the data ('data1') retrieved in the PromiseResults of 
    // .json(url) result ('dataPromise').
    data = structuredClone(data1);

    // Quick printout-sanity-check
    console.log(data1);


    // Function to 1) insert html tags for the the "Test Subject ID No.:" dropdown menu, "Demographic Info" div, 
    // and the "gauge" div and 2) populate those newly inserted tags along with the "bar" and "bubble" divs with
    // the data corresponding to the initial default person's OTU and metadata (the default person being the
    // one listed first in the "Test Subject ID No." dropdown menu).
    function initialize(){
    
        // Populate the the html Select Tag for the dropdown menu with person_ids as
        // the 'text' of the html-option-tag and corresponding index for the person's
        // record data as the 'value' for the html-option-tag.
        let dropDownMenu = d3.select('#selDataset');
        for (let i = 0; i < data1.names.length; i++){
            let option1 = dropDownMenu.append('option').text(data1.names[i]);
            option1.attr('value', i);
        }

        // Populate 'Demographic Info' for first time including creation and insertion of
        // the html tags that will contain the populating info. And give the newly inserted
        // html tags unique ids to be referred to later when the 'Demographic Info' needs
        // to be updated (the 'Demographic Info' is initially populated with the "id",
        // "ethnicity", "gender", "age", "location", "bbtype", and "wfreq" of the first
        // person listed in the dropdown menu labeled "Test Subject ID No.:").
        let demographicDiv = d3.select('#sample-metadata');
        let idDemo = demographicDiv.append('p').text(`id: ${data1.names[0]}`);
        idDemo.attr('id','demoId');
        idDemo = demographicDiv.append('p').text(`ethnicity: ${data1.metadata[0].ethnicity}`);
        idDemo.attr('id','demoEthnicity');
        idDemo = demographicDiv.append('p').text(`gender: ${data1.metadata[0].gender}`);
        idDemo.attr('id','demoGender');
        idDemo = demographicDiv.append('p').text(`age: ${data1.metadata[0].age}`);
        idDemo.attr('id','demoAge');
        idDemo = demographicDiv.append('p').text(`location: ${data1.metadata[0].location}`);
        idDemo.attr('id','demoLocation');
        idDemo = demographicDiv.append('p').text(`bbtype: ${data1.metadata[0].bbtype}`);
        idDemo.attr('id','demoBbtype');
        idDemo = demographicDiv.append('p').text(`wfreq: ${data1.metadata[0].wfreq}`);
        idDemo.attr('id','demoWfreq');


        // Create canvas html tag to draw gauge on (NOTE: Plotly was NOT used for this gauge)
        let gaugeDiv = d3.select('#gauge')
        let centerGaugeComponentsTag = gaugeDiv.append('center');
        centerGaugeComponentsTag.attr('style', "margin-left: 100px;");

        // Add a paragraph tag to hold the main title for the gauge
        let gaugeTitleTag = centerGaugeComponentsTag.append('p');
        gaugeTitleTag.attr('id', 'gaugeTitle');
        gaugeTitleTag.attr('style', "font-size: 18px; text-align:center; position: relative; top: 50px; margin-bottom: 0px;");
        gaugeTitleTag.text('Belly Button Washing Frequency');

        // Add a paragraph tag to hold the subtitle for the gauge
        let guageSubtitleTag = centerGaugeComponentsTag.append('p');
        guageSubtitleTag.attr('id', 'gaugeTitle');
        guageSubtitleTag.attr('style', "font-size: 14px; text-align:center; position: relative; top: 50px;");
        guageSubtitleTag.text('Scrubs Per Week');
        
        // Add a canvas tag to draw the gauge and its needle upon
        let gaugeCanvasTag = centerGaugeComponentsTag.append('canvas');
        gaugeCanvasTag.attr('id', 'gaugeCanvas');
        gaugeCanvasTag.attr('width', '300');
        gaugeCanvasTag.attr('height','300');


        // Create initial bar chart and bubble chart for the initially listed person id in the
        // dropdown menu corresponding to person_index equal to '0'.
        let sample_values = data.samples[0].sample_values;
        let otu_ids = data.samples[0].otu_ids;
        let otu_labels = data.samples[0].otu_labels;

        // Sort the sample values for person corresponding to person_index equal to '0'
        let sortedOTUsBySampleValue = sortOTUPopulationsBySampleValue(sample_values, otu_ids, otu_labels);

        // Plot the person_index-0's bar chart and bubble chart.
        plotPersonsBarData(data.samples[0].id, sortedOTUsBySampleValue);
        plotPersonsBubbleChart(data.samples[0].id, sortedOTUsBySampleValue);
        plotPersonsGaugeWashFrequency(0)

    }


    // The Function initialize() is called to setup and populate the "Test Subject ID No.:" menu,
    // the "Demographic Info" div, "bar" div, "gauge" div, and the "bubble" div.
    initialize();
});


  