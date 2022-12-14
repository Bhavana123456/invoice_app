import { MongoClient } from "mongodb";

async function handler(req,res){
    const client = await MongoClient.connect('mongodb+srv://bhavana02:TGbliwq0x6kOgKho@cluster0.vbja6qm.mongodb.net/invoices?retryWrites=true&w=majority', { useNewUrlParser: true })
    if(req.method === 'POST')
    {
        const invoice  = {
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
        const db = client.db();
        const collection =  db.collection('allInvoices')
       await collection.insertOne(invoice)
        res.status(200).json({message: 'Invoice added successfully'})
        client.close()
    }




}       
export default handler;