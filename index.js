const express =  require("express")
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const nodemailer = require("nodemailer");
const Razorpay = require('razorpay');
const cors =  require("cors")
const request = require("request")
// const RouterOne = require("./Modues/Router")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.DB)
.then(()=>{
    console.log("Database is connected");
})
.catch(()=>{
    console.log("Database is Not connected");
})

// app.use("/api" , RouterOne)

const OrderSchema = mongoose.Schema({
  isPaid: Boolean,
  amount: Number,
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
  },
  email: String,
  cake : {},
  phone : String,
  region :  String,
  name : String,
  address :String,
  delivery : String,
  startDate : String,
  apartment: String,
  company :  String,
  message : String,
  totalPrice :String,
  quantity : {},
  second : String,
  third : String,
  four : String,
  five: String

});
const Order = mongoose.model('Order', OrderSchema);


const OrderSchemaRoom = mongoose.Schema({
  id1 : Number,
  verity:String,
  cakename : String,
  sizedisplay : String,
  choco : String,
  price : Number,
  image : String,
  path : String,
  quantity: Number,
  describtion : String,
  Flovours : [],
  size:[]
});
const OrderConRoomList = mongoose.model('cakeDetails', OrderSchemaRoom);

app.get('/get-razorpay-key', (req, res) => {
  res.send({ key: process.env.RAZORPAY_KEY_ID });
});

app.post('/create-order', async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const options = {
      amount: req.body.amount,
      currency: 'INR',
    };
    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send('Some error occured');
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/pay-order', async (req, res) => {
  try {
    const { amount, email,cake,phone, region, name,address,delivery,startDate, apartment,company, message,totalPrice , quantity,second,third,four,five, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
      req.body;
    const newOrder = Order({
      isPaid: true,
      amount: amount,
      razorpay: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      },
      email : email,
      cake : cake,
      phone : phone,
      region : region,
      name :name,
      address :address,
      delivery : delivery,
      startDate :startDate,
      apartment: apartment,
      company : company,
      message :message,
      totalPrice :totalPrice,
      quantity:quantity,
      second : second,
      third:third,
      four:four,
      five : five

    });

    await newOrder.save();
    console.log(email)
    res.send({
      msg: 'Payment was successfull'
      
    });


  


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
      }
  });
  const mailOptions = {
      from: process.env.EMAIL,
      to: email ,  
      subject: "Conformation",
      html: `
      <div style="display: flex; justify-content: center; width: 100%; height: 100vh;">
      <div>
        <div style="display: flex; justify-content: center;">
            <img src="https://i.postimg.cc/50ZG7KZz/Moppp.png" style="width:100%; height: 50%;" />
        </div>

        <div style="display: flex; justify-content:center;">
          <div style="width: 100%; background-color: black; color: white;">
          <div style="text-align: center;">
            <h2>Your order is on the way!</h2>
            <h4>Your order shipped</h4>
          </div>
            <div style="display: flex; justify-content: center; " >
            <div >
            <p><span style="color: #BA983C;">Cake</span> : ${cake}</p>

            <p><span style="color: #BA983C;">Phone</span> : ${phone}</p>
  
            <p><span style="color: #BA983C;">Region</span> : ${region}</p>

            <p><span style="color: #BA983C;">Name</span> : ${name}</p>

            <p><span style="color: #BA983C;">Address</span> : ${address}</p>

            <p><span style="color: #BA983C;">Delivery</span> : ${delivery}</p>

            <p><span style="color: #BA983C;">StartDate</span> : ${startDate}</p>

            <p><span style="color: #BA983C;">Apartment</span> : ${apartment}</p>

        </div>
            <div>
            <p><span style="color: #BA983C;">Company</span> : ${company}</p>

            <p><span style="color: #BA983C;">Message</span> : ${message}</p>

            <p><span style="color: #BA983C;">Amount</span> : ${totalPrice}</p>

            <p><span style="color: #BA983C;">Quantity</span> : ${quantity}</p>

            <p><span style="color: #BA983C;">FROSTING</span> : ${second}</p>

            <p><span style="color: #BA983C;">FROSTING</span> : ${third}</p>

            <p><span style="color: #BA983C;">SIZE</span> : ${four}</p>
<br />
        </div>
        </div>
        </div>
        </div>
        </div>
      </div>
</div>

  
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log("Error" + error)
      } else {
          console.log("Email sent:" + info.response);
          res.status(201).json({status:201,info})
      }

  })


  const transporterS = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
const mailOptionsS = {
    from: process.env.EMAIL,
    to: "nagaraj02022000@gmail.com" ,  
    subject: "Conformation",
    html: `
    <div style="display: flex; justify-content: center; width: 100%; height: 100vh;">
    <div>
      <div style="display: flex; justify-content: center;">
          <img src="https://i.postimg.cc/50ZG7KZz/Moppp.png" style="width:100%; height: 50%;" />
      </div>

      <div style="display: flex; justify-content:center;">
        <div style="width: 100%; background-color: black; color: white;">
        <div style="text-align: center;">
          <h2>Your order is on the way!</h2>
          <h4>Your order shipped</h4>
        </div>
          <div style="display: flex; justify-content: center; " >
          <div >
          <p><span style="color: #BA983C;">Cake</span> : ${cake}</p>

          <p><span style="color: #BA983C;">Phone</span> : ${phone}</p>

          <p><span style="color: #BA983C;">Region</span> : ${region}</p>

          <p><span style="color: #BA983C;">Name</span> : ${name}</p>

          <p><span style="color: #BA983C;">Address</span> : ${address}</p>

          <p><span style="color: #BA983C;">Delivery</span> : ${delivery}</p>

          <p><span style="color: #BA983C;">StartDate</span> : ${startDate}</p>

          <p><span style="color: #BA983C;">Apartment</span> : ${apartment}</p>

      </div>
          <div>
          <p><span style="color: #BA983C;">Company</span> : ${company}</p>

          <p><span style="color: #BA983C;">Message</span> : ${message}</p>

          <p><span style="color: #BA983C;">Amount</span> : ${totalPrice}</p>

          <p><span style="color: #BA983C;">Quantity</span> : ${quantity}</p>

          <p><span style="color: #BA983C;">FROSTING</span> : ${second}</p>

          <p><span style="color: #BA983C;">FROSTING</span> : ${third}</p>

          <p><span style="color: #BA983C;">SIZE</span> : ${four}</p>
<br />
      </div>
      </div>
      </div>
      </div>
      </div>
    </div>
</div>


  `
};

transporterS.sendMail(mailOptionsS, (error, info) => {
    if (error) {
        console.log("Error" + error)
    } else {
        console.log("Email sent:" + info.response);
        res.status(201).json({status:201,info})
    }

})


  

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
    
  }
});

app.get('/list-orders', async (req, res) => {
  const orders = await Order.find();
  res.send(orders);
});


app.post('/Cake_List', async (req, res) => {
  const Contact = new OrderConRoomList({
    ...req.body
})
 const datas =  await Contact.save()

  res.json(datas)
});
  
app.get('/Cake_list', async (req, res) => {
  const orders = await OrderConRoomList.find();
  res.json(orders);
});


app.listen(process.env.PORT , ()=>{
  console.log("PORT Number : " , process.env.PORT);
})
