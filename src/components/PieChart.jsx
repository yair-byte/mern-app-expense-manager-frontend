import React, { useState, useEffect } from 'react';
import { RadialChart } from 'react-vis';

function PieChart({ gastosPorCategoria }) {

  const [data, setData] = useState([{}]);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const arr = new Array(gastosPorCategoria.length);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = { angle: gastosPorCategoria[i].porcentaje, color: gastosPorCategoria[i].color };
    }
    setData(arr);
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gastosPorCategoria, setScreenSize]);


  return (
    <RadialChart
      data={data}
      width={screenSize < 768 ? 300 : ((screenSize >= 768 && screenSize < 1440) ? 400 : 500)}
      height={screenSize < 768 ? 300 : ((screenSize >= 768 && screenSize < 1440) ? 400 : 500)}
      labelsAboveChildren={true}
      showLabels={true}
      colorType={'literal'}
      getColor={d => d.color}
    />
  );
}

export default PieChart;
