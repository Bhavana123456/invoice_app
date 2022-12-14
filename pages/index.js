import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import {useRouter} from 'next/router'
import { MongoClient } from 'mongodb'
export default function Home(props) {

  const router = useRouter();
const {data} = props

  const NavigatePage = ()=> router.push('/add-new')
  return (
   <div className='main__container'>
    <div className='invoice__header'>
      <div className='invoice__header-logo'>
        <h3>Invoice</h3>
        {/* <p>There are total {data?.length} invoices</p> */}
      </div>   
      <button className='btn' onClick={NavigatePage}>Add Invoice</button> 
      </div>
      <div className='invoice__cointainer'>
       {
        data?.map(invoice=>(
          <Link href={`/invoices/${invoice.id}`} passRef key={invoice.id}>
        <div className='invoice__item'>
        <div>
          <h5 className='invoice__id'>{invoice.id.substr(0,6).toUpperCase()}</h5>
        </div>
        <div>
          <h5 className='invoice__client'>{invoice.clientName}</h5>
        </div>
        <div>
          <p className='invoice__created'>{invoice.createdAt}</p>
        </div>

        <div>
          <h4 className='invoice__total'>Rs.{invoice.total}</h4>
        </div>
        <div>
         <button className={`${
                    invoice.status === "paid"
                      ? "paid__status"
                      : invoice.status === "pending"
                      ? "pending__status"
                      : "draft__status"
                  }`}>
          {invoice.status}
         </button>
        </div>
      </div>
        </Link>
        ))
       } 
        
   </div>
   </div>

  )
}
export async function getStaticProps(){
  const client = await MongoClient.connect('mongodb+srv://bhavana02:TGbliwq0x6kOgKho@cluster0.vbja6qm.mongodb.net/invoices?retryWrites=true&w=majority', { useNewUrlParser: true })
  const db =  client.db()
  const collection = db.collection('allInvoices')
  const invoices = await collection.find({}).toArray();

  return {
    props: {
      data: invoices.map((invoice) => {
        return {
          id: invoice._id.toString(),
          clientName: invoice.clientName,
          createdAt: invoice.createdAt,
          total: invoice.total,
          status: invoice.status,
        };
      }),
    },
    revalidate: 1,
  };
}