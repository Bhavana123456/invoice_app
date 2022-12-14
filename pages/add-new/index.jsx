import React,{useState,useRef} from 'react'
import {useRouter} from 'next/router'
import { toast } from "react-toastify";

function AddNew() {
    const router = useRouter();
    const [items,setItems] = useState([])

    const senderStreet =  useRef("")
    const senderCity =  useRef("")
    const senderPin =  useRef("")
    const senderState =  useRef("")
    const clientName=  useRef("")
    const clientEmail =  useRef("")
    const clientStreet = useRef("")
    const clientCity =  useRef("")
    const clientPostalCode =  useRef("");
    const clientState =  useRef("")
    const description =  useRef("")
    const createdAt =  useRef("")
    const pay = useRef("")


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
    const totalAmount =  items.reduce((action,current)=>action+current.total,0);

    const addItem =()=>{
        setItems([...items,{name:'', quantity: 0, price: 0, total: 0}])
        console.log(items)
    }
    
    const createInvoice =  async (status)=>{
        try{
            const res = await fetch('/api/add-new',{
                method : 'POST',
                headers:{
                    'Content-Type'  : 'application/json'
                },
                body : JSON.stringify({
                    senderAddress : senderStreet.current.value,
                    senderCity : senderCity.current.value,
                    senderPostalCode : senderPin.current.value,
                    senderState : senderState.current.value,
                    clientName : clientName.current.value,
                    clientEmail : clientEmail.current.value,
                    clientAddress : clientStreet.current.value,
                    clientCity : clientCity.current.value,
                    clientPostalCode : clientPostalCode.current.value,
                    clientState : clientState.current.value,
                    description:description.current.value,
                    createdAt : createdAt.current.value,
                    paymentDue : createdAt.current.value,
                    paymentTerms : pay.current.value,
                    status : status,
                    items : items,
                    total : totalAmount
                })
              
            })
            const data = await res.json()
            console.log(data)
            router.push('/')
            toast.success(data.message)
        }catch(error)
        {
            // alert(data.message)
            toast.error('something went wrong')
        }
    }
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
                        <input type="text" name="firstname" id="" ref={senderStreet}/>
                    </div>
                    <div className="form__group inline__form-group">
                        <div>
                            <p>City</p>
                            <input type = 'text'ref={senderCity}/>
                        </div>

                        <div>
                            <p>Pin-code</p>
                            <input type = 'text' ref={senderPin}/>
                        </div>

                        <div>
                            <p>State</p>
                            <input type = 'text' ref={senderState}/>
                        </div>
                    </div>
                </div>

                {/* bill-to */}
                <div className="bill__to">
                    <p className="bill__title">Bill to:</p>
                    <div className="form__group">
                        <p>Name</p>
                        <input type="text" name="" id=""  ref={clientName}/>
                    </div>
                    
                    <div className="form__group">
                        <p>Email</p>
                        <input type="email" name="" id="" ref={clientEmail}/>
                    </div>

                    <div className="form__group">
                        <p>Lane</p>
                        <input type="text" name="" id="" ref={clientStreet}/>
                    </div>

                    <div className="form__group inline__form-group">
                        <div>
                            <p>City</p>
                            <input type = 'text' ref={clientCity}/>
                        </div>

                        <div>
                            <p>Pin-code</p>
                            <input type = 'text' ref={clientPostalCode}/>
                        </div>

                        <div>
                            <p>State</p>
                            <input type = 'text' ref={clientState}/>
                        </div>
                    </div>

                    <div className="form__group inline__form-group">
                        <div className='inline__group'>
                            <p>Date</p>
                            <input type = 'date' ref={createdAt}/>
                        </div>

                        <div className='inline__group'>
                            <p>Payment</p>
                            <input type = 'text' ref={pay}/>
                        </div>
                    </div>

                    <div className="form__group">
                        <p>Description/Notes</p>
                        <input type="text" name="" id="" ref={description} />
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
                <div className="new__invoice__btns">
                    <button className="edit__btn" onClick={()=>router.push('/')}>Discard</button>
                    <div>
                        <button className="draft__btn" onClick={()=> createInvoice('draft')}>Save</button>
                        <button className="mark__as-btn" onClick={()=> createInvoice('pending')}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddNew