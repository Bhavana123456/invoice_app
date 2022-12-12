import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import {useRouter} from 'next/router'
export default function Home() {

  const router = useRouter();
  const NavigatePage = ()=> router.push('/add-new')
  return (
   <div className='main__container'>
    <div className='invoice__header'>
      <div className='invoice__header-logo'>
        <h3>Invoice</h3>
        <p>There are total 7 invoices</p>
      </div>   
      <button className='btn' onClick={NavigatePage}>Add Invoice</button> 
      </div>
      <div className='invoice__cointainer'>
        <Link href={`/invoices/id`} passRef>
        <div className='invoice__item'>
        <div>
          <h5 className='invoice__id'>RT59F0</h5>
        </div>
        <div>
          <h5 className='invoice__client'>Bhavana</h5>
        </div>
        <div>
          <p className='invoice__created'>29-07-2022</p>
        </div>

        <div>
          <p className='invoice__total'>567</p>
        </div>
        <div>
         <button className='pending__status'>
          pending
         </button>
        </div>
      </div>
        </Link>
        
   </div>
   </div>

  )
}
