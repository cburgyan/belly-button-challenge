

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
        // margins:{
        //     l: marginSize,
        //     r: marginSize,
        //     t: marginSize,
        //     b: marginSize
        // },

        // height: numOfSampleValues * 50,
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
            color: otu_ids,
            size: sample_values
        }
        // orientation: 'h',
        // width: .8
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
        // margins:{
        //     l: marginSize,
        //     r: marginSize,
        //     t: marginSize,
        //     b: marginSize
        // },

        // height: numOfSampleValues * 50,
        width: 800
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
        // console.log(`sample_values[i]: ${sample_values[i]}`);
        // console.log(`otu_ids[i]: ${otu_ids[i]}`);
        // console.log(`otu_labels[i]: ${otu_labels[i]}`);
        // break;

        listDict.push(dict);
    }
    // console.log(`listDict[0].sample_value: ${listDict[0].sample_value}`);
    // console.log(`listDict[0].otu_id: ${listDict[0].otu_id}`);
    // console.log(`listDict[0].otu_label: ${listDict[0].otu_label}`);
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

    let listOfDicts = bindSampleValues_Otu_ids_Otu_labels(sample_values, otu_ids, otu_labels);
    let sortedListOfDicts = listOfDicts.sort((firstOTU, secondOTU) => secondOTU.sample_value - firstOTU.sample_value);
    
    // console.log(`sortedListOfDicts[0].sample_value: ${sortedListOfDicts[0].sample_value}`);
    // console.log(`sortedListOfDicts[0].otu_id: ${sortedListOfDicts[0].otu_id}`);
    // console.log(`sortedListOfDicts[0].otu_label: ${sortedListOfDicts[0].otu_label}`);
    let unbindedUTORecords = unbindUTORecords(sortedListOfDicts);
    console.log(`unbindedUTORecords.sample_values[0]: ${unbindedUTORecords.sample_values[0]}`);
    console.log(`unbindedUTORecords.otu_ids[0]: ${unbindedUTORecords.otu_ids[0]}`);
    console.log(`unbindedUTORecords.otu_labels[0]: ${unbindedUTORecords.otu_labels[0]}`);
    return unbindedUTORecords;
}


function optionChanged(person_index){
    if (data != null){
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
    console.log(data1);
    console.log(`data.names for 100th person: ${data1.names[100]}`);
    console.log(`data.samples for 100th person: ${data1.samples[100].otu_labels[0]}`);
    console.log(`data.metadata for 100th person: ${data1.metadata[100].age}`);
    
    // Populate the the html Select Tag for the dropdown menu with person_ids as
    // the 'text' of the html-option-tag and corresponding index for the person's
    // record data as the 'value' for the html-option-tag.
    let dropDownMenu = d3.select('#selDataset');
    for (let i = 0; i < data1.names.length; i++){
        let option1 = dropDownMenu.append('option').text(data1.names[i]);
        option1.attr('value', i);
    }


    function initialize(data){

        let sample_values = data.samples[0].sample_values;
        let otu_ids = data.samples[0].otu_ids;
        let otu_labels = data.samples[0].otu_labels;


        let sortedOTUsBySampleValue = sortOTUPopulationsBySampleValue(sample_values, otu_ids, otu_labels);
        plotPersonsBarData(data.samples[0].id, sortedOTUsBySampleValue);
        plotPersonsBubbleChart(data.samples[0].id, sortedOTUsBySampleValue)
    }

    initialize(data1);
});


  