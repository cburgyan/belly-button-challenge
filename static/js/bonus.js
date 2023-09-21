function plotPersonsGaugeWashFrequency(person_index1){
    //Get wash frequency from data
    let washFrequency = data.metadata[person_index1].wfreq;

    
    // Set constant values for defining gauge such as location, radians per step, angle offsets,
    // rgb color variations, and number of steps (9) that will be in gauge.
    const gaugeX = 150;
    const gaugeY = 190;
    const gaugeRadius = 110;
    const numberOfSteps = 9;
    const radiansPerStep = Math.PI / numberOfSteps;
    const angleOffset = radiansPerStep / 2;
    const colorHexRedList = ['f','e','c','a','8','6','4','2','0'];
    const colorHexBlueList = ['e','a','8','5','4','3','2','1','0'];
    const colorHexGreenList = ['f','f','e','e','d','d','c','c','b'];

    // Get canvas html tag
    let canvas = document.getElementById("gaugeCanvas");
    let ctx = canvas.getContext("2d");

    // Clear canvas of previous person's data
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //--------------------------------
    // Draw Gauge without needle
    const labelShiftX = -8;
    const labelShiftY = 5;
    for (let i = 0; i < numberOfSteps; i++){
        ctx.beginPath();
        ctx.arc(gaugeX, gaugeY, gaugeRadius,  Math.PI + i * radiansPerStep, Math.PI + (i + 1) * radiansPerStep);
        ctx.lineWidth = 60;
        ctx.strokeStyle = `#${colorHexRedList[i]}${colorHexGreenList[i]}${colorHexBlueList[i]}`;
        ctx.stroke();
        
        // Create labels on gauge
        ctx.font = "14px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText(`${i}-${i+1}`,
            (gaugeX + labelShiftX) + gaugeRadius * Math.cos(Math.PI + i * radiansPerStep + angleOffset), 
            (gaugeY + labelShiftY) +  gaugeRadius*Math.sin(Math.PI + i * radiansPerStep + angleOffset));
    }
    // Close path after drawing gauge bar
    ctx.closePath();

    //--------------------------------
    //Draw and Rotate Needle
    // The Needle will be a triangle
    // Here are the coordinates for the base of the triangle in terms of the gauge location where
    // it will be positioned.
    let x1 = gaugeX - 5;
    let y1 = gaugeY;
    let x2 = gaugeX + 5;
    let y2 = gaugeY;
    let needleColor = "#700";

    // Needle Base
    ctx.beginPath();
    ctx.arc(gaugeX, gaugeY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = needleColor;
    ctx.fill();
    ctx.closePath();


    // Midpoint of the base
    let midX = (x1 + x2) / 2;
    let midY = (y1 + y2) / 2;

    // Height of the triangle from the base to the apex
    let height = gaugeRadius;

    // Create variable to turn needle to point to 9 O'clock as a starting point
    let angleOffsetForStartPosition = - Math.PI / 2; 

    // Translate to midpoint
    ctx.translate(midX, midY);

    // Rotate the canvas
    let angleToRotate = angleOffsetForStartPosition +  washFrequency * radiansPerStep;
    ctx.rotate(angleToRotate);

    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(x1 - midX, y1 - midY);  // Bottom left corner
    ctx.lineTo(x2 - midX, y2 - midY);  // Bottom right corner
    ctx.lineTo(0, -height);  // Top corner
    ctx.closePath();

    // Fill triangle
    ctx.fillStyle = needleColor;
    ctx.fill();

    // Reset rotation and translation for later use
    ctx.rotate(-angleToRotate);
    ctx.translate(-midX, -midY);

    // Needle Gasket
    ctx.beginPath();
    ctx.arc(gaugeX, gaugeY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();

    // Needle Crown on top of needle gasket
    ctx.beginPath();
    ctx.arc(gaugeX, gaugeY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = needleColor;
    ctx.fill();
    ctx.closePath();


}