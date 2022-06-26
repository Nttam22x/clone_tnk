import styles from "../../styles/Modal.module.css";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../redux/orderSlice";
import Noty from "noty";
import { removeCart } from "../../redux/cartSlice";
import Banking from "../Banking";
import {makeid} from '../../function/utils'


const Modal = ({auth, setDisplayModal, displayModal, cartItems }) => {
  const [phone, setPhone] = useState(null)
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [openBanking, setOpenBanking] = useState(false)
  const dispatch = useDispatch()

  const codeOrder = useMemo(() => makeid(5), [])
  const {userInfo} = useSelector((state) => state.auth)
  const data = {
    userId: userInfo?.user?.id,
    items: [...cartItems],
    phone: phone,
    address: `${address}`,
    paymentType: paymentMethod,
    code: openBanking ? codeOrder : ''
  }

  const handleOrder = (e) => {
    e.preventDefault()
    if(!auth) {
      new Noty({
        type: "error",
        timeout: 1500,
        text: "Vui lòng đăng nhập để tiếp tục",
        progressBar: true,
      }).show()
      return
    } else {
      if(!phone || !address || !paymentMethod) {
        new Noty({
          type: "error",
          timeout: 1500,
          text: "Không được bỏ trống mục nào",
          progressBar: true,
        }).show()
        return
      } else {
          dispatch(createOrder(data))
          dispatch(removeCart())
          setAddress('')
          setPhone('')
          setPaymentMethod(null)
          new Noty({
            type: "success",
            timeout: 1500,
            text: "Bạn đã đặt hàng thành công",
            progressBar: true,
          }).show()
           return
      } 
     
    }   
  }


 

  useEffect(() => {
    if(paymentMethod === 'banking') {
      setOpenBanking(true)
      return
    }
    setOpenBanking(false)
  }, [paymentMethod])  

  return (
    <div
      className={`${styles.modalContainer} ${
        displayModal ? styles.display : styles.close
      }`}
    >
      <div className={styles.modalContent}>
        <form>
          <div className={styles.box}>
            <label htmlFor="phone">Nhập số điện thoại:</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="number" id="phone" placeholder="SĐT của bạn..." />
          </div>
          <div className={styles.box}>
            <label htmlFor="address">Nhập địa chỉ:</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" id="address" placeholder="Địa chỉ của bạn.." />
          </div>
          <div className={styles.box}>
            <select onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="">Chọn phương thức thanh toán</option>
              <option value="CDO">Trả khi nhận hàng</option>
              <option value="banking">Internet Banking</option>
            </select>
          </div>
          <div className={styles.banking}>
             {openBanking && <Banking code={codeOrder}/>} 
          </div>
          <div className={styles.buttonOrder}>
            <button
              onClick={handleOrder}
             type="submit">Xác nhận</button>
            <button onClick={(e) => {
              e.preventDefault()
              setDisplayModal(false)
            }}>Đóng</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
