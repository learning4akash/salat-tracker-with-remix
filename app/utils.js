

export async function validationAction({request, schema}) {
 const body     = Object.fromEntries(await request.formData());
 try {
   const formData = schema.parse(body);
   return { formData, errors: null}
 } catch (e) {
    console.error(e);
    return {formData: body, errors: {}}
 }
}