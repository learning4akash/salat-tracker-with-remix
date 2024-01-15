import { redirect } from "@remix-run/node";
// import { isCookie } from "@remix-run/node";
export async function loader({ request }) {
    const coki  = request.headers.get('Cookie');
    if (coki) {
        return redirect("/tracker");
    }
    return redirect("/setting");
}