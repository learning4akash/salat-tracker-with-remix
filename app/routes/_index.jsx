import { redirect } from "@remix-run/node";
export async function loader({ request }) {
    const getCookie  = request.headers.get('Cookie');
    if (getCookie) {
        return redirect("/tracker");
    }
    return redirect("/setting");
}