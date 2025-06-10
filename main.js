 "use strict";
    // TAB NAVIGATION
    function openTab(evt, tabName) {
      const tabcontents = document.getElementsByClassName("tabcontent");
      for (let i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = "none";
        tabcontents[i].classList.remove("active");
      }
      const tablinks = document.getElementsByClassName("tablinks");
      for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
      }
      document.getElementById(tabName).style.display = "block";
      document.getElementById(tabName).classList.add("active");
      evt.currentTarget.classList.add("active");
    }
    document.getElementById("defaultTab").click();

    /* ----- SLIDE RULE CALCULATOR FUNCTIONS ----- */
    function calculateSlideRule() {
      const op = document.getElementById("operationMode").value;
      const a = parseFloat(document.getElementById("numberA").value);
      const b = parseFloat(document.getElementById("numberB").value);
      const resultDiv = document.getElementById("srResult");
      if (isNaN(a) || isNaN(b) || a < 1 || a > 10 || b < 1 || b > 10) {
        resultDiv.innerHTML = "<p>Please enter valid numbers between 1 and 10 for A and B.</p>";
        return;
      }
      let computed;
      if (op === "multiply") {
        computed = a * b;
        resultDiv.innerHTML = `<p>${a} × ${b} = ${computed}</p>`;
      } else if (op === "divide") {
        computed = a / b;
        resultDiv.innerHTML = `<p>${a} ÷ ${b} = ${computed.toFixed(4)}</p>`;
      }
      drawSlideRule(op, a, b);
    }

    // Draw the slide rule diagram on the canvas
    function drawSlideRule(operation, a, b) {
      const canvas = document.getElementById("slideCanvas");
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Define margins and factor for logarithmic scale:
      const margin = 40;
      const effectiveWidth = canvas.width - 2 * margin;
      // Scale factor: position = margin + log10(x) * effectiveWidth  (since log10(10) = 1)
      
      // Function to get x-position for a value x in [1,10]
      function pos(x) {
        return margin + Math.log10(x) * effectiveWidth;
      }
      
      // Draw Fixed Scale (at y = 80)
      const yFixed = 80;
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(margin, yFixed);
      ctx.lineTo(canvas.width - margin, yFixed);
      ctx.stroke();
      // Draw markings for numbers 1 to 10 on fixed scale
      ctx.fillStyle = "#333";
      ctx.font = "12px Arial";
      for (let n = 1; n <= 10; n++) {
        const x = pos(n);
        ctx.beginPath();
        ctx.moveTo(x, yFixed - 10);
        ctx.lineTo(x, yFixed + 10);
        ctx.stroke();
        ctx.fillText(n, x - 4, yFixed + 25);
      }
      
      // Draw Sliding Scale (at y = 180)
      const ySlide = 180;
      // For multiplication:
      // Align "1" on sliding scale with value a on fixed scale. Thus, the sliding scale is shifted by shift = pos(a) - pos(1) = pos(a) - margin.
      // For division:
      // Align value b on sliding scale with value a on fixed scale. So slide shift = pos(a) - pos(b).
      let shift;
      if (operation === "multiply") {
        shift = pos(a) - margin;
      } else if (operation === "divide") {
        shift = pos(a) - pos(b);
      }
      ctx.strokeStyle = "#007BFF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(margin + shift, ySlide);
      ctx.lineTo(canvas.width - margin + shift, ySlide);
      ctx.stroke();
      // Draw markings on sliding scale from 1 to 10
      ctx.fillStyle = "#007BFF";
      for (let n = 1; n <= 10; n++) {
        const x = pos(n) + shift;
        ctx.beginPath();
        ctx.moveTo(x, ySlide - 10);
        ctx.lineTo(x, ySlide + 10);
        ctx.stroke();
        ctx.fillText(n, x - 4, ySlide + 25);
      }
      
      // Draw Cursor Vertical Line indicating the reading.
      // For multiplication, we read at the sliding scale for number b:
      // Reading position = pos(b) + shift on fixed scale, result = 10^(((pos(b)+shift - margin)/effectiveWidth))
      // For division, we read the value at the sliding scale "1":  x = margin + shift on fixed scale.
      let xRead;
      if (operation === "multiply") {
        xRead = pos(b) + shift;
      } else if (operation === "divide") {
        xRead = margin + shift;
      }
      // Draw vertical line on fixed scale (color red)
      ctx.strokeStyle = "#FF5722";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xRead, yFixed - 30);
      ctx.lineTo(xRead, yFixed + 30);
      ctx.stroke();
      // Annotate result on fixed scale.
      let reading = Math.pow(10, ((xRead - margin) / effectiveWidth));
      // Due to logarithmic arithmetic, reading should equal a*b for multiplication and a/b for division.
      // We'll round a little.
      reading = (operation === "multiply") ? (a * b) : (a / b);
      ctx.fillStyle = "#FF5722";
      ctx.font = "14px Arial";
      ctx.fillText("Result: " + reading.toFixed(4), xRead - 30, yFixed - 40);
    }

    // Reset function: clear inputs and canvas.
    function resetSlideRule() {
      document.getElementById("numberA").value = "";
      document.getElementById("numberB").value = "";
      document.getElementById("srResult").innerHTML = "";
      const canvas = document.getElementById("slideCanvas");
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
