import React,{useRef} from 'react'
import {useRouter}  from 'next/router'
import { MongoClient, ObjectId } from "mongodb";
import { toast } from "react-toastify";




function InvoiceDetails(props) {
  const router =  useRouter();
  const {data} =  props
  const modalRef = useRef(null);
  const goBack = ()=> router.push('/')

  // send email....
 


  const updateStatus = async (invoiceid) => {
    const res = await fetch(`/api/invoices/${invoiceid}`, {
      method: "PUT",
    });
    const data = await res.json();
  };

  const deleteInvoice = async (invoiceid) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceid}`, {
        method: "DELETE",
      });

      const data = await res.json();
      toast.success(data.message);
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
   <div className="main__container">
    <div className="back__btn">
      <h5 onClick={goBack}>Back</h5>
    </div>

    <div className='invoice__details-header'>
      <div className='details__status'>
        <p>Status</p>
        <button 
            className={`${
              data.status === "paid"
                ? "paid__status"
                : data.status === "pending"
                ? "pending__status"
                : "draft__status"
            }`}
          >{data.status}</button>
      </div>
      <div className='details__btns'>
          {/* <button className='edit__btn' onClick={()=>router.push(`/edit/${data.id}`)}>Edit</button> */}

          <button className='delete__btn' onClick={()=>deleteInvoice(data.id)}>Delete</button>

          <button
            onClick={() => updateStatus(data.id)}
            className={`${
              data.status === "paid" || data.status === "draft" ? "disable" : ""
            }  mark__as-btn`}
          >
            Paid
          </button>
      </div>
    </div>
    <div className='invoice__details'>
      <div className='details__box'>
        <div>
          <h4>{data.id.substr(0,6).toUpperCase()}</h4>
          <p>{data.description}</p>
        </div>
        <div>
          <p>Send to:</p>
          <h5>{data.clientEmail}</h5>
        </div>

        <div>
          <h5>From:</h5>
          <p>{data.senderAddress.street}</p>
          <p>{data.senderAddress.city}</p>
          <p>{data.senderAddress.state} {data.senderAddress.pin}</p>
        </div>

      </div>
      <div className='details__box'>
        <div>
          <div className='invoice__created-date'>
            <p>Date created</p>
            <h4>{data.createdAt}</h4>
          </div>
          <div>
            <p className='invoice__payment'>Payment due date</p>
            <h4>{data.paymentDue}</h4>
          </div>
        </div>
        
          
        <div className='invoice__client_details'>
          <div>
              <h5>To:</h5>
              <p>{data.clientName}</p>
              <p>{data.clientAddress.street}</p>
              <p>{data.clientAddress.city}</p>
              <p>{data.clientAddress.state}</p>
          </div>
        </div>

      </div>
      <div className='invoice__item-box'>
      <ul className='list'>
        <li className='list__item'>
          <p className='item__name-box'>Item name</p>
          <p className='list__item-box'>Qty</p>
          <p className='list__item-box'>Rate</p>
          <p className='list__item-box'>Total Amount</p>
        </li>
        {data.items?.map((item,index)=>(
          <li className='list__item' key={index}>
          <div className='item__name-box'>
            <h5>{item.name}</h5>
          </div>
          <div className="list__item-box"><p>{item.quantity}</p></div>
          <div className="list__item-box"><p>Rs. {item.price}</p></div>
          <div className='list__item-box'><h5>Rs. {item.total}</h5></div>
        </li>
        ))}

       
      </ul>
    </div>
      <div className='grand__total'>
        <h5>Total Amount:</h5>
        <h2>Rs. {data.total}</h2>
        
      </div>
    </div>


    
   </div>
  )
}

export default InvoiceDetails

export async function getStaticPaths(){
  const client = await MongoClient.connect('mongodb+srv://bhavana02:TGbliwq0x6kOgKho@cluster0.vbja6qm.mongodb.net/invoices?retryWrites=true&w=majority', { useNewUrlParser: true })
  const db = client.db();
  const collection = db.collection("allInvoices");

  const invoices = await collection.find({}, { _id: 1 }).toArray();

  return {
    fallback: "blocking",
    paths: invoices.map((invoice) => ({
      params: {
        invoiceid: invoice._id.toString(),
      },
    })),
  };
}

export async function getStaticProps(context){
  const {invoiceid} =  context.params
  const client = await MongoClient.connect('mongodb+srv://bhavana02:TGbliwq0x6kOgKho@cluster0.vbja6qm.mongodb.net/invoices?retryWrites=true&w=majority', { useNewUrlParser: true })
  const db = client.db();
  const collection = db.collection("allInvoices");
  const invoice = await collection.findOne({ _id: ObjectId(invoiceid) });

  return {
    props: {
      data: {
        id: invoice._id.toString(),
        senderAddress: invoice.senderAddress,
        clientAddress: invoice.clientAddress,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        description: invoice.description,
        createdAt: invoice.createdAt,
        paymentDue: invoice.paymentDue,
        items: invoice.items,
        total: invoice.total,
        status: invoice.status,
      },
    },
    revalidate: 1,
  };
}