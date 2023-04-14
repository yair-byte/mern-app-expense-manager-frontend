import React, { useState, useEffect } from 'react';
import { XYPlot, VerticalBarSeries, XAxis, YAxis } from "react-vis";
import '../stylesheets/BarChart.css';

function BarChart(props) {

  const data = props.data;
  const [varr, setVarr] = useState(-70);
  const [varrX, setVarrX] = useState(-30);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    miFuncion(props.type);
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [props.type, setScreenSize]);

  function miFuncion(t) {
    let varrr = -70;
    let varrrX = -30;
    if (t === 'option1') {
      varrr = -40;
    } else if (t === 'option2') {
      varrr = -85;
    } else {
      varrr = -60;
    }
    if (screenSize >= 1440) {
      varrr -= 21;
      varrrX += 20;
    } else if (screenSize <= 768) {
      varrr += 5;
      varrrX += 12;
    } else {
      varrr -= 15;
      varrrX += 15;
    }
    setVarr(varrr);
    setVarrX(varrrX);
  }

  const formatXLabel = (text) => {
    return (
      <text transform="rotate(-70)" x={varr} y='10'>
        {text}
      </text>
    );
  };

  const formatYLabel = (text) => {
    return (
      <text y='15' x={varrX}>
        {text}$
      </text>
    );
  };

  return (
    <div className="bar-chart">
      <XYPlot xType="ordinal"
        width={screenSize < 768 ? 300 : ((screenSize >= 768 && screenSize < 1440) ? 400 : 500)}
        height={screenSize < 768 ? 300 : ((screenSize >= 768 && screenSize < 1440) ? 400 : 500)}
        margin={{ bottom: 100, left: 60 }}
      >
        <VerticalBarSeries data={data} color='#BC5E5E' />
        <XAxis tickFormat={formatXLabel} marginTop={10} />
        <YAxis tickFormat={formatYLabel} style={{ textAnchor: 'end' }} className="y-axis" />
      </XYPlot>
    </div>
  );
}

export default BarChart;
