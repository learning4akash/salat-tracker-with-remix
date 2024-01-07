import React from 'react';
import {  Flex, Checkbox } from 'antd';
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useState, useEffect } from 'react';
import moment from 'moment';
import { getUserData, getPrayersData, getPersistentPrayerData, storePersistentPrayerData } from '../module/db';
import { json } from '@remix-run/node'
export const loader = async ({ params }) => {
  console.log('hello');
  console.log(params);
}
const justifyOptions = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
];

const alignOptions = ['flex-start', 'center', 'flex-end'];

const GLOBAL_DATE_FORMAT = 'YYYY-MM-DD';      
const App = () => {
  const [justify, setJustify] = React.useState(justifyOptions[3]);
  const [alignItems, setAlignItems] = React.useState(alignOptions[1]);
  const [date, setDate] = useState(moment().format(GLOBAL_DATE_FORMAT));
  const [currentDataPersistentIndex, setCurrentDatePersistentIndex] = useState(-1);
  const [dateLabel, setDateLabel]= useState(new Date().toLocaleDateString("en-GB", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }))
  const [data, setData] = useState([]); 
  const [timings, setTimings] = useState([]);
  const [loading, setLoading] = useState(false);
  const prepareTimings = (prayerData, persistentData) => {
    const modifiedData = moment(date).format('DD');
    const current      = prayerData[modifiedData - 1];

  const _timings = [];
  const excludedTimingKeys = ['Sunrise', 'Sunset', 'Imsak', 'Midnight', 'Lastthird', 'Firstthird'];
  for(var key in current.timings) {
      const id = _timings.length + 1;
    if (excludedTimingKeys.indexOf(key) == -1) {
      _timings.push({
        id: id,
        label: key,
        time: current.timings[key],
        isCompleted: persistentData?.timings?.find(timing => key === timing.label)?.isCompleted ?? false, 
      })
    }
  }
  setTimings(_timings);
  setDateLabel(current.date.readable);
  }
  useEffect(() => {
    if (!data.length) {
      const { data: prayerData } = getPrayersData();
      const persistentData       = getPersistentPrayerData() ?? [];
      const currentDateIndex     = persistentData?.findIndex(data => date == data?.date);
      let persistentResult = {};
      if (currentDateIndex > -1) {
        setCurrentDatePersistentIndex(currentDateIndex);
        persistentResult = persistentData[currentDateIndex];
      }
      setData(prayerData);
      prepareTimings(prayerData, persistentResult);
    }
  }, []);

  useEffect(() => {
    if (data.length) {
      const persistentData = getPersistentPrayerData() ?? [];
      const currentDateIndex = persistentData?.findIndex(data => date == data?.date);
      let persistentResult = {};
      if (currentDateIndex > -1) {
        setCurrentDatePersistentIndex(currentDateIndex);
        persistentResult = persistentData[currentDateIndex];
      } else {
        setCurrentDatePersistentIndex(-1);
      }
      prepareTimings(data, persistentResult);
    }
  }, [date]);

  const handleCompleteSalat = (index) => {
    const timing = {...timings[index]};
    timing.isCompleted = !timing.isCompleted;
    timings[index] = timing; 
    const persistentData = getPersistentPrayerData() ?? [];
    if (currentDataPersistentIndex > -1) {
      const data = persistentData[currentDataPersistentIndex];
      const prayerIndex = data.timings.findIndex(timing => timing.label == timings[index].label);
      if (prayerIndex > -1) {
        data.timings[prayerIndex].isCompleted = timings[index].isCompleted;
      } else {
        data.timings.push(timings[index]);
      }
      persistentData[currentDataPersistentIndex] = data;
    } else {
      persistentData.push({
        date: date,
        timings: [
          timings[index]
        ]
      });
      setCurrentDatePersistentIndex(persistentData.length - 1);
    }  
    // localStorage.setItem('persistent_prayer', JSON.stringify(persistentData));
    storePersistentPrayerData(persistentData);
    setTimings([...timings]);
  }
//   <FaAngleLeft style={{ width: "30px", height: "30px", marginLeft: "50px", cursor:"pointer"}}/><FaAngleRight style={{ width: "30px", height: "30px", marginLeft:"100px", cursor:"pointer"}} />
  return (
    <div className='today'>
        <Flex gap="middle" align="start" vertical>    
                <Flex className='iconStyle' justify={justify} align={alignItems}>
                    <p onClick={() => {
                      setDate(moment(date).subtract(1, 'days').format(GLOBAL_DATE_FORMAT))
                    }} ></p>
                    <p style={{ fontWeight: "bold", marginLeft:"120px"}}>{dateLabel}</p>
                    <p onClick={() => {
                      setDate(moment(date).add(1, 'days').format(GLOBAL_DATE_FORMAT))
                    }}></p>
                </Flex>
              {timings?.map((timing, index) => (
                <Flex key={timing.id}  className='boxStyle' justify={justify} align={alignItems}>
                        <li>{timing.label}</li>
                        <li>{timing.time}</li>
                        <li>{ date > moment().format(GLOBAL_DATE_FORMAT) || date < moment().format(GLOBAL_DATE_FORMAT) ? <Checkbox onChange={() => handleCompleteSalat(index)} disabled  checked={timing.isCompleted}></Checkbox> : <Checkbox onChange={() => handleCompleteSalat(index)}  checked={timing.isCompleted}></Checkbox>}</li>    
                </Flex>
              
              )) }  
            
    </Flex> 
    </div>    
  );
};
export default App;