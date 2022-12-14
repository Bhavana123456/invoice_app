
import {MongoClient,ObjectId} from 'mongodb'


async function handler(req,res)
{
    const {invoiceid} = req.params
    const client = await MongoClient.connect('mongodb+srv://bhavana02:TGbliwq0x6kOgKho@cluster0.vbja6qm.mongodb.net/invoices?retryWrites=true&w=majority', { useNewUrlParser: true })
    const db = client.db();
    const collection = db.collection('allInvoices')
    if(req.method === 'PUT')
    {
        await collection.updateOne({
            _id:ObjectId(invoiceid)
        },{
            $set:{
                senderAddress :{
                    street: req.body.senderStreet,
                    city : req.body.senderCity,
                    pin : req.body.senderPin,
                    state : req.body.senderState
                },
                clientName : req.body.clientName,
                clientEmail : req.body.clientEmail,
                clientAddress :{
                    street: req.body.clientStreet,
                    city : req.body.clientCity,
                    pin : req.body.clientPostalCode,
                    state : req.body.clientState
                },
                createdAt : req.body.createdAt,
                paymentDue : req.body.createdAt,
                payment : req.body.pay,
                description : req.body.description,
                status : req.body.status,
                items : req.body.items,
                total : req.body.total,
    
            }
        });
        res.status(200).json({message:'The data has been updated successfully'})
    }
    client.close();

}
export default handler

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