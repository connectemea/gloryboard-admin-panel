

import React from 'react'

function LeaderBoard({ data }) {


    const calculateTotalPoints = (data) => {
        const totalPoints = {};

        data.forEach((item) => {
            Object.keys(item).forEach((key) => {
                if (key !== "event_name") {
                    totalPoints[key] = (totalPoints[key] || 0) + item[key];
                }
            });
        });

        // Transform the result into the required format
        return Object.entries(totalPoints)
        .sort((a, b) => b[1] - a[1]) // Sort by points (value) in descending order
        .map(([team, points]) => ({ [team]: points }));
    };

 
    const TotalPoints = calculateTotalPoints(data);

    return ( 
        <div className='flex lg:flex-row flex-col gap-3 w-full pb-6 px-2 lg:px-0'>
            {TotalPoints.map((item, index) => (
                <div key={index} className='flex justify-between border p-2 rounded lg:w-1/4' >
                    <span className='font-bold text-primary' >{index+1}</span>
                    <h6 className='font-bold uppercase text-lg' >{Object.keys(item)}</h6>
                    <span>{Object.values(item)}pts</span>
                </div>
            ))}
        </div>
    )
}

export default LeaderBoard