

const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
const dataPromise = d3.json(url);

let data = null;


function plotPersonsBarData(person_id, sortedOTUsBySampleValue){
    let sample_values = sortedOTUsBySampleValue.sample_values.slice(0,10).reverse();
    console.log(`sortedOTUsBySampleValue.otu_labels[0]: ${sortedOTUsBySampleValue.otu_labels[0]}`);
    let otu_ids = sortedOTUsBySampleValue.otu_ids.slice(0,10).map(item => 'OTU '.concat(item.toString())).reverse();
    let otu_labels = sortedOTUsBySampleValue.otu_labels.slice(0,10).reverse();

    let numOfSampleValues = sample_values.length;
    let trace = {
        x: sample_values,
        y: otu_ids,
        text: otu_labels,
        type: 'bar',
        orientation: 'h',
        width: .8
    };

    console.log(`sample_values.length: ${sample_values.length}`)
    let marginSize = 800;

    let layout ={
        title: `${person_id}'s Operational Taxonomic Units (OTU) Profile`,
        width: 800
    };

    Plotly.newPlot('bar', [trace], layout);

}


function plotPersonsBubbleChart(person_id, sortedOTUsBySampleValue){
    let sample_values = sortedOTUsBySampleValue.sample_values;
    console.log(`sortedOTUsBySampleValue.otu_labels[0]qq: ${sortedOTUsBySampleValue.otu_labels[0]}`);
    let otu_ids = sortedOTUsBySampleValue.otu_ids;
    let otu_labels = sortedOTUsBySampleValue.otu_labels;

    let numOfSampleValues = sample_values.length;
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

    console.log(`sample_values.length: ${sample_values.length}`)
    let marginSize = 800;

    let layout ={
        title: `${person_id}'s Operational Taxonomic Units (OTU) Profile`,
        xaxis: {
            title:{
                text: 'OTU'
            }
        },
        // width: 800
    };

    Plotly.newPlot('bubble', [trace], layout);

}


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


function sortOTUPopulationsBySampleValue(sample_values, otu_ids, otu_labels){
    // In order to keep the otu_id, its (the otu's) corresponding otu_label, and (the otu's) its corresponding 
    // sample_value together during the sorting of the sample_values, they have to be bound together before the
    // the sort.
    let listOfDicts = bindSampleValues_Otu_ids_Otu_labels(sample_values, otu_ids, otu_labels);

    // Sorting the bounded otu records by sample_value size.
    let sortedListOfDicts = listOfDicts.sort((firstOTU, secondOTU) => secondOTU.sample_value - firstOTU.sample_value);
    
    // Unbinding the otu records.
    let unboundUTORecords = unbindUTORecords(sortedListOfDicts);

    // // Quick sanity check printout of results.
    // console.log(`unboundUTORecords.sample_values[0]: ${unboundUTORecords.sample_values[0]}`);
    // console.log(`unboundUTORecords.otu_ids[0]: ${unboundUTORecords.otu_ids[0]}`);
    // console.log(`unboundUTORecords.otu_labels[0]: ${unboundUTORecords.otu_labels[0]}`);
    return unboundUTORecords;
}


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


function optionChanged(person_index){
    if (data != null){
        loadPersonsDemographicData(person_index);
        // console.log('hi');
        // console.log(`data1.names for 100th person: ${data.names[100]}`);
        // console.log('----------');
        let person_id = data.samples[person_index].id;
        // console.log(`person_id: ${person_id}`);
        // console.log(`data1.samples[person_index]: ${data1.samples[person_index]}`);

        let sample_values = data.samples[person_index].sample_values;
        let otu_ids = data.samples[person_index].otu_ids;
        let otu_labels = data.samples[person_index].otu_labels;
        let sortedOTUsBySampleValue = sortOTUPopulationsBySampleValue(sample_values, otu_ids, otu_labels);
        plotPersonsBarData(person_id, sortedOTUsBySampleValue);
        console.log('hi3');
        plotPersonsBubbleChart(person_id, sortedOTUsBySampleValue);
    }
}


dataPromise.then(function(data1){

    // Make a deep copy of the data ('data1') retrieved in the PromiseResults of 
    // .json(url) result ('dataPromise').
    data = structuredClone(data1);
    
    // // Quick printout-sanity-check
    // console.log(data1);
    // console.log(`data.names for 100th person: ${data1.names[100]}`);
    // console.log(`data.samples for 100th person: ${data1.samples[100].otu_labels[0]}`);
    // console.log(`data.metadata for 100th person: ${data1.metadata[100].age}`);


    function initialize(data){
    
        // Populate the the html Select Tag for the dropdown menu with person_ids as
        // the 'text' of the html-option-tag and corresponding index for the person's
        // record data as the 'value' for the html-option-tag.
        let dropDownMenu = d3.select('#selDataset');
        for (let i = 0; i < data1.names.length; i++){
            let option1 = dropDownMenu.append('option').text(data1.names[i]);
            option1.attr('value', i);
        }

        // Populate 'Demographic Info'
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



        // Create initial bar chart and bubble chart
        let sample_values = data.samples[0].sample_values;
        let otu_ids = data.samples[0].otu_ids;
        let otu_labels = data.samples[0].otu_labels;


        let sortedOTUsBySampleValue = sortOTUPopulationsBySampleValue(sample_values, otu_ids, otu_labels);
        plotPersonsBarData(data.samples[0].id, sortedOTUsBySampleValue);
        plotPersonsBubbleChart(data.samples[0].id, sortedOTUsBySampleValue);


    }

    initialize(data1);
});


  