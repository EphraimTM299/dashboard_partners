import React ,{useState, useEffect} from 'react';
import { Bar } from 'react-chartjs-2';
import{
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend

} from 'chart.js';
import { FiMousePointer } from 'react-icons/fi';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = () => {
    const [chartData, setChartData]= useState({
        datasets:[],
    });

    const [chartOptions, setChartOptions]= useState({});

    useEffect(()=>{
        setChartData({
            labels:['Mon', 'Tues','Wed','Thurs','Fri','Sat','Sun'],
            datasets:[
                {
                    label:'Sales R',
                    data:[18288,22333,19940,17980,24182,17847,22476],
                    borderColor: 'rgb(61,90,254)',
                    backgroundColor:'rgb(33,150,243, 0.5)',
                },
            ]
        })
        setChartOptions({
            plugins:{
                legend:{
                    position:'bottom',
                },
                title:{
                    display: true,
                    text:'Daily Revenue'
                }
            },
            maintainAspectRatio:false,
            responsive:true
        });
    }, [])
  return (
    <div className='w-full md:col-span-2 relative lg:h-[80vh] h-[50vh] m-auto p-4 border rounded-lg bg-white'>
      <Bar data={chartData} options={chartOptions}/>
    </div>
  )
}

export default BarChart
