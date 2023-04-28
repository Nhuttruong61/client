import React, { useEffect, useRef, useState } from "react";
import TypeProduct from "../../component/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import slider1 from "../../assets/images/slider1.jpg";
import slider2 from "../../assets/images/slider2.png";
import slider3 from "../../assets/images/slider3.jpg";
import CardComponet from "../../component/CardComponet/CardComponet";
import SliderComponent from "../../component/SliderComponet/SliderComponet";
import { useQuery } from "react-query";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import Loading from "../../component/LoadingComponet/LoadingComponet";
import { useDebounce } from "../../hooks/useDebounce";
const HomePage = () => {
  const searchProduct = useSelector((state) => state.product.search);
  const [loading, setLoading] = useState(false);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [limit, setLimit] = useState(6);
  const arr = ["Nam", "Nu"];
  const fetchProductAll = async (context) => {
    console.log("context", context);
    const limit = context && context.queryKey && context && context.queryKey[1];
    const search =
      context && context.queryKey && context && context.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  const {
    isLoading,
    data: products,
    isPreviousData,
  } = useQuery(["products", limit, searchDebounce], fetchProductAll, {
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  console.log("isPreviousData", products);
  return (
    <Loading isLoading={isLoading || loading}>
      <div style={{ width: "1270px", margin: "0 auto" }}>
        <WrapperTypeProduct>
          {arr.map((item) => {
            return <TypeProduct name={item} key={item} />;
          })}
        </WrapperTypeProduct>
      </div>
      <div
        className="body"
        style={{ width: "100%", backgroundColor: "#efefef" }}
      >
        <div
          id="container"
          style={{ height: "1000px", width: "1270px", margin: "0 auto" }}
        >
          <SliderComponent arrImages={[slider1, slider2, slider3]} />
          <WrapperProducts>
            {products &&
              products.data &&
              products.data.map(function (product) {
                return (
                  <CardComponet
                    key={product._id}
                    countInStock={product.countInStock}
                    description={product.description}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    selled={product.selled}
                    discount={product.discount}
                  />
                );
              })}
          </WrapperProducts>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <WrapperButtonMore
            textbutton={isPreviousData ? 'Load more' : "Xem thêm"} type="outline" 
              styleButton={{
                border: "1px solid rgb(11, 116, 229)",
                color: "rgb(11, 116, 229)",
                width: "240px",
                height: "38px",
                borderRadius: "4px",
              }}
              disabled={products && products.total === (products.data && products.data.length) || products && products.totalPage ===1}
              styleTextButton={{ fontWeight: 500 }}
              onClick={() => setLimit((prev) => prev + 6)}
            />
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default HomePage;
