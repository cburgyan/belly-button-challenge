

const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
const dataPromise = d3.json(url);



function plotPersonsBarData(person_id, sortedOTUsBySampleValue){
    let sample_values = sortedOTUsBySampleValue.sample_values.slice(0,10).reverse();
    console.log(`sortedOTUsBySampleValue.otu_labels[0]: ${sortedOTUsBySampleValue.otu_labels[0]}`);
    let otu_ids = sortedOTUsBySampleValue.otu_ids.slice(0,10).map(item => 'OTU '.concat(item.toString())).reverse();
    let otu_labels = sortedOTUsBySampleValue.otu_labels.slice(0,10).reverse();
    let trace = {
        x: sample_values,
        y: otu_ids,
        text: otu_labels,
        type: 'bar',
        orientation: 'h'
    };

    let marginSize = 800;

    let layout ={
        title: `${person_id}'s Operational Taxonomic Units (OTU) Profile`,
        margins:{
            l: marginSize,
            r: marginSize,
            t: marginSize,
            b: marginSize
        },

        height: 600,
        width: 800
    };

    Plotly.newPlot('bar', [trace], layout);

}


dataPromise.then(function(data){
    console.log(data);
    console.log(`data.names for 100th person: ${data.names[100]}`);
    console.log(`data.samples for 100th person: ${data.samples[100].otu_labels[0]}`);
    console.log(`data.metadata for 100th person: ${data.metadata[100].age}`);
    let dropDownMenu = d3.select('#selDataset');
    // console.log(dropDown);
    // let selection = d3.select("body");
  
    // // Creating and appending
    // // a div to the body
    // selection.append(d3.creator("div"));
    // let div = document.querySelector("div");
      
    // div.innerText = "Div tag created using d3.creator()";

    // Populate the the html Select Tag for the dropdown menu with person ids
    // and corresponding index for each person's "value" for the html option
    // tag that is created.
    for (let i = 0; i < data.names.length; i++){
        let option1 = dropDownMenu.append('option').text(data.names[i]);
        option1.attr('value', i);
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

    function createBarChart(){
        let dropDownMenu1 = d3.select('#selDataset');
        
        // console.log(`dropDownMenu1.property('value'): ${dropDownMenu1.property('value')}`);

        let person_index = dropDownMenu1.property('value');
        console.log(`person_index: ${person_index}`);
        let person_id = data.samples[person_index].id;
        console.log(`person_id: ${person_id}`);
        // console.log(`data.samples[person_index]: ${data.samples[person_index]}`);

        let sample_values = data.samples[person_index].sample_values;
        let otu_ids = data.samples[person_index].otu_ids;
        let otu_labels = data.samples[person_index].otu_labels;
        let sortedOTUsBySampleValue = sortOTUPopulationsBySampleValue(sample_values, otu_ids, otu_labels);
        plotPersonsBarData(person_id, sortedOTUsBySampleValue);
    }


    function initialize(data){

        let sample_values = data.samples[0].sample_values;
        let otu_ids = data.samples[0].otu_ids;
        let otu_labels = data.samples[0].otu_labels;


        let sortedOTUsBySampleValue = sortOTUPopulationsBySampleValue(sample_values, otu_ids, otu_labels);
        plotPersonsBarData(data.samples[0].id, sortedOTUsBySampleValue);
    }

    initialize(data);

    dropDownMenu.on('change', createBarChart, data);
});


  