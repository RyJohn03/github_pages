// upon page load
d3.json("data/samples.json").then(function (data) {
    console.log(data);
  
    makeDropdown(data);
    makeMetadata(data, data.names[0]);
    makeBarChart(data, data.names[0]);
    makeBubbleChart(data, data.names[0]);
    makeGaugeChart(data, data.names[0]);
  });
  
  function optionChanged(val) {
    d3.json("data/samples.json").then(function (data) {
      console.log(data);
  
      makeMetadata(data, val);
      makeBarChart(data, val);
      makeBubbleChart(data, val);
      makeGaugeChart(data, val);
    });
  }
  
  // Dropdown Selector
  function makeDropdown(data) {
    for (let i = 0; i < data.names.length; i++){
      let name = data.names[i];
      d3.select("#selDataset").append("option").text(name);
    }
  }
  
  function makeMetadata(data, val) {
    console.log(val);
  
    // nuke parent data
    d3.select("#sample-metadata").html("");
  
    let meta = data.metadata.filter(x => x.id == val)[0];
    let keys = Object.keys(meta);
    for (let i = 0; i < keys.length; i++){
      let key = keys[i];
      d3.select("#sample-metadata").append("p").text(`${key}: ${meta[key]}`);
    }
  }
  
  // Bar Chart
  function makeBarChart(data, val) {
    let sample = data.samples.filter(x => x.id == val)[0];
  
    // Slice the first 10 objects for plotting
    let sample_values = sample.sample_values.slice(0, 10);
    let otu_labels = sample.otu_labels.slice(0, 10);
    let otu_ids = sample.otu_ids.slice(0, 10);
  
    // Reverse the array to accommodate Plotly's defaults
    sample_values.reverse();
    otu_labels.reverse();
    otu_ids.reverse();
  
    // Trace for the Bacteria ID Data
    let trace1 = {
      x: sample_values,
      y: otu_ids.map(x => `OTU: ${x}`),
      hovertext: otu_labels,
      type: 'bar',
      orientation: "h",
      marker: {color: '#445E93'}
    };
  
    // Data array
    let plotly_data = [trace1];
  
    // Apply a title to the layout
    let layout = {
      "title": `Bacteria for ID: ${val}`,
      "xaxis": {'title': "Number of Bacteria Found (in Operational Taxonomic Units)"}
    }
  
    // Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", plotly_data, layout);
  }
 
  // Bubble Chart
  function makeBubbleChart(data, val) {
    let sample = data.samples.filter(x => x.id == val)[0];
  
    // Get data
    let sample_values = sample.sample_values;
    let otu_labels = sample.otu_labels;
    let otu_ids = sample.otu_ids;
  
    // Trace for the Bacteria ID Data
    let trace1 = {
        x: otu_ids,
        y: sample_values,
        hovertext: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values,
          opacity: 1, 
          colorscale: 'Electric'
        }
    };
  
    // Data array
    let bubble_data = [trace1];
  
    // Apply a title to the layout
    let layout = {
      "title": `Bacteria for ID: ${val}`,
      "yaxis": {'title': "Number of Bacteria Found"},
      "xaxis": {'title': "OTU ID"},
    }
  
    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot('bubble', bubble_data, layout);
  }

    // Gauge chart
    function makeGaugeChart(data, val) {
      let meta = data.metadata.filter(x => x.id == val)[0];
      let wfreq = meta.wfreq;
  
      // get average wfreq
      let wfreq_avg = data.metadata.map(x => x.wfreq).reduce((a, b) => a + b, 0) / data.metadata.length;
  
      let trace1 = {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "" },
        type: "indicator",
        mode: "gauge+number+delta",
        delta: { reference: wfreq_avg.toFixed(0), increasing: {color: "#445E93"}, decreasing: {color: "#445E93"}},
        gauge: {
          axis: { range: [0, 10] },
          bar: {color: "#295135"},
          steps: [
            { range: [0, 5], color: "#846075" },
            { range: [5, 7], color: "#472836" }
          ],
          threshold: {
            line: { color: "#445E93", width: 4 },
            thickness: 0.75,
            value: 9.75
          }
        }
      } 
       // Data array
      let gauge_data = [trace1]; 
  
      // Apply a title to the layout
      let layout = {
        "title": `<b>Belly Button Washing Frequency for ID: ${val}<b> <br> Scrubs per Week vs Average`,
      }  
      Plotly.newPlot('gauge', gauge_data, layout);
    }