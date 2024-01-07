import { json } from '@remix-run/node';
import {getPrayerTimeData} from '../module/api';

export const loader = async ({ params }) => {
    console.log('hello',params.prayerTime);
    return json({
        getPrayerTimeData: await getPrayerTimeData(params.prayerTime),
    })
}

export default function Api () {
    return (
        <h1>Hello World</h1>
    )
}

