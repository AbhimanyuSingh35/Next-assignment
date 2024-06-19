// By adding the 'user server', you mark all the exported functions within the file as a server functions. These server functions can then be imported into client and server components, making them extremely versatile
'use server'
 
import {z} from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import {redirect} from 'next/navigation'


const FormSchema = z.object({
  id:z.string(),
  customerId: z.string(),
  amount:z.coerce.number(),
  //amount field is specifically set to coerce(change) from a string to a number while also validating its type 

  status: z.enum(['pending','paid']),
  date: z.string(),

});

 const CreateInvoice = FormSchema.omit({id:true,date:true});

export async function createInvoice(formData:FormData){
      const { customerId, amount, status}= CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      })
      const amountInCents = amount * 100;
      const date = new Date().toISOString().split('T')[0];
       
      try{
      await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
      } catch(error){
        return {
          message: 'Database Error: Failed to Create Invoice',
        };
      }
      revalidatePath('/dashboard/invoices');
      //this revalidate path is to clear the client side router cache 
      redirect('/dashboard/invoices');

  };
  
  //if there are  many entries in the form then we can use 
  // const rawFormData = Object.fromEntries(formData.entries())

const UpdateInvoice = FormSchema.omit({id: true, date: true});

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
  try {
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  }catch(error){
    return {
      message:'Database Error: Failed to Update Invoice. '
    }
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {

  try{
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
  return { message : 'Deleted Invoice'}
  }catch(error){
    return{
      message:'Database Error: Failed to delete invoice '
    }
  }
  revalidatePath('/dashboard/invoices');
}



