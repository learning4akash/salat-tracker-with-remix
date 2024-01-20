export async function validationAction({request, schema}) {
 const body  = Object.fromEntries(await request.formData());
 try {
   const formData = schema.parse(body);
   console.log({formData});
   return { formData, errors: null}
 } catch (error) {
    console.log({error})
    return {formData: body, errors: error.issues.reduce((acc, curr) => {
      const key = curr.path[0];
      acc[key]  = curr.message;
      return acc;
    }, {})};
 }
}