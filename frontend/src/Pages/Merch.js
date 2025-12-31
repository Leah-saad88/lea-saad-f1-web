import { Assets } from "../Assets/assets";
import "../Assets/merch.css";
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../Assets/main.css";

const Merch = () => {
  const { addToCart } = useContext(CartContext);

  const MerchData = [
    {
      id: 1,
      name: "Lando norris shirt",
      desc: "Team's shirt available in all sizes",
      img: Assets.l4,
      price: 55,
    },
    {
      id: 2,
      name: "Lewis hamilton Male large",
      desc: "Male larger/x large",
      img: Assets.l44,
      price: 45,
    },
    {
      id: 3,
      name: "redbull",
      desc: "Team's shirt available in all sizes",
      img: Assets.redbulz,
      price: 55,
    },
    {
      id: 4,
      name: "charles leclerc merch large M/L",
      img: Assets.lc,
      price: 45,
    },
    {
      id: 5,
      name: "Mercedez merch",
      desc: "Team's shirt available in all sizes",
      img: Assets.mm2,
      price: 51,
    },
    {
      id: 6,
      name: "Ferrari hat",
      desc: "adjustable to any size",
      img: Assets.Ferrar,
      price: 49,
    },
    {
      id: 7,
      name: "Mercadez merch ",
      desc: " White color ,Team's shirt available in all sizes",
      img: Assets.mercc,
      price: 61,
    },
    {
      id: 8,
      name: "aston martin merch",
      desc: "Alonso's Team shirt available in all sizes",
      img: Assets.astonn,
      price: 55,
    },
    {
      id: 9,
      name: "key chain",
      desc: "All teams available choose your likings",
      img: Assets.key,
      price: 21,
    },
    {
      id: 11,
      name: "Ferrari merch",
      desc: "Team's shirt available in all sizes",
      img: Assets.fer,
      price: 55,
    },
    {
      id: 12,
      name: "carlos sainz ",
      desc: "Available in Large and Medium sizes",
      img: Assets.cs,
      price: 55,
    },
  ];
 
  const handleAdd = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="card-container merch-cards">
      {MerchData.map((value) => (
        <div className="card merch-card" key={value.id}>
          <img src={value.img} alt={value.name} />
          <h5>{value.name}</h5>
          <p>{value.desc}</p>
           <p>${value.price}</p>
          <button onClick={() => handleAdd(value)} className="buy-btn">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};
export default Merch;
