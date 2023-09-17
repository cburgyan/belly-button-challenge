

const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
const dataPromise = d3.json(url);

dataPromise.then(function(data){
    console.log(data);
    console.log(`data.names for 100th person: ${data.names[100]}`);
    console.log(`data.samples for 100th person: ${data.samples[100].otu_labels[0]}`);
    console.log(`data.metadata for 100th person: ${data.metadata[100].age}`);
});


  