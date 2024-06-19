import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
 
export default async function Page({
  searchParams,
}:{
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchInvoicesPages(query);
  
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

//using this approach you'll updatethe URL , which will send a new request to the server, data wille be fetched on the server,and only the invoices that matchyour query will be returned 

//Important - Searching in next js using search params using server side rendering 

//Debouncing is a programming practice that limits the rate at which function can fire. In our case, you only want to query the database when the user has stopped typing 

//How Debouncing works?
//Trigger Event: When an event that should be debounced (like a keystroke in the search box)occurs, a timer starts 
//Wait: if a new event occurs before the timer expires, the timer is reset 
//Execution: If the timer reaches the end of its countdown, the debounced function is executed 
