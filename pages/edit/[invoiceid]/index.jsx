import React,{useState,useEffect} from 'react'
import {useRouter} from 'next/router'
import { MongoClient,ObjectId } from 'mongodb';

function Edit(props) {
    const invoice =  props.data
    const router = useRouter();
    const [items,setItems] = useState([])
    
    const [senderStreet, setSenderStreet] = useState("");
    const [senderCity, setSenderCity] = useState("");
    const [senderPin, setSenderPostalCode] = useState("");
    const [senderState, setSenderCountry] = useState("");
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientStreet, setClientStreet] = useState("");
    const [clientCity, setClientCity] = useState("");
    const [clientPostalCode, setClientPostalCode] = useState("");
    const [clientState, setClientCountry] = useState("");
    const [description, setDescription] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [paymentTerms, setPaymentTerms] = useState("");

    
    //add items
    const handler = (e,i)=>{
        const{name,value} = e.target
        const list = [...items]
        list[i][name] = value
        list[i]["total"] =  list[i]['quantity'] * list[i]['price']
        setItems(list)
    }
//delete
    const deleteItem =(i)=>{
        const data =  [...items]
        data.splice(i,1);
        setItems(data)

    }
// calculate the total items
    const totalAmount =  items.reduce((action,current)=>action+current.total,0);
    const addItem =()=>{
        setItems([...items,{name:'', quantity: 0, price: 0, total: 0}])
        console.log(items)
    }

    const updateInvoice = async (invoiceid, status) => {
        try {
          const res = await fetch(`/api/edit/${invoiceid}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              senderStreet: senderStreet,
              senderCity: senderCity,
              senderPostalCode: senderPostalCode,
              senderCountry: senderCountry,
              clientName: clientName,
              clientEmail: clientEmail,
              clientStreet: clientStreet,
              clientCity: clientCity,
              clientPostalCode: clientPostalCode,
              clientCountry: clientCountry,
              description: description,
              createdAt: createdAt,
              paymentDue: createdAt,
              paymentTerms: paymentTerms,
              status: status,
              items: items,
              total: totalAmount,
            }),
          });
    
          const data = await res.json();
    
          router.push(`/invoice/${invoiceid}`);
          toast.success(data.message);
        } catch (error) {
          toast.error("Something went wrong!");
        }
      };
    
      // set default input data
      useEffect(() => {
        setSenderCity(invoice.senderAddress.city);
        setSenderStreet(invoice.senderAddress.street);
        setSenderPostalCode(invoice.senderAddress.pin);
        setSenderCountry(invoice.senderAddress.state);
    
        setClientCity(invoice.clientAddress.city);
        setClientStreet(invoice.clientAddress.street);
        setClientPostalCode(invoice.clientAddress.postalCode);
        setClientCountry(invoice.clientAddress.state);
    
        setClientName(invoice.clientName);
        setClientEmail(invoice.clientEmail);
        setDescription(invoice.description);
        setCreatedAt(invoice.createdAt);
        setPaymentTerms(invoice.payment);
      }, [invoice]);
    
  return (
    <div className="main__container">
        <div className="new__invoice">
            <div className="new__invoice-header">
                <h3>New Invoice</h3>
            </div>
            <div className="new__invoice-body">
                <div className="bill__from">
                    <p className="bill__title">Bill from:</p>
                    <div className="form__group">
                        <p>Lane</p>
                        <input type="text" name="" id="" />
                    </div>
                    <div className="form__group inline__form-group">
                        <div>
                            <p>City</p>
                            <input type = 'text' />
                        </div>

                        <div>
                            <p>Pin-code</p>
                            <input type = 'text' />
                        </div>

                        <div>
                            <p>State</p>
                            <input type = 'text' />
                        </div>
                    </div>
                </div>

                {/* bill-to */}
                <div className="bill__to">
                    <p className="bill__title">Bill to:</p>
                    <div className="form__group">
                        <p>Name</p>
                        <input type="text" name="" id="" />
                    </div>
                    
                    <div className="form__group">
                        <p>Email</p>
                        <input type="email" name="" id="" />
                    </div>

                    <div className="form__group">
                        <p>Lane</p>
                        <input type="text" name="" id="" />
                    </div>

                    <div className="form__group inline__form-group">
                        <div>
                            <p>City</p>
                            <input type = 'text' />
                        </div>

                        <div>
                            <p>Pin-code</p>
                            <input type = 'text' />
                        </div>

                        <div>
                            <p>State</p>
                            <input type = 'text' />
                        </div>
                    </div>

                    <div className="form__group inline__form-group">
                        <div className='inline__group'>
                            <p>Date</p>
                            <input type = 'date' />
                        </div>

                        <div className='inline__group'>
                            <p>Payment</p>
                            <input type = 'text' />
                        </div>
                    </div>

                    <div className="form__group">
                        <p>Description/Notes</p>
                        <input type="text" name="" id=""/>
                    </div>

                </div>

                {/* items */}
                <div className="invoice__items">
                    <h3>List</h3>
                  {items?.map((item,i)=>(
                      <div className="item" key={i}>
                      <div className="form__group inline__form-group">
                          <div>
                              <p>Item Name</p>
                              <input type="text" name="name" id="" onChange={(e)=>handler(e , i)}/>
                          </div>

                          <div>
                              <p>Quantity</p>
                              <input type="number" name="quantity" id="" onChange={(e)=>handler(e , i)} />
                          </div>

                          <div>
                              <p>price</p>
                              <input type="number" name="price" id="" onChange={(e)=>handler(e , i)}/>
                          </div>

                          <div>
                              <p>Total</p>
                              <h4>{item.total}</h4>
                          </div>
                              <button className="edit__btn" onClick={deleteItem}>Delete</button>
                      </div>
                  </div>
                  ))}
                </div>
                <button className="add__item-btn" onClick={addItem}>Add Item</button>
                <div className="new__invoice__btns" style={{'justifyContent':'end'}}>
                    {/* <button className="edit__btn" onClick={()=>router.push('/')}>Discard</button> */}
                    <div>
                        <button className="draft__btn" onClick={()=>router.push(`/invoices/${invoice.id}`)}>Save Change</button>
                        <button className="mark__as-btn"  onClick={() => updateInvoice(invoice.id, invoice.status)}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Edit
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