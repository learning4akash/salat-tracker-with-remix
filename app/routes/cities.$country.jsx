import { json } from '@remix-run/node';
import { City } from 'country-state-city';
// import invariant from "tiny-invariant";
export const loader = async ({ params }) => {
    // invariant(params.country, "Missing country param");
    const cities = City.getCitiesOfCountry(params.country);
    if (!cities) throw new Response("", { status: 404 });
    return json(cities)
}