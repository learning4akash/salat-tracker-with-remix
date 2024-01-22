export async function validationAction({request, schema}) {
 const body  = await request.json();
 console.log({body});
 try {
   const formData = schema.parse(body);
   console.log("validationAction", {formData});
   return { formData, errors: null}
 } catch (error) {
    console.log("ZodError", {error})
    return {formData: body, errors: error.issues.reduce((acc, curr) => {
      const key = curr.path[0];
      acc[key]  = curr.message;
      return acc;
    }, {})};
 }
}